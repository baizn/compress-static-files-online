/**
 * Created by baizn on 14-10-21.
 */
define(function(require,exports,module){
   var ZipFile = function(){

   };

    var upload = function(type){
        var fileObj = document.getElementById('uploadFileName').files[0],
            formdata = new FormData(),
            FileController = "/upload";                    // 接收上传文件的后台地址
        formdata.append("uploadFile", fileObj);

        // XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();

        xhr.open("post", FileController, true);

        xhr.onload = function () {
            if(xhr.status === 200){
                var $result = $('#result');
                $result.html('');
                if('static' === type){
                    $.get('/getUploadFilePage',function(data){
                        $result.html(data);
                    });
                }else if('zip' === type){
                    $.get('/getPackageJsPage',function(data){
                        $result.html(data);
                    });
                }
            }
        };
        xhr.send(formdata);
    /*var uploader = WebUploader.create({
        swf:'./Uploader.swf',
        server:'/upload',
        pick:'#picker',
        resize:false
    });
    var $list = $('#filelist');

    // 当有文件被添加进队列的时候
    uploader.on('fileQueued',function(file){
        $list.append( '<div id="' + file.id + '" class="item">' +
            '<h4 class="info">' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
            '</div>' );
    });
    uploader.on('uploadProgress',function(file,percentage){
        var $li = $('#'+file.id),
            $percent = $li.find('.progress .progress-bar');

        //避免重复创建
        if(!$percent.length){
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width:0%">' +
                '</div></div>').appendTo($li).find('.progress-bar');
        }

        $li.find('p.state').text('上传中...');
        $percent.css('width',percentage*100 + '%');
    });
    uploader.on('uploadSuccess',function(file){
        $('#'+file.id).find('p.state').text('已上传');
    });
    uploader.on('uploadError',function(file){
        $('#'+file.id).find('p.state').text('上传出错');
    });
    uploader.on('uploadComplete',function(file){
        $('#'+file.id).find('p.state').fadeOut();
    });*/

        /*$.ajaxFileUpload({
            url:'/upload',
            secureuri:false,
            type:'post',
            fileElementId:'uploadFileName',
            beforeSend:function(){
                var uploadFileName = $('#uploadFileName').val();
                if('' === uploadFileName){
                    alert('请选择');
                    return false;
                }
            },
            success:function(data,status){
                if('success' === data.msg){
                    console.log(data.msg);
                    $('#result').html('');
                    $.get('/getUploadFilePage',function(data){
                        $('#result').html(data);
                    });
                }else{
                    console.log(data.msg);
                }
            },
            error:function(){
                console.log('ddd');
            }
        });
        return false;*/
    };

    ZipFile.prototype.init = function(){
        //压缩JS文件
        $('#inputJsZip').on('click',function(){
            var orgJs = $('#orgJs').val();
            var params = {
                orgJs:orgJs
            };
            $.post('/zipInputJs', params, function(data){
                $('#finalJs').text(data.msg);
            });
        });

        //压缩CSS文件
        $('#inputCssZip').on('click',function(){
            var orgCss = $('#orgCss').val();
            var params = {
                orgCss:orgCss
            };
            $.post('/zipInputCss', params, function(data){
                $('#finalCss').text(data.msg);
            });
        });

        $('.zipJsFile').on('click',function(){
            var $this = $(this),
                filePath = $this.attr('filePath');

            var params = {
                filePath:filePath
            };
            $.post('/zipJsFile', params, function(data){
                if('' !== data.error){
                    $('#finalJsCode').val(data.error);
                }else{
                    $('#finalJsCode').val(data.msg);
                }
            });
        });

        $('.zipFile').on('click',function(){
            var $this = $(this);
            var zipFilePath = $this.attr('zipFilePath');
            var params = {
                zipFilePath:zipFilePath
            };
            $.post('/zipFileDown', params, function(data){
                if('success' === data.msg){
                    var $result = $('#result');
                    $result.html('');
                    $.get('/getPackageJsPage',function(data){
                        $result.html(data);
                    });
                }
            });
        });

        $('#uploadFile').on('click',function(){
            var fileContent = $('#uploadFileName').val();
            if('' === fileContent){
                console.log('请选择文件');
                return ;
            }
            var extendsionIndex = fileContent.lastIndexOf('.') + 1;
            var fileType = fileContent.substring(extendsionIndex,fileContent.length);
            if('js' !== fileType && 'css' !== fileType){
                console.log('只能上传js和css文件');
                return ;
            }
            //上传文件
            upload('static');
        });

        $('#uploadZipFile').on('click',function(){
            var fileContent = $('#uploadFileName').val();
            if('' === fileContent){
                console.log('请选择文件');
                return ;
            }
            var extendsionIndex = fileContent.lastIndexOf('.') + 1;
            var fileType = fileContent.substring(extendsionIndex,fileContent.length);
            if('zip' !== fileType){
                console.log('只能上传zip文件');
                return ;
            }
            //上传文件
            upload('zip');
        });

    };

    module.exports = ZipFile;
});