import {Card, Col, Descriptions, Divider, Modal} from 'antd';
import React, {FC} from 'react';
import styles from './style.less';
import {enums, getEnumText} from "@/utils/enums";

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  userInfoData: Object | undefined;
  // onDone: () => void;
  // onSubmit: (values: TableListItem) => void;
  onCancel: () => void;
  data: object | undefined
  // handleCancel: ()=> void
}

const DetailsModal: FC<OperationModalProps> = (props) => {
  const {visible, onCancel, userInfoData} = props;
  return (
    <Modal
      title={'用户信息'}
      className={styles.standardListForm}
      width={'40%'}
      getContainer={false}
      destroyOnClose
      visible={visible}
      onCancel={onCancel}
      onOk={null}
      footer={false}
    >
      <Card bordered={false} >
        <Descriptions column={2}>

          <Descriptions.Item label="账户">{userInfoData?.username}</Descriptions.Item>
          <Descriptions.Item label="角色">{userInfoData?.roleName ? userInfoData?.roleName : '暂无角色'}</Descriptions.Item>
          <Descriptions.Item label="性别">{userInfoData?.sex}</Descriptions.Item>
          <Descriptions.Item label="电话">{userInfoData?.mobile ? userInfoData?.mobile : '暂未绑定电话'}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{userInfoData?.email ? userInfoData?.email : '暂未绑定邮箱'}</Descriptions.Item>
          {/*<Descriptions.Item label="部门">{userInfoData?.deptName ? userInfoData?.deptName : '暂无部门信息'}</Descriptions.Item>*/}
          <Descriptions.Item label="状态">{getEnumText(enums.UserStatus, userInfoData?.status)}</Descriptions.Item>
          <Descriptions.Item label="运维权限">{getEnumText(enums.IsApplets, userInfoData?.isApplets)}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{userInfoData?.createTime}</Descriptions.Item>
          <Descriptions.Item label="最近登录">{userInfoData?.lastLoginTime}</Descriptions.Item>
          <Descriptions.Item label="描述">{userInfoData?.description}</Descriptions.Item>
        </Descriptions>

      </Card>
    </Modal>
  );
};

export default DetailsModal;
