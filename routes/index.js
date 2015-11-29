var express = require('express'),
    formidable = require('formidable'),
    path = require('path'),
    fs = require('fs'),
    UglifyJs = require("uglify-js"),
    CleanCSS = require('clean-css'),
    AdmZip = require('adm-zip'),
    ReadFile = require('../service/readFiles'),
    Global = require('../service/Global'),
    readJsFile = new ReadFile(),
    util = require('util'),
    ZipService = require('../service/zipService'),
    zipService = new ZipService();
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '解压缩文件' });
});

/**
 * 上传文件
 * @param req
 * @param res
 */
router.post('/upload',function(req,res){
    //记录用户行为
    zipService.addRecord(req.connection.remoteAddress,Global.UPLOAD_FILE_ACTION);

    var form = new formidable.IncomingForm(),
        files = [],
        fields = [];
    form.uploadDir = path.join(path.dirname(__dirname), 'files');
    form.keepExtensions = true;
    form.on('field',function(field,value){
        fields.push([field,value]);
        }).on('file',function(field,file){
            files.push([field, file]);
        }).on('end',function(){
            res.send({msg:'success'});
        });
    form.parse(req,function(err,field,files){
        if(err){
            res.send({msg:err});
        }
        fs.renameSync(files.uploadFile.path,path.dirname(files.uploadFile.path) + '/' +
            files.uploadFile.name);
    });
});

/**
 * 返回在线输入内容压缩页面
 */
router.get('/getFileTypePage',function(req,res){
    //记录用户行为
    zipService.addRecord(req.connection.remoteAddress,Global.ONLINE_FILE_SELECT,Global.REMARK);

    res.render('fileType');
});

/**
 * 返回上传单个文件页面
 */
router.get('/getUploadFilePage',function(req,res){
    //记录用户行为
    zipService.addRecord(req.connection.remoteAddress,Global.SIGNLE_FILE_PAGE);

    readJsFile.getFiles(path.join(path.dirname(__dirname), '/files'),req,res);
});

/**
 * 返回上传压缩包页面
 */
router.get('/getPackageJsPage',function(req,res){
    //记录用户行为
    zipService.addRecord(req.connection.remoteAddress,Global.ZIP_PACKAGE_PAGE);

    readJsFile.getZipFiles(path.join(path.dirname(__dirname), '/files'),req,res);
});

/**
 * 返回JS在线输入压缩页面
 */
router.get('/getJsFilePage',function(req,res){
    //记录用户行为
    zipService.addRecord(req.connection.remoteAddress,Global.ONLINE_JS_PAGE);

    res.render('inputJs');
});

/**
 * 返回CSS在线输入压缩页面
 */
router.get('/getCssFilePage',function(req,res){
    //记录用户行为
    zipService.addRecord(req.connection.remoteAddress,Global.ONLINE_CSS_PAGE);

    res.render('inputCssFile');
});

/**
 * 压缩上传的文件
 */
router.post('/zipJsFile',function(req,res){
    readJsFile.zipJsFile(req,res);
});

/**
 * 在线压缩输入的js内容
 */
router.post('/zipInputJs',function(req,res){
    //记录用户行为
    zipService.addRecord(req.connection.remoteAddress,Global.INPUT_JS_ACTION);

    var orgJsFile = req.body.orgJs;
    if('' !== orgJsFile){
        var ast  = UglifyJs.parse(orgJsFile);
        ast.figure_out_scope();
        var compressor = UglifyJs.Compressor();
        ast = ast.transform(compressor);
        ast.compute_char_frequency();
        ast.mangle_names();
        var final_code = ast.print_to_string();
        res.json({msg:final_code});
    }
});

/**
 * 在线压缩输入的css内容
 */
router.post('/zipInputCss',function(req,res){
    //记录用户行为
    zipService.addRecord(req.connection.remoteAddress,Global.INPUT_CSS_ACTION);

    var orgCssFile = req.body.orgCss;
    if('' !== orgCssFile){
        var minimized = new CleanCSS().minify(orgCssFile);
        res.json({msg:minimized});
    }
});

/**
 * 处理zip包中js和css文件的的压缩，其他类型文件保存不变
 */
router.post('/zipFileDown',function(req,res){
    //记录用户行为
    zipService.addRecord(req.connection.remoteAddress,Global.PACKAGE_ACTION);

    var fileType = '',
        entryValue = '',
        zipFilePath = req.body.zipFilePath,
        dirZipName = path.dirname(zipFilePath), //返回路径的所在的文件夹名称
        zip = new AdmZip(zipFilePath),
        zipEntries = zip.getEntries(),
        newZip = new AdmZip(),
        extension = path.extname(zipFilePath),
        zipNewFileName = path.basename(zipFilePath,extension) + '.mini' + extension;
    var startTime = new Date().getTime();

    zipEntries.forEach(function(entry){
        if(entry.isDirectory){
            newZip.addFile(entry.entryName,new Buffer(0));
        }else{
            fileType = path.extname(entry.name);
            if('.js' === fileType || '.css' === fileType){
                entryValue = zip.readAsText(entry);
                if('.js' === fileType){
                    var ast  = UglifyJs.parse(entryValue);
                    ast.figure_out_scope();
                    var compressor = UglifyJs.Compressor();
                    ast = ast.transform(compressor);
                    ast.compute_char_frequency();
                    ast.mangle_names();
                    var final_code = ast.print_to_string(); // get compressed code

                    //addFile的第二个参数为Buffer类型，需要通过new Buffer(string,charset)构造
                    newZip.addFile(entry.entryName,new Buffer(final_code,'UTF-8'));
                }else if('.css' === fileType){
                    var finalCode = new CleanCSS().minify(entryValue);
                    newZip.addFile(entry.entryName,new Buffer(finalCode,'UTF-8'));
                }
            }else{
                newZip.addFile(entry.entryName,entry.getData());
            }
        }
    });
    newZip.writeZip(dirZipName + '/' + zipNewFileName);

    var endTime = new Date().getTime(),
        totalTime = endTime - startTime;
    console.log('共耗时秒:'+ totalTime/1000);
    console.log('共耗时分:'+ totalTime/60000);

    res.json({msg:'success'});
});

module.exports = router;
