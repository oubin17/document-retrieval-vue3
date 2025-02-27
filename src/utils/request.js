import axios from 'axios'
import { ElMessage } from 'element-plus';

// 创建 axios 实例
const service = axios.create({
  // 使用环境变量中的 API URL
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以根据环境变量添加不同的处理逻辑
    if (import.meta.env.MODE === 'development') {
      console.log('开发环境请求:', config)
    }
    const token = localStorage.getItem('document-retrieval-token')
    //不需要添加token的api
    const whiteUrl = ['/user/query/loginId', '/user/register', '/user/login', '/search/*']
    if (token && !whiteUrl.includes(config.url)) {
      config.headers['document-retrieval-token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    //对接口异常的数据，给用户提示
    if (response.data.success === false) {
      ElMessage.warning(response.data.errorContext)
    }
    return response
  },
  error => {
    ElMessage.error(error.message)
    const errorCode = error.response?.data?.errorCode;
    if (['020', '021', '022'].includes(errorCode)) {
      localStorage.removeItem('document-retrieval-token')
      localStorage.removeItem('userInfo')
      window.location.href = window.location.origin
    }
    return Promise.reject(error)
  }
)

export default service