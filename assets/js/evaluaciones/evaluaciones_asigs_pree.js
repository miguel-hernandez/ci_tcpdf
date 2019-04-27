/* jshint esversion: 6 */

$(document).on('keypress','.eval_observaciones_x_alumno_asig',function(e) {
  let elemento = this;
  if(e.which == 13 && !$(this).prop('disabled')) {
    e.preventDefault();
    e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

      if(!Evaluaciones_utils.valida_observacion($(this).val())){
        Helpers.alert("La observación sólo debe contener letras, números, puntos y comas", "error");
        Evaluaciones_utils.retoma_foco(elemento);
      }else{

        let idexpediente = parseInt($(this).data('idexpediente'));

        let idasignatura = parseInt($(this).data('idasignatura'));

        let periodo = parseInt($(this).data('periodo'));

        let observacion = $(this).val();
        Evaluaciones_asig.save_observacion(idexpediente, idasignatura, periodo, observacion, this);
      }
  }// e.which
});

$(document).on('keypress','.eval_x_alumno_asig',function(e) {
  let elemento = this;
    Evaluaciones_asig.limpia_clases($(this));
    if(e.which == 13 && !$(this).prop('disabled')) {
      e.preventDefault();
      e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

      let idexpediente = parseInt($(this).data('idexpediente'));

      let idasignatura = parseInt($(this).data('idasignatura'));

      let idsegmento = parseInt($(this).data('idsegmento'));

      let periodo = parseInt($(this).data('periodo'));

      let calificacion = $(this).val();

      let componente_curricular = $(this).data('tipo_asignatura');

       if(Evaluaciones_utils.valida_captura_xcomponentecurricular(componente_curricular, calificacion)){
          Evaluaciones_asig.save_evaluacion(idexpediente, idasignatura, idsegmento, periodo, calificacion, componente_curricular, this);
          // $(this).blur();
       }else{
         Helpers.alert("Valor no permitido", "error");
         Evaluaciones_utils.retoma_foco(elemento);
       }
    }
});


let Evaluaciones_asig = {
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
           $(elemento).addClass('text-success');
            $(elemento).blur();
            Evaluaciones_asig.set_focus_next(elemento);
         }else{
           $(elemento).addClass('text-fail');
         }
       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  },

  // INASISTENCIAS PRIM
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
           Evaluaciones_asig.set_focus_next(elemento);

         }else{
           $(elemento).addClass('text-fail');
         }
       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  },

  save_evaluacion : (idexpediente, idasignatura, idsegmento, periodo, calificacion, componente_curricular, elemento) => {
    $.ajax({
       url:base_url+"Evaluaciones/save_evaluacion_asig",
       method:"POST",
       data:{
         'idexpediente' : idexpediente,
         'idasignatura' : idasignatura,
         'idsegmento' : idsegmento,
         'periodo' : periodo,
         'calificacion' : calificacion,
         'componente_curricular' : componente_curricular
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         if(data.result){
           Evaluaciones_asig.save_evaluacion_success(calificacion, elemento);
           let array_promedio_periodo = data.array_promedio_periodo;
           Evaluaciones_asig.alimenta_campos_promedio_periodo(array_promedio_periodo,elemento);
           if(periodo == 3){
             let array_promedio_final = data.array_promedio_final;
             Evaluaciones_asig.alimenta_campos_promedio_final(array_promedio_final,elemento);
           }
         }else{
           Evaluaciones_asig.save_evaluacion_error(elemento);
         }
       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  },

  save_evaluacion_success : (calificacion, elemento) => {
    // PONEMOS COLOR VERDE AL INPUT
    $(elemento).addClass('text-success');
    let componente_curricular = $(elemento).data('tipo_asignatura');


    // PONEMOS EL NIVEL DE DESEMPEÑO EN EL VECINO DE LA DERECHA
    let nivel_desempeno = Evaluaciones_utils.get_nivel_desempeno_xcalificacion(componente_curricular, calificacion);

    let idasignatura = $(elemento).data('idasignatura');
    let idsegmento = $(elemento).data('idsegmento');
    let periodo = $(elemento).data('periodo');

    $(".eval_x_alumno_asig_aux").each(function() {
      let idasignatura_ = $(this).data('idasignatura');
      let idsegmento_ = $(this).data('idsegmento');
      let periodo_ = $(this).data('periodo');
      if( idasignatura_ == idasignatura && idsegmento_ == idsegmento && periodo_ == periodo){
          $(this).val(nivel_desempeno);
      }
    });

    Evaluaciones_asig.set_focus_next(elemento);
  },

  save_evaluacion_error : (elemento) => {
    $(elemento).addClass('text-fail');
  },

  limpia_clases : (elemento) => {
      let clases_existentes='text-success text-fail';
      elemento.removeClass( clases_existentes );
  },

  alimenta_campos_promedio_periodo : (array_promedio_periodo,elemento) => {
    let periodo_input = $(elemento).data('periodo');
    let idasignatura = $(elemento).data('idasignatura');

      $(".prom_x_periodo").each(function(index) {
        if( $(this).data('periodo') == periodo_input ){
          if( $(this).data('idasignatura') == idasignatura ){
            $(this).val(array_promedio_periodo.promedio);
          }
        }
      });
      $(".prom_x_periodo_aux").each(function(index) {
        if( $(this).data('periodo') == periodo_input ){
          if( $(this).data('idasignatura') == idasignatura ){
            $(this).val(array_promedio_periodo.nivel_desempeno);
          }
        }
      });

  },

  alimenta_campos_promedio_final : (array_promedio_final,elemento) => {
    let idexpediente = $(elemento).data('idexpediente');
    let idasignatura = $(elemento).data('idasignatura');

      $(".eval_promedio_final").each(function(index) {
        if( $(this).data('idexpediente') == idexpediente ){
          if( $(this).data('idasignatura') == idasignatura ){
            $(this).html(array_promedio_final.promedio);
          }
        }
      });

      $(".eval_nivel_desempeno_final").each(function(index) {
        if( $(this).data('idexpediente') == idexpediente ){
          if( $(this).data('idasignatura') == idasignatura ){
            $(this).html(array_promedio_final.nivel_desempeno);
          }
        }
      });

  },

  set_focus_next : (elemento) => {
    let periodo = $(elemento).data('periodo');
    let campo = 'itxt_evalxalumno_focus_periodo'+periodo;
    let focus = $(elemento).data('focus');


    let str_focus = $("#"+campo).val();

    let array_focus = str_focus.split(",");

    let foco_actual = $(elemento).data('focus');

    let index =  array_focus.indexOf(foco_actual);

    let foco_sig = array_focus[index+1];

    $(".eval_observaciones_x_alumno_asig").each(function() {
      if( $(this).data('focus')==foco_sig ){
        $(this).focus();
        $(this).select();
      }
    });

    $(".eval_observaciones_x_alumno_club").each(function() {
      if( $(this).data('focus')==foco_sig ){
        $(this).focus();
        $(this).select();
      }
    });

    $(".eval_x_alumno_asig").each(function() {
      if( $(this).data('focus')==foco_sig ){
        $(this).focus();
        $(this).select();
      }
    });

    // AUTONOMIA
    $(".eval_x_alumno_club").each(function() {
      if( $(this).data('focus')==foco_sig ){
        $(this).focus();
        $(this).select();
      }
    });
    $(".eval_inasistencias_pree").each(function() {
      if( $(this).data('focus')==foco_sig ){
        $(this).focus();
        $(this).select();
      }
    });
  }

};
