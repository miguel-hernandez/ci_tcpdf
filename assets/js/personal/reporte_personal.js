
$(document).ready(function(){
  
 $("#div_reporte_por_personal").hide();
$("#btn_reporte_por_personal").click(function(e){
    e.preventDefault();
    var reporte_por_personal = $("#reporte_por_personal").val();
    if($.trim(reporte_por_personal).length==0 ||  reporte_por_personal=="" ){
      alert("Seleccione un tipo de reporte para el alumno seleccionado. ");
    }else{
      var report = new Reportes();
      report.get_reporte_por_personal();
    }
});
});// document.ready

var arraySelected = new Array();
var arraySelectedFull =new Array();
function showhide(u){
    arraySelected = [];
    arraySelectedFull = [];
    bit = false;
    es_inactivo = false;
    $("#listado_personal_table input[name=elementos]").each(function () {
                if($(this).prop("checked")){
                  $(this).closest('td').siblings().each(function(){
                    // obtenemos el texto del td
                    var this_texto = $(this).text();
                    if(this_texto == "Inactivo"){
                      es_inactivo = true;
                    }
                  });
                   bit = true;
                   arraySelectedFull.push($(this).attr("value"));
                   arraySelected.push($(this).attr("value"));
                }
    });
    if(bit && es_inactivo != true){
       $("#div_reporte_por_personal").show();
   }
    else{
        $("#div_reporte_por_personal").hide();
    }

}

function Reportes(){
  tmp_report = this;
   this.get_reporte_por_personal = function(){
        var reporte=$("#reporte_por_personal").val();
        var form = document.createElement("form");
        var element1 = document.createElement("input");
        var element2 = document.createElement("input");
        form.name="formRep";
        form.id="formRep";
        form.method = "POST";
        form.target = "_blank";
        form.action = base_url+"Reportes/GeneraReporte/"+reporte;
        element1.type="hidden";
        element1.value=reporte;
        element1.name="nombreRep";
        form.appendChild(element1);
        element2.type="hidden";
        element2.value=arraySelected.join();
        element2.name="paramRep";
        form.appendChild(element2);
        document.body.appendChild(form);
        form.submit();
    };// reporte_por_alumno()
}
