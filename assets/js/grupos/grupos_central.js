/* jshint esversion: 6 */

$("#btn_configurargrupos_buscarcct").click(function(e){
  e.preventDefault();
  $("#mensaje_result").hide();
	$("#itxt_configurargrupos_cct").val("");
  $("#gruposcentral_infogrid").empty();
	Grupos_central.get_view_buscadorcct();
});

$("#btn_modalcupo_grabar").click(function(e){
    e.preventDefault();
    let cupo = $("#itxt_modalcupo_cupo").val();
    let id_grupo = $("#itxt_modalcupo_idgrupo").val();
    let idnivel = $("#itxt_modalcupo_idnivel").val();
    let activos = $("#itxt_modalcupo_alumnosactivos").val();

    if(cupo < 1 || cupo > 99){
      Helpers.alert("La capacidad debe ser mayor que 1 y menor que 99", "error");
      return false;
    }
    else{
      if (activos > cupo) {
        Helpers.alert("La capacidad no puede ser menor al número de alumnos inscritos", "error");
        return false;
      }
      else{
        Grupos_central.actualiza_cupo_grupo(cupo,id_grupo,idnivel);
        $('#mensaje_result_cupo').hide();
        $("#mensaje_result_content_cupo").empty();
      }
    }
});

function alimenta_campo_cct(){
    let cct = Grupos_central.obj_bcct.get_cct();
		let idcct = Grupos_central.obj_bcct.get_idcct();
    let idnivel = Grupos_central.obj_bcct.get_idnivel();
    $("#itxt_configurargrupos_idnivelseleccionado").val(idnivel);

    let idcentrocfg = Grupos_central.obj_bcct.get_idcentrocfg();
    $("#itxt_configurargrupos_idcentrocfgseleccionado").val(idcentrocfg);

    $("#itxt_configurargrupos_idcct").val(idcct);
		$("#itxt_configurargrupos_cct").val(cct);
    Grupos_central.get_grupos_xidcentrocfg();
}// alimenta_campo_cct()


function destruye_buscadorcct(){
  Grupos_central.obj_bcct = null;
}// destruye_buscadorcct()

function desactivar_grupo(idgrupo,estatus) {
  let alumnos_activos = Grupos_central.get_alumnosactivos_xidgrupo(idgrupo);
  if(alumnos_activos > 0){
    Helpers.alert("No es posible desactivar el grupo porque tiene "+alumnos_activos+" alumnos activos", 'error');
  }else{
        bootbox.confirm({
            message: "<b>¿Desactivar grupo?<b>",
            buttons: {
                confirm: {
                    label: 'Aceptar',
                    className: 'btn-primary'
                },
                cancel: {
                    label: 'Cancelar',
                    className: 'btn-default'
                }
            },
            callback: function (result) {
                if (result) {
                  let idnivel = $('#itxt_configurargrupos_idnivelseleccionado').val();
                  Grupos_central.updatestatus(idgrupo,idnivel,estatus);
                } else {
                  // Nada...
                }
            }
        });
  }
}// desactivar_grupo()

function activar_grupo(idgrupo,estatus) {
  bootbox.confirm({
      message: "<b>¿Activar grupo?</b>",
      buttons: {
          confirm: {
              label: 'Aceptar',
              className: 'btn-primary'
          },
          cancel: {
              label: 'Cancelar',
              className: 'btn-default'
          }
      },
      callback: function (result) {
          if (result) {
            let idnivel = $('#itxt_configurargrupos_idnivelseleccionado').val();
            Grupos_central.updatestatus(idgrupo,idnivel,estatus);
          } else {
            // Nada...
          }
      }
  });
}

function nuevo_grupo(){
  var cupo = $('#numero_cupo').val();
  if (cupo == '' || cupo == null || cupo == 0 || cupo >= 99) {
    Helpers.alert("La capacidad debe ser mayor que 1 y menor que 99", "error");
  } else {
     Grupos_central.agrega_nuevo();
 }
}// nuevo_grupo()

function editar_cupo_grupo(that){
  // Prevenimos el submit al presionar la tecla enter
  $("#itxt_modalcupo_cupo").keypress(function(e) {
       if (e.which == 13) {
           return false;
       }
   });

  $("#itxt_modalcupo_idgrupo").val($(that).attr("data-id_grupo"));
  $("#itxt_modalcupo_cupo").val($(that).attr("data-cupo_grupo"));
  $("#lbl_modalcupo_grupo").text($(that).attr("data-grado_grupo"));
  $("#itxt_modalcupo_idnivel").val($(that).attr("data-idnivel"));
  $("#itxt_modalcupo_alumnosactivos").val($(that).attr("data-alumnos_activos"));

  $("#modalcupo_configurargrupos").modal("show");
}


