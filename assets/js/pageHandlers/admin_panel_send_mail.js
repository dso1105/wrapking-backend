export default class AdminPanelSendMail {
    constructor() {
        // Select DOM elements
        this.textarea = document.getElementById("additional-note");
        this.addCouponButton = document.getElementById("add-coupon");
        this.addTitleButton = document.getElementById("add-title");
        this.addButtonButton = document.getElementById("add-button");
        this.sendMailButton = document.getElementById("send-mail");
        this.sendOfficalMailButton = document.getElementById("send-offical-mail");
        this.previewContainer = document.getElementById("preview");
        this.subjectElement = document.getElementById("subject");
        this.receiverElement = document.getElementById("receiver");
        this.htmlContent = null;    
        // Static email template
        this.staticContainer = `
            <body>
                <div class="container">
                    <!-- Header -->
                        <header>
                            <div style="text-align:center;">
                                <img src="assets/media/logo.png" alt="Wrapking Logo" style="max-width:150px;">
                            </div>
                        </header>
                    </section>
                    
                        <div class="page-content">  
                            <section class="pt-10 pb-40 lead">
                                <div class="container-fluid" style="text-align:center;">
                                    <div class="offset-xl-2 offset-g-1">
                                </div>
                                $BODY$
                            </section>
                        </div>
                        <br>
                        <br>
                    <section>
                        <!-- Footer -->
                        <footer style="margin-top:40px;text-align:center;color:#999;">
                            <p>If you have any questions, contact us at info@wrapking.net.</p>
                            <p>&copy; 2025 Wrapking. All rights reserved.</p>
                            <a href="https://wrapking.net/unsubscribe.html?subID=">unsubscribe from newsletter</a>
                        </footer>
                    </section>
                </div>
            </body>
            `;
    }
    
    init() {
        // Inject styles into the document head
        this.injectStyles();
    
        // Add event listeners for textarea input and buttons
        this.textarea.addEventListener("input", () => this.updatePreview());
        this.addCouponButton.addEventListener("click", () => this.addCoupon());
        this.addTitleButton.addEventListener("click", () => this.addTitle());
        this.addButtonButton.addEventListener("click", () => this.addButton());
        this.sendMailButton.addEventListener("click", async () => await this.handleMail());
        this.sendOfficalMailButton.addEventListener("click", async () => await this.handleOfficalMail());
    
        // Initialize the preview with default content
        this.updatePreview();
    }
    

    injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
            h1 { color: #FF5C00; }
            .color-primary { color: #FF5C00 !important; }
            .lead { font-size: 16px; margin-bottom: 12px; }
            .custom-btn { display: inline-block; padding: 10px 20px; background-color: #FF5C00; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            :root {
                color-scheme: light;
                supported-color-schemes: light;
            }
            .coupon-container {
                display: inline-block; 
                background-color: #F0F0F0;
                border-radius: 15px; 
                padding: 10px 20px;
                text-align: center;
            }
        `;
        document.head.appendChild(styleElement);
    }

    updatePreview() {
        // Get the content of the textarea
        let content = this.textarea.value;
    
        // Replace newlines with <br> tags to preserve formatting
        content = content.replace(/\n/g, '<br>');
    
        // Replace $couponCode:<value>$ with a styled coupon container
        content = content.replace(/\$couponCode:(.*?)\$/g, (match, code) => {
            return `<div class="coupon-container"><h6 class="desc color-green">${code}</h6></div>`;
        });
    
        // Replace $title:<size>:<value>$ with a dynamic title size and text
        content = content.replace(/\$title:(h[1-6]):(.*?)\$/g, (match, size, text) => {
            return `<${size} class="title">${text}</${size}>`;
        });
    
        // Replace $button:<text>:<href>$ with a styled button
        content = content.replace(/\$button:(.*?):(.*?)\$/g, (match, text, href) => {
            return `<a href="${href}" class="custom-btn">${text}</a>`;
        });
    
        // Replace $BODY$ in the static container with the processed content
        this.htmlContent = content;
        const updatedContent = this.staticContainer.replace(/\$BODY\$/g, content);
    
        // Update the preview container with the processed content
        this.previewContainer.innerHTML = updatedContent;
    }
    
    addCoupon() {
        const cursorPosition = this.textarea.selectionStart;

        // Insert "$couponCode$" at the current cursor position in the textarea
        const textBefore = this.textarea.value.substring(0, cursorPosition);
        const textAfter = this.textarea.value.substring(cursorPosition);
        this.textarea.value = `${textBefore}$couponCode:$${textAfter}`;

        // Update the preview after modifying the content
        this.updatePreview();

        // Refocus on the textarea and adjust cursor position
        this.textarea.focus();
        this.textarea.selectionStart = cursorPosition + "$couponCode$".length;
        this.textarea.selectionEnd = cursorPosition + "$couponCode$".length;
    }

    addTitle() {
        const cursorPosition = this.textarea.selectionStart;

        // Insert "$couponCode$" at the current cursor position in the textarea
        const textBefore = this.textarea.value.substring(0, cursorPosition);
        const textAfter = this.textarea.value.substring(cursorPosition);
        this.textarea.value = `${textBefore}$title:h4:$${textAfter}`;

        // Update the preview after modifying the content
        this.updatePreview();

        // Refocus on the textarea and adjust cursor position
        this.textarea.focus();
        this.textarea.selectionStart = cursorPosition + "$title:h4:$".length;
        this.textarea.selectionEnd = cursorPosition + "$title:h4:$".length;
    }

    addButton() {
        const cursorPosition = this.textarea.selectionStart;
    
        // Insert "$button:Text:Link$" at the current cursor position in the textarea
        const textBefore = this.textarea.value.substring(0, cursorPosition);
        const textAfter = this.textarea.value.substring(cursorPosition);
        
        const defaultText = "Click Me";
        const defaultHref = "https://example.com";
    
        this.textarea.value = `${textBefore}$button:${defaultText}:${defaultHref}$${textAfter}`;
    
        // Update the preview after modifying the content
        this.updatePreview();
    
        // Refocus on the textarea and adjust cursor position
        const placeholderLength = `$button:${defaultText}:${defaultHref}$`.length;
        this.textarea.focus();
        this.textarea.selectionStart = cursorPosition + placeholderLength;
        this.textarea.selectionEnd = cursorPosition + placeholderLength;
    }

    async handleMail() {
        this.sendMail("jeremoc@icloud.com", this.subjectElement.value);
        alert("Hello Admin, we sent you the preview via email. Please make sure you check everything before sending it to the real email.");
    }

    async handleOfficalMail() {
        this.sendMail(this.receiverElement.value, this.subjectElement.value);       
        alert("Email sent to client(s).", this.receiverElement.value);
    }

    async sendMail(email, subject) {

        let body_html = `
        <div class="page-content">  
            <section class="pt-10 pb-40 lead">
                <div class="container-fluid" style="text-align:center;">
                    <div class="offset-xl-2 offset-g-1">
                </div>
                ${this.htmlContent}
            </section>
        </div>
        `;

        const emailData = {
            firstName: "Test",
            lastName: "Test",
            email: email,
            subject: subject,
            bodyHTML: body_html,
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
            console.error("Error sending confirmation email:", error);
        }
    }
}
