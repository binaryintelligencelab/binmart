var mongoose=require("mongoose"),
Schema=mongoose.Schema,
ObjectId=Schema.ObjectId;

var colorSchema=new Schema({
	name:{type:String},
	filename1:{type:String},
	filename2:{type:String},
	filename1Edited:{type:String},
	filename2Edited:{type:String},
	principal:{type:Boolean,default:false},
	articleId:{type:ObjectId},
	approved:{type:Boolean,default:false},
	edited:{type:Boolean,default:true},
	time:{type:String},
	date:{type:String},
	dateFormat:{type:String},
	active:{type:Boolean,default:true}
});

module.exports=mongoose.model("Color",colorSchema,"Color");