$( document ).ready(function() {
    $("#div_reporte_por_grupo").hide();
    $("#div_reporte_por_alumno").hide();
});

function removeOption(obj,val) {
  var i;
  for (i = 0; i < obj.length; i++) {
  if(val==obj.options[i].value){
	obj.remove(i);
	break;
   }
  }
};

$("#nivel_filtro").change(function(){
    var selnivel=document.getElementById("nivel_filtro");
	muestra_oculta_reports();
    if(selnivel.value.toUpperCase()==="PREE"){
        document.getElementById("reporte_por_grupo").appendChild(getOption("Gafete de alumno","gafete_grupo",false,false,""));
	}else removeOption(document.getElementById("reporte_por_grupo"),"gafete_grupo");
});
$("#grupo").change(function(){

    muestra_oculta_reports();
});
$("#grupo_filtro").change(function(){
	muestra_oculta_reports();
  /*var selected = $(':selected', this);
    // alert(selected.closest('optgroup').attr('label'));

    if(selected.closest('optgroup').attr('label') == 'Grupos'){
      $("#div_reporte_por_grupo").show();
      muestra_oculta_reports();
    }else{
      $("#div_reporte_por_grupo").hide();
    }*/
});

/*$("#estatus").change(function(){
    muestra_oculta_reports();
});
$("#reporte_por_alumno").change(function(){
    muestra_oculta_bimestre();
});
*/
//$(document).on('click',"#btn_reporte_por_grupo",function(e){
//$("#btn_reporte_por_grupo").click(function(e){
function btn_reporte_por_grupo_click(){
    //e.preventDefault();
    var reporte_por_grupo = document.getElementById("reporte_por_grupo").value;
    var grupo_nombre =  (($("#grupo").length)? $("#grupo option:selected").text():(($("#grupo_filtro").length)? $("#grupo_filtro option:selected").text():""));
    if(reporte_por_grupo.trim().length==0 ||  reporte_por_grupo=="" ){
      bootbox.alert({
           message: "<br><b>Seleccione un tipo de reporte para el grupo seleccionado "+grupo_nombre+"</b>",
           size: 'small'
         });
        }else{
      var report = new Reportes();
      report.get_reporte_por_grupo();
    }
};

//$(document).on('click',"#btn_reporte_por_alumno",function(e){
//$("#btn_reporte_por_alumno").click(function(e){
function btn_reporte_por_alumno_click(){
    //e.preventDefault();
    var reporte_por_alumno = document.getElementById("reporte_por_alumno").value;
    if(arraySelected.length===0){
      bootbox.alert({
           message: "<br><b>Seleccione al menos un alumno de la lista.</b>",
           size: 'small'
         });

        return;
    }else if(arraySelected.length===1){
        if(reporte_por_alumno.trim().length==0 ||  reporte_por_alumno=="" ){
          bootbox.alert({
               message: "<br><b>Seleccione un tipo de reporte para el alumno seleccionado.</b>",
               size: 'small'
             });

          return;
        }else{
          var report = new Reportes();
          report.get_reporte_por_alumno();
        }
    }else{
      if(reporte_por_alumno.trim().length==0 ||  reporte_por_alumno=="" ){
          bootbox.alert({
               message: "<br><b>Seleccione un tipo de reporte para los alumnos seleccionados.</b>",
               size: 'small'
             });

          return;
        }else{
          var report = new Reportes();
          report.get_reporte_por_alumno();
        }
    }
};

