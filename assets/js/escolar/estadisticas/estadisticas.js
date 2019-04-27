$(document).ready(function () {
  obj_notification = new Notification("estadisticas_notifications");
  obj_estadisticas = new Estadisticas();


  var valida_prefijo = $("#prefijo_nivel").val();
  if(valida_prefijo == "1"){
    $("#sel_estadisticas_herramienta_conc").hide();
    $("#sel_estadisticas_exploracion_conc").hide();
    $('label[for="sel_estadisticas_herramienta_conc"]').hide();
    $('label[for="sel_estadisticas_exploracion_conc"]').hide();
  }
  else {
    $("#sel_estadisticas_herramienta_conc").show();
    $("#sel_estadisticas_exploracion_conc").show();
    $('label[for="sel_estadisticas_herramienta_conc"]').show();
    $('label[for="sel_estadisticas_exploracion_conc"]').show();
  }
});

$('select#sel_estadisticas_opcion').on('change',function(){
  $("#div_grupos_por_usuario").hide();
    var valor = $(this).val();
    if(valor == 2 || valor==5){
      $("#div_content_estadisticas").empty();
      $("#div_est_evals").show();
      $("#div_est_sisat").hide();
    }else if (valor == 3) {
      $("#div_content_estadisticas").empty();
      $("#div_est_evals").hide();
      $("#div_est_sisat").show();
    }else if (valor == 1) {
      $("#div_content_estadisticas").empty();
      $("#div_est_evals").hide();
      $("#div_est_sisat").hide();
    }else if(valor == 4){
      $("#div_content_estadisticas").empty();
       $("#div_est_evals").hide();
      $("#div_est_sisat").hide();
    }else if(valor == 6){
      $("#div_content_estadisticas").empty();
      $("#div_est_evals").hide();
      $("#div_est_sisat").hide();
    }

});

$("#btn_estadisticas_mostrar").click(function(e){
  e.preventDefault();
  obj_estadisticas.valida_form_opcion();
});

$("#btn_mostrar_tendencia").click(function(){
  obj_estadisticas.vamos_x_tendencias();
});


