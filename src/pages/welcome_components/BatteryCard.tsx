import React, { FC, useEffect, useState } from 'react';
import { Card, Spin} from 'antd';
import battery from '@/static/battery.jpg';
import styles from './Style.less';

interface BatteryCardProps {
  name:any,
  number:any,
  batteryloading:boolean,
}

const BatteryCard: FC<BatteryCardProps> = (props) => {
  const toThousands = (num) => {
    let newStr = '';
    let count = 0;
    // 当数字是整数
    let str = `${num}`;
    if (str.indexOf('.') === -1) {
      for (let i = str.length - 1; i >= 0; i -= 1) {
        if (count % 3 === 0 && count !== 0) {
          newStr = `${str.charAt(i)},${newStr}`;
        } else {
          newStr = str.charAt(i) + newStr;
        }
        count += 1;
      }
      str = newStr; // 自动补小数点后两位
      return str;
    }
    // 当数字带有小数

    for (let i = str.indexOf('.') - 1; i >= 0; i -= 1) {
      if (count % 3 === 0 && count !== 0) {
        newStr = `${str.charAt(i)},${newStr}`;
      } else {
        newStr = str.charAt(i) + newStr; // 逐个字符相接起来
      }
      count += 1;
    }
    str = newStr + `${str}00`.substr(`${str}00`.indexOf('.'), 3);
    return str;
  };
  return (
    <Card className={styles.box}>
    <div className={styles.leftitem}>
      <img src={battery} alt="" style={{ marginTop: '10px' }} />
    </div>
    <div className={styles.rightitem}>
  <p className={styles.righttext}>{props.name}</p>
      <span className={styles.rightnum}>
        <Spin spinning={props.batteryloading}>
          {!props.batteryloading && <>{toThousands(props.number)}</>}
        </Spin>
      </span>
    </div>
  </Card>
  );
};
export default BatteryCard;
