var User=require("../models/user");
var Admin=require("../models/adm");
var SuperAdmin=require("../models/superAdmin");
var Color=require("../models/color");
var path=require("path");
var classe=require("../models/classe");
var Article=require("../models/article");
var Panier=require("../models/panier");
var ArticleDetail=require("../models/articleDetail");
var Typical=require("../models/typical");
//var fetch=require("node-fetch");
//console.log(fetch);

function deleteSpace(string=""){
	var regex=/\s+/g;
	var newString=string.replace(regex,"");
	return newString;
}
var passewordRegex=/[<>"'&\/+]/;

function renderPost(viewModel,myCategorie,allCategorie,myClasse,res,req){				
	viewModel.categorie=myCategorie;				
	let tab=[];
	let allTab=[];
	let allTypes=[];
	let existedCategorie=[];
	
	if(req.session.logIn){
		if(req.session.admin){
			for(let i=0; i<allCategorie.length;i++){				
				Article.find({classe:myClasse,categorie:allCategorie[i],boutiUsername:req.session.admin.username},function(err,articles){
					if(err){
						res.redirect("/")
					}
					else{
						tab.push(i);
						if(articles.length>0){
							var object_article={};
							object_article.categorie=allCategorie[i];
							object_article.articles=articles;
							object_article.articles_number=articles.length;
							allTypes.push(object_article);
						}
						if(tab.length===allCategorie.length){
							viewModel.admin=req.session.admin;
							viewModel.type=allTypes;							
							res.render("adminPost",viewModel);
						}
					}
				});
			}
		}
		if(req.session.member){
			for(let i=0; i<allCategorie.length;i++){
				Article.find({classe:myClasse,categorie:allCategorie[i],approved:true,flag:true,approvedcontent:true},function(err,articles){
					if(err){
						res.redirect("/")
					}
					else{
						tab.push(i);
						if(articles.length>0){							
							var object_article={};
							object_article.categorie=allCategorie[i];
							object_article.articles=articles;
							object_article.articles_number=articles.length;
							allTypes.push(object_article);
						}
						if(tab.length===allCategorie.length){
							viewModel.type=allTypes;
							viewModel.member=req.session.member;
							res.render("post",viewModel);
						}
					}
				});
			}
		}
	}else{
		
		
		for(let i=0; i<allCategorie.length;i++){
			Article.find({classe:myClasse,categorie:allCategorie[i],approved:true,flag:true,approvedcontent:true},function(err,articles){
				if(err){
					console.log('err');
					console.log(err);
					tab.push(i);
					if(tab.length===allCategorie.length){
						res.redirect("/")
					}					
				}
				else{
					tab.push(i);
					if(articles.length>0){						
						var object_article={};
						object_article.categorie=allCategorie[i];
						object_article.articles=articles;
						object_article.articles_number=articles.length;
						allTypes.push(object_article);						
					}
					if(tab.length===allCategorie.length){
						
							viewModel.type=allTypes;
							res.render("post",viewModel);
												
					}
					
				}
			});
		}
		
	}
}


module.exports={
	doLogin:function(req,res){
		var password=deleteSpace(req.body.password);
		var username=deleteSpace(req.body.username);		
		if(username && password){
			if(passewordRegex.test(password)){			
				req.session.user_body=req.body;
				req.session.false_password="Caractere inadmissible dans le mot de passe";						
				res.redirect("/login");
			}else{
				if(passewordRegex.test(username)){
					req.session.user_body=req.body;
					req.session.no_user="Caractere inadmissible dans votre username";						
					res.redirect("/login");
				}else{
					SuperAdmin.findOne({username:username},function(err,superAdmin){
						if(superAdmin){
							req.session.logIn=true;
							req.session.superAdmin=superAdmin;
							res.redirect("admin/token");
							
						}else{
							Admin.findOne({username:username},function(err,admin){						
								if(err){res.redirect("/login");console.log(err)}
								if(admin){							
									if(admin.password===password){
										var adminObject={};
										adminObject.adminname=admin.adminname;
										adminObject.surname=admin.surname;
										adminObject.username=admin.username;
										var init=((admin.adminname).substring(0,1)).toUpperCase();
										adminObject.init=init;
										req.session.admin=adminObject;
										req.session.logIn=true;								
										res.redirect("/admin");
									}
									else{
										req.session.user_body=req.body;
										req.session.false_password="Mot de passe incorrect";
										res.redirect("/login");
									}
								}else{
									User.findOne({username:username},function(err,user){
										if(err){res.redirect("/login");console.log(err)}
										if(user){							
											if(user.password===password){
												var name=user.name;
												var init=(name.substring(0,1)).toUpperCase();
												req.session.logIn=true;
												req.session.member={											
													init:init,
													name:user.name,
													surname:user.username,
													username:user.username
												};										
												if(req.session.lastPath){
													var lastPath=req.session.lastPath;
													
													delete req.session.lastPath;											
													res.redirect(lastPath);
												}else{
													res.redirect("/");
												}
												
											}else{
												req.session.user_body=req.body;
												req.session.false_password="Mot de passe incorrect";										
												res.redirect("/login");
											}									
										}else{
											req.session.no_user="Veuillez renseigner un nom d'utilisateur correct";
											req.session.user_body=req.body;
											res.redirect("/login");
										}
									});
								}
							})
						}
					});
					
				}
			}				
			
		}
		else{
			if(!username){
				req.session.no_username="Renseigner ce champ svp";
				req.session.user_body=req.body;				
			}
			if(!password){
				req.session.no_passeword="Renseigner ce champ svp";
				req.session.user_body=req.body;
			}			
			res.redirect("/login")
		}
	},//ok
	doLogout:function(req,res){
		if(req.session.admin){
			delete req.session.admin;
			delete req.session.logIn;
			res.redirect("/login");
		}
		else if(req.session.member){
			delete req.session.member;
			delete req.session.logIn;
			res.redirect("/login");
		}
		else if(req.session.superAdmin){
			delete req.session.superAdmin;
			delete req.session.logIn;
			res.redirect("/login");
		}
		else{
			res.redirect("/login");
		}
	},//ok
	home:function(req,res){
		var viewModel={};
		var femmes=classe.categorie.femmes;
		var hommes=classe.categorie.hommes;
		var filles=classe.categorie.filles;
		var garcons=classe.categorie.garcons;
		var jeux=classe.categorie.jeux;
		var women=[];
		var men=[];
		var girl=[];
		var boy=[];
		var game=[];
		for(var i in femmes){
			women.push(i);
		}
		for(var i in hommes){
			men.push(i);
		}
		for(var i in filles){
			girl.push(i);
		}
		for(var i in garcons){
			boy.push(i);
		}
		for(var i in jeux){
			game.push(i);
		}
			
		if(women.length>0){
			viewModel.women=women;
		}
		if(men.length>0){
			viewModel.men=men;
		}
		if(girl.length>0){
			viewModel.girl=girl;
		}
		if(boy.length>0){
			viewModel.boy=boy;
		}
		if(game.length>0){
			viewModel.game=game;
		}
		if(req.session.logIn){
			req.session.lastPath=req.path;
			if(req.session.member){
				viewModel.member=req.session.member;
				res.render("home",viewModel);
			}
			if(req.session.admin){
				viewModel.admin=req.session.admin;
				res.render("home",viewModel);
			}
		}else{
			console.log("viewModel");
			console.log(viewModel);
			res.render("home",viewModel);
			
		}		
	},//ok
	post:function(req,res){
		var path=req.route.path;
		var viewModel={};
		if(path==="/femmes"){
			var categorie=classe.categorie.femmes;			
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categorie){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categorie[i];
				myCategorie.push(categorieObject);				
				allCategorie.push(i);
			}
			viewModel.bootiName="Mango";
			viewModel.bootiArticle="Robe et Chaussure Dame";
			viewModel.bootiPrice="1000 $";
			viewModel.bootiAdresse="Av poids lourd,N°5,C/Lemba";
			viewModel.bootiColor="green";
	
			viewModel.genre="Femme";
			viewModel.classe="femmes";
			viewModel.path="femmes";
			viewModel.banner_flag="";
			viewModel.style="Classique";
			viewModel.description="Ici toutes le femmes trouver facilement leur produits preferés, leur prix et leur point de vente"
			if(allCategorie.length>0 && myCategorie.length>0){
				console.log("the condition is past");
				renderPost(viewModel,myCategorie,allCategorie,"femmes",res,req);				
			}			
		}
		if(path==="/hommes"){
			var categorie=classe.categorie.hommes;			
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categorie){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categorie[i];
				myCategorie.push(categorieObject);
				
				allCategorie.push(i);
			}
			viewModel.bootiName="Galaxy";
			viewModel.bootiArticle="Veste et Chamise Hommes";
			viewModel.bootiPrice="1000 $";
			viewModel.bootiAdresse="Av poids lourd,N°5,C/Lemba";
			viewModel.bootiColor="rgba(0,128,192,1)";
			
			viewModel.genre="Homme";
			viewModel.style="Chic";
			viewModel.classe="hommes";
			viewModel.path="hommes";
			viewModel.banner_flag="";
			viewModel.description="Ici les hommes de hautes factures trouver les vetements et chaussure qui correspond a leur niveau";
			
			if(allCategorie.length>0 && myCategorie.length>0){
				renderPost(viewModel,myCategorie,allCategorie,"hommes",res,req);				
			}			
		}
		if(path==="/filles"){
			var categorie=classe.categorie.filles;			
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categorie){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categorie[i];
				myCategorie.push(categorieObject);
				
				allCategorie.push(i);
			}
			
			viewModel.bootiName="Kid Garden";
			viewModel.bootiArticle="Perpette pour filles";
			viewModel.bootiPrice="10 $";
			viewModel.bootiAdresse="Av poids lourd,N°5,C/Lemba";
			viewModel.bootiColor="rgba(0,128,192,1)";
			
			viewModel.genre="Filles";
			viewModel.style="Stylées";
			viewModel.classe="filles";
			viewModel.path="filles";
			viewModel.banner_flag="";
			viewModel.description="Ici vous trouvés la diversité des articles pour vos filles";
			
			if(allCategorie.length>0 && myCategorie.length>0){
				renderPost(viewModel,myCategorie,allCategorie,"filles",res,req);				
			}			
		}
		if(path==="/garcons"){
			var categorie=classe.categorie.garcons;			
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categorie){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categorie[i];
				myCategorie.push(categorieObject);
				
				allCategorie.push(i);
			}
			
			viewModel.bootiName="Jesus le Roc";
			viewModel.bootiArticle="Veste et chaussure";
			viewModel.bootiPrice="1000 $";
			viewModel.bootiAdresse="Av poids lourd,N°5,C/Lemba";
			viewModel.bootiColor="green";
			
			viewModel.genre="Garcons";
			viewModel.style="Stylés";
			viewModel.classe="garcons";
			viewModel.path="garcons";
			viewModel.banner_flag="";
			viewModel.description="Ici vous trouvés la diversité des articles pour vos garcons";
			
			if(allCategorie.length>0 && myCategorie.length>0){
				renderPost(viewModel,myCategorie,allCategorie,"garcons",res,req);				
			}			
		}
		if(path==="/jeux"){
			var categorie=classe.categorie.jeux;			
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categorie){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categorie[i];
				myCategorie.push(categorieObject);
				
				allCategorie.push(i);
			}
			
			viewModel.bootiName="Helium";
			viewModel.bootiArticle="Monopoli et Piket";
			viewModel.bootiPrice="200 $";
			viewModel.bootiAdresse="Av poids lourd,N°5,C/Lemba";
			viewModel.bootiColor="rgba(0,128,192,1)";
			
			viewModel.genre="Jeux";
			viewModel.style="Pour Enfants";
			viewModel.classe="Jeux et jouets"
			viewModel.path="jeux";
			viewModel.banner_flag="";
			viewModel.description="Je choisis pour mes enfants les articles qui correspondts a leurs ages et leurs ages"
			if(allCategorie.length>0 && myCategorie.length>0){
				renderPost(viewModel,myCategorie,allCategorie,"jeux_jouets",res,req);				
			}
		}
		if(path==="/meuble"){
			var categorie=classe.categorie.meuble;			
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categorie){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categorie[i];
				myCategorie.push(categorieObject);
				
				allCategorie.push(i);
			}
			viewModel.bootiName="Habitat Decor";
			viewModel.bootiArticle="Armoire de Chambre";
			viewModel.bootiPrice="1000 $";
			viewModel.bootiAdresse="Av poids lourd,N°5,C/Lemba";
			viewModel.bootiColor="green";
			
			viewModel.genre="Meuble";
			viewModel.style="Classique";
			viewModel.path="meuble";
			viewModel.classe="meuble";
			viewModel.banner_flag="";
			viewModel.description="Ici vous trouver toutes sortes d'equipement pour equiper valable toutes les pieces de votre maisons"
			if(allCategorie.length>0 && myCategorie.length>0){
				renderPost(viewModel,myCategorie,allCategorie,"meuble",res,req);				
			}
		}
		if(path==="/electromenager"){
			var categorie=classe.categorie.electromenager;			
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categorie){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categorie[i];
				myCategorie.push(categorieObject);
				
				allCategorie.push(i);
			}
			viewModel.bootiName="U A C";
			viewModel.bootiArticle="Congellateur 1000 L";
			viewModel.bootiPrice="500 $";
			viewModel.bootiAdresse="Av poids lourd,N°5,C/Lemba";
			viewModel.bootiColor="green";
			
			viewModel.genre="Equipement";
			viewModel.style="Electromenager";
			viewModel.path="electromenager";
			viewModel.classe="electromenager";
			viewModel.banner_flag="";
			viewModel.description="Ici vous trouver toutes sortes d'equipement pour equiper valable toutes les pieces de votre maisons"
			if(allCategorie.length>0 && myCategorie.length>0){
				renderPost(viewModel,myCategorie,allCategorie,"electromenager",res,req);				
			}
		}
		if(path==="/high_tech"){
			var categorie=classe.categorie.high_tech;			
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categorie){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categorie[i];
				myCategorie.push(categorieObject);
				
				allCategorie.push(i);
			}
			viewModel.bootiName="Info Tech";
			viewModel.bootiArticle="Iphone 10 Classique";
			viewModel.bootiPrice="1000 $";
			viewModel.bootiAdresse="Av poids lourd,N°5,C/Lemba";
			viewModel.bootiColor="green";
			
			viewModel.genre="Domaine";
			viewModel.style="High Tech";
			viewModel.path="high_tech";
			viewModel.classe="high tech";
			viewModel.banner_flag="";
			viewModel.description="Ici vous trouver toutes sortes d'equipement pour equiper valable toutes les pieces de votre maisons"
			
			if(allCategorie.length>0 && myCategorie.length>0){
				renderPost(viewModel,myCategorie,allCategorie,"high_tech",res,req);				
			}else{
				res.redirect("/");
			}
		}		
	},
	womenPost:function(req,res){
		var viewModel={};		
		var select_categorie=req.params.category;
		var url=(req.path).split("/");
		var classPost=url[1];
		console.log("classie");
		console.log(classPost);
		if(select_categorie){
			var categorie=classe.categorie[classPost];
			var allCategorie=[];
			
			var myCategorie=[];
			for(var i in categorie){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categorie[i];
				myCategorie.push(categorieObject);
				
				allCategorie.push(i);
			}
			if(allCategorie.length>0 && myCategorie.length>0){
				console.log("here we are")
				viewModel.categorie=myCategorie;
				viewModel.select_categorie=select_categorie;
				viewModel.classe=classPost;
				var type=classe.categorie[classPost][select_categorie];
												
				var tab=[];
				var allTypes=[];
				if(req.session.logIn){
					console.log("is there a laber")
					if(req.session.admin){
						console.log("admin is find")
						for(let i=0; i<type.length;i++){							
							Article.find({classe:classPost,categorie:select_categorie,type:type[i],boutiUsername:req.session.admin.username},function(err,articles){
								if(err){
									res.redirect("/")
								}
								else{
									tab.push(i);
									if(articles.length>0){
										var object_article={};
										object_article.name=type[i];
										object_article.articles=articles;
										allTypes.push(object_article);
									}
									if(tab.length===type.length){
										viewModel.admin=req.session.admin;
										viewModel.type=allTypes;										
										res.render("adminPostCategorie",viewModel);
									}
								}
							});
						}
					}
					if(req.session.member){
						for(let i=0; i<type.length;i++){							
							Article.find({flag:true,classe:classPost,categorie:select_categorie,type:type[i],approved:true,approvedcontent:true},function(err,articles){
								if(err){
									res.redirect("/")
								}
								else{
									tab.push(i);
									if(articles.length>0){
										var object_article={};
										object_article.name=type[i];
										object_article.articles=articles;
										allTypes.push(object_article);
									}
									if(tab.length===type.length){
										viewModel.member=req.session.member;
										viewModel.type=allTypes;										
										res.render("postCategorie",viewModel);
									}
								}
							});
						}
					}
				}else{
					for(let i=0; i<type.length;i++){							
							Article.find({flag:true,classe:classPost,categorie:select_categorie,type:type[i],approved:true,approvedcontent:true},function(err,articles){
								if(err){
									res.redirect("/")
								}
								else{
									tab.push(i);
									if(articles.length>0){
										var object_article={};
										object_article.name=type[i];
										object_article.articles=articles;
										allTypes.push(object_article);
									}
									if(tab.length===type.length){
										
										viewModel.type=allTypes;										
										res.render("postCategorie",viewModel);
									}
								}
							});
						}
				}
								
			}else{
				res.redirect("/");
			}
		}
	},
	womenType:function(req,res){
		var viewModel={};
		var select_categorie=req.params.category;
		var url=(req.path).split("/");
		var classPost=url[1]
		var select_type=req.params.type;
		if(deleteSpace(select_categorie)&&deleteSpace(select_type)){
			var categories=classe.categorie[classPost];
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categories){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categories[i];
				myCategorie.push(categorieObject);				
				allCategorie.push(i);
			}
			if(allCategorie.length>0 && myCategorie.length>0){
				viewModel.categorie=myCategorie;
				viewModel.select_categorie=select_categorie;
				viewModel.select_type=select_type;
				viewModel.classe=classPost;
				
				if(req.session.logIn){
					if(req.session.admin){
						viewModel.admin=req.session.admin;										
						Article.find({classe:classPost,categorie:select_categorie,type:select_type,boutiUsername:req.session.admin.username},function(err,articles){
							if(err){
								res.redirect("/");
							}
							if(articles){
								
								viewModel.articles=articles;
								res.render("adminPostType",viewModel);								
							}else{
								viewModel.articles=articles;
								res.render("adminPostType",viewModel);
							}
						});
					}
					if(req.session.member){
						viewModel.member=req.session.member;										
						Article.find({flag:true,classe:classPost,categorie:select_categorie,type:select_type,approved:true,approvedcontent:true},function(err,articles){
							if(err){
								res.redirect("/");
							}
							if(articles){
								viewModel.articles=articles;
								res.render("postType",viewModel);								
							}else{
								viewModel.articles=articles;
								res.render("postType",viewModel);
							}
						});
					}
				}else{
					Article.find({flag:true,classe:classPost,categorie:select_categorie,type:select_type,approved:true,approvedcontent:true},function(err,articles){
							if(err){
								res.redirect("/");
							}
							if(articles){
								viewModel.articles=articles;
								res.render("postType",viewModel);								
							}else{
								viewModel.articles=articles;
								res.render("postType",viewModel);
							}
						});
				}
				
			}
		}
	},
	articleDetail:function(req,res){
		console.log("categorie");
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
		//console.log("categorie");
		//console.log(categorie);
			var allCategorie=[];
			var myCategorie=[];
			for(var i in categories){
				var categorieObject={};
				categorieObject.name=i;
				categorieObject.type=categories[i];
				myCategorie.push(categorieObject);
				
				allCategorie.push(i);
			}
			//console.log("article")
			if(allCategorie.length>0 && myCategorie.length>0){
				//console.log("ddarticle")
				if((deleteSpace(categorie)).length>0&&(deleteSpace(type)).length>0&&(deleteSpace(id)).length>0){
					viewModel.classe=classPost;
					viewModel.categorie=myCategorie;
					viewModel.select_categorie=categorie;
					viewModel.type=type;
				console.log("okkked");					
					if(req.session.logIn){
						console.log("okkked login");	
						if(req.session.logIn && req.session.admin){
							Article.findOne({_id:id,boutiUsername:req.session.admin.username},function(err,article){
								if(err){
									res.redirect("/");
								}
								else if(article){										
									viewModel.admin=req.session.admin;
									viewModel.adminArticle="true";									
									viewModel.article=article;									
									req.session.lastPath=req.path;
									
									if(color_id){
										Color.find({articleId:article._id},function(err,allColors){										
											if(allColors){
												if(allColors.length>0){
													viewModel.allColors=allColors;
													Color.findOne({articleId:article._id,_id:color_id},function(err,color){
														if(color){
															viewModel.color=color;
															/**Begining of code***/
															ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																if(err){
																	console.log("reess");
																	res.render("adminArticleDetail",viewModel);
																}else if(detail){
																	viewModel.articledetail=detail;
																	Typical.find({articleId:article._id},function(err,typical){
																		if(err){
																			console.log("err");
																			console.log(err);
																			
																			res.render("adminArticleDetail",viewModel);
																		}else if(typical){
																			if(typical.length>0){
																				console.log("typical");
																				console.log(typical);
																				viewModel.typical=typical;
																				//viewModel.articledetail=detail;
																				res.render("adminArticleDetail",viewModel);
																			}else{
																				console.log("no typical");
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				res.render("adminArticleDetail",viewModel);
																			}
																		}else{
																			console.log("no typical");
																			viewModel.notypical=true;
																			//viewModel.articledetail=detail;
																			res.render("adminArticleDetail",viewModel);
																		}
																	});
																	
																}else{
																	console.log("ibidem");
																	res.render("adminArticleDetail",viewModel);
																}
															});
																/**End of code**/
														}else{
															Color.findOne({articleId:article._id,principal:true},function(err,color){
																if(color){
																	viewModel.color=color;
																	console.log("viewModel");
																	console.log(viewModel);
																	//res.render("adminArticleDetail",viewModel);
																	/**Begining of code***/
																		ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																			if(err){
																				console.log("osat");
																				res.render("adminArticleDetail",viewModel);
																			}else if(detail){
																				viewModel.articledetail=detail;
																				Typical.find({articleId:article._id},function(err,typical){
																					if(err){
																						console.log("err is there");
																						console.log(err);
																						//viewModel.articledetail=detail;
																						res.render("adminArticleDetail",viewModel);
																					}else if(typical){
																						if(typical.length>0){
																							console.log("no typical here");
																							viewModel.typical=typical;
																							//viewModel.articledetail=detail;
																							res.render("adminArticleDetail",viewModel);
																						}else{
																							console.log("no typical is found");
																							viewModel.notypical=true;
																							//viewModel.articledetail=detail;
																							res.render("adminArticleDetail",viewModel);
																						}
																					}else{
																						console.log("any typical is tere");
																						viewModel.notypical=true;
																						//viewModel.articledetail=detail;
																						res.render("adminArticleDetail",viewModel);
																					}
																				});
																				
																			}else{
																				console.log("osman");
																				res.render("adminArticleDetail",viewModel);
																			}
																		});
																			/**End of code**/
																}else{
																	res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
																}													
															});
														}													
													});
												}else{
													res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
												}
																						
											}else{
												res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
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
															console.log("viewModel");
															console.log(viewModel);
															//res.render("adminArticleDetail",viewModel);
															/**Begining of code***/
																ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																	if(err){
																		console.log("error is there");
																		res.render("adminArticleDetail",viewModel);
																	}else if(detail){
																		console.log("detail");
																		console.log(detail);
																		viewModel.articledetail=detail;
																		Typical.find({articleId:article._id},function(err,typical){
																			if(err){
																				console.log("error is present");
																				//viewModel.articledetail=detail;
																				res.render("adminArticleDetail",viewModel);
																			}else if(typical){
																				if(typical.length>0){
																					console.log("typical is there");
																					console.log(typical);
																					viewModel.typical=typical;
																					//viewModel.articledetail=detail;
																					res.render("adminArticleDetail",viewModel);
																				}else{
																					console.log("sorry no typicla");
																					viewModel.notypical=true;
																					//viewModel.articledetail=detail;
																					res.render("adminArticleDetail",viewModel);
																				}
																			}else{
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				console.log("no typical is present");
																				res.render("adminArticleDetail",viewModel);
																			}
																		});
																		
																	}else{
																		console.log("long ways");
																		res.render("adminArticleDetail",viewModel);
																	}
																});
																	/**End of code**/
														}else{
															res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
														}													
													});
												}else{
													res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
												}																					
											}else{
												res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
											}
										});
									}						
																								
								}else{
									res.redirect("/");
								}
							})
						}
						
						if(req.session.logIn && req.session.member){
							Article.findOne({_id:id,approved:true,flag:true,approvedcontent:true},function(err,article){
								if(err){
									res.redirect("/");
								}
								else if(article){								
									viewModel.member=req.session.member;
																		
									viewModel.article=article;									
									req.session.lastPath=req.path;
									
									if(color_id){
										Color.find({articleId:article._id,approved:true,active:true},function(err,allColors){										
											if(allColors){
												if(allColors.length>0){
													viewModel.allColors=allColors;
													Color.findOne({articleId:article._id,_id:color_id,approved:true},function(err,color){
														if(color){
															if(color.active){
																viewModel.color=color;
																console.log("viewModel");
																console.log(viewModel);
																/**Begining of code***/
																ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																	if(err){
																		console.log("error is there");
																		res.render("articleDetail",viewModel);
																	}else if(detail){
																		console.log("detail");
																		console.log(detail);
																		viewModel.articledetail=detail;
																		Typical.find({articleId:article._id},function(err,typical){
																			if(err){
																				console.log("error is present");
																				//viewModel.articledetail=detail;
																				res.render("articleDetail",viewModel);
																			}else if(typical){
																				if(typical.length>0){
																					console.log("typical is there");
																					console.log(typical);
																					viewModel.typical=typical;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}else{
																					console.log("sorry no typicla");
																					viewModel.notypical=true;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}
																			}else{
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				console.log("no typical is present");
																				res.render("articleDetail",viewModel);
																			}
																		});
																		
																	}else{
																		console.log("long ways");
																		res.render("articleDetail",viewModel);
																	}
																});
																	/**End of code**/
																//res.render("articleDetail",viewModel);
															}else{
																Color.findOne({articleId:article._id,principal:true,approved:true},function(err,color){
																	if(color){
																		viewModel.color=color;
																		console.log("viewModel");
																		console.log(viewModel);
																		/**Begining of code***/
																ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																	if(err){
																		console.log("error is there");
																		res.render("articleDetail",viewModel);
																	}else if(detail){
																		console.log("detail");
																		console.log(detail);
																		viewModel.articledetail=detail;
																		Typical.find({articleId:article._id},function(err,typical){
																			if(err){
																				console.log("error is present");
																				//viewModel.articledetail=detail;
																				res.render("articleDetail",viewModel);
																			}else if(typical){
																				if(typical.length>0){
																					console.log("typical is there");
																					console.log(typical);
																					viewModel.typical=typical;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}else{
																					console.log("sorry no typicla");
																					viewModel.notypical=true;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}
																			}else{
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				console.log("no typical is present");
																				res.render("articleDetail",viewModel);
																			}
																		});
																		
																	}else{
																		console.log("long ways");
																		res.render("articleDetail",viewModel);
																	}
																});
																	/**End of code**/
																		//res.render("articleDetail",viewModel);	
																	}else{
																		res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
																	}													
																});
															}
																
														}else{
															Color.findOne({articleId:article._id,principal:true,approved:true},function(err,color){
																if(color){
																	viewModel.color=color;
																	console.log("viewModel");
																	console.log(viewModel);
																	/**Begining of code***/
																ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																	if(err){
																		console.log("error is there");
																		res.render("articleDetail",viewModel);
																	}else if(detail){
																		console.log("detail");
																		console.log(detail);
																		viewModel.articledetail=detail;
																		Typical.find({articleId:article._id},function(err,typical){
																			if(err){
																				console.log("error is present");
																				//viewModel.articledetail=detail;
																				res.render("articleDetail",viewModel);
																			}else if(typical){
																				if(typical.length>0){
																					console.log("typical is there");
																					console.log(typical);
																					viewModel.typical=typical;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}else{
																					console.log("sorry no typicla");
																					viewModel.notypical=true;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}
																			}else{
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				console.log("no typical is present");
																				res.render("articleDetail",viewModel);
																			}
																		});
																		
																	}else{
																		console.log("long ways");
																		res.render("articleDetail",viewModel);
																	}
																});
																	/**End of code**/
																	//res.render("articleDetail",viewModel);	
																}else{
																	res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
																}													
															});
														}													
													});
												}else{
													res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
												}
																						
											}else{
												res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
											}
										});
									}else{
										Color.find({articleId:article._id,approved:true,active:true},function(err,allColors){										
											if(allColors){
												if(allColors.length>0){
													viewModel.allColors=allColors;
													Color.findOne({articleId:article._id,principal:true,approved:true},function(err,color){
														if(color){
															viewModel.color=color;
															console.log("viewModel");
															console.log(viewModel);
															//res.render("articleDetail",viewModel);
															/**Begining of code***/
																ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																	if(err){
																		console.log("error is there");
																		res.render("articleDetail",viewModel);
																	}else if(detail){
																		console.log("detail");
																		console.log(detail);
																		viewModel.articledetail=detail;
																		Typical.find({articleId:article._id},function(err,typical){
																			if(err){
																				console.log("error is present");
																				//viewModel.articledetail=detail;
																				res.render("articleDetail",viewModel);
																			}else if(typical){
																				if(typical.length>0){
																					console.log("typical is there");
																					console.log(typical);
																					viewModel.typical=typical;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}else{
																					console.log("sorry no typicla");
																					viewModel.notypical=true;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}
																			}else{
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				console.log("no typical is present");
																				res.render("articleDetail",viewModel);
																			}
																		});
																		
																	}else{
																		console.log("long ways");
																		res.render("articleDetail",viewModel);
																	}
																});
																	/**End of code**/
														}else{
															res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
														}													
													});
												}else{
													res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
												}																					
											}else{
												res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
											}
										});
									}						
																								
								}else{
									res.redirect("/");
								}
							});
						}
					}else{
						Article.findOne({_id:id,approved:true,flag:true,approvedcontent:true},function(err,article){
								if(err){
									res.redirect("/");
								}
								else if(article){								
									viewModel.member=req.session.member;
																		
									viewModel.article=article;									
									req.session.lastPath=req.path;
									
									if(color_id){
										Color.find({articleId:article._id,approved:true,active:true},function(err,allColors){										
											if(allColors){
												if(allColors.length>0){
													viewModel.allColors=allColors;
													Color.findOne({articleId:article._id,_id:color_id,approved:true},function(err,color){
														if(color){
															if(color.active){
																viewModel.color=color;
																console.log("viewModel");
																console.log(viewModel);
																//res.render("articleDetail",viewModel);
																/**Begining of code***/
																ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																	if(err){
																		console.log("error is there");
																		res.render("articleDetail",viewModel);
																	}else if(detail){
																		console.log("detail");
																		console.log(detail);
																		viewModel.articledetail=detail;
																		Typical.find({articleId:article._id},function(err,typical){
																			if(err){
																				console.log("error is present");
																				//viewModel.articledetail=detail;
																				res.render("articleDetail",viewModel);
																			}else if(typical){
																				if(typical.length>0){
																					console.log("typical is there");
																					console.log(typical);
																					viewModel.typical=typical;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}else{
																					console.log("sorry no typicla");
																					viewModel.notypical=true;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}
																			}else{
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				console.log("no typical is present");
																				res.render("articleDetail",viewModel);
																			}
																		});
																		
																	}else{
																		console.log("long ways");
																		res.render("articleDetail",viewModel);
																	}
																});
																	/**End of code**/
															}else{
																Color.findOne({articleId:article._id,principal:true,approved:true},function(err,color){
																	if(color){
																		viewModel.color=color;
																		console.log("viewModel");
																		console.log(viewModel);
																		//res.render("articleDetail",viewModel);
																		/**Begining of code***/
																ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																	if(err){
																		console.log("error is there");
																		res.render("articleDetail",viewModel);
																	}else if(detail){
																		console.log("detail");
																		console.log(detail);
																		viewModel.articledetail=detail;
																		Typical.find({articleId:article._id},function(err,typical){
																			if(err){
																				console.log("error is present");
																				//viewModel.articledetail=detail;
																				res.render("articleDetail",viewModel);
																			}else if(typical){
																				if(typical.length>0){
																					console.log("typical is there");
																					console.log(typical);
																					viewModel.typical=typical;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}else{
																					console.log("sorry no typicla");
																					viewModel.notypical=true;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}
																			}else{
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				console.log("no typical is present");
																				res.render("articleDetail",viewModel);
																			}
																		});
																		
																	}else{
																		console.log("long ways");
																		res.render("articleDetail",viewModel);
																	}
																});
																	/**End of code**/
																	}else{
																		res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
																	}													
																});
															}																
														}else{
															Color.findOne({articleId:article._id,principal:true,approved:true},function(err,color){
																if(color){
																	viewModel.color=color;
																	console.log("viewModel");
																	console.log(viewModel);
																	//res.render("articleDetail",viewModel);
																	/**Begining of code***/
																ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																	if(err){
																		console.log("error is there");
																		res.render("articleDetail",viewModel);
																	}else if(detail){
																		console.log("detail");
																		console.log(detail);
																		viewModel.articledetail=detail;
																		Typical.find({articleId:article._id},function(err,typical){
																			if(err){
																				console.log("error is present");
																				//viewModel.articledetail=detail;
																				res.render("articleDetail",viewModel);
																			}else if(typical){
																				if(typical.length>0){
																					console.log("typical is there");
																					console.log(typical);
																					viewModel.typical=typical;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}else{
																					console.log("sorry no typicla");
																					viewModel.notypical=true;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}
																			}else{
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				console.log("no typical is present");
																				res.render("articleDetail",viewModel);
																			}
																		});
																		
																	}else{
																		console.log("long ways");
																		res.render("articleDetail",viewModel);
																	}
																});
																	/**End of code**/
																}else{
																	res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
																}													
															});
														}													
													});
												}else{
													res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
												}
																						
											}else{
												res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
											}
										});
									}else{
										Color.find({articleId:article._id,approved:true,active:true},function(err,allColors){										
											if(allColors){
												if(allColors.length>0){
													viewModel.allColors=allColors;
													Color.findOne({articleId:article._id,principal:true,approved:true},function(err,color){
														if(color){
															viewModel.color=color;
															console.log("viewModel");
															console.log(viewModel);
															//res.render("articleDetail",viewModel);
															/**Begining of code***/
																ArticleDetail.find({category:article.categorie,classe:article.classe},function(err,detail){
																	if(err){
																		console.log("error is there");
																		res.render("articleDetail",viewModel);
																	}else if(detail){
																		console.log("detail");
																		console.log(detail);
																		viewModel.articledetail=detail;
																		Typical.find({articleId:article._id},function(err,typical){
																			if(err){
																				console.log("error is present");
																				//viewModel.articledetail=detail;
																				res.render("articleDetail",viewModel);
																			}else if(typical){
																				if(typical.length>0){
																					console.log("typical is there");
																					console.log(typical);
																					viewModel.typical=typical;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}else{
																					console.log("sorry no typicla");
																					viewModel.notypical=true;
																					//viewModel.articledetail=detail;
																					res.render("articleDetail",viewModel);
																				}
																			}else{
																				viewModel.notypical=true;
																				//viewModel.articledetail=detail;
																				console.log("no typical is present");
																				res.render("articleDetail",viewModel);
																			}
																		});
																		
																	}else{
																		console.log("long ways");
																		res.render("articleDetail",viewModel);
																	}
																});
																	/**End of code**/
														}else{
															res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
														}													
													});
												}else{
													res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
												}																					
											}else{
												res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type);
											}
										});
									}						
																								
								}else{
									res.redirect("/");
								}
							});
					}					
				}else{
					res.redirect("/");
				}				
			}		
	},
	addToShop:function(req,res){
		var viewModel={};
		if(req.session.logIn){
			var articleId=deleteSpace(req.params.articleId);
			var username=deleteSpace(req.params.username);
			var lastPath=deleteSpace(req.session.lastPath);			
			
			if(req.body){
				req.session.body=req.body;
				if(req.body.color && req.body.size && req.body.quantite){					
					User.findOne({username:username},function(err,user){
						if(err){
							console.log("error is been made");
							res.redirect(lastPath);					
						}
						if(user){
							Article.findOne({_id:articleId,flag:true,approvedcontent:true},function(err,article){
								if(err){
									res.redirect(lastPath);
								}
								if(article){
									var size=article.definitiveSize;
									if(size.indexOf(req.body.size)>-1){
										if(req.body.quantite>0){											
											Panier.findOne({username:username,size:(deleteSpace(req.body.size)),quantite:(deleteSpace(req.body.quantite)),color:(req.body.color),articleId:article._id,commande:false},function(err,panier){
												if(err){
													res.redirect(lastPath);
												}
												if(panier){
													req.session.exist_panier=true;
													res.redirect(lastPath);
													//console.log("mon panier");
												}else{
													var price="";
													var quanta=deleteSpace(req.body.quantite);
													if(quanta>=article.definitiveWholeNumber){
														price=quanta*(article.definitiveWholePrice);
													}
													if(quanta<article.definitiveWholePrice){
														price=quanta*(article.definitivePrice);
													}
													
														Color.find({articleId:article._id},function(err,allColors){
															if(err){
																
															}
															if(allColors){
																var colors=allColors;
																newColor=[];
																var colorId="";
																
																for(var i=0; i<allColors.length;i++){
																	if(allColors[i].name===deleteSpace(req.body.color)){
																		var filename=allColors[i].filename1;
																		colorId=allColors[i]._id;
																		var first={
																			color:deleteSpace(req.body.color),
																			active:true
																		}
																		newColor.push(first);
																	}else{
																		var second={
																			color:allColors[i].name
																		}
																		newColor.push(second);
																	}
																}
																
																var sizes=article.definitiveSize;
																
																var newSize=[];
																
																for(var i=0; i<sizes.length;i++){
																	if(sizes[i]===deleteSpace(req.body.size)){
																		var first={
																			size:deleteSpace(req.body.size),
																			active:true
																		}
																		newSize.push(first);
																	}else{
																		var second={
																			size:sizes[i]
																		}
																		newSize.push(second);
																	}
																}
																
																if(newSize.length===sizes.length){
																		var newPanier=new Panier({
																			username:username,
																			articleId:article._id,
																			classe:article.classe,
																			type:article.type,
																			title:article.definitiveName,
																			mark:article.mark,
																			categorie:article.categorie,
																			description:article.definitiveDescription,
																			size:deleteSpace(req.body.size),
																			sizes:newSize,
																			quantite:deleteSpace(req.body.quantite),
																			color:deleteSpace(req.body.color),
																			colors:newColor,
																			colorId:colorId,
																			price:price,
																			filename:filename													
																		});
																	}
																
																newPanier.save(function(err,newpanier){
																	req.session.panier_added=true;
																	delete req.session.body;													
																	if(err){
																		res.redirect(lastPath);
																	}
																	res.redirect("/panier");
																	
																});
															}
														});
																								
													
												}
											});
										}else{
											req.session.quantite_no_admissible=true;
											res.redirect(lastPath);
										}
										
									}else{
										req.session.size_no_admissible=true;
										res.redirect(lastPath);
									}
								}
							});
				
						}else{
							res.redirect(lastPath);
						}
					});
			}else{
					if(!req.body.size){
						req.session.no_size=true;
						
					}
					if(!req.body.quantite){
						req.session.no_quantite=true;
						
					}
					console.log("is absent")
					res.redirect(lastPath);
					
				}
			}else{
				req.session.no_size=true;
				req.session.no_quantite=true;
				res.redirect(lastPath);	
			}			
		}else{
			res.redirect("/login");			
		}
	},
	addToCart:function(req,res){		
		res.redirect("/login");		
	},
	getPanier:function(req,res){		
		if(req.session.logIn){	
			var viewModel={};
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.redirect("/login");
				}
				if(admin){
					res.render("panier");
				}else{
					User.findOne({username:username},function(err,user){
						if(err){
							res.redirect("/login")
						}
						if(user){
							viewModel.member=req.session.member;
							if(req.session.deleteSuccess){
								viewModel.deleteSuccess=req.session.deleteSuccess;
								delete req.session.deleteSuccess;
							}
							if(req.session.deleteError){
								viewModel.deleteError=req.session.deleteError;
								delete req.session.deleteError;
							}
							if(req.session.commande_error){
								viewModel.commande_error=req.session.commande_error;
								delete req.session.commande_error;
							}
							if(req.session.operatorError){
								viewModel.operatorError=req.session.operatorError;
								delete req.session.operatorError
							}
							if(req.session.noadmissibe_operator){
								viewModel.noadmissibe_operator=req.session.noadmissibe_operator;
								delete req.session.noadmissibe_operator;
							}
							Panier.find({username:username,commande:false},function(err,panier){
								if(err){
									res.redirect("/login")
								}
									var gender=user.gender;
									if(gender){
										var categorie=classe.categorie[gender];
										viewModel.classe=gender;
									}else{
										var categorie=classe.categorie.femmes;
										viewModel.classe="femmes";
									}
													
										var allCategorie=[];
										var myCategorie=[];
										for(var i in categorie){
											var categorieObject={};
											categorieObject.name=i;
											categorieObject.type=categorie[i];
											myCategorie.push(categorieObject);				
											allCategorie.push(i);
										}
										if(myCategorie.length>0){
											viewModel.categorie=myCategorie;
										}
										
								if(panier){
									console.log("panier");
									console.log(panier);
									if(req.session.deleteError){
										viewModel.deleteError=true;
										delete req.session.deleteError;
									}
									if(panier.length>0){
										viewModel.panier=panier;
										
										var colors=panier.colors;
										console.log("panier.sizes");
										console.log(panier[0]);
									
										viewModel.panier_id=panier._id;
										viewModel.panier_length=panier.length
										viewModel.panier_price=100;
										res.render("panier",viewModel);										
									}else{
										viewModel.no_panier=true;
										viewModel.panier_length=0;
										viewModel.panier_price=0;
										res.render("panier",viewModel);
									}
									
								}else{
									viewModel.no_panier=true;
									res.render("panier",viewModel);
								}
							});
							
						}else{
							res.redirect("/login");
						}
					});
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	deletePanier:function(req,res){
		var id=req.params.id;
		if(req.session.logIn){
			var viewModel={};
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.redirect("/login");
				}
				if(admin){
					res.render("panier");
				}else{
					if(deleteSpace(id)){
						User.findOne({username:username},function(err,user){
							if(err){
								res.redirect("/login")
							}
							if(user){
								viewModel.member=req.session.member;
								Panier.findOne({_id:id,commande:false},function(err,article){
									if(err){
										res.redirect("/panier");
										req.session.deleteError=true;
									}
									if(article){
										Panier.remove({_id:id,commande:false},function(err){
											if(err){
												req.session.deleteError=true;
												res.redirect("/panier");
											}else{
												req.session.deleteSuccess=true;
												res.redirect("/panier");
											}
										});
									}else{
										req.session.deleteError=true;
										res.redirect("/panier");
									}
								});
							}else{
								res.redirect("/login");
							}
						});
					}else{
						req.session.deleteError=true;
						res.redirect("/panier");
					}
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	
	
	editSize:function(req,res){
		console.log("req.body");
		console.log(req.body);
		var id=req.body.id;
		var size=req.body.size;		
		if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.json({logOff:true})
				}
				if(admin){
					res.json({adminLogOff:true});
					
				}else{
					if(deleteSpace(id)){
						User.findOne({username:username},function(err,user){
							if(err){
								res.json({err:true})
								console.log("error");
							}
							if(user){
								
								Panier.findOne({_id:id,commande:false},function(err,panier){
									if(err){									
										res.json({err:true});
										console.log("error is thers");
									}
									if(panier){
										var articleId=panier.articleId;
										Article.findOne({_id:articleId,flag:true,approvedcontent:true},function(err,article){
										if(panier.username===username){										
											var object={};										
											if(panier.size!==size){
												object.sizeChanged=true;
											}											
											panier.size=size;										
												var sizes=panier.sizes;
												
												var newSizes=[];												
												for(let i=0;i<sizes.length;i++){												
													
													if(((panier.sizes)[i]).size===size){														
														newSizes.push({
															size:size,
															active:true
														})
													}else{
														newSizes.push({
															size:sizes[i].size
														})
													}
																									
													if(sizes.length===newSizes.length ){
														panier.sizes=newSizes;
														panier.save(function(err,data){																	
																	object.panier=data;																	
																	res.json(object)
																});
													}													
												}																		
										
										}else{
											console.log("error is present")
											res.json({err:true});
										}
									});
									}
								});
							}
						});
					}else{
						console.log("error is caathc");
						res.json({err:true})
					}
				}
			});
		}else{
			res.json({logOff:true})
		}
	},
	editColor:function(req,res){
		console.log("req.body");
		console.log(req.body);
		var id=req.body.id;
		var color=req.body.color;		
		if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.json({logOff:true})
				}
				if(admin){
					res.json({adminLogOff:true});
					
				}else{
					if(deleteSpace(id)){
						User.findOne({username:username},function(err,user){
							if(err){
								res.json({err:true})
								console.log("error");
							}
							
							
							if(user){								
								Panier.findOne({_id:id,commande:false},function(err,panier){
									if(err){									
										res.json({err:true});
										console.log("error is thers");
									}
									if(panier){
										var articleId=panier.articleId;
										Article.findOne({_id:articleId,flag:true,approvedcontent:true},function(err,article){
										if(panier.username===username){										
											var object={};
											if(panier.color!==color){
												object.colorChanged=true;
											}											
												panier.color=color;											
												var colors=panier.colors;											
												var newColors=[];
												console.log("colors is been changed");
												for(var i=0;i<colors.length;i++){													
													if(((panier.colors)[i].color)===color){
														newColors.push({
															color:color,
															active:true
														});
													}else{
														newColors.push({
															color:colors[i].color
														});	
													}
																								
													if(colors.length===newColors.length ){
														panier.colors=newColors;
														panier.save(function(err,data){
																object.panier=data;
																
																res.json(object)
															});
													}												
												}																							
										
										}else{
											console.log("error is present")
											res.json({err:true});
										}
									});
									}
								});
							}
						});
					}else{
						console.log("error is caathc");
						res.json({err:true})
					}
				}
			});
		}else{
			res.json({logOff:true})
		}
	},
	editQuantite:function(req,res){
		console.log("req.body");
		console.log(req.body);
		var id=req.body.id;
		var quantite=req.body.quantite;		
		if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.json({logOff:true})
				}
				if(admin){
					res.json({adminLogOff:true});
					
				}else{
					if(deleteSpace(id)){
						User.findOne({username:username},function(err,user){
							if(err){
								res.json({err:true})
								console.log("error");
							}
							if(user){
								
								Panier.findOne({_id:id,commande:false},function(err,panier){
									if(err){									
										res.json({err:true});
										console.log("error is thers");
									}
									if(panier){
										var articleId=panier.articleId;
										Article.findOne({_id:articleId,flag:true,approvedcontent:true},function(err,article){
										if(panier.username===username){										
											var object={};										
											
											if(panier.quantite!==quantite && quantite>0){
												object.quantiteChanged=true;
												var price="";
												var quanta=deleteSpace(req.body.quantite);
												if(quanta>=article.definitiveWholeNumber){
													price=quanta*(article.definitiveWholePrice);
												}
												if(quanta<article.definitiveWholeNumber){
													price=quanta*(article.definitivePrice);
												}
												panier.quantite=quantite;
												panier.price=price;
												panier.save(function(err,data){
													object.panier=data;
													console.log("size is changer");
													console.log(data);
													res.json(object)
												});
											}else{
												object.panier=panier;
												res.json(object);
											}
																					
										}else{
											console.log("error is present")
											res.json({err:true});
										}
									});
									}
								});
							}
						});
					}else{
						console.log("error is caathc");
						res.json({err:true})
					}
				}
			});
		}else{
			res.json({logOff:true})
		}
	},
	profil:function(req,res){
		res.redirect("/profil/identite");
	},
	identite:function(req,res){
		if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.redirect("/login")
				}
				if(admin){
					res.redirect("/login")
					
				}else{
						var viewModel={};
						User.findOne({username:username},function(err,user){
							if(err){
								res.redirect("/login");								
							}
							if(user){
								viewModel.user=user;
								var name=user.name;
								var firstLetter=name.substring(0,1);
								viewModel.firstLetter=firstLetter.toUpperCase();
								if(req.session.nonewpassword){
									viewModel.nonewpassword=true;
									delete req.session.nonewpassword;
								}
								if(req.session.nolastpassword){
									viewModel.nolastpassword=true;
									delete req.session.nolastpassword;
								}
								
								if(req.session.check_lastpassword){
									viewModel.check_lastpassword=true;
									delete req.session.check_lastpassword;
								}
								if(req.session.lastpassword){
									viewModel.lastpassword=req.session.lastpassword;
									delete req.session.lastpassword;							
								}
								if(req.session.newpassword){
									viewModel.newpassword=req.session.newpassword;
									delete req.session.newpassword;
								}
								
								viewModel.member=req.session.member;
								res.render("profil",viewModel);
							}
						});
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	edit_profil:function(req,res){
		if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.redirect("/login")
				}
				if(admin){
					res.redirect("/login")
					
				}else{
						var viewModel={};
						User.findOne({username:username},function(err,user){
							if(err){
								res.redirect("/login");								
							}
							if(user){
								console.log("req.body");
								var name=deleteSpace(req.body.name);
								var surname=deleteSpace(req.body.surname);
								var username=deleteSpace(req.body.username);
								var phone=deleteSpace(req.body.telephone);
								var town=deleteSpace(req.body.town);
								var commune=deleteSpace(req.body.commune);
								
								if(name.length>0 && user.name!==name){
									user.name=name;
									console.log("is saved");
								}
								if(surname.length>0 && user.surname!==surname){
									user.surname=surname;
								}
								if(username.length>0 && user.username!==surname){
									user.username=username;
								}
								if(town.length>0 && user.town!==town){
									user.town=town;
								}
								if(commune.length>0 && user.commune!==commune){
									user.commune=commune;
								}
								
								user.save(function(err,data){
										if(err){
											console.log(err);
											res.redirect("/profil/identite");
										}
										var init=((data.name).substring(0,1)).toUpperCase();
										var member={};
										member.init=init;
										member.name=data.name;
										member.username=data.username;
										member.surname=data.surname;
										req.session.member=member;
										
										res.redirect("/profil/identite");
									});
								}
							else{
								res.redirect("/login");
							}
						});
				}
			});
		}else{
			res.redirect("/login")
		}
	},
	edit_password:function(req,res){
		if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.redirect("/login")
				}
				if(admin){
					res.redirect("/login")
					
				}else{
						var viewModel={};
						User.findOne({username:username},function(err,user){
							if(err){
								res.redirect("/login");								
							}
							if(user){
								var lastpassword=deleteSpace(req.body.lastpassword);
								var newpassword=req.body.newpassword;
								req.session.lastpassword=lastpassword;
								req.session.newpassword=newpassword;
								if(lastpassword && newpassword){
									
									if(lastpassword.length>0&&newpassword.length){
										if(user.password===lastpassword){
											user.password=newpassword;
											user.password_confirmation=newpassword;
											user.save(function(){
												res.redirect("/profil/identite");
											});
										}else{
											req.session.check_lastpassword=true;
											res.redirect("/profil/identite");
										}
									}else{
										if(lastpassword.length<=0){
											req.session.nolastpassword=true;
										}
										if(newpassword.length<=0){
											req.session.nonewpassword=true;
										}
										res.redirect("/profil/identite");
									}
								}else{
									if(!lastpassword){
										req.session.nolastpassword=true;
									}
									if(!newpassword){
										req.session.nonewpassword=true;
									}
									res.redirect("/profil/identite");
								}								
							}else{
								res.redirect("/login")
							}
						});
				}
			});
	}else{
		res.redirect("/login");
	}
	},
	achat:function(req,res){
		if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.redirect("/login")
				}
				if(admin){
					res.redirect("/login")
					
				}else{
						var viewModel={};
						User.findOne({username:username},function(err,user){
							if(err){
								res.redirect("/login");								
							}
							if(user){
								var viewModel={};
								viewModel.user=user;
								var name=user.name;
								var firstLetter=name.substring(0,1);
								viewModel.firstLetter=firstLetter.toUpperCase();
								viewModel.member=req.session.member;
								Panier.find({username:user.username,commande:true,commandeStep:"inway"},function(err,achat){
									if(err){
										res.redirect("/profil");
									}
									if(achat){
										if(achat.length>0){
											viewModel.achat=achat;
											console.log("achat");
											console.log(achat);
											res.render("achat",viewModel);
										}else{
											viewModel.noinway=true;
											res.render("achat",viewModel);
										}
									}
								});
								
								
							}
						});
				}
			});
		}else{
			res.redirect("/login");	
		}
	},
	commande:function(req,res){
		if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.redirect("/login")
				}
				if(admin){
					res.redirect("/login")
					
				}else{
						var viewModel={};
						User.findOne({username:username},function(err,user){
							if(err){
								res.redirect("/login");								
							}
							if(user){
								var body=req.body.elem;							
								
								if(typeof body==="string"){									
									var commande_id=[body];									
								}else{
									var commande_id=body;
								}
								
								var price=req.params.price;
								var phonepay=req.params.phone;
								var allComande=[];
								var allAchat=[];
								var allPrice=0;
								for(let i=0; i<commande_id.length;i++){								
									Panier.findOne({_id:commande_id[i],commande:false},function(err,panier){
										allComande.push(i);
										if(err){
											if(allComande.length===commande_id.length){
												req.session.commande_error=true;
												res.redirect("/panier")										
											}											
										}
										if(panier){										
											allPrice+=parseFloat(panier.price);
											//console.log("elem is there")
											if(allPrice===parseFloat(price)){
												console.log("elem is there")
												if(allComande.length===commande_id.length){
													console.log("over and over")
													var phoneFlag=phonepay.substr(1,2);
													function operatorTraitement(operatorResponse){																											
														if(operatorResponse){
															for(let j=0; j<commande_id.length;j++){																		
																Panier.findOne({_id:commande_id[j],commande:false},function(err,achat){
																	
																	if(err){
																		if(allAchat.length===commande_id.length){
																			req.session.commande_error=true;
																			res.redirect("/panier");
																		}
																	}
																	if(achat){
																		achat.payphone=phonepay;
																		achat.commande=true;
																		achat.commandeStep="inway";
																		achat.save(function(err,panierSaved){
																			allAchat.push(j);
																			if(allAchat.length===commande_id.length){
																				req.session.successedPay=true;
																				res.redirect("/profil/achat");
																			}
																		});
																	}
																})
															}
														}else{
															console.log("operatorError")
															req.session.operatorError=true;
															res.redirect("/panier");
														}
													}
													
													if(phoneFlag==="81"||phoneFlag==="82"){	
														operatorTraitement(false);
														console.log("is beer");
													}
													else if(phoneFlag==="99"||phoneFlag==="97"){
														operatorTraitement(true)
														console.log("ok is ok")
													}else{
														req.session.noadmissibe_operator=true;
														res.redirect("/panier")
														console.log("one is one")
													}
															
												}
												
												
											}else{
												console.log("life is there");
												if(allComande.length===commande_id.length){
													req.session.commande_error=true;
													res.redirect("/panier")
												}
											}										
										}/*
										else{
											//console.log("else condition")
											if(allComande.length===commande_id.length){
												//req.session.commande_error=true;
												//res.redirect("/panier");
												console.log("else condition")
											}
											
										}*/
									});
								}
								
							}
						})
				}
			});
		}else{
			res.redirect("/login");	
		}
	},
		confirmed:function(req,res){
			if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.redirect("/login")
				}
				if(admin){
					res.redirect("/login")
					
				}else{						
						User.findOne({username:username},function(err,user){
							if(err){
								res.redirect("/login");								
							}
							if(user){
								Panier.findOne({_id:req.params.id,commande:true,commandeStep:"inway"},function(err,panier){
									if(err){
										res.redirect("/profil/achat");
									}
									if(panier){
										panier.commandeStep="deliver";
										panier.save(function(){
											res.redirect("/profil/achat");
										});
									}
								})
							}
						});
				}
			});
			}else{
				res.redirect("/login");	
			}
		},
		delivered:function(req,res){
			if(req.session.logIn){
			if(req.session.member){
				var username=req.session.member.username;
			}
			if(req.session.admin){
				var username=req.session.admin.username;
			}
			Admin.findOne({username:username},function(err,admin){
				if(err){
					res.redirect("/login")
				}
				if(admin){
					res.redirect("/login")
					
				}else{						
						User.findOne({username:username},function(err,user){
							if(err){
								res.redirect("/login");								
							}
							if(user){
								Panier.find({commande:true,commandeStep:"deliver"},function(err,panier){
									if(err){
										res.redirect("/profil/achat");
									}
									if(panier){
										console.log("panier");
										console.log(panier);
										var viewModel={};
										viewModel.user=user;
										var name=user.name;
										var firstLetter=name.substring(0,1);
										viewModel.firstLetter=firstLetter.toUpperCase();
										viewModel.member=req.session.member;
										viewModel.panier=panier;
										res.render("deliver",viewModel);
									}
								});
							}
						});
				}
			});
			}else{
				res.redirect("/logIn");
			}
		},
		deleteCommande:function(req,res){
			var id=deleteSpace(req.params.id);
			if(req.session.logIn){
				if(req.session.member){
					var username=req.session.member.username;
				}
				if(req.session.admin){
					var username=req.session.admin.username;
				}
				Admin.findOne({username:username},function(err,admin){
					if(err){
						res.redirect("/login")
					}
					if(admin){
						res.redirect("/login")
						
					}else{						
							User.findOne({username:username},function(err,user){
								if(err){
									res.redirect("/login");								
								}
								if(user){
									Panier.findOne({_id:id,commande:true,commandeStep:"deliver"},function(err,panier){
										if(err){
											res.redirect("/profil/achat/deliver");
										}
										if(panier){
											panier.commandeStep="delete";
											panier.save(function(){
												res.redirect("/profil/achat/deliver");
											});
										}else{
											res.redirect("/profil/achat/deliver")
										}
									});
								}
							});
					}
				});
			}else{
				res.redirect("/login")
			}
		}
	}
		
