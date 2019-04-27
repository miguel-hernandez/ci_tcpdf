$(function() {
    obj_club_edit_grupo = new Club_edit_grupo();
});


function Club_edit_grupo(){
  _thisclub_edit_grupo = this;
}


Club_edit_grupo.prototype.editar_grupo = function(id_grupo_c){
// alert(id_grupo_c);
$.ajax({
   url:base_url+"Clubes/get_modal_grupo_club",
   method:"POST",
   data:{id_grupo_c:id_grupo_c},
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
};

Club_edit_grupo.prototype.eliminar_grupo = function(id_grupo_c){
  bootbox.confirm({
      message: "<b>¿Eliminar grupo club?</b>",
      buttons: {
          confirm: {
              label: 'Confirmar',
              className: 'btn_color_primary'
          },
          cancel: {
              label: 'Cancelar',
              className: 'btn_color_default'
          }
      },
      callback: function (result) {
        if(result){
          $.ajax({
             url:base_url+"Clubes/del_grupo_club",
             method:"POST",
             data:{id_grupo_c:id_grupo_c},
             beforeSend: function(xhr) {
               $("#wait").modal("show");
             },
             success:function(data){
               $("#wait").modal("hide");
               if (data.estatus=="true") {
                 bootbox.alert({
                   message: "<br><b>No se puede eliminar el grupo, tiene "+data.estatus+" alumnos asignados</b>",
                   size: 'small'
                 });
               }
               else {
                 bootbox.alert({
                   message: '<br><b>Grupo eliminado correctamente</b>',
                   size: 'small'
                 });
               }

               objeto_grupo.grupos_ajax(0, 0, 0);

             },
             error: function(error){
               $("#wait").modal("hide");
               console.error("error al grabar");
               console.table(error);
             }
           });
        }else{
          // return false;
        }
      }
  });

};
