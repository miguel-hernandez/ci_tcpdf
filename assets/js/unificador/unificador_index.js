
$(document).ready(function() {
    obj_notification = new Notifications("unificador_notification");
});
$(function() {
$("#btn_carga_get_selected").hide();
   Obj_unificador = new Unificador();
});
var head = new Array(	{encabezado:"", width:"20%"},
						{encabezado:"ID", width:"20%"}, {encabezado:"NOMBRE", width:"20%"}, {encabezado:"APELLIDO1", width:"20%"},
						{encabezado:"APELLIDO2", width:"20%"}, {encabezado:"CURP", width:"20%"}, {encabezado:"FECHANAC", width:"20%"},
						{encabezado:"ENTIDADNAC", width:"20%"}, {encabezado:"MUNRESIDENCIA", width:"20%"}, {encabezado:"NIVELACTIVO", width:"20%"},
						{encabezado:"FOTO", width:"20%"}, {encabezado:"CALLE", width:"20%"}, {encabezado:"NUMERO", width:"20%"},
						{encabezado:"COLONIA", width:"20%"}, {encabezado:"TELEFONO", width:"20%"}, {encabezado:"GENERO", width:"20%"},
						{encabezado:"PAISNAC", width:"20%"}, {encabezado:"IDETNIA", width:"20%"}, {encabezado:"IDTRANSNACIONAL", width:"20%"},
						{encabezado:"PAISDOMICILIO", width:"20%"}, {encabezado:"ENTIDADDOMICILIO", width:"20%"}, {encabezado:"MUNICIPIODOMICLIO", width:"20%"}, {encabezado:"LOCALIDADDOMICILIO", width:"20%"},
						{encabezado:"FECHAREGISTRO", width:"20%"}, {encabezado:"FECHAMOD", width:"20%"}, {encabezado:"CURPVALIDA", width:"20%"},
						{encabezado:"FECHAVALIDACURP", width:"20%"}, {encabezado:"IDANTERIOR", width:"20%"}, {encabezado:"IDUSUARIO", width:"20%"},
						{encabezado:"CELULAR", width:"20%"}, {encabezado:"MUNNAC", width:"20%"}, {encabezado:"CURPORI", width:"20%"},
					);
var camposexpediente = ["idalumno", "nombre", "apell1", "apell2", "curp", "fechanac","entidadnac", "munresidencia", "nivelactivo",
								 "foto", "calle", "numero", "colonia", "telefono", "genero", "paisnac", "idetnia", "idtransnacional", "paisdomicilio",
								 "entidaddomicilio", "municipiodomicilio", "localidaddomicilio", "fecha_registro", "fecha_mod", "curpvalida",
								 "fechavalidacurp","idanterior", "idusuario", "celular", "munnac", "curpori"
					];


$("#btn_carga_get_selected").click(function(){
	var seleccionados = Obj_table.getrows("table_result_coinc");
	if(seleccionados.length < 2 || seleccionados.length > 2){
    obj_notification.get_notification("error","Por favor seleccione dos registros");

	}else{
    $("#modal_unificador_b").modal("hide");
		Obj_unificador.extraeidsalumnos(seleccionados);
    Obj_unificador.get_evals_movs_docs();
	}
});

function funcionradio(valor){
  console.log(valor);
  // alert("evento check");
	$(valor).parents("tr").find(".cellvalida").each(function() {
		$(this).removeAttr("checked");
		$(this).find('input').attr('checked', true);
    });
}

$("#btn_search_expediente_uni").click(function(){
	Obj_unificador.search_expediente();
})

$("#btn_carga_expediente").click(function(){
	vamos_vista_buscador();
	$("#modal_unificador_b").modal("show");
});

function vamos_vista_buscador(){
    $("#input_apellido1").val("");
    $("#input_apellido2").val();
    $("#input_nombre").val("")
    $("#input_curp").val("");
    $("#contenedor_duplicados").empty();
    $("#btn_carga_get_selected").hide();
}

