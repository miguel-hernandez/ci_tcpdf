$(document).ready(function () {
		obj_cfcentral = new Cortecentral();
		obj_notif = new Notification("div_central_notification");

		$("#div_btns_grid").hide();
		$("#slt_corte_region").attr("disabled",true);
		$("#slt_corte_municipio").attr("disabled",true);
		$("#slt_corte_zona").attr("disabled",true);
});

function get_gridpaginador(offset){
  _thisccentral.obj_grid_cfcentral.get_gridpaginador(offset, "Corte", "get_gridpaginador","form_cortecentral");
}// get_gridpaginador()

function f_check_estatus(idcentrocfg, estatus, campo){
	if(campo==7){
		campo_ = "inicio";
	}
	else if (campo == 8) {
		campo_ = "fin";
	}

	_thisccentral.idcentrocfg = idcentrocfg;
	_thisccentral.estatus = estatus;
	_thisccentral.campo = campo_;

	obj_notif.get_notification("dialog","¿Actualizar estatus "+campo_+" ?");

	document.getElementById('div_central_notification').addEventListener('confirmar',corte_central_confirmar_cambio_estatus,false);
	document.getElementById('div_central_notification').addEventListener('confirmarcancel',corte_central_cancelar_cambio_estatus,false);

}// f_check_estatus()

function corte_central_confirmar_cambio_estatus(){
	obj_cfcentral.update_estatus_iniciofin();
}

function corte_central_cancelar_cambio_estatus(){
	obj_cfcentral.get_grid();
}

$( "#slt_corte_nivel" ).change(function() {
		$("#div_btns_grid").hide();
    var idnivel = this.value;
		if(idnivel == 0){
				$("#slt_corte_region").val(0);
				$("#slt_corte_municipio").val(0);
				$("#slt_corte_zona").val(0);
				$("#slt_corte_region").attr("disabled",true);
				$("#slt_corte_municipio").attr("disabled",true);
				$("#slt_corte_zona").attr("disabled",true);
    }
		else{
			$("#slt_corte_region").attr("disabled",false);
			// $("#slt_corte_municipio").attr("disabled",false);
			$("#slt_corte_zona").attr("disabled",true);
	}
});

$( "#slt_corte_region" ).change(function() {
		$("#div_btns_grid").hide();
    var idregion = this.value;
    if (idregion == 0) {
				$("#slt_corte_municipio").val(0);
				$("#slt_corte_zona").val(0);
				$("#slt_corte_municipio").attr("disabled",true);
				$("#slt_corte_zona").attr("disabled",true);
    }else{
			$("#slt_corte_municipio").attr("disabled",false);
			obj_cfcentral.get_municipios_xregion(idregion);
		}
});

$( "#slt_corte_municipio" ).change(function() {
	$("#div_btns_grid").hide();
    var idmunicipio = this.value;
    if (idmunicipio == 0) {
			$("#slt_corte_zona").val(0);
			$("#slt_corte_zona").attr("disabled",true);
    }else{
			$("#slt_corte_zona").attr("disabled",false);
			obj_cfcentral.get_zonas_xmunicipio(idmunicipio);
		}
});

$("#btn_corte_buscarcct").click(function(e){
	$("#div_btns_grid").hide();
  e.preventDefault();
	$("#itxt_corte_cct").val("");
	$("#div_btns_grid").hide();
	obj_cfcentral.get_view_buscadorcct();
});

$("#btn_corte_limpiarcct").click(function(e){
  e.preventDefault();
	$("#itxt_corte_cct").val("");
	$("#div_btns_grid").hide();
});

$("#btn_corte_quitarfiltros").click(function(e){
  e.preventDefault();
	$('#form_cortecentral')[0].reset();
	$("#slt_corte_region").attr("disabled",true);
	$("#slt_corte_municipio").attr("disabled",true);
	$("#slt_corte_zona").attr("disabled",true);
	$("#div_btns_grid").hide();
});

$("#btn_cortecentral_busqueda").click(function(e){
  e.preventDefault();
	$("#grid_cortecentral").empty();
	obj_cfcentral.get_grid();
});


$("#btn_cortecentral_iradetalle").click(function(e){
	  e.preventDefault();
		var arr_row = _thisccentral.obj_grid_cfcentral.get_row_selected();
		console.log(arr_row.length);
		if(arr_row.length ==0 || arr_row[0]['idcentrocfg'] == undefined){
	    _thisccentral.notification.error("Seleccione un registro");
	    _thisccentral.obj_grid_cfcentral.init();
	  }else{
			obj_cfcentral.get_views_detalle(arr_row[0]['idcentrocfg']);
	  }
});

$("#btn_cortecentral_exportarexcel").click(function(e){
		e.preventDefault();
		obj_cfcentral.get_reporte_excel();
});


$("#btn_modal_corte_centraldetalles_cerrar").click(function(e){
		e.preventDefault();
		 $("#modal_corte_centraldetalles .modal-body").empty();
		$("#modal_corte_centraldetalles").modal("hide");
});

function Cortecentral(){
   _thisccentral = this;
	 _thisccentral.obj_grid_cfcentral = null;

	 _thisccentral.notification = new Notification("corte_central_notificaciones");

	 _thisccentral.obj_grid_cfcentral = new Grid("grid_cortecentral");

	 _thisccentral.idcentrocfg = 0;
	 _thisccentral.estatus = -1;
	 _thisccentral.campo = "";

 }

 Cortecentral.prototype.get_municipios_xregion = function (idregion){
	 $.ajax({
     url:base_url+"Corte/get_municipios_xregion",
     method:"POST",
     data:{"idregion":idregion},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
       $("#wait").modal("hide");
			 $("#slt_corte_municipio").empty();
			 $("#slt_corte_municipio").append(data.str_municipios);
     },
     error: function(error){
       console.log(error);
     }
   });
};

