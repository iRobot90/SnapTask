// @Fleetbo ModuleName: Camera

import UIKit
import AVFoundation

// Native Camera Implementation (iOS View)
// This is a programmatic UI definition for the native layer.

class CameraModule: UIView {
    private var captureSession: AVCaptureSession?
    private var previewLayer: AVCaptureVideoPreviewLayer?
    private var photoOutput: AVCapturePhotoOutput?
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupCamera()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupCamera()
    }
    
    private func setupCamera() {
        backgroundColor = UIColor.black
        
        captureSession = AVCaptureSession()
        guard let captureSession = captureSession else { return }
        
        captureSession.sessionPreset = .photo
        
        guard let captureDevice = AVCaptureDevice.default(for: .video) else { return }
        
        do {
            let input = try AVCaptureDeviceInput(device: captureDevice)
            
            if captureSession.canAddInput(input) {
                captureSession.addInput(input)
            }
            
            photoOutput = AVCapturePhotoOutput()
            if let photoOutput = photoOutput, captureSession.canAddOutput(photoOutput) {
                captureSession.addOutput(photoOutput)
            }
            
            previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
            previewLayer?.frame = bounds
            previewLayer?.videoGravity = .resizeAspectFill
            layer.addSublayer(previewLayer!)
            
            DispatchQueue.global(qos: .userInitiated).async {
                captureSession.startRunning()
            }
            
        } catch {
            print("Camera setup error: \(error)")
        }
    }
    
    func capturePhoto() {
        guard let photoOutput = photoOutput else { return }
        
        let settings = AVCapturePhotoSettings()
        photoOutput.capturePhoto(with: settings, delegate: self)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        previewLayer?.frame = bounds
    }
}

extension CameraModule: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if let error = error {
            print("Photo capture error: \(error)")
            return
        }
        
        guard let imageData = photo.fileDataRepresentation() else { return }
        let image = UIImage(data: imageData)
        
        // Save to temp location and return URI
        if let image = image {
            // Convert to base64 or save to temp file
            let tempDir = NSTemporaryDirectory()
            let fileName = "camera_capture_\(Date().timeIntervalSince1970).jpg"
            let filePath = tempDir + fileName
            
            if let jpegData = image.jpegData(compressionQuality: 0.8) {
                try? jpegData.write(to: URL(fileURLWithPath: filePath))
                
                // Send URI back to JavaScript
                DispatchQueue.main.async {
                    if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                       let window = windowScene.windows.first {
                        let webView = window.subviews.first(where: { $0.isKind(of: WKWebView.self) }) as? WKWebView
                        webView?.evaluateJavaScript("window.cameraModule && window.cameraModule.onPhotoCaptured && window.cameraModule.onPhotoCaptured('file://\(filePath)')")
                    }
                }
            }
        }
    }
}