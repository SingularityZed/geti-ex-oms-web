import axios from 'axios';
import { Modal, notification, message } from 'antd';

import db from './localstorage';
import proxy from '../../config/proxy';
// const server: AxiosInstance = axios.create();
// server.interceptors.request.use((config: AxiosRequestConfig) => {
//   //请求拦截
//   return config;
// });
// server.interceptors.response.use(
//   (res: AxiosResponse) => {
//     if (res.status === 200) {
//       //请求成功后 直接需要的返回数据
//       res = res.data;
//     }
//     return res;
//   },
//   (err: AxiosError) => {},
// );

const options = {
  // withCredentials: true,
  // api请求统一前缀
  responseType: 'json' as 'json',
  // baseURL: devConfig.apiPrefix,
  baseURL: proxy[REACT_APP_ENV || 'dev']["/api/"].target,
  validateStatus(status: number) {
    // 200 外的状态码都认定为失败
    return status === 200;
  },
};
const Axios = axios.create(options);
const TOKEN = db.get('TOKEN')
// console.log(TOKEN,'TOKEN')
// request请求拦截处理
Axios.interceptors.request.use(
  (config) => {
    // 有 token就带上
    if (TOKEN) {
      config.headers.Authentication = TOKEN
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

Axios.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      if (response.data.code !== '000000') {
        notification.error({
          message: '系统提示',
          description: response.data.message,
          duration: 4,
        });
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      let errorMessage =
        error.response.data === null
          ? '系统内部异常，请联系网站管理员'
          : error.response.data.message;
      switch (error.response.status) {
        case 401:
          notification.warn({
            message: '系统提示',
            description: '很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效',
            duration: 4,
          });
          break;
        case 403:
          notification.warn({
            message: '系统提示',
            description: '拒绝访问',
            duration: 4,
          });
          break;
        case 404:
          notification.warn({
            message: '系统提示',
            description: '很抱歉，资源未找到',
            duration: 4,
          });
          break;
        case 500:
          if (error.response.data.code === '000002') {
            Modal.error({
              title: '登录已过期',
              content: '很抱歉，登录已过期，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                return new Promise((resolve, reject) => {
                  db.clear();
                  window.location.href = '/user/login'
                  //location.reload();
                });
              },
            });
          } else if (error.response.data.code === '000011') {
            Modal.error({
              title: '密码已修改',
              content: '很抱歉，登录已修改，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                return new Promise((resolve, reject) => {
                  db.clear();
                  window.location.href = '/user/login'
                  // location.reload();
                });
              },
            });
          } else {
            notification.error({
              message: '系统提示',
              description: errorMessage,
              duration: 4,
            });
          }
          break;
        default:
          notification.error({
            message: '系统提示',
            description: errorMessage,
            duration: 4,
          });
          break;
      }
    } else {
      notification.error({
        message: '系统提示',
        description: '连接到服务器失败',
        duration: 4,
      });
    }
    return Promise.reject();
  },
);

const request = {
  post(url: string, params?: any) {
    return Axios.post(url, params, {
      transformRequest: [(params) => {
        return JSON.stringify(params)
      }],
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
  },
  put(url: string, params?: any) {
    return Axios.put(url, params, {
      transformRequest: [(params) => {
        return JSON.stringify(params.params)
      }],
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  },
  upload(url: string, params: any) {
    return Axios.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  get(url: string, params?: any) {
    let _params;
    if (Object.is(params?.params, undefined)) {
      _params = '';
    } else {
      _params = '?';
      for (let key in params?.params) {
        if (params?.params.hasOwnProperty(key) && params?.params[key] !== null) {
          _params += `${key}=${params?.params[key]}&`;
        }
      }
    }
    return Axios.get(`${url}${_params}`);
  },
  async export(url: string, params = {}) {
    message.loading('导出数据中')
    try {
      const r = await Axios.post(url, params, {
        transformRequest: [(params) => {
          let result = '';
          Object.keys(params).forEach((key) => {
            if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
              result += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
            }
          });
          return result;
        }],
        responseType: 'blob'
      });
      const content = r.data;
      const blob = new Blob([content]);
      const fileName = `${new Date().getTime()}_导出结果.xlsx`;
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      }
      else {
        navigator.msSaveBlob(blob, fileName);
      }
    }
    catch (r_1) {
      message.error(r_1);
      message.error('导出失败');
    }
  },
  delete(url: string, params: { [x: string]: any; hasOwnProperty?: any; }) {
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
    return Axios.delete(`${url}${_params}`)
  },
};

export default request;
