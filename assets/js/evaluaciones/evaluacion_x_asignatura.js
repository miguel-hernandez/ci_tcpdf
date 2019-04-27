$(document).on('keypress','.eval_x_asignatura_alumno',function(e) {
  var elemento = this;
    Evaluaciones_x_asig.limpia_clases($(this));
    if(e.which == 13 && !$(this).prop('disabled')) {
      e.preventDefault();
      e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

      var idexpediente = parseInt($(this).data('idexpediente'));
        // console.info("idexpediente: "+idexpediente);

      var idasignatura = parseInt($("#slc_evaluaciones_asignatura").val());
        // console.info("idasignatura: "+idasignatura);

      var idsegmento = parseInt($(this).data('idsegmentoasig'));
        // console.info("idsegmento: "+idsegmento);

       var periodo = parseInt($("#slt_periodo_asignatura").val());
       // console.info("periodo: "+periodo);

       // var calificacion = parseInt($(this).val());
       var calificacion = $(this).val();
       // console.info("calificacion: "+calificacion);
       // return false;
       var componente_curricular = $("#slc_evaluaciones_asignatura").find(':selected').attr('data-tipoasig')

       // alert("componente_curricular: "+componente_curricular); return false;

       if(Evaluaciones_x_asig.valida_captura_xcomponentecurricular(componente_curricular, calificacion)){
          Evaluaciones_x_asig.save_evaluacion(idexpediente, idasignatura, idsegmento, periodo, calificacion, this);
          $(this).blur();
       }else{

         bootbox.alert({
          message: "<br><b>Valor no válido</b>",
          size: 'small',
          callback: function () { Evaluaciones_x_asig.retoma_foco(elemento); }
      });
         // Evaluaciones_x_asig.save_evaluacion_error(this);
         // $(this).blur();
       }
    }
});

$(document).on('keypress','.eval_observaciones_x_asignatura',function(e) {
  // alert("entrando");
  var elemento = this;
  if(e.which == 13 && !$(this).prop('disabled')) {
    e.preventDefault();
    e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

    if($(this).data('asignatura_o_club') == "asignatura"){
      if(!Evaluaciones_x_asig.valida_observacion($(this).val())){
        bootbox.alert({
            message: "<br><b>La observación sólo debe contener letras, números, puntos y comas</b>",
            size: 'small',
            callback: function () { Evaluaciones_x_asig.retoma_foco(elemento); }
        });
      }else{
        var idexpediente = parseInt($(this).data('idexpediente'));
        // console.info("idexpediente: "+idexpediente);
        var idasignatura = parseInt($("#slc_evaluaciones_asignatura").val());
        // console.info("idasignatura: "+idasignatura);
        var periodo = parseInt($("#slt_periodo_asignatura").val());
       // console.info("momento: "+momento);
       var observacion = $(this).val();
       // console.info("observacion: "+observacion);
       Evaluaciones_x_asig.save_observacion(idexpediente, idasignatura, periodo, observacion, this);

    }
  }
  }// e.which
});

$(document).on('keypress','.eval_inasistencias_sec_xasig',function(e) {
    var elemento = this;
    if(e.which == 13 && !$(this).prop('disabled')) {
      e.preventDefault();
      e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

      var idexpediente = parseInt($(this).data('idexpediente'));
      var idasignatura = parseInt($("#slc_evaluaciones_asignatura").val());
      var periodo = parseInt($("#slt_periodo_asignatura").val());
      var inasistencias = $(this).val();
      if(validaSoloNumerico(inasistencias)){
        if(inasistencias <= 70){
           Evaluaciones_x_asig.save_inasistencias_sec(idexpediente, idasignatura, periodo, inasistencias, this);
         }else{
           bootbox.alert({
               message: "<br><b>No es posible capturar más de 70 inasistencias</b>",
               size: 'small',
               callback: function () { Evaluaciones_asig.retoma_foco(elemento); }
           });
         }
      }else{
        bootbox.alert({
            message: "<br><b>Valor no permitido</b>",
            size: 'small',
            callback: function () { Evaluaciones_x_asig.retoma_foco(elemento); }
        });
      }

    }
});

