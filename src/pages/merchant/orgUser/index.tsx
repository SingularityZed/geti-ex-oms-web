import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Progress,
  Radio,
  Select,
  Space,
} from 'antd';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import './style.css';
import {
  addMangerUser,
  deleteMangerUser,
  eidtMangerUser,
  getMangerUserList,
  getOrgUserGetRole,
  resetUserPassword,
} from '@/services/manager.ts';
import {TableListItem} from './data';
import {ExclamationCircleOutlined} from '@ant-design/icons/lib';
import DetailsModal from './components/DetailsModal';
import {addUserChecking} from '@/services/manager';
import {buttons, hasAuthority} from '@/utils/buttons';
import SearchFormOption from '@/components/SearchFormOption';
import moment from 'moment';

const TableList: React.FC<{ TableListProps: any }> = (props) => {
  const [addUserForm] = Form.useForm();
  const [updateUserForm] = Form.useForm();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<object>();
  const actionRef = useRef<ActionType>();
  const [done, setDone] = useState<boolean>(false);

  const {confirm} = Modal;
  const [orgUserList, setOrgUserList] = useState<[]>([]);
  const [orgUserNameList, setOrgUserNameList] = useState<[]>([]);

  const [roleOptions, setRoleOptions] = useState<object>([]);

  const [passwordLevel, setpasswordLevel] = useState<number>(0);
  const [percent, setpercent] = useState<number>(10);
  const [passwordLevelName, setpasswordLevelName] = useState<any>();
  const [percentcolor, setpercentcolor] = useState<any>('#ff0000');
  const [passwordLevelClass, setpasswordLevelClass] = useState<string>('error');

  useEffect(() => {
    //获取商户角色信息
    getOrgUserGetRole().then((res) => {
      let options = res.data.data.map((role) => (
        <Select.Option key={role.roleId}>{role.roleName}</Select.Option>
      ));
      setRoleOptions(options);
    });
  }, []);
  const levelNames = {
    0: '低',
    1: '低',
    2: '中',
    3: '强',
  };
  const levelClass = {
    0: 'error',
    1: 'error',
    2: 'warning',
    3: 'success',
  };
  const levelColor = {
    0: '#ff0000',
    1: '#ff0000',
    2: '#ff7e05',
    3: '#52c41a',
  };
  useEffect(() => {
    setpasswordLevelName(levelNames[passwordLevel]);
    // setpercent(levelColor[passwordLevel]);
    setpercentcolor(levelColor[passwordLevel]);
    setpasswordLevelClass(levelClass[passwordLevel]);
  }, [passwordLevel]);
  const passwordValidator = (rule, value, callback) => {
    const pwd = addUserForm.getFieldValue('password');
    if (value && value !== pwd) {
      callback('两次输入不一致！');
    }
    callback();
  };
  const handlePasswordLevel = (rule, value, callback) => {
    let level = 0;
    // 判断这个字符串中有没有数字
    if (/[0-9]/.test(value)) {
      level += 1;
    }
    // 判断字符串中有没有字母
    if (/[a-zA-Z]/.test(value)) {
      level += 1;
    }
    // 判断字符串中有没有特殊符号
    if (/[^0-9a-zA-Z_]/.test(value)) {
      level += 1;
    }
    setpasswordLevel(level);
    setpercent(level * 30);
    if (level >= 2) {
      if (level >= 3) {
        setpercent(100);
      }
      callback();
    } else {
      if (level === 0) {
        setpercent(10);
      }
      callback(new Error('密码强度不够'));
    }
  };
  const content = (
    <div style={{width: '240px'}}>
      <div className={`${'org-user-add '}${passwordLevelClass}`}>
        强度：
        <span>{passwordLevelName}</span>
      </div>
      <Progress percent={percent} showInfo={false} strokeColor={percentcolor}/>
      <div style={{marginTop: '10px'}}>
        <span>请至少输入 6 个字符(数字，英文字母，特殊字符组合),请不要使用容易被猜到的密码。</span>
      </div>
    </div>
  );

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      hideInSearch: true,
      align: 'center',
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'username',
      formItemProps: {
        autoComplete: "off",
        allowClear: true,
      },
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'mobile',
      hideInSearch: true,
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
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        0: {text: '锁定', status: 'Default'},
        1: {text: '有效', status: 'Success'},
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.merchant.orgUser.index.detail) && (
              <a
                onClick={(e) => {
                  setUserInfo(record);
                  setDetailsVisible(true);
                }}
              >
                查看
              </a>
            )}

            {hasAuthority(buttons.merchant.orgUser.index.edit) && (
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
          </Space>
        </>
      ),
    },
  ];

  /**
   * 选择行
   */
  const rowSelection = {
    onChange(selectedRowKeys, selectedRows) {
      let userIds: any[] = [];
      let usernames: any[] = [];
      if (selectedRows.length > 0) {
        selectedRows.map((item: { userId: any; username: any }) => {
          userIds.push(item.userId);
          usernames.push(item.username);
        });
      }
      setOrgUserList(userIds);
      setOrgUserNameList(usernames);
    },
  };

  /**
   * 删除 按钮点击事件
   */
  const deleteSelectUser = () => {
    if (orgUserList.length > 0) {
      const userIds = orgUserList;
      confirm({
        title: '确定删除所选中的记录?',
        icon: <ExclamationCircleOutlined/>,
        content: '当您点击确定按钮后，这个用户将被删除！',
        onOk: deleteModelOnOk.bind(globalThis, userIds),
      });
    } else {
      alert('请先选择用户');
    }
  };
  /**
   * 删除 model框ok按钮事件
   * @param userIds
   */
  const deleteModelOnOk = (userIds) => {
    deleteMangerUser(userIds.join(',')).then((res) => {
      message.success('删除成功');
      if (actionRef.current) {
        actionRef.current.reset();
      }
    });
  };

  /**
   * 重置密码 按钮点击事件
   */
  const resetSelectUser = () => {
    if (orgUserList.length > 0) {
      const usernames = orgUserNameList;
      confirm({
        title: '确定重置选中用户的密码?',
        icon: <ExclamationCircleOutlined/>,
        content: '当您点击确定按钮后，该用户的密码将会重置为1234qwer',
        onOk: resetModelOnOk.bind(globalThis, usernames),
      });
    } else {
      alert('请先选择用户');
    }
  };
  /**
   * 重置密码 model框ok按钮事件
   * @param usernames
   */
  const resetModelOnOk = (usernames) => {
    resetUserPassword({usernames: usernames.join(',')}).then((res) => {
      message.success('密码重置成功');
      if (actionRef.current) {
        actionRef.current.reset();
      }
    });
  };

  // 查看商户用户详情取消
  const handleCancel = () => {
    setDetailsVisible(false);
  };

  function optionButtons() {
    let options = [];
    if (hasAuthority(buttons.merchant.orgUser.index.add)) {
      options.push({
        text: '新建',
        onClick: () => {
          addUserForm.resetFields();
          addUserForm.setFieldsValue({"password": "1234qwer","passwordConfirm":"1234qwer"});
          handleModalVisible(true);
        },
      });
    }
    if (hasAuthority(buttons.merchant.orgUser.index.delete)) {
      options.push({
        text: '删除',
        onClick: deleteSelectUser,
      });
    }
    if (hasAuthority(buttons.merchant.orgUser.index.reset)) {
      options.push({
        text: '密码重置',
        onClick: resetSelectUser,
      });
    }
    return options;
  }

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
              optionButtons={optionButtons()}
            />
          ),
        }}
        actionRef={actionRef}
        rowKey="userId"
        beforeSearchSubmit={(params) => {
          if (Array.isArray(params.createTime)) {
            params.createTimeFrom = moment(params.createTime[0]).startOf('day');
            params.createTimeTo = moment(params.createTime[1]).endOf('day');
          }
          return params;
        }}
        request={(params) => {
          params.createTime = null;
          return getMangerUserList(params).then((res) => {
            return { data: res.data.data, success: true, total: res.data.total };
          });
        }}
        columns={columns}
        rowSelection={rowSelection}
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
                      addMangerUser(values).then((res) => {
                        message.success(res.data.message);
                        actionRef.current.reload();
                        addUserForm.resetFields();
                        handleModalVisible(false);
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
          <Form.Item name="username" label="用户名">
            <Input disabled={true} placeholder="系统自动生成" />
          </Form.Item>

          <Form.Item name="realName" label="姓名或昵称">
            <Input placeholder="请输入姓名或昵称" autoComplete="off"/>
          </Form.Item>

          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色" mode="multiple">
              {roleOptions}
            </Select>
          </Form.Item>
          <Popover content={content} placement="rightTop" trigger="click">
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { validator: handlePasswordLevel },
              ]}
            >
              <Input.Password type={'password'} placeholder="至少六位密码，区分大小写" autoComplete="off"/>
            </Form.Item>
          </Popover>
          <Form.Item
            name="passwordConfirm"
            label="再次确认"
            rules={[{ required: true, message: '请确认密码' }, { validator: passwordValidator }]}
          >
            <Input.Password type={'password'} placeholder="确认密码" autoComplete="off"/>
          </Form.Item>

          <Form.Item
            name="mobile"
            label="手机"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input type={'tel'} placeholder="请输入正确的手机号" autoComplete="off"/>
          </Form.Item>

          <Form.Item
            name="isApplets"
            label="运维权限"
            rules={[{ required: true, message: '请选择运维权限' }]}
          >
            <Radio.Group>
              <Radio value={true}>允许</Radio>
              <Radio value={false}>禁止</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Radio.Group>
              <Radio value={'1'}>有效</Radio>
              <Radio value={'0'}>锁定</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="ssex" label="性别">
            <Radio.Group>
              <Radio value={'0'}>男</Radio>
              <Radio value={'1'}>女</Radio>
              <Radio value={'2'}>保密</Radio>
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
                  eidtMangerUser(values).then((res) => {
                    message.success(res.data.message);
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                    updateUserForm.resetFields();
                    handleUpdateModalVisible(false);
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
          <Form.Item name="username" label="用户名">
            <Input disabled={true} placeholder="系统自动生成" />
          </Form.Item>

          <Form.Item name="realName" label="姓名或昵称">
            <Input placeholder="请输入姓名或昵称" autoComplete="off"/>
          </Form.Item>

          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色" mode="multiple">
              {roleOptions}
            </Select>
          </Form.Item>

          <Form.Item
            name="mobile"
            label="手机"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input type={'tel'} placeholder="请输入正确的手机号" autoComplete="off"/>
          </Form.Item>

          <Form.Item
            name="isApplets"
            label="运维权限"
            rules={[{ required: true, message: '请选择运维权限' }]}
          >
            <Radio.Group>
              <Radio value={true}>允许</Radio>
              <Radio value={false}>禁止</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Radio.Group>
              <Radio value={'1'}>有效</Radio>
              <Radio value={'0'}>锁定</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="ssex" label="性别">
            <Radio.Group>
              <Radio value={'0'}>男</Radio>
              <Radio value={'1'}>女</Radio>
              <Radio value={'2'}>保密</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default TableList;
