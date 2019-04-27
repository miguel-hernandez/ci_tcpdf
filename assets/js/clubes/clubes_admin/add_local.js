$(document).ready(function () {

  $.validator.addMethod("select_not_cero", function(value, element){
    return(value == 0 || value == '0')?false:true;
  });

  $.validator.addMethod("otro_tema", function(value, element, arg){
    var esVisible = $("#div_clubes_addlocal_otrotema").is(":visible");
    if(esVisible){
      if(value==""){
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  });

$("#form_clubes_addlocal").validate({
        onclick:false, onfocusout: false, onkeypress:false, onkeydown:false, onkeyup:false,
        rules: {
            itxt_clubes_addlocal_nombre: {required: true},
            slc_clubes_addlocal_ambito: { select_not_cero: true },
            slc_clubes_addlocal_tema: { select_not_cero: true },
            txt_clubes_addlocal_objetivo: { required: true },
            txt_clubes_addlocal_proposito: { required: true },
            itxt_clubes_addlocal_otrotema: {otro_tema: ''},
        },
        messages: {
            itxt_clubes_addlocal_nombre: {required: " *El nombre es requerido"},
            slc_clubes_addlocal_ambito: { select_not_cero: " *Seleccione un ámbito" },
            slc_clubes_addlocal_tema: { select_not_cero: " *Seleccione un tema" },
            txt_clubes_addlocal_objetivo: { required: " *Seleccione un ámbito para cargar objetivo" },
            txt_clubes_addlocal_proposito: { required: " *Ingrese propósito" },
            itxt_clubes_addlocal_otrotema: {otro_tema:' *Ingrese tema'}
        },
        submitHandler: function(form) {
            Club_local.add_club_local();
        }
    });
});



$("#btn_clubes_addlocal").click(function(e){
  e.preventDefault();
  $("#form_clubes_addlocal").submit();
});

$('#slc_clubes_addlocal_ambito').on('change', function() {
  // Oculto siempre que cambie el ámbito
  $('#itxt_clubes_addlocal_otrotema').val("");
  $("#div_clubes_addlocal_otrotema").hide();

  var idambito = $(this).val();
  $('#txt_clubes_addlocal_objetivo').val("");

  if(idambito == 0){
    $("#slc_clubes_addlocal_tema").empty();
    $("#slc_clubes_addlocal_tema").append("<option value='0'>Seleccione</option>");
  }else{
    var objetivo = $(this).find(':selected').data('objetivo');

    $('#txt_clubes_addlocal_objetivo').val(objetivo);


    Club_local.get_temas_xidambito(idambito);
  }
});

$('#slc_clubes_addlocal_tema').on('change', function() {
  var idtema = $(this).val();
  if(idtema == "-1" || idtema == -1){
    $("#div_clubes_addlocal_otrotema").show();
  }else{
      $('#itxt_clubes_addlocal_otrotema').val("");
      $("#div_clubes_addlocal_otrotema").hide();
  }
});



var Club_local = {

  add_club_local : function(){
    var form_serialize = $("#form_clubes_addlocal").serialize();
    $.ajax({
       url:base_url+"Clubes/add_club_local",
       method:"POST",
       data:form_serialize,
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         if(data.result && !data.existe){
           bootbox.alert({
             message: '<br><b>Club grabado correctamente</b>',
             size: 'small'
           });
           $("#modal_clubes_clubes").modal("hide");
           $("#modal_clubes_clubes .modal-body").empty();

           get_gridpaginador(0);
         }else if (!data.result && data.existe) {
           bootbox.alert({
             message: '<br><b>Ya existe un club con el mismo nombre en su centro de trabajo</b>',
             size: 'small'
           });
         }
         else{
           bootbox.alert({
             message: '<br><b>Ocurrió un error, reintente por favor</b>',
             size: 'small'
           });
         }

       },
       error: function(error){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

  get_temas_xidambito : function(idambito){
    $.ajax({
       url:base_url+"Clubes/get_temas_xidambito",
       method:"POST",
       data:{'idambito':idambito},
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         $("#slc_clubes_addlocal_tema").empty();

         var array_temas = data.array_temas;
         var options = "<option value='0'>Seleccione</option>";

         for (var i = 0; i < array_temas.length; i++) {
           options += "<option value="+array_temas[i].idtema+">"+array_temas[i].descripcion+"</option>";
         }
         options += "<option value='-1'>Otro, especifique.</option>";

         $("#slc_clubes_addlocal_tema").append(options);

       },
       error: function(error){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  }

};
