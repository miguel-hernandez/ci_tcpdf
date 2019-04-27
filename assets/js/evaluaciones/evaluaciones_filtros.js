/* jshint esversion: 6 */

$("input[name=opcionesevaluaciones]").change(function () {
    let idgrupo = $("#slc_evaluaciones_idgrupo").val();
      if($(this).val() == "xalumnoeval"){
        $("#div_container_alumnos").show();
        $("#div_container_asignaturas").hide();
        $("#div_container_periodo").show();
        $("#div_evals_asignaturas").show();
        $("#div_evals_asigs").empty();

        Evaluaciones_filtros.get_expedientes_xidgrupo(idgrupo);
        // $("#slc_evaluaciones_idexpediente").trigger("change");

      }else if($(this).val() == "xasigeval"){
        $("#div_evals_asignaturas").empty();
        // $("#div_evals_labelsuperior").empty();
        $("#div_evals_clubes").empty();
        $("#div_evals_inasistencias").empty();

        $("#div_container_alumnos").hide();
        $("#div_evals_asignaturas").hide();
        // $("#div_evals_labelsuperior").hide();
        $("#div_evals_clubes").hide();
        $("#div_evals_inasistencias").hide();
        $("#div_evals_asigs").show();
        $("#div_container_periodo").show();
        $("#div_container_asignaturas").show();

        Evaluaciones_filtros.get_asignaturasxidgrupo(idgrupo);
      }
});

$("#slc_evaluaciones_asignatura").change(function(){
  let ruta="get_alumnos_x_asig";
  let idgrupo = parseInt($("#slc_evaluaciones_idgrupo").val());
  let idasignatura = parseInt($(this).val());
  let idperiodo=$('#slt_evaluaciones_periodo').val();
  if($('input[name=opcionesevaluaciones]:checked').val()=="xasigeval" && $("#itxt_evaluaciones_idnivel").val()==1){
    // idperiodo= $('#slt_periodo_asignatura').val();
    ruta="get_alumnos_x_asig_pre";
  }

  $.ajax({
       url:base_url+"Evaluaciones/"+ruta,
       method:"POST",
       data:{'idgrupo' : idgrupo, 'idasignatura' : idasignatura, 'idperiodo' : idperiodo,
       'idnivel' : $("#itxt_evaluaciones_idnivel").val()
     },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         $("#div_evals_asigs").empty();
         $("#div_evals_asigs").append(data.evalxasig);
       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });

});

$("#slt_periodo_asignatura").change(function(){
  let selected = $( "#slc_evaluaciones_idgrupo option:selected" );
  let tipo_grupo = $(selected).data('tipogrupo');

  if(tipo_grupo == "grupo"){
    // alert("grupo funka");
    Evaluaciones_filtros.get_expedientes_grupos_asig($(this));
  }else if (tipo_grupo == "grupo_club") {
    let idgrupo = $("#slc_evaluaciones_idgrupo").val();
      $("#slc_evaluaciones_asignatura").prop('disabled', true);
      Evaluaciones_filtros.get_expedientes_xidgrupoclub(idgrupo);
  }
});


$("#slt_evaluaciones_periodo").change(function(){
  let idexpediente = $("#slc_evaluaciones_idexpediente").val();
  let asignatura = $("#slc_evaluaciones_asignatura").val();
  if($('input[name=opcionesevaluaciones]:checked').val()=="xalumnoeval"){
    if(idexpediente>0){
      Evaluaciones_principal.get_view_evaluaciones();
    }
  }

  if($('input:radio[name=opcionesevaluaciones]:checked').val() == 'xasigeval' && $("#itxt_evaluaciones_idnivel").val()==1){
    if(asignatura>0){
      Evaluaciones_principal.get_view_evaluaciones();
    }
  }

});


$("#slc_evaluaciones_idgrupo").change(function(){
  Evaluaciones_filtros.hide_div_evaluaciones();

  // alert("slc_evaluaciones_idgrupo: "); return false;

  if($('input:radio[name=opcionesevaluaciones]:checked').val() == 'xalumnoeval'){
    let idgrupo = parseInt($(this).val());

    // alert("idgrupo: "+idgrupo); return false;
    Evaluaciones_principal.set_input_idgrupo(idgrupo);

    let selected = $( "#slc_evaluaciones_idgrupo option:selected" );
    let tipo_grupo = $(selected).data('tipogrupo');
    // alert(tipo_grupo); return false;

    if(tipo_grupo == "grupo"){
      Evaluaciones_filtros.hide_div_evaluaciones();
      Evaluaciones_filtros.get_expedientes_xidgrupo(idgrupo);
    }else if (tipo_grupo == "grupo_club") {

      $("#slc_evaluaciones_idexpediente").empty();
      Evaluaciones_filtros.hide_div_evaluaciones();
      // alert("Pendiente");
    }
  }else if($('input:radio[name=opcionesevaluaciones]:checked').val() == 'xasigeval' && $("#itxt_evaluaciones_idnivel").val()==1){
    let idgrupo = parseInt($(this).val());

    Evaluaciones_principal.set_input_idgrupo(idgrupo);

    let selected = $( "#slc_evaluaciones_idgrupo option:selected" );
    let tipo_grupo = $(selected).data('tipogrupo');
    // alert(tipo_grupo);

    if(tipo_grupo == "grupo"){
      // alert("grupo");
      let idgrupo = $("#slc_evaluaciones_idgrupo").val();
    Evaluaciones_filtros.get_asignaturasxidgrupo(idgrupo);
    $("#slc_evaluaciones_asignatura").prop('disabled', false);
    }else if (tipo_grupo == "grupo_club") {
      // alert("grupo club");
      let idgrupo = $("#slc_evaluaciones_idgrupo").val();
      // alert(idgrupo);
      $("#slc_evaluaciones_asignatura").prop('disabled', true);
      Evaluaciones_filtros.get_expedientes_xidgrupoclub(idgrupo);
    }
  }
});

