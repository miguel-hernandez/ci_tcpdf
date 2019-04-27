function buscaCT(target){
			$("#info_cct").hide();
      $('#modalBuscaCT').on('shown.bs.modal', function () {
        $('#cct_modal').focus();
      });

     $("#onclick_modal").attr("onclick","buscaCT('"+target+"')");
     $("#wait").modal("show");

     $("#modalBuscaCT").modal("show");
       	var forma = $("#modalEscuela").serialize();
       	$.ajax({
                url: base_url+"Catalogos/ajax_cct/"+target,
                data:forma,
                type:'POST',
                success: function(result){
                    $("#wait").modal("hide");
                    if(result == "REDIRECT"){
                             parent.location=base_url;
                    }else{
                         $("#modalBuscaCT").modal("show");
                         $( "#tbodyBuscaCT" ).html(result);
                     }
                },
                error:function(jqXhr){
                    if(jqXhr.responseText == "REDIRECT"){
                             parent.location=base_url;
                         }else{
                            if(jqXhr.responseText=="")jqXhr.responseText="<tr><td colspan='8'><div class='alert alert-warning'>No hay registros</div></td></tr>"
                            $( "#tbodyBuscaCT" ).html(jqXhr.responseText);
                            $("#wait").modal("hide");
                        }
                }
        });
}

    function seleccionaCT(idctcfg,cct,target){
        $("#txt_grupos_cct").val(cct);
				$("#idcentrocfg_hidden").val(idctcfg);
        $('#modalBuscaCT').modal('hide');
        document.getElementById('div_event').addEventListener('arr_listo',muestra_datos_cct,false);
    }

    function removeCT(target){
        document.getElementById('cct'+target).value="";
        $("#info_cct").hide();
    }

    $("#btn_remove_selection").click(function (e) {
      e.preventDefault();
      remover_filtro_CT();
    });

    function remover_filtro_CT(){
        $("#txt_grupos_cct").val("");
        $("#div_grid_grupos").empty();
        $("#info_cct").hide();
    }

    function muestra_datos_cct(){
      var cct = $('#txt_grupos_cct').val();
			if(cct.length>0){
					$("#cct_cct_hidden").val(arr[0]); $("#cct_nivel_hidden").val(arr[5]); $("#cct_idnivel_hidden").val((arr[5]=="pree" || arr[5]=="PREE")?1:((arr[5]=="prim"||arr[5]=="PRIM")?2:3));
					$("#cct_clave").html(arr[0]);
					$("#cct_nombre").html(arr[2]);
					$("#cct_turno").html(arr[1]);
					$("#cct_municipio").html(arr[3]);
					$("#cct_zona").html(arr[4]);
					$("#cct_nivel").html( (arr[5]=="pree" || arr[5]=="PREE")?"PREESCOLAR":((arr[5]=="prim"||arr[5]=="PRIM")?"PRIMARIA":"SECUNDARIA") );
					$("#info_cct").show();

          mostrar_grupos();
			}else{
				$("#cct_cct_hidden").val(""); $("#cct_nivel_hidden").val("");
				$("#cct_clave").html("");
				$("#cct_nombre").html("");
				$("#cct_turno").html("");
				$("#cct_municipio").html("");
				$("#cct_zona").html("");
				$("#cct_nivel").html("");
				$("#info_cct").hide();
			}
    }// muestra_datos_cct()


		// llenamos un array con los datos del row seleccionado
		$(document).on("click", "#sg-table tbody tr", function(e) {
        arr = [];
				var i=0;
				$(this).children("td").each(function (){
					arr[i] = $(this).html();
					i++;
				});
				if(arr.length>5){
          evento = new Event('arr_listo');
          document.getElementById("div_event").dispatchEvent(evento);
				}

		});


		function mostrar_grupos(){
			var cct = $('#txt_grupos_cct').val();
			var nivelEscolar = ( arr[5]=="pree" || arr[5]=="PREE" )?1:(( arr[5]=="prim"||arr[5]=="PRIM" )?2:3)
			var cct_nivel = cct + '//' + nivelEscolar;
			$.ajax({
				url: live_url + "index.php/Cct/ver_grupos/" + cct_nivel,
				type: "POST",
        beforeSend: function( xhr ) {
          $("#wait").modal("show");
        },
				success: function (result) {
          $("#wait").modal("hide");
					$("#div_grid_grupos").empty();
					$("#div_grid_grupos").append(result);
					$("#div_grid_grupos").show();
				},
				error: function (result) {
					console.error("error");
				}
			});
		}// mostrar_grupos()
