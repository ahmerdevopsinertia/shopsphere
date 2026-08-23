import { useCartStore } from '../store/cart.store';

import {
  addCartItem,
  deleteCart,
  deleteCartItems,
  getCart,
  updateCart,
  updateCartItemQuantity,
} from '../api/cart.api';

import type {
  AddCartItemRequest,
  UpdateCartItemQuantityRequest,
  UpdateCartRequest,
} from '../types/cart.types';

export function useCart() {
  const cart = useCartStore(
    (state) => state.cart,
  );

  const setCart = useCartStore(
    (state) => state.setCart,
  );

  const setLoading = useCartStore(
    (state) => state.setLoading,
  );

  const loadCart = async () => {
    try {
      setLoading(true);

      const data = await getCart();

      setCart(data);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    payload: AddCartItemRequest,
  ) => {
    try {
      setLoading(true);

      const data =
        await addCartItem(payload);

      setCart(data);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    payload: UpdateCartRequest,
  ) => {
    try {
      setLoading(true);

      const data =
        await updateCart(payload);

      setCart(data);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (
    productId: string,
    payload: UpdateCartItemQuantityRequest,
  ) => {
    try {
      setLoading(true);

      const data =
        await updateCartItemQuantity(
          productId,
          payload,
        );

      setCart(data);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const removeCartItems = async (productId: string,) => {
    try {
      setLoading(true);

      const data = await deleteCartItems(productId);

      setCart(data);

      return data;
    } finally {
      setLoading(false);
    }
  };

  const removeCart = async () => {
    try {
      setLoading(true);

      const data = await deleteCart();

      setCart(data);

      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loadCart,
    addItem,
    update,
    updateItemQuantity,
    removeCartItems,
    removeCart
  };
}