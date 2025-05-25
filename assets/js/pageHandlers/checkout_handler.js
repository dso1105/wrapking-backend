export default class CheckoutHandler {
    constructor(orderManager, cartManager, firebaseManager, sessionManager, couponManager, subscriptionManager, utils, productManager) {
        this.orderManager = orderManager; // Dependency injection for order management
        this.sessionManager = sessionManager;
        this.cartManager = cartManager; // Dependency injection for cart management
        this.couponManager = couponManager
        this.firebaseManager = firebaseManager; // Dependency injection for Firebase management
        this.subscriptionManager = subscriptionManager
        this.productManager = productManager;
        this.utils = utils;

        this.submitBtn = document.getElementById("submit-order");
        this.submitCoupon = document.getElementById("submit-coupon");
        this.couponInput = document.getElementById("add-coupon-to-checkout");
        this.cartItemsContainer = document.getElementById('cartItems');
        this.totalPriceElement = document.getElementById('totalPrice');
        this.orderPickUpTimeElement = document.getElementById('order-pickup');
        this.couponStock = [];
    }

    // Initialize the handler
    init() {
        if (this.submitBtn && this.submitCoupon) {
            this.addEventListeners();
        }
        this.renderCartSummary();
    }

    extractCouponCode(url) {
        try {
            // Check if the URL starts with "https://" and contains "couponCode"
            if (url.startsWith("https://") && url.includes("couponCode")) {
                // Extract the query string from the URL
                const queryString = url.split('?')[1];
                if (!queryString) return null; // No query parameters found
                
                // Use URLSearchParams to parse the query string
                const params = new URLSearchParams(queryString);
                
                // Check if the 'couponCode' parameter exists
                if (params.has('couponCode')) {
                    // Return the value of 'couponCode'
                    return params.get('couponCode');
                }
            }
            return null; // Return null if conditions are not met
        } catch (error) {
            console.error("Error extracting coupon code:", error);
            return null;
        }
    }
    

    // Add event listeners for submitting orders and applying coupons
    addEventListeners() {
        // Handle coupon submission
        this.submitCoupon.addEventListener("click", async (event) => {
            let buttonStats = this.utils.startButtonLoading(this.submitCoupon);
            const code = this.couponInput.value;
            if (code) {
                await this.applyCoupon(code);
                this.renderCartSummary(); // Re-render cart summary after applying coupon
            }
            this.utils.stopButtonLoading(this.submitCoupon, buttonStats);
        });

        // Handle order submission
        this.submitBtn.addEventListener("click", async (event) => {
            let buttonStats = this.utils.startButtonLoading(this.submitBtn);
            this.handlePayment();
            await this.handleOrderSubmission(event);
            this.utils.stopButtonLoading(this.submitBtn, buttonStats);
        });

        document.getElementById("scan-qr-code").addEventListener("click", () => {
            const qrReaderDiv = document.getElementById("qr-reader");
            qrReaderDiv.classList.remove("hidden");
        
            const html5QrCode = new Html5Qrcode("qr-reader");
            let isScanning = true; // Flag to prevent multiple scans
        
            html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText, decodedResult) => {
                    if (!isScanning) return; // Ignore if already processing a scan
        
                    isScanning = false; // Disable further scans temporarily
        
                    try {

                        if (decodedText.includes("couponCode")) {
                            decodedText = this.extractCouponCode(decodedText);
                        }

                        alert("Applying: " + decodedText);
                        await this.applyCoupon(decodedText); // Process the scanned QR code
                        this.renderCartSummary(); // Update the UI
                    } catch (error) {
                        console.error("Error processing coupon:", error);
                    } finally {
                        html5QrCode.stop()
                            .then(() => {
                                console.log("QR Code scanning stopped.");
                                qrReaderDiv.classList.add("hidden");
                                isScanning = true; // Re-enable scanning after processing
                            })
                            .catch((err) => {
                                console.error("Error stopping QR Code scanning:", err);
                            });
                    }
                },
                (errorMessage) => {
                    console.error(`QR Code scan error: ${errorMessage}`);
                }
            ).catch((err) => {
                console.warn(`Unable to start scanning: ${err}`);
            });
        });
           
    }

    handlePayment() {
        // PAYMENT METHOD WILL BE IMPLEMENTED LATER. WAITING FOR CLIENT
    }

    // Render the cart summary with selected products and total price
    async renderCartSummary() {
        try {
            // Retrieve the current session and cart session
            const currentSession = this.sessionManager.getCurrentSession();
            const cartSession = currentSession.cartSession;

            if (!cartSession || !Array.isArray(cartSession.products)) {
                throw new Error("Invalid cart session or products array");
            }

            // Initialize subtotal price
            let subPrice = 0.0;

            // Clear previous items in the container
            this.cartItemsContainer.innerHTML = '';

            // Dynamically add grouped ingredients to the cart summary and calculate subtotal price
            cartSession.products.forEach(product => {
                subPrice += product.price * product.quantity;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-24');

                itemDiv.innerHTML = `
                    <p class="lead color-black">${product.name} x${product.quantity}</p>
                    <p class="lead">CHF ${parseFloat(product.price * product.quantity).toFixed(2)}</p>
                `;

                this.cartItemsContainer.appendChild(itemDiv);
            });

            // Fallback if no products are in the cart
            if (cartSession.products.length === 0) {
                this.cartItemsContainer.innerHTML = '<p>Keine Artikel im Warenkorb.</p>';
            }

            // Apply coupon discount if available
            let couponUsed = cartSession.coupon_used;

            if (couponUsed) {
                let couponCode = cartSession.coupon_code;
                let coupon = await this.couponManager.getCoupon(couponCode);
                coupon = coupon.data();
                
                if (coupon.category === 'discount') {
                    const discountAmount = (subPrice * coupon.discountPercentage) / 100;
                    subPrice -= discountAmount;

                    const discountDiv = document.createElement('div');
                    discountDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-24');

                    discountDiv.innerHTML = `
                        <p class="lead color-black">COUPON CODE (${coupon.discountPercentage}%)</p>
                        <p class="lead color-green">CHF -${discountAmount.toFixed(2)}</p>
                    `;

                    this.cartItemsContainer.appendChild(discountDiv);
                }
            }
            // Update session with recalculated subtotal price
            this.sessionManager.updateSession("cartSession", "sub_price", parseFloat(subPrice).toFixed(2));

            // Update total price in the UI
            this.totalPriceElement.textContent = `CHF ${subPrice.toFixed(2)}`;

        } catch (error) {
            console.error("Error rendering cart summary:", error.message);
        }
    }


    // Apply a coupon code
    async applyCoupon(code) {
        try {
            const coupon = await this.couponManager.validateCoupon(code);
            const couponDoc = await this.couponManager.getCouponByCode(code);

            if (couponDoc.category !== 'product') {
                if (this.sessionManager.getCurrentSession().cartSession.coupon_used) {
                    alert("You cannot apply 2 or more codes.");
                    return;
                }
                if (coupon) {
                    this.sessionManager.updateSession("cartSession", "coupon_used", true)
                    this.sessionManager.updateSession("cartSession", "coupon_code", couponDoc.id)
                } else {
                    alert("Invalid coupon code.");
                }
            } else {
                if (coupon) {
                    // Validate coupon document
                    if (!couponDoc) {
                        console.error("Coupon document is undefined.");
                        return;
                    }
            
                    const coupon = await this.couponManager.getCoupon(couponDoc.id);
                    const couponCode = couponDoc?.couponCode;
            
                    if (!couponCode) {
                        console.error("Invalid coupon code in coupon document.");
                        return;
                    }

                    if (couponDoc.couponStock <= 0) {
                        alert("Coupon used to the maximum.");
                        return
                    }
                    
                    let couponUsed = await this.couponManager.useCoupon(couponDoc.id);

                    if (couponUsed) {
                        await this.utils.applyProductCoupon(this.sessionManager, this.productManager, this.cartManager, couponDoc);
                    }

                } else {
                    alert("Invalid coupon code or already used.");
                }                
            }
        } catch (error) {
            console.error("Error applying coupon:", error);
        }
    }

    // Handle order submission
    async handleOrderSubmission(event) {
        try {
            const formData = this.collectFormData();
            if (!this.validateFormData(formData)) return;

            const currentSession = this.sessionManager.getCurrentSession();
            const cartSession = currentSession.cartSession;

            const cart = cartSession.products || [];
            const couponCode = cartSession.coupon_code || null;

            if (!cart.length) {
                alert("Your cart is empty. Please add items to your cart before placing an order.");
                return;
            }

            const orderID = await this.orderManager.addOrder(
                { products: { cart } },
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.number,
                formData.additionalNote,
                formData.paymentMethod,
                couponCode,
                formData.orderPickUpTime
            );

            let isSub = await this.subscriptionManager.isAlreadySubscribed(formData.email);
            if (isSub) {
                await this.subscriptionManager.updateSubscriptionPurchase(formData.email, orderID)
            }
            
            await this.finalizeOrder(orderID, cart, couponCode, formData);
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("An error occurred while placing your order. Please try again later.");
        }
    }

    // Collect form data from the checkout page
    collectFormData() {
        return {
            firstName: document.getElementById("first-name").value,
            lastName: document.getElementById("last-name").value,
            email: document.getElementById("email").value,
            number: document.getElementById("number").value,
            additionalNote: document.getElementById("additional-note").value,
            paymentMethod: this.getSelectedPaymentMethod(),
            orderPickUpTime: this.orderPickUpTimeElement.value
        };
    }

    // Validate form data
    validateFormData(formData) {
        if (!formData.firstName) {
            alert("Please enter your first name.");
            return false;
        }
        if (!formData.lastName) {
            alert("Please enter your last name.");
            return false;
        }
        if (!formData.email) {
            alert("Please enter your email.");
            return false;
        }
        if (formData.paymentMethod !== "cash") {
            alert("This payment method is currently not supported!");
            return false;
        }
        return true;
    }

    // Get the selected payment method
    getSelectedPaymentMethod() {
        if (document.getElementById("payment-cash").checked) return "cash";
        if (document.getElementById("payment-twint").checked) return "twint";
        if (document.getElementById("payment-bank-transfer").checked) return "bank-transfer";
        return null;
    }

    // Finalize the order after submission
    async finalizeOrder(orderID, cart, couponCode, formData) {
        try {
            const orderDoc = await this.orderManager.getOrder(orderID);
            const orderDocID = orderDoc.id;

            const currentSession = this.sessionManager.getCurrentSession();
            const cartSession = currentSession.cartSession;

            let totalPrice = 0;
            let productsHTML = "";

            cart.forEach((product) => {
                totalPrice += product.price * product.quantity;
                productsHTML += `<p class="lead"><strong>${product.quantity}x ${product.name}: </strong>CHF ${parseFloat(product.price).toFixed(2)}</p>`;
            });

            if (couponCode) {
                let coupon = await this.couponManager.getCoupon(couponCode);
                
                const discount = (totalPrice * coupon.data().discountPercentage) / 100;
                totalPrice -= discount;
                productsHTML += `<p class="lead"><strong>COUPON CODE: </strong>CHF -${discount.toFixed(2)}</p>`;
                await this.couponManager.useCoupon(couponCode);
            }

            const bodyHTML = this.generateOrderConfirmationHTML(orderID, totalPrice, productsHTML, formData.paymentMethod, orderDocID);

            await this.sendConfirmationEmail(formData, bodyHTML, orderID);

            this.cartManager.clearCart();

            window.location.href = `order.html?orderID=${orderDocID}`;
        } catch (error) {
            console.error("Error finalizing order:", error);
        }
    }

    // Generate the HTML for the order confirmation email
    generateOrderConfirmationHTML(orderID, totalPrice, productsHTML, paymentMethod, orderDocID) {
        return `
        <h2 style="text-align:center;">Thank you for your order!</h2>
        <br>
        <p>Your order has been successfully placed. Below are your order details:</p>
        <br>
        <h4 style="text-align:center;" class="color-primary">Order Number:</h4>
        <h1 id="order-id" style="font-size:20vw; text-align:center;">${orderID}</h1>
        
        <div id="order-summary" class="cart-summary">
            <h6 class="title mb-24">ORDER SUMMARY</h6>
            <div id="cartItems" class="cart-summary-detail mb-24">
                <p class="lead"><strong>Order Status:</strong> Pending</p>
                <p class="lead"><strong>Payment Method:</strong> ${paymentMethod}</p>
                ${productsHTML}
            </div>
            <div class="d-flex justify-content-between align-items-center mb-32">
                <h5 class="color-primary">TOTAL</h5>
                <h5 id="total-price" class="color-primary">CHF ${totalPrice.toFixed(2)}</h5>
            </div>
            <a href="https://wrapking.net/order.html?orderID=${orderDocID}">
                <button type="submit" class="cus-btn dark w-100">
                <span class="icon-wrapper">
                    <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                View Order
                </button>
            </a>
         </div>`;
    }

    // Send confirmation email to the customer
    async sendConfirmationEmail(formData, bodyHTML, orderID) {
        const emailData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            subject: `Order Confirmation - Order #${orderID}`,
            bodyHTML,
        };

        try {
            const response = await fetch("assets/mail/MailHandler.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailData),
            });

            if (!response.ok) throw new Error(await response.text());

            console.log(await response.text());
        } catch (error) {
            console.error("Error sending confirmation email:", error);
        }
    }
}
