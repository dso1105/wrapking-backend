// pageHandlers/AdminPanelCouponsHandler.js
export default class AdminPanelCouponsHandler {
    constructor(couponManager) {
        this.couponManager = couponManager; // Dependency injection for coupon management
        this.addCouponBtn = document.getElementById("add-coupon");
        this.couponsElement = document.getElementById("coupons-list");
        this.couponNameElement = document.getElementById("coupon-name");
        this.discountPercentageElement = document.getElementById("discount-percentage");
        this.couponStockElement = document.getElementById("coupon-stock");
        this.couponDescriptionElement = document.getElementById("coupon-description");
        this.couponValidityElement = document.getElementById("coupon-validity");
    }

    // Initialize the handler
    init() {
        if (this.couponsElement) {
            this.loadCoupons();
            this.addEventListeners();
        }
    }

    // Load and display coupons
    async loadCoupons() {
        try {
            const coupons = await this.couponManager.getCoupons();
            const html = coupons.map((coupon) => this.createCouponCard(coupon)).join("");
            this.couponsElement.innerHTML = html;
        } catch (error) {
            console.error("Error loading coupons:", error);
        }
    }

    // Create HTML for a single coupon card
    createCouponCard(coupon) {
        return `
        <div class="col-xl-3 col-lg-4 col-sm-6 d-xl-block d-lg-none">
          <div class="product-card text-center">
            <a class="h5 title">${coupon.couponName}</a>
            <p class="desc">${coupon.couponDescription}</p>
            <p class="desc">${coupon.couponCode}</p>
            <p class="desc">FÜR QR CODES BITTE NUTZEN: https://wrapking.net/index.html?couponCode=${coupon.id}</p>
            <div class="action-block">
              <button id="delete-coupon" value="${coupon.id}" type="submit" class="cus-btn dark w-100">
                <span class="icon-wrapper">
                  <!-- SVG icons -->
                </span>
                Coupon löschen
              </button>
            </div>
          </div>
        </div>`;
    }

    // Add event listeners for adding and deleting coupons
    addEventListeners() {
        // Handle add coupon action
        if (this.addCouponBtn) {
            this.addCouponBtn.addEventListener("click", async () => {
                const couponData = {
                    couponName: this.couponNameElement.value || '',
                    discountPercentage: parseFloat(this.discountPercentageElement.value),
                    couponStock: parseInt(this.couponStockElement.value, 10),
                    couponDescription: this.couponDescriptionElement.value,
                    couponValidity: this.couponValidityElement.value,
                    category: "discount"
                };

                await this.addCoupon(couponData);
            });
        }

        // Handle delete coupon action
        document.addEventListener('click', (event) => {
            if (event.target && event.target.id === 'delete-coupon') {
                const couponID = event.target.value;
                this.deleteCoupon(couponID);
            }
        });
    }

    // Add a new coupon and reload the page
    async addCoupon(couponData) {
        try {
            await this.couponManager.addCoupon(couponData);
            location.reload();
        } catch (error) {
            console.error("Error adding coupon:", error);
        }
    }

    // Delete a coupon and reload the page
    async deleteCoupon(couponID) {
        try {
            await this.couponManager.deleteCoupon(couponID);
            location.reload();
        } catch (error) {
            console.error("Error deleting coupon:", error);
        }
    }
}
