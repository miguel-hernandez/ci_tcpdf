$(function() {
    obj_club_add_grupo = new Club_add_grupo();
});
$("#btn_add_grupoclub").click(function(){

  $.ajax({
     url:base_url+"Clubes/get_modal_grupo_club",
     method:"POST",
     data:{id_grupo_c:''},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
       $("#wait").modal("hide");
       $("#add_grupo").empty();
       $("#add_grupo").html(data.dom_add_grupo);
       $("#modal_add_grupos").modal('show');

     },
     error: function(error){
       $("#wait").modal("hide");
       console.error("error al grabar");
       console.table(error);
     }
   });

});

function Club_add_grupo(){
  _thisclub_add_grupo = this;
}