$("#slc_evaluaciones_idexpediente").change(function(){

  Evaluaciones_filtros.hide_div_evaluaciones();
  let idexpediente = parseInt($(this).val());

  Evaluaciones_principal.set_input_idexpediente(idexpediente);
  if(idexpediente > 0){
    Evaluaciones_principal.get_view_evaluaciones();
   }
});

$("#btn_evaluaciones_instrucciones").click(function(e){
  e.preventDefault();
  alert( "Pendiente: "+$("#itxt_evals_asigs_nummaterias").val() );
});

let Evaluaciones_filtros = {

  hide_div_evaluaciones : () => {
    $("#div_evals_asignaturas").empty();
    $("#div_evals_clubes").empty();
    // $("#div_evals_labelsuperior").hide();
    $("#div_evals_inasistencias").hide();
  },

  get_expedientes_xidgrupo : (idgrupo) => {
    $.ajax({
       url:base_url+"Evaluaciones/get_expedientes_xidgrupo",
       method:"POST",
       data:{
         'idgrupo' : idgrupo,
         'idnivel' : $("#itxt_evaluaciones_idnivel").val()
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         var array_epedientes = data.array_expedientes;

         var options = "<option value=0>Seleccione alumno</option>";
         for (var i = 0; i < array_epedientes.length; i++) {
           options += "<option value="+array_epedientes[i].idexpediente+">"+array_epedientes[i].alumno+"</option>";
         }

         $("#slc_evaluaciones_idexpediente").empty();
         $("#slc_evaluaciones_idexpediente").append(options);

       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  },

  get_asignaturasxidgrupo : (idgrupo) => {
    $.ajax({
       url:base_url+"Evaluaciones/get_asignaturasxidgrupo",
       method:"POST",
       data:{
         'idgrupo' : idgrupo,
         'idnivel' : $("#itxt_evaluaciones_idnivel").val()
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         var asignaturas = data.asignaturas;

         var options = "<option value=0>Seleccione asignatura</option>";
         for (var i = 0; i < asignaturas.length; i++) {
           options += "<option data-tipoasig = "+asignaturas[i].tipo+" value="+asignaturas[i].idasig+">"+asignaturas[i].descr+"</option>";
         }
         $("#slc_evaluaciones_asignatura").empty();
         $("#slc_evaluaciones_asignatura").append(options);
         Evaluaciones_filtros.get_expedientes_grupos_asig($("#slt_periodo_asignatura"));
       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  },

  get_expedientes_xidgrupoclub : (idgrupo) => {
    $.ajax({
       url:base_url+"Evaluaciones/get_expedientes_xidgrupoclub",
       method:"POST",
       data:{
         'idgrupoc' : idgrupo,
         'idperiodo' : $("#slt_periodo_asignatura").val(),
         'idnivel' : $("#itxt_evaluaciones_idnivel").val()
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         $("#div_evals_asigs").empty();
         $("#div_evals_asigs").append(data.evalxasigclub);

       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  },

  get_expedientes_grupos_asig : (elemento) => {
    let idgrupo = parseInt($("#slc_evaluaciones_idgrupo").val());
    let idasignatura = parseInt($("#slc_evaluaciones_asignatura").val());
    let idnivel = $("#itxt_evaluaciones_idnivel").val();
    let idperiodo=$('#slt_evaluaciones_periodo').val();
    let ruta="get_alumnos_x_asig";

    if($('input[name=opcionesevaluaciones]:checked').val()=="xasigeval" && $("#itxt_evaluaciones_idnivel").val()==1){
      // idperiodo= $('#slt_periodo_asignatura').val();
      ruta="get_alumnos_x_asig_pre";
    }
    $.ajax({
         url:base_url+"Evaluaciones/"+ruta,
         method:"POST",
         data:{'idgrupo' : idgrupo,
         'idasignatura' : idasignatura,
         'idperiodo' : idperiodo,
         'idnivel' : idnivel
       },
         beforeSend: function(xhr) {
           $("#wait").modal("show");
         },
         success:function(data){
           $("#wait").modal("hide");
           $("#div_evals_asigs").empty();
           $("#div_evals_asigs").append(data.evalxasig);

         },
         error: function(jqXHR, textStatus, errorThrown){
           $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
         }
       });
  }


};
