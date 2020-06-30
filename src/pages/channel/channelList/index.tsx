import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, List, message, Modal, Tooltip, Typography, Tag} from 'antd';
import {CardListItemDataType} from '@/pages/merchant/group/data';
import {EditOutlined, KeyOutlined, PlusOutlined} from '@ant-design/icons/lib';
import {channelList, channelResetPassword} from '@/services/channel';
import {enums, getEnumText} from '@/utils/enums';
import styles from './style.less';
import avatar from '@/assets/icon.jpg';
import CreateModel from './components/CreateModel';
import EditModel from './components/EditModel';
import UserListModel from './components/UserListModel';
import ProfitListModel from './components/ProfitListModel';
import WithdrawListModel from './components/WithdrawListModel';
import {buttons, hasAuthority} from '@/utils/buttons';

import 'antd/dist/antd.css';

const {Paragraph} = Typography;
const CardList: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const nullData: Partial<CardListItemDataType> = {};
  const [channelListData, setChannelListData] = useState<CardListItemDataType[]>([]);
  const [createModelVisible, setCreateModelVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  //编辑渠道
  const [editModelVisible, setEditModelVisible] = useState<boolean>(false);
  const [editData, setEditData] = useState();

  //查看用户列表
  const [channel, setChannel] = useState<object>(null);
  const [userListVisible, setUserListVisible] = useState<boolean>(false);

  //查看分润列表
  const [profitListVisible, setProfitListVisible] = useState<boolean>(false);

  //查看提现记录列表
  const [withdrawListVisible, setWithdrawListVisible] = useState<boolean>(false);

  /**
   * 初始化加载数据
   */
  useEffect(() => {
    loadGroup({});
  }, []);

  function loadGroup(params) {
    setLoading(true);
    if (!params.operatorName) {
      params = {};
    }
    channelList(params).then((res) => {
      setChannelListData([nullData, ...res.data.data]);
      setLoading(false);
    });
  }

  /**
   * 查询渠道 按钮点击事件
   */
  const searchChannelClick = () => {
    form
      .validateFields()
      .then((values) => {
        let params = {...values};
        loadGroup(params);
      })
      .catch((errorInfo) => {
      });
  };

  /**
   * 新增渠道 按钮点击事件
   */
  const createChannelClick = () => {
    setCreateModelVisible(true);
  };

  /**
   * 新增渠道 model框关闭
   */
  const createChannelModelClose = () => {
    setCreateModelVisible(false);
    loadGroup({});
  };

  /**
   * 编辑渠道 按钮点击事件
   */
  const editChannelClick = () => {
    setEditModelVisible(true);
  };

  /**
   * 编辑渠道 model框关闭
   */
  const editChannelModelClose = () => {
    setEditModelVisible(false);
    loadGroup({});
  };

  /**
   * 查看用户 按钮点击事件
   */
  const userListOnClick = (record) => {
    setChannel(record);
    setUserListVisible(true);
  };

  /**
   * 用户详情页返回
   */
  const handleUserListReturn = () => {
    setUserListVisible(false);
  };

  /**
   * 查看分润 按钮点击事件
   */
  const profitListOnClick = (record) => {
    setChannel(record);
    setProfitListVisible(true);
  };

  /**
   * 查看分润详情页返回
   */
  const handleProfitListReturn = () => {
    setProfitListVisible(false);
  };

  /**
   * 提现记录 按钮点击事件
   */
  const withdrawListOnClick = (record) => {
    setChannel(record);
    setWithdrawListVisible(true);
  };

  /**
   * 提现记录详情页返回
   */
  const handleWithdrawListReturn = () => {
    setWithdrawListVisible(false);
  };

  return (
    <>
      {!userListVisible && !profitListVisible && !withdrawListVisible && (
        <>
          <Form form={form} layout="inline">
            <Form.Item name="operatorName" label="渠道名称">
              <Input allowClear autoComplete= "off"/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={searchChannelClick}>
                查询
              </Button>
            </Form.Item>
          </Form>
          <div className={styles.cardList}>
            <List<Partial<CardListItemDataType>>
              rowKey="id"
              loading={loading}
              grid={{column: 4, gutter: 12, xxl: 5, xl: 4, md: 2, sm: 1, xs: 1}}
              dataSource={channelListData}
              renderItem={(channel) => {
                if (channel && channel.id) {
                  return (
                    <List.Item key={channel.id}>
                      <Card
                        title={<Tooltip title={channel.operatorName}>
                          {channel.operatorName}
                        </Tooltip>}
                        extra={
                          <>
                              <a
                                onClick={() => {
                                  Modal.confirm({
                                    title: '重置渠道密码',
                                    content: '确认要重置渠道密码吗？',
                                    okText: '确认',
                                    cancelText: '取消',
                                    onOk: () => {
                                      channelResetPassword({id: channel.id}).then(() => {
                                        message.success('重置渠道密码成功');
                                      });
                                    },
                                  });
                                }}
                              >
                                重置密码
                              </a>
                              <a style={{marginLeft:5}}
                                onClick={() => {
                                  setEditData(channel);
                                  editChannelClick();
                                }}
                              >
                                编辑
                              </a>

                            <span style={{marginLeft: 10}}>
                              {channel.channelStatus == 1 ? (
                                <Tag color="green">启用</Tag>
                              ) : (
                                <Tag color="red">停用</Tag>
                              )}
                            </span>
                          </>
                        }
                        actions={[
                          <>
                            {hasAuthority(buttons.channel.channelList.index.user) && (
                              <a key="userList" onClick={userListOnClick.bind(this, channel)}>
                                查看用户
                              </a>
                            )}
                          </>,
                          <>
                            {hasAuthority(buttons.channel.channelList.index.profit) && (
                              <a key="delete" onClick={profitListOnClick.bind(this, channel)}>
                                查看分润
                              </a>
                            )}
                          </>,
                          <>
                            {hasAuthority(buttons.channel.channelList.index.withdraw) && (
                              <a key="delete" onClick={withdrawListOnClick.bind(this, channel)}>
                                提现记录
                              </a>
                            )}
                          </>,
                        ]}
                      >
                        <Card.Meta
                          avatar={<img alt="" className={styles.cardAvatar} src={avatar}/>}
                          description={
                            <>
                              <Paragraph ellipsis>
                                手机号：
                                <Tooltip title={channel.mobileNo}>{channel.mobileNo}</Tooltip>
                              </Paragraph>
                              <Paragraph ellipsis>
                                组内人数：{channel.groupUserCont ? channel.groupUserCont : 0}
                              </Paragraph>
                              <Paragraph ellipsis>备注：{channel.remark}</Paragraph>
                              <Paragraph ellipsis>
                                分润金额：{channel.shareBenefitAmount / 100}元
                              </Paragraph>
                              <Paragraph ellipsis>
                                账户状态：
                                {getEnumText(enums.ChannelAccountStatus, channel.accountStatus)}
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
                    {hasAuthority(buttons.channel.channelList.index.add) && (
                      <List.Item>
                        <Button
                          type="dashed"
                          className={styles.newButton}
                          onClick={createChannelClick}
                        >
                          <PlusOutlined/> 新增渠道
                        </Button>
                      </List.Item>
                    )}
                  </>
                );
              }}
            />
          </div>
        </>
      )}

      {createModelVisible && <CreateModel handleModelClose={createChannelModelClose}/>}
      {editModelVisible && <EditModel handleModelClose={editChannelModelClose} data={editData}/>}
      {userListVisible && (
        <UserListModel handleModelClose={handleUserListReturn} data={channel}></UserListModel>
      )}
      {profitListVisible && (
        <ProfitListModel handleModelClose={handleProfitListReturn} data={channel}></ProfitListModel>
      )}
      {withdrawListVisible && (
        <WithdrawListModel
          handleModelClose={handleWithdrawListReturn}
          data={channel}
        ></WithdrawListModel>
      )}
    </>
  );
};

export default CardList;
