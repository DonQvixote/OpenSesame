# sprint-1：商品上架与展示

实现电商合约的商品上架与展示方法。


## 1.启动服务

终端1#，启动以太坊节点：

```
~$ ganache-cli
```

## 2.构建应用

在终端4#构建应用。

进入`sprint-1`目录：

```
~$ cd ~/repo/sprint-1
```

编译合约：

```
~/repo/sprint-1$ truffle compile
```

部署合约：

```
~/repo/sprint-1$ truffle migrate --reset
```

如果重新启动了节点仿真器，也可以不加`--reset`选项。

## 3.运行应用

在终端4#运行测试脚本：

```
~/repo/sprint-1$ truffle exec test-store.js
```
