$('#btn_buscador_exp').click(function(e){
  e.preventDefault();
  obj_expediente = new BuscadorExpediente();
  obj_expediente.get_view_buscadorcct();
});

function BuscadorExpediente(){
   this_bcct = this;
}

BuscadorExpediente.prototype.alimenta_campo_cct_expediente = function (){

  var idcentrocfg = obj_bcct_expediente.get_idcentrocfg();
  var cct = obj_bcct_expediente.get_cct();
  var idnivel = obj_bcct_expediente.get_idnivel();
  var prefijo = (idnivel == 1)?'pree':((idnivel == 2)?'prim':((idnivel == 3)?'sec':''));

  var nivel = ''

  if(idnivel==1){
    nivel ='pree';
  }else if(idnivel==2){
    nivel ='prim';
  }else if(idnivel==3){
    nivel ='sec';
  }
  $('#nivel').val(nivel);
  //
  $("#cct_crea_expediente").val("");
  $("#cct_crea_expediente").val(cct);
  //
  seleccionaCT(idcentrocfg, cct, '_crea_expediente', prefijo);
  //
  obj_bcct_expediente = null;
};

BuscadorExpediente.prototype.destruye_buscadorcct_expediente = function (){
  obj_bcct_expediente = null;
};

BuscadorExpediente.prototype.get_view_buscadorcct = function (){
  $.ajax({
    url:base_url+"Buscadorcct/get_view_buscadorcct",
    method:"POST",
    data:{
        "idnivel" : ($("#nivel").val()=='')?"1,2,3":$("#nivel").val(),
        "idregion" : 0,
        "idmunicipio" : 0,
        "idzona" : 0
      },
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      $("#div_buscadorcct_expediente").empty();
      $("#div_buscadorcct_expediente").append(data.str_view);
      obj_bcct_expediente = null;
      obj_bcct_expediente = new Buscadorcct("div_buscadorcct_expediente");// el iddiv donde se concatena el string también servirá para disparar el evento
      obj_bcct_expediente.init();
      document.getElementById('div_buscadorcct_expediente').addEventListener('cct_seleccionada',obj_expediente.alimenta_campo_cct_expediente,false);
      document.getElementById('div_buscadorcct_expediente').addEventListener('event_salir_buscador',obj_expediente.destruye_buscadorcct_expediente,false);

    },
    error: function(error){
      console.log(error);
    }
  });
};
