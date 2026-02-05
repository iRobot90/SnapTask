// @Fleetbo Deploy
// @Fleetbo ModuleName: NativeGallery
// @Fleetbo manifest:Root <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

package com.fleetbo.user.modules

import android.content.Context
import android.content.Intent
import android.provider.MediaStore
import com.fleetbo.sdk.FleetboModule
import android.app.Activity

// =========================================================================================
// 🛑 MODULE NATIF : ACCÈS STOCKAGE RÉEL
// Ce code s'exécute sur le processeur du téléphone (Android Runtime).
// Il ouvre le sélecteur de documents officiel du système.
// =========================================================================================

class NativeGallery(context: Context, communicator: Any) : FleetboModule(context, communicator) {

    // Point d'entrée appelé par Fleetbo.exec('NativeGallery', 'pick', {})
    fun pick(params: String) {
        runOnUi {
            try {
                // On lance l'intent natif Android pour récupérer une image
                val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
                intent.type = "image/*"
                
                // On utilise le helper du SDK Fleetbo pour gérer le callback d'activité
                // Note: startForResult est une méthode native du SDK FleetboModule
                startForResult(intent) { resultCode, data ->
                    if (resultCode == Activity.RESULT_OK && data != null) {
                        val selectedImageUri = data.data
                        // On renvoie l'URI native au JS
                        sendSuccess("GALLERY_RESULT", "{\"url\": \"$selectedImageUri\"}")
                    } else {
                        // Annulation utilisateur
                        sendEvent("GALLERY_CANCEL", "{}")
                    }
                }
            } catch (e: Exception) {
                sendEvent("GALLERY_ERROR", "{\"error\": \"${e.message}\"}")
            }
        }
    }

    // Nettoyage mémoire si nécessaire
    override fun onDetached() {
        super.onDetached()
    }
}