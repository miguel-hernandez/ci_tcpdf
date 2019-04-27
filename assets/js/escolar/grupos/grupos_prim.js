$(document).ready(function(){
  obj_notification = new Notification("grupos_prim_notifications");
  obj_gp = new Gruposprim();
  $("#agregar_prim").hide();
});

$("#btn-ver_prim").click(function(e){
  e.preventDefault();
  var grupo = $("#grupo_prim").val();
  if(grupo == 0 || grupo=="0"){
    obj_notification.error("Debe seleccionar un grupo de la lista");
    return;
  }
  else{
    obj_gp.get_datos_grupo();
  }
});

$("#grupo_prim").change(function (){
  $("#panel_detalles_grupos").hide();
  $("#btn-detalles-prim").prop("disabled", true);
});

$("#asignaturas_prim").change(function (){
    var sel = $("#asignaturas_prim").val();
    if(sel  == ""){
      $("#agregar_prim").hide();
    }
    else{
      $("#agregar_prim").show();
    }
});

$("#btn-elimina_prim").click(function(e){
  e.preventDefault();
  obj_gp.eliminar_asignatura(this);
});

$("#agregar_prim").click(function(e){
  e.preventDefault();
  obj_gp.agregar_asignatura();
});

$("#grabar_prim").click(function(e){
  e.preventDefault();
  obj_gp.grabar();
});

function confirm_eliminar_asignatura(item){
  var nombre_grupo = $("#grupo_prim option:selected").text();

  var nombre_asig = item.getAttribute("data-rel");
  // Llena los datos de la confirmación
  var id_grupo = $("#grupo_prim").val();
  var id_asign = item.getAttribute("id");
  $("#btn-elimina_prim").attr("data-id_grupo", id_grupo);
  $("#btn-elimina_prim").attr("data-id_asignatura", id_asign);
  // $("#pregunta-eliminar").text("¿Eliminar "+ nombre_asig+" del grupo "+nombre_grupo+"?");
  $("#pregunta-eliminar").empty();
  $("#pregunta-eliminar").html("¿Eliminar "+ nombre_asig+" del grupo "+nombre_grupo+"?");
}

