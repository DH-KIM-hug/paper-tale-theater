import UIKit
import Capacitor

class AppViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(StorePlugin())
    }
}
