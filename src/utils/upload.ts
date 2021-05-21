import { v4 as uuidv4 } from 'uuid';
import axios from './axios';
import { UPLOADTYPEKEY, UploadType } from '@/common/constant';
import { defaultUploadConfig } from '@/common/config';

const getConfig = (type: UploadType) => {
  switch (type) {
    case UploadType.Gitee: {
      return defaultUploadConfig;
    }
    default: {
      return defaultUploadConfig;
    }
  }
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

export const uploadFile = async (filename: string, content?: string) => {
  if (!content) {
    return '';
  }
  const type = localStorage.getItem(UPLOADTYPEKEY) || UploadType.Default;
  switch (type) {
    case UploadType.Gitee: {
      break;
    }
    default: {
      return await gitee(content, filename, true);
    }
  }
};
