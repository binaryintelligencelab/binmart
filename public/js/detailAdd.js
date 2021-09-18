
$(document).ready(function(){
	function deleteSpace(string=""){
		var regex=/\s+/g;
		var newString=string.replace(regex,"");
		return newString;
	}
	setTimeout(function(){
		$("#succed_delete").fadeOut();
	},1500);
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
			if(lastClassRecord.length>0){
				$("#category").removeAttr("disabled");
				var bodyCategorie=$("#bodyCategorie").text();							
					$.ajax("/admin/findCategory/"+lastClassRecord,{
						dataType:"json",
						error:function(err){
							console.log("error");							
						},
						success:function(categories){
							var tab=[];
							for(var category in categories){
								tab.push(category);
							}
							var newtab=[];
							if(tab.length>0){
								for(var i=0;i<tab.length;i++){
									newtab.push(i);									
								}
								$("#category").html("");
								$("#category").append($("<option value=''></option>"));
								
								for(var category in categories){
									
									console.log("categories is there");
									console.log(categories.keys);
									if(category===bodyCategorie){
										var selectedCategorie=$("<option selected value='"+category+"'>"+category+"</option>");
									}
									var allCategories=$("<option value='"+category+"'>"+category+"</option>");
									$("#category").append(allCategories);
									$("#category").append(selectedCategorie);
									
									var lastCategory=$("#category").val();	
									
								}
								if(tab.length===newtab.length){
									if(lastCategory.length>0){
										$.ajax("/admin/getAllDetail/"+lastClassRecord+"/"+lastCategory,{
												dataType:"json",
												error:function(err){
													console.log("error");							
												},
												success:function(caracteristique){
													
													console.log("caracteristique");
													var bodyType=$("#bodyType").text();
													console.log("bodyType");
													console.log(bodyType);
													console.log(caracteristique.length);
													if(caracteristique.length>0){													
														for(var i=0; i<caracteristique.length;i++){
															console.log("caracteristique[i]");
															console.log(caracteristique[i].name);
															if(deleteSpace(bodyType)===deleteSpace(caracteristique[i].name)){
																
																var selectedType=$("<option selected value='"+caracteristique[i]._id+"'>"+caracteristique[i].name+"</option>");
																$("#typical").append(selectedType);
																$("#nameEdited").attr("action","/admin/editAttributeName/"+caracteristique[i]._id);
																$("#typicalEdited").val(caracteristique[i].name);
															}else{
																var allType=$("<option value='"+caracteristique[i]._id+"'>"+caracteristique[i].name+"</option>");
																$("#typical").append(allType);
															}													
														}														
													}else{
														$("#table table").html("");
														$("#table table").append("<span>Aucune Caracteristique disponible</span>");
													}																																		
												}
											});
									}
								}
								
							}
													
						}
					});				
			}		
			
			
			$("#classe").on("change",function(){
				var newClass=this.value;
				$("#category").html("");
				$("#typical").html("");
				$("#classEdited").val(newClass);				
				$("#nameEdited").attr("action","");
				if(newClass.length>0){
					console.log("newClass");
					console.log(newClass);
					$.ajax("/admin/findCategory/"+newClass,{
							dataType:"json",
							error:function(err){
								console.log("error");							
							},
							success:function(categories){
								$("#table table").html("");
								$("#category").html("");
								$("#category").append($("<option value=''></option>"));
								for(var category in categories){									
									var allCategories=$("<option value='"+category+"'>"+category+"</option>");
									$("#category").append(allCategories);									
								}										
							}
						});
				}					
			});
			$("#category").on("change",function(){
				var newCategorie=this.value;
				var newClass=$("#classe").val();
				$("#typical").html("");
				$("#nameEdited").attr("action","");
					
				if(newCategorie.length>0){
					$("#categoryEdited").val(newCategorie);
					$("#ClassEdited").val(newClass);
					$.ajax("/admin/getAllDetail/"+newClass+"/"+newCategorie,{
						dataType:"json",
						error:function(err){
							console.log("error");							
						},
						success:function(typical){
							console.log("caracteristique");
							console.log(typical.length);
							if(typical.length>0){
								console.log(typical);
								$("#table table").html("");
								$("#typical").html("");
								$("#typical").append($("<option value=''></option>"));
								for(var i=0; i<typical.length;i++){
									var allType=$("<option value='"+typical[i]._id+"'>"+typical[i].name+"</option>");
									$("#typical").append(allType);
								}																
							}								
							else{
								$("#table table").html("");
								$("#table table").append("<span>Aucune Caracteristique disponible</span>");
							}																											
						}
					});
				}
			});
			
			$("#typical").on("change",function(){
				var newType=this.value;
				var newClass=$("#classe").val();
				var newCategorie=$("#category").val();
				if(newCategorie.length>0&&newType.length>0&&newClass.length>0){
					$.ajax("/admin/getAllDetail/"+newClass+"/"+newCategorie+"/"+newType,{
						dataType:"json",
						error:function(err){
							console.log("err");
						},
						success:function(values){
							console.log("values");
							console.log(values);
							if(values){
								var allValues=values.val;
								var name=values.name;
								if(name){
									$("#nameEdited").attr("action","/admin/editAttributeName/"+values._id);
									$("#typicalEdited").val(name);
									
									$("#nameEdited").fadeIn();
								}
								
							}
						}
					})
				}
				
			});
		}
	});
	
});