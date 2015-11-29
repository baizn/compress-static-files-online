/**
 * Created by baizn on 14-10-21.
 */

var fs = require('fs'),
    path = require('path'),
    CleanCSS = require('clean-css'),
    uglifyJs = require("uglify-js");

var ReadFiles = function(){

} ;

/**
 * 读取给定目录下的文件
 * @param filePath 文件路径
 * @param req req
 * @param res res
 */
ReadFiles.prototype.getFiles = function(filePath,req,res){
    var resultObj = {},
        fileType = '';
    (function getAllFiles(root){
        var files = fs.readdirSync(root);
        files.map(function(file){
            console.log('file='+file);
            var pathname = root+'/'+file
                , stat = fs.lstatSync(pathname);

            if (!stat.isDirectory()){
                fileType = path.extname(file);
                if(fileType === '.js' || fileType === '.css'){
                    resultObj[pathname] = file;
                }
            } else {
                getAllFiles(pathname);
            }
        });
    })(filePath);
    /*function getAllFiles(root){
        var res = [] , files = fs.readdirSync(root);
        files.map(function(file){
            var pathname = root+'/'+file
                , stat = fs.lstatSync(pathname);

            if (!stat.isDirectory()){
                //res.push(pathname.replace(filePath,'.'));

                fileType = path.extname(file);
                if(fileType === '.js' || fileType === '.css'){
                    jsCssFiles.push(file);
                    res.push(pathname);
                    resultObj[pathname] = file;
                }
            } else {
                res = res.concat(getAllFiles(pathname));
            }
        });
        return res;
    }
    for(obj in resultObj){
        console.log('obj='+obj);
    }

    var filePathArray = getAllFiles(filePath);*/

    res.render('jsFile',{result:resultObj});
};

/**
 * 读取给定目录下的文件
 * @param filePath 文件路径
 * @param req req
 * @param res res
 */
ReadFiles.prototype.getZipFiles = function(filePath,req,res){
    var resultObj = {},
        zipType = '';
    (function getAllFiles(root){
        var files = fs.readdirSync(root);
        files.map(function(file){
            var pathname = root+'/'+file
                , stat = fs.lstatSync(pathname);

            if (!stat.isDirectory()){
                zipType = path.extname(file);
                if(zipType === '.zip'){
                    resultObj[pathname] = file;
                }
            } else {
                getAllFiles(pathname);
            }
        });
    })(filePath);

    /*function getAllFiles(root){
        var files = fs.readdirSync(root);
        files.map(function(file){
            console.log('file='+file);
            var pathname = root+'/'+file
                , stat = fs.lstatSync(pathname);

            if (!stat.isDirectory()){
                zipType = path.extname(file);
                if(zipType === '.zip'){
                    resultObj[pathname] = file;
                }
            } else {
                getAllFiles(pathname);
            }
        });
    }
    getAllFiles(filePath);*/
    res.render('uploadJsFile',{result:resultObj});

   /* fs.readdir(filePath,function(err,files){
        if(err){
            console.log('读文件错误:'+err);
        }
        var zipTypeFiles = [],
            zipType = '';
        files.map(function(file){

            zipType = path.extname(file);//file.substring(file.length-3);
            if(zipType === '.zip'){
                zipTypeFiles.push(file);
            }
        });
        res.render('uploadJsFile',{result:zipTypeFiles});
    });*/
};


/**
*
* @param req req
* @param res res
*/
ReadFiles.prototype.zipJsFile = function(req,res){
    var filePath = req.body.filePath,
        extension = path.extname(filePath),
        dirName = path.dirname(filePath),
        newFileName = dirName + '/' +
        path.basename(filePath,extension) + '.mini' +
        extension;
    if('.js' === extension){
        //记录用户行为
        zipService.addRecord(req.connection.remoteAddress,Global.JAVASCRIPT_ACTION);

        fs.readFile(filePath, 'utf8',function(err,files){
            if(err){
                res.json({error:err});
            }
            var ast  = uglifyJs.parse(files);
            ast.figure_out_scope();
            var compressor = uglifyJs.Compressor();
            ast = ast.transform(compressor);
            ast.compute_char_frequency();
            ast.mangle_names();
            var finalCode = ast.print_to_string();

            fs.writeFile(newFileName,finalCode,'utf8',function(err){
                if(err){
                    console.log('写文件失败:'+err);
                    res.json({error:err});
                }
            });
            res.json({msg:finalCode});
        });
    }else if('.css' === extension){
        //记录用户行为
        zipService.addRecord(req.connection.remoteAddress,Global.CSS_ACTION);

        fs.readFile(filePath,'utf8',function(err,files){
            if(err){
                console.log('读文件失败...'+err);
                res.json({error:err});
            }
            if('' !== files){
                var finalCode = new CleanCSS().minify(files);
                fs.writeFile(newFileName,finalCode,'utf8',function(err){
                    if(err){
                        console.log('写文件失败:'+err);
                        res.json({error:err});
                    }
                });
                res.json({msg:finalCode});
            }
        });
    }
};

module.exports = ReadFiles;
