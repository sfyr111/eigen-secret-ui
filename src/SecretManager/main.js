import { ethers } from "ethers";
import SecretManager from "./SecretManager";

async function main() {
  const ethereum = window.ethereum;
  const signer = new ethers.providers.Web3Provider(ethereum).getSigner();

  const secretManager = new SecretManager();
  const alias = "exampleAlias";
  const password = "examplePassword";

  const userExistsResponse = await secretManager.userExists({
    alias,
    password,
    user: signer
  });

  if (userExistsResponse.errno === 0) {
    // 用户存在
    await secretManager.initSDK({ alias, password, user: signer });
  } else {
    // 用户不存在
    await secretManager.createAccount({ alias, password, user: signer });
  }

  // 存款
  const depositResult = await secretManager.deposit({
    alias,
    assetId: 2,
    password,
    value: 100,
    user: signer
  });
  console.log("Deposit result:", depositResult);

  // 发送资产
  const sendResult = await secretManager.send({
    alias,
    assetId: 2,
    password,
    value: 50,
    user: signer,
    receiver: "receiverPublicKey",
    receiverAlias: "receiverAlias"
  });
  console.log("Send result:", sendResult);

  // 提款
  const withdrawResult = await secretManager.withdraw({
    alias,
    assetId: 2,
    password,
    value: 50,
    user: signer
  });
  console.log("Withdraw result:", withdrawResult);

  // 查询余额
  const balance = await secretManager.getBalance({
    alias,
    assetId: 2,
    password,
    user: signer
  });
  console.log("Balance:", balance.toString());

  // 获取交易记录
  const transactions = await secretManager.getTransactions({
    alias,
    password,
    user: signer,
    page: 1,
    pageSize: 10
  });
  console.log("Transactions:", transactions);
}

main()
  .then(() => console.log("Example finished successfully"))
  .catch((error) => console.error("An error occurred:", error));