var Evaluaciones_x_asig = {

  retoma_foco : function(elemento){
  $('.bootbox').on('hidden.bs.modal', function() {
      $(elemento).focus().select();
  });
},

limpia_clases : function(elemento){
    var clases_existentes='text-success text-fail';
    elemento.removeClass( clases_existentes );

},

valida_captura_xcomponentecurricular : function(componente_curricular, calificacion){
    flag = false;
    if (componente_curricular == 'FA') {
      if(calificacion == '' || calificacion == 5 || calificacion == 6 || calificacion == 7 || calificacion == 8 || calificacion == 9 || calificacion == 10){
         flag = true;;
      }
    }else{
      if(calificacion == '' || calificacion == 1 || calificacion == 2 || calificacion == 3 || calificacion == 4){
         flag = true;
      }
    }

    return flag;
  },

  save_evaluacion : function(idexpediente, idasignatura, idsegmento, periodo, calificacion, elemento){
    $.ajax({
       url:base_url+"Evaluaciones/save_evaluacion_asig",
       method:"POST",
       data:{
         'idexpediente' : idexpediente,
         'idasignatura' : idasignatura,
         'idsegmento' : idsegmento,
         'periodo' : periodo,
         'calificacion' : calificacion,
         'componente_curricular' : $("#slc_evaluaciones_asignatura").find(':selected').attr('data-tipoasig')
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         if(data.result){
           Evaluaciones_x_asig.save_evaluacion_success(calificacion, elemento);//IMPLEMENTAR ESTA NUEVA FUNCIONALIDAD LUIS

            var array_promedio = data.array_promedio_periodo;
            Evaluaciones_x_asig.alimenta_campos_promedio_periodo(array_promedio, elemento);
            Evaluaciones_x_asig.set_focus_next(elemento);

         }else{
           Evaluaciones_x_asig.save_evaluacion_error(elemento);
         }
       },
       error: function(xhr){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

    save_evaluacion_error : function(elemento){
    $(elemento).addClass('text-fail');
    $(elemento).val('');
  },

  save_evaluacion_success : function(calificacion, elemento){
    // PONEMOS COLOR VERDE AL INPUT
    $(elemento).addClass('text-success');
    var componente_curricular = $("#slc_evaluaciones_asignatura").find(':selected').attr('data-tipoasig');


    // PONEMOS EL NIVEL DE DESEMPEÑO EN EL VECINO DE LA DERECHA
    var nivel_desempenoa = Evaluaciones_x_asig.get_nivel_desempeno_xcalificacion(componente_curricular, calificacion);
    var idasignaturaa = parseInt($("#slc_evaluaciones_asignatura").val());
    var idsegmentoa = $(elemento).data('idsegmentoasig');
    var periodoa = $("#slt_periodo_asignatura").val();
    var idindexelementoa = $(elemento).data('idelementonum');
    var idexpedientea = $(elemento).data('idexpediente');

    $(".eval_x_asignatura_aux").each(function() {

      var idasignaturaa_ = parseInt($("#slc_evaluaciones_asignatura").val());
      var idsegmentoa_ = $(this).data('idsegmentoasig');
      var periodoa_ = $("#slt_periodo_asignatura").val();
      var idindexelementoa_ = $(this).data('idelementonum');
      var idexpedientea_ = $(this).data('idexpediente');
      if(idsegmentoa_ === idsegmentoa && periodoa_ === periodoa && idindexelementoa === idindexelementoa_ && idexpedientea === idexpedientea_){
          $(this).val(nivel_desempenoa);
      }
    });
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
    console.log(elemento);
    var expediente = $(elemento).data('idexpediente');
      $(".prom_x_periodo").each(function(index) {
        if( $(this).data('idexpediente') == expediente ){
            $(this).val(array_promedio_periodo.promedio);
        }
      });
      $(".prom_x_periodo_aux").each(function(index) {
        if( $(this).data('idexpediente') == expediente ){
            $(this).val(array_promedio_periodo.nivel_desempeno);
        }
      });
  },

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

  set_focus_next : function(elemento){
    // var periodo = $(elemento).data('periodo');
    var campo = 'cadena_focus';

    var focus = $(elemento).data('focusasig');

    var str_focus = $("#"+campo).val();

    var array_focus = str_focus.split(",");

    var foco_actual = $(elemento).data('focusasig');
    // console.info("foco_actual: "+foco_actual);
    var index =  array_focus.indexOf(foco_actual);
    // console.info("index: "+index);

    var foco_sig = array_focus[index+1];
    // console.info("foco_sig: "+foco_sig);

    $(".eval_x_asignatura_alumno").each(function() {
      if( $(this).data('focusasig')==foco_sig ){
        $(this).focus();
        $(this).select();
      }
    });
  },

  valida_observacion : function(string){
    var regex = /^[a-z0-9\sáéíóúñ.,]+$/i;
    return regex.test(string);  //Retorna true o false
  },
}


function validaSoloNumerico(cadena){
    var patron = /^\d*$/;
    if(!cadena.search(patron))
      return true;
    else
      return false;
}
