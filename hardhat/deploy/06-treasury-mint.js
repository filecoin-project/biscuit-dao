require("hardhat-deploy")
require("hardhat-deploy-ethers")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    const { get } = deployments;

    const biscuitToken = await get("BiscuitToken")
    const timeLock = await get("TimeLock")

    const biscuitTokenContract = await ethers.getContractAt("BiscuitToken", biscuitToken.address)


    const transferToTimelock = async () => {
        let amountToTransfer = ethers.utils.parseUnits("900000", 18);
        console.log(`Transferring 900,000 tokens to TimeLock Treasury`);
        let tx = await biscuitTokenContract.transfer(timeLock.address, amountToTransfer);
    }
    
    //Define function to delegate to deployer wallet
    const delegate = async (
        biscuitTokenAddress,
        delegatedAccount
    ) => {
        const biscuitToken = await ethers.getContractAt(
            "BiscuitToken",
            biscuitTokenAddress
        );
        delegateTx = await biscuitToken.delegate(delegatedAccount);
        await delegateTx.wait();
        console.log(
            `Checkpoints ${await biscuitToken.numCheckpoints(delegatedAccount)}`
        );
    }
    
    //Call delegate function below
    await transferToTimelock();
    console.log("BiscuitToken has been transferred to the treasury!")
    await delegate(biscuitToken.address, wallet.address);
    console.log("BiscuitToken has been delegated to deployer wallet!")
}