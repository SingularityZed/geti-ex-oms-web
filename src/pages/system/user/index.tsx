import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Tooltip,
  Transfer,
  Space,
} from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  addUser,
  auth,
  authupdata,
  editUser,
  getUserGetRole,
  queryUser,
  resetUserPassword,
  userDetail,
  addUserChecking,
} from '@/services/manager.ts';
import { TableListItem } from './data';
import DetailsModal from './components/DetailsModal';
import { getOrganizationAll } from '@/services/merchant';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib';
import { buttons, hasAuthority } from '@/utils/buttons';
import SearchFormOption from '@/components/SearchFormOption';
import moment from 'moment';

const TableList: React.FC<{ TableListProps }> = (props) => {
  const [addUserForm] = Form.useForm();
  const [updateUserForm] = Form.useForm();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<object>();
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);

  //枚举等下拉选数据加载
  const [organizationEnum, setOrganizationEnum] = useState<object>([]);
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [roleOptions, setRoleOptions] = useState<object>([]);

  //穿梭框数据
  const [authVisible, setAuthVisible] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<[]>();
  const [targetKeys, setTargetKeys] = useState<[]>();
  const [mockData, setMockData] = useState<[]>();
  const [username, setUsername] = useState<string>('');
  useEffect(() => {
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
      let enumAarray = {};
      let dataList = [];
      res.data.data.organizationInfoList.forEach((item) => {
        enumAarray[item.id] = item.operationName;
        dataList.push(<Select.Option key={item.id}>{item.operationName}</Select.Option>);
      });
      setOrganizationEnum(enumAarray);
      setOrganizationOptions(dataList);
    });
    //获取角色信息
    getUserGetRole().then((res) => {
      let options = res.data.rows.map((role) => (
        <Select.Option key={role.roleId}>{role.roleName}</Select.Option>
      ));
      setRoleOptions(options);
    });
  }, []);

  function resetUserPasswordOk(record) {
    resetUserPassword({ usernames: record.username }).then(() => {
      message.success('重置用户密码成功');
    });
  }

  function getUserAuth(userId) {
    auth(userId).then((r) => {
      let arr = r.data.data;
      let itemArr = [];
      for (let item = 0; item < arr.length; item++) {
        itemArr.push({
          key: arr[item].merchantId.toString(),
          title: arr[item].merchantName,
          description: arr[item].isAuth.toString(),
        });
      }
      setMockData(itemArr);
      setTargetKeys(itemArr.filter((item) => item.description === 'true').map((item) => item.key));
    });
  }

  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys([...nextTargetKeys]);
  };

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'username',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobile',
      formItemProps: {
        autoComplete: "off",
        allowClear: true,
      },
    },
    {
      title: '运营商',
      align: 'center',
      dataIndex: 'orgId',
      valueEnum: organizationEnum,
      hideInTable: true,
      formItemProps: {
        autoComplete: "off",
        allowClear: true,
      },
    },
    {
      title: '运营商',
      align: 'center',
      dataIndex: 'orgName',
      hideInSearch: true,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        0: { text: '锁定', status: 'Default' },
        1: { text: '有效', status: 'Success' },
      },
    },
    {
      title: '运维权限',
      align: 'center',
      dataIndex: 'isApplets',
      hideInSearch: true,
      valueEnum: {
        true: { text: '是', status: 'Success' },
        false: { text: '否', status: 'Default' },
      },
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '最后登录时间',
      align: 'center',
      dataIndex: 'lastLoginTime',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '时间区间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.manager.sysUser.index.look) && (
              <a
                onClick={(e) => {
                  setUserInfo(record);
                  setDetailsVisible(true);
                }}
              >
                查看
              </a>
            )}
            {hasAuthority(buttons.manager.sysUser.index.update) && (
              <a
                onClick={(e) => {
                  if (record.roleId && !Array.isArray(record.roleId)) {
                    record.roleId = record.roleId.split(',');
                  }
                  setUserInfo(record);
                  updateUserForm.setFieldsValue(record);
                  handleUpdateModalVisible(true);
                }}
              >
                修改用户
              </a>
            )}
            {hasAuthority(buttons.manager.sysUser.index.orgAuth) && record.userType !== 1 && (
              <a
                onClick={(e) => {
                  setUserInfo(record);
                  getUserAuth(record.userId);
                  setUsername(record.username);
                  setAuthVisible(true);
                }}
              >
                商户权限
              </a>
            )}
            {hasAuthority(buttons.manager.sysUser.index.resetPassword) &&
              record.userId != JSON.parse(localStorage.getItem('USERINFO')).user.userId && (
                <a
                  onClick={(e) => {
                    userDetail(record.username).then((res) => {
                      Modal.confirm({
                        title: '确定重置选中用户密码?',
                        icon: <ExclamationCircleOutlined />,
                        content: '当您点击确定按钮后，该用户的密码将会重置为1234qwer',
                        onOk: resetUserPasswordOk.bind(_, record),
                      });
                    });
                  }}
                >
                  密码重置
                </a>
              )}
          </Space>
        </>
      ),
    },
  ];

  const handleCancel = () => {
    setDetailsVisible(false);
  };

  /**
   * 新增 按钮点击事件
   */
  const createOnClick = (record) => {
    addUserForm.resetFields();
    handleModalVisible(true);
  };

  const optionButtons = hasAuthority(buttons.manager.sysUser.index.add)
    ? [
        {
          text: '新建',
          onClick: createOnClick,
        },
      ]
    : [];

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        search={{
          optionRender: (searchConfig, props) => (
            <SearchFormOption
              searchConfig={searchConfig}
              {...props}
              optionButtons={optionButtons}
            />
          ),
        }}
        actionRef={actionRef}
        rowKey="userId"
        beforeSearchSubmit={(params) => {
          if (Array.isArray(params.createTime)) {
            params.createTimeFrom = moment(params.createTime[0])
              .startOf('day')
              .format('YYYY/MM/DD HH:mm:ss');
            params.createTimeTo = moment(params.createTime[1])
              .endOf('day')
              .format('YYYY/MM/DD HH:mm:ss');
          }
          return params;
        }}
        request={(params) => {
          params.createTime = null;
          return queryUser(params).then((res) => {
            return { data: res.data.rows, success: true, total: res.data.total };
          });
        }}
        columns={columns}
        rowSelection={false}
      />

      <DetailsModal
        done={done}
        visible={detailsVisible}
        userInfoData={userInfo}
        onCancel={handleCancel}
      />

      <Drawer
        title="新增用户"
        width="40%"
        onClose={() => {
          handleModalVisible(false);
        }}
        visible={createModalVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                addUserForm.resetFields();
                handleModalVisible(false);
              }}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                //新增数据
                addUserForm.validateFields().then((values) => {
                  addUserChecking(values.username).then((r) => {
                    if (!r.data) {
                      message.error('抱歉，该用户名已存在');
                    } else {
                      values.roleId = values.roleId.join(',');
                      addUser(values).then((res) => {
                        message.success('新增用户成功');
                        actionRef.current.reload();
                        handleModalVisible(false);
                        addUserForm.resetFields();
                      });
                    }
                  });
                });
              }}
              type="primary"
            >
              提交
            </Button>
          </div>
        }
      >
        <Form
          form={addUserForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              () => ({
                validator(rule, value) {
                  var realLength = 0,
                    len = value.length,
                    charCode = -1;
                  for (var i = 0; i < len; i++) {
                    charCode = value.charCodeAt(i);
                    if (charCode >= 0 && charCode <= 128) realLength += 1;
                    else realLength += 2;
                  }
                  if (realLength == 0 || (4 <= realLength && realLength <= 10)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject('用户名长度在4-10个字符之间');
                  }
                },
              }),
            ]}
          >
            <Input placeholder="请输入用户名" autoComplete="off"/>
          </Form.Item>
          <Tooltip title={'新用户默认密码为 1234qwer'}>
            <Form.Item name="password" label="密码">
              <Input type={'password'} defaultValue="1234qwer" disabled />
            </Form.Item>
          </Tooltip>
          <Form.Item
            name="mobile"
            label="手机"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input type={'tel'} placeholder="请输入正确的手机号" autoComplete="off"/>
          </Form.Item>

          <Form.Item
            name="operationName"
            label="运营商"
            rules={[{ required: true, message: '请选择运营商' }]}
          >
            <Select placeholder="请选择运营商">{organizationOptions}</Select>
          </Form.Item>
          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色" mode="multiple">
              {roleOptions}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Radio.Group>
              <Radio value={1}>有效</Radio>
              <Radio value={0}>锁定</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="isApplets"
            label="是否登录运维小程序"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="修改用户"
        width="40%"
        onClose={() => {
          handleUpdateModalVisible(false);
        }}
        visible={updateModalVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                handleUpdateModalVisible(false);
                updateUserForm.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                //更新
                updateUserForm.validateFields().then((values) => {
                  if (Array.isArray(values.roleId)) {
                    values.roleId = values.roleId.join(',');
                  }
                  values.userId = userInfo.userId;

                  editUser(values).then((res) => {
                    message.success('修改成功');
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                    handleUpdateModalVisible(false);
                    updateUserForm.resetFields();
                  });
                });
              }}
              type="primary"
            >
              修改
            </Button>
          </div>
        }
      >
        <Form
          form={updateUserForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" autoComplete="off"/>
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" autoComplete="off"/>
          </Form.Item>
          <Form.Item
            name="mobile"
            label="手机"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input type={'tel'} placeholder="请输入正确的手机号" autoComplete="off"/>
          </Form.Item>
          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色" mode="multiple">
              {roleOptions}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Radio.Group>
              <Radio value={'1'}>有效</Radio>
              <Radio value={'0'}>锁定</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="商户权限"
        width="40%"
        onClose={() => {
          setAuthVisible(false);
        }}
        visible={authVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                setAuthVisible(false);
              }}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                //修改数据
                authupdata({
                  merchantIds: targetKeys,
                  userId: userInfo.userId,
                }).then(() => {
                  setAuthVisible(false);
                });
              }}
              type="primary"
            >
              提交
            </Button>
          </div>
        }
      >
        <Form>
          <Form.Item label="被授权用户">
            <Input value={username} disabled={true} autoComplete="off"/>
          </Form.Item>
        </Form>
        <Transfer
          dataSource={mockData}
          titles={['未授权商户', '已授权商户']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          render={(item) => item.title}
          listStyle={{ width: '46%', height: '300px' }}
        />
      </Drawer>
    </>
  );
};

export default TableList;
