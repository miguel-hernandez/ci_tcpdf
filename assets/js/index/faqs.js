/* jshint esversion: 6 */

let Faqs = {

  mostrar : () => {
    $.ajax({
      url:base_url+"Utils_ajax/get_view_faqs",
      method:"POST",
      data:{},
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        $("#div_generic").empty();
        $("#div_generic").append(data.str_view);
        $('#modal_faqs').modal("show");
      },
      error: function(jqXHR, textStatus, errorThrown){
        $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
      }
    });
  }

};
