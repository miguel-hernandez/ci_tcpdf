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
      Swal(
        '¡Alerta!',
        'Seleccione un periodo.',
        'warning'
      )
    }
  }else{
    Swal(
        '¡Alerta!',
        'Seleccione un tipo de evaluación.',
        'warning'
      )
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
     $("#wait").modal("show");
   },
   success:function(data){
    console.log(data.tablas);
    $("#contenedor_tablas").empty();
    $("#contenedor_tablas").append(data.tablas);
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
      Swal(
        '¡Alerta!',
        'Seleccione un periodo.',
        'warning'
      )
    }
  }else{
    Swal(
        '¡Alerta!',
        'Seleccione un tipo de evaluación.',
        'warning'
      )
  }
}
