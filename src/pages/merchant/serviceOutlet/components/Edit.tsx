import React, {FC, useEffect, useState} from 'react';
import {Button, Cascader, Checkbox, Col, Form, Input, message, Modal, Row, Select, TimePicker} from "antd";
import {Map, Marker} from "react-amap";
import {getDetail, updateServiceOutlet} from "@/services/merchant";
import {getRegions, loadRegionData} from "@/utils/region";
import moment from "moment";
import {Maps} from "@/utils/map";
import MapModal from "@/pages/merchant/serviceOutlet/components/MapModal";


interface EditModalProps {
  handleReturn: () => void;
  record: object | undefined;
}

/**
 * modal样式
 */
const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const Edit: FC<EditModalProps> = (props) => {
  const [form] = Form.useForm();
  const [checkedList, setCheckedList] = useState([]);
  const [serviceHours, setServiceHours] = useState<string>();
  const {RangePicker} = TimePicker;
  const [poiData, setPoiData] = useState<[]>([]);
  const [mapGps, setMapGps] = useState<[]>([]);
  const [regionOptions, setRegionOptions] = useState<[]>();
  const [initialValues, setInitialValues] = useState({});
  const [addressValue, setAddressValue] = useState<String>();
  const [mark,setmark] = useState<object>({});
  let timeout: NodeJS.Timeout | null;

  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    getDetail(props.record.id).then((res) => {
      let data = res.data.data;
      if(data.address){
        setPoiData([{value: data.address, text: data.address, gps: [data.longitude, data.latitude]}]);
      }
      form.setFieldsValue({
        serviceOutletName: data.serviceOutletName,
        serviceItem: data.serviceItem,
        telephone: data.telephone,
        province: data.province,
        city: data.city,
        area: data.area,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
        date: [moment((data.serviceHours || "").split('-')[0] ? (data.serviceHours || "").split('-')[0] : '00:00', 'HH:mm'), moment((data.serviceHours || "").split('-')[1] ? (data.serviceHours || "").split('-')[1] : '00:00', 'HH:mm')],
        region: [Number(data.province), Number(data.city), Number(data.area)],
        mapGps:[data.longitude, data.latitude]
      });
      let list = [];
      if (data.serviceItem.length > 0) {
        list.push(data.serviceItem.split(","))
      }
      setCheckedList(list);
      setMapGps([data.longitude, data.latitude]);
      setmark({longitude:data.longitude,latitude:data.latitude});
      setInitialValues({region: [Number(data.province), Number(data.city), Number(data.area)]});
      // load province
      getRegions([Number(data.province), Number(data.city), Number(data.area)]).then((res) => {
        setRegionOptions(res);
      });
      setAddressValue(data.address);
    })

  }, []);


  const loadRegion = (selectedOptions: any) => {
    loadRegionData(selectedOptions).then(() => {
      setRegionOptions([...regionOptions]);
    });
  }

  function checkboxChange(checkedValues: React.SetStateAction<never[]>) {
    setCheckedList(checkedValues)
  }

  /**
   *
   * @param dates
   * @param dateStrings
   */
  function dateChange(_, dates: any[]) {
    setServiceHours(dates[0] + "-" + dates[1])
  }

  const handleSearch = value => {
    if (value) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => {
        Maps.getMapSearch({keywords: value}).then(
          res => {
            setPoiData(res.data.pois.map((poi: { name: any; location: string; }) => ({
              value: poi.name,
              text: poi.name,
              gps: poi.location.split(',')
            })));
          });
      }, 300);
    }
  };

  const handleChange = value => {
    setAddressValue(value);
    let poi = poiData.find(val => val.value == value);
    if (poi) {
      form.setFieldsValue({
        longitude: poi.gps[0],
        latitude: poi.gps[1],
        address:value,
      });
      setMapGps(poi.gps);
      setmark({
        longitude: poi.gps[0],
        latitude: poi.gps[1],
      })
    } else {
      setMapGps([]);
    }
  };

  const changeAddress = () => {
    form.setFieldsValue({
      longitude: mapGps[0],
      latitude: mapGps[1]
    });
  }

  const options = poiData.map(d => <Select.Option className={"addressOption"} key={d.value} value={d.value} selected="selected">{d.text}</Select.Option>);

  /**
   * 编辑 modal 确定按钮点击事件
   */
  const editModalOnOk = () => {
    form.validateFields()
      .then(values => {
        values.serviceItem = checkedList.toString()
        editOk(values);
        }).catch(info => {
        });
  };

  /**
   * 编辑确认
   */
  function editOk(values) {
    values.id = props.record.id
    values.serviceHours = serviceHours
    if (values.region) {
      values.province = values.region[0]
      values.city = values.region[1]
      values.area = values.region[2]
    }
    updateServiceOutlet(values).then((res)=>{
      form.resetFields();
      props.handleReturn();
    });
  };

  /**
   * 编辑 modal 取消按钮点击事件
   */
  const editModalOnCancel = () => {
    form.resetFields();
    props.handleReturn();
  }

  return (
    <Modal
      title="更新服务网点"
      visible={true}
      onOk={editModalOnOk}
      onCancel={editModalOnCancel}
    >
      <Form    {...layout} form={form} layout="horizontal" name="form_in_modal">
        <Form.Item name='serviceOutletName' label="服务网点名称">
          <Input disabled={true}/>
        </Form.Item>
        <Form.Item name='serviceItem' label="网点功能">
          <Checkbox.Group style={{width: '100%'}} onChange={checkboxChange} value={checkedList}>
            <Row>
              <Col span={8}>
                <Checkbox value="1" key="1">车辆改装</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="2" key="2">车辆租借</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="3" key="3">电池租借</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item name='date' label="服务时间">
          <RangePicker onChange={dateChange} format={'HH:mm'}/>
        </Form.Item>
        <Form.Item name='telephone' label="电话" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        {initialValues.region &&
        <Form.Item name='region' label="运营商运营区域">
          <Cascader options={regionOptions} loadData={loadRegion}/>
        </Form.Item>
        }
        <Form.Item name='locationaddress' label="定位地址">
          <Select
            showSearch
            placeholder={'请输入地址'}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            value = {addressValue}
          >
            {options}
          </Select>
          {/* <Button type="primary" onClick={changeAddress}>定位</Button> */}
        </Form.Item>
        <Form.Item name='address' label="详细地址" rules={[{ required: true }]}>
        <Input disabled={false} allowClear placeholder="请先在定位地址中进行搜索"  autoComplete="off"/>
        </Form.Item>
        <Form.Item name='longitude' label="经度" rules={[{ required: true }]}>
          <Input disabled={true}/>
        </Form.Item>
        <Form.Item name='latitude' label="纬度" rules={[{ required: true }]}>
          <Input disabled={true}/>
        </Form.Item>
        <Form.Item label="地图" name='mapGps'>
          {mapGps.length===2&&<MapModal gps={mapGps} markerPosition={mark}/>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Edit;
