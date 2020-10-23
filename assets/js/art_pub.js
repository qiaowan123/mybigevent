$(function () {
    initEditor();
    // 获取文章类别数据 再渲染到页面上
    var form = layui.form;
    var layer = layui.layer;
    initCate()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                layer.msg('获取成功')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })

    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击选择封面按钮 点击隐藏的文件输入框
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();

    })

    // 监听文件输入框的变化事件
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 为发布新文章准备5个参数
    var state = '已发布'
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        state = '存为草稿'
    })

    // 为表单绑定提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建formData对象
        var fd = new FormData($(this)[0])
        // fd.forEach(function(v,k) {
        //     console.log(k,v);
        // })
        // 向表单中添加状态属性
        fd.append('state', state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })


    })
    // 发起 ajax 数据请求函数
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if(res.status !== 0) {
                    return layer.msg('发布失败')
                }
                layer.msg('发布成功')
                location.href = '/article/art_list.html'

            }
        })
    }
})
