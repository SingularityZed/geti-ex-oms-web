import { EditOutlined } from '@ant-design/icons';
import { Button, Input, Tabs, Form, message, Modal, Card, Radio, Descriptions, Avatar } from 'antd';
import { FormattedMessage } from 'umi';
import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined } from "@ant-design/icons/lib";
import styles from './BaseView.less';
import { getUserInfo } from '../../../utils/authority';
import {editUser,changeAvatar} from "@/services/manager.ts";



const Index: React.FC<{}> = () => {

    const [form] = Form.useForm();
    const { confirm } = Modal;

    const userInfo = JSON.parse(getUserInfo() || '{}').user;

    const picPrefix = "https://static.geti365.com/web/avatar/";
    const [imgVisible, setImgVisible] = useState<boolean>(false);
    const [iconValue, setIconValue] = useState<string>('');
    const [avatarImg, setAvatarImg] = useState<string>(picPrefix + userInfo.avatar);

    const { TabPane } = Tabs;
    const [imgButtonFaceCute, setImgButtonFaceCute] = useState<object>([]);
    const [imgButtonAlibaba, setImgButtonAlibaba] = useState<object>([]);
    const [imgButtonHthz, setImgButtonHthz] = useState<object>([]);


    /**
     * 菜单头像弹出框
     */
    const selectIcon = () => {
        setImgVisible(true);
    };

    /**
     * 选择头像
     */
    function chooseIcon(key?: any) {
        message.success("已选择:" + key.target.id)
        setIconValue(key.target.id)
    }

    /**
     * 确认选择的头像
     */
    const showImgModal = () => {
        setAvatarImg(picPrefix + iconValue);
        setImgVisible(false);
        // 更换头像
        changeAvatar(userInfo.username, iconValue).then((res) => {
            message.success('更换头像成功');
            // 头像实时变化
            localStorage.setItem('avaUrl',picPrefix+iconValue)
        });

    };
    /**
     * 取消选择的头像
     */
    const onAvatarCancel = () => {
        setImgVisible(false);
    };

    /**
     * 头像组件 方便以后独立，增加裁剪之类的功能
     * @param
     */
    const AvatarView = ({ avatar }: { avatar: string }) => (
        <>
            <div className={styles.avatar_title}>
                <FormattedMessage id="accountandsettings.basic.avatar" defaultMessage="头像" />
            </div>
            <div className={styles.avatar}>
                <img src={avatarImg} alt="avatar" />
            </div>

            <div className={styles.button_view} >
                <Button icon={<EditOutlined />} onClick={() => selectIcon()}>
                    <FormattedMessage
                        id="change-avatar"
                        defaultMessage="修改头像"
                    />
                </Button>
            </div>

        </>
    );
    /**
     * 头像数据
     */
    const imgFaceCute = ['19034103295190235.jpg', '20180414165920.jpg', '20180414170003.jpg', '20180414165927.jpg', '20180414165754.jpg', '20180414165815.jpg', '20180414165821.jpg', '20180414165827.jpg', '20180414165834.jpg', '20180414165840.jpg', '20180414165846.jpg', '20180414165855.jpg', '20180414165909.jpg', '20180414165914.jpg', '20180414165936.jpg', '20180414165942.jpg', '20180414165947.jpg', '20180414165955.jpg']
    const imgAlibaba = ['cnrhVkzwxjPwAaCfPbdc.png', 'BiazfanxmamNRoxxVxka.png', 'gaOngJwsRYRaVAuXXcmB.png', 'WhxKECPNujWoWEFNdnJE.png', 'ubnKSIfAJTxIgXOKlciN.png', 'jZUIxmJycoymBprLOUbT.png']
    const imgHthz = ['default.jpg', '1d22f3e41d284f50b2c8fc32e0788698.jpeg', '2dd7a2d09fa94bf8b5c52e5318868b4d9.jpg', '2dd7a2d09fa94bf8b5c52e5318868b4df.jpg', '8f5b60ef00714a399ee544d331231820.jpeg', '17e420c250804efe904a09a33796d5a10.jpg', '17e420c250804efe904a09a33796d5a16.jpg', '87d8194bc9834e9f8f0228e9e530beb1.jpeg', '496b3ace787342f7954b7045b8b06804.jpeg', '595ba7b05f2e485eb50565a50cb6cc3c.jpeg', '964e40b005724165b8cf772355796c8c.jpeg', '5997fedcc7bd4cffbd350b40d1b5b987.jpg', '5997fedcc7bd4cffbd350b40d1b5b9824.jpg', 'a3b10296862e40edb811418d64455d00.jpeg', 'a43456282d684e0b9319cf332f8ac468.jpeg', 'bba284ac05b041a8b8b0d1927868d5c9x.jpg', 'c7c4ee7be3eb4e73a19887dc713505145.jpg', 'ff698bb2d25c4d218b3256b46c706ece.jpeg']
    /**
     * 加载头像
     */
    useEffect(() => {
        let buttonFaceCuteArr = []
        let buttonAlibabaArr = []
        let buttonHthzArr = []
        for (let i = 0; i < imgFaceCute.length; i++) {
            buttonFaceCuteArr.push(
                <Button type="link" style={{ padding: 1, width: 65, height: 65 }} id={imgFaceCute[i]} onClick={(id) => chooseIcon(id)}>
                    <Avatar style={{ padding: 1 }} shape="square" size={64} src={picPrefix + imgFaceCute[i]} />
                </Button>
            )
        }
        for (let i = 0; i < imgAlibaba.length; i++) {
            buttonAlibabaArr.push(
                <Button type="link" style={{ padding: 1, width: 65, height: 65 }} id={imgAlibaba[i]} onClick={(id) => chooseIcon(id)}>
                    <Avatar style={{ padding: 1 }} shape="square" size={64} src={picPrefix + imgAlibaba[i]} />
                </Button>
            )
        }
        for (let i = 0; i < imgHthz.length; i++) {
            buttonHthzArr.push(
                <Button type="link" style={{ padding: 1, width: 65, height: 65 }} id={imgHthz[i]} onClick={(id) => chooseIcon(id)}>
                    <Avatar style={{ padding: 1 }} shape="square" size={64} src={picPrefix + imgHthz[i]} />
                </Button>
            )
        }
        setImgButtonFaceCute(buttonFaceCuteArr)
        setImgButtonAlibaba(buttonAlibabaArr)
        setImgButtonHthz(buttonHthzArr)
    }, []);


    /**
    * 修改个人信息 按钮点击事件
    */
    const updateUserProfile = () => {
        confirm({
            okText:'确认',
            cancelText:'取消',
            title: '确定修改当前用户的个人信息?',
            icon: <ExclamationCircleOutlined />,
            content: '当您点击确定按钮后，个人信息将会被修改',
            onOk: updateModelOnOk.bind(globalThis, userInfo)
        })
    };
    /**
     * 修改个人信息 model框ok按钮事件
     * @param userInfo
     */
    const updateModelOnOk = (userInfo: any) => {
        editUser(userInfo).then((res) => {
            message.success('修改个人信息成功');



        })
    }

    return (
      <>
        <Card bordered={false} style={{ marginBottom: 24 }} >
            <div className={styles.baseView}>
                <div className={styles.left}>
                    <Form form={form}
                        initialValues={userInfo}
                    >
                        <Descriptions >
                            <Descriptions.Item label="账户">{userInfo?.username}</Descriptions.Item>
                        </Descriptions>
                        <Descriptions >
                            <Descriptions.Item label="角色">{userInfo?.roleName}</Descriptions.Item>
                        </Descriptions>

                        <Form.Item
                            name="ssex"
                            label="性别"
                        >
                            <Radio.Group>
                                <Radio value={"0"}>男</Radio>
                                <Radio value={"1"}>女</Radio>
                                <Radio value={"2"}>保密</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="mobile"
                            label="手机"
                            rules={[{ required: true, message: '请输入手机号' }]}
                        >
                            <Input type={"tel"} placeholder="请输入正确的手机号" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="描述"
                        >
                            <Input.TextArea rows={2} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" onClick={updateUserProfile}>
                                更新个人信息
                            </Button>
                        </Form.Item>
                    </Form>


                    {/*-----------------------头像--start---------------------------------------------------------*/}

                    <Modal width={666}
                        visible={imgVisible}
                        okText="确认"
                        cancelText="取消"
                        onCancel={onAvatarCancel}
                        onOk={showImgModal}
                    >
                        <Tabs>
                            <TabPane tab="脸萌" key="1">
                                {imgButtonFaceCute}
                            </TabPane>
                            <TabPane tab="阿里系" key="2">
                                {imgButtonAlibaba}
                            </TabPane>
                            <TabPane tab="后田花子" key="3">
                                {imgButtonHthz}
                            </TabPane>
                        </Tabs>
                    </Modal>

                    {/*-----------------------头像--end---------------------------------------------------------*/}


                </div>
                <div className={styles.right}>
                    {/* <AvatarView avatar='https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' /> */}
                    <AvatarView avatar={avatarImg} />
                </div>
            </div>

        </Card>
      </>

    );
};

export default Index;


