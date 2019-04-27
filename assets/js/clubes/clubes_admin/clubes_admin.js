$(document).ready(function(){

   var popOverSettings = {
       placement: 'right',
       container: 'body',
       html: true,
       trigger:'hover',
       selector: '[data-toggle="popover"]', //Sepcify the selector here
       content: function () {
           return $('#popover-content').html();
       }
   };

   $('body').popover(popOverSettings);

});

$("#btn_clubes_clubes_local").click(function(e){
  e.preventDefault();
  $("#span_modal_clubes_clubes_titulo").empty();
  $("#span_modal_clubes_clubes_titulo").append("Agregar club local");
  // Clubes_admin.get_view_add_local();
  Clubes_admin.get_view_addclub("L");
});

$("#btn_clubes_clubes_oficial").click(function(e){
  e.preventDefault();
  $("#span_modal_clubes_clubes_titulo").empty();
  $("#span_modal_clubes_clubes_titulo").append("Agregar club oficial");
  // Clubes_admin.get_view_add_oficial();
  Clubes_admin.get_view_addclub("O");
});

$("#btn_clubes_clubes_search").click(function(e){
  e.preventDefault();
  var obj_grid = new Grid("div_grid_clubes_admin");
  obj_grid.get_gridpaginador(0, "Clubes", "get_clubes","form_clubes_admin");
});

$('#slt_clubes_ambito').on('change', function() {
  var idambito = $(this).val();
  if(idambito == 0 || idambito == '0'){
    $("#slt_clubes_tema").empty();
    var options = "<option value='0'>Seleccione</option>";
    $("#slt_clubes_tema").append(options);
  }else{
    Clubes_admin.get_temas_xidambito_principal(idambito);
  }
});

var Clubes_admin = {

  get_view_addclub : function(tipo){
    $.ajax({
       url:base_url+"Clubes/get_view_addclub",
       method:"POST",
       data:{'tipo':tipo},
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         $("#modal_clubes_clubes .modal-body").empty();
         $("#modal_clubes_clubes .modal-body").append(data.str_view);
         $("#modal_clubes_clubes").modal("show");
       },
       error: function(error){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

  eliminar_club : function (idclub, tipo){
    bootbox.confirm({
        message: "<b>¿Eliminar club?</b>",
        buttons: {
            confirm: {
                label: 'Confirmar',
                className: 'btn_color_primary'
            },
            cancel: {
                label: 'Cancelar',
                className: 'btn_color_default'
            }
        },
        callback: function (result) {
          if(result){
            Clubes_admin.delete_club(idclub, tipo);
          }else{
            // return false;
          }
        }
    });
  },

  delete_club : function (idclub, tipo){
    $.ajax({
       url:base_url+"Clubes/delete_club",
       method:"POST",
       data:{ 'idclub':idclub, 'tipo':tipo },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         var result = data.result;
         var count_grupos_club = data.count_grupos_club;
         if(data.result && count_grupos_club == 0){
           bootbox.alert({
             message: '<br><b>Club eliminado correctamente</b>',
             size: 'small'
           });
           get_gridpaginador(0);
         }else if (!data.result && count_grupos_club > 0) {
           var texto_personalizado = (count_grupos_club>1)?"grupos club asociados":"grupo club asociado";
           bootbox.alert({
             message: '<br><b>No es posible eliminar el club porque tiene '+count_grupos_club+' '+texto_personalizado+'</b>',
             size: 'small'
           });
         }else{
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

  get_temas_xidambito_principal : function(idambito){
    $.ajax({
       url:base_url+"Clubes/get_temas_xidambito",
       method:"POST",
       data:{'idambito':idambito},
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         $("#slt_clubes_tema").empty();

         var array_temas = data.array_temas;
         var options = "<option value='0'>Seleccione</option>";

         for (var i = 0; i < array_temas.length; i++) {
           options += "<option value="+array_temas[i].idtema+">"+array_temas[i].descripcion+"</option>";
         }
         $("#slt_clubes_tema").append(options);

       },
       error: function(error){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

  get_tipo_xidclub : function(idclub){
    var tipo = "";
    $("#div_grid_clubes_admin tbody tr").each(function () {
        $(this).children("td").each(function (){
          if($(this).attr('id') == 'idclub'){
            var idclub_recorriendo = $(this).attr('data');
            if(idclub_recorriendo == idclub){
              var array_hermanos = $(this).siblings('td');
              for (var i = 0; i < array_hermanos.length; i++) {
                if($(array_hermanos[i]).attr('id') == 'tipo'){
                  tipo = $(array_hermanos[i]).attr('data');

                }
              }
            }
          }
        });
    });
    return tipo;
  }

};


function eliminar_club(idclub){
  // Vamos a obtener el tipo de club: LOCAL, NACIONAL, ESTATAL
  var tipo = Clubes_admin.get_tipo_xidclub(idclub);
  Clubes_admin.eliminar_club(idclub, tipo);
}// eliminar_club()

$("#modal_clubes_clubes").on('hide.bs.modal', function () {
  $('.modal-backdrop').remove();
  get_view_admin_clubes();
});
// itxt_modal_tipo_vista
