export interface OrderRequest {
    table_num: number
    time: string
};

export interface CreateOrderRequest extends OrderRequest {
    name: string;
    phone_number: string;
    guests: number;
};

export type RemoveOrderRequest = OrderRequest;  