$(document).ready(function(){
	function deleteSpace(string=""){
		var regex=/\s+/g;
		var newString=string.replace(regex,"");
		return newString;
	}
	setTimeout(function(){
		$("#error").fadeOut();
	},1500);
	$("#table .edit").on("click",function(){
		var newTypicalValue=($(this).parent()).find(".typicalValue").val();
		var lastTypicalValue=$(this).parent().find(".lastTypicalValue").text();
		var typicalId=$(this).parent().attr("id");
		console.log("lastTypicalValue");
		console.log(lastTypicalValue);
		console.log("newTypicalValue");
		console.log(newTypicalValue);
		console.log("typicalId");
		console.log(typicalId);
		if(typicalId.length>0 && lastTypicalValue.length>0 && newTypicalValue.length>0){
			$.ajax("/admin/editTypicalValue/"+lastTypicalValue+"/"+newTypicalValue+"/"+typicalId,{
				dataType:"json",
				error:function(err){
					console.log("err");
				},
				success:function(detail){					
					console.log("detail")																																						
					console.log(detail)
					if(detail.succeed){
						//window.location="/admin/editTypical/"+typicalId;
					}
				}
			});
		}
	});
});