export default class AdminPanelCashOrderHandler {
    constructor(orderManager) {
        this.orderManager = orderManager;
    }

    // Initialize the handler
    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const docOrderID = urlParams.get('orderID');

        if (!docOrderID) {
            console.error("No doc Order ID found in the URL.");
            return;
        }

        this.updateOrder();
    }

    async updateOrder() {
        const urlParams = new URLSearchParams(window.location.search);
        const docOrderID = urlParams.get('orderID');

        if (!docOrderID) {
            console.error("No order ID found in the URL.");
            return;
        }

        try {
            const orderDoc = await this.orderManager.getOrderByDocID(docOrderID);
            const placedOrderID = orderDoc.data().orderID;

            if (placedOrderID && !sessionStorage.getItem("placedOrderID")) {
                sessionStorage.setItem("placedOrderID", placedOrderID);
            }

            document.getElementById('order-id').innerText = "#" + placedOrderID;

            // Generate QR Code for the order ID
            this.generateQRCode(orderDoc.id);
        } catch (error) {
            console.error("Error updating the order:", error);
        }
    }

    // Generate QR Code for the given text (order ID)
    generateQRCode(orderID) {
        const qrCodeContainer = document.getElementById('qrcode');
        
        // Clear any existing QR code
        qrCodeContainer.innerHTML = "";

        console.log("https://wrapking.net/order.html?orderID=" + orderID)

        // Create a new QRCode instance
        new QRCode(qrCodeContainer, {
            text: "https://wrapking.net/order.html?orderID=" + orderID,
            width: 300,
            height: 300,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
        });
    }
}
