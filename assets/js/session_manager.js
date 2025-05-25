class SessionManager {
    // Check if a session exists
    isInSession() {
        return sessionStorage.getItem("session") !== null;
    }
    
    // Get the current session as a parsed object
    getCurrentSession() {
        const sessionData = sessionStorage.getItem("session");
        return sessionData ? JSON.parse(sessionData) : null;
    }

    // Create a default session
    createDefaultSession() {
        const cartSession = {
            products: [],
            total_price: 0.0,
            sub_price: 0.0,
            coupon_used: false,
            coupon_code: "",
            product_coupons_used: []
        };

        const sessions = { cartSession };
        
        // Store as a JSON string
        sessionStorage.setItem("session", JSON.stringify(sessions));
    }

    // Update a specific key-value pair in a specific session object
    updateSession(session, key, value) {
        const currentSession = this.getCurrentSession();

        if (!currentSession) {
            throw new Error("No active session found. Please create a session first.");
        }

        // Check if the specified session exists in the current session object
        if (!currentSession[session]) {
            throw new Error(`The specified session '${session}' does not exist.`);
        }

        // Update the key-value pair in the specified session object
        currentSession[session][key] = value;

        // Save the updated session back to storage
        sessionStorage.setItem("session", JSON.stringify(currentSession));
        console.log("Updated session:" + currentSession)
    }
}

export default SessionManager;
