<template>
  <div class="header">
    <div class="header_wrap">
      <div class="header_left">
        <!-- 头部登陆 -->
        <div class="login">
          <div v-if="!$store.state.userInfo.user_id" class="login_item" @click="handerLogin">
            亲，请登录
          </div>
          <div v-else class="login_item login_succ">
            {{
              $store.state.userInfo.user_nickname
              ? $store.state.userInfo.user_nickname
              : "无名"
            }}
            <!-- 登陆成功，个人信息列表 -->
            <div class="login_infoList">
              <div class="user_img" :style="styleVar"></div>
              <div class="user_operator">
                <p>
                  <span @click="$router.push({ path: '/myaccount/setaccount' })">账号设置</span><span
                    @click="handerExit">退出</span>
                </p>
              </div>
            </div>
          </div>

          <div class="register_item" @click="handerRegister">免费注册</div>
          <div class="header_about register_item" v-if="$store.state.homeBol">
            关于我们
          </div>
          <div class="header_about register_item" v-else @click="$router.push({ path: '/' })">
            首页
          </div>
        </div>
      </div>
      <!-- 头部右边功能模块 -->
      <div class="header_right">
        <li v-for="(item, index) of header_list" :key="index" class="header_right_item" @click="handerRightTab(index)">
          <img :src="item.imgUrl" alt="" />
          <p>{{ item.text }}</p>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      header_list: [
        {
          imgUrl: require("../assets/imgs/header_my.png"),
          text: "我的",
        },
        {
          imgUrl: require("../assets/imgs/goods_car.png"),
          text: "收藏夹",
        },
        {
          imgUrl: require("../assets/imgs/collection.png"),
          text: "发布图书",
        },
        {
          imgUrl: require("../assets/imgs/Customer.png"),
          text: "联系客服",
        },
      ],
      userBol: true,
    };
  },
  computed: {
    styleVar() {
      return {
        "--avatar": `url(/node${this.$store.state.userInfo.user_image})`,
      };
    },
  },
  methods: {
    // 处理用户登录
    handerLogin() {
      this.$router.push({ name: "login" });
    },
    // 处理用户注册
    handerRegister() {
      this.$router.push({ name: "register" });
    },
    // 退出登录
    handerExit() {
      this.$router.push({ name: "login" });
      localStorage.setItem("token", "");
      this.$store.dispatch("changeuserinfo", {});
    },
    // 处理右边功能模块
    handerRightTab(index) {
      switch (index) {
        case 0:
          if (!localStorage.getItem("token")) {
            this.$message.error("您还未登录哦！");
            break;
          }
          this.$router.push({ path: "/myaccount" });
          break;
        case 1:
          if (!localStorage.getItem("token")) {
            this.$message.error("您还未登录哦！");
            break;
          }
          this.$router.push({ path: "/Collection" });
          break;
        case 2:
          if (!localStorage.getItem("token")) {
            this.$message.error("您还未登录哦！");
            break;
          }
          this.$router.push({ path: "/publishbook" });
          break;
        case 3:
          if (!localStorage.getItem("token")) {
            this.$message.error("您还未登录哦！");
            break;
          }
          this.$router.push({ name: "chart" });
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    if (localStorage.getItem("token")) {
      this.userBol = false;
    }
  },
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  background: rgb(247, 247, 247);

  // 左边注册登录
  .header_wrap {
    max-width: 1200px;
    margin: 0 auto;

    .header_left {
      float: left;
      width: 300px;
      height: 100%;
      display: flex;
      align-items: center;

      .login {
        display: flex;
        position: relative;

        .login_succ {
          color: #6c6c6c !important;
          position: relative;

          &:hover {
            background: #fff;
            color: red !important;
          }

          &:hover .login_infoList {
            // display: block;
            height: 100px;
            border: 0.6px solid #6c6c6c;
          }

          .login_infoList {
            position: absolute;
            top: 40px;
            left: 0px;
            width: 200px;
            height: 0px;
            padding: 0 10px;
            background: #fff;
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            align-items: center;
            z-index: 999;
            cursor: default;

            .user_img {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background: var(--avatar) no-repeat center/cover;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;

              img {
                width: 70%;
              }
            }

            .user_operator {
              position: absolute;
              top: -3px;
              right: 5px;

              p {
                color: black;

                span {
                  padding: 0 5px;
                  cursor: pointer;

                  &:hover {
                    color: red;
                  }
                }

                span:first-child {
                  border-right: 0.5px solid black;
                }
              }
            }
          }
        }

        .login_item,
        .register_item,
        .header_about {
          width: 90px;
          height: 100%;
          line-height: 40px;
          text-align: center;
          color: red;
          font-size: 14px;
          cursor: pointer;
        }

        .register_item {
          color: black;

          &:hover {
            color: red;
          }
        }
      }
    }

    // 右边购物车，客服等功能模块
    .header_right {
      float: right;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header_right_item {
        width: 90px;
        height: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
          color: red;
        }

        p {
          font-size: 14px;
        }

        img {
          width: 17%;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>