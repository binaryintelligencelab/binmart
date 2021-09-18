/*var user={
	username:"administrator",
	password:123456789,
	role:"admin",
	token:"123456789done",
};
*/
var Admin=require("../models/adm");
var SuperAdmin=require("../models/superAdmin");
var classe=require("../models/classe");
var Article=require("../models/article");
var Color=require("../models/color"),
ArticleDetail=require("../models/articleDetail"),
Filename=require("../models/filename");
var Typical=require("../models/typical");
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
	login:function(req,res){
		if(req.session.admin){
			Admin.findOne({username:req.session.admin.name},function(err,user){
				if(err){res.redirect("/login");}
				if(user){
					if(user.role){
						if(user.role===req.session.admin.role){
							let viewModel={
								title:"AdminLogin"
							};
							if(req.session.false_token){
								viewModel.false_token=req.session.false_token;
								req.session.false_token="";
							}
							res.render("adminLogin",viewModel);
						}else{
							res.redirect("/login")
						}
					}else{
						res.redirect("/login");
					}
				}else{
					res.redirect("/login");
				}
			});	
		}
		else{
			res.redirect("/login");
		}		
	},
	index:function(req,res){
		let viewModel={};
		if(req.session.admin && req.session.logIn){
			Admin.findOne({username:req.session.admin.username},function(err,bouti){
				if(err){res.redirect("/login")}
				if(bouti){
					if(bouti!==null){
						viewModel.bouti=bouti;					
						viewModel.admin=req.session.admin;
						viewModel.title="Maison"+bouti.name;
						if(req.session.noClass){
							viewModel.noClass="noClass";
							delete req.session.noClass;
						}
						if(req.session.noCategorie){
							viewModel.noCategorie="noCategorie";
							delete req.session.noCategorie;
						}
						if(req.session.noType){
							viewModel.noType="noType";
							delete req.session.noType;
						}
						if(req.session.noName){
							viewModel.noName="noName";
							delete req.session.noName;
						}
						if(req.session.noMarque){
							viewModel.noMarque="noMarque";
							delete req.session.noMarque;
						}
						if(req.session.noNumero){
							viewModel.noNumero="noNumero";
							delete req.session.noNumero;
						}
						if(req.session.noDescription){
							viewModel.noDescription="noDescription";
							delete req.session.noDescription;
						}
						if(req.session.noColor){
							viewModel.noColor="noColor";
							delete req.session.noColor;
						}
						if(req.session.noDetailPrice){
							viewModel.noDetailPrice="noDetailPrice";
							delete req.session.noDetailPrice;
						}
						if(req.session.noGrosPrice){
							viewModel.noGrosPrice="noGrosPrice";
							delete req.session.noGrosPrice;
						}
						if(req.session.noGrosNumber){
							viewModel.noGrosNumber="noGrosNumber";
							delete req.session.noGrosNumber;
						}
						if(req.session.noFiles){
							viewModel.noFiles="noFiles";
							delete req.session.noFiles;
						}
						var badCaractere="Ce Champ contient de caracteres inadmissibles";
						
						if(req.session.badcategorie){
							viewModel.badcategorie=badCaractere;
							delete req.session.badcategorie;
						}
						if(req.session.badtype){
							viewModel.badtype=badCaractere;
							delete req.session.badtype;
						}
						if(req.session.badname){
							viewModel.badname=badCaractere;
							delete req.session.badname;
						}
						if(req.session.badmarque){
							viewModel.badmarque=badCaractere;
							delete req.session.badmarque;
						}
						if(req.session.badnumero){
							viewModel.badnumero=badCaractere;
							delete req.session.badnumero;
						}
						if(req.session.baddescription){
							viewModel.baddescription=badCaractere;
							delete req.session.baddescription;
						}
						if(req.session.badfiles){
							viewModel.badfiles=badCaractere;
							delete req.session.badfiles;
						}
						if(req.session.badcolor){
							viewModel.badcolor=badCaractere;
							delete req.session.badcolor;
						}
						if(req.session.baddetail_price){
							viewModel.baddetail_price=badCaractere;
							delete req.session.baddetail_price;
						}
						if(req.session.badgros_price){
							viewModel.badgros_price=badCaractere;
							delete req.session.badgros_price;
						}
						if(req.session.badgros_number){
							viewModel.badgros_number=badCaractere;
							delete req.session.badgros_number;
						}						
						if(req.session.no_gros_number){
							viewModel.no_gros_number=true;
							delete req.session.no_gros_number;
						}
						if(req.session.no_detail_price_number){
							viewModel.no_detail_price_number=true;
							delete req.session.no_detail_price_number
						}
						if(req.session.no_gros_price_number){
							viewModel.no_gros_price_number=true;
							delete req.session.no_gros_price_number
						}
						
						if(req.session.noFiles2){
							viewModel.noFiles2="noFiles2";
							delete req.session.noFiles2;
						}
						if(req.session.badFormat){
							viewModel.badFormat=req.session.badFormat;
							delete req.session.badFormat;
						}						
						if(req.session.body){
							viewModel.body=req.session.body;
							delete req.session.body;
						}
						res.render("adminIndex",viewModel);
					}else{
						res.redirect("/login");
					}					
				}
				else{
					res.redirect("/login");
				}
			});			
		}else{
			res.redirect("/login");
		}
	},
		editInfo:function(req,res){
		if(req.session.logIn){
			if(req.session.admin){
				Admin.findOne({username:req.session.admin.username},function(err,admin){
					if(err){
						if(req.session.lastPath){
							res.redirect(req.session.lastPath);
						}else{
							res.redirect("/login");
						}
					}
					else if(admin){
						var newadminname=deleteSpace(req.body.adminname);
						var newsurname=deleteSpace(req.body.surname);
						var newname=deleteSpace(req.body.name);
						var newUsername=deleteSpace(req.body.username);
						var newrccm=deleteSpace(req.body.rccm);
						var newPhone=deleteSpace(req.body.telephone);
						var phone=""
						if(newPhone.length>0){
							
							var phonePattern=/^\d{9}$/;
							var phonePatter2=/^\d{10}$/;
							var phonePatter3=/^\+?\d{12}$/;
							if(newPhone.match(phonePattern)){
								phone=0+phone;																										
							}
							else if(newPhone.match(phonePatter2)){
								if(newPhone.indexOf("0")===0){
									phone=newPhone;
								}
								else{
									phone="";
								}
							}
							else if(newPhone.match(phonePatter3)&&newPhone.indexOf("+")===0){
								var prefix=newPhone.substring(1,4);
								if(prefix==="243"){
									phone=newPhone.substring(4);
									phone=0+phone;									
								}else{
									phone="";								
								}					
							}
							else if(newPhone.match(phonePatter3)&&newPhone.length===12){
								var prefix=newPhone.substring(0,3);
								if(prefix==="243"){
									phone=newPhone.substring(3);
									phone=0+phone;									
								}else{
									phone="";									
								}
							}
						}
						var newprovince=deleteSpace(req.body.province);
						var newtown=deleteSpace(req.body.town);
						var newcommune=deleteSpace(req.body.commune);
						var newquartier=deleteSpace(req.body.quartier);
						var newavenue=deleteSpace(req.body.avenue);
						var newnumero=deleteSpace(req.body.numero);
						Article.find({boutiUsername:admin.username},function(err,allArticle){
							if(err){
								res.redirect("/admin");
							}else if(allArticle){
								if(allArticle.length>0){
									var articleLength=allArticle.length;
									var tag=[];
									if(newadminname.length>0){
										admin.adminname=req.body.adminname;
									}
									if(newsurname.length>0){
										admin.surname=req.body.surname;
									}
									if(newname.length>0){
										admin.name=req.body.name;
									}
									if(newUsername.length>0){
										admin.username=req.body.username;							
									}
									if(newrccm.length>0){
										admin.rccm=req.body.rccm;
									}
									if(phone.length>0){
										admin.telephone=phone;
									}
									if(newprovince.length>0){
										admin.province=req.body.province;
									}
									if(newtown.length>0){
										admin.town=req.body.town;
									}
									if(newcommune.length>0){
										admin.commune=req.body.commune;
									}
									if(newquartier.length>0){
										admin.quartier=req.body.quartier;
									}
									if(newavenue.length>0){
										admin.avenue=req.body.avenue;
									}
									if(newnumero.length>0){
										admin.numero=req.body.numero;
									}
									admin.save(function(err,newAdmin){
										let tag=[];
										for(let i=0; i<allArticle.length;i++){
											
											allArticle[i].boutiName=newAdmin.name;
											allArticle[i].boutiUsername=newAdmin.username;
											allArticle[i].boutiTown=newAdmin.town;
											allArticle[i].boutiCommune=newAdmin.commune;
											allArticle[i].boutiAvenue=newAdmin.avenue;
											allArticle[i].boutiNum=newAdmin.numero;
											allArticle[i].save(function(){
												tag.push(i);
												if(allArticle.length===tag.length){
													res.redirect("/admin");
												}
											});
										}										
									});									
								}else{
									if(newadminname.length>0){
										admin.adminname=req.body.adminname;
									}
									if(newsurname.length>0){
										admin.surname=req.body.surname;
									}
									if(newname.length>0){
										admin.name=req.body.name;
									}
									if(newUsername.length>0){
										if(newUsername!==admin.username){
											admin.username=req.body.username;
										}							
									}
									if(newrccm.length>0){
										admin.rccm=req.body.rccm;
									}
									if(phone.length>0){
										admin.telephone=phone;
									}
									if(newprovince.length>0){
										admin.province=req.body.province;
									}
									if(newtown.length>0){
										admin.town=req.body.town;
									}
									if(newcommune.length>0){
										admin.commune=req.body.commune;
									}
									if(newquartier.length>0){
										admin.quartier=req.body.quartier;
									}
									if(newavenue.length>0){
										admin.avenue=req.body.avenue;
									}
									if(newnumero.length>0){
										admin.numero=req.body.numero;
									}
									admin.save(function(err,newAdmin){
										var adminObject={};
													adminObject.adminname=newAdmin.adminname;
													adminObject.surname=newAdmin.surname;
													adminObject.username=newAdmin.username;
													var init=((newAdmin.adminname).substring(0,1)).toUpperCase();
													adminObject.init=init;
													req.session.admin=adminObject;
													req.session.logIn=true;								
													res.redirect("/admin");
										
									});
								}
							}else{
								if(newadminname.length>0){
										admin.adminname=req.body.adminname;
									}
									if(newsurname.length>0){
										admin.surname=req.body.surname;
									}
								if(newname.length>0){
									admin.name=req.body.name;
								}
								if(newUsername.length>0){
									if(newUsername!==adm.username){
										admin.username=req.body.username;
									}							
								}
								if(newrccm.length>0){
									admin.rccm=req.body.rccm;
								}
								if(phone.length>0){
									admin.telephone=phone;
								}
								if(newprovince.length>0){
									admin.province=req.body.province;
								}
								if(newtown.length>0){
									admin.town=req.body.town;
								}
								if(newcommune.length>0){
									admin.commune=req.body.commune;
								}
								if(newquartier.length>0){
									admin.quartier=req.body.quartier;
								}
								if(newavenue.length>0){
									admin.avenue=req.body.avenue;
								}
								if(newnumero.length>0){
									admin.numero=req.body.numero;
								}
								admin.save(function(err,newAdmin){
									var adminObject={};
												adminObject.adminname=newAdmin.adminname;
												adminObject.surname=newAdmin.surname;
												adminObject.username=newAdmin.username;
												var init=((newAdmin.adminname).substring(0,1)).toUpperCase();
												adminObject.init=init;
												req.session.admin=adminObject;
												req.session.logIn=true;								
												res.redirect("/admin");
									
								});
							}
						});			
					}else{
						if(req.session.lastPath){
							res.redirect(req.session.lastPath);
						}else{
							res.redirect("/login");
						}
					}
				});
			}else{
				if(req.session.lastPath){
					res.redirect(req.session.lastPath);
				}else{
					res.redirect("/login");
				}
			}
		}else{
			if(req.session.lastPath){
				es.redirect(req.session.lastPath);
			}else{
					res.redirect("/login");
			}
		}
	},
	classe:function(req,res){
		
		if(req.session.admin && req.session.logIn){
			console.log("req.session.admin");
			console.log(req.session.admin);
			Admin.findOne({username:req.session.admin.username},function(err,bouti){
				if(err){console.log("love");res.json=({})}
				if(bouti){
					res.json(classe);
					var classes=classe.classe;
					console.log(classes.length);
					console.log(classe.classe);					
				}else{
					res.json({});					
				}
			});
		}
		else if(req.session.superAdmin && req.session.logIn){
			console.log("req.session.superAdmin");
			console.log(req.session.superAdmin);
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password,token:req.session.superAdmin.token},function(err,admin){
				if(err){console.log("love");res.json=({})}
				if(admin){
					res.json(classe);
					var classes=classe.classe;
					console.log(classes.length);
					console.log(classe.classe);					
				}else{
					res.json({});					
				}
			});
		}
	},//ok
	findCategory:function(req,res){
		console.log("elem is there");
		if(req.session.admin&&req.session.logIn){
			Admin.findOne({username:req.session.admin.username},function(err,bouti){
				if(err){/**Error traitement**/console.log("err")}
				if(bouti){
					var actualClasse=req.params.classe;
					console.log(actualClasse);
					
					var allCategorie;
					allCategorie=classe.categorie[actualClasse];
					console.log(allCategorie);
					res.json(allCategorie);
										
				}
				else{
					/*Error triatement**/
					console.log("no bouti");
				}
			});
		}else if(req.session.superAdmin&&req.session.logIn){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,bouti){
				if(err){/**Error traitement**/console.log("err")}
				if(bouti){
					var actualClasse=req.params.classe;
					console.log(actualClasse);
					
					var allCategorie;
					allCategorie=classe.categorie[actualClasse];
					console.log(allCategorie);
					res.json(allCategorie);
										
				}
				else{
					/*Error triatement**/
					console.log("no bouti");
				}
			});
		}
	},//ok
	findType:function(req,res){
		if(req.session.admin&&req.session.logIn){
			Admin.findOne({username:req.session.admin.username},function(err,bouti){
				if(err){}
				if(bouti){
					var actualClasse=req.params.classe;
					console.log("actualClasse");
					console.log(actualClasse);					
					var actualCategory=req.params.category;
					var allType="";
					allType=classe.categorie[actualClasse][actualCategory];	
					res.json(allType);					
				}
			});
		}
	},//ok
	add_article:function(req,res){
		if(req.session.admin && req.session.logIn){
			var viewModel={};
			Admin.findOne({username:req.session.admin.username},function(err,bouti){
				if(err){res.redirect("/login");}
				if(bouti){
				console.log("bouti");					
				console.log(bouti);					
					if(req.body){						
						req.session.body=req.body;
						var article_classe=deleteSpace(req.body.classe);
						if(article_classe && article_classe.length>0){								
								var categorie=deleteSpace(req.body.category),
								type=deleteSpace(req.body.type),
								name=deleteSpace(req.body.name),
								marque=deleteSpace(req.body.marque),
								numero=deleteSpace(req.body.numero),
								description=deleteSpace(req.body.description),						
								color=deleteSpace(req.body.color),
								detail_price=deleteSpace(req.body.detail_price),
								gros_price=deleteSpace(req.body.gros_price),
								gros_number=deleteSpace(req.body.gros_number),
								files=req.files;
								
								console.log("req.file");
								console.log(req.files);
								if(categorie && type && name && marque && numero && description && color && detail_price && gros_price && gros_number&&files){
									console.log("is there and there");
									if(categorie.length>0 && type.length>0 && name.length>0 && marque.length>0 && numero.length>0 && description.length>0 && color.length>0 && detail_price.length>0 && gros_price.length>0 && gros_number.length>0&&files.length>0){
										if(!regex.test(categorie)&&!regex.test(type)&&!regex.test(name)&&!regex.test(marque)&&!regex.test(numero)&&!regex.test(description)&&!regex.test(color)&&!regex.test(detail_price)&&!regex.test(gros_price)&&!regex.test(gros_number)&&!regex.test(files)){
											var saveArticle=function(){
												var possible="abcdefghijklmnopqrstuvwxyz0123456789";
												var imgUrl1="";			
												var imgUrl2="";	
												var ext1=path.extname((req.files[0].originalname)).toLowerCase();
												var ext2=path.extname((req.files[1].originalname)).toLowerCase();
												for(var i=0; i<6 ;i++){
													imgUrl1+=possible.charAt(Math.floor(Math.random()*possible.length));												
												}
												
												for(var i=0; i<6 ;i++){
													imgUrl2+=possible.charAt(Math.floor(Math.random()*possible.length));												
												}
												
												Filename.findOne({},function(err,filename){
													if(err){
														res.redirect("/admin");
													}
													if(filename){
														if((filename.filename).indexOf(imgUrl1+ext1)>=0 || (filename.filename).indexOf(imgUrl2+ext2)>=0){
															saveArticle();
														}else{
																var tempPath1=req.files[0].path;
														var tempPath2=req.files[1].path;
														var tabNumber=numero.split(",");													
																											
														
														var targetPath1=path.resolve("./public/image/"+req.body.classe+"/"+"/"+req.body.category+"/"+req.body.type+"/"+imgUrl1+ext1);
														var targetPath2=path.resolve("./public/image/"+req.body.classe+"/"+"/"+req.body.category+"/"+req.body.type+"/"+imgUrl2+ext2);
														console.log("targetPath2");
														console.log(targetPath2);
														if((ext1===".png"||ext1===".jpg"||ext1===".jpeg"||ext1===".gif")&&(ext2===".png"||ext2===".jpg"||ext2===".jpeg"||ext2===".gif")){
															
															var principaleImage={color:req.body.color,filename1:imgUrl1+ext1,filename2:imgUrl2+ext2,principale:true,approved:false};
															
															fs.exists(path.join(__dirname,"../public/image/"+article_classe),function(existe){
																if(existe){
																	fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+categorie),function(existe){
																		if(existe){
																			fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+categorie+"/"+type),function(existe){
																				if(existe){
																					fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl1),function(existe){
																									if(existe){
																										saveArticle();
																									}else{
																										fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl2),function(existe){
																											if(existe){
																												saveArticle();
																											}else{
																												fs.rename(tempPath1,targetPath1,function(err){
																													if(err){
																														console.log("error");
																														console.log(err);
																														res.redirect("/admin");																													
																													}
																													fs.rename(tempPath2,targetPath2,function(err){
																														if(err){
																															console.log("second error");
																															console.log(err);
																															res.redirect("/admin");
																														}else{
																															var newArticle=new Article({
																																classe:req.body.classe,																															
																																categorie:req.body.category,
																																type:req.body.type,
																																name:req.body.name,
																																mark:req.body.marque,
																																size:tabNumber,
																																description:req.body.description,																																
																																color:principaleImage,
																																//colors:[principaleImage],
																																detailPrice:req.body.detail_price,
																																wholePrice:req.body.gros_price,
																																wholeNumber:req.body.gros_number,
																																boutiName:bouti.name,
																																boutiUsername:bouti.username,
																																boutiTown:bouti.province,
																																boutiCommune:bouti.commune,
																																boutiAvenue:bouti.avenue,
																																boutiNum:bouti.numero,
																																filename1Edited:imgUrl1+ext1,
																																filename2Edited:imgUrl2+ext2,
																																time:timeGeneration(),
																																date:dateGeneration(),
																																dateFormat:newDateGeneartion()
																															});
																															newArticle.save(function(err,article){
																																if(err){
																																	console.log("third error");
																																	console.log(err);
																																	res.redirect("/admin");
																																}else{
																																	var newColor=new Color({
																																		name:req.body.color,
																																		filename1Edited:imgUrl1+ext1,
																																		filename2Edited:imgUrl2+ext2,
																																		principal:true,
																																		articleId:article._id,
																																		time:timeGeneration(),
																																		date:dateGeneration(),
																																		dateFormat:newDateGeneartion()
																																	});
																																	newColor.save(function(){
																																		Filename.findOne({},function(err,allFilename){
																																				if(allFilename){
																																					var lastFile=allFilename.filename;
																																					var newFile=[...lastFile,imgUrl1+ext1,imgUrl2+ext2];
																																					allFilename.filename=newFile;
																																					allFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					})
																																				}else{
																																					var newFilename=new Filename({
																																						filename:[imgUrl1+ext1,imgUrl2+ext2]
																																					});
																																					newFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					});
																																				}
																																		});
																																		
																																	});																																
																																}																														
																															});
																														}																													
																													});
																												});
																											}
																										})
																									}
																								})
																					
																				}else{
																					fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type),function(err){
																						
																							
																							fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl1),function(existe){
																								if(existe){
																									saveArticle();
																								}else{
																									fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl2),function(existe){
																										if(existe){
																											saveArticle();
																										}else{
																											fs.rename(tempPath1,targetPath1,function(err){
																												if(err){
																													console.log("mistaked");
																													console.log(err);
																													res.redirect("/admin");
																												}
																												fs.rename(tempPath2,targetPath2,function(err){
																													if(err){
																														console.log("mistekennnne");
																														console.log(err);
																														res.redirect("/admin");
																													}else{
																														var newArticle=new Article({
																																classe:req.body.classe,																															
																																categorie:req.body.category,
																																type:req.body.type,
																																name:req.body.name,
																																mark:req.body.marque,
																																size:tabNumber,
																																description:req.body.description,
																																color:principaleImage,
																																colors:[principaleImage],
																																detailPrice:req.body.detail_price,
																																wholePrice:req.body.gros_price,
																																wholeNumber:req.body.gros_number,
																																boutiName:bouti.name,
																																boutiUsername:bouti.username,
																																boutiTown:bouti.province,
																																boutiCommune:bouti.commune,
																																boutiAvenue:bouti.avenue,
																																boutiNum:bouti.numero,
																																filename1Edited:imgUrl1+ext1,
																																filename2Edited:imgUrl2+ext2,
																																time:timeGeneration(),
																																date:dateGeneration(),
																																dateFormat:newDateGeneartion()
																															});
																														newArticle.save(function(err,article){
																																	if(err){
																																		console.log("third error");
																																		console.log(err);
																																		res.redirect("/admin");
																																	}else{
																																		var newColor=new Color({
																																			name:req.body.color,
																																			filename1Edited:imgUrl1+ext1,
																																			filename2Edited:imgUrl2+ext2,
																																			principal:true,
																																			articleId:article._id,
																																			time:timeGeneration(),
																																			date:dateGeneration(),
																																			dateFormat:newDateGeneartion()
																																		});
																																		newColor.save(function(){
																																			Filename.findOne({},function(err,allFilename){
																																				if(allFilename){
																																					var lastFile=allFilename.filename;
																																					var newFile=[...lastFile,imgUrl1+ext1,imgUrl2+ext2];
																																					allFilename.filename=newFile;
																																					allFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					})
																																				}else{
																																					var newFilename=new Filename({
																																						filename:[imgUrl1+ext1,imgUrl2+ext2]
																																					});
																																					newFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					});
																																				}
																																			});
																																		
																																		});																																
																																	}																														
																																});
																													
																													}
																													
																												});
																											});
																										}
																									})
																								}
																							})
																						
																					});
																				}
																			})
																		}else{
																			fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+categorie),function(err){
																				if(err){
																					console.log("misteki");
																					console.log(err);
																					res.redirect("/admin");
																				}
																				fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type),function(err){
																					
																						fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl1),function(existe){
																							if(existe){
																								saveArticle();
																							}else{
																								fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl2),function(existe){
																									if(existe){
																										saveArticle();
																									}else{
																										fs.rename(tempPath1,targetPath1,function(err){
																											if(err){
																												console.log("isteded");
																												console.log(err);
																												res.redirect("/admin");
																											}
																											fs.rename(tempPath2,targetPath2,function(err){
																												if(err){
																													console.log("iter");
																													console.log(err);
																													res.redirect("/admin");
																												}else{
																													var newArticle=new Article({
																																classe:req.body.classe,																															
																																categorie:req.body.category,
																																type:req.body.type,
																																name:req.body.name,
																																mark:req.body.marque,
																																size:tabNumber,
																																description:req.body.description,
																																color:principaleImage,
																																colors:[principaleImage],
																																detailPrice:req.body.detail_price,
																																wholePrice:req.body.gros_price,
																																wholeNumber:req.body.gros_number,
																																boutiName:bouti.name,
																																boutiUsername:bouti.username,
																																boutiTown:bouti.province,
																																boutiCommune:bouti.commune,
																																boutiAvenue:bouti.avenue,
																																boutiNum:bouti.numero,
																																filename1Edited:imgUrl1+ext1,
																																filename2Edited:imgUrl2+ext2,
																																time:timeGeneration(),
																																date:dateGeneration(),
																																dateFormat:newDateGeneartion()
																															});
																															newArticle.save(function(err,article){
																																if(err){
																																	console.log("third error");
																																	console.log(err);
																																	res.redirect("/admin");
																																}else{
																																	var newColor=new Color({
																																		name:req.body.color,
																																		filename1Edited:imgUrl1+ext1,
																																		filename2Edited:imgUrl2+ext2,
																																		principal:true,
																																		articleId:article._id,
																																		time:timeGeneration(),
																																		date:dateGeneration(),
																																		dateFormat:newDateGeneartion()
																																	});
																																	newColor.save(function(){
																																		Filename.findOne({},function(err,allFilename){
																																			if(allFilename){
																																					var lastFile=allFilename.filename;
																																					var newFile=[...lastFile,imgUrl1+ext1,imgUrl2+ext2];
																																					allFilename.filename=newFile;
																																					allFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					})
																																				}else{
																																					var newFilename=new Filename({
																																						filename:[imgUrl1+ext1,imgUrl2+ext2]
																																					});
																																					newFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					});
																																				}
																																		});
																																	});																																
																																}																														
																															});
																												
																												}
																												
																											});
																										});
																									}
																								})
																							}
																						})
																					
																				});
																			})
																		}
																	});
																	
																}else{
																	fs.mkdir(path.join(__dirname,"../public/image/"+article_classe),function(err){
																		if(err){
																			console.log("your redirection");
																			console.log(err);
																			res.redirect("/admin");
																		}
																		fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+categorie),function(err){
																			if(err){
																				console.log("is redirected to");
																				console.log(err);
																				res.redirect("/admin");
																			}
																			fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type),function(err){
																				
																					fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl1),function(existe){
																						if(existe){
																							saveArticle();
																						}else{
																							fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl2),function(existe){
																								if(existe){
																									saveArticle();
																								}else{
																									fs.rename(tempPath1,targetPath1,function(err){
																										if(err){
																											console.log("is a redir");
																											console.log(err);
																											res.redirect("/admin");
																										}
																										fs.rename(tempPath2,targetPath2,function(err){
																											if(err){
																												console.log("admin is received");
																												console.log(err);
																												res.redirect("/admin");																											
																											}else{
																												var newArticle=new Article({
																																classe:req.body.classe,																															
																																categorie:req.body.category,
																																type:req.body.type,
																																name:req.body.name,
																																mark:req.body.marque,
																																size:tabNumber,
																																description:req.body.description,
																																color:principaleImage,
																																colors:[principaleImage],
																																detailPrice:req.body.detail_price,
																																wholePrice:req.body.gros_price,
																																wholeNumber:req.body.gros_number,
																																boutiName:bouti.name,
																																boutiUsername:bouti.username,
																																boutiTown:bouti.province,
																																boutiCommune:bouti.commune,
																																boutiAvenue:bouti.avenue,
																																boutiNum:bouti.numero,
																																filename1Edited:imgUrl1+ext1,
																																filename2Edited:imgUrl2+ext2,
																																time:timeGeneration(),
																																date:dateGeneration(),
																																dateFormat:newDateGeneartion()
																															});
																													newArticle.save(function(err,article){
																																if(err){
																																	console.log("third error");
																																	console.log(err);
																																	res.redirect("/admin");
																																}else{
																																	var newColor=new Color({
																																		name:req.body.color,
																																		filename1Edited:imgUrl1+ext1,
																																		filename2Edited:imgUrl2+ext2,
																																		principal:true,
																																		articleId:article._id,
																																		time:timeGeneration(),
																																		date:dateGeneration(),
																																		dateFormat:newDateGeneartion()
																																	});
																																	newColor.save(function(){
																																		Filename.findOne({},function(err,allFilename){
																																			if(allFilename){
																																					var lastFile=allFilename.filename;
																																					var newFile=[...lastFile,imgUrl1+ext1,imgUrl2+ext2];
																																					allFilename.filename=newFile;
																																					allFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					})
																																				}else{
																																					var newFilename= new Filename({
																																						filename:[imgUrl1+ext1,imgUrl2+ext2]
																																					});
																																					newFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					});
																																				}
																																		});
																																	});																																
																																}																														
																															});
																											
																											}
																											
																										});
																									});
																								}
																							})
																						}
																					})
																				
																			});
																		});
																	});
																}
															});
																													
														}else{
															console.log("redirection");
															req.session.badFormat="Seul les imges son admises";
															res.redirect("/admin");
														}
														}
													}													
													else{
														var tempPath1=req.files[0].path;
														var tempPath2=req.files[1].path;
														var tabNumber=numero.split(",");													
																											
														
														var targetPath1=path.resolve("./public/image/"+req.body.classe+"/"+"/"+req.body.category+"/"+req.body.type+"/"+imgUrl1+ext1);
														var targetPath2=path.resolve("./public/image/"+req.body.classe+"/"+"/"+req.body.category+"/"+req.body.type+"/"+imgUrl2+ext2);
														console.log("targetPath2");
														console.log(targetPath2);
														if((ext1===".png"||ext1===".jpg"||ext1===".jpeg"||ext1===".gif")&&(ext2===".png"||ext2===".jpg"||ext2===".jpeg"||ext2===".gif")){
															
															var principaleImage={color:req.body.color,filename1:imgUrl1+ext1,filename2:imgUrl2+ext2,principale:true,approved:false};
															
															fs.exists(path.join(__dirname,"../public/image/"+article_classe),function(existe){
																if(existe){
																	fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+categorie),function(existe){
																		if(existe){
																			fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+categorie+"/"+type),function(existe){
																				if(existe){
																					fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl1),function(existe){
																									if(existe){
																										saveArticle();
																									}else{
																										fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl2),function(existe){
																											if(existe){
																												saveArticle();
																											}else{
																												fs.rename(tempPath1,targetPath1,function(err){
																													if(err){
																														console.log("error");
																														console.log(err);
																														res.redirect("/admin");																													
																													}
																													fs.rename(tempPath2,targetPath2,function(err){
																														if(err){
																															console.log("second error");
																															console.log(err);
																															res.redirect("/admin");
																														}else{
																															var newArticle=new Article({
																																classe:req.body.classe,																															
																																categorie:req.body.category,
																																type:req.body.type,
																																name:req.body.name,
																																mark:req.body.marque,
																																size:tabNumber,
																																description:req.body.description,																																
																																color:principaleImage,
																																//colors:[principaleImage],
																																detailPrice:req.body.detail_price,
																																wholePrice:req.body.gros_price,
																																wholeNumber:req.body.gros_number,
																																boutiName:bouti.name,
																																boutiUsername:bouti.username,
																																boutiTown:bouti.province,
																																boutiCommune:bouti.commune,
																																boutiAvenue:bouti.avenue,
																																boutiNum:bouti.numero,
																																filename1Edited:imgUrl1+ext1,
																																filename2Edited:imgUrl2+ext2,
																																time:timeGeneration(),
																																date:dateGeneration(),
																																dateFormat:newDateGeneartion()
																															});
																															newArticle.save(function(err,article){
																																if(err){
																																	console.log("third error");
																																	console.log(err);
																																	res.redirect("/admin");
																																}else{
																																	var newColor=new Color({
																																		name:req.body.color,
																																		filename1Edited:imgUrl1+ext1,
																																		filename2Edited:imgUrl2+ext2,
																																		principal:true,
																																		articleId:article._id,
																																		time:timeGeneration(),
																																		date:dateGeneration(),
																																		dateFormat:newDateGeneartion()
																																	});
																																	newColor.save(function(){
																																		Filename.findOne({},function(err,allFilename){
																																			if(err){
																																				
																																			}else{
																																				if(allFilename){
																																					var lastFile=allFilename.filename;
																																					var newFile=[...lastFile,imgUrl1+ext1,imgUrl2+ext2];
																																					allFilename.filename=newFile;
																																					allFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					})
																																				}else{
																																					var newFilename=new Filename({
																																						filename:[imgUrl1+ext1,imgUrl2+ext2]
																																					});
																																					newFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					});
																																				}																																				
																																			}
																																		});
																																		
																																	});																																
																																}																														
																															});
																														}																													
																													});
																												});
																											}
																										})
																									}
																								})
																					
																				}else{
																					fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type),function(err){
																						
																							
																							fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl1),function(existe){
																								if(existe){
																									saveArticle();
																								}else{
																									fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl2),function(existe){
																										if(existe){
																											saveArticle();
																										}else{
																											fs.rename(tempPath1,targetPath1,function(err){
																												if(err){
																													console.log("mistaked");
																													console.log(err);
																													res.redirect("/admin");
																												}
																												fs.rename(tempPath2,targetPath2,function(err){
																													if(err){
																														console.log("mistekennnne");
																														console.log(err);
																														res.redirect("/admin");
																													}else{
																														var newArticle=new Article({
																																classe:req.body.classe,																															
																																categorie:req.body.category,
																																type:req.body.type,
																																name:req.body.name,
																																mark:req.body.marque,
																																size:tabNumber,
																																description:req.body.description,
																																color:principaleImage,
																																colors:[principaleImage],
																																detailPrice:req.body.detail_price,
																																wholePrice:req.body.gros_price,
																																wholeNumber:req.body.gros_number,
																																boutiName:bouti.name,
																																boutiUsername:bouti.username,
																																boutiTown:bouti.province,
																																boutiCommune:bouti.commune,
																																boutiAvenue:bouti.avenue,
																																boutiNum:bouti.numero,
																																filename1Edited:imgUrl1+ext1,
																																filename2Edited:imgUrl2+ext2,
																																time:timeGeneration(),
																																date:dateGeneration(),
																																dateFormat:newDateGeneartion()
																															});
																														newArticle.save(function(err,article){
																																	if(err){
																																		console.log("third error");
																																		console.log(err);
																																		res.redirect("/admin");
																																	}else{
																																		var newColor=new Color({
																																			name:req.body.color,
																																			filename1Edited:imgUrl1+ext1,
																																			filename2Edited:imgUrl2+ext2,
																																			principal:true,
																																			articleId:article._id,
																																			time:timeGeneration(),
																																			date:dateGeneration(),
																																			dateFormat:newDateGeneartion()
																																		});
																																		newColor.save(function(){
																																			Filename.findOne({},function(err,allFilename){
																																				if(allFilename){
																																					var lastFile=allFilename.filename;
																																					var newFile=[...lastFile,imgUrl1+ext1,imgUrl2+ext2];
																																					allFilename.filename=newFile;
																																					allFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					})
																																				}else{
																																					var newFilename=new Filename({
																																						filename:[imgUrl1+ext1,imgUrl2+ext2]
																																					});
																																					newFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					});
																																				}
																																			});
																																		
																																		});																																
																																	}																														
																																});
																													
																													}
																													
																												});
																											});
																										}
																									})
																								}
																							})
																						
																					});
																				}
																			})
																		}else{
																			fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+categorie),function(err){
																				if(err){
																					console.log("misteki");
																					console.log(err);
																					res.redirect("/admin");
																				}
																				fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type),function(err){
																					
																						fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl1),function(existe){
																							if(existe){
																								saveArticle();
																							}else{
																								fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl2),function(existe){
																									if(existe){
																										saveArticle();
																									}else{
																										fs.rename(tempPath1,targetPath1,function(err){
																											if(err){
																												console.log("isteded");
																												console.log(err);
																												res.redirect("/admin");
																											}
																											fs.rename(tempPath2,targetPath2,function(err){
																												if(err){
																													console.log("iter");
																													console.log(err);
																													res.redirect("/admin");
																												}else{
																													var newArticle=new Article({
																																classe:req.body.classe,																															
																																categorie:req.body.category,
																																type:req.body.type,
																																name:req.body.name,
																																mark:req.body.marque,
																																size:tabNumber,
																																description:req.body.description,
																																color:principaleImage,
																																colors:[principaleImage],
																																detailPrice:req.body.detail_price,
																																wholePrice:req.body.gros_price,
																																wholeNumber:req.body.gros_number,
																																boutiName:bouti.name,
																																boutiUsername:bouti.username,
																																boutiTown:bouti.province,
																																boutiCommune:bouti.commune,
																																boutiAvenue:bouti.avenue,
																																boutiNum:bouti.numero,
																																filename1Edited:imgUrl1+ext1,
																																filename2Edited:imgUrl2+ext2,
																																time:timeGeneration(),
																																date:dateGeneration(),
																																dateFormat:newDateGeneartion()
																															});
																															newArticle.save(function(err,article){
																																if(err){
																																	console.log("third error");
																																	console.log(err);
																																	res.redirect("/admin");
																																}else{
																																	var newColor=new Color({
																																		name:req.body.color,
																																		filename1Edited:imgUrl1+ext1,
																																		filename2Edited:imgUrl2+ext2,
																																		principal:true,
																																		articleId:article._id,
																																		time:timeGeneration(),
																																		date:dateGeneration(),
																																		dateFormat:newDateGeneartion()
																																	});
																																	newColor.save(function(){
																																		Filename.findOne({},function(err,allFilename){
																																			if(allFilename){
																																					var lastFile=allFilename.filename;
																																					var newFile=[...lastFile,imgUrl1+ext1,imgUrl2+ext2];
																																					allFilename.filename=newFile;
																																					allFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					})
																																				}else{
																																					var newFilename=new Filename({
																																						filename:[imgUrl1+ext1,imgUrl2+ext2]
																																					});
																																					newFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					});
																																				}
																																		});
																																	});																																
																																}																														
																															});
																												
																												}
																												
																											});
																										});
																									}
																								})
																							}
																						})
																					
																				});
																			})
																		}
																	});
																	
																}else{
																	fs.mkdir(path.join(__dirname,"../public/image/"+article_classe),function(err){
																		if(err){
																			console.log("your redirection");
																			console.log(err);
																			res.redirect("/admin");
																		}
																		fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+categorie),function(err){
																			if(err){
																				console.log("is redirected to");
																				console.log(err);
																				res.redirect("/admin");
																			}
																			fs.mkdir(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type),function(err){
																				
																					fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl1),function(existe){
																						if(existe){
																							saveArticle();
																						}else{
																							fs.exists(path.join(__dirname,"../public/image/"+article_classe+"/"+"/"+categorie+"/"+type+"/"+imgUrl2),function(existe){
																								if(existe){
																									saveArticle();
																								}else{
																									fs.rename(tempPath1,targetPath1,function(err){
																										if(err){
																											console.log("is a redir");
																											console.log(err);
																											res.redirect("/admin");
																										}
																										fs.rename(tempPath2,targetPath2,function(err){
																											if(err){
																												console.log("admin is received");
																												console.log(err);
																												res.redirect("/admin");																											
																											}else{
																												var newArticle=new Article({
																																classe:req.body.classe,																															
																																categorie:req.body.category,
																																type:req.body.type,
																																name:req.body.name,
																																mark:req.body.marque,
																																size:tabNumber,
																																description:req.body.description,
																																color:principaleImage,
																																colors:[principaleImage],
																																detailPrice:req.body.detail_price,
																																wholePrice:req.body.gros_price,
																																wholeNumber:req.body.gros_number,
																																boutiName:bouti.name,
																																boutiUsername:bouti.username,
																																boutiTown:bouti.province,
																																boutiCommune:bouti.commune,
																																boutiAvenue:bouti.avenue,
																																boutiNum:bouti.numero,
																																filename1Edited:imgUrl1+ext1,
																																filename2Edited:imgUrl2+ext2,
																																time:timeGeneration(),
																																date:dateGeneration(),
																																dateFormat:newDateGeneartion()
																															});
																													newArticle.save(function(err,article){
																																if(err){
																																	console.log("third error");
																																	console.log(err);
																																	res.redirect("/admin");
																																}else{
																																	var newColor=new Color({
																																		name:req.body.color,
																																		filename1Edited:imgUrl1+ext1,
																																		filename2Edited:imgUrl2+ext2,
																																		principal:true,
																																		articleId:article._id,
																																		time:timeGeneration(),
																																		date:dateGeneration(),
																																		dateFormat:newDateGeneartion()
																																	});
																																	newColor.save(function(){
																																		Filename.findOne({},function(err,allFilename){
																																			if(allFilename){
																																					var lastFile=allFilename.filename;
																																					var newFile=[...lastFile,imgUrl1+ext1,imgUrl2+ext2];
																																					allFilename.filename=newFile;
																																					allFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					})
																																				}else{
																																					var newFilename=new Filename({
																																						filename:[imgUrl1+ext1,imgUrl2+ext2]
																																					});
																																					newFilename.save(function(){
																																						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
																																					});
																																				}
																																		});
																																	});																																
																																}																														
																															});
																											
																											}
																											
																										});
																									});
																								}
																							})
																						}
																					})
																				
																			});
																		});
																	});
																}
															});
																													
														}else{
															console.log("redirection");
															req.session.badFormat="Seul les imges son admises";
															res.redirect("/admin");
														}													
													}
												});
											};
											if(req.files.length===2){
												var numberPattern=/^\d+$/;
												if(numberPattern.test(detail_price)  && numberPattern.test(gros_price) && numberPattern.test(gros_number)){
													saveArticle();
												}else{
													if(!numberPattern.test(detail_price)){
														req.session.no_detail_price_number=true;
													}
													if(!numberPattern.test(gros_price)){
														req.session.no_gros_price_number=true;
													}
													if(!numberPattern.test(gros_number)){
														req.session.no_gros_number=true;
													}
													res.redirect("/admin");
												}
																							
												
											}else{
												req.session.noFiles2=true;
												res.redirect("/admin");
											}
										}else{
											if(regex.test(categorie)){
												req.session.badcategorie=true;
											}
											if(regex.test(type)){
												req.session.badtype=true;
											}
											if(regex.test(name)){
												req.session.badname=true;
											}
											if(regex.test(marque)){
												req.session.badmarque=true;
											}
											if(regex.test(numero)){
												req.session.badnumero=true;
											}
											if(regex.test(description)){
												req.session.baddescription=true;										
											}
											if(regex.test(color)){
												req.session.badcolor=true;
											}
											if(regex.test(detail_price)){
												req.session.baddetail_price=true;
											}
											if(regex.test(gros_price)){
												req.session.badgros_price=true;
											}
											if(regex.test(gros_number)){
												req.session.badgros_number=true;
											}
											if(regex.test(files)){
												req.session.badfiles=true;
											}
											console.log("redirect");
											res.redirect("/admin");
										}								
					
									}else{
										if(!categorie){
											req.session.noCategorie=true;										
										}
										if(!type){
											req.session.noType=true;										
										}
										if(!name){
											req.session.noName=true;
																	
										}
										if(!marque){
											req.session.noMarque=true;							
										}
										if(!numero){
											req.session.noNumero=true;
											
										}
										if(!description){
											req.session.noDescription=true;
										}						
										if(!color){
											req.session.noColor=true;										
										}
										if(!detail_price){
											req.session.noDetailPrice=true;										
										}
										if(!gros_price){
											req.session.noGrosPrice=true;
											
										}
										if(!gros_number){
											req.session.noGrosNumber=true;							
										}
										if(files.length===0){
											req.session.noFiles=true;
										}
										if(files.length>0&&files.length<2){
											req.session.noFiles2=true;
										}
										console.log("is redirect");
										res.redirect("/admin");
									}
								}else{
									
									if(!categorie){
										req.session.noCategorie=true;										
									}
									if(!type){
										req.session.noType=true;										
									}
									if(!name){
										req.session.noName=true;
																
									}
									if(!marque){
										req.session.noMarque=true;							
									}
									if(!numero){
										req.session.noNumero=true;
										
									}
									if(!description){
										req.session.noDescription=true;
									}						
									if(!color){
										req.session.noColor=true;										
									}
									if(!detail_price){
										req.session.noDetailPrice=true;										
									}
									if(!gros_price){
										req.session.noGrosPrice=true;
										
									}
									if(!gros_number){
										req.session.noGrosNumber=true;							
									}
									if(files.length===0){
										req.session.noFiles=true;
									}
									if(files.length>0&&files.length<2){
										req.session.noFiles2=true;
									}
									res.redirect("/admin");
								}						
					
				}						
				if(!article_classe){
					req.session.noClass=true;
					res.redirect("/admin");
				}					
			}else{
				res.redirect("/login");
			}
		}else{
			res.redirect("/login");
		}
		});
		}else{
			console.log("no connected");
			res.redirect("/login");
		}
	},//ok  
	/*
	article:function(req,res){		
		if(req.session.logIn && req.session.admin){			
			var viewModel={};
			console.log("un article est nouvellement");
			viewModel.admin=req.session.admin.username;		
			viewModel.article=article;
			res.render("AdminArticle",viewModel);
		}				
	},
	*/
	editColor:function(req,res){
		if(req.session.logIn&&req.session.admin){
			
			var newColor=req.body.color;
			var color_id=req.params.color_id;
			var article_id=req.params.id;
			Article.findOne({_id:article_id},function(err,article){
				if(err){
					console.log("erre");
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}
				else if(article){
					console.log("we are")
					if(color_id.length>0 && newColor.length>0){
						Color.findOne({articleId:article_id,name:newColor},function(err,color){
							if(err){
								console.log("deeee we are")
								var lastPath=req.session.lastPath;
								res.redirect(lastPath);
							}
							else if(color){
								console.log("weddeeee are")
								req.session.color_existed=true;
								res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article_id+"/"+color_id)
							}else{
								Color.findOne({_id:color_id,articleId:article_id},function(err,color){
									if(err){
										var lastPath=req.session.lastPath;
										res.redirect(lastPath);
									}else if(color){
										color.name=newColor;
										color.save(function(err,colorChanged){
											res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article_id+"/"+colorChanged._id);
										})
									}else{
										res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article_id+"/"+color_id)
									}
								});
								;								
								}
							});						
					}else{
						res.redirect("/"+newArticle.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
					}					
				}else{
					console.log("we trid are")
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}
			});			
		}
		else if (req.session.logIn && req.session.superAdmin){
			var newColor=req.body.color;
			var color_id=req.params.color_id;
			var article_id=req.params.id;
			Article.findOne({_id:article_id},function(err,article){
				if(err){				
					res.redirect("/admin/approved");
				}
				else if(article){					
					if(color_id.length>0 && newColor.length>0){
						Color.findOne({articleId:article_id,name:newColor},function(err,color){
							if(err){								
								var lastPath=req.session.lastPath;
								res.redirect(lastPath);
							}
							else if(color){								
								req.session.color_existed=true;
								res.redirect("/admin/approved/"+article_id+"/"+color._id);								
							}else{
								Color.findOne({_id:color_id,articleId:article_id},function(err,color){
									if(err){										
										res.redirect("/admin/approved");
									}else if(color){
										color.name=newColor;
										color.save(function(err,colorChanged){
											res.redirect("/admin/approved/"+article_id+"/"+color._id);											
										})
									}else{
										res.redirect("/admin/approved");										
									}
								});																
								}
							});						
					}else{
						res.redirect("/admin/approved");
					}					
				}else{
					console.log("we trid are");
					res.redirect("/admin/approved");					
				}
			})
		}
	},//ok
	editFirstImage:function(req,res){
				
		if(req.session.logIn&&req.session.admin){			
			var id=req.params.id;
			//var filename=req.params.filename;
			var colorId=req.params.colorId;
			
			function EditeImage(article){
				var possible="abcdefghijklmnopqrstuvwxyz0123456789";
				var imgUrl1="";					
				for(var i=0; i<6 ;i++){
					imgUrl1+=possible.charAt(Math.floor(Math.random()*possible.length));												
				}
				
				if((req.files).length>0){					
						var ext1=path.extname((req.files[0].originalname)).toLowerCase();
						
						if(article.color.filename1Edited){
							var lastfilename1Edited=article.color.filename1Edited;
						}						
						
						Filename.findOne({},function(err,allFilename){
							if(err){
								console.log("file error");
							}
							else if(allFilename){
								console.log("this file is there");
								var allFilenameTab=allFilename.filename;
								if(allFilenameTab.indexOf(imgUrl1+ext1)!=-1){
									EditeImage(article);
									console.log("the loop");
								}else{
									var tempPath=req.files[0].path;
									var targetPath=path.resolve("./public/image/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+imgUrl1+ext1);
									Color.findOne({articleId:id,_id:colorId},function(err,lastColor){
										if(err){
											console.log("err");		
											}
										else if(lastColor){
											console.log("lastColor");
													if(lastColor.filename1Edited){
														var lastfilename1Edited=lastColor.filename1Edited;
														fs.exists(path.join(__dirname,"../public/image/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+lastfilename1Edited),function(existe){
															if(existe){
																fs.unlink(path.join(__dirname,"../public/image/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+lastfilename1Edited),function(err){
																	if(err){
																		console.log(err);
																		console.log("err in deleting");
																	}else{
																		if(lastColor.principal){
																			console.log("last err");
																			article.filename1Edited=imgUrl1+ext1;
																			lastColor.filename1Edited=imgUrl1+ext1;	
																			
																			lastColor.dateFormat=newDateGeneartion();
																			lastColor.edited=true;
																			
																			fs.rename(tempPath,targetPath,function(err){
																				if(err){
																					console.log("admin is received");
																					console.log(err);
																					res.redirect("/admin");																											
																				}else{
																					console.log("biter err");
																					lastColor.save(function(err,newColor){
																						article.save(function(err,newArticle){
																							console.log("err bitcoin");
																							var newFileTab=[...allFilenameTab,imgUrl1+ext1];
																							allFilename.filename=newFileTab;
																							allFilename.save(function(){
																								res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id+"/"+newColor._id)
																							});																					
																						});
																						
																					});
																				}
																			});
																		}else{
																			console.log("is there a time");
																			lastColor.filename1Edited=imgUrl1+ext1;
																			lastColor.dateFormat=newDateGeneartion();
																			lastColor.edited=true;
																			fs.rename(tempPath,targetPath,function(err){
																				if(err){
																					console.log("admin is received");
																					console.log(err);
																					res.redirect("/admin");																											
																				}else{
																					lastColor.save(function(err,newColor){
																						var newFileTab=[...allFilenameTab,imgUrl1+ext1];
																						allFilename.filename=newFileTab;
																						console.log("istere a cloth");
																						allFilename.save(function(){
																							res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id+"/"+newColor._id)
																						});																				
																					});
																				}
																			});
																		}													
																	}
																});
															}else{
																	if(lastColor.principal){
																			console.log("last err");
																			article.filename1Edited=imgUrl1+ext1;
																			lastColor.filename1Edited=imgUrl1+ext1;
																			lastColor.dateFormat=newDateGeneartion();
																			lastColor.edited=true;
																			fs.rename(tempPath,targetPath,function(err){
																				if(err){
																					console.log("admin is received");
																					console.log(err);
																					res.redirect("/admin");																											
																				}else{
																					console.log("biter err");
																					lastColor.save(function(err,newColor){
																						article.save(function(err,newArticle){
																							console.log("err bitcoin");
																							var newFileTab=[...allFilenameTab,imgUrl1+ext1];
																							allFilename.filename=newFileTab;
																							allFilename.save(function(){
																								res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id+"/"+newColor._id)
																							});																					
																						});
																						
																					});
																				}
																			});
																		}else{
																			console.log("is there a time");
																			lastColor.filename1Edited=imgUrl1+ext1;
																			lastColor.dateFormat=newDateGeneartion();
																			lastColor.edited=true;
																			fs.rename(tempPath,targetPath,function(err){
																				if(err){
																					console.log("admin is received");
																					console.log(err);
																					res.redirect("/admin");																											
																				}else{
																					lastColor.save(function(err,newColor){
																						var newFileTab=[...allFilenameTab,imgUrl1+ext1];
																						allFilename.filename=newFileTab;
																						console.log("istere a cloth");
																						allFilename.save(function(){
																							res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id+"/"+newColor._id)
																						});																				
																					});
																				}
																			});
																		}
															}
														});
														
													}else{
														if(lastColor.principal){
																article.filename1Edited=imgUrl1+ext1;
																lastColor.filename1Edited=imgUrl1+ext1;
																lastColor.dateFormat=newDateGeneartion();
																lastColor.edited=true;
																console.log("is claimming");
																	fs.rename(tempPath,targetPath,function(err){
																		if(err){
																			console.log("admin is received");
																			console.log(err);
																			res.redirect("/admin");																											
																		}else{
																			console.log("eleme is good");
																			lastColor.save(function(err,newColor){
																				article.save(function(err,newArticle){
																					var newFileTab=[...allFilenameTab,imgUrl1+ext1];
																					allFilename.filename=newFileTab;
																					allFilename.save(function(){
																						res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id+"/"+newColor._id)
																					});																					
																				});
																				
																			});
																		}
																	});	
															}else{
																	console.log("isgoodath");
																	lastColor.filename1Edited=imgUrl1+ext1;
																	lastColor.dateFormat=newDateGeneartion();
																	lastColor.edited=true;
																	fs.rename(tempPath,targetPath,function(err){
																		if(err){
																			console.log("admin is received");
																			console.log(err);
																			res.redirect("/admin");																											
																		}else{
																			lastColor.save(function(err,newColor){
																				var newFileTab=[...allFilenameTab,imgUrl1+ext1];
																				allFilename.filename=newFileTab;
																				allFilename.save(function(){
																					res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id+"/"+newColor._id)
																				});																				
																			});
																		}
																	});
																}		
													}
												}else{
													console.log("no errr")
												}
											});
									
								}
							}else{
								
							}
						})						
							
					}else{
						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
					}
			}
			Article.findOne({_id:id},function(err,article){
				if(err){
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}
				if(article){					
					EditeImage(article);									
				}else{
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}
			});
			
		}
	},
	editSecondImage:function(req,res){	
		if(req.session.logIn&&req.session.admin){			
			var id=req.params.id;
			//var filename=req.params.filename;
			var colorId=req.params.colorId;
			
			function EditeImage(article){
				var possible="abcdefghijklmnopqrstuvwxyz0123456789";
				var imgUrl2="";					
				for(var i=0; i<6 ;i++){
					imgUrl2+=possible.charAt(Math.floor(Math.random()*possible.length));												
				}
				
				if((req.files).length>0){					
						var ext2=path.extname((req.files[0].originalname)).toLowerCase();
						
						if(article.filename2Edited){
							var lastfilename2Edited=article.filename2Edited;
						}						
						
						Filename.findOne({},function(err,allFilename){
							if(err){
								console.log("file error");
							}
							else if(allFilename){
								console.log("this file is there");
								var allFilenameTab=allFilename.filename;
								if(allFilenameTab.indexOf(imgUrl2+ext2)!=-1){
									EditeImage(article);
									console.log("the loop");
								}else{
									var tempPath=req.files[0].path;
									var targetPath=path.resolve("./public/image/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+imgUrl2+ext2);
									Color.findOne({articleId:id,_id:colorId},function(err,lastColor){
										if(err){
											console.log("err");		
											}
										else if(lastColor){
											console.log("lastColor");
													if(lastColor.filename2Edited){
														var lastfilename2Edited=lastColor.filename2Edited;
														fs.exists(path.join(__dirname,"../public/image/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+lastfilename2Edited),function(existe){
															if(existe){
																fs.unlink(path.join(__dirname,"../public/image/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+lastfilename2Edited),function(err){
																	if(err){
																		console.log(err);
																		console.log("err in deleting");
																	}else{
																		if(lastColor.principal){
																			console.log("last err");
																			article.filename2Edited=imgUrl2+ext2;
																			lastColor.filename2Edited=imgUrl2+ext2;
																			lastColor.dateFormat=newDateGeneartion();
																			lastColor.edited=true;
																			fs.rename(tempPath,targetPath,function(err){
																				if(err){
																					console.log("admin is received");
																					console.log(err);
																					res.redirect("/admin");																											
																				}else{
																					console.log("biter err");
																					lastColor.save(function(err,newColor){
																						article.save(function(err,newArticle){
																							console.log("err bitcoin");
																							var newFileTab=[...allFilenameTab,imgUrl2+ext2];
																							allFilename.filename=newFileTab;
																							allFilename.save(function(){
																								res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id+"/"+newColor._id)
																							});																					
																						});
																						
																					});
																				}
																			});
																		}else{
																			console.log("is there a time");
																			lastColor.filename2Edited=imgUrl2+ext2;
																			lastColor.dateFormat=newDateGeneartion();
																			lastColor.edited=true;
																			fs.rename(tempPath,targetPath,function(err){
																				if(err){
																					console.log("admin is received");
																					console.log(err);
																					res.redirect("/admin");																											
																				}else{
																					lastColor.save(function(err,newColor){
																						var newFileTab=[...allFilenameTab,imgUrl2+ext2];
																						allFilename.filename=newFileTab;
																						console.log("istere a cloth");
																						allFilename.save(function(){
																							res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id+"/"+newColor._id)
																						});																				
																					});
																				}
																			});
																		}													
																	}
																});
															}else{
																	if(lastColor.principal){
																			console.log("last err");
																			article.filename2Edited=imgUrl2+ext2;
																			lastColor.filename2Edited=imgUrl2+ext2;
																			lastColor.dateFormat=newDateGeneartion();
																			lastColor.edited=true;
																			fs.rename(tempPath,targetPath,function(err){
																				if(err){
																					console.log("admin is received");
																					console.log(err);
																					res.redirect("/admin");																											
																				}else{
																					console.log("biter err");
																					lastColor.save(function(err,newColor){
																						article.save(function(err,newArticle){
																							console.log("err bitcoin");
																							var newFileTab=[...allFilenameTab,imgUrl2+ext2];
																							allFilename.filename=newFileTab;
																							allFilename.save(function(){
																								res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id+"/"+newColor._id)
																							});																					
																						});
																						
																					});
																				}
																			});
																		}else{
																			console.log("is there a time");
																			lastColor.filename2Edited=imgUrl2+ext2;
																			lastColor.dateFormat=newDateGeneartion();
																			lastColor.edited=true;
																			fs.rename(tempPath,targetPath,function(err){
																				if(err){
																					console.log("admin is received");
																					console.log(err);
																					res.redirect("/admin");																											
																				}else{
																					lastColor.save(function(err,newColor){
																						var newFileTab=[...allFilenameTab,imgUrl2+ext2];
																						allFilename.filename=newFileTab;
																						console.log("istere a cloth");
																						allFilename.save(function(){
																							res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id+"/"+newColor._id)
																						});																				
																					});
																				}
																			});
																		}
															}
														});
														
													}else{
														if(lastColor.principal){
																article.filename2Edited=imgUrl2+ext2;
																lastColor.filename2Edited=imgUrl2+ext2;
																lastColor.dateFormat=newDateGeneartion();
																lastColor.edited=true;
																console.log("is claimming");
																	fs.rename(tempPath,targetPath,function(err){
																		if(err){
																			console.log("admin is received");
																			console.log(err);
																			res.redirect("/admin");																											
																		}else{
																			console.log("eleme is good");
																			lastColor.save(function(err,newColor){
																				article.save(function(err,newArticle){
																					var newFileTab=[...allFilenameTab,imgUrl2+ext2];
																					allFilename.filename=newFileTab;
																					allFilename.save(function(){
																						res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id+"/"+newColor._id)
																					});																					
																				});
																				
																			});
																		}
																	});	
															}else{
																	console.log("isgoodath");
																	lastColor.filename2Edited=imgUrl2+ext2;
																	lastColor.dateFormat=newDateGeneartion();
																	lastColor.edited=true;
																	fs.rename(tempPath,targetPath,function(err){
																		if(err){
																			console.log("admin is received");
																			console.log(err);
																			res.redirect("/admin");																											
																		}else{
																			lastColor.save(function(err,newColor){
																				var newFileTab=[...allFilenameTab,imgUrl2+ext2];
																				allFilename.filename=newFileTab;
																				allFilename.save(function(){
																					res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id+"/"+newColor._id)
																				});																				
																			});
																		}
																	});
																}		
													}
												}else{
													console.log("no errr")
												}
											});
									
								}
							}else{
								
							}
						})						
							
					}else{
						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
					}
			}
			Article.findOne({_id:id},function(err,article){
				if(err){
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}
				if(article){					
					EditeImage(article);									
				}else{
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}
			});
			
		}
	},
	editArticleDetail:function(req,res){
		if(req.session.logIn&&req.session.admin){
			var id=req.params.id;
			Article.findOne({_id:id},function(err,article){
				if(err){
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}if(article){
					if(req.body){
						var newName=req.body.name;
						var newMark=req.body.mark;
						var newDetailPrice=req.body.detail_price;
						var newWholePrice=req.body.gros_price;
						var newGrosNumber=req.body.gros_number;
						if((deleteSpace(newName)).length>0 && newName!=article.name){
							article.name=newName;
						}
						if((deleteSpace(newMark)).length>0&&newMark!=article.mark){
							article.mark=newMark;
						}
						if((deleteSpace(newDetailPrice)).length>0&&newDetailPrice!=article.detailPrice){
							article.detailPrice=newDetailPrice;
						}
						if((deleteSpace(newWholePrice)).length>0&&newWholePrice!=article.wholePrice){
							article.wholePrice=newWholePrice;
						}
						if((deleteSpace(newGrosNumber)).length>0&&newGrosNumber!=article.wholeNumber){
							article.wholeNumber=newGrosNumber;
						}
						article.contentEdited=true;
						article.save(function(err,newArticle){
							res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id);
						});
						
					}else{
						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
					}
				}
			});
		}
	},//ok
	editDescription:function(req,res){
		if(req.session.logIn&&req.session.admin){
			var id=req.params.id;
			Article.findOne({_id:id},function(err,article){
				if(err){
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}
				if(article){
					if(req.body){
						if(req.body.description && (deleteSpace(req.body.description)).length>0){
							article.description=req.body.description;
							article.contentEdited=true;
							article.save(function(err,newArticle){
								res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id);
							})
						}else{
							res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
						}
					}else{
						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
					}
				}
			});
		}else{
			res.redirect("/login");
		}
	},//ok
	addNumber:function(req,res){
		if(req.session.logIn&&req.session.admin){
			var id=req.params.id;
			Article.findOne({_id:id},function(err,article){
				if(err){
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}
				if(article){
					var newSize=req.body.size;
					if(deleteSpace(newSize).length>0 && parseInt(deleteSpace(newSize))>0){
						var lastSize=article.size;
						var newSize=[...lastSize,newSize];
						article.size=newSize;
						article.contentEdited=true;
						article.save(function(err,newArticle){
							res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id);
						});
					}else{
						res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id);
					}
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	addNewColor:function(req,res){
		if(req.session.logIn&&req.session.admin){
					
			var id=req.params.id;
			var color=req.body.color;
			console.log("color added");
			console.log(color);
			
			function addNewColor(article){
					var possible="abcdefghijklmnopqrstuvwxyz0123456789";
					var imgUrl1="";					
					var imgUrl2="";					
					for(var i=0; i<6 ;i++){
						imgUrl1+=possible.charAt(Math.floor(Math.random()*possible.length));												
					}
					for(var i=0; i<6 ;i++){
						imgUrl2+=possible.charAt(Math.floor(Math.random()*possible.length));												
					}
					if((req.files).length==2 && color){
						var tempPath1=req.files[0].path;
						var tempPath2=req.files[1].path;						
						var ext1=path.extname((req.files[0].originalname)).toLowerCase();
						var ext2=path.extname((req.files[1].originalname)).toLowerCase();					
							
						var targetPath1=path.resolve("./public/image/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+imgUrl1+ext1);
						var targetPath2=path.resolve("./public/image/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+imgUrl2+ext2);
											
						Filename.findOne({},function(err,filename){
							var allFilename=filename.filename;
							if(allFilename.indexOf(imgUrl1+ext1)===-1 && allFilename.indexOf(imgUrl2+ext2)===-1){
								Color.findOne({name:color,articleId:article._id},function(err,insidecolor){
									if(insidecolor){
										req.session.color_exist="Vous ne pouvez ajouter une couleur deux fois";										
										var lastPath=req.session.lastPath;
										res.redirect(lastPath);
									}else{
										fs.rename(tempPath1,targetPath1,function(err){
											if(err){												
												var lastPath=req.session.lastPath;
												res.redirect(lastPath);
											}else{
												fs.rename(tempPath2,targetPath2,function(err){
													if(err){														
														var lastPath=req.session.lastPath;
														res.redirect(lastPath);
													}else{
														var newColor=new Color({
															name:color,
															filename1Edited:imgUrl1+ext1,
															filename2Edited:imgUrl2+ext2,
															articleId:article._id,
															time:timeGeneration(),
															date:dateGeneration(),
															dateFormat:newDateGeneartion()
														});
														newColor.save(function(err,color){
															res.redirect("/"+article.classe+"/"+article.categorie+"/"+article.type+"/"+article._id+"/"+color._id);
														});														
													}
												});
											}
										});
									}
								});
							}else{
								addNewColor(article)
							}							
						});					
					
					}else{
						if(req.files.length===0){
							req.session.no_image=true;
						}
						if(req.files.length===1){
							req.session.no_two_image=true;
						}
						if(!req.body.color){
							req.session.no_color=true;
						}
						if(!req.files){
							req.session.no_image=true;
						}
						var lastPath=req.session.lastPath;
						res.redirect(lastPath);
					}
					
			}
			Article.findOne({_id:id},function(err,article){
				if(err){
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}
				if(article){					
					addNewColor(article);
				}else{
					var lastPath=req.session.lastPath;
					res.redirect(lastPath);
				}		
			});

	}else{
		res.redirect("/login");
	}
},

	
	deactivate:function(req,res){
		if(req.session.logIn){
			if(req.session.admin){
				var articleId=deleteSpace(req.params.id);
				if(articleId.length>0){
					Article.findOne({_id:articleId,boutiUsername:req.session.admin.username},function(err,article){
						if(err){
							if(req.session.lastPath){
								res.redirect(lastPath);
							}else{
								res.redirect("/login");
							}
						}else{
							article.flag=false;
							article.save(function(err,newArticle){
								res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id);
							});
						}
					});
				}else{
					if(req.session.lastPath){
						res.redirect(lastPath);
					}else{
						res.redirect("/login");
					}
				}				
			}else{
				if(req.session.lastPath){
					res.redirect(lastPath);
				}else{
					res.redirect("/login");
				}				
			}
		}else{
			if(req.session.lastPath){
				res.redirect(lastPath);
			}else{
				res.redirect("/login");
			}
			
		}
	},
	activate:function(req,res){
		if(req.session.logIn){
			if(req.session.admin){
				var articleId=deleteSpace(req.params.id);
				if(articleId.length>0){
					Article.findOne({_id:articleId,boutiUsername:req.session.admin.username},function(err,article){
						if(err){
							if(req.session.lastPath){
								res.redirect(lastPath);
							}else{
								res.redirect("/login");
							}
						}else{
							article.flag=true
							article.save(function(err,newArticle){
								res.redirect("/"+newArticle.classe+"/"+newArticle.categorie+"/"+newArticle.type+"/"+newArticle._id);
							});
						}
					});
				}else{
					if(req.session.lastPath){
						res.redirect(lastPath);
					}else{
						res.redirect("/login");
					}
				}				
			}else{
				if(req.session.lastPath){
					res.redirect(lastPath);
				}else{
					res.redirect("/login");
				}				
			}
		}else{
			if(req.session.lastPath){
				res.redirect(lastPath);
			}else{
				res.redirect("/login");
			}
			
		}
	},
	activeColor:function(req,res){
		if(req.session.logIn){
			if(req.session.admin){
				var articleId=deleteSpace(req.params.articleId);
				var colorId=deleteSpace(req.params.colorId);
				if(articleId.length>0&&colorId.length>0){
					Color.findOne({_id:colorId,articleId:articleId},function(err,color){
						if(err){
							if(req.session.lastPath){
								res.redirect(req.session.lastPath);
							}else{
								res.redirect("/login");
							}
						}else{
							if(color){
								color.active=true;
								color.save(function(err){
									res.redirect(req.session.lastPath);
								});
							}else{
								if(req.session.lastPath){
									res.redirect(req.session.lastPath);
								}else{
									res.redirect("/login");
								}
							}
						}
					});
				}else{
					if(req.session.lastPath){
						res.redirect(lastPath);
					}else{
						res.redirect("/login");
					}
				}
			}else{
				if(req.session.lastPath){
					res.redirect(lastPath);
				}else{
					res.redirect("/login");
				}
			}
		}else{
			if(req.session.lastPath){
				res.redirect(lastPath);
			}else{
				res.redirect("/login");
			}
		}
	},
	deactiveColor:function(req,res){
		if(req.session.logIn){
			if(req.session.admin){
				var articleId=deleteSpace(req.params.articleId);
				var colorId=deleteSpace(req.params.colorId);
				if(articleId.length>0&&colorId.length>0){
					Color.findOne({_id:colorId,articleId:articleId},function(err,color){
						if(err){
							if(req.session.lastPath){
								res.redirect(req.session.lastPath);
							}else{
								res.redirect("/login");
							}
						}else{
							if(color){
								if(color.principal){
									res.redirect(req.session.lastPath);
								}else{
										color.active=false;
										color.save(function(err){
											res.redirect(req.session.lastPath);
										});
								}
								
							}else{
								if(req.session.lastPath){
									res.redirect(req.session.lastPath);
								}else{
									res.redirect("/login");
								}
							}
						}
					});
				}else{
					if(req.session.lastPath){
						res.redirect(req.session.lastPath);
					}else{
						res.redirect("/login");
					}
				}
			}else{
				if(req.session.lastPath){
					res.redirect(req.session.lastPath);
				}else{
					res.redirect("/login");
				}
			}
		}else{
			if(req.session.lastPath){
				res.redirect(req.session.lastPath);
			}else{
				res.redirect("/login");
			}
		}
	},
	
	
	
	gettypicalvalues:function(req,res){
		if(req.session.logIn){
			if(req.session.admin){
				var articleId=deleteSpace(req.params.articleId);
				var articleClasse=deleteSpace(req.params.articleClasse);
				var articleCategorie=deleteSpace(req.params.articleCategorie);
				var typicalName=deleteSpace(req.params.typicalName);
				if(articleClasse.length>0 && articleCategorie.length>0){
					if(typicalName.length>0){
						ArticleDetail.findOne({classe:articleClasse,category:articleCategorie,name:typicalName},function(err,typical){
							if(err){
								console.log("error");
								res.json({});								
							}else if(typical){								
								res.json({"typical":typical});
								
							}else{
								console.log("vide");
								res.json({});
							}
					})																	;
					}else{
						res.json({"notypicalName":true});
					}
				}else{
					res.json({});
				}
			}else{
				res.json({});
			}
		}else{
			res.json({});
		}
	},
	addarticletypical:function(req,res){
		if(req.session.logIn){
			if(req.session.admin){
				var articleId=deleteSpace(req.params.articleId);
				var classe=deleteSpace(req.params.classe);
				var categorie=deleteSpace(req.params.category);
				//var type=deleteSpace(req.params.type);
				var body=req.body;
				
				if(articleId.length>0 && classe.length>0 && categorie.length>0){
					if(body.typicalName.length>0 && body.typicalValue.length>0){
						Article.findOne({_id:articleId,boutiUsername:req.session.admin.username,classe:classe,categorie:categorie},function(err,article){
							if(err){
								res.json({"error":true});
								//req.session.body=req.body;
								//res.redirect("/"+classe+"/"+categorie+"/"+type+"/"+articleId);
							}
							else if(article){
								Typical.findOne({articleId:articleId,typicalName:body.typicalName},function(err,lastTypical){
									if(err){
										res.json({"error":true});
										//req.session.body=req.body;
										//res.redirect("/"+classe+"/"+categorie+"/"+type+"/"+articleId);
									}else if(lastTypical){
										lastTypical.typicalValue=body.typicalValue;
										lastTypical.edited=true;
										lastTypical.save(function(){
											article.edited=true;
											article.save(function(){
												res.json({"modified":true})
											});
											
										});
									}else{
										var newTypical=new Typical({
											articleId:articleId,
											typicalName:body.typicalName,
											typicalValue:body.typicalValue
										});
										newTypical.save(function(err,data){
											var newObjec={
												"newadd":true,
												"typical":data
											}
											article.edited=true;
											article.save(function(){
												res.json(newObjec);
											});
											
										});
									}
								});
							}else{
								res.json({"error":true});
								//req.session.body=req.body;
								//res.redirect("/"+classe+"/"+categorie+"/"+type+"/"+articleId);
							}
						})
					}
					else{
						var object={};
						req.session.body=req.body;
						if(!body.typicalName){
							object.notypicalName=true;
						}
						if(!body.typicalValue){
							object.notypicalValue=true;							
						}
						res.json(object);
					}
				}else{
					res.json({"reload":true});
					//res.redirect("/");
				}							
			}else{
				res.json({"reload":true});
				//res.redirect("/login");						
			}
		}else{
			res.json({"reload":true});
			//res.redirect("/login");			
		}
	},
	editarticletypical:function(req,res){
		if(req.session.logIn){
			if(req.session.admin){
				var typicalId=deleteSpace(req.params.id);
				var typicalName=req.body.typicalName;
				var typicalValue=req.body.typicalValue;				
				var body=req.body;
				
				if(typicalId.length>0){
					if(deleteSpace(body.typicalName) && deleteSpace(body.typicalValue)){
						if(deleteSpace(body.typicalName).length>0 && deleteSpace(body.typicalValue).length>0){
							Typical.findOne({_id:typicalId},function(err,lastTypical){
									if(err){
										console.log("error");
										res.json({"error":true});
										//req.session.body=req.body;
										//res.redirect("/"+classe+"/"+categorie+"/"+type+"/"+articleId);
									}else if(lastTypical){
										Article.findOne({_id:lastTypical.article_id},function(err,article){
											if(err){
												var newObjec={
													"noTypical":true											
												}
												res.json(newObjec);
											}else if(article){
												console.log("last")
												lastTypical.typicalValue=body.typicalValue;
												lastTypical.typicalName=body.typicalName;
												lastTypical.edited=true;
												lastTypical.save(function(){
													article.edited=true;
													article.save(function(){
														res.json({"modified":true})
													});													
												});
											}else{
												var newObjec={
													"noTypical":true											
												}
												res.json(newObjec);
											}
										});
										
									}else{
										console.log("is better");
										var newObjec={
											"noTypical":true											
										}
										res.json(newObjec);										
									}
								});
						}else{
							console.log("is done");
							var object={};
							req.session.body=req.body;
							if(!deleteSpace(body.typicalName)){
								object.notypicalName=true;
							}
							if(!deleteSpace(body.typicalValue)){
								object.notypicalValue=true;							
							}
							res.json(object);
						}
					}else{
						console.log("is goone");
						var object={};
							req.session.body=req.body;
							if(!deleteSpace(body.typicalName)){
								object.notypicalName=true;
							}
							if(!deleteSpace(body.typicalValue)){
								object.notypicalValue=true;							
							}
							res.json(object);
					}
					
				}else{
					res.json({"reload":true});
					//res.redirect("/");
				}							
			}else{
				res.json({"reload":true});
				//res.redirect("/login");						
			}
		}else{
			res.json({"reload":true});
			//res.redirect("/login");			
		}
	},	
	removearticletypical:function(req,res){		
		if(req.session.logIn){
			if(req.session.admin){
				var typicalId=deleteSpace(req.params.id);
				if(typicalId.length){
					Typical.findOne({_id:typicalId},function(err,typical){
								if(err){
									res.json({"err":true})
								}else if(typical){
									Article.findOne({_id:typical.article_id},function(err,article){
										if(err){
											res.json({"notypical":true})
										}else if(article){
											typical.remove(function(){
												article.save(function(){
													res.json({"removed":true});
												});																						
											})
										}else{
											res.json({"notypical":true})
										}
									});
									
								}else{
									res.json({"notypical":true})
								}
							});
					
				}else{
					res.json({"reload":true});
				}				
			}else{
				res.json({"reload":true});
			}
		}else{
			res.json({"reload":true});			
		}		
	},
	typicalPage:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var init=((req.session.superAdmin.username).substring(0,1)).toUpperCase();					
					var adminObject={											
						init:init,
						name:req.session.superAdmin.role							
					};
					var viewModel={};
					viewModel.superAdmin=adminObject;
					if(req.session.noClasse){
						viewModel.noClasse=true;
						delete req.session.noClasse;
					}
					if(req.session.noCategory){
						viewModel.noCategory=true;
						delete req.session.noCategory
					}
					if(req.session.nodetailname){
						viewModel.nodetailname=true;
						delete req.session.nodetailname;
					}
					if(req.session.nodetailval){
						viewModel.nodetailval=true;
						delete req.session.nodetailval
					}
					if(req.session.detail_existed){
						viewModel.detail_existed=true;
						delete req.session.detail_existed;
					}
					
					if(req.session.body){						
						viewModel.body=req.session.body;
						delete req.session.body;						
					}
					if(req.session.succed_delete){
						viewModel.succed_delete=true;
						delete req.session.succed_delete;
					}					
					res.render("typicalPage",viewModel);
				}else{
					res.redirect("/login");
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	
	getAllDetail:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.json({});
				}else if(superAdmin){
					var classe=deleteSpace(req.params.classe);
					var category=deleteSpace(req.params.category);
					if(classe.length>0&&category.length>0){
						ArticleDetail.find({classe:classe,category:category},function(err,all){
							if(err){
								res.json({});
							}else if(all){
								console.log(all);
								res.json(all);
							}else{
								res.json({});
							}
						});
					}else{
						res.json({});
					}
					
				}else{
					res.json({});
				}
			});
		}else{
			res.json({});
		}
	},
	removeTypical:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								var classe=detail.classe;
								var category=detail.category;
								detail.remove(function(){
									var body={
										classe:classe,
										category:category
									};
									req.session.body=body;
									req.session.succed_delete=true;
									res.redirect("/admin/article/typical");
								});
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
			});
		}else{
			res.redirect("/login");
		}
	},
	addtypical:function(req,res){
		if(req.session.logIn&&req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,role:"detailAdd"},function(err,admin){
				if(err){
					res.redirect("/login");
				}
				else if(admin){
					if(req.body){
						var classe=deleteSpace(req.body.classe),
						category=deleteSpace(req.body.category),
						detailname=deleteSpace(req.body.detailname),
						detailval=deleteSpace(req.body.detailval);
												
						if(classe.length>0&&category.length>0&&detailname.length>0&&detailval.length>0){
							
							ArticleDetail.findOne({classe:classe,category:category,name:detailname},function(err,detail){
								console.log("detail");
								console.log(detail);
								if(err){									
									res.redirect("/admin/article/typical");
								}
								else if(detail){
									console.log("detail.val");
									console.log((detail.val).indexOf(detailval));
									if((detail.val).indexOf(detailval)>=0){
										req.session.detail_existed=true;
										req.session.body=req.body;
										res.redirect("/admin/article/typical"); 
									}else{
										
										var detailTab=detail.val;
										detailTab.push(detailval);
										detail.val=detailTab;
										detail.save(function(){
											req.session.body=req.body;
											res.redirect("/admin/article/typical"); 
										});
									}															
								}else{
									var newDetail=new ArticleDetail({
										name:detailname,
										val:[detailval],
										category:category,
										classe:classe
									});
									newDetail.save(function(){
										req.session.body=req.body;
										res.redirect("/admin/article/typical"); 
									});
								}
							});
						}else{
							if(!classe){
								req.session.noClasse=true;
							}
							if(!category){								
								req.session.noCategory=true;
							}
							if(!detailname){
								req.session.nodetailname=true;	
							}
							if(!detailval){
								req.session.nodetailval=true;
							}
							req.session.body=req.body;
							res.redirect("/admin/article/typical");
						}
					}else{
						req.session.no_body=true;
						req.session.body="";
						res.redirect("/admin/article/typical");
					}
				}else{
					res.redirect("/login");
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	editTypical:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								var classEdited=detail.classe;
								var categoryEdited=detail.category;
								ArticleDetail.find({classe:classEdited,category:categoryEdited},function(err,allDetail){
									if(err){
										res.redirect("/login");
									}else if(allDetail){
										req.session.attributeEdited=detail;
										req.session.allDetail=allDetail;
										res.redirect("/admin/editTypical");
									}else{
										res.redirect("/login");
									}
								});
																
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
			});
		}else{
			res.redirect("/login");
		}
	},
	editTypicalPage:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var detail=req.session.attributeEdited;
					var allDetail=req.session.allDetail;
					if(detail){
						console.log(detail);
						var init=((req.session.superAdmin.username).substring(0,1)).toUpperCase();					
						var adminObject={											
							init:init,
							name:req.session.superAdmin.role							
						};
						var viewModel={};
						
						viewModel.superAdmin=adminObject;						
						if(req.session.nameExisted){
							viewModel.nameExisted=true;
							
							delete req.session.nameExisted;
						}
						viewModel.detail=detail;
						
						viewModel.allDetail=allDetail;
						res.render("editTypicalPage",viewModel);
					
					}else{
						res.redirect("/login");
					}					
				}else{
					res.redirect("/login");	
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	editTypicalName:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								var body={
									classe:req.body.classe,
									category:req.body.category,
									typical:req.body.name									
								}
								console.log("this req.body");
								console.log(req.body);
								var newName=deleteSpace(req.body.name);
								var classe=deleteSpace(req.body.classe);
								var category=deleteSpace(req.body.category);
								if(newName.length>0&&classe.length>0&&category.length>0){
									ArticleDetail.findOne({name:newName,category:detail.category,classe:detail.classe},function(err,oldDetail){
										if(err){
											res.redirect("/login");
										}else if(oldDetail){		
											console.log("newName");
											req.session.nameExisted=true;
											req.session.body=body;
											res.redirect("/admin/editTypical/"+detail._id);
										}else{
											console.log("newName is done");
											detail.name=newName;
											detail.save(function(){
												res.redirect("/admin/editTypical/"+detail._id);
											});
										}								
									});
								}else{
									if(!classe){
										req.session.noClasse=true;
									}
									if(!category){								
										req.session.noCategory=true;
									}
									if(!newName){
										req.session.noTypical=true;	
									}									
									req.session.body=body
									res.redirect("/admin/editTypical/"+detail._id);
								}																
							}else{
								res.redirect("/admin/editTypical/"+detail._id);
							}
						});
					}else{
						res.redirect("/admin/article/allDetail");
					}
				}else{
					res.redirect("/login");	
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	removeTypicalName:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								var classe=detail.classe;
								var category=detail.category;
								detail.remove(function(){
									var body={
										classe:classe,
										category:category
									};
									req.session.body=body;
									req.session.succed_delete=true;
									res.redirect("/admin/article/typical");
								});
							}else{
								//res.redirect("/login");
								res.redirect("/admin/article/typical");
							}
						});
					}else{
						//res.redirect("/login");
						res.redirect("/admin/article/typical");
					}
				}else{
					res.redirect("/login");	
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	removeTypicalValue:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					var typicalName=deleteSpace(req.params.typicalValue);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								var typicalValue=detail.val;
								var newTypicalValues=[];
								var tab=[];
								for(var i=0;i<typicalValue.length;i++){
									tab.push(i);
									if(deleteSpace(typicalValue[i])!==typicalName){
										newTypicalValues.push(typicalValue[i]);
									}
									if(tab.length===typicalValue.length){
										var classe=detail.classe;
										var category=detail.category;
										detail.val=newTypicalValues;
										detail.save(function(err,deta){
											console.log("data");
											console.log(deta);
											var body={
												classe:classe,
												category:category
											};
											req.session.body=body;
											res.redirect("/admin/editTypical/"+detail._id);
										});
									}
								}
								
							}else{
								
								res.redirect("/admin/article/typical");
							}
						});
					}else{
						
						res.redirect("/admin/article/typical");
					}
				}else{
					res.redirect("/login");	
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	editTypicalValue:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.json({});
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					var newTypicalValue=deleteSpace(req.params.newTypicalValue);
					var lastTypicalValue=deleteSpace(req.params.lastTypicalValue);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.json({});
							}else if(detail){
								var allTypicalValue=detail.val;
								var allNewTypicalValues=[];
								var tab=[];
								allNewTypicalValues.push(newTypicalValue);
								for(var i=0;i<allTypicalValue.length;i++){
									tab.push(i);
									if(deleteSpace(allTypicalValue[i])!==lastTypicalValue){
										allNewTypicalValues.push(allTypicalValue[i])
									}
									if(tab.length===allTypicalValue.length){
										detail.val=allNewTypicalValues;
										detail.save(function(err,data){
											req.session.attributeEdited=data;
											res.json({"succeed":true});
										});
									}									
								}								
							}else{								
								res.json({});
							}
						});
					}else{
						res.json({});						
					}
				}else{
					res.json({});
				}
			});
		}else{
			res.json({});
		}
	},
	addNewValue:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);					
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								var body={
									classe:detail.classe,
									category:detail.category,
									detailname:detail.name
								}
								req.session.body=body;
								res.redirect("/admin/article/typical");								
							}else{								
								res.redirect("/admin/article/typical");
							}
						});
					}else{						
						res.redirect("/admin/article/typical");
					}
				}else{
					res.redirect("/login");	
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	getDetail:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var init=((req.session.superAdmin.username).substring(0,1)).toUpperCase();					
					var adminObject={											
						init:init,
						name:req.session.superAdmin.role							
					};
					var viewModel={};
					viewModel.superAdmin=adminObject;
					if(req.session.noClasse){
						viewModel.noClasse=true;
						delete req.session.noClasse;
					}
					if(req.session.noCategory){
						viewModel.noCategory=true;
						delete req.session.noCategory
					}
					if(req.session.nodetailname){
						viewModel.nodetailname=true;
						delete req.session.nodetailname;
					}
					if(req.session.nodetailval){
						viewModel.nodetailval=true;
						delete req.session.nodetailval
					}
					if(req.session.detail_existed){
						viewModel.detail_existed=true;
						delete req.session.detail_existed;
					}
					
					if(req.session.body){						
						viewModel.body=req.session.body;
						delete req.session.body;						
					}
					if(req.session.succed_delete){
						viewModel.succed_delete=true;
						delete req.session.succed_delete;
					}
					
					res.render("detailAdd",viewModel);
				}else{
					res.redirect("/login");
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	removeAttribute:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								var classe=detail.classe;
								var category=detail.category;
								detail.remove(function(){
									var body={
										classe:classe,
										category:category
									};
									req.session.body=body;
									req.session.succed_delete=true;
									res.redirect("/admin/article/allDetail");
								});
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
			});
		}else{
			res.redirect("/login");
		}
	},
	editAttribute:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								var classEdited=detail.classe;
								var categoryEdited=detail.category;
								ArticleDetail.find({classe:classEdited,category:categoryEdited},function(err,allDetail){
									if(err){
										res.redirect("/login");
									}else if(allDetail){
										req.session.attributeEdited=detail;
										req.session.allDetail=allDetail;
										res.redirect("/admin/article/editAttribute");
									}else{
										res.redirect("/login");
									}
								});
																
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
			});
		}else{
			res.redirect("/login");
		}
	},
	getTypeValue:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.json({});
				}else if(superAdmin){
					var classe=deleteSpace(req.params.classe);
					var category=deleteSpace(req.params.category);
					var id=deleteSpace(req.params.id);
					if(classe.length>0&&category.length>0){
						ArticleDetail.findOne({classe:classe,category:category,_id:id},function(err,all){
							if(err){
								res.json({});
							}else if(all){
								console.log("all");
								console.log(all);
								res.json(all);
							}else{
								res.json({});
							}
						});
					}else{
						res.json({});
					}
					
				}else{
					res.json({});
				}
			});
		}else{
			res.json({});
		}
	},
	editAttributeName:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								var body={
									classe:req.body.classe,
									category:req.body.category,
									typical:req.body.name									
								}
								console.log("this req.body");
								console.log(req.body);
								var newName=deleteSpace(req.body.name);
								var classe=deleteSpace(req.body.classe);
								var category=deleteSpace(req.body.category);
								if(newName.length>0&&classe.length>0&&category.length>0){
									ArticleDetail.findOne({name:newName,category:detail.category,classe:detail.classe},function(err,oldDetail){
										if(err){
											res.redirect("/login");
										}else if(oldDetail){		
										
											req.session.nameExisted=true;
											req.session.body=body;
											res.redirect("/admin/article/allDetail");
										}else{
											detail.name=newName;
											detail.save(function(){
												res.redirect("/admin/article/allDetail/");
											});
										}								
									});
								}else{
									if(!classe){
										req.session.noClasse=true;
									}
									if(!category){								
										req.session.noCategory=true;
									}
									if(!newName){
										req.session.noTypical=true;	
									}									
									req.session.body=body
									res.redirect("/admin/article/allDetail");
								}																
							}else{
								res.redirect("/admin/article/allDetail");
							}
						});
					}else{
						res.redirect("/admin/article/allDetail");
					}
				}else{
					res.redirect("/login");	
				}
			});
		}else{
			res.redirect("/login");
		}
	},
	removeSpecificAttribute:function(req,res){
		if(req.session.logIn && req.session.superAdmin){
			SuperAdmin.findOne({username:req.session.superAdmin.username,password:req.session.superAdmin.password},function(err,superAdmin){
				if(err){
					res.redirect("/login");
				}else if(superAdmin){
					var id=deleteSpace(req.params.id);
					if(id.length>0){
						ArticleDetail.findOne({_id:id},function(err,detail){
							if(err){
								res.redirect("/login");
							}else if(detail){
								detail.remove(function(){
									res.redirect("/admin/article/allDetail");
								});															
							}else{
								res.redirect("/admin/article/allDetail");
							}
						});
					}else{
						res.redirect("/admin/article/allDetail");
					}
				}else{
					res.redirect("/login");	
				}
			});
		}else{
			res.redirect("/login");
		}
	}
	
	
}