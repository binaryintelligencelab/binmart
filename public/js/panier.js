$(document).ready(function(){
	var input=$(".article_basket >input");
	
	function priceControl(){
	var price=0;
	input.each(function(){		
		price+=parseFloat((($(this).parent()).find("#price")).text());
		$("#cost").text(price);
		var articleCost=$("#cost").text();
		if(parseFloat(articleCost)>0){
			$(".commande").fadeIn();
		}else{
			$(".commande").fadeOut();
		}
		$(this).on("change",function(){
			var checkedInput=$(".article_basket input:checked");
			var newPrice=0;
			if(checkedInput.length>0){
				checkedInput.each(function(){				
					newPrice+=parseFloat((($(this).parent()).find("#price")).text());
					console.log(newPrice);
					console.log("price");
					let num=checkedInput.length;
					let allNum=num+" Articles";
					$("#cost").text(newPrice);
					$(".art_number").text(allNum);
				});
			}else{
				$("#cost").text("0");
				$(".art_number").text("0");
			}
			articleCost=$("#cost").text();
			if(parseFloat(articleCost)>0){
				$(".commande").fadeIn();
			}else{
				$(".commande").fadeOut();
			}
			
			
		});
	});
	}
	priceControl();
	                                   
	var articleCost=$("#cost").text();
	console.log("articleCost");
	console.log(articleCost);
	
	
	function spanControl(){
		
	
	$("p.colors span").on("click",function(){
		if($(this).hasClass("active")){
			($(this).parent()).find("span.inactive").slideUp();
			($(this).parent()).find("span.active").css({
				marginBottom:"0px"
			});
			(($(this).parent()).parent().find("span.plus")).css({display:"flex"});
			($(this).parent()).parent().find("span.moins").css({display:"none"});
			($(this).parent()).parent("li").css({
				display:"flex",
				alignItems:"center"
			});
		}
		if($(this).hasClass("inactive")){
			($(this).parent()).find("span").removeClass("active");
			($(this).parent()).find("span").addClass("inactive");
			$(this).removeClass("inactive");
			$(this).addClass("active");
			($(this).parent()).find("span.inactive").slideUp();
			($(this).parent()).find("span.active").css({
				marginBottom:"0px"
			});
			($(this).parent().parent()).find("span.plus").css({display:"flex"});
			($(this).parent().parent()).find("span.moins").css({display:"none"});
			($(this).parent("li")).parent().css({
				display:"flex",
				alignItems:"center"
			});
		}
	});
}

spanControl();
	
	$("span.plus").on("click",function(){
		($(this).parent()).find("span.inactive").slideDown();
		($(this).parent()).find("span.active").css({
			marginBottom:"0.5em"
		});
		$(this).css({display:"none"});
		($(this).parent()).css({
			display:"flex",
			alignItems:"flex-start"
		});
		($(this).parent()).find("span.moins").css({display:"flex"});
		
	});
	
	$("span.moins").on("click",function(){
		($(this).parent()).find("span.inactive").slideUp();
		$(this).css({display:"none"});
		($(this).parent()).find("span.active").css({
			marginBottom:"0px"
		});
		($(this).parent()).find("span.plus").css({display:"flex"});
		($(this).parent("li")).css({
			display:"flex",
			alignItems:"center"
		});
	});
	
	
	
	$(".edit").on("click",function(){
		var id=$(this).attr("id");
		var size=$(this).parent().parent().find("select").val();
		var color=$(this).parent().parent().find("p.colors span.active").attr("id");
		var quantite=$(this).parent().parent().find("input.quantite").val();
		console.log("is clicked");
		var elem=$(this);
		$.ajax({
			url:"/user/editPanier/size",
			type:"POST",
			data:"id="+id+"&size="+size,
			dataType:"json",
			success:function(data){
				console.log("data");
				console.log(data);
				var newSizes=data.panier.sizes;
				if(data.sizeChanged){
					console.log("size is changed");
				}
				var sizeOption=elem.parent().parent().find("#size");
				sizeOption.html("");
				var allSize=[];
				for(var i=0; i<newSizes.length;i++){
					allSize.push(newSizes[i]);
					if(newSizes[i].size===size){
						var selectedOption=$("<option selected value="+newSizes[i].size+">"+newSizes[i].size+"</option>");
						sizeOption.append(selectedOption);
					}else{
						var option=$("<option value="+newSizes[i].size+">"+newSizes[i].size+"</option>");
						sizeOption.append(option);
					}				
				}
				if(allSize.length===newSizes.length){
					$.ajax({
						url:"/user/editPanier/color",
						type:"POST",
						data:"id="+id+"&color="+color,
						dataType:"json",
						success:function(color_data){			
							var newColors=color_data.panier.colors;
							var colorSpan=elem.parent().parent().find("p.colors");
							colorSpan.html("");
							var allColors=[];
							for(var i=0; i<newColors.length;i++){
								allColors.push(i);
								if(newColors[i].color===color){
									var activeColor=$("<span style='background:"+color+"' class='active' id='"+color+"'></span>")
									colorSpan.append(activeColor);
								}else{
									var spanColor=$("<span style='background:"+newColors[i].color+"' class='inactive' id='"+newColors[i].color+"'></span>")
									colorSpan.append(spanColor);
								}								
							}
							spanControl();
							if(allColors.length===newColors.length){
								$.ajax({
									url:"/user/editPanier/quantite",
									type:"POST",
									data:"id="+id+"&quantite="+quantite,
									dataType:"json",
									success:function(quanta){
											console.log("elem");
										var editedBox=elem.parent().parent().parent().find("span.editedBox");
										if(quanta.quantiteChanged){
											elem.parent().parent().find("input.quantite").value=quanta.panier.quantite;
											elem.parent().parent().find("#price").text(quanta.panier.price);
											priceControl();
											editedBox.fadeIn();
											editedBox.css({
												display:"flex"
											});
											
											
											editedBox.find("em.prixModif,em.quantiModif").css({
												display:"inline"
											});
										}
										if(color_data.colorChanged){
											editedBox.fadeIn();
											editedBox.css({
												display:"flex"
											});
											
											editedBox.find("em.colorModif").css({
												display:"inline"
											});
										}
										if(data.sizeChanged){
											editedBox.fadeIn();
											editedBox.css({
												display:"flex"
											});
											editedBox.fadeIn();
											editedBox.find("em.sizeModif").css({
												display:"inline"
											});
										}
										setTimeout(function(){
											editedBox.fadeOut();
											editedBox.find("em.sizeModif").fadeOut();
											editedBox.find("em.colorModif").fadeOut();
											editedBox.find("em.prixModif,em.quantiModif").fadeOut();											
										},3000);
									}		
								});
							}
						}		
					})
				}
							
			}
		});
		
	});
	
		
	$(".delete").on("click",function(){				
		$(this).parent().parent().parent().find(".deleteBox").fadeIn();
		$(this).parent().parent().parent().find(".deleteBox").css({
			display:"flex",
			justifyContent:"center",
			alignItems:"center"
			});
		});	
	$("span.deleteBox i.no").on("click",function(){
	$(this).parent().parent().parent().find(".deleteBox").fadeOut();	});		
	setTimeout(function(){		$("span.successBox").fadeOut();	},2000);

	
	$("#post_wrapper .commande").on("click",function(){
		$("#payement").fadeIn();
		var allprice=$("#cost").text()+" $";
		$("#payement .choosed .all_price").text(allprice);
		
	});
	
	$("#payement .cancel_all span").on("click",function(){		
		$("#payement").fadeOut();
		$("#payement .phone").val("");
	});
	
	$("#operator_submit").on("submit",function(e){
		e.preventDefault();
		var price=$("#payement .all_price").text();
		var phone=$("#payement .phone").val();
		var priceNumber=parseFloat(price);
		var phoneNumber=parseFloat(phone);
		$("em.required, em.badformat").css({
			display:"none"
		});
		
		function checkPhone(validePhone,price){
			console.log("validePhone");
			console.log(validePhone);
			let phoneFlag=validePhone.substr(1,2);
			if(phoneFlag==="81"||phoneFlag==="82"||phoneFlag==="99"||phoneFlag==="97"||phoneFlag==="84"||phoneFlag==="85"||phoneFlag==="89"){
				$(".submit").css({
					display:"none"
				});
				$("#user_commande").attr("action","/user/commande/"+validePhone+"/"+price);
				$("#user_commande").submit();
												
				
				//$("#operator_submit").submit();
			}else{
				$("em.required").css({
					display:"none"
				});
				$("em.badformat").css({
					display:"inline-block"
				});
				return false;
			}
		}
		
		if(priceNumber>0 && phoneNumber>0 && !isNaN(priceNumber) && !isNaN(phoneNumber)){				
				var phonePattern=/^\d{9}$/;
				var phonePatter2=/^\d{10}$/;
				var phonePatter3=/^\+?\d{12}$/;
				
				if(phone.match(phonePattern)){
					phone=0+phone;
					checkPhone(phone,priceNumber);
				}
				else if(phone.match(phonePatter2)){
					if(phone.indexOf("0")===0){
							phone=phone;
							checkPhone(phone,priceNumber);
					}
					else{
						$("em.required").css({
							display:"inline-block"
						});
						return false;
					}
				}
				else if(phone.match(phonePatter3)&&phone.indexOf("+")===0){
					var prefix=phone.substring(1,4);
					if(prefix==="243"){
						phone=phone.substring(4);
						phone=0+phone;
						checkPhone(phone,priceNumber);						
					}else{
						$("em.required").css({
								display:"inline-block"
							});
							return false;
					}					
				}
				else if(phone.match(phonePatter3)&&phone.length===12){
					var prefix=phone.substring(0,3);
						if(prefix==="243"){
							phone=phone.substring(3);
							phone=0+phone;
							checkPhone(phone,priceNumber);							
						}else{
							$("em.required").css({
								display:"inline-block"
							});
							return false;
						}
				}
				else{
					$("em.required").css({
							display:"inline-block"
					});
					return false;					
				}
		}else{
			$("em.required").css({
				display:"inline-block"
			});
			return false;
		}		
	});
	
	$("#commande_error").fadeIn();
	setTimeout(function(){
		$("#commande_error").fadeOut();
	},5000);
	
	
});
