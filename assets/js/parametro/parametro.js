// get_gridpaginador(6)
function get_gridpaginador(offset){
  if (obj_grid_ofreg==null) {
    obj_grid_firmantes.get_gridpaginador(offset, "Parametro", "get_grid_firmantes","");
  }
  else {
    obj_grid_ofreg.get_gridpaginador(offset, "Parametro", "get_grid","");
  }
}

$(document).ready(function () {
  // obj_grid_ofreg = new Grid("grid_parametro");
  // obj_grid_firmantes = new Grid("grid_parametro_firmantes");
  obj_parametro = new Parametro();
  obj_notification = new Notification("parametro_notifications");
  obj_re = new Regularexpression();
  obj_notification.dismissible();
  obj_parametro.vamos_por_registros();
  $("#form_parametro_oficinaregional").hide();
  $("#form_parametro_firmante").hide();
});

$(document).on("click", "#grid_parametro tbody tr", function(e) {
  $("#grid_parametro tbody tr").each(function () {
    $(this).css( {"background-color": "white", "font-size": "14px"} );
  });
});
$(document).on("click", "#grid_parametro tbody tr", function(e) {
  $("#grid_parametro_firmantes tbody tr").each(function () {
    $(this).css( {"background-color": "white", "font-size": "14px"} );
  });
});


$("#btn_parametros_grabar1").click(function(e){
  e.preventDefault();
  var iniciociclo = $("#itxt_parametro_iniciociclo").val();
  var edadinscripcion = $("#itxt_parametro_edadinscripcion").val();
  var estado_iniciociclo = $("#ichk_estado_iniciociclo").prop('checked');
  var estado_finciociclo = $("#ichk_estado_finciociclo").prop('checked');
  var finiperiini = $("#itxt_finiperiini").val();
  var ffinperiini = $("#itxt_ffinperiini").val();
  var finiperifin = $("#itxt_finiperifin").val();
  var ffinperifin = $("#itxt_ffinperifin").val();

  obj_parametro.grabar1(iniciociclo,edadinscripcion,(estado_iniciociclo?"1":"0"),(estado_finciociclo?"1":"0"),finiperiini,ffinperiini,finiperifin,ffinperifin);
});

$("#btn_parametros_grabar2").click(function(e){
  e.preventDefault();
  var minimapree = $("#slc_parametro_edadminimapree").val();
  var maximapree = $("#slc_parametro_edadmaximapree").val();
  var mom1pree = $("#itxt_parametro_mom1").val();
  var mom2pree = $("#itxt_parametro_mom2").val();
  var mom3pree = $("#itxt_parametro_mom3").val();

  if(mom1pree==""){
    obj_notification.error("Seleccione una fecha de corte del momento 1");
  }else{
    if(mom2pree==""){
      obj_notification.error("Seleccione una fecha de corte del momento 2");
    }
    else{
      if(mom3pree==""){
        obj_notification.error("Seleccione una fecha de corte del momento 3");
      }else{

        if(minimapree>maximapree){
          obj_notification.error("La edad mínima de inscripción no puede ser mayor a la edad máxima");
        }
        else{
          obj_parametro.grabar2(minimapree,maximapree,mom1pree,mom2pree,mom3pree);
        }

      }
    }
  }
});

$("#btn_parametros_grabar3").click(function(e){
  e.preventDefault();
  var opcion_prim = "prim";
  if(obj_parametro.valida_form_prim_sec(opcion_prim)){
    obj_parametro.grabar3(opcion_prim);
  }
});

$("#btn_parametros_grabar4").click(function(e){
  e.preventDefault();
  obj_notification.dismissible();
  var opcion_prim = "sec";
  if(obj_parametro.valida_form_prim_sec(opcion_prim)){
    obj_parametro.grabar3(opcion_prim);
  }
});