function muestra_oculta_bimestre(){
    var reporte_por_alumno = $("#reporte_por_alumno").val();
    if(reporte_por_alumno=="evalinternoxalumno" ){
      $("#div_reporte_bimestre").show();
    }else{
      $("#div_reporte_bimestre").hide();
    }
}
function muestra_oculta_reports(){
 $("#div_reporte_por_grupo").hide();
  if($("#grupo").length){ // Si existe el elemento regresa true
      if( ($("#grupo").val()!="" || $("#grupo").val().trim().length>0) && $("#estatus").val()!="B" && $("#estatus").val()!="" ){
       // $("#div_reporte_por_grupo").show();
	    var label_grupo_oclub = $('#grupo :selected').parent().attr('label');
        if(label_grupo_oclub == 'Clubes'){
          $("#div_reporte_por_grupo").hide();
        }else{
          $("#div_reporte_por_grupo").show();
        }
      }else{
          $("#div_reporte_por_grupo").hide();
      }
  }
  else if ($("#grupo_filtro").length) {
      if( ($("#grupo_filtro").val()!="" || $("#grupo_filtro").val().trim().length>0) && $("#estatus").val()!="B" && $("#estatus").val()!="" ){
        $("#div_reporte_por_grupo").show();
      }else{
          $("#div_reporte_por_grupo").hide();
      }
  }
}// muestra_oculta_reports()


function validaConsultaAlumno(forma){

    //alert(forma.ciclo+forma.apellido1+forma.apellido2+forma.nombre+forma.curp);
    if (forma.cct_filtro && (forma.cct_filtro.value=="" && (forma.nombre.value == "" || forma.apellido1.value == "") ) ){

        bootbox.alert({
          message: "<br><b>Seleccione escuela o nombre y apellido1 del alumno</b>",
          size: 'small'
        });
    }
    else if(( !forma.cct_filtro || (forma.cct_filtro && forma.cct_filtro.value=="")) && ( !forma.grupo || (forma.grupo && forma.grupo.value=="")) && forma.ciclo.value=="" && forma.apellido1.value=="" && forma.apellido2.value=="" && forma.nombre.value=="" && forma.curp.value=="" && forma.estatus.value==""){
      bootbox.alert({
        message: "<br><b>Seleccione al menos un parámetro de búsqueda.</b>",
        size: 'small'
});
    }
    else{

       $("#filtros_busqueda").collapse('hide');
       consultaAlumnoSmartGrid();
   }
}



function consultaAlumnoSmartGrid(){
  $("#div_reporte_por_alumno").hide();
    muestra_oculta_reports();

   $("#wait").modal("show");
   var forma = $("#formaConsultaAlumnos").serialize();

   $.ajax({
            url: base_url+"Alumno/getAlumnosSmartGrid",
            data:forma,
            type:'POST',
            error:function(jqXhr){
                $("#wait").modal("hide");
                if(jqXhr.responseText == "REDIRECT"){
                         parent.location=base_url;
                     }else{
                if(jqXhr.responseText=="")jqXhr.responseText="<tr><td colspan='8'><div class='alert alert-warning'>No hay registros</div></td></tr>"
                $( "#gridConsulta" ).html(jqXhr.responseText);

            }
            },
            success: function(result){
             if(result.str_grid && result.str_grid != ""){
               if (result.esgridpaginador) {
                 $("#wait").modal("hide");
                 $( "#gridConsulta" ).empty();
                 $( "#gridConsulta_gc" ).empty();
                 $( "#gridConsulta_gc" ).append(result.str_grid);
               }
               else {
                 $("#wait").modal("hide");
                $( "#gridConsulta_gc" ).empty();
                 $( "#gridConsulta" ).empty();
                 $( "#gridConsulta" ).append(result.str_grid);
               }

             }else{
               $("#wait").modal("hide");
                    //alert(result)
                    if(result == "REDIRECT"){
                        parent.location=base_url;
                    }
                    else{
                      $( "#gridConsulta_gc" ).empty();
                    $( "#gridConsulta" ).html(result);
                }
                $("#gridConsulta input[name=checkMultiple]").each(function () { if($(this).attr("permiso")!='1') $(this).attr("disabled",true);  });
                $("#gridConsulta input[name=checkActivo]").each(function () { if($(this).attr("permiso")!='1') $(this).attr("disabled",true); });
             }
              recorre_tabla();
           }

           });

   $("#tbodyConsulta" ).show();

}




