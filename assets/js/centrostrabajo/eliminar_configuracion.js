$(document).ready(function () {
		obj_configurar = new Centrostrabajo_eliminar_configuracion();
});


function eliminar_configuracion_xidcentrocfg(idcentrocfg){
	obj_configurar.eliminar_xidcentrocfg(idcentrocfg);
}

function Centrostrabajo_eliminar_configuracion(){
	 _that = this;
 }

Centrostrabajo_eliminar_configuracion.prototype.eliminar_xidcentrocfg = function(idcentrocfg) {
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
										obj_configurar.eliminar_xidcentrocfg_confirm(idcentrocfg, data.idct);
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

Centrostrabajo_eliminar_configuracion.prototype.eliminar_xidcentrocfg_confirm = function(idcentrocfg, idct) {
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
