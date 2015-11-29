## compress-static-files-online
### 工具介绍
静态文件在线压缩工具，采用Node.js和Jade开发，支持以下文件的压缩：

>*  JavaScript和CSS代码片段
>* 上传单个JavaScript或CSS文件压缩并下载
>* 上传ZIP包压缩并下载（只压缩ZIP包中的JavaScript和CSS文件）

虽然在线压缩工具有很多，但大都不支持压缩ZIP包中的文件，针对这个需求，使用NodeJs开发了这么一个简单的小工具，里面包括两套界面。

### 安装使用
```
git clone https://github.com/baizn/compress-static-files-online.git

npm install

npm start
```

启动项目如果报错的话，请检查是否缺少以下的包：

>* adm-zip
>* body-parser
>* cookie-parser
>* formidable
>* fs
>* path
>* uglify-js
>* util
>* zlib

如果经过以上步骤还存在问题，请在Github上留言。
