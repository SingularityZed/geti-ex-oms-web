/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  BasicLayoutProps as ProLayoutProps,
  DefaultFooter, getMenuData, getPageTitle,
  MenuDataItem,
  PageHeaderWrapper,
  Settings,
} from '@ant-design/pro-layout';
import {createFromIconfontCN, DownOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {connect, Dispatch, history, Link, Redirect, Route, useIntl} from 'umi'; // import { GithubOutlined } from '@ant-design/icons';
import {Button, Dropdown, Menu, Result, Tabs} from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import {ConnectState} from '@/models/connect';
import {getAuthorityFromRouter} from '@/utils/utils';
import logo from '../assets/logo.png';
import {getUserMenu} from "@/services/manager";
import {Helmet, HelmetProvider} from "react-helmet-async";

const TabPane = Tabs.TabPane;
const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}

const findInTree = (treeData, key) => {
  if (!treeData) {
    return undefined;
  }
  for (let i = 0; i < treeData.length; i++) {
    let node = treeData[i];
    if (node.children && node.children.length > 0) {
      let _node = findInTree(node.children, key);
      if (_node) {
        return _node;
      }
    } else {
      if (node.component) {
        if (node.path == key) {
          return {tab: node.name, key: node.path, locale: node.locale, closable: true, content: node.component};
        }
      }
    }
  }
  return undefined;
}
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1329669_t1u72b9zk8s.js',
});

