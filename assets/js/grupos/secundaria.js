$(document).ready(function(){
  obj_grupossec = new Grupossec();
});

$("#grupo_sec").change(function (){
  _thisgrupossec.obj_notification.dismissible();
  $("#slc_grupossec_asigestatal").val(0);
  $("#slc_grupossec_segundalengua").val(0);

  $("#div_grupossec_detalles").hide();
  $("#div_cupo").hide();
  var idgrupo = $(this).val();
  if(idgrupo == 0){
    $("#div_grupossec_detalles").hide();
    $("#div_cupo").hide();
  }else{
      obj_grupossec.get_cupo_yasesor_ygrid(idgrupo);
  }
});

$("#slt_grupossec_asigadicionales").change(function (){
  _thisgrupossec.obj_notification.dismissible();
});

$("#slc_grupossec_personal").change(function (){
  _thisgrupossec.obj_notification.dismissible();
});

$("#btn_grupossec_grabarasesor").click(function(e){
    e.preventDefault();
    _thisgrupossec.obj_notification.dismissible();
    var id_grupo = $('#grupo_sec').val();
    var id_personal = $('#slc_grupossec_personal').val();
    if(id_grupo==0){
      _thisgrupossec.obj_notification.error("Debe seleccionar un grupo");
    }else{
      if(id_personal==0){
        _thisgrupossec.obj_notification.error("Debe seleccionar un asesor");
      }else{
          obj_grupossec.add_asesor_grupo(id_grupo,id_personal);
      }
    }
});

$("#btn_grupossec_addasigadicional").click(function(e){
    e.preventDefault();
    _thisgrupossec.obj_notification.dismissible();
    var idasigadiconal = $("#slt_grupossec_asigadicionales").val();
    var text_asigadicional = $("#slt_grupossec_asigadicionales option:selected").text();
    if(idasigadiconal==0){
      _thisgrupossec.obj_notification.error("Debe seleccionar una asignatura adicional");
    }
    else{
        var id_grupo = $("#grupo_sec").val();
        var text_grupo = $("#grupo_sec option:selected").text();
        var arr_ids = _thisgrupossec.obj_grid.get_all_ids("idasigextrasec");
        var existe = arr_ids.indexOf(idasigadiconal);
        if(existe > -1){
          _thisgrupossec.obj_notification.error(text_asigadicional+" ya es asignatura del grupo "+text_grupo);
        }else{
          obj_grupossec.add_asigadicional_agrupo(id_grupo,idasigadiconal);
        }
    }
});

