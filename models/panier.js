var mongoose=require("mongoose"),
Schema=mongoose.Schema,
ObjectId=Schema.ObjectId;

var panierSchema=new Schema({
	username:{type:String},
	articleId:{type:ObjectId},
	size:{type:String},
	sizes:{type:Array},
	classe:{type:String},
	categorie:{type:String},
	type:{type:String},
	title:{type:String},
	mark:{type:String},
	quantite:{type:String},
	color:{type:String},
	colorId:{type:String},
	colors:{type:Array},
	price:{type:String},
	filename:{type:Object},
	description:{type:String},
	payphone:{type:Number},
	commande:{type:Boolean,default:false},//true or false
	commandeStep:{type:String}//waitpayement or inway or deliver or delete
});

module.exports=mongoose.model("Panier",panierSchema);