
$(document).ready(function(){
	function deleteSpace(string=""){
		var regex=/\s+/g;
		var newString=string.replace(regex,"");
		return newString;
	}
	var tr=$("td.price")
	//var tab=tr.split(" ");
	var allPrice=0;
	
	tr.each(function(){
		allPrice+=parseFloat($(this).text());		
		$(".allprice").text(allPrice);
	});
	
	var quanta=$(".quantite");
	var sum=0;
	
	quanta.each(function(){
		sum+=parseFloat($(this).text());		
		$(".sum").text(sum);
	});
	
	
});