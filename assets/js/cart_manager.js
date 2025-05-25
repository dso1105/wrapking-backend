// TODO: DO NOT ACCEPT STOCK EXCEEDING

class CartManager {
  constructor(config, firebaseManager, sessionManager, couponManager) {
    this.cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    this.firebaseManager = firebaseManager;
    this.sessionManager = sessionManager;
    this.couponManager = couponManager;
    // Selectors for HTML elements
    this.productListSelector = config.productListSelector || ".product-list";
    this.subtotalSelector = config.subtotalSelector || "#subtotal";
    this.cartTableBodySelector = config.cartTableBodySelector || ".cart-table tbody";
    this.subtotalOfItemsSelector = config.subtotalOfItemsSelector || "#subtotal-of-items";
    this.totalPriceSelector = config.totalPriceSelector || "#total-price";
    this.cartCardsContainerSelector = config.cartCardsContainerSelector || ".d-xl-none.d-block.mb-32 .row";

    // Initialize the cart display
    document.addEventListener("DOMContentLoaded", () => {
      this.syncCoupons(),
      this.updateCartHTML();
      this.updateCartTableHTML();
      this.updateCartCardsHTML(); // Initialize the card-based layout as well
    });
  }

  updateCart(product) {
    try {
        // Retrieve the current session and cart session
        const currentSession = this.sessionManager.getCurrentSession();
        const cartSession = currentSession.cartSession;

        if (!cartSession || !Array.isArray(cartSession.products)) {
            throw new Error("Invalid cart session or products array");
        }

        // Initialize subtotal price
        let subPrice = 0.0;

        // Generate a unique identifier for the product
        const uniqueKey = this.generateUniqueKey(product);

        // Check if the product already exists in the cart based on the unique key
        const existingProductIndex = cartSession.products.findIndex(p => this.generateUniqueKey(p) === uniqueKey);
        
        if (existingProductIndex !== -1) {
            // If product exists, increment its quantity
            cartSession.products[existingProductIndex].quantity += 1;
        } else {
            // If product does not exist, add it to the cart
            cartSession.products.push(product);
        }

        // Recalculate subtotal price
        cartSession.products.forEach(item => {
            subPrice += item.price * item.quantity;
        });

        // Update session with new products and subtotal price
        this.sessionManager.updateSession("cartSession", "products", cartSession.products);
        this.sessionManager.updateSession("cartSession", "sub_price", parseFloat(subPrice).toFixed(2));

        // Log updated cart session for debugging
        console.log(this.sessionManager.getCurrentSession().cartSession);
    } catch (error) {
        console.error("Error updating cart:", error.message);
    }

    this.syncCoupons();
  }

  // Helper function to generate a unique key for a product
  generateUniqueKey(product) {
      if (product.ingredients && Array.isArray(product.ingredients)) {
          // Combine product ID and ingredients to create a unique key for personalized products
          return `${product.id}-${JSON.stringify(product.ingredients.sort())}`;
      }
      // Use only the product ID for non-personalized products
      return product.id;
  }



  async syncCoupons() {
    const currentSession = this.sessionManager.getCurrentSession();
    const cartSession = currentSession.cartSession;    
    if (cartSession.coupon_used) {
      let coupon = await this.couponManager.getCoupon(cartSession.coupon_code);
      if (coupon.category === 'discount') {
        let new_total = cartSession.sub_price - ((cartSession.sub_price / 100) * coupon.data().discountPercentage);
        this.sessionManager.updateSession("cartSession", "total_price", Math.round(new_total))      
      }
    } else {
      this.sessionManager.updateSession("cartSession", "total_price", cartSession.sub_price)
    }

    this.updateCartTableHTML();
  }
  
  syncCartSession() {
    try {
      // Retrieve the current session and cart session
      const currentSession = this.sessionManager.getCurrentSession();
      const cartSession = currentSession.cartSession;
  
      if (!cartSession || !Array.isArray(cartSession.products)) {
        throw new Error("Invalid cart session or products array");
      }
  
      // Recalculate subtotal price
      let subPrice = 0.0;
      cartSession.products.forEach(item => {
        subPrice += item.price * item.quantity;
      });
  
      // Update session with recalculated subtotal price
      this.sessionManager.updateSession("cartSession", "sub_price", parseFloat(subPrice).toFixed(2));
  
      // Log updated cart session for debugging
      console.log(this.sessionManager.getCurrentSession().cartSession);
    } catch (error) {
      console.error("Error syncing cart session:", error.message);
    }

    this.syncCoupons()
  }
  
