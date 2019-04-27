/* jshint esversion: 6 */

$(document).ready(function () {

  obj_grid_mensajes_escolar = new Grid("grid_mensajes_escolar");

  let idusuario = $("#itxt_mensajes_idusuario").val();
  $("#grid_mensajes_escolar tbody tr").each(function (index)
  {
    var fila = this;

    $(this).children("td").each(function (index)
    {
      let id = $(this).attr('id');
      if(id == 'idmensaje'){
        idmensaje = $(this).attr('data');
      }

      if(id == 'idusuario_mensaje'){
        let idusuario_mensaje =  $(this).attr('data');
        if(idusuario_mensaje == idusuario){
            let hijos = $(fila).children('td');

            let hijo1 = hijos[1];
            let idmensaje = $(hijo1).attr('data');

            let hijo9 = hijos[9];
            let center = $(hijo9).children('center');
            let boton = $(center).children('button');
            $(center).remove();
            $(boton).remove();

            let str_btn = "<center><button class='btn' onclick='redirect_mensaje("+idmensaje+",0)'> <i class='fa fa-edit'></i></button><center>";
            $(hijo9).append(str_btn);
        }
        else if (idusuario_mensaje != idusuario) {
          let hijos = $(fila).children('td');
          let hijo10 = hijos[10];
          let center = $(hijo10).children('center');
          let boton = $(center).children('button');
          $(center).remove();
          $(boton).remove();
        }

      }

    })
  });

}); // ready


function get_gridpaginador(pagina){
  Mensajes_escolar.inicio(pagina);
}

function delete_mensaje(idmensaje){
  bootbox.confirm({
    message: '<b>¿Está seguro de dar de baja el registro?</b>',
    buttons: {
        confirm: {
            label: 'Aceptar',
            className: 'btn-primary'
        },
        cancel: {
            label: 'Cancelar',
            className: 'btn-default'
        }
    },
    callback: function (result) {
        if (result) {
          delete_mensaje_confirm(idmensaje);
        } else {
          // nada...
        }

    }
  });
}

function redirect_mensaje(idmensaje, redirect = 1){
  var form = document.createElement("form");
  var element1 = document.createElement("input");
  form.name = "form_redirect_mensaje";
  form.id = "form_redirect_mensaje";
  form.method = "POST";
  form.target = "_self";
  form.action = base_url+"mensajes/nuevoMensaje/"+idmensaje;
  element1.type = "hidden";
  element1.value = redirect;
  element1.name="redirect";
  form.appendChild(element1);
  document.body.appendChild(form);
  form.submit();
}// redirect_mensaje()


function delete_mensaje_confirm(idmensaje){
  var form = document.createElement("form");
  var element1 = document.createElement("input");
  form.name = "form_redirect_mensaje";
  form.id = "form_redirect_mensaje";
  form.method = "POST";
  form.target = "_self";
  form.action = base_url+"mensajes/elimina_mensaje_escolar/"+idmensaje;
  element1.type = "hidden";
  element1.value = 1;
  element1.name="redirect";
  form.appendChild(element1);
  document.body.appendChild(form);
  form.submit();
}// delete_mensaje_confirm()

let Mensajes_escolar = {
  inicio : (offset) => {
    obj_grid_mensajes_escolar.get_gridpaginador(offset, "Mensajes", "get_gridpaginador","form_mensajes_escolar");
  }
};
