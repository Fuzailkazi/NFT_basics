require("dotenv").config();
const ALCHEMY_URL = process.env.ALCHEMY_URL; // Alchemy sepolia URL
const WALLET_PUBLIC_KEY = process.env.WALLET_PUBLIC_KEY; // Metamask public address
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY; // Metamask Private Key

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress = "0x178B08B308e0Db3Dc28dA0f7C80125b18795d622";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(WALLET_PUBLIC_KEY, "latest");
  const tx = {
    from: process.env.WALLET_PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(WALLET_PUBLIC_KEY, tokenURI).encodeABI(),
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    tx,
    WALLET_PRIVATE_KEY
  );
  const transactionReceipt = await web3.eth.sendSignedTransaction(
    signedTx.rawTransaction
  );

  console.log(`Transaction re)ceipt:${JSON.stringify(transactionReceipt)}`);
}

mintNFT(
  "https://gateway.pinata.cloud/ipfs/QmPuPVs3mhgmbYu6QrcDbQK99AmzxhA66gkutjpUY9vxN9"
);
