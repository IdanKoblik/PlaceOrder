
export interface OrderRequest {
    table_num: number;
    time: string;
    token: string;
};

export interface CreateOrderRequest extends OrderRequest {
    name: string;
    phone_number: string;
    guests: number;
    note: string;
};

export interface OrderResponse extends CreateOrderRequest { 
    active: number;
}

export type CreateEventRequest = OrderResponse;
export type OrdersResponse = Omit<OrderResponse, "token">;
export type RemoveOrderRequest = OrderRequest;  