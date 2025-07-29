export interface PaymentConfig {
  apiKey?: string;
  secretKey?: string;
  clientId?: string;
  secret?: string;
}

export interface PaymentGateway {
  initialize(config: PaymentConfig): void;
  charge(amount: number, currency: string, customerDetails: any): Promise<any>;
}
