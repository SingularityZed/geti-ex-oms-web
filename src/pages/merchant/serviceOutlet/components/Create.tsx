import React, {FC, useEffect, useState} from 'react';
import {Button, Cascader, Checkbox, Col, Form, Input, Modal, Row, Select, TimePicker} from "antd";
import {Map, Marker} from "react-amap";
import {getRegions, loadRegionData} from "@/utils/region";
import {addServiceOutlet} from "@/services/merchant";
import {Maps} from "@/utils/map";
import MapModal from "@/pages/merchant/serviceOutlet/components/MapModal";


interface CreateModalProps {
  handleModelClose: () => void;
}

/**
 * modal样式
 */
const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};


const Create: FC<CreateModalProps> = (props) => {
  const [addForm] = Form.useForm();
  const [regionOptions, setRegionOptions] = useState<[]>();
  const [serviceHours, setServiceHours] = useState<string>();
  const [checkedList, setCheckedList] = useState([]);
  const {RangePicker} = TimePicker;
  const [poiData, setPoiData] = useState<[]>([]);
  const [mapGps, setMapGps] = useState<[]>();
  let timeout: NodeJS.Timeout | null;
  const [addressValue, setAddressValue] = useState<String>();
  const [mark,setmark] = useState<object>({});
  /**
   * 页面初始化加载数据
   */
  useEffect(() => {
    getRegions().then((res) => {
      setRegionOptions(res);
    });
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
            setPoiData(res.data.pois.map(poi => ({value: poi.name, text: poi.name, gps: poi.location.split(',')})));
          });
      }, 300);
    }
  };

  const handleChange = value => {
    console.log(value,'value')
    setAddressValue(value);
    let poi = poiData.find(val => val.value == value);
    if (poi) {
      addForm.setFieldsValue({
        longitude: poi.gps[0],
        latitude: poi.gps[1],
        address:value,
      });
      setMapGps(poi.gps);
      setmark({
        longitude: poi.gps[0],
        latitude: poi.gps[1]
      })
    } else {
      setMapGps([]);
    }
  };

  const options = poiData.map(d => <Select.Option key={d.value} value={d.value}>{d.text}</Select.Option>);

  const changeAddress = () => {
    addForm.setFieldsValue({
      longitude: mapGps[0],
      latitude: mapGps[1]
    });
    setMapGps(mapGps);
  }


  const addModalOnOk = () => {
    // 新增数据
    addForm.validateFields()
      .then(values => {
        values.serviceHours = serviceHours
        if (values.region) {
          values.province = values.region[0];
          values.city = values.region[1];
          values.area = values.region[2];
        }
        values.serviceItem = checkedList.toString();
        addServiceOutlet(values).then((res)=>{
          addForm.resetFields();
          props.handleModelClose();
        });
      }).catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  const addModalOnCancel = () => {
    addForm.resetFields();
    props.handleModelClose()
  }


  return (
    <Modal title='新增服务网点'
           visible={true}
           onOk={addModalOnOk}
           onCancel={addModalOnCancel}>
      <Form    {...layout} form={addForm}>
        <Form.Item name='serviceOutletName' label="服务网点名称" rules={[{ required: true }]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        <Form.Item name='serviceItem' label="网点功能" rules={[{ required: true }]}>
          <Checkbox.Group style={{width: '100%'}} onChange={checkboxChange} value={checkedList}>
            <Row>
              <Col span={8}>
                <Checkbox value="1">车辆改装</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="2">车辆租借</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="3">电池租借</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item name='date' label="服务时间" rules={[{ required: true }]}>
          <RangePicker onChange={dateChange} format={'HH:mm'}/>
        </Form.Item>
        <Form.Item name='telephone' label="电话" rules={[{required: true}]}>
          <Input autoComplete={"off"}/>
        </Form.Item>
        <Col span={24}>
          <Form.Item name='region' label="区域" rules={[{required: true}]}>
            <Cascader options={regionOptions} loadData={loadRegion}/>
          </Form.Item>
        </Col>
        <Form.Item name='locationaddress' label="定位地址">
          <Select
            showSearch
            placeholder={'请输入地址'}
            // style={{width: 200}}
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
          {/* <Button type="primary" onClick={changeAddress}>定位</Button> */}
        </Form.Item>
        <Form.Item name='longitude' label="经度" rules={[{ required: true }]}>
          <Input disabled={true}/>
        </Form.Item>
        <Form.Item name='latitude' label="纬度" rules={[{ required: true }]}>
          <Input disabled={true}/>
        </Form.Item>
        <Form.Item label="地图" >
           <MapModal gps={mapGps} markerPosition={mark}/>
        </Form.Item>
      </Form>
    </Modal>

  );
};
export default Create;
