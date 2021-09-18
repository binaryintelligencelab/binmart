var User=require("../models/user");
var Admin=require("../models/adm");

var dayInWeek=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
var monthInYear=["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];

function toLower(string){
	return string.toLowerCase();
}

function deleteSpace(string=""){
	var regex=/\s+/g;
	var newString=string.replace(regex,"");
	return newString;
}

function nameUpper(name=""){
	let initialLetter=name.substring(0,1);
	let lastName=name.substring(1);
	initialLetter=initialLetter.toUpperCase();
	return initialLetter+lastName;
}

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



module.exports={
	index:function(req,res){
		let viewModel={};
		viewModel.title="Connexion";
		if(req.session.user_body){
			viewModel.body=req.session.user_body;
			delete req.session.user_body
		}
		if(req.session.no_username){
			viewModel.no_username=req.session.no_username;
			delete req.session.no_username;
		}
		if(req.session.no_passeword){
			viewModel.no_passeword=req.session.no_passeword;
			delete req.session.no_passeword;
		}
		if(req.session.no_user){
			viewModel.no_user=req.session.no_user;
			delete req.session.no_user;
		}
		if(req.session.false_password){
			viewModel.false_password=req.session.false_password;
			delete req.session.false_password;
		}
		res.render("login",viewModel);
	},//OK
	signup:function(req,res){
		let viewModel={};
		viewModel.title="Inscription";
		if(req.session.sub_body){
			viewModel.body=req.session.sub_body;
			delete req.session.sub_body;
		}
		if(req.session.no_name){
			viewModel.no_name=true;
			delete req.session.no_name;
		}
		if(req.session.no_surname){
			viewModel.no_surname=true;
			delete req.session.no_surname;
		}
		if(req.session.no_username){
			viewModel.no_username=true;
			delete req.session.no_username;
		}
		if(req.session.no_telephone){
			viewModel.no_telephone=true;
			delete req.session.no_telephone;
		}		
		if(req.session.no_password){
			viewModel.no_password=true;
			delete req.session.no_password;
		}
		if(req.session.no_password_confirmation){
			viewModel.no_password_confirmation=true;
			delete req.session.no_password_confirmation;
		}
		if(req.session.no_town){
			viewModel.no_town=true;
			delete req.session.no_town;
		}
		if(req.session.no_commune){
			viewModel.no_commune=true;
			delete req.session.no_commune;
		}
		if(req.session.check_password_length){
			viewModel.check_password_length=req.session.check_password_length;
			delete req.session.check_password_length;
		}
		if(req.session.check_password){
			viewModel.check_password=req.session.check_password;
			delete req.session.check_password;
		}	
		
		if(req.session.no_valid_number){
			viewModel.no_valid_number=req.session.no_valid_number;
			delete req.session.no_valid_number;
		}
		if(req.session.no_valid_operator){
			viewModel.no_valid_operator=req.session.no_valid_operator;
			delete req.session.no_valid_operator;
		}
		if(req.session.check_number){
			viewModel.check_number=req.session.check_number;
			delete req.session.check_number;
		}
		if(req.session.user_exist){
			viewModel.user_exist=req.session.user_exist;
			delete req.session.user_exist;
		}
		
		if(req.session.badname){
			viewModel.badname=req.session.badname;
			delete req.session.badname
		}
		if(req.session.badsurname){
			viewModel.badsurname=req.session.badsurname;
			delete req.session.badsurname
		}
		if(req.session.badusername){
			viewModel.badusername=req.session.badusername;
			delete req.session.badusername;
		}
		if(req.session.badpassword){
			viewModel.badpassword=req.session.badusername;
			delete req.session.badusername;
		}
		if(req.session.badconfirmation){
			viewModel.badconfirmation=req.session.badconfirmation;
			delete req.session.badconfirmation;
		}
		if(req.session.badtown){
			viewModel.badtown=req.session.badtown;
			delete req.session.badtown;
		}
		if(req.session.badcommune){
			viewModel.badcommune=req.session.badcommune;
			delete req.session.badcommune;
		}		
		res.render("signUp",viewModel);
	},//ok
	doSignup:function(req,res){
		var name=toLower(deleteSpace(req.body.name)),		
		username=toLower(deleteSpace(req.body.username)),
		surname=toLower(deleteSpace(req.body.surname)),
		phone=deleteSpace(req.body.telephone),
		town=toLower(deleteSpace(req.body.town)),
		commune=toLower(deleteSpace(req.body.commune)),
		password=deleteSpace(req.body.password),
		password_confirmation=deleteSpace(req.body.password_confirmation);
		
		function saveUser(validePhone){
			Admin.findOne({telephone:validePhone},function(err,admin){
				if(admin!==null){
					req.session.user_exist="Vous ne pouvez pas vous inscrire avec ce numero";
					req.session.sub_body=req.body;
					res.redirect("/signup");
				}else{
					User.findOne({telephone:validePhone},function(err,user){
						if(user!==null){
							req.session.user_exist="Vous ne pouvez pas vous inscrire avec ce numero";
							req.session.sub_body=req.body;
							res.redirect("/signup");								
						}
						else{
							Admin.findOne({username:username},function(err,autadmin){
								if(autadmin!==null){
									req.session.username_exist="Vous ne pouvez pas vous inscrire avec cet identifiant";
									req.session.sub_body=req.body;
									res.redirect("/signup");
								}else{
									User.findOne({username:username},function(err,autuser){
										if(autuser!==null){
											req.session.username_exist="Vous ne pouvez pas vous inscrire avec cet identifiant";
											req.session.sub_body=req.body;
											res.redirect("/signup");
										}else{											
											var userPhone="";								
											let phoneFlag=validePhone.substr(1,2);
											console.log("phoneFlag");
											console.log(phoneFlag);
											if(phoneFlag==="81"||phoneFlag==="82"||phoneFlag==="99"||phoneFlag==="97"||phoneFlag==="84"||phoneFlag==="85"||phoneFlag==="89"){
												userPhone=validePhone;
												var newUser=new User({
													username:username,
													surname:surname,
													name:name,									
													telephone:userPhone,
													password:password,
													password_confirmation:password_confirmation,							
													solde:0,
													role:"member",
													join:dateGeneration(),
													town:town,
													commune:commune
												});						
												newUser.save(function(err,data){
													if(data){
														req.session.logIn=true;
														req.session.firstUse=true;
														var init=((data.name).substring(0,1)).toUpperCase();
														var member={};
														member.init=init;
														member.name=data.name;
														member.username=data.username;
														member.surname=data.surname;
														req.session.member=member;																													
														res.redirect("/");
													}
												});
											}
											else{
												req.session.sub_body=req.body;
												req.session.no_valid_operator="Operateur non valide";
												res.redirect("/signup");
											}										
										}
									});
								}
							})
																				
					}
				});
				}
			});
			
	}
	if(name&&username&&password&&password_confirmation&&phone&&commune&&town){			
		if(password.length>=8){
			if(password===password_confirmation){
						
				var phonePattern=/^\d{9}$/;
				var phonePatter2=/^\d{10}$/;
				var phonePatter3=/^\+?\d{12}$/;
				var regex=/[<>"'&\/+]/;
				if(!regex.test(name)&&!regex.test(username)&&!regex.test(password)&&!regex.test(password_confirmation)&&!regex.test(commune)&&!regex.test(town)){
					if(phone.match(phonePattern)){
						phone=0+phone;
						saveUser(phone);																		
					}
					else if(phone.match(phonePatter2)){
						if(phone.indexOf("0")===0){
							saveUser(phone);
						}
						else{
							req.session.sub_body=req.body;
							req.session.check_number="Ce numero n'est pas valide";
							res.redirect("/signup");
						}
					}
					else if(phone.match(phonePatter3)&&phone.indexOf("+")===0){
						var prefix=phone.substring(1,4);
						if(prefix==="243"){
							phone=phone.substring(4);
							phone=0+phone;
							saveUser(phone);
						}else{
							req.session.sub_body=req.body;
							req.session.check_number="Ce numero n'est pas valide";
							res.redirect("/signup");
						}					
					}
					else if(phone.match(phonePatter3)&&phone.length===12){
						var prefix=phone.substring(0,3);
						if(prefix==="243"){
							phone=phone.substring(3);
							phone=0+phone;
							saveUser(phone);
						}else{
							req.session.sub_body=req.body;
							req.session.check_number="Ce numero n'est pas valide";
							res.redirect("/signup");
						}
					}
					else{
						req.session.sub_body=req.body;
						req.session.no_valid_number="Numero de telephone non valide"
						res.redirect("/signup");
					}
				}else{
					if(regex.test(name)){
						req.session.sub_body=req.body;
						req.session.badname="Le nom contient de caractère non admissible";
						
					}
					
					if(regex.test(surname)){
						req.session.sub_body=req.body;
						req.session.badsurname="Ce prenom contient de caractère non admissible";
					
					}
					
					if(regex.test(username)){
						req.session.sub_body=req.body;
						req.session.badusername="Le nom d'utilisateur contient de caractère non admissible";
						
					}
					if(regex.test(password)){
						req.session.sub_body=req.body;
						req.session.badpassword="Le mot de passe contient de caractère non admissible";
					
					}
					if(regex.test(password_confirmation)){
						req.session.sub_body=req.body;
						req.session.badconfirmation="Le mot de passe contient de caractère non admissible";
						
					}
					if(regex.test(town)){
						req.session.sub_body=req.body;
						req.session.badtown="La ville contient de caractère non admissible";
						
					}
					if(regex.test(commune)){
						req.session.sub_body=req.body;
						req.session.badcommune="La commune contient de caractère non admissible";
						
					}
					res.redirect("/signup");
				}		
						
				}else{
					req.session.sub_body=req.body;
					req.session.check_password="Le deux mots de passe doivent être conforme";
					res.redirect("/signup");
				}
			}else{
				req.session.sub_body=req.body;
				req.session.check_password_length="Le mot de passe doit contenir au moins 8 caractères";
				res.redirect("/signup");
			}
		}
		else{			
			if(!req.body.name){
				req.session.sub_body=req.body;
				req.session.no_name=true;				
			}
			if(!req.body.username){
				req.session.sub_body=req.body;
				req.session.no_username=true;				
			}
			if(!req.body.surname){
				req.session.sub_body=req.body;
				req.session.no_surname=true;				
			}
			if(!town){
				req.session.sub_body=req.body;
				req.session.no_town=true;
			}
			if(!commune){
				req.session.sub_body=req.body;
				req.session.no_commune=true;
			}
			
			if(!req.body.password){
				req.session.sub_body=req.body;
				req.session.no_password=true;				
			}
			if(!req.body.password_confirmation){
				req.session.sub_body=req.body;
				req.session.no_password_confirmation=true;				
			}
			if(!req.body.telephone){
				req.session.sub_body=req.body;
				req.session.no_telephone=true;				
			}
			
			res.redirect("/signup");
		}		
	},//ok
	admsignup:function(req,res){
		let viewModel={};
		viewModel.title="Incription";
		if(req.session.sub_body){
			viewModel.body=req.session.sub_body;
			delete req.session.sub_body;
		}
		if(req.session.no_name){
			viewModel.no_name=true;
			delete req.session.no_name;
		}
		if(req.session.no_surname){
			viewModel.no_surname=true;
			delete req.session.no_surname;
		}
		if(req.session.no_username){
			viewModel.no_username=true;
			delete req.session.no_username;
		}
		if(req.session.no_adminname){
			viewModel.no_adminname=true;
			delete req.session.no_adminname;
		}		
		if(req.session.no_rccm){
			viewModel.no_rccm=true;
			delete req.session.no_rccm;
		}
		if(req.session.no_telephone){
			viewModel.no_telephone=true;
			delete req.session.no_telephone;
		}
		if(req.session.no_province){
			viewModel.no_province=true;
			delete req.session.no_province;
		}
		if(req.session.no_town){
			viewModel.no_town=true;
			delete req.session.no_town;
		}
		if(req.session.no_commune){
			viewModel.no_commune=true;
			delete req.session.no_commune;
		}
		if(req.session.no_quarter){
			viewModel.no_quarter=true;
			delete req.session.no_quarter;
		}
		if(req.session.no_avenue){
			viewModel.no_avenue=true;
			delete req.session.no_avenue;
		}
		if(req.session.no_numero){
			viewModel.no_numero=true;
			delete req.session.no_numero;
		}		
		if(req.session.no_password){
			viewModel.no_password=true;
			delete req.session.no_password;
		}
		if(req.session.no_password_confirmation){
			viewModel.no_password_confirmation=true;
			delete req.session.no_password_confirmation;
		}
		
		if(req.session.check_password_length){
			viewModel.check_password_length=req.session.check_password_length;
			delete req.session.check_password_length;
		}
		
		if(req.session.check_password){
			viewModel.check_password=req.session.check_password;
			delete req.session.check_password;
		}
		

		if(req.session.badname){
			viewModel.badname=req.session.badname;
			delete req.session.badname
		}
		if(req.session.badsurname){
			viewModel.badsurname=req.session.badsurname;
			delete req.session.badsurname
		}
		if(req.session.badadminname){
			viewModel.badadminname=req.session.badadminname;
			delete req.session.badadminname
		}
		
		if(req.session.badusername){
			viewModel.badusername=req.session.badusername;
			delete req.session.badusername;
		}
		if(req.session.badrccm){
			viewModel.badrccm=req.session.badrccm;
			delete req.session.badrccm;
		}
		if(req.session.badprovince){
			viewModel.badprovince=req.session.badprovince;
			delete req.session.badprovince;
		}
		if(req.session.badtown){
			viewModel.badtown=req.session.badtown;
			delete req.session.badtown;
		}
		if(req.session.badcommune){
			viewModel.badcommune=req.session.badcommune;
			delete req.session.badcommune;
		}
		if(req.session.badquarter){
			viewModel.badquarter=req.session.badquarter;
			delete req.session.badquarter;
		}
		if(req.session.badavenue){
			viewModel.badavenue=req.session.badavenue;
			delete req.session.badavenue;
		}
		if(req.session.badnumero){
			viewModel.badnumero=req.session.badnumero;
			delete req.session.badnumero;
		}
		
		if(req.session.badpassword){
			viewModel.badpassword=req.session.badusername;
			delete req.session.badusername;
		}
		if(req.session.badconfirmation){
			viewModel.badconfirmation=req.session.badconfirmation;
			delete req.session.badconfirmation;
		}
		if(req.session.check_number){
			viewModel.check_number=req.session.check_number;
			delete req.session.check_number;
		}
		if(req.session.no_valid_number){
			viewModel.no_valid_number=req.session.no_valid_number;
			delete req.session.no_valid_number;
		}
		if(req.session.user_phone_exist){
			viewModel.user_phone_exist=req.session.user_phone_exist;
			delete req.session.user_phone_exist
		}
		if(req.session.user_exist){
			viewModel.user_exist=req.session.user_exist;
			delete req.session.user_exist;
		}
		if(req.session.no_valid_operator){
			viewModel.no_valid_operator=req.session.no_valid_operator;
			delete req.session.no_valid_operator;
		}
			
					
		res.render("admsignUp",viewModel);
	},
	doAdmSignup:function(req,res){
		console.log("req.body");
		console.log(req.body);
		var name=toLower(deleteSpace(req.body.name)),
		adminname=toLower(deleteSpace(req.body.adminname)),
		surname=toLower(deleteSpace(req.body.surname)),
		username=toLower(deleteSpace(req.body.username)),
		phone=deleteSpace(req.body.telephone),
		rccm=toLower(deleteSpace(req.body.rccm)),
		province=toLower(deleteSpace(req.body.province)),
		town=toLower(deleteSpace(req.body.town)),
		commune=toLower(deleteSpace(req.body.commune)),
		quarter=toLower(deleteSpace(req.body.quarter)),
		avenue=toLower(deleteSpace(req.body.avenue)),
		numero=toLower(deleteSpace(req.body.numero)),
		password=deleteSpace(req.body.password),
		password_confirmation=deleteSpace(req.body.password_confirmation);		
		
		function saveUser(validePhone){ 
			Admin.findOne({telephone:validePhone},function(err,admin){
				if(admin!==null){
					req.session.user_phone_exist="Vous ne pouvez pas vous inscrire avec ce numero";
					req.session.sub_body=req.body;
					res.redirect("/admsignup");
				}else{
					User.findOne({telephone:validePhone},function(err,user){
						if(user!==null){
							req.session.user_phone_exist="Vous ne pouvez pas vous inscrire avec ce numero";
							req.session.sub_body=req.body;
							res.redirect("/admsignup");								
						}
						else{
							var userPhone="";								
							let phoneFlag=validePhone.substr(1,2);
							console.log("phoneFlag");
							console.log(phoneFlag);
							if(phoneFlag==="81"||phoneFlag==="82"||phoneFlag==="99"||phoneFlag==="97"||phoneFlag==="84"||phoneFlag==="85"||phoneFlag==="89"){
								userPhone=validePhone;
								console.log("is done");
									Admin.findOne({username:username},function(err,lastAdmin){
										console.log("lastAdmin");
										console.log(lastAdmin);
										if(err){
											console.log("err");
											console.log(err);
											req.session.sub_body=req.body;
											res.redirect("/admsignup");
										}										
											
											if(lastAdmin!==null){
												req.session.user_exist="Vous ne pouvais vous inscrire avec ce nom d'utilisateur";
												req.session.sub_body=req.body;
												res.redirect("/admsignup");	
											}else{
												User.findOne({username:username},function(err,lastUser){
													console.log("is fallen");
													if(err){
														console.log("err");
														console.log(err);
														req.session.sub_body=req.body;
														res.redirect("/admsignup");
													}
													if(lastUser!==null){
															req.session.user_exist="Vous ne pouvais vous inscrire avec ce nom d'utilisateur";
															req.session.sub_body=req.body;
															res.redirect("/admsignup");	
													}else{
															console.log("is here");
															var newAdmin=new Admin({
																name:name,
																adminname:adminname,
																surname:surname,
																username:username,					
																province:province,
																town:town,
																commune:commune,
																quarter:quarter,
																avenue:avenue,
																numero:numero,
																telephone:userPhone,
																password:password,
																password_confirmation:password_confirmation,
																addresse:province+town+commune+quarter+avenue+numero,																
																role:"admin",
																rccm:rccm,
																join:dateGeneration()
															});						
															newAdmin.save(function(err,data){
																if(data){
																	req.session.logIn=true;																	
																	req.session.admin=data;																	
																	var adminObject={};
																	adminObject.adminname=data.adminname;
																	adminObject.surname=data.surname;
																	adminObject.username=data.username;
																	var init=((data.adminname).substring(0,1)).toUpperCase();
																	adminObject.init=init;
																	req.session.admin=adminObject;																	
																	res.redirect("/admin");
																}
															});
														}
													
												})
											}
										
									});									
								
							}
							else{
								console.log("is gone");
								req.session.sub_body=req.body;
								req.session.no_valid_operator="Operateur non valide";
								res.redirect("/signup");
							}
																			
					}
				});
				}
			});
			
	}
	if(name&&adminname&&surname&&username&&rccm&&province&&town&&commune&&quarter&&avenue&&numero&&password&&password_confirmation&&phone){			
		if(password.length>=8){
			if(password===password_confirmation){
								
				var phonePattern=/^\d{9}$/;
				var phonePatter2=/^\d{10}$/;
				var phonePatter3=/^\+?\d{12}$/;
				var regex=/[<>"'&\/+]/;
					if(!regex.test(name)&&!regex.test(adminname)&&!regex.test(surname)&&!regex.test(username)&&!regex.test(rccm)&&!regex.test(province)&&!regex.test(town)&&!regex.test(commune)&&!regex.test(quarter)&&!regex.test(avenue)&&!regex.test(numero)&&!regex.test(password)&&!regex.test(password_confirmation)){
						if(phone.match(phonePattern)){
							phone=0+phone;
							saveUser(phone);																		
						}
						else if(phone.match(phonePatter2)){
							if(phone.indexOf("0")===0){
								saveUser(phone);
							}
							else{
								req.session.sub_body=req.body;
								req.session.check_number="Ce numero n'est pas valide";
								res.redirect("/admsignup");
							}
						}
						else if(phone.match(phonePatter3)&&phone.indexOf("+")===0){
							var prefix=phone.substring(1,4);
							if(prefix==="243"){
								phone=phone.substring(4);
								phone=0+phone;
								saveUser(phone);
							}else{
								req.session.sub_body=req.body;
								req.session.check_number="Ce numero n'est pas valide";
								res.redirect("/admsignup");
							}					
						}
						else if(phone.match(phonePatter3)&&phone.length===12){
							var prefix=phone.substring(0,3);
							if(prefix==="243"){
								phone=phone.substring(3);
								phone=0+phone;
								saveUser(phone);
							}else{
								req.session.sub_body=req.body;
								req.session.check_number="Ce numero n'est pas valide";
								res.redirect("/admsignup");
							}
						}
						else{
							req.session.sub_body=req.body;
							req.session.no_valid_number="Numero de telephone non valide"
							res.redirect("/admsignup");
						}
					}else{
						if(regex.test(name)){
							req.session.sub_body=req.body;
							req.session.badname="Ce nom contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(surname)){
							req.session.sub_body=req.body;
							req.session.badsurname="Ce nom contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(adminname)){
							req.session.sub_body=req.body;
							req.session.badadminname="Ce nom contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						
						if(regex.test(username)){
							req.session.sub_body=req.body;
							req.session.badusername="Le nom de l'administrateur contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(rccm)){
							req.session.sub_body=req.body;
							req.session.badrccm="Votre RCCM contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(province)){
							req.session.sub_body=req.body;
							req.session.badprovince="La province contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(town)){
							req.session.sub_body=req.body;
							req.session.badtown="La ville contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(commune)){
							req.session.sub_body=req.body;
							req.session.badcommune="La commune contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(quarter)){
							req.session.sub_body=req.body;
							req.session.badquarter="La quartier contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(avenue)){
							req.session.sub_body=req.body;
							req.session.badavenue="L'avenue contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(numero)){
							req.session.sub_body=req.body;
							req.session.badnumero="Le numero contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						
						if(regex.test(password)){
							req.session.sub_body=req.body;
							req.session.badpassword="Le mot de passe contient de caractère non admissible";
							res.redirect("/admsignup");
						}
						if(regex.test(password_confirmation)){
							req.session.sub_body=req.body;
							req.session.badconfirmation="Le mot de passe contient de caractère non admissible";
							res.redirect("/admsignup");
						}
					}		
						
				}else{
					req.session.sub_body=req.body;
					req.session.check_password="Le deux mots de passe doivent être conforme";
					res.redirect("/admsignup");
				}
			}else{
				req.session.sub_body=req.body;
				req.session.check_password_length="Le mot de passe doit contenir au moins 8 caractères";
				res.redirect("/admsignup");
			}
		}
		else{
			req.session.sub_body=req.body;
			if(!name){				
				req.session.no_name=true;				
			}
			if(!surname){				
				req.session.no_surname=true;				
			}
			if(!adminname){				
				req.session.no_adminname=true;				
			}
			if(!username){				
				req.session.no_username=true;				
			}
			if(!rccm){				
				req.session.no_rccm=true;
			}
			if(!phone){				
				req.session.no_telephone=true;				
			}			
			if(!province){
				req.session.no_province=true;
			}
			if(!town){
				req.session.no_town=true;
			}
			if(!commune){
				req.session.no_commune=true;
			}
			if(!quarter){
				req.session.no_quarter=true;
			}
			if(!avenue){
				req.session.no_avenue=true;
			}
			if(!numero){
				req.session.no_numero=true;
			}			
			if(!password){				
				req.session.no_password=true;				
			}
			if(!password_confirmation){				
				req.session.no_password_confirmation=true;				
			}						
			res.redirect("/admsignup");
		}		
	},//ok
	operator:function(req,res){
		res.json({
			name:"allen",
			result:"success"
		});
	}
};