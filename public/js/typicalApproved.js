$(document).ready(function(){
	var colors=$("#article_wrapper .color li");
	var section=$("#article_wrapper section");
	colors.each(function(){
		$(this).on("click",function(){
		var clickedId=$(this).attr("id");
		var elem=$(this);
		section.each(function(){
			if(clickedId===$(this).attr("id")){				
				
				if(!($(this).hasClass("activeted"))){
					section.fadeOut();
					section.removeClass("activeted");
					$(this).fadeIn();
					$(this).addClass("activeted");
				}
			}
			});			
		});
	});
	var size=$(".user_size");
	size.each(function(index,elem){
		$(this).on("click",function(){
			size.removeClass("sizeSelected");			
			if(!($(this).hasClass("sizeSelected"))){
				$(this).addClass("sizeSelected");
				var activeSection=$("section.activeted .connect");
			}
		});
	});
	
	var illustration=$("#article_illustration .thumbnail li");
	illustration.each(function(){
		$(this).on("click",function(){
			$(this).parent("ul").children("li").removeClass("active");
			//illustration.removeClass("active");
			$(this).addClass("active");
			var background=$(this).attr("style");
			var newStyle=background.substring(background.indexOf(":")+1);
			var li=$(this).parent("ul").prev("li");			
			li.css({
				backgroundImage:newStyle
			});
			
		})
		
	});
	setTimeout(function(){
		$(".addToCart >span").fadeOut();
	},2000);
	
	
	var a=$("#article_wrapper .filter li > a");
	var ul=$("#article_wrapper .filter .type");
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
				$("#article_wrapper .filter li").removeClass("visible");
				$("#article_wrapper .filter li").removeClass("visible");
				($(this).next()).removeClass("visible");				
				//console.log(width);
				$("#article_wrapper .filter:first-child").css({
					"width":"70px"
				});
				$("#article_wrapper .filter:first-child li span").fadeOut();
				
				}else{
					ul.removeClass("visible");
					($(this).next()).addClass("visible");
					($(this).parent()).addClass("visible");
					$("#article_wrapper .filter:first-child").css({
						"width":"200px"
					})
					$("#article_wrapper .filter:first-child li span").fadeIn();
				}
			}else{
				if(($(this).next()).hasClass("visible")){
				ul.removeClass("visible");
				$("#article_wrapper .filter li").removeClass("visible");
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
	/*
	var typicalName=$("#typicalName").val();
	var typicalValue=$("#typicalValue").val();
	var articleId=$("#articleId").text();
	var articleClasse=$("#articleClasse").text();
	var articleCategorie=$("#articleCategory").text();
	if(typicalName.length>0){
		$.ajax("/admin/gettypicalvalues/"+articleClasse+"/"+articleCategorie+"/"+typicalName,{
				dataType:"json",
				error:function(err){
					console.log("err");
					console.log(err);
				},
				success:function(response){
					if(response.typical){
						var typical=response.typical;
						var allValue=typical.val;
						for(var i=0; i<allValue.length;i++){
							$("#typicalValue").append("<option>"+allValue[i]+"</option>")
						}
					}					
				}
			});
	}
	$("#typicalName").on("change",function(){
		$("#typicalValue").html("");
		console.log("is done");
		var actualName=$(this).val();
		if(actualName.length>0){
			$.ajax("/admin/gettypicalvalues/"+articleClasse+"/"+articleCategorie+"/"+actualName,{
				dataType:"json",
				error:function(err){
					console.log("err");
					console.log(err);
				},
				success:function(response){
					if(response.typical){
						var typical=response.typical;
						var allValue=typical.val;
						for(var i=0; i<allValue.length;i++){
							$("#typicalValue").append("<option>"+allValue[i]+"</option>")
						}
					}					
				}
			});
		}
	});
	*/
	$(".caracteristique .submitTypical").on("click",function(){
		var newTypicalName=(($(this).parent()).find("#typicalName")).val();
		var newTypicalValue=(($(this).parent()).find("#typicalName")).val();
		var articleId=$("#typicalId").text();		
		
		
		if(newTypicalName.length>0 && newTypicalValue.length>0 && articleId){
			$.ajax({
				url:"/admin/addarticletypical/"+articleId+"/"+articleClasse+"/"+articleCategory,
				dataType:"json",
				type:"POST",
				data:"typicalName="+newTypicalName+"&typicalValue="+newTypicalValue,
				error:function(err){
					console.log("err");
					console.log(err);
				},
				success:function(response){
					console.log("response");
					console.log(response);
					if(response.modified){
						var allName=$(".caracteristique .alltypical input:first-child");
						allName.each(function(){
							if(($(this).val())===newTypicalName){
								($(this).next()).val(newTypicalValue);
							}
						});
					}
					if(response.newadd){
						var data=response.typical;
						$(".caracteristique").append("<li class='alltypical' id='"+data._id+"'><input type='text' value='"+newTypicalName+"'/> : <input class='typicalvaluespan' value='"+newTypicalValue+"'/><a class='edit'>E</a><a class='remove'>D</a></li>");
						$("#typicalName").val("");
						$("#typicalValue").val("");
						editarticletypical();
						removearticletypical()
					}
					if(response.reload){
						window.location="/login";
					}
										
				}
			});
		}else{
			if(!newTypicalName){
				$(".caracteristique form label span.name_required").slideDown();
				var set=setTimeout(function(){
					$(".caracteristique form label span.name_required").slideUp();
				},5000);
			}
			if(!newTypicalValue){
				$(".caracteristique form label span.value_required").slideDown();
				var secondset=setTimeout(function(){
					$(".caracteristique form label span.value_required").slideUp();
				},5000);
			}
		}		
		
	});

	
	
});
