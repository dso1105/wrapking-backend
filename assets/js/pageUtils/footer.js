class Footer {      

    constructor() {
        this.footerElement = null;
        if (this.shouldPlaceFooter()) {
            console.log("Loading footer");
            this.loadFooter();
        } else {
            console.log("This website don't need a footer.")
        }
    }

    shouldPlaceFooter() {
        this.footerElement = document.getElementById("footerModule");
        return this.footerElement !== null;
    }

    loadFooter() {
        let footerCode = `
            <div class="footer-main">
                <!-- <img src="assets/media/bg/footer-bg.png" alt="" class="footer-bg-vetor"> -->
                <div class="container-fluid">
                    <div class="row align-items-center">
                        <div class="col-xl-3 text-xl-left text-center">
                            <a href="index.html" class="mb-xl-0 mb-32"> <img src="assets/media/logo-white.png" alt=""></a>
                        </div>
                        <div class="col-xl-6">
                            <ul class="footer-nav unstyled mb-xl-0 mb-32">
                                <li><a href="index.html">Startseite</a></li>
                                    <li><a href="menu.html">Menü</a></li>
                                    <li><a href="about.html">Über uns</a></li>
                                    <!--
                                    <li><a href="blog-grid.html">Blog</a></li>
                                    -->
                                    <li><a href="contact-us.html">Kontakt</a></li>
                            </ul>
                        </div>
                        <div class="col-xl-3">
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
            <div class="footer-bottom">
                <div class="container-fluid">
                    <div class="bottom-row">
                        <div class="copyright-text">
                            
                            <p>© 2024. All rights reserved by <a href="index.html">Wrapking</a></p>
                            <br>
                            <p>FullStack Development by Jeremias Mock - <a href="https://de.linkedin.com/in/jeremias-mock">Visit my LinkedIn</a></p>
                        </div>
                        <div class="right-block">
                            <a href="">Privacy Policy</a>
                            <a href="">Terms and Condition</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.footerElement.innerHTML = footerCode;

    }

}

export default Footer;
