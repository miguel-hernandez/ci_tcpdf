$(document).ready(function () {
  obj_grid_sup = new Grid("grid_rutamejora_supervisor"); // Objeto de acceso global para usarlo con clicks btn
  obj_notification = new Notification("ruta_notifications_super");
  obj_notifications = new Notifications("ruta_notifications_super");
  rutasup = new RutamejoraSuper();
});

$("#btn_rutamejora_supervisor").click(function (e) {
  e.preventDefault();
  var arr_row = obj_grid_sup.get_row_selected();

  var datos = arr_row[0];
  if (datos != null && datos['idrutamtema'] > 0 ) {
    rutasup.get_view(datos["idrutamtema"]);
  }
  else {
    // obj_notification.error("Seleccione un registro de la tabla");
    /*
    bootbox.alert({
    message: "<br><b>Seleccione un registro de la tabla</b>",
    size: 'small'
    });
    */
    Helpers.alert("Seleccione un registro", "error");
  }
});

$("#btn_mostrar_rutas_supervisor").click(function(e){
  e.preventDefault();
  var seleccionado = $("#slc_escuelas_supervisor option:selected").val();
  // console.log(seleccionado);
  if(seleccionado != null && seleccionado != ""){
    rutasup.datosxescuelasupervisor(seleccionado);
    // obj_notification.dismissible();
  }else{
    // obj_notification.error("Seleccione una escuela");
    /*
    bootbox.alert({
    message: "<br><b>Seleccione una escuela</b>",
    size: 'small'
    });
    */
    Helpers.alert("Seleccione una escuela", "error");

  }
});
$("#btn_mostrar_estadistica_supervisor").click(function(e){
  e.preventDefault();
  //alert("hola mundo");
  rutasup.get_view_estadistica();
});

$("#btn_ruta_grabar_supervisor").click(function(){
  var arr_row = obj_grid_sup.get_row_selected();
  var datos = arr_row[0];
  if(datos != null && datos['idrutamtema'] > 0){
    rutasup.inserta_observacion_supervisor(datos['idrutamtema']);
    // obj_notification.dismissible();
  }else{
    // obj_notification.error("Seleccione un registro de la tabla para asignar observacion");
    /*
    bootbox.alert({
    message: "<br><b>Seleccione un registro de la tabla para asignar observacion</b>",
    size: 'small'
    });
    */
      Helpers.alert("Seleccione un registro", "error");
    }
});

$("#btn_ver_obs_supervisor").click(function(){
  // e.preventDefault();
  var arr_row = obj_grid_sup.get_row_selected();
  var datos = arr_row[0];
  if (datos != null && datos['idrutamtema'] > 0 ) {
    // console.log(datos["idrutamtema"]);
    rutasup.get_comentarios(datos["idrutamtema"]);
    // obj_notification.dismissible();
  }
  else {
    /*
    bootbox.alert({
    message: "<br><b>Seleccione un registro de la tabla</b>",
    size: 'small'
    });
    */
    Helpers.alert("Seleccione un registro", "error");
  }
});


$("#btn_get_reporte_supervisor").click(function(e){
  e.preventDefault();
  var idcentrocfg = $("#slc_escuelas_supervisor option:selected").val();
  if(idcentrocfg == null || idcentrocfg == ""){
    /*
    bootbox.alert({
    message: "<br><b>Seleccione una escuela</b>",
    size: 'small'
    });
    */
    Helpers.alert("Seleccione una escuela", "error");
  }else{
    var paramRep = "reporte_rutamejora";
    var form = document.createElement("form");
    form.name = "form_rutamejora_reporte";
    form.id = "form_rutamejora_reporte";
    form.method = "POST";
    form.target = "_blank";
    form.action = base_url+"Reportes/generaReporte"+"/"+paramRep;

    var element1 = document.createElement("input");
    element1.type="hidden";
    element1.name="idcentrocfg";
    element1.value=idcentrocfg;
    form.appendChild(element1);

    document.body.appendChild(form);
    form.submit();
  }
});

