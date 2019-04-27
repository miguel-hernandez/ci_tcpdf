$(document).ready(function () {
	$("#checartodos").click(function () {
		$("#button-grupos-text").text("");
		if ($(this).prop('checked')) {
			$('.seleccion').prop('checked', true);
			$("#button-grupos-text").text("- Todos -");
		}
		else{
			$('.seleccion').prop('checked', false);
		}
		$("#botonalumno").prop("disabled", true);
		$("input.check").prop("disabled", true);
	});

	$("#checartodos-alumnos").click(function () {
		$("#botonalumno").text("");
		if ($(this).prop('checked')) {
			$("#todos_select").val("todititos");
			$('.seleccionalum').prop('checked', true);
			$("#botonalumno").text("- Todos -");
		}
		else{
			$("#todos_select").val("");
			$('.seleccionalum').prop('checked', false);
		}
	});

	var s = $("input.seleccion[type='checkbox']:checked");
	var stra = new Array();
	for (var j = 0; j < s.length; j++) {
		stra.push($($(s[j]).parent()).text());
	}
	$("#button-grupos-text").text(stra.join());

	function onclickgrupo() {
		var s = $("input.seleccion[type='checkbox']:checked");
		var temp = new Array();
		var eles = new Array();
		for (var i = 0; i < s.length; i++) {
			temp.push($(s[i]).val());
			eles.push(s[i]);
		}
		if (temp.length > 0) {
			var stra = new Array();
			for (var j = 0; j < eles.length; j++) {
				stra.push($($(eles[j]).parent()).text());
			}
			$("#button-grupos-text").text(stra.join());
		}
		else {
			$("#button-grupos-text").text("- Seleccionar -");
		}

		if (temp.length >= 2) {
			//deshabilitamos
			$("#botonalumno").prop("disabled", true);
			$("input.check").prop("disabled", true);
			$("#botonalumno").text("");

		}
		else {
			if (temp.length == 1) {
				$("#botonalumno").prop("disabled", false);
				$("input.check").prop("disabled", false);
				$("#botonalumno").text("");
				$('#alumno-grupo').empty();

				//habilitamos grupo
				$.ajax({
					url: live_url + "index.php/Mensajes/obtieneAlumnos/" + temp[0],
					type: "POST",
					success: function (result) {
						if (result != '') {
							$('#alumno-grupo').empty();
							$('#alumno-grupo').append(result);
							//marcamos los seleccionados

							var p = $('#alumno-grupo').find("input[type='checkbox']");
							var defs = $("#defaultvaluealumnos").val();
							var arrpredef = defs.split(",");
							var arr = new Array();

							for (var i = 0; i < p.length; i++) {
								var valor = $(p[i]).val();
								for (var j = 0; j < arrpredef.length; j++) {
									if (valor == arrpredef[j]) {
										$(p[i]).prop('checked', true);
										arr.push($($(p[i]).parent()).text());
									}
								}
							}
							$("#botonalumno").text(arr.join());
							$(".seleccionalum").click(function () {
								var arr = new Array();
								var s = $("input.seleccionalum[type='checkbox']:checked");
								for (var j = 0; j < s.length; j++) {
									arr.push($($(s[j]).parent()).text());
								}

								$("#alumno-grupo li input").each(function () {
									if ($(this).prop('checked') == true) {
										$("#checartodos-alumnos").prop('checked', false);
									}
								});

								$("#botonalumno").text(arr.join());

							});
						}
					},
					error: function (result) {

						console.log(result);
					}
				});
			}
			else {
				$("#botonalumno").text("- Seleccionar -");
			}
		}
	}// onclickgrupo()


	$(".seleccion").click(function () {
		onclickgrupo();
	});

	onclickgrupo();
	$(".ids li").each(function () {
		alert($(".ids").text());
	});

});
