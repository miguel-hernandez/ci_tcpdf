function consume_tabla(id_tabla){
	var data = new Array();
	$("#"+id_tabla+" tbody tr").each(function (index) {
				                 var campo= new Array();
				                 $(this).children("td").each(function (index2) {
				                    	select = $(this).children("select");
				                    	if(select.length > 0){
				                    		campo.push($(this).children("select")[0].value);
				                    	}else{
				                    		campo.push($(this).text());
				                    	}
				                $(this).css("background-color", "#ECF8E0");
				                });
				                 data.push(campo);
				            });
	console.table(data);
	return data;
}