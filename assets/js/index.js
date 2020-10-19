$(function() {
    getUserInfo ();
    // 实现点击退出功能
    $('#btnLogout').on('click',function() {
        layer.confirm('确定退出登录', {icon: 3, title:'提示'}, function(index){
            //do something
            localStorage.removeItem('token')
            location.href = '/login.html'
            // 关闭confirm询问框
            layer.close(index);
          })
    })
        

})
// 获取用户信息
function getUserInfo () {
    $.ajax({
        method:'get',
        url:'/my/userinfo',
        // headers: {
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 获取成功之后就渲染头像
            renderAvatar (res.data);


        }
        // complete: function (res) {
        //     // console.log(res);
        //     // if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //     //     localStorage.removeItem('token');
        //     //     location.href = '/login.html';

        //     // }
        // }

    })


}

// 渲染头像
function renderAvatar (user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    // 渲染欢迎文本
    $('#welcome').html('欢迎' + name)
    // 判断图片是否为空，不为空的话就渲染图片，隐藏文本框图片
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()

    }else {
        // 为空的话就隐藏图片头像 渲染文本头像
        $('.layui-nav-img').hide();
        // name是字符串  可以当数组用 name的第一个字母
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }


}