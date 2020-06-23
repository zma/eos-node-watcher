
const logger = require('simple-node-logger').createSimpleLogger()

const axios = require('axios')

let apiUrl = ''
let historyApiUrl = ''
let timeout = 6000

const getChainInfo = () => {
  return axios.get(apiUrl + '/chain/get_info', {timeout})
  .then(res => res.data)
}

const getBlockInfo = blockNum => {
  return axios.post(
    apiUrl + '/chain/get_block',
    {block_num_or_id: blockNum},
    {timeout}
  ).then(res => res.data)
}

const getTransaction = id => {
  logger.info(`getTransaction: ${id}`)
  randomApi = historyApiUrl[Math.floor(Math.random()*historyApiUrl.length)]
  logger.info(`request to: ${randomApi}/history/get_transaction`)
  return axios.post(
    randomApi + '/history/get_transaction',
    {"id": id},
    {timeout}
  ).then(res => {
    logger.info(`res:`, JSON.stringify(res))
    res.data
  }).catch(error => {
    logger.info(`error:`, JSON.stringify(error))
  })
}

const getBulkTransactions = ids => {
  const transactionsPromises = ids.map(getTransaction)
  return Promise.all(transactionsPromises)
}

module.exports = (url, historyUrl, apiTimeout = 6000) => {
  apiUrl = url
  historyApiUrl = historyUrl
  timeout = apiTimeout
  return { getChainInfo, getBlockInfo, getTransaction, getBulkTransactions }
}
