var express=require("express"),
mongoose=require("mongoose"),
config=require("./server/configure"),
app=express();

app.set("port",process.env.PORT||5000);
app.set("views",__dirname+"/views");
app=config(app);

//mongoose.connect("mongodb+srv://binaryintelligencelab:sV7O9N2sobV0xJcB@cluster0.libcr.mongodb.net/binmartdatabase?retryWrites=true&w=majority");
mongoose.connect(process.env.DATABASE_URI);
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