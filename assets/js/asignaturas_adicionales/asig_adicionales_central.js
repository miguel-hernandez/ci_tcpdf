function get_gridpaginador(offset){
  obj_cfcentral.get_grid(offset);
}

$(document).ready(function () {
		obj_cfcentral = new Cortecentral();
		$("#slt_asignaturasadicionales_region").attr("disabled",true);
		$("#slt_asignaturasadicionales_municipio").attr("disabled",true);
		$("#slt_asignaturasadicionales_zona").attr("disabled",true);
		$("#div_btns_grid").hide();
});

$( "#slt_asignaturasadicionales_nivel" ).change(function() {
		$("#div_btns_grid").hide();
    $("#itxt_asignaturasadicionales_cct").val("");
    var idnivel = this.value;
		if(idnivel == 0){
				$("#slt_asignaturasadicionales_region").val(0);
				$("#slt_asignaturasadicionales_municipio").val(0);
				$("#slt_asignaturasadicionales_zona").val(0);
				$("#slt_asignaturasadicionales_region").attr("disabled",true);
				$("#slt_asignaturasadicionales_municipio").attr("disabled",true);
				$("#slt_asignaturasadicionales_zona").attr("disabled",true);
    }
		else{
			$("#slt_asignaturasadicionales_region").attr("disabled",false);
      $("#slt_asignaturasadicionales_municipio").attr("disabled",true);
			$("#slt_asignaturasadicionales_zona").attr("disabled",true);
	}
});

$("#slt_asignaturasadicionales_region").change(function() {
		$("#div_btns_grid").hide();
    $("#itxt_asignaturasadicionales_cct").val("");
    var idregion = this.value;
    if (idregion == 0) {
				$("#slt_asignaturasadicionales_municipio").val(0);
				$("#slt_asignaturasadicionales_zona").val(0);
			  $("#slt_asignaturasadicionales_municipio").attr("disabled",true);
			  $("#slt_asignaturasadicionales_zona").attr("disabled",true);
    }else{
			$("#slt_asignaturasadicionales_municipio").attr("disabled",false);
			obj_cfcentral.get_municipios_xregion(idregion);
		}
});

$( "#slt_asignaturasadicionales_municipio").change(function() {
	$("#div_btns_grid").hide();
  $("#itxt_asignaturasadicionales_cct").val("");
    var idmunicipio = this.value;
    if (idmunicipio == 0) {
			$("#slt_asignaturasadicionales_zona").val(0);
			$("#slt_asignaturasadicionales_zona").attr("disabled",true);
    }else{
			$("#slt_asignaturasadicionales_zona").attr("disabled",false);
			obj_cfcentral.get_zonas_xmunicipio(idmunicipio);
		}
});

$("#btn_asignaturasadicionales_quitarfiltros").click(function(e){
  e.preventDefault();
	$('#form_cortecentral')[0].reset();
  $("#slt_asignaturasadicionales_region").attr("disabled",true);
	$("#slt_asignaturasadicionales_municipio").attr("disabled",true);
	$("#slt_asignaturasadicionales_zona").attr("disabled",true);
	$("#div_btns_grid").hide();
});

$("#btn_asignaturasadicionales_busqueda").click(function(e){
  e.preventDefault();
  $("#grid_asignaturasadicionales_central").empty();
	obj_cfcentral.get_grid(0);
});

$("#btn_asignaturasadicionales_editar").click(function(e){
  e.preventDefault();
  e.preventDefault();
  var arr_row = _thisccentral.obj_grid_cfcentral.get_row_selected();
  if(arr_row.length==0 || arr_row[0]['idsolicitud_asignatura'] == undefined){
    _thisccentral.obj_notifications.get_notification("error","Seleccione un registro");
    _thisccentral.obj_grid_cfcentral.init();
  }else{
    obj_cfcentral.atencion_solicitud(arr_row[0]['nivel'],arr_row[0]['idsolicitud_asignatura'],arr_row[0]['idusuario']);
  }
});

