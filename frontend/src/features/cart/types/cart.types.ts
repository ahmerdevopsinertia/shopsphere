export interface CartItem {
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }
  
  export interface Cart {
    id: string;
    totalAmount: number;
    items: CartItem[];
  }
  
  export interface AddCartItemRequest {
    productId: string;
    quantity: number;
  }
  
  export interface UpdateCartRequest {
    items: {
      productId: string;
      quantity: number;
    }[];
  }
  
  export interface UpdateCartItemQuantityRequest {
    quantity: number;
  }
  
  export interface CartResponse {
    success: boolean;
    data: Cart;
  }