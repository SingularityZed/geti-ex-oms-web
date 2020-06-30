import {Reducer} from 'umi';
import defaultSettings, {DefaultSettings} from '../../config/defaultSettings';
import {userConfig} from "@/services/manager";
import {message} from "antd";

export interface SettingModelType {
  namespace: 'settings';
  state: DefaultSettings;
  reducers: {
    changeSetting: Reducer<DefaultSettings>;
  };
}

const SettingModel: SettingModelType = {
  namespace: 'settings',
  state: localStorage.getItem("USERCONFIG") ? JSON.parse(localStorage.getItem("USERCONFIG")) : defaultSettings,
  reducers: {
    changeSetting(state = localStorage.getItem("USERCONFIG") ?
      JSON.parse(localStorage.getItem("USERCONFIG")) : defaultSettings,
                  {payload}) {
      const {contentWidth} = payload;
      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
      let config = {
        ...state,
        ...payload,
      }
      // TODO
      // userConfig(config).then(res => {
      //   message.success("保存成功",1);
      // }).catch(error => {
      // });
      localStorage.setItem('USERCONFIG', JSON.stringify(config));
      return config;
    },
  },
};
export default SettingModel;
