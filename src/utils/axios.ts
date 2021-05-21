import axios from 'axios';
import { Alert } from 'rsuite';

axios.interceptors.response.use(
  (response): any => {
    return response.data;
  },
  (error) => {
    Alert.error('图片上传出错');
  },
);

export default axios;
