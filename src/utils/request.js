import axios from 'axios'
import { ElMessage } from 'element-plus';

const http = axios.create({
  baseURL: 'http://127.0.0.1:8080/document-retrieval/api',
  timeout: 10000
})


// 添加请求拦截器
http.interceptors.request.use(function (config) {
  const token = localStorage.getItem('odk-token')
  //不需要添加token的api
  const whiteUrl = ['/user/query/loginId', '/user/register', '/user/login', '/search/*']
  if (token && !whiteUrl.includes(config.url)) {
    config.headers['odk-token'] = token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
const tokenExceptionCode = ['020', '021', '022']
http.interceptors.response.use(function (response) {

  //对接口异常的数据，给用户提示
  if (response.data.success === false) {
    ElMessage.warning(response.data.errorContext)
  }

  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。

  const errorCode = error.response?.data?.errorCode;
  if (tokenExceptionCode.includes(errorCode)) {
    localStorage.removeItem('odk-token')
    localStorage.removeItem('userInfo')
    window.location.href = window.location.origin
  }


  // 对响应错误做点什么
  return Promise.reject(error);
});

export default http