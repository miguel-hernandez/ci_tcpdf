$(document).ready(function () {
	google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.load('current', {'packages':['line']});
  google.charts.load("current", {packages:["corechart"]});
  google.charts.load('current', {'packages':['bar']});
		obj_estcentral = new Estadisticascentral();
		obj_notif = new Notifications("div_central_notification");

		// $("#slt_estadisticas_region").attr("disabled",true);
		// $("#slt_estadisticas_municipio").attr("disabled",true);
		// $("#slt_estadisticas_zona").attr("disabled",true);
		$("#btn_estadisticas_central_aca").hide();
		$("#btn_estadisticas_sisat_admin").hide();
		obj_graficas = new Graficas();
		oculta_graficas_concentrado();
});


$( "#slt_estadisticas_nivel" ).change(function() {
    var idnivel = this.value;
		if(idnivel == 0){
				$("#slt_estadisticas_region").val(0);
				$("#slt_estadisticas_municipio").val(0);
				$("#slt_estadisticas_zona").val(0);
				$("#slt_estadisticas_region").attr("disabled",true);
				$("#slt_estadisticas_municipio").attr("disabled",true);
				$("#slt_estadisticas_zona").attr("disabled",true);
				$("#slt_tipoestadistica").attr("disabled",true);
    }
		else{
			$("#slt_estadisticas_region").attr("disabled",false);
			// $("#slt_estadisticas_municipio").attr("disabled",false);
			$("#slt_estadisticas_zona").attr("disabled",true);
			$("#slt_tipoestadistica").attr("disabled",false);
	}

	obj_estcentral.gettipoestadisticas();
});

$( "#slt_estadisticas_region" ).change(function() {
    var idregion = this.value;
    if (idregion == 0) {
				$("#slt_estadisticas_municipio").val(0);
				$("#slt_estadisticas_zona").val(0);
				$("#slt_estadisticas_municipio").attr("disabled",true);
				$("#slt_estadisticas_zona").attr("disabled",true);
    }else{
			$("#slt_estadisticas_municipio").attr("disabled",false);
			obj_estcentral.get_municipios_xregion(idregion);
		}
});

$( "#slt_estadisticas_municipio" ).change(function() {
    var idmunicipio = this.value;
    if (idmunicipio == 0) {
			$("#slt_estadisticas_zona").val(0);
			$("#slt_estadisticas_zona").attr("disabled",true);
    }else{
			$("#slt_estadisticas_zona").attr("disabled",false);
			obj_estcentral.get_zonas_xmunicipio(idmunicipio);
		}
});

$("#btn_estadisticas_buscarcct").click(function(e){
  e.preventDefault();
	$("#itxt_estadisticas_cct").val("");
	obj_estcentral.get_view_buscadorcct();
});

$("#btn_estadisticas_limpiarcct").click(function(e){
  e.preventDefault();
	$("#itxt_estadisticas_cct").val("");
});

$("#btn_estadisticas_quitarfiltros").click(function(e){
  e.preventDefault();
	$('#form_Estadisticascentral')[0].reset();
	$("#slt_estadisticas_region").attr("disabled",true);
	$("#slt_estadisticas_municipio").attr("disabled",true);
	$("#slt_estadisticas_zona").attr("disabled",true);
	$("#slt_tipoestadistica").attr("disabled",true);
	$("#select_est_admin_exploracion").empty();
	$("#select_est_admin").empty();
	$("#contenedor_opciones_periodo").empty();
	$("#sisat_tabla_estadistica").empty();
	$("#grid_cortecentral").empty();
	$("#btn_estadisticas_sisat_admin").empty();
});

$("#btn_estadisticas_central_busqueda").click(function(e){
  e.preventDefault();
	$("#grid_cortecentral").empty();
	$("#div_estadisticas_buscadorcct").empty();
	var tEstadistica = $("#slt_tipoestadistica").val();
		if($("#slt_estadisticas_nivel").val() == '0'){
					//alert("Seleccione un nivel");
				bootbox.alert({
				message: "<br><b>Seleccione un nivel</b>",
				size: 'small'
				});

				}
				else if ($("#slt_tipoestadistica").val()== '0') {
				bootbox.alert({
				message: "<br><b>Seleccione un tipo de estadística</b>",
				size: 'small'
				});
				}
				else{
	if(tEstadistica == 2){
		// obj_estcentral.get_evaluciones_inasistencias();
		obj_estcentral.get_evaluciones_inasistencias_pag();
	}else if(tEstadistica == 3){
		obj_estcentral.get_estadisticas_sisat_pag();
	}else if(tEstadistica == 4){
		obj_estcentral.get_grid();
		$("#btn_estadisticas_sisat_admin").show();
	}else if(tEstadistica == 5){
		obj_estcentral.get_grid();
		$("#btn_estadisticas_central_aca").show();
		// obj_estcentral.get_reporte_aca_admin();
	}else if(tEstadistica == 6){
		obj_estcentral.get_estadisticas_concentrado();
	}
				}
});
$("#btn_cerrar_modal_graficas_estadisticas").click(function(event) {
  $('#modal_sisat_graficas').modal('toggle');
});

