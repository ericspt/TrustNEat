//const DappToken = artifacts.require('DappToken')
const Review = artifacts.require('Review')

module.exports = async function (deployer, network, accounts) {

    await deployer.deploy(Review)
    const review = await Review.deployed()

    /*await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
    const tokenFarm = await TokenFarm.deployed()

    await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

    // to investor 
    await daiToken.transfer(accounts[1], '1000000000000000000000000')*/

};
