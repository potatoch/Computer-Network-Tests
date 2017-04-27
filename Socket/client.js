"use strict";
const net = require("net");
//得到ip和端口
const ip = "127.0.0.1";
const port = 8088;
//建立连接
var socket = net.createConnection(port, ip, () => {
    console.log("已连接上服务器");
});
//监听服务器的数据
socket.on("data", (content) => {
    console.log(`小二：${content}`);
});
//在客户端添加一个输入事件
process.stdin.on("readable", () => {
    var msg = process.stdin.read();
    if (msg != null) {
        //将输入的信息发送到服务器
        socket.write(msg);
    }
})