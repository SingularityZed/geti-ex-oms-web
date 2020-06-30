import React from 'react';
import {connect, ConnectProps} from 'umi';
import {ConnectState} from '@/models/connect';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import SelectMerchant from "@/components/SelectMerchant";

export type SiderTheme = 'light' | 'dark';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const {theme, layout} = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <SelectMerchant className={styles.action}/>
      <Avatar settings={props.settings} dispatch={props.dispatch}/>
    </div>
  );
};

export default connect(({settings}: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
