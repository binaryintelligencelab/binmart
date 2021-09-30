var express=require("express"),
mongoose=require("mongoose"),
config=require("./server/configure"),
app=express();
var Article=require("./models/article");
Article.find({},function(err,article){
	console.log("bot");
	console.log(article);
	console.log(err);
});

app.set("port",process.env.PORT);
app.set("views",__dirname+"/views");
app=config(app);

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connection.on("open",function(){
	console.log("app is connected"); 
});


app.listen(app.get("port"),function(){
	console.log("The server is running on port "+app.get("port"));
});



/*
app.listen({
	port:"3000",
	host:"localhost"
	//host:"192.168.173.1"
},function(){
	console.log("user is connected to the app");
});
*/