import React, {useState} from 'react';
import {Button, Card, Col, Descriptions, Form, Input, message, Modal, Row} from "antd";
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {Consumer} from "@/pages/consumers/rightTransfer/data";
import {enums, getEnumText} from "@/utils/enums";
import {getRight, rightTransfer} from "@/services/consumer";
import {ArrowRightOutlined} from "@ant-design/icons/lib";
import {buttons, hasAuthority} from "@/utils/buttons";

const RightTransfer: React.FC<{}> = () => {
  const {confirm} = Modal;
  const defaultConsumer = {
    consumerInfo: {
      name: '',
      mobileNo: '',
      idCardValid: null
    },
    bizInfo: {
      depositModel: null,
      depositStatus: null,
      packageEndDay: '',
      batteryDeviceCode: '',
      groupName: ''
    }
  }
  const [sourceConsumerForm] = Form.useForm();
  const [targetConsumerForm] = Form.useForm();
  const [sourceConsumer, setSourceConsumer] = useState<Consumer>(defaultConsumer);
  const [targetConsumer, setTargetConsumer] = useState<Consumer>(defaultConsumer);

  /**
   * 待转移账号查询 按钮点击事件
   */
  const sourceConsumerSearchOnClick = () => {
    sourceConsumerForm.validateFields().then(values => {
      getRight(values.mobileNo).then((res) => {
        message.success(res.data.message);
        setSourceConsumer(res.data.data)
      });
    }).catch(errorInfo => {
    });
  }

  /**
   * 目标账号查询 按钮点击事件
   */
  const targetConsumerSearchOnClick = () => {
    targetConsumerForm.validateFields().then(values => {
      getRight(values.mobileNo).then((res) => {
        message.success(res.data.message);
        setTargetConsumer(res.data.data)
      });
    }).catch(errorInfo => {
    });
  }

  /**
   * 权限转移 按钮点击事件
   */
  const rightTransferOnClick = (record) => {
    let outMobileNo = sourceConsumerForm.getFieldValue('mobileNo');
    let inMobileNo = targetConsumerForm.getFieldValue('mobileNo');
    if (outMobileNo === undefined || outMobileNo === '' || inMobileNo === undefined || inMobileNo === '') {
      message.error("请输入完整信息");
      return;
    }
    confirm({
      title: '确认转移?',
      icon: <ExclamationCircleOutlined/>,
      content: targetConsumer.consumerInfo.idCardValid == 1 ?
        '确认将待转移账号权益资产转移至目标账户吗' :
        '目标账户无实名信息，确认转移即同意待转移账号实名信息一并转移',
      onOk: rightTransferModelOnOk
    })
  };

  /**
   * 权限转移 model框ok按钮事件
   */
  const rightTransferModelOnOk = () => {
    let params = {
      outMobileNo: sourceConsumerForm.getFieldValue('mobileNo'),
      inMobileNo: targetConsumerForm.getFieldValue('mobileNo')
    }
    rightTransfer(params).then((res) => {
      message.success(res.data.message);
      sourceConsumerForm.resetFields();
      targetConsumerForm.resetFields();
      setSourceConsumer(defaultConsumer);
      setTargetConsumer(defaultConsumer);
    });
  }

  return (
    <>
      <div>
        <Row gutter={24}>
          <Col span={9} style={{marginLeft: "5%"}}>
            <Card title="待转移账号" style={{height:'350px'}}>
              <Form form={sourceConsumerForm} layout="inline">
                <Form.Item label="待转移手机号码:" name="mobileNo" rules={[{required: true, message: '请输入手机号'}]}>
                  <Input autoComplete={"off"}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" onClick={sourceConsumerSearchOnClick}>查询</Button>
                </Form.Item>
              </Form>
              <Descriptions column={1} style={{marginTop:'4%',marginLeft:'3%'}}>
                <Descriptions.Item label="实名姓名">{sourceConsumer.consumerInfo.name}</Descriptions.Item>
                <Descriptions.Item
                  label="押金缴纳:">{getEnumText(enums.ConsumerDepositModelEnum, sourceConsumer.bizInfo.depositModel)}</Descriptions.Item>
                <Descriptions.Item label="套餐有效期">{sourceConsumer.bizInfo.packageEndDay}</Descriptions.Item>
                <Descriptions.Item label="电池绑定编号">{sourceConsumer.bizInfo.batteryDeviceCode}</Descriptions.Item>
                <Descriptions.Item label="所在群组">{sourceConsumer.bizInfo.groupName}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={3}>
            <div style={{marginTop: "35%",marginLeft:'30%'}}>
              <ArrowRightOutlined style={{color: "#1890FF", fontSize: "80px"}}/>
            </div>
          </Col>
          <Col span={9}>
            <Card title="目标账号" style={{height:'350px'}}>
              <Form form={targetConsumerForm} layout="inline">
                <Form.Item label="目标手机号码:" name="mobileNo" rules={[{required: true, message: '请输入手机号'}]}>
                  <Input autoComplete={"off"}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" onClick={targetConsumerSearchOnClick}>查询</Button>
                </Form.Item>
              </Form>
              <Descriptions column={1} style={{marginTop:'4%',marginLeft:'3%'}}>
                <Descriptions.Item label="手机号码">{targetConsumer.consumerInfo.mobileNo}</Descriptions.Item>
                <Descriptions.Item
                  label="是否有押金">{getEnumText(enums.ConsumerDepositStatusEnum, targetConsumer.bizInfo.depositStatus)}</Descriptions.Item>
                <Descriptions.Item
                  label="是否实名">{getEnumText(enums.IdCardValidEnum, targetConsumer.consumerInfo.idCardValid)}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{marginTop: "30px"}}>
          <Col span={24}>
            <div style={{marginLeft: "45%"}}>
              {hasAuthority(buttons.consumers.rightTransfer.index.rightTransfer) &&
              <Button type="primary" onClick={rightTransferOnClick}>权限转移</Button>}
            </div>
          </Col>
        </Row>
        <Row gutter={24} style={{marginTop: "30px"}}>
          <Col span={24}>
            <Card title="注意事项">
              <div style={{paddingLeft: "2%", paddingTop: "0.5%", fontSize: "16px"}}>
                <p style={{color: "#FF0033"}}>操作注意事项:</p>
                <p style={{paddingTop: "5px"}}>1.待转移账号押金必须为运营商代缴纳才可转移权益</p>
                <p style={{paddingTop: "5px"}}>2.待转移账号和目标账号必须在同一运营商下</p>
                <p style={{paddingTop: "5px"}}>3.目标账号必须已登录注册实名认证且没有缴纳押金</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RightTransfer;
