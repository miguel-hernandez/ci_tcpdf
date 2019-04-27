function Unificador_evals(){
	_thisunificador_evals = this;
	_thisunificador_evals.array_evals = new Object();
	_thisunificador_evals.valid_act = false;
	_thisunificador_evals.valid_his = false;
	_thisunificador_evals.valid_ext = false;
}

Unificador_evals.prototype.get_arr_evals_tipo = function(tipo){
	var arr_evals = [];
  var continuar_evals = false;
	var cont = 0;

	$("#"+tipo+" table tr").each(function () {
		$(this).children("th").each(function (){
			var arr_evals_aux = new Object();
			var idexpediente = $(this).data("idexpediente");
			var nivel = $(this).data("nivel");
			var ciclo = $(this).data("ciclo");
			var tipo_tabla = $(this).data("tipo_tabla");

				if(typeof idexpediente != "undefined"){
					var input_div = $(this).children("div");
					var input_label = $(input_div).children("label");
					var input_radio = $(input_label).children("input");

					var estatus_expediente = ($(input_radio).prop('checked'))?1:0;
					continuar_evals = (estatus_expediente == 1)?true:continuar_evals;
					arr_evals_aux["idexpediente"] = idexpediente;
					arr_evals_aux["estatus"] = estatus_expediente;
					arr_evals_aux["nivel"] = nivel;
					arr_evals_aux["ciclo"] = ciclo;
					arr_evals_aux["tipo_tabla"] = tipo_tabla;

					arr_evals[cont] = arr_evals_aux;
					cont++;
				}

				if(!continuar_evals){
					arr_evals = new Object();;
		    }

    });
  });

	return arr_evals;
};


Unificador_evals.prototype.get_arr_evals = function(){

	var existe_evals_act = $("#existe_evals_act").val();
	var existe_evals_his = $("#existe_evals_his").val();
	var existe_evals_ext = $("#existe_evals_ext").val();

	if(existe_evals_act == 1){
		var arr_aux1 = _thisunificador_evals.get_arr_evals_tipo('evals_act');
		if(Object.keys(arr_aux1).length === 0){// length  objects js
			obj_notification.get_notification("error","Debe seleccionar un alumno en evaluaciones actuales");
			_thisunificador_evals.valid_act = false;
			return false;
		}else{
			_thisunificador_evals.array_evals[0] = arr_aux1;
			_thisunificador_evals.valid_act = true;
		}
	}else{
		_thisunificador_evals.array_evals[0] = new Object();
		_thisunificador_evals.valid_act = true;
	}

	if(existe_evals_his == 1){
		var arr_aux2 = _thisunificador_evals.get_arr_evals_tipo('evals_his');
		if(Object.keys(arr_aux2).length === 0){
			obj_notification.get_notification("error","Debe seleccionar un alumno en evaluaciones históricas");
			_thisunificador_evals.valid_his = false;
			return false;
		}else{
			_thisunificador_evals.array_evals[1] = arr_aux2;
			_thisunificador_evals.valid_his = true;
		}
	}else{
		_thisunificador_evals.array_evals[1] = new Object();
		_thisunificador_evals.valid_his = true;
	}

	if(existe_evals_ext == 1){
		var arr_aux3 = _thisunificador_evals.get_arr_evals_tipo('evals_ext');
		if(Object.keys(arr_aux3).length === 0){
			obj_notification.get_notification("error","Debe seleccionar un alumno en evaluaciones ext");
			_thisunificador_evals.valid_ext = false;
			return false;
		}else{
			_thisunificador_evals.array_evals[2] = arr_aux3;
			_thisunificador_evals.valid_ext = true;
		}
	}else{
		_thisunificador_evals.array_evals[2] = new Object();
		_thisunificador_evals.valid_ext = true;
	}

};
