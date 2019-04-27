
$("#btn_rutamejora_editar").click(function (e) {
  e.preventDefault();
var arr_row = obj_grid.get_row_selected();
var datos = arr_row[0];
if(datos != null && datos['idrutamtema'] > 0){
  obj_editar = new Editar_rutamejora();
  obj_editar.get_datos(datos["idrutamtema"]);
  obj_grid.unselect();
  $('#btn_rutamejora_editar').css("display","none");
  $('#btn_rutamejora_eliminareg').css("display","none");
  $('#btn_rutamejora_prueba').css("display","none");
}else{
  // obj_notification.error("Seleccione un registro para editar");
  /*
  bootbox.alert({
       message: "<br><b>Seleccione un registro para editar</b>",
       size: 'small'
     });
     */
      Helpers.alert("Seleccione un registro para editar", "error");
}

});


 function Editar_rutamejora(){
   _this = this;
 }

 Editar_rutamejora.prototype.set_problems = function(arr_problems,otros){
   $("#ruta_pprobematicas").selectpicker('deselectAll');

   for(var j=0;j<arr_problems.length;j++){
     var problem = parseInt(arr_problems[j]);
     if(problem == 3 || arr_problems[j] == "3"){
       $("#txt_ruta_otropp").removeClass("hidden");
       $("#txt_ruta_otropp").val(otros);
     }
   }


   elem = document.getElementById("ruta_pprobematicas").options;
   for(i=0;i<elem.length;i++){
      var val = elem[i].value;
      if(arr_problems.indexOf(val)>=0){ // Regresa -1 cuando no encuentra la posición
        // console.info("SI: "+val);
        elem[i].selected=true;
      }
      else{
        // console.info("NO: "+val);
      }
   }
   $("#ruta_pprobematicas").selectpicker("refresh");
 };

 Editar_rutamejora.prototype.set_evidencias = function(arr_evidens, otros){
   $("#ruta_evidenciasutilizadas").selectpicker('deselectAll');

   for(var j=0;j<arr_evidens.length;j++){
     var evidenc = parseInt(arr_evidens[j]);
     if(evidenc == 6 || arr_evidens[j] == "6"){
       $("#txt_ruta_otrope").removeClass("hidden");
       $("#txt_ruta_otrope").val(otros);
     }
   }

   elem = document.getElementById("ruta_evidenciasutilizadas").options;
   for(i=0;i<elem.length;i++){
      var val = elem[i].value;
      if(arr_evidens.indexOf(val)>=0){ // Regresa -1 cuando no encuentra la posición
        elem[i].selected=true;
      }
      else{
        // nada...
      }
   }
   $("#ruta_evidenciasutilizadas").selectpicker("refresh");
 };

 Editar_rutamejora.prototype.set_progapoy = function(arr_progapoy, otrospap){
   $("#ruta_pproapoy").selectpicker('deselectAll');

   for(var j=0;j<arr_progapoy.length;j++){
     var progapoy = parseInt(arr_progapoy[j]);
     if(progapoy == 5 || arr_progapoy[j] == "0"){
       $("#txt_rm_otropapy").removeClass("hidden");
       $("#txt_rm_otropapy").val(otrospap);
     }
   }

   elem = document.getElementById("ruta_pproapoy").options;
   for(i=0;i<elem.length;i++){
      var val = elem[i].value;
      if(arr_progapoy.indexOf(val)>=0){ // Regresa -1 cuando no encuentra la posición
        elem[i].selected=true;
      }
      else{
        // nada...
      }
   }
   $("#ruta_pproapoy").selectpicker("refresh");
 };

 Editar_rutamejora.prototype.set_grid = function(str_grid){
   $("#grid_rutamejora").empty();
   $("#grid_rutamejora").append(str_grid);
 };


 Editar_rutamejora.prototype.set_others = function(arr_datosxid){
   $("#itxt_rutamejora_idrutamtema").val(arr_datosxid[0]["idrutamtema"]);
   $("#txt_rm_programayuda").val(arr_datosxid[0]["descrayuda"]);

   if( $("#itxt_rutamejora_idrutamtema").val()>0 ){
     $('#btn_ruta_grabar').text("Actualizar");
   }

   $("#slc_ruta_iapa").val(arr_datosxid[0]["idindicadorAPA"]);

   var option_orden = "<option value="+arr_datosxid[0]['orden']+">"+arr_datosxid[0]['orden']+"</option>";
   $("#ruta_prioridad").empty();
   $("#ruta_prioridad").append(option_orden);

   var option_tema = "<option value="+arr_datosxid[0]['idtema']+">"+arr_datosxid[0]['tema']+"</option>";


   //$("#ruta_tema").empty();
   $("#ruta_tema").val(arr_datosxid[0]["idtema"]);
   document.getElementById('ruta_tema').disabled = true;
   $("#txt_rm_objetivo").val(arr_datosxid[0]["objetivo"]);

   $("#txt_rm_meta").val(arr_datosxid[0]["meta"]);


   $("#txt_rm_obs").val(arr_datosxid[0]["observaciones"]);

   $("#txt_rm_obssuper").val(arr_datosxid[0]["observacionessuperv"]);

   $("#wait").modal("hide");
   // $("#btn_ruta_grabar").append("Actualizar");
 };


 Editar_rutamejora.prototype.updateruta = function(orden, prioridad, pproblematicas, eutilizadas, iAPA, otrospproblematica, otrospevidencia, progapoyo, progapoyo_otro, cayudan){
   var idrutamtema = $("#itxt_rutamejora_idrutamtema").val();
   var objetivo = $("#txt_rm_objetivo").val();
   var meta = $("#txt_rm_meta").val();
   var observaciones = $("#txt_rm_obs").val();
   var otros = $("#txt_ruta_otropp").val();
   // alert(otros);
   // return false;

   var texto="";
   $("#ruta_pprobematicas option:selected").each(function() {
     texto += $(this).val() + ",";
     // if(texto.indexOf("3") > -1){
     //   $("#txt_ruta_otropp").removeClass("hidden");
     // }else{
     //   $("#txt_ruta_otropp").addClass("hidden");
     // }
   });
   pproblematicas = texto.split(",");
   var i = pproblematicas.indexOf("");
   pproblematicas.splice( i, 1 );

   var texto="";
   $("#ruta_evidenciasutilizadas option:selected").each(function() {
     texto += $(this).val() + ",";
   });
   eutilizadas = texto.split(",");
   var i = eutilizadas.indexOf("");
   eutilizadas.splice( i, 1 );

   var texto="";
   $("#ruta_pproapoy option:selected").each(function() {
     texto += $(this).val() + ",";
   });
   paputilizadas = texto.split(",");
   var i = paputilizadas.indexOf("");
   paputilizadas.splice( i, 1 );

   $.ajax({
           url:base_url+"rutademejora/updateruta",
           method:"POST",
           data:{"idrutamtema":idrutamtema, "orden":orden, "tema":prioridad, "pproblematicas":pproblematicas, "eviutulizadas":eutilizadas, "paputilizadas":paputilizadas,  "progapoyo_otro":progapoyo_otro,   "cayudan":cayudan,
           "indicadorAPA":iAPA, "otrospproblematica":otrospproblematica, "otrospevidencia":otrospevidencia,"objetivo":objetivo,"meta":meta,"observaciones":observaciones,"otros":otros},
           beforeSend: function(xhr) {
             $("#wait").modal("show");
           },
           success:function(data){
             if(data.result || data.result==1 || data.result == "1"){
               var tabla = data.tabla;
               $("#grid_rutamejora").empty();
               $("#grid_rutamejora").append(tabla);

               $("#ruta_tema").val("0");
               $('#ruta_pprobematicas').selectpicker('deselectAll');
               $('#ruta_evidenciasutilizadas').selectpicker('deselectAll');
               $('#ruta_pproapoy').selectpicker('deselectAll');
               $("#txt_ruta_otropp").val("");
               $("#txt_ruta_otrope").val("");
               $("#txt_ruta_otrope").addClass("hidden");
               $("#ruta_pproapoy").val("");
               $("#txt_rm_otropapy").val("");
               $("#txt_rm_otropapy").addClass("hidden");
               $("#txt_rm_programayuda").val("");
               $("#txt_rm_objetivo").val("");
               $("#txt_rm_meta").val("");
               $("#txt_rm_obs").val("");
               $("#txt_ruta_otropp").addClass("hidden");
               /*
               bootbox.alert({
                    message: "<br><b>Prioridad actualizada</b>",
                    size: 'small'
                  });
                  */
                Helpers.alert("Prioridad actualizada correctamente", "success");

               $("#itxt_rutamejora_idrutamtema").val(0);
               $('#btn_ruta_grabar').text("Grabar");
             }else{
               /*
               bootbox.alert({
                    message: "<br><b>Ocurrió un error</b>",
                    size: 'small'
                  });
                  */
                Helpers.alert(">Ocurrió un error reintente por favor", "error");
             }
             var idtabla = $("#grid_rutamejora table");
              idtabla[0].setAttribute("id", "id_tabla_demo");
              ruta.inicio();

           },
           error: function(error){
             console.log(error);
           }
       });
 };

 Editar_rutamejora.prototype.get_datos = function(idrutamtema){
   $.ajax({
           url:base_url+"rutademejora/get_xidrutamtema",
           method:"POST",
           data:{"idrutamtema":idrutamtema},
           beforeSend: function(xhr) {
             $("#wait").modal("show");
           },
           success:function(data){
             _this.set_problems(data.arr_problems,data.otros);
             _this.set_evidencias(data.arr_evidens,data.otrosev);
             _this.set_progapoy(data.arr_progapoy,data.otrospap);
             _this.set_grid(data.str_grid);
             _this.set_others(data.arr_datosxid);
           },
           error: function(error){
             console.log(error);
           }
       });
 };
