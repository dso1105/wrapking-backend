class SecurityManager {
    constructor() {
        this.algorithm = { name: 'AES-GCM', length: 256 };
        this.key = null
    }

    async generateValidKey() {
        const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        
        const exported = await window.crypto.subtle.exportKey("raw", key);
        return btoa(String.fromCharCode(...new Uint8Array(exported)));
    }
    

    async importKey(base64Key) {
        const keyData = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
        return await window.crypto.subtle.importKey(
          "raw",
          keyData,
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );
      };      

    async encrypt(data) {
        console.log("key:", this.key)
        if (!this.key) throw new Error("Key not initialized");
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedData = new TextEncoder().encode(JSON.stringify(data));
        
        const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            this.key,
            encodedData
        );

        // Convert to Firestore-friendly format
        console.log("ENCRYPTING DATA!")
        return {
            __encrypted: true,
            iv: Array.from(iv),
            data: Array.from(new Uint8Array(encrypted))
        };
    }

    async decrypt(encryptedData) {
        try {
            if (!encryptedData.__encrypted) {
                throw new Error("Data is not encrypted");
            }

            const iv = new Uint8Array(encryptedData.iv);
            const data = new Uint8Array(encryptedData.data);

            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                this.key,
                data
            );

            // Convert decrypted buffer back to JSON object
            const decodedData = new TextDecoder().decode(decryptedBuffer);
            return JSON.parse(decodedData);
        } catch (error) {
            console.error("Decryption failed:", error);
            throw error;
        }
    }

    async autoEncrypt(data) {
        return this.encrypt(data);
    }

    async autoDecrypt(encryptedData) {
        return this.decrypt(encryptedData);
    }
}

export default SecurityManager;
