// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    // Al iniciar, intenta cargar los productos del carrito desde localStorage
    items: typeof window !== 'undefined' && localStorage.getItem('cart') 
      ? JSON.parse(localStorage.getItem('cart')) 
      : []
  }),
  getters: {
    totalItems: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce((total, item) => total + item.product.precio * item.quantity, 0)
  },
  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ product, quantity });
      }
      // Guarda el carrito actualizado en localStorage
      this.syncWithLocalStorage();
    },
    removeItem(productId) {
      this.items = this.items.filter(item => item.product.id !== productId);
      this.syncWithLocalStorage();
    },
    // Nueva acción para decrementar la cantidad de un producto en 1
    decreaseItemQuantity(productId) {
      const existingItem = this.items.find(item => item.product.id === productId);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity--;
        } else {
          // Si la cantidad es 1, se elimina el producto
          this.items = this.items.filter(item => item.product.id !== productId);
        }
        this.syncWithLocalStorage();
      }
    },
    updateQuantity(productId, quantity) {
      const existingItem = this.items.find(item => item.product.id === productId);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
      this.syncWithLocalStorage();
    },
    clearCart() {
      this.items = [];
      this.syncWithLocalStorage();
    },
    syncWithLocalStorage() {
      // Solo guarda el carrito en localStorage si estamos en el cliente
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
    }
  }
});
