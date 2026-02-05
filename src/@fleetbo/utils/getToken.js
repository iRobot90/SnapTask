/**
 * Handles fetching the FCM token from Fleetbo and displays it in an alert.
 */
export const handleGetToken = async () => {
    try {
        // Use the Fleetbo API Promise
        const tokenResult = await Fleetbo.getToken();
        alert("Token reçu : " + tokenResult.token);
    } catch (error) {
        alert("Erreur lors de la récupération du token.");
    }
};
