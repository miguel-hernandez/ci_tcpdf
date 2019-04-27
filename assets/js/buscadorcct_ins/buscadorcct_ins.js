$("#form_buscadorcct").keypress(function(e){
  var keyCode = e.keyCode;
  if(keyCode == 13){
    return false;
  }
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
		this_bcct.conexcedente = arr_row_buscador[0]['conexcedente'];
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
    this_bcct.finish();
});

$("#btn_buscadorcct_close_notification").click(function(e){
    e.preventDefault();
    $("#div_buscadorcct_notification").hide();
});

function Buscadorcct(div_evento){
   this_bcct = this;
   this_bcct.cct = "";
   this_bcct.idcct = 0;
   this_bcct.idcentrocfg = 0;
   this_bcct.nivel = "";
   this_bcct.idnivel = 0;
   this_bcct.conexcedente = 0;
   this_bcct.id_div_evento = div_evento;
    this_bcct.obj_grid_buscador = null;

    this_bcct.controller = "Buscadorcctinsc";
		this_bcct.funcion = "get_grid";
 }

 Buscadorcct.prototype.init = function (){
   this_bcct.obj_grid_buscador = new Grid("grid_buscadorcct");
   $("#modal_buscadorcct").modal("show");
 };

 Buscadorcct.prototype.get_cct = function (){
   return this_bcct.cct ;
 };
 Buscadorcct.prototype.get_idcct = function (){
   return this_bcct.idcct ;
 };
 Buscadorcct.prototype.get_idcentrocfg = function (){
   return this_bcct.idcentrocfg ;
 };
 Buscadorcct.prototype.get_nivel = function (){
   return this_bcct.nivel ;
 };
 Buscadorcct.prototype.get_idnivel = function (){
   return this_bcct.idnivel ;
 };
  Buscadorcct.prototype.get_conexcedente = function (){
   return this_bcct.conexcedente ;
 };
 Buscadorcct.prototype.get_grid = function (){
  var datos = $("#form_buscadorcct").serialize();
  // console.log(this_bcct.controller);
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
      $("#wait").modal("hide");
 			console.error(error);
 		}
 	});
 };

 Buscadorcct.prototype.get_gridpaginador = function (offset){
     this_bcct.obj_grid_buscador.get_gridpaginador(offset, "Buscadorcctins", "get_grid","form_buscadorcct");
 };

 Buscadorcct.prototype.finish = function (){
   $("#grid_buscadorcct").empty();
   $("#modal_buscadorcct").modal("hide");
   this_bcct.obj_grid_buscador = null;
   this_bcct = null;
 };
