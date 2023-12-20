<template>
  <div>
    <HeaderView />
  </div>

  <div class="main">
    <div class="page-title">Your Orders</div>

    <div class="order-container" v-for="(order, orderIndex) in groupedOrders" :key="orderIndex">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>{{ order.date }}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>${{ order.total }}</div>
          </div>
        </div>
        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>{{ order.orderId }}</div>
        </div>
      </div>

      <div v-for="(product, productIndex) in order.products" :key="productIndex" class="order-details-grid">
        <div class="product-image-container">
          <img :src="require(`@/assets/images/products/${product.image}`)" alt="Product Image">
        </div>
        <div class="product-details">
          <div class="product-name">
            {{ product.name }}
          </div>
          <div class="product-delivery-date">
            Arriving on: {{ product.arrivingDate }}
          </div>
          <div class="product-quantity">
            Quantity: {{ product.quantity }}
          </div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="@/assets/images/icons/buy-again.png" alt="Buy Again">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
            <button class="track-package-button button-secondary" @click="trackProduct(product)">
              Track package
            </button>

          </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/pages/orders.css';
import HeaderView from '@/components/HeaderView.vue';

export default {
  name: 'OrdersPage',
  components: {
    HeaderView,
  },
  data() {
    return {
      orders: [],
    };
  },
  computed: {
    groupedOrders() {
      // Group orders by orderId
      const groupedOrders = {};
      this.orders.forEach((order) => {
        if (!groupedOrders[order.orderId]) {
          // Create a new group for each unique orderId
          groupedOrders[order.orderId] = {
            date: order.date,
            orderId: order.orderId,
            total: order.total,
            products: [],
          };
        }
        // Add products to the corresponding group
        groupedOrders[order.orderId].products.push(...order.products);
      });
      // Convert the groupedOrders object into an array of orders
      return Object.values(groupedOrders);
    },
  },
  methods: {
    saveOrdersToLocalStorage() {
      localStorage.setItem('orders', JSON.stringify(this.orders));
    },
    loadOrdersFromLocalStorage() {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      this.orders = savedOrders;
    },
    trackProduct(product) {
      // Navigate to the TrackingPage and pass the product details as query parameters
      this.$router.push({
        name: 'TrackingPage', // Assuming 'TrackingPage' is the name of your tracking page route
        query: {
          productName: product.name,
          productImage: product.image,
          arrivingDate: product.arrivingDate,
          quantity: product.quantity,
        },
      });
    },
  },
  created() {
    this.loadOrdersFromLocalStorage();
    const orderId = this.$route.query.orderId;
    const orderDate = this.$route.query.orderDate;
    const cartData = JSON.parse(this.$route.query.cart);
    cartData.forEach((item) => {
      const order = {
        date: orderDate,
        orderId: orderId,
        total: item.totalPrice,
        products: [
          {
            name: item.productName,
            image: item.productImage,
            arrivingDate: item.ArrivingDate,
            quantity: item.quantity,
          },
        ],
      };
      this.orders.push(order);
      this.saveOrdersToLocalStorage();
    });
  },
};
</script>
