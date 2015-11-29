/**
 * Created by baizn on 14-10-24.
 */
define(function(require,exports,module){
   var FileTypeSelect = function(){

   } ;
    FileTypeSelect.prototype.init = function(){

        $.get('/getJsFilePage',function(data){
            $('#fileTypeResult').html(data);
        });

        $('.fileType li a').on('click',function(){
            var $this = $(this);
            $this.parent('li').siblings().removeClass('active');
            $this.parent('li').addClass('active');
            var type = $this.attr('type');
            var $fileTypeResult = $('#fileTypeResult');
            if('jsFile' === type){
                $fileTypeResult.html('');
                $.get('/getJsFilePage',function(data){
                    $fileTypeResult.html(data);
                });
            }else if('cssFile' === type){
                $fileTypeResult.html('');
                $.get('/getCssFilePage',function(data){
                    $fileTypeResult.html(data);
                });
            }
        });
    };
    module.exports = FileTypeSelect;
});