$("#btn_parametro_ofregionaleditar").click(function(e){
  e.preventDefault();
  obj_notification.dismissible();
  var arr_row = obj_grid_ofreg.get_row_selected();
  if(arr_row.length==0){
    obj_notification.error("Seleccione un registro");
  }else{
    // alert("Editar idregion: "+arr_row[0]['idregion']);
    obj_parametro.get_datos_region(arr_row[0]['idregion']);
  }

});


$("#btn_parametros_grabar6").click(function(e){
  e.preventDefault();
  obj_parametro.grabar6();

});

$("#btn_parametro_firmanteseditar").click(function(e){
  e.preventDefault();
  obj_notification.dismissible();
  $('#form_parametro_firmante')[0].reset();
  $("#form_parametro_firmante").hide();
  var arr_row = obj_grid_firmantes.get_row_selected();
  if(arr_row.length==0){
    obj_notification.error("Seleccione un registro");
  }else{
    obj_parametro.get_datos_firmante(arr_row[0]['idfirmante']);
  }
});

$("#btn_parametro_firmantesagregar").click(function(e){
  e.preventDefault();
  obj_notification.dismissible();
  obj_grid_firmantes.init();
  $('#form_parametro_firmante')[0].reset();
  $("#itxt_parametro_firmanteid").val(0)
  $("#form_parametro_firmante").show();
});

$("#btn_parametros_grabar5").click(function(e){
    e.preventDefault();
    var nombre = $("#itxt_parametro_firmantenombre").val();
    var apell1 = $("#itxt_parametro_firmanteapell1").val();
    var apell2 = $("#itxt_parametro_firmanteapell2").val();
    var curp = $("#itxt_parametro_firmantecurp").val();
    var cargo = $("#itxt_parametro_firmantecargo").val();
    var fileasociado = $("#itxt_parametro_firmantefileasociado").val();
    var status = $("#slc_parametro_firmantestatus").val();
    if(nombre==""){
      obj_notification.error("Ingrese el nombre");
    }else{
      if(apell1==""){
        obj_notification.error("Ingrese el apellido 1");
      }else{
        // if(apell2==""){
        //   obj_notification.error("Ingrese el apellido materno");
        // }else{
          if(curp==""){
            obj_notification.error("Ingrese CURP");
          }else{
            if(!obj_re.curp(curp)){
              obj_notification.error("Ingrese CURP válida");
            }else{
              if(cargo==""){
                obj_notification.error("Ingrese el cargo");
              }else{
                if(fileasociado==""){
                  obj_notification.error("Ingrese el nombre del archivo asociado");
                }else{
                  if(status==0){
                    obj_notification.error("Seleccione un estatus");
                  }else{
                    obj_parametro.grabar5();
                  }
                }
              }
            }
          }
        // }
      }
    }
});


$("#btn_parametro_firmanteseliminar").click(function(e){
  e.preventDefault();
  $('#form_parametro_firmante')[0].reset();
  $("#form_parametro_firmante").hide();
  var arr_row = obj_grid_firmantes.get_row_selected();
  if(arr_row.length==0){
    obj_notification.error("Seleccione un registro");
  }else{
    obj_notification.dismissible();
    bootbox.confirm({
        message: "¿Eliminar "+arr_row[0]['firmante_nombre']+"?",
        buttons: {
            confirm: {
                label: 'Eliminar',
                className: 'btn-primary'
            },
            cancel: {
                label: 'Cancelar',
                className: 'btn-default'
            }
        },
        callback: function (result) {
          if(result){
              obj_parametro.delete(arr_row[0]['idfirmante']);

          }else{
            obj_notification.dismissible();
          }
        }
    });

  }
});

$("#itxt_finiperiini").change(function(e){
  e.preventDefault();
  var fecha = new Date($('#itxt_finiperiini').val());
  var dias = 120; // Número de días a agregar
  fecha.setDate(fecha.getDate() + dias);
  //alert((fecha.getFullYear() + '-0' + (fecha.getMonth() + 1) + '-0' + fecha.getDate()).replace(/-0(\d\d)/g, '-$1'));
  $("#itxt_ffinperiini").prop('min',$("#itxt_finiperiini").val());
  $("#itxt_ffinperiini").prop('max',(fecha.getFullYear() + '-0' + (fecha.getMonth() + 1) + '-0' + fecha.getDate()).replace(/-0(\d\d)/g, '-$1'));
});

