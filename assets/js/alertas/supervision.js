$(document).ready(function () {
  obj_grid_alertas_supervision = new Grid("grid_alertas_supervision");
});

function edita_alerta_supervision1(filtro){

  let str_filtro = filtro.toString();
  let partes = str_filtro.split('-');

  // window.location.href=base_url+"Alertas/edit_supervision1/"+partes[0]+"/"+partes[1]+"/"+partes[2];
  window.location.href=base_url+"alertas/supervision/editar/"+partes[0]+"/"+partes[1]+"/"+partes[2];
}

function get_gridpaginador(pagina){
  Alertas_supervision.inicio(pagina);
}

let Alertas_supervision = {
  inicio : (offset) => {
    obj_grid_alertas_supervision.get_gridpaginador(offset, "Alertas", "get_gridpaginador1","form_alertas_supervision");
  }
};


$("#btn_alertas_supervision_buscar").click(function(e){
  e.preventDefault();
  Alertas_supervision.inicio(0);
});

$("#btn_alertas_supervision_limpiar").click(function(e){
  e.preventDefault();
  $("#centro").val("");
});
