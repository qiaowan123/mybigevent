$(function() {
    initArtCateList ();
    var layer = layui.layer;
    // 1、先获取文章分类列表 通过模板引擎渲染桑区
    function initArtCateList () {
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            success:function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                layer.msg('获取文章分类列表成功')
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 2、为添加类别按钮注册点击事件 弹出框
    var indexAdd = null;
    $('#btnAddCate').on('click',function() {
        indexAdd = layer.open({
            type:1,
            area:['500px', '250px'],
            title: '添加文章分类',
            content:$('#dialog-add').html()

        })
    })

    // 3、提交表单数据
    // 因为弹出框是点击 添加类别按钮动态生成的 所以要事件委托
    $('body').on('submit','#form-add',function(e) {
        e.preventDefault();
        $.ajax({
            method:'post',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                layer.msg('新增分类成功')
                layer.close( indexAdd)
                initArtCateList ();


            }
        })


    })

    // 4、给编辑按钮注册点击事件 弹出弹出框
    // 因为编辑按钮不是页面固有的  所以要事件委托
    var form = layui.form;
    var indexEdit = '';
    $('tbody').on('click','.btn-edit',function() {
        indexEdit = layer.open({
            type:1,
            area:['500px', '250px'],
            title: '添加文章分类',
            content:$('#dialog-edit').html()

        });
        // 发送数据请求 点击编辑的时候就获得一个分类数据的id号 渲染到页面上
        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method:'get',
            // restful传参方式 特点就是传参的时候不需要参数名
            url:'/my/article/cates/' + id,
            // url:'/my/article/cates/:id',
            success:function(res) {
                console.log(res);
                form.val('form-edit',res.data)

            }
        })

        // 表单数据填充之后 再提交表单发送数据请求到后台
        // 因为表单是动态添加的 所以要事件委托
        $('tbody').on('submit','#form-edit',function(e) {
            e.preventDefault();
            $.ajax({
                method:'post',
                url:'/my/article/updatecate',
                data:$(this).serialize(),
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('更新数据失败')
                    }
                    layer.msg('更新数据成功')
                    layer.close(indexEdit);
                    initArtCateList ();

                }

            })
        })
    })

    // 给删除添加点击事件 根据id删除一项数据
    // 因为是动态生成的 所以事件委托
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
          $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除分类失败！')
              }
              layer.msg('删除分类成功！')
              layer.close(index)
              initArtCateList()
            }
          })
        })
    })

})