import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

class SubscriptionManager {
    constructor(config, couponManager, orderManager, utils) {
        // Initialize Firebase
        this.app = initializeApp(config);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.couponManager = couponManager;
        this.orderManager = orderManager;
        this.utils = utils;
        // Collection reference
        this.subscriptionCollection = collection(this.db, "subscriptions");

        document.addEventListener("DOMContentLoaded", async () => {
            this.newsletterCoupon = await this.couponManager.getSubscriptionCoupon();
            this.newsletterCode = this.newsletterCoupon.data().couponCode;
            try {
                let subButton = document.getElementById("subscribe-button")
                let emailElement = document.getElementById("subscribe-email")     
                subButton.addEventListener("click", async (event) => {
                    event.preventDefault();
                    let buttonStats = this.utils.startButtonLoading(subButton);
                    let email = emailElement.value;
                    await this.subscribe(email);
                    this.utils.stopButtonLoading(subButton, buttonStats);
                    location.reload()
                })
            } catch {
                console.log("This website is without any subscription footers.")
            }
        })
    }

    async subscribe(email) {
        const newSubscription = { email: email, timestamp: Date.now(), lastPurchasedItem: null, lastPurchaseTime: null, purchaseHistory: []};
        let alreadySubscribed = await this.isAlreadySubscribed(email);
        if (alreadySubscribed) {
            alert("Du hast bereits die Newsletter von WrapKing abonniert.")
            return;
        }
        try {
            const docRef = await addDoc(this.subscriptionCollection, newSubscription);
            let bodyHTML = `
                <h2 style="text-align:center;">Thank you for your subscription!</h2>
                <br>
                <p class="lead">Dear Subscriber,</p>
                <p class="lead">We are thrilled to have you join our community! By subscribing to our platform, you now have access to exclusive updates, insights, and resources designed to keep you informed and inspired. </p>
                <br>
                <div class="page-content">  
                    <section class="pt-10 pb-40">
                        <div class="container-fluid" style="text-align:center;">
                            <h4 class="desc color-black">YOUR 20% COUPON </h4>
                            <div class="offset-xl-2 offset-g-1">
                                <br>
                                <div class="coupon-container">
                                    <h6 class="desc color-green">${this.newsletterCode}</h6>
                                </div>
                                <br>
                                <br>
                                <a href="${"https://wrapking.net/index.html?couponCode=" + this.newsletterCoupon.id}">
                                    <button type="submit" class="cus-btn dark w-100">
                                        <span class="icon-wrapper">
                                            <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </span>
                                        Apply Coupon
                                    </button>
                                </a>
                            </div>
                            <br>
                        </div>
                    </section>
                </div>`;

              const orderData = {
                firstName: "Dear",
                lastName: "Subscriber",
                subject: "Your 20% coupon code!",
                email,
                bodyHTML
              }
              
              try {
                const response = await fetch("assets/mail/MailHandler.php", {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(orderData)
                });

                const result = await response.text();
                if (response.ok) {                  
                  console.log(result);
                } else {
                  console.error("The email for this order could not be sent." + result);
                }
              } catch (error) {
                console.error(error);
              }
            return docRef
        } catch (error) {
            alert(error)
            throw error;
        }
    }

    async getSubscriptions() {
        try {
            const querySnapshot = await getDocs(this.subscriptionCollection);
            const subs = [];
            querySnapshot.forEach((doc) => {
                subs.push({ id: doc.id, ...doc.data() }); 
            });
            subs.sort((a, b) => b.timestamp - a.timestamp);
            return subs; // Return the array of orders
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            throw error;
        }
    }

    async getSubscription(subscriptionID) {
        try {
            const querySnapshot = await getDocs(this.subscriptionCollection);
            for (const doc of querySnapshot.docs) {
                if (doc.id == subscriptionID) {
                    return doc;
                }
            }
        } catch (error) {
            console.error("Error fetching subscription:", error);
            throw error;
        }
    }

    async unsubscribe(subscriptionID) {
        try {
            const docRef = doc(this.db, "subscriptions", subscriptionID);
            await deleteDoc(docRef);
        } catch (error) {            
            throw error;
        }
    }

    async updateSubscriptionPurchase(email, purchase) {
        try {
            const querySnapshot = await getDocs(this.subscriptionCollection);
            for (const sub of querySnapshot.docs) {
                if (sub.data().email == email) {
                    const docRef = doc(this.db, "subscriptions", sub.id);
                    const purchaseDetails = await this.orderManager.getOrder(purchase);
                    const updatedPurchaseHistory = [...sub.data().purchaseHistory, { purchase: purchaseDetails.id, date: Date.now() }];
                    await updateDoc(docRef, { 
                        lastPurchasedItem: purchase,
                        lastPurchaseTime: Date.now(),
                        purchaseHistory: updatedPurchaseHistory
                    });

                }
            }
            return false;
        } catch (error) {
            console.log(error)
        }
    }

    async isAlreadySubscribed(email) {
        try {
            const querySnapshot = await getDocs(this.subscriptionCollection);
            for (const sub of querySnapshot.docs) {
                if (sub.data().email == email) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(error)
        }
    }
}

export default SubscriptionManager;
