# sprint-8：链下数据存储

- 使用`MongoDB`在链下同步保存商品数据
- 使用`NodeJS`和`Express`开发服务端应用来替换开发服务器。

## 1.启动服务

终端1#，启动以太坊节点：

```
~$ ganache-cli
```

终端2#，启动`ipfs`节点监听程序：

```
~$ ipfs daemon
```

如果`ipfs`节点还未初始化，请参考结尾部分的”初始化ipfs“。

终端3#，启动`MongoDB`：

```
~$ mongod --fork --syslog
```

## 2.构建应用

在终端4#构建应用。

进入`sprint-8`目录：

```
~$ cd ~/repo/sprint-8
```

编译合约：

```
~/repo/sprint-8$ truffle compile
```

部署合约：

```
~/repo/sprint-8$ truffle migrate --reset
```

如果重新启动了节点仿真器，也可以不加`--reset`选项。

打包前端资源：

```
~/repo/sprint-8$ webpack
```

## 3.运行应用

终端4#，启动服务端：

```
~/repo/sprint-8$ node server.js
```

终端3#，进入sprint-8目录，向链上添加一些商品模拟数据：

```
~$ cd ~/repo/sprint-8
~/repo/sprint-8$ truffle exec seed.js
```

在练习环境中刷新嵌入浏览器，查看网页效果。

## 附：初始化ipfs

初始化本地仓库：

```
~$ ipfs init
```

配置`CORS`以便允许跨域AJAX调用：

```
~$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
```

配置`API`允许外部访问：
```
~$ ipfs config --json Addresses.API '"/ip4/0.0.0.0/tcp/5001"'
```

配置`HTTP`网关允许外部访问，并将监听端口修改为`5000`：

```
~$ ipfs config --json Addresses.Gateway '"/ip4/0.0.0.0/tcp/5000"'
```