function Gruposprim(){
  that_gp = this;

  this.get_datos_grupo = function(){
    obj_notification.dismissible();
    $("#btn-detalles-prim").prop("disabled", false);

    $.ajax({
      // url : "llena_campos",
      url: base_url+"Grupo_prim/llena_campos",
      data : { id_grupo : $('#grupo_prim').val() },
      type : 'POST',
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(res){
        $("#wait").modal("hide");
        $("#panel_detalles_grupos").show();
        $("#asignaturas_prim").html('');
        $("#cuerpo-tabla_prim").html('');

        that_gp.llenar_listado( JSON.parse(res) );
      },
      error: function(error){console.log("Falló:: "+JSON.stringify(error)); }
    });
  }// get_datos_grupo()

  this.llenar_listado = function(datos){
    var id_asig_prim = $("#asignaturas_prim").val();
    $("#cupo").val(datos['cupo']);
    var asigx_grado = datos['asignaturas_grado'];

    // LLenado del select
    $("#asignaturas_prim").empty();
    var html_select = "";
    for(var i=0;i< asigx_grado.length;i++){
      html_select += "<option value=" +asigx_grado[i]['idasignatura']+ ">" +asigx_grado[i]['descr']+ "</option>";
    }// for
    $("#asignaturas_prim").append(html_select);

    id_asig_prim !== null ? $("#asignaturas_prim").val(id_asig_prim): '';

    // Lista de asignaturas de un grupo
    var asig_grupo = datos['asignaturas_grupo'];
    // var num_asig_grupo = asig_grupo.length;
    if(asig_grupo.length == 0){
      var fila = $("<tr>");
      var celda = $("<td>", {'colspan':3, style:'text-align:center;'})
      celda.append("El grupo seleccionado no tiene asignaturas");
      $("#cuerpo-tabla_prim").append(fila.append(celda));
    }// if
    else{
      for(var i = 0; i < asig_grupo.length; i++){
        var descr = asig_grupo[i]['descr'];

        var fila = $("<tr>");
        var td_num = $("<td>", {class:'span-numero'}).append(i+1);
        var td_descr = $("<td>").append(descr);
        var td_elimina = $("<td>", {class:'span-elimina'});
        var span_elimina = $("<span>", {
          class:"elimina-asig glyphicon glyphicon-remove-circle",
          id:asig_grupo[i]['idasignatura'],
          "data-rel":descr,
          "data-toggle":"modal",
          "data-target":".modal-pregunta"
        });

        fila.append(td_num);
        fila.append(td_descr);
        fila.append(td_elimina.append(span_elimina));

        $("#cuerpo-tabla_prim").append(fila);
      }// for
    }

    var filas = $('#cuerpo-tabla_prim').find('span');
    for (var i=0;i<filas.length;i++){
      filas[i].setAttribute('onclick', 'confirm_eliminar_asignatura(this)');
    }

    var asesor = datos['asesor'];
    if(asesor == null){
      $("#personal_prim option[value='0']").remove();
      $("#personal_prim").prepend("<option value='0' selected>- Seleccione un asesor -</option>");
    }else{
      $("#personal_prim option[value='0']").remove();
      var id_personal = asesor['idpersonal'];
      $("#personal_prim").val(id_personal);
    }
  }// llenar_listado()



  this.eliminar_asignatura = function(that){
    $.ajax({
      // url : "elimina_asignatura_grupo",
      url: base_url+"Grupo_prim/elimina_asignatura_grupo",
      type : 'POST',
      data : {
        id_grupo_prim : $(that).attr("data-id_grupo"),
        id_asignatura : $(that).attr("data-id_asignatura")
      },
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success: function(res){
        $("#wait").modal("hide");
        var eliminado = res['eliminado'];
        if(eliminado == '0'){
          obj_notification.error("No se pudo eliminar la asignatura del grupo");
        }
        else{
          that_gp.get_datos_grupo();
          obj_notification.success("Se eliminó correctamente la asignatura");
        }

        // llenaListado();
      },
      error : function(){
        $("#estado").append(getAlertEstado("Ocurrió un error interno al intentar realizar la operación", "danger"));
      }
    });// ajax
  }// eliminar_asignatura()

  this.agregar_asignatura = function(){
      // if(!$("#asignaturas_prim").children().length){
      //   obj_notification.error("No se han desplegado las asignaturas");
      //   return;
      // }
      if($("#asignaturas_prim").val() == ''){
        obj_notification.error("Debe seleccionar una asignatura");
        return;
      }else{
          $.ajax({
            // url : "add_asignatura_grupo",
            url: base_url+"Grupo_prim/add_asignatura_grupo",
            data:{ 'id_grupo' : $('#grupo_prim').val(), 'id_asignatura' : $("#asignaturas_prim").val() },
            type : 'POST',
            beforeSend: function(xhr) {
              $("#wait").modal("show");
            },
            success: function(res){
              var res = JSON.parse(res);
              $("#wait").modal("hide");
              var agregado = res['agregado'];
              var grupo = $("#grupo_prim option:selected").text();
              var asignatura = $("#asignaturas_prim option:selected").text();
              if(agregado == '0' || agregado == 0){
                obj_notification.error("El grupo "+grupo+" ya tiene asociada la asignatura "+asignatura);
              } else{
                that_gp.get_datos_grupo();
                obj_notification.success("Se asoció correctamente la asignatura "+asignatura+" al grupo "+grupo);
              }
            },
            error : function(){
              $("#estado").append(getAlertEstado("Ocurrió un error interno al intentar realizar la operación", "danger"));
            }
          });
      }
  }// agregar_asignatura()

  this.grabar = function(){
    var personal = $("#personal_prim").val();
    if(personal=="" || personal==0 || personal == null){
      obj_notification.error("Debe seleccionar un asesor de la lista");
    }
    else{
        $.ajax({
          // url : "add_asesor_grupo_prim",
          url : base_url+"Grupo_prim/add_asesor_grupo_prim",
          data : { 'id_grupo_prim':$('#grupo_prim').val(), 'id_personal':$("#personal_prim").val() },
          type : 'POST',
          beforeSend: function(xhr) {
            $("#wait").modal("show");
          },
          success: function(res){
            $("#wait").modal("hide");
            var agregado = res['agregado'];
            $("#estado").html('');
            if(agregado == '0'){
                obj_notification.error("No se pudo asignar al asesor al grupo");
            }
            else{
              obj_notification.success("Se asignó correctamente el asesor");
            }

          },
          error : function(){
            $("#estado").append(getAlertEstado("Ocurrió un error interno al intentar realizar la operación", "danger"));
          }
        });
    }
  }// grabar()

}// Gruposprim

// Despliega/Oculta panel de detalles
$("#btn-detalles-prim").click(function(){
  if($("#grupo_prim").val() == 0){
    $("#estado").append(getAlertEstado("Debe seleccionar un grupo de la lista", "warning"));
    $("#detalles_prim").css("display", "none");
    $("#btn-detalles-prim").prop("disabled", true);
    return;
  }
  $("#btn-detalles-prim").prop("disabled", false);
  $("#detalles_prim").slideToggle();
});
