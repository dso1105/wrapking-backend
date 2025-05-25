// pageHandlers/AdminPanelEditProductHandler.js
export default class AdminPanelEditProductHandler {
    constructor(productManager) {
        this.productManager = productManager; // Dependency injection for product management

        // Form elements
        this.editProductBtn = document.getElementById("edit-product");
        this.productNameElement = document.getElementById("product-name");
        this.productPriceElement = document.getElementById("product-price");
        this.productDescriptionElement = document.getElementById("product-description");
        this.productStockElement = document.getElementById("product-stock");
        this.productFilenameElement = document.getElementById("product-filename");
        this.unlimitedStockElement = document.getElementById("unlimited-stock");
        this.showOnIndexElement = document.getElementById("show-on-index");
        this.specialOfferElement = document.getElementById("special-offer");

        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.docProductID = urlParams.get('productID');
    }

    // Initialize the handler
    async init() {
        if (!this.docProductID) {
            console.error("No product ID found in the URL.");
            return;
        }

        await this.loadProductData();
        this.addEventListeners();
    }

    // Load product data and populate form fields
    async loadProductData() {
        try {
            const productDoc = await this.productManager.getProduct(this.docProductID);
            const product = productDoc.data();

            if (product) {
                this.productNameElement.value = product.productName;
                this.productPriceElement.value = product.productPrice;
                this.productDescriptionElement.value = product.productDescription;
                this.productStockElement.value = product.productStock;
                this.productFilenameElement.value = product.productFilename;
                this.unlimitedStockElement.checked = product.stockLimited;
                this.showOnIndexElement.checked = product.showOnIndex;
                this.specialOfferElement.checked = product.specialOffer;
            }
        } catch (error) {
            console.error("Error loading product data:", error);
        }
    }

    // Add event listeners for editing the product
    addEventListeners() {
        if (this.editProductBtn) {
            this.editProductBtn.addEventListener("click", async () => {
                const updatedProductData = {
                    productName: this.productNameElement.value,
                    productPrice: parseFloat(this.productPriceElement.value),
                    productDescription: this.productDescriptionElement.value,
                    productStock: parseInt(this.productStockElement.value, 10),
                    productFilename: this.productFilenameElement.value,
                    showOnIndex: this.showOnIndexElement.checked,
                    specialOffer: this.specialOfferElement.checked,
                    stockLimited: !this.unlimitedStockElement.checked,
                };

                try {
                    await this.productManager.updateProduct(this.docProductID, updatedProductData);
                    window.location.href = "admin-panel-products.html";
                } catch (error) {
                    console.error("Error updating the product:", error);
                }
            });
        }
    }
}
