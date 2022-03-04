const stripe = Stripe('pk_live_51KX5KSB12a19Nx8NsNqHzafGAO7QfPgSy3uIPJFrX2j50QMtUVlZcOGHIlwRr6l2Q1c9bWu27jCJR4whgef835Sd00q75elONn');
const items = [{id: ""}];
let elements;
initialize();
checkStatus();
document.querySelector('#payment-form')
.addEventListener("submit", handleSubmit);

async function initialize(){
    const response = await fetch("api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({items}),
    });
    const { clientSecret } = await response.json();

    const appearance = {
        theme: "stripe",
    };
    elements = stripe.elements({appearance, clientSecret});

    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: "http://localhost:3000/",
        },
    });

    if(error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occured.");
    }

    setLoading(false);
}

async function checkStatus(){
    const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
    );

    if(!clientSecret){
        return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    switch (paymentIntent.status) {
        case "succeeded":
            showMessage("Payment succeeded!");
            break;
        case "processing":
            showMessage("Your payment is processing.");
            break;
        case "requires_payment_method":
            showMessage("Your payment was not successful, please try again.");
            break;
        default:
            showMessage("Something went wrong.");
            break;
    }
}

function showMessage(messageText){
    alert(messageText);
}

function setLoading(isLoading){

}