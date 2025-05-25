class Utils {
    constructor() {
        this.isCustomWrapSubmitted = false; // Flag to track when submit-custom-wrap finishes
    }

    // Setter for isCustomWrapSubmitted
    setCustomWrapSubmitted(value) {
        this.isCustomWrapSubmitted = value;
    }

    // Getter for wrap description
    getWrapDescription(selectedIngredients) {
        const maxDisplayedIngredients = 6;
        const wrapDescription = selectedIngredients.slice(0, maxDisplayedIngredients).join(", ");
        if (selectedIngredients.length > maxDisplayedIngredients) {
            return `${wrapDescription}, and ${selectedIngredients.length - maxDisplayedIngredients} more`;
        }
        return wrapDescription;
    }

    // Waits for custom wrap submission
    waitForCustomWrapSubmission() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.isCustomWrapSubmitted) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    // Formats a timestamp to a specific locale
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return {
            formattedDate: date.toLocaleDateString("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
            formattedTime: date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
        };
    }

    // Checks if a given date is valid (not in the past)
    isDateValid(dateToCheck) {
        const currentDate = new Date();
        const validityDate = new Date(dateToCheck);

        // Zero out the time portion for accurate comparison
        currentDate.setHours(0, 0, 0, 0);
        validityDate.setHours(0, 0, 0, 0);
        
        return currentDate <= validityDate;
    }
    isDateStarted(dateToCheck) {
        const currentDate = new Date();
        const validityDate = new Date(dateToCheck);

        // Zero out the time portion for accurate comparison
        currentDate.setHours(0, 0, 0, 0);
        validityDate.setHours(0, 0, 0, 0);

        return currentDate >= validityDate;
    }

    // Applies a product coupon to the cart
    async applyProductCoupon(sessionManager, productManager, cartManager, coupon) {
        const currentSession = sessionManager.getCurrentSession();
        const cartSession = currentSession.cartSession;

        cartSession.product_coupons_used.push(coupon);

        // Update the session with the modified array
        sessionManager.updateSession("cartSession", "product_coupons_used", cartSession.product_coupons_used);

        let productDoc = await productManager.getProduct(coupon.mergedProduct);
        let product = productDoc?.data();

        if (product) {
            let convertedProduct = { 
                name: product.productName + " (Coupon)", 
                price: parseFloat(product.productPrice).toFixed(2),
                image: product.productFilename,
                stock: product.productStock,
                id: productDoc.id
            };

            const existingProduct = cartManager.findProductByKey(coupon.mergedProduct);
            if (existingProduct) {
                existingProduct.quantity++;
                cartManager.updateCart(existingProduct);
            } else {
                cartManager.updateCart({ key: coupon.mergedProduct, ...convertedProduct, quantity: 1 });
            }

            cartManager.updateCartHTML();
            cartManager.updateCartTableHTML();
        }
    }

    // Starts button loading animation
    startButtonLoading(buttonElement) {
        buttonElement.classList.add('loading');
        const iconWrapper = buttonElement.querySelector('.icon-wrapper');
        const buttonText = buttonElement.querySelector('.button-text'); // Wrap text in a span
        const currentWidth = buttonElement.offsetWidth;
        const currentHeight = buttonElement.offsetHeight;
    
        if (iconWrapper) {
            iconWrapper.style.visibility = 'hidden';
        }
    
        // Hide the text instead of clearing it
        if (buttonText) {
            buttonText.style.display = 'none';
        }
    
        // Set explicit height and width to prevent resizing
        buttonElement.style.width = `${currentWidth}px`;
        buttonElement.style.height = `${currentHeight}px`;
    
        return { currentHeight, currentWidth, iconWrapper, buttonText };
    }
    
    
    stopButtonLoading(buttonElement, buttonData) {
        if (!buttonElement.classList.contains('loading')) {
            return;
        }
        buttonElement.classList.remove('loading');
    
        // Restore icon visibility
        if (buttonData.iconWrapper) {
            buttonData.iconWrapper.style.visibility = 'visible';
        }
    
        // Restore text visibility
        if (buttonData.buttonText) {
            buttonData.buttonText.style.display = 'inline';
        }
    
        // Reset dimensions
        buttonElement.style.width = `${buttonData.currentWidth}px`;
        buttonElement.style.height = `${buttonData.currentHeight}px`;
    }
    
}

export default Utils;