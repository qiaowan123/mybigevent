$(function() {
    getUserInfo ()

})
// 获取用户信息
function getUserInfo () {
    $.ajax({
        method:'get',
        url:'/my/userinfo',
        headers: {
            Authorization:localStorage.getItem('token') || ''
        },
        success:function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 获取成功之后就渲染头像
            renderAvatar (res.data);


        }

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
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }


}