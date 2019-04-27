function buscarAlumno(forma,tipo)
{
  $("#tipobusqueda").val(tipo);
  limpiaCamposNombre();
  $("#form_buscar_alumno").submit();
}
function limpiaCamposNombre()
{
  document.getElementById('nombre').value = quitaEspaciosEnBlanco(document.getElementById('nombre').value);
  document.getElementById('apell1').value = quitaEspaciosEnBlanco(document.getElementById('apell1').value);
  document.getElementById('apell2').value = quitaEspaciosEnBlanco(document.getElementById('apell2').value);
}
function quitaEspaciosEnBlanco(pString)
{
  return $.trim(pString.replace(/\s\s+/g, ' '));
}
function solicitaAlumno(forma,idalumno,altapararegu)
{
  document.getElementById('idalumno').value = idalumno;
  if (altapararegu == true)
  {
    document.getElementById('altapararegu').value = '1';
  }
  else
  {
    document.getElementById('altapararegu').value = '0';
  }
  forma.submit();
}
function deshabilitar_controles_para_solicitud()
{
  $("#tipo").attr("disabled",true);
  $("#nombre").attr("readonly",true);
  $("#apell1").attr("readonly",true);
  $("#apell2").attr("readonly",true);
  $("#fechanac").attr("readonly",true);
  $("#genero").attr("disabled",true);

  if ($("#idalumno").val() !== "0")
  {
    $("#paisnac").attr("disabled",true);
    $("#entidadnac").attr("disabled",true);
    $("#curp").attr("readonly",true);
    $("#botonRenapo").attr("disabled",true);
    $("#botonGenerar").attr("disabled",true);
    $("#idtransnacional").attr("disabled",true);
  }
  else
  {
    if ($("#paisnac").val() == "151")
    {
      $("#entidadnac").attr("disabled",false);
    }
    else
    {
      $("#entidadnac").attr("disabled",true);
    }
  }
}
function deshabilitar_controles_para_solicitud_sup()
{
  $("#tipo").attr("disabled",true);
  $("#nombre").attr("readonly",true);
  $("#apell1").attr("readonly",true);
  $("#apell2").attr("readonly",true);
  $("#fechanac").attr("readonly",true);
  $("#genero").attr("disabled",true);
  $("#paisnac").attr("disabled",true);
  $("#entidadnac").attr("disabled",true);
  $("#curp").attr("readonly",true);
  $("#botonRenapo").attr("disabled",true);
  $("#botonGenerar").attr("disabled",true);
  $("#idgrupo").attr("disabled",true);
  $("#idtransnacional").attr("disabled",true);
  $("#datosadicionales").attr("readonly",true);
}
function habilitar_controles_de_solicitud()
{
  $("#tipo").attr("disabled",false);
  $("#nombre").attr("readonly",false);
  $("#apell1").attr("readonly",false);
  $("#apell2").attr("readonly",false);
  $("#fechanac").attr("readonly",false);
  $("#genero").attr("disabled",false);
  $("#paisnac").attr("disabled",false);
  $("#curp").attr("readonly",false);
  $("#botonRenapo").attr("disabled",true);
  $("#botonGenerar").attr("disabled",false);
  $("#idtransnacional").attr("disabled",false);
  if ($("#paisnac").val() == "151")
  {
    $("#entidadnac").attr("disabled",false);
  }
  else
  {
    $("#entidadnac").attr("disabled",true);
  }
  $(":file").attr("disabled",false);
}
function grabarSolicitud(forma)
{
  habilitar_controles_de_solicitud();
  $("#form_solicitar_alumno").submit();
}
function revisaDatosParaSolicitudCompleta()
{
  var resp = true;
  var msg = "";
  if ($("#nombre").val() === "")
  {
    resp = false;
    msg = msg + "Nombre\n";
  }
  if ($("#apell1").val() === "")
  {
    resp = false;
    msg = msg + "Primer Apellido\n";
  }
  // if ($("#apell2").val() === "")
  // {
  //   resp = false;
  //   msg = msg + "Segundo Apellido\n";
  // }
  if ($("#fechanac").val() === "")
  {
    resp = false;
    msg = msg + "Fecha de Nacimiento\n";
  }
  if ($("#genero").val() === "")
  {
    resp = false;
    msg = msg + "Género\n";
  }
  if ($("#paisnac").val() === "")
  {
    resp = false;
    msg = msg + "País de Nacimiento\n";
  }
  if ($("#entidadnac").val() === "")
  {
    if ($("#paisnac").val() === "151")
    {
      resp = false;
      msg = msg + "Entidad de Nacimiento\n";
    }
  }
  if ($("#curp").val() === "")
  {
    resp = false;
    msg = msg + "Curp\n";
  }
  if ($("#idgrupo").val() === "")
  {
    resp = false;
    msg = msg + "Grupo\n";
  }
  if (msg !== "")
  {
    resp = false;
    bootbox.alert({
      message: "<br><b>Revise lo siguiente antes de continuar. "+msg+"</b>",
      size: 'small'
    });


  }
  return resp;
}
function modificarSolicitud(forma,idsolicitud,estatus)
{


bootbox.confirm({
    message: '¿Desea modificar la solicitud?',
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
          document.getElementById('tipoaccion').value = 'modificar';
          document.getElementById('idsolicitud').value = idsolicitud;
          document.getElementById('estatus').value = estatus;
          forma.submit();
        }
    }
});


