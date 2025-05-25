// pageHandlers/AdminOrderTrackingHandler.js
export default class AdminPanelSalesView {
    constructor(salesView) {
        this.salesView = salesView;
        this.amountSoldProductsElement = document.getElementById("amount-sold-products");
        this.amountSalesElement = document.getElementById("amount-sales");
        this.mostSoldProductElement = document.getElementById("most-sold-product");
    }

    // Initialize the handler
    init() {
        this.updateSalesView();
        setInterval(() => this.updateSalesView(), 1000);
    }

    async updateSalesView() {
        try {
            let amount = await this.salesView.getAmountSoldProducts()
            let sales = await this.salesView.getSales();
            let mostSoldProduct = await this.salesView.getMostSoldProduct();
            this.mostSoldProductElement.textContent = mostSoldProduct.name;
            this.amountSoldProductsElement.textContent = amount;
            this.amountSalesElement.textContent = "CHF " + sales.toFixed(2);
        } catch (error) {
            console.error("Error updating sales view:", error);
        }
    }
}