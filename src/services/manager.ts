import request from '@/utils/axiosReques';
import {TableListParams} from "@/pages/system/user/data";

export async function getUserManger(orgId) {// 获取用户名
  return request.get(`/manager-service/v1/user/getUserManger/${orgId}`)
}

export async function userConfig(params) { // 更换主题
  return request.put('/manager-service/v1/user/userconfig', {params})
}

// 用户查角色
export async function getUserGetRole() {
  return request.get('/manager-service/v1/role/list',)
}
// 商户用户查角色
export async function getOrgUserGetRole() {
  return request.get('/manager-service/v1/organization/role/roleList')
}

// 查询用户
export async function queryUser(params) {
  return request.get('/manager-service/v1/user', {
    params,
  });
}

// 查看用户
export async function userDetail(username?: any) {
  return request.get(`/manager-service/v1/user/${username}`);
}

// 新增用户
export async function addUser(params) {
  return request.post('/manager-service/v1/user', params)
}

// 编辑用户
export async function editUser(params) {
  return request.put('/manager-service/v1/user', {params})
}

// 删除用户
export async function deleteUser(params: { key: number[] }) {
  return request.post('/manager-service/v1/user', {
    method: 'DELETE',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

// 重置用户密码
export async function resetUserPassword(params) {
  return request.put('/manager-service/v1/user/password/reset', {params})
}

// 商户权限
export async function auth(params) {
  return request.get(`/manager-service/v1/organization/user/auth/${params}`)
}

// 修改权限
export async function authupdata(params) {
  return request.put('/manager-service/v1/organization/user/auth/update', {params})
}


// 查询角色
export async function queryRole(params?: TableListParams) {
  return request.get('/manager-service/v1/role', {
    params,
  });
}

// 查看角色
export async function roleDetail(id?: any) {
  return request.get(`/manager-service/v1/role/menu/${id}`);
}

// 编辑角色
export async function updateRole(params: TableListParams) {
  return request.put('/manager-service/v1/role', {
    method: 'PUT',
    data: {
      ...params,
      method: 'update',
    },
  });
}

// 删除角色
export async function deleteRole(data) { // 删除角色
  return request.delete('/manager-service/v1/role/' + data, null)
}

//  查菜单权限
export async function getRoleMenu() {
  return request.get('/manager-service/v1/menu')
}

// 增加角色
export async function addRole(params) {
  return request.post('/manager-service/v1/role', params)
}

// 查菜单权限后走的接口****未知
export async function editRoleMenuNum(params) {
  return request.get(`/manager-service/v1/role/menu/${params}`)
}

// 修改角色信息
export async function editRole(params) {
  return request.put('/manager-service/v1/role', {params})
}


// 查询菜单
export async function queryMenu(params?: TableListParams) {
  return request.get('/manager-service/v1/menu', {
    params,
  });
}

// 新增菜单
export async function addMenu(params?: any) {
  return request.post('/manager-service/v1/menu', params)
}

// 编辑菜单
export async function updateMenu(params?: any) {
  return request.put('/manager-service/v1/menu', {params})
}

// 删除菜单
export async function deleteMenu(params: { key: number[] }) {
  return request.delete(`/manager-service/v1/menu/${params}`, {})
}

// 增加****修改*****权限菜单和按钮,查出的菜单
export async function getCommonMenu(params) {
  return request.get('/manager-service/v1/menu', {params})
}

export async function authcut(userId, merchantId) { // 切换商户
  return request.put(`/manager-service/v1/organization/user/auth/cut?merchantId=${merchantId}&userId=${userId}`)
}

// 修改用户头像
export async function changeAvatar(username: string, avatar: string) {
  // return request.put('/manager-service/v1/user/avatar', { params })
  return request.put(`/manager-service/v1/user/avatar?username=${username}&avatar=${avatar}`, {})
}


// 查询枚举类型
export async function getEnumTypes(params) {
  return request.get('/manager-service/v1/enums/getEnumTypes', {
    params,
  });
}

// 新增枚举类型
export async function addEnumType(params) {
  return request.post('/manager-service/v1/enums/addEnumType', {
    ...params,
  });
}

// 修改枚举类型
export async function updateEnumType(params?: any) {
  return request.put('/manager-service/v1/enums/updateType', {
    params,
  });
}

export async function getEnumEntities(enumTypeCode) {
  return request.get(`/manager-service/v1/enums/getEnumEntities?enumTypeCode=${enumTypeCode}`);
}

export async function queryEnumEntities(params) {
  return request.get(`/manager-service/v1/enums/getEnumEntities`, {params});
}

// 新增枚举实体
export async function addEnumEntity(params) {
  return request.post('/manager-service/v1/enums/addEnumEntity', {
    ...params,
  });
}

// 修改枚举实体
export async function updateEnumEntity(params?: any) {
  return request.put('/manager-service/v1/enums/updateEnumEntity', {
    params,
  });
}


// 刷新枚举缓存
export async function refreshEnum() {
  return request.post('/manager-service/v1/enums', {
    method: 'POST',
    data: {
      method: 'post',
    },
  });
}


// 查询字典
export async function queryDict(params?: TableListParams) {
  return request.post('/manager-service/v1/dict/pageDictList', {
    params,
  });
}

// 新增字典
export async function addDict(params: TableListItem) {
  return request.post('/manager-service/v1/dict/addDict', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

// 编辑字典
export async function updateDict(params: TableListParams) {
  return request.put('/manager-service/v1/updateDict', {
    method: 'PUT',
    data: {
      ...params,
      method: 'update',
    },
  });
}

// 删除字典
export async function deleteDict(params: { key: number[] }) {
  return request.post('/manager-service/v1/dict/delete', {
    method: 'DELETE',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

// 查询消费者日志
export async function queryConsumerLog(params?: TableListParams) {
  return request.get('/consumer-service/v1/mgr/consumerLog', {
    params,
  });
}

// 查询系统日志
export async function querySystemLog(params?: TableListParams) {
  return request.get('/manager-service/v1/log', {
    params,
  });
}

// 修改密码
export async function userPassword(params) {
  return request.put('/manager-service/v1/user/password', {params})
}

// 更改密码时验证原始密码是否正确
export async function passwordCheck(params) {
  return request.post('/manager-service/v1/user/password/check', params)
}

export async function getuserName() { // 获取操作人列表（下拉框）
  return request.get('/manager-service/v1/user/userNameList')
}

// 获取商户用户列表
export async function getMangerUserList(params?: TableListParams) {
  return request.get('/manager-service/v1/organization/user/pageList', {
    params,
  });
}

// 商户用户详情
export async function viewMangerUser(params: any) {
  return request.get(`/manager-service/v1/organization/user/${params}`, {});
}

// 新增商户用户
export async function addMangerUser(params?: any) {
  return request.post('/manager-service/v1/organization/user/add', params)
}

// 编辑商户用户
export async function eidtMangerUser(params?: any) {
  return request.put('/manager-service/v1/organization/user/edit', {params})
}

// 删除商户用户
export async function deleteMangerUser(params: { key: number[] }) {
  return request.delete(`/manager-service/v1/organization/user/${params}`, {})
}

// 查询角色
export async function getMangerRoleList(params) { // 商户角色列表
  return request.get('/manager-service/v1/organization/role/roleList', {params})
}

export async function getMangerMenuList(params) { // 获取商户角色树
  return request.get('/manager-service/v1/organization/menu/getMenuList', {params})
}

export async function editMangerRoleMenuNum(params) { // 菜单选中列表
  return request.get('/manager-service/v1/organization/menu/' + params)
}

export async function addMangerRole(params) { // 商户角色新增
  return request.post('/manager-service/v1/organization/role/add', params)
}

export async function editMangerRole(params) { // 商户角色编辑
  return request.put('/manager-service/v1/organization/role/edit', {params})
}

export async function deleteMangerRole(params) { // 删除商户角色
  return request.delete(`/manager-service/v1/organization/role/${params}`, {})
}

export async function queryLogPage(params?: TableListParams) {
  return request.get('/manager-service/v1/log/maintain', {
    params,
  });
}

export async function uploadFile(type, params) { // 上传文件
  return request.upload(`/manager-service/v1/oss/upload/${type}`, params)
}

// 增加用户时查重
export async function addUserChecking(params) {
  return request.get(`/manager-service/v1/user/check/${params}`, {})
}

export async function addRoleChecking(params) { // 角色查重
  return request.get(`/manager-service/v1/role/check/${params}`, {})
}

export async function getUserMenu (username) { // 拉取菜单
  return request.get(`/manager-service/v1/menu/${username}/ex-oms`, {})
}
