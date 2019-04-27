$(function() {
    objeto_grupo = new OperacionesGrupos();
});

$("#slt_gclub_ambito").change(function(event) {
  console.log($(this).val());
  objeto_grupo.filtrar_temas($(this).val())
});

$("#btn_filtra_busquedaG").click(function(event) {
  // alert("funciona boton");
  var idambito = $("#slt_gclub_ambito").val();
  var idtema = $("#slt_gclub_tema").val();
  var idbloque = $("#slt_gclub_bloque").val();
  objeto_grupo.grupos_ajax(idambito, idtema, idbloque);
});

function OperacionesGrupos(){
  _thisclub_add_grupo = this.id;
}


OperacionesGrupos.prototype.filtrar_temas = function(idambito){
  $.ajax({
     url:base_url+"Clubes/get_temas_xambito",
     method:"POST",
     data:{"idambito": idambito},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
       $("#wait").modal("hide");
       $("#slt_gclub_tema").empty();
       $("#slt_gclub_tema").append(data.temas);

     },
     error: function(error){
       $("#wait").modal("hide");
       console.error("error al grabar");
       console.table(error);
     }
   });
}

OperacionesGrupos.prototype.grupos_ajax = function(idambito, idtema, idbloque){
  $.ajax({
     url:base_url+"Clubes/get_grupos_ajax",
     method:"POST",
     data:{"idambito": idambito, "idtema": idtema, "idbloque": idbloque},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
       $("#wait").modal("hide");
       $("#contenedor_gruposc").empty();
       $("#contenedor_gruposc").append(data.str_grid);

     },
     error: function(error){
       $("#wait").modal("hide");
       console.error("error al grabar");
       console.table(error);
     }
   });
}

function get_gridpaginador(offset){

  if (obj_grids==null) {
    obj_grid.get_gridpaginador(offset, "Clubes", "get_clubes","form_clubes_admin");
  }
  else {
    obj_grids.get_gridpaginador(offset, "Clubes", "get_grupos_ajax","");
  }
}