$("#btn_asignaturasadicionales_buscarcct").click(function(e){
  e.preventDefault();
	$("#div_btns_grid").hide();
	$("#itxt_asignaturasadicionales_cct").val("");
	obj_cfcentral.get_view_buscadorcct();
});
$("#btn_asignaturasadicionales_limpiarcct").click(function(e){
  e.preventDefault();
	$("#itxt_asignaturasadicionales_cct").val("");
	$("#div_btns_grid").hide();
});


function Cortecentral(){
   _thisccentral = this;
	 _thisccentral.obj_grid_cfcentral = null;
	 _thisccentral.obj_grid_cfcentral = new Grid("grid_asignaturasadicionales_central");
   _thisccentral.obj_notifications = new Notifications("div_notifications_asigcentral");

 }

 Cortecentral.prototype.get_municipios_xregion = function (idregion){
  $.ajax({
     url:base_url+"asignaturasadicionales/get_municipios_xregion",
     method:"POST",
     data:{"idregion":idregion},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
       $("#wait").modal("hide");
      $("#slt_asignaturasadicionales_municipio").empty();
      $("#slt_asignaturasadicionales_municipio").append(data.str_municipios);
     },
     error: function(error){
       console.log(error);
     }
   });
};

Cortecentral.prototype.get_zonas_xmunicipio = function (idmunicipio){
	$.ajax({
		url:base_url+"asignaturasadicionales/get_zonas_xmunicipio",
		method:"POST",
		data:{"idmunicipio":idmunicipio},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#slt_asignaturasadicionales_zona").empty();
			$("#slt_asignaturasadicionales_zona").append(data.str_zonas);
		},
		error: function(error){
			console.log(error);
		}
	});
};

Cortecentral.prototype.atencion_solicitud = function (idnivel,idsolicitud_asignatura,idusuario){
  var form = document.createElement("form");
  form.name = "form_asig_adicionales_atender";
  form.id = "form_asig_adicionales_atender";
  form.method = "POST";
  form.target = "_self";
  form.action = base_url+"index.php/asignaturasadicionales/atencion_solicitud/"+idnivel+"/"+idsolicitud_asignatura+"/"+idusuario;
  document.body.appendChild(form);
  form.submit();
  // atencion_solicitud/1/22/1
};

Cortecentral.prototype.get_grid = function (offset){
		_thisccentral.obj_grid_cfcentral.get_gridpaginador(offset, "asignaturasadicionales", "get_listado_solicitudes_central","form_cortecentral");
		$("#div_btns_grid").show();
};

Cortecentral.prototype.get_view_buscadorcct = function (){
	var idnivel = $("#slt_asignaturasadicionales_nivel").val();
	var idregion = $("#slt_asignaturasadicionales_region").val();
	var idmunicipio = $("#slt_asignaturasadicionales_municipio").val();
	var idzona = $("#slt_asignaturasadicionales_zona").val();
	$.ajax({
		url:base_url+"Buscadorcct/get_view_buscadorcct",
		method:"POST",
		data:{"idnivel":idnivel, "idregion":idregion, "idmunicipio":idmunicipio, "idzona":idzona},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#div_asignaturasadicionales_buscadorcct").empty();
			$("#div_asignaturasadicionales_buscadorcct").append(data.str_view);
			obj_bcct = null;
			obj_bcct = new Buscadorcct("div_asignaturasadicionales_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
			obj_bcct.init();
			document.getElementById('div_asignaturasadicionales_buscadorcct').addEventListener('cct_seleccionada',alimenta_campo_cct,false);
      document.getElementById('div_asignaturasadicionales_buscadorcct').addEventListener('event_salir_buscador',destruye_buscadorcct,false);
		},
		error: function(error){
			console.log(error);
		}
	});
};

function destruye_buscadorcct(){
  obj_bcct = null;
  _thisccentral.obj_grid_cfcentral = null;
  _thisccentral.obj_grid_cfcentral = new Grid("grid_asignaturasadicionales_central");
  _thisccentral.obj_notifications = new Notifications("div_notifications_asigcentral");
}// destruye_buscadorcct()
function alimenta_campo_cct(){
  obj_cfcentral = new Cortecentral();
		var cct = obj_bcct.get_cct();
		$("#itxt_asignaturasadicionales_cct").val("");
		$("#itxt_asignaturasadicionales_cct").val(cct);
		obj_bcct = null;
}// alimenta_campo_cct()
