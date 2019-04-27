$(document).ready(function () {
	$("#arr_users").hide();
	arr_users = JSON.parse($("#arr_users").html());

	jQuery.validator.addMethod("existe_usuario", function (value, element) {
		var valueok = (value+$("#user_cct").val()).toUpperCase();
		for(var m=0;m<arr_users.length;m++){
			if(arr_users[m]['username'] == valueok){
				return false;
			}
		}
		return true;
	}, " *El usuario ya existe");

	jQuery.validator.addMethod("valida_usuario", function (value, element) {
		return (/^[A-Za-z0-9ñÑ]{3,15}$/.test(value));
	}, " *Usuario no válido");


	jQuery.validator.addMethod("valida_contrasena", function (value, element) {
		return (/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{10,50}$/.test(value));
	}, " *Contraseña no válida");

	jQuery.validator.addMethod("solo_alfabetico", function (value, element) {
		return (/^[a-zA-ZáéíóúñÑ ]*$/.test(value));
	}, " *No válido");

	jQuery.validator.addMethod("contrasenas_iguales", function (value, element) {
		var c_confirma = $("#confirma-contrasena").val();
		if (value == c_confirma)
			return true;
		else
			return false;
	}, " *Las contraseñas deben ser iguales");

	jQuery.validator.addMethod("no_user_admin", function (value, element) {
		var c_confirma = $("#confirma-contrasena").val();
		if (value.indexOf("admin") > -1 || value.indexOf("ADMIN") > -1)
			return false;
		else
			return true;
	}, " *No se admite usuario");

	var id_usuario = $("input[name=id_usuario]").val();
	if (id_usuario == 0) { // Es nuevo usuario, ponemos todos las validaciones
		$("#form-nuevo-usuario").validate({
			onclick: false, onfocusout: false, onkeypress: false, onkeydown: false, onkeyup: false,
			rules: {
				nombre: {required: true, solo_alfabetico: true},
				paterno: {required: true, solo_alfabetico: true},
				materno: {solo_alfabetico: true},
				usuario: {required: true, valida_usuario: true, existe_usuario:true},
				contrasena: {required: true, minlength: 10, maxlength: 50, valida_contrasena: true, contrasenas_iguales: true}
			},
			messages: {
				nombre: {required: " *es requerido"},
				paterno: {required: " *es requerido"},
				usuario: {required: " *es requerido"},
				contrasena: {required: " *es requerido", minlength: " *Mínimo 10 caracteres", maxlength: " *Máximo 50 caracteres"}
			}
		});
	} else {
		$("#form-nuevo-usuario").validate({
			onclick: false, onfocusout: false, onkeypress: false, onkeydown: false, onkeyup: false,
			rules: {
				nombre: {required: true, solo_alfabetico: true},
				paterno: {required: true, solo_alfabetico: true},
				materno: {solo_alfabetico: true},
				contrasena: {contrasenas_iguales: true}
			},
			messages: {
				nombre: {required: " *es requerido"},
				paterno: {required: " *es requerido"}
			}
		});
	}

});

$("#nombre").keyup(function (e) {
	valida_solo_letras($("#nombre").val(), "nombre");
});

$("#paterno").keyup(function (e) {
	valida_solo_letras($("#paterno").val().trim(), "paterno");
});

$("#materno").keyup(function (e) {
	valida_solo_letras($("#materno").val(), "materno");
});

 $("#usuario").keyup(function(e){
 	var valor = $("#usuario").val().trim();
 	if (valor.indexOf("admin") > -1 || valor.indexOf("ADMIN") > -1){
 		// alert("Usuario no valido");
 		$("#label_user").html("*Usuario no valido");
 		$("#usuario").val("");
 	}else{
 		$("#label_user").html("");
 	}
 });
function valida_solo_letras(cadena, id_campo) {
	if (/^[a-zA-ZáéíóúñÑ ]*$/.test(cadena)) {
	} else {
		alert("Carácter no permitido");
		$("#" + id_campo).val(cadena.substring(0, cadena.length - 1));
	}
}// valida_solo_letras()

$("#btn-central-guardar_1").click(function (e) {
	e.preventDefault();
	$("#form-nuevo-usuario").submit();
});
