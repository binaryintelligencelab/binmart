$(document).ready(function(){	
	
	var userLetter=$("#nav_container .user_thumbnail span").eq("0");
	var userLetters=$("#container .user_thumbnail span").eq("0");
	userLetters.css("color","white");
	userLetter.css("color","white");
	
	if($("#letter").val()){
		var input=($("#letter").val()).toLowerCase();
		userLetter.html(input);
		userLetters.html(input);
		
		var allLetter="abcdefghijklmnopkrstuvwxyz";
		console.log(allLetter.indexOf(input));
		if(allLetter.indexOf(input)<6){
			userLetter.css("background","rgba(0,128,255,1)");
			userLetters.css("background","rgba(0,128,255,1)");
		}
		if(allLetter.indexOf(input)>=6 && allLetter.indexOf(input)<14){
			userLetter.css("background","rgba(64,0,64,1)");
			userLetters.css("background","rgba(64,0,64,1)");
		}
		if(allLetter.indexOf(input)>=14 && allLetter.indexOf(input)<21){
			userLetter.css("background","rgba(128,0,255,1)");
			userLetters.css("background","rgba(0,128,192,1)");
		}
		if(allLetter.indexOf(input)>=21){
			userLetter.css("background","rgba(0,128,0,1)");
			userLetters.css("background","rgba(0,128,0,1)");
		}
	}
	
	$("#date").on("change",function(e){
		//console.log($(this).val());
	});
//MISE EN SURBRILLANCE DU LIEN ACTIF
	//console.log(window.location.pathname);
	var path=(window.location.pathname).split("/");
	var refPath="/"+path[1];
	console.log(window.location.pathname);
	var menuLinks=$("#nav_container a");
	//var adminLinks=$("#adminNav a");
	//var coursLinks=$("#menu_box a");
	//var quizLinks=$("#container .main_navigation a");
	/*adminLinks.each(function(){
		if(($(this).attr("href"))===window.location.pathname){
			$(this).css("color","rgba(0,128,192,1)");
			$(this).css("border-bottom","1px solid rgba(0,128,192,1)");
		}
	});
	*/
	
	menuLinks.each(function(){
		var allpath=path[0]+"/"+path[1]+"/"+path[2];
		console.log("allpath");
		console.log(allpath);
		console.log($(this).attr("href"));
		console.log("path[0]")
		console.log(path[1])
		if((($(this).attr("href"))===window.location.pathname)|| ($(this).attr("href"))===allpath || ($(this).attr("href"))===("/"+path[1])){
			console.log("the path is find");
			$(this).css({
				color:"rgba(255,255,255,1)"
			});
			($(this).parent()).addClass("liactive");
		}
	});
	var filterLink=$("#post_wrapper .filter >li a span,#article_wrapper .filter >li a span");
	var lastPath=path[2];	
	
	filterLink.each(function(i,val){
		//console.log($(this).text());
		//console.log("lastPath")
		//console.log(lastPath)
		if(lastPath===$(this).text()){
			console.log('$(this).parent("li")');
			((($(this).parent()).parent()).children("ul")).addClass("visible");
			(($(this).parent()).parent("li")).addClass("visible");
		}		
	});
	
	var insideFilter=$("#post_wrapper .filter .type a,#article_wrapper .filter .type a");
	var locate=window.location.pathname;
	var lastString=locate.substring(0,locate.lastIndexOf("/"));
	console.log("lastString is there");
	var lastInLast=lastString.substring(0,lastString.lastIndexOf("/"));
	console.log(lastString);
	insideFilter.each(function(){
		if((window.location.pathname)===($(this).attr("href")) || lastString===($(this).attr("href")) ||  lastInLast===$(this).attr("href")){
			$(this).addClass("activeFilter");
		}
	});
	
	
	/*
	coursLinks.each(function(){
		if(($(this).attr("href"))===refPath){
			$(this).css({
				color:"rgba(255,255,255,1)"
			});
			($(this).parent()).addClass("liactive");
		}
	});
	*/
	/*
	quizLinks.each(function(){
		if(($(this).attr("href"))===refPath){
			$(this).css({
				color:"rgba(255,255,255,1)"
			});
			($(this).parent()).addClass("liactive");
		}
	});
	*/
	$("#drag_menu").on("click",function(){		
		$("#menu_box").toggleClass("dragIn");
	});	
	
	$("#container .tab").on("click",function(){
		//console.log("elem");
		$("#container .left_aside").toggleClass("slideIn");
		$(this).fadeOut();
		$("#container .closeTab").fadeIn();
		$("#container .left_aside").css({
			overflowY:"scroll"
		})
		
	});	
	
	$("#container .closeTab").on("click",function(){
		$("#container .left_aside").toggleClass("slideIn");
		$(this).fadeOut();
		$("#container .tab").fadeIn();
		$("#container .left_aside").css({
			overflow:"visible"
		})
	});
	
/******Special Animation for Exetat part******/
	$("#aside_left .tab").on("click",function(){
		//console.log("elem");
		$("#aside_left").toggleClass("slideIn");
		$(this).fadeOut();
		$("#aside_left .closeTab").fadeIn();
		$("#aside_left").css({
			overflowY:"scroll"
		})		
	});
	$("#aside_left .closeTab").on("click",function(){
		$("#aside_left").toggleClass("slideIn");
		$(this).fadeOut();
		$("#aside_left .tab").fadeIn();
		$("#aside_left").css({
			overflow:"visible"
		})
	});

	
	/******PARTENER DEALING*******/
	var allPartners=$("#partner img").length;
	
	var screenWidth=$("#partner").width();
	var partenersWidth=allPartners*190;
	
	$("#partner p").css({"width":partenersWidth+"px"});
	
	var totalScreenWidth=parseInt(screenWidth,10);
	var moveWidth=0;
	var difWidth=0;
	function scrollLeft(){
		
		difWidth=parseInt(partenersWidth,10)-totalScreenWidth;
		
		if(difWidth>0&&difWidth<totalScreenWidth){
			//console.log(difWidth);
			moveWidth=parseInt(moveWidth,10)+parseInt(difWidth);
			setTimeout(function(){console.log("first");$("#partner p").css({"left":-moveWidth+"px"});},2000);
			setTimeout(function(){console.log("second");$("#partner p").css({"left":"0px"})},6000);	
			
			setTimeout(function(){
				moveWidth=0;
				totalScreenWidth=parseInt(screenWidth,10);
				scrollLeft();},10000);			
		}
		if(difWidth>totalScreenWidth){
			moveWidth=parseInt(moveWidth,10)+parseInt(screenWidth,10);			
			setTimeout(function(){console.log("third");$("#partner p").css({"left":-moveWidth+"px"});},2000);
			
			totalScreenWidth=parseInt(moveWidth)+totalScreenWidth;
			
			setTimeout(function(){console.log("fourth");scrollLeft();},4000);		
		}
	}
	scrollLeft();
/****Dealing with filter******************/
	var windowWidth=window.screen.availWidth;
	
	var a=$("#post_wrapper .filter li > a");
	var ul=$("#post_wrapper .filter .type");
	a.each(function(){
		
		if($(this).next().hasClass("visible")){
			
			$($(this).parent()).css({
				"borderBottom":"2px solid red"
			});
			
			($(this).next()).removeClass("visible");
		}
		
		$(this).on("click",function(){
			
			console.log("window.screen.availHeight()");
			var width=window.screen.availWidth
			if(width<750){
				if(($(this).next()).hasClass("visible")){
				ul.removeClass("visible");
				$("#post_wrapper .filter li").removeClass("visible");
				$("#post_wrapper .filter li").removeClass("visible");
				($(this).next()).removeClass("visible");				
				//console.log(width);
				$("#post_wrapper .filter:first-child").css({
					"width":"70px"
				});
				$("#post_wrapper .filter:first-child li span").fadeOut();
				
				}else{
					ul.removeClass("visible");
					($(this).next()).addClass("visible");
					($(this).parent()).addClass("visible");
					$("#post_wrapper .filter:first-child").css({
						"width":"200px"
					})
					$("#post_wrapper .filter:first-child li span").fadeIn();
				}
			}else{
				if(($(this).next()).hasClass("visible")){
				ul.removeClass("visible");
				$("#post_wrapper .filter li").removeClass("visible");
				$("#post_wrapper .filter li").removeClass("visible");
				($(this).next()).removeClass("visible");				
				
				}else{
					ul.removeClass("visible");
					($(this).next()).addClass("visible");
					($(this).parent()).addClass("visible");					
				}
			}
						
		});
	});
	/*
	a.each(function(){
		if($(this).next().hasClass("visible")){
			$("#post_wrapper .filter:first-child").css({
					"width":"200px"
			});
			$("#post_wrapper .filter:first-child li span").fadeIn();
		}
		$(this).on("click",function(){
			console.log("window.screen.availHeight()");
			var width=window.screen.availWidth
			if(width<750){
				if(($(this).next()).hasClass("visible")){
				ul.removeClass("visible");
				$("#post_wrapper .filter li").removeClass("visible");
				$("#article_wrapper .filter li").removeClass("visible");
				($(this).next()).removeClass("visible");				
				//console.log(width);
				$("#post_wrapper .filter:first-child").css({
					"width":"70px"
				});
				$("#post_wrapper .filter:first-child li span").fadeOut();
				
				}else{
					ul.removeClass("visible");
					($(this).next()).addClass("visible");
					($(this).parent()).addClass("visible");
					$("#post_wrapper .filter:first-child").css({
						"width":"200px"
					})
					$("#post_wrapper .filter:first-child li span").fadeIn();
				}
			}else{
				if(($(this).next()).hasClass("visible")){
				ul.removeClass("visible");
				$("#post_wrapper .filter li").removeClass("visible");
				$("#article_wrapper .filter li").removeClass("visible");
				($(this).next()).removeClass("visible");				
				
				}else{
					ul.removeClass("visible");
					($(this).next()).addClass("visible");
					($(this).parent()).addClass("visible");					
				}
			}
						
		});
	});
	*/
});
