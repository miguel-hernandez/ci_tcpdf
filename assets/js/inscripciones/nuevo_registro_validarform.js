/* jshint esversion: 6 */
$(document).ready(function () {
	// LOS MÉTODOS DE VALIDACIÓN
  $.validator.addMethod("select_not_cero", function(value, element){
    return(value == 0 || value == '0')?false:true;
  });

	$.validator.addMethod("select_grado", function(value, element){
    // return(value == 0 || value == '0')?false:true;
			let nivel = $("#itxt_preinscripcionesnuevo_nivel").val();
			if( (parseInt(nivel) == 2) || (parseInt(nivel) == 3) ){
				return true;
			}else{
				return(value == 0 || value == '0')?false:true;
			}
  });

  $.validator.addMethod("valida_municipio", function(value, element){
			let idestado = $("#slc_preinscripcionesnuevo_estado").val();
			if( parseInt(idestado) != 26 ){
				return true;
			}else{
				return(value == 0 || value == '0')?false:true;
			}
  });

  $.validator.addMethod("valida_uniforme4", function(value, element){
      let genero = $("#slc_preinscripcionesnuevo_genero").val();
      if( genero == 'H' ){
        return true;
      }else{
        return ( (value == 0) || (value == '0') )?false:true;
      }
  });


	// LA VALIDACIÓN
  $("#form_preinscripcionesnuevo").validate({
    ignore: [],
    onclick:false, onfocusout: false, onkeypress:false, onkeydown:false, onkeyup:false,
    rules: {
      itxt_preinscripcionesnuevo_curp: {required: true},
			itxt_preinscripcionesnuevo_domicilio: {required: true},
			itxt_preinscripcionesnuevo_colonia: {required: true},
			slc_preinscripcionesnuevo_estado: {select_not_cero: true},
			slc_preinscripcionesnuevo_municipio: {valida_municipio: true},
			slc_preinscripcionesnuevo_tipo_resp: {select_not_cero: true},
			itxt_preinscripcionesnuevo_nombre_resp: {required: true},
			itxt_preinscripcionesnuevo_apell1_resp: {required: true},
			itxt_preinscripcionesnuevo_telefono_resp: {required: true, number:true},

			uniforme1: {required: true},
			uniforme2: {required: true},
			uniforme3: {required: true},
			uniforme4: {valida_uniforme4: true},

			slc_preinscripcionesnuevo_grado: {select_grado: true},


    },
    messages: {
			itxt_preinscripcionesnuevo_curp: { required: "Ingrese curp"},
			itxt_preinscripcionesnuevo_domicilio: { required: "Ingrese domicilio"},
			itxt_preinscripcionesnuevo_colonia: { required: "Ingrese colonia"},
			slc_preinscripcionesnuevo_estado: { select_not_cero: "Seleccione estado"},
			slc_preinscripcionesnuevo_municipio: { valida_municipio: "Seleccione municipio"},
			slc_preinscripcionesnuevo_tipo_resp: { select_not_cero: "Seleccione responsable"},
			itxt_preinscripcionesnuevo_nombre_resp: { required: "Ingrese nombre"},
			itxt_preinscripcionesnuevo_apell1_resp: { required: "Ingrese primer apellido"},
			itxt_preinscripcionesnuevo_telefono_resp: { required: "Ingrese teléfono", number: "Ingrese número válido"},

			uniforme1: { required: "seleccione"},
			uniforme2: { required: "seleccione"},
			uniforme3: { required: "seleccione"},
			uniforme4: { valida_uniforme4: "seleccione"},

			slc_preinscripcionesnuevo_grado: { select_grado: "Seleccione grado"},
    },
		submitHandler: function(form) {
						// Preinscripciones_nuevoregistro_form.grabar_registro_de_externo();
            Preinscripciones_nuevoregistro_form.grabar_registro_de_externo_oyoremia();
		}

  });

});

$("#btn_preinscripcionesnuevo_grabar").click(function(e){
	// alert("AAAA140225MSRRNSA1"); return false;
	e.preventDefault();
	e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

	let idsolicitud = $("#itxt_preinscripcionesnuevo_idsolicitud").val();
	if(idsolicitud > 0){
		// alert("NO VALIDAR FORMULARIO"); return false;
		let nivel = $("#itxt_preinscripcionesnuevo_nivel").val();
		let obj_seleccionados = {'solicitantes':[]};
		let  nuevo = {};
		nuevo.idsolicitud = idsolicitud;
		nuevo.opcion = 4;
		nuevo.grado = $("#slc_preinscripcionesnuevo_grado").val();
		nuevo.curp = $("#itxt_preinscripcionesnuevo_curp").val();
		obj_seleccionados.solicitantes.push(nuevo);

		let array_valida_cupos = Preinscripciones_nuevoregistro_form.validar_cupo_pree_prim_sec();

		if(array_valida_cupos.flag_error == true){
			bootbox.alert({
				message: "<br><b>"+array_valida_cupos.mensaje+"</b>",
				size: 'small',
				callback: function () {}
			});
		}else{
				Preinscripciones_nuevoregistro_form.grabar_registro_de_ins(obj_seleccionados);
		}

	}else if (idsolicitud.length == 0) {
		// alert("VALIDAR FORMULARIO");  return false;
		$("#form_preinscripcionesnuevo").submit();
	}
});

