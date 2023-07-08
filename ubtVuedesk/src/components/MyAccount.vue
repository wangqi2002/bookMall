<template>
    <div>
        <div class="containt">
            <div class="header">
                <img src="@/assets/imgs/logo1.png" alt="">
                <p @click="$router.push({ path: '/' })">首页</p>
                <p @click="nagativeSet">账户设置</p>
            </div>
            <el-container class="elContainer">
                <el-aside v-if="$store.state.bol" width="200px"
                    style="background-color: rgb(238, 241, 246);border-left:1px solid #b0b0b0">
                    <el-menu :default-openeds="['1', '3']">
                        <el-menu-item index="1-1">个人信息</el-menu-item>
                        <el-menu-item index="1-2" @click="$router.push({ path: '/Collection' })">收藏夹</el-menu-item>
                        <el-menu-item index="1-3" @click="$router.push({ path: '/MyOrder' })">订单</el-menu-item>
                        <el-menu-item index="1-4">联系客服</el-menu-item>
                        <el-menu-item index="1-5">关于我们</el-menu-item>
                    </el-menu>
                </el-aside>
                <el-aside v-else width="200px" style="background-color: rgb(238, 241, 246);border-left:1px solid #b0b0b0">
                    <el-menu :default-openeds="['1', '3']">
                        <el-menu-item index="1-1">账户管理</el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <router-view name="account"></router-view>
                </el-container>
            </el-container>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bol: true
        }
    },
    methods: {
        nagativeSet() {
            this.bol = false;
            this.$router.push({ path: "/myaccount/setaccount" })
        },
        handerBol() {
            this.bol = !this.bol
        }
    }
};
</script>

<style lang="less" scoped>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

.containt {
    width: 100%;
    height: calc(100vh - 40px);

    .header {
        width: 100%;
        height: 50px;
        background: rgb(255, 68, 1);
        padding: 0 120px;
        box-sizing: border-box;
        display: flex;

        p {
            width: 100px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            color: #fff;
            cursor: pointer;
        }
    }

    .elContainer {
        max-width: 1000px;
        height: calc(100% - 50px) !important;
        margin: 0 auto;
        box-sizing: border-box;
        border: 1px solid #eee;
    }
}
</style>