obj_grupo = new Grupo_cct();

$("#btn_close_notification_cupo").click(function(){
    $("#mensaje_result_cupo").hide();
    $("#mensaje_result_content_cupo").empty();
});

$("#actualiza_cupo_grupo").click(function(){
    var cupo = $("#cupo-grupo").val();
    var id_grupo = $("#id-grupo").val()
    if(cupo < 1 || cupo > 99){
      obj_grupo.set_notification_cupo("Error: la capacidad debe ser mayor que 1 y menor que 99", "alert-danger", "alert-danger");
      return false;
    }
    else{
      obj_grupo.actualiza_cupo_grupo(cupo,id_grupo);
    }
});

// AGREGAR GRUPO
function agregar_grupo_cct_previo(datos){
  var lengua = $('#seleccion_lengua').val();
  if(lengua==null || lengua==""){
    lengua = "0";
  }
  var plan = $('#seleccion_plan').val();
  var planNombre = $('#seleccion_plan option:selected').html();
  var grado = $('#seleccion_grado').val();
  var nivelEscolar = $('#nivelEscolarL').html();
  var grupo = $('#seleccion_grupo').val();
  var cupo = $('#numero_cupo').val();
  var status = 1;
  var centrocfg = $('#idcentrocfg_hidden').val();
  var id = grado + "-" + grupo + "-" + cupo + "-" + centrocfg + "-" + nivelEscolar + "-" + plan + "-" + lengua;

  obj_grupo.agregar_grupo_cct(cupo,id);
}

function editar_cupo_grupo(that){
  $("#id-grupo").val($(that).attr("data-id_grupo"));
  $("#cupo-grupo").val($(that).attr("data-cupo_grupo"));
  $("#grado_grupo").text($(that).attr("data-grado_grupo"));
  $("#modal-cupo").modal();
}
// ACTIVAR GRUPO
function activar_grupocct(valorFila) {
  var nivelEscolar = $("#cct_idnivel_hidden").val();
  $("#fila_borraractivarhidden").val(valorFila + "-" + nivelEscolar);
  $("#modalgrupo_activa").modal("show");
}

$("#btn_grupo_activar").click(function (e) {
    obj_grupo.activa_grupo_cct( $("#fila_borraractivarhidden").val() );
});

// DESACTIVAR GRUPO
function desactivar_grupo(valorFila) {
  var nivelEscolar = $("#cct_idnivel_hidden").val();
  $("#fila_borraractivarhidden").val(valorFila + "-" + nivelEscolar);
  $("#modalgrupo").modal("show");
}// desactivar_grupo()

$("#desactivar_grupo_cct").click(function (e) {
    obj_grupo.desactiva_grupo_cct( $("#fila_borraractivarhidden").val() );
});

$("#btn_close_notification").click(function(){
    $("#mensaje_result").hide();
    $("#mensaje_result_content").empty();
});

