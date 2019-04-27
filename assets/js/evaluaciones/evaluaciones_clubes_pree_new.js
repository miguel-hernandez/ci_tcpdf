/* jshint esversion: 6 */

$(document).on('keypress','.eval_x_alumno_club',function(e) {
  let elemento = this;

  Evaluaciones_utils.limpia_clases(this);

  if(e.which == 13 && !$(this).prop('disabled')) {
    e.preventDefault();
    e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

    let idexpediente = parseInt($(this).data('idexpediente'));

    let idgrupo_club = parseInt($(this).data('idgrupo_club'));

    let periodo = parseInt($(this).data('periodo'));

    let calificacion = $(this).val();

    if(Evaluaciones_utils.valida_observacion(calificacion)){
      Evaluaciones_club.save_observacion_gclub(idexpediente, idgrupo_club, periodo, calificacion, this);
    }else{
      Helpers.alert("Valor no permitido", "error");
      Evaluaciones_utils.retoma_foco(elemento);
    }
  }
});



let Evaluaciones_club = {

  save_observacion_gclub : (idexpediente, idgrupo_club, periodo, calificacion, elemento) => {
    $.ajax({
      url:base_url+"Evaluaciones/save_observacion_gclub",
      method:"POST",
      data:{
        'idexpediente' : idexpediente,
        'idasignatura_aut' : $("#itxt_evals_asigs_autonomia_idasig").val(),
        'idgrupo_club' : idgrupo_club,
        'periodo' : periodo,
        'calificacion' : calificacion
      },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        if(data.result){
          Evaluaciones_utils.agrega_clase(elemento, true);
          $(".eval_x_alumno_club_aux").each(function() {
            if( ($(this).data('periodo') == periodo) && ($(this).data('idgrupo_club') == idgrupo_club) ){
              let nivel_desempeno = Evaluaciones_utils.get_nivel_desempeno_xcalificacion('AUT', calificacion);
              $(this).val(nivel_desempeno);
            }
          });
          $(elemento).blur();
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
  }

};
