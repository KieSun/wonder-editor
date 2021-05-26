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

const getFilePath = (path: string, filename: string) => {
  const pathLength = path.length || 0;
  const hasLine = path[pathLength - 1] === '/';
  const retPath = hasLine ? path.substr(0, pathLength - 1) : path;
  return `${retPath}/${getFileName(filename)}`;
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
    message: 'wonder editor upload picture',
  });
  if (!res) {
    return '';
  }
  return res.content.download_url;
};

const tencent = (file: File, filename: string) => {
  const { secretId, secretKey, bucket, region, path, host } = getConfig(
    UploadType.Tencent,
  );
  const cos = new COS({
    SecretId: secretId,
    SecretKey: secretKey,
  });
  const newPath = getFilePath(path, filename);
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

  try {
    client = new OSS(config);
  } catch (error) {
    message.error('OSS配置错误');
    return;
  }
  if (!client) return;

  return new Promise((resolve, reject) => {
    client
      .put(getFilePath(path, filename), file)
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

const githubUpload = async (content: string, filename: string) => {
  let { userName, repo, token } = getConfig(UploadType.Github);

  const { getFullYear, getMonth, getDate } = new Date();

  const dir = `${getFullYear()}-${getMonth() + 1}-${getDate()}`;

  const dateFilename = getFileName(filename);

  const uploadUrl = `https://api.github.com/repos/${userName}/${repo}/contents/${dir}/${dateFilename}?access_token=${token}`;

  const data = {
    content,
    message: 'wonder editor upload picture',
  };
  const res: any = await axios.put(uploadUrl, data);
  if (res?.content?.download_url) {
    return `https://cdn.jsdelivr.net/gh/${userName}/${repo}/${dir}/${dateFilename}`;
  }
  return '';
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
      return tencent(file, name);
    }
    case UploadType.AliOss: {
      return aliOssUpload(file, name);
    }
    case UploadType.Github: {
      return await githubUpload(content, name);
    }
    default: {
      return await gitee(content, name, true);
    }
  }
};
