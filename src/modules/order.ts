export interface OrderRequest {
    tableNumber: number,
    phoneNumber: string,
    time: string
};

export interface AuthOrderRequest extends OrderRequest {
    googleToken: string
};

export interface CreateOrderRequest extends AuthOrderRequest {
    name: string,
    note?: string
    guests: number
};

export interface UpdateOrderActivityRequest extends OrderRequest {
    status: number
};

export interface RemoveOrderRequest extends AuthOrderRequest {
    eventId: string
};

export interface OrderStatusRequest {
    orderId: number,
    status: number
}

export interface Order extends CreateOrderRequest, UpdateOrderActivityRequest, RemoveOrderRequest, OrderStatusRequest {};

export type CreateOrderResponse = Omit<CreateOrderRequest, 'googleToken'>;
