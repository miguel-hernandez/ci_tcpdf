$("#btn_insertarccts").click(function(e){
  e.preventDefault();
// alert("hola");
  $("#div_detalles_status").empty();
  $.ajax({
     url:base_url+"Insertar_ccts/insert_ccts",
     method:"POST",
     data:{},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
       // console.log(data.estatus);
       $("#wait").modal("hide");
       alert("Finalizó el proceso");
         $("#div_detalles_status").html("<label>Se insertaron "+data.estatus+" ccts correctamente</label>");

     },
     error: function(error){
       $("#wait").modal("hide");
       alert("Finalizó el proceso");
       $("#div_detalles_status").html("<label>No se insertaron todas las ccts correctamente</label>");
       console.error("error al insertar");
       console.table(error);
     }
   });

});