let Grupos_central = {

    obj_bcct : null,

    get_view_buscadorcct : () => {
      $.ajax({
     		url:base_url+"Buscadorcct/get_view_buscadorcct",
     		method:"POST",
     		data:{
             "idnivel" : $("#itxt_configurargrupos_idnivel").val(),
             "idregion" : $("#itxt_configurargrupos_idregion").val(),
             "idmunicipio" : $("#itxt_configurargrupos_idmunicipio").val(),
             "idzona" : $("#itxt_configurargrupos_idzona").val()
           },
     		beforeSend: function(xhr) {
     			$("#wait").modal("show");
     		},
     		success:function(data){
     			$("#wait").modal("hide");
     			$("#div_configurargrupos_buscadorcct").empty();
     			$("#div_configurargrupos_buscadorcct").append(data.str_view);
     			Grupos_central.obj_bcct = new Buscadorcct("div_configurargrupos_buscadorcct");// el iddiv donde se concatena el string también servirá para disparar el evento
     			Grupos_central.obj_bcct.init();
     			document.getElementById('div_configurargrupos_buscadorcct').addEventListener('cct_seleccionada',alimenta_campo_cct,false);
          document.getElementById('div_configurargrupos_buscadorcct').addEventListener('event_salir_buscador',destruye_buscadorcct,false);
     		},
     		error: function(jqXHR, textStatus, errorThrown){
          $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
     		}
     	});
    },

    get_grupos_xidcentrocfg : () => {
      let idcct = $("#itxt_configurargrupos_idcct").val();
      let nivel = $("#itxt_configurargrupos_idnivelseleccionado").val();
      let idcentrocfg = $("#itxt_configurargrupos_idcentrocfgseleccionado").val();

      $.ajax({
        url:base_url+"Grupo_central/getgruposconfigurar_xidcentrocfg",
        method:"POST",
        data:{ "idcct" : idcct, "nivel":nivel, "idcentrocfg" : idcentrocfg },
        beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
        success:function(data){
          $("#wait").modal("hide");
          $("#gruposcentral_infogrid").empty();
          $("#gruposcentral_infogrid").append(data.str_view);
        },
        error: function(jqXHR, textStatus, errorThrown){
          $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
        }
      });
    },

    get_alumnosactivos_xidgrupo : (idgrupo) => {
      let alumnos_activos = 0;
      $("#grid_vergrupos tbody tr").each(function () {
          $(this).children("td").each(function (){
            if($(this).attr('id') == 'idgrupo'){
              let idgrupo_recorriendo = $(this).attr('data');
              if(idgrupo_recorriendo == idgrupo){
                let array_hermanos = $(this).siblings('td');
                for (let i = 0; i < array_hermanos.length; i++) {
                  if($(array_hermanos[i]).attr('id') == 'alumnos_activos'){
                    alumnos_activos = $(array_hermanos[i]).attr('data');
                  }
                }
              }
            }
          });
      });

      return alumnos_activos;
    },

    agrega_nuevo : () => {
       let idcentrocfg = $("#itxt_configurargrupos_idcentrocfgseleccionado").val();

       let lengua = $('#seleccion_lengua').val();
       if(lengua==null || lengua==""){
         lengua = "0";
       }

       let datos = {
         'lengua' : lengua,
         'plan' : $('#seleccion_plan').val(),
         'grado' : $('#seleccion_grado').val(),
         'idnivel' : $('#itxt_configurargrupos_idnivelseleccionado').val(),
         'grupo' : $('#seleccion_grupo').val(),
         'cupo' : $('#numero_cupo').val(),
         'centrocfg' : idcentrocfg
       };

       $.ajax({
           type: 'POST',
           url: base_url + "Grupo_central/agrega_nuevo",
           dataType : 'json',
           method : 'POST',
           data : datos,
           beforeSend: function( xhr ) {
             $("#wait").modal("show");
           },
           success: function (data) {
             $("#wait").modal("hide");
             var result = data.result;
             if(result >= 1){
               Helpers.alert("Grupo agregado correctamente","success");
               Grupos_central.get_grupos_xidcentrocfg();
             }
             else if(result==-1){
               Helpers.alert("No es posible agregar el grupo, ya existe uno similar", "error");
             }
             else if (result==0) {
               Helpers.alert("No es posible agregar el grupo, datos incompletos", "error");
             }
             else if ( (result == -10) && (data.error == 'cupo') ) {
               Helpers.alert("La capacidad debe de ser mayor o igual a 1 y menor que 99", "error");
             }
           },
           error: function(jqXHR, textStatus, errorThrown){
             $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
           }
         });
    },

    updatestatus : (idgrupo,idnivel,estatus) => {
      let accion = (estatus == 0)?"desactivado":"activado";
      $.ajax({
        url:base_url+"Grupo_central/updatestatus",
        method:"POST",
        data:{ "idgrupo" : idgrupo, "idnivel" : idnivel, "estatus":estatus },
        beforeSend: function(xhr) {
          $("#wait").modal("show");
        },
        success:function(data){
          $("#wait").modal("hide");
          $("#modalgrupo_updatestatus").modal("hide");
          if(data.result){
            Helpers.alert("Grupo "+accion+" correctamente","success");
            Grupos_central.get_grupos_xidcentrocfg();
          }
          else{
            Helpers.alert("Verifique que no tenga algún asesor o materias asignadas a dicho grupo","error");
          }
        },
        error: function(jqXHR, textStatus, errorThrown){
            $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
        }
      });
    },

    actualiza_cupo_grupo : (cupo,id_grupo,idnivel) => {
      $.ajax({
          type: 'POST',
          url: base_url + "Grupo_central/update_cupo",
          dataType : 'json',
          method : 'POST',
          data : {'id_grupo':id_grupo, 'cupo_grupo':cupo, 'idnivel':idnivel},
          beforeSend: function( xhr ) {
            $("#wait").modal("show");
          },
          success: function (data) {
              $("#wait").modal("hide");
              $("#modalcupo_configurargrupos").modal("hide");
              if(data.result){
                Helpers.alert("Cupo actualizado correctamente","success");
                Grupos_central.get_grupos_xidcentrocfg();
              }else if ( (data.result == -10) && (data.error == 'cupo') ) {
                Helpers.alert("La capacidad debe de ser mayor o igual a 1 y menor que 99", "error");
              }else if(!data.result) {
                Helpers.alert("Ocurrió un error interno al tratar de realizar la operación, reintente por favor", "error");
              }
          },
          error: function (jqXHR, textStatus, errorThrown) {
               $("#wait").modal("hide"); Helpers.error_ajax(jqXHR, textStatus, errorThrown);
          }
      });
    }

};
