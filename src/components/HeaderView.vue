<template>
  <div class="amazon-header">

      <div class="home-header" @click="this.$router.push('/')">Home</div>
   

      <div class="amazon-header-middle-section">
        <input class="search-bar" type="text" placeholder="Search">
        <button class="search-button">
          <img class="search-icon" src="@/assets/images/icons/search-icon.png">
        </button>
      </div>

      <div class="amazon-header-right-section">
        <button class="logout-button" v-on:click="Logout">Logout</button>

        <div class="Return-orders-div" @click="handleOrder">Returns <strong>&Orders</strong></div>

      <div class="checkout-div" @click="navigateToCheckout">
        <img class="cart-icon" src="@/assets/images/icons/cart-icon.png" >
        <div class="cart-quantity js-cart-quantity">{{cartvalue}}</div>
        <div class="cart-text">Cart</div>
      </div>

    </div>
    </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
import products from "@/assets/Data/products.js";
import '@/assets/styles/pages/checkout/checkout.css'
import '@/assets/styles/pages/checkout/checkout-header.css'
import '@/assets/styles/shared/amazon-header.css'
export default{
name:'HeaderView',
props:{
  cartvalue:Number,
},
  data() {
    return {
      CartQuantity:'',
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
    navigateToCheckout() {
      this.$emit('navigate-to-checkout');
    },
    Logout() {
        localStorage.clear();
        this.$router.push({
            name: 'LoginPage'
        })
    },
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
<style>
.home-header{
  position: relative; font-weight:500; font-size:larger 
}
.logout-button{
  background-color:transparent; 
  height:28px;
  margin-top: 10px;
  font-size: medium;
  width: 50%;
  color:white;
  border: none;
  margin-right: 8px;
  font-weight: 600;
}
.checkout-div{
  display: flex;  
  margin-left: 10px;
  cursor: pointer;
}
.Return-orders-div{
  margin-top: 7px;
  width: auto;
}
</style>