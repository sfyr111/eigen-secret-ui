## 本地开发环境

### 本地依赖指向：
```
// package.json
"@eigen-secret/core": "file:${写入你本地 sdk 真是目录}eigen-secret/core",
举例    "@eigen-secret/core": "file:/Users/qiaohao/Documents/JsProjects/eigen-secret/core",
```

### 启动本项目：
```
npm install
npm run serve
```


### 打开 eigen-secret:
```
npm run server
npx hardhat node
npm run deploy:dev
```
```
// 当页面创建好账号后，注册资产id token 地址
npx hardhat register-token --token 0x0165878A594ca255338adfa4d48449f69242Eb8F --network dev
```

#### 更新本项目合约地址
`src/artifacts/contract.json`

#### 1. MetaMask 添加 hardhat 测试网
![image](https://user-images.githubusercontent.com/18510448/237016442-392a5c04-587f-4a9b-84a4-e42d1a163d1b.png)

#### 2. 使用 hardhat node 分配账户秘钥生成账户
![image](https://user-images.githubusercontent.com/18510448/237016712-eeeefd47-08bb-433f-9011-eb96a1639f88.png)

#### 确保MetaMask  切换本地测试网络和使用分配的账户
打开 localhost:8080/secret 进行页面调试。

页面代码位置：
`src/views/secret/index.vue`

SecretManager.js 位置：
`src/SecretManager/SecretManager.js`


使用过程中如果出现 noce 相关错误点击 MetaMask 设置-高级操作"清除活动和nonce数据" 并重启环境
![image](https://user-images.githubusercontent.com/18510448/237016842-0af095ee-2bcb-43c1-afbd-da30a6a17f42.png)
