var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var superAdmin=new Schema({
	username:{type:String},
	password:{type:String},
	token:{type:String},
	role:{type:String}
});

/*
var newAdmin=new superAdmin({
	username:"adelinesompo",
	password:"12345678910",
	token:"bitoven"
});

*/

module.exports=mongoose.model("superAdmin",superAdmin);

