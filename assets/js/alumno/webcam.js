// Put event listeners into place
var localstream = null;
var video = null;
var fileFromBlob =null;
var image;
var canvas;
var width="0px";
var height="0px"
var JcropAPI;
var x1=0,y1=0,x2=0,y2=0;w=0;h=0;




        window.addEventListener("DOMContentLoaded", function() {
            //jQuery(function($){$('#image1').Jcrop();});

            //$('#image1').Jcrop({},function(){jcrop_api = this;});


            document.getElementById("showWebcam").addEventListener("click", function() {


            //alert("showWebcam");
            if(jcropOn){ destroyJcrop(); }
            $('#image').hide();
            $('#webcam').show();

            $('#crop').hide();
            $('#saveImage').hide();

            var canvas = document.getElementById("canvas");
            var image = document.getElementById("fotoOficial");
            context = canvas.getContext("2d");



            if(localstream==null){




                $("#video").fadeIn("slow");
                //$("#canvas").fadeOut("slow");
                //context = image.getContext("2d");

                //video = document.querySelector('video'),
                video = document.getElementById("video");
                videoObj = { "video": true,
                                      height: { min: 130, ideal: 130, max: 130 },
                                      width: { min: 176, ideal: 176, max: 176 } },

                             image_format= "jpeg",
                             jpeg_quality= 85,
                             errBack = function(error) {console.log("Video capture error: ", error.code);};
                //alert($('#video').prop('videoWidth'));

            // Put video listeners into place
            if(navigator.getUserMedia) { // Standard
                navigator.getUserMedia(videoObj, function(stream) {

                    // video.src = window.URL.createObjectURL(stream); OBSOLETA 14042019 Ismael Castillo

                    // Actualizada
                    video.srcObject = stream;
                    //$('#video').prop('videoWidth','295');

                    video.play();
                    localstream = stream;

                    //alert("getUserMedia");
                }, errBack);
            } else if(navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia(videoObj, function(stream){
                    video.src = window.webkitURL.createObjectURL(stream);
                    video.play();
                    localstream = stream;
                }, errBack);
            } else if(navigator.mozGetUserMedia) { // moz-prefixed
                navigator.mozGetUserMedia(videoObj, function(stream){
                   video.src = window.URL.createObjectURL(stream);
                    //video.src = stream;
                    video.play();
                     localstream = stream;
                }, errBack);
            }
        }



            // Get-Save Snapshot - image






        $('#snapshot').show();
        }, false);
        }, false);




 function snapshot() {

                 //alert("doSnapshot | JcropAPI:"+JcropAPI+" |webcam:"+$('#webcam').css('display'));

                 //alert($('#webcam').css('display'));
                 if($('#webcam').css('display')=='block'){

                 //if(jcropOn){ destroyJcrop(); }

                 originalWidth = 130; originalHeight = 176;
                 $('#canvas').prop('width',130);  $('#canvas').prop('height',176);

                canvas = document.getElementById("canvas");
                context = canvas.getContext("2d");

                context.drawImage(video,145,0,130*2.7,176*2.7,0,0,130,176);


                var imageData=context.getImageData(0,0,130,196);



  // This loop gets every pixels on the image and

      for(var i = 0; i < imageData.data.length; i += 4) {
          var r = imageData.data[i],
              g = imageData.data[i+1],
              b = imageData.data[i+2],
              gray = (r+g+b)/3;
              imageData.data[i] = gray;
              imageData.data[i+1] = gray;
              imageData.data[i+2] = gray;
        }

     context.putImageData(imageData, 0, 0);

                dataURL = canvas.toDataURL("image/jpeg",0.85);
                // $('#image1').removeAttr("width"); $('#image1').removeAttr("height");
                $('#fotoOficial').prop('src',dataURL);
                //$('#image1').prop('width',originalWidth); $('#image1').prop('height',originalHeight);

                //canvas.prop('width',originalWidth);  canvas.prop('height',originalHeight);
                //alert(originalWidth+"/"+originalHeight)
                //originalWidth= $('#image1').prop('width');originalHeight = $('#image1').prop('height');

                setInputFile();

                // the fade only works ocanvas.toDataURL()n firefox?
                //$("#video").fadeOut("slow");                $("#image").fadeIn("slow");

                initJcrop("fotoOficial");

                killWebcam();
               }
               //else if(JcropAPI){doCrop();}
              $('#snapshot').hide();
              //$('#crop').show();
              $('#saveImage').show();
            }

function initJcrop(id){

       jcropOn = true;
       image = $('#'+id);
       width = image.prop('width');height = image.prop('height');
       //image.removeAttr("width");image.removeAttr("height");

       canvas = document.getElementById("canvas");

       $('#canvas').prop('width',130);  $('#canvas').prop('height',176);


       //alert(originalWidth+"/"+originalHeight);
       //if(originalWidth==0){originalWidth = width;originalHeight = height;}
       originalWidth = width;originalHeight = height;
       //alert(width+"/"+height);

       JcropAPI = $('#'+id).Jcrop({
                                  onChange: setCoords,
                                  bgColor: 'rgb(145,176,241)',
                                  boxWidth: width, boxHeight: height,
                                  //trueSize: [width, height ],
                                  trueSize: [originalWidth, originalHeight ],
                                  aspectRatio:1.3/1.76,
                                  setSelect:[0,0,originalWidth,originalHeight],
                                  //aspectRatio:573/353,
                                  bgOpacity: 0.5
                                 });

     }


     function destroyJcrop(){
       //$('#image1').attr('css', "");
       document.getElementById("fotoOficial").style="";
       if($('#fotoOficial').data('Jcrop')){
          JcropAPI = $('#fotoOficial').data('Jcrop');
          JcropAPI.destroy();
       }
       jcropOn =false;
       //alert(image.prop('width'));
     }

     function doCrop(){
       //alert("doCrop");
       //alert(width+" / "+height);
       width =130 ;height =176;
       var image_tmp = new Image();
       image_tmp.src = image.prop('src');
       image_tmp.width=width;
       image_tmp.height=height;
       originalWidth = width;
       originalHeight = height;

       canvas_ctx = canvas.getContext("2d");

       //alert("doCrop: "+width+" / "+height);
       canvas_ctx.drawImage(image_tmp,x1,y1,(x2-x1),(y2-y1),0,0,width,height);
       //canvas_ctx.drawImage(image_tmp,x1,y1,(x2-x1),(y2-y1),0,0,295,195);
       destroyJcrop();

       dataURL = canvas.toDataURL("image/jpeg",0.85);
       image.prop('src',dataURL);

       setInputFile();

       //initJcrop('image1');

     }

     function setCoords(c){
              x1=c.x;x2=c.x2;y1=c.y;y2=c.y2;w=c.w;h=c.h;
              $('#coords').val("x1:["+x1+"] y1:["+y1+"] x2:["+x2+"] y2:["+y2+"] w:["+w+"] h:["+h+"]");
     };

function setInputFile(){
                //alert("setInputFile");
                canvas = document.getElementById("canvas");
                dataURL = canvas.toDataURL("image/jpeg",0.85);
                var blobBin = atob(dataURL.split(',')[1]);
                var array = [];
                for(var i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i));
                }
                fileFromBlob   = document.querySelector('input[type=file]').files[0];
                fileFromBlob = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});

                $('#imageInput').prop('src',fileFromBlob);
            }

function killWebcam() {
    //alert("killwebcam");
    $('#image').show();
    $('#webcam').hide();
    if (localstream != null) {
        video.pause();
        video.src = "";
        localstream.getTracks()[0].stop();
        localstream = null;
        //video=null;
    }
}
