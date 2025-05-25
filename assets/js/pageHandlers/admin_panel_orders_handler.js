// pageHandlers/AdminOrdersHandler.js
export default class AdminOrdersHandler {
    constructor(orderManager, couponManager, salesView) {
        this.orderManager = orderManager;
        this.couponManager = couponManager;
        this.salesView = salesView;
        this.orderItemsContainer = document.getElementById("orderItems");
        this.adminOrderFilterOption = null;
    }

    // Initialize the handler
    init() {
        if (this.orderItemsContainer) {
            this.adminOrderFilterOption = "Pending"
            this.addEventListeners();
            this.updateOrders();

            // Periodically update orders
            setInterval(() => this.updateOrders(), 1500);
        }
    }

    // Add event listeners for order actions and filter changes
    addEventListeners() {
        // Handle filter changes
        $('.has-nice-select').on('change', (event) => {
            this.adminOrderFilterOption = $(event.target).val();
            console.log(this.adminOrderFilterOption);
            this.updateOrders();
        });

        // Handle order action buttons
        document.addEventListener('click', async (event) => {
            const targetId = event.target.id;
            const orderActions = {
                'complete-order': this.orderManager.ORDER_STATUSES.COMPLETED,
                'cancel-order': this.orderManager.ORDER_STATUSES.CANCELED,
                'accept-order': this.orderManager.ORDER_STATUSES.IN_PROGRESS,
                'decline-order': this.orderManager.ORDER_STATUSES.DECLINED,
                'renew-order': this.orderManager.ORDER_STATUSES.PENDING,
                'mark-ready-order': this.orderManager.ORDER_STATUSES.READY,
                'unready-order': this.orderManager.ORDER_STATUSES.IN_PROGRESS,
            };

            if (orderActions[targetId]) {
                this.handleOrderStatusUpdate(event, orderActions[targetId]);
                console.log("action", orderActions[targetId])

                var order = await this.orderManager.getOrderByDocID(event.target.value);
                console.log("Order fetch", order)

                if (order) {
                    let orderData = order.data();
                    let firstName = orderData.firstName;
                    let lastName = orderData.lastName;
                    let email = orderData.email;
                    let orderID = orderData.orderID;
                    let cart = orderData.products.cart;
                    let paymentMethod = orderData.paymentMethod;
                    let couponCode = orderData.coupon;

                    let totalPrice = 0;
                    let productsHTML = "";

                    cart.forEach((product) => {
                        totalPrice += product.price * product.quantity;
                        productsHTML += `<p class="lead"><strong>${product.quantity}x ${product.name}: </strong>CHF ${parseFloat(product.price).toFixed(2)}</p>`;
                    });

                    if (couponCode) {
                        let coupon = await this.couponManager.getCoupon(couponCode);

                        const discount = (totalPrice * coupon.data().discountPercentage) / 100;
                        totalPrice -= discount;
                        productsHTML += `<p class="lead"><strong>COUPON CODE: </strong>CHF -${discount.toFixed(2)}</p>`;
                        await this.couponManager.useCoupon(couponCode);
                    }

                    if (orderActions[targetId] === this.orderManager.ORDER_STATUSES.COMPLETED) {
                        console.log("COMPLETE ORDER");
                        this.salesView.addSoldOrder(order.id);
                    }

                    // Only send an email for specific statuses
                    if ([this.orderManager.ORDER_STATUSES.COMPLETED,
                    this.orderManager.ORDER_STATUSES.CANCELED,
                    this.orderManager.ORDER_STATUSES.READY].includes(orderActions[targetId])) {

                        const bodyHTML = this.generateOrderStatusHTML(order.id, totalPrice, productsHTML, paymentMethod, orderActions[targetId]);

                        // Improved subject and body for better understanding
                        const subjectMap = {
                            [this.orderManager.ORDER_STATUSES.COMPLETED]: "Your Order Has Been Completed!",
                            [this.orderManager.ORDER_STATUSES.CANCELED]: "Your Order Has Been Canceled",
                            [this.orderManager.ORDER_STATUSES.READY]: "Your Order Is Ready for Pickup or Delivery"
                        };

                        const detailedBodyHTML = `
                            <h2 style="text-align:center;">Order Status Update</h2>
                            <br>
                            <br>
                            <p>Dear ${firstName} ${lastName},</p>
                            <p>We wanted to inform you that the status of your order <strong>#${orderID}</strong> has been updated to <strong>${orderActions[targetId]}</strong>.</p>
                            <br>
                            <p>Here are the details of your updated order:</p>
                            <br>
                            ${bodyHTML}
                            <br>
                            <p>If you have any questions or concerns, please feel free to contact us.</p>
                            <br>
                            <p>Best regards,<br>Your WrapKing Team</p>
                        `;

                        await this.sendConfirmationEmail(firstName, lastName, email, detailedBodyHTML, subjectMap[orderActions[targetId]]);
                    }
                }
            }
        });
    }

