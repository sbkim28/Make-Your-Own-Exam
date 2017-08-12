const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const examVO = mongoose.Schema({
	strTitle:{
		type:String,
		required:true
	},
	strField:{
		type:String,
		required:true
	},
	strDescription:{
		type:String,
		required:true
	},
	intIndex:{
		type:Number,
		min:1,
		required:true,
		validate:{
			validator:function(v){
				return Number.isInteger(v);
			},
			message:'invalid index'
		}
	},
	intLimit:{
		type:Number,
		min:1,
		required:true,
		validate:{
			validator:function(v){
				return Number.isInteger(v);
			},
			message:'invalid limit'
		}
	},
	dateCreated:{
		type:Date,
		default:Date.now()
	},
	list:[{
		question:{
			type:String,
			required:true
		},
		type:{
			type:Number,
			min:0,
			max:5,
			required:true,
			validate:{
				validator:function(v){
					return (Number.isInteger(v) && v!=1);
				},
				message:'invalid type'
			}
		},
		choices:[{
			type:String
		}],
		isMulti:{
			type:Boolean,
			required:true
		},
		caseSensitive:{
			type:Boolean,
			required:true
		},
		isKeyWord:{
			type:Boolean,
			required:true
		},
		containsAll:{
			type:Boolean,
			required:true
		},
		answers:[{
			type:String,
			required:true
		}],
		points:{
			type:Number,
			min:1,
			required:true
		}
	}]
});
module.exports = mongoose.model('exam',examVO);