function Grupo_cct(){
obj_grupocct = this;

this.show_grupos = function(){
  var cct = $('#txt_grupos_cct').val();
  var nivelEscolar = (arr[5]=="pree")?1:((arr[5]=="prim")?2:3)
  var cct_nivel = cct + '//' + nivelEscolar;
  $.ajax({
    url: live_url + "index.php/Cct/ver_grupos/" + cct_nivel,
    type: "POST",
    beforeSend: function( xhr ) {
      $("#wait").modal("show");
    },
    success: function (result) {
      $("#wait").modal("hide");
      $("#div_grid_grupos").empty();
      $("#div_grid_grupos").append(result);
      $("#div_grid_grupos").show();
    },
    error: function (result) {
      console.error("error");
    }
  });
}// show_grupos()

this.agregar_grupo_cct = function(cupo,id){
    if (cupo == '' || cupo == null || cupo==0) {
      obj_grupocct.set_notification("Capacidad incorrecta", "alert-danger", "alert-danger");
    } else {
      $.ajax({
        type: 'POST',
        url: live_url + "index.php/Cct/cct_agrega_grupo/" + id,
        success: function (data) {
          var result = JSON.parse(data);
          if(result==true || result==1){
            obj_grupocct.show_grupos();
            obj_grupocct.set_notification("Grupo agregado correctamente.", "alert-danger", "alert-success");
          }
          else if (result==false || result==0) {
            obj_grupocct.set_notification("No es posible agregar el grupo, ya existe uno similar.", "alert-danger", "alert-danger");
          }
          else if (result=="error") {
            obj_grupocct.set_notification("No es posible agregar el grupo, datos incompletos.", "alert-danger", "alert-danger");
          }
        },
        error: function (data) {
          console.error("cct_agrega_grupo");
        }
      });
    }
};// agregar_grupo_cct()

this.activa_grupo_cct = function(fila){
    $.ajax({
        type: 'POST',
        url: live_url + "index.php/Cct/activa_fila_grupo/" + fila,
        success: function (data) {
          var result = JSON.parse(data);
          if(result==true || result==1){
            $("#modalgrupo_activa").modal("hide");
            obj_grupocct.set_notification("Grupo activado correctamente", "alert-danger", "alert-success");
            obj_grupocct.show_grupos();
          }
          else{
              obj_grupocct.set_notification("Error activando el grupo. Verifique que no tenga algún asesor o materias asignadas a dicho grupo", "alert-danger", "alert-danger");
          }
        },
        error: function (data) {
            obj_grupocct.set_notification("Error activando el grupo. Verifique que no tenga algún asesor o materias asignadas a dicho grupo", "alert-danger", "alert-danger");
        }
    });
}// activa_grupo_cct()

 this.desactiva_grupo_cct = function(fila){
    $.ajax({
        type: 'POST',
        url: live_url + "index.php/Cct/del_fila_grupo/" + fila,
        success: function (data) {
            $("#modalgrupo").modal("hide");
            if (data=='incorrecto'){
              obj_grupocct.set_notification("No se puede dar de baja el grupo, verifique que no tenga alumnos asignados", "alert-danger", "alert-danger");
            }else{
              obj_grupocct.show_grupos();
              obj_grupocct.set_notification("Grupo desactivado correctamente", "alert-danger", "alert-success");
          }

        },
        error: function (data) {
          obj_grupocct.set_notification("No se puede dar de baja el grupo, verifique que no tenga alumnos asignados", "alert-danger", "alert-danger");
        }
    });
}// desactiva_grupo_cct()

this.actualiza_cupo_grupo = function(cupo,id_grupo){
  var sufijo = $("#cct_nivel_sufijo_hidden").val();
  $.ajax({
      type: 'POST',
      url: live_url + "index.php/central/actualiza_cupo",
      dataType : 'json',
      method : 'POST',
      data : {'id_grupo':id_grupo, 'cupo_grupo':cupo, 'sufijo':sufijo},
      beforeSend: function( xhr ) {
        $("#wait").modal("show");
      },
      success: function (resultado) {
          $("#modal-cupo").modal("hide");
          if(resultado['resultado']){
            $("#mensaje_result_cupo").hide();
            $("#mensaje_result_content_cupo").empty();
            obj_grupocct.show_grupos();
            obj_grupocct.set_notification("Cupo actualizado correctamente", "alert-danger", "alert-success");
          }
      },
      error: function (resultado) {
          obj_grupocct.set_notification("Ocurrió un error interno al tratar de realizar la operación", "alert-danger", "alert-danger");
      }
  });
}// desactiva_grupo_cct()

this.set_notification = function(content,type_remove,type_add){
   $("#mensaje_result").removeClass(type_remove);
   $("#mensaje_result").addClass(type_add);
   $("#mensaje_result_content").empty();
   $("#mensaje_result_content").append(content);
   $("#mensaje_result").show();
}// set_notification()


this.set_notification_cupo = function(content,type_remove,type_add){
   $("#mensaje_result_cupo").removeClass(type_remove);
   $("#mensaje_result_cupo").addClass(type_add);
   $("#mensaje_result_content_cupo").empty();
   $("#mensaje_result_content_cupo").append(content);
   $("#mensaje_result_cupo").show();
}// set_notification_cupo()


}// Grupo_cct
