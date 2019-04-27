/* jshint esversion: 6 */
$(document).ready(function () {
	obj_er = new Regularexpression();
	obj_grid = new Grid("div_preinscripcionesnuevo_grid");
	Preinscripciones_nuevoregistro.get_mis_preinscritos();

	Preinscripciones_nuevoregistro.feed_datos_ins([], true);
});

$("#itxt_preinscripcionesnuevo_curp").keyup(function(){
	let curp = $(this).val();
	if(curp.trim().length < 18){
		Preinscripciones_nuevoregistro.feed_datos_ins([], true);
	}
});

$("#btn_preinscripcionesnuevo_verificarcurp").click(function(e){
	e.preventDefault();
	e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento
	Preinscripciones_nuevoregistro.feed_datos_ins([], true);

	let curp = $("#itxt_preinscripcionesnuevo_curp").val();
	curp = curp.trim();

	if( obj_er.curp_ins(curp) ){
		Preinscripciones_nuevoregistro.calcula_edad_xnivel(curp);
	}else{
		bootbox.alert({
			message: "<br><b>CURP incorrecta</b>",
			size: 'small',
			callback: function () {}
		});
	}
});

$("#slc_preinscripcionesnuevo_estado").change(function() {
	let idestado = $(this).val();
	if(idestado == 26){
		$("#slc_preinscripcionesnuevo_municipio").prop("disabled", false);
	}else{
		$("#slc_preinscripcionesnuevo_municipio").prop("disabled", true);
		$("#slc_preinscripcionesnuevo_municipio").val(0);
	}
});