$("#boton_cerrar_modal_exp").click(function(){
  vamos_vista_buscador();
  $('#modal_unificador_b').modal('toggle');
});

function Unificador(){
	var _this = this;
	var id1 = 0;
    var id2 = 0;
//Metodos privilegiados
    this.getid1 = function(){
	   return id1;
	}

	this.setid1 = function(nuevoid1){
	   id1 = nuevoid1;
	}

	this.getid2 = function(){
	   return id2;
	}

	this.setid2 = function(nuevoid2){
	   id2 = nuevoid2;
	}
}

Unificador.prototype.search_expediente = function(){
	var ap1 = $("#input_apellido1").val();
	var ap2 = $("#input_apellido2").val();
	var name = $("#input_nombre").val();
	var curp = $("#input_curp").val();
	$.ajax({
      url: base_url+"Unificador/search_expediente",
      data:{"apellido1":ap1, "apellido2":ap2, "nombre":name, "curp":curp},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(result){
      	$("#wait").modal("hide");
      	$("#contenedor_duplicados").empty();
      	$("#contenedor_duplicados").append(result.table);
      	$("#btn_carga_get_selected").show();
      	Obj_unificador.asignaID("table_result_coinc");
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
}

Unificador.prototype.asignaID = function(idtable){
	var tabla = $("#contenedor_duplicados table")[0];
	tabla.setAttribute("id", idtable);
	$("#"+idtable).removeClass("table-hover");
	Obj_table = new GridMultiselect(idtable);
   	Obj_table.addRowHandlers(idtable);
}

Unificador.prototype.get_evals_movs_docs = function(){
  var seleccionados = Obj_table.getrows("table_result_coinc");
  var arr_ids = [];

  for (var i = 0; i < seleccionados.length; i++) {
   arr_ids.push(seleccionados[i][0]);
  }

	$.ajax({
      url: base_url+"Unificador/get_evals_movs_docs",
      data:{"arr_ids":arr_ids},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(data){
      	$("#wait").modal("hide");
        $("#unificador_expedientes").empty();
        $("#unificador_expedientes").append(data.str_expedinete_v);
      	$("#unificador_evals").empty();
      	$("#unificador_evals").append(data.str_evals_v);
        $("#unificador_movs").empty();
      	$("#unificador_movs").append(data.str_movs_v);
        $("#unificador_docs").empty();
      	$("#unificador_docs").append(data.str_docs_v); 
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
}


Unificador.prototype.get_evals = function(){
  var seleccionados = Obj_table.getrows("table_result_coinc");
  var arr_ids = [];

  for (var i = 0; i < seleccionados.length; i++) {
   arr_ids.push(seleccionados[i][0]);
  }

	$.ajax({
      url: base_url+"Unificador/get_evals",
      data:{"arr_ids":arr_ids},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(data){
      	$("#wait").modal("hide");
      	$("#unificador_evals").empty();
      	$("#unificador_evals").append(data.str_view);
      },
      error:function(xhr){
        $("#wait").modal("hide");
        console.error(xhr.status + ": " + xhr.responseText);
      }
    });
}

Unificador.prototype.get_movs = function(){
  var seleccionados = Obj_table.getrows("table_result_coinc");
  var arr_ids = [];

  for (var i = 0; i < seleccionados.length; i++) {
   arr_ids.push(seleccionados[i][0]);
  }

	$.ajax({
      url: base_url+"Unificador/get_movs",
      data:{"arr_ids":arr_ids},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(data){
      	$("#wait").modal("hide");
      	$("#unificador_movs").empty();
      	$("#unificador_movs").append(data.str_view);
      },
      error:function(xhr){
        $("#wait").modal("hide");
      }
    });
}

Unificador.prototype.get_docs = function(){
  var seleccionados = Obj_table.getrows("table_result_coinc");
  var arr_ids = [];

  for (var i = 0; i < seleccionados.length; i++) {
   arr_ids.push(seleccionados[i][0]);
  }

	$.ajax({
      url: base_url+"Unificador/get_docs",
      data:{"arr_ids":arr_ids},
      type:'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(data){
      	$("#wait").modal("hide");
      	$("#unificador_docs").empty();
      	$("#unificador_docs").append(data.str_view);
      },
      error:function(xhr){
        $("#wait").modal("hide");
      }
    });
}
      Unificador.prototype.buscainarraysimple = function (array, pos){
      	for (var i = 0; i < array.length; i++) {
      		if(i == pos ){
      			return array[i];
      		}
      	}
      }

      Unificador.prototype.arma_objeto_fina = function(encabezados, valores){
      	var vector_exp = new Array();
      	var objeto = new Object();
      	for(var i = 0; i < encabezados.length; i++){
      		objeto[encabezados[i]] = valores[i];
      	}
      	// vector_exp.push(objeto);
      	return objeto;
      }

Unificador.prototype.arma_tabla_expedientes = function(seleccionados){
  console.log("Seleccionados del clic boton");
  console.table(seleccionados);
	var primerav = true;
	var idradio = "";
	var html = "";
	var thead = "";

	html += "<div class = 'table-responsive'>";
	html += "<table class = 'table table-bordered' id = 'tb_expedientes_unificar2'>";
	thead += "<tr>";
	for(var k = 0; k < head.length; k++){
		thead += "<th style=width:'30%' !mportant><center>"+head[k]['encabezado']+"</center></th>";
	}
	thead += "</tr>";
	html += thead;
	for(var i = 0; i < seleccionados.length; i++){
		html += "<tr class='expselect'>";
		var fila = seleccionados[i];
		if(fila.length > 0){
			for(var j = 0; j < fila.length; j++){
				if(j == 0){
					idradio = (primerav == true)?"radioprincipal1":"radioprincipal2";
					primerav = false;
					html += "<td><input type='radio' name='optradio' id='"+idradio+"' onclick='funcionradio(this)'></td>";
				}

				html += "<td class='cellvalida'>"+fila[j]+" <input type='radio' name='optradio"+j+"' value='"+fila[j]+"' class='boton'></td>";
			}
		}
		html += "</tr>";
	}
	html += "</table>";
	html += "</div>";

	$("#div_container_datos_expedientes").empty();
	$("#div_container_datos_expedientes").append(html);
}

Unificador.prototype.extraeidsalumnos = function(seleccionados){
	var idsseleccionados = new Object();
	this.setid1(seleccionados[0][0]);
	this.setid2(seleccionados[1][0]);
}

Unificador.prototype.buscaideliminar = function(array, id1, id2){
	var resp = 0;
  if (array == false) {
    resp = false;
  }
  else {
    $.each(array, function( index, value ) {
  		if(index == "idalumno"){
  			if(parseInt(value) == parseInt(id1)){
  				resp = id2;
  			}else if(parseInt(value) == parseInt(id2)){
  				resp = id1;
  			}else{
  				resp = false;
  			}
  		}
  	});
  }

	return resp;
}

Unificador.prototype.generaciondeexpediente = function(){
  var matriz = new Array();
  var cont_vuelta = 0;
    $("table#tb_expedientes_unificar tr.expselect").each(function(){
      cont_vuelta = 0;
            $(this).find("td.cellvalida").each(function() {
            if($(this).find('input').is(':checked')){
              console.log($(this).find('input').val().length);
              matriz[cont_vuelta] = ($(this).find('input').val().length != 0)?$(this).find('input').val():null;

            }
            cont_vuelta = cont_vuelta+1;
              });
      });
    console.log("Los valores de el expediente");
    console.table(matriz);
    if(matriz.length > 1){
    var objetofin = Obj_unificador.arma_objeto_fina(camposexpediente, matriz);
    return objetofin;
    }else{
      return false;
    }
}

Unificador.prototype.getfusionexpediente = function(){
	var vector = new Array();
    var expediente = Obj_unificador.generaciondeexpediente();
    var ideliminar = Obj_unificador.buscaideliminar(expediente, Obj_unificador.getid1(), Obj_unificador.getid2());
    vector.push(expediente);
    vector.push({"ideliminar": ideliminar});
    return vector;
}
