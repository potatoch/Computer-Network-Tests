//首先使用严格模式来规范文件
"use strict";
//引入net核心模块
const net = require("net");
//创建服务器socket对象
let socketServer = net.createServer();
//开启服务器
socketServer.on("connection", (socket) => {
    console.log("有客户连接上来了"); //作为测试是否有客户连接
    //当创建连接后就输出下面的文本
    socket.write("主人，小二随时恭候，为您提供最优质的服务！");
    //当客户端有数据发送过来，触发下面的事件
    socket.on("data", (content) => {
        //处理用户发送来的信息
        var msg = content.toString().trim();
        console.log(`何宗昊：${msg}`);
        //判断用户输入的内容
        if (msg.indexOf("math:") == 0) {
            var Stack = function() {}
            Stack.prototype = {
                Init: function() {
                    this.STACKMAX = 50;
                    this.stack = new Array(this.STACKMACK);
                    this.top = -1;
                    return this.stack;
                },
                isEmpty: function() {
                    if (this.top == -1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                push: function(elem) {
                    if (this.top == this.STACKMAX - 1) {
                        return "栈满";
                    } else {
                        this.top++;
                        this.stack[this.top] = elem;
                    }
                },
                pop: function() {
                    if (this.top == -1) {
                        return "空栈,无法删除栈顶元素！";
                    } else {
                        var x = this.stack[this.top];
                        this.top--;
                        return x;
                    }
                },
                peek: function() {
                    if (this.top != -1) {
                        return this.stack[this.top];
                    } else {
                        return "空栈，顶元素无返回值！";
                    }
                },
                Clear: function() {
                    this.top = -1;
                },
                Length: function() {
                    return this.top + 1;
                }
            }

            function getBackExpre(s) {
                var list = new Array();
                var op = new Stack();
                op.Init();
                var i = 0;
                while (i < s.length) {
                    var c = s.charAt(i);
                    if (c >= '0' && c <= '9') {
                        var s1 = s.substr(i);
                        var m = s1.match(/\d+(\.\d+)?/g);
                        if (m.length > 0) {
                            s1 = m[0];
                            list.push(s1);
                        }

                        i = i + s1.length;
                        continue;
                    } else if (c == '(') {
                        op.push(c);
                    } else if (c == ')') {
                        var p = op.pop();
                        while (p != '(') {
                            list.push(p);
                            p = op.pop();
                        }
                    } else if (c == '+' || c == '-') {
                        while (!op.isEmpty() && (op.peek() == '+' || op.peek() == '-' || op.peek() == '*' || op.peek() == '/')) {
                            list.push(op.pop());
                        }
                        op.push(c);
                    } else if (c == '*' || c == '/') {
                        while (!op.isEmpty() && (op.peek() == '*' || op.peek() == '/')) {
                            list.push(op.pop());
                        }
                        op.push(c);
                    }
                    i++;
                }
                while (!op.isEmpty()) {
                    list.push(op.pop());
                }
                return list;
            }

            function g(a, b, c) {
                var v = 0;
                a = parseFloat(a);
                b = parseFloat(b);
                switch (c) {
                    case '+':
                        v = a + b;
                        break;
                    case '-':
                        v = a - b;
                        break;
                    case '*':
                        v = a * b;
                        break;
                    case '/':
                        v = a / b;
                        break;
                }
                return v;
            }

            function getResult(list, result) {
                for (var i = 0; i < list.length; i++) {
                    if (!isNaN(list[i])) {
                        result.push(list[i]);
                    } else {
                        var b = result.pop();
                        var a = result.pop();
                        var v = g(a, b, list[i]);
                        result.push(v);
                    }
                }
                return result.pop();
            }
            var list = getBackExpre(msg.slice(5));
            var result = new Stack();
            result.Init();
            var b = getResult(list, result).toString();
            socket.write(b);
        } //计算器( 把输入的中缀表达式转成后缀表达式，利用正则表达式)
        if (msg.indexOf("big:") == 0) {
            var list = (msg.slice(4)).toUpperCase();
            var b = list.toString();
            socket.write(b);
        } else {
            switch (msg) {
                case "你好":
                    socket.write("主人，你好！有什么能够帮助到您的吗？");
                    break;
                case "你叫什么名字":
                    socket.write("我叫小二🌞");
                    break;
                case "你好笨":
                    socket.write("主人，我允许你说我笨，但是你不可以侮辱我的智商。");
                    break;
                case "你可以做什么啊":
                    socket.write("我可以当计算器");
                    break;
                default:
                    socket.write("不知道你在说什么");
                    break;
            }
        }

    });
    //处理异常
    socket.on("error", () => {
        console.log("客户掉线");
    });
});
//进行监听
socketServer.listen(8088, '127.0.0.1', () => {
    console.log("服务器已经开始");
})