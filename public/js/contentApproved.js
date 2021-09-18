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
});
