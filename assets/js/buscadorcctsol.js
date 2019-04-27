
///Nuevo buscador CCT//////////

$(function() {
obj_solicitudcct = new BuscadorSolicitudCCT();
});


  $("#buscacct").click(function(e){
    e.preventDefault();
      obj_solicitudcct.get_view_buscadorcct();
  });


  function BuscadorSolicitudCCT(){
     this_bcct = this;
  }

  function alimenta_campo_cct(){
      var cct = obj_bcct.get_cct();
      $("#cct_filtro").val("");
      $("#cct_filtro").val(cct);

      obj_bcct = null;
  }// alimenta_campo_cct()

  function destruye_buscadorcct(){
    obj_bcct = null;
  }// destruye_buscadorcct()

  function get_gridpaginador(offset){
    if($("#modal_buscadorcct").is(":visible")){
      this_obj_grid_solicitud = new Grid('grid_buscadorcct');
      this_obj_grid_solicitud.get_gridpaginador(offset, "Buscadorcct", "get_grid","form_cctcentral");
    }else{
      obj_cfcentral.get_grid(offset);
    }
  }// get_gridpaginador()

BuscadorSolicitudCCT.prototype.get_view_buscadorcct = function (){
  $.ajax({
    url:base_url+"Buscadorcct/get_view_buscadorcct",
    method:"POST",
    data:{
        "idregion" : $("#region").val(),
        "idmunicipio" : $("#municipio").val(),
        "idnivel" : $("#nivel").val(),
        "idzona" : $("#zona").val(),
      },
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      $("#div_solictud_buscador").empty();
      $("#div_solictud_buscador").append(data.str_view);
      obj_bcct = null;
      obj_bcct = new Buscadorcct("div_solictud_buscador");// el iddiv donde se concatena el string también servirá para disparar el evento
      obj_bcct.init();
      document.getElementById('div_solictud_buscador').addEventListener('cct_seleccionada',alimenta_campo_cct,false);
      document.getElementById('div_solictud_buscador').addEventListener('event_salir_buscador',destruye_buscadorcct,false);

    },
    error: function(error){
      console.log(error);
    }
  });
};
