import { v4 as uuidv4 } from 'uuid';
import COS from 'cos-js-sdk-v5';
import OSS from 'ali-oss';
import { UPLOADCONFIGKEY, UploadType } from '@/common/constant';
import { defaultUploadConfig } from '@/common/config';
import axios from './axios';
import { message } from 'antd';

interface ConfigType {
  type: UploadType;
  token: string;
  repo: string;
  userName: string;
  bucket?: string;
  secretId: string;
  secretKey: string;
  region: string;
  path: string;
  host: string;
  accessKeyId: string;
  accessKeySecret: string;
}

class UploadController {
  config: ConfigType;

  constructor() {
    this.config = {
      type: UploadType.Default,
      ...defaultUploadConfig,
    } as ConfigType;
    this.init();
  }

  private init() {
    const config = JSON.parse(localStorage.getItem(UPLOADCONFIGKEY) as string);
    if (config) {
      this.config = config;
    }
  }

  public setConfig(config: ConfigType) {
    this.config = config;
    localStorage.setItem(UPLOADCONFIGKEY, JSON.stringify(config));
  }

  async uploadFile(file: File, name: string): Promise<string> {
    const content = (await this.fileToBase64(file)) as string;
    return this[this.type](file, content, name);
  }

  private getFileName(filename: string) {
    const fileSuffix = filename.split('.')[1];
    return `${uuidv4()}.${fileSuffix}`;
  }

  private getFilePath(path: string, filename: string) {
    const pathLength = path.length || 0;
    const hasLine = path[pathLength - 1] === '/';
    const retPath = hasLine ? path.substr(0, pathLength - 1) : path;
    return `${retPath}/${this.getFileName(filename)}`;
  }

  private fileToBase64(file: File): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result?.toString().split(',').pop());
      };
      reader.onerror = (error) => reject(error);
    });
  }

  private [UploadType.AliOss](file: File, content: string, name: string) {
    let { path, ...config } = this.config;
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
        .put(this.getFilePath(path, name), file)
        .then((response: OSS.PutObjectResult) => {
          const { url } = response;
          resolve(url);
        })
        .catch((err: Error) => {
          message.error('上传失败');
          reject(err);
        });
    });
  }

  private [UploadType.Default](file: File, content: string, name: string) {
    return this[UploadType.Gitee](file, content, name);
  }

  private async [UploadType.Gitee](file: File, content: string, name: string) {
    const { token, repo, userName } = this.config;
    const randomFilename = this.getFileName(name);
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
  }

  private async [UploadType.Github](file: File, content: string, name: string) {
    let { userName, repo, token } = this.config;

    const date = new Date();

    const dir = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    const dateFilename = this.getFileName(name);

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
  }

  private [UploadType.Tencent](file: File, content: string, name: string) {
    const { secretId, secretKey, bucket, region, path, host } = this.config;
    const cos = new COS({
      SecretId: secretId,
      SecretKey: secretKey,
    });
    const newPath = this.getFilePath(path, name);
    return new Promise((resolve, reject) => {
      cos.putObject(
        {
          Bucket: bucket as string,
          Region: region,
          Key: newPath,
          Body: file,
        },
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            const url = host
              ? `${host}/${newPath}`
              : `https://${data.Location}`;
            resolve(url);
          }
        },
      );
    });
  }

  public get type() {
    return this.config.type;
  }

  public verifyImage(file: File) {
    const size = file.size / 1024 / 1024;
    if (this.type === UploadType.Default && size >= 1) {
      message.error('默认图床不支持大于 1MB 的图片上传');
      return false;
    } else if (size >= 5) {
      message.error('公众号不支持大于 5MB 的图片上传');
      return false;
    }
    return true;
  }
}

const upload = new UploadController();

export default upload;
