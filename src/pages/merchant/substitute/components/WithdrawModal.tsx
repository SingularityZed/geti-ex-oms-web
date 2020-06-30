import React, {FC} from 'react';
import {Descriptions, message, Modal, notification} from "antd";
import {refundBatch} from "@/services/pay";
import {amountFormat} from "@/utils/amountUtils";


interface WithdrawModalProps {
  handleModelClose: () => void;
  selectedRows: [];
}

const WithdrawModal: FC<WithdrawModalProps> = (props) => {

  const {selectedRows, handleModelClose} = {...props}

  /**
   *  model框ok按钮事件
   */
  const modelOnOk = () => {
    if (selectedRows.length < 1) {
      notification.error({
        message: '系统提示',
        description: "提现用户必选",
        duration: 2,
      });
      return;
    }
    let params = {
      consumerIdList: selectedRows.map(row => row.consumerId)
    }
    refundBatch(params).then((res) => {
      message.success(res.data.message);
      handleModelClose();
    }).catch(errorInfo => {
    });
  }

  /**
   * model框cancel按钮事件
   */
  const modelOnCancel = () => {
    handleModelClose();
  }

  function withdrawTotalAmount() {
    if (selectedRows.length > 0) {
      let totalAmount = selectedRows.reduce((total, row) => {
        return total + row.depositAmount
      }, 0);
      return amountFormat(totalAmount);
    } else {
      return 0;
    }
  }

  return (
    <Modal title="提现" visible={true} cancelText="关闭" okText="确认提现" onOk={modelOnOk} onCancel={modelOnCancel}>
      <Descriptions column={1}>
        <Descriptions.Item label="提现用户数">{selectedRows.length}</Descriptions.Item>
        <Descriptions.Item
          label="提现押金总额">{withdrawTotalAmount()}元</Descriptions.Item>
        <div style={{textAlign: "left", marginLeft: 135}}>
          代缴押金提现必须符合以下规则：<br/>
          1.被提现用户必须已退还电池<br/>
          2.押金必须是已完成的代缴订单<br/>
          3.一个用户不可被多次发起代缴押金提现<br/>
          4.用户的押金状态必须为“已缴纳”
        </div>
      </Descriptions>
    </Modal>
  );
};

export default WithdrawModal;
