require("hardhat-deploy")
require("hardhat-deploy-ethers")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    const { deploy, get } = deployments;

    const biscuitToken = await get("BiscuitToken")
    const timeLock = await get("TimeLock")

    const governorContract = await deploy("GovernorContract", {
        from: wallet.address,
        args: [biscuitToken.address, timeLock.address, 1, 5, 0],
        log: true,
    });
}