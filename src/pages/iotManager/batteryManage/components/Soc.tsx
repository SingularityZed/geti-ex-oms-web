import { Card, Descriptions, DatePicker, Form, Button } from 'antd';
import React, { FC, useState, useEffect, useRef } from 'react';
import DetailSiderBar from '@/components/DetailSiderBar';
import ReactEchartsCore from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import moment, { min, now } from 'moment';
import { BatterySoc } from '@/services/device';
import { useCacheErrors } from 'antd/es/form/util';

interface OperationModalProps {
  data: object | undefined;
  fetchSoc: (params: any) => void | undefined;
  handleReturn: () => void;
}
const Soc: FC<OperationModalProps> = (props) => {
  const { deviceCode } = props.data;
  const [myChart, setmyChart] = useState<any>();
  const echartsReact = React.createRef();
  const battery = props.data;
  const { RangePicker } = DatePicker;
  const [startTime, setstartTime] = useState<string>(frontOneHour('yyyy-MM-dd hh:mm', 21600000) + ':00');
  const [endTime, setendTime] = useState<string>(frontOneHour('yyyy-MM-dd hh:mm', 0) + ':00');
  const [socdata, setsocdata] = useState<any>([]);
  const [timedata, settimedata] = useState<any>([]);
  const [range, setrange] = useState<number>(1200000);
  function dateToMs(date) {
    const result = new Date(date).getTime();
    return result;
  }
  function frontOneHour(fmt, num) {
    const currentTime = new Date(new Date().getTime() - num);
    const o = {
      'M+': currentTime.getMonth() + 1, // 月份
      'd+': currentTime.getDate(), // 日
      'h+': currentTime.getHours(), // 小时
      'm+': currentTime.getMinutes(), // 分
      's+': currentTime.getSeconds(), // 秒
      'q+': Math.floor((currentTime.getMonth() + 3) / 3), // 季度
      S: currentTime.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, `${currentTime.getFullYear()}`.substr(4 - RegExp.$1.length));
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
        );
    }
    return fmt;
  }
  const now = frontOneHour('yyyy-MM-dd hh:mm', 0);
  const before = frontOneHour('yyyy-MM-dd hh:mm', 21600000);
  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 14 },
    buttonCol: { span: 4 },
    textCol: { span: 4 },
  };
  useEffect(() => {
    // 绘制图表
    setmyChart(echarts.init(document.getElementById('main')));
  }, []);
  useEffect(() => {
    BatterySoc({ deviceCode }).then((res) => {
      const { data } = res.data;
      const soclist = [];
      const timelist = [];
      const datalist = []
      for (let item = 0; item < data.length; item += 1) {
        if (data[item].source === 'battery') {
          data[item].source = '电池'
        } else if (data[item].source === 'battery_udp') {
          data[item].source = '电池UDP上报'
        } else if (data[item].source === 'cabinet') {
          data[item].source = '电柜'
        } else {
          data[item].source = '未知'
        }
        if (data[item].cabinetDeviceCode == null) { datalist.push([(formatDateTime(new Date(data[item].time))), data[item].soc, data[item].source, (formatTime(new Date(data[item].time)))]) }
        else {
          datalist.push([(formatDateTime(new Date(data[item].time))), data[item].soc, data[item].source, (formatTime(new Date(data[item].time))), data[item].cabinetDeviceCode])
        }
      }
      setsocdata(soclist);
      settimedata(timelist);
      if (myChart) {
        myChart.setOption({
          title: { text: '电池电量变化曲线' },
          tooltip: {
            trigger: 'axis',
            position(pt: any[]) {
              return [pt[0], '10%'];
            },
            formatter(params) {
              const item = params[0];
              if (item.value[4]) {
                return `
                      时间：${item.value[3]}</br>
                      电量：${item.value[1]}</br>
                      来源：${item.value[2]}(${item.value[4]})
                     `;
              }

              return `
                      时间：${item.value[3]}</br>
                      电量：${item.value[1]}</br>
                      来源：${item.value[2]}
                     `;
            }
          },
          grid: {
            left: '4%',
            right: '4%',
            top: '10%',
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            min: before,
            max: now,
            interval: 1200000,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: '当前电量',
              type: 'line',
              smooth: false,
              symbol: 'circle',
              symbolSize: 6,
              data: datalist,
              lineStyle: {
                color: '#009FFF',
                width: 2
              },
              itemStyle: {
                normal: {
                  color: 'red'
                }
              }
            },
          ],
        });
      }
    });
  }, [myChart]);
  const formatDateTime = (date) => {
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    const h = date.getHours();
    let minute = date.getMinutes();
    minute = minute < 10 ? (`0${minute}`) : minute;
    return `${y}-${m}-${d} ${h}:${minute}`;
  };
  const formatTime = (date) => {
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    const h = date.getHours();
    let minute = date.getMinutes();
    minute = minute < 10 ? (`0${minute}`) : minute;
    let second = date.getSeconds();
    second = second < 10 ? (`0${second}`) : second;
    let millisecond = date.getMilliseconds();
    millisecond = millisecond < 10 ? (`0${millisecond}`) : millisecond;
    return `${y}-${m}-${d} ${h}:${minute}:${second}.${millisecond}`;
  };
  const search = () => {
    BatterySoc({ deviceCode, startTime, endTime }).then((res) => {
      const { data } = res.data;
      const soclist = [];
      const timelist = [];
      const datalist = []
      for (let item = 0; item < data.length; item += 1) {
        if (data[item].source === 'battery') {
          data[item].source = '电池'
        } else if (data[item].source === 'battery_udp') {
          data[item].source = '电池UDP上报'
        } else if (data[item].source === 'cabinet') {
          data[item].source = '电柜'
        } else {
          data[item].source = '未知'
        }
        if (data[item].cabinetDeviceCode == null) { datalist.push([(formatDateTime(new Date(data[item].time))), data[item].soc, data[item].source, (formatTime(new Date(data[item].time)))]) }
        else {
          datalist.push([(formatDateTime(new Date(data[item].time))), data[item].soc, data[item].source, (formatTime(new Date(data[item].time))), data[item].cabinetDeviceCode])
        }
      }
      setsocdata(soclist);
      settimedata(timelist);
      myChart.setOption({
        title: { text: '电池电量变化曲线' },
        tooltip: {
          trigger: 'axis',
          position(pt: any[]) {
            return [pt[0], '10%'];
          },
          formatter(params) {
            const item = params[0];
            if (item.value[4]) {
              return `
                    时间：${item.value[3]}</br>
                    电量：${item.value[1]}</br>
                    来源：${item.value[2]}(${item.value[4]})
                   `;
            }

            return `
                    时间：${item.value[3]}</br>
                    电量：${item.value[1]}</br>
                    来源：${item.value[2]}
                   `;
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          min: (startTime),
          max: (endTime),
          interval: range,
        },
        yAxis: {
          type: 'value',
        },
        grid: {
          left: '4%',
          right: '4%',
          top: '10%',
        },
        series: [
          {
            name: '当前电量',
            type: 'line',
            data: datalist,
            lineStyle: {
              color: '#009FFF',
              width: 2
            },
            itemStyle: {
              normal: {
                color: 'red'
              }
            }
          },
        ],
      });
    });
  };
  const onChange = (data, dateStrings: any[]) => {
    if (dateStrings) {
      setstartTime(dateStrings[0].replace(/\//g, '-'));
      setendTime(dateStrings[1].replace(/\//g, '-'));
      setrange(((dateToMs(dateStrings[1].replace(/\//g, '-')) - dateToMs(dateStrings[0].replace(/\//g, '-'))) / 18))
    }
  };
  const { fetchSoc, handleReturn, data } = props;
  return (
    <div>
      <DetailSiderBar handleReturn={handleReturn} />
      <Card title="电池出厂数据">
        {data && (
          <Descriptions column={2}>
            <Descriptions.Item label="电池编号">{battery.deviceCode}</Descriptions.Item>
            <Descriptions.Item label="IMEI码">{battery.imei}</Descriptions.Item>
            <Descriptions.Item label="电池当前位置">{battery.address}</Descriptions.Item>
            <Descriptions.Item label="当前电量">{battery.soc}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
      <Card>
        <Form {...layout} name="basic">
          <Form.Item label="时间区间">
            <RangePicker
              defaultValue={[moment(frontOneHour('yyyy-MM-dd hh:mm', 21600000), "YYYY/MM/DD HH:mm"), moment(frontOneHour('yyyy-MM-dd hh:mm', 0), "YYYY/MM/DD HH:mm")]}
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              showTime
              format="YYYY/MM/DD HH:mm:ss"
              onChange={onChange}
            />
            <Button type="primary" style={{ marginLeft: '20px' }} onClick={search}>
              查询
            </Button>
            <text style={{ marginLeft: '20px' }}>(建议时间范围6小时)</text>
          </Form.Item>
        </Form>
        <div id="main" style={{ height: 400, }} />
      </Card>
    </div>
  );
};

export default Soc;
