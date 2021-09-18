var SuperAdmin=require("../models/superAdmin");
var Admin=require("../models/adm");
var Article=require("../models/article");
var Color=require("../models/color"); 
var Typical=require("../models/typical");
var classe=require("../models/classe");
var fs=require("fs");
var path=require("path");

function nameUpper(name=""){
	let initialLetter=name.substring(0,1);
	let lastName=name.substring(1);
	initialLetter=initialLetter.toUpperCase();
	return initialLetter+lastName;
}

var dayInWeek=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
var monthInYear=["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];


function dateGeneration(){
	var DateObject=new Date();
	
	let day=DateObject.getUTCDay();
	let dayFormat=nameUpper(dayInWeek[day]);
	
	let date=(DateObject.getUTCDate());
	let month=DateObject.getUTCMonth();
	let year=DateObject.getFullYear();
		
	let monthFormat=nameUpper(monthInYear[month]);
	
	return dayFormat+" "+date+" "+monthFormat+" "+year;
}

function timeGeneration(){
	var DateObject=new Date();
	let hour=(DateObject.getUTCHours())+1;
	let minute=DateObject.getUTCMinutes();
	
	return hour+":"+minute;
}

function newDateGeneartion(){
	var DateObject=new Date();
	
	//let day=DateObject.getUTCDay();
	//let dayFormat=nameUpper(dayInWeek[day]);
	
	let date=(DateObject.getUTCDate());
	let month=DateObject.getUTCMonth();
	let year=DateObject.getFullYear();
	
	let hour=(DateObject.getUTCHours())+1;
	let minute=DateObject.getUTCMinutes();
	let second=DateObject.getUTCSeconds();
	let milisecond=DateObject.getUTCMilliseconds();
	
	return date+ " "+month+" "+year+" "+hour+" "+minute+" "+second+" "+milisecond;
	//return parseFloat(date)+parseFloat(month)+parseFloat(year)+parseFloat(hour)+parseFloat(minute)+parseFloat(second);
}



function deleteSpace(string=""){
		var regex=/\s+/g;
		var newString=string.replace(regex,"");
		return newString;
	}
var regex=/[<>"'&\/+]/;

module.exports={
	token:function(req,res){
		if(req.session.admin && req.session.logIn){
			Admin.findOne({username:req.session.admin.name},function(err,user){
				if(err){res.redirect("/login");}
				if(user){
					if(req.session.admin.role===user.role && req.body.token===user.token){
						req.session.token=true;
						res.redirect("/admin/index");
					}else{
						req.session.token=false;
						req.session.false_token="Code d'acces erroner";				
						res.redirect("/admin");
					}
				}else{
					res.redirect("/login");
				}
			});	
		}else if(req.session.logIn && req.session.superAdmin){
				SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
					if(err){
						res.redirect("/login");
					}else if(superAdmin){
						res.render("token");
					}else{
						res.redirect("/login")
					}
				})			
			}
		else{
			res.redirect("/login");
		}
		
	},
	approved:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var token=deleteSpace(req.body.token);
					if(token){
						if(token.length>0){
							SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password,token:token},function(err,admin){
								if(err){
									res.redirect("/login");
								}else if(admin){
									if(admin.role==="imageApproval"){
										req.session.superAdmin=admin;
										res.redirect("/admin/approved");
									}else if(admin.role==="contentApproval"){
										req.session.superAdmin=admin;
										res.redirect("/admin/contentapproval");										
									}else if(admin.role==="detailAdd"){										
										res.redirect("/admin/article/typical");										
									}
									else{
										res.redirect("/login");
									}
									
								}else{
									res.redirect("/login");
								}
							});
						}else{
							res.redirect("/login");
						}
					}else{
						res.redirect("/login");
					}
				}else{
					res.redirect("/login")
				}
			})
		}else{
			res.redirect("/login");
		}
	},
	pageApproved:function(req,res){
		console.log("page is calling");
		if(req.session.logIn){
			if(req.session.superAdmin){
				if(req.session.superAdmin.role==="imageApproval"){
					
					var init=((req.session.superAdmin.username).substring(0,1)).toUpperCase();
					
					var adminObject={											
							init:init,
							name:req.session.superAdmin.role							
						};
					var viewModel={};
					viewModel.superAdmin=adminObject;
					
					var colorId=req.params.colorId;
					var lastArticleId=req.params.articleId;					
					
					if(colorId){
						Color.findOne({_id:colorId,articleId:lastArticleId,edited:true},{},{sort:{dateFormat:1}},function(err,color){
							if(err){
								res.redirect("/admin/approved/"+lastArticleId+"/"+colorId);
							}
							else if(color){
								if(color.filename1Edited || color.filename2Edited){
										var articleId=color.articleId;
										Article.findOne({_id:articleId},function(err,article){
											if(err){
												res.redirect("/admin/approved/"+lastArticleId+"/"+colorId);
											}
											else if(article){
												
												viewModel.article=article;
												viewModel.color=color;
												if(req.session.color_existed){
													viewModel.color_existed=true;
													delete req.session.color_existed;
												}
												res.render("approvedPage",viewModel);
											}else{
												res.redirect("/admin/approved");
											}
										});
								}else{
									res.render("approvedPage",viewModel);
								}								
							}else{
								res.redirect("/admin/approved");
							}						
						});
					}else{
						Color.findOne({edited:true},{},{sort:{dateFormat:1}},function(err,color){
							console.log("color");
							console.log(color);
							if(err){
								res.redirect("/admin/approved");
							}
							else if(color){
								var articleId=color.articleId;
								if(color.filename1Edited||color.filename2Edited){
									Article.findOne({_id:articleId},function(err,article){
											if(err){
												res.redirect("/admin/approved");
												console.log("error")
											}
											else if(article){
												console.log("done");
												viewModel.article=article;
												viewModel.color=color;
												res.render("approvedPage",viewModel);
											}else{
												console.log("mistake");
												res.redirect("/admin/approved");
											}
										})
								}else{
									res.render("approvedPage",viewModel);
								}
								
							}else{
								res.render("approvedPage",viewModel);
							}						
						});
					}
					
				}else{
					res.redirect("/login");
				}				
			}else{
				res.redirect("/login");
			}
		}else{
			res.redirect("/login");
		}
	},
	imageApproved:function(req,res){
		if(req.session.logIn){
			if(req.session.superAdmin){
				var filename1State=deleteSpace(req.params.filename1);
				var filename2State=deleteSpace(req.params.filename2);
				var colorId=deleteSpace(req.params.id);
				if(filename1State==="valide" && filename2State==="novalide"){
					if(colorId){
						Color.findOne({_id:colorId,edited:true},function(err,color){
							if(err){
								res.redirect("/admin/approved");
							}else if(color){
								var id=color.articleId;
								Article.findOne({_id:id},function(err,article){
									if(err){
										res.redirect("/admin/approved");
									}
									else if(article){
										if(color.principal){
											article.filename1Edited=undefined;
											article.filename1=color.filename1Edited;
										}
										
										
										color.filename1=color.filename1Edited;
										color.filename1Edited=undefined;
										
										color.dateFormat=newDateGeneartion();
										
										
										article.save(function(){
											color.save(function(){
												if(article.filename1 && article.filename2){
													if(article.filename1.length>0 && article.filename2.length>0){
														article.approved=true;
													}											
												}
												if(color.filename1&&color.filename2){
													if(color.filename1.length>0 && color.filename2.length>0){
														color.approved=true;													
													}
												}
												if(!color.filename1Edited && !color.filename2Edited){
													color.edited=false;
												}
												article.save(function(){
													color.save(function(){
														req.session.success_approved=true;
														res.redirect("/admin/approved");
													});
												});
												
											});
										});
										
									}else{
										res.redirect("/admin/approved");
									}
										
								});
							}else{
								res.redirect("/admin/approved");
							}
						});
					}else{
						res.redirect("/admin/approved");
					}
				}
				else if(filename2State==="valide" && filename1State==="novalide"){
					if(colorId){
						Color.findOne({_id:colorId},function(err,color){
							if(err){
								res.redirect("/admin/approved");
							}else if(color){
								var id=color.articleId;
								Article.findOne({_id:id},function(err,article){
									if(err){
										res.redirect("/admin/approved");
									}
									else if(article){
										if(color.principal){
											article.filename2Edited=undefined;
											article.filename2=color.filename2Edited;
										}
										
										
										color.filename2=color.filename2Edited;
										color.filename2Edited=undefined;
										color.dateFormat=newDateGeneartion();
																			
										
										article.save(function(){
											color.save(function(){
												if(article.filename1 && article.filename2){
														if(article.filename1.length>0 && article.filename2.length>0){
															article.approved=true;
														}														
												}
												if(color.filename1&&color.filename2){
													if(color.filename1.length>0 && color.filename2.length>0){
														color.approved=true;
													}
												}
												if(!color.filename1Edited && !color.filename2Edited){
													color.edited=false;
												}
												article.save(function(){
													color.save(function(){
														req.session.success_approved=true;
														res.redirect("/admin/approved");
													});
												});
												
											});
										});
										
									}else{
										res.redirect("/admin/approved");
									}
										
								});
							}else{
								res.redirect("/admin/approved");
							}
						});
					}else{
						res.redirect("/admin/approved");
					}
				}
				else if(filename1State==="valide" && filename2State==="valide"){
					if(colorId){
						Color.findOne({_id:colorId},function(err,color){
							if(err){
								console.log("err ddd")
								//res.redirect("/admin/approved");
							}else if(color){
								var id=color.articleId;
								Article.findOne({_id:id},function(err,article){
									if(err){
										res.redirect("/admin/approved");
									}
									else if(article){
										
										if(color.principal){
											article.filename2Edited=undefined;
											article.filename1Edited=undefined;
											article.filename2=color.filename2Edited;
											article.filename1=color.filename2Edited;
										}
										color.filename2=color.filename2Edited;
										color.filename1=color.filename1Edited;
										color.filename1Edited=undefined;
										color.filename2Edited=undefined;
										color.dateFormat=newDateGeneartion();
																			
										
										article.save(function(){
											color.save(function(){
												if(article.filename1 && article.filename2){
														if(article.filename1.length>0 && article.filename2.length>0){
															article.approved=true;
														}														
												}
												if(color.filename1&&color.filename2){
													if(color.filename1.length>0 && color.filename2.length>0){
														color.approved=true;
													}
												}
												if(!color.filename1Edited && !color.filename2Edited){
													color.edited=false;
												}
												article.save(function(){
													color.save(function(){
														req.session.success_approved=true;
														res.redirect("/admin/approved");
													});
												});
												
											});
										});
										
									}else{
										res.redirect("/admin/approved");
									}
										
								});
							}else{
								res.redirect("/admin/approved");
							}
						});
					}else{
						res.redirect("/admin/approved");
					}
				}else{
					if(colorId){
						Color.findOne({_id:colorId},function(err,color){
							if(err){
								console.log("err")
								//res.redirect("/admin/approved");
							}
							else if(color){
								color.dateFormat=newDateGeneartion();
								color.save(function(){
									res.redirect("/admin/approved");
								});
							}else{
								res.redirect("/admin/approved");
							}
						});
					}else{
						res.redirect("/admin/approved");
					}					
				}
			}else{
				res.redirect("/login")
			}
		}else{
			res.redirect("/login");
		}
	},
	contentapproved:function(req,res){
		var categorie=req.params.category;
		var type=req.params.type;
		var id=req.params.id;		
		var viewModel={};
		var url=(req.path).split("/");
		var classPost=url[1]
		var categories=classe.categorie[classPost];
		var color_id=req.params.color_id;
		if(req.session.no_size){
			viewModel.no_size=true;
			delete req.session.no_size;
		}
		if(req.session.no_quantite){
			viewModel.no_quantite=true;
			delete req.session.no_quantite;
		}
		if(req.session.exist_panier){
			viewModel.exist_panier=true;
			delete req.session.exist_panier;
		}
		if(req.session.panier_added){
			viewModel.panier_added=true;
			delete req.session.panier_added;
		}
		if(req.session.size_no_admissible){
			viewModel.size_no_admissible=true;
			delete req.session.size_no_admissible
		}
		if(req.session.quantite_no_admissible){
			viewModel.quantite_no_admissible=true;
			delete req.session.quantite_no_admissible
		}
		if(req.session.color_exist){
			viewModel.color_exist=req.session.color_exist;
			delete req.session.color_exist;
		}
		if(req.session.no_image){
			viewModel.no_image=true;
			delete req.session.no_image
		}
		if(req.session.no_two_image){
			viewModel.no_two_image=true;
			delete req.session.no_two_image
		}
		if(req.session.no_color){
			viewModel.no_color=true;
			delete req.session.no_color;
		}
		if(req.session.body){
			viewModel.body=req.session.body;
			delete req.session.body;
		}
		
			if(req.session.logIn && req.session.superAdmin){
				var init=((req.session.superAdmin.username).substring(0,1)).toUpperCase();
					
				var adminObject={											
					init:init,
					name:req.session.superAdmin.role							
				};									
				viewModel.superAdmin=adminObject;
				
					Article.findOne({approved:true},function(err,article){
								if(err){
									res.redirect("/");
								}
								else if(article){
													
									req.session.lastPath=req.path;
									
										if(article.edited && !(article.contentEdited)){
											console.log("is comming");
											viewModel.adminArticle="true";									
											viewModel.article=article;
											
											viewModel.classe=article.classe;
											var sized=article.size;
											var definitiveSized=article.definitiveSize;
											if(sized.length>0){
												viewModel.size=sized.join(",");
											}else{
												viewModel.size=definitiveSized.join(",");
											}
												
												
											
											
											if(color_id){
												Color.find({articleId:article._id},function(err,allColors){										
													if(allColors){
														if(allColors.length>0){
															viewModel.allColors=allColors;
															Color.findOne({articleId:article._id,_id:color_id},function(err,color){
																if(color){
																	res.redirect("/admin/typicalapproval/"+article._id);																																	
																}else{
																	Color.findOne({articleId:article._id,principal:true},function(err,color){
																		if(color){
																			res.redirect("/admin/typicalapproval/"+article._id);
																																																			
																		}else{
																			res.redirect("/admin/typicalapproval/"+article._id);																																																				
																		}													
																	});
																}													
															});
														}else{
															res.redirect("/admin/typicalapproval/"+article._id);																																								
														}
																								
													}else{
														res.redirect("/admin/typicalapproval/"+article._id);
																																				
													}
												});
											}else{
												Color.find({articleId:article._id},function(err,allColors){										
													if(allColors){
														if(allColors.length>0){
															viewModel.allColors=allColors;
															Color.findOne({articleId:article._id,principal:true},function(err,color){
																if(color){																
																	
																	res.redirect("/admin/typicalapproval/"+article._id);
																																		
																}else{
																	res.redirect("/admin/typicalapproval/"+article._id);
																															
																}													
															});
														}else{
															res.redirect("/admin/typicalapproval/"+article._id);
																												
														}																					
													}else{
														res.redirect("/admin/typicalapproval/"+article._id);
																									
													}
												});
											}
										}
										else if(article.contentEdited && !(article.edited)){
											console.log("is comming");
											viewModel.adminArticle="true";									
											viewModel.article=article;
											
											viewModel.classe=article.classe;
											var sized=article.size;
											viewModel.size=sized.join(",");
											
											if(color_id){
												Color.find({articleId:article._id},function(err,allColors){										
													if(allColors){
														if(allColors.length>0){
															viewModel.allColors=allColors;
															Color.findOne({articleId:article._id,_id:color_id},function(err,color){
																if(color){
																	viewModel.color=color;
																	res.render("contentApproved",viewModel);																																		
																}else{
																	Color.findOne({articleId:article._id,principal:true},function(err,color){
																		if(color){
																			viewModel.color=color;
																			res.render("contentApproved",viewModel);																																																			
																		}else{																			
																			res.render("contentApproved",viewModel);																																																					
																		}													
																	});
																}													
															});
														}else{															
															res.render("contentApproved",viewModel);																																								
														}
																								
													}else{														
														res.render("contentApproved",viewModel);
																																				
													}
												});
											}else{
												Color.find({articleId:article._id},function(err,allColors){										
													if(allColors){
														if(allColors.length>0){
															viewModel.allColors=allColors;
															Color.findOne({articleId:article._id,principal:true},function(err,color){
																if(color){
																	viewModel.color=color;
																	res.render("contentApproved",viewModel);
																																		
																}else{																	
																	res.render("contentApproved",viewModel);																																
																}													
															});
														}else{															
															res.render("contentApproved",viewModel);													
														}																					
													}else{														
														res.render("contentApproved",viewModel);												
													}
												});
											}
										}
										else if(article.edited && article.contentEdited){
											console.log("is comming");
											viewModel.adminArticle="true";									
											viewModel.article=article;
											
											viewModel.classe=article.classe;
											var sized=article.size;
											viewModel.size=sized.join(",");
											
											if(color_id){
												Color.find({articleId:article._id},function(err,allColors){										
													if(allColors){
														if(allColors.length>0){
															viewModel.allColors=allColors;
															Color.findOne({articleId:article._id,_id:color_id},function(err,color){
																if(color){
																	viewModel.color=color;
																	res.render("contentApproved",viewModel);																																		
																}else{
																	Color.findOne({articleId:article._id,principal:true},function(err,color){
																		if(color){
																			viewModel.color=color;
																			res.render("contentApproved",viewModel);																																																			
																		}else{																			
																			res.render("contentApproved",viewModel);																																																					
																		}													
																	});
																}													
															});
														}else{															
															res.render("contentApproved",viewModel);																																								
														}
																								
													}else{														
														res.render("contentApproved",viewModel);
																																				
													}
												});
											}else{
												Color.find({articleId:article._id},function(err,allColors){										
													if(allColors){
														if(allColors.length>0){
															viewModel.allColors=allColors;
															Color.findOne({articleId:article._id,principal:true},function(err,color){
																if(color){
																	viewModel.color=color;
																	res.render("contentApproved",viewModel);
																																		
																}else{																	
																	res.render("contentApproved",viewModel);																																
																}													
															});
														}else{															
															res.render("contentApproved",viewModel);													
														}																					
													}else{														
														res.render("contentApproved",viewModel);												
													}
												});
											}
										}else{
											res.render("contentApproved",viewModel);
										}												
																								
								}else{									
									res.render("contentApproved",viewModel);
								}
							})
						}else{
							res.redirect("/login");
						}
			
	},
	contentvalidation:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			if(req.session.superAdmin.role==="contentApproval"){
				var article_id=req.params.article_id;
				var color_id=req.params.color_id;
				if(article_id.length>0 && color_id.length>0){
					Article.findOne({_id:article_id,approved:true,contentEdited:true},function(err,article){
						if(err){
							res.redirect("/login");
						}else if(article){
							console.log("the article");
							console.log(req.body);
							var body=req.body;
							if(body){
								var definitiveDescription=deleteSpace(body.description);
								var definitiveTypical=body.typical;
								var definitiveSize=deleteSpace(body.size);
								var definitiveName=deleteSpace(body.name);
								var definitiveMark=deleteSpace(body.mark);
								var definitivePrice=deleteSpace(body.detail_price);
								var definitiveWholePrice=deleteSpace(body.wholePrice);
								var definitiveWholeNumber=deleteSpace(body.wholeNumber);
								
								if(definitiveDescription.length>0 && definitiveSize.length>0 && definitiveName.length>0 && definitivePrice.length>0 && definitiveWholePrice.length>0 && definitiveWholeNumber.length>0 &&definitiveMark.length>0){
									article.definitiveDescription=body.description;
									article.description="";
									article.definitiveName=body.name;
									article.name="";
									article.definitivePrice=body.detail_price;
									article.price="";
									article.definitiveWholePrice=body.wholePrice;
									article.wholePrice="";
									article.definitiveMark=body.mark;
									article.mark="";
									article.definitiveWholeNumber=body.wholeNumber;
									article.wholeNumber="";
									article.definitiveSize=definitiveSize.split(",");
									article.size="";
									Typical.findOne({articleId:article._id,edited:true},function(err,typical){
										if(err){
											article.approvedcontent=true;
											article.contentEdited=false;
											//article.edited=false;
											article.save(function(){
												res.redirect("/admin/contentapproval");
											});
										}else if(typical){
											article.approvedcontent=true;
											article.contentEdited=false;
											article.save(function(){
												res.redirect("/admin/typicalapproval/"+article._id);
											});
										}else{
											//article.edited=false;
											article.approvedcontent=true;
											article.contentEdited=false;
											article.save(function(){
												res.redirect("/admin/contentapproval");
											});
										}
									});
									
								}else{
									res.redirect("/admin/contentapproval/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id+"/"+color_id);
								}								
							}else{
								res.redirect("/admin/contentapproval/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id+"/"+color_id);
								//res.redirect("/admin/contentapproval");
							}
						}else{
							res.redirect("/admin/contentapproval");
						}
					});
				}else{
					res.redirect("/admin/contentapproval");
				}				
			}else{
				res.redirect("/login");
			}
		}else{
			res.redirect("/login");
		}
	},
	typicalapproved:function(req,res){
		var viewModel={};
		var article_id=req.params.article_id;
		var color_id=req.params.color_id;
		if(req.session.logIn && req.session.superAdmin){
			var init=((req.session.superAdmin.username).substring(0,1)).toUpperCase();				
			var adminObject={											
				init:init,
				name:req.session.superAdmin.role							
			};									
			viewModel.superAdmin=adminObject;
			if(article_id){
				Article.findOne({_id:article_id,approved:true},function(err,article){
								if(err){
									res.redirect("/");
								}
								else if(article){					
									viewModel.adminArticle="true";									
									viewModel.article=article;
									
									viewModel.classe=article.classe;
									var sized=article.size;
									viewModel.size=sized.join(",");
									console.log(viewModel.size);
									req.session.lastPath=req.path;
									Color.find({articleId:article._id},function(err,allColors){										
											if(allColors){
												if(allColors.length>0){
													viewModel.allColors=allColors;
													Color.findOne({articleId:article._id,principal:true},function(err,color){
														if(color){
															viewModel.color=color;
															Typical.findOne({articleId:article._id,edited:true},function(err,typicaledited){
																		if(err){
																				console.log("err");
																			article.edited=false;																			
																			article.save(function(){
																				res.redirect("/admin/contentapproval");
																			});
																			
																		}else if(typicaledited){
																			viewModel.typicaledited=typicaledited;
																			Typical.find({articleId:article._id},function(err,typical){
																				if(err){
																					console.log("error is there");
																					res.render("typicalApproved",viewModel);
																					
																				}else if(typical){																					
																					viewModel.typical=typical;
																					res.render("typicalApproved",viewModel);
																				}else{
																					res.render("typicalApproved",viewModel);
																				}
																			});
																			
																		}else{																			
																			article.edited=false;
																			article.save(function(){
																				res.redirect("/admin/contentapproval");
																			});																			
																		}
																});
															
														}else{
															article.edited=false;
															article.save(function(){
																	res.redirect("/admin/contentapproval");
															});
																														
														}													
													});
												}else{
													article.edited=false;
															article.save(function(){
																	res.redirect("/admin/contentapproval");
															});
																									
												}																					
											}else{
												article.edited=false;
															article.save(function(){
																	res.redirect("/admin/contentapproval");
															});
																								
											}
										});															
																								
								}else{
									console.log("ooof");
									res.redirect("/admin/contentapproval");
									
								}
							});
			}else{
				console.log("aaaa");
				res.redirect("/admin/contentapproval");
			}
		}else{
			res.redirect("/login");
		}		
			
	},
	typicalvalidation:function(req,res){
		var typical_id=req.params.typical_id;
		var typicalName=deleteSpace(req.body.typicalName);
		var typicalValue=deleteSpace(req.body.typicalValue);
		
		if(req.session.logIn && req.session.superAdmin){
			if(typical_id){
				if(typicalName.length>0&&typicalValue.length>0){
					Typical.findOne({_id:typical_id},function(err,typical){
							if(err){
								console.log("error")
								res.redirect("/admin/contentapproval");
							}else if(typical){
								Article.findOne({_id:typical.articleId},function(err,article){
										if(err){
											console.log("error is there")
											res.redirect("/admin/contentapproval");
										}else if(article){
											console.log("error ise nor")
											typical.definitiveTypicalName=typicalName;
											typical.definitiveTypicalValue=typicalValue;
											typical.typicalName="";
											typical.typicalValue="";
											typical.edited=false;
											typical.save(function(){
												res.redirect("/admin/typicalapproval/"+article._id);												
											});
										}else{
											console.log("is good");
											res.redirect("/admin/contentapproval");
										}
										
									}
								)
							}else{
								console.log("is done");
								res.redirect("/admin/contentapproval");
							}
					});							
				}else{
					if(!typicalName){
						req.session.notypicalName=true
					}
					if(!typicalValue){
						req.session.notypicalValue=true;
					}
					console.log("solve it");
					res.redirect("/admin/typicalapproval/"+typical_id);					
				}
				
			}else{
				console.log("is gone");
				res.redirect("/admin/contentapproval");
			}
		}else{
			console.log("is there");
			res.redirect("/login");
		}
	}
}