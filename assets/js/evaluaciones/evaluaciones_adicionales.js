/* jshint esversion: 6 */
$("#slc_evaluaciones_adicionales_idgrupo").change(function(){
  let idgrupo = parseInt($(this).val());
  Evaluaciones_principal.set_input_idgrupo(idgrupo);

  Evaluaciones_adicionales.hide_div_observacionboleta();
  Evaluaciones_adicionales.get_expedientes_xidgrupo(idgrupo);
});

$("#slc_evaluaciones_adicionales_idexpediente").change(function(){
  let idexpediente = parseInt($(this).val());
  Evaluaciones_principal.set_input_idexpediente(idexpediente);

  Evaluaciones_adicionales.hide_div_observacionboleta();
  if(idexpediente == 0){
  }else if ( idexpediente > 0) {
    Evaluaciones_principal.get_view_adicionales();
  }

});


$("#btn_evaluaciones_adicionales_observacionboleta").click(function(e){
  e.preventDefault();
  Evaluaciones_adicionales.update_observacionboleta();
});

let Evaluaciones_adicionales = {

  update_observacionboleta : () => {
    $.ajax({
       url:base_url+"Evaluaciones/update_observacionboleta",
       method:"POST",
       data:{
         'observacionboleta' : $("#txt_evaluaciones_adicionales_observacionboleta").val(),
         'idexpediente' : $("#slc_evaluaciones_adicionales_idexpediente").val(),
         'idnivel' : $("#itxt_evaluaciones_idnivel").val()
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         // let result = data.result;
         if(data.result){
           Helpers.alert("Observación actualizada correctamente", "success");
         }else{
           Helpers.alert("Ocurrió un error, reintente por favor", "error");
         }
       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  },

  get_expedientes_xidgrupo : (idgrupo) => {
    $.ajax({
       url:base_url+"Evaluaciones/get_expedientes_xidgrupo",
       method:"POST",
       data:{
         'idgrupo' : idgrupo,
         'idnivel' : $("#itxt_evaluacionesfiltros_idnivel").val()
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         let array_epedientes = data.array_expedientes;

         let options = "<option value=0>Seleccione alumno</option>";
         for (let i = 0; i < array_epedientes.length; i++) {
           options += "<option value="+array_epedientes[i].idexpediente+">"+array_epedientes[i].alumno+"</option>";
         }
         $("#slc_evaluaciones_adicionales_idexpediente").empty();
         $("#slc_evaluaciones_adicionales_idexpediente").append(options);

       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  },

  hide_div_observacionboleta : () => {
    $("#div_adicionales_observacionboleta").hide();
  }
};
