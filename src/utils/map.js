import axios from 'axios'

export default function MapLoader () {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=309d27a9a912a6011ecf07aff92e8e2d'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}


const options = {
  // withCredentials: true,
  // api请求统一前缀
  responseType: 'json',
  // baseURL: devConfig.apiPrefix,
  validateStatus (status) {
    // 200 外的状态码都认定为失败
    return status === 200
  }
}

const Axios = axios.create(options)
const key = "923d4dbf904827db3f3aca33e43e87c5"
const request = {
  get (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return Axios.get(`${url}${_params}`)
  }
}
export const Maps = {
  /**
   * 运营商
   */
  getMapSearch (data) { // 运营商组织信息分页
    data.key = key
    return request.get('https://restapi.amap.com/v3/place/text', data)
  },
  getMapGps (data) {
    data.key = key
    return request.get('https://restapi.amap.com/v3/geocode/regeo', data)
  }
}
