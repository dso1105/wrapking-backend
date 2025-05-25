// pageHandlers/AdminPanelProductsHandler.js
export default class AdminPanelProductsHandler {
    constructor(productManager) {
        this.productManager = productManager; // Dependency injection for product management
        this.productsElement = document.getElementById("products-list");
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
            const html = await Promise.all(products.map((product) => this.createProductCard(product)));
            this.productsElement.innerHTML = html;
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }

    // Create HTML for a single product card
    async createProductCard(product) {
        const hasSale = await this.productManager.hasProductSale(product.id);
        return `
        <div class="col-xl-3 col-lg-4 col-sm-6 d-xl-block d-lg-none">
          <div class="product-card text-center">
            <div class="product-img mb-16">
              <img src="assets/media/products/${product.productFilename}.png" alt="">
            </div>
            <a class="h5 title">${product.productName}</a>
            <p class="desc">${product.productDescription}</p>
            <div class="action-block">
              <button id="edit-product" value="${product.id}" type="submit" class="cus-btn dark w-100">
                <span class="icon-wrapper">
                  <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                Produkt bearbeiten
              </button>
            </div>
            <br>
            <div class="action-block">
              <button id="delete-product" value="${product.id}" type="submit" class="cus-btn primary w-100">
                <span class="icon-wrapper">
                    <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                Produkt löschen
              </button>
            </div>
            <br>
            ${
                hasSale
                ?
                `<button id="remove-sale" value="${product.id}" type="submit" class="cus-btn primary w-100">
                    <span class="icon-wrapper">
                        <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    Angebot entfernen
                </button>
              `
                : ``
            }
          </div>
        </div>`;
    }

    // Add event listeners for delete, edit, and add product actions
    addEventListeners() {
        // Handle delete and edit actions
        document.addEventListener('click', async (event) => {
            if (event.target && event.target.id === 'delete-product') {
                const productDocID = event.target.value;
                this.deleteProduct(productDocID);
            }

            if (event.target && event.target.id === 'edit-product') {
                const productID = event.target.value;
                window.location.href = `admin-panel-edit-product.html?productID=${productID}`;
            }

            if (event.target && event.target.id === 'remove-sale') {
                const productID = event.target.value;
                await this.productManager.removeSale(productID);
                window.location.reload();
            }
        });
    }

    // Delete a product and reload the page
    async deleteProduct(productDocID) {
        try {
            let shouldDelete = confirm("Möchtest du wirklich das Produkt löschen?");
            if (shouldDelete) {
                await this.productManager.deleteProduct(productDocID);
                location.reload();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
}