  saveProducts(newProductsList) {
    try {
      // Update products in the session
      this.sessionManager.updateSession("cartSession", "products", newProductsList);
  
      // Call syncCartSession to update subtotal price and synchronize changes
      this.syncCartSession();
    } catch (error) {
      console.error("Error saving products:", error.message);
    }
  }

  findProductByKeyAndIngredients(productKey, selectedIngredients) {
    const currentSession = this.sessionManager.getCurrentSession();
    if (!currentSession || !currentSession.cartSession) {
      return null; // Return null if no valid session or cart exists
    }

    // Search for the product in the cart's products array
    return currentSession.cartSession.products.find(item =>
      item.key === productKey &&
      JSON.stringify(item.ingredients) === JSON.stringify(selectedIngredients)
    ) || null;
  }

  findProductByKey(productKey) {
    const currentSession = this.sessionManager.getCurrentSession();
    if (!currentSession || !currentSession.cartSession) {
      return null; // Return null if no valid session or cart exists
    }

    // Search for the product in the cart's products array
    return currentSession.cartSession.products.find(item => item.key === productKey) || null;
  }

  clearCart() {    
    this.sessionManager.updateSession("cartSession", "products", []);
    this.sessionManager.updateSession("cartSession", "total_price", 0.0);
    this.sessionManager.updateSession("cartSession", "sub_price", 0.0);
    this.sessionManager.updateSession("cartSession", "coupon_used", false);
    this.sessionManager.updateSession("cartSession", "coupon_code", "");
  }

  updateCartHTML() {
    const productList = document.querySelector(this.productListSelector);
    const subtotalElement = document.querySelector(this.subtotalSelector);  
    if (!productList) return;

    productList.innerHTML = ""; // Clear Current Cart HTML
    let currentSession = this.sessionManager.getCurrentSession();
    let cart = currentSession.cartSession.products;
    cart.forEach((item, index) => {
      // Create Product Item HTML
      const li = document.createElement("li");
      li.className = "product-item mb-24";
      li.innerHTML = `
              <a href="#">
                <span class="item-image">
                  <img src="assets/media/products/${item.image}.png" alt="${item.name}">
                </span>
              </a>
              <div class="product-text">
                <h6 class="color-black">${item.name}</h6>
                <p class="description" style="margin: -1.5; font-size: 1.0em; color: gray;">${item.description || "Keine Beschreibung verfügbar"}</p>
                <div class="qp_row">
                  <div class="quantity quantity-wrap">
                    <div class="decrement"><i class="fa-solid fa-dash"></i></div>
                    <input type="text" name="quantity" value="${item.quantity}" maxlength="2" size="1" readonly>
                    <div class="increment"><i class="fa-solid fa-plus-large"></i></div>
                  </div>
                  <h5 class="color-black">CHF ${parseFloat(item.price * item.quantity).toFixed(2)}</h5>
                </div>
              </div>
            `;
      productList.appendChild(li);

      // Add Increment/Decrement Functionality

      // if (item.quantity < item.stock) {
      li.querySelector(".increment").addEventListener("click", () => this.updateQuantity(index, 1));
      // }
      li.querySelector(".decrement").addEventListener("click", () => this.updateQuantity(index, -1));
    });

    if (subtotalElement) {
      subtotalElement.textContent = `CHF ${currentSession.cartSession.sub_price}`;
    }
  }

