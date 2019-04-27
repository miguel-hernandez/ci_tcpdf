/* jshint esversion: 6 */
$(document).ready(function () {
		$("#div_preinscripciones_grados").hide();
		obj_grid_buscador = new Grid("div_preinscripciones_buscadorcct");
});

$("#slt_preinscripciones_nivel").change(function() {
	var idnivel = $(this).val();
	$("#itxt_preinscripciones_cct").val("");
	Preinscripciones_central.feed_grados(idnivel);

	Preinscripciones_central.muestra_oculta_reportes();
});


$("#slt_preinscripciones_municipio").change(function() {
	$("#itxt_preinscripciones_cct").val("");
	Preinscripciones_central.muestra_oculta_reportes();

	var idmunicipio = $(this).val();
	if(idmunicipio>0){
			Preinscripciones_central.get_localidades_xidmunicipio(idmunicipio);
	}else{
			Preinscripciones_central.feed_localidades([]);
	}

		Preinscripciones_central.muestra_oculta_reportes();
});

$("#slt_preinscripciones_localidad").change(function() {
	$("#itxt_preinscripciones_cct").val("");
	Preinscripciones_central.muestra_oculta_reportes();
});

//

$("#btn_preinscripciones_buscarcct").click(function(e){
		e.preventDefault();
  	e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

		$("#itxt_preinscripciones_cct").val("");
  	Preinscripciones_central.get_view_buscadorcct();

		Preinscripciones_central.muestra_oculta_reportes();
});

$("#btn_preinscripciones_limpiarcct").click(function(e){
		e.preventDefault();
  	e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento
		$("#itxt_preinscripciones_cct").val("");

		Preinscripciones_central.muestra_oculta_reportes();
});

$("#btn_preinscripciones_limpiar").click(function(e){
		e.preventDefault();
  	e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento
		Preinscripciones_central.limpiar_formulario();
});

function get_gridpaginador_solicitudes_central(offset){
		$("#itxt_preinscripciones_offset").val(offset);
		let obj_grid = new Grid("div_preinscripciones_grid");
		obj_grid.get_gridpaginador(offset, "Inscripciones", "get_gridpaginador_central","form_preinscripciones_consultar");
		Preinscripciones_central.muestra_oculta_totales();
}// get_gridpaginador()

function get_gridpaginador(offset){
	if($("#modal_buscadorcct").is(":visible")){
		obj_grid_buscador.get_gridpaginador(offset, "Buscadorcctinsc", "get_grid","form_buscadorcct");
	}else{
	}
}// get_gridpaginador()

$("#btn_preinscripciones_buscar").click(function(e){
		e.preventDefault();
  	e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

		let idnivel = $("#slt_preinscripciones_nivel").val();
		idnivel = idnivel.trim();

		var idmunicipio = $("#slt_preinscripciones_municipio").val();
		var localidad = $("#slt_preinscripciones_localidad").val();

		var cct = $("#itxt_preinscripciones_cct").val()
		var nombre = $("input[name='itxt_preinscripciones_nombre']").val();
		var apellido1 = $("input[name='itxt_preinscripciones_apell1']").val();
		var apellido2 = $("input[name='itxt_preinscripciones_apell2']").val();

		var curp = $("input[name='itxt_preinscripciones_curp']").val();

		var necesidad_especial = $("select[name='slc_preinscripciones_necesidad']").val();
		var estatus = $("select[name='slc_preinscripciones_estatus']").val();


		var n_completos = 0;
		if(idmunicipio > 0){ n_completos++; }
		if(localidad > 0){	n_completos++; }

		if(cct.trim().length > 0){	n_completos++; }
		if(nombre.trim().length > 0){	n_completos++; }
		if(apellido1.trim().length > 0){	n_completos++; }
		if(apellido2.trim().length > 0){	n_completos++; }

		if(curp.trim().length > 0){	n_completos++; }

		if(necesidad_especial > 0){	n_completos++; }
		if(estatus != 0 || estatus != '0'){	n_completos++; }

		if(idnivel.length > 1){
			bootbox.alert({
				message: "<br><b>Seleccione nivel por favor</b>",
				size: 'small',
				callback: function () {}
			});
		}else{
			if(n_completos == 0){
				bootbox.alert({
					message: "<br><b>Seleccione al menos dos filtros</b>",
					size: 'small',
					callback: function () {}
				});
			}else{
				Preinscripciones_central.get_solicitantes();
			}
		}
});

