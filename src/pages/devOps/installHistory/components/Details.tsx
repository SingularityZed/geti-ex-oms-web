import { Card, Descriptions} from 'antd';
import React, { FC } from 'react';
import { TableListItem } from '../data';
import DetailSiderBar from '@/components/DetailSiderBar';

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<TableListItem> | undefined;
  data:  object | undefined
  onCancel: () => void;
  handleReturn: () => void;
}

const Details: FC<OperationModalProps> = (props) => {
  const {data,handleReturn} = props;
    return (
      <div>
        <DetailSiderBar handleReturn={handleReturn}/>
        <Card title="基本信息">
          {data&&<Descriptions column={2}>
            <Descriptions.Item label="换电柜编码">{data.deviceCode}</Descriptions.Item>
            <Descriptions.Item label="所属运营商">{data.merchantName}</Descriptions.Item>
            <Descriptions.Item label="批次">{data.batchNo}</Descriptions.Item>
            <Descriptions.Item label="运维人员">{data.operator}</Descriptions.Item>
            <Descriptions.Item label="地址">{data.address}</Descriptions.Item>
            <Descriptions.Item label="安装时间">{data.installTime}</Descriptions.Item>
            <Descriptions.Item label="营业时间">{data.workOnTime}-{data.workOffTime}</Descriptions.Item>
            <Descriptions.Item label="安装备注">{data.installRemark}</Descriptions.Item>
            <Descriptions.Item label="安装图片" >
              <img width="200" height="200" src={data.imgUrl}/>
            </Descriptions.Item>


          </Descriptions>}
        </Card>
      </div>
    );
};

export default Details;
