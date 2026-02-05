/**
 * Formats various date structures, including Firestore Timestamps,
 * into a readable English date string.
 * @param {object|string|number} firestoreDate - The date object to format.
 * @returns {string} The formatted date (e.g., "September 15, 2023") or an empty string on error.
 */
export const formatFirestoreDate = (firestoreDate) => {
    try {
        // Case 1: Firestore Timestamp with seconds and nanoseconds
        if (firestoreDate && typeof firestoreDate === 'object' && firestoreDate.seconds) {
            const date = new Date(firestoreDate.seconds * 1000);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return date.toLocaleDateString('en-US', options);
        }

        // Case 2: Firestore Timestamp processed on the Android side (already in milliseconds, often with a _ prefix)
        if (firestoreDate && typeof firestoreDate === 'object' && firestoreDate._seconds) {
            const date = new Date(firestoreDate._seconds * 1000);
            return date.toLocaleDateString('en-US');
        }

        // Case 3: Timestamp with nanoseconds property (alternative structure)
        if (firestoreDate && typeof firestoreDate === 'object' && firestoreDate.nanoseconds !== undefined && firestoreDate.seconds !== undefined) {
            const date = new Date(firestoreDate.seconds * 1000);
            return date.toLocaleDateString('en-US');
        }

        // Case 4: Date string
        if (typeof firestoreDate === 'string') {
            const date = new Date(firestoreDate);
            // Check if the date is valid before formatting
            return isNaN(date) ? "" : date.toLocaleDateString('en-US');
        }

        // Case 5: Number (timestamp in milliseconds)
        if (typeof firestoreDate === 'number') {
            const date = new Date(firestoreDate);
            return date.toLocaleDateString('en-US');
        }

        // If none of the cases match, return an empty string
        return "";

    } catch (error) {
        console.error("Error formatting date:", error);
        return "";
    }
};
