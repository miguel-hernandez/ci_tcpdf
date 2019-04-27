
$(document).ready(function(){
  var id_funcion_g = $('#idfuncion').val();
  var id_detalle_g = $('#iddetalle').val();

  $('#horas').prop('disabled', true); // De inicio deshabilito el select
  if(id_funcion_g==4 && id_detalle_g==30){ // pero si es docente y son horas lo habilito
    $('#horas').prop('disabled', false); // $('#horas').removeAttr('disabled');
  }

  $("#iddetalle").change(function(){
    var id_detalle_g = $('#iddetalle').val();

    if(id_detalle_g == 30 && id_funcion_g==4){ // horas
      $('#horas').prop('disabled', false);
    }else{
      deshabilita_reinicia();
    }
  });// change detalle

  $("#idfuncion").change(function(){
    id_funcion_g = $('#idfuncion').val();
    if(id_funcion_g==0){
      $("#iddetalle").empty();
      $("#iddetalle").append("<option value='0'>- Seleccione función -</option>");
      deshabilita_reinicia();
      return;
    }
    if(id_funcion_g==4 && id_detalle_g==30){ // horas
      $('#horas').val(1);
      $('#horas').prop('disabled', false);
    }
    if(id_funcion_g==8 || id_funcion_g==9){
      $("#iddetalle").empty();
      $("#iddetalle").append("<option value='0'>- Seleccione detalle -</option>");
      deshabilita_reinicia();
    }
    if(id_funcion_g==3 || id_funcion_g==6){ // horas
      deshabilita_reinicia();
    }
    get_detalle(id_funcion_g);
  });// change funcion

  function deshabilita_reinicia(){
    $('#horas').val(1);
    $('#horas').prop('disabled', true);
  }

  function get_detalle(id_funcion){
    $.ajax({
      url : live_url+"index.php/personal/get_detallex_funcion",
      dataType : 'json',
      method : 'POST',
      data : {
        funcion : id_funcion
      },
      success: function(res){
        if(res.length != null){
          var num_detalles = res.length;

          $("#iddetalle").empty();
          $("#iddetalle").append("<option value='0'>- Seleccione detalle -</option>");
          for(var i=0; i<num_detalles; i++){
            var item = res[i];
            var id_detalle = item['iddetalle'];
            var detalle = item['detalle'];
            var opcion = $("<option>", {value:id_detalle});
            opcion.append(detalle);
            $("#iddetalle").append(opcion);
          }
        } else console.log("Error.");
      },
      error : function(){
        $("#estado").append(getAlertEstado("Ocurrió un error interno al intentar realizar la operación.", "danger"));
      }
    });
  }// get_detalle()

  if($("#folio-acceso").val() == '') $("#btn-genera-folio").prop("disabled", true);

  if(!$("#acceso-pace").prop("checked")) $("#info-pace").css("display", "none");
  else {
    $("#btn-genera-folio").prop("disabled", false);
    $("#info-pace").css("display", "block");
  }

  $("#acceso-pace").click(function(){
    if($(this).prop("checked")){
      $("#btn-genera-folio").prop("disabled", false);
      $("#info-pace").css("display", "block");
    }
    else{
      $("#btn-genera-folio").prop("disabled", true);
      $("#info-pace").css("display", "none");
      return;
    }
  });

  $("#btn-genera-folio").click(function(){
    $.ajax({
      url : live_url+"index.php/personal/folio_pace",
      dataType : 'json',
      method : 'POST',
      success: function(res){
        if(res['folio'] != null){
          $("#folio-acceso").prop('disabled', false);
          $("#folio-acceso").val(res['folio']);
        }
        else
        $("#estado").append(getAlertEstado("Ocurrió un error interno al intentar generar el folio.", "danger"));
      },
      error : function(){
        $("#estado").append(getAlertEstado("Ocurrió un error interno al intentar realizar la operación.", "danger"));
      }
    });
  });// genera-folio

  $("#municipio").change(function(){
    var id_municipio = $('#municipio').val();
    if(id_municipio == 0){
      $("#colonia").empty();
      $("#colonia").append("<option value='0'>- Seleccione colonia -</option>");
      return;
    }
    getColonias($('#municipio').val(), 0);
  });// change

  function getColonias(id_munic, colonia_personal){
    $.ajax({
      url : live_url+"index.php/personal/get_coloniasx_municipio",
      dataType : 'json',
      method : 'POST',
      data : {
        id_municipio : id_munic
      },
      success: function(res){
        if(res.length != null){
          var num_colonias = res.length;

          if(num_colonias == 0){
            $("#colonia").append("<option value='0'>- No hay colonias disponibles -</option>");
            return;
          }

          $("#colonia").empty();
          $("#colonia").append("<option value='0'>- Seleccione colonia -</option>");
          for(var i=0; i<num_colonias; i++){
            var item = res[i];
            var id_col = item['idcolonia'];
            var nombre_col = item['d_asenta'].toUpperCase();

            if(colonia_personal == 0) var opcion = $("<option>", {value:id_col});
            else var opcion = $("<option selected>", {value:id_col});

            opcion.append(nombre_col);
            $("#colonia").append(opcion);
          }
        } else{
          $("#colonia").empty();
          $("#colonia").append("<option value='0'>- No hay colonias disponibles -</option>");
        }
      },
      error : function(){
        $("#estado").append(getAlertEstado("Ocurrió un error interno al intentar realizar la operación.", "danger"));
      }
    });
  }// getColonias()
  

 $("#div_reporte_por_personal").hide();

$("#btn_reporte_por_personal").click(function(e){
    e.preventDefault();
    var reporte_por_personal = $("#reporte_por_personal").val();
    if($.trim(reporte_por_personal).length==0 ||  reporte_por_personal=="" ){
      alert("Seleccione un tipo de reporte para el alumno seleccionado. ");
    }else{
      var report = new Reportes();
      report.get_reporte_por_personal();
    }
});

  
});// document.ready

var arraySelected = new Array();
var arraySelectedFull =new Array();
function showhide(u){
    arraySelected = [];
    arraySelectedFull = [];
    bit = false;
    es_inactivo = false;
    $("#listado_personal_table input[name=elementos]").each(function () {
                if($(this).prop("checked")){
                  $(this).closest('td').siblings().each(function(){
                    // obtenemos el texto del td 
                    var this_texto = $(this).text();
                    if(this_texto == "Inactivo"){
                      es_inactivo = true;
                    }
                  });
                   bit = true;
                   arraySelectedFull.push($(this).attr("value"));
                   arraySelected.push($(this).attr("value"));
                }
    });
    if(bit && es_inactivo != true){
       $("#div_reporte_por_personal").show();    
   }
    else{    
        $("#div_reporte_por_personal").hide();
    }
    //alert(JSON.stringify(arraySelected));

}

function Reportes(){
  tmp_report = this;
   this.get_reporte_por_personal = function(){
    
        var reporte=$("#reporte_por_personal").val();
        var form = document.createElement("form");
        var element1 = document.createElement("input");
        var element2 = document.createElement("input");
    
        form.name="formRep";
        form.id="formRep";
        form.method = "POST";
        form.target = "_blank";

        form.action = base_url+"Reportes/GeneraReporte/"+reporte;

        element1.type="hidden";
        element1.value=reporte;
        element1.name="nombreRep";
        form.appendChild(element1);
        element2.type="hidden";
        element2.value=arraySelected.join();
        element2.name="paramRep";
        form.appendChild(element2);
        document.body.appendChild(form);
        form.submit();
    };// reporte_por_alumno()
}