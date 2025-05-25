export default class ShopHandler {
    constructor(productManager, sessionManager, subscriptionManager) {
        this.sessionManager = sessionManager;
        this.subscriptionManager = subscriptionManager
        this.productManager = productManager;
        this.productsElement = document.getElementById("products-list");
        this.searchBarElement = document.getElementById("search-bar");
    }

    // Method to initialize the handler
    init() {
        this.loadNonSpecialProducts();
        this.addSearchFunctionality(); // Add search functionality
    }

    async loadNonSpecialProducts(searchQuery = "") {
        try {
            const products = await this.productManager.getProducts();
            const filteredProducts = products.filter(product =>
                product.productName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const html = await Promise.all(filteredProducts.map((product) => this.createProductCard(product)));
            this.productsElement.innerHTML = html;
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }

    // Method to create a product card's HTML
    async createProductCard(product) {
        const stockColorClass =
            product.productStock < 6 ? "color-red" :
            product.productStock < 10 ? "color-primary-2" :
            "color-green";
    
        // Get today's date and reset time to 00:00:00 for accurate comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        // Check if the product's expiry date is in the past
        const expiryDate = new Date(product.expiryDate);
        const isExpired = expiryDate < today;
        const soldOut = product.productStock > 0 && product.productStock !== "NaN"
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
                            soldOut === false
                            ? `<div class="action-block">
                                ${
                                    product.productStock < 10
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

    // Method to add search functionality
    addSearchFunctionality() {
        this.searchBarElement.addEventListener("input", (event) => {
            const searchQuery = event.target.value;
            this.loadNonSpecialProducts(searchQuery); // Reload products based on search query
        });
    }
}
