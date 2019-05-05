$("#btn_get_reporte").click(function(e){
   e.preventDefault();
   let idcfg=$('#idcentrocfg').val();
    var form = document.createElement("form");
    form.name = "form_rutamejora_reporte";
    form.id = "form_rutamejora_reporte";
    form.method = "POST";
    form.target = "_blank";
    form.action = base_url+"Reportes_tcpdf/ruta_de_mejora/"+idcfg;
    document.body.appendChild(form);
    form.submit();
 });


 $("#btn_get_reporte_constancia").click(function(e){
    e.preventDefault();
      let idexpediente=260234;
      let idcfg=$('#idcentrocfg').val();
     var form = document.createElement("form");
     form.name = "form_reporte_constancia";
     form.id = "form_reporte_constancia";
     form.method = "POST";
     form.target = "_blank";
     form.action = base_url+"Reportes_tcpdf/constancia_estudios/"+idexpediente+"/"+idcfg;
     document.body.appendChild(form);
     form.submit();
  });
