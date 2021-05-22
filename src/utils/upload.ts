import { v4 as uuidv4 } from 'uuid';
import axios from './axios';
import { UPLOADCONFIGKEY, UploadType } from '@/common/constant';
import { defaultUploadConfig } from '@/common/config';

export const getConfig = (type: UploadType, skipDefault = false) => {
  if (type === UploadType.Default && !skipDefault) {
    return defaultUploadConfig;
  }
  return JSON.parse(localStorage.getItem(UPLOADCONFIGKEY) as string);
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

export const getUploadType = () => {
  const config = JSON.parse(localStorage.getItem(UPLOADCONFIGKEY) as string);
  if (!config) return UploadType.Default;
  return config.type;
};

export const uploadFile = async (filename: string, content?: string) => {
  if (!content) {
    return '';
  }
  const type = getUploadType();
  switch (type) {
    case UploadType.Gitee: {
      return await gitee(content, filename);
    }
    default: {
      return await gitee(content, filename, true);
    }
  }
};
