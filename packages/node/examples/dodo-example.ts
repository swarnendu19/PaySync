import { PaySync } from "../src/index";

// Example usage of DODO payment integration
async function dodoExample() {
    // Initialize DODO client
    const dodo = new PaySync.Dodo({
        apiKey: "your_api_key_here",
        secretKey: "your_secret_key_here",
        sandbox: true // Use sandbox for testing
    });

    try {
        // Create a payment
        const paymentPayload = {
            order_id: "order_123",
            amount: 100.00,
            currency: "USD" as const,
            items: [
                {
                    name: "Premium Subscription",
                    description: "Monthly premium subscription",
                    quantity: 1,
                    unit_price: 100.00,
                    currency: "USD" as const
                }
            ],
            customer: {
                email: "customer@example.com",
                name: "John Doe"
            },
            callback_urls: {
                success_url: "https://yoursite.com/success",
                cancel_url: "https://yoursite.com/cancel",
                webhook_url: "https://yoursite.com/webhook"
            },
            metadata: {
                user_id: "user_456"
            }
        };

        // Create payment and get checkout URL
        const paymentUrl = await dodo.createPayment(paymentPayload);
        console.log("Payment URL:", paymentUrl);

        // Get payment status (example with payment ID)
        // const paymentStatus = await dodo.getPaymentStatus("payment_id_here");
        // console.log("Payment Status:", paymentStatus);

        // Example webhook processing
        const webhookPayload = '{"event_type":"payment.completed","payment_id":"pay_123","order_id":"order_123","status":"completed","amount":100,"currency":"USD","timestamp":"1640995200","signature":"sha256=..."}';
        const signature = "sha256=example_signature";
        const timestamp = "1640995200";

        try {
            const processedWebhook = dodo.processWebhook(webhookPayload, signature, timestamp);
            console.log("Webhook processed:", processedWebhook);
        } catch (error) {
            console.error("Webhook verification failed:", error);
        }

    } catch (error) {
        console.error("DODO payment error:", error);
    }
}

// Run the example
dodoExample();