var mongoose=require("mongoose"),
Schema=mongoose.Schema;

var adminSchema=new Schema({
	name:{type:String},
	username:{type:String},
	adminname:{type:String},
	surname:{type:String},
	rccm:{type:String},
	telephone:{type:String},
	province:{type:String},
	town:{type:String},
	commune:{type:String},
	quarter:{type:String},
	
	avenue:{type:String},
	numero:{type:Number},
	solde:{type:Number,default:0},
	password:{type:String},
	password_confirmation:{type:String},
	adresse:{type:String},
	role:{type:String},
	check:{type:String,default:false},
	join:{type:String},
	time:{type:String},
	date:{type:String},
	dateFormat:{type:String}
});

module.exports=mongoose.model("Admin",adminSchema,"Admin");