import {  Reducer } from 'umi';

import { TableListItem } from './data.d';

export interface StateType {
  list: TableListItem[];
  details: Partial<TableListItem> | undefined;
  loading: boolean;
  modelVisit: boolean
}

export interface ModelType {
  namespace: string;
  state: StateType;
  reducers: {
    queryList: Reducer<StateType>;
    detailsList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'batterySpace',

  state: {
    list: [],
    details: {},
    loading: false,
    modelVisit:false
  },


  reducers: {
    queryList(state = { list: [], details: {}, loading: false, modelVisit:false }, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    detailsList(state = { list: [], details: {}, loading: false, modelVisit:false }, action) {
      return {
        ...state,
        details: action.payload,
      };
    },
  },
};

export default Model;
