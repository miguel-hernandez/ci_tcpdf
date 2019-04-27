/* jshint esversion: 6 */

$("#btn_grabar_gclub_alumno").click(function(e){
  e.preventDefault();
  let arr_gclubes = Alumno_gruposclub.get_arr_dom_gclubes_select()

  if (arr_gclubes.length<1){
    Helpers.alert('El número de clubes por alumno debe ser mínimo 1', 'error');
    return false;
  }
  else {
    Alumno_gruposclub.asigna_gruposclub_a_expediente(arr_gclubes);
   }
});


let Alumno_gruposclub = {

  get_arr_dom_gclubes_select : () => {
    let arr_gclubes = [];
    $('#div_grid_gclubes_lista tbody tr').each(function() {
      $(this).find('th').each(function(){
        let arr_gclubes_aux = new Object();
        let idexp = $(this).data("idexp");
        let idgclub = $(this).data("idgclub");
        let input_div = $(this).children("div");
        let input_label = $(input_div).children("label");
        let input_check = $(input_label).children("input");
        let estatus = ($(input_check).prop('checked'))?1:0;
        arr_gclubes_aux["idexp"] = idexp;
        arr_gclubes_aux["idgclub"] = idgclub;
        arr_gclubes_aux["estatus"] = estatus;
        if (estatus==1) {
          arr_gclubes.push(arr_gclubes_aux);
        }
      });
    });
    return arr_gclubes;
  },

  asigna_gruposclub_a_expediente : (arr_gruposclubes) => {
    $.ajax({
       url:base_url+"Alumno/insert_arr_grupoc_xidexp",
       method:"POST",
       data:{
         'arr_gclubes': arr_gruposclubes,
         'idExpediente': $("#tmp_idExpediente").val(),
         'subfijo': $("#tmp_subfijo_t").val()
       },
       beforeSend: function(xhr) {
         $("#wait").modal("show");
       },
       success:function(data){
         $("#wait").modal("hide");
         if (!data.estatus) {
             Helpers.alert(data.msj_estatus, 'error');
         }
        else {
             Helpers.alert(data.msj_estatus, 'success');
        }
        $("#dv_dom_grid_lista_grupos_c").empty();
        $("#dv_dom_grid_lista_grupos_c").html(data.dom_grid_lista_grupos_c);

       },
       error: function(jqXHR, textStatus, errorThrown){
         $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
       }
     });
  }


};
