import {Button, Col, Form, Input, message, Row, Select} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {getOrganizationAll} from "@/services/merchant";
import {addConfig} from "@/services/merchant";
import {getUserInfo} from "@/utils/authority";

interface CreateModalProps {
  handleReturn: () => void;
}

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 8},
};
const Create: FC<CreateModalProps> = (props) => {
  const [form] = Form.useForm();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [checked, setChecked] = useState();
  const [orgId, setOrgId] = useState<number>(0);

  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    let str = getUserInfo();
    let userInfo = str == '' ? {} : JSON.parse(getUserInfo());
    setOrgId(userInfo.user.orgId);
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
        let dataList = []
        res.data.data.organizationInfoList.forEach(item => {
          dataList.push(<Select.Option key={item.id}>{item.operationName}</Select.Option>)
        })
        setOrganizationOptions(dataList)
      }
    )
  }, []);

  function checkChange(checkedValues) {
    setChecked(checkedValues)
  }



  const onFinish = (values) => {
    addConfig(values).then((res) => {
      message.success(res.data.message);
      props.handleReturn();
    })
  }

  return (
    <div>
      <Form {...layout} form={form} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name='configName' label="配置名称" rules={[{required: true}]}>
              <Input autoComplete={"off"}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='power' label="电柜总功率">
              <Select placeholder="电柜总功率" onChange={checkChange} value={checked} defaultValue={checked}>
                <Select.Option value="5000">5000W</Select.Option>
                <Select.Option value="6000">6000W</Select.Option>devScripts.js
                <Select.Option value="7000">7000W</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='exCableSoc' label="可换电量soc值" rules={[{required: true}]}>
              <Input autoComplete={"off"}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='batteryMosTemperatureLimit' label="电池mos报警温度" rules={[{required: true}]}>
              <Input autoComplete={"off"}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='batteryPackageTemperatureLimit' label="电池包报警温度" rules={[{required: true}]}>
              <Input autoComplete={"off"}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='cabinetTemperatureLimit' label="电柜最高报警温度" rules={[{required: true}]}>
              <Input autoComplete={"off"}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='cabinetHumidityLimit' label="电柜最高报警湿度" rules={[{required: true}]}>
              <Input autoComplete={"off"}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='commonParam' label="常规参数" rules={[{required: true}]}>
              <Input autoComplete={"off"}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="merchantId"
              label="运营商"
              rules={[{required: true, message: '请选择运营商'}]}
            >
              <Select placeholder="请选择运营商" disabled={orgId !== 1}>
                {organizationOptions}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={1} offset={11}>
            <Form.Item>
              <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
          </Col>
          <Col span={1}>
            <Form.Item>
              <Button htmlType="button" onClick={props.handleReturn}>取消</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Create;
