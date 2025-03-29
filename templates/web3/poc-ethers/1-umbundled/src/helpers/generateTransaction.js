const { Wallet, Transaction, JsonRpcProvider, parseEther } = require('ethers')

// keep this outside the function to avoid creating a new provider every time
const provider = new JsonRpcProvider(process.env.JSON_RPC_URL)

// For demostration purposes only. Do not use this in production.
module.exports.generateTx = async ({ from, to, amount, privateKey = null }) => {
  if (!from || !to || !amount) {
    throw new Error('Missing required fields: from, to, amount')
  }

  const unsignedTx = await generateUnsignedTx({ from, to, amount })
  if (!privateKey) {
    return {
      hash: unsignedTx.hash,
      digest: unsignedTx.unsignedHash,
      signedTx: null,
      unsignedTx: unsignedTx.unsignedSerialized
    }
  }

  const wallet = new Wallet(privateKey)
  if (wallet.address.toLowerCase() !== from.toLowerCase()) {
    // Yes, we could just calculate the address from the private key and make "from" optional.
    // Let's keep it simple — remember this is just a PoC.
    throw new Error('Provided private key does not match the from address')
  }
  const signedTx = Transaction.from(await wallet.signTransaction(unsignedTx))

  return {
    hash: signedTx.hash,
    digest: signedTx.unsignedHash,
    signedTx: signedTx.serialized,
    unsignedTx: signedTx.unsignedSerialized
  }
}

const generateUnsignedTx = async ({ from, to, amount }) => {
  const [nonce, chainId, feeData] = await Promise.all([
    provider.getTransactionCount(from),
    provider.getNetwork().then(n => n.chainId),
    provider.getFeeData()
  ])

  const unsignedTx = isEIP1559Supported(feeData)
    ? makeEIP1559UnsignedTx({ to, amount, nonce, chainId, feeData })
    : makeLegacyUnsignedTx({ to, amount, nonce, chainId })

  return unsignedTx
}

function makeEIP1559UnsignedTx ({ to, amount, nonce, chainId, feeData }) {
  return Transaction.from({
    type: 2, // EIP-1559 type
    to,
    value: parseEther(amount),
    nonce,
    chainId,
    gasLimit: 21000n, // always 21000 for simple eth transfer
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas
  })
}

function makeLegacyUnsignedTx ({ from, to, amount, nonce, chainId }) {
  return Transaction.from({
    type: 0, // Legacy type
    to,
    value: parseEther(amount),
    nonce,
    chainId,
    gasLimit: 21000n // always 21000 for simple eth transfer
  })
}

function isEIP1559Supported (feeData) {
  return feeData.maxFeePerGas != null && feeData.maxPriorityFeePerGas != null
}
