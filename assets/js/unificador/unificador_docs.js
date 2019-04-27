
function Unificador_docs(){
	_thisunificador_docs = this;
  _thisunificador_docs.array_docs = new Object();
}


Unificador_docs.prototype.get_arr_docs = function(){
  var arr_docs = [];
  var continuar_docs = false;
  $("#unificador_docs table tr").each(function () {
    // console.info(this);
    $(this).children("td").each(function (index)
    {
      if (index==0) {
        var arr_docs_aux = new Object();
        var iddocs = $(this).data("iddoc");
				var ciclodoc = $(this).data("ciclodoc");
        var input_div = $(this).children("div");
        var input_label = $(input_div).children("label");
        var input_check = $(input_label).children("input");
        var estatus_docs = ($(input_check).prop('checked'))?1:0;
        continuar_docs = (estatus_docs == 1)?true:continuar_docs;
        arr_docs_aux["iddocs"] = iddocs;
        arr_docs_aux["estatus"] = estatus_docs;
				arr_docs_aux["ciclo"] = ciclodoc;
        arr_docs.push(arr_docs_aux);
				continuar_docs = true;
      }
    })
  });
   // console.log(arr_docs);
	 if ($.isEmptyObject(arr_docs)) {
	 	_thisunificador_docs.array_docs = [1];
	 }
	 else {
	 	_thisunificador_docs.array_docs = arr_docs;
	 }


};