$("#itxt_ffinperiini").change(function(e){
  e.preventDefault();
  var fecha = new Date($('#itxt_ffinperiini').val());
  var dias = 120; // Número de días a agregar
  fecha.setDate(fecha.getDate() + dias);
  $("#itxt_finiperifin").prop('min',$("#itxt_ffinperiini").val());
  $("#itxt_finiperifin").prop('max',(fecha.getFullYear() + '-0' + (fecha.getMonth() + 1) + '-0' + fecha.getDate()).replace(/-0(\d\d)/g, '-$1'));
});

$("#itxt_finiperifin").change(function(e){
  e.preventDefault();
  var fecha = new Date($('#itxt_finiperifin').val());
  var dias = 90; // Número de días a agregar
  fecha.setDate(fecha.getDate() + dias);
  $("#itxt_ffinperifin").prop('min',$("#itxt_finiperifin").val());
  $("#itxt_ffinperifin").prop('max',(fecha.getFullYear() + '-0' + (fecha.getMonth() + 1) + '-0' + fecha.getDate()).replace(/-0(\d\d)/g, '-$1'));
});

$("#ichk_estado_iniciociclo").change(function(e){
  e.preventDefault();
  if ($("#ichk_estado_iniciociclo").prop('checked')) {
    $("#fs_corteini").prop('disabled', false);
  }
  else {
    $("#fs_corteini").prop('disabled', true);
  }
  ;
});

$("#ichk_estado_finciociclo").change(function(e){
  e.preventDefault();
  if ($("#ichk_estado_finciociclo").prop('checked')) {
    $("#fs_cortefin").prop('disabled', false);
  }
  else {
    $("#fs_cortefin").prop('disabled', true);
  }
});


function Parametro(){
  _this = this;
}

Parametro.prototype.get_grid = function (offset){
		obj_grid_ofreg.get_gridpaginador(offset, "Parametro", "get_grid","");
	//	$("#div_btns_grid").show();
};

Parametro.prototype.get_grid_firm = function (offset){
		obj_grid_firmantes.get_gridpaginador(offset, "Parametro", "get_grid_firmantes","");
	//	$("#div_btns_grid").show();
};

Parametro.prototype.grabar1 = function(iniciociclo,edadinscripcion,estado_iniciociclo,estado_finciociclo,finiperiini,ffinperiini,finiperifin,ffinperifin){
  obj_notification.dismissible();
  $.ajax({
    url:base_url+"Parametro/update1",
    method:"POST",
    data:{"iniciociclo":iniciociclo, "edadinscripcion":edadinscripcion, "estado_iniciociclo":estado_iniciociclo, "estado_finciociclo":estado_finciociclo,
  "finiperiini":finiperiini,"ffinperiini":ffinperiini,"finiperifin":finiperifin,"ffinperifin":ffinperifin},
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      if(data.result == 1){
        obj_notification.success("Datos guardados correctamente");
      }
    },
    error: function(error){
      // console.log(error);
    }
  });
};

Parametro.prototype.grabar2 = function(minimapree,maximapree,mom1pree,mom2pree,mom3pree){
  obj_notification.dismissible();
  $.ajax({
    url:base_url+"Parametro/update2",
    method:"POST",
    data:{"minimapree":minimapree,"maximapree":maximapree,"mom1pree":mom1pree,"mom2pree":mom2pree,"mom3pree":mom3pree},
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      if(data.result == 1){
        obj_notification.success("Datos guardados correctamente");
      }
    },
    error: function(error){
      // console.log(error);
    }
  });
};

