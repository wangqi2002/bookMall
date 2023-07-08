<template>
  <div class="accountShow">
    <div class="header">
      <div class="account_info">
        <div class="avatar" :style="styleVar"></div>
        <div class="info">
          <p>账户昵称:</p>
          <p class="name">{{ $store.state.userInfo.user_nickname }}</p>
        </div>
      </div>
      <div class="address">
        <p>我的收货地址:</p>
        <p class="address_item">
          {{ $store.state.userInfo.user_loacation ? $store.state.userInfo.user_loacation : address }}
        </p>
      </div>
    </div>
    <div></div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      address: "您还没有添加收货地址哦!",
      userData: {},
    };
  },
  computed: {
    styleVar() {
      return {
        "--avatar": `url(/node${this.$store.state.userInfo.user_image})`,
      };
    },
  },
  async mounted() {
    let { data } = await this.$axios.post("/node/user/getUserInfo", {
      user_id: this.$store.state.userInfo.user_id,
    });
    this.userData = data[0];
  },
};
</script>
  
<style lang="less" scoped>
.accountShow {
  width: 100%;
  max-height: calc(100vh - 90px);
  padding: 40px 0;
  box-sizing: border-box;

  .header {
    max-width: 700px;
    height: 120px;
    border: 1px solid black;
    box-sizing: border-box;
    padding: 0 30px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .account_info {
      width: 200px;
      height: 100px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: var(--avatar) no-repeat center/cover;
        border: 1px solid black;
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .name {
          color: red;
        }
      }
    }

    .address {
      width: 150px;

      .address_item {
        font-size: 13px;
        color: red;
        margin-top: 5px;
      }
    }
  }
}
</style>