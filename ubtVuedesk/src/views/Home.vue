<template>
  <div class="home">
    <Header />
    <router-view name="container"></router-view>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
export default {
  components: { Header },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    // console.log(this.$route);
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100vh;
}
</style>