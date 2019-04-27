/* jshint esversion: 6 */
let Helpers = {

  get_idnivel_xstring : (str_nivel) => {
    let respuesta = null;
    switch (str_nivel) {
      case STR_PREE:
          respuesta = ID_PREE;
      break;
      case STR_PRIM:
          respuesta = ID_PRIM;
      break;
      case STR_SEC:
          respuesta = ID_SEC;
      break;
    }

    return respuesta;
  },

  get_class_heading : () => {
    let clase = "bg-color-1";

    let container =  $('.mainContent').children("div");
    let panel =  $(container).children("div");
    let panel_heading =  $(panel).children("div");

    let clases = $(panel_heading).attr('class');
    if(clases != null ){
      let existe_clase = clases.indexOf("bg-color"); // Devuelve -1 si no se encuentra

      if(existe_clase > -1){
        let porciones = clases.split(' ');
        clase = porciones[1];
      }
    }

    return clase;
  },

  alert : (mensaje, tipo) => {
    let icono = "";
    if(tipo == "error"){
      icono = "<i class='fa fa-times-circle' style='font-size:24px;color:red'></i><br>";
    }else if ("success") {
      icono = "<i class='fa fa-check-circle' style='font-size:24px;color:green'></i><br>";
    }

    bootbox.alert({
      message: '<b>'+icono+''+mensaje+'</b>',
      size: 'small',
      buttons: {
        ok: {
          label: 'Aceptar',
          className:'btn btn-primary'
        }
      }
    });
  },

  error_ajax : function(jqXHR, textStatus, errorThrown){
    if (jqXHR.status === 0) {
      Helpers.alert("Not connect: Verify Network", "error");
    } else if (jqXHR.status == 404) {
      Helpers.alert("Requested page not found [404]", "error");
    } else if (jqXHR.status == 500) {
      Helpers.alert("Internal Server Error [500]", "error");
    } else if (textStatus === "parsererror") {
      Helpers.alert("Requested JSON parse failed", "error");
    } else if (textStatus === "timeout") {
      Helpers.alert("Time out error", "error");
    } else if (textStatus === "abort") {
      Helpers.alert("Ajax request aborted", "error");
    } else {
      Helpers.alert("Uncaught Error: "+qXHR.responseText, "error");
    }

  },

  redirige_index : function(){
    parent.location = base_url;
  }



};
