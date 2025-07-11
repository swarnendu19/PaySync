import { IRazorpayAuthResponse, IRazorpayOptions, IRazorpayOrderResponse, IRazorpayPayload } from "../types/razorpayTypes";
import { PayFetch } from "../utils/fetch";

export class Razorpay extends PayFetch {
  constructor(private options: IRazorpayOptions) {
    super();
  }

  private getApiBaseUrl() {
    return this.options.sandbox 
      ? "https://api.sandbox.razorpay.com" 
      : "https://api.razorpay.com";
  }

  private getKeyId() {
    return this.options.keyId;
  }

  private getKeySecret() {
    return this.options.keySecret;
  }

  private getApiOrderUrl() {
    return `${this.getApiBaseUrl()}/v1/orders`;
  }

  async getAccessToken() {
    const url = `${this.getApiBaseUrl()}/v1/auth`;
    const auth = Buffer.from(`${this.getKeyId()}:${this.getKeySecret()}`).toString('base64'); // Using Buffer for Node.js

    const [response, error] = await this.jsonFetch<IRazorpayAuthResponse>(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Failed to get access token');
    }

    return response.access_token;
  }

  async createOrder(payload: IRazorpayPayload) {
    const accessToken = await this.getAccessToken();

    // Log the payload for debugging
    console.log('Creating order with payload:', payload);

    const [res, error] = await this.jsonFetch<IRazorpayOrderResponse>(
      this.getApiOrderUrl(),
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Detailed error handling
    if (error || !res || !res.id) {
      console.error('Razorpay create order error:', error);
      //@ts-ignore
      if (res && res.error) {
        //@ts-ignore
        console.error('Error details from Razorpay:', res.error);
      }
      throw new Error("Failed to create order");
    }

    return res;
  }
}