function verExpediente(idExpediente,subfijo){
    set_dynamicData();
    source = "expediente"; // "alumno" "solicitud"
    parent.location=base_url+'Alumno/expediente/'+idExpediente+'/'+subfijo;
}
//
//function verEvaluaciones(idExpediente,idGrupo,idalumno,idct){
//   set_dynamicData();
//   source = "Evaluacion"; // "alumno" "solicitud"
//   parent.location=base_url+'eval_pree/'+idExpediente+'/'+idGrupo+'/'+idalumno+'/'+idct+'/';
//}
/*
function verEvaluaciones(idExpediente,idGrupo,idalumno,idct,nivel){
   set_dynamicData();
   source = "Evaluacion"; // "alumno" "solicitud"
	switch(nivel){
		case 1:parent.location=base_url+'eval_pree/'+idExpediente+'/'+idGrupo+'/'+idalumno+'/'+idct+'/';
		break;
		case 2:parent.location=base_url+'eval_prim/'+idExpediente+'/'+idGrupo+'/'+idalumno+'/'+idct+'/0';
		break;
		case 3:parent.location=base_url+'eval_sec/'+idExpediente+'/'+idGrupo+'/'+idalumno+'/'+idct+'/0';
		break;
	}
}
*/
function verEvaluaciones(idgrupo,idexpediente,idalumno,idcentrocfg,nivel,idplan){
    // $idgrupo, $idexpediente, $idalumno, $idcentrocfg, $idnivel
   parent.location = base_url+'evaluaciones/index/'+idgrupo+'/'+idexpediente+'/'+idalumno+'/'+idcentrocfg+'/'+nivel;
}


function checkUncheckAll(e){

        $("#gridConsulta input[name=checkMultiple]").each(function () {
                $(this).prop("checked", e.checked);
        });

        showHideButtons();

}
var arraySelected = new Array();
var arrayGradosSelected =new Array();
var arraySelectedFull =new Array();
var arrayNivelesSelected = new Array();

function showHideButtons(u){


    arraySelected = [];
    arrayGradosSelected = [];
    arrayNivelesSelected = [];
    arraySelectedFull = [];


    bit = false;
    $("#gridConsulta input[name=checkMultiple]").each(function () {
        //alert($(this).prop("checked"));
                if($(this).prop("checked")){
                   bit = true;

                   idexp = $(this).attr("idexpediente");
                   subfijo = $(this).attr("subfijo");
                   $("#gridConsulta input[name=checkActivo]").each(function () {
                     if($(this).attr("idExpediente")==idexp && $(this).prop('checked')==true )
                        arraySelectedFull.push(idexp+"/"+subfijo);
                    });

                   arraySelected.push($(this).attr("idexpediente"));
                   arrayGradosSelected.push($(this).attr("grado"));
                   arrayNivelesSelected.push($(this).attr("subfijo"));
                }
      });


    if(bit){

       $('#selectionButtons').css("display","");
       $("#div_reporte_por_alumno").show();
       if(u != 1 && u != 2){
       if(todosElMismoGrado()){
          $('#cambiaGrupo_btn').prop("disabled",false);
          $('#cambiaGrupo_btn').prop("title","");
          filtraGrupos();

       }
      else{  $('#cambiaGrupo_btn').prop("disabled",true);
             $('#cambiaGrupo_btn').prop("title","Desactivado por diferencia de grados en seleccion de alumnos");
      }
       }
       else{
         if(todosElMismoNivel()){
          $('#cambiaGrupo_btn').prop("disabled",false);
          $('#cambiaGrupo_btn').prop("title","");

          filtraGrupos();

       }
      else{  $('#cambiaGrupo_btn').prop("disabled",true);
             $('#cambiaGrupo_btn').prop("title","Desactivado por diferencia de niveles en seleccion de alumnos");
      }

       }
   }
    else{
        $('#selectionButtons').css("display","none");
        $("#div_reporte_por_alumno").hide();
    }
    //alert(JSON.stringify(arraySelected));

}
var lastCheckActivo = null;

