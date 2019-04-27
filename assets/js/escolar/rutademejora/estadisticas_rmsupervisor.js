$(function(){
	google.charts.load("current", {packages:["corechart"]});
    // google.charts.setOnLoadCallback(drawChart);
 get_datos();
 get_datos_nact_por();
});

$("#cerrar_le_modal_estadistica").click(function(){
  $('#le_modal_estadistica').modal('toggle');
});

function get_datos_nact_por(){
 $.ajax({
					url:base_url+"rutademejora/estadisticas_super_nact_por",
					method:"POST",
					data:"",

					success:function(data){
						 // console.log(data.datos_estadisticas_nact_por);
						 var html='';
						 var datos=data.datos_estadisticas_nact_por;

						 html+='<tr style="background:#d9edf7;" align="center"><td rowspan="2">Prioridad</td><td colspan="5">Avance</td></tr><tr style="background:#d9edf7;" align="center"><td>0%</td><td>25%</td><td>50%</td><td>75%</td><td>100%</td></tr>';
						 for (var i = 0; i < datos.length; i+=1) {
							   html+='<tr><td>'+datos[i]["descripcion"]+'</td>';
								 html+='<td>'+datos[i]["r_0"]+'</td>';
								 html+='<td>'+datos[i]["r_25"]+'</td>';
								 html+='<td>'+datos[i]["r_50"]+'</td>';
								 html+='<td>'+datos[i]["r_75"]+'</td>';
								 html+='<td>'+datos[i]["r_100"]+'</td></tr>';
							}



						 $('#tab_act_prio_p').empty();
						 $('#tab_act_prio_p').append(html);
					},
					error: function(error){
						console.log(error);
					}
			});
};

 function get_datos(){
 	$.ajax({
           url:base_url+"rutademejora/estadisticas_super",
           method:"POST",
           data:"",

           success:function(data){
             // console.log(data);
             // return data;
             drawChart(data.datos_estadisticas);
           },
           error: function(error){
             console.log(error);
           }
       });
 };

function drawChart(datos) {
	// console.table(datos);
      var data = google.visualization.arrayToDataTable([
        ["Element", "Cantidad", { role: "style" } ],
        ["Normalidad mínima", parseInt(datos[0].normalidad), "#43a047"],
        ["Permanencia", parseInt(datos[0].puebla), "#fb8c00"],
        ["Aprendizajes", parseInt(datos[0].mejora), "#1e88e5"],
        ["Puebla convive", parseInt(datos[0].rezago), "color: #e91e63"]
      ]);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

       var options = {
            width:"100%",
            height:350,
            titlePosition: 'in',
              // title: 'Porcentages de evaluacion preguntas del tipo SI, NO DIRECTIVOS',
              chartArea:{ left:350,right:10,bottom:50,top:22 },
              isStacked: true,
              legend: { position: 'none', maxLines: 3, alignment: 'center' },
               bar: { groupWidth:20 },
              hAxis: {
                // title: 'Respuestas SI, NO',
                minValue: 0,
              },
              vAxis: {
                format:'#\'%\'',
                textPosition: 'out',
                titleTextStyle: { color: "#d95f02",
                                  fontSize: 18,
                                  bold: true,
                                  italic: true },
              },
            };
      var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
      chart.draw(view, options);
  }
