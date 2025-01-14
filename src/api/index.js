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



//文件上传
export const fileUpload = (data) => {
  return request.post("/doc/upload", data)
}

//文件下载
export const fileDownload = (params) => {
  return request.get("/doc/download", {
    params,
    responseType: 'blob', // 这里很重要：指定响应类型为二进制数据
  })
}


//目录树
export const directoryTree = () => {
  return request.get("/dir/tree")
}

//根据关键字查找
export const directorySearch = (body) => {
  return request.post("/dir/search", body)
}

//文件夹删除
export const directoryDelete = (params) => {
  return request.delete("/dir/delete", {
    params
  })
}

//创建文件夹
export const directoryAdd = (body) => {
  return request.post("/dir/create", body)
}

//文件删除
export const fileDelete = (params) => {
  return request.delete('/doc', {
    params
  })
}
