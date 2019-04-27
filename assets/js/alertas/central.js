$(document).ready(function () {
  obj_grid_alertas_escolar = new Grid("grid_alertas_escolar");
});

function edita_alerta_central(filtro){
  let str_filtro = filtro.toString();
  let partes = str_filtro.split('-');
  // window.location.href=base_url+"Alertas/edit_central/"+partes[0]+"/"+partes[1]+"/"+partes[2];
  window.location.href=base_url+"alertas/central/editar/"+partes[0]+"/"+partes[1]+"/"+partes[2];
}

function get_gridpaginador(pagina){
  Alertas_escolar.inicio(pagina);
}

let Alertas_escolar = {
  inicio : (offset) => {
    obj_grid_alertas_escolar.get_gridpaginador(offset, "Alertas", "get_gridpaginador2","form_cctcentral");
  }


};
