import React  from 'react';

import { Tabs } from 'antd';
import BatteryFault from "@/pages/devOps/faultHistory/components/battery";
import CabinetFault from "@/pages/devOps/faultHistory/components/cabinet";
const { TabPane } = Tabs;


const  FaultHistory = () =>{
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="电池" key="1">
          <BatteryFault></BatteryFault>
        </TabPane>
        <TabPane tab="电柜" key="2">
          <CabinetFault></CabinetFault>
        </TabPane>
      </Tabs>
    </>
  );
}


export default FaultHistory;
