/* jshint esversion: 6 */
$(document).ready(function () {
  Evaluaciones_principal.get_view_evaluaciones();
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  // $("#tab_evaluaciones_adicionales").empty();
   var target = $(e.target).attr("href"); // activated tab
   if(target == "#tab_evaluaciones_adicionales"){
     $("#tab_evaluaciones_adicionales").empty();
     Evaluaciones_principal.get_view_adicionales();
   }else if (target == "#tab_evaluaciones_evaluaciones") {

     $("#div_evals_inasistencias").hide();
     $("#div_evals_asignaturas").hide();
     $("#div_evals_clubes").hide();

     Evaluaciones_principal.get_view_evaluaciones();
   }
});

let Evaluaciones_principal = {

  get_view_adicionales : () => {
    $.ajax({
       url:base_url+"Evaluaciones/get_view_adicionales",
       method:"POST",
       data:{
         'idgrupo' : $("#slc_evaluaciones_idgrupo").val(),
         'idexpediente' : $("#slc_evaluaciones_idexpediente").val(),
         'idnivel' : $("#itxt_evaluaciones_idnivel").val(),
         'idcentrocfg' : $("#itxt_evaluaciones_idcentrocfg").val()
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         $("#tab_evaluaciones_adicionales").empty();
         $("#tab_evaluaciones_adicionales").append(data.str_view);
       },
       error: function(xhr){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

  get_view_evaluaciones : () => {
    let ruta="get_view_evaluaciones";
    datos={
         'idgrupo' : $("#slc_evaluaciones_idgrupo").val(),
         'idexpediente' : $("#slc_evaluaciones_idexpediente").val(),
         'periodo' : $("#slt_evaluaciones_periodo").val(),
         'idnivel' : $("#itxt_evaluaciones_idnivel").val(),
         'idcentrocfg' : $("#itxt_evaluaciones_idcentrocfg").val()
       };
    if($('input:radio[name=opcionesevaluaciones]:checked').val() == 'xasigeval' && $("#itxt_evaluaciones_idnivel").val()==1){
      ruta="get_alumnos_x_asig_pre";
      datos={'idgrupo' : $("#slc_evaluaciones_idgrupo").val(),
         'idasignatura' : parseInt($("#slc_evaluaciones_asignatura").val()),
         'idperiodo' : $("#slt_evaluaciones_periodo").val(),
         'idnivel' : $("#itxt_evaluaciones_idnivel").val()
         };
    }
    $.ajax({
       url:base_url+"Evaluaciones/"+ruta,
       method:"POST",
       data:datos,
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
          $("#wait").modal("hide");
          if($('input:radio[name=opcionesevaluaciones]:checked').val() == 'xalumnoeval'){
            $("#div_evals_asignaturas").empty();
            $("#div_evals_asignaturas").append(data.str_view_evals_asignaturas);
            $("#div_evals_clubes").empty();
            $("#div_evals_clubes").append(data.str_view_evals_clubes);

            $("#div_evals_inasistencias").empty();
            $("#div_evals_inasistencias").append(data.str_view_inasistencias);

            // $("#div_evals_labelsuperior").show();
            $("#div_evals_inasistencias").show();
            $("#div_evals_asignaturas").show();
            $("#div_evals_clubes").show();
            $("#div_container_alumnos").show();
          }

         if($('input:radio[name=opcionesevaluaciones]:checked').val() == 'xasigeval' && $("#itxt_evaluaciones_idnivel").val()==1){
            $("#div_container_alumnos").hide();
            $("#div_evals_asignaturas").hide();
            $("#div_evals_clubes").hide();
            $("#div_evals_inasistencias").hide();
            // $("#div_evals_labelsuperior").hide();
            $("#div_evals_inasistencias").hide();
            $("#div_evals_asigs").empty();
            $("#div_evals_asigs").append(data.evalxasig);
         }

       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  },

  set_input_idgrupo : (idgrupo) => {
    $("#slc_evaluaciones_idgrupo").val(idgrupo);
  },

  set_input_idexpediente : (idexpediente) => {
    $("#slc_evaluaciones_idexpediente").val(idexpediente);
  }

};
