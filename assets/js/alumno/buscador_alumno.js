

$("#btn_buscador_alumno_expedi").click(function(e){
  e.preventDefault();
    obj_balumno = new BuscadorAlumnoExp();
    obj_balumno.get_view_buscadorcct();
  // alert("funciona");
});

function BuscadorAlumnoExp(){
   this_bcct = this;
}

BuscadorAlumnoExp.prototype.alimenta_campo_cct_alumno = function (){
  var cct = obj_bcct_alumno.get_cct();
  var idcentrocfg = obj_bcct_alumno.get_idcentrocfg();

  let idnivel = obj_bcct_alumno.get_idnivel();
  let nivel_filtro = '';
  if(idnivel==1){
    nivel_filtro ='pree';
  }else if(idnivel==2){
    nivel_filtro ='prim';
  }else if(idnivel==3){
    nivel_filtro ='sec';
  }
  $("#nivel_filtro").val(nivel_filtro)

  // INICIA PARA REPORTES CENTRAL
  document.getElementById("grupo_cambio_subfijo").value=nivel_filtro;
  // TERMINA PARA REPORTES CENTRAL

  $("#cct_filtro").val("");
  $("#cct_filtro").val(cct);

  get_grupos(idcentrocfg, '_filtro');

  obj_bcct_alumno = null;
};

BuscadorAlumnoExp.prototype.destruye_buscadorcct_alumno = function (){
  obj_bcct_alumno = null;
};


function get_gridpaginador(offset){
  if($("#modal_buscadorcct").is(":visible")){
    this_obj_grid_alumno = new Grid('grid_buscadorcct');
    this_obj_grid_alumno.get_gridpaginador(offset, "Buscadorcct", "get_grid","form_buscadorcct");
  }else{
    this_obj_grid_alumno.get_grid(offset);
  }
}// get_gridpaginador()


BuscadorAlumnoExp.prototype.get_view_buscadorcct = function (){
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
      obj_bcct_alumno = null;
      obj_bcct_alumno = new Buscadorcct("div_escuelas_alumno_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
      obj_bcct_alumno.init();
      document.getElementById('div_escuelas_alumno_buscadorcct').addEventListener('cct_seleccionada',obj_balumno.alimenta_campo_cct_alumno,false);
      document.getElementById('div_escuelas_alumno_buscadorcct').addEventListener('event_salir_buscador',obj_balumno.destruye_buscadorcct_alumno,false);

    },
    error: function(error){
      console.log(error);
    }
  });
};
