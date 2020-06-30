import {DefaultFooter, getMenuData, getPageTitle, MenuDataItem} from '@ant-design/pro-layout';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {connect, ConnectProps, Link, useIntl} from 'umi';
import React from 'react';
import {ConnectState} from '@/models/connect';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const {routes = []} = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const {} = useIntl();
  const {breadcrumb} = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title}/>
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo}/>
                {/* <span className={styles.title}>Ant Design</span> */}
              </Link>
            </div>
          </div>
          {children}
        </div>
        <DefaultFooter copyright="吉递(中国)能源科技有限公司" links={[]}/>
      </div>
    </HelmetProvider>
  );
};

export default connect(({settings}: ConnectState) => ({...settings}))(UserLayout);
