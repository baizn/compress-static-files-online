/**
 * Created by baizn on 14-10-29.
 */
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/nodetest');

var Schema = mongoose.Schema,
    ZipSchema = new Schema({
        ip:String,
        code:String,
        action:String,
        accessTime:{
            type:String,
            default:new Date()
        },
        remark:{
            type:String,
            default:''
        }
});

exports.ZipModel = mongoose.model('ZipModel',ZipSchema);