/*
  if (confirm("Desea modificar la solicitud?") == true)
  {
    document.getElementById('tipoaccion').value = 'modificar';
    document.getElementById('idsolicitud').value = idsolicitud;
    document.getElementById('estatus').value = estatus;
    forma.submit();
  }*/
}
function consultarSolicitud(forma,idsolicitud,estatus,idcentrocfg)
{
  document.getElementById('tipoaccion').value = 'consultar';
  document.getElementById('idsolicitud').value = idsolicitud;
  document.getElementById('estatus').value = estatus;
  document.getElementById('idcentrocfgsup').value = idcentrocfg;
  forma.submit();
}
function eliminarSolicitud(forma,idsolicitud,estatus)
{
/////////////
bootbox.confirm({
    message: 'Se va a eliminar la solicitud, ¿Desea continuar?',
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
          document.getElementById('tipoaccion').value = 'eliminar';
          document.getElementById('idsolicitud').value = idsolicitud;
          document.getElementById('estatus').value = estatus;
          forma.submit();
        }
    }
});
////////////

  /*
  if (confirm("Se va a eliminar la solicitud. Desea continuar?") == true)
  {
    document.getElementById('tipoaccion').value = 'eliminar';
    document.getElementById('idsolicitud').value = idsolicitud;
    document.getElementById('estatus').value = estatus;
    forma.submit();
  }*/
}
function transferirAlumno(forma,idsolicitud,estatus)
{
////////////
bootbox.confirm({
    message: '¿Se va a transferir al alumno, Desea continuar?',
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
          document.getElementById('tipoaccion').value = 'transferir';
          document.getElementById('idsolicitud').value = idsolicitud;
          document.getElementById('estatus').value = estatus;
          forma.submit();
        }
    }
});
///////////

