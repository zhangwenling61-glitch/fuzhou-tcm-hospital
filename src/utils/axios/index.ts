import Axios from 'axios'
import taroAdapter from './taroAdapter'
if (process.env.TARO_ENV !== 'h5') {
  Axios.defaults.adapter = taroAdapter
}

export default Axios
