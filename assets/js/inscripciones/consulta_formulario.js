$("#btn_preinscripciones_limpiar").click(function(e){
  e.preventDefault();
  Preinscripciones_consulta.limpiar_formulario();
});

$("#btn_preinscripciones_buscar").click(function(e){
  e.preventDefault();
  $("#div_preinscripciones_botones").hide();
  $("#div_preinscripciones_grid").hide();

  Preinscripciones_consulta.get_solicitantes();
});


var Preinscripciones_consulta = {

  get_solicitantes : function(){
    var datos = $("#form_preinscripciones_consultar").serialize();

    $.ajax({
      url: base_url+"Inscripciones/get_solicitantes",
      method: "POST",
      data: datos,
      beforeSend: function(xhr) {
        $("#wait").modal("show");
      },
      success:function(data){
        $("#wait").modal("hide");
        if(data.count_array_datos > 0){
          $("#div_preinscripciones_botones").show();
        }

        $("#div_preinscripciones_grid").empty();
        $("#div_preinscripciones_grid").append(data.str_grid);
        $("#div_preinscripciones_grid").show();
      },
      error: function(xhr){
        $("#wait").modal("hide"); Error_ajax.get_error(xhr);
      }
    });
  },

  limpiar_formulario : function(){
    $('#form_preinscripciones_consultar')[0].reset();
  },

  get_reporte_por_ct : function(){
    var reporte_por_ct = $("#reporte_por_ct").val();
    var reporte = reporte_por_ct;
    var element1 = document.createElement("input");
    var element2 = document.createElement("input");
    var form = document.createElement("form");
    form.name="formRep";
    form.id="formRep";
    form.method = "POST";
    form.target = "_blank";
    if( document.getElementById("slt_preinscripciones_nivel")!=null){
      element1.type="hidden";
      element1.value = document.getElementById("slt_preinscripciones_nivel").value;
      element1.name="nivel";
      form.appendChild(element1);
    }

    if(document.getElementById("itxt_preinscripciones_cct")!=null){
      element2.type="hidden";
      element2.value = document.getElementById("itxt_preinscripciones_cct").value;
      element2.name="paramRep";
      form.appendChild(element2);
    }

    form.action = base_url+"Reportes/GeneraReporte/"+reporte;
    document.body.appendChild(form);

    form.submit();
  }


  };

	function btn_reporte_por_ct_click(){
		var reporte_por_ct = document.getElementById("reporte_por_ct").value;
		if(reporte_por_ct.trim().length==0 || reporte_por_ct=="" ){
      bootbox.alert({
        message: "<br><b>Seleccione un tipo de reporte</b>",
        size: 'small',
        callback: function () {}
      });
		}else{
      Preinscripciones_consulta.get_reporte_por_ct();
		}
	};
