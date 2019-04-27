$(document).ready(function(){
  obj_grid = new Grid("grid_asignaturasadicionales");
  obj_notification = new Notifications("div_asig_adicionales_eventos");
  obj_asig_adicionales = new Asignauras_adicionales();
});

$("#btn_asigadic_editar").click(function(e){
  e.preventDefault();
  var arr_row = obj_grid.get_row_selected();
  if(arr_row.length==0 || arr_row[0]['idsolicitud_asignatura'] == undefined){
    obj_notification.get_notification("error","Seleccione un registro");
  }else{
    obj_asig_adicionales.editar(arr_row[0]["idsolicitud_asignatura"]);
  }
});

$("#btn_asigadic_eliminar").click(function(e){
  e.preventDefault();
  var arr_row = obj_grid.get_row_selected();
  if(arr_row.length==0 || arr_row[0]['idsolicitud_asignatura'] == undefined){
    obj_notification.get_notification("error","Seleccione un registro");
  }else{
    console.info(arr_row);
    if(arr_row[0]['estatus']=="A" ){
      obj_notification.get_notification("alert","No es posible eliminar solicitudes de asignaturas atendidas");
    }
    else if (arr_row[0]['estatus']=="R") {
      obj_notification.get_notification("alert","No es posible eliminar solicitudes de asignaturas rechazadas");
    }
    else if (arr_row[0]['estatus']=="S") {
      obj_notification.get_notification("dialog","¿Eliminar "+arr_row[0]['descr']+"?");
      document.getElementById('div_asig_adicionales_eventos').addEventListener('confirmar',confirmar_eliminar,false);
      this_asig_adicionales.idsolicitud = arr_row[0]['idsolicitud_asignatura'];
      this_asig_adicionales.estatus = arr_row[0]['estatus'];
    }
  }
});

function confirmar_eliminar(){
  obj_asig_adicionales.eliminar();
}

function get_gridpaginador(offset){
  obj_asig_adicionales.get_gridpaginador(offset);
}// get_gridpaginador()

function Asignauras_adicionales(){
  this_asig_adicionales = this;
  this_asig_adicionales.idsolicitud = 0;
  this_asig_adicionales.estatus = "";
}

Asignauras_adicionales.prototype.editar = function(idsolicitud){
  var form = document.createElement("form");
  form.name = "form_asig_adicionales_editar";
  form.id = "form_asig_adicionales_editar";
  form.method = "POST";
  form.target = "_self";
  form.action = base_url+"asignaturasadicionales/nueva_solicitud/"+idsolicitud;
  document.body.appendChild(form);
  form.submit();
};

Asignauras_adicionales.prototype.eliminar = function(){
  var idsolicitud = this_asig_adicionales.idsolicitud;
  var estatus = this_asig_adicionales.estatus
  var idnivel = $("#itext_asigadic_idnivel").val();
  var form = document.createElement("form");
  form.name = "form_asig_adicionales_editar";
  form.id = "form_asig_adicionales_editar";
  form.method = "POST";
  form.target = "_self";
  form.action = base_url+"asignaturasadicionales/elimina_solicitud/"+idsolicitud+"/"+estatus+"/"+idnivel;
  document.body.appendChild(form);
  form.submit();
};

Asignauras_adicionales.prototype.get_gridpaginador = function(offset){
  obj_grid.get_gridpaginador(offset,"Asignaturasadicionales","get_gridpaginador", "");
};
