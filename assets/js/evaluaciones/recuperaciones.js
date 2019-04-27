$("#btn_evals_recuperaciones_grabar").click(function(e){
  e.preventDefault();
  var elemento = this;

  var componente_curricular = $("#itxt_evals_recuperaciones_tipo_asignatura").val();
  var calificacion = $("#itxt_evals_recuperaciones_calificacion").val();

  calificacion = calificacion.trim();
  if(calificacion.length == 0 ||  calificacion==''){
    bootbox.alert({
      message: "<br><b>Ingrese calificación</b>",
      size: 'small',
      callback: function () { /* nada.. */ }
    });
  }else{
    //
    if(Evaluaciones_recuperaciones.valida_captura_xcomponentecurricular(componente_curricular, calificacion)){
      var idexpediente = $("#itxt_evals_recuperaciones_idexpediente").val();
      var idasignatura = $("#itxt_evals_recuperaciones_idasignatura").val();
      var periodo = $("#itxt_evals_recuperaciones_periodo").val();
      // alert("A GUARDAR");
      Evaluaciones_recuperaciones.save_recuperacion(idexpediente, idasignatura, periodo, calificacion, componente_curricular, this);
    }else{
      bootbox.alert({
        message: "<br><b>Valor no permitido</b>",
        size: 'small',
        callback: function () { /* nada.. */ }
      });
    }
    //
  }

});


var Evaluaciones_recuperaciones = {

  valida_captura_xcomponentecurricular : function(componente_curricular, calificacion){
    flag = false;
    if (componente_curricular == 'FA') {
      if(calificacion == '' || calificacion == 5 || calificacion == 6 || calificacion == 7 || calificacion == 8 || calificacion == 9 || calificacion == 10){
        flag = true;
      }
    }else{
      if(calificacion == '' || calificacion == 1 || calificacion == 2 || calificacion == 3 || calificacion == 4){
        flag = true;
      }
    }

    return flag;
  },

  save_recuperacion : function(idexpediente, idasignatura, periodo, calificacion, componente_curricular, elemento){
    $.ajax({
      url:base_url+"Evaluaciones/save_recuperacion",
      method:"POST",
      data:{
        'idexpediente' : idexpediente,
        'idasignatura' : idasignatura,
        'periodo' : periodo,
        'calificacion' : calificacion,
        'componente_curricular' : componente_curricular
      },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        if(data.result){
          location.reload();
        }else{
          bootbox.alert({
            message: "<br><b>Ocurrió un error, reintente por favor</b>",
            size: 'small',
            callback: function () { /* nada.. */ }
          });
        }
      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });
  },

  alimenta_campos_promedio_periodo : function(array_promedio_periodo,elemento, periodo, id_asignatura){
    var periodo_input = periodo;
    var idasignatura = id_asignatura;

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

  }

};