$("#btn_estadisticas_sisat_admin").click(function(e){
	e.preventDefault();
	var arr_row = _thisEstacentral.obj_grid_cfcentral.get_row_selected();
		if(arr_row.length==0 || arr_row[0]['idcentrocfg'] == undefined){
	    _thisEstacentral.notification.error("Seleccione un registro");
	  }else{
			obj_estcentral.get_grupos_cct_admin_estsisat(arr_row[0]['idcentrocfg']);
			$("#txt_sisat_id_cfg").val(arr_row[0]['idcentrocfg']);
			$("#modal_sisat_graficas").modal("show");
	  }


})

$("#btn_estadisticas_central_aca").click(function(e){
	e.preventDefault();
	var arr_row = _thisEstacentral.obj_grid_cfcentral.get_row_selected();
		if(arr_row.length==0 || arr_row[0]['idcentrocfg'] == undefined){
	    _thisEstacentral.notification.error("Seleccione un registro");
	    _thisEstacentral.obj_grid_cfcentral.init();
	  }else{
			obj_estcentral.get_reporteaca_admin(arr_row[0]['idcentrocfg']);
	  }
});

$("#slt_tipoestadistica").change(function(){
	$("#contenedor_opciones_periodo_sisat").empty();
	$("#btn_estadisticas_central_aca").hide();
	$("#btn_estadisticas_sisat_admin").hide();
	$("#select_est_admin").empty();
	$("#contenedor_opciones_periodo").empty();
	oculta_graficas_concentrado();
	var tEstadistica = $("#slt_tipoestadistica").val();
	switch(tEstadistica){
		case "0":
		break;
		case "2":
		var nivel = $("#slt_estadisticas_nivel").val();
			if(nivel == 1){
				var combo = obj_estcentral.retorna_combo("mom");
                $("#contenedor_opciones_periodo").append(combo);
								$("#select_est_admin_exploracion").show();
								$("#select_est_admin").show();
			}else if(nivel == 2){
				var combo = obj_estcentral.retorna_combo("bim");
                $("#contenedor_opciones_periodo").append(combo);
								$("#select_est_admin_exploracion").show();
								$("#select_est_admin").show();
			}else if(nivel == 3){
				var combo = obj_estcentral.retorna_combo("bim");
                $("#contenedor_opciones_periodo").append(combo);
								$("#select_est_admin_exploracion").show();
								$("#select_est_admin").show();
			}
		break;
		case "3":
			var combo = obj_estcentral.retorna_combo("exp");
                $("#contenedor_opciones_periodo").append(combo);
		break;
		case "4":
		break;
		case "5":
			var combo = obj_estcentral.retorna_combo("bim");
                $("#contenedor_opciones_periodo").append(combo);
		break;
		case "6":
            var combo = obj_estcentral.retorna_combo("her");
            $("#contenedor_opciones_periodo").append(combo);
	        var combo2 = obj_estcentral.retorna_combo("exp");
	         $("#contenedor_opciones_periodo_sisat").empty();
	            $("#contenedor_opciones_periodo_sisat").append(combo2);
		break;
	}
});


// $("#btn_cortecentral_iradetalle").click(function(e){
// 	  e.preventDefault();
// 		var arr_row = _thisEstacentral.obj_grid_cfcentral.get_row_selected();
// 		if(arr_row.length==0 || arr_row[0]['idcentrocfg'] == undefined){
// 	    _thisEstacentral.notification.error("Seleccione un registro");
// 	    _thisEstacentral.obj_grid_cfcentral.init();
// 	  }else{
// 			obj_estcentral.get_views_detalle(arr_row[0]['idcentrocfg']);
// 	  }
// });


