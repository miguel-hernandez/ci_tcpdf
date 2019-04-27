$(document).ready(function () {
	  obj_grid = new Grid("div_preinscripciones_grid");
});

$("#btn_preinscripciones_asignar").click(function(e){
  e.preventDefault();
  e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

  bootbox.confirm({
    message: "<b>¿Asignar los solicitantes seleccionados?</b>",
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
          Preinscripciones_escolar.asignar_solicitantes();
        } else {
					// Nada...
        }

    }
});
});


$("#btn_preinscripciones_desasignar").click(function(e){
  e.preventDefault();
  e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

  bootbox.confirm({
    message: "<b>¿Desasignar los solicitantes seleccionados?</b>",
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
          Preinscripciones_escolar.desasignar_solicitantes();
        } else {
					// Nada...
        }

    }
});
});


function update_necesidad_especial(elemento){
  Preinscripciones_escolar.update_necesidad_especial(elemento);
}// update_necesidad_especial()

function update_vive_cerca(elemento){
  Preinscripciones_escolar.update_vive_cerca(elemento);
}// update_vive_cerca()

function update_tiene_hermano(elemento){
  Preinscripciones_escolar.update_tiene_hermano(elemento);
}// update_tiene_hermano()

function ver_detalles(elemento){
  var idsolicitud = $(elemento).data('idsolicitud');
	Preinscripciones_escolar.get_view_detalles_solicitud(idsolicitud);
  // alert("Pendiente idsolicitud: "+idsolicitud);
}

function get_gridpaginador(offset){
  // console.info("offset: "+offset);
  $("#itxt_preinscripciones_offset").val(offset);
  obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador","form_preinscripciones_consultar");
}

