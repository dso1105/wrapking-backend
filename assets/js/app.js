import CartManager from './cart_manager.js';
import CouponManager from './coupon_manager.js';
import FirebaseManager from './firebasemanager.js';
import OrderManager from './order_manager.js';
import AdminOrderTrackingHandler from './pageHandlers/admin_order_tracking_handler.js';
import AdminPanelCashHandler from './pageHandlers/admin_panel_cash_handler.js';
import AdminPanelCashOrderHandler from './pageHandlers/admin_panel_cash_order_handler.js';
import AdminPanelCouponsHandler from './pageHandlers/admin_panel_coupons_handler.js';
import AdminPanelEditProductHandler from './pageHandlers/admin_panel_edit_product.js';
import AdminOrdersHandler from './pageHandlers/admin_panel_orders_handler.js';
import AdminPanelProductsHandler from './pageHandlers/admin_panel_products_handler.js';
import AdminPanelSendMail from './pageHandlers/admin_panel_send_mail.js';
import AdminPanelSubscriptionDetails from './pageHandlers/admin_panel_subscription_details.js';
import AdminPanelSubscriptions from './pageHandlers/admin_panel_subscriptions.js';
import CheckoutHandler from './pageHandlers/checkout_handler.js';
import ContactUsHandler from './pageHandlers/contact_us_handler.js';
import IndexHandler from './pageHandlers/index_handler.js';
import OrderHandler from './pageHandlers/order_handler.js';
import ShopHandler from './pageHandlers/shop_handler.js';
import NavigationMenu from './pageUtils/navigation_menu.js';
import SubscriptionFooter from './pageUtils/subscription_footer.js';
import SidebarCart from './pageUtils/sidebar_cart.js';
import Footer from './pageUtils/footer.js';
import ProductManager from './product_manager.js';
import SessionManager from './session_manager.js';
import SubscriptionManager from './subscription_manager.js';
import Utils from './utils.js';
import AdminPanelAddProductHandler from './pageHandlers/admin_panel_add_product.js';
import AdminPanelAddBundle from './pageHandlers/admin_panel_add_bundle.js';
import AdminPanelAddSale from './pageHandlers/admin_panel_add_sale.js';
import SalesView from './sales_view.js';
import AdminPanelSalesView from './pageHandlers/admin_panel_sales_view.js';
import OrderTrackingHandler from './pageHandlers/order_tracking_handler.js';
import UnsubscribeHandler from './pageHandlers/unsubscribe_handler.js';

