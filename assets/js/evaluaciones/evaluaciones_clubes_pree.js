
$(document).on('keypress','.eval_x_alumno_club',function(e) {
    var elemento = this;

    Evaluaciones_club.limpia_clases($(this));

    if(e.which == 13 && !$(this).prop('disabled')) {
      e.preventDefault();
      e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

        var idexpediente = parseInt($(this).data('idexpediente'));
        // console.info("idexpediente: "+idexpediente);

        var idgrupo_club = parseInt($(this).data('idgrupo_club'));
        // console.info("idgrupo_club: "+idgrupo_club);

       var periodo = parseInt($(this).data('periodo'));
       // console.info("periodo: "+periodo);

       // var calificacion = parseInt($(this).val());
       var calificacion = $(this).val();
       // console.info("calificacion: "+calificacion);
       // return false;
       if(calificacion == '' || calificacion == 1 || calificacion == 2 || calificacion == 3 || calificacion == 4){
          Evaluaciones_club.save_evaluacion(idexpediente, idgrupo_club, periodo, calificacion, this);
       }else{
         bootbox.alert({
             message: "<br><b>Valor no permitido</b>",
              size: 'small',
             callback: function () { Evaluaciones_utils.retoma_foco(elemento); }
         });

       }
    }
});

$(document).on('keypress','.eval_observaciones_x_alumno_club',function(e) {
  var elemento = this;

  if(e.which == 13 && !$(this).prop('disabled')) {
    e.preventDefault();
    e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

      if(!Evaluaciones_utils.valida_observacion($(this).val())){
        bootbox.alert({
            message: "<br><b>La observación sólo debe contener letras, números, puntos y comas</b>",
            size: 'small',
            callback: function () { Evaluaciones_utils.retoma_foco(elemento); }
        });
      }else{
        var idexpediente = parseInt($(this).data('idexpediente'));
        // console.info("idexpediente: "+idexpediente);
        var idgrupo_club = parseInt($(this).data('idgrupo_club'));
        // console.info("idgrupo_club: "+idgrupo_club);
       var periodo = parseInt($(this).data('periodo'));
       // console.info("momento: "+momento);
       var observacion = $(this).val();
       // console.info("observacion: "+observacion);
       Evaluaciones_club.save_observacion(idexpediente, idgrupo_club, periodo, observacion, this);

      }

  }// e.which
});

$(document).on('keypress','.eval_inasistencias_pree',function(e) {
  var elemento = this;
    if(e.which == 13 && !$(this).prop('disabled')) {
      e.preventDefault();
      e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

      var idexpediente = parseInt($(this).data('idexpediente'));
      // console.info("idexpediente: "+idexpediente);

      var idgrupo = parseInt($(this).data('idgrupo'));
      // console.info("idgrupo: "+idgrupo);

       var periodo = parseInt($(this).data('periodo'));
       // console.info("periodo: "+periodo);

       var inasistencias = $(this).val();
       // console.info("inasistencias: "+inasistencias);

       if(Evaluaciones_utils.valida_solo_numerico(inasistencias)){
         if(inasistencias <= 70){
           Evaluaciones_asig.save_inasistencias_prim(idexpediente, idgrupo, periodo, inasistencias, this);
         }else{
           bootbox.alert({
               message: "<br><b>No es posible capturar más de 70 inasistencias</b>",
               size: 'small',
               callback: function () { Evaluaciones_utils.retoma_foco(elemento); }
           });
         }
       }
       else{
         bootbox.alert({
             message: "<br><b>Valor no permitido</b>",
             size: 'small',
             callback: function () { Evaluaciones_utils.retoma_foco(elemento); }
         });
       }

    }
});




var Evaluaciones_club = {

  get_nivel_xcalificacion : function(cal){
    cal = parseInt(cal);
    nivel = '';
    switch (cal) {
      case 1:
        nivel = 'I';
      break;
      case 2:
        nivel = 'II';
      break;
      case 3:
        nivel = 'III';
      break;
      case 4:
        nivel = 'IV';
      break;
    }
    return nivel;
  },


  save_evaluacion : function(idexpediente, idgrupo_club, periodo, calificacion, elemento){
    $.ajax({
       url:base_url+"Evaluaciones/save_evaluacion",
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
           Evaluaciones_club.save_evaluacion_success(calificacion, elemento);
           var array_promedio = data.array_promedio_periodo;
            // var array_promedio_final = data.array_promedio_final;

           Evaluaciones_club.alimenta_campos_promedio(array_promedio,elemento);
           if(periodo == 3){
             var array_promedio_final = data.array_promedio_final;
             Evaluaciones_asig.alimenta_campos_promedio_final(array_promedio_final,elemento);
           }
         }else{
           Evaluaciones_club.save_evaluacion_error(elemento);
         }
       },
       error: function(xhr){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

  save_evaluacion_success : function(calificacion, elemento){
    $(elemento).addClass('text-success');
    var nivel = Evaluaciones_club.get_nivel_xcalificacion(calificacion);
    // console.info("nivel: "+nivel);
    var index = $(elemento).data('index');
    $(".aux_index_"+index).val(nivel);
    // $(elemento).blur();
    Evaluaciones_club.set_focus_next(elemento);
  },

  save_evaluacion_error : function(elemento){
    $(elemento).addClass('text-fail');
    $(elemento).val('');
  },

  limpia_clases : function(elemento){
      var clases_existentes='text-success text-fail';
      elemento.removeClass( clases_existentes );

  },

  set_focus_next : function(elemento){
    Evaluaciones_asig.set_focus_next(elemento);
  },


  // OBSERVACIONES
  save_observacion : function(idexpediente, idgrupo_club, periodo, observacion, elemento){
    $.ajax({
       url:base_url+"Evaluaciones/save_observacion",
       method:"POST",
       data:{
         'idexpediente' : idexpediente,
         'periodo' : periodo,
         'observacion' : observacion,
         'idasignatura' : $("#itxt_evals_asigs_autonomia_idasig").val()
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
       error: function(xhr){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

  // PROMEDIOS
  alimenta_campos_promedio : function(array_promedio_periodo,elemento){
    // console.info("array_promedio_periodo");
    // console.info(array_promedio_periodo);
    var periodo_input = $(elemento).data('periodo');

      $(".prom_x_alumno").each(function(index) {
        if( $(this).data('periodo')==periodo_input ){
          if(array_promedio_periodo.promedio_periodo == 1 ||
            array_promedio_periodo.promedio_periodo == 2 ||
            array_promedio_periodo.promedio_periodo == 3 ||
            array_promedio_periodo.promedio_periodo == 4
          ){
            $(this).val(array_promedio_periodo.promedio_periodo);
          }else{
              $(this).val('-');
          }
        }
      });

      $(".prom_x_alumno_aux").each(function(index) {
        if( $(this).data('periodo')==periodo_input ){
          if(array_promedio_periodo.nivel_desempeno == 'I' ||
            array_promedio_periodo.nivel_desempeno == 'II' ||
            array_promedio_periodo.nivel_desempeno == 'III' ||
            array_promedio_periodo.nivel_desempeno == 'IV'
          ){
            $(this).val(array_promedio_periodo.nivel_desempeno);
          }else{
            $(this).val('-');
          }

        }
      });
  }

};