    generateOrderStatusHTML(orderID, totalPrice, productsHTML, paymentMethod, orderStatus) {
        return `
        <div id="order-summary" class="cart-summary">
            <h6 class="title mb-24">ORDER SUMMARY</h6>
            <div id="cartItems" class="cart-summary-detail mb-24">
                <p class="lead"><strong>Order Status:</strong> ${orderStatus}</p>
                <p class="lead"><strong>Payment Method:</strong> ${paymentMethod}</p>
                ${productsHTML}
            </div>
            <div class="d-flex justify-content-between align-items-center mb-32">
                <h5 class="color-primary">TOTAL</h5>
                <h5 id="total-price" class="color-primary">CHF ${totalPrice.toFixed(2)}</h5>
            </div>
            <a href="https://wrapking.net/order.html?orderID=${orderID}">
                <button type="submit" class="cus-btn dark w-100">
                <span class="icon-wrapper">
                    <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                View Order
                </button>
            </a>
        </div>`;
    }

    async sendConfirmationEmail(firstName, lastName, email, bodyHTML, subject) {
        const emailData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            subject: subject,
            bodyHTML,
        };

        try {
            const response = await fetch("assets/mail/MailHandler.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailData),
            });

            if (!response.ok) throw new Error(await response.text());

            console.log(await response.text());
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }


    // Update the status of an order
    async handleOrderStatusUpdate(event, newStatus) {
        const orderId = event.target.value;
        try {
            await this.orderManager.updateOrderStatus(orderId, newStatus);
            console.log(`Order ${orderId} updated to status: ${newStatus}`);
            this.updateOrders();
        } catch (error) {
            console.error(`Error updating order status for ${orderId}:`, error);
        }
    }

    // Fetch and display orders based on the current filter
    async updateOrders() {
        try {
            const orders = await this.orderManager.getOrdersByStatus(this.adminOrderFilterOption || "open");

            // Sort orders by ID
            orders.sort((a, b) => a.orderID - b.orderID);

            // Build HTML for each order (resolve all promises)
            const fullOrderHTML = (await Promise.all(
                orders.map(async (order) => await this.createOrderCard(order))
            )).join("");

            // Update the DOM once
            this.orderItemsContainer.innerHTML = fullOrderHTML;
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    addTime(date, hours, minutes) {
        const newDate = new Date(date);

        newDate.setHours(newDate.getHours() + hours);
        newDate.setMinutes(newDate.getMinutes() + minutes);

        return newDate;
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);

        const formattedDate = date.toLocaleDateString("de-DE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });

        return { "formattedDate": formattedDate, "formattedTime": formattedTime };
    }


    // Create HTML for a single order card
    async createOrderCard(order) {
        // Generate HTML for cart items
        const cartHTML = order.products.cart.map((item) => `
            <div class="quantity quantity-wrap">
                <input 
                    type="text" 
                    name="quantity" 
                    value="${item.quantity}x ${item.name}${item.ingredients ? ' includes:' : ''}" 
                    style="text-align: left; width: 100%; height: 120%; box-sizing: border-box; overflow: hidden;" 
                    maxlength="500" 
                    size="80" 
                    class="text dynamic-input"
                >
            </div>
            ${item.ingredients ? `
            <div class="quantity quantity-wrap">
                <input 
                    type="text" 
                    name="quantity" 
                    value="${item.ingredients || "Keine Beschreibung verfügbar"}" 
                    style="text-align: left; width: 100%; height: 120%; box-sizing: border-box; overflow: hidden;" 
                    maxlength="500" 
                    size="80" 
                    class="text dynamic-input"
                >
            </div>` : ""}
            <br>
        `).join("");
    
        let colorClass = "color-green"; // Default color for under 5 minutes
        const currentTime = new Date().getTime();
        let timeDifference = null;
        let timeDelay = false;
        let predictedPickUpTime = null;
    
        // Calculate predicted pickup time based on orderPickUpTime
        if (order.pickUpTime) {
            switch (order.pickUpTime) {
                case "asap":
                    predictedPickUpTime = this.addTime(order.timestamp, 0, 10);
                    break;
                case "30m":
                    predictedPickUpTime = this.addTime(order.timestamp, 0, 30);
                    break;
                case "1h":
                    predictedPickUpTime = this.addTime(order.timestamp, 1, 0);
                    break;
                case "1h30m":
                    predictedPickUpTime = this.addTime(order.timestamp, 1, 30);
                    break;
                case "2h":
                    predictedPickUpTime = this.addTime(order.timestamp, 2, 0);
                    break;
                default:
                    console.warn("Unknown pickup time format");
            }
        }
        
        // Calculate time difference and determine delay
        if (order.timestamp && (order.status === this.orderManager.ORDER_STATUSES.IN_PROGRESS || order.status === this.orderManager.ORDER_STATUSES.PENDING)) {
            timeDifference = (currentTime - order.timestamp) / 60000; // Difference in minutes
    
            if (predictedPickUpTime) {
                const delayMinutes = (currentTime - predictedPickUpTime) / 60000;
    
                if (delayMinutes > 0) {
                    colorClass = "color-red";
                    timeDelay = true;
                } else if (delayMinutes > -5 && delayMinutes <= 0) {
                    colorClass = "color-primary";
                }
            } else {
                // Determine color class based on time difference without a specific pickup time
                if (timeDifference > 10) {
                    colorClass = "color-red"; // Over 10 minutes
                    timeDelay = true;
                } else if (timeDifference > 5) {
                    colorClass = "color-primary"; // Over 5 minutes but under 10 minutes
                }
            }
        }
    
        // Generate order details HTML
        let orderDetails = `
            ${order.email ? `<div class="d-flex justify-content-between align-items-center mb-18"><p class="lead color-black">EMAIL</p><p class="lead">${order.email}</p></div>` : ""}
            ${order.number ? `<div class="d-flex justify-content-between align-items-center mb-18"><p class="lead color-black">MOBILE</p><p class="lead">${order.number}</p></div>` : ""}
            ${order.paymentMethod ? `<div class="d-flex justify-content-between align-items-center mb-18"><p class="lead color-black">PAYMENT METHOD</p><p class="lead">${order.paymentMethod}</p></div>` : ""}
            ${order.additionalNotes ? `<div class="d-flex justify-content-between align-items-center mb-18"><p class="lead color-black">ADDITIONAL NOTE</p><p class="lead">${order.additionalNotes}</p></div>` : ""}
            ${order.timestamp && timeDifference ? `
                <div class="d-flex justify-content-between align-items-center mb-18">
                    <p class="lead color-black">DATE</p>
                    <p class="lead">${this.formatTimestamp(order.timestamp).formattedDate}</p>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-18">
                    <p class="lead color-black">TIME</p>
                    <p class="lead ${colorClass}">ORDERED (${timeDifference.toFixed(2)} Minutes ago) ${this.formatTimestamp(order.timestamp).formattedTime} Uhr</p>
                </div>` : ""}
            ${order.pickUpTime ? `
                <div class="d-flex justify-content-between align-items-center mb-18">
                    <p class="lead color-black">PICKUP-TIME</p>
                    <p class="lead">${this.formatTimestamp(predictedPickUpTime).formattedTime} Uhr</p>
                </div>` : ""}
            ${(predictedPickUpTime && currentTime - predictedPickUpTime) / 60000 < 10 ? `
                <div class="d-flex justify-content-between align-items-center mb-18">
                    <p class="lead color-black">SUGGESTED START</p>
                    <p class="lead">HOLD ORDER</p>
                </div>` : `
                <div class="d-flex justify-content-between align-items-center mb-18">
                    <p class="lead color-black">SUGGESTED START</p>
                    <p class="lead">START NOW</p>
                </div>`}
        `;
    
        // Handle coupon logic
        if (order.coupon && order.coupon !== "") {
            try {
                const coupon = await this.couponManager.getCoupon(order.coupon);
                const subtotalCoupon = (order.total / 100) * coupon.data().discountPercentage;
                order.total -= subtotalCoupon;
                orderDetails += `
                  <div class="d-flex justify-content-between align-items-center mb-18">
                      <p class="lead color-black">COUPON USED</p>
                      <p class="lead">${coupon.data().couponName}</p>
                  </div>`;
            } catch (error) {
                console.error("Error fetching coupon:", error);
            }
        }
    
        // Get required buttons for actions
        const requiredButtons = this.getActionButtons(order);
    
        // Return the final HTML structure
        return `
            <div class="item-card col-xl-6 col-lg-4 col-sm-6 mb-3">
              <div class="product-card text-center">
              ${timeDelay ? `
                  <div class="coupon_tag">
                      <ul class="unstyled nutrients_list">
                          <li class="cal-tag">
                              <p class="bold-text">IMPORTANT</p>
                              <h6 class="color-primary">${((currentTime - predictedPickUpTime) / 60000).toFixed(2)} MIN DELAY</h6>
                          </li>
                      </ul>
                  </div>` : ""}
                  <h4 class="title mb-16">ORDER #${order.orderID} - ${order.status.toUpperCase()}</h4>
                  <div class="cart-summary-detail mb-24">
                      <div class="d-flex justify-content-between align-items-center mb-18">
                          <p class="lead color-black">TOTAL</p>
                          <p class="lead">CHF ${order.total.toFixed(2)}</p>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mb-18">
                          <p class="lead color-black">ORDERED BY</p>
                          <p class="lead">${order.firstName} ${order.lastName}</p>
                      </div>
                      ${orderDetails}
                  </div>
                  <h4 class="title mb-24">ORDER SUMMARY - ${order.products.cart.length}:</h4>
                  ${cartHTML}
                  <div class="action-block">
                      <div id="order-${order.id}" class="price-cart">
                          ${requiredButtons}
                      </div>
                  </div>
              </div>
          </div>`;
    }    

    // Get action buttons based on the current status of an order
    getActionButtons(order) {
        const iconWrapper = `
        <span class="icon-wrapper">
            <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>`;

        const buttonTemplates = {
            acceptOrder: (id) => `<button id="accept-order" value="${id}" type="submit" class="cus-btn dark">${iconWrapper}Accept Order</button>`,
            declineOrder: (id) => `<button id="decline-order" value="${id}" type="submit" class="cus-btn primary">${iconWrapper}Decline Order</button>`,
            markReady: (id) => `<button id="mark-ready-order" value="${id}" type="submit" class="cus-btn primary">${iconWrapper}Mark as Ready</button>`,
            completeOrder: (id) => `<button id="complete-order" value="${id}" type="submit" class="cus-btn dark">${iconWrapper}Complete Order</button>`,
            cancelOrder: (id) => `<button id="cancel-order" value="${id}" type="submit" class="cus-btn outline">${iconWrapper}Cancel Order</button>`,
            renewOrder: (id) => `<button id="renew-order" value="${id}" type="submit" class="cus-btn dark">${iconWrapper}Renew Order</button>`,
            unreadyOrder: (id) => `<button id="unready-order" value="${id}" type="submit" class="cus-btn outline">${iconWrapper}Unready Order</button>`,
        };

        switch (order.status) {
            case this.orderManager.ORDER_STATUSES.PENDING:
                return `${buttonTemplates.acceptOrder(order.id)}${buttonTemplates.declineOrder(order.id)}`;
            case this.orderManager.ORDER_STATUSES.IN_PROGRESS:
                return `${buttonTemplates.markReady(order.id)}${buttonTemplates.cancelOrder(order.id)}`;
            case this.orderManager.ORDER_STATUSES.READY:
                return `${buttonTemplates.completeOrder(order.id)}${buttonTemplates.unreadyOrder(order.id)}`;
            default:
                return buttonTemplates.renewOrder(order.id);
        }
    }
}
