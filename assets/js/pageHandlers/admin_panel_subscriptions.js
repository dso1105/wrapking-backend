export default class AdminPanelSubscriptions {
    constructor(subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
        this.subscriptionListElement = document.getElementById("subscriptions-list");
        this.subscriptionTableBody = document.querySelector(".cart-table tbody");
    }

    // Initialize the handler
    init() {
        if (this.subscriptionListElement || this.subscriptionTableBody) {
            this.loadSubscriptions();
        }

        this.addEventListeners()
    }

    // Load and display subscriptions
    async loadSubscriptions() {
        try {
            const subscriptions = await this.subscriptionManager.getSubscriptions();

            // Populate mobile-friendly list
            if (this.subscriptionListElement) {
                const mobileHtml = subscriptions.map((subscription) => this.createSubCard(subscription)).join("");
                this.subscriptionListElement.innerHTML = mobileHtml;
            }

            // Populate desktop table
            if (this.subscriptionTableBody) {
                const desktopHtml = subscriptions.map((subscription) => this.createTableRow(subscription)).join("");
                this.subscriptionTableBody.innerHTML = desktopHtml;
            }
        } catch (error) {
            console.error("Error loading subscriptions:", error);
        }
    }

    // Create card for mobile view
    createSubCard(subscription) {
        return `
              <div class="product-text">
                <h6 class="color-black">${subscription.email}</h6>
              </div>
            `;
    }

    getDateFromTimestamp(timestamp) {
        return new Date(timestamp).toLocaleDateString("de-DE");
    }

    // Create table row for desktop view
    createTableRow(subscription) {
        return `
              <tr>
                <td class="lead">${subscription.email}</td>
                <td class="lead">${this.getDateFromTimestamp(subscription.timestamp) || "N/A"}</td>
                <td class="lead">${"Order #" + subscription.lastPurchasedItem + " - " + this.getDateFromTimestamp(subscription.lastPurchaseTime)}</td>
                <td>
                  <button class="btn btn-sm btn-primary details-btn" data-id="${subscription.id}">Details</button>
                  <button class="btn btn-sm btn-danger delete-btn" data-id="${subscription.id}">Löschen</button>
                </td>
              </tr>
            `;
    }

    // Add event listeners for subscription actions
    addEventListeners() {
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("details-btn")) {
                const id = event.target.dataset.id;
                this.detailsSubscription(id);
            } else if (event.target.classList.contains("delete-btn")) {
                const id = event.target.dataset.id;
                this.deleteSubscription(id);
            }
        });
    }

    detailsSubscription(id) {
        console.log(`Details about subscription with ID: ${id}`);
        location.href = "admin-panel-subscription-details.html?subID=" + id
    }

    async deleteSubscription(id) {
        console.log(`Delete subscription with ID: ${id}`);
        await this.subscriptionManager.unsubscribe(id)
    }
}
