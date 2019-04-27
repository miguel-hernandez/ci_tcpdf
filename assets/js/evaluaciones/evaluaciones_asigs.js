$(document).on('click','.btn_grabar_recuperacion',function(e) {
  if( !$(this).prop('disabled') ) {
    var elemento = this;

    var idexpediente = $(elemento).data('idexpediente');
    var idasignatura = $(elemento).data('idasignatura');
    var asignatura = $(elemento).data('asignatura');
    var tipo_asignatura = $(elemento).data('tipo_asignatura');

    var periodo = $(elemento).data('periodo');

    $.ajax({
      url:base_url+"Evaluaciones/get_view_recuperaciones",
      method:"POST",
      data:{
        'idexpediente' : idexpediente,
        'idasignatura' : idasignatura,
        'asignatura' : asignatura,
        'tipo_asignatura' : tipo_asignatura,
        'periodo' : periodo
      },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");

        $("#div_evaluaciones_generico").empty();
        $("#div_evaluaciones_generico").append(data.str_view);

        $("#modal_evaluaciones_recuperaciones").modal("show");

      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });

  }// !disabled
});


$(document).on('keypress','.eval_observaciones_x_alumno_asig',function(e) {
  var elemento = this;
  if(e.which == 13 && !$(this).prop('disabled')) {
    e.preventDefault();
    e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

    if($(this).data('asignatura_o_club') == "asignatura"){

      if(!Evaluaciones_utils.valida_observacion($(this).val())){
        bootbox.alert({
          message: "<br><b>La observación sólo debe contener letras, números, puntos y comas</b>",
          size: 'small',
          callback: function () { Evaluaciones_utils.retoma_foco(elemento); }
        });
      }else{
        var idexpediente = parseInt($(this).data('idexpediente'));
        // console.info("idexpediente: "+idexpediente);
        var idasignatura = parseInt($(this).data('idasignatura'));
        // console.info("idasignatura: "+idasignatura);
        var periodo = parseInt($(this).data('periodo'));
        // console.info("momento: "+momento);
        var observacion = $(this).val();
        // console.info("observacion: "+observacion);
        Evaluaciones_asig.save_observacion(idexpediente, idasignatura, periodo, observacion, this);
      }
    }
  }// e.which
});

$(document).on('keypress','.eval_x_alumno_asig',function(e) {
  var elemento = this;
  Evaluaciones_asig.limpia_clases($(this));
  if(e.which == 13 && !$(this).prop('disabled')) {
    e.preventDefault();
    e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

    var idexpediente = parseInt($(this).data('idexpediente'));
    // console.info("idexpediente: "+idexpediente);

    var idasignatura = parseInt($(this).data('idasignatura'));
    // console.info("idasignatura: "+idasignatura);

    var idsegmento = parseInt($(this).data('idsegmento'));
    // console.info("idsegmento: "+idsegmento);

    var periodo = parseInt($(this).data('periodo'));
    // console.info("periodo: "+periodo);

    // var calificacion = parseInt($(this).val());
    var calificacion = $(this).val();
    // console.info("calificacion: "+calificacion);
    // return false;
    var componente_curricular = $(this).data('tipo_asignatura');

    // alert("componente_curricular: "+componente_curricular); return false;

    if(Evaluaciones_asig.valida_captura_xcomponentecurricular(componente_curricular, calificacion)){
      Evaluaciones_asig.save_evaluacion(idexpediente, idasignatura, idsegmento, periodo, calificacion, componente_curricular, this);
      // $(this).blur();
    }else{
      bootbox.alert({
        message: "<br><b>Valor no permitido</b>",
        size: 'small',
        callback: function () { Evaluaciones_utils.retoma_foco(elemento); }
      });

      // $(this).blur();
    }
  }
});

