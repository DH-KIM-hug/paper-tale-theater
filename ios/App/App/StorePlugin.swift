import Foundation
import Capacitor
import StoreKit

let unlockAllProductID = "com.papertale.theater.unlockall"

@objc(StorePlugin)
public class StorePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StorePlugin"
    public let jsName = "Store"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getPrice", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isOwned", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise)
    ]

    private var updates: Task<Void, Never>?

    public override func load() {
        updates = Task.detached { [weak self] in
            for await result in Transaction.updates {
                if case .verified(let tx) = result { await tx.finish() }
                self?.notifyListeners("ownedChanged", data: ["owned": await Self.ownsUnlockAll()])
            }
        }
    }

    deinit { updates?.cancel() }

    static func ownsUnlockAll() async -> Bool {
        for await result in Transaction.currentEntitlements {
            if case .verified(let tx) = result, tx.productID == unlockAllProductID, tx.revocationDate == nil { return true }
        }
        return false
    }

    @objc func getPrice(_ call: CAPPluginCall) {
        Task {
            do {
                let products = try await Product.products(for: [unlockAllProductID])
                if let p = products.first { call.resolve(["price": p.displayPrice]) } else { call.resolve([:]) }
            } catch { call.resolve([:]) }
        }
    }

    @objc func isOwned(_ call: CAPPluginCall) {
        Task { call.resolve(["owned": await Self.ownsUnlockAll()]) }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        Task {
            do {
                guard let product = try await Product.products(for: [unlockAllProductID]).first else {
                    call.resolve(["owned": false, "reason": "no-product"]); return
                }
                switch try await product.purchase() {
                case .success(let verification):
                    if case .verified(let tx) = verification {
                        await tx.finish()
                        call.resolve(["owned": true])
                    } else { call.resolve(["owned": false, "reason": "unverified"]) }
                case .userCancelled: call.resolve(["owned": false, "reason": "cancelled"])
                case .pending: call.resolve(["owned": false, "reason": "pending"])
                @unknown default: call.resolve(["owned": false])
                }
            } catch { call.resolve(["owned": false, "reason": "error"]) }
        }
    }

    @objc func restore(_ call: CAPPluginCall) {
        Task {
            try? await AppStore.sync()
            call.resolve(["owned": await Self.ownsUnlockAll()])
        }
    }
}
