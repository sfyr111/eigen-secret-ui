# zkpay

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## dev
start backend dev server
```angular2html
// eigen-secret 
npm run server
npx hardhat node
npm run deploy:dev
```

```angular2html
#!/bin/bash
set -ex

npm run deploy:dev
export TOKEN=0x0165878A594ca255338adfa4d48449f69242Eb8F
npx hardhat create-account --alias Alice --index 0 --network dev
# 对应 task("create-accout") 已通，login.vue 实现

npx hardhat setup-rollup --network dev
# 对应 task("setup-rollup")
npx hardhat register-token --token $TOKEN --network dev
# 对应 task("register-token"), 把 TOKEN 合约地址在传参改造

npx hardhat deposit --alias Alice --index 0 --value 10 --asset-id 2 --network dev
npx hardhat deposit --alias Alice --index 0 --value 10 --asset-id 2 --network dev
npx hardhat deposit --alias Alice --index 0 --value 10 --asset-id 2 --network dev
# 对应 task("deposit")

npx hardhat create-account --alias Bob --index 1 --network dev
# 对应 task("create-accout") 已通，需在其他地方实现

npx hardhat send-l1 --alias Alice --asset-id 2 --receiver 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --value 100 --network dev
# 对应 task("send-l1")

npx hardhat deposit --alias Bob --index 1 --value 10 --asset-id 2 --network dev
npx hardhat deposit --alias Bob --index 1 --value 10 --asset-id 2 --network dev
# 对应 task("deposit")

npx hardhat get-balance --alias Alice --index 0 --asset-id 2 --network dev
npx hardhat get-balance --alias Bob --index 1 --asset-id 2 --network dev
# 对应 task("get-balance")

```
