import React, {useRef, useState} from 'react';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import Details from './components/Details';
import { connect, Dispatch } from 'umi';
import { getMaintainCabinetInstall, queryList } from '@/services/merchant';
import { TableListItem } from './data.d';
import { StateType } from './model';
import { Space } from 'antd';

interface TableListProps {
  dispatch: Dispatch;
  userManager: StateType;
}

const TableList: React.FC<{ TableListProps }> = (props) => {
  const [detail, setDetail] = useState<object>();
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 列表及搜索条件d
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'no',
      hideInSearch: true,
      renderText: (val: string, _, index) => `${index + 1}`,
    },
    {
      title: '换电柜编号',
      align: 'center',
      hideInSearch: false,
      dataIndex: 'deviceCode',
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    {
      title: '所属运营商',
      dataIndex: 'merchantName',
      align: 'center',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '批次',
      align: 'center',
      dataIndex: 'batchNo',
      hideInSearch: true,
    },
    {
      title: '地区',
      align: 'center',
      dataIndex: 'city',
      hideInSearch: true,
    },
    {
      title: '地址',
      align: 'center',
      dataIndex: 'address',
      hideInSearch: true,
    },
    {
      title: '安装时间',
      align: 'center',
      dataIndex: 'installTime',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '运维人员',
      align: 'center',
      dataIndex: 'operator',
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Space>
            <a
              onClick={(e) => {
                getMaintainCabinetInstall(record.id).then((res) => {
                  setDetailsVisible(true);
                  setDetail({ ...res.data.data });
                });
              }}
            >
              详情
            </a>
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
        <ProTable<TableListItem>
          style={{display: detailsVisible ? 'none' : ''}}
          bordered
          options={{
            density: false,
            fullScreen: false,
            reload: false,
            setting: false,
          }}
          rowKey="id"
          beforeSearchSubmit={(params) => {
            return params;
          }}
          actionRef={actionRef}
          toolBarRender={false}
          columns={columns}
          request={(params) =>
            queryList(params).then((res) => {
              return { data: res.data.data, success: true, total: res.data.total };
            })
          }
        />
      {detailsVisible && (
        <Details
          handleReturn={() => {
            setDetailsVisible(false);
            actionRef.current.reload();
          }}
          data={detail}
        />
      )}
    </>
  );
};

export default TableList;
