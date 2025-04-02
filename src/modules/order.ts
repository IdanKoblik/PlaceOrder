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

export interface CreateEventRequest extends CreateOrderRequest { 
    active: number;
};

export interface OrderResponse extends CreateOrderRequest { 
    active: number;
    order_id: number;
};

export interface RemoveOrderRequest extends OrderResponse {
    event_id: string;
};

export interface UpdateActivityRequest {
    activity: number;
    order_id: number;
}

export type OrdersResponse = RemoveOrderRequest;
