
$("#btn_alumno_cambiar_grupo").click(function(e){
  e.preventDefault();
  obj_cambiar_grupo = new CambiarAlumno();
    obj_cambiar_grupo.get_view_buscadorcct();
});

function CambiarAlumno(){
   this_bcct = this;
}


function get_gridpaginador(offset){
  if($("#modal_buscadorcct").is(":visible")){
    this_obj_grid_cambio = new Grid('grid_buscadorcct');
    this_obj_grid_cambio.get_gridpaginador(offset, "Buscadorcct", "get_grid","form_buscadorcct");
  }else{
    this_obj_grid_cambio.get_grid(offset);
  }
}// get_gridpaginador()

//
CambiarAlumno.prototype.alimenta_campo_cct_cambio = function (){
  var cct_cambio = obj_bcct_cambio.get_cct();

  var idcentrocfg = obj_bcct_cambio.get_idcentrocfg();
  var idnivel = obj_bcct_cambio.get_idnivel();
  var prefijo = (idnivel == 1)?'pree':((idnivel == 2)?'prim':((idnivel == 3)?'sec':''));

  $("#cct_cambio").val("");
  $("#cct_cambio").val(cct_cambio);

  seleccionaCT(idcentrocfg, cct_cambio, '_cambio', prefijo, '', '');

  obj_bcct_cambio = null;
};



CambiarAlumno.prototype.destruye_buscadorcct_cambio = function (){
  obj_bcct_cambio = null;
};

//


CambiarAlumno.prototype.get_view_buscadorcct = function (){

  $.ajax({
    url:base_url+"Buscadorcct/get_view_buscadorcct",
    method:"POST",
    data:{
        "idnivel" : ($("#nivel_filtro").val()=='')?"1,2,3":$("#nivel_filtro").val(),
        "idregion" : 0,
        "idmunicipio" : 0,
        "idzona" : 0
      },
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      $("#div_escuelas_alumno_buscadorcct").empty();
      $("#div_escuelas_alumno_buscadorcct").append(data.str_view);
      obj_bcct_cambio = null;
      obj_bcct_cambio = new Buscadorcct("div_escuelas_alumno_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
      obj_bcct_cambio.init();
      document.getElementById('div_escuelas_alumno_buscadorcct').addEventListener('cct_seleccionada',obj_cambiar_grupo.alimenta_campo_cct_cambio,false);
      document.getElementById('div_escuelas_alumno_buscadorcct').addEventListener('event_salir_buscador',obj_cambiar_grupo.destruye_buscadorcct_cambio,false);

    },
    error: function(error){
      console.log(error);
    }
  });
};
