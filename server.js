var express=require("express"),
mongoose=require("mongoose"),
config=require("./server/configure"),
app=express();

app.set("port",process.env.PORT||5000);
app.set("views",__dirname+"/views");
app=config(app);

mongoose.Promise=global.Promise;


//mongoose.connect("mongodb://localhost/binmart",{useNewUrlParser: true,useFindAndModify: true,useCreateIndex: true,keepAlive: 1, useUnifiedTopology: true});
//mongoose.connect("mongodb://localhost/binmart");
mongoose.connect("mongodb+srv://binmartdatabase:e5JL0khoWCV33VeH@cluster0.libcr.mongodb.net/binmartdatabase?retryWrites=true&w=majority",{useNewUrlParser: true,useFindAndModify: true,useCreateIndex: true,keepAlive: 1, useUnifiedTopology: true});

mongoose.connection.on("open",function(){
	console.log("app is connected"); 
});
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected through app termination');
		process.exit(0);
	});
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