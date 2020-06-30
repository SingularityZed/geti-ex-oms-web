import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Input, List, message, Modal, notification, Row, Typography} from "antd";
import {CardListItemDataType} from "@/pages/merchant/group/data";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {deleteGroup, groupSearch} from "@/services/merchant";
import {enums, getEnumText} from "@/utils/enums";
import styles from './style.less';
import avatar from '@/assets/icon.jpg';
import CreateModal from "@/pages/merchant/group/components/CreateModal";
import Details from "@/pages/merchant/group/components/Details";
import {buttons, hasAuthority} from "@/utils/buttons";

const {Paragraph} = Typography;
const CardList: React.FC<{}> = () => {
  const {confirm} = Modal;
  const [form] = Form.useForm();
  const [groupList, setGroupList] = useState<CardListItemDataType[]>([]);
  const nullData: Partial<CardListItemDataType> = {};
  const [createModelVisible, setCreateModelVisible] = useState<boolean>(false);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [detailsGroup, setDetailsGroup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 初始化加载数据
   */
  useEffect(() => {
    loadGroup({});
  }, []);

  function loadGroup(params) {
    setLoading(true);
    groupSearch(params).then((res) => {
      setGroupList([nullData, ...res.data.data]);
      setLoading(false);
    })
  }

  /**
   * 查询群组 按钮点击事件
   */
  const searchGroupOnClick = () => {
    form.validateFields().then(values => {
      let params = {...values}
      loadGroup(params);
    }).catch(errorInfo => {
    });
  }

  /**
   * 新增群组 按钮点击事件
   */
  const createGroupOnClick = () => {
    setCreateModelVisible(true);
  }

  /**
   * 新增群组 model框关闭
   */
  const createGroupHandleModelClose = () => {
    setCreateModelVisible(false)
    form.resetFields();
    loadGroup({});
  }

  /**
   * 查看用户 按钮点击事件
   */
  const userListOnClick = (record) => {
    setDetailsGroup(record);
    setDetailsVisible(true);
  }

  /**
   * 删除群组 按钮点击事件
   */
  const deleteGroupOnClick = (record) => {
    if (record.groupMember && record.groupMember > 0) {
      notification.error({
        message: '系统提示',
        description: "群组内有成员,无法删除",
        duration: 2,
      });
    } else {
      confirm({
        title: '确定删除群组?',
        icon: <ExclamationCircleOutlined/>,
        content: '',
        onOk: deleteModelOnOk.bind(this, record.id),
      });

    }
  }

  /**
   * 删除 model框ok按钮事件
   */
  const deleteModelOnOk = (id) => {
    deleteGroup(id).then((res) => {
      message.success(res.data.message);
      form.resetFields();
      loadGroup({});
    }).catch(error => {
    })
  }

  /**
   * 详情页返回
   */
  const handleDetailsReturn = () => {
    setDetailsVisible(false);
    form.resetFields();
    loadGroup({});
  }

  return (
    <>
      {!createModelVisible && !detailsVisible &&
      <>
        <Form form={form} layout="inline">
          <Form.Item name="groupName" label="群组名称">
            <Input allowClear autoComplete="off"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={searchGroupOnClick}>查询</Button>
          </Form.Item>
        </Form>
        <div className={styles.cardList}>
          <List<Partial<CardListItemDataType>>
            rowKey="id"
            loading={loading}
            grid={{ gutter: 12, xxl: 4, xl: 3, md: 2, sm: 1, xs: 1}}
            dataSource={groupList}
            renderItem={(group) => {
              if (group && group.id) {
                return (
                  <List.Item key={group.id}>
                    <Card
                      title={group.groupName}
                      extra={
                        <>
                          <span>{group.merchantName}</span>
                          <span style={{
                            marginLeft: 10,
                            color: "#4BA7F8"
                          }}>{getEnumText(enums.BatterySpecificationEnum, group.deviceSpecification)}</span>
                        </>
                      }
                      actions={[
                        <>{hasAuthority(buttons.merchant.group.index.detail) &&
                        <a key="userList" onClick={userListOnClick.bind(this, group)}>查看用户</a>}
                        </>,
                        <>{hasAuthority(buttons.merchant.group.index.delete) &&
                        <a key="delete" onClick={deleteGroupOnClick.bind(this, group)}>删除</a>}
                        </>
                      ]}
                    >
                      <Card.Meta
                        avatar={<img alt="" className={styles.cardAvatar} src={avatar}/>}
                        description={
                          <>
                            <Paragraph ellipsis={{rows: 3}}>
                              组内联系人：{group.contactPerson}/{group.contactTelephone}
                            </Paragraph>
                            <Paragraph ellipsis={{rows: 3}}>
                              组内人数：{group.groupMember}
                            </Paragraph>
                            <Paragraph ellipsis={{rows: 3}}>
                              备注：{group.remark}
                            </Paragraph>
                          </>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }
              return (
                <>
                  {hasAuthority(buttons.merchant.group.index.add) &&
                  <List.Item>
                    <Button type="dashed" className={styles.newButton} onClick={createGroupOnClick}>
                      <PlusOutlined/> 新增群组
                    </Button>
                  </List.Item>
                  }
                </>
              );
            }}
          />
        </div>
      </>
      }
      {createModelVisible && <CreateModal handleModelClose={createGroupHandleModelClose}/>}
      {detailsVisible && <Details handleReturn={handleDetailsReturn} group={detailsGroup}/>}
    </>
  );
};

export default CardList;
