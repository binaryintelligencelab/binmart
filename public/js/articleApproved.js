$(document).ready(function(){
	var desaproved=$("#article_wrapper .desaproved");
	desaproved.each(function(){
		$(this).on("click",function(){
			$(this).parent("li").fadeOut();						
		});
	});
	
	var approved=$("#article_illustration .form input");
	var filename1="novalide";
	var filename2="novalide";
	var id=$(".color ").attr("id");
	
	approved.each(function(){
		$(this).on("change",function(){
			var elem=$("#article_illustration .form input:checked");
			elem.each(function(){
				if(($(this).val())==="valide"){
					filename1="valide";
				}
				if(($(this).val())==="nonvalide"){
					filename1="novalide"
				}
				if(($(this).val())==="valide2"){
					filename2="valide";
				}
				if(($(this).val())==="nonvalide2"){
					filename2="novalide"
				}
				//console.log("id");
				//console.log(id);
				var submit=$("#submit").attr("href","/admin/approved/"+filename1+"/"+filename2+"/"+id);
				//console.log($(this).val());
			})
		});
	})
	
});
