import wepy from 'wepy';
import Tips from '../utils/Tips'

// HTTP工具类
export default class http {
  static async request (method, url, data, loading = true) {
    const param = {
      url: url,
      method: method,
      data: data
    };
    if (loading) {
      // Tips.loading();
    }
    console.info(`[http]request url=${url}`);
    const res = await wepy.request(param);
    if (this.isSuccess(res)) {
      return res.data.data;
    } else {
      throw this.requestException(res);
    }
  }

  /**
   * 判断请求是否成功
   */
  static isSuccess (res) {
    const wxCode = res.statusCode;
    // 微信请求错误
    if (wxCode !== 200) {
      return false;
    }
    const wxData = res.data;
    return !(wxData && wxData.code !== 0);
  }

  /**
   * 异常
   */
  static requestException (res) {
    const error = {};
    error.statusCode = res.statusCode;
    const wxData = res.data;
    const serverData = wxData.data;
    if (serverData) {
      error.serverCode = wxData.code;
      error.message = serverData.message;
      error.serverData = serverData;
    }
    // 权限问题跳转
    if (error.statusCode == 403) {
      if (error.serverCode == '80003') {
        console.warn('微信thrid_session认证失败');
      } else {
        Tips.modal('微信登录状态失效，请重新访问').then(() => {
          wepy.reLaunch({
            url: '/pages/home/template?reLaunch=1'
          })
        });
      }
    }
    return error;
  }
  static get (url, data, loading = true) {
    return this.request('GET', url, data, loading);
  }

  static put (url, data, loading = true) {
    return this.request('PUT', url, data, loading);
  }

  static post (url, data, loading = true) {
    return this.request('POST', url, data, loading);
  }

  static patch (url, data, loading = true) {
    return this.request('PATCH', url, data, loading);
  }

  static delete (url, data, loading = true) {
    return this.request('DELETE', url, data, loading);
  }
}
