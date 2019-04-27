$(function(){
	cortefin = new Cortefin();
});

$("#btn_revisar_req_fin").click(function(){
	cortefin.revisa_requisitos();
});

$("#btn_aplicar_req_fin").click(function(){
	cortefin.aplicar_cortefin();
});

function Cortefin(){
   _this = this;
 }

 Cortefin.prototype.revisa_requisitos = function (){
 	$.ajax({
 		url: base_url+'Corte/revisar_requisitos',
 		type: 'POST',
 		dataType: 'json',
 		data: "",
 		beforeSend: function(xhr) {
             $("#wait").modal("show");
           },
 	})
 	.done(function(data) {
 		$("#wait").modal("hide");
 		console.log("success");
 		console.log(data.table);
 		$("#valida_aplicar_fin").val(data.aplicar);
 		$("#grid_cortefin").empty();
    $("#grid_cortefin").append(data.table);
        // cortefin.aplica_cortefin();
 	})
 	.fail(function() {
 		console.log("error");
 	})
 	.always(function() {
 		console.log("complete");
 	});

 }

 Cortefin.prototype.aplica_cortefin = function(){
 	$.ajax({
 		url: base_url+'Corte/aplica_cortefin',
 		type: 'POST',
 		dataType: 'json',
 		data: "",
 		beforeSend: function(xhr) {
             $("#wait").modal("show");
           },
 	})
 	.done(function(data) {
 		$("#wait").modal("hide");
 		if(data.atributo = "activar" && $("#valida_aplicar_fin").val() != "no"){
 			$("#btn_aplicar_req_fin").removeAttr("disabled");
 		}else{
 			$('#btn_aplicar_req_fin').attr("disabled", true);
 		}
 	})
 	.fail(function() {
 		console.log("error");
 	})
 	.always(function() {
 		console.log("complete");
 	});
 };

 Cortefin.prototype.aplicar_cortefin = function(){
 	$.ajax({
 		url: base_url+'Corte/aplicar_cortefin',
 		type: 'POST',
 		dataType: 'json',
 		data: "",
 		beforeSend: function(xhr) {
             $("#wait").modal("show");
           },
 	})
 	.done(function(data) {
 		$("#wait").modal("hide");
 		alert(data.atributo);
 		// if(data.atributo = "activar"){
 		// 	$("#btn_aplicar_req_fin").removeAttr("disabled");
 		// }else{
 		// 	$('#btn_aplicar_req_fin').attr("disabled", true);
 		// }
 	})
 	.fail(function() {
 		console.log("error");
 	})
 	.always(function() {
 		console.log("complete");
 	});
 };
