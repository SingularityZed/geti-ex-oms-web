import {Tag} from "antd";
import React from "react";

export const enums = {
  // ------------------------------------consumer-service--------------------------------------------------------------------
  // 枚举 用户状态:1-启用(enable)|2-禁用(disable)
  UserStatusEnum: [
    {text: '启用', value: 1},
    {text: '禁用', value: 2}
  ],
  // 是否实名认证
  IdCardValidEnum: [
    {text: '否', value: 0},
    {text: '是', value: 1}
  ],
  // 枚举 用户类别:1-普通用户(normal)|2-集团用户(group)
  UserTypeEnum: [
    {text: '普通用户', value: 1},
    {text: '集团用户', value: 2},
    {text: '定向用户', value: 3}
  ],
  //枚举 用户押金类别：1-微信小程序充值（wxmini）|2-商户代缴（merchant）|3-p06老用户（p06_user）
  ConsumerDepositModelEnum: [
    {text: '微信小程序充值', value: 1},
    {text: '商户代缴', value: 2},
    {text: 'p06老用户', value: 3}
  ],
  //枚举 实名认证结果
   RealNameCodeEnum: [
     {text: '实名认证不通过', value: '02'},
     {text: '无法认证', value: '202'},
     {text: '异常情况', value: '203'},
     {text: '姓名格式不正确', value: '204'},
     {text: '身份证格式不正确', value: '205'},
   ],

  //枚举 实名认证状态
  RealNameSuccessEnum: [
    {text: '失败', value: '0'},
    {text: '成功', value: '1'}
  ],

  BindType:[
    {text:'运维',value:1},
    {text:'销售',value:2}
  ],

  // ------------------------------------pay-service------------------------------------------------------------------------
  // 枚举 是否可叠加使用
  CouponSuperposeEnableEnum: [
    {text: '否', value: true},
    {text: '是', value: false}
  ],
  // 枚举 优惠券用途: 1-抵扣券(deduction)|2-折扣券(discount)
  CouponUsageEnum: [
    {text: '抵扣券', value: 1},
    {text: '折扣券', value: 2}
  ],
  // 枚举 优惠券状态: 1-初始化(init)|2-发放中(using)|3-停发(suspend)
  CouponStatusEnum: [
    {text: '启用', value: 1},
    {text: '停用', value: 2}
  ],
  // 枚举 发放方式:1-按用户注册日期(register_time)|2-指定目标用户(upload_user_file)
  CouponIssueMethodEnum: [
    {text: '按注册时间范围', value: 'RegisterTimeCouponIssueModel'},
    {text: '按用户', value: 'SimpleCouponIssueModel'}
  ],
  // 枚举 生效方式: 1-立即(immediately)|2-指定日期(appointDate)
  CouponEffectiveTypeEnum: [
    {text: '立即', value: 1}, {text: '指定日期', value: 2}
  ],
  // 枚举 优惠券使用状态: 1-未使用(not_use)|2-冻结(frozen)|3-已使用(used)
  CouponUseStatusEnum: [
    {text: '未使用', value: 1}, {text: '冻结', value: 2}, {text: '已使用', value: 3}
  ],
  // 枚举 优惠券发放状态:1-未执行(wait)|2-执行中(running)|3-执行成功(success)|4-执行失败(fail)|5-已取消(cancel)
  IssueStatusEnum: [
    {text: '未发放', value: 1}, {text: '正在发放', value: 2}, {text: '已发放', value: 3}, {text: '发放失败', value: 4}, {
      text: '已取消',
      value: 5
    }
  ],
  // 枚举 交易类型: 1-付款(pay)|2-提现(withdrawal)
  TradeTypeEnum: [
    {text: '付款', value: 1}, {text: '提现', value: 2}
  ],
  // 枚举 支付方式: 1-支付宝(alipay)|2-微信小程序(webchat)|3-余额(balance)
  PayTypeEnum: [
    {text: '支付宝', value: 1},
    {text: '微信小程序付款', value: 2},
    {text: '微信退款', value: 3},
    {text: '微信企业付款', value: 4},
    {text: '微信PC付款', value: 5}
  ],
  // 枚举 是否退款  1-是|2-否
  HasRefund: [
    {text: '是', value: 1},
    {text: '否', value: 0}
  ],
  // 枚举 业务类型: 1-购买套餐(buyPackage)|2-支付押金(payDeposit)|3-押金提现(depositWithdrawal)|4-充值(invest)|5-购买会员(buyMember)|6-余额提现(balanceWithdrawal)
  TransBizTypeEnum: [
    {text: '购买套餐', value: 1},
    {text: '支付押金', value: 2},
    {text: '押金提现', value: 3},
    {text: '充值', value: 4},
    {text: '购买会员', value: 5},
    {text: '余额提现', value: 6}
  ],
  // 枚举 业务标识：normal-正常换电|urgent-紧急换电
  bizField: [
    {text: '正常换电', value: 'normal'},
    {text: '紧急换电', value: 'urgent'},
    {text: '换电失败', value: 'fail'},
  ],
  // 枚举 套餐类型
  PackageTypeEnum: [
    {text: '时长', value: 1},
    {text: '次数', value: 2},
    {text: '体验', value: 3},
  ],
  // 枚举 套餐状态
  PackageStatusEnum: [
    {text: '启用', value: 1},
    {text: '停用', value: 2}
  ],
  // 枚举 是否默认套餐
  defaultPackageEnum: [
    {text: '是', value: 1},
    {text: '否', value: 2}
  ],
  // 枚举 押金状态
  DepositStatusEnum: [
    {text: '启用', value: 1},
    {text: '停用', value: 2}
  ],
  // 枚举 电池规格
  BatterySpecificationEnum: [
    {text: '60V-20AH', value: 'A001'},
    {text: '48V-20AH', value: 'A003'}
  ],
  // 枚举 支付状态: 1-待确认(wait)|2-支付成功(success)|3-支付失败(fail)
  OrderStatusEnum: [
    {text: '待确认', value: 1}, {text: '支付成功', value: 2}, {text: '支付失败', value: 3}
  ],
  //  枚举 业务类型
  OrderTypeAllEnum: [
    {text: '缴纳押金', value: 1}, {text: '补缴押金', value: 2},
    {text: '购买套餐', value: 3}, {text: '体验套餐', value: 4},
    {text: '退还押金', value: 5}, {text: '退还套餐', value: 6}
  ],
  // 枚举 业务类型: 1-缴纳押金(deposit)|2-补缴押金(deposit_append)|3-购买套餐(buy_package)|4-体验套餐(experience_package)
  OrderTypeEnum: [
    {text: '缴纳押金', value: 1}, {text: '补缴押金', value: 2}, {text: '退还押金', value: 5}, {text: '退还套餐', value: 6}
  ],
  // 枚举 业务类型: 1-缴纳押金(deposit)|2-补缴押金(deposit_append)|3-购买套餐(buy_package)|4-体验套餐(experience_package)
  OrderPackageTypeEnum: [
    {text: '购买套餐', value: 3}, {text: '体验套餐', value: 4}, {text: '退还套餐', value: 6}
  ],
  // 枚举 业务类型: 1-缴纳押金(deposit)|2-补缴押金(deposit_append)|3-购买套餐(buy_package)|4-体验套餐(experience_package)
  SubOrderTypeEnum: [
    {text: '代缴押金', value: 1}, {text: '代缴套餐', value: 3}
  ],
  // 枚举 套餐类型 1-通用(normal)|2-群组(group)
  packageAttributesEnum: [
    {text: '通用', value: 1}, {text: '群组', value: 2}
  ],
  RefundReason:[
    {text:'更换其他工作',value:1},
    {text:'去其他城市发展',value:2},
    {text:'换电站点较少',value:3},
    {text:'选择其他换电品牌',value:4},
    {text:'其他原因',value:5},
  ],
  // ------------------------------------运维------------------------------------------------------------------------
  // 枚举 维修状态: 1-已修复(repaired)|2-维修中(repairing)
  MaintainRepairStatusEnum: [
    {text: '已修复', value: 1},
    {text: '维修中', value: 2}
  ],
  // 枚举 调度类型: 1-出库(out)|2-入库(in)|3-调度(dispatch)
  MaintainDispatchTypeEnum: [
    {text: '出库', value: 1},
    {text: '入库', value: 2},
    {text: '调度', value: 3}
  ],
  // 枚举 调度状态: 1-调度中(doing)|2-完成(complete)
  MaintainDispatchStatusEnum: [
    {text: '调度中', value: 1},
    {text: '完成', value: 2}
  ],
  // 枚举 功能描述: 1-设备安装(install)|2-运维取电(maintainerTake)|3-设备调度(dispatch)|4-用户换电(exchange)|5-运维还电(maintainerBack)
  MaintainDispatchFuncDescEnum: [
    {text: '设备安装', value: 1},
    {text: '运维取电', value: 2},
    {text: '设备调度', value: 3},
    {text: '用户换电', value: 4},
    {text: '运维还电', value: 5}
  ],
  // 枚举 资产类别: 1-换电柜(cabinet)|2-电池(battery)
  MaintainDispatchAssetsTypeEnum: [
    {text: '换电柜', value: 1},
    {text: '电池', value: 2}
  ],
  // 枚举 资产类别: 1-换电柜(cabinet)|2-电池(battery)---与MaintainDispatchAssetsTypeEnum重复
  // DeviceType: [
  //   { text: '电池', value: 1 },
  //   { text: '电柜', value: 2 }
  // ],
  // 枚举 设备与电池运行状态 枚举 电池运行状态:1-充电中(charging)|2-空载(no_load)|3-充满(lost)
  ChargeStatusEnum: [
    {text: '充电中', value: 1},
    {text: '空载', value: 2},
    {text: '充满', value: 3},
  ],
  // EquipmentOperatingStatusEnum: [
  //   {text: '未激活', value: 0},
  //   {text: '已借出', value: 1},
  //   {text: '充电中', value: 2},
  //   {text: '可换', value: 3},
  //   {text: '搁置', value: 4},
  //   {text: '调度中', value: 5},
  //   {text: '维修', value: 6},
  //   {text: '丢失', value: 7},
  //   {text: '报废', value: 8},
  //   {text: '故障', value: 9},
  //   {text: '订单异常', value: 10}
  // ],

  //  枚举 设备电柜运行状态
  CabinetOperatingStatusEnum: [
    {text: '启用', value: 1},
    {text: '禁用', value: 2},
    {text: '-', value: null}
  ],
  // 枚举 设备故障状态
  IsFaultEnum: [
    {text: '否', value: false},
    {text: '是', value: true},
    {text: '-', value: null}
  ],
  // 枚举 设备是否在线状态
  IsOnlineEnum: [
    {text: '在线', value: 1},
    {text: '离线', value: 0},
  ],

  FaultType: [
    {text: '柜体故障', value: 1},
    {text: '充电器故障', value: 2},
    {text: '隔口故障', value: 3}
  ],


  // --------------------------------运营商-----------------------------
  // 枚举 启用状态: 1-启用(enable)|2-禁用(disable)|3-草稿(draft)
  StatusEnum: [
    {text: '启用', value: 1},
    {text: '禁用', value: 2},
    {text: '草稿', value: 3}
  ],
  // 枚举 分佣模式: 1-比例(proportion)|2-定额(quota)|3-混合(mix)
  ModeEnum: [
    {text: '比例', value: 1},
    {text: '定额', value: 2}
  ],
  // 枚举 结算描述: 1-商户提现(withdraw)|2-平台费(platform_fee)|3-费率(fee_rate)|4-订单(order)|5-套餐(package)
  BillDescriptionEnum: [
    {text: '商户提现', value: 1},
    {text: '平台费', value: 2},
    {text: '费率', value: 3},
    {text: '订单', value: 4},
    {text: '套餐', value: 5}
  ],
  // 枚举 结算类型: 1-支出(pay)|2-收入(income)
  BillTypeEnum: [
    {text: '支出', value: 1},
    {text: '收入', value: 2}
  ],
  // 枚举 网点功能: 1-车辆改装(modify)|2-车辆租借(bike_borrow)|3-电池租借(battery_borrow)
  ServiceItemEnum: [
    {text: '车辆改装', value: 1},
    {text: '车辆租借', value: 2},
    {text: '电池租借', value: 3}
  ],
  // 枚举 电费支付方: 1-GETI(geti)|2-运营商(organization)
  ElectricityFeePayerEnum: [
    {text: 'GETI', value: 1},
    {text: '运营商', value: 2}
  ],
  // 枚举 支付渠道: 1-支付宝(alipay)|2-微信(wechat)|3-银行卡(bank_card)
  PaymentChannelEnum: [
    {text: '支付宝', value: 1},
    {text: '微信', value: 2},
    {text: '银行卡', value: 3}
  ],
  // 枚举 结算周期: 1-月结(month)|2-季度结(quarter)
  BillCycleEnum: [
    {text: '月结', value: 1},
    {text: '季度结', value: 2}
  ],
  // 枚举 是否产权所有人: 0-不是(false)|1-是(true)
  IsOwner: [
    {text: '不是', value: false},
    {text: '是', value: true}

  ],
  // 枚举 场景类型:1-在电柜中(in_cabinet)|2-在仓库(in_repo)|3- 借出(用户)(in_consumer)|4-调度中(dispatch)| 5-全场景(in_all)
  SCENES_TYPE_ENUM: [
    {text: '换电柜', value: 1},
    {text: '仓库', value: 2},
    {text: '用户', value: 3},
    {text: '调度中', value: 4},
    {text: '全场景', value: 5},
    {text: '-', value: null},
    {text: '-', value: ''}
  ],
  // 枚举 退款结果:1-退款中(refunding)|2-成功(success)|3-部分成功(part_success)|4-退款失败(fail)|5-已申请(applied)
  RefundResult: [
    {text: '退款中', value: 1},
    {text: '成功', value: 2},
    {text: '部分成功', value: 3},
    {text: '退款失败', value: 4},
    {text: '已申请', value: 5},
    {text: '已取消', value: 6}
  ],
  // 枚举 退款类型:1-押金退款(deposit)
  RefundType: [
    {text: '押金退款', value: 1},
    {text: '商户平台主动退款', value: 2}
  ],
  // 枚举 退款方式:1-商户付款(merchant_pay)|2-付款订单原路退还(pay_order_refund)
  RefundWay: [
    {text: '商户付款', value: 1},
    {text: '付款订单原路退还', value: 2},
    {text: '-', value: null}

  ],
  // 枚举 是否允许登录运维小程序: 0-不是(false)|1-是(true)
  IsApplets: [
    {text: '否', value: false},
    {text: '是', value: true}
  ],

  // --------------------------------order-service-----------------------------
  // 枚举 订单状态: 1-初始(init)|2-成功(success)|3-失败(fail)
  ExchangeOrderStatusEnum: [
    {text: '初始', value: 1, color: 'green'},
    {text: '成功', value: 2, color: 'blue'},
    {text: '订单关闭', value: 3, color: 'red'},
    {text: '订单异常', value: 4, color: 'cyan'}
  ],
  // 枚举 电池包状态 0搁置(Shelving) |  1放电(Discharge)|  2充电(Charging)
  BatteryStatus: [
    {text: '搁置', value: 0},
    {text: '放电', value: 1},
    {text: '充电', value: 2},
  ],
  // 允许换电:1-是(true)|2-否(false)
  BatteryExchangeEnableEnum: [
    {text: '启用', value: 1},
    {text: '禁用', value: 2},
  ],
  // 枚举 归属实体类型:1-电柜(in_cabinet)|2-搁置(in_repo)|3-租借(in_consumer)
  OwnerTypeEnum: [
    {text: '电柜', value: 1},
    {text: '搁置', value: 2},
    {text: '租借', value: 3},
  ],
  //      * 消费者绑定电池 1;
  //      * 消费者解绑电池2;
  //      * 消费者归还电池 3;
  //      * 消费者借出电池4;
  //      * 运维放电池入柜5;
  //      * 运维取电池出柜 6;
  //      * 运维换电消费者归还 7;
  //      * 运维换电消费者借出8;
  OwnerChangeReasonEnum: [
    {text: '消费者绑定电池', value: 1},
    {text: '消费者解绑电池', value: 2},
    {text: '消费者归还电池', value: 3},
    {text: '消费者借出电池', value: 4},
    {text: '运维放电池入柜', value: 5},
    {text: '运维取电池出柜', value: 6},
    {text: '运维换电消费者归还', value: 7},
    {text: '运维换电消费者借出', value: 8},
  ],

  // 枚举 运维状态:1-正常(normal)|2-丢失(lost)|3-报废(scrapped)|4-维修(repair)
  BatteryOperationStatusEnum: [
    {text: '正常', value: 1},
    {text: '丢失', value: 2},
    {text: '报废', value: 3},
    {text: '维修', value: 4}
  ],
  // 枚举 允许骑行:1-是(true)|2-否(false)
  BatteryDischargeEnableEnum: [
    {text: '是', value: 1},
    {text: '否', value: 2},
  ],
  // 枚举 充电状态:1-充电中(charging)|2-空载(no_load)|3-充满(full)
  BatteryChargeStatusEnum: [
    {text: '-', value: null},
    {text: '充电中', value: 1},
    {text: '空载', value: 2},
    {text: '充满', value: 3},
  ],
  // 放电状态:1-放电(discharging)|2-未放电(not_discharging)
  BatteryDischargeStatusEnum: [
    {text: '-', value: null},
    {text: '放电', value: 1},
    {text: '未放电', value: 2},
  ],
  // 枚举 电池是否在线
  BatteryStatusIsOnline: [
    {text: '离线', value: 0},
    {text: '在线', value: 1},
  ],
  // 枚举 产品类型:1-P06产品(p06)|3-其他(other)
  ProductType: [
    {text: 'P06产品', value: 1},
    {text: 'P10产品', value: 3}
  ],
  // 枚举 电柜是否在线
  CabinetStatusIsOnline: [
    {text: '离线', value: 0},
    {text: '在线', value: 1},
  ],
  // 枚举 电柜运行状态
  OperatingStatusIsOnline: [
    {text: '启用', value: 1},
    {text: '禁用', value: 2},
  ],
  // 枚举 电柜配置状态:1-正常(normal)|2-运维模式(ops)|3-维护中(maintain)|4-故障中(fault)
  ConfigurationStatusIsOnline: [
    {text: '正常', value: 1},
    {text: '运维模式', value: 2},
    {text: '维护中', value: 3},
    {text: '故障中', value: 4},
  ],
  // 枚举 电池充电状态:1-断开-|2-接合
  ChargeStatus: [
    {text: '断开', value: 1},
    {text: '接合', value: 2},
  ],
  // 枚举 功率
  CabinetTotalPowerEnums: [
    {text: '5000W', value: 5000},
    {text: '6000W', value: 6000},
    {text: '7000W', value: 7000},
  ],
  // 枚举 电池类型:1-三元铁锂(ternary_iron)|2-磷酸铁锂(phosphate)
  ModelProperty: [
    {text: '三元铁锂', value: 1},
    {text: '磷酸铁锂', value: 2}
  ],
  // 枚举 订单状态:初始状态：1 ， 未确认：2 ， 确认成功： 3， 确认失败：4
  TradeStatusEnums: [
    {text: '初始状态', value: 1},
    {text: '未确认', value: 2},
    {text: '确认成功', value: 3},
    {text: '确认失败', value: 4},
  ],
  // 枚举 升级包类型:0-P10电柜主控APP(cabinet_p10_apk)|1-P10电柜安全固件(cabinet_p10_secure_pkg)|2-P10电柜格口固件(cabinet_p10_grid_pkg)|3-P10电柜充电器固件(cabinet_p10_charger_pkg)|4-P10电池通讯固件(battery_p10_communication_pkg)|5-P10电池保护固件(battery_p10_protect_pkg)|6-P06电柜主控App(cabinet_p06_apk)|11-P06电池(battery_p06_pkg)
  upgradePackageType: [
    {text: 'P10电柜主控APP', value: 0},
    {text: 'P10电柜安全固件', value: 1},
    {text: 'P10电柜格口固件', value: 2},
    {text: 'P10电柜充电器固件', value: 3},
    {text: 'P10电池通讯固件', value: 4},
    {text: 'P10电池保护固件', value: 5},
    {text: 'P06电柜主控App', value: 6},
    {text: 'P06电池', value: 11}
  ],
  upgradeResultEnums:[
    {text:'成功',value:1},
    {text:'失败',value:0}
  ],
  topicEnums: [
    {text: 'P06CabinetUpRoomInfo', value: 'P06CabinetUpRoomInfo'},
    {text: 'P06CabinetUpChargeDeviceInfo', value: 'P06CabinetUpChargeDeviceInfo'},
    {text: 'P06CabinetUpBatteryInfo', value: 'P06CabinetUpBatteryInfo'},
    {text: 'P06CabinetUpReplaceUpdate', value: 'P06CabinetUpReplaceUpdate'},
    {text: 'P06CabinetUpBoxStatus', value: 'P06CabinetUpBoxStatus'},
    {text: 'P06CabinetUpBoxLogicInfo', value: 'P06CabinetUpBoxLogicInfo'},
    {text: 'P06BatteryUpBatteryStatus', value: 'P06BatteryUpBatteryStatus'},
    {text: 'P06BatteryUpBatteryUpdate', value: 'P06BatteryUpBatteryUpdate'},
  ],
  // 枚举 交易类型: 1-付款(pay)|2-提现(withdrawal)
  SendStatusEnums: [
    {text: '等待回执', value: 1}, {text: '发送失败', value: 2}, {text: '发送成功', value: 3}
  ],
  ExchangeType: [
    {text: '扫码换电', value: 1},
    {text: '短信换电', value: 2},
    {text: '运维换电', value: 3},
    {text: '定向用户换电', value: 4}
  ],
  ConsumerDepositStatusEnum: [
    {text: '未缴纳', value: 0},
    {text: '已缴纳', value: 1},
    {text: '冻结', value: 2}
  ],
  FeedBackDealStatusEnum: [
    {text: '未处理', value: 1},
    {text: '转发运维', value: 2},
    {text: '已答复', value: 3},
    {text: '已解决', value: 4}
  ],
  FeedBackTypeEnum: [
    {text: '换电环节', value: 1},
    {text: '用电环节', value: 2},
    {text: '问题和建议', value: 3},
  ],
  UserStatus: [
    {text: '锁定', value: '0'},
    {text: '有效', value: '1'},
  ],
  UserSex: [
    {text: '男', value: '0'},
    {text: '女', value: '1'},
    {text: '保密', value: '2'},
  ],
  // 用户群组属性
  ConsumerAttr: [
    {text: '通用', value: 1},
    {text: '群组', value: 2},
  ],
  // 骑手换绑手机方式
  ConsumerChangePhoneType: [
    {text: '短信验证码换绑', value: 0},
    {text: '身份证换绑', value: 1},
  ],

  // --------------------------------channel-service-----------------------------


  //渠道账户状态
  ChannelAccountStatus: [
    {text:'可提现',value: 1},
    {text:'禁止提现',value:2}
  ],

  //渠道状态
  ChannelEnableStatus: [
    {text:'启用',value: 1},
    {text:'停用',value:2}
  ],

  //分润状态  0-未分润(false)|1-已分润(true)|3-订单已退款(order_refund)
  ShareBenefitStatus: [
    {text:'待入账',value:0},
    {text:'已入账',value:1},
    {text:'已退款',value:2}
  ]
}

export function enumConverter(enums) {
  let obj = {}
  enums.forEach(item => {
    obj[item.value] = item.text
  })
  return obj
}

export function getEnumText(obj, value) {
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].value === value) {
      return obj[i].text
    }
  }
  return '未定义'
}
