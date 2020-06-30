import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, DatePicker, message } from 'antd';
import MapLoader from '@/utils/map.js';
import battery from '@/static/battery.jpg';
import moment from 'moment';
import { batteryMap, batteryRoad } from '@/services/device';

const { RangePicker } = DatePicker;

const TableList: React.FC<{}> = () => {
  const [form] = Form.useForm();
  const [newArray, setnewArray] = useState<any>([]);
  const [point, setpoint] = useState<any>([]);
  const [formLayout] = useState('inline');
  const [map, setmap] = useState<any>();
  const drive = (Array: any[]) => {
    MapLoader().then((AMap) => {
      const map = new AMap.Map('container', {
        resizeEnable: true,
        center: [105, 34],
        zoom: 4,
      });
      setmap(map);
      let graspRoad;
      if (!graspRoad) {
        map.plugin('AMap.GraspRoad', function () {
          graspRoad = new AMap.GraspRoad();
        });
      }
      Array.map((item) => {
        // 高德API一次只能描述500点，循环遍历描述所有点
        graspRoad.driving(item, function (error, result) {
          if (!error) {
            const path2 = [];
            const newPath = result.data.points;
            for (let i = 0; i < newPath.length; i += 1) {
              path2.push([newPath[i].x, newPath[i].y]);
            }
            const newLine = new AMap.Polyline({
              path: path2,
              strokeWeight: 8,
              strokeOpacity: 0.8,
              strokeColor: '#0091ea',
              showDir: true,
            });
            map.add(newLine);
            map.setFitView(newLine);
          }
        });
      });
    });
  };
  const group = (array, subGroupLength) => {
    let index = 0;
    const Array = [];
    while (index < array.length) {
      Array.push(array.slice(index, (index += subGroupLength)));
    }
    setnewArray(Array);
    drive(Array);
  };
  const searchfatch = (value) => {
    const params = {
      batteryCode: value.code,
      startTime: new Date(value.time[0]).getTime(),
      endTime: new Date(value.time[1]).getTime(),
    };
    batteryRoad(params).then((res) => {
      let arr: any[] = [];
      let newArr: any[] = [];
      res.data.data.map((item, index) => {
        arr = [...arr, [item.longitude, item.latitude]];
        if (index === 0) {
          newArr = [
            ...newArr,
            {
              x: Number(item.longitude),
              y: Number(item.latitude),
              sp: 0,
              ag: 0,
              tm: parseInt(new Date(item.time).getTime() / 1000),
            },
          ];
        } else {
          newArr = [
            ...newArr,
            {
              x: Number(item.longitude),
              y: Number(item.latitude),
              sp: 0,
              ag: 0,
              tm: parseInt(
                (new Date(item.time).getTime() - new Date(res.data.data[0].time).getTime()) / 1000,
              ),
            },
          ];
        }
      });
      group(newArr, 500);
    });
  };
  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : null;

  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: { span: 14, offset: 4 },
        }
      : null;
  const onFinish = (values) => {
    values.timerange = ['', ''];
    if (values.time) {
      values.timerange[0] = moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
      values.timerange[1] = moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    if (values.code !== undefined && values.time === undefined) {
      setnewArray([]);
      let flag = false;
      for (let i = 0; i < point.length; i += 1) {
        if (values.code === point[i]['deviceCode']) {
          let searchpos = point[i]['lnglat'];
          flag = true;
          const marker = new AMap.Marker({
            icon: battery,
            position: searchpos,
            offset: new AMap.Pixel(-13, -30),
          });
          map.setZoom(25);
          map.setCenter(searchpos);
          marker.setMap(map);
        }
      }
      if (flag === false) {
        message.error('请输入正确电池编号');
        return false;
      }
    } else if (values.code === undefined && values.time === undefined) {
      message.error('请输入正确信息');
    } else {
      searchfatch(values);
    }
  };
  useEffect(() => {
    batteryMap().then((res) => {
      const { data } = res.data;
      const points = [];
      for (let i = 0; i < data.length; i += 1) {
        points[i] = {};
        points[i]['deviceCode'] = data[i]['deviceCode'];
        points[i]['lnglat'] = [Number(data[i]['longitude']), Number(data[i]['latitude'])];
      }
      setpoint(points);
    });
  }, []);
  useEffect(() => {
    MapLoader().then((AMap) => {
      let cluster: { setMap: (arg0: null) => void };
      let markers: any[] = [];
      let points: string | any[] = [];
      points = point;
      const map = new AMap.Map('container', {
        resizeEnable: true,
        center: [105, 34],
        zoom: 4,
      });
      setmap(map);
      for (let i = 0; i < points.length; i += 1) {
        markers.push(
          new AMap.Marker({
            position: points[i]['lnglat'],
            content:
              '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
            offset: new AMap.Pixel(-15, -15),
          }),
        );
      }
      const count = markers.length;
      addCluster();
      function addCluster() {
        if (cluster) {
          cluster.setMap(null);
        }
        const sts = [
          {
            url: battery,
            size: new AMap.Size(42, 39),
            offset: new AMap.Pixel(-16, -16),
            textSize: 20,
            textColor: '#d118e6',
            // textColor: '#ADD258',
          },
        ];
        AMap.plugin(['AMap.MarkerClusterer'], () => {
          cluster = new AMap.MarkerClusterer(map, markers, {
            gridSize: 80,
            styles: sts,
          });
        });
      }
    });
  }, [point]);
  return (
    <>
      <Card>
        <Form
          onFinish={onFinish}
          {...formItemLayout}
          layout="inline"
          form={form}
          initialValues={{ layout: formLayout }}
        >
          <Form.Item label="电池编号" name="code" >
            <Input placeholder="请输入电池编号" allowClear autoComplete="off"/>
          </Form.Item>
          <Form.Item label="时间区间" name="time">
            <RangePicker showTime />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <div style={{ width: '100%', height: '1000px', position: 'relative' }}>
          <div id="container" style={{ width: '100%', height: '100%' }} />
        </div>
      </Card>
    </>
  );
};

export default TableList;
