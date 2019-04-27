/* jshint esversion: 6 */

function recorre_tabla(){

  $("#sg-table tbody tr").each(function (index){

    var fila = this;
    let hijos = $(fila).children('td');

    let hijo6 = hijos[6];
    let div = $(hijo6).children('div');
    let check = $(div).children('input'); //Accedemos al check

    let hijo7 = hijos[7];
    let label = $(hijo7).children('label');

    //Veriificamos si el input no esta checked
    if (!$(check).is(':checked')) {
      $(label).remove(".ico_clubes"); //Eliminamos el elemento con la clase ico_clubes
    } else {
      // console.log('Ok');
    }
  });
  quitar_botones_escolar_limitado();
}

function quitar_botones_escolar_limitado(){

  $("#sg-table tbody tr").each(function (index){

    let fila = this;
    let hijos = $(fila).children('td');

    let hijo6 = hijos[6];
    let div = $(hijo6).children('div');
    let check = $(div).children('input'); //Accedemos al check

    let hijo7 = hijos[7];
    let label = $(hijo7).children('label');

    //Veriificamos si el input no esta checked
    let disabled  = $(check).attr('disabled');
    if (disabled) {
      $(label).remove(".ico_expediente");
      $(label).remove(".ico_evaluaciones");
      $(label).remove(".ico_clubes");
    } else {
    }
  });
}
