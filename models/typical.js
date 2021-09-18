var mongoose=require("mongoose"),
Schema=mongoose.Schema,
ObjectId=Schema.ObjectId;

var typicalSchema=new Schema({
	articleId:{type:ObjectId},
	typicalName:{type:String},
	typicalValue:{type:Array},
	definitiveTypicalName:{type:String},
	definitiveTypicalValue:{type:Array},
	edited:{type:Boolean,default:true}
});

module.exports=mongoose.model("typicalSchema",typicalSchema);