var mongoose=require("mongoose"),
Schema=mongoose.Schema;

var detailSchema=new Schema({
	name:{type:String},
	val:{type:Array},
	classe:{type:String},
	category:{type:String}
});

module.exports=mongoose.model("articleDetail",detailSchema);