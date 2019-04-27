/* jshint esversion: 6 */

$(document).on('keypress','.eval_observaciones_x_asignatura',function(e) {
  let elemento = this;

  Evaluaciones_utils.limpia_clases(this);

  if(e.which == 13 && !$(this).prop('disabled')) {
     e.preventDefault();
     e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

     let idexpediente = parseInt($(this).data('idexpediente'));
     let idasignatura = parseInt($(this).data('idasignatura'));
     let periodo = parseInt($(this).data('periodo'));
     let observacion = $(this).val();

     if(Evaluaciones_utils.valida_observacion(observacion)){
        Evaluaciones_xasignatura.save_observacion(idexpediente, idasignatura, periodo, observacion, this);
     }else{
       Helpers.alert("La observación sólo debe contener letras, números, puntos y comas", "error");
       Evaluaciones_utils.retoma_foco(elemento);
    }
  }// e.which
});



let Evaluaciones_xasignatura = {
  // OBSERVACIONES
  save_observacion : (idexpediente, idasignatura, periodo, observacion, elemento) => {
    $.ajax({
       url:base_url+"Evaluaciones/save_observacion",
       method:"POST",
       data:{
         'idexpediente' : idexpediente,
         'idasignatura' : idasignatura,
         'periodo' : periodo,
         'observacion' : observacion
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         if(data.result){
           Evaluaciones_utils.agrega_clase(elemento, true);
            Evaluaciones_xasignatura.set_focus_next(elemento);
         }else{
           Evaluaciones_utils.agrega_clase(elemento, false);
           Evaluaciones_utils.retoma_foco(elemento);
           Evaluaciones_utils.selecciona_elemento(elemento);
         }
       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
         Evaluaciones_utils.agrega_clase(elemento, false);
         Evaluaciones_utils.retoma_foco(elemento);
         Evaluaciones_utils.selecciona_elemento(elemento);
       }
     });
  },

  set_focus_next : (elemento) => {
    let periodo = $(elemento).data('periodo');
    let campo = 'itxt_evalxasig_focus_periodo'+periodo;
    let focus = $(elemento).data('focus');


    let str_focus = $("#"+campo).val();

    let array_focus = str_focus.split(",");

    let foco_actual = $(elemento).data('focus');

    let index =  array_focus.indexOf(foco_actual);

    let foco_sig = array_focus[index+1];

    $(".eval_observaciones_x_asignatura").each(function() {
      if( $(this).data('focus')==foco_sig ){
        $(this).focus();
        $(this).select();
      }
    });

  }

};