/*  if (confirm("Se va a transferir al alumno. Desea continuar?") == true)
  {
    document.getElementById('tipoaccion').value = 'transferir';
    document.getElementById('idsolicitud').value = idsolicitud;
    document.getElementById('estatus').value = estatus;
    forma.submit();
  }*/
}
function rechazarSolicitud(forma,idsolicitud,estatus)
{
/////////////
bootbox.confirm({
    message: 'Se va a rechazar la solicitud, ¿Desea continuar?',
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
          document.getElementById('tipoaccion').value = 'rechazar';
          document.getElementById('idsolicitud').value = idsolicitud;
          document.getElementById('estatus').value = estatus;
          forma.submit();
        }
    }
});
////////////
  /*if (confirm("Se va a rechazar la solicitud. Desea continuar?") == true)
  {
    document.getElementById('tipoaccion').value = 'rechazar';
    document.getElementById('idsolicitud').value = idsolicitud;
    document.getElementById('estatus').value = estatus;
    forma.submit();
  }*/
}
function presionoBotonGenerarCurp()
{
  var curp = "";
  if (revisaDatosParaCurpCompleta())
  {
    var strAnio = $("#fechanac").val().substr(0,4);
    var strMes = $("#fechanac").val().substr(5,2);
    var strDia = $("#fechanac").val().substr(8,2);
    var strSexo = $("#genero").val();
    var strEstado = ($("#paisnac").val() === "151") ? $("#entidadnac option:selected").attr("abrev") : "NE";

    var objParam = {
      nombre : $("#nombre").val(),
      apellido_paterno : $("#apell1").val(),
      apellido_materno : $("#apell2").val(),
      sexo : strSexo,
      estado : strEstado,
      fecha_nacimiento : [strDia, strMes, strAnio],
      homonimia : "-"
    };

    curp = generaCurp(objParam);
    if (curp !== false)
    {
      $("#curp").val(curp);
      //var validator = $( "#form_solicitar_alumno" ).validate();
      $("#curp").valid();
      //validator.form();
    }
    else
    {
      curp = "";
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
  $("#curp").val(curp);
}
function revisaDatosParaCurpCompleta()
{
  var resp = true;
  var msg = "";
  if ($("#nombre").val() === "")
  {
    resp = false;
    msg = msg + "Nombre\n";
  }
  if ($("#apell1").val() === "")
  {
    resp = false;
    msg = msg + "Primer Apellido\n";
  }
  // if ($("#apell2").val() === "")
  // {
  //   resp = false;
  //   msg = msg + "Segundo Apellido\n";
  // }
  if ($("#fechanac").val() === "")
  {
    resp = false;
    msg = msg + "Fecha de Nacimiento\n";
  }
  if ($("#genero").val() === "")
  {
    resp = false;
    msg = msg + "Género\n";
  }
  if ($("#paisnac").val() === "")
  {
    resp = false;
    msg = msg + "País de Nacimiento\n";
  }
  else
  {
    if ($("#paisnac").val() === "151")
    {
      if ($("#entidadnac").val() === "")
      {
        resp = false;
        msg = msg + "Entidad de Nacimiento\n";
      }
    }
  }
  if (msg !== "")
  {
    resp = false;
    bootbox.alert({
      message: "<br><b>Revise lo siguiente para generar la curp: "+msg+"</b>",
      size: 'small'
    });

  }
  return resp;
}
function llena_cat_asignaturas_ext()
{
  if ($("#gradoext").val() =="" || $("#idplanext").val() =="" )
  {
    $("#idasigext").innerHTML = "<option></option>";
  }
  else
  {
    $("#idasigext").load(base_url + "Solicitud/asignaturasext/" + $("#gradoext").val() + "/" + $("#idplanext").val());
  }
}

function cargaImagen(idrequisito)
{
  if (revisaSePuedeCargarRequisito(idrequisito))
  {
    // $("#descrReq1").text($("#idReqGral").attr("descrip"));
    $("#idReqSolNvo"+idrequisito).val($("#idReqGral").val());

    var fileObj = document.getElementById("fileImgReq"+idrequisito);
    var f = fileObj.files[0];
    var imgObj = document.getElementById("imgReq"+idrequisito);
    var reader = new FileReader();
    reader.onload = (function(theFile)
    {
      return function(e)
      {
        imgObj.src = e.target.result;
        $("#areaReq"+idrequisito).show();
      };
    })(f);
    reader.readAsDataURL(f);
    $("#idReqGral").val("");
    $("span[es_un_file_group='1']").hide();
    $("#fileGroup0").show();
    //$("#fileImgReq"+idrequisito).attr("disabled",true);
  }
}

function revisaSePuedeCargarRequisito(idrequisito)
{
  var resp = false;
  if ($("#idReqGral").val() == "0")
  {
    alert("No ha seleccionado el tipo de requisito.");
  }
  else
  {
    var fileObj = document.getElementById("fileImgReq"+idrequisito);
    if (fileObj != null)
    {
      if (fileObj.files.length > 0)
      {
        var f = fileObj.files[0];
        if (!f.type.match('image.*'))
        {
          bootbox.alert({
            message: "<br><b>El archivo que seleccionó no es una imagen.</b>",
            size: 'small'
          });

        }
        else
        {
          if (f.size > 100000)
          {
            bootbox.alert({
              message: "<br><b>El archivo que seleccionó es muy grande.</b>",
              size: 'small'
            });

          }
          else
          {
            resp = true;
          }
        }
      }
    }
  }
  return resp;
}

function eliminarReq(idrequisito)
{
  if ($("#idReqSolEnDb"+idrequisito).val() != "")
  {
    $("#eliminarReqEnDb"+idrequisito).val("1");
  }
  $("#areaReq"+idrequisito).hide();
  $("#imgReq"+idrequisito).attr("src","");
  $("#fileImgReq"+idrequisito).val("");
  $("#idReqGral").val("");
  $("span[es_un_file_group='1']").hide();
  $("#fileGroup0").show();

  // $("#imagen1").attr("src","");
  // $("#fileImg1").val("");
  // $("#thumbnail1").hide();
  // $("#idrequisito1").val("");
  // $("#seleccionaReq1").hide();
}