function Estadisticascentral(){
   _thisEstacentral = this;
	 _thisEstacentral.obj_grid_cfcentral = null;

	 _thisEstacentral.notification = new Notification("estadisticas_central_notificaciones");

	 _thisEstacentral.obj_grid_cfcentral = new Grid("grid_cortecentral");

	 _thisEstacentral.idcentrocfg = 0;
	 _thisEstacentral.estatus = -1;
	 _thisEstacentral.campo = "";

 }

 Estadisticascentral.prototype.get_municipios_xregion = function (idregion){
	 $.ajax({
     url:base_url+"Corte/get_municipios_xregion",
     method:"POST",
     data:{"idregion":idregion},
     beforeSend: function(xhr) {
       $("#wait").modal("show");
     },
     success:function(data){
       $("#wait").modal("hide");
			 $("#slt_estadisticas_municipio").empty();
			 $("#slt_estadisticas_municipio").append(data.str_municipios);
     },
     error: function(error){
       console.log(error);
     }
   });
};

Estadisticascentral.prototype.get_zonas_xmunicipio = function (idmunicipio){//si se ocupa
	$.ajax({
		url:base_url+"Corte/get_zonas_xmunicipio",
		method:"POST",
		data:{"idmunicipio":idmunicipio},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#slt_estadisticas_zona").empty();
			$("#slt_estadisticas_zona").append(data.str_zonas);
		},
		error: function(error){
			console.log(error);
		}
	});
};

Estadisticascentral.prototype.get_view_buscadorcct = function (){//si se ocupa
	var idnivel = $("#slt_estadisticas_nivel").val();
	var idregion = $("#slt_estadisticas_region").val();
	var idmunicipio = $("#slt_estadisticas_municipio").val();
	var idzona = $("#slt_estadisticas_zona").val();
	$.ajax({
		url:base_url+"Buscadorcct/get_view_buscadorcct",
		method:"POST",
		data:{"idnivel":idnivel, "idregion":idregion, "idmunicipio":idmunicipio, "idzona":idzona},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
			$("#div_estadisticas_buscadorcct").empty();
			$("#div_estadisticas_buscadorcct").append(data.str_view);
			obj_bcct = null;
			obj_bcct = new Buscadorcct("div_estadisticas_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
			obj_bcct.init();
			document.getElementById('div_estadisticas_buscadorcct').addEventListener('cct_seleccionada',alimenta_campo_cct,false);

		},
		error: function(error){
			console.log(error);
		}
	});
};
// ESTADISTICAS PARA ADMIN CENTRAL INICIO

Estadisticascentral.prototype.get_evaluciones_inasistencias_pag = function (){
		var offset = 0;
		_thisEstacentral.obj_grid_cfcentral2 = null;
		_thisEstacentral.obj_grid_cfcentral2= new Grid("grid_cortecentral");
		_thisEstacentral.obj_grid_cfcentral2.get_gridpaginador(offset, "Estadisticas", "get_idcentrocfg_pag","form_Estadisticascentral");
};

Estadisticascentral.prototype.get_estadisticas_sisat_pag = function(){
	var offset = 0;
		_thisEstacentral.obj_grid_cfcentral2 = null;
		_thisEstacentral.obj_grid_cfcentral2= new Grid("grid_cortecentral");
		_thisEstacentral.obj_grid_cfcentral2.get_gridpaginador(offset, "Estadisticas", "get_estadisticas_sisat_admin_pag","form_Estadisticascentral");
}


