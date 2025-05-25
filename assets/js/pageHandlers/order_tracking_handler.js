export default class OrderTrackingHandler {
    constructor(orderManager, utils) {
        this.orderManager = orderManager;
        this.utils = utils;
        this.orderIDElement = document.getElementById("order-id");
        this.emailElement = document.getElementById("email");
        this.searchOrderButtonElement = document.getElementById("search-order");
        this.requestInfoElement = document.getElementById("request-info");
        if (this.requestInfoElement) {
            this.requestInfoElement.classList.add("hidden");
        }
    }

    init() {
        this.addEventListener();
    }

    async handleOrderTrackingRequest() {
        let email = this.emailElement.value;
        let orderID = this.orderIDElement.value;

        if (orderID) {
            let order = await this.orderManager.getOrder(orderID);
            if (!order) {
                this.requestInfoElement.textContent = "Bestellung konnte nicht gefunden werden."
            }
            let orderData = order.data();
            let emailOfOrder = orderData.email;
            
            if (emailOfOrder === email) {
                this.requestInfoElement.classList.add("hidden");
                window.location.href = `order.html?orderID=${order.id}`;
                return;
            } else {
                this.requestInfoElement.textContent = "Bestellnummer oder E-Mail Adresse sind nicht korrekt."
            }

            if (this.requestInfoElement.classList.contains("hidden")) {
                this.requestInfoElement.classList.remove("hidden");
            }
        }
    }

    addEventListener() {
        if (this.searchOrderButtonElement) {
            this.searchOrderButtonElement.addEventListener("click", async () => {
                let buttonStats = this.utils.startButtonLoading(this.searchOrderButtonElement);
                await this.handleOrderTrackingRequest();
                this.utils.stopButtonLoading(this.searchOrderButtonElement, buttonStats);
            });
        }
    }
}