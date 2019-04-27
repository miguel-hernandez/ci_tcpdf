$(document).ready(function () {
  google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.load('current', {'packages':['line']});
  google.charts.load("current", {packages:["corechart"]});
  google.charts.load('current', {'packages':['bar']});

  obj_notification = new Notification("sisat_notifications");
  obj_estadistica = new Estadistica();
  // // if($('#sel_grupos_supervisor').is(':visible')){
  //   obj_estadistica.activa_boton_mostrar();
  // // }
  
  obj_graficas = new Graficas();
});

$("#sel_grupos_supervisor").change(function(){
  $("#div_content_estadisticas").empty();
  $("#sel_estadisticas_opcion").val('0')
  if($('#sel_grupos_supervisor').val() != ""){
    $('#btn_estadisticas_mostrar').attr('disabled', false);
  }else{
    $("#btn_estadisticas_mostrar").attr("disabled", true);
  }
});

$("#txt_sisat_grupo_monitor").change(function(){
  obj_notification = new Notification("sisat_notifications");
  obj_notification.dismissible();
  /*$("#div_monitor_alertas").removeClass('scroll');*/
  $("#div_monitor_alertas").empty();

  $("#div_grph_xls").hide();
})

$("#sisat_btn_excel").click(function(){
  /*
  $("#excel_idgrupo").val( $("#txt_sisat_grupo_monitor").val() );
  $("#form_excel").submit();
  */
  return false;
});

$("#btn_sisat_getmonitor").click(function(e){
  e.preventDefault();
  obj_estadistica.valida_form_monitor();
});

$("#sisat_btn_graficas").click(function(e){
  e.preventDefault();
  if ($('#sel_grupos_supervisor').is(':visible')) {
    // si existe
    $("#txt_sisat_id_cfg").val($("#sel_grupos_supervisor").val());
    // alert("ahi anda");
  } else {
    // no existe
    $("#txt_sisat_id_cfg").val("");
    // alert("niguas");
  }
  obj_notification.destroy(); // mato el principal
  obj_notification_graph = new Notification("sisat_graph_notifications"); // y creo el del modal
  // Primero armamos option para select de grupo
  var idgrupo_seleccionado = $("#txt_sisat_grupo_monitor").val();
  var lblgrupo_seleccionado = $("#txt_sisat_grupo_monitor option:selected").text();
  var options ="<option value="+idgrupo_seleccionado+">"+lblgrupo_seleccionado+"</option>";
      options += "<option value='-1'>TODOS</option>";
  $("#txt_sisat_id_grupo").empty();
  $("#txt_sisat_id_grupo").html(options);


  $("#modal_sisat_graficas").modal("show");
});

$("#sisat_btn_get_grafica").click(function(e){
  e.preventDefault();
  obj_notification_graph.destroy();
  obj_estadistica.valida_get_grafica();
  $("#sisat_get_graph").empty();
  $("#sisat_get_graph_line").empty();
  $("#contenedor_div").hide();
});

$("#txt_sisat_habilidad").change(function(){
  obj_notification_graph.dismissible();
  $("#sisat_get_graph").empty();
  $("#sisat_get_graph_line").empty();
  $("#head_graph").empty();
  $("#sisat_get_donut").empty();
  $("#contenedor_div").hide();
})
$("#txt_sisat_exploracion").change(function(){
  obj_notification_graph.dismissible();
  $("#sisat_get_graph").empty();
  $("#sisat_get_graph_line").empty();
  $("#head_graph").empty();
  $("#sisat_get_donut").empty();
  $("#contenedor_div").hide();
})

$('#modal_sisat_graficas').on('hidden.bs.modal', function () {
  $("#sisat_get_graph").empty();
  $("#sisat_get_graph_line").empty();
  $("#form_graficas")[0].reset();
  $("#head_graph").empty();
  $("#sisat_get_donut").empty();
  $("#contenedor_div").hide();

  obj_notification_graph.dismissible();
})

