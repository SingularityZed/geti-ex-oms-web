import React, {FC, useEffect, useState} from 'react';
import {Modal, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {uploadFile} from "@/services/manager";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

interface PicturesWallProps {
  imgMaxSize: number;
  fileBizType: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  actions?: any;
}

const PicturesWall: FC<PicturesWallProps> = (props) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [fileList, setFileList] = useState([]);
  const [imgUrlList, setImgUrlList] = useState([]);
  const handleModelOnCancel = () => setPreviewVisible(false);

  useEffect(() => {
    if(props.actions) {
      props.actions["setValue"] = setValue;
    }
    if (props.value && props.value.length > 0) {
      let files = props.value.map(
        (val, index, array) => {
          return {
            uid: 'uid' + index,
            url: val,
            response: {val},
          };
        }
      );
      setFileList(files);
    }
  }, []);

  useEffect(() => {
    if (props.onChange) {
      let length = imgUrlList ? imgUrlList.length : 0;
      let list = fileList.filter(file => file.response && file.response.url).map(file => file.response.url);
      if (length != list.length) {
        props.onChange(list);
      }
      setImgUrlList(list);
    }
  }, [fileList]);

  const setValue = (value: string, callback?: () => void): void => {
    if (value && value.length > 0) {
      let files = value.map(
        (val, index, array) => {
          return {
            uid: 'uid' + index,
            url: val,
            response: {val},
          };
        }
      );
      setFileList(files);
    }
    if (callback) {
      callback();
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({fileList}) => setFileList(fileList);

  const uploadButton = (
    <div>
      <PlusOutlined/>
      <div className="ant-upload-text">上传</div>
    </div>
  );

  const customRequest = (options) => {
    let param = new FormData();
    param.append("file", options.file);
    uploadFile(props.fileBizType, param).then((res) => {
      // props.uploadSuccess(imgUrlList)
      options.onSuccess(res.data.data, options.file);
    })
  }

  const onRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  }

  return (
    <div className="clearfix">
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={customRequest}
        onRemove={onRemove}
      >
        {fileList.length >= props.imgMaxSize ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleModelOnCancel}
      >
        <img alt="pic" style={{width: '100%'}} src={previewImage}/>
      </Modal>
    </div>
  );
};

export default PicturesWall;
