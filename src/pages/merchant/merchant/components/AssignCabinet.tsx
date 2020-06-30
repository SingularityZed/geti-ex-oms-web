import React, {FC, useEffect, useRef, useState} from 'react';
import ProTable from "@ant-design/pro-table";
import {message, notification, Spin} from "antd";
import {ActionType, ProColumns} from "@ant-design/pro-table/lib/Table";
import {assignmentCabinet, cabinetList, getOrganizationAll} from "@/services/merchant";
import {buttons, hasAuthority} from "@/utils/buttons";
import SearchFormOption from "@/components/SearchFormOption";


interface TableListItem {
}

interface AssignCabinetProps {
  actionRef: React.MutableRefObject | ((actionRef) => void);
  merchantId: number;
}

const AssignCabinet: FC<AssignCabinetProps> = (props) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowList, setSelectedRowList] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [organizationOptions, setOrganizationOptions] = useState<object>([]);
  useEffect(() => {
    props.actionRef.current = {
      clear: clear.bind(this)
    }
    //获取运营商全部信息
    getOrganizationAll().then((res) => {
        let obj = {}
        res.data.data.organizationInfoList.forEach(item => {
          obj[item.id] = item.powerExchangeNetworkName;
        })
        setOrganizationOptions(obj)
      }
    )
  }, []);

  const clear = () => {
    setSelectedRowList([]);
    setLoading(false);
    actionRef.current.reload();
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "序号",
      dataIndex: 'index',
      hideInSearch: true,
      renderText: (text, row, index) => index + 1
    },
    {
      title: '所属运营商',
      dataIndex: 'orgId',
      valueEnum: organizationOptions
    },

    {
      title: '换电柜编号',
      dataIndex: 'deviceCode'
    },
    {
      title: '换电柜名称',
      dataIndex: 'cabinetName'
    },
  ];

  /**
   * 添加 按钮点击事件
   */
  const addOnClick = () => {
    if (selectedRowList.length < 1) {
      notification.error({
        message: '系统提示',
        description: "请选择要添加的电柜",
        duration: 2,
      });
      return;
    }
    let params = {
      merchantId: props.merchantId,
      deviceList: selectedRowList.map(item => item.deviceCode)
    }
    assignmentCabinet(params).then((res) => {
      message.success(res.data.message, 2);
      actionRef.current.reload();
    }).catch(error => {
    })
  }

  /**
   * 表单查询请求
   * @param params
   */
  const request = (params) => {
    setLoading(true);
    return cabinetList(params).then((res) => {
      setSelectedRowList([]);
      setLoading(false);
      return {data: res.data.data, success: true, total: res.data.total};
    }).catch(error => {
      setLoading(false);
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowList(selectedRows);
    },
  };

  const optionButtons = hasAuthority(buttons.merchant.merchant.assign.addCabinet) ? [
    {
      text: "添加",
      onClick: addOnClick
    }
  ] : []

  return (
    <Spin spinning={loading}>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        search={{
          optionRender: (searchConfig, props) =>
            <SearchFormOption searchConfig={searchConfig}
                              {...props}
                              optionButtons={optionButtons}/>
        }}
        rowKey="id"
        actionRef={actionRef}
        request={request}
        columns={columns}
        rowSelection={rowSelection}
      />
    </Spin>
  );
};

export default AssignCabinet;
