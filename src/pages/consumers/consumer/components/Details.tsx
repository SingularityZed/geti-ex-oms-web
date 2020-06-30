import {Card, Descriptions, message, Modal} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {enums, getEnumText} from "@/utils/enums";
import {
  directional,
  disableUserDetailState,
  enableUserDetailState,
  getConsumerDetail,
  normal,
  refreshToken,
  unbindingBattery
} from "@/services/consumer";
import DetailSiderBar from "@/components/DetailSiderBar";
import PayOrderModelTable from "@/components/PayOrderModelTable";
import ExchangeOrderModelTable from "@/components/ExchangeOrderModelTable";
import {buttons, hasAuthority} from "@/utils/buttons";

interface DetailModalProps {
  consumerId: number | undefined;
  handleReturn: () => void;
}

const Details: FC<DetailModalProps> = (props) => {
  const {confirm} = Modal;
  const [consumerInfo, setConsumerInfo] = useState({});
  const [consumerBizInfo, setConsumerBizInfo] = useState({});
  const [oauthInfo, setOauthInfo] = useState({});
  const [exchangeOrderTableVisible, setExchangeOrderTableVisible] = useState<boolean>(false);
  const [payOrderTableVisible, setPayOrderTableVisible] = useState<boolean>(false);
  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    getConsumerDetail(props.consumerId).then((res) => {
      setConsumerInfo(res.data.data.consumerInfo)
      setConsumerBizInfo(res.data.data.bizInfo)
      setOauthInfo(res.data.data.oauthInfo)
    })
  }, []);


  /**
   * 页面刷新加载数据
   */
  function refresh() {
    getConsumerDetail(props.consumerId).then((res) => {
      setConsumerInfo(res.data.data.consumerInfo)
      setConsumerBizInfo(res.data.data.bizInfo)
      setOauthInfo(res.data.data.oauthInfo)
    })
  }

  /**
   * 设为定向用户 按钮点击事件
   */
  const directionalOnClick = () => {
    confirm({
      title: '确定设为定向用户',
      icon: <ExclamationCircleOutlined/>,
      content: '当您点击确定按钮后，用户将被设置为定向用户',
      onOk: directionalModelOnOk,
    });
  }

  /**
   * 设为定向用户 model框ok按钮事件
   */
  const directionalModelOnOk = () => {
    directional(consumerInfo.id).then((res) => {
      refresh();
      message.success(res.data.message);
    })
  }

  /**
   * 设为普通用户 按钮点击事件
   */
  const normalOnClick = () => {
    confirm({
      title: '确定设为普通用户',
      icon: <ExclamationCircleOutlined/>,
      content: '当您点击确定按钮后，用户将被设置为普通用户',
      onOk: normalModelOnOk
    });
  }

  /**
   * 设为普通用户 model框ok按钮事件
   */
  const normalModelOnOk = () => {
    normal(consumerInfo.id).then((res) => {
      refresh();
      message.success(res.data.message);
    })
  }

  /**
   * 刷新会话 按钮点击事件
   */
  const refreshTokenOnClick = () => {
    refreshToken(consumerInfo.id).then((res) => {
      refresh();
      message.success(res.data.message);
    })
  }

  /**
   * 启用 按钮点击事件
   */
  const enableUserOnClick = () => {
    confirm({
      title: '启用用户?',
      icon: <ExclamationCircleOutlined/>,
      onOk: enableUserModelOnOk,
    });
  }

  /**
   * 启用 model框ok按钮事件
   */
  const enableUserModelOnOk = () => {
    enableUserDetailState(consumerInfo.id).then((res) => {
      refresh();
      message.success(res.data.message);
    })
  }

  /**
   * 禁用 按钮点击事件
   */
  const disableUserOnClick = () => {
    confirm({
      title: '禁用用户?',
      icon: <ExclamationCircleOutlined/>,
      onOk: disableUserModelOnOk,
    });
  }

  /**
   * 禁用 model框ok按钮事件
   */
  const disableUserModelOnOk = () => {
    disableUserDetailState(consumerInfo.id).then((res) => {
      refresh();
      message.success(res.data.message);
    })
  }

  /**
   * 交易记录 按钮点击事件
   */
  const payOrderOnClick = () => {
    setPayOrderTableVisible(true)
  }

  /**
   * 交易记录 model框close
   */
  const payOrderTableClose = () => {
    setPayOrderTableVisible(false)
  }

  /**
   * 换电记录 按钮点击事件
   */
  const exchangeOrderInfoOnClick = () => {
    setExchangeOrderTableVisible(true)
  }

  /**
   * 换电记录 model框close
   */
  const exchangeOrderTableClose = () => {
    setExchangeOrderTableVisible(false)
  }

  /**
   * 解绑电池 按钮点击事件
   */
  const unbindingBatteryOnClick = () => {
    confirm({
      title: '确定解绑电池',
      icon: <ExclamationCircleOutlined/>,
      content: '请确定电池在仓库中再解绑电池',
      onOk: unbindingBatteryModelOnClick,
    });
  }

  /**
   * 解绑电池 model框ok按钮事件
   */
  const unbindingBatteryModelOnClick = () => {
    unbindingBattery(consumerInfo.id).then((res) => {
      refresh();
      message.success(res.data.message);
    })
  }

  return (
    <div>
      <DetailSiderBar handleReturn={props.handleReturn}/>
      <Card title="基本信息"
            extra={
              <>
                {hasAuthority(buttons.consumers.consumer.detail.directional) && consumerInfo.userType != 3 &&
                <a onClick={directionalOnClick}>设为定向用户</a>}
                {hasAuthority(buttons.consumers.consumer.detail.normal) && consumerInfo.userType == 3 &&
                <a style={{marginLeft: 10}} onClick={normalOnClick}>设为普通用户</a>}
                {hasAuthority(buttons.consumers.consumer.detail.refreshToken) &&
                <a style={{marginLeft: 10}} onClick={refreshTokenOnClick}>刷新会话</a>}
                {hasAuthority(buttons.consumers.consumer.detail.enable) && consumerInfo.userStatus != 1 &&
                <a style={{marginLeft: 10}} onClick={enableUserOnClick}>启用</a>}
                {hasAuthority(buttons.consumers.consumer.detail.disable) && consumerInfo.userStatus == 1 &&
                <a style={{marginLeft: 10}} onClick={disableUserOnClick}>禁用</a>}
              </>
            }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="用户名:">{consumerInfo.name}</Descriptions.Item>
          <Descriptions.Item label="用户ID:">{consumerInfo.id}</Descriptions.Item>
          <Descriptions.Item label="手机号码:">{consumerInfo.mobileNo}</Descriptions.Item>
          <Descriptions.Item label="微信Openid:">{oauthInfo.openid}</Descriptions.Item>
          <Descriptions.Item label="注册时间:">{consumerInfo.createTime}</Descriptions.Item>
          <Descriptions.Item label="用户类别:">{getEnumText(enums.UserTypeEnum, consumerInfo.userType)}</Descriptions.Item>
          <Descriptions.Item label="城市-区域:">{consumerBizInfo.city + '-' + consumerBizInfo.area}</Descriptions.Item>
          <Descriptions.Item label="实名认证:">{consumerInfo.idCardValid === 1 ? '已实名认证' : '未认证'}</Descriptions.Item>
          <Descriptions.Item label="最近登录日期:">{consumerInfo.updateTime}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="用户钱包" style={{marginTop: "30px"}}
            extra={
              <>{hasAuthority(buttons.consumers.consumer.detail.payOrder) &&
              <a onClick={payOrderOnClick}>交易记录</a>}</>
            }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="押金">￥{(consumerBizInfo.depositAmount / 100).toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="运营商:">{consumerBizInfo.merchantName}</Descriptions.Item>
          <Descriptions.Item label="套餐截至日期:">{consumerBizInfo.packageEndDay}</Descriptions.Item>
          <Descriptions.Item label="套餐剩余次数:">{consumerBizInfo.packageTimes}</Descriptions.Item>
          <Descriptions.Item
            label="押金模式:">{getEnumText(enums.ConsumerDepositModelEnum, consumerBizInfo.depositModel)}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="业务信息" style={{marginTop: "30px"}}
            extra={
              <>
                {hasAuthority(buttons.consumers.consumer.index.exchangeOrder) &&
                <a onClick={exchangeOrderInfoOnClick}>换电记录</a>}
                {hasAuthority(buttons.consumers.consumer.detail.unbindingBattery) && consumerBizInfo.batteryDeviceCode != null &&
                <a style={{marginLeft: 10}} onClick={unbindingBatteryOnClick}>解绑电池</a>
                }
              </>
            }
      >
        <Descriptions column={2}>
          <Descriptions.Item label="电池编号:">{consumerBizInfo.batteryDeviceCode}</Descriptions.Item>
          <Descriptions.Item
            label="电池规格:">{getEnumText(enums.BatterySpecificationEnum, consumerBizInfo.batterySpecification)}</Descriptions.Item>
          <Descriptions.Item label="首次加入运营商时间:">{consumerBizInfo.createTime}</Descriptions.Item>
        </Descriptions>
      </Card>
      {payOrderTableVisible &&
      <PayOrderModelTable closeModel={payOrderTableClose} consumerId={consumerInfo.id}/>}
      {exchangeOrderTableVisible &&
      <ExchangeOrderModelTable closeModel={exchangeOrderTableClose} mobileNo={consumerInfo.mobileNo}/>}
    </div>
  );
};

export default Details;
