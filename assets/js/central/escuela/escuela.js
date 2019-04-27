
$(document).ready(function () {
  /*
   * Primero modifico el ancho de las columnas para los botones
  */
  var padres0 = $('#cct_filtro').parents('div');
  var el_padre0 = padres0[0]; // El primer padre es el div col
  $(el_padre0).addClass("sinmargenes_derecha");
  // $("#cct_").removeClass("btn-primary");
  $('#cct_').addClass("btn-block");
  var padres = $('#cct_').parents('div');
  var el_padre = padres[0];
  var el_padrerow = padres[9];;
  $(el_padre).removeClass("col-sm-3 col-xs-12");
  $(el_padre).addClass("col-xs-6 col-sm-6 col-md-1 col-lg-1 sinmargenes_derecha sinmargenes_izquierda");
  // $("#span_remove_cct").removeClass("btn-primary");
  $('#span_remove_cct').addClass("btn-block");
  var padres2 = $('#span_remove_cct').parents('div');
  var el_padre2 = padres2[0];
  $(el_padre2).removeClass("col-sm-3 col-xs-12");
  $(el_padre2).addClass("col-xs-6 col-sm-6 col-md-1 col-lg-1 sinmargenes_derecha sinmargenes_izquierda");

  /*
   * Luego verifico el estatus de Yolixtli para habilitar (o no) el check de pace
  */
  obj_escuela = new Escuela();
  obj_escuela.deshabilita_pace();

  $("#central_btn_habilitades").click(function(e){
      e.preventDefault();
      var texto = $(obj_escolar.that).prop("checked") ? "¿Desea habilitar acceso a Yolixtli?" : "¿Desea deshabilitar acceso a Yolixtli?";
      obj_escolar.update_accesos_question(texto);
  });

  $('#modal_central_opciones_escolar').on('hidden.bs.modal', function (e) {
    $(obj_escolar.that).prop("checked", !$(obj_escolar.that).prop("checked"));
      $("#modal_central_opciones_escolar #lbl_acceso").empty();
      $("#modal_central_opciones_escolar #modal_titulo").empty();
  });

  $(".ch_element_form").on('change', function (e) {
        var col = $(this).data('campo');
        var that = this;
        obj_escolar.that = that;
        obj_escolar.col  = col;

        if(col == "sicres"){
          var texto_sicres = $(obj_escolar.that).prop("checked") ? "Habilitar" : "Deshabilitar";
          texto_sicres = texto_sicres+" acceso";
          obj_escuela.prepara_modal(texto_sicres);
        }
        else if (col == "pace") {
            var texto_pace = $(obj_escolar.that).prop("checked") ? "¿Desea habilitar acceso Móvil?" : "¿Desea deshabilitar acceso Móvil?";
            obj_escuela.update_accesos_question(texto_pace);
        }
  });

  $("#central_btn_cambiarpwd").click(function(e){
      e.preventDefault();
      var id = $(obj_escolar.that).attr('value');
      $.ajax({
          type: 'POST',
          url: live_url + "index.php/Cct/get_datos_pwd",
          data: {'id':id},
          beforeSend: function( xhr ) {
            $("#wait").modal("show");
          },
          success: function (data) {
            $("#wait").modal("hide");
            var result = JSON.parse(data);

            var arr_user = result['nombre_usuario'];
            var clave = result['clave'];

            var nombre_completo = " "+arr_user['nombre']+" "+arr_user['apell1']+" "+arr_user['apell2'];

            $("#modal_central_cambiarpwdescolar #nombre_user").empty();
            $("#modal_central_cambiarpwdescolar #nombre_user").append(nombre_completo);

            $("#modal_central_cambiarpwdescolar #nueva_contrasena").empty();
            $("#modal_central_cambiarpwdescolar #nueva_contrasena").val(clave);
            $("#modal_central_cambiarpwdescolar #nueva_contrasena").prop('disabled',true);

            $("#modal_central_cambiarpwdescolar #confirma_contrasena").empty();
            $("#modal_central_cambiarpwdescolar #confirma_contrasena").val(clave);
            $("#modal_central_cambiarpwdescolar #confirma_contrasena").prop('disabled',true);

            $("#modal_central_cambiarpwdescolar #pwd_generada").empty();
            $("#modal_central_cambiarpwdescolar #pwd_generada").append(clave);

            $("#modal_central_cambiarpwdescolar").modal("show");
          },
          error: function (data) {
              bootbox.alert("Ocurrió un error al procesar");
          }
      });

        $("#btn_pwd_modificar").click(function(e){
            e.preventDefault();
            var idusuario = $(obj_escolar.that).attr('value');
            var contrasena = $("#modal_central_cambiarpwdescolar #confirma_contrasena").val();
            obj_escolar.confirma_cambio_contrasena(idusuario, contrasena);
        });
  });

    /*
     *accion en boton del modal
     * realiza una peticion en ajax para realizar los cambios en la base
     */
    $(".cancela_status_check").click(function () {
        var id = $(".modalContent").attr('id');
        var chec = " #" + id + "";
        var final = '"' + chec + '"';
        //alert(final);
        $(final).prop("checked", true);
        //$("#".id).prop("checked", true);
        //  var data=$("#dato_escuela").attr("value", this.value);
    });

    $(".guarda_status").click(function () {
        var id = $(this).attr('value');

        $.ajax({
            type: 'POST',
            url: live_url + "index.php/Cct/update_campo/" + id,
            data: {'search': id},
            success: function (data) {
                //$(".mensaje-c").html("Cambios realizados correctamente");
                $('#myModal').modal('toggle');
            },
            error: function (data) {
                $(".mensaje-c").html("Error en la acción");

            }
        });


    });
}); // ready