var Preinscripciones_nuevoregistro = {

	calcula_edad_xnivel : function(curp){
		let nivel = $("#itxt_preinscripcionesnuevo_nivel").val();

		let anio = curp.substring(4, 6); let mes = curp.substring(6, 8); let dia = curp.substring(8, 10);

		Preinscripciones_nuevoregistro.curp2date(curp, function(objeto_fechacurp){
			Preinscripciones_nuevoregistro.verifica_edad_xnivel_grado(nivel, objeto_fechacurp, function(flag_pertenece_nivel){
				if(!flag_pertenece_nivel){
					bootbox.alert({
						message: "<br><b>La CURP no pertenece a su nivel</b>",
						size: 'small',
						callback: function () {}
					});
				}else{
					Preinscripciones_nuevoregistro.get_enins_enexterno_enyoremia(curp);
				}

			});


		});
	},

	curp2date : function(curp, callback) {
		let m = curp.match( /^\w{4}(\w{2})(\w{2})(\w{2})/ );

		let anio = parseInt(m[1],10)+1900;
		if( anio < 1950 ) anio += 100;
		let mes = parseInt(m[2], 10)-1; //  // Los menes inician en 0 para Date, 0 = ENERO, ...
		let dia = parseInt(m[3], 10);

		// alert("anio: "+anio+" mes: "+mes+" dia: "+dia);
		let fecha = new Date( anio, mes, dia );
		return callback(fecha);
	},


	verifica_edad_xnivel_grado : function(nivel, objeto_fechacurp, callback){
		// alert("verifica_edad_xnivel_grado -> fecha_curp: "+fecha_curp);
		nivel = parseInt(nivel);
		let flag_pertenece = false;

		/*
		preescolar
		1 -> 01 enero 2016 - 31 diciembre 2016 (3 años)
		2 -> 01 enero 2015 - 31 diciembre 2015 (4 años)
		3 -> 01 enero 2014 - 31 diciembre 2014 (5 años)
		primaria
		1 -> 01 enero 2012 - 31 diciembre 2013 (6 años)
		secundaria
		1 -> 30 agosto 2003 - 01 enero 2008
		*/

		if((nivel == 1) || (nivel == 2) || (nivel == 3)){

			let pree_date_min = new Date(2014, 0, 1); // 01 ENERO(1-1) 2014
			let pree_date_max = new Date(2016, 11, 31); // 31 DICIEMBRE(12-1) 2016

			let prim_date_min = new Date(2012, 0, 1); // 01 ENERO(1-1) 2012
			let prim_date_max = new Date(2013, 11, 31); // 31 DICIEMBRE(12-1) 2013

			let sec_date_min = new Date(2003, 7, 30); // 30 AGOSTO(8-1) 2003
			let sec_date_max = new Date(2018, 0, 01); // 01 ENERO(1-1) 2008

			// obj_date.getTime() = número de milisegundos desde 1 de enero de 1970.
			switch (nivel) {
				case 1:
				if( (pree_date_min.getTime() <= objeto_fechacurp.getTime()) && (objeto_fechacurp.getTime() <= pree_date_max.getTime()) ){
					flag_pertenece = true;
				}
				break;
				case 2:
				if( (prim_date_min.getTime() <= objeto_fechacurp.getTime()) && (objeto_fechacurp.getTime() <= prim_date_max.getTime()) ){
					flag_pertenece = true;
				}
				break;
				case 3:
				if( (sec_date_min.getTime() <= objeto_fechacurp.getTime()) && (objeto_fechacurp.getTime() <= sec_date_max.getTime()) ){
					flag_pertenece = true;
				}
				break;
			}
		}else{
			bootbox.alert({
				message: "<br><b>No pudimos identificar el nivel de su centro de trabajo, contacte a su administrador de sistemas</b>",
				size: 'small',
				callback: function () { location.reload(); }
			});
			return false;
		}

		return callback(flag_pertenece);
	},

	// 2
	get_enins_enexterno_enyoremia : function(curp){
		$.ajax({
			url: base_url+"Inscripciones/get_enins_enexterno_enyoremia",
			method: "POST",
			data: { 'curp':curp },
			beforeSend: function(xhr) {
				$("#wait").modal("show");
			},
			success:function(data){
				$("#wait").modal("hide");
				if(data.array_ins.idsolicitud != null){
					$("#itxt_preinscripcionesnuevo_caso_para_grabar").val("ins");
					let status = data.array_ins.status;
					let cct_ins = data.array_ins.cct_ins;
					let opcasig = data.array_ins.opcasig;
					let fasigna = data.array_ins.fasigna;

					if(status == 'A'){
						bootbox.alert({
							message: "<br><b>Ya se encuentra asignado</b>",
							size: 'small',
							callback: function () { }
						});
					}else{
						alert("La CURP tiene registro de solicitud y no ha sido asignada a ningun centro de trabajo");
						Preinscripciones_nuevoregistro.feed_datos_ins(data.array_ins, false);
					}
				}else if ( (data.array_ins.idsolicitud == null) && data.array_externo.curp != null ) {
					$("#itxt_preinscripcionesnuevo_caso_para_grabar").val("externo");
					alert("La CURP tiene registro de externo pero no tiene completa la solicitud");
					Preinscripciones_nuevoregistro.feed_datos_externo(data.array_externo, false);
				}else if ( (data.array_yoremia.curp != null ) ) {
					$("#itxt_preinscripcionesnuevo_caso_para_grabar").val("yoremia");
					//
					let nivel = $("#itxt_preinscripcionesnuevo_nivel").val();
					if(data.array_vistas.tabla == 'alumno'){
							alert('Este alumno no puede continuar en este proceso porque ya se encuentra registrado en Yolixtli');
						  location.reload();
					}else if ( ((nivel == 1) && (data.array_vistas.tabla == 'view_pree')) || ((nivel == 1) && (data.array_vistas.tabla == 'regcivil')) ) {
							alert("La CURP tiene registro en yolixtli, ingrese los datos necesarios para completar el proceso");
							Preinscripciones_nuevoregistro.feed_datos_yoremia(data.array_yoremia, data.array_datos_cct, false);
					}else if ( (nivel == 2) && (data.array_vistas.tabla == 'view_pree') ) {
							alert("La CURP tiene registro en yolixtli, ingrese los datos necesarios para completar el proceso");
							Preinscripciones_nuevoregistro.feed_datos_yoremia(data.array_yoremia, data.array_datos_cct, false);
				  }else if ( (nivel == 3) && (data.array_vistas.tabla == 'view_prim') ) {
								alert("La CURP tiene registro en yolixtli, ingrese los datos necesarios para completar el proceso");
								Preinscripciones_nuevoregistro.feed_datos_yoremia(data.array_yoremia, data.array_datos_cct, false);
					}else if ( (nivel == 1 || nivel == 2 || nivel == 3) && (data.array_vistas.tabla == 'especial') ) {
								alert("La CURP tiene registro en yolixtli, ingrese los datos necesarios para completar el proceso");
								Preinscripciones_nuevoregistro.feed_datos_yoremia(data.array_yoremia, data.array_datos_cct, false);
					}

					//

				}else if ( (data.array_externo.length == 0) && (data.array_ins.length == 0) && (data.array_yoremia.length == 0) ) {
					alert("No encontramos registros con esa curp, ingrese todos los datos");
				}

			},
			error: function(xhr){
				$("#wait").modal("hide"); Error_ajax.get_error(xhr);
			}
		});
	},

	feed_datos_ins : function(array_datos, es_null){
		// console.info("feed_datos_ins -> array_datos");
		// console.info(array_datos);
		if(es_null){
			$("#itxt_preinscripcionesnuevo_idsolicitud").val("");
			$("#itxt_preinscripcionesnuevo_nombre").val("");
			$("#itxt_preinscripcionesnuevo_apell1").val("");
			$("#itxt_preinscripcionesnuevo_apell2").val("");
			$("#slc_preinscripcionesnuevo_entidadnac").val(0);
			$("#slc_preinscripcionesnuevo_paisnac").val(0);
			$("#slc_preinscripcionesnuevo_genero").val(0);
			$("#itxt_preinscripcionesnuevo_fechanac").val("");
			$("#itxt_preinscripcionesnuevo_cctorigen").val("");
			$("#itxt_preinscripcionesnuevo_domiciliocctorigen").val("");

			// .prop('checked', true);
			$("#check_preinscripcionesnuevo_vivecerca").prop("checked", false);
			//

			// DATOS GENERALES
			$("#itxt_preinscripcionesnuevo_domicilio").val("");
			$("#itxt_preinscripcionesnuevo_colonia").val("");
			$("#itxt_preinscripcionesnuevo_codpostal").val("");
			$("#slc_preinscripcionesnuevo_estado").val(0);
			$("#slc_preinscripcionesnuevo_municipio").val(0);

			$("#slc_preinscripcionesnuevo_capespecial").val(0);

			// Datos del responsable del aspirante
			$("#slc_preinscripcionesnuevo_tipo_resp").val(0);
			$("#itxt_preinscripcionesnuevo_nombre_resp").val("");
			$("#itxt_preinscripcionesnuevo_apell1_resp").val("");
			$("#itxt_preinscripcionesnuevo_apell2_resp").val("");
			$("#itxt_preinscripcionesnuevo_telefono_resp").val("");
			$("#itxt_preinscripcionesnuevo_email_resp").val("");

			// Datos del uniforme
			$("#div_preinscripcionesnuevo_uniformes").empty();

			// EL GRADO
			$("#slc_preinscripcionesnuevo_grado").val(0);

			// EL BOTÓN PARA GRABAR
			$("#div_preinscripcionesnuevo_btngrabar").hide();
		}else{
			$("#itxt_preinscripcionesnuevo_idsolicitud").val(array_datos.idsolicitud);
			$("#itxt_preinscripcionesnuevo_nombre").val(array_datos.nombre);
			$("#itxt_preinscripcionesnuevo_apell1").val(array_datos.apell1);
			$("#itxt_preinscripcionesnuevo_apell2").val(array_datos.apell2);
			$("#slc_preinscripcionesnuevo_entidadnac").val(array_datos.entidadnac);

			// $("#slc_preinscripcionesnuevo_paisnac").val(array_datos.paisnac);
			if( (parseInt(array_datos.entidadnac) != 96) && array_datos.entidadnac != null){
				$("#slc_preinscripcionesnuevo_paisnac").val('MEX');
			}else {
				$("#slc_preinscripcionesnuevo_paisnac").val('EXT');
			}

			$("#slc_preinscripcionesnuevo_genero").val(array_datos.genero);
			$("#itxt_preinscripcionesnuevo_fechanac").val(array_datos.fechanac);
			$("#itxt_preinscripcionesnuevo_cctorigen").val(array_datos.cctorigen);
			$("#itxt_preinscripcionesnuevo_domiciliocctorigen").val(array_datos.domicilio_cctorigin);

			let checked = false;
			if( (array_datos.cercania1opc == true) || (array_datos.cercania1opc == 'true') (array_datos.cercania1opc == 1) || (array_datos.cercania1opc == '1') ){
				checked = true;
			}
			$("#check_preinscripcionesnuevo_vivecerca").prop("checked", checked);


			// DATOS GENERALES
			$("#itxt_preinscripcionesnuevo_domicilio").val(array_datos.domicilio);
			$("#itxt_preinscripcionesnuevo_colonia").val(array_datos.colonia);
			$("#itxt_preinscripcionesnuevo_codpostal").val(array_datos.codpostal);
			$("#slc_preinscripcionesnuevo_estado").val(array_datos.estado);
			if(array_datos.estado == 26){
				$("#slc_preinscripcionesnuevo_municipio").val(array_datos.municipio);
			}

			$("#slc_preinscripcionesnuevo_capespecial").val(array_datos.capespecial);

			// Datos del responsable del aspirante
			$("#slc_preinscripcionesnuevo_tipo_resp").val(array_datos.tipo_resp);
			$("#itxt_preinscripcionesnuevo_nombre_resp").val(array_datos.nombre_resp);
			$("#itxt_preinscripcionesnuevo_apell1_resp").val(array_datos.apell1_resp);
			$("#itxt_preinscripcionesnuevo_apell2_resp").val(array_datos.apell2_resp);
			$("#itxt_preinscripcionesnuevo_telefono_resp").val(array_datos.telefono_resp);
			$("#itxt_preinscripcionesnuevo_email_resp").val(array_datos.email_resp);

			// Datos del uniforme
			Preinscripciones_uniformes.cargaUniformes( parseInt(array_datos.nivel), String(array_datos.genero) );

			$("#uniforme1").val(array_datos.talla_camisa);
			$("#uniforme2").val(array_datos.talla_pantalon);
			$("#uniforme3").val(array_datos.talla_calzado);
			$("#uniforme4").val(array_datos.talla_calceta);

			Preinscripciones_nuevoregistro.disabled_selects_uniformes();

			// EL GRADO
			$("#slc_preinscripcionesnuevo_grado").val(array_datos.grado);

			// EL BOTÓN PARA GRABAR
			$("#div_preinscripcionesnuevo_btngrabar").show();
		}
	},

	disabled_selects_uniformes : function(){
		$('#uniforme1 option:not(:selected)').prop('disabled', true);
		$('#uniforme2 option:not(:selected)').prop('disabled', true);
		$('#uniforme3 option:not(:selected)').prop('disabled', true);
		$('#uniforme4 option:not(:selected)').prop('disabled', true);
	},

	get_mis_preinscritos : function(){
		$.ajax({
			url: base_url+"Inscripciones/get_mis_preinscritos",
			method: "POST",
			data: {},
			beforeSend: function(xhr) {
				$("#wait").modal("show");
			},
			success:function(data){
					$("#wait").modal("hide");
					$("#div_preinscripcionesnuevo_grid").empty();
					$("#div_preinscripcionesnuevo_grid").append(data.str_grid);

			},
			error: function(xhr){
				$("#wait").modal("hide"); Error_ajax.get_error(xhr);
			}
		});
	},



	// LA CURP FUE ENCONTRADA EN ins_externo
	feed_datos_externo : function(array_datos, es_null){
		// console.info("feed_datos_ins -> array_datos");
		// console.info(array_datos);
		if(es_null){
			$("#itxt_preinscripcionesnuevo_idsolicitud").val("");
			$("#itxt_preinscripcionesnuevo_nombre").val("");
			$("#itxt_preinscripcionesnuevo_apell1").val("");
			$("#itxt_preinscripcionesnuevo_apell2").val("");
			$("#slc_preinscripcionesnuevo_entidadnac").val(0);
			$("#slc_preinscripcionesnuevo_paisnac").val(0);
			$("#slc_preinscripcionesnuevo_genero").val(0);
			$("#itxt_preinscripcionesnuevo_fechanac").val("");
			$("#itxt_preinscripcionesnuevo_cctorigen").val("");
			$("#itxt_preinscripcionesnuevo_domiciliocctorigen").val("");

			// .prop('checked', true);
			$("#check_preinscripcionesnuevo_vivecerca").prop("checked", false);
			//

			// DATOS GENERALES
			$("#itxt_preinscripcionesnuevo_domicilio").val("");
			$("#itxt_preinscripcionesnuevo_colonia").val("");
			$("#itxt_preinscripcionesnuevo_codpostal").val("");
			$("#slc_preinscripcionesnuevo_estado").val(0);
			$("#slc_preinscripcionesnuevo_municipio").val(0);

			$("#slc_preinscripcionesnuevo_capespecial").val(0);

			// Datos del responsable del aspirante
			$("#slc_preinscripcionesnuevo_tipo_resp").val(0);
			$("#itxt_preinscripcionesnuevo_nombre_resp").val("");
			$("#itxt_preinscripcionesnuevo_apell1_resp").val("");
			$("#itxt_preinscripcionesnuevo_apell2_resp").val("");
			$("#itxt_preinscripcionesnuevo_telefono_resp").val("");
			$("#itxt_preinscripcionesnuevo_email_resp").val("");

			// Datos del uniforme
			$("#div_preinscripcionesnuevo_uniformes").empty();

			// EL GRADO
			$("#slc_preinscripcionesnuevo_grado").val(0);

			// EL BOTÓN PARA GRABAR
			$("#div_preinscripcionesnuevo_btngrabar").hide();
		}else{
			/* $("#itxt_preinscripcionesnuevo_idsolicitud").val(array_datos.idsolicitud); */
			$("#itxt_preinscripcionesnuevo_nombre").val(array_datos.nombre);
			$("#itxt_preinscripcionesnuevo_apell1").val(array_datos.apell1);
			$("#itxt_preinscripcionesnuevo_apell2").val(array_datos.apell2);
			$("#slc_preinscripcionesnuevo_entidadnac").val(array_datos.entidadnac);

			// $("#slc_preinscripcionesnuevo_paisnac").val(array_datos.paisnac);
			if( (parseInt(array_datos.entidadnac) != 96) && array_datos.entidadnac != null){
				$("#slc_preinscripcionesnuevo_paisnac").val('MEX');
			}else {
				$("#slc_preinscripcionesnuevo_paisnac").val('EXT');
			}

			$("#slc_preinscripcionesnuevo_genero").val(array_datos.genero);
			$("#itxt_preinscripcionesnuevo_fechanac").val(array_datos.fnac);
			/*
			$("#itxt_preinscripcionesnuevo_cctorigen").val(array_datos.cctorigen);
			$("#itxt_preinscripcionesnuevo_domiciliocctorigen").val(array_datos.domicilio_cctorigin);
			*/

			let checked = false;
			$("#check_preinscripcionesnuevo_vivecerca").prop("checked", checked);
			$("#check_preinscripcionesnuevo_vivecerca").prop("disabled", false);

			// DATOS GENERALES
			$("#itxt_preinscripcionesnuevo_domicilio").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_colonia").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_codpostal").prop("disabled", false);
			$("#slc_preinscripcionesnuevo_estado").prop("disabled", false);
			// $("#slc_preinscripcionesnuevo_municipio").prop("disabled", false);

			$("#slc_preinscripcionesnuevo_capespecial").prop("disabled", false);

			// Datos del responsable del aspirante
			$("#slc_preinscripcionesnuevo_tipo_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_nombre_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_apell1_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_apell2_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_telefono_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_email_resp").prop("disabled", false);

			// Datos del uniforme
			let nivel = $("#itxt_preinscripcionesnuevo_nivel").val();
			Preinscripciones_uniformes.cargaUniformes( parseInt(nivel), String(array_datos.genero) );

			// EL GRADO
			$("#slc_preinscripcionesnuevo_grado").prop("disabled", false);
			if(parseInt(nivel) == 1){
				$("#slc_preinscripcionesnuevo_grado").val(0);
			}else if ( (parseInt(nivel) == 2) || (parseInt(nivel) == 3) ) {
				$("#slc_preinscripcionesnuevo_grado").val(1);
			}

			// EL BOTÓN PARA GRABAR
			$("#div_preinscripcionesnuevo_btngrabar").show();
		}
	},

	// LA CURP FUE ENCONTRADA EN ins_externo
	feed_datos_yoremia : function(array_datos, array_datos_cct, es_null){
		// console.info("feed_datos_ins -> array_datos");
		// console.info(array_datos);
		if(es_null){
			$("#itxt_preinscripcionesnuevo_idsolicitud").val("");
			$("#itxt_preinscripcionesnuevo_nombre").val("");
			$("#itxt_preinscripcionesnuevo_apell1").val("");
			$("#itxt_preinscripcionesnuevo_apell2").val("");
			$("#slc_preinscripcionesnuevo_entidadnac").val(0);
			$("#slc_preinscripcionesnuevo_paisnac").val(0);
			$("#slc_preinscripcionesnuevo_genero").val(0);
			$("#itxt_preinscripcionesnuevo_fechanac").val("");
			$("#itxt_preinscripcionesnuevo_cctorigen").val("");
			$("#itxt_preinscripcionesnuevo_domiciliocctorigen").val("");

			// .prop('checked', true);
			$("#check_preinscripcionesnuevo_vivecerca").prop("checked", false);
			//

			// DATOS GENERALES
			$("#itxt_preinscripcionesnuevo_domicilio").val("");
			$("#itxt_preinscripcionesnuevo_colonia").val("");
			$("#itxt_preinscripcionesnuevo_codpostal").val("");
			$("#slc_preinscripcionesnuevo_estado").val(0);
			$("#slc_preinscripcionesnuevo_municipio").val(0);

			$("#slc_preinscripcionesnuevo_capespecial").val(0);

			// Datos del responsable del aspirante
			$("#slc_preinscripcionesnuevo_tipo_resp").val(0);
			$("#itxt_preinscripcionesnuevo_nombre_resp").val("");
			$("#itxt_preinscripcionesnuevo_apell1_resp").val("");
			$("#itxt_preinscripcionesnuevo_apell2_resp").val("");
			$("#itxt_preinscripcionesnuevo_telefono_resp").val("");
			$("#itxt_preinscripcionesnuevo_email_resp").val("");

			// Datos del uniforme
			$("#div_preinscripcionesnuevo_uniformes").empty();

			// EL GRADO
			$("#slc_preinscripcionesnuevo_grado").val(0);

			// EL BOTÓN PARA GRABAR
			$("#div_preinscripcionesnuevo_btngrabar").hide();
		}else{
			/* $("#itxt_preinscripcionesnuevo_idsolicitud").val(array_datos.idsolicitud); */
			$("#itxt_preinscripcionesnuevo_nombre").val(array_datos.nombre);
			$("#itxt_preinscripcionesnuevo_apell1").val(array_datos.apell1);
			$("#itxt_preinscripcionesnuevo_apell2").val(array_datos.apell2);
			$("#slc_preinscripcionesnuevo_entidadnac").val(array_datos.entidadnac);

			// $("#slc_preinscripcionesnuevo_paisnac").val(array_datos.paisnac);
			if( (parseInt(array_datos.entidadnac) != 96) && array_datos.entidadnac != null){
				$("#slc_preinscripcionesnuevo_paisnac").val('MEX');
			}else {
				$("#slc_preinscripcionesnuevo_paisnac").val('EXT');
			}

			$("#slc_preinscripcionesnuevo_genero").val(array_datos.genero);
			$("#itxt_preinscripcionesnuevo_fechanac").val(array_datos.fechanac);

			$("#itxt_preinscripcionesnuevo_cctorigen").val(array_datos_cct.cct);
			$("#itxt_preinscripcionesnuevo_domiciliocctorigen").val(array_datos_cct.domicilio);

			/*
			*/

			let checked = false;
			$("#check_preinscripcionesnuevo_vivecerca").prop("checked", checked);
			$("#check_preinscripcionesnuevo_vivecerca").prop("disabled", false);

			// DATOS GENERALES
			let numero = (array_datos.numero != null)?array_datos.numero:''
			let domicilio = array_datos.calle+' '+numero;
			// console.info("domicilio: "+domicilio);
			$("#itxt_preinscripcionesnuevo_domicilio").val(domicilio);
			$("#itxt_preinscripcionesnuevo_colonia").val(array_datos.colonia);
			$("#itxt_preinscripcionesnuevo_codpostal").prop("disabled", false);
			// $("#slc_preinscripcionesnuevo_estado").prop("disabled", false);
			$("#slc_preinscripcionesnuevo_estado").val(array_datos.entidaddomicilio);
			$("#slc_preinscripcionesnuevo_municipio").val(array_datos.municipiodomicilio);

			$("#slc_preinscripcionesnuevo_capespecial").prop("disabled", false);

			// Datos del responsable del aspirante
			$("#slc_preinscripcionesnuevo_tipo_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_nombre_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_apell1_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_apell2_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_telefono_resp").prop("disabled", false);
			$("#itxt_preinscripcionesnuevo_email_resp").prop("disabled", false);

			// Datos del uniforme
			let nivel = $("#itxt_preinscripcionesnuevo_nivel").val();
			Preinscripciones_uniformes.cargaUniformes( parseInt(nivel), String(array_datos.genero) );

			// EL GRADO
			$("#slc_preinscripcionesnuevo_grado").prop("disabled", false);
			if(parseInt(nivel) == 1){
				$("#slc_preinscripcionesnuevo_grado").val(0);
			}else if ( (parseInt(nivel) == 2) || (parseInt(nivel) == 3) ) {
				$("#slc_preinscripcionesnuevo_grado").val(1);
			}

			// EL BOTÓN PARA GRABAR
			$("#div_preinscripcionesnuevo_btngrabar").show();
		}
	},


};

function get_gridpaginador_preinscripcionesnuevo(offset){
  $("#itxt_preinscripcionesnuevo_offset").val(offset);
  obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador_nuevoregistro","form_preinscripcionesnuevo_consultar");
}
