function GraficasC(){
  that_grpah = this;
  texto_exploracion = $("#sel_estadisticas_herramienta_conc option:selected").text().toUpperCase();

    this.drawAxisTickColors = function(datos){
      datos[0] = ['Titulo', 'Requiere apoyo', {role:'annotation'}, 'En proceso', {role:'annotation'}, 'Nivel esperado',{role:'annotation'}];
      var txt="";
      if($("#sel_estadisticas_exploracion_conc").val() == 4){
        txt = "DE TODAS LAS EXPLORACIONES";
      }else{
        txt = "DE LA EXPLORACIÓN "+$("#sel_estadisticas_exploracion_conc option:selected").text();
      }

      var title_chart = "RESULTADO "+txt+" DE "+$("#sel_estadisticas_herramienta_conc option:selected").text().toUpperCase();
      $("#title_graph_bar").empty();
      $("#title_graph_bar").html(title_chart);

      var data = google.visualization.arrayToDataTable(datos);
      var options = {
        width:"100%",
        height:350,
        legend:{  position:'bottom'},
        bar: { groupWidth:'50%' },
        isStacked:true,
        colors:['#EB7167', '#FFE72B', '#84BE4F'],

        // title:title_chart,
        titleTextStyle:{
          color:'#073F7F',
          fontSize:18
        },
        vAxis:{
          format:'#\'%\''
        },
        chartArea:{ left:50,right:50,bottom:50,top:22 }
      };
      var chart = new google.visualization.ColumnChart(document.getElementById('sisat_get_graph'));
      chart.draw(data, options);
  }// drawAxisTickColors()

  this.drawLineChart = function(datos) {
    var data = new google.visualization.DataTable();
    var title_chart = "RESULTADO DE TODAS LAS EXPLORACIONES DE "+texto_exploracion;
        data.addColumn('string', $("#sel_estadisticas_herramienta_conc option:selected").text().toUpperCase());

        var exploracion = $("#sel_estadisticas_exploracion_conc").val();

        if(exploracion == 4){
          data.addColumn('number', 'Exploración 1');
          data.addColumn('number', 'Exploración 2');
          data.addColumn('number', 'Exploración 3');
        }else if(exploracion == 1){
          data.addColumn('number', 'Exploración 1');
        }else if(exploracion == 2){
          data.addColumn('number', 'Exploración 2');
        }else if(exploracion == 3){
          data.addColumn('number', 'Exploración 3');
        }

        var title_chart = 'EXPLORACIÓN DE '+$("#sel_estadisticas_herramienta_conc option:selected").text().toUpperCase();
        $("#title_graph_line").empty();
        $("#title_graph_line").html(title_chart);

        data.addRows(datos);

        var options = {
          // width:800,
          width:"100%",
          height: 350,
          legend: { position: 'bottom' },
          subtitle: 'Nivel obtenido por exploración',
          titleTextStyle:{
            color:'#073F7F',
            fontSize:18,
            bold:true
          },
          colors: ['#536dfe', '#ff4081', '#9c27b0'],
          vAxis: {
              format: '#\'%\''
          }
        };

        var chart = new google.charts.Line(document.getElementById('sisat_get_graph_line'));
        chart.draw(data, google.charts.Line.convertOptions(options));
  }// drawLineChart()

    this.drawChart_Donut = function(datos) {
      $("#title_graph_donut").empty();
      $("#title_graph_donut").html("Porcentaje de alumnos en alerta de no aprendizaje");

      var data = google.visualization.arrayToDataTable(datos);
      var options = {
        width:"100%",
        height: 400,
        is3D: true,
      };
      var chart = new google.visualization.PieChart(document.getElementById('sisat_get_donut'));
      chart.draw(data, options);
    }// drawChart_Donut()

    this.drawChart_colum = function(datos) {
      datos[0] = ['Riesgo', 'En riesgo', {role:'annotation'}, 'Sin riesgo', {role:'annotation'}];
        var data = google.visualization.arrayToDataTable(datos);

        var options = {
          chart: {
            title: 'Porcentaje de alumnos en alerta de no aprendizaje',
            subtitle: 'Porcentajes evaludos por bimestres a partir del II',
          },
          bars: 'vertical',
          vAxis: {format: '#\'%\''},
          height: 400,
          colors: ['#b71c1c', '#03a9f4'],
          bar: { groupWidth: "70%" }
        };

      var chart = new google.visualization.ColumnChart(document.getElementById('sisat_get_donut'));
      chart.draw(data, options);// 
      }

  this.estadistica_tabla = function(tbody){
    $("#sisat_tabla_estadistica_concentrado tbody").empty();
    $("#sisat_tabla_estadistica_concentrado tbody").append(tbody);
  }

}// GraficasC