function Escuela(){
  obj_escolar = this;
  obj_escolar.that = "";
  obj_escolar.col  = "";

  this.deshabilita_pace = function(){
    $("#sg_1_table tbody tr").each(function (index)
     {
         $(this).children("td").each(function (index)
         {
             var estatus_yolixtli = -1;
             switch (index)
             {
                 case 7: // EL indice 7 corresponde a la columna de Yolixtli
                    var chech2  = $(this).children("input");
                    estatus_yolixtli = ($(chech2).prop('checked'))?1:0;
                    var hermanos = $(this).siblings('td');
                    var hermano_pace = hermanos[7]; // columna pace
                    var check_pace  = $(hermano_pace).children("input");
                    if(estatus_yolixtli==0){
                      $(check_pace).prop('disabled',true);
                    }
                    break;
             }
         })
     });
  }// deshabilita_pace()

  this.prepara_modal = function(texto){
    $("#modal_central_opciones_escolar #lbl_acceso").empty();
    $("#modal_central_opciones_escolar #lbl_acceso").append(texto);
    $("#modal_central_opciones_escolar #modal_titulo").empty();
    $("#modal_central_opciones_escolar #modal_titulo").append("Seleccione opción");

    $("#modal_central_opciones_escolar").modal("show");
  }// prepara_modal()

  this.update_accesos_question = function(texto){
      bootbox.confirm({
          message: texto,
          buttons: {
              confirm: {
                  label: 'Aceptar',
                  className: 'btn-primary'
              },
              cancel: {
                  label: 'Atrás',
                  className: 'btn-default'
              }
          },
          callback: function (result) {
              if (result) {
                obj_escuela.destroy_modal();
                obj_escuela.update_accesos(obj_escolar.that,obj_escolar.col);
              } else {
                if(obj_escolar.col=="pace"){ // dejo el comportamiento para pace, si lo dejo para Yolixtli el check cambia de estado
                  $(obj_escolar.that).prop("checked", !$(obj_escolar.that).prop("checked"));
                }
              }
          }
      });
  }// update_accesos_question()

  this.update_accesos = function(that,col){
      var id = $(that).attr('value');
      $.ajax({
          type: 'POST',
          url: live_url + "index.php/Cct/update_campo/" + id + "-" + col + "-" + ($(that).prop("checked") ? 1 : 0),
          data: {'search': id + "-" + col + "-" + ($(that).prop("checked") ? 1 : 0)},
          beforeSend: function( xhr ) {
            $("#wait").modal("show");
          },
          success: function (data) {

            var result = JSON.parse(data);
            var mensaje = (($(that).prop("checked") ? 1 : 0)==1)?"Activado":"Desactivado";
            if(result['action'] == "update"){ // No es usuario nuevo, no muestro dialog de confirmación
              location.reload();
            /*
              bootbox.alert(mensaje+" correctamente", function() {
                location.reload();
                $("#wait").modal("show");
              });
              */
            }else if (result['action'] == "insert_update") { // Se creó usuario nuevo, muestro los datos de acceso
              bootbox.alert("Usuario nuevo "+result['username']+" con clave de inicio de sesión "+result['clave']+" "+mensaje+" correctamente", function() {
                    location.reload();
                });
            }

          },
          error: function (data) {
              bootbox.alert("Ocurrió un error al procesar");
          }
      });
  }// update_accesos()

  this.destroy_modal = function(){
    $("#modal_central_opciones_escolar #lbl_acceso").empty();
    $("#modal_central_opciones_escolar #modal_titulo").empty();
    $("#modal_central_opciones_escolar").modal("hide");
  }// destroy_modal()

  this.confirma_cambio_contrasena = function(idusuario,contrasena){
    $.ajax({
        type: 'POST',
        url: live_url + "index.php/Cct/confirmacion_contrasena",
        data: {'idusuario':idusuario, 'contrasena':contrasena},
        beforeSend: function( xhr ) {
          $("#wait").modal("show");
        },
        success: function (data) {
            $("#modal_central_cambiarpwdescolar").modal("hide");
            $("#wait").modal("hide");
            obj_escolar.destroy_modal();
            var result =  JSON.parse(data);
            if(result || result ==1){
                bootbox.alert("Contraseña cambiada correctamente");
            }
            /*
            bootbox.alert(result, function() {
                  $("#wait").modal("hide");
                  $("#modal_central_cambiarpwdescolar").modal("hide");
                  $(obj_escolar.that).prop("checked", !$(obj_escolar.that).prop("checked"));
            });
            */
        },
        error: function (data) {
            bootbox.alert("Ocurrió un error al procesar");
        }
    });
  }// confirma_cambio_contrasena()

}// Escuela
