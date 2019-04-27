$(document).on('keypress','.eval_x_asignatura_alumno_club',function(e) {
  var elemento = this;
    Evaluaciones_club_asignatura.limpia_clases($(this));

    if(e.which == 13 && !$(this).prop('disabled')) {
      e.preventDefault();
      e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

        var idexpediente = parseInt($(this).data('idexpediente'));
        // console.info("idexpediente: "+idexpediente);

        var idgrupo_club = parseInt($("#slc_evaluaciones_idgrupo").val());
        // console.info("idgrupo_club: "+idgrupo_club);

       var periodo = parseInt($("#slt_periodo_asignatura").val());
       // console.info("periodo: "+periodo);

       // var calificacion = parseInt($(this).val());
       var calificacion = $(this).val();
       // console.info("calificacion: "+calificacion);
       // return false;
       if(calificacion == '' || calificacion == 1 || calificacion == 2 || calificacion == 3 || calificacion == 4){
          Evaluaciones_club_asignatura.save_evaluacion(idexpediente, idgrupo_club, periodo, calificacion, this);
       }else{
         $(this).focus();
         $(this).addClass('text-fail');
         // $(this).val('');
         bootbox.alert({
           message: '<br><b>Valor no válido</b>',
           size: 'small',
           callback: function () { Evaluaciones_club_asignatura.retoma_foco(elemento); }
         });

       }
    }
});

$(document).on('keypress','.eval_observaciones_x_asignatura_club',function(e) {
  if(e.which == 13 && !$(this).prop('disabled')) {
    var elemento = this;
    e.preventDefault();
    e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

    if($(this).data('asignatura_o_club') == "asignatura_club"){
      if(!Evaluaciones_club_asignatura.valida_observacion($(this).val())){
        bootbox.alert({
            message: "<br><b>La observación sólo debe contener letras, números, puntos y comas</b>",
            size: 'small',
            callback: function () { Evaluaciones_club_asignatura.retoma_foco(elemento); }
        });
      }else{
        var idexpediente = parseInt($(this).data('idexpediente'));
        // console.info("idexpediente: "+idexpediente);
        var idgrupo_club = parseInt($("#slc_evaluaciones_idgrupo").val());
        // console.info("idgrupo_club: "+idgrupo_club);
       var periodo = parseInt($("#slt_periodo_asignatura").val());
       // console.info("momento: "+momento);

       var observacion = $(this).val();
       // console.info("observacion: "+observacion);
       var idasig = parseInt($(this).data('idasignaturac'));
       console.info("el id de la asignatura es: "+idasig);
       Evaluaciones_club_asignatura.save_observacion(idexpediente, idgrupo_club, periodo, observacion, idasig, this);
    }
  }
  }// e.which
});

var Evaluaciones_club_asignatura = {
  retoma_foco : function(elemento){
  $('.bootbox').on('hidden.bs.modal', function() {
      $(elemento).focus().select();
  });
},
  limpia_clases : function(elemento){
      var clases_existentes='text-success text-fail';
      elemento.removeClass( clases_existentes );

  },

  save_evaluacion : function(idexpediente, idgrupo_club, periodo, calificacion, elemento){

    $.ajax({
       url:base_url+"Evaluaciones/save_evaluacion",
       method:"POST",
       data:{
         'idexpediente' : idexpediente,
         'idasignatura_aut' : $("#slc_evaluaciones_idgrupo").val(),
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
           Evaluaciones_club_asignatura.save_evaluacion_success(calificacion, elemento);
           var array_promedio = data.array_promedio_periodo;
            // var array_promedio_final = data.array_promedio_final;
            // unas vez que grabo y alimento el dato, el focus brinca al otro input AM
           Evaluaciones_club_asignatura.alimenta_campos_promedio(array_promedio,elemento);
           var idprx_exp = $("#"+idexpediente).data("proxidexpediente")
           if (idprx_exp==0) {
             bootbox.alert({
               message: '<br><b>Finalizó lista de alumnos.</b>',
               size: 'small'
             });
           }
           else {
             $("#"+idprx_exp).focus().select();
           }

         }else{
           Evaluaciones_club_asignatura.save_evaluacion_error(elemento);
         }
       },
       error: function(xhr){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

  save_evaluacion_success : function(calificacion, elemento){
    $(elemento).addClass('text-success');
    var nivel = Evaluaciones_club_asignatura.get_nivel_xcalificacion(calificacion);
    console.info("nivel club asig: "+nivel);
    var index = $(elemento).data('index');
    console.info("nivel club asig: "+nivel);
    $(".aux_index_"+index).val(nivel);
  },

  // PROMEDIOS
  alimenta_campos_promedio : function(array_promedio_periodo,elemento){
    var periodo_input = parseInt($("#slt_periodo_asignatura").val());

      $(".prom_x_periodo").each(function(index) {
        if( parseInt($("#slt_periodo_asignatura").val())==periodo_input ){
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

      $(".prom_x_periodo_aux").each(function(index) {
        if( parseInt($("#slt_periodo_asignatura").val())==periodo_input ){
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
  },

  save_evaluacion_error : function(elemento){
    $(elemento).addClass('text-fail');
    $(elemento).val('');
  },

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

  // OBSERVACIONES
  save_observacion : function(idexpediente, idgrupo_club, periodo, observacion, idasig, elemento){
    $.ajax({
       url:base_url+"Evaluaciones/save_observacion",
       method:"POST",
       data:{
         'idexpediente' : idexpediente,
         'periodo' : periodo,
         'observacion' : observacion,
         'idasignatura' : idasig
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
       error: function(xhr){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

  valida_observacion : function(string){
    var regex = /^[a-z0-9\sáéíóúñ.,]+$/i;
    return regex.test(string);  //Retorna true o false
  },
};
