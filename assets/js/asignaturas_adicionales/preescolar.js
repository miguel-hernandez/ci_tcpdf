$(document).ready(function(){
    obj_notification = new Notification("grupopree_notifications");
    obj_adicionales = new Adicionales_pree();
    obj_grid = new Grid("grid_grupopree_asigadicionales"); // Objeto de acceso global para usarlo con clicks btn
});

$("#grupo_pree").change(function (){
  obj_notification.dismissible();
  $("#div_detalles_pree").hide();
  var idgrupo = $(this).val();
  if(idgrupo == 0){
    $("#div_detalles_pree").hide();
  }else{
      obj_adicionales.get_cupo_yasesor_ygrid(idgrupo);
  }
});

$("#slt_grupopree_asigadicionales").change(function (){
  obj_notification.dismissible();
});

$("#personal_pree").change(function (){
  obj_notification.dismissible();
});


$("#grabar_pree").click(function(e){
    e.preventDefault();
    obj_notification.dismissible();
    var id_grupo = $('#grupo_pree').val();
    var id_personal = $('#personal_pree').val();
    if(id_grupo==0){
      obj_notification.error("Debe seleccionar un grupo");
    }else{
      if(id_grupo==0){
        obj_notification.error("Debe seleccionar un asesor");
      }else{
          obj_adicionales.add_asesor_grupo(id_grupo,id_personal);
      }
    }
});

$("#btn_grupopree_addasigadicional").click(function(e){
    e.preventDefault();
    obj_notification.dismissible();
    var idasigadiconal = $("#slt_grupopree_asigadicionales").val();
    var text_asigadicional = $("#slt_grupopree_asigadicionales option:selected").text();
    if(idasigadiconal==0){
      obj_notification.error("Debe seleccionar una asignatura adicional");
    }
    else{
        var id_grupo = $('#grupo_pree').val();
        var text_grupo = $("#grupo_pree option:selected").text();
        var arr_ids = obj_grid.get_all_ids("idasigextrapree");
        var existe = arr_ids.indexOf(idasigadiconal);
        if(existe > -1){
          obj_notification.error(text_asigadicional+" ya es asignatura del grupo "+text_grupo);
        }else{
          obj_adicionales.add_asigadicional_agrupo(id_grupo,idasigadiconal);
        }
    }
});

$("#btn_grupopree_deleteasigadicional").click(function(e){
    e.preventDefault();
    obj_notification.dismissible();
      var arr_row = obj_grid.get_row_selected();
      var datos = arr_row[0];
      if (datos != null && datos['idasigextrapree'] > 0) {
        var id_grupo = $('#grupo_pree').val();
        obj_adicionales.delete_asigadicional_degrupo(id_grupo,datos['idasigextrapree']);
      }
      else {
        obj_notification.error("Seleccione una asignatura adicional");
      }
});



 function Adicionales_pree(){
   _this = this;
 }

 Adicionales_pree.prototype.add_asesor_grupo = function(id_grupo,id_personal){
   $.ajax({
       url : base_url+"Grupo_pree/add_asesor_grupo",
       dataType : 'json',
       method : 'POST',
       data : {
           id_grupo : id_grupo,
           id_personal : id_personal
       },
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
         $("#wait").modal("hide");
         if(data.result){
           obj_notification.success("Se asignó correctamente el asesor al grupo");
         }else{
           obj_notification.error("Ocurrió un error al intentar asignar el asesor");
         }
       },
       error: function(error){
           obj_notification.error("Ocurrió un error al intentar asignar el asesor");
       }
   });
 };

 Adicionales_pree.prototype.get_cupo_yasesor_ygrid = function(id_grupo){
   $.ajax({
       url : base_url+"Grupo_pree/get_cupo_yasesor_ygrid",
       dataType : 'json',
       method : 'POST',
       data : {id_grupo : id_grupo},
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
           $("#wait").modal("hide");

          var text_grupo = $("#grupo_pree option:selected").text();
          $("#lbl_grupopree_gradogrupo").empty();
          $("#lbl_grupopree_gradogrupo").append(text_grupo);

           $("#cupo").val(data['cupo']);
           $("#personal_pree").val(data['asesor']);
           $("#grid_grupopree_asigadicionales").empty();
           $("#grid_grupopree_asigadicionales").append(data.str_grid);

           $("#div_detalles_pree").show();
       },
       error: function(error){
         obj_notification.error("No se pudo recuperar el cupo del grupo");
       }
   });// ajax
 };

 Adicionales_pree.prototype.add_asigadicional_agrupo = function(id_grupo,idasigadiconal){
   $.ajax({
      url : base_url+"Grupo_pree/add_asigadicional_agrupo",
       dataType : 'json',
       method : 'POST',
       data : {"id_grupo" : id_grupo, "idasigadiconal":idasigadiconal},
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
           $("#wait").modal("hide");
           if(data.result){
             var text_grupo = $("#grupo_pree option:selected").text();
             var text_asigadicional = $("#slt_grupopree_asigadicionales option[value="+idasigadiconal+"]").text();
             $("#slt_grupopree_asigadicionales").val(0);

             obj_notification.success(text_asigadicional+" agregada correctamente a "+text_grupo);
             _this.get_cupo_yasesor_ygrid(id_grupo);
           }else{
              obj_notification.error("No se pudo agregar, reintente porfavor");
           }
       },
       error: function(error){
         obj_notification.error("No se pudo agregar, reintente porfavor");
       }
   });// ajax
 };

 Adicionales_pree.prototype.delete_asigadicional_degrupo = function(id_grupo,idasigadiconal){
   $.ajax({
      url : base_url+"Grupo_pree/delete_asigadicional_degrupo",
       dataType : 'json',
       method : 'POST',
       data : {"id_grupo" : id_grupo, "idasigadiconal":idasigadiconal},
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
           $("#wait").modal("hide");
           if(data.result){
             var text_grupo = $("#grupo_pree option:selected").text();
             var text_asigadicional = $("#slt_grupopree_asigadicionales option[value="+idasigadiconal+"]").text();
             $("#slt_grupopree_asigadicionales").val(0);

             obj_notification.success(text_asigadicional+" eliminada correctamente de "+text_grupo);
             _this.get_cupo_yasesor_ygrid(id_grupo);
           }else{
              obj_notification.error("No se pudo eliminar, reintente porfavor");
           }
       },
       error: function(error){
         obj_notification.error("No se pudo eliminar, reintente porfavor");
       }
   });// ajax
 };
