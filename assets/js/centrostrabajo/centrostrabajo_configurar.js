$(document).ready(function () {
		obj_configurar = new Centrostrabajo_configurar();
});

$("#btn_centrostrabajo_add_configuracion").click(function(e){
  e.preventDefault();
  obj_configurar.add_configuracion();
});

$("#btn_centrostrabajo_grabar_configuracion").click(function(e){
  e.preventDefault();
  obj_configurar.grabar_configuracion();
});

function eliminar_configuracion_xidcentrocfg(idcentrocfg){
	obj_configurar.eliminar_configuracion_xidcentrocfg(idcentrocfg);
}

function Centrostrabajo_configurar(){
	 this_cct_configurar = this;
 }


Centrostrabajo_configurar.prototype.add_configuracion = function() {
	var idct = $("#itxt_centrostrabajo_configurar_idct").val();
	var cct = $("#itxt_centrostrabajo_configurar_cct").val();
	var nombre = $("#itxt_centrostrabajo_configurar_nombre").val();

	var idnivel = $("#slt_centrostrabajo_configurar_nivel").val();
	var idturno = $("#slt_centrostrabajo_configurar_turno").val();


	  $.ajax({
	     url:base_url+"Centrostrabajo/add_configuracion",
	     method:"POST",
	     data:{
	     		"idct":idct,
	     		"cct":cct,
	     		"nombre":nombre,
	     		"idnivel":idnivel,
	     		"idturno":idturno
	 		  },
	     beforeSend: function(xhr) {
	       $("#wait").modal("show");
	     },
	     success:function(data){
	       	$("#wait").modal("hide");
	       	$("#div_centrostrabajo_configuracion_botones").hide();
	       	if(data.count_configuraciones_nuevas>0){
	      		$("#div_centrostrabajo_configuracion_botones").show();
	      	}

	       	if(data.result){
	       		$("#grid_centrostrabajo_central_configurar").empty();
	      		$("#grid_centrostrabajo_central_configurar").append(data.str_grid);
	       	}else{
	       		bootbox.alert({
			    	message: 'Ya existe la configuración que intenta agregar',
			    	size: 'small'
			});
	       	}

	     },
	     error: function(xhr){
	     	$("#wait").modal("hide");
					if (xhr.status === 0) {
	          alert('Not connect: Verify Network.');
	        } else if (xhr.status == 404) {
	          alert('Requested page not found [404]');
	        } else if (xhr.status == 500) {
	          alert('Internal Server Error [500].');
	        } else {
	          alert('Uncaught Error: ' + xhr.responseText);
	        }
					console.error(xhr);
	     }
	   });

};

Centrostrabajo_configurar.prototype.grabar_configuracion = function() {
	var idct = $("#itxt_centrostrabajo_configurar_idct").val();
	var cct = $("#itxt_centrostrabajo_configurar_cct").val();
	var nombre = $("#itxt_centrostrabajo_configurar_nombre").val();
	var f_alta = $("#itxt_centrostrabajo_configurar_f_alta").val();
	var zonact = $("#itxt_centrostrabajo_configurar_zonact").val();
	var region = $("#itxt_centrostrabajo_configurar_region").val();

	var nivel_oficial = $("#itxt_centrostrabajo_configurar_nivel_oficial").val();

	  $.ajax({
	     url:base_url+"Centrostrabajo/grabar_configuracion",
	     method:"POST",
	     data:{
	     		"idct":idct,
	     		"cct":cct,
	     		"nombre":nombre,
					"f_alta":f_alta,
					"zonact":zonact,
					"region":region,

					"nivel_oficial":nivel_oficial
	 		  },
	     beforeSend: function(xhr) {
	       $("#wait").modal("show");
	     },
	     success:function(data){
	       	$("#wait").modal("hide");

					if(data.status_transaccion){
						$("#div_centrotrabajo_configurar_generico").empty();
						$("#div_centrotrabajo_configurar_generico").append(data.str_detalles);
						$("#modal_centrostrabajo_configurar_detalles").modal("show");
					}else{
						bootbox.alert({
							message: 'Ocurrió un error, reintente por favor',
							size: 'small'
						});
					}

	     },
	     error: function(xhr){
				 $("#wait").modal("hide");
 					if (xhr.status === 0) {
 	          alert('Not connect: Verify Network.');
 	        } else if (xhr.status == 404) {
 	          alert('Requested page not found [404]');
 	        } else if (xhr.status == 500) {
 	          alert('Internal Server Error [500].');
 	        } else {
 	          alert('Uncaught Error: ' + xhr.responseText);
 	        }
 					console.error(xhr);
	     }
	   });
};

// Funciones para la opción de borrado -> Ventana de configuración base_url('Centrostrabajo/configurar/IDCT')
Centrostrabajo_configurar.prototype.eliminar_configuracion_xidcentrocfg = function(idcentrocfg) {
	 $.ajax({
	     url:base_url+"Centrostrabajo/get_count_grupos",
	     method:"POST",
	     data:{
	     		"idcentrocfg":idcentrocfg
	 		  },
	     beforeSend: function(xhr) {
	       $("#wait").modal("show");
	     },
	     success:function(data){
	       	$("#wait").modal("hide");
					if(data.numero_grupos>0){
						bootbox.alert({
							message: 'No es posible eliminar esta configuración porque tiene '+data.numero_grupos+' grupos',
							size: 'small'
						});
					}else{
						bootbox.confirm({
						    message: "<b>¿Eliminar la configuración?</b>",
						    buttons: {
						        confirm: {
						            label: 'Continuar',
						            className: 'btn_color_primary'
						        },
						        cancel: {
						            label: 'Cancelar',
						            className: 'btn_color_default'
						        }
						    },
						    callback: function (result) {
									if(result){
										obj_configurar.eliminar_configuracion_xidcentrocfg_confirm(idcentrocfg);
									}else{
										// return false;
									}
						    }
						});
					}// else
	     },
	     error: function(xhr){
				 $("#wait").modal("hide");
 					if (xhr.status === 0) {
 	          alert('Not connect: Verify Network.');
 	        } else if (xhr.status == 404) {
 	          alert('Requested page not found [404]');
 	        } else if (xhr.status == 500) {
 	          alert('Internal Server Error [500].');
 	        } else {
 	          alert('Uncaught Error: ' + xhr.responseText);
 	        }
 					console.error(xhr);
	     }
	   });
};

Centrostrabajo_configurar.prototype.eliminar_configuracion_xidcentrocfg_confirm = function(idcentrocfg) {
	var idct = $("#itxt_centrostrabajo_configurar_idct").val();

	var form = document.createElement("form");
	form.name = "form_configuracion_delete";
	form.id = "form_configuracion_delete";
	form.method = "POST";
	form.target = "_self";
	form.action = base_url+"Centrostrabajo/eliminar_configuracion";

	var element1 = document.createElement("input");
	element1.name="idcentrocfg";
	element1.type="hidden";
	element1.value=idcentrocfg;
	form.appendChild(element1);

	var element2 = document.createElement("input");
	element2.name="idct";
	element2.type="hidden";
	element2.value=idct;
	form.appendChild(element2);

	document.body.appendChild(form);
	form.submit();
};
