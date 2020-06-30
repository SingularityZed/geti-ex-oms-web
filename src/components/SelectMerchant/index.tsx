import { Menu, message } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {authcut} from "@/services/manager";
import {getOrganizationAll} from "@/services/merchant";

interface SelectMerchantProps {
  className?: string;
}

const SelectMerchant: React.FC<SelectMerchantProps> = (props) => {
  const { className } = props;
  const [merchants, setMerchants] = useState([]);
  const [selectMerchant, setSelectMerchant] = useState({});

  useEffect(() => {
    let cache = localStorage.getItem('USERINFO');
    if (cache) {
      getOrganizationAll().then((res) => {
          let orgs = res.data.data.organizationInfoList;
          let userinfo = JSON.parse(cache);
          let ms = userinfo.canCutOrgGroup;
          ms.forEach(m => {
            m.merchantName = orgs.find(_ =>  _.id == m.merchantId).operationName;
          })
          let defaultMerchant = ms.find(m => m.isFirst);
          setSelectMerchant(defaultMerchant);
          if (userinfo.isCanCut) {
            setMerchants(ms);
          } else {
            setMerchants([defaultMerchant]);
          }
        }
      )
    }
  }, []);

  const changeLang = ({ key }: ClickParam): void => {
    let find = merchants.find((m) => m.merchantId === key);
    if (find) {
      authcut(find.userId, find.merchantId)
        .then((res) => {
          message.success(res.data.data);
          setSelectMerchant(find);
        })
        .catch((error) => {});
    }
  };

  const merchantMenu = () => {
    return <Menu onClick={changeLang}>
      {merchants ? merchants.map((merchant) => (
        <Menu.Item key={merchant.merchantId}>
          <span>
            {merchant.merchantName}
          </span>
        </Menu.Item>
      )) : null}
    </Menu>
  }
  return (
    <HeaderDropdown overlay={merchantMenu()} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        {selectMerchant.merchantName}
      </span>
    </HeaderDropdown>
  );
};

export default SelectMerchant;
