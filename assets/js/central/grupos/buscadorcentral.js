$(function(){

	obj_cfcentral = new Buscadorgrupos();

});
$("#btn_corte_buscarcct_central").click(function(e){
	$("#div_btns_grid").hide();
  e.preventDefault();
	$("#itxt_corte_cct").val("");
	$("#div_btns_grid").hide();
	obj_cfcentral.get_view_buscadorcct();
});

function Buscadorgrupos(){
   	_thisccentral = this;
 }

Buscadorgrupos.prototype.get_view_buscadorcct = function (){
	var idnivel = 0
	var idregion = 0
	var idmunicipio = 0
	var idzona = 0
	$.ajax({
		url:base_url+"Buscadorcct/get_view_buscadorcct",
		method:"POST",
		data:{"idnivel":idnivel, "idregion":idregion, "idmunicipio":idmunicipio, "idzona":idzona},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#div_central_buscadorcct").empty();
			$("#div_central_buscadorcct").append(data.str_view);
			obj_bcct = null;
			obj_bcct = new Buscadorcct("div_central_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
			obj_bcct.init();
			document.getElementById('div_central_buscadorcct').addEventListener('cct_seleccionada',alimenta_campo_cct,false);

		},
		error: function(error){
			console.log(error);
		}
	});
};

function alimenta_campo_cct(){
		var cct = obj_bcct.get_cct();
		$("#txt_grupos_cct").val("");
		$("#txt_grupos_cct").val(cct);
		obj_bcct = null;
}// alimenta_campo_cct()

function get_gridpaginador(offset){
	//instamcia de mi objeto e instancia del objeto de mi objeto accedemos al metodo del objeto
	obj_bcct.obj_grid_buscador.get_gridpaginador(offset, "Buscadorcct", "get_grid", "form_buscadorcct");
}// get_gridpaginador()