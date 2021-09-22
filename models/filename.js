var mongoose=require("mongoose"),
Schema=mongoose.Schema;

var filenameSchema=new Schema({
	filename:{type:Array}
});

module.exports=mongoose.model("Filename",filenameSchema,"Filename");