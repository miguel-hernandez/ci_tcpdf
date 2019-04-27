
$(document).ready(function () {
		obj_cctcentral = new Busqueda_central();

		$("#slt_centrostrabajo_zona").attr("disabled",true);
		$("#slt_centrostrabajo_region").attr("disabled",true);
		$("#slt_centrostrabajo_municipio").attr("disabled",true);
		$("#slt_centrostrabajo_zona").attr("disabled",true);


		// $("#slt_centrostrabajo_nivel").val(1);
		// $("#slt_centrostrabajo_region").attr("disabled",false);
		// obj_cctcentral.get_grid(0);

	  _thisccentral.obj_grid_cctcentral = new Grid("grid_alertas_central");


});


$("#slt_centrostrabajo_nivel").change(function() {
    $("#itxt_centrostrabajo_cct").val("");
    var idnivel = this.value.trim();
		if(idnivel.length > 1){
				$("#slt_centrostrabajo_region").val(0);
				$("#slt_centrostrabajo_municipio").val(0);
				$("#slt_centrostrabajo_zona").val(0);
				$("#slt_centrostrabajo_region").attr("disabled",true);
				$("#slt_centrostrabajo_municipio").attr("disabled",true);
				$("#slt_centrostrabajo_zona").attr("disabled",true);

				// Nuevos campos
				$("#slt_centrostrabajo_tipocentro").val(0);
				$("#check_centrostrabajo_sinconfig").prop('checked',false);
    }
		else{
			$("#slt_centrostrabajo_region").attr("disabled",false);
			if($("#slt_centrostrabajo_region").val() == "0"){
				$("#slt_centrostrabajo_municipio").attr("disabled",true);
			}
			if($("#slt_centrostrabajo_municipio").val() == "0"){
				$("#slt_centrostrabajo_zona").attr("disabled",true);
			}

	}
});


$("#slt_centrostrabajo_region").change(function() {

    $("#itxt_centrostrabajo_cct").val("");
    var idregion = this.value;
    if (idregion == 0) {
				$("#slt_centrostrabajo_municipio").val(0);
				$("#slt_centrostrabajo_zona").val(0);
			  $("#slt_centrostrabajo_municipio").attr("disabled",true);
			  $("#slt_centrostrabajo_zona").attr("disabled",true);
    }else{
			$("#slt_centrostrabajo_municipio").attr("disabled",false);
			obj_cctcentral.get_municipios_xregion(idregion);
		}
});

$( "#slt_centrostrabajo_municipio").change(function() {

  $("#itxt_centrostrabajo_cct").val("");
    var idmunicipio = this.value;
    if (idmunicipio == 0) {
			$("#slt_centrostrabajo_zona").val(0);
			$("#slt_centrostrabajo_zona").attr("disabled",true);
    }else{
			$("#slt_centrostrabajo_zona").attr("disabled",false);
			obj_cctcentral.get_zonas_xmunicipio(idmunicipio);
		}
});

$("#btn_centrostrabajo_quitarfiltros").click(function(e){
  e.preventDefault();
	$('#form_cctcentral')[0].reset();
  $("#slt_centrostrabajo_region").attr("disabled",true);
	$("#slt_centrostrabajo_municipio").attr("disabled",true);
	$("#slt_centrostrabajo_zona").attr("disabled",true);

});

$("#btn_centrostrabajo_busqueda").click(function(e){
  e.preventDefault();
	var idnivel = $("#slt_centrostrabajo_nivel").val();
	var idnivel_trim = idnivel.trim();
	var idregion = $("#slt_centrostrabajo_region").val();
	var cct = $("#itxt_centrostrabajo_cct").val();

	var cct_trim = cct.trim();
	if(cct_trim.length > 1){
		$("#grid_alertas_central").empty();
		_thisccentral.obj_grid_cctcentral = new Grid("grid_alertas_central");
		obj_cctcentral.get_grid(0);
	}else{
		var check_estatus = $("#check_centrostrabajo_sinconfig").is(":checked");
		if(idnivel_trim.length > 1){
			bootbox.alert({
				 message: "<b>Seleccione un nivel</b>", size: 'small'
		 });
		}else{
			$("#grid_alertas_central").empty();
			_thisccentral.obj_grid_cctcentral = new Grid("grid_alertas_central");
			obj_cctcentral.get_grid(0);
		}
	}

});