Cortecentral.prototype.get_zonas_xmunicipio = function (idmunicipio){
	$.ajax({
		url:base_url+"Corte/get_zonas_xmunicipio",
		method:"POST",
		data:{"idmunicipio":idmunicipio},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#slt_corte_zona").empty();
			$("#slt_corte_zona").append(data.str_zonas);
		},
		error: function(error){
			console.log(error);
		}
	});
};

Cortecentral.prototype.get_view_buscadorcct = function (){
	var idnivel = $("#slt_corte_nivel").val();
	var idregion = $("#slt_corte_region").val();
	var idmunicipio = $("#slt_corte_municipio").val();
	var idzona = $("#slt_corte_zona").val();
	$.ajax({
		url:base_url+"Buscadorcct/get_view_buscadorcct",
		method:"POST",
		data:{"idnivel":idnivel, "idregion":idregion, "idmunicipio":idmunicipio, "idzona":idzona},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#div_corte_buscadorcct").empty();
			$("#div_corte_buscadorcct").append(data.str_view);
			obj_bcct = null;
			obj_bcct = new Buscadorcct("div_corte_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
			obj_bcct.init();
			document.getElementById('div_corte_buscadorcct').addEventListener('cct_seleccionada',alimenta_campo_cct,false);

		},
		error: function(error){
			console.log(error);
		}
	});
};

Cortecentral.prototype.get_grid = function (){
		var offset = 0;
		_thisccentral.obj_grid_cfcentral = null;
		_thisccentral.obj_grid_cfcentral = new Grid("grid_cortecentral");
		_thisccentral.obj_grid_cfcentral.get_gridpaginador(offset, "Corte", "get_gridpaginador","form_cortecentral");
		$("#div_btns_grid").show();
};

Cortecentral.prototype.get_views_detalle = function (idcentrocfg){
		var idnivel = $("#slt_corte_nivel").val();
		$.ajax({
			url:base_url+"Corte/get_views_detalle",
			method:"POST",
			data:{"idcentrocfg":idcentrocfg,"idnivel":idnivel},
			beforeSend: function(xhr) {
				$("#wait").modal("show");
			},
			success:function(data){
				$("#wait").modal("hide");
				$("#modal_corte_centraldetalles .modal-body").empty();
				$("#modal_corte_centraldetalles .modal-body").append(data.str_view);

				$( "#modal_corte_centraldetalles #sectionCapturadatos :first-child" ).removeClass( "container" );
				$( "#modal_corte_centraldetalles #sectionCapturadatos :first-child" ).addClass( "container-fluid" );

				$("#modal_corte_centraldetalles section").removeClass("mainContent full-width clearfix");
				$("#modal_corte_centraldetalles").modal("show");
			},
			error: function(error){
				console.log(error);
			}
		});
};

Cortecentral.prototype.get_reporte_excel = function (){
	var idnivel = $("#slt_corte_nivel").val();
	var idregion = $("#slt_corte_region").val();
	var idmunicipio = $("#slt_corte_municipio").val();
	var idzona = $("#slt_corte_zona").val();
	var cct = $("#itxt_corte_cct").val();
	var corteinifin = $("#slc_corte_inifin").val();
	var estatus =  $("#slc_corte_estatus").val();

	var form = document.createElement("form");
  form.name = "form_corte_central_reporteexcel";
  form.id = "form_corte_central_reporteexcel";
  form.method = "POST";
  form.target = "_self";
  form.action =base_url+"Corte/get_reporte_excel";

  var element1 = document.createElement("input");
  element1.type="hidden";
  element1.name="idnivel";
  element1.value=idnivel;
  form.appendChild(element1);

	var element2 = document.createElement("input");
  element2.type="hidden";
  element2.name="idregion";
  element2.value=idregion;
  form.appendChild(element2);
	var element3 = document.createElement("input");
  element3.type="hidden";
  element3.name="idmunicipio";
  element3.value=idmunicipio;
  form.appendChild(element3);
	var element4 = document.createElement("input");
  element4.type="hidden";
  element4.name="idzona";
  element4.value=idzona;
  form.appendChild(element4);
	var element5 = document.createElement("input");
  element5.type="hidden";
  element5.name="cct";
  element5.value=cct;
  form.appendChild(element5);
	var element6 = document.createElement("input");
  element6.type="hidden";
  element6.name="corteinifin";
  element6.value=corteinifin;
  form.appendChild(element6);
  var element7 = document.createElement("input");
  element7.type="hidden";
  element7.name="estatus";
  element7.value=estatus;
  form.appendChild(element7);


  document.body.appendChild(form);
  form.submit();
};

Cortecentral.prototype.update_estatus_iniciofin = function (){
		var idcentrocfg = _thisccentral.idcentrocfg;
		var estatus =  _thisccentral.estatus;
		var campo = _thisccentral.campo;
		$.ajax({
			url:base_url+"Corte/update_estatus_iniciofin",
			method:"POST",
			data:{"idcentrocfg":idcentrocfg, "estatus": estatus, "campo":campo},
			beforeSend: function(xhr) {
				$("#wait").modal("show");
			},
			success:function(data){
				$("#wait").modal("hide");
				if(data.result){
					// obj_notif.get_notification("success", "Estatus actualizado con éxito")
					obj_cfcentral.get_grid();
				}
				else{
					obj_notif.get_notification("error", "Reintente por favor");
				}
			},
			error: function(error){
				console.log(error);
			}
		});

};

function alimenta_campo_cct(){
		var cct = obj_bcct.get_cct();
		$("#itxt_corte_cct").val("");
		$("#itxt_corte_cct").val(cct);
		obj_bcct = null;
}// alimenta_campo_cct()
