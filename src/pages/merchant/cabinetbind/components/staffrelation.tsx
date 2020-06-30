import React, { FC, useEffect, useState, useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getMangerUserList } from '@/services/manager';
import { getCabinetBind, getqueryToAddCabinet, getqueryPage, addBatch } from '@/services/merchant';
import { Drawer, Form, Input, Button, Select, message } from 'antd';
import CabinetbindDetail from './cabinetDetail';
import { size } from 'lodash';
import { hasAuthority, buttons } from '@/utils/buttons';

interface TableListItem {}

const StaffRelation: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const Ref = useRef<ActionType>();
  const [SelectedType, setSelectedType] = useState<any>();
  const [visible, setvisible] = useState<boolean>(false);
  const [userId, setuserId] = useState<number>();
  const [username, setusername] = useState<string>('');
  const [recorddata, setrecorddata] = useState<object>({});
  const [DetailVisible, setDetailVisible] = useState<boolean>(false);
  const [Selected, setSelected] = useState<any>([]);
  useEffect(() => {}, []);
  const [bindForm] = Form.useForm();
  const request = (params) => {
    if (SelectedType) {
      return getqueryToAddCabinet({
        ...params,
        bindType: SelectedType,
      }).then((res) => {
        return { data: res.data.data, success: true, total: res.data.total };
      });
    }
    return getqueryToAddCabinet({
      ...params,
    }).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };
  const setdata = (record) => {
    bindForm.setFieldsValue({
      username: record.username,
      realname: record.realName,
    });
  };
  const { Option } = Select;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const onFinish = () => {
    console.log(Selected);
    console.log(recorddata);
    console.log(bindForm.getFieldsValue());
    addBatch({
      deviceCodeList: Selected,
      mobileNo: recorddata.mobile,
      bindType: bindForm.getFieldsValue().type,
      orgId: recorddata.orgId,
      realName: recorddata.realName,
      userId: recorddata.userId,
      userName: recorddata.username,
    }).then((r) => {
      if (r.data.code === '000000') {
        let successnum = 0;
        if (r.data.data.failDeviceCode) {
          if (r.data.data.countSuccess === null) {
            successnum = 0;
          } else {
            successnum = r.data.data.countSuccess;
          }
          const failcode = r.data.data.failDeviceCode.toString();
          message.success(
            `绑定成功${successnum}条,绑定失败${r.data.data.countFail}条,为${failcode}`,
          );
        } else {
          message.success('绑定成功');
        }

        bindForm.resetFields();
        setvisible(false);
        actionRef.current.reload();
      }
    });
  };
  const rowSelection = {
    onChange(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, selectedRows);
      setSelected(selectedRowKeys);
    },
  };
  const cabinetcolumns: ProColumns<TableListItem>[] = [
    {
      title: '设备编号',
      align: 'center',
      dataIndex: 'deviceCode',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '所属商户',
      align: 'center',
      dataIndex: 'deviceCode',
      hideInSearch: true,
    },
    {
      title: '电柜名称',
      align: 'center',
      dataIndex: 'cabinetName',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
  ];
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'no',
      renderText: (val: string, _, index) => `${index + 1}`,
      hideInSearch: true,
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'username',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'mobile',
      formItemProps: {
        autoComplete: 'off',
        allowClear: true,
      },
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'realName',
      hideInSearch: true,
    },
    {
      title: '角色',
      align: 'center',
      dataIndex: 'roleName',
      hideInSearch: true,
    },
    {
      title: '绑定的电柜数',
      dataIndex: 'bindCabinetCount',
      align: 'center',
      hideInSearch: true,
      render: (_, record) =>
        record.bindCabinetCount ? (
          <a
            onClick={() => {
              setuserId(record.userId);
              setusername(record.realName);
              setDetailVisible(true);
            }}
          >
            {record.bindCabinetCount}
          </a>
        ) : (
          <span>0</span>
        ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          {hasAuthority(buttons.merchant.cabinetbind.index.bind) && (
            <a
              onClick={() => {
                setvisible(true);
                setdata(record);
                setrecorddata(record);
              }}
            >
              绑定电柜
            </a>
          )}
        </>
      ),
    },
  ];
  return (
    <>
      {!DetailVisible && (
        <>
          <ProTable<TableListItem>
            bordered
            options={false}
            actionRef={actionRef}
            rowKey="userId"
            toolBarRender={false}
            columns={columns}
            request={(params) =>
              getMangerUserList({ ...params, status: '1' }).then((res) => {
                return { data: res.data.data, success: true, total: res.data.total };
              })
            }
          />
          <Drawer
            title="绑定电柜"
            placement="right"
            width="50%"
            closable={false}
            onClose={() => {
              setSelectedType(null);
              bindForm.resetFields();
              setSelectedType(undefined);
              setvisible(false);
            }}
            visible={visible}
            destroyOnClose
          >
            <Form form={bindForm} {...layout} onFinish={onFinish}>
              <Form.Item
                label="绑定用户名"
                name="username"
                rules={[{ required: true, message: '请输入绑定用户名!' }]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="姓名"
                name="realname"
                rules={[{ required: true, message: '请输入姓名!' }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item label="绑定关系类型" name="type" rules={[{ required: true }]}>
                <Select
                  placeholder="请选择绑定关系类型"
                  onChange={(value) => {
                    setSelectedType(value);
                  }}
                  allowClear
                >
                  <Option value="1">运维</Option>
                  <Option value="2">销售</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <ProTable<TableListItem>
                  style={{ width: '120%' }}
                  bordered
                  title={() => <div style={{ textAlign: 'center' }}>待绑定电柜</div>}
                  options={false}
                  actionRef={Ref}
                  rowKey="deviceCode"
                  toolBarRender={false}
                  columns={cabinetcolumns}
                  request={request}
                  pagination={{ defaultPageSize: 5 }}
                  rowSelection={rowSelection}
                />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  绑定选中电柜
                </Button>
              </Form.Item>
            </Form>
          </Drawer>
        </>
      )}
      {DetailVisible && (
        <CabinetbindDetail
          username={username}
          userId={userId}
          handleClose={() => {
            setDetailVisible(false);
          }}
        />
      )}
    </>
  );
};

export default StaffRelation;
