import Foundation
import Capacitor
import AVFoundation

/// 잠자리 이어 듣기용 오디오 세션. 플레이어가 재생을 시작할 때 begin, 회차가 끝나거나 멈추면 end.
/// 앱 시작 때 켜 두지 않는다(놀이판은 무음 스위치를 따르고, 다른 앱 음악을 끊지 않는다).
@objc(BedtimeAudioPlugin)
public class BedtimeAudioPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "BedtimeAudioPlugin"
    public let jsName = "BedtimeAudio"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "begin", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "end", returnType: CAPPluginReturnPromise)
    ]

    private var observing = false

    @objc func begin(_ call: CAPPluginCall) {
        do {
            let s = AVAudioSession.sharedInstance()
            try s.setCategory(.playback, mode: .spokenAudio, options: [])
            try s.setActive(true)
            if !observing {
                observing = true
                NotificationCenter.default.addObserver(self, selector: #selector(onInterruption(_:)),
                                                       name: AVAudioSession.interruptionNotification, object: s)
            }
            call.resolve()
        } catch {
            call.reject("오디오 세션을 켜지 못했어요: \(error.localizedDescription)")
        }
    }

    @objc func end(_ call: CAPPluginCall) {
        if observing {
            observing = false
            NotificationCenter.default.removeObserver(self, name: AVAudioSession.interruptionNotification, object: nil)
        }
        do {
            try AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        } catch { /* 이미 꺼져 있거나 쓰는 중이면 무시 */ }
        call.resolve()
    }

    @objc private func onInterruption(_ n: Notification) {
        guard let raw = n.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: raw) else { return }
        if type == .began {
            notifyListeners("interruption", data: ["state": "began"])
        } else {
            var resume = false
            if let o = n.userInfo?[AVAudioSessionInterruptionOptionKey] as? UInt {
                resume = AVAudioSession.InterruptionOptions(rawValue: o).contains(.shouldResume)
            }
            try? AVAudioSession.sharedInstance().setActive(true)
            notifyListeners("interruption", data: ["state": "ended", "shouldResume": resume])
        }
    }
}
