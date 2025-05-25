class NavigationMenu {
    constructor() {
        this.navMenuElement = null;
        if (this.shouldPlaceNavigationMenu()) {
            this.loadNavigationMenu();
        } else {
            console.log("This website don't need a navigation menu.")
        }
    }

    shouldPlaceNavigationMenu() {
        this.navMenuElement = document.getElementById("navigationMenu");
        return this.navMenuElement !== null;
    }

    loadNavigationMenu() {
        let navCode = `
        <div class="ui-header-col white-bg">

            <!-- Begin overlay menu toggle button -->
            <div id="ui-ol-menu-toggle-btn-wrap">
                <div class="ui-ol-menu-toggle-btn-text">
                    <span class="text-menu" data-hover="Öffnen">Menü</span>
                    <span class="text-close">Schließen</span>
                </div>
                <div class="ui-ol-menu-toggle-btn-holder">
                    <a href="#" class="ui-ol-menu-toggle-btn"><span></span></a>
                </div>
            </div>
            <!-- End overlay menu toggle button -->

            <!-- Begin overlay menu -->
            <nav class="ui-overlay-menu">
                <div class="ui-ol-menu-holder">
                    <div class="ui-ol-menu-inner ui-wrap">
                        <div class="">
                            <div class="container-fluid">
                                <div class="ui-ol-menu-content">
                                    <div class="col-xxl-3 col-xl-4 d-xl-block d-none">
                                        <div class="ui-menu-img-block">
                                            <img src="assets/media/images/menu-img.png" style="width: 80%; height: 80%;" alt="">
                                        </div>
                                    </div>
                                    <div class="col-xxl-6 col-xl-5 col-md-6 ui-menu-nav">
                                        <!-- Begin menu list -->
                                        <ul class="ui-ol-menu-list">
                                            <li><a href="index.html">Startseite</a></li>
                                            <li><a href="cart.html">Warenkorb</a></li>
                                            <!-- End submenu (sub-master) -->

                                            <!-- Begin submenu (submenu master) -->
                                            <li class="ui-ol-submenu-wrap">
                                                <div class="ui-ol-submenu-trigger">
                                                    <a href="#">Weitere</a>
                                                    <div class="ui-ol-submenu-caret-wrap">
                                                        <div class="ui-ol-submenu-caret"></div>
                                                    </div> 
                                                </div>
                                                <div class="ui-ol-submenu">
                                                    <ul class="ui-ol-submenu-list">
                                                        <li><a href="order-tracking.html">Bestellung suchen</a></li>
                                                        <li><a href="404.html">Karriere</a></li>
                                                        <li><a href="coming-soon.html">Coming Soon</a></li>
                                                    </ul>
                                                </div> 
                                            </li>
                                            <!-- End submenu (sub-master) -->

                                            <li><a href="contact-us.html">Kontakt</a></li>

                                        </ul>
                                        <!-- End menu list -->
                                    </div>
                                    <div class="col-xxl-3 col-xl-3 col-md-6 d-md-block d-none">
                                        <div class="company-info">
                                            <img src="assets/media/vector/menu-vector.png" alt="" class="vector">
                                            <br>
                                            <div class="mb-32">
                                                <h6 class="color-primary mb-8">Öffnungszeiten</h6>
                                                <p class="lead dark-gray">Jeden Tag von 09:00 Uhr bis<br>10:00 Uhr</p>
                                            </div>
                                            <div class="mb-32">
                                                <h6 class="mb-8">Kontaktiere uns</h6>
                                                <p class="lead dark-gray mb-16"><span><a href="tel:123456789">+41 76 258 12 62</a></span></p>
                                                <a class="lead dark-gray mb-16" href="mailto:info@example.com">info@wrapking.net</a>
                                                <p class="lead dark-gray">Erhart-Strasse 3, Glattpark, 8152 Opfikon, Zürich, Schweiz.</p>
                                            </div>
                                            <ul class="social-icons-list unstyled">
                                                <li><a href=""><img src="assets/media/icons/Facebook.svg" alt=""></a></li>
                                                <li><a href=""><img src="assets/media/icons/Twitter.svg" alt=""></a></li>
                                                <li><a href=""><img src="assets/media/icons/Instagram.svg" alt=""></a></li>
                                                <li><a href=""><img src="assets/media/icons/Linkedin.svg" alt=""></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div> 
                </div> 

            </nav> 
            <!-- End overlay menu -->

            <!-- Being header tools -->
            <div class="ui-header-tools">
                <a href="javascript:;" class="ui-header-tools-item cart-button"><i class="fa-regular fa-cart-shopping"></i></a>
            </div>
            <!-- End header tools -->

        </div> 
        `;

        this.navMenuElement.innerHTML = navCode;
    }
}

export default NavigationMenu;