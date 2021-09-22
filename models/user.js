var mongoose=require("mongoose"),
Schema=mongoose.Schema;

var userSchema=new Schema({
	name:{type:String},
	username:{type:String},
	surname:{type:String},
	telephone:{type:String},
	email:{type:String},
	password:{type:String},
	password_confirmation:{type:String},
	role:{type:String,default:"member"},
	solde:{type:Number},
	join:{type:String},
	town:{type:String},
	commune:{type:String}
});

module.exports=mongoose.model("User",userSchema,"User");
