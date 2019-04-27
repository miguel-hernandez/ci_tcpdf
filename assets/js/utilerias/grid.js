function Grid(iddiv){
  this_grid = this;
  this_grid.iddiv = iddiv;
  this_grid.arr_row_selected = [];
  this.get_row_selected = function(){
    return this_grid.arr_row_selected;
  }// get_row_selected()
  this.unselect = function(){
   return this_grid.arr_row_selected=[];
 }// unselect()

  $(document).on("click", "#"+this_grid.iddiv+" tbody tr", function(e) {
    this_grid.init();
    // $(this).css( {"background-color": "#D0EDF2", "font-size": "15px"} );

    $(this).css( {"background-color": "#EBEDEF", "font-size": "15px"} );
    var arr_aux = [];
    $(this).children("td").each(function (){
      arr_aux[this.id] = $(this).attr('data');
    });
    this_grid.arr_row_selected[0] = arr_aux;
  });

  this.init  = function(){
    this_grid.arr_row_selected = [];
    $("#"+this_grid.iddiv+ " tbody tr").each(function () {
      $(this).css( {"background-color": "white", "font-size": "14px"} );
    });
  }// init()

  this.finish = function(str_html){
    $("#"+this_grid.iddiv).empty();
    $("#"+this_grid.iddiv).append(str_html);
  }// finish()

this.get_gridpaginador = function (offset, controller, funcion, form){
    var datos = $("#"+form).serializeArray();
    datos.push({"name":"offset","value":offset});
    $.ajax({
   	 url:base_url+controller+"/"+funcion,
   	 method:"POST",
   	 data: datos,
   	 beforeSend: function(xhr) {
   		 $("#wait").modal("show");
   	 },
   	 success:function(data){
   		 $("#wait").modal("hide");
       $("#"+this_grid.iddiv).empty();
   		 $("#"+this_grid.iddiv).append(data.str_grid);
   	 },
   	 error: function(xhr){
       $("#wait").modal("hide");
       if (xhr.status === 0) {
         alert('Not connect: Verify Network.');
       } else if (xhr.status == 404) {
         alert('Requested page not found [404]');
       } else if (xhr.status == 500) {
         alert('Internal Server Error [500].');
       } else {
         alert('Uncaught Error: ' + xhr.responseText);
       }
       console.error(xhr);
   	 }
    });
}// get_gridpaginador()

this.get_all_ids  = function(idcolumna){
    var arr_ids = [];
    $("#"+this_grid.iddiv+ " tbody tr").each(function () {
        $(this).children("td").each(function (){
          if(this.id == idcolumna){
            arr_ids.push($(this).attr('data'));
          }
        });
    });
    return arr_ids;
  }// get_all_ids()

}// Grid
