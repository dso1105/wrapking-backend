// pageHandlers/IndexHandler.js
export default class IndexHandler {
    constructor(productManager, utils, sessionManager, couponManager, subscriptionManager, cartManager) {
        this.sessionManager = sessionManager;
        this.productManager = productManager;
        this.couponManager = couponManager;
        this.cartManager = cartManager;
        this.subscriptionManager = subscriptionManager;
        this.specialOfferElement = document.getElementById("special-offer-list");
        this.productsElement = document.getElementById("products-list");
        this.submitButton = document.getElementById("submit-custom-wrap")
        this.utils = utils;
        this.maxIngredients = 6;
        this.checkboxes = document.querySelectorAll('input[type="checkbox"]');
    }

    // Method to initialize the handler
    init() {

        this.submitButton.classList.add("disabled");
        if (this.specialOfferElement) {
            this.loadSpecialOffers();
        }
        this.loadCouponCode();
        this.loadNonSpecialProducts();

        this.loadCountdown();
        // Initialize custom wrap submission handling
        this.initCustomWrapSubmission();
        this.handleCustomizedWrapCheckboxes();
    }

    handleCustomizedWrapCheckboxes() {
        this.amountIngredientsSelected = 0;

        this.checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.addEventListener("click", () => {
                // Update selected count
                if (checkbox.checked) {
                    this.amountIngredientsSelected += 1;
                } else {
                    this.amountIngredientsSelected -= 1;
                }

                // Update submit button state
                if (this.amountIngredientsSelected <= 0) {
                    this.submitButton.classList.add("disabled");
                } else {
                    this.submitButton.classList.remove("disabled");
                }

                // Handle checkbox disabling/enabling based on selection count
                if (this.amountIngredientsSelected >= this.maxIngredients) {
                    this.checkboxes.forEach(c => {
                        const img = c.nextElementSibling;
                        if (!c.checked) {
                            img.style.opacity = 0.5;
                            c.disabled = true;
                        }
                    });
                } else {
                    this.checkboxes.forEach(c => {
                        const img = c.nextElementSibling;
                        img.style.opacity = 1.0;
                        c.disabled = false;
                    });
                }
            });
        });
    }
    
    loadCountdown() {
        // Set the target date and time
        const targetDate = new Date("June 20, 2025 10:30:00").getTime();
    
        // Update the countdown every second
        const interval = setInterval(() => {
            const now = new Date().getTime();
    
            // Calculate the time difference
            const distance = targetDate - now;
    
            // If the countdown is over, stop the timer and display a message
            if (distance < 0) {
                clearInterval(interval);
                document.getElementById("coming-soon").innerHTML = `
                    <h3 class="title text-center">The event has started!</h3>
                `;
                return;
            }
    
            // Time calculations for days, hours, minutes, and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
            // Update the HTML content
            document.getElementById("coming-soon").innerHTML = `
            <section class="order-section">
                <br>
                <br>
                <br>
                <h3 class="title text-center">Wir haben <span class="h3 color-primary">Geschlossen</span></h3>
                <br>
                <p class="lead text-center mb-40">Trotzdem können Sie die Webseite anschauen und sehr bald unsere frischen Produkte kaufen.<br>Oder besuchen Sie uns gerne wieder. Sie können ebenfalls<br>unsere Newsletter abonnieren!</p>
                <div class="coming-soon mb-40">                    
                    <ul class="countdown">
                        <li><h3>${days}</h3><p>Tage</p></li>
                        <li><h3>${hours}</h3><p>Std</p></li>
                        <li><h3>${minutes}</h3><p>Min</p></li>
                        <li><h3>${seconds}</h3><p>Sek</p></li>
                    </ul>
                </div>
                <br>              
            </section>
            <br>
            <br>
            <br>
                `;
        }, 1000); // Update every second
    }

    async loadSpecialOffers() {
        try {
            const products = await this.productManager.getSpecialOfferProducts();
            const htmlArray = await Promise.all(products.map((product) => this.createProductCard(product)));
            const html = htmlArray.join(""); // Join resolved HTML strings
            this.specialOfferElement.innerHTML = html;
        } catch (error) {
            console.error("Error loading special offers:", error);
        }
    }
    
    async loadNonSpecialProducts() {
        try {
            const products = await this.productManager.getNonSpecialProducts();
            const htmlArray = await Promise.all(products.map((product) => this.createProductCard(product)));
            const html = htmlArray.join(""); // Join resolved HTML strings
            this.productsElement.innerHTML = html;
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }    

    async loadCouponCode() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const couponCode = urlParams.get('couponCode');
            let coupon = await this.couponManager.getCoupon(couponCode);
            if (coupon.data().category === 'discount') {
                this.sessionManager.updateSession("cartSession", "coupon_used", true)
                this.sessionManager.updateSession("cartSession", "coupon_code", coupon.id)
            } else if (coupon.data().category === 'product') {
                const currentSession = this.sessionManager.getCurrentSession();
                const cartSession = currentSession.cartSession;
                this.sessionManager.updateSession("cartSession", "product_coupons_used", cartSession.product_coupons_used)

                let productDoc = await this.productManager.getProduct(coupon.data().mergedProduct);
                let product = productDoc?.data();
        
                if (product) {
                    let convertedProduct = { 
                        name: product.productName + " (Coupon)", 
                        price: parseFloat(product.productPrice).toFixed(2),
                        image: product.productFilename,
                        stock: product.productStock,
                        id: productDoc.id
                    };
        
                    const existingProduct = this.cartManager.findProductByKey(coupon.data().mergedProduct);
                    if (existingProduct) {
                        existingProduct.quantity++;
                        this.cartManager.updateCart(existingProduct);
                    } else {
                        this.cartManager.updateCart({ key: coupon.data().mergedProduct, ...convertedProduct, quantity: 1});
                    }

                    this.cartManager.updateCartHTML();
                    this.cartManager.updateCartTableHTML();
                }

                var $body = $("body");

                $body.toggleClass("show-sidebar-cart");

                if ($("#sidebar-cart-curtain").is(":visible")) {
                $("#sidebar-cart-curtain").fadeOut(500);
                } else {
                $("#sidebar-cart-curtain").fadeIn(500);
                }
            }
            console.log("Coupon code applied");
        } catch (error) {
            console.log("No coupon code applied", error);
        }
    }

    // Method to handle custom wrap submission
    initCustomWrapSubmission() {
        const submitButton = document.getElementById('submit-custom-wrap');
        
        if (submitButton) { // Ensure the element exists before adding the event listener
            submitButton.addEventListener('click', () => {
                const selectedValues = [];
                
                const amountSouceElement = document.getElementById("amount-souce-silder");
                this.amountIngredientsSelected = 0;
                this.checkboxes.forEach(c => {
                    const img = c.nextElementSibling;
                    img.style.opacity = 1.0;
                    c.disabled = false;
                });
                if (amountSouceElement) {
                    let amountSouceIndex = +amountSouceElement.value;

                    if (amountSouceIndex === 0) {
                        selectedValues.push("Wenig Sauce");
                    } else if (amountSouceIndex === 2) {
                        selectedValues.push("Viel Sauce");
                    }
                }

                this.checkboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        selectedValues.push(checkbox.value);
                    }                    
                })

                // Save ingredients to sessionStorage
                sessionStorage.setItem('selectedIngredients', JSON.stringify(selectedValues));

                // Set flag to true after submission
                this.utils.setCustomWrapSubmitted(true);
            });
        } else {
            console.warn('Submit button for custom wrap not found.');
        }
    }

    // Method to create a product card's HTML
    async createProductCard(product) {
        const stockColorClass =
            product.productStock === "" ? "color-green" : // Unlimited stock
            product.productStock < 6 ? "color-red" :
            product.productStock < 10 ? "color-primary-2" :
            "color-green";
    
        // Get today's date and reset time to 00:00:00 for accurate comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        // Check if the product's expiry date is in the past
        const expiryDate = new Date(product.expiryDate);
        const isExpired = expiryDate < today;
        const soldOut = product.productStock <= 0 && product.productStock !== "" && product.productStock !== "NaN";
        const hasSale = await this.productManager.hasProductSale(product.id);
        let discountValue = null;
        if (hasSale) {
            discountValue = product.saleDiscount;
        }
    
        return `
        <div class="col-xl-3 col-lg-4 col-sm-6 d-xl-block d-lg-none">
            <div class="product-card text-center">
                ${
                    hasSale
                    ?
                    `<div class="coupon_tag">
                        <ul class="unstyled nutrients_list">
                            <li class="cal-tag">
                                <p class="bold-text">ANGEBOT</p>
                                <h6 class="color-primary">-${discountValue}%</h6>
                            </li>
                        </ul>
                    </div>`
                    : ``
                }
                <div class="product-img mb-16">
                    <img src="assets/media/products/${product.productFilename}.png" alt="${product.productName}">
                </div>
                <a class="h5 title">${product.productName}</a>
                <p class="desc">${product.productDescription}</p>
                ${
                    isExpired 
                    ? `<h4 class="color-black">Nicht mehr verfügbar</h4>` 
                    : `
                        ${
                            soldOut === false || product.productStock === ""
                            ? `<div class="action-block">
                                ${
                                    product.productStock === "" 
                                    ? `<div class="quantity quantity-wrap">
                                        <h6 class="desc ${stockColorClass}">VERFÜGBAR</h6>
                                    </div>`
                                    : product.productStock < 10
                                    ? `<div class="quantity quantity-wrap">
                                        <h6 class="desc ${stockColorClass}">${product.productStock} ÜBRIG</h6>
                                    </div>`
                                    : `<div class="quantity quantity-wrap">
                                        <h6 class="desc ${stockColorClass}">VERFÜGBAR</h6>
                                    </div>`
                                }
                                <div class="price-cart">
                                    <h5>CHF ${parseFloat(product.productPrice).toFixed(2)}</h5>
                                    <a href="javascript:;" data-value="${product.id}" class="cart-btn cart-button"><img src="assets/media/icons/shopping-cart.png" alt=""></a>
                                </div>
                            </div>`
                            : `<h4 class="color-black">Ausverkauft</h4><br>`
                        }
                    `
                }
            </div>
        </div>`;

    }
}
