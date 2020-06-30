import React, {FC, useState} from 'react';
import {Button, Card, Col, Descriptions, Form, Input, message, Modal, Row} from "antd";
import {enums, getEnumText} from "@/utils/enums";
import {subDeposit, subDepositQuery} from "@/services/pay";

const QRCode = require('qrcode.react')

interface SubDepositModalProps {
  handleModelClose: () => void;
}

const SubDepositModal: FC<SubDepositModalProps> = (props) => {
  const [form] = Form.useForm();
  const [subDepositRes, setSubDepositRes] = useState({});

  /**
   * 查询 按钮点击事件
   */
  const onClick = () => {
    form.validateFields().then(values => {
      let params = {
        mobileNo: values.mobileNo,
      }
      subDeposit(params).then((res) => {
        message.success(res.data.message);
        setSubDepositRes(res.data.data);
      }).catch(errorInfo => {
        setSubDepositRes({});
      });
    }).catch(errorInfo => {
    });
  }

  /**
   *  model框ok按钮事件
   */
  const modelOnOk = () => {
    let params = {tradeNo: subDepositRes.tradeNo};
    subDepositQuery(params).then((res) => {
      let status = res.data.data.payTradeLogInfo.tradeStatus;
      let msg = getEnumText(enums.TradeStatusEnums, status);
      switch (status) {
        case 1:
        case 2:
          message.warn(msg);
          break;
        case 3:
          form.resetFields();
          setSubDepositRes({});
          message.success(msg);
          break;
        case 4:
          message.error(msg);
          break;
        default:
          message.error("查询失败");
      }
    }).catch(errorInfo => {
    });
  }

  /**
   * model框cancel按钮事件
   */
  const modelOnCancel = () => {
    form.resetFields();
    props.handleModelClose()
  }


  return (
    <Modal title="代缴押金" visible={true} cancelText="关闭" okText="刷新支付结果" onOk={modelOnOk} onCancel={modelOnCancel}
           width={800}>
      <Row gutter={24}>
        <Col span={14}>
          <p style={{color: "#FF0033"}}>输入代缴号码后点击“查询”显示相关信息和支付二维码</p>
          <Form form={form} layout="inline">
            <Form.Item name="mobileNo" label="代缴手机号码" rules={[{required: true}]}>
              <Input autoComplete={"off"}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={onClick}>查询</Button>
            </Form.Item>
          </Form>
          <Card>
            <Descriptions column={1}>
              <Descriptions.Item label="实名姓名">{subDepositRes.consumerName}</Descriptions.Item>
              <Descriptions.Item label="身份证号码">{subDepositRes.idNo}</Descriptions.Item>
              <Descriptions.Item label="运营商">{subDepositRes.merchantName}</Descriptions.Item>
              <Descriptions.Item label="注册时间">{subDepositRes.regTime}</Descriptions.Item>
              <Descriptions.Item
                label="用户属性">{getEnumText(enums.ConsumerAttr, subDepositRes.consumerAttr)}</Descriptions.Item>
              {subDepositRes.consumerAttr == 2 &&
              <Descriptions.Item label="所在群组">{subDepositRes.groupName}</Descriptions.Item> &&
              <Descriptions.Item
                label="电池规格">{getEnumText(enums.BatterySpecificationEnum, subDepositRes.deviceSpecification)}</Descriptions.Item>
              }
            </Descriptions>
          </Card>
        </Col>
        <Col span={10}>
          <p style={{textAlign: "center"}}>微信扫码代缴</p>
          <div style={{width: 250, height: 250, margin: "10px auto 0"}}>
            {subDepositRes.payUrl &&
            <QRCode value={subDepositRes.payUrl} size={250}/>
            }
          </div>
          {subDepositRes.depositAmount &&
          <p style={{textAlign: "center", marginTop: 10}}>付款金额{(subDepositRes.depositAmount / 100).toFixed(2)}元</p>
          }
          <p style={{textAlign: "center"}}>付款后点击“刷新支付结果”</p>
        </Col>
      </Row>
    </Modal>
  );
};
export default SubDepositModal;
