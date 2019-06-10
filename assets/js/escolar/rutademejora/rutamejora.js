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
      let nivel="pree";

     var form = document.createElement("form");
     var element1 = document.createElement("input");

     let idexpedientes = '260234,260234, 260234, 260234, 260234'
     element1.type="hidden";
     element1.value=idexpedientes;
     element1.name="idexpedientes";
     form.appendChild(element1);


     form.name = "form_reporte_constancia";
     form.id = "form_reporte_constancia";
     form.method = "POST";
     form.target = "_blank";
     form.action = base_url+"Reportes_tcpdf/constancia_estudios/"+idexpediente+"/"+idcfg+"/"+nivel;
     document.body.appendChild(form);
     form.submit();
  });


  $("#btn_get_lista_asist").click(function(e){
     e.preventDefault();
       let idexpediente=260234;
       let idcfg=$('#idcentrocfg').val();
       let nivel="pree";

      var form = document.createElement("form");
      var element1 = document.createElement("input");

      let idexpedientes = '260234,260234, 260234, 260234, 260234'
      element1.type="hidden";
      element1.value=idexpedientes;
      element1.name="idexpedientes";
      form.appendChild(element1);


      form.name = "form_reporte_constancia";
      form.id = "form_reporte_constancia";
      form.method = "POST";
      form.target = "_blank";
      form.action = base_url+"Reportes_tcpdf/lista_asistencia/"+idexpediente+"/"+idcfg+"/"+nivel;
      document.body.appendChild(form);
      form.submit();
   });
