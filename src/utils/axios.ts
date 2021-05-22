import axios from 'axios';
import { message } from 'antd';

axios.interceptors.response.use(
  (response): any => {
    return response.data;
  },
  (error) => {
    message.error('图片上传出错');
  },
);

export default axios;
