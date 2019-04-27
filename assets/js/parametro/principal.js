
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
 var target = $(e.target).attr("href") // activated tab
 if(target == "#menu5"){
   obj_grid_ofreg = null;
   obj_grid_firmantes = new Grid("grid_parametro_firmantes");
   obj_parametro.get_grid_firm(0);
 }
 else if (target == "#menu6") {
   obj_grid_firmantes = null;
   obj_grid_ofreg = new Grid("grid_parametro");
   obj_parametro.get_grid(0);
 }
});