$(document).on('keypress','.eval_inasistencias_prim',function(e) {
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

$(document).on('keypress','.eval_inasistencias_sec',function(e) {
  var elemento = this;
  if(e.which == 13 && !$(this).prop('disabled')) {
    e.preventDefault();
    e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

    var idexpediente = parseInt($(this).data('idexpediente'));
    var idasignatura = parseInt($(this).data('idasignatura'));
    var periodo = parseInt($(this).data('periodo'));
    var inasistencias = $(this).val();
    if(Evaluaciones_utils.valida_solo_numerico(inasistencias)){
      if(inasistencias <= 70){
        Evaluaciones_asig.save_inasistencias_sec(idexpediente, idasignatura, periodo, inasistencias, this);
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




var Evaluaciones_asig = {
  // OBSERVACIONES
  save_observacion : function(idexpediente, idasignatura, periodo, observacion, elemento){
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
        }else{
          $(elemento).addClass('text-fail');
        }
      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });
  },

  // INASISTENCIAS PRIM
  save_inasistencias_prim : function(idexpediente, idgrupo, periodo, inasistencias, elemento){
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
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });
  },

  // INASISTENCIAS SEC
  save_inasistencias_sec : function(idexpediente, idasignatura, periodo, inasistencias, elemento){
    $.ajax({
      url:base_url+"Evaluaciones/save_inasistencias_sec",
      method:"POST",
      data:{
        'idexpediente' : idexpediente,
        'idasignatura' : idasignatura,
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
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });
  },


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

  save_evaluacion : function(idexpediente, idasignatura, idsegmento, periodo, calificacion, componente_curricular, elemento){
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
          var array_promedio_periodo = data.array_promedio_periodo;
          Evaluaciones_asig.alimenta_campos_promedio_periodo(array_promedio_periodo,elemento);
          if(periodo == 3){
            var array_promedio_final = data.array_promedio_final;
            Evaluaciones_asig.alimenta_campos_promedio_final(array_promedio_final,elemento);
          }
        }else{
          Evaluaciones_asig.save_evaluacion_error(elemento);
        }
      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });
  },

  save_evaluacion_success : function(calificacion, elemento){
    // PONEMOS COLOR VERDE AL INPUT
    $(elemento).addClass('text-success');
    var componente_curricular = $(elemento).data('tipo_asignatura');


    // PONEMOS EL NIVEL DE DESEMPEÑO EN EL VECINO DE LA DERECHA
    var nivel_desempeno = Evaluaciones_asig.get_nivel_desempeno_xcalificacion(componente_curricular, calificacion);
    // console.info("nivel_desempeno: "+nivel_desempeno);
    // var idexpediente = $(elemento).data('idexpediente');
    var idasignatura = $(elemento).data('idasignatura');
    var idsegmento = $(elemento).data('idsegmento');
    var periodo = $(elemento).data('periodo');
    // var index = $(elemento).data('index');


    $(".eval_x_alumno_asig_aux").each(function() {
      var idasignatura_ = $(this).data('idasignatura');
      var idsegmento_ = $(this).data('idsegmento');
      var periodo_ = $(this).data('periodo');
      // var index_ = $(this).data('index');
      if( idasignatura_ == idasignatura && idsegmento_ == idsegmento && periodo_ == periodo){
        $(this).val(nivel_desempeno);
      }
    });

    Evaluaciones_asig.set_focus_next(elemento);
  },

  save_evaluacion_error : function(elemento){
    $(elemento).addClass('text-fail');
    // $(elemento).val('');
  },

  limpia_clases : function(elemento){
    var clases_existentes='text-success text-fail';
    elemento.removeClass( clases_existentes );

  },

  get_nivel_desempeno_xcalificacion : function(componente_curricular, calificacion){
    calificacion = parseInt(calificacion);
    nivel = '';
    if(componente_curricular == 'FA'){
      switch (calificacion) {
        case 5:
        nivel = 'I';
        break;
        case 6:
        nivel = 'II';
        break;
        case 7:
        nivel = 'II';
        break;
        case 8:
        nivel = 'III';
        break;
        case 9:
        nivel = 'III';
        break;
        case 10:
        nivel = 'IV';
        break;
      }
    }
    else{
      switch (calificacion) {
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
    }

    return nivel;
  },


  alimenta_campos_promedio_periodo : function(array_promedio_periodo,elemento){
    var periodo_input = $(elemento).data('periodo');
    var idasignatura = $(elemento).data('idasignatura');

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

  alimenta_campos_promedio_final : function(array_promedio_final,elemento){
    var idexpediente = $(elemento).data('idexpediente');
    var idasignatura = $(elemento).data('idasignatura');

    // promedio
    $(".eval_promedio_final").each(function(index) {
      if( $(this).data('idexpediente') == idexpediente ){
        if( $(this).data('idasignatura') == idasignatura ){
          $(this).html(array_promedio_final.promedio);
        }
      }
    });


    // nivel_desempeno

    $(".eval_nivel_desempeno_final").each(function(index) {
      if( $(this).data('idexpediente') == idexpediente ){
        if( $(this).data('idasignatura') == idasignatura ){
          $(this).html(array_promedio_final.nivel_desempeno);
        }
      }
    });

  },

  set_focus_next : function(elemento){
    var periodo = $(elemento).data('periodo');

    var campo = 'itxt_evalxalumno_focus_periodo'+periodo;

    var focus = $(elemento).data('focus');

    var str_focus = $("#"+campo).val();

    var array_focus = str_focus.split(",");

    var foco_actual = $(elemento).data('focus');

    var index =  array_focus.indexOf(foco_actual);


    var foco_sig = array_focus[index+1];

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
  }

};
