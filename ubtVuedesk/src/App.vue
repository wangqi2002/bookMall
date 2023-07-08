<template>
  <div id="app">
    <router-view name="default"></router-view>
  </div>
</template>

<script>
import "animate.css";
export default {
  async mounted() {
    let { data } = await this.$axios.post("/node/login/avoidLogin");
    if (!data.code) {
      localStorage.removeItem("token")
      this.$message.error(data.value);
      this.$router.push({ path: "/" });
    } else {
      this.$message.success(data.value);
      this.$axios
        .post("/node/user/getUserInfo", {
          user_id: data.info.user_id,
        })
        .then(({ data }) => {
          this.$store.dispatch("changeuserinfo", data[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>



<style lang="less">
* {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

button,
input {
  border: none;
  outline: none;
  background: none;
}

div,
p {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}

.left {
  float: left;
}

.right {
  float: right;
}
</style>
