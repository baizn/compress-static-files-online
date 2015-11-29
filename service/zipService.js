/**
 * Created by baizn on 14-10-29.
 */
var model = require('./zipModel'),
    ZipModel = model.ZipModel;

var ZipService = function(){

};

ZipService.prototype.addRecord = function(userIp,action,remark){
    var ZipEntity = new ZipModel({
       ip: userIp,
        code:action.CODE,
        action:action.DESC,
        remark:remark
    });
    ZipEntity.save(function(err,docs){

    });
};

module.exports = ZipService;