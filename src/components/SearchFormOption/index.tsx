import React, {useEffect} from 'react';
import {FormInstance} from 'antd/es/form';
import {Button, Space} from 'antd';
import {DownOutlined} from "@ant-design/icons/lib";

export interface SearchFormOptionButton {
  type?: string;
  onClick: () => {};
  text: string;
  buttonRender?: () => {};
  firstRow?: boolean;
}

export interface FormOptionProps {
  searchConfig: any;
  type?: any;
  form: FormInstance;
  submit: () => void;
  collapse: boolean;
  setCollapse: (collapse: boolean) => void;
  showCollapseButton: boolean;
  onReset?: () => void;
  optionButtons?: Array<SearchFormOptionButton>;
  buttonSize?: string;
}

const firstRow = (button: SearchFormOptionButton) => {
  if (button.firstRow === undefined) {
    return true;
  }
  if (button.firstRow === null) {
    return true;
  }
  return button.firstRow;
}

/**
 * FormFooter 的组件，可以自动进行一些配置
 * @param props
 */
const SearchFormOption: React.FC<FormOptionProps> = (props) => {
  const {
    optionButtons, buttonSize, searchConfig, setCollapse, collapse, type, form, submit, showCollapseButton, onReset = () => {
    }
  } = props;
  const isForm = type === 'form';
  const size = buttonSize ? buttonSize : "default";
  const {searchText, submitText, resetText} = searchConfig;
  const collapseRender =(collapsed: boolean) => {
    if (collapsed) {
      return (
        <>
          <DownOutlined
            style={{
              marginLeft: '0.5em',
              transition: '0.3s all',
              transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
            }}
          />
        </>
      );
    }
    return (
      <>
        <DownOutlined
          style={{
            marginLeft: '0.5em',
            transition: '0.3s all',
            transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
          }}
        />
      </>
    );
  }
  useEffect(() =>{

  }, []);

  return (
    <Space direction={"vertical"} style={{width: "100%"}}>
      <Space>
        <Button type="primary" htmlType="submit" onClick={() => submit()} size={size}>
          {isForm ? submitText : searchText}
        </Button>
        <Button
          size={size}
          onClick={() => {
            form.resetFields();
            onReset();
            if (!isForm) {
              submit();
            }
          }}
        >
          {resetText}
        </Button>
        {optionButtons && optionButtons.filter(_ => firstRow(_)).map(button => button.buttonRender ? button.buttonRender() :
          (< Button key={button.text} type={button.type ? button.type : 'primary'} onClick={button.onClick}
                    size={size}>
              {button.text}
            </Button>
          )
        )}
        {!isForm && showCollapseButton && (
          <a
            onClick={() => {
              setCollapse(!collapse);
            }}
          >
            {collapseRender && collapseRender(collapse)}
          </a>
        )}
      </Space>
      {optionButtons &&
      <Space>
        {optionButtons.filter(_ => !firstRow(_)).map((button, index, array) => {
            if (button.buttonRender) {
              return button.buttonRender();
            }
            return (<Button key={button.text}
                            type={button.type ? button.type : 'primary'}
                            onClick={button.onClick}
                            size={size}>
              {button.text}
            </Button>);
          }
        )}
      </Space>
      }
    </Space>
  );
};

export default SearchFormOption;