$("#btn_centrostrabajo_buscarcct").click(function(e){
  	e.preventDefault();
		$("#itxt_centrostrabajo_cct").val("");
  	obj_cctcentral.get_view_buscadorcct();
});

$("#btn_centrostrabajo_limpiarcct").click(function(e){
  e.preventDefault();
	$("#itxt_centrostrabajo_cct").val("");
});

function Busqueda_central(){
   _thisccentral = this;
	 _thisccentral.obj_grid_cctcentral = null;
	 _thisccentral.obj_grid_cctcentral = new Grid("grid_alertas_central");
 }

Busqueda_central.prototype.get_municipios_xregion = function (idregion){
 $.ajax({
		url:base_url+"Alertas/get_municipios_xregion",
		method:"POST",
		data:{"idregion":idregion},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
		 $("#slt_centrostrabajo_municipio").empty();
		 $("#slt_centrostrabajo_municipio").append(data.str_municipios);
		},
		error: function(error){
			console.log(error);
		}
	});
};

Busqueda_central.prototype.get_zonas_xmunicipio = function (idmunicipio){
	$.ajax({
		url:base_url+"Centrostrabajo/get_zonas_xmunicipio",
		method:"POST",
		data:{"idmunicipio":idmunicipio},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#slt_centrostrabajo_zona").empty();
			$("#slt_centrostrabajo_zona").append(data.str_zonas);
		},
		error: function(error){
			console.log(error);
		}
	});
};


Busqueda_central.prototype.get_grid = function (offset){
		// _thisccentral.obj_grid_cctcentral.get_gridpaginador(offset, "Centrostrabajo", "get_ccts_central","form_cctcentral");
		// form_cctcentral
		   // $('#form_cctcentral').prop("disabled", false); // Element(s) are now enabled.
// $( "#form_cctcentral select" ).prop( "disabled", false );
		obj_grid_alertas_escolar.get_gridpaginador(offset, "Solicitudes_nuevo", "get_gridpaginador2","form_cctcentral");
};

Busqueda_central.prototype.get_view_buscadorcct = function (){
	$.ajax({
		url:base_url+"Buscadorcct/get_view_buscadorcct",
		method:"POST",
		data:{
        "idnivel" : $("#slt_centrostrabajo_nivel").val(),
        "idregion" : $("#slt_centrostrabajo_region").val(),
        "idmunicipio" : $("#slt_centrostrabajo_municipio").val(),
        "idzona" : $("#slt_centrostrabajo_zona").val()
      },
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#div_centrostrabajo_buscadorcct").empty();
			$("#div_centrostrabajo_buscadorcct").append(data.str_view);
			obj_bcct = null;
			obj_bcct = new Buscadorcct("div_centrostrabajo_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
			obj_bcct.init();
			document.getElementById('div_centrostrabajo_buscadorcct').addEventListener('cct_seleccionada',alimenta_campo_cct,false);
      document.getElementById('div_centrostrabajo_buscadorcct').addEventListener('event_salir_buscador',destruye_buscadorcct,false);
		},
		error: function(error){
			console.log(error);
		}
	});
};

function get_gridpaginador(offset){
	if($("#modal_buscadorcct").is(":visible")){
		this_bcct.obj_grid_buscador.get_gridpaginador(offset, "Buscadorcct", "get_grid","form_cctcentral");
	}else{
		obj_cctcentral.get_grid(offset);
	}
}// get_gridpaginador()

function alimenta_campo_cct(){
  	obj_cctcentral = new Busqueda_central();
		var cct = obj_bcct.get_cct();
		let idnivel = obj_bcct.get_idnivel();
		$("#itxt_centrostrabajo_cct").val("");
		$("#itxt_centrostrabajo_cct").val(cct);
		$("#slt_centrostrabajo_nivel").val(idnivel);


		obj_bcct = null;
}// alimenta_campo_cct()

function destruye_buscadorcct(){
  obj_bcct = null;
  _thisccentral.obj_grid_cctcentral = null;
  _thisccentral.obj_grid_cctcentral = new Grid("grid_alertas_central");
}// destruye_buscadorcct()
