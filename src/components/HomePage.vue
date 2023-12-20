<template>
  <div>
    <HeaderView :cartvalue="result" @navigate-to-checkout="navigateToCheckout"/>
  </div>
  <div class="Home-main">
    <div class="products-grid js-products-grid">
      <div v-for="(product, index) in products" :key="product.id">
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image" :src="require(`@/assets/images/products/${product.image}`)" :alt="product.name" />
          </div>

          <div class="product-name limit-text-to-2-lines">
            {{ product.name }}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              :src="require(`@/assets/images/ratings/rating-${product.rating.stars * 10}.png`)"
              :alt="`${product.rating.stars} stars`" />
            <div class="product-rating-count link-primary">
              {{ product.rating.count }}
            </div>
          </div>
          -

          <div class="product-price">
            ${{ (product.priceCents / 100).toFixed(2) }}
          </div>

          <div class="product-quantity-container">
            <select v-model="selected[index]">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img :src="require('@/assets/images/icons/checkmark.png')" alt="Added" />
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" :data-product-id="product.id"
            @click="AddtoCart(index)">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '@/assets/styles/pages/homepage.css'
import products from "@/assets/Data/products.js";
import HeaderView from "@/components/HeaderView.vue";

export default {
  name: "HomePage",
  components: {
    HeaderView,
  },
  data() {
    return {
      products: products,
      selected: Array(products.length).fill('1'),
      result: 0,
      cart: [],
    };
  },
  methods: {
    AddtoCart(index) {
      const productId = this.products[index].id;
      const quantity = Number(this.selected[index]);
      const existingCartItemIndex = this.cart.findIndex(item => item.productId === productId);

      if (existingCartItemIndex !== -1) {
        // If the product is already in the cart, update the quantity
        this.cart[existingCartItemIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        this.cart.push({ productId, quantity });
      }

      this.result += quantity;
      this.saveCartToLocalStorage();
    },
    navigateToCheckout() {
      this.$router.push({
        path: '/Checkout',
        query: {
          cart: JSON.stringify(this.cart),
        },
      });
    },
    removeFromCart(productId) {
      const existingCartItemIndex = this.cart.findIndex(item => item.productId === productId);

      if (existingCartItemIndex !== -1) {
        const removedQuantity = this.cart[existingCartItemIndex].quantity;
        this.result -= removedQuantity;
        this.cart.splice(existingCartItemIndex, 1); // Remove the item from the cart
        this.saveCartToLocalStorage();
      }
    },
    saveCartToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    loadCartFromLocalStorage() {
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        this.cart = JSON.parse(cartData);
        this.result = this.cart.reduce((total, item) => total + item.quantity, 0);
      }
    },
  },
  mounted() {
    let User = localStorage.getItem("user-info");
    if (!User) {
      this.$router.push({
        name: "SignupPage",
      });
    } else {
      this.loadCartFromLocalStorage();
    }
  },
};
</script>


