<template>
  <div class="checkout-header">
    <div class="header-content">
      <div class="checkout-header-left-section">
        <div style="font-size: x-large;" @click="$router.push('/')">Home</div>
      </div>

      <div class="checkout-header-middle-section">
        Checkout (<div class="return-to-home-link" @click="$router.push('/')">{{ cart.length }} items</div>)
      </div>

      <div class="checkout-header-right-section">
        <img src="@/assets/images/icons/checkout-lock-icon.png" alt="Checkout Lock">
      </div>
    </div>
  </div>

  <div class="Checkout-main">
    <div class="page-title">Review your order</div>

    <div class="checkout-grid">
      <div class="order-summary">
        <div style="font-size: xx-large; text-align:start" v-if="cart.length === 0">
          Your cart is empty
        </div>
        <div v-else>
        <div v-for="item in cart" :key="item.productId" class="cart-item-container">
          <div v-for="product in filteredProducts(item.productId)" :key="product.id">
            <div class="delivery-date">
              Delivery date: {{ item.selectedDeliveryDate }}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image" :src="require(`@/assets/images/products/${product.image}`)" :alt="product.name">
              <div class="cart-item-details">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-price">Price: ${{ (product.priceCents / 100 * item.quantity).toFixed(2) }}</div>
                <div class="product-quantity">
                  <span class="quantity-label-left">Quantity:</span>
                  <template v-if="!item.editing">
                    <span class="quantity-value">{{ item.quantity }}</span>
                    <span class="update-quantity-link link-primary" @click="startEditing(item)">Update</span>
                  </template>
                  <template v-else>
                    <input type="number" v-model="item.editQuantity" min="1" max="10" class="quantity-input">
                    <span class="save-quantity-link link-primary" @click="saveEditing(item)">Save</span>
                  </template>
                  <span class="delete-quantity-link link-primary" @click="deleteItem(item)">Delete</span>
                </div>
              </div>
              <div class="delivery-options">
                <div class="delivery-options-title">Choose a delivery option:</div>

                <div class="delivery-option">
                  <input type="radio" v-model="item.selectedDeliveryDate"
                    class="delivery-option-input" :value="item.FreeShippingDate" :name="'delivery-option-' + item.productId">
                  <div>
                    <div class="delivery-option-date">{{ item.FreeShippingDate }}</div>
                    <div class="delivery-option-price">${{ FreeShippingCost }} - Free Shipping</div>
                  </div>
                </div>

                <div class="delivery-option">
                  <input type="radio" v-model="item.selectedDeliveryDate"
                    class="delivery-option-input" :value="item.PaidShippingDate" :name="'delivery-option-' + item.productId">
                  <div>
                    <div class="delivery-option-date">{{ item.PaidShippingDate }}</div>
                    <div class="delivery-option-price">${{ PaidShippingCost }} - Shipping</div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio" v-model="item.selectedDeliveryDate"
                    class="delivery-option-input" :value="item.UrgentShippingDate" :name="'delivery-option-' + item.productId">
                  <div>
                    <div class="delivery-option-date">{{ item.UrgentShippingDate }}</div>
                    <div class="delivery-option-price">${{ UrgentShippingCost }} - Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div class="payment-summary">
        <div class="payment-summary-title">Order Summary</div>

        <div class="payment-summary-row">
          <div>Items ({{ totalItems }}):</div>
          <div class="payment-summary-money">${{ totalPrice.toFixed(2) }}</div>
        </div>
        
        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">${{ shippingCost.toFixed(2) }}</div>
        </div>
        
        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">${{ (totalPrice + shippingCost).toFixed(2) }}</div>
        </div>
        
        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">${{ taxAmount.toFixed(2) }}</div>
        </div>
        
        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">${{ orderTotal.toFixed(2) }}</div>
        </div>
        
        <button class="place-order-button button-primary" @click="handleOrder">Place your order</button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import products from "@/assets/Data/products.js";
import '@/assets/styles/pages/checkout/checkout.css'
import '@/assets/styles/pages/checkout/checkout-header.css'

