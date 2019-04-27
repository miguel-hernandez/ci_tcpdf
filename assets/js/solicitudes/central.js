
$(document).ready(function () {



    $("#municipio").attr("disabled",true);
		$("#zona").attr("disabled",true);
    if ($("#municipio").val()!="0"){
      $("#municipio").attr("disabled",false);
    }
    if ($("#zona").val()!="0"){
      $("#zona").attr("disabled",false);
    }



});



$("#region").change(function() {

if ($("#region").val()!="0"){
  $("#municipio").attr("disabled",true);
  $("#municipio").val(0);
  $("#zona").attr("disabled",true);
  $("#zona").val(0);
    var idregion=$("#region").val();
    get_municipios_xregion(idregion);
    $("#municipio").attr("disabled",false);
  }
  else{

  $("#municipio").attr("disabled",true);
  $("#municipio").val(0);
  $("#zona").attr("disabled",true);
  $("#zona").val(0);}
});



$("#municipio").change(function() {
  if ($("#municipio").val()!="0"){
  $("#zona").attr("disabled",true);
  $("#zona").val(0);
  var idmunicipio=$("#municipio").val();
  get_zonas_xmunicipio(idmunicipio);
  $("#zona").attr("disabled",false);
}
else{
$("#municipio").attr("disabled",true);
$("#municipio").val(0);
$("#zona").attr("disabled",true);
$("#zona").val(0);
}
});

 function get_municipios_xregion(idregion){
   $.ajax({
 		url:base_url+"Solicitudes/get_municipios_xregion",
 		method:"POST",
 		data:{"idregion":idregion},
 		beforeSend: function(xhr) {
 			$("#wait").modal("show");
 		},
 		success:function(data){
 			$("#wait").modal("hide");
       $("#municipio").empty();
       var array_muni = data.str_municipios;
       var str_options = "<option value='0'> Todas los municipios </option>";
       for (var i = 0; i < array_muni.length; i++) {

         str_options += "<option value="+array_muni[i]['idmunicipio']+">"+array_muni[i]['nombre']+"</option>"
       }
       $("#municipio").append(str_options);

 		},
 		error: function(error){
 			console.log(error);
 		}
	});
};


function get_zonas_xmunicipio(idmunicipio){
  $.ajax({
   url:base_url+"Solicitudes/get_zonas_xmunicipio",
   method:"POST",
   data:{"idmunicipio":idmunicipio},
   beforeSend: function(xhr) {
     $("#wait").modal("show");
   },
   success:function(data){
     $("#wait").modal("hide");
      $("#zona").empty();
      var array_zonas = data.str_zonas;
      var str_options = "<option value='0'> Todas las zonas </option>";
      for (var i = 0; i < array_zonas.length; i++) {

        str_options += "<option value="+array_zonas[i]['zona']+">"+array_zonas[i]['zona']+"</option>"
      }
      $("#zona").append(str_options);

   },
   error: function(error){
     console.log(error);
   }
 });
};
/*
function get_zonas_xregion(idregion){
	$.ajax({
		url:base_url+"Solicitudes/get_zonas_xregion",
		method:"POST",
		data:{"idregion":idregion},
		beforeSend: function(xhr) {
			$("#wait").modal("show");
		},
		success:function(data){
			$("#wait").modal("hide");
      $("#zona").empty();
      var array_zonas = data.str_zonas;
      var str_options = "";
      for (var i = 0; i < array_zonas.length; i++) {

        str_options += "<option value="+array_zonas[i]['zona']+">"+array_zonas[i]['zona']+"</option>"
      }
      $("#zona").append(str_options);

		},
		error: function(error){
			console.log(error);
		}
	});
};
*/