$("#btn_grupossec_deleteasigadicional").click(function(e){
      e.preventDefault();
      _thisgrupossec.obj_notification.dismissible();
      var arr_row = _thisgrupossec.obj_grid.get_row_selected();
      var datos = arr_row[0];
      if (datos != null && datos['idasigextrasec'] > 0) {
        var id_grupo = $("#grupo_sec").val();
        obj_grupossec.delete_asigadicional_degrupo(id_grupo,datos['idasigextrasec']);
      }
      else {
        _thisgrupossec.obj_notification.error("Seleccione una asignatura adicional");
      }
});

 function Grupossec(){
   _thisgrupossec = this;
   _thisgrupossec.obj_notification = new Notification("gruposec_notifications");
   _thisgrupossec.obj_grid = new Grid("grid_gruposec_asigadicionales");
 }

 Grupossec.prototype.add_asesor_grupo = function(id_grupo,id_personal){
   var id_estatal = $("#slc_grupossec_asigestatal").val();
   var id_lenguaje = $("#slc_grupossec_segundalengua").val();

   $.ajax({
       url : base_url+"asignaturasadicionales/add_asesor_grupo",
       dataType : 'json',
       method : 'POST',
       data : {
           'id_grupo' : id_grupo,
           'id_personal' : id_personal,
           'id_estatal' : id_estatal,
           'id_lenguaje' : id_lenguaje
       },
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
         $("#wait").modal("hide");
         if(data.result){
           var text_grupo = $("#grupo_sec option:selected").text();
           if(id_estatal ==0 || id_lenguaje == 0){
             _thisgrupossec.obj_notification.success("Se aplicaron los cambios a "+text_grupo+" pero segunda lengua y asignatura estatal no pueden ser vacíos");
           }else{
             _thisgrupossec.obj_notification.success("Se aplicaron los cambios a "+text_grupo);
           }
           obj_grupossec.get_cupo_yasesor_ygrid(id_grupo);
         }else{
           _thisgrupossec.obj_notification.error("Ocurrió un error al intentar asignar el asesor");
         }
       },
       error: function(error){
          $("#wait").modal("hide");
           _thisgrupossec.obj_notification.error("Ocurrió un error al intentar asignar el asesor");
       }
   });
 };

 Grupossec.prototype.get_cupo_yasesor_ygrid = function(id_grupo){
   $.ajax({
       url : base_url+"asignaturasadicionales/get_cupo_yasesor_ygrid",
       dataType : 'json',
       method : 'POST',
       data : { 'id_grupo' : id_grupo },
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
           $("#wait").modal("hide");

          var text_grupo = $("#grupo_sec option:selected").text();
          $("#lbl_gruposec_gradogrupo").empty();
          $("#lbl_gruposec_gradogrupo").append(text_grupo);

           $("#cupo").val(data['cupo']);

           $("#slc_grupossec_personal").val(data['asesor']);
           $("#grid_gruposec_asigadicionales").empty();
           $("#grid_gruposec_asigadicionales").append(data.str_grid);

           /* Vamos a poner EST y LENG*/
           var arr_asigextras = data.arr_asigextras;
           for(var i=0;i<arr_asigextras.length; i++){
             if(arr_asigextras[i]['tipo'] == "EES"){
               $("#slc_grupossec_asigestatal").val( arr_asigextras[i]['idasigextrasec'] );
             }
             if(arr_asigextras[i]['tipo'] == "ELG"){
               $("#slc_grupossec_segundalengua").val( arr_asigextras[i]['idasigextrasec'] );
             }
           }

           $("#div_grupossec_detalles").show();
           $("#div_cupo").show();
       },
       error: function(error){
         $("#wait").modal("hide");
         _thisgrupossec.obj_notification.error("No se pudo recuperar el cupo del grupo");
       }
   });// ajax
 };

 Grupossec.prototype.add_asigadicional_agrupo = function(id_grupo,idasigadiconal){
   $.ajax({
      url : base_url+"asignaturasadicionales/add_asigadicional_agrupo",
       dataType : 'json',
       method : 'POST',
       data : { 'id_grupo' : id_grupo, 'idasigadiconal':idasigadiconal },
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
           $("#wait").modal("hide");
           if(data.result){
             var text_grupo = $("#grupo_sec option:selected").text();
             var text_asigadicional = $("#slt_grupossec_asigadicionales option[value="+idasigadiconal+"]").text();
             $("#slt_grupossec_asigadicionales").val(0);

             _thisgrupossec.obj_notification.success(text_asigadicional+" agregada correctamente a "+text_grupo);
             _thisgrupossec.get_cupo_yasesor_ygrid(id_grupo);
           }else{
              _thisgrupossec.obj_notification.error("No se pudo agregar, reintente porfavor");
           }
       },
       error: function(error){
         $("#wait").modal("hide");
         _thisgrupossec.obj_notification.error("No se pudo agregar, reintente porfavor");
       }
   });// ajax
 };

 Grupossec.prototype.delete_asigadicional_degrupo = function(id_grupo,idasigadiconal){
   $.ajax({
      url : base_url+"asignaturasadicionales/delete_asigadicional_degrupo",
       dataType : 'json',
       method : 'POST',
       data : { 'id_grupo' : id_grupo, 'idasigadiconal':idasigadiconal },
       beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
       success: function(data){
           $("#wait").modal("hide");
           if(data.result){
             var text_grupo = $("#grupo_sec option:selected").text();
             var text_asigadicional = $("#slt_grupossec_asigadicionales option[value="+idasigadiconal+"]").text();
             $("#slt_grupossec_asigadicionales").val(0);

             _thisgrupossec.obj_notification.success(text_asigadicional+" eliminada correctamente de "+text_grupo);
             _thisgrupossec.get_cupo_yasesor_ygrid(id_grupo);
           }else{
              _thisgrupossec.obj_notification.error("No se pudo eliminar, reintente porfavor");
           }
       },
       error: function(error){
         $("#wait").modal("hide");
         _thisgrupossec.obj_notification.error("No se pudo eliminar, reintente porfavor");
       }
   });// ajax
 };