(function (window, document, $, undefined) {
  "use strict";

  // ==========================================================
  // Detect mobile device and add class "is-mobile" to </body>
  // ==========================================================

  // Detect mobile device (Do not remove!!!)
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Nokia|Opera Mini/i.test(navigator.userAgent) ? true : false;

  // Add class "is-mobile" to </body>
  if (isMobile) {
    $("body").addClass("is-mobile");
  }
  var MyScroll = "";

  var Init = {
    i: function (e) {
      Init.s();
      Init.methods();
    },
    s: function (e) {
      (this._window = $(window)),
        (this._document = $(document)),
        (this._body = $("body")),
        (this._html = $("html"));
    },
    methods: async function (e) {
      Init.w();
      Init.preloader();
      Init.gsap();
      Init.miniCart();
      Init.searchFunction();
      Init.searchToggle();
      Init.niceSelect();
      Init.billingAddress();
      Init.quantityHandle();
      Init.ionRangeSlider();
      Init.ionRangeSlider2();
      Init.slick();
      Init.filterToggle();
      Init.formValidation();
      Init.odometer();

      const firebaseConfig = {
        apiKey: "AIzaSyD_JqELv-fD8gIoecMf2x1MnJ1nZ2Pp97I",
        authDomain: "wrapking-ch.firebaseapp.com",
        projectId: "wrapking-ch",
        storageBucket: "wrapking-ch.firebasestorage.app",
        messagingSenderId: "744848745602",
        appId: "1:744848745602:web:2c629662b8ab63ee6f409b",
        measurementId: "G-C7R6YLB0WD"
      };

      const sessionManager = new SessionManager();
      let isInSession = sessionManager.isInSession();
      console.log("isInSession:" + isInSession);
      if (!isInSession) {
        sessionManager.createDefaultSession();
        let session = sessionManager.getCurrentSession();
        console.log("Created default session:" + session)
      }

      sessionStorage.setItem("firebaseConfig", JSON.stringify(firebaseConfig));
      const utils = new Utils();
      const firebaseManager = new FirebaseManager(firebaseConfig);

      const couponManager = new CouponManager(firebaseConfig, utils);

      const cartManager = new CartManager({
        deliveryCosts: 5.0,
        productListSelector: ".product-list",
        subtotalSelector: "#subtotal",
        cartTableBodySelector: ".cart-table tbody",
        subtotalOfItemsSelector: "#subtotal-of-items",
        totalPriceSelector: "#total-price"
      }, firebaseManager, sessionManager, couponManager);

      const productManager = new ProductManager(firebaseConfig, utils);
      const orderManager = new OrderManager(firebaseConfig, productManager);
      const subscriptionManager = new SubscriptionManager(firebaseConfig, couponManager, orderManager, utils);
      
      const salesView = new SalesView(firebaseConfig, orderManager);

      const indexHandler = new IndexHandler(productManager, utils, sessionManager, couponManager, subscriptionManager, cartManager);
      const unsubscribeHandler = new UnsubscribeHandler(subscriptionManager);
      const orderTrackingHandler = new OrderTrackingHandler(orderManager, utils);
      const adminProductsHandler = new AdminPanelProductsHandler(productManager);
      const adminAddProductHandler = new AdminPanelAddProductHandler(productManager);
      const adminCouponsHandler = new AdminPanelCouponsHandler(couponManager);
      const adminPanelSalesView= new AdminPanelSalesView(salesView);
      const orderHandler = new OrderHandler(orderManager, couponManager, utils);
      const checkoutHandler = new CheckoutHandler(orderManager, cartManager, firebaseManager, sessionManager, couponManager, subscriptionManager, utils, productManager);
      const shopHandler = new ShopHandler(productManager, sessionManager, subscriptionManager);
      const adminOrderHandler = new AdminOrdersHandler(orderManager, couponManager, salesView);
      const adminEditProductHandler = new AdminPanelEditProductHandler(productManager);
      const adminPanelAddBundle = new AdminPanelAddBundle(productManager, couponManager);
      const adminPanelAddSale = new AdminPanelAddSale(productManager);
      const adminOrderTrackingHandler = new AdminOrderTrackingHandler(orderManager);
      const adminPanelCashHandler = new AdminPanelCashHandler(productManager, orderManager);
      const adminPanelCashOrderHandler = new AdminPanelCashOrderHandler(orderManager);
      const adminPanelSubscriptions = new AdminPanelSubscriptions(subscriptionManager);
      const adminPanelSubscriptionDetails = new AdminPanelSubscriptionDetails(subscriptionManager, orderManager);
      const adminPanelSendMail = new AdminPanelSendMail();
      const contactUs = new ContactUsHandler();

      const sidebarCart = new SidebarCart();
      const subscriptionFooter = new SubscriptionFooter();
      const footer = new Footer();

      document.addEventListener("DOMContentLoaded", function() {
          const navigationMenu = new NavigationMenu();
          console.log("Nav menu loaded")
          // Init.countdownInit(".countdown", "2025/04/04 10:30:00");
      });
    

      firebaseManager.setCartManager(cartManager);

      if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
        indexHandler.init();
      }          
      
      if (document.URL.includes("admin-panel-products.html")) {
        adminProductsHandler.init();
      }

      if (document.URL.includes("admin-panel-add-product.html")) {
        adminAddProductHandler.init();
      }

      if (document.URL.includes("admin-panel-add-bundle.html")) {
        adminPanelAddBundle.init();
      }

      if (document.URL.includes("admin-panel-add-sale.html")) {
        adminPanelAddSale.init();
      }

      if (document.URL.includes("admin-panel-sales.html")) {
        adminPanelSalesView.init();
      }

      if (document.URL.includes("order.html")) {
        orderHandler.init();
      }

      if (document.URL.includes("order-tracking.html")) {
        orderTrackingHandler.init();
      }

      if (document.URL.includes("unsubscribe.html")) {
        unsubscribeHandler.init();
      }

      if (document.URL.includes("admin-panel-coupons.html")) {
        adminCouponsHandler.init();
      }

      if (document.URL.includes("checkout.html")) {
        checkoutHandler.init();
      }

      if (document.URL.includes("shop.html")) {
        shopHandler.init();
      }

      if (document.URL.includes("admin-orders.html")) {
        adminOrderHandler.init();
      }

      if (document.URL.includes("admin-panel-edit-product.html")) {
        adminEditProductHandler.init();
      }

      if (document.URL.includes("admin-order-tracking.html")) {
        adminOrderTrackingHandler.init();
      }

      if (document.URL.includes("admin-panel-cash.html")) {
        adminPanelCashHandler.init();
      }

      if (document.URL.includes("admin-panel-cash-order-detail.html")) {
        adminPanelCashOrderHandler.init();
      }

      if (document.URL.includes("admin-panel-subscriptions.html")) {
        adminPanelSubscriptions.init();
      }

      if (document.URL.includes("admin-panel-subscription-details.html")) {
        adminPanelSubscriptionDetails.init();
      }

      if (document.URL.includes("admin-panel-send-email.html")) {
        adminPanelSendMail.init();
      }

      if (document.URL.includes("contact-us.html")) {
        contactUs.init();
      }

      document.addEventListener('click', async function (event) {
        try {
            // Find the closest button with the class 'cart-button'
            const button = event.target.closest('.cart-button');
            if (!button) return; // Exit if no .cart-button was clicked
    
            const productKey = button.dataset.value;
            if (!productKey) {
                console.error("Missing data-value attribute on cart button");
                return;
            }
    
            // Handle "Personalised Wrap" case separately
            if (productKey === "personalised-wrap") {
                await handlePersonalisedWrap();
                return;
            }
    
            // Fetch product details using the product key
            let productDoc = await productManager.getProduct(productKey);
            let product = productDoc?.data(); // Safely access data()
    
            if (product) {
                let convertedProduct = {
                    name: product.productName,
                    price: parseFloat(product.productPrice).toFixed(2),
                    image: product.productFilename,
                    stock: product.productStock,
                    id: productDoc.id
                };
    
                // Check if the product already exists in the cart
                const existingProduct = cartManager.findProductByKey(productKey);
                if (existingProduct) {
                    existingProduct.quantity++;
                    cartManager.updateCart(existingProduct);
                } else {
                    cartManager.updateCart({
                        key: productKey,
                        ...convertedProduct,
                        quantity: 1
                    });
                }
    
                // Update the cart display
                cartManager.updateCartHTML();
                cartManager.updateCartTableHTML();
    
                // Toggle sidebar cart visibility
                var $body = $("body");

                $body.toggleClass("show-sidebar-cart");

                if ($("#sidebar-cart-curtain").is(":visible")) {
                  $("#sidebar-cart-curtain").fadeOut(500);
                } else {
                  $("#sidebar-cart-curtain").fadeIn(500);
                }
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    });
    
    // Function to handle "Personalised Wrap" logic
    async function handlePersonalisedWrap() {
        try {
            const personalisedWrapData = {
                name: "Personalised Wrap",
                price: 14.80,
                image: "p_1",
                stock: "999999"
            };
    
            await utils.waitForCustomWrapSubmission();
    
            // Retrieve selected ingredients from sessionStorage
            const selectedIngredients = JSON.parse(sessionStorage.getItem('selectedIngredients')) || [];
    
            // Generate a unique key for the wrap based on its ingredients
            const uniqueKey = `personalised-wrap-${JSON.stringify(selectedIngredients)}`;
    
            // Check if a similar "Personalised Wrap" with the same ingredients already exists in the cart
            const existingProduct = cartManager.findProductByKey(uniqueKey);
            if (existingProduct) {
                existingProduct.quantity++;
                cartManager.updateCart(existingProduct);
            } else {
                let description = utils.getWrapDescription(selectedIngredients);
                cartManager.updateCart({
                    key: uniqueKey,
                    ...personalisedWrapData,
                    quantity: 1,
                    ingredients: selectedIngredients,
                    description: description
                });
            }

            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
              checkbox.checked = false;
            });
    
            // Update the cart display
            cartManager.updateCartHTML();
            cartManager.updateCartTableHTML();
        } catch (error) {
            console.error("Error handling personalised wrap:", error);
        }
      }  
    },


    w: function (e) {
      this._window.on("load", Init.l).on("scroll", Init.res);
    },
    preloader: function () {
      setTimeout(function () { $('#preloader').hide('slow') }, 3000);
    },
    gsap: function () {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
      if (window.innerWidth > 1024) {
        MyScroll = ScrollSmoother.create({
          smooth: 1,
          effects: true,
          smoothTouch: 1,
        });
        MyScroll.scrollTo(0);

      }

      // Hero Banner 1
      if ($('.hero-banner-1').length) {

        if (window.innerWidth > 1199) {

          gsap.set(".img-1", { scale: 1, x: '0%' })
          gsap.set(".img-2", { scale: 0.4, x: '50%' })
          gsap.set(".img-3", { scale: 0.4, x: '100%' })
          gsap.set(".img-4", { scale: 0.4, x: '100%' })

          const innerAnimation = gsap
            .timeline({ defaults: { ease: "power2.inOut" } })

            .to(".img-1", { scale: '0.2', x: '-135%', y: '13vw' })            
            .to(".img-2", { scale: '1', x: '0%' }, '<')
            .to(".img-3", { x: '50%' }, '<')

            .to(".img-2", { scale: '0.17', x: '-119%', y: '13vw' })
            .to(".img-3", { scale: '1', x: '0%' }, '<')
            .to(".img-4", { x: '50%' }, '<')

            .to(".img-4", { scale: '1', x: '0%' })
            .to(".img-3", { scale: '0.2', x: '-101%', y: '12.6vw' }, '<')

          ScrollTrigger.create({
            trigger: "#hero",
            scrub: true,
            pin: true,
            start: "top top",
            end: "+=300%", // Adjust this value based on your design
            animation: innerAnimation,
          });
        }
      }
      // Hero Banner 2
      if ($('.hero-banner-2').length) {
        var background1 = 'radial-gradient(132.53% 136.13% at 42.11% -21.2%, rgba(251, 224, 209, 0.86) 0%, #EE915B 17.5%, #D88555 32.5%, #D7580E 50%, #C64C06 81.43%, #FD650C 100%), #FF5C00';
        var background2 = 'radial-gradient(132.53% 136.13% at 42.11% -21.2%, rgba(251, 241, 209, 0.86) 0%, #EEC95B 17.5%, #D8B755 32.5%, #D7A50E 50%, #C69606 81.43%, #FDC10C 100%), #FFC82A';
        var background3 = 'radial-gradient(132.53% 136.13% at 42.11% -21.2%, rgba(251, 209, 209, 0.86) 0%, #EE5B5B 17.5%, #D85555 32.5%, #D70E0E 50%, #C60606 81.43%, #FD0C0C 100%), #830000';
        var background4 = 'radial-gradient(132.53% 136.13% at 42.11% -21.2%, rgba(209, 246, 251, 0.86) 0%, #5BDDEE 17.5%, #55C9D8 32.5%, #0EC0D7 50%, #06B0C6 81.43%, #0CE1FD 100%), #007483';
        var background5 = 'radial-gradient(132.53% 136.13% at 42.11% -21.2%, rgba(209, 251, 213, 0.86) 0%, #5BEE67 17.5%, #55D860 32.5%, #0ED71F 50%, #06C616 81.43%, #0CFD20 100%), #1CC52B';
        var fill = 'rgba(252, 253, 253, 0.30)'

        gsap.set("#hero", { background: background1 })

        const innerAnimation = gsap
          .timeline({ defaults: { ease: "power2.inOut" } })

          .to(".dish", { rotate: '180deg' })
          .to(".title-1", { scale: '0.5', y: '-102%' }, '<')
          .to(".title-2", { scale: '1', y: '-102%' }, '<')
          .to(".fish-soup path", { fillOpacity: 1 }, '<')
          .to(".mapo-tofu path", { fillOpacity: 0.3 }, '<')
          .to(".elem-1", { opacity: '0' }, '<')
          .to(".elem-2", { opacity: '1' }, '<')
          .to(".dotted", { rotate: '30deg' }, '<')
          .to("#hero", { background: background2 }, '<')
          .to(".img-3", { opacity: '1' }, '<')

          .to(".dish", { rotate: '360deg' })
          .to(".title-2", { scale: '0.5', y: '-202%' }, '<')
          .to(".title-3", { scale: '1', y: '-202%' }, '<')
          .to(".chilli-chicken path", { fillOpacity: 1 }, '<')
          .to(".fish-soup path", { fillOpacity: 0.3 }, '<')
          .to(".elem-2", { opacity: '0' }, '<')
          .to(".elem-3", { opacity: '1' }, '<')
          .to(".dotted", { rotate: '65.61deg' }, '<')
          .to("#hero", { background: background3 }, '<')
          .to(".img-4", { opacity: '1' }, '<')

          .to(".dish", { rotate: '540deg' })
          .to(".title-3", { scale: '0.5', y: '-302%' }, '<')
          .to(".title-4", { scale: '1', y: '-302%' }, '<')
          .to(".lamb-chops path", { fillOpacity: 1 }, '<')
          .to(".chilli-chicken path", { fillOpacity: 0.3 }, '<')
          .to(".elem-3", { opacity: '0' }, '<')
          .to(".elem-4", { opacity: '1' }, '<')
          .to(".dotted", { rotate: '104deg' }, '<')
          .to("#hero", { background: background4 }, '<')
          .to(".img-5", { opacity: '1' }, '<')

          .to(".dish", { rotate: '720deg' })
          .to(".title-4", { scale: '0.5', y: '-402%' }, '<')
          .to(".title-5", { scale: '1', y: '-402%' }, '<')
          .to(".vegetables path", { fillOpacity: 1 }, '<')
          .to(".lamb-chops path", { fillOpacity: 0.3 }, '<')
          .to(".elem-4", { opacity: '0' }, '<')
          .to(".elem-5", { opacity: '1' }, '<')
          .to(".dotted", { rotate: '135deg' }, '<')
          .to("#hero", { background: background5 }, '<')

        ScrollTrigger.create({
          trigger: "#hero",
          scrub: true,
          pin: true,
          start: "top top",
          end: "+=500%", // Adjust this value based on your design
          animation: innerAnimation,
        });
      }

      // ==================================
      // Header tools
      // ==================================

      // If ui-Header tools exist
      if ($(".ui-header-tools").length) {
        $("body").addClass("ui-header-tools-on");

        // Header tools dynamic
        // =====================
        if ($(".ui-header-tools-dynamic").length) {
          $("body").addClass("ui-header-tools-dynamic-on");

          // Move header tools dynamic out of header if the window width is 768px or smaller
          function headerToolsPosition() {
            if (window.matchMedia("(max-width: 768px)").matches) {
              $(".ui-header-tools-dynamic").prependTo("#body-inner");
            } else {
              $(".ui-header-tools-dynamic").prependTo(".ui-header-tools");
            }
          }
          headerToolsPosition();
          $(window).resize(function () {
            headerToolsPosition();
          });
        }
      }


      // ==================================================
      // Overlay menu
      // ==================================================


      // On menu toggle button click
      // ============================

      $(document).on("click", ".ui-ol-menu-toggle-btn-text, .ui-ol-menu-toggle-btn", function () {
        $("html").toggleClass("ui-no-scroll");
        $("body").toggleClass("ui-ol-menu-open");
    
        if ($("body").hasClass("ui-ol-menu-open")) {
            $("body").addClass("olm-toggle-no-click");
    
            var tl_olMenuIn = gsap.timeline({
                onComplete: function () {
                    $("body").removeClass("olm-toggle-no-click");
                },
            });
    
            tl_olMenuIn.to(".ui-overlay-menu", { duration: 0.4, autoAlpha: 1 });
            tl_olMenuIn.from(".ui-ol-menu-list > li", {
                duration: 0.4,
                y: 80,
                autoAlpha: 0,
                stagger: 0.05,
                ease: Power2.easeOut,
                clearProps: "all",
            });
    
            $(".ui-overlay-menu a, .ui-logo a")
                .not('[target="_blank"]')
                .not('[href^="#"]')
                .not('[href^="mailto"]')
                .not('[href^="tel"]')
                .on("click", function () {
                    gsap.set("#content-wrap, .ttgr-cat-nav", { autoAlpha: 0 });
                    var tl_olMenuClick = gsap.timeline();
                    tl_olMenuClick.to(".ui-ol-menu-list > li", {
                        duration: 0.4,
                        y: -80,
                        autoAlpha: 0,
                        stagger: 0.05,
                        ease: Power2.easeIn,
                    });
                });
    
            if ($(".ui-sliding-sidebar-wrap").length) {
                gsap.to(".ui-sliding-sidebar-trigger", {
                    duration: 1,
                    autoAlpha: 0,
                    ease: Expo.easeOut,
                });
            }
        } else {
            $("body").addClass("olm-toggle-no-click");
    
            var tl_olMenuOut = gsap.timeline({
                onComplete: function () {
                    $("body").removeClass("olm-toggle-no-click");
                },
            });
    
            tl_olMenuOut.to(".ui-ol-menu-list > li", {
                duration: 0.4,
                y: -80,
                autoAlpha: 0,
                stagger: 0.05,
                ease: Power2.easeIn,
            });
            tl_olMenuOut.to(
                ".ui-overlay-menu",
                { duration: 0.4, autoAlpha: 0, clearProps: "all" },
                "+=0.2"
            );
            tl_olMenuOut.set(".ui-ol-menu-list > li", { clearProps: "all" });
    
            if ($(".ui-sliding-sidebar-wrap").length) {
                gsap.to(
                    ".ui-sliding-sidebar-trigger",
                    {
                        duration: 1,
                        autoAlpha: 1,
                        ease: Expo.easeOut,
                        clearProps: "all",
                    },
                    "-=0.3"
                );
            }
    
            setTimeout(function () {
                $(".ui-ol-submenu").slideUp(350);
                $(".ui-ol-submenu-trigger").removeClass("ui-ol-submenu-open");
            }, 500);
        }
    
        return false;
      });
    
      // Menu list hover
      $(".ui-ol-menu-list")
        .on("mouseenter", function () {
          $(this).addClass("ui-ol-menu-hover");
        })
        .on("mouseleave", function () {
          $(this).removeClass("ui-ol-menu-hover");
        });

      // Open submenu if link href contains #
      $(document).on("click", ".ui-ol-submenu-trigger > a", function (event) {
          event.preventDefault(); // Prevent default anchor behavior
      
          if ($(this).is('[href^="#"]')) {
              var $this = $(this).parent();
              if ($this.hasClass("ui-ol-submenu-open")) {
                  $this.removeClass("ui-ol-submenu-open");
                  $this.next().slideUp(350);
              } else {
                  // Close other open submenus
                  $this
                      .parent()
                      .parent()
                      .find(".ui-ol-submenu")
                      .prev()
                      .removeClass("ui-ol-submenu-open");
                  $this.parent().parent().find(".ui-ol-submenu").slideUp(350);
      
                  // Open the clicked submenu
                  $this.toggleClass("ui-ol-submenu-open");
                  $this.next().slideToggle(350);
              }
          }
      });

      // Open submenu on caret click
      $(".ui-ol-submenu-caret-wrap").on("click", function () {
        var $this = $(this).parent();
        if ($this.hasClass("ui-ol-submenu-open")) {
          $this.removeClass("ui-ol-submenu-open");
          $this.next().slideUp(350);
        } else {
          $this
            .parent()
            .parent()
            .find(".ui-ol-submenu")
            .prev()
            .removeClass("ui-ol-submenu-open");
          $this.parent().parent().find(".ui-ol-submenu").slideUp(350);
          $this.toggleClass("ui-ol-submenu-open");
          $this.next().slideToggle(350);
        }
      });

    },
    miniCart: function () {
      $(document).ready(function ($) {
        var $body = $("body");

        $(".cart-button, .close-button, #sidebar-cart-curtain").click(function (e) {
          e.preventDefault();

          $body.toggleClass("show-sidebar-cart");

          if ($("#sidebar-cart-curtain").is(":visible")) {
            $("#sidebar-cart-curtain").fadeOut(500);
          } else {
            $("#sidebar-cart-curtain").fadeIn(500);
          }
        });
      });
    },


    searchFunction: function () {
      if ($("#searchInput").length) {
        $("#searchInput").on("keyup", function () {
          var value = $(this).val().toLowerCase();
          $(".product-card").filter(function () {
            var hasMatch = $(this).find(".title").text().toLowerCase().indexOf(value) > -1;
            $(this).toggle(hasMatch);
          });
        });
      }
    },
    billingAddress: function () {
      if ($("#bill-address").length) {
        $(".billing-address-block").hide();
        $("#bill-address").change(function () {
          if ($(this).is(":checked")) {
            $(".billing-address-block").hide("slow");
          } else {
            $(".billing-address-block").show("slow");
          }
        });
      }
    },
    countdownInit: function (countdownSelector, countdownTime) {
      var eventCounter = document.getEl
      if (eventCounter.length) {
        eventCounter.countdown(countdownTime, function (e) {
          $(this).html(
            e.strftime(
              '<li><h3>%D</h3><p>Days</p></li>\
              <li><h3>%H</h3><p>Hrs</p></li>\
              <li><h3>%M</h3><p>Min</p></li>\
              <li><h3>%S</h3><p>Sec</p></li>'
            )
          );
        });
      }
    },
    searchToggle: function () {
      if ($(".search-toggler").length) {
        $(".search-toggler").on("click", function (e) {
          e.preventDefault();
          $(".search-popup").toggleClass("active");
          $(".mobile-nav__wrapper").removeClass("expanded");
          $("body").toggleClass("locked");
        });
      }
    },
    niceSelect: function () {
      if ($(".has-nice-select").length) {
        $('.has-nice-select, .contact-form select').niceSelect();
      }
    },
    ionRangeSlider: function () {
      var custom_values = [0, 1, 2];
      var my_from = custom_values.indexOf(1);
      var my_to = custom_values.indexOf(2);
      $(".js-range-slider2").ionRangeSlider({
        from: my_from,
        to: my_to,
        values: custom_values
      });
    },
    ionRangeSlider2: function () {
      var $range = $(".js-range-slider"),
        $inputFrom = $(".js-input-from"),
        $inputTo = $(".js-input-to"),
        instance,
        min = 30,
        max = 300,
        from = 0,
        to = 0;

      $range.ionRangeSlider({
        skin: "flat",
        type: "double",
        min: min,
        max: max,
        from: 30,
        to: 300,
        onStart: updateInputs,
        onChange: updateInputs
      });
      instance = $range.data("ionRangeSlider");

      function updateInputs(data) {
        from = data.from;
        to = data.to;

        $inputFrom.prop("value", from);
        $inputTo.prop("value", to);
      }

      $inputFrom.on("input", function () {
        var val = $(this).prop("value");

        // validate
        if (val < min) {
          val = min;
        } else if (val > to) {
          val = to;
        }

        instance.update({
          from: val
        });
      });

      $inputTo.on("input", function () {
        var val = $(this).prop("value");

        // validate
        if (val < from) {
          val = from;
        } else if (val > max) {
          val = max;
        }

        instance.update({
          to: val
        });
      });
    },
    slick: function () {
      if ($(".testimonial-slider-slick").length) {
        $(".testimonial-slider-slick").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          centerPadding: "0",
          infinite: true,
          cssEase: "linear",
          autoplay: false,
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 650,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      if ($(".brands-slider-slick").length) {
        $(".brands-slider-slick").slick({
          slidesToShow: 5,
          arrows: false,
          dots: false,
          infinite: true,
          autoplay: true,
          cssEase: "linear",
          autoplaySpeed: 0,
          speed: 6000,
          pauseOnFocus: false,
          pauseOnHover: false,
          responsive: [
            {
              breakpoint: 1399,
              settings: {
                slidesToShow: 4,
              },
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 575,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 450,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      $('.testimonial-slider').slick({
        autoplay: false,
        speed: 800,
        lazyLoad: 'progressive',
        arrows: true,
        infinite: true,
        dots: false,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1199,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
            },
          },
          {
            breakpoint: 492,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });
      $(".prev-btn").click(function () {
        var $this = $(this).attr("data-slide");
        $('.' + $this).slick("slickPrev");
      });

      $(".next-btn").click(function () {
        var $this = $(this).attr("data-slide");
        $('.' + $this).slick("slickNext");
      });

    },
    quantityHandle: function () {
      $(".decrement").on("click", function () {
        var qtyInput = $(this).closest(".quantity-wrap").children(".number");
        var qtyVal = parseInt(qtyInput.val());
        if (qtyVal > 0) {
          qtyInput.val(qtyVal - 1);
        }
      });
      $(".increment").on("click", function () {
        var qtyInput = $(this).closest(".quantity-wrap").children(".number");
        var qtyVal = parseInt(qtyInput.val());
        qtyInput.val(parseInt(qtyVal + 1));
      });
    },
    filterToggle: function () {
      if ($('.sidebar-widget').length) {
        $(".widget-title-row").on("click", function (e) {
          $(this).find('i').toggleClass('fa-horizontal-rule fa-plus', 'slow');
          $(this).find('i').toggleClass('fa-light fa-regular', 'slow');
          $(this).parents('.sidebar-widget').find('.widget-content-block').animate({ height : 'toggle'}, 'slow');
        })
      }
    },
    formValidation: function () {
      // if ($(".contact-form").length) {
      //   $(".contact-form").validate();
      // }

      // This puts the email and password as url and that is not good. I removed it.
      // if ($(".login-form").length) {
      //   $(".login-form").validate();
      // }
    },
    odometer: function () {
      if ($(".count_one").length) {
        $(".count_one").appear(function (e) {
          var odo = $(".count_one");
          odo.each(function () {
            var countNumber = $(this).attr("data-count");
            $(this).html(countNumber);
          });
        });
      }
    },

  };

  Init.i();
})(window, document, jQuery);