var Preinscripciones_nuevoregistro_form = {
		validar_cupo_pree_prim_sec : function(){
			// alert("validar_cupo_pree_prim_sec"); return false;
			let grado = $("#slc_preinscripcionesnuevo_grado").val();
			let grado_text = "";
			if(grado == 1){
				grado_text = "primer grado";
			}else if (grado == 2) {
				grado_text = "segundo grado";
			}else if (grado == 3) {
				grado_text = "tercer grado";
			}

			let id_input = "itxt_preinscripcionesnuevo_capacidad_grado"+grado+"_disponible";
			let capacidad_grado = $("#"+id_input).val();
			// console.info("capacidad_grado: "+capacidad_grado);
			let flag_error = false;
			let mensaje = '';
			if(capacidad_grado < 1){ // CUANDO ES CERO YA NO HAY CUPO
				flag_error = true;
				mensaje += '<br> Error de asignación para '+grado_text+', cupo(s) disponible(s): '+capacidad_grado;
			}

			var array = [];
			array.flag_error = flag_error;
			array.mensaje = mensaje;
			// console.info("array");
			// console.info(array);
			// return false;}

			return array;
	  },

		grabar_registro_de_ins : function(obj_seleccionados){
			$.ajax({
				url: base_url+"Inscripciones/grabar_registro_de_ins",
				method: "POST",
				data: obj_seleccionados,
				beforeSend: function(xhr) {
					$("#wait").modal("show");
				},
				success:function(data){
						$("#wait").modal("hide");

						var mensaje = '';

						if(!data.result){
							var tipo_error = data.tipo_error;
						if(tipo_error == 'error_sistema'){
								mensaje = "Ocurrió un error, reintente por favor";
						}else if (tipo_error == 'error_ya_asignados') {
								mensaje = 'No fue posible guardar sus cambios porque el solicitante que seleccionó ya fue asignado a otra escuela';
						}else if (tipo_error == 'error_cupo') {
							mensaje = data.error_mensaje;
						}
					}
					else{
						mensaje = "Cambios guardados con éxito";
					}
					bootbox.alert({
						message: "<br><b>"+mensaje+"</b>",
						size: 'small',
						callback: function () {
							// PRIMERO LIMPIO EL FORMULARIO
							Preinscripciones_nuevoregistro.feed_datos_ins([], true);
							// LUEGO ACTUALIZO LOS DATOS EN EL GRID
							var offset = $("#itxt_preinscripcionesnuevo_offset").val();
							obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador_nuevoregistro","form_preinscripcionesnuevo_consultar");
						}
					});

				},
				error: function(xhr){
					$("#wait").modal("hide"); Error_ajax.get_error(xhr);
				}
			});
		},

    grabar_registro_de_externo_oyoremia : function(){
      let caso_para_grabar = $("#itxt_preinscripcionesnuevo_caso_para_grabar").val();
      if((caso_para_grabar.trim()).length == 0){
        alert("Ha ocurrido un error, ingrese nuevamente la curp por favor");
      }else{
        if(caso_para_grabar == 'externo'){
            Preinscripciones_nuevoregistro_form.grabar_registro_de_externo();
        }else if (caso_para_grabar == 'yoremia') {
            Preinscripciones_nuevoregistro_form.grabar_registro_de_yoremia();
        }
      }
    },

		grabar_registro_de_externo : function(){
			// ANTES DEL REQUEST VALIDO CUPO EN EL FRONT
			let array_valida_cupos = Preinscripciones_nuevoregistro_form.validar_cupo_pree_prim_sec();
			if(array_valida_cupos.flag_error == true){
				bootbox.alert({
					message: "<br><b>"+array_valida_cupos.mensaje+"</b>",
					size: 'small',
					callback: function () {}
				});
			}else{
					//
					let datos = $("#form_preinscripcionesnuevo").serialize();
					$.ajax({
						url: base_url+"Inscripciones/grabar_registro_de_externo",
						method: "POST",
						data: datos,
						beforeSend: function(xhr) {
							$("#wait").modal("show");
						},
						success:function(data){
								$("#wait").modal("hide");

								var mensaje = '';

								if(!data.result){
									var tipo_error = data.tipo_error;
								if(tipo_error == 'error_sistema'){
										mensaje = "Ocurrió un error, reintente por favor";
								}else if (tipo_error == 'error_cupo') {
									mensaje = data.error_mensaje;
								}
							}
							else{
								mensaje = "Cambios guardados con éxito";
							}
							bootbox.alert({
								message: "<br><b>"+mensaje+"</b>",
								size: 'small',
								callback: function () {
									// PRIMERO LIMPIO EL FORMULARIO
									Preinscripciones_nuevoregistro.feed_datos_ins([], true);

                  // LUEGO TODOS LOS input Y select DISABLED
                  $('#form_preinscripcionesnuevo').find('input, select').prop('disabled', true);
                  $('#itxt_preinscripcionesnuevo_curp').prop('disabled', false); // MENOS EL CAMPO PARA INGRESAR CURP

									// DESPUÉS ACTUALIZO LOS DATOS EN EL GRID
									var offset = $("#itxt_preinscripcionesnuevo_offset").val();
									obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador_nuevoregistro","form_preinscripcionesnuevo_consultar");
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

    grabar_registro_de_yoremia : function(){
        alert("Estamos trabajando en esto...");
		},



};
