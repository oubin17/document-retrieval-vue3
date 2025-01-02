import request from '../utils/request'

//根据关键字查找
export const search = (data) => {
  return request.post('/search/keyword', data)
}

//获取常用搜索列表
export const commonSearch = () => {
  return request.get('/search/common')
}

//登录
export const userLogin = (data) => {
  return request.post('/user/login', data)
}

//根据文件名称查找
export const fileSearch = (data) => {
  return request.post('/doc/search', data)
}

//文件删除
export const fileDelete = (data) => {
  return request.post('/doc' + data)
}