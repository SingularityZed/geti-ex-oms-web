import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider';
import { Input, Form, Row, Col, TimePicker, InputNumber, DatePicker, Select } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';

const Index: React.FC<{}> = (props) => {
  const [formHeight, setFormHeight] = useState<number | undefined>(88);

  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const className = getPrefixCls('pro-table-search');
        return (
          <div
            className={classNames(className)}
            style={{
              height: formHeight,
            }}
          >
            <RcResizeObserver
              onResize={({ height }) => {
                setFormHeight(height + 24);
              }}
            >
              <div>
            </div>
            </RcResizeObserver>
          </div>
        );
      }}
    </ConfigConsumer>
  );
};

export default Index;
