// pageHandlers/AdminPanelProductsHandler.js
export default class AdminPanelAddProductHandler {
    constructor(productManager) {
        this.productManager = productManager; // Dependency injection for product management
        this.addProductBtn = document.getElementById("add-product");
        this.productNameElement = document.getElementById("product-name");
        this.productPriceElement = document.getElementById("product-price");
        this.productDescriptionElement = document.getElementById("product-description");
        this.productStockElement = document.getElementById("product-stock");
        this.productFilenameElement = document.getElementById("product-filename");
        this.showOnIndexElement = document.getElementById("show-on-index");
        this.specialOfferElement = document.getElementById("special-offer");
        this.expiryDateElement = document.getElementById("product-expiry-date");
    }

    // Initialize the handler
    init() {
        this.addEventListeners();
    }

    // Add event listeners for delete, edit, and add product actions
    addEventListeners() {
        // Handle add product action
        if (this.addProductBtn) {
            this.addProductBtn.addEventListener("click", async () => {
                const productData = {
                    productName: this.productNameElement.value,
                    productPrice: parseFloat(this.productPriceElement.value),
                    productDescription: this.productDescriptionElement.value,
                    productStock: parseInt(this.productStockElement.value, 10),
                    productFilename: this.productFilenameElement.value,
                    showOnIndex: this.showOnIndexElement.checked,
                    specialOffer: this.specialOfferElement.checked,
                    expiryDate: this.expiryDateElement.value,
                    category: ""
                };

                await this.addProduct(productData);
            });
        }
    }

    // Add a new product and reload the page
    async addProduct(productData) {
        try {
            await this.productManager.addProduct(productData);
            location.reload();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }
}