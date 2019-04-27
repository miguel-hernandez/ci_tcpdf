$(document).ready(function () {
  // La validación del form
  $("#form_asigadicionales_nueva").validate({
    onclick:false, onfocusout: false, onkeypress:false, onkeydown:false, onkeyup:false,
    rules: {
      descripcion: {required: true},
      observacion: {required: true}
    },
    messages: {
      descripcion: { required: "Ingrese la descripción"},
      observacion: { required: "Ingrese la observación"}
    }
  });

});

$("#btn_asigadicional_grabar").click(function(e){
  e.preventDefault();
  $("#form_asigadicionales_nueva").submit();
});
