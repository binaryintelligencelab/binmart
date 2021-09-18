var express=require("express"),
router=express.Router(),
login=require("../controllers/login"),
admin=require("../controllers/admin"),
adminPage=require("../controllers/adminPage"),
user=require("../controllers/user"),
superAdmin=require("../controllers/superAdmin");

module.exports=function(app){

	router.get("/signup",login.signup);//this route is for user inscription
	router.post("/signup",login.doSignup);//this route is for form user inscription
	
	router.get("/admsignup",login.admsignup);//this route is for vendor inscription		
	router.post("/admsignup",login.doAdmSignup);//this route is for vendor inscription
	
	
	router.get("/login",login.index);//this route is for login
	router.post("/login",user.doLogin);//this route is for connecting a user
	router.get("/logout",user.doLogout);//this route is for loging out

	
/** vendor route **/
	router.get("/admin",admin.index);//this route is for index page
	router.post("/admin/editInfo",admin.editInfo);
	//router.post("/admin/edit";admin.edit);
	router.get("/admin/classe",admin.classe);
	//router.get("/admin/findAge",admin.findAge);
	router.get("/admin/findCategory/:classe",admin.findCategory);
	router.get("/admin/findType/:classe/:category",admin.findType);
	router.post("/admin/add_article",admin.add_article);
	
	
	router.post("/admin/editColor/:id/:color_id",admin.editColor);
	router.post("/admin/editFirstImage/:id/:colorId",admin.editFirstImage);
	
	router.post("/admin/editSecondImage/:id/:colorId",admin.editSecondImage);
	router.post("/admin/editArticleDetail/:id",admin.editArticleDetail);
	router.post("/admin/editDescription/:id",admin.editDescription);
	router.get("/admin/gettypicalvalues/:articleClasse/:articleCategorie/:typicalName",admin.gettypicalvalues);//An ajax call
	//router.post("/admin/addarticletypical",admin.addarticletypical);
	router.post("/admin/addarticletypical/:articleId/:classe/:category",admin.addarticletypical);
	router.post("/admin/editarticletypical/:id",admin.editarticletypical);
	
	router.post("/admin/removearticletypical/:id",admin.removearticletypical);
	router.post("/admin/addNumber/:id",admin.addNumber);	
	router.post("/admin/addNewColor/:id",admin.addNewColor);
	router.get("/admin/deactivate/:id",admin.deactivate);
	router.get("/admin/activate/:id",admin.activate);
	router.get("/admin/activeColor/:articleId/:colorId",admin.activeColor);
	router.get("/admin/deactiveColor/:articleId/:colorId",admin.deactiveColor);


	
/**Superadmin route***/
	router.get("/admin/token",superAdmin.token);
	router.post("/admin/token",superAdmin.approved);
	router.get("/admin/approved",superAdmin.pageApproved);//image approved
	router.get("/admin/approved/:articleId/:colorId",superAdmin.pageApproved);//image approved	
	router.get("/admin/approved/:filename1/:filename2/:id",superAdmin.imageApproved);//image approved
	router.get("/admin/contentapproval",superAdmin.contentapproved);
	router.get("/admin/contentapproval/:classe/:category/:type/:id/:color_id",superAdmin.contentapproved);
	router.post("/admin/contentvalidation/:article_id/:color_id",superAdmin.contentvalidation);
	
	router.get("/admin/typicalapproval/:article_id",superAdmin.typicalapproved);
	
	router.post("/admin/typicalvalidation/:typical_id",superAdmin.typicalvalidation);
	//router.get("/admin/getallArticleTypical/:articleId",admin.getallArticleTypical);
	
	
	router.get("/admin/article/typical",admin.typicalPage);
	router.get("/admin/getAllDetail/:classe/:category",admin.getAllDetail);//an ajax call
	router.post("/admin/addtypical",admin.addtypical);
	router.get("/admin/removeTypical/:id",admin.removeTypical);
	router.get("/admin/editTypical/:id",admin.editTypical);
	router.get("/admin/editTypical",admin.editTypicalPage);
	router.post("/admin/editTypicalName/:id",admin.editTypicalName);
	router.get("/admin/removeTypicalName/:id",admin.removeTypicalName);
	router.get("/admin/editTypicalValue/:lastTypicalValue/:newTypicalValue/:id",admin.editTypicalValue);//ajax call
	router.get("/admin/removeTypicalValue/:typicalValue/:id",admin.removeTypicalValue);
	router.get("/admin/addNewValues/:id",admin.addNewValue);
	/*
	router.get("/admin/article/allDetail",admin.getDetail);
	
	*/
	
	
	/*router.get("/admin/getAllDetail/:classe/:category/:id",admin.getTypeValue);
	
	router.get("/admin/removeAttribute/:id",admin.removeAttribute);
	router.get("/admin/editAttribute/:id",admin.editAttribute);
	
	
	*/
	router.get("/",user.home);	
	router.get("/femmes",user.post);
	router.get("/femmes/:category",user.womenPost);
	router.get("/femmes/:category/:type",user.womenType);	
	router.get("/femmes/:category/:type/:id",user.articleDetail);
	router.get("/femmes/:category/:type/:id/:color_id",user.articleDetail);
	
	router.get("/hommes",user.post);
	router.get("/hommes/:category",user.womenPost);
	router.get("/hommes/:category/:type",user.womenType);	
	router.get("/hommes/:category/:type/:id/",user.articleDetail);
	router.get("/hommes/:category/:type/:id/:color_id",user.articleDetail);
	
	router.get("/filles",user.post);
	router.get("/filles/:category",user.womenPost);
	router.get("/filles/:category/:type",user.womenType);	
	router.get("/filles/:category/:type/:id",user.articleDetail);
	router.get("/filles/:category/:type/:id/:color_id",user.articleDetail);
	
	router.get("/garcons",user.post);
	router.get("/garcons/:category",user.womenPost);
	router.get("/garcons/:category/:type",user.womenType);	
	router.get("/garcons/:category/:type/:id",user.articleDetail);
	router.get("/garcons/:category/:type/:id/:color_id",user.articleDetail);
	
	//router.get("/jeux",user.post);
	router.get("/jeux",user.post);
	router.get("/jeux/:category",user.womenPost);
	router.get("/jeux/:category/:type",user.womenType);	
	router.get("/jeux/:category/:type/:id",user.articleDetail);
	router.get("/jeux/:category/:type/:id/:color_id",user.articleDetail);
	
	router.get("/meuble",user.post);
	router.get("/meuble/:category",user.womenPost);
	router.get("/meuble/:category/:type",user.womenType);	
	router.get("/meuble/:category/:type/:id",user.articleDetail);
	router.get("/meuble/:category/:type/:id/:color_id",user.articleDetail);
	
	router.get("/electromenager",user.post);
	router.get("/electromenager/:category",user.womenPost);
	router.get("/electromenager/:category/:type",user.womenType);	
	router.get("/electromenager/:category/:type/:id",user.articleDetail);
	router.get("/electromenager/:category/:type/:id/:color_id",user.articleDetail);
	
	router.get("/high_tech",user.post);
	router.get("/high_tech",user.post);
	router.get("/high_tech/:category",user.womenPost);
	router.get("/high_tech/:category/:type",user.womenType);	
	router.get("/high_tech/:category/:type/:id",user.articleDetail);
	router.get("/high_tech/:category/:type/:id/:color_id",user.articleDetail);
	
	
	
	router.post("/addToCart/:username/:articleId/:colorId",user.addToShop);
	router.get("/panier",user.getPanier);
	router.post("/addToCart",user.addToCart);
	
	router.get("/user/deletePanier/:id",user.deletePanier);
	router.post("/user/editPanier/size",user.editSize);
	router.post("/user/editPanier/color",user.editColor);
	router.post("/user/editPanier/quantite",user.editQuantite);
	
	router.get("/profil",user.profil);
	router.get("/profil/identite",user.identite);
	router.get("/profil/achat",user.achat);
	router.get("/profil/achat/deliver",user.delivered);
	
	router.get("/user/delete/:id",user.deleteCommande);
	
	router.post("/user/edit_profil",user.edit_profil);
	router.post("/user/edit_password",user.edit_password);
	router.get("/user/confirm/:id",user.confirmed);
	
	
	
	//router.get("/contact",user.contact);
	router.post("/user/commande/:phone/:price",user.commande);
	router.get("/operator",login.operator);
	
	//router.post("/user/commande/article",user.commande_article);
	app.use(router);
}