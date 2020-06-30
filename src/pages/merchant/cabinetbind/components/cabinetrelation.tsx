import React, { FC, useEffect, useState, useRef } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getqueryCabinetPage, addBatch, removeBind } from '@/services/merchant';
import { enumConverter, enums } from '@/utils/enums';
import { Select, Drawer, Form, Input, Button, Transfer, message, Modal } from 'antd';
import { getMangerUserList } from '@/services/manager';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { hasAuthority, buttons } from '@/utils/buttons';

const CabinetRelation: React.FC<{}> = () => {
  interface TableListItem {}
  const { Option } = Select;
  const actionRef = useRef<ActionType>();
  const [isBind, setisBind] = useState<number>();
  const [visible, setvisible] = useState<boolean>(false);
  const [dataSource, setdataSource] = useState<any>([]);
  const [targetKeys, settargetKeys] = useState<any>([]);
  const [selectedKeys, setselectedKeys] = useState<any>([]);
  const [userdata, setuserdata] = useState<any>([]);
  const [bindForm] = Form.useForm();
  useEffect(() => {
    getMangerUserList({ current: 1, pageSize: 100, status: '1' }).then((r) => {
      console.log(r);
      const data = r.data.data;
      setuserdata(data);
      let targetdata = [];
      for (let item = 0; item < data.length; item += 1) {
        targetdata.push({ title: data[item].username, key: data[item].userId.toString() });
      }
      console.log(targetdata);
      setdataSource(targetdata);
    });
  }, []);
  const handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };
  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    if (sourceSelectedKeys.length > 1) {
      return false;
    }
    setselectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };
  const { confirm } = Modal;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const onFinish = () => {
    if (targetKeys[0]) {
      let recorddata = bindForm.getFieldsValue();
      let targetuser = {};
      console.log(bindForm.getFieldsValue());
      console.log(targetKeys[0]);
      for (let item = 0; item < userdata.length; item += 1) {
        if (userdata[item].userId.toString() === targetKeys[0]) targetuser = userdata[item];
      }
      console.log(targetuser);
      addBatch({
        deviceCodeList: [recorddata.devicecode],
        mobileNo: targetuser.mobile,
        bindType: recorddata.type,
        orgId: targetuser.orgId,
        realName: targetuser.realName,
        userId: targetuser.userId,
        userName: targetuser.username,
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
          settargetKeys([]);
          setvisible(false);
          bindForm.resetFields();
          actionRef.current.reload();
        }
      });
    } else {
      message.error('请选择要绑定的员工！');
    }
  };
  function showConfirm(cabinetname, realName, id) {
    confirm({
      title: '解除绑定关系',
      icon: <ExclamationCircleOutlined />,
      content: `即将解除运维人员"${realName}"与电柜"${cabinetname}"的绑定关系,你还要继续吗?`,
      onOk() {
        removeBind(id).then((r) => {
          if (r.data.code === '000000') {
            message.success('解绑成功！');
            actionRef.current.reload();
          }
        });
      },
      onCancel() {},
    });
  }
  const request = (params) => {
    let secparams = { ...params };
    if (isBind) {
      secparams.isBind = Number(isBind);
    }
    return getqueryCabinetPage(secparams).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };
  const handleChange = (value) => {
    console.log(value);
    setisBind(value);
  };
  const TransferhandleChange = (nextTargetKeys, direction, moveKeys) => {
    if (nextTargetKeys.length > 1) {
      return false;
    }
    settargetKeys(nextTargetKeys);
    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'no',
      renderText: (val: string, _, index) => `${index + 1}`,
      hideInSearch: true,
    },
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
      title: '电柜名称',
      align: 'center',
      dataIndex: 'cabinetName',
      formItemProps: {
        autoComplete: 'off',
        allowClear: true,
      },
    },
    {
      title: '所属商户',
      align: 'center',
      dataIndex: 'merchantName',
      hideInSearch: true,
    },
    {
      title: '绑定关系类型',
      align: 'center',
      dataIndex: 'bindType',
      valueEnum: enumConverter(enums.BindType),
      formItemProps: {
        allowClear: true,
      },
    },
    {
      title: '所绑用户',
      align: 'center',
      dataIndex: 'userName',
      hideInSearch: true,
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'mobileNo',
      formItemProps: {
        allowClear: true,
        autoComplete: 'off',
      },
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'realName',
      hideInSearch: true,
    },
    {
      title: '是否绑定',
      dataIndex: 'isBind',
      hideInTable: true,
      renderFormItem: () => (
        <Select onChange={handleChange} allowClear>
          <Option value="1">已绑定</Option>
          <Option value="2">未绑定</Option>
        </Select>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) =>
        record.bindType ? (
          <>
            {hasAuthority(buttons.merchant.cabinetbind.index.unbind) && (
              <a
                onClick={() => {
                  showConfirm(record.cabinetName, record.realName, record.id);
                }}
              >
                解除绑定
              </a>
            )}
          </>
        ) : (
          <>
            {hasAuthority(buttons.merchant.cabinetbind.index.bind) && (
              <a
                onClick={() => {
                  setvisible(true);
                  bindForm.setFieldsValue({
                    devicecode: record.deviceCode,
                    devicename: record.cabinetName,
                  });
                }}
              >
                绑定员工
              </a>
            )}
          </>
        ),
    },
  ];
  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={false}
        columns={columns}
        request={request}
      />
      <Drawer
        title="绑定电柜"
        placement="right"
        width="50%"
        closable={false}
        onClose={() => {
          setvisible(false);
        }}
        visible={visible}
        destroyOnClose
      >
        <Form form={bindForm} {...layout} onFinish={onFinish}>
          <Form.Item
            label="设备编号"
            name="devicecode"
            rules={[{ required: true, message: '请输入绑定用户名!' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="设备名称"
            name="devicename"
            rules={[{ required: true, message: '请输入姓名!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item label="绑定关系类型" name="type" rules={[{ required: true }]}>
            <Select
              placeholder="请选择绑定关系类型"
              onChange={(value) => {
                console.log(value);
              }}
              allowClear
            >
              <Option value="1">运维</Option>
              <Option value="2">销售</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Transfer
              style={{ marginLeft: '20%' }}
              dataSource={dataSource}
              titles={['源员工', '目标员工']}
              render={(item) => item.title}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={TransferhandleChange}
              onSelectChange={handleSelectChange}
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              绑定选中员工
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default CabinetRelation;
