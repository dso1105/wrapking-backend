export default class AdminPanelCashHandler {
    constructor(productManager, orderManager) {
        this.productManager = productManager;
        this.orderManager = orderManager;
        this.productsElement = document.getElementById("products-list");
        this.cartElement = document.getElementById("cart-items");
        this.placeOrder = document.getElementById("checkout");
        this.closePopup = document.getElementById("close-popup");
        this.submitPopup = document.getElementById("submit-number");
        this.acceptPopup = document.getElementById("accept-popup");
        this.information_text = document.getElementById("information");
        this.cart = {};
        this.productCache = {};
        this.totalPrice = 0;
        this.informationPopupCloseFunction = null;

    }

    // Initialize event listeners
    async init() {
        
        this.hideInformationPopup();
        this.hideNumberPopup();

        await Promise.all([this.loadSpecialOffers(), this.loadNonSpecialProducts()]);
        // Use event delegation for better performance
        this.productsElement.addEventListener('click', async (event) => {
            const target = event.target.closest("div");
            if (!target) return;

            const productID = target.getAttribute("value");
            if (target.id === "add-product") {
                const product = await this.getProductFromCache(productID);
                if (product) {
                    this.addToCart(product);
                    this.updateProductQuantityInput(productID);
                }
            } else if (target.id === "remove-product") {
                this.removeFromCart(productID);
                this.updateProductQuantityInput(productID);
            }
        });

        // Handle order placement
        this.placeOrder.addEventListener("click", async () => {
            let selectedPaymentMethod = this.getSelectedPaymentMethod();
            if (selectedPaymentMethod == "cash") {
                this.showNumberPopup();
            } else {
                this.showInformationPopup("Bitte den folgenden Betrag in das Kartenlesegerät eingeben: " + this.totalPrice.toFixed(2), this.completeOrder);
            }
        });

        this.acceptPopup.addEventListener("click", async () => {
            this.informationPopupCloseFunction();
            this.informationPopupCloseFunction = null;
        });

        this.closePopup.addEventListener("click", () => {
            this.hideNumberPopup(); // Close the number popup
        });
        
        this.submitPopup.addEventListener("click", () => {
            const amountCashElement = document.getElementById("amount-cash"); 
            const amountCashGiven = parseFloat(amountCashElement.value);
        
            if (isNaN(amountCashGiven)) {
                this.showInformationPopup("Bitte geben Sie einen gültigen Betrag ein."); // Show error message if input is not valid
                return;
            }
        
            const change = amountCashGiven - this.totalPrice; // Calculate change
        
            if (change < 0) {
                this.showInformationPopup(`Zu wenig bezahlt. Fehlender Betrag: CHF ${Math.abs(change).toFixed(2)}`, this.showNumberPopup);
            } else {
                this.showInformationPopup(`Rückgeld: CHF ${change.toFixed(2)}`, this.completeOrder); // Display calculated change
            }
        
            this.hideNumberPopup();
        });
        
    }

    async completeOrder() {
        const cartArray = Object.values(this.cart);
        const response = await this.orderManager.addOrder(
            { products: { cart: cartArray } },
            "ADMIN",
            "ORDER",
            "jeremoc@icloud.com",
            null,
            "This order got placed from the terminal",
            null,
            null,
            "asap"
        );
        let order = await this.orderManager.getOrder(response);
        let docID = order.id
        window.location.href = "admin-panel-cash-order-detail.html?orderID=" + docID
    }

    displayCardPayment() {
        alert("Bitte den folgenden Betrag in das Kartenlesegerät eingeben: " + this.totalPrice.toFixed(2));
        return true;
    }

    hideInformationPopup() {
        document.getElementById("informationPopup").style.display = 'none'
        document.getElementById("overlay-info").style.display = 'none'
    }

    hideNumberPopup() {
        document.getElementById("numberPopup").style.display = 'none'
        document.getElementById("overlay-popup").style.display = 'none'
    }

    showInformationPopup(text, closeCall) {
        this.information_text.textContent = text;
        this.informationPopupCloseFunction = closeCall;
        document.getElementById("informationPopup").style.display = 'flex'
        document.getElementById("overlay-info").style.display = 'block'

    }

    showNumberPopup() {
        document.getElementById("numberPopup").style.display = 'flex'
        document.getElementById("overlay-popup").style.display = 'block'
    }


    // Load special offer products
    async loadSpecialOffers() {
        try {
            const products = await this.productManager.getSpecialOfferProducts();
            const html = products.map((product) => this.createProductCard(product)).join("");
            this.productsElement.innerHTML += html;
        } catch (error) {
            console.error("Error loading special offers:", error);
        }
    }

    // Load non-special products
    async loadNonSpecialProducts() {
        try {
            const products = await this.productManager.getNonSpecialProducts();
            const html = products.map((product) => this.createProductCard(product)).join("");
            this.productsElement.innerHTML += html;
        } catch (error) {
            console.error("Error loading non-special products:", error);
        }
    }

    // Fetch product from cache or API
    async getProductFromCache(productID) {
        if (!this.productCache[productID]) {
            const product = await this.productManager.getProduct(productID);
            if (product) {
                this.productCache[productID] = product;
            }
        }
        return this.productCache[productID];
    }

    // Create a product card's HTML
    createProductCard(product) {
        const stockColorClass =
            product.productStock < 6 ? "color-red" :
            product.productStock < 15 ? "color-primary-2" :
            "color-green";

        return `
        <div class="col-xl-5 col-lg-4 col-sm-6 d-xl-block d-lg-none">
            <div class="product-card text-center">
                <div class="product-img mb-16">
                    <img src="assets/media/products/${product.productFilename}.png" style="width: 50px; height: 50px;" alt="" loading="lazy">
                </div>
                <a class="h5 title">${product.productName}</a>
                    <div class="action-block">
                        <div class="quantity quantity-wrap">
                            <div id="remove-product" value="${product.id}" class="decrement"><i class="fa-solid fa-dash"></i></div>
                            <input type="text" name="quantity" id="quantity-${product.id}" value="${this.getCartItemQuantity(product.id)}" maxlength="2" size="1" class="number" readonly>
                            <div id="add-product" value="${product.id}" class="increment"><i class="fa-solid fa-plus-large"></i></div>
                        </div>
                        <div class="price-cart">
                            <h5>CHF ${parseFloat(product.productPrice).toFixed(2)}</h5>
                        </div>
                    </div>
                </a>
            </div>
        </div>`;
    }

    // Add a product to the cart
    addToCart(product) {
        if (!this.cart[product.id]) {
            this.cart[product.id] = {
                id: product.id,
                name: product.data().productName,
                image: `assets/media/products/${product.data().productFilename}.png`,
                price: parseFloat(product.data().productPrice),
                quantity: 1,
            };
        } else {
            this.cart[product.id].quantity++;
        }
        this.updateCartUI();
    }

    // Remove a product from the cart or decrease its quantity
    removeFromCart(productID) {
        if (this.cart[productID]) {
            if (this.cart[productID].quantity > 1) {
                this.cart[productID].quantity--;
            } else {
                delete this.cart[productID];
            }
            this.updateCartUI();
        }
    }

    // Get the quantity of a specific item in the cart
    getCartItemQuantity(productID) {
        return this.cart[productID] ? this.cart[productID].quantity : 0;
    }

    getSelectedPaymentMethod() {
        if (document.getElementById("payment-cash").checked) return "cash";
        if (document.getElementById("payment-card").checked) return "card";
        return null;
    }

    // Update the cart UI efficiently using DocumentFragment
    updateCartUI() {
        this.totalPrice = 0;
        const fragment = document.createDocumentFragment();

        Object.values(this.cart).forEach((item) => {
            const itemTotalPrice = item.quantity * item.price;
            this.totalPrice += itemTotalPrice;

            const div = document.createElement("div");
            div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-24">
                <p class="lead color-black">${item.quantity} x ${item.name}</p>
                <p id="order-status" class="lead color-primary-2" style="font-weight: bold;">CHF ${itemTotalPrice.toFixed(2)}</p>
            </div>`;
            fragment.appendChild(div);
        });

        // Update the cart items and total price in one operation
        this.cartElement.innerHTML = "";
        this.cartElement.appendChild(fragment);

        const totalPriceElement = document.getElementById("total-price");
        if (totalPriceElement) {
            totalPriceElement.textContent = `CHF ${this.totalPrice.toFixed(2)}`;
        }
    }

    // Dynamically update quantity input field for a specific product
    updateProductQuantityInput(productID) {
        const inputField = document.getElementById(`quantity-${productID}`);
        if (inputField) {
            inputField.value = this.getCartItemQuantity(productID);
        }
    }
}
