<template>
  <div>
    <HeaderView />
  </div>
  <div class="main">
    <div class="order-tracking">
      <div class="delivery-date">
        Arriving on {{ arrivingDate }}
      </div>
      <div class="product-info">
        {{ productName }}
      </div>
      <div class="product-info">
        Quantity: {{ quantity }}
      </div>
      <img class="product-image" :src="require(`@/assets/images/products/${productImage}`)">
      <div class="progress-labels-container">
        <div class="progress-label" :class="{ 'current-status': currentStatus === 'Preparing' }">
          Preparing
        </div>
        <div class="progress-label" :class="{ 'current-status': currentStatus === 'Shipped' }">
          Shipped
        </div>
        <div class="progress-label" :class="{ 'current-status': currentStatus === 'Delivered' }">
          Delivered
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/styles/pages/tracking.css';
import HeaderView from '@/components/HeaderView.vue';

export default {
  name: 'TrackingPage',
  components: {
    HeaderView,
  },
  computed: {
    progressBarWidth() {
      if (this.currentStatus === 'Preparing') {
        return '10%'; // Set to 0% if currentStatus is "Preparing"
      } else if (this.currentStatus === 'Shipped') {
        return '33%'; // Set to 33% if currentStatus is "Shipped"
      } else {
        return '100%'; // Set to 100% if currentStatus is "Delivered"
      }
    },
  },
  data() {
    return {
      productName: '',
      productImage: '',
      arrivingDate: '',
      quantity: 0,
      currentStatus: 'Preparing', // Set the initial status to "Preparing"
    };
  },
  created() {
    // Access query parameters and set them to component data
    this.productName = this.$route.query.productName || '';
    this.productImage = this.$route.query.productImage || '';
    this.arrivingDate = this.$route.query.arrivingDate || '';
    this.quantity = this.$route.query.quantity || 0;
  },
};
</script>
