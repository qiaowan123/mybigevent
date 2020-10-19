$(function() {
// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

var layer = layui.layer;

// 点击上传 自动触发文件表单点击行为
$('#btnChooseImage').on('click',function() {
    $('#file').click();
})

// 监听到文件表单的change事件
$('#file').on('change',function(e) {
    // alert(1)
    var fileList = e.target.files;
    // fileList是一个数组
    // console.log(fileList);
    if ( fileList.length === 0) {
        return layer.msg('您没有选择图片')
    }
    // 拿到用户选择的文件
    var file =  fileList[0];
    // 将文件转化为路径
    var imgURL =  URL.createObjectURL(file);
     $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', imgURL) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域

})

// 给确定按钮注册点击事件
$('#btnUpload').on('click',function() {
    // 拿到用户裁剪之后的图片
    var dataURL = $image
    .cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 100,
      height: 100
    })
    .toDataURL('image/png')

    // 把头像上传到服务器
    $.ajax({
        method:'post',
        url:'/my/update/avatar',
        data:{ avatar: dataURL},
        success:function(res) {
            if(res.status !== 0) {
                return layer.msg('上传头像失败')
            }
            layer.msg('上传头像成功')
            // 把成功之后的头像渲染到头部和侧边栏的图片头像里去
            window.parent.getUserInfo();
        }
    })

})

})