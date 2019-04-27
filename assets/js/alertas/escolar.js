$(document).ready(function () {
  obj_grid_alertas_escolar = new Grid("grid_alertas_escolar");
});

function edita_alerta(idalerta){
  // window.location.href=base_url+"Alertas/edit_escolar/"+idalerta;
  window.location.href=base_url+"alertas/escolar/editar/"+idalerta;
}

function get_gridpaginador(pagina){
  Alertas_escolar.inicio(pagina);
}

let Alertas_escolar = {
  inicio : (offset) => {
    obj_grid_alertas_escolar.get_gridpaginador(offset, "Alertas", "get_gridpaginador","form_alertas_escolar");
  }
};
