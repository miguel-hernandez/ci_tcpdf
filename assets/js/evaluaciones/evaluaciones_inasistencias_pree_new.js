/* jshint esversion: 6 */

$(document).on('keypress','.eval_inasistencias_pree',function(e) {
  let elemento = this;
    if(e.which == 13 && !$(this).prop('disabled')) {
      e.preventDefault();
      e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

      let idexpediente = parseInt($(this).data('idexpediente'));

      let idgrupo = parseInt($(this).data('idgrupo'));

       let periodo = parseInt($(this).data('periodo'));

       let inasistencias = $(this).val();

       if(Evaluaciones_utils.valida_solo_numerico(inasistencias)){
         if(inasistencias <= 70){
           Evaluaciones_inasistencias_pree.save_inasistencias_prim(idexpediente, idgrupo, periodo, inasistencias, this);
         }else{
           Helpers.alert("No es posible capturar más de 70 inasistencias", "error");
           Evaluaciones_utils.retoma_foco(elemento);
         }
       }
       else{
         Helpers.alert("Valor no permitido", "error");
         Evaluaciones_utils.retoma_foco(elemento);
       }

    }
});


let Evaluaciones_inasistencias_pree = {

  save_inasistencias_prim : (idexpediente, idgrupo, periodo, inasistencias, elemento) => {
    $.ajax({
       url:base_url+"Evaluaciones/save_inasistencias_prim",
       method:"POST",
       data:{
         'idexpediente' : idexpediente,
         'idgrupo' : idgrupo,
         'periodo' : periodo,
         'inasistencias' : inasistencias
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         if(data.result){
           $(elemento).addClass('text-success');
           $(elemento).blur();

         }else{
           $(elemento).addClass('text-fail');
         }
       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  }

};
