function presionobotonbuscar()
{
    if (revisadatosparabusquedacompleta() === true)
    {
        $('#myformparametros').submit();
    }
}
function revisadatosparabusquedacompleta()
{
  var resp = true;
  var msg = "";
  if ($("#nivel").val() === "")
  {
    resp = false;
    msg = msg + "Nivel\n";
  }
  if ($("#tipo").val() === "")
  {
    resp = false;
    msg = msg + "Tipo\n";
  }
  if ($("#fechaini").val() === "")
  {
    resp = false;
    msg = msg + "Fecha Inicial\n";
  }
  if ($("#fechafin").val() === "")
  {
    resp = false;
    msg = msg + "Fecha Final\n";
  }
  if (msg !== "")
  {
    resp = false;
    alert("Revise lo siguiente antes de continuar:\n" + msg);
  }
  return resp;
}

function buscaCT(target)
{
  if(target=="_filtro")
  {
    $("#nivelModalCT").val($("#nivel").val());
    $("#zonaModalCT").val($("#zona").val());
  }
  $("#onclick_modal").attr("onclick","buscaCT('"+target+"')");
  $("#wait").modal("show");
  $("#modalBuscaCT").modal("show");

  var forma = $("#modalEscuela").serialize();
  $.ajax({
    url: base_url+"Solicitudes/ajaxCT/"+target,
    data:forma,
    type:'POST',
    error:function(jqXhr){
      if(jqXhr.responseText == "REDIRECT")
      {
        parent.location=base_url;
      }
      else
      {
        if(jqXhr.responseText=="")
        {
          jqXhr.responseText="<tr><td colspan='8'><div class='alert alert-warning'>No hay registros</div></td></tr>";
        }
        $( "#tbodyBuscaCT" ).html(jqXhr.responseText);
        $("#wait").modal("hide");
      }
    },
    success: function(result){
      if(result == "REDIRECT")
      {
        parent.location=base_url;
      }
      else
      {
        $("#modalBuscaCT").modal("show");
        $( "#tbodyBuscaCT" ).html(result);
        $("#wait").modal("hide");
      }
    }
  });
}

function removeCT(target)
{
  document.getElementById('cct'+target).value="";
  if(target=="_filtro")
  {
    document.getElementById('idcentrocfg').value="";
    $("#idcentrocfg").val("");
  }
}

function seleccionaCT(idctcfg,cct,target,subfijo)
{
  document.getElementById('cct'+target).value=cct;
  $("#idcentrocfg").val(idctcfg);
  $('#modalBuscaCT').modal('hide');
}