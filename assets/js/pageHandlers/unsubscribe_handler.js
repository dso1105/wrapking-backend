export default class UnsubscribeHandler  {
    constructor (subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
        this.unsubscribeElement = document.getElementById("unsubscribe");
    }

    async init() {
        const sub = this.getSubscriberFromURL();

        this.unsubscribeElement.addEventListener("click", async () => {
            try {
                await this.subscriptionManager.unsubscribe(sub);
                window.location.href = "index.html"
            } catch (error) {
                alert(error);
            }
        });
    }

    getSubscriberFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const docSubID = urlParams.get('subID');
        return docSubID;
    }
}