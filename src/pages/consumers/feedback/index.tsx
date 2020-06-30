import React, { useEffect, useRef, useState } from 'react';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Cascader, Form, Input, message, Modal, Popover, Tag, Space } from 'antd';
import { TableListItem } from './data';
import { getFeedBack, hasDealFeedBack } from '@/services/consumer';
import { enumConverter, enums, getEnumText } from '@/utils/enums';
import { getRegions, loadRegionData } from '@/utils/region';
import { buttons, hasAuthority } from '@/utils/buttons';
import moment from "moment";
const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [responseModelVisible, setResponseModelVisible] = useState<boolean>(false);
  const [feedbackId, setFeedbackId] = useState<number>();
  const [regionOptions, setRegionOptions] = useState<[]>();
  const [regionData, setRegionData] = useState<[]>([]);

  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    getRegions().then((res) => {
      setRegionOptions(res);
    });
  }, []);

  const loadRegion = (selectedOptions) => {
    loadRegionData(selectedOptions).then(() => {
      setRegionOptions([...regionOptions]);
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '城市',
      dataIndex: 'region',
      align: 'center',
      order: 9,
      hideInTable: true,
      renderFormItem: () => (
        <Cascader options={regionOptions} loadData={loadRegion} onChange={onChangeRegion} />
      ),
    },
    {
      title: '反馈时间区间',
      align: 'center',
      dataIndex: 'dateTimeRange',
      valueType: 'dateRange',
      hideInTable: true,
      order: 6,
    },
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '联系方式',
      align: 'center',
      dataIndex: 'mobileNo',
      hideInSearch: true,
    },
    {
      title: '订单编号',
      align: 'center',
      dataIndex: 'orderId',
      order: 10,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '反馈类型',
      align: 'center',
      dataIndex: 'feedbackType',
      valueEnum: enumConverter(enums.FeedBackTypeEnum),
      order: 8,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '图片',
      align: 'center',
      dataIndex: 'images',
      hideInSearch: true,
      render: (_, record) => {
        <>
          <Popover
            title="img"
            content={
              <>
                <img src={record.images} />
              </>
            }
          >
            <span>查询图片</span>
          </Popover>
        </>;
      },
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'content',
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
      title: '反馈时间',
      align: 'center',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '处理状态',
      align: 'center',
      dataIndex: 'dealStatus',
      valueEnum: enumConverter(enums.FeedBackDealStatusEnum),
      order: 7,
      render: (_, record) => {
        switch (record.dealStatus) {
          case 1:
            return <Tag color="red">未处理</Tag>;
          case 2:
            return <Tag color="blue">转发运维</Tag>;
          case 3:
            return <Tag color="cyan">已答复</Tag>;
          case 4:
            return <Tag color="green">已解决</Tag>;
        }
      },
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '处理结果',
      align: 'center',
      dataIndex: 'response',
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
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Space>
            {record.dealStatus != 1 && (
              <span>{getEnumText(enums.FeedBackDealStatusEnum, record.dealStatus)}</span>
            )}
            {hasAuthority(buttons.consumers.feedback.index.deal) && record.dealStatus == 1 && (
              <a onClick={responseDealOnClick.bind(_, record)}>处理</a>
            )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 处理 按钮点击事件
   * @param record
   */
  const responseDealOnClick = (record) => {
    setFeedbackId(record.id)
    setResponseModelVisible(true)
    return;
  }

  /**
   * 处理 model框ok按钮事件
   */
  const responseModalOnOk = () => {
    form
      .validateFields()
      .then((values) => {
        hasDealFeedBack(feedbackId, values.response).then((res) => {
          message.success(res.data.message);
          form.resetFields();
          actionRef.current.reload();
          setResponseModelVisible(false);
        });
      })
      .catch((errorInfo) => {});
  };

  /**
   * 处理 model框cancel按钮事件
   */
  const responseModalOnCancel = () => {
    form.resetFields();
    setResponseModelVisible(false);
  };

  /**
   * 查询表单参数预处理
   * @param params
   */
  const beforeSearchSubmit = (params) => {
    if (Array.isArray(params.dateTimeRange)) {
      params.startTime = moment(params.dateTimeRange[0]).startOf('day').format("YYYY/MM/DD HH:mm:ss");
      params.endTime = moment(params.dateTimeRange[1]).endOf('day').format("YYYY/MM/DD HH:mm:ss");
    }
    return params;
  };

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    let _params = { ...params };
    delete _params.region;
    if (regionData && regionData.length > 1) {
      _params.province = regionData[0];
      _params.city = regionData[1];
      _params.area = regionData[2];
    }
    return getFeedBack(_params).then((res) => {
      return { data: res.data.data, success: true, total: res.data.total };
    });
  };

  function onChangeRegion(value) {
    setRegionData(value);
  }

  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        actionRef={actionRef}
        rowKey="id"
        beforeSearchSubmit={beforeSearchSubmit}
        request={request}
        columns={columns}
      />
      <Modal
        title="处理描述"
        visible={responseModelVisible}
        onOk={responseModalOnOk}
        onCancel={responseModalOnCancel}
      >
        <Form form={form} initialValues={{}}>
          <Form.Item
            name="response"
            label="处理描述"
            rules={[{ required: true, message: '请输入处理描述' }]}
          >
            <Input.TextArea placeholder="请输入处理描述" autoSize={{ minRows: 4, maxRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableList;
