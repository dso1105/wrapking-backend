import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

class FirebaseManager {
    constructor(config) {
        // Initialize Firebase
        this.app = initializeApp(config);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);

        // Add event listeners when the DOM is fully loaded
        document.addEventListener("DOMContentLoaded", () => {
            this.setupFormListeners();
        });

        onAuthStateChanged(this.auth, (user) => {
            try {
                if (user) {
                    if (this.cartManager) {
                        this.cartManager.getCartFromDatabase();
                    }
                    sessionStorage.setItem("isUserLoggedIn", "true");
                } else {
                    sessionStorage.removeItem("isUserLoggedIn");
                }
            } catch (error) {
                console.error("Error updating session storage:", error);
            }
        });        
    }

    setupFormListeners() {
        const signupForm = document.getElementById("signup-action-form");
        const loginForm = document.getElementById("login-action-form");
        if (signupForm) {
            signupForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const firstName = document.getElementById("signup-firstname").value;
                const lastName = document.getElementById("signup-lastname").value;
                const email = document.getElementById("signup-email").value;
                const password = document.getElementById("signup-password").value;
                await this.signup(firstName, lastName, email, password);
            });
        }

        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const email = document.getElementById("login-email").value;
                const password = document.getElementById("login-password").value;
                await this.login(email, password);
            });
        }
    }

    // Get the currently logged-in user
    getCurrentUser() {
        const user = this.auth.currentUser;
        if (user) {
            return user;
        } else {
            console.log("No user is currently logged in.");
            return null;
        }
    }

    // Save a new user's data in Firestore
    async saveNewUser(firstName, lastName, email) {
        const user = this.getCurrentUser();
        if (!user) {
            console.error("No logged-in user to save data for.");
            return;
        }

        try {
            await setDoc(doc(this.db, "users", user.uid), {
                firstName,
                lastName,
                email,
                purchasedItems: [],
                subscribed: false,
                cart: [],
                createdAt: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error saving user data:", error.message);
        }
    }

    async getUserData() {
        const user = this.getCurrentUser();
        if (!user) {
            console.error("No logged-in user to fetch data for.");
            return null;
        }
    
        try {
            const userDocRef = doc(this.db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
    
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            return null;
        }
    }    

    // Update specific fields in the user's Firestore document
    async updateUser(key, value) {
        const user = this.getCurrentUser();
        if (!user) {
            return;
        }

        try {
            const userDocRef = doc(this.db, "users", user.uid);
            await updateDoc(userDocRef, { [key]: value });
            console.log(`User document updated: ${key} = ${value}`);
        } catch (error) {
            console.error("Error updating user document:", error.message);
        }
    }

    // Handle user signup
    async signup(firstName, lastName, email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            // Save additional data to Firestore
            await this.saveNewUser(firstName, lastName, email);

            // Redirect to login page or another page
            window.location.replace("index.html");
        } catch (error) {
            console.error("Error during signup:", error.message);
            alert(`Error: ${error.message}`);
        }
    }

    // Handle user login
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            // Redirect to home page or another page
            window.location.replace("index.html");
        } catch (error) {
            console.error("Error during login:", error.message);

            let errorMessage = "An error occurred during login.";
            if (error.code === "auth/user-not-found") {
                errorMessage = "No account found with this email.";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "Incorrect password.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
            }

            alert(`Error: ${errorMessage}`);
        }
    }

    setCartManager(cartManager) {
        this.cartManager = cartManager;
    }
}

export default FirebaseManager;