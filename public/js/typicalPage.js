
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
									if(category===bodyCategorie){
										var selectedCategorie=$("<option selected value='"+category+"'>"+category+"</option>");
										$.ajax("/admin/getAllDetail/"+lastClassRecord+"/"+category,{
											dataType:"json",
											error:function(err){
												console.log("error");							
											},
											success:function(typical){												
												if(typical.length>0){
													console.log(typical);
													$("#table table").html("");
													var header='<tr><th >N°</th><th class="name">Nom</th><th class="value">Valeur</th><th>Action</th></tr>';
													$("#table table").append(header);
													for(var i=0; i<typical.length;i++){
														var num=i+1
														var tr='<tr><td><a href="">'+num+'</a></td><td>'+typical[i].name+'</td><td>'+typical[i].val+'</td><td><a href="/admin/removeTypical/'+typical[i]._id+'">Delete</a><a href="/admin/editTypical/'+typical[i]._id+'">Modifier</a></td></tr>';
														$("#table table").append(tr);
													}																							
												}								
												else{
													$("#table table").html("");
													$("#table table").append("<span>Aucune Caracteristique disponible</span>");
													
												}																											
											}
										});									
									}
									var allCategories=$("<option value='"+category+"'>"+category+"</option>");
									$("#category").append(allCategories);
									$("#category").append(selectedCategorie);									
									var lastCategory=$("#category").val();									
								}								
							}													
						}
					});				
			}		
			
			
			$("#classe").on("change",function(){
				var newClass=this.value;
				$("#category").html("");				
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
				if(newCategorie.length>0){
					
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
								var header='<tr><th >N°</th><th class="name">Nom</th><th class="value">Valeur</th><th>Action</th></tr>';
								$("#table table").append(header);
								for(var i=0; i<typical.length;i++){
									var num=i+1
									var tr='<tr><td><a href="">'+num+'</a></td><td>'+typical[i].name+'</td><td>'+typical[i].val+'</td><td><a href="/admin/removeTypical/'+typical[i]._id+'">Delete</a><a href="/admin/editTypical/'+typical[i]._id+'">Modifier</a></td></tr>';
									$("#table table").append(tr);
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
			/*
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
			*/
		}
	});
	
});