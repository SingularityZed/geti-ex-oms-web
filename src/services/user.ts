import request from '@/utils/request';
import {TableListParams} from "@/pages/system/role/data";

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
