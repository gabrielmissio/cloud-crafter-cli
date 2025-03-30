const { Wallet } = require('ethers')

// For demostration purposes only. Do not use this in production.
exports.generateAddress = async () => {
  const wallet = Wallet.createRandom()
  return {
    address: wallet.address,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey
  }
}
