function Regularexpression(){

   this.url = function(string) {
      //Declaramos la expresión regular que se usará para validar la url pasada por parámetro
      var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      return regexp.test(string); //Retorna true en caso de que la url sea valida o false en caso contrario
   }// url()

   this.curp = function(string) {
      var regexp = /^([A-Z]{4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[A-Z]{3}[0-9A-Z]\d)$/i
      return regexp.test(string);  //Retorna true o false
   }// curp()

}// Regularexpression
