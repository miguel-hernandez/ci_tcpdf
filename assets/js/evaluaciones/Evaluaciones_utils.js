/* jshint esversion: 6 */

let Evaluaciones_utils = {

  valida_observacion : (string) => {
    let regex = /^[a-z0-9\sáéíóúñ.,]+$/i;
    return regex.test(string);  //Retorna true o false
  },

  retoma_foco : (elemento) => {
    $('.bootbox').on('hidden.bs.modal', function() {
        $(elemento).focus();
        $(elemento).select();
    });
  },

  valida_solo_numerico : (cadena) => {
      let regex = /^\d*$/;
      return regex.test(cadena);  //Retorna true o false
  },

  get_nivel_desempeno_xcalificacion : (componente_curricular, calificacion) => {
    calificacion = parseInt(calificacion);
    let nivel = '';
    if(componente_curricular == 'FA'){
      switch (calificacion) {
        case 5:
          nivel = 'I';
        break;
        case 6:
          nivel = 'II';
        break;
        case 7:
          nivel = 'II';
        break;
        case 8:
          nivel = 'III';
        break;
        case 9:
          nivel = 'III';
        break;
        case 10:
          nivel = 'IV';
        break;
      }
    }
    else{
      switch (calificacion) {
        case 1:
          nivel = 'I';
        break;
        case 2:
          nivel = 'II';
        break;
        case 3:
          nivel = 'III';
        break;
        case 4:
          nivel = 'IV';
        break;
      }
    }

    return nivel;
  },

  valida_captura_xcomponentecurricular : (componente_curricular, calificacion) => {
    flag = false;
    if (componente_curricular == 'FA') {
      if(calificacion == '' || calificacion == 5 || calificacion == 6 || calificacion == 7 || calificacion == 8 || calificacion == 9 || calificacion == 10){
         flag = true;
      }
    }else{
      if(calificacion == '' || calificacion == 1 || calificacion == 2 || calificacion == 3 || calificacion == 4){
         flag = true;
      }
    }

    return flag;
  },

  limpia_clases : (elemento) => {
    let clases_existentes='text-success text-fail';
    $(elemento).removeClass( clases_existentes );
  },

  agrega_clase : (elemento, result) => {
    let clase = '';
    if(result){
      clase = 'text-success';
    }else{
      clase = 'text-fail';
    }
    $(elemento).addClass(clase);
  },

  selecciona_elemento : (elemento) => {
    $(elemento).select();
  },


};
