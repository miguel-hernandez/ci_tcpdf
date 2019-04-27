$(document).ready(function(){
    obj_notification = new Notification("grupoprim_notifications");
    obj_gruposprim = new Gruposprim();
    obj_grid = new Grid("grid_grupoprim_asigadicionales"); // Objeto de acceso global para usarlo con clicks btn
});

$("#grupo_prim").change(function (){
  obj_notification.dismissible();
  $("#div_gruposprim_detalles").hide();
  var idgrupo = $(this).val();
  if(idgrupo == 0){
    $("#div_gruposprim_detalles").hide();
  }else{
      obj_gruposprim.get_cupo_yasesor_ygrid(idgrupo);
  }
});

$("#slt_gruposprim_asigadicionales").change(function (){
  obj_notification.dismissible();
});

$("#slc_gruposprim_personal").change(function (){
  obj_notification.dismissible();
});


$("#btn_gruposprim_grabarasesor").click(function(e){
    e.preventDefault();
    obj_notification.dismissible();
    var id_grupo = $('#grupo_prim').val();
    var id_personal = $('#slc_gruposprim_personal').val();
    if(id_grupo==0){
      obj_notification.error("Debe seleccionar un grupo");
    }else{
      if(id_personal==0){
        obj_notification.error("Debe seleccionar un asesor");
      }else{
          obj_gruposprim.add_asesor_grupo(id_grupo,id_personal);
      }
    }
});

$("#btn_gruposprim_addasigadicional").click(function(e){
    e.preventDefault();
    obj_notification.dismissible();
    var idasigadiconal = $("#slt_gruposprim_asigadicionales").val();
    var text_asigadicional = $("#slt_gruposprim_asigadicionales option:selected").text();
    if(idasigadiconal==0){
      obj_notification.error("Debe seleccionar una asignatura adicional");
    }
    else{
        var id_grupo = $("#grupo_prim").val();
        var text_grupo = $("#grupo_prim option:selected").text();
        var arr_ids = obj_grid.get_all_ids("idasigextraprim");
        var existe = arr_ids.indexOf(idasigadiconal);
        if(existe > -1){
          obj_notification.error(text_asigadicional+" ya es asignatura del grupo "+text_grupo);
        }else{
          obj_gruposprim.add_asigadicional_agrupo(id_grupo,idasigadiconal);
        }
    }
});

$("#btn_gruposprim_deleteasigadicional").click(function(e){
    e.preventDefault();
    obj_notification.dismissible();
      var arr_row = obj_grid.get_row_selected();
      var datos = arr_row[0];
      if (datos != null && datos['idasigextraprim'] > 0) {
        var id_grupo = $("#grupo_prim").val();
        obj_gruposprim.delete_asigadicional_degrupo(id_grupo,datos['idasigextraprim']);
      }
      else {
        obj_notification.error("Seleccione una asignatura adicional");
      }
});



 function Gruposprim(){
   _this = this;
 }

 Gruposprim.prototype.add_asesor_grupo = function(id_grupo,id_personal){
   $.ajax({
       url : base_url+"asignaturasadicionales/add_asesor_grupo",
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
           $("#wait").modal("hide");
           obj_notification.error("Ocurrió un error al intentar asignar el asesor");
       }
   });
 };

 Gruposprim.prototype.get_cupo_yasesor_ygrid = function(id_grupo){
   $.ajax({
       url : base_url+"asignaturasadicionales/get_cupo_yasesor_ygrid",
       dataType : 'json',
       method : 'POST',
       data : {id_grupo : id_grupo},
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
           $("#wait").modal("hide");

           var text_grupo = $("#grupo_prim option:selected").text();
           $("#lbl_gruposprim_gradogrupo").empty();
           $("#lbl_gruposprim_gradogrupo").append(text_grupo);

           $("#cupo").val(data['cupo']);

           $("#grid_grupoprim_asigadicionales").empty();
           $("#grid_grupoprim_asigadicionales").append(data.str_grid);

           $("#slc_gruposprim_personal").empty();
           $("#slc_gruposprim_personal").html(data.str_select_personal);
           $("#slc_gruposprim_personal").val(data['asesor']);

           $("#div_gruposprim_detalles").show();
       },
       error: function(error){
         $("#wait").modal("hide");
         obj_notification.error("No se pudo recuperar el cupo del grupo");
       }
   });// ajax
 };

 Gruposprim.prototype.add_asigadicional_agrupo = function(id_grupo,idasigadiconal){
   $.ajax({
      url : base_url+"asignaturasadicionales/add_asigadicional_agrupo",
       dataType : 'json',
       method : 'POST',
       data : {"id_grupo" : id_grupo, "idasigadiconal":idasigadiconal},
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
           $("#wait").modal("hide");
           if(data.result){
             var text_grupo = $("#grupo_prim option:selected").text();
             var text_asigadicional = $("#slt_gruposprim_asigadicionales option[value="+idasigadiconal+"]").text();
             $("#slt_gruposprim_asigadicionales").val(0);

             obj_notification.success(text_asigadicional+" agregada correctamente a "+text_grupo);
             _this.get_cupo_yasesor_ygrid(id_grupo);
           }else{
              obj_notification.error("No se pudo agregar, reintente porfavor");
           }
       },
       error: function(error){
         $("#wait").modal("hide");
         obj_notification.error("No se pudo agregar, reintente porfavor");
       }
   });// ajax
 };

 Gruposprim.prototype.delete_asigadicional_degrupo = function(id_grupo,idasigadiconal){
   $.ajax({
      url : base_url+"asignaturasadicionales/delete_asigadicional_degrupo",
       dataType : 'json',
       method : 'POST',
       data : {"id_grupo" : id_grupo, "idasigadiconal":idasigadiconal},
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
           $("#wait").modal("hide");
           if(data.result){
             var text_grupo = $("#grupo_prim option:selected").text();
             var text_asigadicional = $("#slt_gruposprim_asigadicionales option[value="+idasigadiconal+"]").text();
             $("#slt_gruposprim_asigadicionales").val(0);

             obj_notification.success(text_asigadicional+" eliminada correctamente de "+text_grupo);
             _this.get_cupo_yasesor_ygrid(id_grupo);
           }else{
              obj_notification.error("No se pudo eliminar, reintente porfavor");
           }
       },
       error: function(error){
         $("#wait").modal("hide");
         obj_notification.error("No se pudo eliminar, reintente porfavor");
       }
   });// ajax
 };
