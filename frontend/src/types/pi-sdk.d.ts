export {};

export interface PiUserData {
  uid: string;
  username: string;
  name?: string;
  avatar?: string;
}

export interface PiAuthResult {
  accessToken: string;
  user: PiUserData;
}

export interface PiPaymentData {
  identifier: string;
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
}

export interface PiIncompletePayment {
  identifier: string;
  amount: number;
  memo?: string;
  metadata?: Record<string, any>;
}

export interface PiSDK {
  authenticate(
    scopes: string[],
    options?: {
      onIncompletePaymentFound?: (payment: PiIncompletePayment) => void;
    }
  ): Promise<PiAuthResult>;

  createPayment(
    payment: PiPaymentData,
    callbacks: {
      onReadyForServerApproval: (paymentId: string) => void;
      onReadyForServerCompletion: (paymentId: string, txid: string) => void;
      onCancel: (paymentId: string) => void;
      onError: (error: Error, payment?: PiPaymentData) => void;
    }
  ): void;
}

declare global {
  interface Window {
    Pi?: PiSDK;
  }
}