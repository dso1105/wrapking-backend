export default class OrderHandler {
    constructor(orderManager, couponManager, utils) {
        this.orderManager = orderManager;
        this.couponManager = couponManager;
        this.utils = utils;
    }

    // Initialize the handler
    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const docOrderID = urlParams.get('orderID');

        if (!docOrderID) {
            console.error("No doc Order ID found in the URL.");
            return;
        }

        this.initOrderView(docOrderID);
        this.updateOrder(docOrderID);

        // Set up event listeners
        this.addEventListeners(docOrderID);

        // Periodic updates to avoid performance issues
        setInterval(() => this.updateOrder(docOrderID), 5000);
    }

    // Add event listeners for canceling orders
    addEventListeners(docOrderID) {
        document.addEventListener('click', async (event) => {
            if (event.target && event.target.id === 'cancel-order-button') {
                const btn = document.getElementById("cancel-order-button");
                let buttonStats = this.utils.startButtonLoading(btn);
                try {
                    await this.handleOrderCancellation(event, docOrderID);
                    this.updateOrder(docOrderID); // Dynamically update UI
                } catch (error) {
                    console.error("Error canceling order:", error);
                }

                this.utils.stopButtonLoading(btn, buttonStats);
            }
        });
    }

    // Handle order cancellation
    async handleOrderCancellation(event, docOrderID) {
        await this.orderManager.updateOrderStatus(event.target.value, this.orderManager.ORDER_STATUSES.CANCELED);

        const order = await this.orderManager.getOrderByDocID(docOrderID);
        if (order && order.data().products?.cart) {
            await this.orderManager.retoureOrder(order.data().products.cart);
        }
    }

    // Change the color of the order status dynamically
    changeOrderStatusColor(orderStatus, color) {
        orderStatus.classList.forEach((cls) => {
            if (cls.startsWith("color-")) {
                orderStatus.classList.remove(cls);
            }
        });
        orderStatus.classList.add(color);
    }

    // Update items in the order summary
    async updateItems(docOrderID) {
        const summeryContainer = document.getElementById('orderItems');
        const totalElement = document.getElementById('total-price');

        if (!summeryContainer || !totalElement) {
            console.error("Summary container or total element not found.");
            return;
        }

        try {
            const orderDoc = await this.orderManager.getOrderByDocID(docOrderID);

            if (!orderDoc || typeof orderDoc.data !== "function") {
                console.error("Invalid order data returned from getOrderByDocID.");
                return;
            }

            const orderData = orderDoc.data();
            let total = 0;
            let orderSummeryHTML = summeryContainer.innerHTML;

            if (orderData.products && Array.isArray(orderData.products.cart)) {
                orderData.products.cart.forEach((product) => {
                    total += product.price * product.quantity;
                    orderSummeryHTML += `
              <div class="d-flex justify-content-between align-items-center mb-24">
                  <p class="lead color-black">${product.quantity}x ${product.name}</p>
                  <p class="lead">CHF ${(product.price * product.quantity).toFixed(2)}</p>
              </div>
            `;
                });
            }

            if (orderData.coupon) {
                let coupon = await this.couponManager.getCoupon(orderData.coupon);
                const subtotalCoupon = (total / 100) * coupon.data().discountPercentage;
                total -= subtotalCoupon;
                orderSummeryHTML += `
                <div class="d-flex justify-content-between align-items-center mb-24">
                    <p class="lead color-black">COUPON USED (${coupon.data().couponCode} - ${coupon.data().discountPercentage}%)</p>
                    <p class="lead color-green">CHF -${(subtotalCoupon).toFixed(2)}</p>
                </div>
                `;
            }

            summeryContainer.innerHTML = orderSummeryHTML;
            totalElement.innerText = "CHF " + total.toFixed(2);
        } catch (error) {
            console.error("Error updating items:", error);
        }
    }

    // Update the overall order details and status
    async updateOrder(docOrderID) {
        try {
            const orderDoc = await this.orderManager.getOrderByDocID(docOrderID);
            const currentDate = new Date().getTime();
            const orderData = orderDoc.data();
            const orderDate = new Date(orderData.timestamp).getTime();
            let timeDiff = (currentDate - orderDate) / 6000;

            if (!orderDoc || typeof orderDoc.data !== "function") {
                console.error("Invalid data returned from getOrderByDocID.");
                return;
            }

            const placedOrderID = orderDoc.data().orderID;

            const paymentMethodElement = document.getElementById('order-payment-method');
            const cancelOrderButton = document.getElementById('cancel-order-button');
            const orderStatus = document.getElementById('order-status');

            if (!paymentMethodElement || !orderStatus) {
                console.error("Required elements for updating the order are missing.");
                return;
            }

            if (timeDiff >= 5) {
                cancelOrderButton?.remove();
            }

            document.getElementById('order-id').innerText = "#" + placedOrderID;

            const currentStatus = orderDoc.data().status;
            paymentMethodElement.innerText = orderDoc.data().paymentMethod;

            if (cancelOrderButton) cancelOrderButton.value = docOrderID;

            switch (currentStatus) {
                case this.orderManager.ORDER_STATUSES.COMPLETED:
                case this.orderManager.ORDER_STATUSES.READY:
                    cancelOrderButton?.remove();
                    this.changeOrderStatusColor(orderStatus, "color-green");
                    break;
                case this.orderManager.ORDER_STATUSES.CANCELED:
                case this.orderManager.ORDER_STATUSES.DECLINED:
                    cancelOrderButton?.remove();
                    this.changeOrderStatusColor(orderStatus, "color-red");
                    break;
                case this.orderManager.ORDER_STATUSES.PENDING:
                    this.changeOrderStatusColor(orderStatus, "color-primary");
                    break;
                case this.orderManager.ORDER_STATUSES.IN_PROGRESS:
                    this.changeOrderStatusColor(orderStatus, "color-primary-2");
                    break;
                default:
                    this.changeOrderStatusColor(orderStatus, "color-black");
                    break;
            }

            orderStatus.innerText = currentStatus || "Unknown";
        } catch (error) {
            console.error("Error updating the order:", error);
        }
    }

    // Initialize the view and fetch initial data
    async initOrderView(docOrderID) {
        try {
            await this.updateItems(docOrderID);
        } catch (error) {
            console.error("Error initializing the Order View:", error);
        }
    }
}
