$(document).ready(function () {
obj_capOfer = new CapacidadOferta();
obj_grid = new Grid("div_preinscripciones_datos_cap");
idelementoeditando_capacidad = "";
});

$("#btn_capacidadO_limpiarcct").click(function(){
  $("#itxt_capacidadO_cct").val("");
});

$("#btn_capacidadO_quitarfiltrosform").click(function(event) {
  $("#form_capacidadOcentral")[0].reset();
});

$("#slt_capacidadO_municipio").change(function(){
  $("#itxt_capacidadO_cct").val("");
  if($("#slt_capacidadO_municipio").val() != 0){
    obj_capOfer.get_localidades($("#slt_capacidadO_municipio").val());
  }else{
    alert("Seleccione un municipio");
  }
});

$("#slt_capacidadO_nivel").change(function(){
  $("#itxt_capacidadO_cct").val("");
  if($("#slt_capacidadO_nivel").val() != 0){
    $("#slt_capacidadO_municipio").attr("disabled",false);
  }else{
    $("#slt_capacidadO_municipio").attr("disabled",true);
  }

});

$("#slt_capacidadO_zona").change(function(){
  $("#itxt_capacidadO_cct").val("");
})

$("#btn_capacidadO_buscarcct").click(function(e){
    e.preventDefault();
    e.stopImmediatePropagation(); // evita que se ejecute 2 veces el evento

    $("#itxt_preinscripciones_cct").val("");
    obj_capOfer.get_view_buscadorcct();
});

$("#btn_capacidadO_busquedacap").click(function(){
  obj_capOfer.validacampos();
});

$("#btn_confCapacidad_confirmar").click(function(){
  obj_capOfer.confirmarcapacidad(var_valor_update_capinst);
});

$("#btn_confCapacidad_cancelar").click(function(){
  $("#modalconfirmacioncapacidad").modal('hide');
});


function CapacidadOferta(){
   _this = this;

 }

