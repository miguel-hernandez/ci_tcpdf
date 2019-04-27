$("#btn_actualizar_procesar").click(function(e){
  e.preventDefault();
  $("#div_detalles").empty();

  var fecha_maxima = $("#itxt_actualizacion_fecha_maxima").val();

  $.ajax({
     url:base_url+"Actualizacion/update_ccts",
     method:"POST",
     data:{'fecha_maxima':fecha_maxima},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
       $("#wait").modal("hide");
       $("#div_detalles").empty();
       $("#div_detalles").append(data.strDetalles);
     },
     error: function(error){
       $("#wait").modal("hide");
       console.error("error al procesar");
       console.table(error);
     }
   });

});
