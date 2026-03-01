export declare const config: {
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    POLYGON_RPC_URL: string;
    NODE_ENV: "development" | "production" | "test";
    CONTRACT_ADDRESS?: string | undefined;
};
export type Config = typeof config;
//# sourceMappingURL=env.d.ts.map