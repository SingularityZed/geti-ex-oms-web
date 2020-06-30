import React, {useRef, useState, useEffect} from 'react';
import { Upload,Form, Input, Button, Select, Checkbox, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { iotSupplierList, iotDeviceImport, iotProductList } from '@/services/device';
import { hasAuthority, buttons } from '@/utils/buttons';
const ImportDevice: React.FC<{}> = () => {
  const [deviceTypeList] = useState<any>([{ value: 1, text: "电池" }, { value: 2, text: "电柜" }]);
  const [supplierList,setsupplierList] = useState<any>([]); // 供应商
  const [productList,setproductList] = useState<any>([]);// 设备种类
  const [submitedata,setsubmitedata] = useState<object>({}); // 要提交的数据
  const [fileList ,setfileList ] = useState<any>([]);

  useEffect(() => {
    iotSupplierList().then((res) => { // 获取供应商列表

      const {data} = res.data
      const datalist = []
      for (let i = 0; i < data.length; i+=1) {
        datalist.push({value: data[i].id,text: data[i].supplierName});
    }
      setsupplierList(datalist)
    })
    iotProductList().then((res) => { // 获取设备种类列表
      const {data} = res.data
      const datalist = []
      for (let i = 0; i < data.length; i+=1) {
        datalist.push({value: data[i].id,text: data[i].productName});
    }
      setproductList(datalist)
    })
  }, []);
  const { Option } = Select;
  const [form] = Form.useForm();
  const props = {
    onRemove: file => {
        const index = fileList.indexOf(file);
        const newFileList =fileList.slice();
        newFileList.splice(index, 1);
        setfileList(newFileList)
    },
    beforeUpload: file => {
      setfileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };
  const reset = ()=>{
    form.resetFields();
  }
  function onchange(info) {
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  // function handleRemove(file){
  // }
  function devicetypeChange(value: any) {
  }
  function supplierChange(value: any) {
  }
  function productChange(value: any) {
  }
  const tailLayout = {
    wrapperCol: { offset: 10, span: 14 },
  };
    const handleUpload = (data) => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append("file", file);
    });
    iotDeviceImport({ ...data, file: formData }).then(res => {
      message.success(res.data.message);
      setfileList([]);
    });
    };
    const onFinish = values => {
      const data = {
        deviceType:values.devicetype,
        productId:values.product,
        supplierId:values.supplier
      }
      handleUpload(data)

    };
    const onFinishFailed = errorInfo => {
    };
  return (
    <Form
      form={form}
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="devicetype"
        label="设备种类"
        rules={[{ required: true, message: '请选择设备种类' }]}
      >
        <Select style={{ width: 500 }} onChange={devicetypeChange} allowClear={true}>
          {deviceTypeList.map((item) => (
            <Option value={item.value}>{item.text}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="supplier"
        label="供应商"
        rules={[{ required: true, message: '请选择供应商' }]}
      >
        <Select style={{ width: 500 }} onChange={supplierChange} allowClear={true}>
          {supplierList.map((item) => (
            <Option value={item.value}>{item.text}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="product"
        label="设备种类"
        rules={[{ required: true, message: '请选择产品类别' }]}
      >
        <Select style={{ width: 500 }} onChange={productChange} allowClear={true}>
          {productList.map((item) => (
            <Option value={item.value}>{item.text}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="文件"
        name="file"
        rules={[{ required: true, message: '请选择要上传的文件' }]}
      >
        <Upload {...props}>
          <Button disabled={fileList.length === 1}>
            <UploadOutlined /> 选择文件
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button onClick={reset}>取消</Button>
        {hasAuthority(buttons.iotManager.importDevice.index.submite) && (
          <Button type="primary" htmlType="submit" style={{ margin: '0 20px' }}>
            提交
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};
export default ImportDevice;
