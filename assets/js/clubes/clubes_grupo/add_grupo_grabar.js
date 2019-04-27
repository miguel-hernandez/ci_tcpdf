$(function() {
    obj_club_add_grupo_grabar = new Club_add_grupo_grabar();
    objeto_grupo = new OperacionesGrupos();
});
$("#btn_addg_gclub_grabar").click(function(){
  var idclub = $("#slt_addg_gclub_club").val();
  var n_cupo = $("#inp_addg_gclub_cupo").val();
  var id_docente = $("#slt_addg_gclub_docente").val();
  var id_bloque = $("#slt_addg_gclub_bloque").val();
  var gclub_edit = $("#inp_addg_gclub_edit").val();
  var inp_idgrupo_club = $("#inp_idgrupo_club").val();
  var n_alumnos_incritos = $("#inp_n_alumn_incritos").val();
  var tmp_band_grabar=true;

  if (idclub == null) {
    document.getElementById('lb_requerido_club').removeAttribute("hidden");
    tmp_band_grabar=false;
  }
  else {
    document.getElementById('lb_requerido_club').setAttribute("hidden", true);
  }
  if (n_cupo<1) {
    document.getElementById('lb_requerido_cupo').removeAttribute("hidden");
    $("#inp_addg_gclub_cupo").val(1);
    tmp_band_grabar=false;
  }
  else {
    document.getElementById('lb_requerido_cupo').setAttribute("hidden", true);
  }
  if (id_docente == null) {
    document.getElementById('lb_requerido_decente').removeAttribute("hidden");
    tmp_band_grabar=false;
  }
  else {
    document.getElementById('lb_requerido_decente').setAttribute("hidden", true);
  }
  if (id_bloque == null) {
    document.getElementById('lb_requerido_bloque').removeAttribute("hidden");
    tmp_band_grabar=false;
  }
  else {
    document.getElementById('lb_requerido_bloque').setAttribute("hidden", true);
  }
  if (parseInt(n_cupo) < parseInt(n_alumnos_incritos)) {
    document.getElementById('lb_cupoinferior').removeAttribute("hidden");
    tmp_band_grabar=false;
  }
  else {
    document.getElementById('lb_cupoinferior').setAttribute("hidden", true);
  }

  if (tmp_band_grabar) {
    $.ajax({
       url:base_url+"Clubes/grabar_grupo_club",
       method:"POST",
       data:{idclub:idclub,n_cupo:n_cupo,id_docente:id_docente,id_bloque:id_bloque,gclub_edit:gclub_edit,inp_idgrupo_club:inp_idgrupo_club},
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         if (data.estatus) {
           $("#modal_add_grupos").modal('hide');
           bootbox.alert({
             message: '<br><b>Grupo grabado correctamente</b>',
             size: 'small'
           });
          $("#slt_addg_gclub_club").val(0);
          $("#inp_addg_gclub_edit").val('');
          $("#inp_idgrupo_club").val('');
          $("#inp_addg_gclub_cupo").val(1);
          $("#slt_addg_gclub_docente").val(0);
          $("#slt_addg_gclub_bloque").val(0);
          objeto_grupo.grupos_ajax(0, 0, 0);
         }
       },
       error: function(error){
         $("#wait").modal("hide");
         console.error("error al grabar");
         console.table(error);
       }
     });
  }
});

function Club_add_grupo_grabar(){
  _thisclub_add_grupo_grabar = this;
}

function isNumberKey(evt)
        {
         var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

         return true;
        }
