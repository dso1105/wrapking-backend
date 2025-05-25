import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

class OrderManager {      

    constructor(config, productManager) {
        // Initialize Firebase
        this.app = initializeApp(config);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.productManager = productManager;
        // Collection reference
        this.ordersCollection = collection(this.db, "orders");
        this.ORDER_STATUSES = {
            PENDING: "Pending",
            COMPLETED: "Completed",
            CANCELED: "Canceled",
            DECLINED: "Declined",
            READY: "Ready",
            IN_PROGRESS: "In progress"
        };    
    }

    // Function to get the next order ID
    async getNextOrderID() {
        const q = query(this.ordersCollection, orderBy("orderID", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const lastOrder = querySnapshot.docs[0].data();
            return lastOrder.orderID + 1;
        } else {
            return 1; // Start with 1 if no orders exist
        }
    }

    async retoureOrder(cart) {
        cart.forEach(async (item) => {
            if (item.name !== "Personalised Wrap") {    
                await this.productManager.increaseStock(item.id, item.quantity)
            }
        })
    }

    // Function to add a new order
    async addOrder(orderData, firstName, lastName, email, number, additionalNotes, payment_method, couponCode, pickUpTime) {
        const nextOrderID = await this.getNextOrderID();
        var totalPrice = 0;
        
        orderData.products.cart.forEach(async (item) => {
            totalPrice += item.price * item.quantity;
            console.log(this.productManager);
            if (item.name !== "Personalised Wrap") {
                await this.productManager.decreaseStock(item.id, item.quantity);
            }
        });

        const newOrder = { ...orderData, orderID: nextOrderID, firstName: firstName, lastName: lastName, email: email, number: number, additionalNotes: additionalNotes, paymentMethod: payment_method, total: totalPrice, status: "Pending", timestamp: Date.now(), coupon: couponCode, pickUpTime: pickUpTime};
        try {
            const docRef = await addDoc(this.ordersCollection, newOrder);
            sessionStorage.setItem('placedOrderID', JSON.stringify(nextOrderID));
            sessionStorage.setItem("activeOrderCart", JSON.stringify(orderData.products.cart))
            return JSON.stringify(nextOrderID); // Return the new order ID
        } catch (error) {
            throw error;
        }
    }

    // Function to remove an order by document ID
    async removeOrder(docID) {
        try {
            const docRef = doc(this.db, "orders", docID);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting order:", error);
            throw error;
        }
    }

    async updateOrderStatus(docID, newStatus) {
        try {
            const docRef = doc(this.db, "orders", docID);
            await updateDoc(docRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }

    async getOrder(orderID) {
        try {
            const querySnapshot = await getDocs(this.ordersCollection);
            for (const doc of querySnapshot.docs) {
                if (doc.data().orderID == orderID) {
                    return doc;
                }
            }
            return null;
        } catch (error) {
            console.error("Error fetching order:", error);
            throw error;
        }
    }

    async getOrderByDocID(docID) {
        try {
            const querySnapshot = await getDocs(this.ordersCollection);
            for (const doc of querySnapshot.docs) {
                if (doc.id == docID) {
                    return doc;
                }
            }
            return null;
        } catch (error) {
            console.error("Error fetching order:", error);
            throw error;
        }
    }

    async getOrdersByStatus(status) {
        try {
            const querySnapshot = await getDocs(this.ordersCollection);
            const orders = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().status == status || (status == "Pending" && doc.data().status == "In progress")) {
                    orders.push({ id: doc.id, ...doc.data() }); // Include document ID and data
                }
            });
            orders.sort((a, b) => b.timestamp - a.timestamp);
            return orders; // Return the array of orders
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }

    // Method to fetch all orders from the collection
    async getAllOrders() {
        try {
            const querySnapshot = await getDocs(this.ordersCollection);
            const orders = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().status != "Pending" && doc.data().status != "In progress") {
                    return;
                }
                orders.push({ id: doc.id, ...doc.data() }); // Include document ID and data
            });
            return orders; // Return the array of orders
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }
}

export default OrderManager;
