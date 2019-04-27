$(document).ready(function(){
  obj_notification = new Notification("grupopree_notifications");
  obj_adicionales = new Grupospree();
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
    Helpers.alert("Seleccione un grupoe", "error");
    // obj_notification.error("Seleccione un grupo");
  }else{
    if( (id_personal==0) || (id_personal=='0') || (id_personal == null) ){
      obj_notification.error("Seleccione un asesor");
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
    Helpers.alert("Debe seleccionar una asignatura adicionale", "error");
    // obj_notification.error("Debe seleccionar una asignatura adicional");
  }
  else{
    var id_grupo = $('#grupo_pree').val();
    var text_grupo = $("#grupo_pree option:selected").text();
    var arr_ids = obj_grid.get_all_ids("idasigextrapree");
    var existe = arr_ids.indexOf(idasigadiconal);
    if(existe > -1){
      Helpers.alert(text_asigadicional+" ya es asignatura del grupo "+text_grupo, "error");
      // obj_notification.error(text_asigadicional+" ya es asignatura del grupo "+text_grupo);
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
    Helpers.alert("Seleccione una asignatura adicional", "error");
  }
});

function Grupospree(){
  _thisgrupospree = this;
}

Grupospree.prototype.add_asesor_grupo = function(id_grupo,id_personal){
  $.ajax({
    url : base_url+"asignaturasadicionales/add_asesor_grupo",
    dataType : 'json',
    method : 'POST',
    data : {
      'id_grupo' : id_grupo,
      'id_personal' : id_personal
    },
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success: function(data){
      $("#wait").modal("hide");
      if(data.result){
        Helpers.alert("Responsable de grupo asignado correctamente", "success");
      }else{
        Helpers.alert("Ocurrió un error al intentar asignar el asesor", "error");
      }
    },
    error: function(error){
      $("#wait").modal("hide");
      Helpers.alert("Ocurrió un error al intentar asignar el asesor", "error");
    }
  });
};

Grupospree.prototype.get_cupo_yasesor_ygrid = function(id_grupo){
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

      var text_grupo = $("#grupo_pree option:selected").text();
      $("#lbl_grupopree_gradogrupo").empty();
      $("#lbl_grupopree_gradogrupo").append(text_grupo);

      $("#cupo").val(data['cupo']);
      $("#personal_pree").val(data['asesor']);

      /* DIV DE ASIGNATURAS ADCIONALES NO DISPONIBLE
      $("#grid_grupopree_asigadicionales").empty();
      $("#grid_grupopree_asigadicionales").append(data.str_grid);
      */


      $("#div_detalles_pree").show();
    },
    error: function(error){
      $("#wait").modal("hide");
      Helpers.alert("No se pudo recuperar el cupo del grupo", "error");
      // obj_notification.error("No se pudo recuperar el cupo del grupo");
    }
  });// ajax
};

Grupospree.prototype.add_asigadicional_agrupo = function(id_grupo,idasigadiconal){
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
        var text_grupo = $("#grupo_pree option:selected").text();
        var text_asigadicional = $("#slt_grupopree_asigadicionales option[value="+idasigadiconal+"]").text();
        $("#slt_grupopree_asigadicionales").val(0);
        Helpers.alert(text_asigadicional+" agregada correctamente a "+text_grupo, "error");
        // obj_notification.success(text_asigadicional+" agregada correctamente a "+text_grupo);
        _thisgrupospree.get_cupo_yasesor_ygrid(id_grupo);
      }else{
        Helpers.alert("No se pudo agregar, reintente por favor","error");
        // obj_notification.error("No se pudo agregar, reintente porfavor");
      }
    },
    error: function(error){
      $("#wait").modal("hide");
      Helpers.alert("No se pudo agregar, reintente por favor","error");
      // obj_notification.error("No se pudo agregar, reintente por favor");
    }
  });// ajax
};

Grupospree.prototype.delete_asigadicional_degrupo = function(id_grupo,idasigadiconal){
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
        var text_grupo = $("#grupo_pree option:selected").text();
        var text_asigadicional = $("#slt_grupopree_asigadicionales option[value="+idasigadiconal+"]").text();
        $("#slt_grupopree_asigadicionales").val(0);
        Helpers.alert(text_asigadicional+" eliminada correctamente de "+text_grupo,"success");
        // obj_notification.success(text_asigadicional+" eliminada correctamente de "+text_grupo);
        _thisgrupospree.get_cupo_yasesor_ygrid(id_grupo);
      }else{
        Helpers.alert("No se pudo eliminar, reintente por favor","error");
        // obj_notification.error("No se pudo eliminar, reintente por favor");
      }
    },
    error: function(error){
      $("#wait").modal("hide");
      Helpers.alert("No se pudo eliminar, reintente por favor","error");
      // obj_notification.error("No se pudo eliminar, reintente porfavor");
    }
  });// ajax
};
