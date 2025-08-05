export interface IDodoOptions {
    apiKey: string;
    secretKey: string;
    sandbox?: boolean;
}

export interface IDodoPaymentItem {
    name: string;
    description: string;
    quantity: number;
    unit_price: number;
    currency: "USD" | "EUR" | "BTC" | "ETH" | "USDT";
}

export interface IDodoPayload {
    order_id: string;
    amount: number;
    currency: "USD" | "EUR" | "BTC" | "ETH" | "USDT";
    items: IDodoPaymentItem[];
    customer: {
        email: string;
        name?: string;
    };
    callback_urls: {
        success_url: string;
        cancel_url: string;
        webhook_url?: string;
    };
    metadata?: Record<string, any>;
    expires_at?: string;
}

export interface IDodoAuthResponse {
    access_token: string;
    token_type: "Bearer";
    expires_in: number;
    scope: string;
}

export interface IDodoPaymentResponse {
    id: string;
    order_id: string;
    status: "pending" | "completed" | "failed" | "expired" | "cancelled";
    amount: number;
    currency: string;
    payment_url: string;
    created_at: string;
    expires_at: string;
    metadata?: Record<string, any>;
}

export interface IDodoWebhookPayload {
    event_type: "payment.completed" | "payment.failed" | "payment.expired";
    payment_id: string;
    order_id: string;
    status: string;
    amount: number;
    currency: string;
    timestamp: string;
    signature: string;
}