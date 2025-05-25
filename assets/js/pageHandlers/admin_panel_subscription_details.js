export default class AdminPanelSubscriptionDetails {
    constructor(subscriptionManager, orderManager) {
        this.subscriptionManager = subscriptionManager;
        this.orderManager = orderManager;
        this.subscriptionListElement = document.getElementById("subscriptions-list") || null;
        this.subscriptionTableBody = document.querySelector(".cart-table tbody") || null;
        this.sendOfferElement = document.getElementById("send-offer");
        this.pagetitleElement = document.getElementById("page-title");
        this.docSubID = null;
    }

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        this.docSubID = urlParams.get('subID');
        if (!this.docSubID) {
            console.error("Subscription ID (subID) is missing in the URL.");
            return;
        }
        this.loadSubscription();

        this.sendOfferElement.addEventListener("click", () => {
            window.location.href = "admin-panel-send-mail.html"
        })
    }

    async loadSubscription() {
        try {
            const subscription = await this.subscriptionManager.getSubscription(this.docSubID);
            this.pagetitleElement.textContent = subscription.data().email;
            if (!subscription || !subscription.data()) {
                console.error("Invalid subscription data.");
                return;
            }

            const orders = subscription.data().purchaseHistory;
            if (!Array.isArray(orders)) {
                console.error("Invalid purchase history format.");
                return;
            }

            if (this.subscriptionTableBody) {
                const desktopHtml = await Promise.all(
                    orders.map((order) => this.createTableRow(order))
                );
                this.subscriptionTableBody.innerHTML = desktopHtml.join("");
            }
        } catch (error) {
            console.error("Error loading subscriptions:", error);
        }
    }

    getDateFromTimestamp(timestamp) {
        if (!timestamp) return "N/A";
        return new Date(timestamp).toLocaleDateString("de-DE");
    }

    async createTableRow(order) {
        let orderDetails = await this.orderManager.getOrderByDocID(order.purchase);
        orderDetails = orderDetails?.data() || {};
    
        // Check if products.cart exists and is an array
        const cartItems = Array.isArray(orderDetails.products?.cart)
            ? orderDetails.products.cart.map((product) => `
                <div>
                    <span>${product.name || "Unnamed Product"}</span> - 
                    <span>${product.quantity || 0}</span> x 
                    <span>${product.price || "N/A"}€</span>
                </div>
            `).join("")
            : "No products available";
    
        return `
            <tr>
                <td class="lead">${"Order #" + (orderDetails.orderID || "N/A")}</td>
                <td class="lead">${this.getDateFromTimestamp(orderDetails.timestamp)}</td>
                <td class="lead">${orderDetails.status || "N/A"}</td>
                <td class="lead">${cartItems}</td>
            </tr>
        `;
    }

}
