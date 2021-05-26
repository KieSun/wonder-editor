import { v4 as uuidv4 } from 'uuid';
import COS from 'cos-js-sdk-v5';
import OSS from 'ali-oss';
import axios from './axios';
import { UPLOADCONFIGKEY, UploadType } from '@/common/constant';
import { defaultUploadConfig } from '@/common/config';
import { message } from 'antd';

export const getUploadType = () => {
  const config = JSON.parse(localStorage.getItem(UPLOADCONFIGKEY) as string);
  if (!config) return UploadType.Default;
  return config.type;
};

export const getConfig = (type: UploadType, skipDefault = false) => {
  if (type === UploadType.Default && !skipDefault) {
    return defaultUploadConfig;
  }
  return JSON.parse(localStorage.getItem(UPLOADCONFIGKEY) as string) || {};
};

const getFileName = (filename: string) => {
  const fileSuffix = filename.split('.')[1];
  return `${uuidv4()}.${fileSuffix}`;
};

export const fileToBase64 = (file: File): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result?.toString().split(',').pop());
    };
    reader.onerror = (error) => reject(error);
  });

const gitee = async (content: string, filename: string, isDefault = false) => {
  const { token, repo, userName } = getConfig(
    isDefault ? UploadType.Default : UploadType.Gitee,
  );
  const randomFilename = getFileName(filename);
  const url = `https://gitee.com/api/v5/repos/${userName}/${repo}/contents/${randomFilename}`;
  const res: any = await axios.post(url, {
    content,
    access_token: token,
    message: 'Upload image',
  });
  if (!res) {
    return '';
  }
  return res.content.download_url;
};

const tencent = async (file: File, filename: string) => {
  const { secretId, secretKey, bucket, region, path, host } = getConfig(
    UploadType.Tencent,
  );
  const randomFilename = getFileName(filename);
  const cos = new COS({
    SecretId: secretId,
    SecretKey: secretKey,
  });
  const newPath = `${path}/${randomFilename}`;
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: newPath,
        Body: file,
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          const url = host ? `${host}/${newPath}` : `https://${data.Location}`;
          resolve(url);
        }
      },
    );
  });
};

/**
 * 阿里云上传
 * https://help.aliyun.com/document_detail/64047.html?spm=a2c4g.11186623.6.1213.316026fdDZHimZ
 * @param file
 * @param filename
 */
const aliOssUpload = (file: File, filename: string) => {
  let { path, ...config } = getConfig(UploadType.AliOss);
  let client: OSS;

  if (path[path.length - 1] !== '/') {
    path += '/';
  }

  try {
    client = new OSS(config);
  } catch (error) {
    message.error('OSS配置错误');
    return;
  }
  if (!client) return;

  const randomFilename = getFileName(filename);

  const newPath = path ? `${path}${randomFilename}` : randomFilename;

  return new Promise((resolve, reject) => {
    client
      .put(newPath, file)
      .then((response: OSS.PutObjectResult) => {
        const { url } = response;
        resolve(url);
      })
      .catch((err: Error) => {
        message.error('上传失败');
        reject(err);
      });
  });
};

export const uploadFile = async (file: File, content?: string) => {
  if (!content) {
    return '';
  }
  const { name } = file;
  const type = getUploadType();
  switch (type) {
    case UploadType.Gitee: {
      return await gitee(content, name);
    }
    case UploadType.Tencent: {
      return await tencent(file, name);
    }
    case UploadType.AliOss: {
      return await aliOssUpload(file, name);
    }
    default: {
      return await gitee(content, name, true);
    }
  }
};
