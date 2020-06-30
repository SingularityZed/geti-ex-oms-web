import React, { useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { deleteConfig, pageList, update } from '@/services/merchant';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import Create from '@/pages/merchant/equipconfig/commonents/Create';
import { buttons, hasAuthority } from '@/utils/buttons';
import { PlusOutlined } from '@ant-design/icons/lib';
import { TableListItem } from './data';
import SearchFormOption from '@/components/SearchFormOption';

const Index: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [id, setId] = useState<number>();
  const [editInfo, setEditInfo] = useState<object>();
  const [deleteModalTitle, setDeleteModalTitle] = useState<string>('');
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [editModalTitle, setEditModalTitle] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [checked, setChecked] = useState();

  // 列表及搜索条件
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '配置名称',
      align: 'center',
      dataIndex: 'configName',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '商户ID',
      dataIndex: 'merchantId',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '可换电量soc值',
      align: 'center',
      dataIndex: 'exCableSoc',
      hideInSearch: true,
    },
    {
      title: '电池mos报警温度',
      align: 'center',
      dataIndex: 'batteryMosTemperatureLimit',
      hideInSearch: true,
    },
    {
      title: '电池包报警温度',
      align: 'center',
      dataIndex: 'batteryPackageTemperatureLimit',
      hideInSearch: true,
    },
    {
      title: '电柜最高报警温度',
      align: 'center',
      dataIndex: 'cabinetTemperatureLimit',
      hideInSearch: true,
    },
    {
      title: '电池最高报警湿度',
      align: 'center',
      dataIndex: 'cabinetHumidityLimit',
      hideInSearch: true,
    },
    {
      title: '功率',
      align: 'center',
      dataIndex: 'power',
      hideInSearch: true,
    },
    {
      title: '常规参数',
      align: 'center',
      dataIndex: 'commonParam',
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.merchant.equipConfig.index.edit) && (
              <a onClick={editOnClick.bind(_, record)}>编辑</a>
            )}
            {hasAuthority(buttons.merchant.equipConfig.index.delete) && (
              <a onClick={deleteOnclick.bind(_, record)}>删除</a>
            )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 删除 按钮点击事件
   * @param record
   */
  const deleteOnclick = (record) => {
    setDeleteModalTitle('删除');
    setDeleteModalVisible(true);
    setId(record.id);
    return;
  };

  /**
   * 删除 model框ok按钮事件
   */
  const deleteModalOnOk = () => {
    form
      .validateFields()
      .then((values) => {
        deleteConfig(id).then((res) => {
          message.success(res.data.message);
          form.resetFields();
          actionRef.current.reload();
          setDeleteModalVisible(false);
        });
      })
      .catch((errorInfo) => {});
  };
  /**
   * 删除 model框cancel按钮事件
   */
  const deleteModalOnCancel = () => {
    form.resetFields();
    setDeleteModalVisible(false);
  };

  /********************************************/

  /**
   *编辑 按钮点击事件
   * @param record
   */
  const editOnClick = (record) => {
    setEditModalTitle('编辑');
    setEditModalVisible(true);
    setId(record.id);
    setEditInfo(record);
    form.setFieldsValue({
      configName: record.configName,
      power: record.power,
      exCableSoc: record.exCableSoc,
      batteryMosTemperatureLimit: record.batteryMosTemperatureLimit,
      batteryPackageTemperatureLimit: record.batteryPackageTemperatureLimit,
      cabinetTemperatureLimit: record.cabinetTemperatureLimit,
      cabinetHumidityLimit: record.cabinetHumidityLimit,
      commonParam: record.commonParam,
    });
  };

  /**
   * 编辑 model框ok按钮事件
   */
  const editModalOnOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      editOk(values);
    });
    setEditModalVisible(false);
  };

  /**
   * 编辑确认
   */
  function editOk(values) {
    values.id = editInfo.id;
    update(values);
    actionRef.current.reload();
    setEditModalVisible(false);
  }

  /**
   * 编辑 model框cancel按钮事件
   */
  const editModalOnCancel = () => {
    form.resetFields();
    setEditModalVisible(false);
  };
  /**
   * 编辑 modal样式
   */
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  /**
   * 创建 按钮点击事件
   */
  function createOnClick() {
    setCreateVisible(true);
  }
  /**
   *  新增页返回
   */
  const handleCreateReturn = () => {
    setCreateVisible(false);
    actionRef.current.reload();
  };

  function checkChange(checkedValues) {
    setChecked(checkedValues);
  }
  const optionButtons = hasAuthority(buttons.merchant.equipConfig.index.add)
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
          style={{display: createVisible ? 'none' : ''}}
          bordered
          options={{
            density: false,
            fullScreen: false,
            reload: false,
            setting: false,
          }}
          actionRef={actionRef}
          rowKey="id"
          beforeSearchSubmit={(params) => {
            return params;
          }}
          columns={columns}
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
          request={(params) =>
            pageList(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            })
          }
        />
      {createVisible && <Create handleReturn={handleCreateReturn} />}
      <Modal
        title={deleteModalTitle}
        visible={deleteModalVisible}
        onOk={deleteModalOnOk}
        onCancel={deleteModalOnCancel}
      ></Modal>
      <Modal
        title={editModalTitle}
        visible={editModalVisible}
        onOk={editModalOnOk}
        onCancel={editModalOnCancel}
      >
        <Form
          {...layout}
          form={form}
          layout="horizontal"
          name="form_in_modal"
          initialValues={{ ...editInfo }}
        >
          <Form.Item name="configName" label="配置名称">
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item name="power" label="功率（w）" rules={[{ required: true }]}>
            <Select
              placeholder="电柜总功率"
              onChange={checkChange}
              value={checked}
              defaultValue={checked}
            >
              <Select.Option value="5000">5000W</Select.Option>
              <Select.Option value="6000">6000W</Select.Option>
              <Select.Option value="7000">7000W</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="exCableSoc" label="可换电量soc值" rules={[{ required: true }]}>
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            name="batteryMosTemperatureLimit"
            label="电池mos报警温度"
            rules={[{ required: true }]}
          >
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            name="batteryPackageTemperatureLimit"
            label="电池包报警温度"
            rules={[{ required: true }]}
          >
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            name="cabinetTemperatureLimit"
            label="电柜最高报警温度"
            rules={[{ required: true }]}
          >
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            name="cabinetHumidityLimit"
            label="电柜最高报警湿度"
            rules={[{ required: true }]}
          >
            <Input autoComplete={"off"}/>
          </Form.Item>
          <Form.Item name="commonParam" label="常规参数">
            <Input autoComplete={"off"}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