export default {
  name: 'CheckoutPage',
  data() {
    return {
      products: products,
      currentDate: '',
      cart: [], // Initialize cart with an empty array
      FreeShipping: '',
      PaidShipping: '',
      UrgentShipping: '',
      FreeShippingCost: 0,
      PaidShippingCost: 4.99,
      UrgentShippingCost: 9.99,
      OrderID:'5c9a5805-a0a9-9c73-5134-58b7c35c9056'
    };
  },
  created() {
    this.updateCurrentDate();
    setInterval(() => {
      this.updateCurrentDate();
    }, 60000);
    const storedCartData = localStorage.getItem('cart');
    if (storedCartData) {
      this.cart = JSON.parse(storedCartData);
      this.cart.forEach(item => {
        item.FreeShippingDate = this.addDaysToDate(this.currentDate, 10);
        item.PaidShippingDate = this.addDaysToDate(this.currentDate, 5);
        item.UrgentShippingDate = this.addDaysToDate(this.currentDate, 1);
        item.selectedDeliveryDate = item.FreeShippingDate; // Default to Free Shipping
      });
    }
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => {
        const product = this.filteredProducts(item.productId)[0];
        const itemPrice = (product.priceCents / 100) * item.quantity;
        return total + itemPrice;
      }, 0);
    },
    totalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
    shippingCost() {
      return this.cart.reduce((total, item) => {
        if (item.selectedDeliveryDate === item.FreeShippingDate) {
          return total + 0; // Free shipping
        } else if (item.selectedDeliveryDate === item.PaidShippingDate) {
          return total + this.PaidShippingCost; // Shipping cost for paid shipping
        } else if (item.selectedDeliveryDate === item.UrgentShippingDate) {
          return total + this.UrgentShippingCost; // Shipping cost for urgent shipping
        }
        return total;
      }, 0);
    },
    taxAmount() {
      return (this.totalPrice + this.shippingCost) * 0.1;
    },
    orderTotal() {
      return this.totalPrice + this.shippingCost + this.taxAmount;
    },
  },
  methods: {
    filteredProducts(productId) {
      return this.products.filter(product => product.id === productId);
    },
    getProductById(productId) {
    return this.products.find(product => product.id === productId);
   },
    handleOrder() {
      const orderId = uuidv4();
      const orderDate = this.updateCurrentDate();
      const cartData = this.cart.map(item => ({
        quantity: item.quantity,
        totalPrice: this.orderTotal.toFixed(2),
        ArrivingDate:item.selectedDeliveryDate,
        productName: this.getProductById(item.productId).name, 
        productImage: this.getProductById(item.productId).image,
        }));
        const orderInfo = {
        orderId: orderId,
        orderDate: orderDate,
        cart: cartData,
        };
      localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
      this.cart = [];
      this.clearCartFromLocalStorage();
      this.$router.push({
        path: '/Orders', // Replace with the name of your target page
        query: {
          orderId:orderId,
          orderDate: orderDate,
          cart: JSON.stringify(cartData)
        }
      });
    },
    updateCurrentDate() {
      const now = new Date();
      const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      };
      this.currentDate = now.toLocaleDateString('en-US', options);
      return this.currentDate;
    },
    addDaysToDate(currentDate, daysToAdd) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + daysToAdd);
      const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    },
    startEditing(item) {
      item.editing = true;
    },
    saveEditing(item) {
      item.quantity = item.editQuantity;
      item.editing = false;
      this.saveCartToLocalStorage(); // Save the updated cart data to local storage
    },
    deleteItem(item) {
      const index = this.cart.indexOf(item);
      if (index !== -1) {
        this.cart.splice(index, 1);
        this.saveCartToLocalStorage(); // Save the updated cart data to local storage
      }
    },
    saveCartToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    clearCartFromLocalStorage() {
      localStorage.removeItem('cart');
    },
    logout() {
      this.cart = [];
      this.clearCartFromLocalStorage();
    },
    updateShippingCost(item) {
      if (item.selectedDeliveryDate === item.FreeShippingDate) {
        item.selectedShippingCost = this.FreeShippingCost; // Free shipping cost
      } else if (item.selectedDeliveryDate === item.PaidShippingDate) {
        item.selectedShippingCost = this.PaidShippingCost; // Paid shipping cost
      } else if (item.selectedDeliveryDate === item.UrgentShippingDate) {
        item.selectedShippingCost = this.UrgentShippingCost; // Urgent shipping cost
      }
    },
  },
};
</script>

<style scoped>
.quantity-label-left {
  margin-right: 5px;
}

.quantity-input {
  width: 40px;
  text-align: center;
}
</style>
