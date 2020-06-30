import React  from 'react';

import { Tabs } from 'antd';
import BatteryAdd from "@/pages/equipment/add/components/battery";
import CabinetAdd from "@/pages/equipment/add/components/cabinet";
import 'antd/dist/antd.css';

const { TabPane } = Tabs;


const  deviceAdd = () =>{
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="电池" key="1">
          <BatteryAdd></BatteryAdd>
        </TabPane>
        <TabPane tab="电柜" key="2">
          <CabinetAdd></CabinetAdd>
        </TabPane>
      </Tabs>
    </>
  );
}


export default deviceAdd;