  updateCartTableHTML() {
    const cartTableBody = document.querySelector(this.cartTableBodySelector);
    const subtotalOfAllItems = document.querySelector(this.subtotalOfItemsSelector);
    const totalElement = document.querySelector(this.totalPriceSelector);
    let subtotal = 0;

    if (!cartTableBody) return;

    cartTableBody.innerHTML = ""; // Clear Current Table Rows

    let currentSession = this.sessionManager.getCurrentSession();
    let cart = currentSession.cartSession.products;
    cart.forEach((item, index) => {

      // Create Table Row for Each Item
      const row = document.createElement("tr");
      row.innerHTML = `
              <td class="product-block">
                <a href="#" class="remove-from-cart-btn" data-index="${index}">
                  <i class="fa-light fa-xmark"></i>
                </a>
                <img src="assets/media/products/${item.image}.png" width=80 height=80 alt="${item.name}">
                <div>
                  <a href="product-detail.html" class="h6">${item.name}</a>
                  <p class="description" style="margin: 4px 0 0; font-size: 0.9em; color: gray;">${item.description || "Keine Beschreibung verfügbar"}</p>
                </div>
              </td>
              <td>
                <p class="lead color-black">CHF ${parseFloat(item.price).toFixed(2)}</p>
              </td>
              <td>
                <div class="quantity quantity-wrap">
                  <div class="decrement" data-index="${index}">
                    <i class="fa-solid fa-dash"></i>
                  </div>
                  <input type="text" name="quantity" value="${item.quantity}" maxlength="2" size="1" class="number" readonly>
                  <div class="increment" data-index="${index}">
                    <i class="fa-solid fa-plus-large"></i>
                  </div>
                </div>
              </td>
              <td>
                <h6>CHF ${currentSession.cartSession.sub_price}</h6>
              </td>
            `;
      cartTableBody.appendChild(row);

      // Add Event Listeners for Increment, Decrement, and Remove Buttons
      row.querySelector(".increment").addEventListener("click", () => this.updateQuantity(index, 1));
      row.querySelector(".decrement").addEventListener("click", () => this.updateQuantity(index, -1));
      row.querySelector(".remove-from-cart-btn").addEventListener("click", (e) => {
        e.preventDefault();
        this.removeFromCart(index);
      });
    });

    if (subtotalOfAllItems) {      
      subtotalOfAllItems.textContent = `CHF ${currentSession.cartSession.sub_price}`;
      if (totalElement) totalElement.textContent = `CHF ${currentSession.cartSession.total_price}`;
    }
  }

  updateCartCardsHTML() {
    const cartCardsContainer = document.querySelector(this.cartCardsContainerSelector);

    if (!cartCardsContainer) return;

    cartCardsContainer.innerHTML = ""; // Clear Current Card Layout

    let currentSession = this.sessionManager.getCurrentSession();
    let cart = currentSession.cartSession.products;
    cart.forEach((item, index) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "col-lg-6 col-sm-6";

      cardDiv.innerHTML = `
              <div class="cart-item-card text-center mb-32">
                  <a href="#" class="remove-from-cart-btn"><i class="fa-light fa-xmark"></i></a>
                  <div class="product-img mb-16">
                      <img width="80" height="80" src="assets/media/products/${item.image}.png" alt="" class="mx-auto">
                  </div>
                  <a href="product-detail.html" class="h5 title mb-24">${item.name}</a>
                  <p class="description mb-16" style="font-size: 0.9em; color: gray;">${item.description || "Keine Beschreibung verfügbar"}</p>
                  <div class="d-flex justify-content-between align-items-center mb-16">
                      <h6>Price:</h6>
                      <p class="lead color-black">$${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mb-16">
                      <h6>Quantity:</h6>
                      <div class="quantity quantity-wrap">
                          <div class="decrement"><i class="fa-solid fa-dash"></i></div>
                          <input type="text" name="quantity" value="${item.quantity}" maxlength="2" size="1" readonly>
                          <div class="increment"><i class="fa-solid fa-plus-large"></i></div>
                      </div>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                      <h6>Total:</h6>
                      <h6>CHF ${parseFloat(item.price * item.quantity).toFixed(2)}</h6>
                  </div>
              </div>`;

      cartCardsContainer.appendChild(cardDiv);

      // Add Event Listeners for Increment, Decrement, and Remove Buttons
      cardDiv.querySelector(".increment").addEventListener("click", () => this.updateQuantity(index, 1));
      cardDiv.querySelector(".decrement").addEventListener("click", () => this.updateQuantity(index, -1));
      cardDiv.querySelector(".remove-from-cart-btn").addEventListener("click", (e) => {
        e.preventDefault();
        this.removeFromCart(index);
      });
    });
  }

  updateQuantity(index, change) {
    let currentSession = this.sessionManager.getCurrentSession();
    let cart = currentSession.cartSession.products;
    const item = cart[index];
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
      cart.splice(index, 1); // Remove item if quantity is zero or less
    }
    this.saveProducts(cart);
    this.updateCartHTML();
    this.updateCartTableHTML();
    this.updateCartCardsHTML(); // Update the card-based layout as well
  }

  removeFromCart(index) {
    let currentSession = this.sessionManager.getCurrentSession();
    let cart = currentSession.cartSession.products;
    cart.splice(index, 1);
    this.saveProducts(cart);
    this.updateCartHTML();
    this.updateCartTableHTML();
    this.updateCartCardsHTML(); // Update the card-based layout as well
  }
}

export default CartManager;