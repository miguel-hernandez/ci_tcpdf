function Dialog(id_div, pregunta){
  _this = this;
  _this.id_div = id_div;
  _this.pregunta = pregunta;
  _this.init();
}

Dialog.prototype.init = function(){
var str_modal = '';
str_modal += '<div class="modal fade" id="myModal" role="dialog" data-backdrop="static" data-keyboard="false">';
    str_modal += '<div class="modal-dialog modal-sm">';
      str_modal += '<div class="modal-content">';
                          str_modal += '<div class="modal-header">';
                          str_modal += '</div>';
                              str_modal += '<div class="modal-body">';
                                    str_modal += "<center><label>"+_this.pregunta+"</label></center><br>";
                                    str_modal += "<div class='row'><center>";
                                    str_modal += "<div class='col-xs-6'>";
                                    str_modal += "<button type='button' class='btn btn-primary'  data-dismiss='modal'>Cancelar</button>";
                                    str_modal += "</div>";
                                    str_modal += "<div class='col-xs-6'>";
                                    str_modal += "<button id='' onclick='_this.confirm()' type='button' class='btn btn-primary' data-dismiss='modal'>Aceptar</button>";
                                    str_modal += "</div>";
                                    str_modal += "</center></div>";
                              str_modal += '</div>';

      str_modal += '</div>';
    str_modal += '</div>';
  str_modal += '</div>';


    $("#"+_this.id_div).append(str_modal);
    $("#myModal").modal("show");
};

Dialog.prototype.notification = function(texto){
var str_modal = '';
str_modal += '<div class="modal fade" id="myModal" role="dialog" data-backdrop="static" data-keyboard="false">';
    str_modal += '<div class="modal-dialog modal-sm">';
      str_modal += '<div class="modal-content">';
                          str_modal += '<div class="modal-header">';
                          str_modal += '</div>';
                              str_modal += '<div class="modal-body">';
                                    str_modal += "<label>"+_this.pregunta+"</label><br>";
                                    str_modal += "<div class='row'>";
                                    str_modal += "<div class='col-xs-6'>";
                                    str_modal += "<button type='button' class='btn btn-primary'  data-dismiss='modal'>Cancelar</button>";
                                    str_modal += "</div>";
                                    str_modal += "<div class='col-xs-6'>";
                                    str_modal += "<button id='' onclick='_this.confirm()' type='button' class='btn btn-primary' data-dismiss='modal'>Aceptar</button>";
                                    str_modal += "</div>";
                                    str_modal += "</div>";
                              str_modal += '</div>';

      str_modal += '</div>';
    str_modal += '</div>';
  str_modal += '</div>';


    $("#"+_this.id_div).append(str_modal);
    $("#myModal").modal("show");
};


Dialog.prototype.confirm = function(){
  var evento = new Event('confirmar');
 document.getElementById(_this.id_div).dispatchEvent(evento);
};