function todosElMismoGrado(){
    bit = true;
    last = arrayGradosSelected[0];
    arrayGradosSelected.forEach(function (g){
        //alert(last+'//'+g)
        if (last != g) bit=false;
    }
    );
  return bit;
}

function todosElMismoNivel(){
    bit = true;
    last = arrayNivelesSelected[0];
    arrayNivelesSelected.forEach(function (n){
        //alert(last+'//'+n)
        if (last != n) bit=false;
        $("#nivelModalCT").val(n);

    }
    );
  return bit;
}

function filtraGrupos(){
    grado = arrayGradosSelected[0];
    $("#grupo_cambio option").each(
      function (){

        if((this.text).indexOf(grado) == -1 && this.text !="")
           this.style.display='none'
        else{
            this.style.display='';
            this.selected="selected"
        }
      });
      //$("#grupo_cambio option").prop('selectedIndex',0);
}


function switchStatus(idExpediente,check){
    setStatusModalConfirmacion(check.checked)
    $("#modalBaja").modal("show");
    $("#nombreAlumnoBaja").html($("#"+idExpediente).html());

    $("#motivoBaja").val('');
    $("#bajaFisica").prop("checked",false)

    if(check.checked){
       $("#divMotivoBaja").css('display','none');
       $("#divBajaFisica").css('display','none');
    }
    else{
       $("#divMotivoBaja").css('display','');
       $("#divBajaFisica").css('display','');
    }
    reconfigureMotivosDebaja(check.attributes['subfijo'].value);
    lastCheckActivo = check;
}

function reconfigureMotivosDebaja(subfijo){
 $("#motivoBaja  option").each(function() {
  if((jQuery(this).attr('niveles'))){
   if((jQuery(this).attr('niveles')).indexOf(subfijo) !== -1)
       jQuery(this).css('display','');
   else
       jQuery(this).css('display','none');
  }
});

}

function setStatusModalConfirmacion(status){
    if(status)
       $("#statusModalConfirmacion").html('alta');
   else
       $("#statusModalConfirmacion").html('baja');

}

function switchStatus_(){
    bit = true;
    if((!lastCheckActivo.checked) && ( ($('#motivoBaja').val()=="" && !$('#bajaFisica').prop("checked")) )){
      bootbox.alert({
           message: "<br><b>Seleccione motivo de baja</b>",
           size: 'small'
         });

    }
    else{

    if($('#bajaFisica').prop("checked")){
       bit = confirm("Confirme eliminar fisicamente alumno.");
    }

    if(bit){
    motivoBaja = $('#motivoBaja').val()==="" ? "0" : $('#motivoBaja').val() ;
    bajaFisica = $('#bajaFisica').prop("checked") ? '1' : '0' ;
    idexpediente = lastCheckActivo.attributes['idExpediente'].value;
    idalumno = lastCheckActivo.attributes['idAlumno'].value;
    subfijo = lastCheckActivo.attributes['subfijo'].value;
    idgrupo = lastCheckActivo.attributes['idgrupo'].value;
    //nivel = lastCheckActivo.attributes['nivel'].value;
    //alert(idalumno);

    $("#modalBaja").modal("hide");

    if(lastCheckActivo.checked) status = 'A';
    else status = 'B';

    $("#wait").modal("show");
    $.ajax({
            url: base_url+"Alumno/switchStatusExpediente/"+idalumno+"/"+idexpediente+"/"+status+"/"+motivoBaja+"/"+bajaFisica+"/"+subfijo+"/"+idgrupo,
            //data:form,
            type:'POST',
            dataType:'json',

            error:function(jqXhr){
                if(jqXhr.responseText == "REDIRECT"){
                         parent.location=base_url;
                     }else{
                alert (jqXhr.responseText);
                $("#wait").modal("hide");}
            },

            success: function(result){
                if(result == "REDIRECT"){
                         parent.location=base_url;
                     }else{

                $("#wait").modal("hide");

                if(result['success']){
                   $("#ok").modal("show");
                   $("#ok").modal("hide");
                }
                else{
                   $("#error").modal("show");
                   $("#error").modal("hide");
                }

                consultaAlumnoSmartGrid();

            }
        }

           });
       }
   }
}

