const logger = require('simple-node-logger').createSimpleLogger()

logger.setLevel("warn")

let accounts = {}

const actionFiltered = (listeningActions, action) => {
  const listeningAction = listeningActions.find(a => a.name === action.name)

  if (!listeningAction) {
    logger.info("actionFiltered: no listening action found")
    return false
  }

  if (listeningAction && listeningAction.data) {
    let valids = 0, total = 0
    for (const key in listeningAction.data) {
      total++
      if (listeningAction.data[key] === action.data[key])
        valids++
    }

    return valids === total
  } else {
    return true
  }

}

const isValidAction = action => {
  const contractActions = accounts[action.account]
  return contractActions &&
    (contractActions.length === 0 ||
    actionFiltered(contractActions, action))
}

const filteredTransactions = block => {
  if (!block || !block.transactions || !block.transactions.length) {
    logger.info("Seems empty block.")
    return
  }

  const { transactions, block_num } = block

  return transactions
    .filter(transaction => {
      return transaction.trx && transaction.trx.transaction &&
        transaction.trx.transaction.actions &&
        transaction.trx.transaction.actions.length > 0 &&
        transaction.trx.transaction.actions.filter(isValidAction).length > 0
    })
}

module.exports = (accountsParam) => {
  accounts = accountsParam
  return { filteredTransactions }
}
