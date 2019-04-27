$(function(){
	objcorteinicio = new Corteinicio();
});

function Corteinicio(){
   _this = this;
 }

 $('#btn_revreq_ini').click(function (e) {
 	e.preventDefault();
 	objcorteinicio.revisa_requisitosini();
 });

 Corteinicio.prototype.revisa_requisitosini = function (){
 	$.ajax({
 		url: base_url+'Corte/revisar_requisitosini',
 		type: 'POST',
 		dataType: 'json',
 		beforeSend: function(xhr) {
             $("#wait").modal("show");
           },
 	})
 	.done(function(data) {
 		$("#wait").modal("hide");
 		$("#grid_corteini").empty();
    $("#grid_corteini").append(data.table);
		if ( (data.arr_resultini['nsolic_penddemicct']==0 || data.arr_resultini['nsolic_penddemicct']==null) && (data.arr_resultini['nsolic_pendpormicct']==0 || data.arr_resultini['nsolic_pendpormicct']==null)) {
			$('#btn_aply_corteini').prop('disabled', false);
		}
 	})
 	.fail(function(error) {
 		console.log(error);
 	})
 	.always(function() {
 		console.log("complete");
 	});

 }
 $('#btn_aply_corteini').click(function(e){
	 obj_notif = new Notifications("div_pclassnotifications_modal");
	  obj_notif.get_notification("dialog","¿Confirme aplicar corte de inicio?");
	  document.getElementById('div_pclassnotifications_modal').addEventListener('confirmar',f_confirmar,false);
 });

function f_confirmar(){
	objcorteinicio.insert_corteini();
}



 Corteinicio.prototype.insert_corteini = function(){
	 $.ajax({
		 url: base_url+'Corte/insert_corteini',
		 type: 'POST',
		 dataType: 'json',
		 beforeSend: function(xhr) {
              $("#wait").modal("show");
            },
	 }).done(function(data) {
		 $("#wait").modal("hide");
  		console.log("success");
			data.respuesta
			if (data.respuesta) {
				objcorteinicio.get_corteini();
				$('#btn_aply_corteini').prop('disabled', true);
			}
			else {
				objcorteinicio.get_corteini();
			}
	 }).fail(function(error) {
  		console.log(error);
  	}).always(function() {
  		console.log("complete");
  	});
 }

 Corteinicio.prototype.get_corteini = function(){
	 $.ajax({
		 url: base_url+'Corte/get_corteini',
		 type: 'POST',
		 dataType: 'json',
		 beforeSend: function(xhr) {
              $("#wait").modal("show");
            },
	 }).done(function(data) {
		 $("#wait").modal("hide");
  		console.log("success");
			console.log(data.respuesta);
			if (data.respuesta.length > 0) {
				if (data.respuesta[0]['corteinicio']==1) {
					$('#status_corteini').text('FINALIZADO: '+data.respuesta[0]['fcorteinicio']);
					$('#btn_revreq_ini').prop('disabled', true);
				}
				else {
					$('#status_corteini').text('PENDIENTE');
					$('#btn_revreq_ini').prop('disabled', false);
				}
			}
	 }).fail(function(error) {
  		console.log(error);
  	}).always(function() {
  		console.log("complete");
  	});
 }