function RutamejoraSuper(){
  _this = this;

}
RutamejoraSuper.prototype.datosxescuelasupervisor = function(idcentrocfg){
  $.ajax({
    // url : "llena_campos",
    url: base_url+"Rutademejora/xescuelasupervisor",
    data : { "idcentrocfg" :idcentrocfg},
    type : 'POST',
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success: function(data){
      $("#wait").modal("hide");
      var tabla = data.tabla;
      obj_grid_sup = new Grid("grid_rutamejora_supervisor");
      $("#grid_rutamejora_supervisor").empty();
      $("#grid_rutamejora_supervisor").append(tabla);
    },
    error: function(error){
      $("#wait").modal("hide");
      console.error("Falló:: "+JSON.stringify(error));
    }
  });
}

RutamejoraSuper.prototype.inserta_observacion_supervisor = function(idrutamtema){
  $.ajax({
    // url : "llena_campos",
    url: base_url+"Rutademejora/inserta_observacion_supervisor",
    data : { "idrutamtema" :idrutamtema, "observacion":$("#txt_rm_obssuper").val()},
    type : 'POST',
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success: function(data){
      $("#wait").modal("hide");
      // console.log(data.status);
      if(data.status == 1 || data.status == "1"){
        // obj_notification.success("Se inserto correctamente su observacion");
        /*
        bootbox.alert({
        message: "<br><b>Se inserto correctamente su observacion</b>",
        size: 'small'
        });
        */
        Helpers.alert("Observación creada correctamente", "success");
      $("#txt_rm_obssuper").val();
      }else{
        // obj_notification.error("Algo salio mal al intentar insertar la observacion");
        /*
        bootbox.alert({
        message: "<br><b>Algo salio mal al intentar insertar la observacion</b>",
        size: 'small'
        });
        */
        Helpers.alert("Ocurrió un error, reintente por favor", "error");
      }
    },
    error: function(error){
      $("#wait").modal("hide");
      console.error("Falló:: "+JSON.stringify(error));
    }
  });
}

RutamejoraSuper.prototype.get_view_estadistica = function(){
  $.ajax({
    // url : "llena_campos",
    url: base_url+"Rutademejora/get_view_estadistica",
    data : { idprioridad :"nada" },
    type : 'POST',
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success: function(data){
      $("#wait").modal("hide");

      var view = data.view;
      $("#ruta_notifications").empty();

      $("#tmp_aux").empty();
      // alert(view);
      $("#tmp_aux").append(view);
      //le_modal_objs_acts1
      $("#le_modal_estadistica").modal("show");


    },
    error: function(error){
      $("#wait").modal("hide");
      console.error("Falló:: "+JSON.stringify(error)); }
    });
  }


  RutamejoraSuper.prototype.get_view = function(idprioridad){
    $.ajax({
      // url : "llena_campos",
      url: base_url+"Rutademejora/get_view",
      data : { idprioridad : idprioridad },
      type : 'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(data){
        $("#wait").modal("hide");

        var view = data.view;
        $("#ruta_notifications").empty();

        $("#tmp_aux").empty();
        // alert(view);
        $("#tmp_aux").append(view);
        //le_modal_objs_acts1
        $("#le_modal_objs_acts").modal("show");


      },
      error: function(error){
        $("#wait").modal("hide");
        console.error("Falló:: "+JSON.stringify(error));
      }
    });
  }

  RutamejoraSuper.prototype.get_comentarios = function(rutaidtema){
    $("#txt_rm_obs").val("");
    $("#txt_rm_obssuper").val();
    $.ajax({
      url: base_url+"Rutademejora/get_comentarios_super",
      data : { 'rutaidtema' : rutaidtema },
      type : 'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(data){
        $("#wait").modal("hide");
        // console.log(data[0]);

        $("#txt_rm_obs").val(data[0]['observaciones']);
        $("#txt_rm_obssuper").val(data[0]['observacionessuperv']);
        // console.log(data);
      },
      error: function(error){
        $("#wait").modal("hide");
        console.error("Falló:: "+JSON.stringify(error));
      }
    });
  }

  $("#cerrar_le_modal_estadistica").click(function(){
    $('#le_modal_estadistica').modal('toggle');
  });
