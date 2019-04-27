$(document).ready(function () {
  // obj_alertas_E = new Listado_escolar();
  obj_grid_listado_escolar = new Grid("get_grid_listado_usuarios_escolar");

});

// function edita_alerta(idalerta){
//   window.location.href=base_url+"Alertas/edit_escolar/"+idalerta;
// }

function get_gridpaginador(pagina){
  Listado_escolar.inicio(pagina);
}

let Listado_escolar = {
  inicio : (offset) => {
    obj_grid_listado_escolar.get_gridpaginador(offset, "Escolar", "get_gridpaginador3","form_listado_escolar");
  }


};


$("#btn_usuario_escolar_buscar").click(function(e){
  e.preventDefault();
  Listado_escolar.inicio(0);
});


$("#btn_usuario_escolar_limpiar").click(function(e){
  e.preventDefault();
  $("#busqueda_nombre").val("");

});



$("#btn_usuario_escolar_cambio_c").click(function(e){
 e.preventDefault();
 var arr_row_buscador = obj_grid_listado_escolar.get_row_selected();
 // console.info(arr_row_buscador);
   // alert(arr_row_buscador[0]['idusuario']);return false
 if(arr_row_buscador.length==0 || arr_row_buscador[0]['idusuario_hidden'] == undefined){
  alert("selecciona un usuario");return false
 }else{
  window.location.href=base_url+"usuario/cambio_contrasena/"+arr_row_buscador[0]['idusuario_hidden'];
 }
});


$("#btn_usuario_escolar_crear").click(function(e){
  e.preventDefault();
window.location.href=base_url+"escolar/nuevo-usuario/";
});