CapacidadOferta.prototype.get_localidades = function(idmunicipio) {
    $.ajax({
        url: base_url+"CapacidadOfer/get_localidades_xidmunicipio",
        data:"idmunicipio="+idmunicipio,
        type:'POST',
        beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
        success: function(result){
          $("#wait").modal("hide");
          $("#slt_capacidadO_zona").empty();
          $("#slt_capacidadO_zona").append(result.str_localidades);
        },
        error:function(xhr){
          $("#wait").modal("hide");
          console.error(xhr.status + ": " + xhr.responseText);
        }
      });
  }

  CapacidadOferta.prototype.get_view_buscadorcct = function(){
    $.ajax({
      url:base_url+"Buscadorcctinsc/get_view_buscadorcct",
      method:"POST",
      data:{
          "idnivel" : $("#slt_capacidadO_nivel").val(),
          "idregion" : 0,
          "idmunicipio" : $("#slt_capacidadO_municipio").val(),
          "idzona" : $("#slt_capacidadO_zona").val()
        },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");


        $("#div_preinscripciones_buscadorcct").empty();
        $("#div_preinscripciones_buscadorcct").append(data.str_view);

        obj_bcct = null;

        obj_bcct = new Buscadorcct("div_preinscripciones_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
        obj_bcct.init();

        document.getElementById('div_preinscripciones_buscadorcct').addEventListener('cct_seleccionada', obj_capOfer.alimenta_campo_cct, false);
        document.getElementById('div_preinscripciones_buscadorcct').addEventListener('event_salir_buscador', obj_capOfer.destruye_buscadorcct, false);
      },
      error: function(error){
        console.log(error);
      }
    });
  }

  CapacidadOferta.prototype.alimenta_campo_cct = function(){
    var cct = obj_bcct.get_cct();
    $("#itxt_capacidadO_cct").val("");
    $("#itxt_capacidadO_cct").val(cct);

    obj_bcct = null;
  }

  CapacidadOferta.prototype.destruye_buscadorcct = function(){
    obj_bcct = null;
  }

  CapacidadOferta.prototype.get_capacidades = function(){
    $.ajax({
      url:base_url+"CapacidadOfer/get_capacidadesxcct",
      method:"POST",
      data:{
          "idnivel" : $("#slt_capacidadO_nivel").val(),
          "idmunicipio" : $("#slt_capacidadO_municipio").val(),
          "idzona" : $("#slt_capacidadO_zona").val(),
          "cct" : $("#itxt_capacidadO_cct").val(),
        },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        $("#div_preinscripciones_datos_cap").empty();
        $("#div_preinscripciones_datos_cap").append(data.str_grid);

      },
      error: function(error){
        console.log(error);
      }
    });
  }

  CapacidadOferta.prototype.validacampos = function(){
    if($("#slt_capacidadO_nivel").val() == '0'){
      bootbox.alert({
      message: "<b>Seleccione un nivel</b>", size: 'small'
      });
    }else{
      if($("#slt_capacidadO_municipio").val() == '0'){
        bootbox.alert({
        message: "<b>seleccione un municipio</b>", size: 'small'
        });
      }else{
        obj_capOfer.get_capacidades();
      }
    }
  }

  function grabarCapIns(valor){
    $("#modalconfirmacioncapacidad").modal('show');
    var_valor_update_capinst = valor;
  }

  CapacidadOferta.prototype.confirmarcapacidad = function(valor){
    var res = valor.split("-");
    if(res[1] == '1'){
      obj_capOfer.setCapInspree(res[0], res[1]);
    }else{
      var idcapinstalada = res[0]+"_inputcapa_oferta1o";
      var valor = $("#"+idcapinstalada).val();
      obj_capOfer.setCapInsprimsec(res[0], res[1], valor);

    }
  }

  CapacidadOferta.prototype.setCapInsprimsec = function(cct, nivel, nuevovalor){
    $.ajax({
      url:base_url+"CapacidadOfer/setCapasidad",
      method:"POST",
      data:{
          "cct" : cct,
          "nivel" : nivel,
          "tamanio" : nuevovalor
        },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        if(data.update == 1){
          alert(data.mensaje);
          var_valor_update_capinst = "";
          $("#modalconfirmacioncapacidad").modal('hide');
          $("#"+cct+"_inputcapa_oferta1o").addClass("actualizadosg");
        }else{
          alert("Algo salio mal");
          var_valor_update_capinst = "";
          $("#modalconfirmacioncapacidad").modal('hide');
          $("#"+cct+"_inputcapa_oferta1o").addClass("actualizadosbad");
        }

      },
      error: function(error){
        console.log(error);
        $("#"+cct+"_inputcapa_oferta1o").addClass("actualizadosbad");
      }
    });
  }

  CapacidadOferta.prototype.setCapInspree = function(cct, nivel){
    var idelementoferta = idelementoeditando_capacidad;
    var oferta = idelementoeditando_capacidad.split("_");
    $.ajax({
      url:base_url+"CapacidadOfer/setCapasidad",
      method:"POST",
      data:{
          "cct" : cct,
          "nivel" : nivel,
          "oferta_updtae" : oferta[2],
          "valor": $("#"+idelementoferta).val()
        },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        if(data.update == 1){
          alert(data.mensaje);
          var_valor_update_capinst = "";
          $("#modalconfirmacioncapacidad").modal('hide');
          idelementoeditando_capacidad = "";
          $("#"+idelementoferta).addClass("actualizadosg");
        }else{
          alert("Algo salio mal");
          var_valor_update_capinst = "";
          $("#modalconfirmacioncapacidad").modal('hide');
          $("#"+cct+"_inputcapa_oferta1o").addClass("actualizadosbad");
        }

      },
      error: function(error){
        $("#"+cct+"_inputcapa_oferta1o").addClass("actualizadosbad");
        console.log(error);
      }
    });
  }

  function get_gridpaginador(offset){
    obj_grid.get_gridpaginador(offset, "CapacidadOfer", "get_capacidadesxcct","form_capacidadOcentral");
}// setCapInspree()

function obtener_id(idelementomovido){
  idelementoeditando_capacidad = idelementomovido;
}

function revisaexcedente(cct, vthis){
  if( $(vthis).is(':checked') ){
      // Hacer algo si el checkbox ha sido seleccionado
      obj_capOfer.setexcedente(cct, 1);
  } else {
      // Hacer algo si el checkbox ha sido deseleccionado
      obj_capOfer.setexcedente(cct, 0);
  }
}


CapacidadOferta.prototype.setexcedente = function(cct, valor){
    $.ajax({
      url:base_url+"CapacidadOfer/setexcedente",
      method:"POST",
      data:{
          "cct" : cct,
          "valor" : valor,
        },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        if(data.update == 1){
          alert(data.mensaje);
        }else{
          alert("Algo salio mal");
        }

      },
      error: function(error){
        $("#"+cct+"_inputcapa_oferta1o").addClass("actualizadosbad");
        console.log(error);
      }
    });
  }
