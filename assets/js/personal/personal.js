
$(document).ready(function(){


  $('.selectactivo').prop('disabled', true); // De inicio deshabilito el select
  var id_funcion_g = $('#idfuncion').val();
  var id_detalle_g = $('#iddetalle').val();
  if((id_funcion_g==4 && id_detalle_g==30) || (id_funcion_g==11 && id_detalle_g==32)){ // pero si es docente y son horas lo habilito

    $('#horas').prop('disabled', false); // $('#horas').removeAttr('disabled');
  }

  $("#iddetalle").change(function(){
    var id_funcion_g = $('#idfuncion').val();
    var id_detalle_g = $('#iddetalle').val();

    if((id_detalle_g == 30 && id_funcion_g==4) || (id_detalle_g == 32 && id_funcion_g==11)){ // horas
      $('#horas').val(1);
      $('#horas').prop('disabled', false);
      $('.selectactivo').prop('disabled', false);
    }else{
      deshabilita_reinicia();
    }
  });// change detalle

  $("#idfuncion").change(function(){
    var id_funcion_g = $('#idfuncion').val();
    var id_detalle_g = $('#iddetalle').val();
    if(id_funcion_g==0){
      $("#iddetalle").empty();
      $("#iddetalle").append("<option value='0'>- Seleccione función -</option>");
      deshabilita_reinicia();
      return;
    }
    if(id_funcion_g==4 && id_detalle_g==30 || (id_detalle_g == 32 && id_funcion_g==11)){ // horas
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
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(res){
        $("#wait").modal("hide");
          $("#iddetalle").empty();
          $("#iddetalle").append(res.str_view);
          // for(var i=0; i<num_detalles; i++){
          //   var item = res[i];
          //   var id_detalle = item['iddetalle'];
          //   var detalle = item['detalle'];
          //   var opcion = $("<option>", {value:id_detalle});
          //   opcion.append(detalle);
          //   $("#iddetalle").append(opcion);
          // }

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


});// document.ready
