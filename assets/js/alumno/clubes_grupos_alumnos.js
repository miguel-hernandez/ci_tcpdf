$( document ).ready(function() {
});

function add_clubes(idExpediente,subfijo){
  $.ajax({
     url:base_url+"Alumno/get_modal_addgrupo_club",
     method:"POST",
     data:{idExpediente:idExpediente,subfijo:subfijo},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
       $("#wait").modal("hide");
       $("#pmodal_alumnos_grubos_clubes").empty();
       $("#pmodal_alumnos_grubos_clubes").html(data.dom_add_grupo);
       $("#modal_alumnos_add_grupos_clubes").modal('show');

     },
     error: function(error){
       $("#wait").modal("hide");
       console.error("error al grabar");
       console.table(error);
     }
   });

}
