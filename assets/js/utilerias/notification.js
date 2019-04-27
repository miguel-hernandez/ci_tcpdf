function Notification(id_div){
  tmp_notification = this;
  tmp_notification.body = "";
  tmp_notification.id_div = id_div;
  tmp_notification.class_actual = "alert-danger";

  tmp_notification.body += "<div class='row'>";
  tmp_notification.body += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
  tmp_notification.body += "<div id='mensaje_result' class='alert' hidden>";
  tmp_notification.body += "<a class='close' aria-label='close' onclick='tmp_notification.dismissible()'>&times;</a>";
  tmp_notification.body += "<center><strong id='mensaje_result_content'></strong></center>";
  tmp_notification.body += "</div></div></div>";
  $("#"+tmp_notification.id_div).append(tmp_notification.body);

  this.success = function(content){
    $("#mensaje_result").removeClass(tmp_notification.class_actual);
    if(tmp_notification.class_actual == "alert-danger") tmp_notification.class_actual = "alert-success";
    $("#mensaje_result").addClass("alert-success");
    $("#mensaje_result_content").empty();
    $("#mensaje_result_content").append(content);
    $("#mensaje_result").show();
  }// success()

  this.error = function(content){
    $("#mensaje_result").removeClass(tmp_notification.class_actual);
    if(tmp_notification.class_actual == "alert-success") tmp_notification.class_actual = "alert-danger";
    $("#mensaje_result").addClass("alert-danger");
    $("#mensaje_result_content").empty();
    $("#mensaje_result_content").append(content);
    $("#mensaje_result").show();
  }// error()

  this.dismissible = function(){
    $("#mensaje_result").hide();
    $("#mensaje_result_content").empty();
  }// dismissible()

  this.destroy = function(){
    $("#"+tmp_notification.id_div).empty();
  }// destroy()

}
