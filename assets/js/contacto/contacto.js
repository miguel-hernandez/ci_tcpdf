    $(document).ready(function () {
      $.validator.addMethod("valueNotEquals", function(value, element, arg){
       return arg !== value;
      });

    $("#form_contacto").validate({
            onclick:false, onfocusout: false, onkeypress:false, onkeydown:false, onkeyup:false,
            rules: {
                tipo_soporte: { valueNotEquals: "" },
                titulo_mensaje: {required: true},
                correo_contacto: {required: true, email:true},
                descripcion: {required: true}
            },
            messages: {
                tipo_soporte: { valueNotEquals: " * Seleccione una opción" },
                titulo_mensaje: {required: " * Ingrese título"},
                correo_contacto: {required: " * Ingrese correo electrónico", email: ' * Correo electrónico no válido'},
                descripcion: {required: " * Ingrese mensaje"}
            }
        });
    });

    function valida(){
        var contacto_form = $('#form_contacto');
        contacto_form.validate();
        if(!contacto_form.valid()){
            window.scrollTo(0,document.body.scrollHeight);
        }else {
        $("#wait").modal("show");
       }
    }

   $("#btn_contacto_enviar").click(function(e){
      e.preventDefault();
      $("#form_contacto").submit();
   });
