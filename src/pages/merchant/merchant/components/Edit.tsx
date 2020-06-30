import {Button, Card, Cascader, Col, Form, Input, message, Row} from 'antd';
import React, {FC, useEffect, useRef, useState} from 'react';
import PicturesWall from "@/components/PicturesWall/PicturesWall";
import {getOrganizationInfo, updateOrganization} from '@/services/merchant'
import {getRegions, loadRegionData} from "@/utils/region";

interface EditModalProps {
  orgId: number | undefined;
  handleReturn: () => void;
}

const formLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 8},
};

const colLayout = {
  xs: {span: 24},
  sm: {span: 24},
  md: {span: 24},
  lg: {span: 12}
}
const Edit: FC<EditModalProps> = (props) => {
  const [form] = Form.useForm();
  const picturesWallActions = {};
  const [regionOptions, setRegionOptions] = useState<[]>();
  const [initialValues, setInitialValues] = useState({});

  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    getOrganizationInfo(props.orgId).then((res) => {
      let values = {...res.data.data};
      if (res.data.data.businessLicensePhoto && res.data.data.businessLicensePhoto != '') {
        values.imgUrlList = [res.data.data.businessLicensePhoto];
        picturesWallActions.setValue(values.imgUrlList);
      }
      values.region = [Number(values.provinceCode), Number(values.cityCode), Number(values.areaCode)]
      form.setFieldsValue(values);
      setInitialValues(values);
      // load province
      getRegions(values.region).then((res) => {
        setRegionOptions(res);
      });
    })
  }, []);

  const loadRegion = (selectedOptions) => {
    loadRegionData(selectedOptions).then(() => {
      setRegionOptions([...regionOptions]);
    });
  }

  /**
   *  表单提交
   */
  const onFinish = (values) => {
    let params = {...values};
    params.id = props.orgId;
    params.businessLicensePhoto = values.imgUrlList[0];
    if (values.region) {
      params.province = values.region[0];
      params.city = values.region[1];
      params.area = values.region[2];
    }
    delete params.imgUrlList;
    delete params.region;
    updateOrganization(params).then((res) => {
      message.success(res.data.message);
      props.handleReturn();
    })
  }

  return (
    <div>
      <Form {...formLayout} form={form} onFinish={onFinish}>
        <Card title="添加运营商">
          <Row gutter={24}>
            <Col {...colLayout}>
              <Form.Item name='operationName' label="运营商名称" rules={[{required: true}]}>
                <Input autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item name='powerExchangeNetworkName' label="换电网络名称" rules={[{required: true}]}>
                <Input autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item name='contactPerson' label="联系人" rules={[{required: true}]}>
                <Input autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item name='contactTelephone' label="联系电话" rules={[{required: true}]}>
                <Input autoComplete="off"/>
              </Form.Item>
            </Col>
            {initialValues.region &&
            <Col {...colLayout}>
              <Form.Item name='region' label="运营商运营区域" rules={[{required: true}]}>
                <Cascader options={regionOptions} loadData={loadRegion}/>
              </Form.Item>
            </Col>
            }
            <Col {...colLayout}>
              <Form.Item name='address' label="联系地址" rules={[{required: true}]}>
                <Input autoComplete="off"/>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="运营商资质">
          <Row gutter={24}>
            <Col {...colLayout}>
              <Form.Item name='enterpriseName' label="企业名称" rules={[{required: true}]}>
                <Input autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item name='unifiedSocialCreditCode' label="统一社会信用代码" rules={[{required: true}]}>
                <Input autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item name='imgUrlList' label="营业执照" rules={[{required: true, message: "请先上传图片"}]}>
                <PicturesWall imgMaxSize={1} fileBizType={"businessLicensePhoto"}
                              actions={picturesWallActions}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={{offset: 5}} sm={{offset: 8}} lg={{offset: 10}}>
              <Form.Item>
                <Button type="primary" htmlType="submit">提交</Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button htmlType="button" onClick={props.handleReturn}>取消</Button>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
};

export default Edit;
