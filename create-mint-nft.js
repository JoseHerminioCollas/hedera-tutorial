require("dotenv").config();
const {
  Hbar,
  Client,
  AccountId,
  PrivateKey,
  TokenType,
  TokenSupplyType,
  TokenCreateTransaction,
  AccountCreateTransaction,
} = require("@hashgraph/sdk");

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY);
const treasuryId = AccountId.fromString(process.env.OPERATOR_ID);
const treasuryKey = PrivateKey.fromStringDer(process.env.OPERATOR_PVKEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const supplyKey = PrivateKey.generate();

// const treasuryKey = PrivateKey.generateED25519();

// ACCOUNT CREATOR FUNCTION ==========================================
async function accountCreatorFcn(pvKey, iBal) {
  const response = await new AccountCreateTransaction()
    .setInitialBalance(new Hbar(iBal))
    .setKey(pvKey.publicKey)
    .execute(client);
  const receipt = await response.getReceipt(client);
  return [receipt.status, receipt.accountId];
}

async function createMintNFT() {
  // const [treasuryAccStatus, treasuryId] = await accountCreatorFcn(
  //   treasuryKey,
  //   3
  // );
  // console.log(
  //   `- Created random account ${treasuryId} that has a balance of 3ℏ`
  // );

  const nftCreate = await new TokenCreateTransaction()
    .setTokenName("Goatstone")
    .setTokenSymbol("GOATSTONE")
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(treasuryId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(250)
    .setSupplyKey(supplyKey)
    .freezeWith(client);
  //Sign the transaction with the treasury key
  const nftCreateTxSign = await nftCreate.sign(treasuryKey);
  //Submit the transaction to a Hedera network
  const nftCreateSubmit = await nftCreateTxSign.execute(client);
  //Get the transaction receipt
  const nftCreateRx = await nftCreateSubmit.getReceipt(client);
  //Get the token ID
  const tokenId = nftCreateRx.tokenId;
  //Log the token ID
  console.log(`\nCreated NFT with Token ID: ` + tokenId);
}

createMintNFT();
