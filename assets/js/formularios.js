
var ms_tiempo_alerta = 4000;

function verificaCheck(citems) {
	var f = true;
	for (var i = 0; i < citems.length; i++) {
		if (!$(citems[i]).prop("checked")) {
			f = false;
			break;
		}
	}
	return f;
}

function llena_d_checks(callback){
		var arr = [];
		var citems = $('.cb-grupo');
		for (var i = 0; i < citems.length; i++) {
			if ($(citems[i]).prop("checked")) {
				arr.push(1);
			}
		}
		return callback(arr);
}// llena_d_checks()


$(document).ready(function () {
	var url_contrasena = live_url + 'index.php/central/';
	var f = true;
	var citems = $('.cb-grupo');

	if (verificaCheck(citems)) {
		$("#selecciona-todos").prop("checked", true);
		$("#txt-selecciona").text("todos");
	}
	$(".cb-grupo").click(function () {
		llena_d_checks( function(result){
				if(result.length>0){ $("#div_acceso_movil").show(); }
				else{ $("#div_acceso_movil").hide(); $("#acceso-pace").prop("checked",false); }
		});

		var citems = $('.cb-grupo');
		if (verificaCheck(citems)) {
			$("#selecciona-todos").prop("checked", true);
			$("#txt-selecciona").text("Ninguno");

		} else {
			$("#selecciona-todos").prop("checked", false);
			$("#txt-selecciona").text("Todos");
		}
	});
	$('[data-toggle="tooltip"]').tooltip({html: true});

	$("#selecciona-todos").click(function () {
		var prop = $(this).prop("checked");

		if(prop){ $("#div_acceso_movil").show();
		}else{ $("#div_acceso_movil").hide(); $("#acceso-pace").prop("checked", false); }

		var checkBoxes = $('.cb-grupo');
		checkBoxes.prop("checked", prop);

		var span_txt = $("#txt-selecciona");
		var txt = !prop ? "Seleccionar todos" : "Ninguno";
		span_txt.text(txt);
	});

	$("#genera-contrasena").click(function () {
		$("#contrasena").val(password(10));
	});

	$("#curp").focusout(function () {
		$(this).val($(this).val().toUpperCase());
	});
	$("#rfc").focusout(function () {
		$(this).val($(this).val().toUpperCase());
	});

	// Validación de los campos de contraseña
	$("#generar").click(function (event) {
		$("#contrasena").css('border', '');
		$("#confirma-contrasena").css('border', '');
		$("#confirma-contrasena").prop("disabled", false);
		$("#error-contrasena").text("");
		$.ajax({
			url: url_contrasena + "contrasena",
			dataType: 'json',
			success: function (res) {
				var pass = res['contrasena'];
				$("#contrasena").val(pass);
				$("#confirma-contrasena").val(pass);
				$("#muestra-contrasena").text(pass);
			},
			error: function () {
				$("#muestra-contrasena").text("No se pudo generar la contraseña. Intente nuevamente");
			}
		});// ajax
	});

// ejemplos
//console.log(randomString(16, 'aA'));
//console.log(randomString(32, '#aA'));
//console.log(randomString(64, '#A!'));
	function randomString(length, chars) {
		var mask = '';
		if (chars.indexOf('a') > -1)
			mask += 'abcdefghijklmnopqrstuvwxyz';
		if (chars.indexOf('A') > -1)
			mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		if (chars.indexOf('#') > -1)
			mask += '0123456789';
		if (chars.indexOf('!') > -1)
			mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
		var result = '';
		for (var i = length; i > 0; --i)
			result += mask[Math.floor(Math.random() * mask.length)];
		return result;
	}

	function contrasenaCumple() {
		var valor = $("#contrasena").val();
		var total_puntos = 0;
		var puntos_requeridos = 4;

		if (valor.match(/[A-Z]/)) {
			$("#tooltip-may").addClass("cumple-req");
			total_puntos == puntos_requeridos ? puntos_requeridos : total_puntos++;
		} else {
			$("#tooltip-may").removeClass("cumple-req");
			total_puntos == 0 ? 0 : total_puntos--;
		}

		if (valor.match(/[a-z]/)) {
			$("#tooltip-min").addClass("cumple-req");
			total_puntos == puntos_requeridos ? puntos_requeridos : total_puntos++;
		} else {
			$("#tooltip-min").removeClass("cumple-req");
			total_puntos == 0 ? 0 : total_puntos--;
		}

		if (valor.match(/[0-9]/)) {
			$("#tooltip-num").addClass("cumple-req");
			total_puntos == puntos_requeridos ? puntos_requeridos : total_puntos++;
		} else {
			$("#tooltip-num").removeClass("cumple-req");
			total_puntos == 0 ? 0 : total_puntos--;
		}

		if (valor.length >= 10) {
			$("#tooltip-len").addClass("cumple-req");
			total_puntos == puntos_requeridos ? puntos_requeridos : total_puntos++;
		} else {
			$("#tooltip-len").removeClass("cumple-req");
			total_puntos == 0 ? 0 : total_puntos--;
		}

		return total_puntos == puntos_requeridos;
	}

	// Si se está editando o coloca cursor en campo
	$("#contrasena").on("keyup focus mouseenter", function (k) {
		contrasenaCumple();

		if ($("#contrasena").val() != '')
			$("#confirma-contrasena").prop('required', true);
		else
			$("#confirma-contrasena").prop('required', false);
	});

	$("#confirma-contrasena").on("keyup focus mouseenter", function (k) {

		if ($("#confirma-contrasena").val() == '') {
			$("#tooltip-confirma").text("");
			return;
		}

		var contra1 = $("#contrasena").val();
		if ($("#confirma-contrasena").val() == contra1 && $("#confirma-contrasena").val() !== '') {
			$("#tooltip-confirma").addClass("cumple-req");
			$("#tooltip-confirma").text("Coinciden");
		} else {
			if ($("#confirma-contrasena").val() !== null) {
				$("#tooltip-confirma").text("No coinciden");
				$("#tooltip-confirma").removeClass("cumple-req");
			}
		}
	});

	// Versión anterior para el manejo de no coincidencia de contraseñas
	$("#confirma-contrasena555").focusout(function () {
		var pass1 = $("#contrasena").val();
		var pass2 = $("#confirma-contrasena").val();

		if (pass1 !== pass2 && pass2 !== "") {
			$("#contrasena").css('border', 'solid red 1px');
			$("#confirma-contrasena").css('border', 'solid red 1px');
			$("#muestra-contrasena").text("");
			$("#error-contrasena").text("Ambas contraseñas deben coincidir.");
		} else {
			if (pass1 === pass2 && pass1 !== "" && pass2 !== "") {
				$("#contrasena").css('border', 'solid green 1px');
				$("#confirma-contrasena").css('border', 'solid green 1px');
				$("#error-contrasena").text("");
			}
		}
	});



	$('#numero_cupo').keyup(function () {
		this.value = (this.value + '').replace(/[^0-9]/g, '');
		if (this.value.length > 2) {
			this.value = '';
		}
		if (this.value == '0')
		{
			this.value = '1';
		}
	});

	$(".select_escuela").change(function () {
		$("#infoEscuela").hide();
		$("#infoNombre").hide();
		$("#ajax").hide();
	});
	$("#btn-central-guardar").click(function () {
		var lengua = $('#seleccion_lengua').val();
		if (lengua == null || lengua == '') {
			lengua = '0';
		}
		var plan = $('#seleccion_plan').val();
		var planNombre = $('#seleccion_plan option:selected').html();
		var grado = $('#seleccion_grado').val();
		var nivelEscolar = $('#nivelEscolarL').html();
		var grupo = $('#seleccion_grupo').val();
		var cupo = $('#numero_cupo').val();
		var status = 1;
		var centrocfg = $('#centcfg_hidden').html();
		var id = grado + "-" + grupo + "-" + cupo + "-" + centrocfg + "-" + nivelEscolar + "-" + plan + "-" + lengua;
		console.log(id);
		var nFilas = $("#tabla tr").length;
		if (cupo == '' || cupo == null) {
			$(".mensaje-c").html('<div class="alert alert-danger" role="alert">Capacidad erroneo o vacio</div>');
		} else {
			$.ajax({
				type: 'POST',
				url: live_url + "index.php/Cct/cct_agrega_grupo/" + id,
				success: function (data) {
					//console.log(data);
					if (data == 'error') {
						//mostrar_nuevo();
						$(".mensaje-c").html('<div class="alert alert-danger" role="alert">Error al ingresar los datos, ya existe algun grado con ese grupo</div>');

						//$('#tabla tr:last').after('<tr id="fila'+data+'-'+nivelEscolar+'"><td>'+(nFilas+1)+'</td><td>'+grado+'</td><td>'+grupo+'</td><td>'+planNombre+'</td><td>'+cupo+'</td><td id="fila'+data+'">Activo</td><th><img src="../../assets/images/eliminar.png" width="25" onclick="borrarFila('+data+')"></th></tr>');
					} else {
						mostrar_nuevo();
						//$(".mensaje-c").html('<div class="alert alert-danger" role="alert">Error al ingresar los datos, ya existe algun grado con ese grupo</div>');
					}
				},
				error: function (data) {

					//$(".mensaje-c").html('<div class="alert alert-danger" role="alert">Error al borrar informacion, algun usuario esta asigando a este grupo</div>');
				}
			});
		}
	});


	$("#btn-busca-ct").click(function () {
		var id = $('#escuelas').val();
		info = id.split("//");
		$("#nombreEscuela").html(info[0]);
		$("#cct").html(info[1]);
		$("#cct").attr("value", info[1]);
		$("#turno").html(info[2]);
		$("#muni").html(info[3]);
		$("#nivelEscolar").html(info[4]);
		$("#centcfg_hidden").html(info[5]);
		$("#infoNombre").show();
		$("#infoEscuela").show();
	});



	$("#btn-central-grupos").click(function () {
		var cct = $("#cct").attr('value');
		var nivelEscolar = $("#nivelEscolar").html();
		var cct = cct + '//' + nivelEscolar;

		var $f = $(this);
		//console.log($f);

		//console.log(cct);
		//console.log($f.data('locked'));
		if ($f.data('locked') != undefined && !$f.data('locked'))
		{

		} else
		{
			$.ajax({
				url: live_url + "index.php/Cct/ver_grupos/" + cct,
				type: "POST",
				//data : { id : 123 },
				success: function (result) {
					$("#ajax").empty();
					$("#ajax").show();
					$("#ajax").html(result);
					//     console.log(result);
				},
				error: function (result) {
					// alert('error');
					// alert(this.url);
				}
			});
		}
	});

	function mostrar_nuevo()
	{
		var cct = $("#cct").attr('value');
		var nivelEscolar = $("#nivelEscolar").html();
		var cct = cct + '//' + nivelEscolar;

		var $f = $(this);

		// console.log(cct);
		// console.log($f.data('locked'));
		if ($f.data('locked') != undefined && !$f.data('locked'))
		{

		} else
		{
			$.ajax({
				url: live_url + "index.php/Cct/ver_grupos/" + cct,
				type: "POST",
				//data : { id : 123 },
				success: function (result) {
					$("#ajax").empty();
					$("#ajax").show();
					$("#ajax").html(result);
					$(".mensaje-c").html('<div class="alert alert-success" role="alert">Datos ingresados correctamente</div>');

				},
				error: function (result) {
					// alert('error');
					// alert(this.url);
				}
			});
		}



	}

	/*
	 *deshabilitar el campo region en la parte de configuracion escuela
	 */
	$("#busqueda_region").prop('enabled', true);

	$(".select-noeditable").bind('contextmenu', function () {
		return false
	});
	$(".select-noeditable").mousedown(function (event) {
		return false;
	});

	// Desactiva mediante JS el campo de nombre de usuario cuando se muestra el
	// formulario de edición de usuario central
	$(".no-editable").on('focus', function (e) {
		e.preventDefault();
		$(this).blur();
	});

	var params_datetimepicker = {
		// format: 'yyyy-mm-dd',
		format: 'dd-mm-yyyy',
		maxView: 4,
		minView: 2,
		todayBtn: true,
		todayHighlight: false,
		initialDate: new Date(),
		language: 'es',
		autoclose: true
	};

	$('.input_inicia').datetimepicker(params_datetimepicker);
	$('.input_expira').datetimepicker(params_datetimepicker);

	$("#busqueda_nombre").keypress(function (e) {
		if (e.which >= 48 && e.which <= 57) {
			e.preventDefault();
			$("#error-busq").empty();
			$("#error-busq").append(" <i>No es posible capturar números para la búsqueda</i>");
			$("#error-busq").css({"color": "red"});
		} else
			$("#error-busq").empty();
	});

	$(".no-sobreespacio").focusout(function () {
		var val_limpio = $(this).val().replace(/(\ {1,})/gi, ' ');
		val_limpio = val_limpio.replace(/ $/, '');
		$(this).val(val_limpio);
	});
});

