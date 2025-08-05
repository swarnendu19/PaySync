import {
    IDodoAuthResponse,
    IDodoOptions,
    IDodoPayload,
    IDodoPaymentResponse,
    IDodoWebhookPayload,
} from "../types/dodo";
import { PayFetch } from "../utils/fetch";
import { createHmac } from "crypto";

export class Dodo extends PayFetch {
    constructor(private options: IDodoOptions) {
        super();
    }

    private getApiBaseUrl(): string {
        if (this.options.sandbox) {
            return "https://api-sandbox.dodo.com";
        }
        return "https://api.dodo.com";
    }

    private getApiKey(): string {
        return this.options.apiKey;
    }

    private getSecretKey(): string {
        return this.options.secretKey;
    }

    private getPaymentUrl(): string {
        return `${this.getApiBaseUrl()}/v1/payments`;
    }

    private getAuthUrl(): string {
        return `${this.getApiBaseUrl()}/v1/auth/token`;
    }

    /**
     * Get access token for DODO API authentication
     */
    async getAccessToken(): Promise<string> {
        const [response] = await this.jsonFetch<IDodoAuthResponse>(
            this.getAuthUrl(),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: this.getApiKey(),
                    secret_key: this.getSecretKey(),
                    grant_type: "client_credentials",
                }),
            }
        );

        return response.access_token;
    }

    /**
     * Create a payment and get the checkout URL
     */
    async createPayment(payload: IDodoPayload): Promise<string> {
        const accessToken = await this.getAccessToken();

        const [response] = await this.jsonFetch<IDodoPaymentResponse>(
            this.getPaymentUrl(),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.payment_url) {
            throw new Error("Failed to get payment URL from DODO");
        }

        return response.payment_url;
    }

    /**
     * Get payment status by payment ID
     */
    async getPaymentStatus(paymentId: string): Promise<IDodoPaymentResponse> {
        const accessToken = await this.getAccessToken();

        const [response] = await this.jsonFetch<IDodoPaymentResponse>(
            `${this.getPaymentUrl()}/${paymentId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response;
    }

    /**
     * Verify webhook signature for security
     */
    verifyWebhookSignature(
        payload: string,
        signature: string,
        timestamp: string
    ): boolean {
        const expectedSignature = createHmac("sha256", this.getSecretKey())
            .update(`${timestamp}.${payload}`)
            .digest("hex");

        return `sha256=${expectedSignature}` === signature;
    }

    /**
     * Process webhook payload
     */
    processWebhook(
        rawPayload: string,
        signature: string,
        timestamp: string
    ): IDodoWebhookPayload {
        if (!this.verifyWebhookSignature(rawPayload, signature, timestamp)) {
            throw new Error("Invalid webhook signature");
        }

        try {
            return JSON.parse(rawPayload) as IDodoWebhookPayload;
        } catch (error) {
            throw new Error("Invalid webhook payload format");
        }
    }

    /**
     * Cancel a pending payment
     */
    async cancelPayment(paymentId: string): Promise<boolean> {
        const accessToken = await this.getAccessToken();

        try {
            await this.jsonFetch(
                `${this.getPaymentUrl()}/${paymentId}/cancel`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return true;
        } catch (error) {
            return false;
        }
    }
}