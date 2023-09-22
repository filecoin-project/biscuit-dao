# BiscuitDAO Hardhat Project

This is the [hardhat](https://hardhat.org/) portion of the repo that contains all of the Solidity smart contract and scripts you can use to interact with them. Video tutorials are in the works for how to use this repo!


## Cloning the Repo

Open up your terminal (or command prompt) and navigate to a directory you would like to store this code on. Once there type in the following command:


```
git clone  https://github.com/filecoin-project/biscuit-dao
cd biscuit-dao/hardhat
yarn install
```


This will clone the BiscuitDAO onto your computer, switch directories into the newly installed kit, switch into the hardhat sub-directory, and install the dependencies the kit needs to work.

## Get a Private Key

You can get a private key from a wallet provider [such as Metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key).


## Add your Private Key as an Environment Variable

Add your private key as an environment variable by running this command:

 ```
export PRIVATE_KEY='abcdef'
```

If you use a .env file, don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!

## Fund the Deployer Address

Go to the [Calibration testnet faucet](https://faucet.calibration.fildev.network/), and paste in the Ethereum address from the previous step. This will send some Calibration testnet FIL to the account.

## Deploy the Contracts

Currently there are 4 contracts in this repo:

* DAO Deal Client: This is the [Filecoin Client Contract](https://github.com/filecoin-project/fvm-starter-kit-deal-making) which can propose deals to storage miners. This contract uses the [OpenZeppelin Ownable.sol contract](https://docs.openzeppelin.com/contracts/2.x/access-control#ownership-and-ownable) to switch the owner of this DealClient to be TimeLock.sol on deployment.

* Data Governance Token: This contract mints [OpenZeppelin ERC20Votes](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes) token which are used to vote on DAO proposals (or delegate another person to vote on your behalf).

* Governor Contract: This contract, based on the [OpenZeppelin Governor contract](https://docs.openzeppelin.com/contracts/4.x/api/governance#Governor), manages proposals and votes. This is the "heart" of the DAO.

* Time Lock: This contract, based on the [OpenZeppelin TimeLock contract](https://blog.openzeppelin.com/protect-your-users-with-smart-contract-timelocks/), creates a buffer between when proposals are passed and queued and when they can be executed. This allows gives users time to leave the DAO if a proposal that they don't agree with is passed. This contract also acts as the DAO treasury!


Type in the following command in the terminal to deploy all contracts:

 ```
yarn hardhat deploy
```

This will compile all the contracts in the contracts folder and deploy them automatically! The deployments scripts can be found in the deploy folder. This should also generate a deployments directory which can referenced for the address and details of each deployment.

At deploy time 100,000 Biscuit tokens will be sent to the deployer's wallet and 900,000  Biscuit tokens will be sent to the TimeLock.sol contract to act as the treasury.

## Storing your Data with Lighthouse SDK

You can also upload data to the Filecoin storage providers using an aggregator such as [Lighthouse](https://docs.lighthouse.storage/). To use it follow these steps:

1. Run the get-api-key script to get an API key with lighthouse. This script will automatically write the API key to the .env file.
```
node scripts/lighthouse-sdk/get-api-key.mjs
```

2. Modify the upload script in the scripts directory that will upload to the Lighthouse aggregator.  Change the path within the script to point to the file you want to upload. The example file path to upload is not included in this repo. 

3. Run the upload script. This should output JSON of your uploaded file and link to view the file via the IPFS gateway. 
```
node scripts/lighthouse-sdk/upload-file.mjs
```
4. Check your deal status with the check deal status script. This should give you the deal id and deal information once the deal is made. 
```
node scripts/lighthouse-sdk/get-deal-status.mjs
```
## Propose your Stored Data for a Reward

Edit and use the propose-reward-payout script to propose a deal, that you have stored on Filecoin using the step above, for a reward payout from the DAO treasury.

```
node scripts/propose-reward-payout.js
```

## Vote on the Proposal

Use the vote-reward script to vote to pass the proposal. Normally the DAO would do this over time, but we have set the voting period to only a couple of blocks and minted ourselves enough tokens to pass the vote!

```
node scripts/vote-reward.js
```

## Queue and Execute the Proposal

Use the queue-and-execute-reward script to queue the now passed proposal to the TimeLock, and then execute the proposal once the min Delay time has passed! The script will take this into account automatically.

This will officially run the proposal and give you some Biscuit token as a reward for storing the data!

```
node scripts/queue-and-execute-reward.js
```