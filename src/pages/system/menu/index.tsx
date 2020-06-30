import React, { useEffect, useRef, useState } from 'react';
import {
  createFromIconfontCN,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Tabs,
  Tree,
  Space,
} from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import { addMenu, deleteMenu, getCommonMenu, queryMenu, updateMenu } from '@/services/manager.ts';
import { TableListItem } from './data';
import { buttons, hasAuthority } from "@/utils/buttons";
import SearchFormOption from '@/components/SearchFormOption';
import moment from "moment";

/**
 * 图标数据
 */
const iconPathData = ['icon-step-backward', 'icon-step-forward', 'icon-fast-backward', 'icon-fast-forward', 'icon-shrink', 'icon-arrawsalt', 'icon-up', 'icon-down', 'icon-left', 'icon-right', 'icon-caret-up', 'icon-caret-down', 'icon-caret-left', 'icon-caret-right', 'icon-up-circle', 'icon-down-circle', 'icon-left-circle', 'icon-right-circle', 'icon-up-circle-fill', 'icon-down-circle-fill', 'icon-left-circle-fill', 'icon-right-circle-fill', 'icon-doubleleft', 'icon-doubleright', 'icon-verticalleft', 'icon-verticalright', 'icon-forward', 'icon-backward', 'icon-rollback', 'icon-enter', 'icon-retweet', 'icon-swap', 'icon-swap-left', 'icon-swap-right', 'icon-arrowup', 'icon-arrowdown', 'icon-arrowleft', 'icon-arrowright', 'icon-play-circle', 'icon-play-circle-fill', 'icon-up-square', 'icon-down-square', 'icon-left-square', 'icon-right-square', 'icon-up-square-fill', 'icon-down-square-fill', 'icon-left-square-fill', 'icon-right-square-fill', 'icon-login', 'icon-logout', 'icon-indent', 'icon-outdent', 'icon-border-top', 'icon-border-bottom', 'icon-border-left', 'icon-border-right', 'icon-border-inner', 'icon-border-verticle', 'icon-border-horizontal', 'icon-radius-upleft', 'icon-radius-upright', 'icon-radius-bottomleft', 'icon-radius-bottomright', 'icon-pic-left', 'icon-pic-center', 'icon-pic-right', 'icon-fullscreen', 'icon-fullscreen-exit', 'icon-insertrowabove', 'icon-insertrowbelow', 'icon-insertrowleft', 'icon-insertrowright', 'icon-compass-fill']
const iconInsData = ['icon-question', 'icon-question-circle', 'icon-plus', 'icon-plus-circle', 'icon-plus-circle-fill', 'icon-pause', 'icon-timeout', 'icon-poweroff-circle-fill', 'icon-minus', 'icon-minus-circle', 'icon-minus-circle-fill', 'icon-plus-square', 'icon-minus-square', 'icon-infomation', 'icon-info-circle', 'icon-info-circle-fill ', 'icon-exclaimination', 'icon-warning-circle', 'icon-warning-circle-fill', 'icon-close', 'icon-close-circle', 'icon-close-square', 'icon-close-square-fill', 'icon-check', 'icon-check-circle', 'icon-check-square', 'icon-time-circle', 'icon-time-circle-fill', 'icon-error', 'icon-issuesclose', 'icon-stop', 'icon-stop-fill', 'icon-error-fill', 'icon-fire', 'icon-fire-fill', 'icon-sound', 'icon-sound-fill', 'icon-notification', 'icon-thunderbolt', 'icon-thunderbolt-fill', 'icon-close-circle-fill', 'icon-info-circle-fill', 'icon-question-circle-fill', 'icon-notification-fill', 'icon-flag-fill', 'icon-wrench-fill', 'icon-search', 'icon-bulb-fill', 'icon-location-fill', 'icon-eye-fill', 'icon-car-fill', 'icon-audio', 'icon-audio-fill', 'icon-audiostatic', 'icon-signal-fill']
const iconEditData = ['icon-edit', 'icon-edit-square', 'icon-file-add', 'icon-file-excel', 'icon-file-exclamation', 'icon-file-pdf', 'icon-file-image', 'icon-file-markdown', 'icon-file-unknown', 'icon-file-ppt', 'icon-file-word', 'icon-file', 'icon-file-zip', 'icon-file-text', 'icon-file-copy', 'icon-snippets', 'icon-diff', 'icon-Batchfolding', 'icon-font-colors', 'icon-font-size', 'icon-line-height', 'icon-colum-height', 'icon-strikethrough', 'icon-underline', 'icon-number', 'icon-italic', 'icon-code', 'icon-column-width', 'icon-ellipsis', 'icon-dash', 'icon-drag', 'icon-translate', 'icon-zoomout', 'icon-zoomin']
const iconDataData = ['icon-areachart', 'icon-linechart', 'icon-barchart', 'icon-pointmap  ', 'icon-fund', 'icon-fund-fill', 'icon-piechart', 'icon-piechart-circle-fil', 'icon-Function', 'icon-Field-String', 'icon-Field-number', 'icon-Field-Binary', 'icon-radarchart', 'icon-heatmap', 'icon-fall', 'icon-rise', 'icon-stock', 'icon-Partition', 'icon-index', 'icon-Report', 'icon-View', 'icon-shortcut', 'icon-ungroup', 'icon-sliders', 'icon-sliders-fill', 'icon-boxplot-fill', 'icon-golden-fill', 'icon-build-fill', 'icon-file-GIF', 'icon-formatpainter', 'icon-formatpainter-fill', 'icon-dashboard', 'icon-desktop', 'icon-file-excel-fill', 'icon-dashboard-fill', 'icon-project-fill', 'icon-detail-fill', 'icon-file-exclamation-fil', 'icon-file-add-fill', 'icon-file-fill', 'icon-file-markdown-fill', 'icon-file-text-fill', 'icon-file-ppt-fill', 'icon-file-unknown-fill', 'icon-file-word-fill', 'icon-file-zip-fill', 'icon-file-pdf-fill', 'icon-file-image-fill', 'icon-diff-fill', 'icon-file-copy-fill', 'icon-snippets-fill', 'icon-batchfolding-fill', 'icon-reconciliation-fill', 'icon-folder-add-fill',   'icon-folder-fill', 'icon-folder-open-fill', 'icon-database-fill', 'icon-container-fill', 'icon-sever-fill', 'icon-delete-fill', 'icon-USB-fill']
const iconWebData = ['icon-CI', 'icon-Dollar', 'icon-compass', 'icon-frown', 'icon-EURO', 'icon-copyright', 'icon-meh', 'icon-Pound', 'icon-smile', 'icon-trademark', 'icon-earth', 'icon-YUAN', 'icon-sync', 'icon-transaction', 'icon-undo', 'icon-redo', 'icon-reload', 'icon-reloadtime', 'icon-message', 'icon-poweroff', 'icon-setting', 'icon-eye', 'icon-location', 'icon-export', 'icon-save', 'icon-Import', 'icon-appstore', 'icon-layout', 'icon-play-square', 'icon-control', 'icon-codelibrary', 'icon-detail', 'icon-project', 'icon-wallet', 'icon-calculator', 'icon-interation', 'icon-border', 'icon-border-outer', 'icon-radius-setting', 'icon-adduser', 'icon-deleteteam', 'icon-deleteuser', 'icon-addteam', 'icon-user', 'icon-team', 'icon-pointmap', 'icon-container', 'icon-database', 'icon-sever', 'icon-mobile', 'icon-tablet', 'icon-redenvelope', 'icon-book', 'icon-filedone', 'icon-reconciliation', 'icon-file-exception', 'icon-filesync', 'icon-filesearch', 'icon-solution', 'icon-fileprotect', 'icon-audit', 'icon-securityscan', 'icon-propertysafety', 'icon-safetycertificate', 'icon-insurance', 'icon-alert', 'icon-delete', 'icon-hourglass', 'icon-bulb', 'icon-experiment', 'icon-bell', 'icon-trophy', 'icon-rest', 'icon-USB', 'icon-skin', 'icon-home', 'icon-bank', 'icon-filter', 'icon-funnelplot', 'icon-like', 'icon-unlike', 'icon-unlock', 'icon-lock', 'icon-customerservice', 'icon-flag', 'icon-moneycollect', 'icon-medicinebox', 'icon-shop', 'icon-rocket', 'icon-shopping', 'icon-folder', 'icon-folder-open', 'icon-folder-add', 'icon-deploymentunit', 'icon-accountbook', 'icon-contacts', 'icon-carryout', 'icon-calendar-check', 'icon-calendar', 'icon-scan', 'icon-select', 'icon-boxplot', 'icon-build', 'icon-laptop', 'icon-barcode', 'icon-camera', 'icon-cluster', 'icon-gateway', 'icon-car', 'icon-printer', 'icon-read', 'icon-cloud-server', 'icon-cloud-upload', 'icon-cloud', 'icon-cloud-download', 'icon-cloud-sync', 'icon-video', 'icon-qrcode', 'icon-image', 'icon-mail', 'icon-table', 'icon-idcard', 'icon-creditcard', 'icon-heart', 'icon-block', 'icon-star', 'icon-gold', 'icon-wifi', 'icon-attachment', 'icon-key', 'icon-api', 'icon-disconnect', 'icon-highlight', 'icon-monitor', 'icon-link', 'icon-man', 'icon-percentage', 'icon-pushpin', 'icon-phone', 'icon-shake', 'icon-tag', 'icon-wrench', 'icon-tags', 'icon-scissor', 'icon-mr', 'icon-share', 'icon-branches', 'icon-fork', 'icon-upload', 'icon-vertical-align-botto', 'icon-vertical-align-middl', 'icon-totop', 'icon-vertical-align-top', 'icon-download', 'icon-sort-descending', 'icon-sort-ascending', 'icon-menu', 'icon-unorderedlist', 'icon-orderedlist', 'icon-align-right', 'icon-align-center', 'icon-align-left', 'icon-bold', 'icon-line', 'icon-small-dash', 'icon-bg-colors', 'icon-crown', 'icon-gift', 'icon-check-circle-fill', 'icon-EURO-circle-fill', 'icon-frown-fill', 'icon-copyright-circle-fil', 'icon-CI-circle-fill', 'icon-Dollar-circle-fill', 'icon-meh-fill', 'icon-Pound-circle-fill', 'icon-smile-fill', 'icon-trademark-circle-fil', 'icon-YUAN-circle-fill', 'icon-heart-fill', 'icon-message-fill', 'icon-check-square-fill', 'icon-minus-square-fill', 'icon-codelibrary-fill', 'icon-play-square-fill', 'icon-plus-square-fill', 'icon-accountbook-fill', 'icon-carryout-fill', 'icon-calendar-fill', 'icon-calculator-fill', 'icon-interation-fill', 'icon-save-fill', 'icon-wallet-fill', 'icon-control-fill', 'icon-layout-fill', 'icon-appstore-fill', 'icon-mobile-fill', 'icon-tablet-fill', 'icon-book-fill', 'icon-redenvelope-fill', 'icon-safetycertificate-f', 'icon-propertysafety-fill', 'icon-insurance-fill', 'icon-securityscan-fill', 'icon-calendar-check-fill', 'icon-image-fill', 'icon-idcard-fill', 'icon-creditcard-fill', 'icon-read-fill', 'icon-contacts-fill', 'icon-moneycollect-fill', 'icon-medicinebox-fill', 'icon-rest-fill', 'icon-shopping-fill', 'icon-skin-fill', 'icon-video-fill', 'icon-bell-fill', 'icon-filter-fill', 'icon-funnelplot-fill', 'icon-gift-fill', 'icon-hourglass-fill', 'icon-home-fill', 'icon-trophy-fill', 'icon-cloud-fill', 'icon-customerservice-fill', 'icon-experiment-fill', 'icon-like-fill', 'icon-lock-fill', 'icon-unlike-fill', 'icon-star-fill', 'icon-unlock-fill', 'icon-alert-fill', 'icon-api-fill', 'icon-highlight-fill', 'icon-phone-fill', 'icon-edit-fill', 'icon-pushpin-fill', 'icon-rocket-fill', 'icon-tag-fill', 'icon-tags-fill', 'icon-bank-fill', 'icon-camera-fill', 'icon-crown-fill', 'icon-mail-fill', 'icon-printer-fill', 'icon-shop-fill', 'icon-setting-fill', 'icon-apartment', 'icon-robot', 'icon-robot-fill', 'icon-bug-fill', 'icon-bug', 'icon-comment', 'icon-verified', 'icon-videocameraadd', 'icon-switchuser', 'icon-whatsapp', 'icon-appstoreadd', 'icon-woman', 'icon-eyeclose-fill', 'icon-eye-close', 'icon-clear', 'icon-collapse', 'icon-expand', 'icon-deletecolumn', 'icon-merge-cells', 'icon-subnode', 'icon-rotate-left', 'icon-rotate-right', 'icon-table1', 'icon-solit-cells', 'icon-deleterow', 'icon-sisternode', 'icon-Field-time', 'icon-GIF', 'icon-Storedprocedure', 'icon-Console-SQL', 'icon-aim', 'icon-compress', 'icon-expend', 'icon-folder-view', 'icon-group', 'icon-send']
const iconSignData = ['icon-android', 'icon-android-fill', 'icon-apple', 'icon-apple-fill', 'icon-windows', 'icon-windows-fill', 'icon-IE',  'icon-IE-square-fill', 'icon-chrome', 'icon-chrome-fill', 'icon-github-fill', 'icon-aliwangwang', 'icon-aliwangwang-fill', 'icon-dingtalk', 'icon-dingtalk-square-fill', 'icon-dingtalk-circle-fill', 'icon-weibo', 'icon-weibo-circle-fill', 'icon-QQ', 'icon-QQ-circle-fill', 'icon-QQ-square-fill', 'icon-wechat-fill', 'icon-alibaba', 'icon-taobao', 'icon-taobao-circle-fill', 'icon-taobao-square-fill', 'icon-alipay', 'icon-alipay-circle-fill', 'icon-alipay-square-fill', 'icon-alibabacloud', 'icon-zhihu', 'icon-zhihu-circle-fill', 'icon-zhihu-square-fill', 'icon-HTML', 'icon-HTML-fill', 'icon-antdesign',  'icon-yahoo', 'icon-yahoo-fill', 'icon-facebook', 'icon-facebook-fill', 'icon-skype', 'icon-skype-fill', 'icon-ant-cloud', 'icon-googleplus', 'icon-googleplus-circle-f', 'icon-googleplus-square-f', 'icon-codepen', 'icon-codepen-square-fill', 'icon-CodeSandbox', 'icon-CodeSandbox-square-f', 'icon-sketch', 'icon-sketch-circle-fill', 'icon-sketch-square-fill', 'icon-Gitlab', 'icon-Gitlab-fill', 'icon-dribbble', 'icon-dribbble-circle-fill', 'icon-instagram', 'icon-instagram-fill', 'icon-reddit', 'icon-reddit-circle-fill', 'icon-behance', 'icon-behance-circle-fill', 'icon-behance-square-fill', 'icon-medium', 'icon-medium-circle-fill', 'icon-medium-square-fill', 'icon-yuque', 'icon-yuque-fill', 'icon-twitter', 'icon-twitter-circle-fill', 'icon-twitter-square-fill', 'icon-Youtube', 'icon-Youtube-fill', 'icon-dropbox', 'icon-dropbox-circle-fill', 'icon-dropbox-square-fill', 'icon-amazon', 'icon-amazon-circle-fill', 'icon-amazon-square-fill', 'icon-linkedin', 'icon-linkedin-fill', 'icon-slack', 'icon-slack-circle-fill', 'icon-slack-square-fill', 'icon-shortcut', 'icon-shortcut-fill', 'icon-codepen-circle-fill', 'icon-google', 'icon-CodeSandbox-circle-f', 'icon-IE-circle-fill', 'icon-google-circle-fill', 'icon-google-square-fill', 'icon-reddit-square-fill', 'icon-weibo-square-fill']

