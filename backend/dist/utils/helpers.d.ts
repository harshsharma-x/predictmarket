export declare function generateNonce(): string;
export declare function paginate(page: number, limit: number): {
    skip: number;
    take: number;
};
export declare function formatPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
};
export declare function sleep(ms: number): Promise<void>;
export declare function clamp(value: number, min: number, max: number): number;
//# sourceMappingURL=helpers.d.ts.map