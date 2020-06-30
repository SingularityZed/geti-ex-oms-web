import React, { useEffect, useRef, useState } from 'react';
import { Tabs, Card } from 'antd';
import StaffRelation from './components/staffrelation';
import CabinetRelation from './components/cabinetrelation';

const Index: React.FC<{}> = () => {
  const { TabPane } = Tabs;

  useEffect(() => {}, []);
  function callback(key) {
    console.log(key);
  }

  return (
    <Card>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="员工关系" key="1">
          <StaffRelation/>
        </TabPane>
        <TabPane tab="电柜关系" key="2">
          <CabinetRelation/>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Index;
