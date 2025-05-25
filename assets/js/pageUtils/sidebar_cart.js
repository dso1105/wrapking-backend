class SidebarCart {      

    constructor() {
        this.sidebarCartElement = null;
        if (this.shouldPlaceSidebarCart()) {
            this.loadSidebarCart();
        } else {
            console.log("This website don't need a sidebar cart.")
        }
    }

    shouldPlaceSidebarCart() {
        this.sidebarCartElement = document.getElementById("sidebarCartModule");
        return this.sidebarCartElement !== null;
    }

    loadSidebarCart() {
        let sidebarCartCode = `
            <aside id="sidebar-cart">
                <div class="d-flex align-items-center justify-content-between mb-32">
                    <h5>Dein Warenkorb</h5>
                    <a href="#" class="close-button"><i class="fa-regular fa-xmark close-icon"></i></a>
                </div>
                <div class="vr-line mb-32"></div>
                <ul class="product-list">
                </ul>
                <div class="price-total mb-24">
                    <h6>Zwischensumme</h6>
                    <h5 id="subtotal" class="color-primary">CHF 0.00</h5>
                </div>
                <div class="vr-line mb-24"></div>
                <div class="action-buttons">
                    <a href="cart.html" class="cus-btn outline">
                        <span class="icon-wrapper">
                            <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                        Warenkorb ansehen
                    </a>
                    <a href="checkout.html" class="cus-btn dark">
                        <span class="icon-wrapper">
                            <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                        Zur Kasse
                    </a>
                </div>
            </aside>
        <div id="sidebar-cart-curtain"></div>
        `;

        this.sidebarCartElement.innerHTML = sidebarCartCode;

    }

}

export default SidebarCart;
