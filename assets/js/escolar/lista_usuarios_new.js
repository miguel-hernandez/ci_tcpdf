$(document).ready(function(){
  // recorrer_tabla()
})

function recorrer_tabla(){
  // obj_grid_mensajes_escolar = new Grid("grid_mensajes_escolar");
  // let idusuario = $("#itxt_mensajes_idusuario").val(); //Id del usuario logueado

  $("#sg_1_table tbody tr").each(function (index){
    let fila = this;
    console.log(fila);

    let hijos = $(fila).children('td');
    //   console.log(hijos);
    // alert(hijos[9]);return false;

    let hijo9 = hijos[9];
    let str_btn = "<a role='button' class='btn4Smartgrid' href='pdf' target='_blank''><span class='glyphicon glyphicon-file' aria-hidden='true'></span></a>";
    $(hijo9).append(str_btn);

  });
}



$("#btn_modal_datosdirector_cerrar").click(function(e){
  e.preventDefault();
  $("#modal_datosdirector").modal("hide");
});

function lanzapdf(valor){
  // alert(valor);
  // window.open("http://localhost/yolixtli/Reportes_tcpdf/carta_responsiva");
  // window.location = "http://localhost/yolixtli/Escolar/"+valor;
  // window.open("http://localhost/yolixtli/Escolar/"+valor);


  // window.open("http://localhost/yolixtli/Escolar/"+valor);
  var res = valor.split("/");
  var idusuario = res[1];
  $("#itxt_idusuario").val(idusuario);
  $("#modal_datosdirector").modal("show");
}// lanzapdf()

$("#btn_generar_cartaresponsiva").click(function(e){
  e.preventDefault();
  var nombre = $("#itxt_nombre").val();
  var apellido1 = $("#itxt_apellido1").val();
  if( (nombre.trim()).length  == 0){
    Helpers.alert("Ingrese nombre(s)", "error");
  }else if ((apellido1.trim()).length  == 0) {
    Helpers.alert("Ingrese apellido 1", "error");
  }else{
      generar_cartaresponsiva();
  }
});

function generar_cartaresponsiva(){
  var idusuario = $("#itxt_idusuario").val();
  var director = $("#itxt_nombre").val() +' '+ $("#itxt_apellido1").val()+' '+ $("#itxt_apellido2").val();

  var form = document.createElement("form");
  var element1 = document.createElement("input");
  var element2 = document.createElement("input");

  form.name="formRep";
  form.id="formRep";
  form.method = "POST";
  form.target = "_blank";

  form.action = base_url+"Reportes_tcpdf/carta_responsiva/"+idusuario;

  element1.type="hidden";
  element1.value = idusuario;
  element1.name="idusuario";
  form.appendChild(element1);

  element2.type="hidden";
  element2.value = director;
  element2.name="director";
  form.appendChild(element2);

  document.body.appendChild(form);

  form.submit();
}// generar_cartaresponsiva()
