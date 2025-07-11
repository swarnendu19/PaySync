# PaySync

PaySync is a robust TypeScript library designed to offer a unified interface for seamless integration with multiple payment providers, including Stripe, LemonSqueezy, RozerPay and others. By using PaySync, developers can effortlessly switch between different payment gateways without the need to overhaul their existing payment logic. This simplifies the process of managing diverse payment systems, providing flexibility and scalability while maintaining a consistent and efficient codebase.

## Features

- **PaySync API:** A unified interface to interact seamlessly with multiple payment providers through a single class..
- **Provider Agnostic:** Switch between different payment providers with minimal code changes.
- **Easy Integration:** Simplifies the integration process with well-documented methods and examples.
- **Extensible:** Easily extendable to accommodate new payment providers, ensuring scalability and future-proofing the system.

## Providers

- **Stripe:** (Checkout, Webhook).
- **RazorPay**.
- **Paypal**

## Installation

To install the package, run the following command:

```bash
npm install paysync
```

## Usage

```typescript
// Stripe
const stripe = new PaySync.Stripe(process.env.STRIPE_SECRET_KEY!);

//This is just an Example data
const checkoutDetails = {
  payment_method_types: ["card"],
  line_items: [{ price: "price_1HjHdV2eZvKYlo2CtLzk2uIX", quantity: 1 }],
  mode: "payment",
  success_url: "https://example.com/success",
  cancel_url: "https://example.com/cancel",
};

const checkoutUrl = await stripe.generatePaymentURL(checkoutDetails);
```

## Webhook

```typescript
// Stripe
const stripe = new PaySync.Stripe(process.env.STRIPE_SECRET_KEY!);

const signatureHeader = context.req.header("Stripe-Signature");
if (!signatureHeader) throw new Error("No Signature");

const webhookPayload = {
  signatureHeader: signatureHeader,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  requestBody: await context.req.text(),
};

const webhookEvent = await stripe.validateWebhookSignature(webhookPayload);

if ("error" in webhookEvent) throw new Error(webhookEvent.error.message);

switch (webhookEvent.event.type) {
  case "checkout.session.async_payment_succeeded":
    // Handle successful payment
    break;

  default:
    // Handle other event types if needed
    break;
}
```

## Contributing

We welcome contributions to PaySync! If you'd like to help improve this package, here's how you can contribute:

1. **Fork the Repository**: Start by forking the [PaySync repository](https://github.com/swarnendu19/PaySync) on GitHub.

2. **Clone Your Fork**: Clone your fork to your local machine for development.

   ```bash
   git clone https://github.com/swarnendu19/PaySync
   ```

3. Create a Branch: Create a new branch for your feature or bug fix.

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Create**: `apps` directory and setup a nodejs project inside the `apps` directory.

5. **Add Dependencies**: Add `paysync` as a dependencies to the `apps/nodejs-project/package.json` file.

6. **Make Changes**: Implement your changes or improvements to the codebase.
7. **Test Your Changes**: Ensure that your changes don't break any existing functionality and add tests if necessary.
8. **Commit Your Changes**: Commit your changes with a clear and descriptive commit message.
   ```bash
   git commit -m "Add a brief description of your changes"
   ```
9. **Push to Your Fork**: Push your changes to your GitHub fork
   ```bash
   git push origin feature/your-feature-name
   ```
10. **Submit a Pull Request**: Go to the original PaySync repository and submit a pull request with a clear description of your changes.

Thank You
