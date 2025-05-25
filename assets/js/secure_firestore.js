// secure-firestore.js
import { addDoc, setDoc, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

export class SecureFirestore {
    constructor(securityManager) {
        this.securityManager = securityManager;
        
    }

    async addDoc(ref, data) {
        const encrypted = await this.securityManager.encrypt(data);
        return addDoc(ref, encrypted);
    }


    async getDocs(query) {
        const snapshot = await getDocs(query);
        // Decrypt each document's data
        const decryptedDocs = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const encryptedData = doc.data();
                console.log(encryptedData)

                // Check if the document is encrypted
                if (encryptedData.__encrypted) {
                    const decryptedData = await this.securityManager.decrypt(encryptedData);
                    return {
                        id: doc.id,
                        ...decryptedData // Return decrypted data with document ID
                    };
                }

                // If not encrypted, return as-is
                return { id: doc.id, ...encryptedData };
            })
        );
        return decryptedDocs;
    }

    // Add other wrapped methods as needed
    async setDoc(ref, data) {
        const encrypted = await this.securityManager.encrypt(data);
        return setDoc(ref, encrypted);
    }

    async updateDoc(ref, data) {
        const encrypted = await this.securityManager.encrypt(data);
        return updateDoc(ref, encrypted);
    }
}