const defaultFooterDom = <DefaultFooter copyright="吉递(中国)能源科技有限公司" links={[]}/>;
const routeKey = '/welcome';

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: "/",
    },
    route
  } = props;
  const [tabList, setTabList] = useState<[]>([]);
  const [activeKey, setActiveKey] = useState();
  const [userMenus, setUserMenus] = useState([]);
  const [oldColorWeak, setOldColorWeak] = useState<boolean>(settings.colorWeak);

  useEffect(() => {
    if (localStorage.getItem("TOKEN")) {
      let userInfo = JSON.parse(localStorage.getItem("USERINFO"));
      getUserMenu(((userInfo || {}).user || {}).username).then((res) => {
        setUserMenus(res.data);
      }).catch(error => {
      });
      let routes = route.routes;
      let tab = findInTree(routes, location.pathname);
      if (tab) {
        tabList.push(tab);
        setActiveKey(location.pathname);
      } else {
        history.push(routeKey);
      }
    }
  }, []);

  useEffect(() => {
    if (oldColorWeak !== settings.colorWeak) {
      if (!oldColorWeak) {
        let tab = findInTree(route.routes, activeKey);
        if (tab) {
          setTabList([tab]);
        }
      }
      setOldColorWeak(settings.colorWeak);
    }
  }, [settings]);

  const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
    let localMenus = [];
    menuList.forEach(item => {
      let find = userMenus.find(_ => _.path == item.path);
      if (find) {
        const localItem = {...item, children: item.children ? menuDataRender(item.children) : [], order: 10000};
        localItem.name = find.name;
        localItem.icon = <IconFont type={find.icon}/>;
        localItem.order = find.order ? find.order : 10000;
        localMenus.push(Authorized.check(item.authority, localItem, null) as MenuDataItem);
      } else {
        // const localItem = {...item, children: item.children ? menuDataRender(item.children) : []};
        // localMenus.push(Authorized.check(item.authority, localItem, null) as MenuDataItem);
      }
    });
    localMenus.sort((a, b) => a.order - b.order)
    return localMenus;
  };

  const onPageChange = (location) => {//点击左侧菜单
    if (settings.colorWeak) {
      addTab(location.pathname);
    } else {
      let routes = route.routes;
      let tab = findInTree(routes, location.pathname);
      if (tab) {
        setTabList([tab]);
        setActiveKey(location.pathname);
      }
    }
  }

  const addTab = (key) => {//点击左侧菜单
    let routes = route.routes;
    let tab = findInTree(routes, key);
    if (tab) {
      let exitTab = tabList.find(_tab => _tab.key == key);
      if (!exitTab) {
        setTabList([...tabList, tab]);
      }
      setActiveKey(key);
    }
  }

  // 切换 tab页 router.push(key);
  const onChange = key => {
    history.push(key);
    setActiveKey(key);
  };

  // 新增和删除页签的回调
  const onEdit = (targetKey, action) => {
    let tmpActiveKey = activeKey;
    if (action == 'remove') {
      if (tabList.length == 1) {
        setTabList([]);
        history.push(routeKey);
        return;
      }

      let lastIndex;
      tabList.forEach((tab, i) => {
        if (tab.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const tabListTmp = [];
      tabList.map(tab => {
        if (tab.key !== targetKey) {
          tabListTmp.push(tab);
        }
      });
      if (lastIndex >= 0 && activeKey === targetKey) {
        tmpActiveKey = tabListTmp[lastIndex].key;
      }
      history.push(tmpActiveKey);
      setActiveKey(tmpActiveKey);
      setTabList(tabListTmp);
    }
  }

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const {} = useIntl();

  const onClickHover = (e) => {
    // message.info(`Click on item ${key}`);
    let {key} = e;
    if (key === 'closeCurrent') {
      onEdit(activeKey, 'remove');
    } else if (key === 'closeOther') {
      setTabList(tabList.filter((v) => v.key === activeKey));
      setActiveKey(activeKey);
    } else if (key === 'closeAll') {
      setTabList([]);
      history.push(routeKey);
    }
  }

  const menu = (
    <Menu onClick={onClickHover}>
      <Menu.Item key="closeCurrent">关闭当前标签页</Menu.Item>
      <Menu.Item key="closeOther">关闭其他标签页</Menu.Item>
      <Menu.Item key="closeAll">关闭全部标签页</Menu.Item>
    </Menu>
  )
  const operations = (
    <Dropdown overlay={menu}>
      <a className="ant-dropdown-link" href="#">
        标签操作<DownOutlined/>
      </a>
    </Dropdown>
  )

  function getPageTitleInner() {
    let {breadcrumb} = getMenuData(route.routes);
    return getPageTitle({
      pathname: location.pathname,
      breadcrumb: breadcrumb,
      title: settings.title
    });
  }

  const title = getPageTitleInner();

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title}/>
      </Helmet>

      {!localStorage.getItem("TOKEN") && <Redirect to={"/user/login"}/>}
      <ProLayout
        logo={logo}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">

            {logoDom}

          </Link>
        )}
        breadcrumbRender={settings.colorWeak ? () => [] : _ => _}
        onCollapse={handleMenuCollapse}
        onPageChange={onPageChange}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => defaultFooterDom}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent/>}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {settings.colorWeak ? (
              tabList && tabList.length ? (
                <Tabs
                  className={`ant-pro-page-header-wrap-tabs`}
                  activeKey={activeKey}
                  onChange={onChange}
                  tabBarExtraContent={operations}
                  tabBarStyle={{background: '#fff'}}
                  tabPosition="top"
                  // tabBarGutter={-1}
                  hideAdd
                  type="editable-card"
                  onEdit={onEdit}
                >
                  {tabList.map(item => (
                    <TabPane tab={item.tab} key={item.key} closable={item.closable}>
                      <PageHeaderWrapper title={false} pageHeaderRender={() => null}>
                        <Route key={item.key} path={item.path} component={item.content} exact={item.exact}/>
                      </PageHeaderWrapper>
                    </TabPane>
                  ))}
                </Tabs>
              ) : null) :
            (
              <PageHeaderWrapper title={false}>
                {children}
              </PageHeaderWrapper>
            )}
        </Authorized>
      </ProLayout>
    </HelmetProvider>
  );
};

export default connect(({global, settings}: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
