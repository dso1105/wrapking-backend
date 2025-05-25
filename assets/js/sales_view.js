
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";


export default class SalesView {

    constructor(config, orderManager) {
        this.orderManager = orderManager;

         // Initialize Firebase
        this.app = initializeApp(config);
        this.db = getFirestore(this.app);
        // Collection reference
        this.salesCollection = collection(this.db, "sales");
    }

    async addSoldOrder(docOrderID) {
        let order = await this.orderManager.getOrderByDocID(docOrderID);
        if (order) {
            try {
                const orderData = order.data(); 
                // Add the raw data to the sales collection
                await addDoc(this.salesCollection, orderData);
            } catch (error) {
                throw error;
            }
        }
    }

    async getAmountSoldProducts() {
        const querySnapshot = await getDocs(this.salesCollection);
        return querySnapshot.size
    }

    async getSales() {
        const querySnapshot = await getDocs(this.salesCollection);
        let totalPrice = 0;
        querySnapshot.forEach(sale => {
            let saleData = sale.data();
            totalPrice += saleData.total;
        })
        return totalPrice;
    }

    async getMostSoldProduct() {
        const querySnapshot = await getDocs(this.salesCollection);
        const productCount = {};
    
        // Iterate through each sale document
        querySnapshot.forEach((sale) => {
            const saleData = sale.data();
            const cart = saleData.products.cart;
    
            // Count each product in the cart based on its quantity
            cart.forEach((product) => {
                const productName = product.name;
                const quantity = product.quantity;
    
                if (productCount[productName]) {
                    productCount[productName] += quantity; 
                } else {
                    productCount[productName] = quantity;
                }
            });
        });
    
        // Find the most sold product
        let mostSoldProduct = null;
        let maxCount = 0;
    
        for (const [productName, count] of Object.entries(productCount)) {
            if (count > maxCount) {
                mostSoldProduct = productName;
                maxCount = count;
            }
        }
    
        return mostSoldProduct ? { name: mostSoldProduct, count: maxCount } : null;
    }
}