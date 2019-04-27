$("#btn_unificador_grabar").click(function(e){
    e.preventDefault();
    var vector = Obj_unificador.getfusionexpediente();
      if(vector[0] !== false){
        obj_unificador_evals = new Unificador_evals();
        obj_unificador_movs = new Unificador_movs();
        obj_unificador_docs = new Unificador_docs();
        // var evals_boolean = obj_unificador_evals.get_arr_evals();
        obj_unificador_evals.get_arr_evals();
        obj_unificador_movs.get_arr_movs();
        obj_unificador_docs.get_arr_docs();
        // if(evals_boolean){
        if(obj_unificador_evals.valid_act && obj_unificador_evals.valid_his && obj_unificador_evals.valid_ext){
          unificar(vector,obj_unificador_evals.array_evals,obj_unificador_movs.array_movs,obj_unificador_docs.array_docs);
        }
      }else{
        obj_notification.get_notification("error","Seleccione una fila de expediente por favor");
      }


});


function unificar(arr_expedientes,arr_evals,arr_movs,arr_docs){
  var mi_Objecto = new Object();
  // console.table(arr_movs);
  mi_Objecto['arr_expedientes'] = arr_expedientes;
  mi_Objecto['arr_evals'] = arr_evals;
  mi_Objecto['arr_movs'] = arr_movs;
  mi_Objecto['arr_docs'] = arr_docs;

  var arr_unificador = jQuery.makeArray(mi_Objecto);
   // console.log(arr_unificador);

  $.ajax({
 		url:base_url+"/Unificador/unificar",
 		data: {"arr_unificador": arr_unificador,
          'existe_evals_act':$("#existe_evals_act").val(),
          'existe_evals_his':$("#existe_evals_his").val(),
          'existe_evals_ext':$("#existe_evals_ext").val()
        },
    type:"POST",
 		beforeSend: function(xhr) {
 			$("#wait").modal("show");
 		},
 		success:function(data){
 			$("#wait").modal("hide");
      if (data.result) {
        obj_notification.get_notification("success","Se realizó la unificación de los registros correctamente.");
        location.reload();
      }
      else {
        obj_notification.get_notification("error","Error en el proceso de unificación, intente nuevamente por favor.");
      }
 			console.log(data.result);

 		},
 		error: function(error){
      $("#wait").modal("hide");
 			console.error(error);
 		}
 	});

}