var Preinscripciones_central = {

	feed_grados : function(idnivel){
		let str_select = "";
		if(idnivel == 1){
			str_select += "<option value='1,2,3'> TODOS </option>";
			str_select += "<option value='1'> 1 </option>";
			str_select += "<option value='2'> 2 </option>";
			str_select += "<option value='3'> 3 </option>";
			$("#div_preinscripciones_grados").show();
		}else if ( (idnivel == 2) || (idnivel == 3)) {
			str_select += "<option value='1'> 1 </option>";
			$("#div_preinscripciones_grados").hide();
		}else {
			$("#div_preinscripciones_grados").hide();
		}

		document.getElementById("slc_preinscripciones_grado").innerHTML = "";
		document.getElementById("slc_preinscripciones_grado").innerHTML = str_select;
  },

  get_localidades_xidmunicipio : function(idmunicipio){
		idmunicipio = parseInt(idmunicipio);

    $.ajax({
      url:base_url+"Inscripciones/get_localidades_xidmunicipio",
      method:"POST",
      data:{
        'idmunicipio' : idmunicipio
      },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
				Preinscripciones_central.feed_localidades(data.array_localidades);
      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });

  },

	feed_localidades : function(array_localidades){
		let str_select = "<option value='0'> Región / Localidad </option>";
		array_localidades.forEach(function(localidad) {
				str_select += `<option value=${localidad.idlocalidad}> ${localidad.nombre_localidad} </option>`;
		});

		document.getElementById("slt_preinscripciones_localidad").innerHTML = "";
		document.getElementById("slt_preinscripciones_localidad").innerHTML = str_select;
  },

	get_view_buscadorcct : function(){
		// alert("get_view_buscadorcct"); return false;
		$.ajax({
			url:base_url+"Buscadorcctinsc/get_view_buscadorcct",
			method:"POST",
			data:{
	        // "idnivel" : $("#slt_centrostrabajo_nivel").val(),
					"idnivel" : $("#slt_preinscripciones_nivel").val(),
	        "idregion" : $("#slt_preinscripciones_region").val(),
	        "idmunicipio" : $("#slt_preinscripciones_municipio").val(),
	        "idzona" : $("#slt_preinscripciones_localidad").val()
	      },
			beforeSend: function(xhr) {
				$("#wait").modal("show");
			},
			success:function(data){
				$("#wait").modal("hide");


				$("#div_preinscripciones_buscadorcct").empty();
				$("#div_preinscripciones_buscadorcct").append(data.str_view);

				obj_bcct = null;

				obj_bcct = new Buscadorcct("div_preinscripciones_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
				obj_bcct.init();

				document.getElementById('div_preinscripciones_buscadorcct').addEventListener('cct_seleccionada', Preinscripciones_central.alimenta_campo_cct, false);
	      document.getElementById('div_preinscripciones_buscadorcct').addEventListener('event_salir_buscador', Preinscripciones_central.destruye_buscadorcct, false);
			},
			error: function(error){
				console.log(error);
			}
		});
  },

	alimenta_campo_cct : function(){
		var cct = obj_bcct.get_cct();
		$("#itxt_preinscripciones_cct").val("");
		$("#itxt_preinscripciones_cct").val(cct);

		var idnivel = obj_bcct.get_idnivel();
		var idcentrocfg = obj_bcct.get_idcentrocfg();
		var cctexcedente = obj_bcct.get_conexcedente();
		$("#itxt_preinscripciones_idnivel").val("");
		$("#itxt_preinscripciones_idnivel").val(idnivel);
		$("#itxt_preinscripciones_idcentrocfg").val("");
		$("#itxt_preinscripciones_idcentrocfg").val(idcentrocfg);
		Preinscripciones_central.feed_reportes(cct,idnivel,cctexcedente);

		var nivel_ok = '';
		if(idnivel==1 || idnivel=='1'){
			nivel_ok = 'pree';
		}
		if(idnivel==2 || idnivel=='2'){
			nivel_ok = 'prim';
		}
		if(idnivel==3 || idnivel=='3'){
			nivel_ok = 'sec';
		}
		$("#itxt_preinscripciones_nivel").val("");
		$("#itxt_preinscripciones_nivel").val(nivel_ok);

		obj_bcct = null;
  },

	feed_reportes : function(cct, idnivel,cct_excedente){
		var opciones = "";
		$("#reporte_por_ct").empty();
		if(cct != ''){
			opciones  += '<option selected value="">Reportes</option>';
			opciones  += '<option value="al_preinscripcion">Alumnos Preinscritos</option>';
			if(idnivel==1 || idnivel==2){ // sólo se imprime para primaria y preescolar
				opciones  += '<option value="al_sin_preinscripcion">Alumnos sin Preinscripci&oacute;n</option>';
			}
			if(cct_excedente==1){
				opciones  += '<option value="al_excedentes">Alumnos Excedentes</option>';
			}
		}

		$("#reporte_por_ct").append(opciones);
		Preinscripciones_central.muestra_oculta_reportes();
	},

	muestra_oculta_reportes : function(){
		let cct_ = $("#itxt_preinscripciones_cct").val();
		if( $.trim(cct_).length == 10 ){
			$("#div_reporte_por_grupo").show();
		}else{
			$("#div_reporte_por_grupo").hide();
		}
	},


	destruye_buscadorcct : function(){
		obj_bcct = null;
  },

	get_solicitantes : function(){
    var datos = $("#form_preinscripciones_consultar").serialize();

    $.ajax({
      url: base_url+"Inscripciones/get_solicitantes_central",
      method: "POST",
      data: datos,
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");

        $("#div_preinscripciones_grid").empty();
        $("#div_preinscripciones_grid").append(data.str_grid);
        $("#div_preinscripciones_grid").show();

				Preinscripciones_central.muestra_oculta_totales();
      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });
  },

	limpiar_formulario : function(){
    $('#form_preinscripciones_consultar')[0].reset();
  },

	// NUEVO AJUSTE: MOSTRAR DETALES DE SOLICITUDES Y CONTEO DE ESPACIOS CUANDO SELECCIONAN CCT
	muestra_oculta_totales : function(){
		let cct_ = $("#itxt_preinscripciones_cct").val();
		if( $.trim(cct_).length == 10 ){
			$("#div_conteo_solicitantes_yespacios").show();
		}else{
			$("#div_conteo_solicitantes_yespacios").hide();
		}
  },

get_reporte_por_ct : function(){
	var reporte_por_ct = $("#reporte_por_ct").val();
	var reporte = reporte_por_ct;
	var element1 = document.createElement("input");
	var element2 = document.createElement("input");
	var element3 = document.createElement("input");
	var form = document.createElement("form");
	form.name="formRep";
	form.id="formRep";
	form.method = "POST";
	form.target = "_blank";

	element1.type="hidden";
	// element1.value = document.getElementById("itxt_preinscripciones_idnivel").value;
	element1.value = document.getElementById("itxt_preinscripciones_nivel").value;
	// itxt_preinscripciones_nivel
	element1.name="nivel";
	form.appendChild(element1);

	element3.type="hidden";
	element3.value = document.getElementById("itxt_preinscripciones_idcentrocfg").value;
	element3.name="centrocfg";
	form.appendChild(element3);

	element2.type="hidden";
	// element2.value = document.getElementById("itxt_preinscripciones_cct").value;
	element2.value = document.getElementById("itxt_preinscripciones_idcentrocfg").value;
	element2.name="paramRep";
	form.appendChild(element2);


	form.action = base_url+"Reportes/GeneraReporte/"+reporte;
	document.body.appendChild(form);

	form.submit();
}
};

function btn_reporte_por_ct_click(){
	var reporte_por_ct = document.getElementById("reporte_por_ct").value;
	if(reporte_por_ct.trim().length==0 || reporte_por_ct=="" ){
		bootbox.alert({
			message: "<br><b>Seleccione un tipo de reporte</b>",
			size: 'small',
			callback: function () {}
		});
	}else{
		Preinscripciones_central.get_reporte_por_ct();
	}
}
