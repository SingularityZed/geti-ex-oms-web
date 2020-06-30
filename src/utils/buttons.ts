import {getUserInfo} from "@/utils/authority";

export function hasAuthority(button) {
  let str = getUserInfo();
  let userInfo = str == '' ? {} : JSON.parse(getUserInfo());
  let list = userInfo.permissions;
  return list && list.includes(button);
}

export const buttons = {
  merchant: {
    merchant: {
      index: {
        add: 'merchant:merchant:index:add',
        detail: 'merchant:merchant:index:detail',
        edit: 'merchant:merchant:index:edit',
        delete: 'merchant:merchant:index:delete',
        assign: 'merchant:merchant:index:assign',
      },
      detail: {
        disable: 'merchant:merchant:detail:disable',
        enable: 'merchant:merchant:detail:enable',
      },
      assign: {
        addBattery: 'merchant:merchant:assign:addBattery',
        addCabinet: 'merchant:merchant:assign:addCabinet',
      },

    },
    substitute: {
      index: {
        subDeposit: 'merchant:substitute:index:subDeposit',
        subPackage: 'merchant:substitute:index:subPackage',
        withdraw: 'merchant:substitute:index:withdraw',
      },
    },
    serviceOutlet: {
      index: {
        add: 'merchant:serviceOutlet:index:add',
        edit: 'merchant:serviceOutlet:index:edit',
      }
    },
    deposit: {
      index: {
        forbid: 'merchant:deposit:index:forbid',
        add: 'merchant:deposit:index:add',
      }
    },
    package: {
      index: {
        add: 'merchant:package:index:add',
        enable: 'merchant:package:index:enable',
        disable: 'merchant:package:index:disable',
        setDefault: 'merchant:package:index:setDefault',
        setDiscount: 'merchant:package:index:setDiscount',
      }
    },
    equipConfig: {
      index: {
        add: 'merchant:equipConfig:index:add',
        edit: 'merchant:equipConfig:index:edit',
        delete: 'merchant:equipConfig:index:delete',
      }
    },
    merchantRole: {
      index: {
        detail: 'merchant:merchantRole:index:detail',
        add: 'merchant:merchantRole:index:add',
        edit: 'merchant:merchantRole:index:edit',
        delete: 'merchant:merchantRole:index:delete'
      }
    },
    group: {
      index: {
        search: 'merchant:group:index:search',
        detail: 'merchant:group:index:detail',
        delete: 'merchant:group:index:delete',
        add: 'merchant:group:index:add',
      },
      detail: {
        remove: 'merchant:group:detail:remove',
      }
    },
    orgUser: {
      index: {
        add: 'merchant:orgUser:index:add',
        delete: 'merchant:orgUser:index:delete',
        reset: 'merchant:orgUser:index:reset',
        edit: 'merchant:orgUser:index:edit',
        detail: 'merchant:orgUser:index:detail',
      }
    },
    cabinetbind: {
      index:{
        bind:'merchant:cabinetbind:index:bind',
        unbind:'merchant:cabinetbind:index:unbind'
      }
    },
  },
  consumers: {
    consumer: {
      index: {
        exportExcel: 'consumers:consumer:index:exportExcel',
        detail: 'consumers:consumer:index:detail',
        refund: 'consumers:consumer:index:refund',
        joinGroup: 'consumers:consumer:index:joinGroup',
        exchangeOrder: 'consumers:consumer:index:exchangeOrder',
      },
      detail: {
        directional: 'consumers:consumer:detail:directional',
        normal: 'consumers:consumer:detail:normal',
        refreshToken: 'consumers:consumer:detail:refreshToken',
        enable: 'consumers:consumer:detail:enable',
        disable: 'consumers:consumer:detail:disable',
        payOrder: 'consumers:consumer:detail:payOrder',
        unbindingBattery: 'consumers:consumer:detail:unbindingBattery',
      }
    },
    coupon: {},
    feedback: {
      index: {
        deal: 'consumers:feedback:index:deal'
      }
    },
    refund: {
      index: {
        detail: 'consumers:refund:index:detail',
        pass: 'consumers:refund:index:pass',
        cancel: 'consumers:refund:index:cancel',
      },
      detail: {
        wxRefundConfirm: 'consumers:refund:detail:wxRefundConfirm'
      }
    },
    rightTransfer: {
      index: {
        rightTransfer: 'consumers:rightTransfer:index:rightTransfer'
      }
    },
    smsLog: {}
  },
  equipment: {
    add: {
      battery: {
        addBatch: 'equipment:add:battery:addBatch',
      },
      cabinet: {
        addBatch: 'equipment:add:cabinet:addBatch',
      },
    },
    battery: {
      index: {
        detail:'merchant:battery:index:look',
        enable: 'merchant:battery:index:enable',
        disable: 'merchant:battery:index:disable',
        exchangeOrder: 'merchant:battery:index:exchangeOrder',
        code: 'merchant:battery:index:code',
        point: 'merchant:battery:index:point',
        reGet: 'merchant:battery:index:reGet',
        disableDischarge: 'merchant:battery:index:disableDischarge',
        enableDischarge: 'merchant:battery:index:enableDischarge',
        operatorStatusNormal: 'merchant:battery:index:operatorStatusNormal',
        operatorStatusLost: 'merchant:battery:index:operatorStatusLost',
        operatorStatusRepair: 'merchant:battery:index:operatorStatusRepair',
      }
    },
    cabinet: {
      index: {
        enable: 'merchant:cabinet:index:enable',
        disable: 'merchant:cabinet:index:disable',
        edit: 'merchant:cabinet:index:edit',
        inRepair: 'merchant:cabinet:index:inRepair',
        outRepair: 'merchant:cabinet:index:outRepair',
        export: 'merchant:cabinet:index:export',
        detail: 'merchant:cabinet:index:look',
        exchangePage: 'merchant:cabinet:index:exchangeOrder',
        point: 'merchant:cabinet:index:point',
        reFresh: 'merchant:cabinet:index:reFresh',
        open: 'merchant:cabinet:index:open',
        gridEnable: 'merchant:cabinet:index:gridEnable',
        gridDisable: 'merchant:cabinet:index:gridDisable',
      }
    }
  },
  order: {
    exchange: {
      index: {
        detail: 'order:exchange:index:detail',
        resolve: 'order:exchange:index:resolve',
        export: 'order:exchange:index:export',
      }
    },
    depositOrder: {
      index: {
        export: 'order:depositOrder:index:export',
      }
    },
    payOrder: {
      index: {
        export: 'order:payOrder:index:export',
      }
    },

  },
  manager: {
    sysUser: {
      index: {
        look: 'manager:sysUser:index:look',
        search: 'manager:sysUser:index:search',
        add: 'manager:sysUser:index:add',
        update: 'manager:sysUser:index:update',
        delete: 'manager:sysUser:index:delete',
        resetPassword: 'manager:sysUser:index:resetPassword',
        orgAuth: 'manager:sysUser:index:orgAuth',
        orgAuthSelect: 'manager:sysUser:index:orgAuthSelect',
      }
    },
    role: {
      index: {
        look: 'manager:role:index:look',
        search: 'manager:role:index:search',
        add: 'manager:role:index:add',
        update: 'manager:role:index:update',
        delete: 'manager:role:index:delete',
      }
    },
    menu: {
      index: {
        look: 'manager:menu:index:look',
        search: 'manager:menu:index:search',
        add: 'manager:menu:index:add',
        update: 'manager:menu:index:update',
        delete: 'manager:menu:index:delete',
      }
    },
    systemLog: {
      index: {
        search: 'manager:systemLog:index:search',
      }
    },
    consumerLog: {
      index: {
        search: 'manager:consumerLog:index:search',
      }
    },
    enumCache: {
      index: {
        refresh: 'manager:enumCache:index:refresh',
        search: 'manager:enumCache:index:search',
        add: 'manager:enumCache:index:add',
        update: 'manager:enumCache:index:update',
        addDetail: 'manager:enumCache:index:addDetail',
        updateDetail: 'manager:enumCache:index:updateDetail',
      }
    },
  },
  finance: {
    package: {
      index: {
        export: 'finance:package:index:export',
      }
    },
    deposit: {
      index: {
        export: 'finance:deposit:index:export',
      }
    },
    substitute: {
      index: {
        agree: 'finance:substitute:index:agree',
        refuse: 'finance:substitute:index:refuse',
      }
    }
  },
  iotManager: {
    cabinetManage: {
      index: {
        detail: 'iotManager:cabinetManage:index:detail',
        uplogs: 'iotManager:cabinetManage:index:uplogs',
      }
    },
    batteryManage: {
      index: {
        detail: 'iotManager:batteryManage:index:detail',
        soc: 'iotManager:batteryManage:index:soc',
        code: 'iotManager:batteryManage:index:code'
      }
    },
    importDevice: {
      index: {
        submite: 'iotManager:importDevice:index:submite'
      }
    },
    packageUpdate: {
      index: {
        addversion: 'iotManager:packageUpdate:index:addversion'
      }
    },
    equipmentUpdate: {
      index: {
        update: 'iotManager:equipmentUpdate:index:update'
      }
    }
  },
  channel: {
    channelList: {
      index: {
        add:'channel:channelList:index:add',
        edit:'channel:channelList:index:edit',
        user:'channel:channelList:index:user',
        search: 'channel:channelList:index:search',
        profit:'channel:channelList:index:profit',
        withdraw	:'channel:channelList:index:withdraw',
      }
    },
    examineList: {
      index: {
        apply: 'channel:examineList:index:apply',
        refuse: 'channel:examineList:index:apply'
      }
    }
  },
  cabinetRep: {
    cabinetRepDay: {
      index: {
        export: 'cabinetRep:cabinetRepDay:index:export',
      }
    },
    cabinetRepMonth: {
      index: {
        export: 'cabinetRep:cabinetRepMonth:index:export',
      }
    }
  }
}
