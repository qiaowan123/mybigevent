$(function() {
    $('#link_reg').on('click',function() {
        $('.login-box').hide();
        $('.reg-box').show()

    })
    $('#link_login').on('click',function() {
        $('.reg-box').hide();
        $('.login-box').show();

    })
    // 获取表单元素
    var form = layui.form;
    // 表单验证规则 form.verify方法 里面是对象
    form.verify( {
        // 可以是数组的形式
        pwd:[/^[\S]{6,12}$/,'请输入6-12位密码且不能出现空格'],
        // 也可以是函数的形式
        // value是repwd里面的值，再获取password里面的值 再判断两者的值是否相等
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }

        }
    })

    // 注册之后发送请求
    var layer = layui.layer;
    $('#form_reg').on('submit',function(e) {
        e.preventDefault();
        var data = {username: $('#form_reg [name=username]').val() ,password: $('#form_reg [name=password]').val()}
        
        $.post('/api/reguser',data,function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
 
            }
            layer.msg('注册成功，请登录')
            $('#link_login').click();

        })
    })

    // 给登录之后发送请求
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'post',
            data:$(this).serialize(),
            success:function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                localStorage.setItem('token', res.token)
                layer.msg('登录成功');
                location.href = '/index.html';


            }
        })


    })
})