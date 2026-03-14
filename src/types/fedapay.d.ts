declare module "fedapay" {
    export class FedaPay {
        static setApiKey(key: string): void;
        static setEnvironment(env: "sandbox" | "live"): void;
    }

    export class Transaction {
        static create(params: any): Promise<Transaction>;
        generateToken(): Promise<{ url: string; token: string }>;
    }
}
