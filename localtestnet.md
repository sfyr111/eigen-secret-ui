## Local Development Environment

### Local Dependencies Configuration：
```
// package.json
"@eigen-secret/core": "file:${path}eigen-secret/core",
for example "@eigen-secret/core": "file:/Users/JsProjects/eigen-secret/core",
```

### 
Start this project：
```
npm install
npm run serve
```


### Open eigen-secret:
```
npm run server
npx hardhat node
npm run deploy:dev
```
```
// After the page creates the account, register the asset ID token address
npx hardhat register-token --token 0x0165878A594ca255338adfa4d48449f69242Eb8F --network dev
```

#### Update the contract address of this project
`src/artifacts/contract.json`

#### 1.Add hardhat test network to MetaMask
![image](https://user-images.githubusercontent.com/18510448/237016442-392a5c04-587f-4a9b-84a4-e42d1a163d1b.png)

#### 2. Use hardhat node to allocate account keys and generate accounts
![image](https://user-images.githubusercontent.com/18510448/237016712-eeeefd47-08bb-433f-9011-eb96a1639f88.png)

#### Make sure to switch to the local test network and use the allocated account in MetaMask
Open localhost:8080/secret for page debugging.

Location of page code:
src/views/secret/index.vue

Location of SecretManager.js:
src/SecretManager/SecretManager.js

If there is a nonce-related error during use, click on MetaMask settings-advanced operations"clear activity and nonce data" and restart the environment.
![image](https://user-images.githubusercontent.com/18510448/237016842-0af095ee-2bcb-43c1-afbd-da30a6a17f42.png)
