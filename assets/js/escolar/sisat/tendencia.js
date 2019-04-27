$(function(){
obj_tendencia = new Tendencia();
});

$("#btn_mostrar_tendencias").click(function(){
	if($("#txt_tendencia_id_herramienta").val() == 0){
		alert("Seleccione una herramienta");
	}else{
		obj_tendencia.vamos_x_tendencia($("#txt_tendencia_id_herramienta").val(),  $("#txt_idgrupo_tendencia").val());
	}
});

function Tendencia(){
		_this = this;
}

Tendencia.prototype.vamos_x_tendencia = function(idherramienta, idgrupo){
	$.ajax({
		url: base_url+"Estadisticas/vamos_x_herramienta_tendencia",
		method: "POST",
		data: {"idherramienta": idherramienta, "idgrupo" : idgrupo},
		beforeSend: function(xhr) {
	        $("#wait").modal("show");
	      },
		success: function(data){
			$("#wait").modal("hide");
			$("#line_top_x").empty();
			if(data.datos == "not_data"){
				alert("Almenos se requieren dos exploraciones para graficar");
			}else{
				console.log(data.datos);
				console.log(data.datos.length);
				if(data.datos.length == 2){
					obj_tendencia.drawChart(data.cabeceras, data.datos[0], data.datos[1]);
				}else if(data.datos.length == 3){
					obj_tendencia.drawChart3(data.cabeceras, data.datos[0], data.datos[1], data.datos[2]);
				}
			}							
		},
		error: function(error){
			console.error(error);
		}
	});
};

Tendencia.prototype.drawChart = function(cabeceras, exp1, exp2){
      var data = new google.visualization.DataTable();
      data.addColumn('string', '');
      $.each(cabeceras, function( index, value ) {
		  data.addColumn('number', value);
		});

      data.addRows([
        exp1,
        exp2
      ]);

      var options = {
        chart: {
          title: 'Tendencia',
          subtitle: 'Comportamiento de tendecia con respecto a habilidades'
        },
        width: 900,
        height: 500,
        axes: {
          x: {
            0: {side: 'bottom'}
          }
        },
        
          colors: ['#e2431e', '#f1ca3a', '#6f9654', '#1c91c0',
                   '#4374e0', '#5c3292', '#572a1a', '#1a1a1a'],
      };

      var chart = new google.charts.Line(document.getElementById('line_top_x'));

      chart.draw(data, google.charts.Line.convertOptions(options));
}

Tendencia.prototype.drawChart3 = function(cabeceras, exp1, exp2, exp3){
      var data = new google.visualization.DataTable();
      data.addColumn('string', '');
      $.each(cabeceras, function( index, value ) {
		  data.addColumn('number', value);
		});

      data.addRows([
        exp1,
        exp2,
        exp3
      ]);

      var options = {
        chart: {
          title: 'Tendencia',
          subtitle: 'Comportamiento de tendecia con respecto a habilidades'
        },
        width: 900,
        height: 500,
        axes: {
          x: {
            0: {side: 'bottom'}
          }
        }
      };

      var chart = new google.charts.Line(document.getElementById('line_top_x'));

      chart.draw(data, google.charts.Line.convertOptions(options));
}