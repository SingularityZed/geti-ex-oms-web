import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Radio,
  Select,
  Tree,
  Space,
} from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import {
  addRole,
  deleteRole,
  editRole,
  editRoleMenuNum,
  getRoleMenu,
  queryRole,
  addRoleChecking,
} from '@/services/manager.ts';
import { connect, Dispatch } from 'umi';
import { TableListItem } from './data';
import { getOrganizationAll } from '@/services/merchant';
import { DownOutlined } from '@ant-design/icons/lib';
import { buttons, hasAuthority } from '@/utils/buttons';
import SearchFormOption from '@/components/SearchFormOption';
import moment from 'moment';

interface TableListProps {
  dispatch: Dispatch;
}

const TableList: React.FC<TableListProps> = (props) => {
  const [addRoleForm] = Form.useForm();
  const [editRoleForm] = Form.useForm();
  const [infoRoleForm] = Form.useForm();
  const [sorter, setSorter] = useState<string>('');

  //新增角色菜单
  const [addRoleVisible, setAddRoleVisible] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<[]>();
  const [menuTreeData, setMenuTreeData] = useState<[]>();
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  const [organizationEnum, setOrganizationEnum] = useState<object>([]);
  const [allTreeKeys, setAllTreeKeys] = useState<[]>();
  const [checkStrictly, setCheckStrictly] = useState<boolean>(true);

  //编辑角色菜单
  const [editRoleVisible, setEditRoleVisible] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<string>('');

  //查看角色
  const [infoRoleVisible, setInfoRoleVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setExpandedKeys(allTreeKeys);
        }}
      >
        展开所有
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setExpandedKeys([]);
        }}
      >
        合并所有
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setCheckStrictly(false);
        }}
      >
        父子关联
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setCheckStrictly(true);
        }}
      >
        取消关联
      </Menu.Item>
    </Menu>
  );

  function onCheck(checkedKeys, info) {
    setCheckedKeys(checkedKeys);
  }

  function onExpand(expandedKeys, info) {
    setExpandedKeys(expandedKeys);
  }

  function resetEditForm() {
    setEditRoleVisible(false);
    editRoleForm.resetFields();
    setCheckedKeys([]);
    setExpandedKeys([]);
    setRoleId('');
  }

  function resetInfoForm() {
    setInfoRoleVisible(false);
    infoRoleForm.resetFields();
    setCheckedKeys([]);
    setExpandedKeys([]);
    setRoleId('');
  }

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

    getRoleMenu().then((r) => {
      setMenuTreeData(r.data.rows.children);
      setAllTreeKeys(r.data.ids);
    });
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      renderText: (val: string, record, index) => `${index + 1}`,
      hideInSearch: true,
    },
    {
      title: '角色',
      align: 'center',
      dataIndex: 'roleName',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '运营商',
      align: 'center',
      dataIndex: 'merchantId',
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
      dataIndex: 'operationName',
      hideInSearch: true,
    },
    {
      title: '角色分配类型',
      align: 'center',
      dataIndex: 'assignType',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '角色描述',
      align: 'center',
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
      ellipsis: true,
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '修改时间',
      align: 'center',
      dataIndex: 'modifyTime',
      valueType: 'dateRange',
      hideInSearch: true,
      hideInForm: true,
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
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.manager.role.index.look) && (
              <a
                onClick={(e) => {
                  editRoleMenuNum(record.roleId).then((r) => {
                    setCheckedKeys(r.data);
                    setExpandedKeys(r.data);
                    setInfoRoleVisible(true);
                    infoRoleForm.setFieldsValue(record);
                  });
                }}
              >
                查看
              </a>
            )}
            {hasAuthority(buttons.manager.role.index.update) && (
              <a
                onClick={(e) => {
                  editRoleMenuNum(record.roleId).then((r) => {
                    setRoleId(record.roleId);
                    setCheckedKeys(r.data);
                    setExpandedKeys(r.data);
                    setEditRoleVisible(true);
                    editRoleForm.setFieldsValue(record);
                  });
                }}
              >
                修改角色
              </a>
            )}

            {hasAuthority(buttons.manager.role.index.delete) && record.roleId !== 1 && (
              <a
                onClick={(e) => {
                  Modal.confirm({
                    title: '确定删除所选中的记录?',
                    content: '当您点击确定按钮后，这些记录将会被彻底删除',
                    centered: true,
                    onOk() {
                      deleteRole(record.roleId).then(() => {
                        actionRef.current.reload();
                      });
                    },
                  });
                }}
              >
                删除
              </a>
            )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 新增 按钮点击事件
   */
  const createOnClick = (record) => {
    setAddRoleVisible(true);
  };

  const optionButtons = hasAuthority(buttons.manager.role.index.add)
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
        dateFormatter="string"
        rowKey="roleId"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        beforeSearchSubmit={(params) => {
          if (Array.isArray(params.createTime)) {
            params.createTimeFrom = moment(params.createTime[0]).startOf('day');
            params.createTimeTo = moment(params.createTime[1]).endOf('day');
            params.createTime = null;
          }

          return params;
        }}
        request={(params) =>
          queryRole(params).then((res) => {
            // console.log(res, 'tabledata');
            return { data: res.data.rows, success: true, total: res.data.total };
          })
        }
        columns={columns}
        rowSelection={false}
      />

      <Drawer
        title="新增角色"
        width="40%"
        onClose={() => {
          setAddRoleVisible(false);
          setCheckedKeys([]);
          setExpandedKeys([]);
          addRoleForm.resetFields();
        }}
        visible={addRoleVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Dropdown overlay={menu}>
              <a>
                树操作 <DownOutlined />
              </a>
            </Dropdown>
            <Button
              onClick={() => {
                setAddRoleVisible(false);
                addRoleForm.resetFields();
                resetInfoForm();
              }}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                //修改数据
                addRoleForm.validateFields().then((values) => {
                  addRoleChecking(values.username).then((r) => {
                    if (!r.data) {
                      message.error('抱歉，该角色名已存在');
                    } else {
                      let checkArr = Object.is(checkedKeys.checked, undefined)
                        ? checkedKeys
                        : checkedKeys.checked;
                      values.menuId = checkArr?.join(',');
                      addRole(values).then(() => {
                        message.success('新增角色成功');
                        setAddRoleVisible(false);
                        addRoleForm.resetFields();
                        actionRef.current.reload();
                        resetInfoForm();
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
        <Form form={addRoleForm} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
          <Form.Item label="角色名称" name="roleName">
            <Input autoComplete="off"></Input>
          </Form.Item>
          <Form.Item name="operationName" label="运营商">
            <Select placeholder="请选择运营商">{organizationOptions}</Select>
          </Form.Item>
          <Form.Item
            name="assignType"
            label="角色分配类型"
            rules={[{ required: true, message: '请选择角色分配类型' }]}
          >
            <Radio.Group>
              <Radio value={2}>全部运营商使用</Radio>
              <Radio value={1}>仅平台使用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="角色描述"
            name="remark"
            rules={[{ max: 50, message: '长度不能超过50个字符' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="权限选择">
            <Tree
              checkable={true}
              treeData={menuTreeData}
              onCheck={onCheck}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              checkStrictly={checkStrictly}
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="修改角色"
        width="40%"
        onClose={resetEditForm}
        visible={editRoleVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Dropdown overlay={menu}>
              <a>
                树操作 <DownOutlined />
              </a>
            </Dropdown>
            <Button onClick={resetEditForm} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button
              onClick={() => {
                //修改数据
                editRoleForm.validateFields().then((values) => {
                  let checkArr = Object.is(checkedKeys.checked, undefined)
                    ? checkedKeys
                    : checkedKeys.checked;
                  values.menuId = checkArr?.join(',');
                  values.roleId = roleId;
                  editRole(values).then(() => {
                    message.success('修改角色成功');
                    setEditRoleVisible(false);
                    actionRef.current.reload();
                    editRoleForm.resetFields();
                    resetEditForm();
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
        <Form form={editRoleForm} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
          <Form.Item label="角色名称" name="roleName">
            <Input autoComplete="off"></Input>
          </Form.Item>
          <Form.Item name="operationName" label="运营商">
            <Select placeholder="请选择运营商">{organizationOptions}</Select>
          </Form.Item>
          <Form.Item
            name="assignType"
            label="角色分配类型"
            rules={[{ required: true, message: '请选择角色分配类型' }]}
          >
            <Radio.Group>
              <Radio value={2}>全部运营商使用</Radio>
              <Radio value={1}>仅平台使用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="角色描述"
            name="remark"
            rules={[{ max: 50, message: '长度不能超过50个字符' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="权限选择">
            <Tree
              checkable={true}
              treeData={menuTreeData}
              onCheck={onCheck}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              checkStrictly={checkStrictly}
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="角色信息"
        width="40%"
        onClose={resetInfoForm}
        visible={infoRoleVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={infoRoleForm} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
          <Form.Item label="角色名称" name="roleName">
            <Input disabled={true}></Input>
          </Form.Item>
          <Form.Item label="角色描述" name="remark">
            <Input disabled={true}></Input>
          </Form.Item>
          <Form.Item label="创建时间" name="createTime">
            <Input disabled={true}></Input>
          </Form.Item>
          <Form.Item label="修改时间" name="modifyTime">
            <Input disabled={true}></Input>
          </Form.Item>

          <Form.Item label="所拥有的权限">
            <Tree
              checkable={true}
              treeData={menuTreeData}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              checkStrictly
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

// export default TableList;
export default connect(({ role, loading }: // details
{ role: StateType; details: []; loading: { models: { [key: string]: boolean } } }) => ({
  role,
  // details,
  loading: loading.models.role,
}))(TableList);
