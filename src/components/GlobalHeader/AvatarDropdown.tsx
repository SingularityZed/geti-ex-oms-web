import {LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar, Menu, message} from 'antd';
import {ClickParam} from 'antd/es/menu';
import React from 'react';
import {connect, ConnectProps, history} from 'umi';
import {ConnectState} from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {getUserInfo} from '../../utils/authority';
import UpdatePassword from "@/pages/user/password/UpdatePassword";
import request from "@/utils/axiosReques";
import SettingDrawer from "@/components/SettingDrawer";
import {Settings} from "@ant-design/pro-layout";

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  menu?: boolean;
  settings: Settings;
}

interface UserInfo {
  visible: boolean,
  settingDrawerShow: boolean
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {

  state: UserInfo = {visible: false, settingDrawerShow: false};
  onMenuClick = (event: ClickParam) => {
    const {key} = event;

    if (key === 'logout') {
      const {dispatch} = this.props;
      if (dispatch) {
        request.get('/manager-service/v1/logout/' + (JSON.parse(localStorage.getItem("USERINFO")).user.userId))
          .then(() => {
            return new Promise((resolve, reject) => {
              localStorage.clear()
              location.reload();
            });
          })
          .catch(() => {
            message.error("退出系统失败");
          });
      }
      return;
    } else if (key === 'userProfile') {
      history.push(`/userProfile`);
    } else if (key === 'password') {
      //修改密码Model框
      this.setState({visible: true})
    } else if (key === 'settings') {
      this.setState({settingDrawerShow: true})
    }
  };

  componentDidMount() {
    let str = getUserInfo();
    let userInfo = str == '' ? {} : JSON.parse(getUserInfo());
    this.setState({
      operatorName: ((userInfo || {}).user || {}).username,
      avaUrl: ((userInfo || {}).user || {}).avatar ? 'https://static.geti365.com/web/avatar/' + ((userInfo || {}).user || {}).avatar : undefined
    });

    // 头像实时变化
    var orignalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, newValue) {
      var setItemEvent = new Event("setItemEvent");
      setItemEvent.key = key;
      setItemEvent.newValue = newValue;
      window.dispatchEvent(setItemEvent);
      orignalSetItem.apply(this, arguments);
    };
    window.addEventListener("setItemEvent", function (e) {
      if (e.key == 'avaUrl') {
        this.setState({
          avaUrl: e.newValue
        });
      }
    }.bind(this));

  }


  render(): React.ReactNode {
    const {
      menu, dispatch, settings
    } = this.props;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="userProfile">
          <SettingOutlined/>
          个人设置
        </Menu.Item>
        <Menu.Item key="settings">
          <SettingOutlined/>
          主题设置
        </Menu.Item>
        <Menu.Item key="password">
          <SettingOutlined/>
          修改密码
        </Menu.Item>
        {menu && <Menu.Divider/>}

        <Menu.Item key="logout">
          <LogoutOutlined/>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size="small"
              className={styles.avatar}
              src={this.state.avaUrl || 'https://static.geti365.com/web/avatar/default.jpg'}
              alt="avatar"
            />
            <span className={styles.name}>{this.state.operatorName}</span>
          </span>
        </HeaderDropdown>
        {this.state.visible && <UpdatePassword handleReturn={() => {
          this.setState({visible: false})
        }}/>}
        {this.state.settingDrawerShow && <SettingDrawer
          settings={settings}
          onClose={() => this.setState({settingDrawerShow: false})}
          onSettingChange={(config) =>
            dispatch({
              type: 'settings/changeSetting',
              payload: config,
            })
          }
        />}
      </>

    );
  }
}

export default connect(({settings}: ConnectState) => ({
  settings: settings,
}))(AvatarDropdown);


