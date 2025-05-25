import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

class CouponManager {
    constructor(config, utils) {
        // Initialize Firebase
        this.app = initializeApp(config);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.utils = utils;
        
        // Collection reference
        this.couponCollection = collection(this.db, "coupons");

        document.addEventListener("DOMContentLoaded", async () => {
        })
    }

    async getCoupons() {
        try {
            const querySnapshot = await getDocs(this.couponCollection);
            const coupons = [];
            querySnapshot.forEach((doc) => {
                coupons.push({ id: doc.id, ...doc.data() }); 
            });
            return coupons; // Return the array of orders
        } catch (error) {
            console.error("Error fetching coupons:", error);
            throw error;
        }
    }

    async getCoupon(couponID) {
        try {
            const querySnapshot = await getDocs(this.couponCollection);
            for (const doc of querySnapshot.docs) {
                if (doc.id == couponID) {
                    return doc;
                }
            }
        } catch (error) {
            console.error("Error fetching coupon:", error);
            throw error;
        }
    }

    async getSubscriptionCoupon() {
        try {
            const querySnapshot = await getDocs(this.couponCollection);
            for (const doc of querySnapshot.docs) {
                if (doc.data().couponName == "20-OFF-NEW-SUB-PERMANENT") {
                    return doc;
                }
            }
        } catch (error) {
            console.error("Error fetching coupon:", error);
            throw error;
        }
    }

    async addCoupon(couponData) {
        try {
            couponData["couponCode"] = this.generateCoupon();
            const docRef = await addDoc(this.couponCollection, couponData);
            alert("Added coupon!")
            return docRef
        } catch (error) {
            alert("Error while adding coupon" + error)
        }
    }

    async getCouponByCode(couponCode) {
        const coupons = await this.getCoupons();
        for (const coupon of coupons) {
            if (coupon.couponCode === couponCode) {
                return coupon;
            }
        }
        return null;
    }

    async validateCoupon(couponCode) {
        let coupon = await this.getCouponByCode(couponCode.trim());
        if (!coupon) {
            console.log("Coupon not found.")
            return false;
        }

        // Coupon is not unlimited usable
        if (coupon.couponStock || coupon.couponStock === 0) {
            if (parseInt(coupon.couponStock) > 0) {
                console.log("Using coupon code")
            } else {
                console.log("Coupon already used.")
                return false;
            }
        } else {
            console.log("Coupon is unlimited useable.")
        }

        if (coupon.couponValidity) {
            let dateValid = this.utils.isDateValid(coupon.couponValidity);
            if (!dateValid) {
                return false;
            }
        }
        

        return true;
    }

    async useCoupon(couponCode) {
        let couponDoc = await this.getCoupon(couponCode);
        if (await this.validateCoupon(couponDoc.data().couponCode)) {
            let coupon = await this.getCouponByCode(couponDoc.data().couponCode);
            if (coupon.couponStock) {
                coupon.couponStock = parseInt(coupon.couponStock) - 1;
                await this.updateCouponStock(coupon.id, coupon.couponStock);
                return true;
            }
        }
        return false;
    }

    async updateCouponStock(couponID, newStock) {
        try {
            const docRef = doc(this.db, "coupons", couponID);
            await updateDoc(docRef, {couponStock: newStock});
        } catch (error) {
            console.error("Error updating coupon stock;", error);
        }
    }

    async deleteCoupon(couponID) {
        try {
            const docRef = doc(this.db, "coupons", couponID);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting coupon:", error);
            throw error;
        }
    }

    generateCoupon() {
        var length = 8,
            charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
}

export default CouponManager;
