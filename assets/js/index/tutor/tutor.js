$(function() {
    obj_tutor = new Tutor();
});

// $("#sle_tipo_get_asg_club").change(function(){
//   obj_tutor.get_asignaturas_clubes($("#txt_id_alumno_datos_get").val());
// });

$("#btn_consultar_evaluacion").click(function(){
  if($("#sle_tipo_get_asg_club").val() != 0){
    if($("#sle_tipo_periodo").val() != 0){
      obj_tutor.get_evaluacion_xfiltro();
    }else{
      bootbox.alert({
        message: "<br><p>Seleccione un periodo</p>",
        size: 'small',
      });
      // Swal(
      //   '¡Alerta!',
      //   'Seleccione un periodo.',
      //   'warning'
      // )
    }
  }else{
    bootbox.alert({
      message: "<br><p>Seleccione un tipo de evaluación</p>",
      size: 'small',
    });
    // Swal(
    //     '¡Alerta!',
    //     'Seleccione un tipo de evaluación.',
    //     'warning'
    //   )
  }
});


function Tutor(){
  _this_tutor = this;
}


Tutor.prototype.get_asignaturas_clubes = function(idalumno){
$.ajax({
   url:base_url+"Tutor/get_asignaturas_clubes",
   method:"POST",
   data:{
    idalumno:idalumno,
    tipo: $("#sle_tipo_get_asg_club").val(),
    subfijo: $("#txt_idnivelalumno").val()
  },
   beforeSend: function(xhr) {
     $("#wait").modal("show");
   },
   success:function(data){
    $("#sle_tipo_id_eval").empty();
    $("#sle_tipo_id_eval").append(data.slt);
   },
   error: function(error){
     $("#wait").modal("hide");
     console.error("error al recuperar datos");
     console.table(error);
   }
 });
};

Tutor.prototype.get_evaluacion_xfiltro = function(periodo){
  var tipo_eval = $("#sle_tipo_get_asg_club").val();
  if( (tipo_eval == 1) || tipo_eval == '1' ){
    $("#consulta_tutor_clubes").hide();
    $("#consulta_tutor_evals").show();
  }else if ((tipo_eval == 2) || tipo_eval == '2') {
    $("#consulta_tutor_evals").hide();
    $("#consulta_tutor_clubes").show();
  }

$.ajax({
   url:base_url+"Tutor/get_evaluaciones",
   method:"POST",
   data:{
    tipoasig:$("#sle_tipo_get_asg_club").val(),
    idasig: $("#sle_tipo_id_eval").val(),
    idperiodo: periodo,
    idalumno:$("#txt_id_alumno_datos_get").val(),
    subfijo: $("#txt_idnivelalumno").val()
  },
   beforeSend: function(xhr) {
     // $("#wait").modal("show");
      var dialog = bootbox.dialog({
        title: 'Cargando',
        message: '<p><i class="fa fa-spin fa-spinner fa-lg" width="25px;" height="25px;"></i> Por favor espere un momento</p>',
        size: 'small'
      });
      // do something in the background
      dialog.init(function(){
        setTimeout(function(){
            dialog.modal('hide');
        });
      });
   },
   success:function(data){
     var mensaje = data.tablas;
     if (data.tablas == '') {
      mensaje = 'No hay datos para mostrar.';
     }
    $("#contenedor_tablas").empty();
    $("#contenedor_tablas").append(mensaje);
   },
   error: function(error){
     $("#wait").modal("hide");
     console.error("error al recuperar datos tablas");
     console.table(error);
   }
 });
};

Tutor.prototype.get_informacion = function(valor){
  if($("#sle_tipo_get_asg_club").val() != 0){
    if(valor == 1 || valor == 2 || valor == 3){
      obj_tutor.get_evaluacion_xfiltro(valor);
    }else{
      bootbox.alert({
        message: "<br><p>Seleccione un periodo</p>",
        size: 'small',
        buttons: {
          ok: {
            label: 'Aceptar'
          }
        }
      });
      // Swal(
      //   '¡Alerta!',
      //   'Seleccione un periodo.',
      //   'warning'
      // )
    }
  }else{
    bootbox.alert({
      message: "<br><p>Seleccione un tipo de evaluación</p>",
      size: 'small',
      buttons: {
        ok: {
          label: 'Aceptar'
        }
      }
    });

    // Swal(
    //     '¡Alerta!',
    //     'Seleccione un tipo de evaluación.',
    //     'warning'
    //   )
  }
}

// Modal Aviso de privacidad
$(document).ready(function(){
  $('.main-wrapper').css('display', 'none');
  $('#avisoprivacidad').modal('show');

  $('#aceptar').on('click', function(){
    var condiciones = $('#check').is(":checked");

    if (condiciones) {
      $('.main-wrapper').css('display', '');
      $('#avisoprivacidad').modal('hide');
    } else {
      $('#avisoprivacidad').modal({backdrop: 'static', keyboard: false});

      bootbox.alert({
          message: '<p>Debe aceptar el aviso de privacidad</p>',
          size: 'small',
          buttons: {
            ok: {
              label: 'Aceptar'
            }
          }
      });

      // dialog.init(function(){
      //     setTimeout(function(){
      //         dialog.modal('hide');
      //     }, 3000);
      // });

      // event.preventDefault();
    }
  });

  $('#cancelar').on('click', function(){
      window.location.href = base_url;
  });

});
