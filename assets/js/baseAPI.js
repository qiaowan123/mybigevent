// 无论发送ajax post get 请求 都会先调用一下ajaxPrefilter函数 options是ajax穿过来的配置对象
$.ajaxPrefilter(function(options) {
  options.url = 'http://ajax.frontend.itheima.net' + options.url;
  // 先判断一下 请求地址里是否有/my/字符串
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization:localStorage.getItem('token') || ''
    }
  

  }
  options.complete = function(res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token');
      location.href = '/login.html';

  }

  }

})