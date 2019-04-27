function Notifications(id_div){
  _thisnoti = this;
  _thisnoti.id_div = id_div;
  //_this.pregunta = pregunta;
  _thisnoti.init();
}

Notifications.prototype.init = function(){
  var str_modal = '';
  str_modal += '<div class="modal fade" id="myModal" role="dialog" data-backdrop="static" data-keyboard="false"style="z-index:10000!important;">';
      str_modal += '<div class="modal-dialog modal-sm">';
        str_modal += '<div class="modal-content">';
                            str_modal += '<div id="myModal-header" class="modal-header centered">';
                            str_modal += '</div>';
                            str_modal += '<div id="myModal-body" class="modal-body" style="">';
                            str_modal += '</div>';
        str_modal += '</div>';
      str_modal += '</div>';
    str_modal += '</div>';
      $("#"+_thisnoti.id_div).append(str_modal);
}

Notifications.prototype.get_notification = function(config,text){
  switch (config) {
    case "dialog":
    var str_modal = '';
    str_modal += "<center><img style='width:150px;' src='"+base_url+"assets/img/notifications/exclamation-mark.svg'></img></center><br>";
    str_modal += "<center><label>"+text+"</label></center><br>";
    str_modal += "<div class='row'><center>";
    str_modal += "<div class='col-xs-6'>";
    str_modal += "<button type='button' class='btn btn-primary' onclick='_thisnoti.confirmcancel()'   data-dismiss='modal'>Cancelar</button>";
    str_modal += "</div>";
    str_modal += "<div class='col-xs-6'>";
    str_modal += "<button id='' onclick='_thisnoti.confirm()' type='button' class='btn btn-primary' data-dismiss='modal'>Aceptar</button>";
    str_modal += "</div>";
    str_modal += "</center>";
    $("#myModal-body").empty();
    $("#myModal-body").append(str_modal);
    $("#myModal").modal("show");
      break;
    case "alert":
    var str_modal = '';
    // str_modal = '<button type="button" class="close bold_white" data-dismiss="modal">&times;</button>';
    // $("#myModal-header").empty();
    // $("#myModal-header").append(str_modal);
    //str_modal = '';
    str_modal += "<center><img style='width:100px;' src='"+base_url+"assets/img/notifications/letter-i.svg'></img></center><br>";
    str_modal += "<center><label>"+text+"</label></center>";
    str_modal += "<center>";
    str_modal += "<button id='' type='button' class='btn btn-primary' data-dismiss='modal'>Aceptar</button>";
    str_modal += "</center>";
    $("#myModal-body").empty();
    $("#myModal-body").append(str_modal);
    $("#myModal").modal("show");
      break;
    case "success":
    var str_modal = '';
    str_modal += "<center><img style='width:100px;' src='"+base_url+"assets/img/notifications/checked.svg'></img></center><br>";
    str_modal += "<center><label>"+text+"</label></center>";
    str_modal += "<center>";
    str_modal += "<button id='' type='button' class='btn btn-primary' data-dismiss='modal'>Aceptar</button>";
    str_modal += "</center>";
    $("#myModal-body").empty();
    $("#myModal-body").append(str_modal);
    $("#myModal").modal("show");
      break;
    case "error":
    var str_modal = '';
    str_modal += "<center><img style='width:100px;' src='"+base_url+"assets/img/notifications/close.svg'></img></center><br>";
    str_modal += "<center><label>"+text+"</label></center>";
    str_modal += "<center>";
    str_modal += "<button id='' type='button' class='btn btn-primary' data-dismiss='modal'>Aceptar</button>";
    str_modal += "</center>";
    $("#myModal-body").empty();
    $("#myModal-body").append(str_modal);
    $("#myModal").modal("show");
      break;
    default:

  }

};


Notifications.prototype.confirm = function(){
  var evento = new Event('confirmar');
 document.getElementById(_thisnoti.id_div).dispatchEvent(evento);
};

Notifications.prototype.confirmcancel = function(){
  var evento = new Event('confirmarcancel');
 document.getElementById(_thisnoti.id_div).dispatchEvent(evento);
};
