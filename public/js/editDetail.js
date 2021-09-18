
$(document).ready(function(){
	var caractere=$("#caracteristique");
	$("#caracteristique").on("change",function(){
		console.log("this.value");
		console.log(this.value);
	});
});