import {Card, Descriptions, message, Modal} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {enableOrganization, forbidOrganization, getOrganizationInfo} from "@/services/merchant.ts";
import {getUserManger} from "@/services/manager.ts";
import DetailSiderBar from "@/components/DetailSiderBar";
import {buttons, hasAuthority} from "@/utils/buttons";

interface DetailModalProps {
  orgId: number | undefined;
  handleReturn: () => void;
}

const Details: FC<DetailModalProps> = (props) => {
  const {confirm} = Modal;
  const [organization, setOrganization] = useState({});
  const [username, setUsername] = useState('');

  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    getOrganizationInfo(props.orgId).then((res) => {
      setOrganization(res.data.data);
    })
  }, []);

  useEffect(() => {
    getUserManger(props.orgId).then((res) => {
      setUsername(res.data.userName);
    })
  }, [organization]);

  /**
   * 页面刷新加载数据
   */
  function refresh() {
    getOrganizationInfo(props.orgId).then((res) => {
      setOrganization(res.data.data);
    })
  }

  /**
   * 启用 按钮点击事件
   */
  const enableUserOnClick = () => {
    confirm({
      title: '启用?',
      icon: <ExclamationCircleOutlined/>,
      onOk: enableUserModelOnOk,
    });
  }

  /**
   * 启用 model框ok按钮事件
   */
  const enableUserModelOnOk = () => {
    enableOrganization({id: props.orgId}).then((res) => {
      refresh();
      message.success(res.data.message);
    })
  }

  /**
   * 禁用 按钮点击事件
   */
  const disableUserOnClick = () => {
    confirm({
      title: '禁用?',
      icon: <ExclamationCircleOutlined/>,
      onOk: disableUserModelOnOk,
    });
  }

  /**
   * 禁用 model框ok按钮事件
   */
  const disableUserModelOnOk = () => {
    forbidOrganization({id: props.orgId}).then((res) => {
      refresh();
      message.success(res.data.message);
    })
  }

  return (
    <div>
      <DetailSiderBar handleReturn={props.handleReturn}/>
      <Card title="运营商信息"
            extra={
              <>
                {hasAuthority(buttons.merchant.merchant.detail.enable) && organization.enabled == false &&
                <a style={{marginLeft: 10}} onClick={enableUserOnClick}>启用</a>}
                {hasAuthority(buttons.merchant.merchant.detail.disable) && organization.enabled == true &&
                <a style={{marginLeft: 10}} onClick={disableUserOnClick}>禁用</a>}
              </>
            }
      >
        <Descriptions column={{xxl: 2, xl: 2, sm: 2, xs: 1}}>
          <Descriptions.Item label="名称">{organization.operationName}</Descriptions.Item>
          <Descriptions.Item label="商户账号">{username}</Descriptions.Item>
          <Descriptions.Item label="联系人">{organization.contactPerson}</Descriptions.Item>
          <Descriptions.Item
            label="地区">{organization.province}-{organization.city}-{organization.area}</Descriptions.Item>
          <Descriptions.Item label="电话">{organization.contactTelephone}</Descriptions.Item>
          <Descriptions.Item label="地址">{organization.address}</Descriptions.Item>
          <Descriptions.Item label="合作模式">{organization.cooperationName}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{organization.createTime}</Descriptions.Item>
          <Descriptions.Item label="企业名称">{organization.enterpriseName}</Descriptions.Item>
          <Descriptions.Item label="统一社会信用代码">{organization.unifiedSocialCreditCode}</Descriptions.Item>
          <Descriptions.Item label="换电网络名称">{organization.powerExchangeNetworkName}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Details;
