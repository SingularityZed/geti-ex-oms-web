import React, { useRef, useState, useEffect } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Tooltip, message, Button, Modal, Form, Input, Select, Upload, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import db from '@/utils/localstorage';
import proxy from '../../../../config/proxy';
import { TableListItem } from './data';
import { enumConverter, enums } from '../../../utils/enums';
import { addupgradePackage, getPackage, selectedUpgradePackage } from '@/services/device';
import { hasAuthority, buttons } from '@/utils/buttons';
import SearchFormOption from '@/components/SearchFormOption';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [Visible, setVisible] = useState<boolean>(false);
  const [filedata, setfiledata] = useState<object>({});
  const [headers, setheader] = useState<object>({});
  const { Option } = Select;
  const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
  const baseURL = proxy[REACT_APP_ENV || 'dev']['/api/'].target;
  const posturl = `${baseURL}device-service/v1/mgr/upgradePackage/uploadFile`;
  useEffect(() => {
    const Authentication = db.get('TOKEN');
    setheader({ Authentication });
  }, []);
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  interface Values {
    downloadUrl: string;
    upgradePackageType: number;
    version: string;
    versionName: string;
    versionDesc: string;
    precautions: string;
  }
  const [form] = Form.useForm();
  const onCreate = (values) => {
    const updatedata = Object.assign(filedata, values);
    delete updatedata.file;
    addupgradePackage(updatedata).then((res) => {
      message.success('新增成功');
      actionRef.current.reload();
    });
    setVisible(false);
  };
  const handleChange = (info: any) => {
    if (info.file.status !== 'uploading') {
      const { data } = info.file.response;
      setfiledata({
        packageName: data.name,
        packageSize: data.size,
        downloadUrl: data.url,
      });
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name}上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };
  const setdefaultversion = (id: any) => {
    selectedUpgradePackage(id).then((res) => {
      message.success('设为默认版本成功');
      actionRef.current.reload();
    });
  };
  const showmodal = () => {
    setVisible(true);
  };
  const onCancel = () => {
    setVisible(false);
  };
  const handleOk = () => {
    setVisible(false);
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '版本名称',
      dataIndex: 'versionName',
      align: 'center',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '升级包类型',
      dataIndex: 'upgradePackageType',
      align: 'center',
      valueEnum: enumConverter(enums.upgradePackageType),
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '版本号',
      dataIndex: 'version',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '升级设备数量',
      dataIndex: 'deviceCount',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '下载地址',
      dataIndex: 'downloadUrl',
      hideInSearch: true,
      align: 'center',
      ellipsis: true,
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
    },
    {
      title: '成功',
      dataIndex: 'deviceCountTrue',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '失败',
      dataIndex: 'deviceCountFalse',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '打包时间',
      dataIndex: 'packageTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <Space>
            <Tooltip placement="top" title={record.versionDesc}>
              <a>版本说明</a>
            </Tooltip>
            {!record.selected && <a onClick={setdefaultversion.bind(_, record.id)}>设为默认版本</a>}
          </Space>
        </>
      ),
    },
  ];
  const optionButtons = hasAuthority(buttons.iotManager.importDevice.index.submite)
    ? [
        {
          text: '新增版本',
          onClick: showmodal,
        },
      ]
    : [];
  return (
    <>
      <>
        <ProTable<TableListItem>
          bordered
          actionRef={actionRef}
          search={{
            optionRender: (searchConfig, props) => (
              <SearchFormOption
                searchConfig={searchConfig}
                {...props}
                optionButtons={optionButtons}
              />
            ),
          }}
          rowKey="id"
          request={(params) => {
            return getPackage(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            });
          }}
          toolBarRender={false}
          columns={columns}
        />
      </>
      <Modal
        visible={Visible}
        title="新建版本"
        okText="新建"
        cancelText="取消"
        onCancel={onCancel}
        // onOk={handleOk}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
            });
        }}
      >
        <Form form={form} {...layout} name="form_in_modal" initialValues={{ modifier: 'public' }}>
          <Form.Item
            name="upgradePackageType"
            label="升级包类型"
            rules={[{ required: true, message: '请输入版本名称！' }]}
          >
            <Select>
              {enums.upgradePackageType.map((item) => (
                <Option key="item.value" value={item.value}>
                  {item.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号！' }]}
          >
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            name="versionName"
            label="版本名称"
            rules={[{ required: true, message: '请输入版本名称！' }]}
          >
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            name="versionDesc"
            label="版本描述"
            rules={[{ required: true, message: '请输入版本描述！' }]}
          >
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            name="precautions"
            label="注意事项"
            rules={[{ required: true, message: '请输入注意事项！' }]}
          >
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            name="file"
            label="升级包"
            rules={[{ required: true, message: '请上传升级包' }]}
          >
            <Upload name="file" action={posturl} headers={headers} multiple onChange={handleChange}>
              <Button>
                <UploadOutlined />
                上传升级包
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableList;