function undoCheckActivo(){
    if(lastCheckActivo.checked)
         lastCheckActivo.checked="";
      else
         lastCheckActivo.checked="checked";
}
function modal_cambiaGrupo(){
    $("#modalCambiaGrupo").modal("show");
    $("#nuevoGrupo").val("");

    showAlumnosSeleccionados();
}

function showAlumnosSeleccionados(){
    $("#alumnosSeleccionados").html("");
    arraySelected.forEach(function(item){
       $("#gridConsulta input[name=checkActivo]").each(function () {
                   if($(this).attr("idExpediente")==item && $(this).prop('checked')==true )
                      $("#alumnosSeleccionados").html($("#alumnosSeleccionados").html()+$("#"+item).html()+"<br/>");
                 });


    });
}


function verificaAlumnosCompatiblesConGrupo(){
    $("#gridConsulta input[name=checkMultiple]").each(function () {
       break_=false;
                if(!break_ && $(this).prop("checked") && $(this).attr("idgrupo") == $("#nuevoGrupo").val()){
                   if(confirm($("#"+$(this).attr("idexpediente")).html()+", ya pertenece a este grupo \n Desea omitirlo?")){
                      $(this).prop("checked",false);
                      showHideButtons();
                      showAlumnosSeleccionados();
                  }
                   else{
                     $("#nuevoGrupo").val("");
                     break_ = true;
                   }
    }

    });
}


function cambiaGrupo(){

    //$("#modalBaja").modal("hide");
    //arraySelected
    if($("#grupo_cambio").val()==""){
      bootbox.alert({
           message: "<br><b>Seleccione el grupo destino</b>",
           size: 'small'
         });
    }
    else {
    var formData = new FormData();

    formData.append('arraySelectedFull',arraySelectedFull.join());
    formData.append('grupo_cambio',$("#grupo_cambio").val());
    formData.append('grupo_cambio_subfijo',$("#grupo_cambio_subfijo").val());

    $("#modalCambiaGrupo").modal("hide");
    $("#wait").modal("show");

    $.ajax({
            url: base_url+"Alumno/cambiaGrupo",
            data:formData,
            type:'POST',
            dataType:'json',
            cache: false,
            contentType: false,
            processData: false,

            error:function(jqXhr){
                if(jqXhr.responseText == "REDIRECT"){
                         parent.location=base_url;
                     }else{
                alert (jqXhr.responseText);
                $("#wait").modal("hide");
            }
            },

            success: function(result){
                //alert(result);
                $("#wait").modal("hide");
                if(result == "REDIRECT"){
                         parent.location=base_url;
                     }else{

                if(result['success']){
                   $("#ok").modal("show"); $("#ok").modal("hide");
                }
                else{
                   $("#error").modal("show"); $("#error").modal("hide");
                   alert(result['msg']);
                }




                //alert(result['msg']);
                //$("#wait").modal("hide");
                consultaAlumnoSmartGrid();
            }
            }

           });
        //$("#wait").modal("hide");

    }
}

function buscaCT(target){
  // alert("Aqui");
 if(target=="_filtro")
    $("#nivelModalCT").val($("#nivel_filtro").val());

 $("#onclick_modal").attr("onclick","buscaCT('"+target+"')");
 $("#wait").modal("show");

 $("#modalBuscaCT").modal("show");
   var forma = $("#modalEscuela").serialize();

 //alert(nivel);

   $.ajax({
            url: base_url+"Catalogos/ajaxCT/"+target,
            data:forma,
            type:'POST',
            //dataType:'json',

            error:function(jqXhr){
                //alert(jqXhr.responseText)
                if(jqXhr.responseText == "REDIRECT"){
                         parent.location=base_url;
                     }else{
                if(jqXhr.responseText=="")jqXhr.responseText="<tr><td colspan='8'><div class='alert alert-warning'>No hay registros</div></td></tr>"
                $( "#tbodyBuscaCT" ).html(jqXhr.responseText);
                $("#wait").modal("hide");
            }
            },
            success: function(result){
                if(result == "REDIRECT"){
                         parent.location=base_url;
                     }else{
                     //alert(result)
                     $("#modalBuscaCT").modal("show");
                     $( "#tbodyBuscaCT" ).html(result);
                     $("#wait").modal("hide");
					 muestra_oculta_reports();
                 }
            }
           });
}