function Estadisticas(){
  that_estadisticas = this;
  that_estadisticas.GRUPOS = 1;
  that_estadisticas.EVALS = 2;
  that_estadisticas.SISAT = 3;
  that_estadisticas.ESTADISTICASSISAT = 4;
  that_estadisticas.REPORTEACA = 5;
  that_estadisticas.TENDENCIA = 6;

  this.valida_form_opcion = function(){
    var grupo_filtro = $("#sel_estadisticas_opcion").val();
    if(grupo_filtro == "0" || grupo_filtro == 0){
      obj_notification.error("Seleccione una opción");
    }else{
      obj_notification.dismissible();
      if(grupo_filtro == that_estadisticas.GRUPOS){
          that_estadisticas.get_estadisticas_grupos();
      }
      else if (grupo_filtro == that_estadisticas.EVALS) {
          that_estadisticas.get_estadisticas_evals();
      }
      else if (grupo_filtro == that_estadisticas.SISAT) {
        that_estadisticas.get_estadisticas_sisat();
      }
      else if (grupo_filtro == that_estadisticas.ESTADISTICASSISAT) {
        that_estadisticas.get_estadisticas_sisat_estadisticas();
      }
      else if (grupo_filtro == that_estadisticas.REPORTEACA) {
        that_estadisticas.get_reporteaca();
      }else if(grupo_filtro = that_estadisticas.TENDENCIA){
        that_estadisticas.get_grupos_usuario();
      }

    }
  }// valida_form_monitor()

  this.get_estadisticas_grupos = function(){
    $.ajax({
      url: base_url+"index.php/Estadisticas/get_estadisticas_grupos",
      data:{},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#wait").modal("hide");
        var content = result.content;
        $("#div_content_estadisticas").empty();
        $("#div_content_estadisticas").append(content);

      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_estadisticas_grupos()

  this.vamos_x_tendencias = function(){
    var idgrupo = $("#select_grupos_xusuario").val();
    var idherramienta = "lec";
    $.ajax({
      url: base_url+"index.php/Estadisticas/vamos_x_tendencias",
      data:{"idgrupo": idgrupo, "idherramienta": idherramienta},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#wait").modal("hide");
        $("#contenedor_tendencias").empty();
        $("#contenedor_tendencias").append(result.html);
        $("#modal_sisat_tendencias").modal("show");
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }

  this.get_estadisticas_evals = function(){
    var form = $("#form_estadisticas").serialize();
    $.ajax({
      url: base_url+"index.php/Estadisticas/get_estadisticas_evals",
      data:form,
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#wait").modal("hide");
        var content = result.content;
        $("#div_content_estadisticas").empty();
        $("#div_content_estadisticas").append(content);

      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_estadisticas_evals()

  this.get_estadisticas_sisat = function(){
    var form = $("#form_estadisticas").serialize();
    $.ajax({
      url: base_url+"index.php/Estadisticas/get_estadisticas_sisat",
      data:form,
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#wait").modal("hide");
        var content = result.content;
        $("#div_content_estadisticas").empty();
        $("#div_content_estadisticas").append(content);
        // code...
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_estadisticas_sisat()

  this.get_estadisticas_sisat_estadisticas = function(){
    var form = $("#form_estadisticas").serialize();
    $.ajax({
      url: base_url+"index.php/Estadisticas/get_estadisticas_sisat_estadisticas",
      data:form,
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        console.log(result.html);
        $("#wait").modal("hide");
        var content = result.html;
        $("#div_content_estadisticas").empty();
        $("#div_content_estadisticas").append(content);
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_estadisticas_sisat_estadisticas()

  this.get_grupos_usuario = function(){
    var select = $("#select_grupos_xusuario");
    $.ajax({
      url: base_url+"index.php/Estadisticas/get_grupos_por_usuario",
      data:"",
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        var grupos = result.grupos;
        select.empty();
        $.each(grupos, function( index, value ) {
          select.append("<option value='"+value.idgrupo+"'>"+value.grado+"-"+value.grupo+"</option>");
        });
        $("#wait").modal("hide");
        $("#div_grupos_por_usuario").show();
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_estadisticas_sisat_estadisticas()

  this.get_reporteaca = function(){
    var id_centrocfg = $("#sel_grupos_supervisor").val();
    var bim = $("#select_estadisticas_evals").val();
    if(bim==4 || bim == 5){
      obj_notification.error("No disponible para este bimestre");
    }
    else{
        $.ajax({
          url: base_url+"index.php/Estadisticas/get_aca",
          data:{'id_centrocfg':id_centrocfg},
          type:'POST',
          beforeSend: function(xhr) {
            $("#wait").modal("show");
          },
          success: function(result){
            $("#wait").modal("hide");
            var url_aca = result.url_aca;

            var arr = url_aca.split("*");
            var reporte_aca = arr[0]+bim+arr[1]+"0"+bim+arr[2];
            muestra_reporte_aca(reporte_aca,bim);
          },
          error:function(xhr){
            $("#wait").modal("hide");
            console.error(xhr.status + ": " + xhr.responseText);
          }
        });
    }
  }// get_reporteaca()

}// Estadisticas

/* Redirect a captura sisat */
function get_idgrupo(grupo){
  console.info("grupo: "+grupo);
  var arr_grupo = grupo.split("_");

  var id_grupo = arr_grupo[0];
  var nombre_grupo = arr_grupo[1];
  var option_grupo = "<option value="+id_grupo+">"+nombre_grupo+"</option>";


  var id_escuela = $("#sel_grupos_supervisor").val();
  var nombre_escuela =  $("#sel_grupos_supervisor option:selected").text();
  var option_escuela = "<option value="+id_escuela+">"+nombre_escuela+"</option>";


  var id_exploracion = $("#select_est_sisat").val();
  var exploracion =  $("#select_est_sisat option:selected").text();
  var option_exploracion = "<option value="+id_exploracion+">"+exploracion+"</option>";

  redirect_get_estadisticas_sisat(id_grupo,nombre_grupo);
}


function redirect_get_estadisticas_sisat(id_grupo,nombre_grupo){
  var escuela  = $("#sel_grupos_supervisor").val();
  var exploracion  = $("#select_est_sisat").val();

  var escuela_texto =  $("#sel_grupos_supervisor option:selected").text();
  var exploracion_texto =  $("#select_est_sisat option:selected").text();

  var form = document.createElement("form");
  var element1 = document.createElement("input");
  var element2 = document.createElement("input");
  var element3 = document.createElement("input");
  var element4 = document.createElement("input");
  var element5 = document.createElement("input");
  var element6 = document.createElement("input");

  form.name="form_estadisticas_sisat";
  form.id="form_estadisticas_sisat";
  form.method = "POST";
  form.target = "_self";

  form.action = base_url+"Sisat/load_sisat";

  element1.type="hidden";
  element1.value=escuela;
  element1.name="escuela";
  form.appendChild(element1);

  element2.type="hidden";
  element2.value=exploracion;
  element2.name="exploracion";
  form.appendChild(element2);

  element3.type="hidden";
  element3.value=escuela_texto;
  element3.name="escuela_texto";
  form.appendChild(element3);

  element4.type="hidden";
  element4.value=exploracion_texto;
  element4.name="exploracion_texto";
  form.appendChild(element4);

  element5.type="hidden";
  element5.value=id_grupo;
  element5.name="id_grupo";
  form.appendChild(element5);

  element6.type="hidden";
  element6.value=nombre_grupo;
  element6.name="nombre_grupo";
  form.appendChild(element6);


  document.body.appendChild(form);
  form.submit();
}// redirect_get_estadisticas_sisat