Estadisticascentral.prototype.retorna_combo = function(tipo){
	var cadena = "";
	if(tipo == "mom"){
				cadena += "<div>";
				cadena +="<label for='idmomento'>Momento</label>";
    			cadena += "<select id='select_est_admin' name='stl_momento' class='form-control'>";
    			cadena += "<option value='1'> 1 </option>";
    			cadena += "<option value='2'> 2 </option>";
    			cadena += "<option value='3'> 3 </option>";
                cadena += "</select></div>";
	}else if(tipo == "bim"){
		cadena += "<div>";
		cadena +="<label for='idmomento'>Bimestre</label>";
		cadena += "<select id='select_est_admin' name='stl_momento' class='form-control'>";
		cadena += "<option value='1'> 1 </option>";
		cadena += "<option value='2'> 2 </option>";
		cadena += "<option value='3'> 3 </option>";
		cadena += "<option value='4'> 4 </option>";
		cadena += "<option value='5'> 5 </option>";
        cadena += "</select></div>";
	}
	else if(tipo == "exp"){
		cadena += "<div>";
		cadena +="<label for='idmomento'>Exploración</label>";
		cadena += "<select id='select_est_admin_exploracion' name='stl_momento' class='form-control'>";
		cadena += "<option value='1'> Exploración1 </option>";
		cadena += "<option value='2'> Exploración2 </option>";
		cadena += "<option value='3'> Exploración3 </option>";
		if($("#slt_tipoestadistica").val() == "6"){
			cadena += "<option value='4'> TODAS </option>";
		}
        cadena += "</select></div>";
	}else if(tipo == "her"){
		cadena += "<div>";
		cadena +="<label for='idmomento'>Herramientas</label>";
		cadena += "<select id='select_est_admin' name='stl_herramienta' class='form-control'>";
		cadena += "<option value='1'> Lectura </option>";
		cadena += "<option value='2'> Texto </option>";
		cadena += "<option value='3'> Calculo </option>";
        cadena += "</select></div>";
	}
	return cadena;
}

Estadisticascentral.prototype.get_reporte_aca_admin = function(){
	var idnivel = $("#slt_estadisticas_nivel").val();
	var idregion = $("#slt_estadisticas_region").val();
	var idmunicipio = $("#slt_estadisticas_municipio").val();
	var idzona = $("#slt_estadisticas_zona").val();
	var idvalorcomboextra = $("#select_est_admin").val();
	$.ajax({
			url:base_url+"Estadisticas/get_reporte_aca_admin",
			method:"POST",
			data:{"idnivel":idnivel, "idregion":idregion, "idmunicipio":idmunicipio, "idzona":idzona, "select_est_admin":idvalorcomboextra},
			beforeSend: function(xhr) {
				$("#wait").modal("show");
			},
			success:function(data){
				$("#wait").modal("hide");
				$("#div_estadisticas_buscadorcct").empty();
				$("#div_estadisticas_buscadorcct").append(data.tabla_thml);
				$("#div_piecito_buscadorcct").empty();
				$("#div_piecito_buscadorcct").append(data.piecito);

			},
			error: function(error){
				console.log(error);
			}
		});
}

Estadisticascentral.prototype.get_grid = function (){
		var offset = 0;
		_thisEstacentral.obj_grid_cfcentral = null;
		_thisEstacentral.obj_grid_cfcentral = new Grid("grid_cortecentral");
		_thisEstacentral.obj_grid_cfcentral.get_gridpaginador(offset, "Estadisticas", "get_reporte_aca_admin","form_Estadisticascentral");
};

function get_gridpaginador(offset){
	var tEstadistica = $("#slt_tipoestadistica").val();
	switch(tEstadistica){
		case "0":
		break;
		case "2":
		var nivel = $("#slt_estadisticas_nivel").val();
			if(nivel == 1){
				_thisEstacentral.obj_grid_cfcentral2.get_gridpaginador(offset, "Estadisticas", "get_idcentrocfg_pag","form_Estadisticascentral");
			}else if(nivel == 2){
				_thisEstacentral.obj_grid_cfcentral2.get_gridpaginador(offset, "Estadisticas", "get_idcentrocfg_pag","form_Estadisticascentral");
			}else if(nivel == 3){
				_thisEstacentral.obj_grid_cfcentral2.get_gridpaginador(offset, "Estadisticas", "get_idcentrocfg_pag","form_Estadisticascentral");
			}
		break;
		case "3":
			_thisEstacentral.obj_grid_cfcentral2.get_gridpaginador(offset, "Estadisticas", "get_estadisticas_sisat_admin_pag","form_Estadisticascentral");
		break;
		case "4":
		_thisEstacentral.obj_grid_cfcentral.get_gridpaginador(offset, "Estadisticas", "get_reporte_aca_admin","form_Estadisticascentral");
		break;
		case "5":
			_thisEstacentral.obj_grid_cfcentral.get_gridpaginador(offset, "Estadisticas", "get_reporte_aca_admin","form_Estadisticascentral");
		break;
	}

}// get_gridpaginador()

