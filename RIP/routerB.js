//首先使用严格模式来规范文件
"use strict";
//引入net核心模块
const net = require("net");
//创建服务器socket对象
let socketServer = net.createServer();
//开启routerB
socketServer.on("connection", (socket) => {
    console.log("路由C连接上来了"); //作为测试是否有路由连接
    // //当创建连接后就输出提示
    socket.write("请发送路由更新");
    var routerB = [
        [1, 5, 'A'],
        [2, 3, 'C'],
        [6, 6, 'F'],
        [8, 4, 'E']
    ];
    var routerC = [];
    var index = 0;
    //当routerC有数据发送过来，触发下面的事件
    socket.on("data", (content) => {
        var msg = content.toString().trim();
        if (msg != 'over' && msg != 'OVER') {
            var c = content.toString().split(' ');
            if (c[1] > 15) {
                socket.write("该路由距离不可达，请重新输入：");
            } else {
                c[1]++;
                c[2] = ['C'];
                routerC[index] = c;
                ++index;
                console.log(`routerC：${msg.toString()}`);
            }
        } else {
            console.log("修改后的routerC发送信息为：");
            for (var item in routerC) {
                console.log(routerC[item].toString());
            } //输出修改routerC
            for (var j = 0; j < routerC.length; j++) {
                var n = 0;
                for (var i = 0; i < routerB.length; i++) {
                    if (routerC[j][0] == routerB[i][0]) { //目的网络相同
                        if (routerC[j][2] == routerB[i][2]) { //下一跳相同
                            routerB[i] = routerC[j];
                        } else { //下一跳不同比距离大小
                            if (routerC[j][1] < routerB[i][1]) {
                                routerB[i] = routerC[j];
                            }
                        }
                    } else { n++; }
                }
                if (n == routerB.length) { //目的网络不存在，加入
                    routerB.push(routerC[j]);
                }
            }

            function sortFirstData(data) {
                data.sort(function(num1, num2) {
                    return num1[0] - num2[0];
                })
                return data; //按目的网络顺序排序
            }
            routerB = sortFirstData(routerB);
            console.log("更新后的routerB信息为：");
            for (var item in routerB) {
                console.log(routerB[item].toString());
            } //输出更新routerB
        }
    });
    //处理异常
    socket.on("error", () => {
        console.log("路由停止");
    });
});
//进行监听
socketServer.listen(8088, '127.0.0.1', () => {
    console.log("路由已经开始");
})