function removeCT(target){
    document.getElementById('cct'+target).value="";
    document.getElementById('grupo'+target).innerHTML="<option value=''>Grupo</option>";

}

function seleccionaCT(idctcfg,cct,target,subfijo){
    //alert(idctcfg+" / "+cct+" / "+target+" / "+subfijo);
    if($('#cct'+target).is("input"))
       document.getElementById('cct'+target).value=cct;

    document.getElementById("grupo_cambio_subfijo").value=subfijo;
    setSelectBimestre(subfijo);
    get_grupos(idctcfg,target);
    $('#modalBuscaCT').modal('hide');
	muestra_oculta_reports();
}

function get_grupos(idctcfg,target){
  if(target == '_cambio'){
    $("#wait").modal("show");
    $( "#grupo"+target ).load( base_url+"Catalogos/grupos_cambio/"+idctcfg,$("#wait").modal("hide"));
    //alert(target);
    document.getElementById('grupo'+target).disabled="";
  }else{
    $("#wait").modal("show");
    $( "#grupo"+target ).load( base_url+"Catalogos/grupos/"+idctcfg,$("#wait").modal("hide"));
    //alert(target);
    document.getElementById('grupo'+target).disabled="";
  }
}


function set_dynamicData(){
    if (typeof (Storage) !== "undefined") {

    var history_set = {};
    history_set['sectionConsultaAlumnos'] = $("#sectionConsultaAlumnos").html();

    history_set['grupo'] = $("#grupo").val();
    history_set['nivel_filtro'] = $("#nivel_filtro").val();
    history_set['cct_filtro'] = $("#cct_filtro").val();
    history_set['grupo_filtro'] = $("#grupo_filtro").val();

    history_set['curp'] = $("#curp").val();
    history_set['nombre'] = $("#nombre").val();
    history_set['apellido1'] = $("#apellido1").val();
    history_set['apellido2'] = $("#apellido2").val();
    history_set['estatus'] = $("#estatus").val();
    history_set['ciclo'] = $("#ciclo").val();



    localStorage.setItem("history_consultaAlumnos",JSON.stringify(history_set));

  }


}
function get_dynamicData(){

    if (typeof (Storage) !== "undefined") {

    var history_get = JSON.parse(localStorage.getItem('history_consultaAlumnos'));

    document.getElementById("sectionConsultaAlumnos").innerHTML = history_get['sectionConsultaAlumnos'];

    $("#grupo").val(history_get['grupo']);
    $("#nivel_filtro").val(history_get['nivel_filtro']);
    $("#cct_filtro").val(history_get['cct_filtro']);
    $("#grupo_filtro").val(history_get['grupo_filtro']);
    $("#curp").val(history_get['curp']);
    $("#nombre").val(history_get['nombre']);
    $("#apellido1").val(history_get['apellido1']);
    $("#apellido2").val(history_get['apellido2']);
    $("#estatus").val(history_get['estatus']);
    $("#ciclo").val(history_get['ciclo']);

    consultaAlumnoSmartGrid();
    $("#div_reporte_bimestre").hide();
    $("#div_reporte_por_alumno").hide();
    localStorage.removeItem("history_consultaAlumnos");
}

}

function limpiaConsulta(){
    $("#cct_filtro").val('');
    $("#grupo_filtro").val('');
    $("#nivel_filtro").val('');
    $("#grupo").val('');
    $("#curp").val('');
    $("#nia").val('');
    $("#apellido1").val('');
    $("#apellido2").val('');
    $("#nombre").val('');
    $("#estatus").val('');
    $("#ciclo").val('');
    $("#itxt_alumno_nia").val('');
    $("#div_reporte_por_grupo").hide();
}

