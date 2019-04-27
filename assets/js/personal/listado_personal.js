function get_gridpaginador(offset){
	if($("#modal_buscadorcct").is(":visible")){
		this_bcct.obj_grid_buscador.get_gridpaginador(offset, "Buscadorcct", "get_grid","form_buscadorcct");
	}else{
		obj_cfcentral.get_grid(offset);
	}

}// get_gridpaginador()
function alimenta_campo_cct(){
  obj_cfcentral = new Personal_central();
		var cct = obj_bcct.get_cct();
		var idcentrocfg = obj_bcct.get_idcentrocfg();
		$("#cct_filtro").val("");
		$("#cct_filtro").val(cct);
		$("#ccfg_filtro").val("");
		$("#ccfg_filtro").val(idcentrocfg);
		obj_bcct = null;
}// alimenta_campo_cct()

$(document).ready(function(){
  obj_cfcentral = new Personal_central();
});// document.ready

$("#buscar_escuelas_personal").click(function(e){
  e.preventDefault();
  	obj_cfcentral.get_view_buscadorcct();
});


function Personal_central(){
   _thisccentral = this;
 }

 Personal_central.prototype.get_grid = function (offset){
 		$("#div_btns_grid").show();
 };


Personal_central.prototype.get_view_buscadorcct = function (){
	$.ajax({
		url:base_url+"Buscadorcct/get_view_buscadorcct",
		method:"POST",
		data:{
        "idnivel" : $("#inp_niveles").val(),
        "idregion" : $("#inp_region").val(),
        "idmunicipio" : 0,
        "idzona" : 0
      },
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#div_personal_buscadorcct").empty();
			$("#div_personal_buscadorcct").append(data.str_view);
			obj_bcct = null;
			obj_bcct = new Buscadorcct("div_personal_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
			obj_bcct.init();
			document.getElementById('div_personal_buscadorcct').addEventListener('cct_seleccionada',alimenta_campo_cct,false);
      document.getElementById('div_personal_buscadorcct').addEventListener('event_salir_buscador',destruye_buscadorcct,false);

		},
		error: function(error){
			console.log(error);
		}
	});
};

function destruye_buscadorcct(){
  obj_bcct = null;
}// destruye_buscadorcct()