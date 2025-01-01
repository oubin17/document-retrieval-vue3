import request from '../utils/request'

//根据关键字查找
export const search = (data) => {
  return request.post('/search/keyword', data)
}

//获取常用搜索列表
export const commonSearch = () => {
  return request.get('/search/common')
}