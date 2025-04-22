<template>
  <div class="productos-list-wrapper fade-in">
    <!-- Botón o link para ir al carrito (puede ubicarse en la cabecera o aquí) -->
    <div class="cart-link-wrapper">
      <NuxtLink to="/carrito" class="btn btn-cart">
        <!-- Puedes usar un ícono aquí en lugar de texto -->
        Carrito ({{ cartStore.totalItems }})
      </NuxtLink>
    </div>
  
    <div v-if="productos.length > 0" class="productos-list">
      <div v-for="producto in productos" :key="producto.id" class="producto">
        <div class="product-card">
          <img v-if="producto.imagen" :src="producto.imagen" :alt="producto.titulo" class="product-image" />
          <div class="product-info">
            <h3 class="product-title">{{ producto.titulo }}</h3>
            <p class="product-description">{{ producto.descripcion }}</p>
            <div class="product-details">
              <p><strong>Precio:</strong> ${{ producto.precio }}</p>
              <p><strong>Categoría:</strong> {{ producto.categoria.nombre }}</p>
            </div>
            <div class="button-group">
              <NuxtLink :to="`/producto/${producto.id}`" class="btn btn-secondary small btn-accent">
                Ver producto
              </NuxtLink>
              <!-- Se agrega el método addToCart enviando el producto -->
              <button class="btn btn-accent" @click="addToCart(producto)">Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Mensaje si no hay productos -->
    <div v-else class="no-products">No hay productos disponibles.</div>
  
    <!-- Notificación: se muestra el mensaje cuando hay algo en "message" -->
    <div v-if="message" class="notification">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  productos: {
    type: Array,
    required: true
  }
});

// Importa el store del carrito
import { useCartStore } from '@/stores/cart';

// Obtén el store
const cartStore = useCartStore();

// Ref para el mensaje de notificación
const message = ref('');

// Función para agregar un producto al carrito
const addToCart = (producto) => {
  // Puedes definir una cantidad fija o bien implementar un input para elegir cantidad.
  const cantidad = 1;
  cartStore.addItem(producto, cantidad);
  
  // Mostrar notificación
  message.value = `Se ha añadido ${cantidad} unidad(es) de "${producto.titulo}" al carrito.`;
  // Limpiar el mensaje después de 3 segundos
  setTimeout(() => {
    message.value = '';
  }, 3000);
  
  console.log(`Se agregó ${cantidad} unidad(es) de "${producto.titulo}" al carrito.`);
};
</script>

<style scoped lang="scss">
@import '../../assets/scss/_variables.scss';
@import '../../assets/scss/global.scss';

/* Estilo para el botón o link del carrito */
.cart-link-wrapper {
  width: 100%;
  text-align: right;
  padding: 1rem;
  
  .btn-cart {
    background: $secondary;
    color: $white;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      background: lighten($secondary, 10%);
    }
  }
}

.productos-list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.productos-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;
  justify-items: center;
  max-width: 100%;
  margin: 0 auto;
}

.producto {
  width: 100%;
  display: flex;
  justify-content: center;
}

.product-card {
  background: $white;
  border-radius: 12px;
  box-shadow: $box-shadow;
  overflow: hidden;
  transition: $transition;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  
    .btn-accent {
      transform: scale(1.05);
    }
  }
  
  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: $transition;
  }
  
  .product-info {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  
  .product-title {
    font-family: $font-display;
    font-size: 1.2rem;
    color: $dark;
    margin-bottom: 10px;
    transition: $transition;
  }
  
  .product-description {
    color: $dark;
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
  
  .product-details {
    margin-bottom: 15px;
    font-size: 1rem;
    color: $dark;
  }
  
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }
  
  .btn {
    border-radius: 8px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
  }
  
  .btn-accent {
    background: linear-gradient(135deg, $accent 0%, #e67e22 100%);
    color: $white;
    box-shadow: $box-shadow;
  
    &:hover {
      opacity: 0.9;
    }
  }
  
  .btn-secondary {
    background: $secondary;
    color: $white;
    font-size: 0.9rem;
    
    &:hover {
      background: lighten($secondary, 10%);
    }
  }
  
  .small {
    padding: 10px;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  
  .btn {
    padding: 10px 20px;
    font-size: 1rem;
  }
}

.no-products {
  text-align: center;
  font-size: 1.2rem;
  color: $gray;
  padding: 20px;
}

/* Estilo para la notificación */
.notification {
  background: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
