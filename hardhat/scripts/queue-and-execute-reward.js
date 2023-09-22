const { ethers, network } = require("hardhat")
const {tokenAmount,
     PROPOSAL_DESCRIPTION,} = 
     require("../helper-hardhat-config")

  const private_key = network.config.accounts[0]
  const wallet = new ethers.Wallet(private_key, ethers.provider)
     

  async function queueAndExecute() {
  const functionToCall = "transfer"
  const biscuitToken = await ethers.getContract("BiscuitToken")
  const args = [wallet.address, tokenAmount];
  const encodedFunctionCall = biscuitToken.interface.encodeFunctionData(functionToCall, args)
  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

  const governor = await ethers.getContract("GovernorContract")
  console.log("Queueing...")
  const queueTx = await governor.queue([biscuitToken.address], [0], [encodedFunctionCall], descriptionHash)
  await queueTx.wait(1)

  console.log("Executing...")
  // this will fail on a testnet because you need to wait for the MIN_DELAY!
  const executeTx = await governor.execute(
    [biscuitToken.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  )
  await executeTx.wait()
  console.log("Queued and Executed!")
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
