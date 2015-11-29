/**
 * Created by baizn on 14-10-17.
 */
define(function(require,exports,module){
    var Unzip = function(){};

    var down = function(){
        var inputText = $("#inputText").val();
        var params = {
            inputText:inputText
        };
        $.post('/down',params,function(data){
            console.log(data);
        })
    };

    Unzip.prototype.init = function(){
        $.get('/getFileTypePage',function(data){
            $('#result').html(data);
        });

        $('.unzip li a').on('click',function(){
           var $this = $(this);
            $this.parent('li').siblings().removeClass('active');
            $this.parent('li').addClass('active');
            var type = $this.attr('type');
            var $result = $('#result');
            if('jsFileZip' === type){
                $result.html('');
                $.get('/getUploadFilePage',function(data){
                    $result.html(data);
                });
            }else if('jsZip' === type){
                $result.html('');
                $.get('/getFileTypePage',function(data){
                    $result.html(data);
                });
            }else if('packageZip' === type){
                $result.html('');
                $.get('/getPackageJsPage',function(data){
                    $result.html(data);
                });
            }
        });
       //压缩并下载文件
        $('#down').on('click',function(){
            down();
        });

       // down();

    };
    module.exports = Unzip;
});