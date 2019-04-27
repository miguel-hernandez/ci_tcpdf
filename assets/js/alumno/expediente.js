
function switchPace(check) {
  if (check.checked)
   $('#clave' + check.id).attr('readonly', false);
  else
   $('#clave' + check.id).attr('readonly', true);
 }
 
 function generaClave(id) {
  var length = 8,
          charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
          string = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
   string += charset.charAt(Math.floor(Math.random() * n));
  }
  $('#' + id).val(string);
 }
 
 
 function tabExpediente(tab) {
  //alert(tab.id);
  if (tab.id != tabExpediente_last) {
   $("#wait").modal("show");
   tab.className = "list-group-item text-center active";
   document.getElementById(tabExpediente_last).className = "list-group-item text-center";
 
   document.getElementById(tab.id + "Div").className = "bhoechie-tab-content active";
   document.getElementById(tabExpediente_last + "Div").className = "bhoechie-tab-content";
 
   tabExpediente_last = tab.id;
 
 
 
   $.ajax({
    url: base_url + "alumno/" + tab.id + "/" + idexpediente + "/" + idalumno,
 
    type: 'POST',
 
    error: function (jqXhr) {
     if (jqXhr.responseText == "REDIRECT") {
      parent.location = base_url;
     } else {
      $("#response").show();
      $("#response").attr('class', 'alert alert-warning')//.toggleClass('');
      $("#response").html(jqXhr.responseText);
      $("#wait").modal("hide");
      //alert(jqXhr.responseText)
     }
    },
    success: function (result) {
     if (result == "REDIRECT") {
      parent.location = base_url;
     } else {
      //alert(result);
      $("#" + tab.id + "Div").html(result);
      $("#wait").modal("hide");
     }
    }
   });
 
   $("#response").hide();
 
 
  }
 }
 
 tabExpediente_last = 'tabPersonal';
 function tabExpediente2(tab) {
 
  $("#wait").modal("show");
  tab.className = "list-group-item text-center active";
  document.getElementById(tabExpediente_last).className = "list-group-item text-center";
 
  document.getElementById(tab.id + "Div").className = "bhoechie-tab-content active";
  document.getElementById(tabExpediente_last + "Div").className = "bhoechie-tab-content";
 
  tabExpediente_last = tab.id;
 
  //alert(base_url+"alumno/"+tab.id+"/"+idexpediente+"/"+idalumno)
  $("#" + tab.id + "Div").load(base_url + "alumno/" + tab.id + "/" + idexpediente + "/" + idalumno, function () {});
  $("#response").hide();
 
  $("#wait").modal("hide");
 
 }
 
 function buscaCT_() {
  ct = document.getElementById("cct").value;
 
 
  document.getElementById("tbodyBuscaCT").innerHTML = "";
  $("#tbodyBuscaCT").load(base_url + "Catalogos/ajaxCT/" + ct, $("#modalBuscaCT").modal());
 }
 
 function buscaCT(target) {
  if (target == "_crea_expediente")
   $("#nivelModalCT").val($("#nivel").val());
  $("#onclick_modal").attr("onclick", "buscaCT('" + target + "')");
  $("#wait").modal("show");
 
 
  var forma = $("#modalEscuela").serialize();
  //alert(nivel)
 
  $.ajax({
   url: base_url + "Catalogos/ajaxCT/" + target,
   data: forma,
   type: 'POST',
   //dataType:'json',
 
   error: function (jqXhr) {
    //alert(jqXhr.responseText)
    if (jqXhr.responseText == "REDIRECT") {
     parent.location = base_url;
    } else {
     if (jqXhr.responseText == "")
      jqXhr.responseText = "<tr><td colspan='8'><div class='alert alert-warning'>No hay registros</div></td></tr>"
     $("#tbodyBuscaCT").html(jqXhr.responseText);
     $("#wait").modal("hide");
    }
   },
   success: function (result) {
    if (result == "REDIRECT") {
     parent.location = base_url;
    } else {
     //alert(result)
     $("#modalBuscaCT").modal("show");
     $("#tbodyBuscaCT").html(result);
     $("#wait").modal("hide");
    }
   }
  });
 }
 
 function setImage() {
  $("#modalSetImage").modal();
  $("#responseModalSetImage").html("");
  $("#responseModalSetImage").hide();
  //$( "#tbodyBuscaCT" ).load( base_url+"Catalogos/ajaxCT/"+ct,$("#modalSetImage").modal() );
 }
 
 
 function removeCT(target) {
  document.getElementById('cct' + target).value = "";
  document.getElementById('grupo' + target).innerHTML = "<option value=''>Grupo</option>";
 
 }
 
 function seleccionaCT(idctcfg, cct, target, subfijo) {
  document.getElementById('cct' + target).value = cct;
  //document.getElementById("grupo_cambio_subfijo").value=subfijo;
  get_grupos(idctcfg, target);
  $('#modalBuscaCT').modal('hide');
 }
 
 function get_grupos(idctcfg, target) {
  $("#wait").modal("show");
  $("#grupo" + target).load(base_url + "Catalogos/grupos/" + idctcfg, $("#wait").modal("hide"));
  document.getElementById('grupo' + target).disabled = "";
 }
 
 function seleccionaPais(pais) {
  if (pais == '151' || pais == 151) { // solo para Mexico
   get_estados('estado');
   get_etnias();
   //document.getElementById('transnacional').disabled="disabled";
   //document.getElementById('transnacional').innerHTML="<option></option>"
   $('#estado').removeAttr("disabled");
   $('#estado').html("<option></option>");
 
  } else {
   //get_transnacional("transnacional");
   document.getElementById('etnia').disabled = "disabled";
   document.getElementById('etnia').innerHTML = "<option></option>";
   document.getElementById('estado').disabled = "disabled";
   document.getElementById('estado').innerHTML = "<option></option>"
  }
 }
 
 function seleccionaPaisDom(pais, loadInId) {
  if (pais == '151' || pais == 151) { // solo para Mexico
   get_estados('entidad' + loadInId);
  } else {
   document.getElementById('entidad' + loadInId).disabled = "disabled";
   document.getElementById('entidad' + loadInId).innerHTML = "<option></option>"
   document.getElementById('municipio' + loadInId).disabled = "disabled";
   document.getElementById('municipio' + loadInId).innerHTML = "<option></option>"
   document.getElementById('localidad' + loadInId).disabled = "disabled";
   document.getElementById('localidad' + loadInId).innerHTML = "<option></option>"
  }
 }
 
 function seleccionaEntidadDom(entidad, loadInId, selected) {
 
  if (entidad == '21' || entidad == 21) { // solo para Mexico
   // $('#entidad').prop('disabled', false)
   document.getElementById("municipio" + loadInId).disabled = "";
   get_municipios('municipio' + loadInId, selected);
 
   document.getElementById("localidad" + loadInId).disabled = "";
   get_localidades('localidad' + loadInId, selected);
 
  } else {
   document.getElementById('municipio' + loadInId).disabled = "disabled";
   document.getElementById('municipio' + loadInId).innerHTML = "<option></option>";
   document.getElementById('localidad' + loadInId).disabled = "disabled";
   document.getElementById('localidad' + loadInId).innerHTML = "<option></option>";
  }
 }
 
 function seleccionaMunicipioDom(municipio, loadInId, selected) {
  if (municipio != "") {
   document.getElementById("localidad" + loadInId).disabled = "";
   get_localidades(municipio, loadInId, selected)
   return false;
  } else
   document.getElementById(loadInId).disabled = "disabled";
 }
 
 
 function get_localidades(municipio, loadInId, selected) {
  $("#localidad" + loadInId).load(base_url + "Catalogos/localidades/" + municipio + "/" + selected);
 
 }
 
 function get_municipios(loadInId, selected) {
  $("#" + loadInId).load(base_url + "Catalogos/municipios/" + selected);
 
 }
 
 function get_etnias() {
  $("#etnia").load(base_url + "Catalogos/etnias");
  document.getElementById('etnia').disabled = "";
 }
 
 function get_estados(loadInId) {
  $("#" + loadInId).load(base_url + "Catalogos/estados");
  document.getElementById(loadInId).disabled = "";
 }
 
 function get_transnacional(loadInId) {
  $("#" + loadInId).load(base_url + "Catalogos/transnacional/" + loadInId);
  document.getElementById(loadInId).disabled = "";
 }
 
 /*
  var colonias;
  $.ajax({
  url: '../Catalogos/colonias',
  datatype:'json',
  success: function(data) {
  colonias = data;
  alert(colonias);
  }
  });
  */
 //var colonias=[''];
 
 //$(function(){$("#colonia").autocomplete({source: colonias});})$(function(){$("#coloniaTutor1").autocomplete({source: colonias});})$(function(){$("#coloniaTutor2").autocomplete({source: colonias});})
 
 var idexpediente;
 var idalumno;
 
 function validaGrabar(formId, validate) {
 
  $("#response").html("");
  var form = $("#" + formId);
 
  if (validate)
   form.validate();
 
  if (validate && !form.valid()) {
 
   $("#response").show();
   $("#response").attr('class', 'alert alert-danger');
   window.scrollTo(0, document.body.scrollHeight);
 
  } else {
   $("#wait").modal("show");
 
   $("#response").hide();
   //var form = $(forma).serialize();
   if ($('#viveConAlumnoTutor1').prop("checked")) {
    enableDisableDomTutor(1, false);
   }
   if ($('#viveConAlumnoTutor2').prop("checked")) {
    enableDisableDomTutor(2, false);
   }
 
   $.ajax({
    url: base_url + 'Alumno/grabaExpediente/' + formId,
    data: form.serialize(),
    type: 'POST',
    dataType: 'json',
 
    error: function (jqXhr) {
     if (jqXhr.responseText == "REDIRECT") {
      parent.location = base_url;
     } else {
      $("#response").show();
      $("#response").attr('class', 'alert alert-warning')//.toggleClass('');
      //$("#response").addClass();
      $("#response").html(jqXhr.responseText);
      $("#wait").modal("hide");
      window.scrollTo(0, document.body.scrollHeight);
     }
     if ($('#viveConAlumnoTutor1').prop("checked")) {
      enableDisableDomTutor(1, true);
     }
     if ($('#viveConAlumnoTutor2').prop("checked")) {
      enableDisableDomTutor(2, true);
     }
    },
    success: function (result) {
 
     if (result == "REDIRECT") {
      parent.location = base_url;
     } else {
      $("#response").show();
      $("#response").attr("class", "alert " + result['class']);//.toggleClass();
      $("#response").html(result['mensaje']);
      $("#wait").modal("hide");
      window.scrollTo(0, document.body.scrollHeight);
 
      $("#folioTutor1").val(result['idtutor1']);
      $('#idTutor1').val(result['idtutor1']);
 
      $("#folioTutor2").val(result['idtutor2']);
      $('#idTutor2').val(result['idtutor2']);
 
      //if(formId=="Tutores"){tabExpediente_last = "tabOtros";tabExpediente(document.getElementById("tabTutores"));}
     }
     if ($('#viveConAlumnoTutor1').prop("checked")) {
      enableDisableDomTutor(1, true);
     }
     if ($('#viveConAlumnoTutor2').prop("checked")) {
      enableDisableDomTutor(2, true);
     }
 
    }
   });
  }
 }
 
 function validaCrearExpediente() {
  $("#response").html("");
  var forma = $('#expediente_nuevo');
 
  forma.validate();
  if (!forma.valid()) {
 
   $("#response").show();
   $("#response").attr('class', 'alert alert-danger');
   window.scrollTo(0, document.body.scrollHeight);
 
  } else {
   $("#wait").modal("show");
 
   $("#response").hide();
 
   $.ajax({
    url: base_url + 'Alumno/grabaCrearExpediente/',
    data: forma.serialize(),
    type: 'POST',
    dataType: 'json',
 
    error: function (jqXhr) {
     if (jqXhr.responseText == "REDIRECT") {
      parent.location = base_url;
     } else {
 
      $("#response").show();
      $("#response").attr('class', 'alert alert-warning col-md-12')//.toggleClass('');
      $("#response").html(jqXhr.responseText);
      $("#wait").modal("hide");
      window.scrollTo(0, document.body.scrollHeight);
     }
    },
    success: function (result) {
     if (result == "REDIRECT") {
      parent.location = base_url;
     } else {
      if (result['mensaje'] == "existe") {
       if (confirm("Existe expediente con CURP o datos generales iguales, desea consultarlo?"))
        parent.location = base_url + 'Alumno/expediente/' + result['idexpediente'] + '/' + $("#nivel").val();
      } else if (result['mensaje'] == "redirect") {
       //alert(base_url+'Alumno/expediente/'+result['idexpediente']+'/'+result['idalumno']);
       parent.location = base_url + 'Alumno/expediente/' + result['idexpediente'] + '/' + $("#nivel").val();
      } else {
       $("#response").show();
       $("#response").attr("class", "col-md-12 alert " + result['class']);//.toggleClass();
       $("#response").html(result['mensaje']);
      }
      $("#wait").modal("hide");
      window.scrollTo(0, document.body.scrollHeight);
     }
    }
   });
  }
 
 }
 
 function generarCurp() {
  str = "";
  if ($("#nombre").val() == "")
   str = "Nombre,";
  if ($("#apellido1").val() == "")
   str += "apellido1,";
  //if ($("#apellido2").val() == "")str += "apellido2,";
  if ($("#fechaNac").val() == "")
   str += "fecha de nacimiento,";
  if ($("#genero").val() == "")
   str += "Genero,";
  if ($("#pais").val() == "")
   str += "Pais,";
  if ($("#pais").val() == "151" && $("#estado").val() == "")
   str += "Estado,";
 
  if (str != "") {
 
    bootbox.alert({
      message: "<br><b>Defina: " + str+"</b>",
      size: 'small'
    });
  } else {
 
 
 
   var fechaNac = $("#fechaNac").val();
 
   var strDia = fechaNac.substr(0, 2);
   var strMes = fechaNac.substr(3, 2);
   var strAnio = fechaNac.substr(6, 4);
 
 
 
 
 
   var strSexo = ($("#genero").val() === "F") ? "M" : "H";
   if ($("#pais").val() == "151")
    estado = $("#estado option:selected").attr("abrev");
   else
    estado = "NE";
 
   var objParam = {
    nombre: $("#nombre").val(),
    apellido_paterno: $("#apellido1").val(),
    apellido_materno: $("#apellido2").val(),
    sexo: strSexo,
    estado: estado,
    fecha_nacimiento: [strDia, strMes, strAnio],
    homonimia: "-"
   };
 
   var curp = generaCurp(objParam);
 
   if (curp !== false)
   {
    $("#curp").val(curp);
   }
 
   // var curp = generaCurp({
   //     nombre            : 'Juan',
   //     apellido_paterno  : 'Perez',
   //     apellido_materno  : 'Ramirez',
   //     sexo              : 'H',
   //     estado            : 'DF',
   //     fecha_nacimiento  : [31, 1, 1981]
   //   });
  }
 }
 
 function validaCurp() {
  curp = ($("#curp").val()).replace('@', '%40');
 
  $.ajax({
   url: base_url + 'Alumno/validaCurp/' + curp,
   type: 'POST',
   dataType: 'json',
   //data:"curp="+curp,
   error: function (jqXhr) {
    if (jqXhr.responseText == "REDIRECT") {
     parent.location = base_url;
    } else {
     alert(jqXhr.responseText);
    }
   },
   success: function (result) {
    if (result == "REDIRECT") {
     parent.location = base_url;
    } else {
     //alert(result['existe']);
     if (result['existe'] == "0") {
      $("#curp").attr("disabled", true);
      $("#curpValidada").val(curp);//.toggleClass();
     } else {
      alert("existe")
     }
 
    }
   }
  });
 }
 
 
 
 jcropOn = false;
 var originalWidth = 0;
 var originalHeight = 0;
 
 
 function readURL(input) {
  $('#fotoOficial').attr('src', null);
 
  if (jcropOn) {
   destroyJcrop();
  }
 
  //alert($('#image1').attr('width'));
 
  //alert($('#image1').attr('src'))
  //$('#imageInput').val("");
 
  if (input.files && input.files[0]) {
   var reader = new FileReader();
 
   reader.onload = function (e) {
    //$('#image1').prop('width','auto'); $('#image1').prop('height','auto');
 
 
    var img = new Image();
    //img.width = "auto"; img.height = "auto";
    img.src = e.target.result;
 
    img.onload = function () {
     //alert(this)
 
     //data = scaleImg(this);
     $('#fotoOficial').prop('src', grey(this));
 
     //originalWidth = this.width;originalHeight = this.height;
 
     //$('#fotoPropuesta').prop('css',grey(this));
 
     //$('#fotoPropuesta').attr('src', this.src);
     //alert(originalWidth+"/"+originalHeight)
 
 
     initJcrop("fotoOficial");
    };
 
    //$('#image1').attr('src', e.target.result);
 
 
   }
 
   reader.readAsDataURL(input.files[0]);
   killWebcam();
   $('#crop').hide();
   $('#saveImage').show();
   $('#snapshot').hide();
 
  }
 }
 
 
 function grey(input) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
 
  ctx.drawImage(input, 0, 0);
  var MAX_WIDTH = 130;
  var MAX_HEIGHT = 176;
  var width = input.width;
  var height = input.height;
 
  //alert(width+"/"+height);
 
  if (width >= height) {
   if (width > MAX_WIDTH) {
    height *= MAX_WIDTH / width;
    width = MAX_WIDTH;
   }
  } else {
   if (height > MAX_HEIGHT) {
    width *= MAX_HEIGHT / height;
    height = MAX_HEIGHT;
   }
  }
  height = parseInt(height);
  width = parseInt(width);
 
  //alert(width+"/"+height)
 
  //canvas.width = width;canvas.height = height;
  canvas.width = MAX_WIDTH;
  canvas.height = MAX_HEIGHT;
 
 
  var ctx = canvas.getContext("2d");
  ctx.drawImage(input, 0, 0, width, height);
 
  originalWidth = width;
  originalHeight = height;
 
  //width += 100; height += 100;
 
  var imgPixels = ctx.getImageData(0, 0, width, height);
  //alert (width+" / "+height);
  //console.info(imgPixels);
 
 
  //var imgPixels = ctx.getImageData(0, 0, MAX_WIDTH, MAX_HEIGHT);
 
  for (var x = 0; x < width; x++) {
   for (var y = 0; y < height; y++) {
 
 
    //console.info(imgPixels.data[i]);
    var i = parseInt(((y * 4) * width + x * 4));
 
 
 
    var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
    imgPixels.data[i] = avg;
    imgPixels.data[i + 1] = avg;
    imgPixels.data[i + 2] = avg;
 
    //console.info(i+"="+imgPixels.data[i]);
    //  }
   }
  }
 
  //ctx.putImageData(imgPixels, 0, 0, 0, 0, width, height);
  ctx.putImageData(imgPixels, 0, 0, 0, 0, MAX_WIDTH, MAX_HEIGHT);
  //cnv.scale(1,1.35);
  setInputFile(canvas);
  return canvas.toDataURL("image/jpeg", 0.85);
 
 }
 
 var fileFromBlob = null;
 
 function setInputFile(canvas) {
  //alert("setInputFile");
  //canvas = document.getElementById("canvas");
  dataURL = canvas.toDataURL("image/jpeg", 0.85);
  var blobBin = atob(dataURL.split(',')[1]);
  var array = [];
  for (var i = 0; i < blobBin.length; i++) {
   array.push(blobBin.charCodeAt(i));
  }
  fileFromBlob = document.querySelector('input[type=file]').files[0];
  fileFromBlob = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
 
  $('#imageInput').prop('src', fileFromBlob);
 }
 
 function saveImage() {
  //alert(document.getElementById('imageInput'));
  $("#wait").modal("show");
 
  if (JcropAPI) {
   doCrop();
  }
 
  var imagefile = document.getElementById('imageInput');
  var idexpediente = document.getElementById('idexpediente').value;
  var idalumno = document.getElementById('idalumno').value;
 
 
 
  if (fileFromBlob != null) {
   var file = fileFromBlob;
  } else {
   var file = imagefile.files[0];
 
  }
 
 
  var formData = new FormData();
 
  if (file && file.value != "") {
   //formData.append('fotoPropuesta', file, file.name);
   formData.append('fotoOficial', file, file.name);
 
 
 
   formData.append('idexpediente', idexpediente);
   formData.append('idalumno', idalumno);
 
   $.ajax({
    url: base_url + 'Alumno/grabaImagen',
    data: formData,
    type: 'POST',
    dataType: 'json',
    cache: false,
    contentType: false,
    processData: false,
 
    error: function (jqXhr) {
     if (jqXhr.responseText == "REDIRECT") {
      parent.location = base_url;
     } else {
 
      $("#responseModalSetImage").show();
      $("#responseModalSetImage").attr('class', 'alert alert-warning')//.toggleClass('');
      $("#responseModalSetImage").html(jqXhr.responseText);
     }
     $("#wait").modal("hide");
    },
    success: function (result) {
     if (result == "REDIRECT") {
      parent.location = base_url;
     } else {
      $("#ok").modal("show");
 
      //$('#trValidaFotoPropuesta').css('display','');
      //$('#trMotivoRechazo').css('display', 'none');
      $('#idFotoOficial').val(result['idFoto']);
 
 
      $("#modalSetImage").modal("hide");
      //setFotoPropuesta(1);
 
      $('#removeImagen').css('display', '');
 
      //$('#fotoOficial').attr("src", $('#fotoPropuesta').attr("src"));
      $('#imagenExpediente').attr("src", $('#fotoOficial').attr("src"));
 
 
 
      $("#responseModalSetImage").show();
      $("#responseModalSetImage").attr("class", "alert " + result['class']);//.toggleClass();
      $("#responseModalSetImage").html(result['mensaje']);
      if (result['class'] == "alert-success") {
       //$('#imagenExpediente').attr("src", $('#fotoPropuesta').attr("src"));
      }
      $("#ok").modal("hide");
      initJcrop("fotoOficial");
     }
     $("#wait").modal("hide");
    }
   });
  } else {
   $("#wait").modal("hide");
  }
 
 
 
 }
 
 function removeImage() {
 
   bootbox.confirm({
     message: 'Confirme que desea eliminar la fotografia actual.',
     buttons: {
         confirm: {
             label: 'Aceptar',
             className: 'btn-primary'
         },
         cancel: {
             label: 'Atrás',
             className: 'btn-default'
         }
     },
     callback: function (result) {
         if (result) {
           $("#wait").modal("show");
 
           var formData = new FormData();
 
           formData.append('idfoto', $('#idFotoOficial').val());
 
           $.ajax({
            url: base_url + 'Alumno/eliminaImagen',
            data: formData,
            type: 'POST',
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
 
            error: function (jqXhr) {
             if (jqXhr.responseText == "REDIRECT") {
              parent.location = base_url;
             } else {
 
              $("#responseModalSetImage").show();
              $("#responseModalSetImage").attr('class', 'alert alert-warning')//.toggleClass('');
              $("#responseModalSetImage").html(jqXhr.responseText);
             }
             $("#wait").modal("hide");
            },
            success: function (result) {
             if (result == "REDIRECT") {
              $('#removeImagen').empty();
              parent.location = base_url;
             } else {
              $("#ok").modal("show");
 
              let base = $('#imagenExpediente_').attr("src")
              let div = $('div .jcrop-holder').children('div').children('div').children('img').attr('src', '');
             //  let div_1 = $(div).children('div');
             //  let div_2 = $(div_1).children('img').attr('src', '');
              
              $(div).attr('src', base)
             //  console.log('Imagen: '+$(div_2).attr('src', base));
 
 
              //$('#trValidaFotoPropuesta').css('display','');
              //$('#trMotivoRechazo').css('display', 'none');
              $('#idFotoOficial').val('');
              $('#removeImagen').css("display", "none");
              
              $('#fotoOficial').attr("src", base);
              $('#imagenExpediente').attr("src", base);
                         
              //$('#fotoPropuesta').attr("src", $('#imagenExpediente_').attr("src"));
  
              $("#modalSetImage").modal("hide");
              
              $("#ok").modal("hide");
             }
             $("#wait").modal("hide");
            }
           });
         }
     }
 });
 
  // if (confirm("Confirme eliminar fotografia actual.")) {
  //
  //  $("#wait").modal("show");
  //
  //  var formData = new FormData();
  //
  //  formData.append('idfoto', $('#idFotoOficial').val());
  //
  //  $.ajax({
  //   url: base_url + 'Alumno/eliminaImagen',
  //   data: formData,
  //   type: 'POST',
  //   dataType: 'json',
  //   cache: false,
  //   contentType: false,
  //   processData: false,
  //
  //   error: function (jqXhr) {
  //    if (jqXhr.responseText == "REDIRECT") {
  //     parent.location = base_url;
  //    } else {
  //
  //     $("#responseModalSetImage").show();
  //     $("#responseModalSetImage").attr('class', 'alert alert-warning')//.toggleClass('');
  //     $("#responseModalSetImage").html(jqXhr.responseText);
  //    }
  //    $("#wait").modal("hide");
  //   },
  //   success: function (result) {
  //    if (result == "REDIRECT") {
  //     $('#removeImagen').empty();
  //     parent.location = base_url;
  //    } else {
  //     $("#ok").modal("show");
  //
  //     //$('#trValidaFotoPropuesta').css('display','');
  //     //$('#trMotivoRechazo').css('display', 'none');
  //     $('#idFotoOficial').val('');
  //     $('#removeImagen').css("display", "none");
  //
  //
  //     $('#fotoOficial').attr("src", $('#imagenExpediente_').attr("src"));
  //     $('#imagenExpediente').attr("src", $('#imagenExpediente_').attr("src"));
  //     //$('#fotoPropuesta').attr("src", $('#imagenExpediente_').attr("src"));
  //
  //     $("#modalSetImage").modal("hide");
  //
  //     $("#ok").modal("hide");
  //    }
  //    $("#wait").modal("hide");
  //   }
  //  });
  // }
 }
 
 function showWebcam() {
  $("#webcam").show();
  $("#image").hide();
 }
 
 function validaFotoPropuesta(bit) {
  if (bit) {
   $("#motivoRechazoDiv").css("display", "none");
   if (confirm("Confirme aceptar foto propuesta")) {
    setFotoPropuesta(1);
   }
  } else {
   $("#motivoRechazoDiv").css("display", "");
   if ($("#motivoRechazoFoto").val() == "") {
    alert("Defina motivo de rechazo");
   } else {
    if (confirm("Confirme rechazar foto propuesta")) {
     setFotoPropuesta(0);
    }
   }
  }
 }
 
 function setFotoPropuesta(bit) {
  var formData = new FormData();
  formData.append('idFotoPropuesta', $("#idFotoPropuesta").val());
  formData.append('bit', bit);
  formData.append('motivoRechazo', $("#motivoRechazoFoto").val());
 
 
  $.ajax({
   url: base_url + 'Alumno/setFotoPropuesta',
   data: formData,
   type: 'POST',
   dataType: 'json',
   cache: false,
   contentType: false,
   processData: false,
 
   error: function (jqXhr) {
    if (jqXhr.responseText == "REDIRECT") {
     parent.location = base_url;
    } else {
     $("#responseModalSetImage").show();
     $("#responseModalSetImage").attr('class', 'alert alert-warning')//.toggleClass('');
     $("#responseModalSetImage").html(jqXhr.responseText);
    }
   },
   success: function (result) {
    if (result == "REDIRECT") {
     parent.location = base_url;
    } else {
     $("#responseModalSetImage").show();
     $("#responseModalSetImage").attr("class", "alert " + result['class']);//.toggleClass();
     $("#responseModalSetImage").html(result['mensaje']);
 
     $('#trValidaFotoPropuesta').css('display', 'none');
 
     if (bit) {
      $('#fotoOficial').attr("src", $('#fotoPropuesta').attr("src"));
      $('#imagenExpediente').attr("src", $('#fotoPropuesta').attr("src"));
 
     } else {
      $('#motivoRechazoDiv').css('display', '');
      $('#tdMotivoRechazo').html('Motivo rechazo: ' + $('#motivoRechazoFoto option:selected').text());
     }
 
    }
 
   }
  });
 }
 
 
 
 function checaRangoEdad() {
  fechaNac = $('#fechaNac').val();
  nivel = $("#grupo_crea_expediente option:selected").attr("nivel");
  grado = $("#grupo_crea_expediente option:selected").attr("grado");
  //alert(fechaNac);
  if (fechaNac != "" && nivel != null && grado != null) {
   if (!esEdadValida(fechaNac, nivel, grado)) {
 
    alert("La edad permitida para este nivel,grado es de (" + edadPermitida + " años) cumplidos al 31 de diciembre del presente año.")
    $('#dispensaEdad').css('display', '');
    $('#dispensaEdadCheck').attr('checked', false);
   } else {
    $('#dispensaEdad').css('display', 'none');
    $('#dispensaEdadCheck').attr('checked', false);
 
   }
  }
 
 }
 
 function calculaIMC(n) {
  imc = (($("#peso" + n).val()) / (Math.pow((Number($("#estatura" + n).val()) / 100), 2))).toFixed(2);
 
  //alert(imc);
 
  if (isNaN(imc) || imc < 0 || $("#estatura" + n).val() == "")
   imc = 0;
 
  //alert(getEdad($('#fechaNac').val())+' / '+$('#genero').val()+' / '+imc )
 
  //alert(imc);
  //alert(warning)
  if (imc > 0) { //parece que 3 es el valor minimo calculable
   $("#imc" + n).val(imc);
 
 
   nivelImc = getEstatusIMC(getEdad($('#fechaNac').val(), n), $('#genero').val(), imc, $("#peso" + n).val());
 
   $("#labelEstatusIMC" + n).html(nivelesImc[nivelImc - 1]['descripcion']);
   $("#estatusIMC" + n).val(nivelImc);
 
   switch (nivelImc) {
    case 1:
     $('#div_imc' + n).attr('class', 'alert alert-danger');
     break;
    case 2:
     $('#div_imc' + n).attr('class', 'alert alert-success');
     break;
    case 3:
     $('#div_imc' + n).attr('class', 'alert alert-warning');
     break;
    case 4:
     $('#div_imc' + n).attr('class', 'alert alert-danger');
     break;
    default:
     $('#div_imc' + n).attr('class', '');
   }
  } else {
   //$("#labelEstatusIMC" + n).html('');
   $("#imc" + n).val('');
   $("#estatusIMC" + n).val('');
   $('#div_imc' + n).attr('class', '');
   $("#labelEstatusIMC" + n).html('');
  }
 
 }
 
 function formatStringDate(string){
     r="";
     a = string.split("/");
     if(a[2]) r=a[2]+'-'+a[1]+'-'+a[0];
     return r;
 }
 
 function getEdad(bday, numRegistro) { // birthday is a date
  birthday_ = formatStringDate(bday);
  fechaRegistro_ = formatStringDate($('#fecha' + numRegistro).val());
 
  var birthday = new Date(birthday_);
  var fechaRegistro = new Date(fechaRegistro_);
 
  var ageDifMs = fechaRegistro - birthday;
  var anios = 0;
  //alert(ageDifMs);
  if (ageDifMs > 0) {
   //var ageDifMs = Date.now() - birthday;
 
   var ageDate = new Date(ageDifMs); // miliseconds from epoch
 
   var mes = 0.9;
   if ((ageDate.getUTCMonth() + 1) < 9)
    mes = ((ageDate.getUTCMonth() + 1) / 10);
 
   anios = (Math.abs(ageDate.getUTCFullYear() - 1970) + mes);
  }
  $('#fecha' + numRegistro).attr('title', 'A los ' + anios + ' años de edad.')
 
  return anios;
 }
 
 estatusIMC = [];
 
 estatusIMC["1"] = {M: {desnutricion: '7.9', normal: '8.9', sobrepeso: '10.1', obesidad: '11.5'},
  H: {desnutricion: '8.6', normal: '9.6', sobrepeso: '10.8', obesidad: '12'}};
 estatusIMC["1.6"] = {M: {desnutricion: '9.1', normal: '10.2', sobrepeso: '11.6', obesidad: '13.2'},
  H: {desnutricion: '9.8', normal: '10.9', sobrepeso: '12.2', obesidad: '13.7'}};
 estatusIMC["2"] = {M: {desnutricion: '10.2', normal: '11.5', sobrepeso: '13', obesidad: '14.8'},
  H: {desnutricion: '10.8', normal: '12.2', sobrepeso: '13.6', obesidad: '15.3'}};
 estatusIMC["2.6"] = {M: {desnutricion: '11.2', normal: '12.7', sobrepeso: '14.4', obesidad: '16.5'},
  H: {desnutricion: '11.8', normal: '13.3', sobrepeso: '15', obesidad: '16.9'}};
 estatusIMC["3"] = {M: {desnutricion: '12.2', normal: '13.9', sobrepeso: '15.8', obesidad: '18.1'},
  H: {desnutricion: '12.7', normal: '14.3', sobrepeso: '16.2', obesidad: '18.3'}};
 estatusIMC["3.6"] = {M: {desnutricion: '13.1', normal: '15', sobrepeso: '17.2', obesidad: '19.8'},
  H: {desnutricion: '13.6', normal: '15.3', sobrepeso: '17.4', obesidad: '19.7'}};
 estatusIMC["4"] = {M: {desnutricion: '14', normal: '16.1', sobrepeso: '18.5', obesidad: '21.5'},
  H: {desnutricion: '14.4', normal: '16.3', sobrepeso: '18.6', obesidad: '21.2'}};
 estatusIMC["4.6"] = {M: {desnutricion: '14.9', normal: '17.2', sobrepeso: '19.9', obesidad: '23.2'},
  H: {desnutricion: '15.2', normal: '17.3', sobrepeso: '19.8', obesidad: '22.7'}};
 estatusIMC["5"] = {M: {desnutricion: '15.8', normal: '18.2', sobrepeso: '21.2', obesidad: '24.9'},
  H: {desnutricion: '16.0', normal: '18.3', sobrepeso: '21.0', obesidad: '24.2'}};
 estatusIMC["5.6"] = {M: {desnutricion: '12.7', normal: '15.2', sobrepeso: '16.9', obesidad: '19'},
  H: {desnutricion: '13.0', normal: '15.3', sobrepeso: '16.7', obesidad: '18.4'}};
 estatusIMC["6"] = {M: {desnutricion: '12.7', normal: '15.3', sobrepeso: '17.0', obesidad: '19.2'},
  H: {desnutricion: '13.0', normal: '15.3', sobrepeso: '16.8', obesidad: '18.5'}};
 estatusIMC["6.6"] = {M: {desnutricion: '12.7', normal: '15.3', sobrepeso: '17.1', obesidad: '19.5'},
  H: {desnutricion: '13.1', normal: '15.4', sobrepeso: '16.9', obesidad: '18.7'}};
 estatusIMC["7"] = {M: {desnutricion: '12.7', normal: '15.4', sobrepeso: '17.3', obesidad: '19.8'},
  H: {desnutricion: '13.1', normal: '15.5', sobrepeso: '17.0', obesidad: '19.0'}};
 estatusIMC["7.6"] = {M: {desnutricion: '12.8', normal: '15.5', sobrepeso: '17.5', obesidad: '20.1'},
  H: {desnutricion: '13.2', normal: '15.6', sobrepeso: '17.2', obesidad: '19.3'}};
 estatusIMC["8"] = {M: {desnutricion: '12.9', normal: '15.7', sobrepeso: '17.7', obesidad: '20.6'},
  H: {desnutricion: '13.3', normal: '15.7', sobrepeso: '17.4', obesidad: '19.7'}};
 estatusIMC["8.6"] = {M: {desnutricion: '13.0', normal: '15.9', sobrepeso: '18.0', obesidad: '21.0'},
  H: {desnutricion: '13.4', normal: '15.9', sobrepeso: '17.7', obesidad: '20.1'}};
 estatusIMC["9"] = {M: {desnutricion: '13.1', normal: '16.1', sobrepeso: '18.3', obesidad: '21.5'},
  H: {desnutricion: '13.5', normal: '16.0', sobrepeso: '17.9', obesidad: '20.5'}};
 estatusIMC["9.6"] = {M: {desnutricion: '13.3', normal: '16.3', sobrepeso: '18.7', obesidad: '22.0'},
  H: {desnutricion: '13.6', normal: '16.2', sobrepeso: '18.2', obesidad: '20.9'}};
 estatusIMC["10"] = {M: {desnutricion: '13.5', normal: '16.6', sobrepeso: '19.0', obesidad: '22.6'},
  H: {desnutricion: '13.7', normal: '16.4', sobrepeso: '18.5', obesidad: '21.4'}};
 estatusIMC["11"] = {M: {desnutricion: '13.9', normal: '17.2', sobrepeso: '19.9', obesidad: '23.7'},
  H: {desnutricion: '14.1', normal: '16.9', sobrepeso: '19.2', obesidad: '22.5'}};
 estatusIMC["12"] = {M: {desnutricion: '14.4', normal: '18.0', sobrepeso: '20.8', obesidad: '25.0'},
  H: {desnutricion: '14.5', normal: '17.5', sobrepeso: '19.9', obesidad: '23.6'}};
 estatusIMC["13"] = {M: {desnutricion: '14.9', normal: '18.8', sobrepeso: '21.8', obesidad: '26.2'},
  H: {desnutricion: '14.9', normal: '18.2', sobrepeso: '20.8', obesidad: '24.8'}};
 estatusIMC["14"] = {M: {desnutricion: '15.4', normal: '19.6', sobrepeso: '22.7', obesidad: '27.3'},
  H: {desnutricion: '15.5', normal: '19.0', sobrepeso: '21.8', obesidad: '25.9'}};
 estatusIMC["15"] = {M: {desnutricion: '15.9', normal: '20.2', sobrepeso: '23.5', obesidad: '28.2'},
  H: {desnutricion: '16.0', normal: '19.8', sobrepeso: '22.7', obesidad: '27.0'}};
 estatusIMC["16"] = {M: {desnutricion: '16.2', normal: '20.7', sobrepeso: '24.1', obesidad: '28.9'},
  H: {desnutricion: '16.5', normal: '20.5', sobrepeso: '23.5', obesidad: '27.9'}};
 estatusIMC["17"] = {M: {desnutricion: '16.4', normal: '21.0', sobrepeso: '24.5', obesidad: '29.3'},
  H: {desnutricion: '16.9', normal: '21.1', sobrepeso: '24.3', obesidad: '28.6'}};
 estatusIMC["18"] = {M: {desnutricion: '16.4', normal: '21.3', sobrepeso: '24.8', obesidad: '29.5'},
  H: {desnutricion: '17.3', normal: '21.7', sobrepeso: '24.9', obesidad: '29.2'}};
 estatusIMC["19"] = {M: {desnutricion: '16.5', normal: '21.4', sobrepeso: '25.0', obesidad: '29.7'},
  H: {desnutricion: '17.6', normal: '22.2', sobrepeso: '25.4', obesidad: '29.7'}};
 estatusIMC["20"] = {M: {desnutricion: '18.5', normal: '21', sobrepeso: '25', obesidad: '30'},
  H: {desnutricion: '18.5', normal: '', sobrepeso: '25', obesidad: '30'}};
 
 
 
 
 
 
 //function getEstatusIMC(edad,sexo,imc){
 function getEstatusIMC(edad, sexo, imc, peso) {
 
 
  estatus = null;
  breakExc = {};
 
 
  key = 1;
 
 
  try {
   ((Object.keys(estatusIMC)).sort(function (a, b) {
    return a - b;
   })).reverse().forEach(
           function (e) {
            if (Number(edad) >= Number(e)) {
             key = e;
             throw breakExc;
            }
           }, estatusIMC);
  } catch (e) {
   if (e !== breakExc)
    throw e;
  }
 
 
  //	alert('edad:'+edad+' sexo:'+sexo+'imc:'+imc+'key:'+key)
  if (Number(edad) < 5.6) {
 
   if (Number(peso) < Number(estatusIMC[key][sexo].desnutricion))
    estatus = 1;
 
   if (Number(peso) >= Number(estatusIMC[key][sexo].desnutricion) && Number(peso) <= Number(estatusIMC[key][sexo].sobrepeso))
    estatus = 2;
 
   if (Number(peso) > Number(estatusIMC[key][sexo].sobrepeso) && Number(peso) <= Number(estatusIMC[key][sexo].obesidad))
    estatus = 3;
 
   if (Number(peso) > Number(estatusIMC[key][sexo].obesidad))
    estatus = 4;
  } else {
 
   if (Number(imc) < Number(estatusIMC[key][sexo].desnutricion))
    estatus = 1;
 
   if (Number(imc) >= Number(estatusIMC[key][sexo].desnutricion) && Number(imc) <= Number(estatusIMC[key][sexo].sobrepeso))
    estatus = 2;
 
   if (Number(imc) > Number(estatusIMC[key][sexo].sobrepeso) && Number(imc) <= Number(estatusIMC[key][sexo].obesidad))
    estatus = 3;
 
   if (Number(imc) > Number(estatusIMC[key][sexo].obesidad))
    estatus = 4;
  }
 
  return estatus;
 
 }
 
 function enableDisableDomTutor(n, bit) {
  $("#calleTutor" + n).attr('readonly', bit);
  $("#numeroTutor" + n).attr('readonly', bit);
  $("#coloniaTutor" + n).attr('readonly', bit);
  $("#telefonoDomTutor" + n).attr('readonly', bit);
  $("#paisDomTutor" + n).prop("disabled", bit);
  $("#entidadDomTutor" + n).prop("disabled", bit);
  $("#municipioDomTutor" + n).prop("disabled", bit);
  $("#localidadDomTutor" + n).prop("disabled", bit);
 }
 
 function viveConAlumno(checked, n) {
  if (checked) {
   $("#calleTutor" + n).val($("#calle").val());
   $("#numeroTutor" + n).val($("#num_ext").val());
   $("#coloniaTutor" + n).val($("#colonia").val());
   $("#telefonoDomTutor" + n).val($("#telefono").val());
   $("#paisDomTutor" + n).val($("#paisDomicilio").val());
   $("#entidadDomTutor" + n).val($("#entidad").val());
   seleccionaEntidadDom($("#entidad").val(), 'DomTutor' + n, $("#municipio").val());
   seleccionaMunicipioDom($("#municipio").val(), 'DomTutor' + n, $("#localidad").val());
   enableDisableDomTutor(n, true);
 
  } else {
   $("#calleTutor" + n).val("");
   $("#numeroTutor" + n).val("");
   $("#coloniaTutor" + n).val("");
   $("#telefonoDomTutor" + n).val("");
   $("#paisDomTutor" + n).val("");
   $("#entidadDomTutor" + n).val("");
   $("#municipioDomTutor" + n).val("");
   $("#localidadDomTutor" + n).val("");
   enableDisableDomTutor(n, false);
 
  }
 
 
 
 }
 
 
 function verificaGenerarClave(numTutor) {
 
  if (($('#nombreTutor' + numTutor).val()).trim() == "" || ($('#apellido1Tutor' + numTutor).val()).trim() == "") {
   $('#generaClave' + numTutor).css("display", 'none');
   $('#clavePaceTutor' + numTutor).val('');
 
  } else {
   $('#generaClave' + numTutor).css("display", '');
   $('#clavePaceTutor' + numTutor).val($('#_clavePaceTutor' + numTutor).val());
  }
 }
 
 function validaDivCamUsaer(e) {
 
 
  if (e.value == "") {
   $('#div_cam_usaer').css("display", 'none');
   $('input[name="cam_usaer"][value="0"]').attr('checked', false);
   $('input[name="cam_usaer"][value="1"]').attr('checked', false)
  } else {
   $('#div_cam_usaer').css("display", '');
  }
 
 }
 
 function verDocumento() {
 
  if (document.getElementById('documentos').value != "") {
   $("#wait").modal("show");
   idDoc = $("#documentos").val();
   idAlumno = $("#idalumnoOtros").val();
   //alert(idDoc);
 
   $.ajax({
    url: base_url + 'Alumno/getDocumentoDigital/' + idAlumno + '/' + idDoc,
    type: 'POST',
    dataType: 'json',
    //data:"curp="+curp,
    error: function (jqXhr) {
     if (jqXhr.responseText == "REDIRECT") {
      parent.location = base_url;
     } else {
      alert("Error:" + jqXhr.responseText);
     }
    },
    success: function (result) {
     if (result == "REDIRECT") {
      parent.location = base_url;
     } else {
      //alert(result['existe']);
      if (result != "") {
       if (result['success']) {
 
 
        $("#img_docDig").load(function () {
         $(this).attr("src", "data:image/jpeg;base64," + result['imagen']);
         $('#modalDocumentoDigital').find('.modal-dialog').css({width: this.clientWidth + 40, height: this.clientHeight + 40});
        });
 
        $("#img_docDig").load();
 
 
        $("#modalDocumentoDigital").modal();
 
 
       }
       else alert("No existe documento digital.")
 
      } else {
       alert("Error al cargar documento.");
      }
 
     }
     $("#wait").modal("hide");
    }
   });
  } else{
   alert("seleccione documento");
  }
 }
 
 
 function validaCURP1(formId, validate) {
   // alert("llegue a la funcion");
     // alert("Pendiente");
 
 
 }
 
 function validaCURP2(formId, validate) {
   // alert("llegue a la funcion");
     // alert("Pendiente");
 
 
 }