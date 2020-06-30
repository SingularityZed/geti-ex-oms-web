import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Row, Select} from "antd";
import {getOrganizationAll, getQrcode} from "@/services/merchant";
import {getUserInfo} from "@/utils/authority";
import Col from "antd/es/grid/col";


const layout = {
  xs: {span: 24},
  sm: {span: 9, offset: 3},
  md: {span: 9, offset: 3},
  lg: {span: 6, offset: 3}
}
const Index: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const [createButtonDisable, setCreateButtonDisable] = useState<boolean>(true);
  const [organizations, setOrganizations] = useState([]);
  const [org, setOrg] = useState({});
  const [qrCodeUrl, setQrCodeUrl] = useState<string>();
  const [getiOrg, setGetiOrg] = useState<boolean>(false);


  useEffect(() => {
    let str = getUserInfo();
    let userInfo = str == '' ? {} : JSON.parse(getUserInfo());
    let getiOrg = userInfo.user.orgId === 1;
    setGetiOrg(getiOrg);
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
        setOrganizations(res.data.data.organizationInfoList);
        if (!getiOrg) {
          let current = res.data.data.organizationInfoList.find(_ => _.id == userInfo.user.orgId);
          let param = {
            orgId: current.id,
            orgName: current.operationName
          }
          getQrcode(param).then((res) => {
            setOrg(current);
            setQrCodeUrl(res.data.data.url);
          });
        }
      }
    )
  }, []);

  const onChange = (value) => {
    let selected = organizations.find(_ => _.id == value);
    setCreateButtonDisable(false);
    setOrg(selected);
    setQrCodeUrl(null);
  }

  const createOnClick = () => {
    let param = {
      orgId: org.id,
      orgName: org.operationName
    }
    getQrcode(param).then((res) => {
      setQrCodeUrl(res.data.data.url);
      setCreateButtonDisable(true);
    });
  }

  const hrefOnClick = () => {
    window.open(qrCodeUrl);
  }

  const options = organizations.map(obj =>
    <Select.Option key={obj.id} title={obj.operationName}>{obj.operationName}</Select.Option>
  );

  return (
    <>
      <Form form={form}>
        <Row gutter={24}>
          {getiOrg &&
          <>
            <Col {...layout}>
              <Form.Item label="运营商列表" name="orgId">
                <Select placeholder="请选择运营商" onChange={onChange.bind(this)}>
                  {options}
                </Select>
              </Form.Item>
            </Col>
            < Col {...layout}>
              <Form.Item label="创建二维码">
                <Button onClick={createOnClick} disabled={createButtonDisable}>
                  生成
                </Button>
              </Form.Item>
            </Col>
          </>
          }
          <Col {...layout}>
            <Form.Item label="商户二维码">
              {qrCodeUrl &&
              <Card cover={<img src={qrCodeUrl}/>}>
                <Card.Meta title={"扫描加入" + org.powerExchangeNetworkName} description={"运营商: " + org.operationName}/>
              </Card>}
            </Form.Item>
          </Col>
          <Col {...layout}>
            <Form.Item label="下载二维码">
              {qrCodeUrl && <Button onClick={hrefOnClick}>
                下载
              </Button>}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
    ;
};

export default Index;