Estadisticascentral.prototype.gettipoestadisticas = function(){
	var idnivel = $("#slt_estadisticas_nivel").val();
	$.ajax({
			url:base_url+"Estadisticas/gettipoestasiticasxnivel",
			method:"POST",
			data:{"idnivel":idnivel},
			beforeSend: function(xhr) {
				$("#wait").modal("show");
			},
			success:function(data){
				$("#wait").modal("hide");
				var options = "";
				console.log(data.tipoestadisticas);

				if(data.tipoestadisticas){
					$.each(data.tipoestadisticas, function( index, value ) {
						console.log(value);
					  options += "<option value="+value['data']+">"+value['label']+"</option>"
					});
					$("#slt_tipoestadistica").empty();
					$("#slt_tipoestadistica").append(options);
				}
				else{
					obj_notif.get_notification("error", "Reintente por favor");
				}
			},
			error: function(error){
				console.log(error);
			}
		});
}

Estadisticascentral.prototype.get_reporteaca_admin = function(id_centrocfg){
    // var id_centrocfg = $("#sel_grupos_supervisor").val();
    var bim = $("#select_est_admin").val();
    if(bim==1 || bim == 2){
      obj_notif.get_notification("error", "No disponible para este bimestre");
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


Estadisticascentral.prototype.get_grupos_cct_admin_estsisat = function(id_centrocfg){
	var nivel = $("#slt_estadisticas_nivel").val();
        $.ajax({
          url: base_url+"index.php/Estadisticas/get_estadisticas_sisat_estadisticas_admin",
          data:{'idcentrocfg':id_centrocfg, 'nivel':nivel},
          type:'POST',
          beforeSend: function(xhr) {
            $("#wait").modal("show");
          },
          success: function(result){
            $("#wait").modal("hide");
            var combo = $("#txt_sisat_id_grupo");
            $.each(result.grupos, function( index, value ) {
			  console.log( index);
			  console.log(value );
			  combo.append("<option value='"+value['idgrupo']+"'>"+value['grado']+"-"+value['grupo']+"</option>");
			});
          },
          error:function(xhr){
            $("#wait").modal("hide");
            console.error(xhr.status + ": " + xhr.responseText);
          }
        });
  }// get_grupos_cct_admin_estsisat()

  Estadisticascentral.prototype.valida_get_grafica = function(){
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
        obj_estcentral.get_grafica();
      }
    }
    // alert("funciona");
  }// valida_get_grafica()

  Estadisticascentral.prototype.get_grafica = function(){
    var obj_notification_graph = new Notification("sisat_graph_notifications");
    obj_notification_graph.destroy();

    var idgrupo = $("#txt_sisat_id_grupo").val();
    var habilidad = $("#txt_sisat_habilidad").val();
    var exploracion = $("#txt_sisat_exploracion").val();
    var idcfg = $("#txt_sisat_id_cfg").val();
    var tipodeestadisticas_sisat = $("#sel_estadisticas_opcion").val();

    $.ajax({
      url: base_url+"index.php/Sisat/get_data_graph_sisat_admin",
      data:{'idgrupo':idgrupo, 'habilidad':habilidad, 'exploracion':exploracion, 'idcfg':idcfg, "supervisoroescolar":tipodeestadisticas_sisat},
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
            $("#wait").modal("hide");
            $("#contenedor_div").show();
            obj_graficas.drawAxisTickColors(result.barras);

            obj_graficas.drawLineChart(result.lineal);
            obj_graficas.estadistica_tabla(result.tabla);
            obj_graficas.drawChart_colum(result.pastel);


            $("#id_total_alumnos").text(result.total_alumnos);
        }




      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }// get_grafica()

  Estadisticascentral.prototype.get_estadisticas_concentrado = function(){
  	var form = $( "#form_Estadisticascentral" );

    $.ajax({
      url: base_url+"Sisat/get_concentrado_admin_central",
      data:form.serialize(),
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
            $("#wait").modal("hide");
            obj_estcentral.drawAxisTickColors(result.barras);

            obj_estcentral.drawLineChart(result.lineal);
            obj_estcentral.estadistica_tabla(result.tabla);
            obj_estcentral.drawChart_colum(result.pastel);
            $("#id_total_alumnos_central").text(result.total_alumnos);
            muestra_graficas_concentrado();
        }
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
  }


  $("#sisat_btn_get_grafica").click(function(e){
	  e.preventDefault();
	  obj_estcentral.valida_get_grafica();
	});

  Estadisticascentral.prototype.drawAxisTickColors = function(datos){
      datos[0] = ['Titulo', 'Requiere apoyo', {role:'annotation'}, 'En proceso', {role:'annotation'}, 'Nivel esperado',{role:'annotation'}];
      var txt="";
      if($("#select_est_admin").val() == 4){
        txt = "DE TODAS LAS EXPLORACIONES";
      }else{
        txt = "DE LA EXPLORACIÓN "+$("#select_est_admin option:selected").text();
      }

      var title_chart = "RESULTADO "+txt+" DE "+$("#select_est_admin option:selected").text().toUpperCase();
      $("#title_graph_bar_central").empty();
      $("#title_graph_bar_cantral").html(title_chart);

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
      var chart = new google.visualization.ColumnChart(document.getElementById('sisat_get_graph_central'));
      chart.draw(data, options);
  }// drawAxisTickColors()

  Estadisticascentral.prototype.drawLineChart = function(datos) {
    var data = new google.visualization.DataTable();
    var title_chart = "RESULTADO DE TODAS LAS EXPLORACIONES DE "+$("#select_est_admin option:selected").text().toUpperCase()+" GRUPO "+ $("#sisat_graph_lbl").html().toUpperCase();
        data.addColumn('string', $("#select_est_admin option:selected").text().toUpperCase());
        // data.addColumn('number', 'Exploración 1');
        // data.addColumn('number', 'Exploración 2');
        // data.addColumn('number', 'Exploración 3');

        var exploracion = $("#select_est_admin_exploracion").val();

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

        var title_chart = 'EXPLORACIÓN DE '+$("#select_est_admin option:selected").text().toUpperCase();
        $("#title_graph_line_central").empty();
        $("#title_graph_line_central").html(title_chart);

        data.addRows(datos);

        var options = {
          // width:800,
          width:"100%",
          height: 350,
          legend: { position: 'bottom' },

          // title: 'EXPLORACIÓN DE '+$("#txt_sisat_habilidad option:selected").text().toUpperCase(),
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
          // ,chartArea:{ left:50,right:150,bottom:50,top:50 }
        };

        var chart = new google.charts.Line(document.getElementById('sisat_get_graph_line_central'));
        chart.draw(data, google.charts.Line.convertOptions(options));
  }// drawLineChart()

  Estadisticascentral.prototype.estadistica_tabla = function(tbody){
    $("#sisat_tabla_estadistica_central tbody").empty();
    $("#sisat_tabla_estadistica_central tbody").append(tbody);
  }

  Estadisticascentral.prototype.drawChart_colum = function(datos) {
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
      var chart = new google.visualization.ColumnChart(document.getElementById('sisat_get_donut_central'));
      chart.draw(data, options);//
      }

	Estadisticascentral.prototype.get_nivel = function(cct) {
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
	      		$("#slt_estadisticas_nivel").val("1").trigger('change');
	      	}
	      	if(result.nivel['nivel'] == "PRI"){
	      		$("#slt_estadisticas_nivel").val("2").trigger('change');
	      	}
	      	if(result.nivel['nivel'] == "SEC"){
	      		$("#slt_estadisticas_nivel").val("3").trigger('change');
	      	}
	      },
	      error:function(xhr){
	        $("#wait").modal("hide");
	        console.error(xhr.status + ": " + xhr.responseText);
	      }
	    });
	}

// ESTADISTICAS PARA ADMIN CENTRAL FIN




function alimenta_campo_cct(){
		var cct = obj_bcct.get_cct();
		console.log(cct);
		$("#itxt_estadisticas_cct").val("");
		$("#itxt_estadisticas_cct").val(cct);
		obj_estcentral.get_nivel(cct);
		obj_bcct = null;
}// alimenta_campo_cct()

function oculta_graficas_concentrado(){
	$("#title_graph_bar_cantral").empty();
	$("#sisat_get_graph_central").empty();
	$("#sisat_get_graph_table_central").hide();
	$("#id_total_alumnos_central").empty();
	$("#title_graph_line_central").empty();
	$("#sisat_get_graph_line_central").empty();
	$("#title_graph_donut_central").empty();
	$("#sisat_get_donut_central").empty();
}

function muestra_graficas_concentrado(){
	$("#title_graph_bar_cantral").show();
	$("#sisat_get_graph_central").show();
	$("#sisat_get_graph_table_central").show();
	$("#id_total_alumnos_central").show();
	$("#title_graph_line_central").show();
	$("#sisat_get_graph_line_central").show();
	$("#title_graph_donut_central").show();
	$("#sisat_get_donut_central").show();
}
