// No queremos que se se propague el evento submit con enter en nuestro form
$("#form_buscadorcct").submit(function(e){
    e.preventDefault();
});

$("#btn_buscadorcct_seleccionar").click(function(e){
  e.preventDefault();
  var arr_row_buscador = this_bcct.obj_grid_buscador.get_row_selected();
  if(arr_row_buscador.length==0 || arr_row_buscador[0]['cct'] == undefined){
    $("#div_buscadorcct_notification").show();
    this_bcct.obj_grid_buscador.init();
    this_bcct.cct = "";
  }else{
    this_bcct.cct = arr_row_buscador[0]['cct'];
    this_bcct.idcct = arr_row_buscador[0]['idct'];
    this_bcct.idcentrocfg = arr_row_buscador[0]['idcentrocfg'];
    this_bcct.nivel = arr_row_buscador[0]['nivel'];
    this_bcct.idnivel = arr_row_buscador[0]['idnivel'];
    var evento = new Event('cct_seleccionada');
    document.getElementById(this_bcct.id_div_evento).dispatchEvent(evento);
    this_bcct.finish();
  }
});

$("#btn_buscadorcct_buscar").click(function(e){
    e.preventDefault();
    this_bcct.get_grid();
});

$("#btn_buscadorcct_limpiar").click(function(e){
    e.preventDefault();
    $("#itxt_buscadorcct_cct").val("");
});

$("#btn_modal_buscadorcct_cerrar").click(function(e){
    e.preventDefault();
    var evento = new Event('event_salir_buscador');
    document.getElementById(this_bcct.id_div_evento).dispatchEvent(evento);

    this_bcct.finish();
});

$("#btn_buscadorcct_close_notification").click(function(e){
    e.preventDefault();
    $("#div_buscadorcct_notification").hide();
});

function Buscadorcct(div_evento){
   this_bcct = this;
   this_bcct.cct = "";
   this_bcct.id_div_evento = div_evento;
    this_bcct.obj_grid_buscador = null;

    this_bcct.controller = "Buscadorcct";
		this_bcct.funcion = "get_grid";
 }

 function get_paginador_buscadorcct(offset){
   this_bcct.obj_grid_buscador = null;
   this_bcct.obj_grid_buscador = new Grid("grid_buscadorcct");
   this_bcct.obj_grid_buscador.get_gridpaginador(offset,"Buscadorcct","get_grid","form_buscadorcct");
 }


 Buscadorcct.prototype.init = function (){
   let class_heading = Helpers.get_class_heading();
   let hijos = $("#modal_buscadorcct .modal-dialog .modal-content").children("div");
   let modal_header = hijos[0];
   $(modal_header).removeClass().addClass("modal-header modalhead-text " + class_heading);

   this_bcct.obj_grid_buscador = new Grid("grid_buscadorcct");
   $("#modal_buscadorcct").modal("show");
 };

 Buscadorcct.prototype.get_cct = function (){
   return this_bcct.cct ;
 };

 // Se agrega funcion busadorcct
 Buscadorcct.prototype.get_idcct = function (){
  return this_bcct.idcct ;
};

// Se agrega funcion get_idnivel
Buscadorcct.prototype.get_idnivel = function (){
  return this_bcct.idnivel ;
};

// Se agrega funcion get_idcentrocfg
Buscadorcct.prototype.get_idcentrocfg = function (){
  return this_bcct.idcentrocfg ;
};

Buscadorcct.prototype.get_grid = function (){
  var datos = $("#form_buscadorcct").serialize();
 	$.ajax({
 		url:base_url+this_bcct.controller+"/"+this_bcct.funcion,
 		method:"POST",
 		data: datos,
 		beforeSend: function(xhr) {
 			$("#wait").modal("show");
 		},
 		success:function(data){
 			$("#wait").modal("hide");
 			$("#grid_buscadorcct").empty();
 			$("#grid_buscadorcct").append(data.str_grid);
 		},
 		error: function(error){
 			console.error(error);
 		}
 	});
 };

 Buscadorcct.prototype.finish = function (){
   $("#grid_buscadorcct").empty();
   $("#modal_buscadorcct").modal("hide");
   this_bcct.obj_grid_buscador = null;
   this_bcct = null;
 };
