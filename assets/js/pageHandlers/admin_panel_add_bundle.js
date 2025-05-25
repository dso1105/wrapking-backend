export default class AdminPanelAddBundle {
    constructor(productManager, couponManager) {
        this.productManager = productManager;
        this.couponManager = couponManager;
        this.addBundleElement = document.getElementById("add-bundle");
        this.productsElement = document.getElementById("products-list");
        this.includedProductsElement = document.getElementById("included-products");
        this.productNameElement = document.getElementById("product-name");
        this.productPriceElement = document.getElementById("product-price");
        this.productDescriptionElement = document.getElementById("product-description");
        this.productStockElement = document.getElementById("product-stock");
        this.productFilenameElement = document.getElementById("product-filename");
        this.showOnIndexElement = document.getElementById("show-on-index");
        this.specialOfferElement = document.getElementById("special-offer");
        this.couponOnlyElement = document.getElementById("coupon-only");
        this.expiryDateElement = document.getElementById("product-expiry-date");

        // Store included products as an array of IDs
        this.includedProducts = [];
    }

    // Initialize the handler
    init() {
        if (this.productsElement) {
            this.loadProducts();
            this.addEventListeners();
        }
    }

    // Load and display products
    async loadProducts() {
        try {
            const products = await this.productManager.getProducts();
            const html = products.map((product) => this.createProductCard(product)).join("");
            this.productsElement.innerHTML = html;
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }

    // Create HTML for a single product card
    createProductCard(product) {
        return `
        <div class="col-xl-3 col-lg-4 col-sm-6 d-xl-block d-lg-none">
          <div class="product-card text-center">
            <div class="product-img mb-16">
              <img src="assets/media/products/${product.productFilename}.png" alt="">
            </div>
            <a class="h5 title">${product.productName}</a>
            <p class="desc">${product.productDescription}</p>
            <div class="action-block">
              <button id="add-product" value="${product.id}" data-name="${product.productName}" type="button" class="cus-btn dark w-100">
                Produkt hinzufügen
              </button>
            </div>
          </div>
        </div>`;
    }

    // Add event listeners for add and remove product actions
    addEventListeners() {
        document.addEventListener('click', async (event) => {
            if (event.target && event.target.id === 'add-product') {
                const productId = event.target.value;
                const productName = event.target.getAttribute('data-name');
                this.addProductToIncluded(productId, productName);
            }

            if (event.target && event.target.classList.contains('remove-included-product')) {
                const productId = event.target.dataset.id;
                const productName = event.target.dataset.name;
                this.removeProductFromIncluded(productId, productName);
            }

            

            if (event.target && event.target.id === "coupon-only") {
                if (this.couponOnlyElement && this.couponOnlyElement.checked) {
                    this.showOnIndexElement.checked = false;
                    this.specialOfferElement.checked = false;
                }                
            }

            if (event.target && event.target.id === 'special-offer') {
                this.couponOnlyElement.checked = false;
            }

            if (event.target && event.target.id === 'show-on-index') {
                this.couponOnlyElement.checked = false;
            }

            if (event.target && event.target.id === 'add-bundle') {
                const productData = {
                    productName: this.productNameElement.value,
                    productPrice: parseFloat(this.productPriceElement.value),
                    productDescription: this.productDescriptionElement.value,
                    productStock: parseInt(this.productStockElement.value, 10),
                    productFilename: this.productFilenameElement.value,
                    hiddenForUsers: false,
                    showOnIndex: this.showOnIndexElement.checked,
                    specialOffer: this.specialOfferElement.checked,
                    expiryDate: this.expiryDateElement.value,
                    includedProducts: [...this.includedProducts],
                    category: "bundle"
                };

                try {
                    if (this.couponOnlyElement.checked) {
                        productData["showOnIndex"] = false;
                        productData["specialOffer"] = false;
                        productData["hiddenForUsers"] = true;
                        let productID = await this.addProduct(productData);
                        const couponData = {
                            couponName: productData.productName || '',
                            couponStock: productData.productStock,
                            couponDescription: "",
                            couponValidity: productData.expiryDate,
                            mergedProduct: productID,
                            category: "product"
                        };
                        await this.couponManager.addCoupon(couponData)   
                    } else{
                        await this.addProduct(productData);
                    }
                    location.reload();
                } catch (error) {
                    alert("Error adding product or coupon:", error);
                }
            }
        });
    }

    async addProduct(productData) {
        try {
            let response = await this.productManager.addProduct(productData);
            return response
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }

    addProductToIncluded(productId, productName) {
        // Add the product ID to the array
        this.includedProducts.push(productId);

        // Count occurrences of the product in the array
        const count = this.includedProducts.filter(id => id === productId).length;

        // Update or create the list item for the included product
        let item = document.getElementById(`included-product-${productId}`);
        
        if (!item) {
            item = document.createElement('li');
            item.setAttribute('id', `included-product-${productId}`);
            
            // Add a remove button for each included item
            const removeButton = document.createElement('button');
            removeButton.textContent = "Remove";
            removeButton.classList.add('remove-included-product');
            removeButton.dataset.id = productId;
            removeButton.dataset.name = productName;

            item.appendChild(document.createTextNode(`${count}x ${productName} `));
            item.appendChild(removeButton);

            if (this.includedProductsElement) {
                this.includedProductsElement.appendChild(item);
            }
        } else {
            // Update the text to include the count
            item.firstChild.textContent = `${count}x ${productName} `;
        }
    }

    removeProductFromIncluded(productId, productName) {
        // Remove one occurrence of the product ID from the array
        const index = this.includedProducts.indexOf(productId);
        if (index !== -1) {
            this.includedProducts.splice(index, 1);

            // Count remaining occurrences of the product in the array
            const count = this.includedProducts.filter(id => id === productId).length;

            const item = document.getElementById(`included-product-${productId}`);
            
            if (count === 0 && item && this.includedProductsElement) {
                // Remove the item from the DOM if no occurrences remain
                this.includedProductsElement.removeChild(item);
            } else if (item) {
                // Update the text to reflect the new count
                item.firstChild.textContent = `${count}x ${productName} `;
            }
        }
    }
}