function setSelectBimestre(subfijo){
    var selbim=document.getElementById("reporte_bimestre");
    selbim.options.length = 0;
    if(subfijo.toUpperCase()==="PREE"){
        selbim.appendChild(getOption("SELECCIONE MOMENTO","0",false,true,"gray"));
    }else selbim.appendChild(getOption("SELECCIONE BIMESTRE","0",false,true,"gray"));
    selbim.appendChild(getOption("PRIMERO","1",true,false,""));
    selbim.appendChild(getOption("SEGUNDO","2",false,false,""));
    selbim.appendChild(getOption("TERCERO","3",false,false,""));
    if(subfijo.toUpperCase()!=="PREE"){
        selbim.appendChild(getOption("CUARTO","4",false,false,""));
        selbim.appendChild(getOption("QUINTO","5",false,false,""));
    }
}

function getOption(text,val,sel,dis,stylecolor){
    var option = document.createElement("option");
    option.text = text;
    option.disabled=dis;
    option.style.color=stylecolor;
    option.value = val;
    option.selected = sel;
    return option;
}

function Reportes(){
  tmp_report = this;
  this.get_reporte_por_grupo = function(){
        var grupo = 0;

        if($("#grupo").length){ // Nos preparamos para escolar
          grupo =  $("#grupo").val();
        }
        else if ($("#grupo_filtro").length) { // Y también para central
          grupo =  $("#grupo_filtro").val();
        }

        var reporte_por_grupo = $("#reporte_por_grupo").val();
        var reporte = reporte_por_grupo;

        var form = document.createElement("form");
        var element1 = document.createElement("input");
        var element2 = document.createElement("input");

        form.name="formRep";
        form.id="formRep";
        form.method = "POST";
        form.target = "_blank";

        form.action = base_url+"Reportes/GeneraReporte/"+reporte;

        element1.type="hidden";
        element1.value = document.getElementById("grupo_cambio_subfijo").value;
        element1.name="nivel";
        form.appendChild(element1);

        element2.type="hidden";
        element2.value = grupo;
        element2.name="paramRep";
        form.appendChild(element2);

        document.body.appendChild(form);

        form.submit();
  };// reporte_por_grupo()

  this.get_reporte_por_alumno = function(){

        var reporte=$("#reporte_por_alumno").val();
        var form = document.createElement("form");
        var nivel = arrayNivelesSelected[0];
        var element1 = document.createElement("input");
        var element2 = document.createElement("input");
        var element3 = document.createElement("input");
		var element4 = document.createElement("input");
        var bimestre=document.getElementById("reporte_bimestre").value;
        if(reporte==="evalinternoxalumno" && bimestre==="0"){
          bootbox.alert({
               message: "<br><b>Seleccione un Bimestre de la lista</b>",
               size: 'small'
             });
          return;
        }
        if(todosElMismoNivel()){
            form.name="formRep";
            form.id="formRep";
            form.method = "POST";
            form.target = "_blank";
            form.action = base_url+"Reportes/GeneraReporte/"+reporte;
            element1.type="hidden";
            element1.value=nivel;
            element1.name="nivel";
            form.appendChild(element1);
            element2.type="hidden";
            element2.value=arraySelected.join();
            element2.name="paramRep";
            form.appendChild(element2);
            element3.type="hidden";
            element3.value=bimestre;
            element3.name="paramXtraRep";
            form.appendChild(element3);
			element4.type="hidden";
            element4.value=arrayGradosSelected.join();
            element4.name="paramGradoRep";
            form.appendChild(element4);
            document.body.appendChild(form);
            form.submit();
        }else{
          bootbox.alert({
               message: "<br><b>Seleccione alumnos del mismo nivel.</b>",
               size: 'small'
             });
          }
            return;
    };// reporte_por_alumno()
}// Reportes
