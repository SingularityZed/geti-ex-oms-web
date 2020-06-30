export const mockUserMenus = [
  {
    path: '/iotManager',
    name: 'IOT管理',
    icon: 'icon-question-circle',
    order: 1
  },
  {
    path: '/finance',
    name: '财务管理',
    icon: 'icon-question-circle',
    order: 2
  },
  {
    path: '/finance/package',
    name: '套餐收入',
    icon: 'icon-question-circle',
    order: 4
  },
  {
    path: '/finance/deposit',
    name: '押金流水',
    icon: 'icon-question-circle',
    order: 3
  },
  {
    path: '/finance/withdraw',
    name: '提现记录',
    icon: 'icon-question-circle',
  },
  {
    path: '/finance/substitute',
    name: '代缴提现记录',
    icon: 'icon-question-circle',
  },
  {
    path: '/iotManager/cabinetManage',
    name: '电柜管理',
    icon: 'icon-question-circle',
    component: './iotManager/cabinetManage',
  },
  {
    path: '/iotManager/batteryManage',
    name: '电池管理',
    icon: 'icon-question-circle',
    component: './iotManager/batteryManage',
  },
]