/**
 * Posibles valores para argumento 'tipo' son: success, info, warning y danger
 * */
function getAlertEstado(texto_mensaje, tipo) {
	$("#estado").html("");
	var clase_tipo = "alert alert-" + tipo;

	var mensaje = $("<div>", {class: clase_tipo, 'role': 'alert', id: 'msg'});
	mensaje.append(texto_mensaje);
	mensaje.append($("<a>", {
		class: 'close',
		href: '',
		'data-dismiss': 'alert',
		'aria-label': 'close'
	}).append('&times;'));

	//$("#estado").fadeTo(ms_tiempo_alerta, 500).slideUp(500, function(){ $("#estado").slideUp(500); });
	return mensaje;
}

function borrarFila(valorFila) {
	var fila = 'fila' + (valorFila);
	var nivelEscolar = $('#nivelEscolar').html();
	$(".borra_grupo").attr("value", valorFila + "-" + nivelEscolar);
	$('#modalgrupo').modal({
		backdrop: 'static', keyboard: false
	});
}


function activarGrupo(valorFila) {
	var fila = 'fila' + (valorFila);
	var nivelEscolar = $('#nivelEscolar').html();
	$(".activa_grupo").attr("value", valorFila + "-" + nivelEscolar);
	$('#modalgrupo_activa').modal({
		backdrop: 'static', keyboard: false
	});
}
