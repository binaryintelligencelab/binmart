

var mongoose=require("mongoose"),
Schema=mongoose.Schema;

var Article=new Schema({
	classe:{type:String},
	age:{type:String},
	categorie:{type:String},
	type:{type:String},
	color:{type:Object},
	colors:{type:Object},
	
	
	
	
	
	
	name:{type:String},
	mark:{type:String},
	size:{type:Array},
	description:{type:String},
	detailPrice:{type:Number,default:0},
	wholePrice:{type:Number,default:0},
	wholeNumber:{type:Number,default:0},
	
	definitiveName:{type:String},
	definitiveMark:{type:String},
	definitiveSize:{type:Array},
	definitiveDescription:{type:String},
	definitivePrice:{type:Number,default:0},
	definitiveWholePrice:{type:Number,default:0},
	definitiveWholeNumber:{type:Number,default:0},
	
	boutiName:{type:String},
	boutiUsername:{type:String},
	boutiTown:{type:String},
	boutiCommune:{type:String},
	boutiAvenue:{type:String},
	boutiNum:{type:String},
	flag:{type:Boolean,default:true},//private,public flag made active an article
	views:{type:Number,default:0},
	commande:{type:Number,default:0},
	chart:{type:Boolean,default:false},
	dayCount:{type:Number,default:0},
	boost:{type:Boolean,default:false},
	boostPlace:{type:String},
	boostThumb:{type:String},
	boostGrade:{type:Number,default:0},
	filename1:{type:String},
	filename2:{type:String},
	filename1Edited:{type:String},
	filename2Edited:{type:String},
	approved:{type:Boolean,default:false},//principale color approved
	approvedcontent:{type:Boolean,default:false},//content approved
	contentEdited:{type:Boolean,default:true},
	time:{type:String},
	date:{type:String},	
	dateFormat:{type:String},
	edited:{type:Boolean,default:true},//content edited
	timeEdited:{type:String}
});

module.exports=mongoose.model("Article",Article,"Article");