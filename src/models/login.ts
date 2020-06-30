import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin } from '@/services/login';
import { setAuthority, setToken, setUserInfo } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import defaultSettings from "../../config/defaultSettings";

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(fakeAccountLogin, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      } catch (error) {

      }


      if (response?.status == 200) {
        let Token = response.data.data.token;
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };

        setUserInfo(JSON.stringify(response.data.data))
        setToken(Token);
        // localStorage.setItem('USERCONFIG', JSON.stringify(response.data.data.config));
        // TODO
        localStorage.setItem('USERCONFIG', JSON.stringify(defaultSettings));

        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/welcome';
            return;
          }
        }
        window.location.href = redirect || '/'
        // history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
