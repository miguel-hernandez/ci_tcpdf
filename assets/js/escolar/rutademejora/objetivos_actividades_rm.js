  $(document).ready(function () {
    $('.tooltip').not(this).hide();
     $('[data-toggle="tooltip"]').tooltip();
  obj_grid_act = new Grid("div_rmejoraactiv_grid"); // Objeto de acceso global para usarlo con clicks btn
  // $("#ruta_notifications").empty();
  obj_notifications_modal = new Notifications("ruta_notifications_modal_editar");
  ractobj = new Ractividadesobj();
  $('.selectpicker').selectpicker();
    $("#cerrar_le_modal_objs_acts").click(function(){
      $('#le_modal_objs_acts').modal('toggle');
      if ($('#es_supervicor').val()=='si') {
        $('#btn_mostrar_rutas_supervisor').trigger("click");
      }
      else {
        $.ajax({
                url:base_url+"rutademejora/get_grid",
                method:"POST",
                data:{"idrutamtema":"nada"},
                beforeSend: function(xhr) {
                  $("#wait").modal("show");
                },
                success:function(data){
                    var tabla = data.tabla;
                    $("#wait").modal("hide");
                    obj_grid = new Grid("grid_rutamejora");
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
                    ruta.get_identidad();
                    ruta.inicio();
                },
                error: function(error){
                  console.log(error);
                }
            });
        $("#le_modal_objs_acts").modal("hide");
      }
     });

     $("#btn_rm_regresarrm").click(function(){
       $("#cerrar_le_modal_objs_acts").click();
      });
  aux_editar=0;
  });

  $("#btn_rm_agreact").click(function (e) {
  	e.preventDefault();
    var txtactivids = $("#txt_rm_actividades").val();
    var txtrecursos = $("#txt_rm_recursos").val();
    var slcambito = $("#slc_rm_ambito").val();
    var slcfini = $("#slc_rm_fini").val();
    var slcffin = $("#slc_rm_ffin").val();
    var slcresponsable = $("#slc_rm_respnsables").val();
    var slcavance = $("#slc_rm_pavance").val();
    var id_rmtema= $("#txt_inp_idtema").val();
    ractobj.valida_form();
  });

  $("#btn_rm_editact").click(function (e) {
  	e.preventDefault();
  	var arr_row = obj_grid_act.get_row_selected();
  	var datos = arr_row[0];
    if( datos != null && datos["idactividad"] > 0){
      idactividad = datos["idactividad"];
      ractobj.getrmactividadupdate(datos["idrutamtema"], datos["idactividad"]);
      $('#btn_rm_editact').css("display","none");
      $('#btn_rm_elimact').css("display","none");
  }else{
    /*
    bootbox.alert({
      message: "<br><b>Seleccione un registro para editar</b>",
      size: 'small'
    });
    */
      Helpers.alert("Seleccione un registro para editar", "error");
    }
  });

  $("#btn_rm_grabarrm").click(function(){
    $.ajax({
            url:base_url+"rutademejora/update_obj_meta",
            method:"POST",
            data:{"txt_rm_obs":$("#txt_rm_obs").val(),"objetivo":$("#txt_rm_objetivo").val(), "meta":$("#txt_rm_meta").val(), "idupdate": $("#txt_inp_idtema").val()},
            success:function(data){
              alert("Actualizado");
            },
            error: function(error){
              console.log(error);
            }
        });
  });

  function Ractividadesobj(){
     _this = this;
   }


   $("#btn_rm_elimact").click(function (e) {
   	e.preventDefault();
   	var arr_row = obj_grid_act.get_row_selected();
   	var datos = arr_row[0];
     if( datos != null && datos["idactividad"] > 0){
       idactividad = datos["idactividad"];
       obj_notifications_modal = new Notifications("ruta_notifications_modal_editar");
       obj_notifications_modal.get_notification("dialog","¿Desea eliminar "+datos['descripcion']+"?");
   	   document.getElementById('ruta_notifications_modal_editar').addEventListener('confirmar',f_confirmar,false);
       document.getElementById('ruta_notifications_modal_editar').addEventListener('confirmcancel',f_confirmarcancel,false);
     }else{
       /*
       bootbox.alert({
            message: "<br><b>Seleccione un registro para eliminar</b>",
            size: 'small'
          });
        */
        Helpers.alert("Seleccione un registro para eliminar", "error");
      }
   });

   function f_confirmar(){
     var arr_row = obj_grid_act.get_row_selected();
    	var datos = arr_row[0];
     ractobj.delrmactividad(datos["idrutamtema"], datos["idactividad"]);
   }

   function f_confirmarcancel(){
     //cancelo eliminacion
   }


  Ractividadesobj.prototype.insertarmactividad = function(id_rmtema, txtactivids, txtrecursos, slcambito, slcfini, slcffin, slcresponsable, slcavance){
  	$.ajax({
            url:base_url+"rutademejora/insertarmactividad",
            method:"POST",
            data:{"id_rmtema":id_rmtema, "txtactivids":txtactivids, "txtrecursos":txtrecursos,
            "slcambito":slcambito, "slcfini":slcfini, "slcffin":slcffin, "slcresponsable":slcresponsable, "slcavance":slcavance},
            beforeSend: function(xhr) {
            },
            success:function(data){
              var tabla = data.tabla;
              var estatus = data.estatus;
              if (estatus) {
                /*
                bootbox.alert({
                  message: "<br><b>Se agregó actividad correctamente</b>",
                  size: 'small'
                  });
                  */
                  Helpers.alert("Actividad agregada correctamente", "success");
              }
              else {
                /*
                bootbox.alert({
                  message: "<br><b>No agregó actividad correctamente</b>",
                  size: 'small'
                  });
                  */
                  Helpers.alert("Ocurrió un error, reintente por favor", "error");
                }
              $("#div_rmejoraactiv_grid").empty();
              $("#div_rmejoraactiv_grid").append(tabla);
              $("#txt_rm_actividades").val('');//new all
              $("#txt_rm_recursos").val('');
              $("#slc_rm_ambito").prop('selectedIndex',0);
              $("#slc_rm_fini").val('');
              $("#slc_rm_ffin").val('');
              $("#slc_rm_respnsables").selectpicker('deselectAll');
              $("#slc_rm_pavance").prop('selectedIndex',0);
              obj_grid_act.unselect();
            },
            error: function(error){
              console.log(error);
            }
        });
  }

  Ractividadesobj.prototype.getrmactividadupdate = function(id_rmtema, idrmact){
  	$.ajax({
            url:base_url+"rutademejora/getrmactividadupdate",
            method:"POST",
            data:{"id_rmtema":id_rmtema, "idrmact":idrmact},
            beforeSend: function(xhr) {
            },
            success:function(data){
              var arr_acts=data.arr_acts;
              console.info(arr_acts);
              aux_editar=1;
              $("#btn_rm_agreact").html('Actualizar actividad');
              $("#txt_rm_objetivo").val(arr_acts['objetivo']);
              $("#txt_rm_meta").val(arr_acts['meta']);
              $("#txt_rm_actividades").val(arr_acts['descripcion']);
              $("#slc_rm_ambito").val(arr_acts['idambito']);
              $("#slc_rm_fini").val(arr_acts['finicio']);
              $("#slc_rm_ffin").val(arr_acts['ffin']);
              $("#txt_rm_recursos").val(arr_acts['recursos']);
              ractobj.set_responsables(arr_acts['ids_personal']);
              $("#slc_rm_pavance").val(arr_acts['avance']);

            },
            error: function(error){
              console.log(error);
            }
        });
  }

  Ractividadesobj.prototype.updatermactividad = function(idactividad,id_rmtema, txtactivids, txtrecursos, slcambito, slcfini, slcffin, slcresponsable, slcavance){
  	$.ajax({
            url:base_url+"rutademejora/updatermactividad",
            method:"POST",
            data:{"idactividad":idactividad,"id_rmtema":id_rmtema, "txtactivids":txtactivids, "txtrecursos":txtrecursos,
            "slcambito":slcambito, "slcfini":slcfini, "slcffin":slcffin, "slcresponsable":slcresponsable, "slcavance":slcavance},
            beforeSend: function(xhr) {
            },
            success:function(data){
              var tabla = data.tabla;
              var estatus = data.estatus;
              if (estatus) {
                /*
                bootbox.alert({
                  message: "<br><b>Se actualizó la actividad correctamente</b>",
                  size: 'small'
                });
                */
                Helpers.alert("Actividad actualizada correctamente", "success");
                }
              else {
                /*
                bootbox.alert({
                  message: "<br><b>No se actualizó la agrego actividad correctamente</b>",
                  size: 'small'
                });
                */
                  Helpers.alert("Ocurrió un error, reintente por favor", "error");
              }
              $("#div_rmejoraactiv_grid").empty();
              $("#div_rmejoraactiv_grid").append(tabla);
              $("#txt_rm_actividades").val('');//new all
              $("#txt_rm_recursos").val('');
              $("#slc_rm_ambito").prop('selectedIndex',0);
              $("#slc_rm_fini").val('');
              $("#slc_rm_ffin").val('');
              $("#slc_rm_respnsables").selectpicker('deselectAll');
              $("#slc_rm_pavance").prop('selectedIndex',0);
              obj_grid_act.unselect();
              $('#btn_rm_editact').css("display","");
              $('#btn_rm_elimact').css("display","");
            },
            error: function(error){
              console.log(error);
            }
        });
  }

  Ractividadesobj.prototype.delrmactividad = function(id_rmtema, idrmact){
  	$.ajax({
            url:base_url+"rutademejora/delrmactividad",
            method:"POST",
            data:{"id_rmtema":id_rmtema, "idrmact":idrmact},
            beforeSend: function(xhr) {
            },
            success:function(data){
              var tabla = data.tabla;
              var estatus = data.estatus;
              if (estatus) {
                /*
                bootbox.alert({
                  message: "<br><b>Se eliminó la actividad correctamente</b>",
                  size: 'small'
                });
                */
                Helpers.alert("Actividad eliminada correctamente", "success");
              }
              else {
                /*
                bootbox.alert({
                  message: "<br><b>No eliminó la actividad correctamente</b>",
                  size: 'small'
                });
                */
                Helpers.alert("Ocurrió un error, reintente por favor", "error");
                }
              $("#div_rmejoraactiv_grid").empty();
              $("#div_rmejoraactiv_grid").append(tabla);
              obj_grid_act.unselect();
            },
            error: function(error){
              console.log(error);
            }
        });
  }

  Ractividadesobj.prototype.valida_form = function(){
    var txtactivids = $("#txt_rm_actividades").val();
    var txtrecursos = $("#txt_rm_recursos").val();
    var slcambito = $("#slc_rm_ambito").val();
    var slcfini = $("#slc_rm_fini").val();
    var slcffin = $("#slc_rm_ffin").val();
    var slcresponsable = $("#slc_rm_respnsables").val();
    var slcavance = $("#slc_rm_pavance").val();
    var id_rmtema= $("#txt_inp_idtema").val();

      if(txtactivids == ""){
        /*
        bootbox.alert({
          message: "<br><b>Escriba actividades</b>",
          size: 'small'
        });
        */
        Helpers.alert("Ingrese actividades", "error");
      }else{
        if(txtrecursos == ""){
          /*
          bootbox.alert({
            message: "<br><b>Escriba recursos</b>",
            size: 'small'
          });
          */
          Helpers.alert("Ingrese recursos", "error");
        }else{
          if(slcambito == "0"){
            /*
            bootbox.alert({
              message: "<br><b>Seleccione ámbito</b>",
              size: 'small'
            });
            */
            Helpers.alert("Seleccione ámbito", "error");
        }else{
          if(slcresponsable == null){
            /*
            bootbox.alert({
              message: "<br><b>Seleccione al menos un responsable</b>",
              size: 'small'
            });
            */
            Helpers.alert("Seleccione al menos un responsable", "error");
            }else{
            if(slcfini == ""){
              /*
              bootbox.alert({
                message: "<br><b>Seleccione fecha inicio</b>",
                size: 'small'
              });
              */
              Helpers.alert("Seleccione fecha inicio", "error");
            }else{
              if(slcffin == ""){
                /*
                bootbox.alert({
                  message: "<br><b>Seleccione fecha fin</b>",
                  size: 'small'
                });
                */
                Helpers.alert("Seleccione fecha fin", "error");
                }else{
                if(slcavance == "0"){
                  /*
                  bootbox.alert({
                    message: "<br><b>Seleccione avance</b>",
                    size: 'small'
                  });
                  */
                  Helpers.alert("Seleccione avance", "error");
                }else{
                  if (aux_editar==1) {
                    ractobj.updatermactividad(idactividad,id_rmtema, txtactivids, txtrecursos, slcambito, slcfini, slcffin, slcresponsable, slcavance);
                    aux_editar=0;
                    $("#btn_rm_agreact").html('Agregar actividad');
                  }
                  else {
                      ractobj.insertarmactividad(id_rmtema, txtactivids, txtrecursos, slcambito, slcfini, slcffin, slcresponsable, slcavance);
                      aux_editar=0;
                      $("#btn_rm_agreact").html('Agregar actividad');
                    }

                }
              }
            }
          }
        }
        }
      }
  }// valida_form()

  $("#slc_rm_respnsables").change(function(){
   var texto="";
   $("#slc_rm_respnsables option:selected").each(function() {
     texto += $(this).val() + ",";
   });
   textoeutilizadas = texto.split(",");
   var i = textoeutilizadas.indexOf("");
     textoeutilizadas.splice( i, 1 );
  });

  Ractividadesobj.prototype.set_responsables = function(arr_responsables){
    $("#slc_rm_respnsables").selectpicker('deselectAll');

    elem = document.getElementById("slc_rm_respnsables").options;
    for(i=0;i<elem.length;i++){
       var val = elem[i].value;
       if(arr_responsables.indexOf(val)>=0){ // Regresa -1 cuando no encuentra la posición
         elem[i].selected=true;
       }
       else{
         // nada...
       }
    }
    $("#slc_rm_respnsables").selectpicker("refresh");
  };

  $("#slc_rm_fini").change(function (e) {
   e.preventDefault();
   $("#slc_rm_ffin").prop("min",$("#slc_rm_fini").val() );
  });

  $("#slc_rm_ffin").change(function (e) {
   e.preventDefault();
   $("#slc_rm_fini").prop("max",$("#slc_rm_ffin").val() );
  });
