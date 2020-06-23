
const logger = require('simple-node-logger').createSimpleLogger()

logger.setLevel("warn")

const axios = require('axios')

let apiUrl = ''
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

module.exports = (url, historyUrl, apiTimeout = 6000) => {
  apiUrl = url
  timeout = apiTimeout
  return { getChainInfo, getBlockInfo }
}
