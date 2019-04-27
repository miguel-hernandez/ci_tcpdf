$(document).ready(function () {
  var nivel = $("#utxt_supervision_nivel").val();

  $("#sg_1_table tbody tr").each(function (index)
  {
    var input = $(this).children("input");
    var id_mensaje = $(input).val();

    $(this).children("td").each(function (index)
    {
      switch (index)
      {
        case 7: // En 7 está el botón editar, ahí vamos a poner eye
        var contenido = $(this)[0].innerHTML;
        if(contenido == ""){
          var str_btn = "<button id='' type='button' onclick='redirect_mensaje("+nivel+","+id_mensaje+")' class='btn4Smartgrid'> <span class='glyphicon glyphicon-eye-open'></span></button>";
          $(this).append(str_btn);
        }
        break;
      }
    })
  });

}); // ready

function redirect_mensaje(nivel,idmensaje){
  var form = document.createElement("form");
  var element1 = document.createElement("input");
  form.name = "form_redirect_mensaje";
  form.id = "form_redirect_mensaje";
  form.method = "POST";
  form.target = "_self";
  form.action = base_url+"mensajes/nuevo_mensaje_supervision/"+nivel+"/"+idmensaje;
  element1.type = "hidden";
  element1.value = 1;
  element1.name="redirect";
  form.appendChild(element1);
  document.body.appendChild(form);
  form.submit();
}// redirect_mensaje()
