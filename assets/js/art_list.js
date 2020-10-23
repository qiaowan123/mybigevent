$(function() {
    var form = layui.form;
    var layer = layui.layer;
    // 定义一个配置对象 发送数据请求的时候就当数据参数
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态

    }

    // 时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var h = padZero(dt.getHours())
        var m = padZero(dt.getMinutes())
        var s = padZero(dt.getSeconds())
        return y + "-" + m + "-" + d + " " + h + ":" + m +":"+ s 
    }
    // 定义补零的函数
    function padZero (n) {
        return n >= 10 ? n : '0' + n

    }
    // 获取文章数据列表的方法
    initTable ()
    function initTable () {
        $.ajax({
            method:'get',
            url:'/my/article/list',
            data:q,
            success :function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章数据列表失败')
                }
                layer.msg('获取文章数据列表成功')
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)

            }
        })

    }

    // 获取文章分类类别的数据
    initCate ();
    function initCate () {
        $.ajax ({
            method:'get',
            url:'/my/article/cates',
            success:function(res) {
                console.log(res);
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                // layui的渲染机制 再调用一下啊才能渲染出来
                form.render()
            }
        })
    }
    
    // 筛选区域其实是个表单 所以要提交表单数据 所以给表单注册提交事件
    $('#form-search').on ('submit',function(e) {
        e.preventDefault();
        // 获取到下拉表单里的值
        var  cate_id = $('[name=cate_id]').val()
        var   state = $('[name=state]').val()
        // 把获取到的值给q对象
        q.cate_id = cate_id;
        q.state = state;
        // 再调用一下第一步的获取文章数据列表的方法 因为q的参数对象已经更新了
        initTable ()
    })

    // 定义渲染分页的方法，接收一个总数量的参数
    var laypage = layui.laypage
    function renderPage (total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 显示分页的格式
            limits: [2, 3, 5, 10],
            // 下拉页码中一页显示几条
            jump: function(obj,first) {
                console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // first 的值如果是点击页码的话就是undefined;
                // 如果是jump函数自动调用的话就是true；
                q.pagesize = obj.limit
                // 把用户选择的一页显示几条数据的值赋值给 q.pagesize
                if(!first) {
                    initTable ()
                }
            }

          })


    }

    // 点击删除按钮删除数据
    // 因为是动态创建的 所以需要事件委托
    $('tbody').on('click','.btn-delete',function() {
        var id = $('.btn-delete').attr('data-id')
        // console.log(id);
        $.ajax({
            method:'get',
            url:'/my/article/delete/' + id,
            success:function(res) {
                // console.log(res);
                if(res.ststus !== 0) {
                    return layer.msg('删除失败')
                }
                layer.msg('删除成功')
                initTable ()
            }
        })
    })


})