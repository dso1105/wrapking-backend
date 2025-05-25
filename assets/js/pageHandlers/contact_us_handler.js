export default class ContactUsHandler {
    
    init() {
        this.addEventListeners();
    }

    addEventListeners() {
        document.getElementById("send-mail").addEventListener("click", async (event) => {
            event.preventDefault();
            let formData = this.collectFormData();
            let body = this.getBody(formData.name, formData.email, formData.reason, formData.emailContent);
            await this.sendEmail(formData, body);

            location.reload()
        });
    }

    collectFormData() {
        return {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            reason: document.getElementById("reason").value,
            emailContent: document.getElementById("email-content").value            
        };
    }

    getBody(name, email, reason, emailContent) {
        return `
        <h4>Ein Kunde stellte eine Kontaktanfrage. Details:</h4>
        <p>Name: ${name}</p>
        <p>Email des Kundens: ${email}</p>
        <p>Grund: ${reason}</p>
        <br>
        <br>
        <p>Der Kunde schrieb:</p>
        <p>${emailContent}</p>
        `;
    }

    async sendEmail(formData, bodyHTML) {
        const emailData = {
            firstName: "ADMIN",
            lastName: "ADMIN",
            email: "jeremoc@icloud.com",
            subject: `Neue Kundenanfrage - ` + formData.name,
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
            console.error("Error sending confirmation email:", error);
        }
    }
}
