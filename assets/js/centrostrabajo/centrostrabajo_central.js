function activa_desactiva_yoremia(idct, estatus, indice_columna){
	obj_cctcentral.update_estatus(idct, estatus, indice_columna)
}
function activa_desactiva_movil(idct, estatus, indice_columna){
	obj_cctcentral.update_estatus(idct, estatus, indice_columna)
}
function get_datos_clave_xidcentrocfg(idcentrocfg){
	obj_cctcentral.get_datos_clave_xidcentrocfg(idcentrocfg)
}

function update_clave_xidusuario(){
	obj_cctcentral.update_clave_xidusuario()
}

function configurar_xidct(idct){
	obj_cctcentral.configurar_xidct(idct)
}

$(document).ready(function () {
		obj_cctcentral = new Centrostrabajo_central();

		$("#slt_centrostrabajo_zona").attr("disabled",true);
		$("#slt_centrostrabajo_region").attr("disabled",true);
		$("#slt_centrostrabajo_municipio").attr("disabled",true);
		$("#slt_centrostrabajo_zona").attr("disabled",true);

		$("#grid_centrostrabajo_central").empty();
	  _thisccentral.obj_grid_cctcentral = new Grid("grid_centrostrabajo_central");
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
		$("#grid_centrostrabajo_central").empty();
		_thisccentral.obj_grid_cctcentral = new Grid("grid_centrostrabajo_central");
		obj_cctcentral.get_grid(0);
	}else{
		var check_estatus = $("#check_centrostrabajo_sinconfig").is(":checked");
		if(idnivel_trim.length > 1){
			bootbox.alert({
				 message: "<b>Seleccione un nivel</b>", size: 'small'
		 });
		}else{
			$("#grid_centrostrabajo_central").empty();
			_thisccentral.obj_grid_cctcentral = new Grid("grid_centrostrabajo_central");
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


function Centrostrabajo_central(){
   _thisccentral = this;
	 _thisccentral.obj_grid_cctcentral = null;
	 _thisccentral.obj_grid_cctcentral = new Grid("grid_centrostrabajo_central");
   _thisccentral.obj_notifications = new Notifications("div_notifications_asigcentral");

 }

 Centrostrabajo_central.prototype.get_municipios_xregion = function (idregion){
  $.ajax({
     url:base_url+"Centrostrabajo/get_municipios_xregion",
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

Centrostrabajo_central.prototype.get_zonas_xmunicipio = function (idmunicipio){
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


Centrostrabajo_central.prototype.get_grid = function (offset){
		_thisccentral.obj_grid_cctcentral.get_gridpaginador(offset, "Centrostrabajo", "get_ccts_central","form_cctcentral");
};

Centrostrabajo_central.prototype.get_view_buscadorcct = function (){
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
		this_bcct.obj_grid_buscador.get_gridpaginador(offset, "Buscadorcct", "get_grid","form_buscadorcct");
	}else{
		obj_cctcentral.get_grid(offset);
	}
}// get_gridpaginador()

function alimenta_campo_cct(){
  	obj_cctcentral = new Centrostrabajo_central();
		var cct = obj_bcct.get_cct();
		$("#itxt_centrostrabajo_cct").val("");
		$("#itxt_centrostrabajo_cct").val(cct);
		obj_bcct = null;
}// alimenta_campo_cct()

function destruye_buscadorcct(){
  obj_bcct = null;
  _thisccentral.obj_grid_cctcentral = null;
  _thisccentral.obj_grid_cctcentral = new Grid("grid_centrostrabajo_central");
  _thisccentral.obj_notifications = new Notifications("div_notifications_asigcentral");
}// destruye_buscadorcct()


// Funciones habilitar/deshabilitar acceso YOLIXTLI y móvil
// Funciones habilitar/deshabilitar acceso YOLIXTLI y móvil
Centrostrabajo_central.prototype.update_estatus = function(idcentrocfg, estatus, indice_columna){
	var tipo_app = (indice_columna==9)?" Yolixtli ":" Móvil ";
	var accion_app = (estatus == 1 || estatus==true || estatus=='1')?"Deshabilitar":"Habilitar";
	var texto = "<b>¿"+accion_app+" el acceso a la aplicación "+tipo_app+" para el usuario seleccionado?</b>";
	bootbox.confirm({
		message: texto,
		buttons: {
				confirm: {
						label: 'Aceptar',
						className: 'btn-primary'
				},
				cancel: {
						label: 'Cancelar',
						className: 'btn-default'
				}
		},
		callback: function (result) {
				if (result) {
					obj_cctcentral.update_estatus_app(idcentrocfg, estatus, indice_columna);
				} else {
					obj_cctcentral.retorna_estatus_checkbox(idcentrocfg, estatus, indice_columna);
				}

		}
});
};

Centrostrabajo_central.prototype.retorna_estatus_checkbox = function(idcentrocfg, estatus, indice_columna) {
	var estatus_retorno = (estatus==1 || estatus==true || estatus=='1')?true:false;
	$("#grid_centrostrabajo_central .table-responsive .table tbody tr").each(function() {

		$(this).children("td").each(function() {
			if($(this).prop('id') == 'idcentrocfg'){
				var idct_table = $(this).text();
				if(idct_table == idcentrocfg){
					var hermanos = $(this).siblings('td');
					if(indice_columna == 9){ // yolixtli
							var td_yolixtli = $(hermanos[8]); // Uno menos
							var checkbox = $(td_yolixtli).children('input');
							$(checkbox).prop('checked', estatus_retorno);
					}
					if(indice_columna == 10){ // yolixtli
							var td_movil = $(hermanos[9]); // Uno menos
							var checkbox = $(td_movil).children('input');
							$(checkbox).prop('checked', estatus_retorno);
					}
				}
			}
		});
	});
};

Centrostrabajo_central.prototype.update_estatus_app = function(idcentrocfg, estatus, indice_columna) {
	// var estatus_nuevo = (estatus == 1 || estatus==true || estatus=='1')?0:1;
	var accion_app = (estatus == 1 || estatus==true || estatus=='1')?"deshabilitado":"habilitado";
	$.ajax({
     url:base_url+"Centrostrabajo/update_estatus_app",
     method:"POST",
     data:{"idcentrocfg":idcentrocfg, "estatus":estatus, "indice_columna":indice_columna},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
			 $("#wait").modal("hide");
			 var estatus_nuevo = ( (data.estatus_nuevo == 1) || (data.estatus_nuevo == '1') )?'habilitado':'deshabilitado';
			 var mensaje = (data.result)?"Acceso "+estatus_nuevo+" correctamente":"Ocurrió un error, re intente por favor"
			 bootbox.alert({
			    message: mensaje,
			    size: 'small'
			});
			obj_cctcentral.bloquea_desbloqueda_check_movil(idcentrocfg);
     },
     error: function(error){
			 $("#wait").modal("hide");
       console.error(error);
     }
   });
};

// Funciones cambiar clave
// Funciones cambiar clave
Centrostrabajo_central.prototype.get_datos_clave_xidcentrocfg = function(idcentrocfg) {
	$.ajax({
     url:base_url+"Centrostrabajo/get_datos_clave_xidcentrocfg",
     method:"POST",
     data:{"idcentrocfg":idcentrocfg},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
			 $("#wait").modal("hide");
			 $("#div_centrostrabajo_cambiar_clave").empty();
			 $("#div_centrostrabajo_cambiar_clave").append(data.str_view);
			 $("#modal_cambiar_clave").modal("show");
     },
     error: function(error){
			 $("#wait").modal("hide");
       console.error(error);
     }
   });
};

Centrostrabajo_central.prototype.update_clave_xidusuario = function() {
	var datos = $("#modal_cambiar_clave_form").serialize();
	$.ajax({
     url:base_url+"Centrostrabajo/update_clave_xidusuario",
     method:"POST",
     data: datos,
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
			 $("#wait").modal("hide");
			  var mensaje = (data.result)?"Contraseña actualizada correctamente":"Ocurrió un error, reintente por favor";

			  bootbox.alert({ message: mensaje, size: 'small' });

				if(data.result){
					$("#modal_cambiar_clave").modal("hide");
				}

     },
     error: function(error){
			 $("#wait").modal("hide");
       console.error(error);
     }
   });
};

Centrostrabajo_central.prototype.bloquea_desbloqueda_check_movil = function(idcentrocfg) {
	$("#grid_centrostrabajo_central .table-responsive .table tbody tr").each(function() {

		$(this).children("td").each(function() {
			if($(this).prop('id') == 'idcentrocfg'){
				var idct_table = $(this).text();
				if(idct_table == idcentrocfg){
					var hermanos = $(this).siblings('td');
							var yolixtli_td = $(hermanos[8]); // Uno menos
							var yolixtli_checkbox = $(yolixtli_td).children('input');
							var yolixtli_estatus = $(yolixtli_checkbox).prop('checked');

							var prop_disabled = (yolixtli_estatus)?false:true;
							var movil_td = $(hermanos[9]); // Uno menos
							var movil_checkbox = $(movil_td).children('input');
							$(movil_checkbox).prop("disabled", prop_disabled);
				}
			}
		});
	});
};

Centrostrabajo_central.prototype.configurar_xidct = function(idct) {
		var form = document.createElement("form");
	  form.name = "form_centrostrabajo_configurar";
	  form.id = "form_centrostrabajo_configurar";
	  form.method = "POST";
	  form.target = "_self";
	  form.action = base_url+"index.php/Centrostrabajo/configurar/"+idct;
	  document.body.appendChild(form);
	  form.submit();
};
