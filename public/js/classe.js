
$(document).ready(function(){
	function deleteSpace(string=""){
		var regex=/\s+/g;
		var newString=string.replace(regex,"");
		return newString;
	}	
	$.ajax("/admin/classe",{
		dataType:"json",
		error:function(err){
			console.log(err)
		},
		success:function(classe){
			var allClass=classe.classe;
			for(var i=0; i<allClass.length;i++){				
				var bodyClass=$("#bodyClasse").text();
				if(bodyClass===allClass[i]){
					var selected=$("<option selected value="+allClass[i]+">"+allClass[i]+"</option>");
				}else{
					var option=$("<option value="+allClass[i]+">"+allClass[i]+"</option>");
				}				
				$("#classe").append(selected);
				$("#classe").append(option);				
			}
			
			var lastClassRecord=$("#classe").val();
					
			var lastCategory=$("#bodyCategorie").text();
			var lastTypeRecord=$("#bodyType").text();		
			if(lastClassRecord.length>0){
				$("#category").removeAttr("disabled");
				var bodyCategorie=$("#bodyCategorie").text();							
					$.ajax("/admin/findCategory/"+lastClassRecord,{
						dataType:"json",
						error:function(err){
							console.log("error");							
						},
						success:function(categories){
							$("#category").html("");
							$("#category").append($("<option value=''></option>"));
							for(var category in categories){
								if(category===bodyCategorie){
									var selectedCategorie=$("<option selected value='"+category+"'>"+category+"</option>");
								}
								var allCategories=$("<option value='"+category+"'>"+category+"</option>");
								$("#category").append(allCategories);
								$("#category").append(selectedCategorie);
							}										
						}
					});				
			}
			
			if(lastClassRecord.length>0 &&lastCategory.length>0){
				$("#type").removeAttr("disabled");
				$("#type").val("");
				$.ajax("/admin/findType/"+lastClassRecord+"/"+lastCategory,{
					dataType:"json",
					error:function(err){
						console.log("error");
					},
					success:function(type){
						console.log(type);
						$("#type").html("");
						$("#type").append($("<option value=''></option>"));
						console.log("type.length");
						console.log(type.length);
						for(var i=0; i<type.length;i++){
							var allType=$("<option value="+type[i]+">"+type[i]+"</option>");
							$("#type").append(allType);
						}
					}
				});
			}
			if(lastClassRecord.length>0 &&lastCategory.length>0&&lastTypeRecord.length>0){
				$("#type").removeAttr("disabled");
				$("#type").val("");
				$.ajax("/admin/findType/"+lastClassRecord+"/"+lastCategory,{
					dataType:"json",
					error:function(err){
						console.log("error");
					},
					success:function(type){
						console.log(type);
						$("#type").html("");
						$("#type").append($("<option value=''></option>"));
						console.log("type.length");
						console.log(type.length);
						for(var i=0; i<type.length;i++){
							var allType=$("<option value="+type[i]+">"+type[i]+"</option>");
							if(lastTypeRecord===type[i]){
								var selectedType=$("<option selected value="+type[i]+">"+type[i]+"</option>");
							}
							$("#type").append(allType);
							$("#type").append(selectedType);
						}
					}
				});
			}
			
					$("#category").on("change",function(elem){
						$("#type").attr("disabled","disabled");
						$("#type").val(""); 
						var lastClasse=$("#classe").val();												
						var newCategorie=deleteSpace(this.value);
						var lastCategory=this.value;						
						if(newCategorie.length>0&&deleteSpace(lastClasse)){							
								$("#type").removeAttr("disabled");
									$("#type").val("");
												$.ajax("/admin/findType/"+lastClasse+"/"+lastCategory,{
													dataType:"json",
													error:function(err){
														console.log("error");
													},
													success:function(type){
														console.log(type);
														$("#type").html("");
														$("#type").append($("<option value=''></option>"));
														console.log("type.length");
														console.log(type.length);
														for(var i=0; i<type.length;i++){
															var allType=$("<option value="+type[i]+">"+type[i]+"</option>");
															$("#type").append(allType);
														}
													}
									});													
							}
						});
				
			$("#classe").on("change",function(elem){				
				var classe=this.value;
				console.log("classe");
				console.log(classe);
				$("#category").attr("disabled","disabled");
				$("#category").val("");
				var newClasse=deleteSpace(this.value);
				if(newClasse.length>0){
					$("#category").attr("disabled","disabled");
					$("#category").val("");
					$("#type").val("");
					$("#type").attr("disabled","disabled");					
					$("#category").attr("disabled","disabled");
						$("#category").val("");
						$("#type").attr("disabled","disabled");
						$("#type").val(""); 
						$("#category").removeAttr("disabled");
						$("#category").val("");						
								$.ajax("/admin/findCategory/"+classe,{
									dataType:"json",
									error:function(err){
										console.log("error");
										console.log(err);
									},
									success:function(categories){
										$("#category").html("");
										$("#category").append($("<option value=''></option>"));
										for(var category in categories){
											console.log("category");
											console.log(category);
											var allCategories=$("<option value='"+category+"'>"+category+"</option>");
											$("#category").append(allCategories);											
										}										
									}
								});
				
				}
											
			});
				
			
		}
	});
	
});