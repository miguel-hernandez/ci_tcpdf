$("#btn_clubes_addoficial").click(function(e){
  e.preventDefault();
  var seleccionados = Club_oficial.get_oficiales_seleccionados();
  if(seleccionados.length == 0){
    bootbox.alert({
      message: '<br><b>Seleccione al menos un club</b>',
      size: 'small'
    });
  }else{
      Club_oficial.add_club_oficial(seleccionados);
  }
});

$("#btn_clubes_addoficial_buscar").click(function(e){
  e.preventDefault();
  Club_oficial.seach_oficiales(0);
});

$("#btn_clubes_addoficial_limpiar").click(function(e){
  e.preventDefault();
  $("#itxt_clubes_addoficial_nombre").val('');
  $("#slc_clubes_addoficial_tipo").val('');
});



var Club_oficial = {

  get_oficiales_seleccionados : function(){
    var array_clubes_seleccionados = [];
    var str_seleccionados = "";
  	// para cada checkbox "chequeado"
  	$("#div_grid_clubes_oficiales input[type=checkbox]:checked").each(function(){
  		// buscamos el td más cercano en el DOM hacia "arriba"
  		// luego encontramos los td adyacentes a este
  		$(this).closest('td').siblings().each(function(){
        if($(this).attr('id') == 'idclub'){
           var idclub = $(this).attr('data');
           array_clubes_seleccionados.push(idclub);
  			}
  		});
  	});


    if(array_clubes_seleccionados.length > 0){
      for (var i = 0; i < array_clubes_seleccionados.length; i++) {
        str_seleccionados += array_clubes_seleccionados[i]+",";
      }
      str_seleccionados = str_seleccionados.substring(0, str_seleccionados.length - 1);
    }
  	return str_seleccionados;
  },

  add_club_oficial : function(ids_seleccionados){
    $.ajax({
       url:base_url+"Clubes/add_club_oficial",
       method:"POST",
       data:{'ids_seleccionados':ids_seleccionados},
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         var mensaje = (data.result)?"Clubes oficiales agregados correctamente":"Ocurrió un error, reintente por favor";
         if(data.result){
           $("#modal_clubes_clubes").modal("hide");
           $("#modal_clubes_clubes .modal-body").empty();

           bootbox.alert({
             message: '<br><b>'+mensaje+'</b>',
             size: 'small'
           });

         }
         get_view_admin_clubes();
       },
       error: function(error){
         $("#wait").modal("hide"); Error_ajax.get_error(xhr);
       }
     });
  },

  seach_oficiales : function(){
    get_paginador_grid_oficiales(0);
  }



};


function get_paginador_grid_oficiales(offset){
  // alert("get_paginador_grid_oficiales");
  var obj_grid_oficiales = new Grid("div_grid_clubes_oficiales");
  obj_grid_oficiales.get_gridpaginador(offset, "Clubes", "get_clubes_oficiales","form_clubes_admin_oficiales");
}