const TableList: React.FC<{}> = () => {

  const [addMenuForm] = Form.useForm();
  const [updateMenuForm] = Form.useForm();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [addButtonForm] = Form.useForm();
  const [updateButtonForm] = Form.useForm();
  const [buttonInfo, setButtonInfo] = useState<object>();
  const [createModalButtonVisible, handleModalButtonVisible] = useState<boolean>(false);
  const [updateModalButtonVisible, handleUpdateModalButtonVisible] = useState<boolean>(false);

  const [iconVisible, setIconVisible] = useState<boolean>(false);
  const [iconValue, setIconValue] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const [iconButtonPathArr, setIconButtonPathArr] = useState<object>([]);
  const [iconButtonInsArr, setIconButtonInsArr] = useState<object>([]);
  const [iconButtonEditArr, setIconButtonEditArr] = useState<object>([]);
  const [iconButtonDataArr, setIconButtonDataArr] = useState<object>([]);
  const [iconButtonWebArr, setIconButtonWebArr] = useState<object>([]);
  const [iconButtonSignArr, setIconButtonSignArr] = useState<object>([]);


  const { TabPane } = Tabs;
  const { confirm } = Modal;
  const [sorter, setSorter] = useState<string>('');

  //新增菜单
  const [expandedKeys, setExpandedKeys] = useState();
  const [menuTreeData, setMenuTreeData] = useState<[]>();
  const [allTreeKeys, setAllTreeKeys] = useState<[]>();
  const [checkedKeys, setCheckedKeys] = useState<[]>([]);


  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      hideInSearch: true,
      hideInTable: true,
      renderText: (text, row, index) => index + 1,
    },
    {
      title: '名称',
      align: 'center',
      dataIndex: 'text',
      hideInSearch: true,
      fixed: 'left',
      width: 200,
    },
    {
      title: '图标',
      align: 'center',
      dataIndex: 'icon',
      hideInSearch: true,
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'type',
      hideInSearch: true,
      valueEnum: {
        0: { text: '菜单', status: 'Default' },
        1: { text: '按钮', status: 'Processing' },
      },
    },
    {
      title: '地址',
      align: 'center',
      dataIndex: 'path',
      hideInSearch: true,
    },
    {
      title: '权限',
      align: 'center',
      dataIndex: 'permission',
      hideInSearch: true,
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'order',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '修改时间',
      align: 'center',
      dataIndex: 'modifyTime',
      valueType: 'dateRange',
      hideInSearch: true,
    },
    {
      title: '菜单名称',
      align: 'center',
      dataIndex: 'menuName',
      hideInForm: true,
      hideInTable: true,
      formItemProps: {
        allowClear: true,
        autoComplete: "off",
      },
    },
    // {
    //   title: '时间区间',
    //   align: 'center',
    //   dataIndex: 'createTime',
    //   valueType: 'dateRange',
    //   hideInForm: true,
    //   hideInTable: true,
    // },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <>
          <Space>
            {hasAuthority(buttons.manager.menu.index.update) && (
              <a
                onClick={(e) => {
                  record.menuId = record.id;
                  onGetCommonMenu();
                  if (record.parentId !== '0') {
                    setCheckedKeys([record.parentId]);
                    setExpandedKeys([record.parentId]);
                  }
                  if (record.type === '0') {
                    updateMenuForm.setFieldsValue(record);
                    updateMenuForm.setFieldsValue({ menuName: record.text });
                    updateMenuForm.setFieldsValue({ perms: record.permission });
                    updateMenuForm.setFieldsValue({ orderNum: record.order });
                    setInputValue(record.icon);
                    handleUpdateModalVisible(true);
                  } else {
                    setButtonInfo(record);
                    updateButtonForm.setFieldsValue(record);
                    updateButtonForm.setFieldsValue({ menuName: record.text });
                    updateButtonForm.setFieldsValue({ perms: record.permission });
                    updateButtonForm.setFieldsValue({ orderNum: record.order });
                    handleUpdateModalButtonVisible(true);
                  }
                }}
              >
                修改
              </a>
            )}
            {hasAuthority(buttons.manager.menu.index.delete) && (
              <a onClick={deleteOnClick.bind(_, record)}>删除</a>
            )}
          </Space>
        </>
      ),
    },
  ];

  /**
   * 删除 按钮点击事件
   */
  const deleteOnClick = (record: { id: any; }) => {
    confirm({
      title: '确定删除所选中的记录?',
      icon: <ExclamationCircleOutlined />,
      content: '当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！',
      onOk: deleteModelOnOk.bind(globalThis, record.id)
    })
  };

  /**
   * 删除 model框ok按钮事件
   * @param menuId
   */
  const deleteModelOnOk = (menuId: { key: number[]; }) => {
    deleteMenu(menuId).then((res) => {
      message.success('删除成功');
      actionRef.current.reload();
    })
  }

  function onExpand(expandedKeys, info) {
    setExpandedKeys(expandedKeys)
  }

  function onCheck(checkedKeys, info) {
    setCheckedKeys(checkedKeys)
  }

  function resetInfoForm() {
    setCheckedKeys([])
    setExpandedKeys([])
    setMenuTreeData([])
    setAllTreeKeys([])
  }

  /**
   * 创建菜单和按钮
   */
  const createMenu = () => {
    onGetCommonMenu()
    addMenuForm.resetFields()
    handleModalVisible(true)
  };
  /**
   * 创建按钮
   */
  const createButton = () => {
    onGetCommonMenu()
    addButtonForm.resetFields()
    handleModalButtonVisible(true)
  };


  function onGetCommonMenu() {
    getCommonMenu({ type: '0' }).then((r) => {
      setMenuTreeData(r.data.rows.children)
      setAllTreeKeys(r.data.ids)
    })
  }

  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1329669_t1u72b9zk8s.js',
  });

  /**
   * 菜单图标弹出框
   */
  const selectIcon = () => {
    setIconVisible(true);
  };

  /**
   * 选择图标
   */
  function chooseIcon(key?: any) {
    message.success('已选择:' + key.currentTarget.id);
    setIconValue(key.currentTarget.id);
  }

  /**
   * 确认选择的图标
   */
  const showIconModal = () => {
    setInputValue(iconValue);

    setIconVisible(false);
  };
  /**
   * 取消选择的图标
   */
  const onRefreshCancel = () => {
    setIconVisible(false);
  };

  /**
   * 加载图标
   */
  useEffect(() => {
    let buttonPathArr = []
    let buttonInsArr = []
    let buttonEditArr = []
    let buttonDataArr = []
    let buttonWebArr = []
    let buttonSignArr = []
    for (let i = 0; i < iconPathData.length; i++) {
      buttonPathArr.push(
        <Button key={iconPathData[i]} id={iconPathData[i]} onClick={(id) => chooseIcon(id)}>
          <IconFont type={iconPathData[i]} />
        </Button>
      )
    }
    for (let i = 0; i < iconInsData.length; i++) {
      buttonInsArr.push(
        <Button key={iconInsData[i]} id={iconInsData[i]} onClick={(id) => chooseIcon(id)}>
          <IconFont type={iconInsData[i]} />
        </Button>
      )
    }
    for (let i = 0; i < iconEditData.length; i++) {
      buttonEditArr.push(
        <Button key={iconEditData[i]} id={iconEditData[i]} onClick={(id) => chooseIcon(id)}>
          <IconFont type={iconEditData[i]} />
        </Button>
      )
    }
    for (let i = 0; i < iconDataData.length; i++) {
      buttonDataArr.push(
        <Button key={iconDataData[i]} id={iconDataData[i]} onClick={(id) => chooseIcon(id)}>
          <IconFont type={iconDataData[i]} />
        </Button>
      )
    }
    for (let i = 0; i < iconWebData.length; i++) {
      buttonWebArr.push(
        <Button key={iconWebData[i]} id={iconWebData[i]} onClick={(id) => chooseIcon(id)}>
          <IconFont type={iconWebData[i]} />
        </Button>
      )
    }
    for (let i = 0; i < iconSignData.length; i++) {
      buttonSignArr.push(
        <Button key={iconSignData[i]} id={iconSignData[i]} onClick={(id) => chooseIcon(id)}>
          <IconFont type={iconSignData[i]} />
        </Button>
      )
    }
    setIconButtonPathArr(buttonPathArr)
    setIconButtonInsArr(buttonInsArr)
    setIconButtonEditArr(buttonEditArr)
    setIconButtonDataArr(buttonDataArr)
    setIconButtonWebArr(buttonWebArr)
    setIconButtonSignArr(buttonSignArr)
  }, []);

  const optionButtons = hasAuthority(buttons.manager.menu.index.add) ? [
    {
      buttonRender: () =>
        <Popconfirm
          placement="leftTop" title="请选择创建类型"
          okText="按钮"
          cancelText="菜单"
          onCancel={() => createMenu()}
          onConfirm={() => createButton()}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
          <Button type="primary">新增</Button>
        </Popconfirm>
    }
  ] : []
  return (
    <>
      <ProTable<TableListItem>
        bordered
        options={false}
        toolBarRender={false}
        search={{
          optionRender: (searchConfig, props) =>
            <SearchFormOption searchConfig={searchConfig}
              {...props}
              optionButtons={optionButtons} />
        }}
        actionRef={actionRef}
        scroll={{ x: 1300 }}
        dateFormatter="string"
        // rowKey={(record, index) => record.path + record.permission}
        rowKey="id"
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
          // console.log(params, 'beforeSearchSubmit');
          // if (Array.isArray(params.createTime)) {
          //   params.createTimeFrom = moment(params.createTime[0]).startOf('day');
          //   params.createTimeTo = moment(params.createTime[1]).endOf('day');
          //   params.createTime = null
          // }
          return params;
        }}
        bordered
        request={(params) =>
          queryMenu(params).then((res) => {
            return { data: res.data.rows.children, success: true };
          })
        }
        columns={columns}
        rowSelection={false}
      />

      {/*-----------------------图标---------------------------------------------------------*/}

      <Modal width={777} style={{ zIndex: 111111 }}
        visible={iconVisible}
        okText="确认"
        cancelText="取消"
        onCancel={onRefreshCancel}
        onOk={showIconModal}
      >
        <Tabs>
          <TabPane tab="方向性图标" key="1">
            {iconButtonPathArr}
          </TabPane>
          <TabPane tab="指示性图标" key="2">
            {iconButtonInsArr}
          </TabPane>
          <TabPane tab="编辑类图标" key="3">
            {iconButtonEditArr}
          </TabPane>
          <TabPane tab="数据类图标" key="4">
            {iconButtonDataArr}
          </TabPane>
          <TabPane tab="网站通用图标" key="5">
            {iconButtonWebArr}
          </TabPane>
          <TabPane tab="品牌和标识" key="6">
            {iconButtonSignArr}
          </TabPane>
        </Tabs>
      </Modal>

      {/*-----------------------菜单---------------------------------------------------------*/}

      <Drawer style={{ zIndex: 888 }}
        title="新增菜单"
        width="40%"
        onClose={() => {
          handleModalVisible(false)
          resetInfoForm()
        }}
        visible={createModalVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                addMenuForm.resetFields()
                handleModalVisible(false)
                resetInfoForm()
              }}
              style={{ marginRight: 8 }}
            >
              取消
                  </Button>
            <Button onClick={() => {
              //新增数据
              addMenuForm.validateFields()
                .then(values => {
                  let checkArr = Object.is(checkedKeys.checked, undefined) ? checkedKeys : checkedKeys.checked;
                  if (checkArr.length > 1) {
                    message.error('最多只能选择一个上级菜单，请修改')
                    return
                  }
                  values.type = '0';
                  values.icon = inputValue;
                  values.parentId = checkArr[0] ? checkArr[0] : ''
                  addMenu(values).then((res) => {
                    message.success('新增菜单成功')
                    actionRef.current.reload()
                    handleModalVisible(false)
                    addMenuForm.resetFields();
                    resetInfoForm()
                  });

                });
            }} type="primary">
              提交
                  </Button>
          </div>
        }
      >
        <Form form={addMenuForm} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
          <Form.Item name='type' noStyle> </Form.Item>
          <Form.Item
            name="menuName"
            label="菜单名称"
            rules={[{ required: true, message: '菜单名称不能为空' },
            { max: 10, message: '长度不能超过10个字符' }]}
          >
            <Input placeholder="请输入菜单名称" autoComplete="off"/>
          </Form.Item>
          <Form.Item
            name="path"
            label="菜单URL"
            rules={[{ required: true, message: '菜单URL不能为空' },
            { max: 50, message: '长度不能超过50个字符' }]}
          >
            <Input placeholder="请输入菜单URL" autoComplete="off"/>
          </Form.Item>
          <Form.Item
            name="perms"
            label="相关权限"
            rules={[{ max: 50, message: '长度不能超过50个字符' }]}
          >
            <Input placeholder="请输入相关权限" autoComplete="off"/>
          </Form.Item>

          <Form.Item
            label="菜单图标"
          >
            <Input value={inputValue} addonAfter={<SettingOutlined onClick={() => selectIcon()} />}
              placeholder="点击右侧按钮选择图标" />
          </Form.Item>

          <Form.Item
            name="orderNum"
            label="菜单排序"
          >
            <InputNumber min={1} max={500} defaultValue={1} />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="上级菜单"
          >
            <Tree
              checkable={true}
              treeData={menuTreeData}
              expandedKeys={expandedKeys}
              onExpand={onExpand}
              checkStrictly={true}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
            ></Tree>
          </Form.Item>

        </Form>
      </Drawer>


      <Drawer style={{ zIndex: 999 }}
        title="修改菜单"
        width="40%"
        onClose={() => {
          resetInfoForm()
          handleUpdateModalVisible(false)
          updateMenuForm.resetFields();
        }}
        visible={updateModalVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                resetInfoForm()
                handleUpdateModalVisible(false)
                updateMenuForm.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              取消
                  </Button>
            <Button onClick={() => {
              //更新
              updateMenuForm.validateFields()
                .then(values => {
                  let checkArr = Object.is(checkedKeys.checked, undefined) ? checkedKeys : checkedKeys.checked;
                  if (checkArr.length > 1) {
                    message.error('最多只能选择一个上级菜单，请修改')
                    return
                  }
                  values.icon = inputValue;
                  values.type = '0';
                  values.parentId = checkArr[0] ? checkArr[0] : ''
                  updateMenu(values).then(() => {
                    message.success('修改菜单成功')
                    actionRef.current.reload()
                    handleUpdateModalVisible(false)
                    updateMenuForm.resetFields();
                    resetInfoForm()
                  });
                });
            }} type="primary">
              修改
                  </Button>
          </div>
        }
      >
        <Form form={updateMenuForm} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
          <Form.Item name='menuId' noStyle> </Form.Item>
          <Form.Item name='type' noStyle> </Form.Item>
          <Form.Item
            name="menuName"
            label="菜单名称"
            rules={[{ required: true, message: '菜单名称不能为空' },
            { max: 10, message: '长度不能超过10个字符' }]}
          >
            <Input placeholder="请输入菜单名称" autoComplete="off"/>
          </Form.Item>
          <Form.Item
            name="path"
            label="菜单URL"
            rules={[{ required: true, message: '菜单URL不能为空' },
            { max: 50, message: '长度不能超过50个字符' }]}
          >
            <Input placeholder="请输入菜单URL" autoComplete="off"/>
          </Form.Item>
          <Form.Item
            name="perms"
            label="相关权限"
            rules={[{ max: 50, message: '长度不能超过50个字符' }]}
          >
            <Input placeholder="请输入相关权限" autoComplete="off"/>
          </Form.Item>

          <Form.Item label="菜单图标">
            <Input value={inputValue} addonAfter={<SettingOutlined onClick={() => selectIcon()} />}
              placeholder="点击右侧按钮选择图标" />
          </Form.Item>

          <Form.Item
            name="orderNum"
            label="菜单排序"
          >
            <InputNumber min={1} max={500} defaultValue={1} />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="上级菜单"
          >
            <Tree
              checkable={true}
              treeData={menuTreeData}
              expandedKeys={expandedKeys}
              onExpand={onExpand}
              checkStrictly={true}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
            ></Tree>
          </Form.Item>


        </Form>
      </Drawer>


      {/*-----------------------按钮---------------------------------------------------------*/}


      <Drawer
        title="新增按钮"
        width="40%"
        onClose={() => {
          handleModalButtonVisible(false)
          resetInfoForm()
        }}
        visible={createModalButtonVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            {/*<Dropdown overlay={menu}>*/}
            {/*  <a>*/}
            {/*    树操作 <DownOutlined/>*/}
            {/*  </a>*/}
            {/*</Dropdown>*/}
            <Button
              onClick={() => {
                addButtonForm.resetFields()
                handleModalButtonVisible(false)
                resetInfoForm()
              }}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button onClick={() => {
              //新增数据
              addButtonForm.validateFields()
                .then(values => {
                  let checkArr = Object.is(checkedKeys.checked, undefined) ? checkedKeys : checkedKeys.checked;
                  if (checkArr.length > 1) {
                    message.error('最多只能选择一个上级菜单，请修改')
                    return
                  }
                  values.type = '1';
                  values.parentId = checkArr[0] ? checkArr[0] : ''
                  addMenu(values).then((res) => {
                    message.success('新增按钮成功')
                    addButtonForm.resetFields();
                    actionRef.current.reload()
                    handleModalVisible(false)
                    handleModalButtonVisible(false)
                    resetInfoForm()
                  });

                });
            }} type="primary">
              提交
            </Button>
          </div>
        }
      >
        <Form form={addButtonForm} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
          <Form.Item name='type' noStyle> </Form.Item>
          <Form.Item
            name="menuName"
            label="按钮名称"
            rules={[{ required: true, message: '按钮名称不能为空' },
            { max: 10, message: '长度不能超过10个字符' }]}
          >
            <Input placeholder="请输入按钮名称" />
          </Form.Item>
          <Form.Item
            name="perms"
            label="相关权限"
            rules={[{ max: 50, message: '长度不能超过50个字符' }]}
          >
            <Input placeholder="请输入相关权限" />
          </Form.Item>


          <Form.Item
            name="parentId"
            label="上级菜单"
          >
            <Tree
              checkable={true}
              treeData={menuTreeData}
              expandedKeys={expandedKeys}
              onExpand={onExpand}
              checkStrictly={true}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
            ></Tree>
          </Form.Item>


        </Form>
      </Drawer>


      <Drawer
        title="修改按钮"
        width="40%"
        onClose={() => {
          resetInfoForm()
          handleUpdateModalButtonVisible(false)
          updateButtonForm.resetFields();
        }}
        visible={updateModalButtonVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                resetInfoForm()
                handleUpdateModalButtonVisible(false)
                updateButtonForm.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button onClick={() => {
              //更新
              updateButtonForm.validateFields()
                .then(values => {
                  let checkArr = Object.is(checkedKeys.checked, undefined) ? checkedKeys : checkedKeys.checked;
                  if (checkArr.length > 1) {
                    message.error('最多只能选择一个上级菜单，请修改')
                    return
                  }
                  values.type = '1';
                  values.parentId = checkArr[0] ? checkArr[0] : ''
                  updateMenu(values).then(() => {
                    message.success('修改按钮成功')
                    updateButtonForm.resetFields();
                    handleUpdateModalButtonVisible(false)
                    resetInfoForm()
                    actionRef.current.reload()

                  });

                });
            }} type="primary">
              修改
            </Button>
          </div>
        }
      >
        <Form form={updateButtonForm} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
          <Form.Item name='menuId' noStyle> </Form.Item>
          <Form.Item name='type' noStyle> </Form.Item>
          <Form.Item
            name="menuName"
            label="按钮名称"
            rules={[{ required: true, message: '按钮名称不能为空' },
            { max: 10, message: '长度不能超过10个字符' }]}
          >
            <Input placeholder="请输入按钮名称" />
          </Form.Item>
          <Form.Item
            name="perms"
            label="相关权限"
            rules={[{ max: 50, message: '长度不能超过50个字符' }]}
          >
            <Input placeholder="请输入相关权限" />
          </Form.Item>


          <Form.Item
            name="parentId"
            label="上级菜单"
          >
            <Tree
              checkable={true}
              treeData={menuTreeData}
              expandedKeys={expandedKeys}
              onExpand={onExpand}
              checkStrictly={true}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
            ></Tree>
          </Form.Item>


        </Form>
      </Drawer>


    </>
  );
};

export default TableList;
