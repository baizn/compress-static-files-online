/**
 * Created by baizn on 14-10-29.
 */
var Global = function(){

};

Global.REMARK = '进入在线压缩页面后，默认显示的是在线压缩javascript页面';
/******************************记录用户进入了那些页面******************************/
Global.ONLINE_FILE_SELECT = {
    CODE:'1000',
    DESC:'进入在线输入内容压缩页面'
};

//进入在线输入javascript压缩页面
Global.ONLINE_JS_PAGE = {
    CODE:'1001',
    DESC:'进入在线输入javascript压缩页面'
};

//进入在线输入css压缩页面
Global.ONLINE_CSS_PAGE = {
    CODE:'1002',
    DESC:'进入在线输入css压缩页面'
};

//进入单文件上传压缩页面
Global.SIGNLE_FILE_PAGE = {
    CODE:'1003',
    DESC:'进入单文件上传压缩页面'
};

//进入ZIP压缩包上传压缩页面
Global.ZIP_PACKAGE_PAGE = {
    CODE:'1004',
    DESC:'进入ZIP压缩包上传压缩页面'
};

/******************************记录用户执行了哪些操作******************************/
//在线压缩javascript
Global.INPUT_JS_ACTION = {
    CODE:'2000',
    DESC:'在线压缩javascript'
};

//在线压缩CSS
Global.INPUT_CSS_ACTION = {
    CODE:'2001',
    DESC:'在线压缩CSS'
};

//上传文件
Global.UPLOAD_FILE_ACTION = {
    CODE:'2002',
    DESC:'上传文件'
};

//javascript文件压缩
Global.JAVASCRIPT_ACTION = {
    CODE:'2003',
    DESC:'上传javascript文件压缩'
};

//css文件压缩
Global.CSS_ACTION = {
    CODE:'2004',
    DESC:'上传css文件压缩'
};

//zip包压缩
Global.PACKAGE_ACTION = {
    CODE:'2005',
    DESC:'上传zip包压缩'
};

module.exports = Global;
