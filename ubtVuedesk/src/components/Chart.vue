<template>
  <div class="chart" ref="chart">
    <div class="header_wrap">
      <!-- 聊天页面头部 -->
      <div class="header">
        <img src="@/assets/imgs/leftArrow.png" @click="$router.push({ path: '/' })" alt="" />
        <p>客服热线:19566677788</p>
        <p>服务时间:6:00-22:00</p>
      </div>
    </div>
    <!-- 中间的对话列表 -->
    <div class="center_wrap">
      <ul class="center_wrap_list" v-show="message_list[0] !== null">
        <li v-for="(item, index) of message_list" :key="index">
          <div :class="item.msg_send == 0 ? className[0] : className[1]">
            <div class="avatar"><img :src="item.imgUrl" alt="" /></div>
            <div :class="item.msg_send === 0 ? className1[0] : className1[1]" ref="message_content"></div>
            <div :class="item.bol ? clsName2[0] : clsName2[1]">
              {{ handerDate(item.msg_time) }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 发送信息框 -->
    <div class="message">
      <div class="message_wrap">
        <el-upload class="upload-demo" action="/node/chart/uploadChartImg" :on-success="handleAvatarSuccess"
          :show-file-list="false" multiple :limit="3">
          <i class="el-icon-circle-plus-outline upload_img"></i>
        </el-upload>
        <span class="img_test"></span>
        <div class="editable_scroll">
          <div ref="editable" class="editable" contenteditable="true"></div>
        </div>
        <button class="message_bth" @click="handerHtml">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 消息图片上传列表
      fileList: [],
      // 用户头像
      imgUrl: "",
      // 控制用户和客服的class名称
      className: [
        "center_wrap_item left",
        "center_wrap_item right rightReverse",
      ],
      // 控制是否显示时间
      clsName2: ["timeTip", "dis"],
      // 控制用户和客服消息框的class名称
      className1: ["message_content content_fl", "message_content content_fr"],
      // 消息列表
      message_list: [],
      // 是否登录
      isLogin: false,
    };
  },
  computed: {
    // 用户id
    userId() {
      return this.$store.state.userInfo.user_id;
    },
  },
  watch: {
    // 监听用户id
    userId: {
      handler(newValue, oldValue) {
        // 获取到用户id后发送请求获取聊天数据
        if (!this.isLogin) {
          this.getMessage(newValue);
          this.$socket.emit("login", {
            userId: newValue,
          });
          this.handerSubscribe();
        }
      },
    },
  },
  methods: {
    // 文件成功上传的回调
    handleAvatarSuccess(obj, res, file) {
      // 处理图片消息成功回调的图片地址
      let imageUrl = "/node/images/chartImgs/" + res.response.data.filename;
      // 将图片渲染到发送消息输入框
      this.$refs.editable.innerHTML += `<img src=${imageUrl} style="max-width:100px" alt="">`;
    },
    // 点击发送按钮
    async handerHtml() {
      // 获取消息输入框的值
      let content = this.$refs.editable.innerHTML;
      // 是否显示消息发送时间
      let bolValue = false;
      if (
        this.message_list.length !== 0 &&
        new Date().getTime() - new Date(this.message_list[this.message_list.length - 1].msg_time).getTime() + 1000 * 60 * 60 * 8 > 1000 * 60
      ) {
        bolValue = true;
      }
      // 向服务端发送数据
      this.$socket.emit("chart", {
        // 接收方
        userId: "客服",
        msg: {
          msg_content: content.replace("/node", "http://47.113.229.104:4000"),
          msg_send: 0,
          imgUrl: this.$store.state.userInfo.user_image.replace(
            "/node",
            "http://47.113.229.104:4000"
          ),
          bol: bolValue,
          msg_time: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          // 发送方
          send_id: this.userId,
          send_name: this.$store.state.userInfo.user_nickname
        },
      });
      // 将新增的消息push到消息列表
      this.message_list.push({
        msg_send: 0,
        imgUrl: this.$store.state.userInfo.user_image,
        message: `${content}`,
        bol: bolValue,
        msg_time: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        msg_time_now: Date.now(),
      });
      // 在本轮dom渲染结束后渲染消息内容
      this.$nextTick(() => {
        this.$refs.message_content[
          this.message_list.length - 1
        ].innerHTML = `${content}`;
        this.$refs.editable.innerHTML = ``;
        // 页面滚动到底部
        let element = document.querySelector(".center_wrap");
        element.scrollTop = element.scrollHeight;
      });
    },
    // 订阅chart事件
    handerSubscribe() {
      this.sockets.subscribe(`chart-客服`, (data) => {
        console.log(data);
        this.message_list.push(data);
        // 在本轮dom渲染结束后渲染消息内容
        this.$nextTick(() => {
          this.$refs.message_content[this.message_list.length - 1].innerHTML =
            data.msg_content;
          // 页面滚动到底部
          let element = document.querySelector(".center_wrap");
          element.scrollTop = element.scrollHeight;
        });
      });
    },
    // 文件上传的限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
        } 个文件`
      );
    },
    // 处理聊天时间
    handerDate(time) {
      let spe = /-|T|:|\s+/;
      let prevTime = time.split(spe);
      let hours = prevTime[3] > 9 ? parseInt(prevTime[3]) : parseInt(prevTime[3][1]);
      let result = hours + ":" + prevTime[4];

      if (parseInt(prevTime[0]) !== new Date().getFullYear()) {
        return prevTime[0] + "年" + prevTime[1] + "月" + prevTime[2] + "日";
      } else if (parseInt(prevTime[1]) !== new Date().getMonth() + 1) {
        return prevTime[1] + "月" + prevTime[2] + "日";
      } else if (parseInt(prevTime[2]) !== new Date().getDate()) {
        return prevTime[1] + "月" + prevTime[2] + "日" + result.toString();
      } else {
        return result.toString();
      }
    },

    // 获取页面聊天数据
    async getMessage(id) {
      // 发送请求获取聊天数据
      let { data } = await this.$axios.post("/node/chart/getChartInfo", {
        uid: id,
      });
      // 请求成功
      if (data.code) {
        let newData = data.data.map((item, index) => {
          // 处理数据中的图片地址
          if (item.msg_send == 0) {
            item = {
              ...item,
              imgUrl: this.$store.state.userInfo.user_image,
            };
          } else {
            item = {
              ...item,
              imgUrl: require("../assets/imgs/person.png"),
            };
          }

          // 设置是否需要显示聊天时间，聊天间隔小于1分钟就不显示
          if (index === 0) item = { ...item, bol: true };
          else if (
            new Date(data.data[index].msg_time).getTime() -
            new Date(data.data[index - 1].msg_time).getTime() >
            1000 * 60
          )
            item = { ...item, bol: true };
          else item = { ...item, bol: false };
          return item;
        });
        // 将处理好的数据赋值
        this.message_list = newData;
        // 在本轮dom渲染结束后渲染消息内容
        this.$nextTick(() => {
          this.message_list.map((item, index) => {
            this.$refs.message_content[index].innerHTML = item.msg_content;
          });
          // 直接滚动到底部
          let element = document.querySelector(".center_wrap");
          element.scrollTop = element.scrollHeight;
        });
      }
      // 请求失败
      else {
        // 提示用户
        this.$message.error(data.value);
      }
    },
    // 聊天窗口高度
    chartPage() {
      // 聊天整天布局的设置，聊天主题高度自适应
      const resizeObserver = new ResizeObserver((entries) => {
        // 获取发送消息栏的高度
        let height = entries[0].borderBoxSize[0].blockSize;
        if (this.$refs.chart) {
          // 处理中间消息窗口高度
          this.$refs.chart.style.paddingBottom = `${height}px`;
        }
      });
      // 开启监听发送消息栏的高度
      resizeObserver.observe(document.querySelector(".message"));
    },
  },
  // 监听socket事件
  sockets: {
    disconnect() {
      console.log("Socket 断开");
    },
    connect_failed() {
      cosnole.log("连接失败");
    },
    connect() {
      console.log("socket connected");
    },
    err() {
      console.log("错误发生");
    },
  },
  // 页面初始化
  async mounted() {
    // 监听聊天窗口高度
    console.log(this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    this.chartPage();
    // 发送请求获取数据
    if (this.userId) {
      this.getMessage(this.userId);
      this.$socket.emit("login", {
        userId: this.userId,
      });
      this.handerSubscribe(this.userId);
      this.isLogin = true;
    }
  },
  beforeDestroy() {
    // 取消订阅
    this.sockets.unsubscribe("chart-客服");
  },
};
</script>

<style lang="less" scoped>
.chart {
  height: 100vh;
  position: relative;
  padding: 70px 0;
  box-sizing: border-box;

  // 客服电话
  .header_wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    .header {
      position: relative;
      width: 100%;
      height: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #333;
      background: #409eff;

      img {
        position: absolute;
        top: 20px;
        left: 10px;
        width: 30px;
        cursor: pointer;
      }

      p {
        color: #333;
        font-family: "Courier New", Courier, monospace;
      }

      p:nth-of-type(2) {
        margin-top: 6px;
      }
    }
  }

  // 中间的对话列表
  .center_wrap {
    height: calc(100%);
    padding: 10px;
    box-sizing: border-box;
    overflow: auto;

    .center_wrap_list {
      li {
        position: relative;
        margin-top: 20px;
        // 清除浮动
        overflow: hidden;

        .center_wrap_item {
          min-width: 200px;
          min-height: 100px;
          display: flex;
          justify-content: space-around;
          align-items: center;

          .avatar {
            width: 50px;
            height: 50px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .message_content {
            width: 120px;
            max-width: 120px;
            min-height: 20px;
            line-height: 20px;
            border-radius: 10px;
            padding: 5px;
            box-sizing: border-box;
          }
        }
      }
    }
  }

  // 发送信息框
  .message {
    position: fixed;
    bottom: 0px;
    left: 0;
    width: 100%;
    min-height: 70px;
    padding: 10px 0;
    box-sizing: border-box;
    background: #eee;

    .upload_img {
      position: absolute;
      bottom: 10px;
      left: 20px;
      font-size: 40px;
      color: #333;
      text-align: center;
    }

    .message_wrap {
      width: 680px;
      min-height: 70px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .send_img {
      position: absolute;
      bottom: 14px;
      left: 10px;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }

    .editable_scroll {
      min-width: 500px;
      max-width: 500px;
      min-height: 40px;
      box-sizing: border-box;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }

    .editable {
      min-width: calc(100% + 16px);
      max-width: calc(100% + 16px);
      padding: 11px 15px;
      box-sizing: border-box;
      max-height: 300px;
      overflow-y: scroll;
      overflow-x: hidden;
      border: none;
      font-size: 18px;
      border-radius: 20px;
      line-height: 18px;
      outline: none;
      background: #fff;
    }

    .send_input {
      position: relative;
      width: 700px;
      min-height: 40px;
      max-height: 300px;
      overflow: scroll;
      border: 1px solid #333;
      border-radius: 20px;
      padding: 0 10px;
      box-sizing: border-box;
      margin-left: 20px;
      background: url("../assets/imgs/person.png") no-repeat 10% center;
      background-size: 30px;
    }

    .message_bth {
      position: absolute;
      bottom: 14px;
      right: 0;
      width: 80px;
      height: 40px;
      border: 1px solid #b0b0b0;
      border-radius: 20px;
      background: #409eff;
      color: #fff;
      cursor: pointer;
    }
  }
}

.rightReverse {
  flex-direction: row-reverse;
}

.content_fl {
  background-color: rgb(229, 229, 229);
  color: #333;
}

.content_fr {
  background: rgb(18, 183, 245);
  color: #fff;
}

.timeTip {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.dis {
  display: none;
}

.center_wrap::-webkit-scrollbar {
  width: 2px;
  height: 16px;
  background-color: #f5f5f5;
}

/*定义滚动条的轨道，内阴影及圆角*/
.center_wrap::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

/*定义滑块，内阴影及圆角*/
.center_wrap::-webkit-scrollbar-thumb {
  /*width: 10px;*/
  height: 1px;
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgb(64, 158, 255);
  background-color: #555;
}
</style>