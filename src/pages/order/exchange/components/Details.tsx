import {Card, Descriptions, message, Modal, Tag} from 'antd';
import React, {FC, useEffect, useState} from 'react';
import {enums, getEnumText} from "@/utils/enums";
import {exchangeOrderDetail, resolveExceptionBattery, exchangebatteryTrack} from "@/services/order.ts";
import DetailSiderBar from "@/components/DetailSiderBar";
import {ExclamationCircleOutlined} from "@ant-design/icons/lib";
import MapLoader from '@/utils/map.js';
import car from '@/static/car.png';
import {buttons, hasAuthority} from "@/utils/buttons";

interface OperationModalProps {
  data: object | undefined;
}

const Details: FC<OperationModalProps> = (props) => {
  const {exchangeOrderId, handleReturn} = props;
  const [data, setData] = useState({});
  const [point, setPoint] = useState({});
  const [lineArr, setlineArr] = useState([]);
  const [center, setcenter] = useState([121.062654, 30.607731]);
  const [originPath, setoriginPath] = useState([]);
  const [map, setmap] = useState();
  const [marker, setmarker] = useState();
  const [distance, setdistance] = useState(0.00)
  const [status,setStatus] = useState()


  const initMap = () => {
    MapLoader().then(
      AMap => {
        const map = new AMap.Map("maproad", {
          resizeEnable: true,
          center,
          zooms: [4, 18], // 设置地图级别范围
          zoom: 18
        });
        setmap()
        let icon = new AMap.Icon({
          size: new AMap.Size(70, 50), // 图标尺寸
          image: car, // Icon的图像
          // imageOffset: new AMap.Pixel(0, -60), // 图像相对展示区域的偏移量，适于雪碧图等
          imageSize: new AMap.Size(70, 50) // 根据所设置的大小拉伸或压缩图片
        });
        const marker = new AMap.Marker({
          // 创建标记
          map,
          position: center,
          icon,
          offset: new AMap.Pixel(-40, -25),
          autoRotation: true,
          angle: -90
        });
        setmarker(marker);
        let oilPath = originPath;
        new Promise((resolve, reject) => {
        });
        AMap.plugin("AMap.GraspRoad", function () {
          const grasp = new AMap.GraspRoad();
          grasp.driving(oilPath, function (error, result) {
            if (!error) {
              let path = [];
              result.data.points.map(item => {
                path = [...path, [item.x, item.y]];
              });
              setlineArr(path)// 纠偏后的轨迹
              let distance = result.data.distance; // 里程
              distance = distance / 1000;
              setdistance(distance)
              const polyline = new AMap.Polyline({
                map,
                path,
                showDir: true,
                strokeColor: "#0078FF", // 线颜色
                strokeOpacity: 0.8, // 线透明度
                strokeWeight: 6 // 线宽
                // strokeStyle: "solid"  //线样式
              });
              let passedPolyline = new AMap.Polyline({
                map,
                // path: lineArr,
                strokeColor: "#EF4C4C", // 线颜色
                // strokeOpacity: 1,     //线透明度
                strokeWeight: 6 // 线宽
                // strokeStyle: "solid"  //线样式
              });
              marker.on("moving", function (e) {
                passedPolyline.setPath(e.passedPath);
              });
              map.add(polyline);
              map.setFitView();
            }
          });
        });

        map.setFitView();
      },
      e => {
      }
    );
  }
  useEffect(() => {
    initMap()
  }, [center])
  useEffect(() => {
    exchangeOrderDetail(exchangeOrderId).then(res => {
      setData({...res.data.data})
    })
    exchangebatteryTrack(exchangeOrderId).then(res => {
      setPoint({...res.data.data})
      let arr = [];
      let newArr = [];
      // if(res.data.batteryGpsPointInfoList.length)
      res.data.data.batteryGpsPointInfoList.map((item, index) => {
        arr = [...arr, [item.longitude, item.latitude]];
        if (index == 0) {
          newArr = [
            ...newArr,
            {
              x: Number(item.longitude),
              y: Number(item.latitude),
              sp: 0,
              ag: 0,
              tm: parseInt(new Date((item.time)).getTime() / 1000)
            }
          ];
        } else {
          newArr = [
            ...newArr,
            {
              x: Number(item.longitude),
              y: Number(item.latitude),
              sp: Number(item.speed ? item.speed : 0),
              ag: 0,
              tm: parseInt((new Date(item.time).getTime() - new Date(res.data.data.batteryGpsPointInfoList[0].time).getTime()) / 1000)
            }
          ];
        }
      });
      setlineArr(arr);
      setoriginPath(newArr);
      if (arr.length > 0) {
        setcenter(arr[0]);
      }


    })
  }, [])

  function makerRun() {
    marker.moveAlong(lineArr, 2000);
  }

  function resolveExceptionBatteryHandle() {
    Modal.confirm({
      title: '确定解除订单异常',
      icon: <ExclamationCircleOutlined/>,
      okText: '确定',
      cancelText: '取消',
      content: '当您点击确定按钮后，将解除订单异常',
      onOk: confirmResolveException
    });
  }

  function confirmResolveException() {
    resolveExceptionBattery({
      exchangeOrderId: data.exchangeOrderId,
      returnBatteryCode: data.returnBatteryCode
    }).then((res) => {
      exchangeOrderDetail(exchangeOrderId).then(res => {
        setData({...res.data.data})
      })
      message.success(res.data.message);
    })
  }

  return (
    <div>
      <DetailSiderBar handleReturn={handleReturn}/>
      <Card title="订单信息" extra={
        <>
          {hasAuthority(buttons.order.exchange.index.resolve) && data.status == 4 &&
          <a onClick={resolveExceptionBatteryHandle}>解除异常</a>}
        </>
      }>
        {data && <Descriptions column={2}>
          <Descriptions.Item label="订单编号">{data.exchangeOrderId}</Descriptions.Item>
          <Descriptions.Item label="用户手机号">{data.mobileNo}</Descriptions.Item>
          <Descriptions.Item label="旧电池编号">{data.returnBatteryCode}</Descriptions.Item>
          <Descriptions.Item label="旧电池电量">{data.returnBatterySoc}</Descriptions.Item>
          <Descriptions.Item label="新电池编号">{data.borrowBatteryCode}</Descriptions.Item>
          <Descriptions.Item label="新电池电量">{data.borrowBatterySoc}</Descriptions.Item>
          <Descriptions.Item
            label="电池规格">{getEnumText(enums.BatterySpecificationEnum, data.batterySpecification)}</Descriptions.Item>
          <Descriptions.Item label="订单状态">{getEnumText(enums.ExchangeOrderStatusEnum,data.status)}</Descriptions.Item>
          <Descriptions.Item label="换电开始时间:">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="换电完成时间:">{data.completeTime}</Descriptions.Item>
          <Descriptions.Item label="换电类型">{getEnumText(enums.ExchangeType, data.exchangeType)}</Descriptions.Item>
        </Descriptions>}
      </Card>
      <Card title="换电柜信息" style={{marginTop: "30px"}}>
        {data && <Descriptions column={2}>
          <Descriptions.Item label="点位名称">{data.cabinetName}</Descriptions.Item>
          <Descriptions.Item label="换电柜编号">{data.cabinetDeviceCode}</Descriptions.Item>
          <Descriptions.Item label="格口编号(归还)">{data.returnGridId + 1}</Descriptions.Item>
          <Descriptions.Item label="格口编号(借出)">{data.borrowGridId + 1}</Descriptions.Item>
        </Descriptions>}
      </Card>
      <Card title={`行驶数据 ${distance} Km`}
            extra={<span style={{color: 'blue', cursor: 'pointer'}} onClick={makerRun}>开始运动</span>}
            style={{marginTop: "30px"}}>
        {data && <div style={{width: '100%', height: '500px', position: 'relative'}}>
          <div id="maproad" style={{width: '100%', height: '100%'}}/>
        </div>}
      </Card>
    </div>
  );
};

export default Details;