Parametro.prototype.grabar3 = function(opcion){
  obj_notification.dismissible();
  var datos = $("#form_parametro_"+opcion).serialize() + "&opcion="+opcion;
  $.ajax({
    url:base_url+"Parametro/update3",
    method:"POST",
    data: datos,
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      if(data.result == 1){
        obj_notification.success("Datos guardados correctamente");
      }
    },
    error: function(error){
      // console.log(error);
    }
  });
};

Parametro.prototype.valida_form_prim_sec = function(opcion){
  // Edades
  var minima_nivel = $("#slc_parametro_edadminima"+opcion).val();
  var maxima_nivel = $("#slc_parametro_edadmaxima"+opcion).val();
  // certificados
  var fexpcerts_nivel = $("#itxt_parametro_fexpcerts_"+opcion).val();
  var texpcerts_nivel = $("#itxt_parametro_texpcerts_"+opcion).val();
  var fexpcerts_hist_nivel = $("#itxt_parametro_fexpcerts_hist_"+opcion).val();
  var texpcerts_hist_nivel = $("#itxt_parametro_texpcerts_hist_"+opcion).val();
  // Bimestres
  var bim1_nivel = $("#itxt_parametro_bim1_"+opcion).val();
  var bim2_nivel = $("#itxt_parametro_bim2_"+opcion).val();
  var bim3_nivel = $("#itxt_parametro_bim3_"+opcion).val();
  var bim4_nivel = $("#itxt_parametro_bim4_"+opcion).val();
  var bim5_nivel = $("#itxt_parametro_bim5_"+opcion).val();

  if(fexpcerts_nivel==""){
    obj_notification.error("Seleccione una Fecha de expedición de certificados");
    return false;
  }else{
    if(texpcerts_nivel==""){
      obj_notification.error("Ingrese el texto de expedición de certificados");
      return false;
    }
    else{
      if(fexpcerts_hist_nivel==""){
        obj_notification.error("Seleccione una Fecha de expedición de certificados históricos");
        return false;
      }else{
        if(texpcerts_hist_nivel==""){
          obj_notification.error("Ingrese el texto de expedición de certificados históricos");
          return false;
        }else{
          if(bim1_nivel==""){
            obj_notification.error("Seleccione fecha de corte para el bimestre 1");
            return false;
          }else{
            if(bim2_nivel==""){
              obj_notification.error("Seleccione fecha de corte para el bimestre 2");
              return false;
            }else{
              if(bim3_nivel==""){
                obj_notification.error("Seleccione fecha de corte para el bimestre 3");
                return false;
              }else{
                if(bim4_nivel==""){
                  obj_notification.error("Seleccione fecha de corte para el bimestre 4");
                  return false;
                }else{
                  if(bim5_nivel==""){
                    obj_notification.error("Seleccione fecha de corte para el bimestre 5");
                    return false;
                  }else{
                    if(obj_parametro.valida_fechas_bimestres(bim1_nivel,bim2_nivel,bim3_nivel,bim4_nivel,bim5_nivel)){
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

Parametro.prototype.valida_fechas_bimestres = function(b1,b2,b3,b4,b5){
  if( b1>b2 || b1>b3 || b1>b4 || b1>b5){
    obj_notification.error("La fecha de corte para el bimestre 1 no puede ser mayor a las posteriores");
    return false;
  }
  if( b2>b3 || b2>b4 || b2>b5){
    obj_notification.error("La fecha de corte para el bimestre 2 no puede ser mayor a las posteriores");
    return false;
  }
  if( b3>b4 || b3>b5){
    obj_notification.error("La fecha de corte para el bimestre 3 no puede ser mayor a las posteriores");
    return false;
  }
  if( b4>b5){
    obj_notification.error("La fecha de corte para el bimestre 4 no puede ser mayor a las posteriores");
    return false;
  }
  return true;
};

Parametro.prototype.get_datos_region = function(idregion){
  obj_notification.dismissible();
  $.ajax({
    url:base_url+"Parametro/get_datos_region",
    method:"POST",
    data:{"idregion":idregion},
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      var arr_result = data.result;
      // Muestro el form
      $("#form_parametro_oficinaregional").show();
      // Y alimento los inputs
      $("#itxt_parametro_regionid").val();
      $("#itxt_parametro_regionid").val(idregion);

      $("#itxt_parametro_regionnombre").val();
      $("#itxt_parametro_regiondomicilio").val();
      $("#itxt_parametro_responsablenombre").val();
      $("#itxt_parametro_responsablecargo").val();

      $("#itxt_parametro_regionnombre").val(arr_result.region_nombre);
      $("#itxt_parametro_regiondomicilio").val(arr_result.region_domicilio);
      $("#itxt_parametro_responsablenombre").val(arr_result.responsable_nombre);
      $("#itxt_parametro_responsablecargo").val(arr_result.responsable_cargo);

    },
    error: function(error){
      // console.log(error);
    }
  });
};

Parametro.prototype.grabar6 = function(opcion){
  obj_notification.dismissible();
  var datos = $("#form_parametro_oficinaregional").serialize();
  $.ajax({
    url:base_url+"Parametro/update6",
    method:"POST",
    data: datos,
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      if(data.result == 1){
        // Notifico
        obj_notification.success("Datos guardados correctamente");
        // Oculto form
        $("#form_parametro_oficinaregional").hide();
        // Reseteo formulario
        $('#form_parametro_oficinaregional')[0].reset();
        // Actualizo datos del grid
        // obj_parametro.vamos_por_registros();
        obj_parametro.get_grid(0);
      }
      else{
        obj_notification.error("Ocurrió un error, reintente por favor");
      }
    },
    error: function(error){
      // console.log(error);
    }
  });
};

// Parametro.prototype.get_grid = function(opcion){
//   $.ajax({
//     url:base_url+"Parametro/get_grid",
//     method:"POST",
//     data: {},
//     beforeSend: function(xhr) {
//       $("#wait").modal("show");
//     },
//     success:function(data){
//       $("#wait").modal("hide");
//       $("#grid_parametro").empty();
//       $("#grid_parametro").append(data.grid);
//
//     },
//     error: function(error){
//       console.log(error);
//     }
//   });
// };

// FIRMANTES
Parametro.prototype.grabar5 = function(opcion){
  obj_notification.dismissible();
  var datos = $("#form_parametro_firmante").serialize();
  $.ajax({
    url:base_url+"Parametro/update5",
    method:"POST",
    data: datos,
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      if(data.result == 1){
        // Notifico
        var txt="";
        if($("#itxt_parametro_firmanteid").val()==0){
          txt += "guardados";
        }
        else if ($("#itxt_parametro_firmanteid").val()>0) {
          txt += "actualizados";
        }
        obj_notification.success("Datos "+txt+" correctamente");

        // Oculto form
        $("#form_parametro_firmante").hide();
        // Reseteo formulario
        $('#form_parametro_firmante')[0].reset();
        // Actualizo datos del grid
        // obj_grid_firmantes.init()
        // _this.get_grid_firmantes();
        obj_parametro.get_grid_firm(0);
      }
      else{
        obj_notification.error("Ocurrió un error, reintente por favor");
      }
    },
    error: function(error){
      // console.log(error);
    }
  });
};



Parametro.prototype.get_grid_firmantes = function(opcion){
  $.ajax({
    url:base_url+"Parametro/get_grid_firmantes",
    method:"POST",
    data: {},
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      $("#grid_parametro_firmantes").empty();
      $("#grid_parametro_firmantes").append(data.grid);

    },
    error: function(error){
      // console.log(error);
    }
  });
};


Parametro.prototype.get_datos_firmante = function(idfirmante){
  obj_notification.dismissible();
  $.ajax({
    url:base_url+"Parametro/get_datos_firmante",
    method:"POST",
    data:{"idfirmante":idfirmante},
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
      $("#wait").modal("hide");
      var arr_result = data.result;

      // Muestro el form
      $("#form_parametro_firmante").show();
      // Y alimento los inputs
      $("#itxt_parametro_firmanteid").val();
      $("#itxt_parametro_firmanteid").val(idfirmante);

      $("#itxt_parametro_firmantenombre").val();
      $("#itxt_parametro_firmanteapell1").val();
      $("#itxt_parametro_firmanteapell2").val();
      $("#itxt_parametro_firmantecurp").val();
      $("#itxt_parametro_firmantecargo").val();
      $("#itxt_parametro_firmantefileasociado").val();
      $("#slc_parametro_firmantestatus").val();

      $("#itxt_parametro_firmantenombre").val(arr_result.firmante_nombre);
      $("#itxt_parametro_firmanteapell1").val(arr_result.firmante_apell1);
      $("#itxt_parametro_firmanteapell2").val(arr_result.firmante_apell2);
      $("#itxt_parametro_firmantecurp").val(arr_result.firmante_curp);
      $("#itxt_parametro_firmantecargo").val(arr_result.firmante_cargo);
      $("#itxt_parametro_firmantefileasociado").val(arr_result.firmante_fileasociado);
      $("#slc_parametro_firmantestatus").val(arr_result.firmante_estatus);

    },
    error: function(error){
      // console.log(error);
    }
  });
};

Parametro.prototype.delete = function(idfirmante){
  obj_notification.dismissible();
  $.ajax({
    url:base_url+"Parametro/delete",
    method:"POST",
    data: {"idfirmante":idfirmante},
    beforeSend: function(xhr) {
      $("#wait").modal("show");
    },
    success:function(data){
        $("#wait").modal("hide");
        if(data.result == 1){
          obj_notification.success("Eliminado correctamente");
          // obj_grid_firmantes.init()
          // _this.get_grid_firmantes();
          obj_parametro.get_grid_firm(0);
        }else{
          obj_notification.error("Ocurrió un error, reintente por favor");
        }

    },
    error: function(error){
      // console.log(error);
    }
  });
  // alert("eliminar id: "+idfirmante);
};

Parametro.prototype.vamos_por_registros = function(){
  $.ajax({
    url: base_url+'Parametro/baja_datos',
    type: 'POST',
    dataType: 'json',
    data: {},
  })
  .done(function(data) {
    // console.log("success");
    obj_parametro.paginador_full('demo1', data.regiones);
  })
  .fail(function() {
    // console.log("error");
  })
  .always(function() {
    // console.log("complete");
  });
};

Parametro.prototype.paginador_full = function(name, datos){
  var container = $('#pagination-' + name);
    var sources = datos

    var options = {
      dataSource: sources,
      callback: function (response, pagination) {
        // window.console && console.log(response, pagination);

        var dataHtml = '<table class="table table-condensed table-hover  table-bordered">';
        dataHtml += ' <tr class="info">';
        dataHtml += '<th id="idregion" hidden=""><center>ID</center></th>';
    dataHtml +='<th>Corde</th>'
    dataHtml +='<th>Nombre del responsable</th>'
    dataHtml +='<th>Cargo del responsable</th>'
  dataHtml +='</tr>';

        $.each(response, function (index, item) {
          // console.log(item['nombre_region']);
            dataHtml +='<tr>';
            dataHtml +='<td id="idregion" data="'+item['idregion']+'" hidden="">'+ item['idregion'] +'</td>';
              dataHtml +='<td>' + item['nombre_region'] + '</td>';
              dataHtml +='<td>' + item['responsable'] + '</td>';
              dataHtml +='<td>' + item['cargoresp'] + '</td>';
            dataHtml +='</tr>';
          // dataHtml += '<li>' + item + '</li>';
        });

        dataHtml += '</table>';

        container.prev().html(dataHtml);
      }
    };

    //$.pagination(container, options);


};
