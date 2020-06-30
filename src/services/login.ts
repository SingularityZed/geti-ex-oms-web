import request from '@/utils/axiosReques';
//import request from 'umi-request';

export interface LoginParamsType {
  userName: string;
  password: string;
  // mobile: string;
  // captcha: string;
}

// export async function fakeAccountLogin(params: LoginParamsType) {
//   return request('/api/manager-service/v1/login', {
//     method: 'POST',
//     data: params,
//   });
// }

export async function fakeAccountLogin(params: LoginParamsType) {
  return request.post('/manager-service/v1/login',params);
}

export async function getFakeCaptcha(mobile: string) {
  return request.get(`/api/login/captcha?mobile=${mobile}`);
}
