class SubscriptionFooter {      

    constructor() {
        this.subscriptionFooterElement = null;
        if (this.shouldPlacesubscriptionFooter()) {
            console.log("Loading footer")
            this.loadsubscriptionFooter();
        } else {
            console.log("This website don't need a subscription footer.")
        }
    }

    shouldPlacesubscriptionFooter() {
        this.subscriptionFooterElement = document.getElementById("subscriptionFooterModule");
        return this.subscriptionFooterElement !== null;
    }

    loadsubscriptionFooter() {
        let subscriptionFooterCode = `
            <section class="pt-80">
                <div class="container-fluid">
                    <div class="newsletter-area text-center">
                        <h3 class="mb-48">
                            Abonnieren Sie unseren Newsletter und erhalten Sie <br> <span class="h3 color-primary">20 % Rabatt</span> auf Ihre nächste Bestellung.</h3>
                        <form class="newsletter-form">
                            <div class="form-group">
                                <label>Email</label>
                                <input id="subscribe-email" type="email" name="newsletter" placeholder="email@example.com">
                            </div>
                            <button id="subscribe-button" type="submit" class="cus-btn outline">
                                    <span class="icon-wrapper">
                                    <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <svg class="icon-svg icon-svg-copy" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M16.2522 11.9789C14.4658 10.1925 13.7513 6.14339 15.6567 4.23792M15.6567 4.23792C14.565 5.3296 11.4885 7.21521 7.91576 3.64246M15.6567 4.23792L4.34301 15.5516" stroke="#FCFDFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                                <span class="button-text">Abonnieren</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        `;


        // <div class="form-wrap agreement_checkbox check_box">
        //     <label for="contact-agreement" class="checkbox-inline" style="text-align: center;">
        //         <input id="contact-agreement" class="checkbox-custom" type="checkbox" name="Privacy-Policy-Agreement" value="Got acknowledged and Agreed" data-constraints='@Required(message="You must agree with Privacy Policy to proceed.")'><span>Um fortzufahren, müssen Sie der <a href="privacy-policy.html">Datenschutzrichtlinie</a> zustimmen</span>
        //     </label>
        // </div>

        this.subscriptionFooterElement.innerHTML = subscriptionFooterCode;

    }

}

export default SubscriptionFooter;
