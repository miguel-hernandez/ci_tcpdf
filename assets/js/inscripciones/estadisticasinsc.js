$(document).ready(function () {
  google.charts.load("current", {packages:['corechart']});
  // google.charts.setOnLoadCallback(drawChart);
objestinsc = new EstadisticasInsc();

});

$("#btn_estadisticas_buscarcct").click(function(e){
  e.preventDefault();
  $("#itxt_estadisticas_cct").val("");
  objestinsc.get_view_buscadorcct();
});

$("#btn_verEstainsc").click(function(){
  if($("#slt_nivelestainsc").val() == '-1'){
    //alert("Seleccione un nivel");
    bootbox.alert({
    message: "<br><b>Seleccione un nivel</b>",
    size: 'small'
    });
  }else{
    if($("#slt_medicionestainsc").val() == '-1'){
     bootbox.alert({
     message: "<br><b>Seleccione una medición</b>",
     size: 'small'
    });
    }else{
      $("#columnchart_values").empty();
      objestinsc.get_estadisticas();
    }
  }
});

$("#btn_estadisticas_limpiarcct").click(function(){
  $("#itxt_estadisticas_cct").val("");
});


// $("#btn_grabar_nregistro").click(function(){

// });
$("#slt_nivelestainsc").change(function(){
  $("#itxt_estadisticas_cct").val("");
});

$("#slt_medicionestainsc").change(function(){
  $("#itxt_estadisticas_cct").val("");
});

$("#slt_municipioinsc").change(function(){
  $("#itxt_estadisticas_cct").val("");
});

function EstadisticasInsc(){
   _this = this;

 }



EstadisticasInsc.prototype.getzonasxmuni = function (curp){
   $.ajax({
     url:base_url+"Estadisticasnsc/getZonasxMunicipio",
     method:"POST",
     data:{
      "idmunicipio":$("#txt_nregistro_nombre").val(),
    },
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
      console.log(data);
     },
     error: function(error){
       console.log(error);
     }
   });
};

EstadisticasInsc.prototype.get_view_buscadorcct = function (){//si se ocupa
  var idnivel = $("#slt_nivelestainsc").val();
  // var idregion = $("#slt_estadisticas_region").val();
  var idmunicipio = $("#slt_municipioinsc").val();
  var idzona = $("#slt_zonainsc").val();
  $.ajax({
    url:base_url+"Buscadorcctinsc/get_view_buscadorcct",
    method:"POST",
    data:{"idnivel":idnivel, "idregion":0, "idmunicipio":idmunicipio, "idzona":0},
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      $("#div_estadisticasinsc_buscadorcct").empty();
      $("#div_estadisticasinsc_buscadorcct").append(data.str_view);
      obj_bcct = null;
      obj_bcct = new Buscadorcct("div_estadisticasinsc_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
      obj_bcct.init();
      document.getElementById('div_estadisticasinsc_buscadorcct').addEventListener('cct_seleccionada',alimenta_campo_cct,false);

    },
    error: function(error){
      console.log(error);
    }
  });
};

function alimenta_campo_cct(){
    var cct = obj_bcct.get_cct();
    console.log(cct);
    $("#itxt_estadisticas_cct").val("");
    $("#itxt_estadisticas_cct").val(cct);
    // objestinsc.get_nivel(cct);
    obj_bcct = null;
}// alimenta_campo_cct()

function get_gridpaginador(offset){
  if($("#modal_buscadorcct").is(":visible")){
    this_bcct.obj_grid_buscador.get_gridpaginador(offset, "Buscadorcct", "get_grid","form_buscadorcct");
  }else{
    obj_cfcentral.get_grid(offset);
  }
}// get_gridpaginador()


EstadisticasInsc.prototype.get_nivel = function(cct) {
    $.ajax({
        url: base_url+"Estadisticas/get_nivel_cct",
        data:"idct="+cct,
        type:'POST',
        beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
        success: function(result){
          $("#wait").modal("hide");
          // console.log(result.nivel['nivel']);
          if(result.nivel['nivel'] == "PRE"){
            $("#slt_nivelestainsc").val("1").trigger('change');
          }
          if(result.nivel['nivel'] == "PRI"){
            $("#slt_nivelestainsc").val("2").trigger('change');
          }
          if(result.nivel['nivel'] == "SEC"){
            $("#slt_nivelestainsc").val("3").trigger('change');
          }
        },
        error:function(xhr){
          $("#wait").modal("hide");
          console.error(xhr.status + ": " + xhr.responseText);
        }
      });
  }

EstadisticasInsc.prototype.get_estadisticas = function() {
  $.ajax({
      url: base_url+"Estadisticasinsc/get_estadisticasinsc",
      data:{'nivel':$("#slt_nivelestainsc").val(),
      'idmedicion' :$("#slt_medicionestainsc").val(),
      'idmunicipio' :$("#slt_municipioinsc").val(),
      'cct' :$("#itxt_estadisticas_cct").val(),
    },
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#wait").modal("hide");

        if(result.tipoesta == 'especiales'){
          capespeciales(result.estadisticas);
        }else{
           drawChart(result);
        }

      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
  });
}


    function drawChart(datos) {
      // console.log(datos);
      var data = google.visualization.arrayToDataTable([
        ["Element", "Cantidad", { role: "style" } ],
        ["Solicitudes esperadas", parseInt(datos.solicitudes_esperadas.pobtotal), "#b87333"],
        ["Cupo ofertado", parseInt(datos.capasidadinstalada.captotal), "silver"],
        ["Solicitudes registradas", parseInt(datos.totalsoli), "gold"],
        ["Preinscritos registrados", parseInt(datos.totalpreinscripciones), "#8bc34a"]
      ]);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

      var options = {
        title: "Detalle de solicitudes registradas",
        width: 600,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
      };
      var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
      chart.draw(view, options);
  }



    function capespeciales(datos) {
      var obj = datos;
      var colores = ['#ef9a9a', '#ec407a', '#00838f', '#00796b', '#8bc34a', '#6a1b9a', '#ffa000', '#7e57c2', '#1e88e5', '#0277bd', '#ef6c00', '#bf360c', '#795548','#cddc39', '#fdd835'];
      var total = [];
      total.push(["Element", "Cantidad", { role: "style" } ])
      for (var i = 0; i < datos.length; i++) {
        var elemento = [];
        elemento.push(datos[i].nombre);
        elemento.push(parseInt(datos[i].total));
        elemento.push(colores[i]);
        total.push(elemento);
      }
      console.log(total);
      var data = google.visualization.arrayToDataTable(total);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

      var options = {
        title: "ALUMNOS CON DISCAPACIDAD Y/O DIFICULTADES SEVERAS DE APRENDIZAJE",
        width: 600,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
      };
      var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
      chart.draw(view, options);
  }
