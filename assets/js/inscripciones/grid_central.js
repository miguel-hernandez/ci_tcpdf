/* jshint esversion: 6 */

function ver_detalles(elemento){
  var idsolicitud = $(elemento).data('idsolicitud');
	Grid_central.get_view_detalles_solicitud(idsolicitud);
}


function ver_movimientos(elemento){
    var idsolicitud = $(elemento).data('idsolicitud');
    Grid_central.get_view_movimientos_solicitud(idsolicitud);
}

function eliminar_solicitud(elemento){
    let idsolicitud = $(elemento).data('idsolicitud');
    let estatus = $(elemento).data('estatus');

    let mensaje = (estatus == "A")?"La solicitud ya fue asignada. ¿Está seguro de querer eliminarla?"
    :
    "¿Está seguro de eliminar la solicitud?";

    bootbox.confirm({
        message: '<b>'+mensaje+'</b>',
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
              Grid_central.eliminar_solicitud(idsolicitud);
            } else {
              // Nada...
            }
        }
    });
    // }
}

function liberar_solicitud(elemento){
  let idsolicitud = $(elemento).data('idsolicitud');
  bootbox.confirm({
      message: '<b>¿Liberar la solicitud '+idsolicitud+'?</b>',
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
            Grid_central.liberar_solicitud(idsolicitud);
          } else {
            // Nada...
          }
      }
  });
}



var Grid_central = {

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

					$("#div_preinscripciones_generico_central").empty();
					$("#div_preinscripciones_generico_central").append(data.str_view);

					$("#modal_detallessolicitud").modal("show");

				},
				error: function(xhr){
					$("#wait").modal("hide"); Error_ajax.get_error(xhr);
				}
			});
	  },

    eliminar_solicitud : function(idsolicitud){
      $.ajax({
        url:base_url+"Inscripciones/eliminar_solicitud",
        method:"POST",
        data: { 'idsolicitud':idsolicitud },
        beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
        success:function(data){
          $("#wait").modal("hide");

          if(data.result){
            bootbox.alert({
      				message: "<br><b>Solicitud eliminada con éxito</b>",
      				size: 'small',
      				callback: function () {
      					let offset = $("#itxt_preinscripciones_offset").val();
                let obj_grid = new Grid("div_preinscripciones_grid");
                obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador_central","form_preinscripciones_consultar");
      				}
            });
          }else{
            bootbox.alert({
              message: "<br><b>Ocurrió un error, reintente por favor</b>",
              size: 'small',
              callback: function () {}
            });
          }

        },
        error: function(xhr){
          $("#wait").modal("hide"); Error_ajax.get_error(xhr);
        }
      });
	  },

    get_view_movimientos_solicitud : function(idsolicitud){
			$.ajax({
				url:base_url+"Inscripciones/get_view_movimientos_solicitud",
				method:"POST",
				data: {'idsolicitud':idsolicitud},
				beforeSend: function(xhr) {
					$("#wait").modal("show");
				},
				success:function(data){
					$("#wait").modal("hide");

					$("#div_preinscripciones_generico_central").empty();
					$("#div_preinscripciones_generico_central").append(data.str_view);

					$("#modal_movimientossolicitud").modal("show");

				},
				error: function(xhr){
					$("#wait").modal("hide"); Error_ajax.get_error(xhr);
				}
			});
	  },

    liberar_solicitud : function(idsolicitud){
      $.ajax({
        url:base_url+"Inscripciones/liberar_solicitud",
        method:"POST",
        data: { 'idsolicitud':idsolicitud },
        beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
        success:function(data){
          $("#wait").modal("hide");

          if(data.result){
            bootbox.alert({
      				message: "<br><b>Solicitud liberada con éxito</b>",
      				size: 'small',
      				callback: function () {
      					let offset = $("#itxt_preinscripciones_offset").val();
                let obj_grid = new Grid("div_preinscripciones_grid");
                obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador_central","form_preinscripciones_consultar");
      				}
            });
          }else{
            bootbox.alert({
              message: "<br><b>Ocurrió un error, reintente por favor</b>",
              size: 'small',
              callback: function () {}
            });
          }

        },
        error: function(xhr){
          $("#wait").modal("hide"); Error_ajax.get_error(xhr);
        }
      });
	  },

};
