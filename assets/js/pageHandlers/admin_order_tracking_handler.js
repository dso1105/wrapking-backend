// pageHandlers/AdminOrderTrackingHandler.js
export default class AdminOrderTrackingHandler {
    constructor(orderManager) {
        this.orderManager = orderManager; // Dependency injection for order management
        this.readyOrdersElement = document.getElementById("ready-order-ids");
        this.inProgressOrdersElement = document.getElementById("in-progress-order-ids");
    }

    // Initialize the handler
    init() {
        if (this.readyOrdersElement && this.inProgressOrdersElement) {
            this.updateOrderTracking();
            setInterval(() => this.updateOrderTracking(), 1000); // Periodic updates
        }
    }

    // Update the order tracking information
    async updateOrderTracking() {
        try {
            // Fetch orders asynchronously
            const inProgressOrders = await this.orderManager.getOrdersByStatus(this.orderManager.ORDER_STATUSES.IN_PROGRESS);
            const readyOrders = await this.orderManager.getOrdersByStatus(this.orderManager.ORDER_STATUSES.READY);

            // Generate order strings
            const inProgressOrdersText = inProgressOrders.map(order => `#${order.orderID}`).join(", ");
            const readyOrdersText = readyOrders.map(order => `#${order.orderID}`).join(", ");

            // Update DOM elements
            this.readyOrdersElement.innerText = readyOrdersText;
            this.inProgressOrdersElement.innerText = inProgressOrdersText;
        } catch (error) {
            console.error("Error updating order tracking:", error);
        }
    }
}
