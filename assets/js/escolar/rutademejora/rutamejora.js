$("#btn_get_reporte").click(function(e){
   e.preventDefault();
    var form = document.createElement("form");
    form.name = "form_rutamejora_reporte";
    form.id = "form_rutamejora_reporte";
    form.method = "POST";
    form.target = "_blank";
    form.action = base_url+"Reportes_tcpdf/ruta_de_mejora";
    document.body.appendChild(form);
    form.submit();
 });