var Preinscripciones_escolar = {

  update_necesidad_especial : function(elemento){

    var idsolicitud = $(elemento).data('idsolicitud');
    var estatus = $(elemento).is(':checked');
    estatus = (estatus)?1:0;

    // alert("idsolicitud: "+idsolicitud+ " ||| estatus: "+estatus); return false;

    $.ajax({
      url:base_url+"Inscripciones/update_necesidad_especial",
      method:"POST",
      data:{
        'idsolicitud' : idsolicitud,
        'estatus' : estatus
      },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        var mensaje = (data.result)?"Operación terminada con éxito":"Ocurrió un error, reintente por favor";
        bootbox.alert({
          message: "<br><b>"+mensaje+"</b>",
          size: 'small',
          callback: function () {}
        });
      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });

  },

  update_vive_cerca : function(elemento){

    var idsolicitud = $(elemento).data('idsolicitud');
    var estatus = $(elemento).is(':checked');
    estatus = (estatus)?1:0;

    // alert("idsolicitud: "+idsolicitud+ " ||| estatus: "+estatus); return false;

    $.ajax({
      url:base_url+"Inscripciones/update_vive_cerca",
      method:"POST",
      data:{
        'idsolicitud' : idsolicitud,
        'estatus' : estatus
      },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        var mensaje = (data.result)?"Operación terminada con éxito":"Ocurrió un error, reintente por favor";
        bootbox.alert({
          message: "<br><b>"+mensaje+"</b>",
          size: 'small',
          callback: function () {}
        });
      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });

  },

  update_tiene_hermano : function(elemento){

    var idsolicitud = $(elemento).data('idsolicitud');
    var estatus = $(elemento).is(':checked');
    estatus = (estatus)?1:0;

    // alert("idsolicitud: "+idsolicitud+ " ||| estatus: "+estatus); return false;

    $.ajax({
      url:base_url+"Inscripciones/update_tiene_hermano",
      method:"POST",
      data:{
        'idsolicitud' : idsolicitud,
        'estatus' : estatus
      },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        var mensaje = (data.result)?"Operación terminada con éxito":"Ocurrió un error, reintente por favor";
        bootbox.alert({
          message: "<br><b>"+mensaje+"</b>",
          size: 'small',
          callback: function () {}
        });
      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });

  },

  asignar_solicitantes : function(){
    // alert("Preinscripciones_escolar.asignar_solicitantes");
    var obj_seleccionados = {'solicitantes':[]};

		var quiero_asignar = 0;
    $(".tabla_solicitantes_escolar tbody tr").each(function() {
      $(this).children("td").each(function (indice){
        if(indice == 0){
          var checkbox = $(this).children('input');

					if($(checkbox).length > 0){ // SOLO SI EXISTE EL TAG HAGO push A MI OBJETO
						//

						// SI NO ES MIO LO CONSIDERO
						var asignado_a_mi = $(checkbox).data('asignado_a_mi');
						/* console.info("asignado_a_mi: "+asignado_a_mi); */

						var idsolicitud = $(checkbox).data('idsolicitud');
						var opcion = $(checkbox).data('opcion');
						var is_checked = ($(checkbox).is(':checked'))?1:0;

						var grado = $(checkbox).data('grado');

						if( (asignado_a_mi == 0 || asignado_a_mi == '0') &&  (is_checked == 1) ){
							quiero_asignar++;
							var  nuevo = {};
							nuevo.idsolicitud = idsolicitud;
							nuevo.is_checked = is_checked;
							nuevo.opcion = opcion;
							nuevo.grado = grado;
							obj_seleccionados.solicitantes.push(nuevo);
						}

						//
					}else{
						// nada...
					}
        }// indice == 0
      });
    });

		if(obj_seleccionados.solicitantes.length > 0){
			Preinscripciones_escolar.asignar_solicitantes_ok(obj_seleccionados, quiero_asignar);
		}else{
			bootbox.alert({
				message: "<br><b>Es necesario que seleccione mínimo un solicitante</b>",
				size: 'small',
				callback: function () {
					var offset = $("#itxt_preinscripciones_offset").val();
					obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador","form_preinscripciones_consultar");
					// return false;
				}
			});
		}// else
  },


	validar_cupo_pree : function(obj_seleccionados, quiero_asignar){
		var capacidad_grado1 = $("#itxt_preinscripciones_capacidad_grado1_disponible").val();
		var capacidad_grado2 = $("#itxt_preinscripciones_capacidad_grado2_disponible").val();
		var capacidad_grado3 = $("#itxt_preinscripciones_capacidad_grado3_disponible").val();

		var numero_grado1 = 0;
		var numero_grado2 = 0;
		var numero_grado3 = 0;
		var array_solicitantes = obj_seleccionados.solicitantes;

		flag_error = false;

		for (var i = 0; i < array_solicitantes.length; i++) {
			// console.info(array_solicitantes[i].grado);
			if(array_solicitantes[i].grado == 1){
				numero_grado1++;
			}else if (array_solicitantes[i].grado == 2) {
				numero_grado2++;
			}else if (array_solicitantes[i].grado == 3) {
				numero_grado3++;
			}
		}

		var mensaje = '';
		if(numero_grado1 > capacidad_grado1){
			flag_error = true;
			mensaje += '<br> Error de asignación para primer grado, cupo(s) disponible(s): '+capacidad_grado1;
		}
		if(numero_grado2 > capacidad_grado2){
			flag_error = true;
			mensaje += '<br> Error de asignación para segundo grado, cupo(s) disponible(s): '+capacidad_grado2;
		}
		if(numero_grado3 > capacidad_grado3){
			flag_error = true;
			mensaje += '<br> Error de asignación para tercer grado, cupo(s) disponible(s): '+capacidad_grado3;
		}

		var array = [];
		array.flag_error = flag_error;
		array.mensaje = mensaje;
		return array;
  },

	validar_cupo_prim_sec : function(obj_seleccionados, quiero_asignar){
		var capacidad_grado1 = $("#itxt_preinscripciones_capacidad_grado1_disponible").val();

		var numero_grado1 = 0;

		var array_solicitantes = obj_seleccionados.solicitantes;

		flag_error = false;

		for (var i = 0; i < array_solicitantes.length; i++) {
			if(array_solicitantes[i].grado == 1){
				numero_grado1++;
			}
		}

		var mensaje = '';
		if(numero_grado1 > capacidad_grado1){
			flag_error = true;
			mensaje += '<br> Error de asignación, cupo(s) disponible(s): '+capacidad_grado1;
		}

		var array = [];
		array.flag_error = flag_error;
		array.mensaje = mensaje;
		return array;
  },

	asignar_solicitantes_ok : function(obj_seleccionados, quiero_asignar){
		var nivel = $("#itxt_preinscripciones_idnivel").val();

		var array_respuesta;
		if(nivel == 1){
			array_respuesta = Preinscripciones_escolar.validar_cupo_pree(obj_seleccionados, quiero_asignar);
		}else{
			array_respuesta = Preinscripciones_escolar.validar_cupo_prim_sec(obj_seleccionados, quiero_asignar);
		}

		// console.info("array_respuesta");
		// console.info(array_respuesta);

		if(array_respuesta.flag_error == true){
			bootbox.alert({
				message: "<br><b>"+array_respuesta.mensaje+"</b>",
				size: 'small',
				callback: function () {}
			});
		}else{
			//
			$.ajax({
				url:base_url+"Inscripciones/asignar_solicitantes",
				method:"POST",
				data: obj_seleccionados,
				beforeSend: function(xhr) {
					$("#wait").modal("show");
				},
				success:function(data){
					$("#wait").modal("hide");
					var mensaje = '';

					if(!data.result){
						var tipo_error = data.tipo_error;
						if(tipo_error=='error_sistema'){
							mensaje = "Ocurrió un error, reintente por favor";
						}else if (tipo_error=='error_ya_asignados') {
							mensaje = (data.count_no == 1)?'No fue posible asignar uno de los solicitantes que seleccionó porque ya fue asignado a otra escuela'
																							:'No fue posible asignar '+data.count_no+' solicitantes que seleccionó porque ya fueron asignados a otra escuela';
					}else if (tipo_error=='error_cupo') {
						mensaje = data.error_mensaje;
					}
				}
				else{
						mensaje = "Solicitantes asignados con éxito";
				}
					// var mensaje = (data.result)?"Solicitantes asignados con éxito":"Ocurrió un error, reintente por favor";
					bootbox.alert({
						message: "<br><b>"+mensaje+"</b>",
						size: 'small',
						callback: function () {
							var offset = $("#itxt_preinscripciones_offset").val();
							obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador","form_preinscripciones_consultar");
						}
					});
				},
				error: function(xhr){
					$("#wait").modal("hide"); Error_ajax.get_error(xhr);
				}
			});
			//
		}

  },

	desasignar_solicitantes : function(elemento){
	    var obj_seleccionados = {'solicitantes':[]};

			var quiero_desasignar = 0;
	    $(".tabla_solicitantes_escolar tbody tr").each(function() {
	      $(this).children("td").each(function (indice){
	        if(indice == 0){
	          var checkbox = $(this).children('input');

						if($(checkbox).length > 0){ // SOLO SI EXISTE EL TAG HAGO push A MI OBJETO
							//
							var idsolicitud = $(checkbox).data('idsolicitud');
							var opcion = $(checkbox).data('opcion');
							var is_checked = ($(checkbox).is(':checked'))?1:0;

							var asignado_a_mi = $(checkbox).data('asignado_a_mi');
							if( (asignado_a_mi == 1 || asignado_a_mi == '1') &&  (is_checked == 1) ){
								var  nuevo = {};
								nuevo.idsolicitud = idsolicitud;
								nuevo.is_checked = is_checked;
								nuevo.opcion = opcion;
								obj_seleccionados.solicitantes.push(nuevo);
							}


							//
						}else{
							// nada ...
						}
	        }// indice == 0
	      });
	    });

			if(obj_seleccionados.solicitantes.length > 0){
				Preinscripciones_escolar.desasignar_solicitantes_ok(obj_seleccionados);
			}else{
				bootbox.alert({
					message: "<br><b>Es necesario que seleccione mínimo un solicitante asignado a su escuela</b>",
					size: 'small',
					callback: function () {
						var offset = $("#itxt_preinscripciones_offset").val();
						obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador","form_preinscripciones_consultar");
					}
				});
			}
			//
		},

		desasignar_solicitantes_ok : function(obj_seleccionados){
			$.ajax({
				url:base_url+"Inscripciones/desasignar_solicitantes",
				method:"POST",
				data: obj_seleccionados,
				beforeSend: function(xhr) {
					$("#wait").modal("show");
				},
				success:function(data){
					$("#wait").modal("hide");
					var mensaje = (data.result)?"Solicitantes desasignados con éxito":"Ocurrió un error, reintente por favor";
					bootbox.alert({
						message: "<br><b>"+mensaje+"</b>",
						size: 'small',
						callback: function () {
							var offset = $("#itxt_preinscripciones_offset").val();
							obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador","form_preinscripciones_consultar");
						}
					});
				},
				error: function(xhr){
					$("#wait").modal("hide"); Error_ajax.get_error(xhr);
				}
			});
	  },

		get_view_detalles_solicitud : function(idsolicitud){
			$.ajax({
				url:base_url+"Inscripciones/get_view_detalles_solicitud",
				method:"POST",
				data: {'idsolicitud':idsolicitud},
				beforeSend: function(xhr) {
					$("#wait").modal("show");
				},
				success:function(data){
					$("#wait").modal("hide");

					$("#div_preinscripciones_generico_escolar").empty();
					$("#div_preinscripciones_generico_escolar").append(data.str_view);

					$("#modal_detallessolicitud").modal("show");

				},
				error: function(xhr){
					$("#wait").modal("hide"); Error_ajax.get_error(xhr);
				}
			});
	  }


};
