import React, {FC, useState} from 'react';
import {Button, Card, Col, Descriptions, Form, Input, message, Modal, Row} from "antd";
import {subDepositQuery, subPackage} from "@/services/pay";
import {enums, getEnumText} from "@/utils/enums";
import {amountFormat} from "@/utils/amountUtils";


interface SubPackageModalProps {
  handleModelClose: () => void;
}

const QRCode = require('qrcode.react')

const SubPackageModal: FC<SubPackageModalProps> = (props) => {

  const [form] = Form.useForm();
  const [subPackageRes, setSubPackageRes] = useState({});

  /**
   * 查询 按钮点击事件
   */
  const onClick = () => {
    form.validateFields().then(values => {
      let params = {
        mobileNo: values.mobileNo,
      }
      subPackage(params).then((res) => {
        message.success(res.data.message);
        setSubPackageRes(res.data.data);
      }).catch(errorInfo => {
        setSubPackageRes({});
      });
    }).catch(errorInfo => {
    });
  }

  /**
   *  model框ok按钮事件
   */
  const modelOnOk = () => {
    let params = {tradeNo: subPackageRes.tradeNo};
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
          setSubPackageRes({});
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
    <Modal title="代缴套餐" visible={true} cancelText="关闭" okText="刷新支付结果" onOk={modelOnOk} onCancel={modelOnCancel}
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
              <Descriptions.Item label="实名姓名">{subPackageRes.consumerName}</Descriptions.Item>
              <Descriptions.Item label="身份证号码">{subPackageRes.idNo}</Descriptions.Item>
              <Descriptions.Item label="运营商">{subPackageRes.merchantName}</Descriptions.Item>
              <Descriptions.Item label="套餐名称">{subPackageRes.packageName}</Descriptions.Item>
              <Descriptions.Item label="套餐金额">￥{amountFormat(subPackageRes.totalAmount)}</Descriptions.Item>
              <Descriptions.Item
                label="优惠金额">￥{amountFormat(subPackageRes.totalAmount - subPackageRes.settlementTotalAmount)}</Descriptions.Item>
              <Descriptions.Item label="注册时间">{subPackageRes.regTime}</Descriptions.Item>
              <Descriptions.Item
                label="用户属性">{getEnumText(enums.ConsumerAttr, subPackageRes.consumerAttr)}</Descriptions.Item>
              {subPackageRes.consumerAttr == 2 &&
              <Descriptions.Item label="所在群组">{subPackageRes.groupName}</Descriptions.Item>
              }
            </Descriptions>
          </Card>
        </Col>
        <Col span={10}>
          <p style={{textAlign: "center"}}>微信扫码代缴</p>
          <div style={{width: 250, height: 250, margin: "10px auto 0"}}>
            {subPackageRes.payUrl &&
            <QRCode value={subPackageRes.payUrl} size={250}/>
            }
          </div>
          {subPackageRes.settlementTotalAmount &&
          <p style={{
            textAlign: "center",
            marginTop: 10
          }}>付款金额{amountFormat(subPackageRes.settlementTotalAmount)}元</p>
          }
          <p style={{textAlign: "center"}}>付款后点击“刷新支付结果”</p>
        </Col>
      </Row>
    </Modal>
  );
};

export default SubPackageModal;
