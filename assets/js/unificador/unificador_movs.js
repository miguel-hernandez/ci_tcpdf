function Unificador_movs(){
	_thisunificador_movs = this;
  _thisunificador_movs.array_movs = new Object();
}

Unificador_movs.prototype.get_arr_movs = function(){
  var arr_movs = [];
  var continuar_movs = false;
  $("#unificador_movs table tr").each(function () {
    // console.info(this);
    $(this).children("td").each(function (index)
    {
      if (index==0) {
        var arr_movs_aux = new Object();
        var idmovs = $(this).data("idmov");
				var nivel = $(this).data("nvmov");
        var input_div = $(this).children("div");
        var input_label = $(input_div).children("label");
        var input_check = $(input_label).children("input");
        var estatus_movs = ($(input_check).prop('checked'))?1:0;
        continuar_movs = (estatus_movs == 1)?true:continuar_movs;
        arr_movs_aux["idmovs"] = idmovs;
        arr_movs_aux["estatus"] = estatus_movs;
				arr_movs_aux["nivel"] = nivel;
        arr_movs.push(arr_movs_aux);
				continuar_movs = true;
      }
    })
  });
  // console.log(arr_movs);
			if ($.isEmptyObject(arr_movs)) {
				_thisunificador_movs.array_movs = [1];
			}
			else {
				_thisunificador_movs.array_movs = arr_movs;
			}



};
