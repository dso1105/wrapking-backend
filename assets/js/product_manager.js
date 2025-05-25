import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query, orderBy, limit, increment  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

class ProductManager {
    constructor(config, utils) {
        // Initialize Firebase
        this.app = initializeApp(config);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);

        this.utils = utils;
        
        // Collection reference
        this.productCollection = collection(this.db, "products");
    }

    async addProduct(productData) {
        console.log(productData);
        
        const newProduct = { ...productData, timestamp: Date.now()};
        try {
            const docRef = await addDoc(this.productCollection, newProduct);
            alert("Product added:", docRef);
            return docRef.id
        } catch (error) {
            throw error;
        }
    }

    async getSpecialOfferProducts() {
        try {
            const querySnapshot = await getDocs(this.productCollection);
            const products = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().specialOffer === true && doc.data().showOnIndex === true) {
                    products.push({ id: doc.id, ...doc.data() }); 
                }
            });
            console.log(products);
            products.sort((a, b) => b.timestamp - a.timestamp);
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    async getNonSpecialProducts() {
        try {
            const querySnapshot = await getDocs(this.productCollection);
            const products = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().specialOffer === false && doc.data().showOnIndex === true) {
                    products.push({ id: doc.id, ...doc.data() }); 
                }
            });
            products.sort((a, b) => b.timestamp - a.timestamp);
            return products; // Return the array of orders
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const querySnapshot = await getDocs(this.productCollection);
            const products = [];
            querySnapshot.forEach((doc) => {
                if (!doc.data().hiddenForUsers) {
                    products.push({ id: doc.id, ...doc.data() }); 
                }
            });
            products.sort((a, b) => b.timestamp - a.timestamp);
            return products; // Return the array of orders
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    async getProduct(productID) {
        try {
            const querySnapshot = await getDocs(this.productCollection);
            for (const doc of querySnapshot.docs) {
                if (doc.id == productID) {
                    return doc;
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    async getStock(productID) {
        try {
            let product = await this.getProduct(productID);
            return product.data().productStock;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    async deleteProduct(docID) {
        try {
            const docRef = doc(this.db, "products", docID);
            await deleteDoc(docRef);
            alert("Product deleted.")
        } catch (error) {
            alert("Error deleting product:", error);
            throw error;
        }
    }

    async addSaleToProduct(docID, discount, expiryDate, startDate) {
        let product = await this.getProduct(docID);
        if (product) {
            let productData = product.data();
            productData.saleDiscount = discount;
            productData.saleExpiryDate = expiryDate;
            productData.saleStartDate = startDate;        
            productData.productPrice = productData.productPrice * (1 - discount / 100);
            await this.updateProduct(product.id, productData);
        } else {
            console.error("Product not found!")
        }
        
    }

    // Returns if the product has a sale 
    async hasProductSale(docID) {
        try {
            let product = await this.getProduct(docID);
            if (!product) {
                console.error("Product not found!");
                return false;
            }
    
            let productData = product.data();
    
            // Validate sale discount
            if (
                productData.saleDiscount === undefined ||
                productData.saleDiscount === "" ||
                isNaN(productData.saleDiscount) ||
                productData.saleDiscount <= 0
            ) {
                return false;
            }
    
            // Validate sale expiry date
            if (productData.saleExpiryDate && productData.saleExpiryDate !== "") {
                let expiryValid = this.utils.isDateValid(productData.saleExpiryDate);
                if (!expiryValid) return false; // Sale expired
            }
    
            // Validate sale start date
            if (productData.saleStartDate && productData.saleStartDate !== "") {
                let startValid = this.utils.isDateStarted(productData.saleStartDate);
                if (!startValid) return false; // Sale hasn't started yet
            }
    
            // If all validations pass, the product has an active sale
            return true;
        } catch (error) {
            console.error("Error checking product sale:", error);
            return false;
        }
    }
    

    async removeSale(docID) {
        try {
            let product = await this.getProduct(docID);
            let productData = product.data();
            productData.productPrice = productData.productPrice / (1- (productData.saleDiscount / 100))
            productData.saleDiscount = "";
            productData.saleExpiryDate = "";
            productData.saleStartDate = "";
            await this.updateProduct(docID, productData);
        } catch (error) {
            console.error("Error checking product sale:", error);
            return false;
        }
    }

    async updateProduct(docID, data) {
        try {
            const docRef = doc(this.db, "products", docID);
            await updateDoc(docRef, data);
        } catch (error) {
            console.error("Error updating product status:", error);
            throw error;
        }
    }

    async decreaseStock(docID, changeInStock) {
        try {
            // Reference to the document in the "products" collection
            const docRef = doc(this.db, "products", docID);
            const currentStock = await this.getStock(docID);
            let newStock = currentStock - changeInStock
            // Use Firestore's atomic increment to adjust the product stock
            await updateDoc(docRef, {
                productStock: newStock
            });
    
            console.log("Product stock updated successfully");
        } catch (error) {
            console.error("Error updating product stock:", error);
            throw error;
        }
    }

    async increaseStock(docID, changeInStock) {
        try {
            // Reference to the document in the "products" collection
            const docRef = doc(this.db, "products", docID);
            const currentStock = await this.getStock(docID);
            let newStock = currentStock + changeInStock
            // Use Firestore's atomic increment to adjust the product stock
            await updateDoc(docRef, {
                productStock: newStock
            });
    
            console.log("Product stock updated successfully");
        } catch (error) {
            console.error("Error updating product stock:", error);
            throw error;
        }
    }
}

export default ProductManager;
