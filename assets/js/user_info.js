$(function () {
    // 给用户昵称校验验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }

        }
    })

    initUserInfo()

    // 初始化用户的基本信息
    var form = layui.form;
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败')
                }
                // 获取成功就给表单赋值
                // console.log(res);
                // 为表单快速赋值 给表单里加一个lay-filter属性 属性值自己取 
                form.val('formUserInfo', res.data)
            }

        })
    }

    // 实现表单的重置效果
    $('#btnReset').on('click',function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        initUserInfo();

    })

    // 发起请求更新用户信息
    $('.layui-form').on('submit',function(e) {
        e.preventDefault();
        $.ajax({
            method:'post',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res) {
                // console.log(res);
                if(res.status !== 0) {
                    return layer.msg('更改用户信息失败')
                }
                layer.msg('更改用户信息成功')
                // 调用父页面中的方法 重新渲染用户的头像和用户的信息
                // window是iframe, window.parent是index页面，getUserInfo方法是在index页面里的
                window.parent.getUserInfo();
            }
            
        })
    })



})
