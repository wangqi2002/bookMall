const multer = require("multer")
const path = require("path")
const conn = require("../model/connectionRequest")
const moment = require("moment")


//上传文件
const storage = multer.diskStorage({
  //存储位置
  destination: function (req, file, cb) {
    console.log(file);
    let filePath = path.resolve(__dirname, "../public/images/chartImgs");
    cb(null, filePath)
  },
  //文件名字
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage }).single("file")


// 存储聊天消息到数据库
const handerchartInfo = ({source,status,msg_time,msg_content,msg_talker},callback) => {
  var newContent = JSON.stringify(msg_content).replace(/\"/g,"'").slice(1);
  moment.locale("zh-cn");
  newContent = newContent.substring(0,newContent.length-1);
  let newTime =  moment(msg_time).format('YYYY-MM-DD HH:mm:ss')
  let sql_insert = `INSERT INTO chatrecord (msg_send,msg_status,msg_time,msg_content,msg_talker) VALUES(${source},${status},"${newTime}","${newContent}",'${msg_talker}')`;
  conn.query(sql_insert,(err,result)=>{
    if(err){
      console.log(err);
      callback({code:0,value:"消息发送失败",data:{}})
    }else{
      console.log(result);
      callback({code:1,value:"消息发送成功",data:{}})
    }
  })
}

// 获取聊天消息
const handerGetChartInfo = ({uid},callback)=>{
  console.log(uid);
  let sql_select;
  if(!uid) sql_select = `SELECT * FROM chatrecord`;
  else sql_select = `SELECT * FROM chatrecord WHERE msg_talker='${uid}'`;
  conn.query(sql_select,(err,result)=>{
    if(err){
      console.log(err);
      callback({code:0,value:"消息获取失败",data:""})
    }else{
      callback({code:1,data:result,value:"消息获取成功"})
    }
  })
}

// 清除未读消息
const handerRemoveMsgRead = ({uid},callback)=>{
  console.log(uid);
  let sql_update = `UPDATE chatrecord SET msg_status=1 where msg_talker = '${uid}' AND msg_send=0`;
  conn.query(sql_update,(err,result)=>{
    if(err){
      console.log(err);
      callback({code:0,value:"消息已读失败",data:""})
    }else{
      // console.log(result);
      callback({code:1,data:result,value:"消息已读"})
    }
  })
}

// 平台获取聊天信息，两表联查
// let sql_find = `select * from bookabout a LEFT OUTER JOIN books s ON a.bookA_isbn=s.book_isbn where bookA_isbn=? and bookA_state=?`;
const handerGetChartInfoNew = (callback)=>{
  let sql_find = `SELECT * FROM user a RIGHT OUTER JOIN (SELECT msg_talker,max(msg_id),msg_content,msg_time,COUNT((msg_status = 0 and msg_send=0) or NULL) AS msgCount FROM (SELECT * FROM chatrecord ORDER BY msg_id desc LIMIT 1000)tem GROUP BY msg_talker)b on a.user_id = b.msg_talker`
  conn.query(sql_find,(err,result)=>{
    if(err){
      console.log(err);
      callback({code:0,value:"消息获取失败",data:""})
    }else{
      callback({code:1,data:result,value:"消息获取成功"})
    }
  })
}

module.exports = {
  upload,
  handerchartInfo,
  handerGetChartInfo,
  handerGetChartInfoNew,
  handerRemoveMsgRead
}