function Estadistica(){

  that_estadistica = this;


  this.valida_form_monitor = function(){
    var grupo_filtro = $("#txt_sisat_grupo_monitor").val();
    if(grupo_filtro == "0"){
      obj_notification.error("Seleccione un grupo");
    }else{
      $("#txt_value_idcfg").val($("#sel_grupos_supervisor").val());
      that_estadistica.get_monitor_xgrupo();
    }
  }// valida_form_monitor()

  this.get_monitor_xgrupo = function(){
    // that_sisat.restart_div_grid();
    obj_notification.destroy();
    var form = $("#form_sisat_monitor").serialize();
    $.ajax({
      url: base_url+"index.php/Sisat/get_monitor_xgrupo",
      data:form,
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
        $("#wait").modal("hide");
        $("#div_monitor_alertas").empty();
        /*$("#div_monitor_alertas").addClass('scroll');*/
        $("#div_monitor_alertas").append(result.grid.tabla);

        /*$("#sisat_graph_lbl").empty();
        $("#txt_sisat_id_grupo").val( $("#txt_sisat_grupo_monitor").val() );
        $("#sisat_graph_lbl").append( $("#txt_sisat_grupo_monitor option:selected").text() );*/
        $("#sisat_graph_lbl").empty();
        $("#sisat_graph_lbl").append( $("#txt_sisat_grupo_monitor option:selected").text() );

        $("#div_grph_xls").show();
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_alumnos_xgrupo()


  this.valida_get_grafica = function(){
    var obj_notification_graph = new Notification("sisat_graph_notifications");
    var habilidad = $("#txt_sisat_habilidad").val();
    var exploracion = $("#txt_sisat_exploracion").val();

    if(habilidad == "0" || habilidad == 0){
      obj_notification_graph.error("Seleccione una herramienta");
    }else{
      if(exploracion == "0" || exploracion == 0){
        obj_notification_graph.error("Seleccione una exploración");
      }else{
        $('#btn_imprimir_esta').attr("disabled", false);
        that_estadistica.get_grafica();
      }
    }
  }// valida_get_grafica()

  this.get_grafica = function(){
    var obj_notification_graph = new Notification("sisat_graph_notifications");
    obj_notification_graph.destroy();

    var idgrupo = $("#txt_sisat_id_grupo").val();
    var habilidad = $("#txt_sisat_habilidad").val();
    var exploracion = $("#txt_sisat_exploracion").val();
    var idcfg = $("#txt_sisat_id_cfg").val();

    $.ajax({
      url: base_url+"index.php/Sisat/get_data_graph",
      data:{'idgrupo':idgrupo, 'habilidad':habilidad, 'exploracion':exploracion, 'idcfg':idcfg},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){

        if(result['t_capturados']=="no"){
          $("#wait").modal("hide");
          obj_notification = new Notification("sisat_graph_notifications");
          obj_notification.error("No es posible mostrar estadísticas ya que no se han capturado todos los datos");
        }else{
            // console.log(result.barras);
            $("#wait").modal("hide");
            $("#contenedor_div").show();
            obj_graficas.drawAxisTickColors(result.barras);

            obj_graficas.drawLineChart(result.lineal);
            obj_graficas.estadistica_tabla(result.tabla);
            obj_graficas.drawChart_colum(result.pastel);


            // console.log(result.total_alumnos);
            $("#id_total_alumnos").text(result.total_alumnos);
        }




      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_grafica()



  this.drawChart = function(datos) {
    var data = new google.visualization.DataTable();
    var title_chart = "RESULTADO DE TODAS LAS EXPLORACIONES DE "+$("#txt_sisat_habilidad option:selected").text().toUpperCase()+" GRUPO "+ $("#sisat_graph_lbl").html().toUpperCase();
    data.addColumn('string', $("#txt_sisat_habilidad option:selected").text().toUpperCase());
    data.addColumn('number', 'Exploración 1');
    data.addColumn('number', 'Exploración 2');
    data.addColumn('number', 'Exploración 3');

    data.addRows(datos);

    var options = {
      title: 'EXPLORACIÓN DE '+$("#txt_sisat_habilidad option:selected").text().toUpperCase(),
      titleTextStyle:{
        color:'#073F7F',
        fontSize:18,
        bold:true
      },
      curveType: 'function',
      legend: { position: 'bottom' },
      colors: ['#536dfe', '#ff4081', '#9c27b0'],
      vAxis: {
        format: '#\'%\''
      },
      width:"100%",
      height: 400,
    };

    var chart = new google.visualization.LineChart(document.getElementById('sisat_get_graph_line'));
    chart.draw(data, options);
  }// drawChart()
}// Estadistica

Estadistica.prototype.activa_boton_mostrar = function(){
  // alert("Funciona");
  if($("#sel_grupos_supervisor").is(':visible') && $('#sel_grupos_supervisor').val() != null){
    $("#btn_estadisticas_mostrar").attr("disabled", true);
  }else{
    $("#btn_estadisticas_mostrar").attr("disabled", false);
  }
}

$("#btn_imprimir_esta").click(function(){
  obj_estadistica.imprimir_graf("contenedor_div");
});

Estadistica.prototype.imprimir_graf = function(divName){
  var printContents = document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}
