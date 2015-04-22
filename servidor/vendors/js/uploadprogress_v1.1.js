var progressbar_nextURL;
var progressbar_table_id;

function _(el){ return document.getElementById(el); } 

function uploadFile(uploadURL, nextURL, table_id){ 
  
  progressbar_nextURL = nextURL;
  progressbar_table_id = table_id;

  _("button_subir").disabled = true;
//   _("button_subir").disabled ="1";
  addUploadProgress(table_id, "Subiendo audio al servidor");
  var file = _("audioOriginal").files[0]; 
  //alert(file.name+" | "+file.size+" | "+file.type); 
  var formdata = new FormData(); 
  formdata.append("audioOriginal", file); 
  var ajax = new XMLHttpRequest(); 
  ajax.upload.addEventListener("progress", progressHandler, false); 
  ajax.addEventListener("load", completeHandler, false); 
  ajax.addEventListener("error", errorHandler, false); 
  //   ajax.addEventListener("abort", abortHandler, false); 
  ajax.open("POST", uploadURL); 
  ajax.send(formdata); 

}

function progressHandler(event){
  var percent = (event.loaded / event.total) * 100;
  _("upload_progress").style.width = percent+'%';
  //   _("upload_progress").attr('aria-valuenow', percent);
  if ((event.loaded / event.total)  > 0.99){
    $('#' + progressbar_table_id + ' tr td').last().html('<img style="height:30px"src="'+base_url+'/vendors/images/check.png">');
    $('#' + progressbar_table_id + ' tr:last td:last').prev().html('<strong>'+"Hecho"+'</strong>');   
    
    if (progressbar_table_id=="tabla_Sub") {
      addSpinner(progressbar_table_id, "Procesando Subtitulos");
    }else{
      addSpinner(progressbar_table_id, "Procesando audio");
    }
    
  }
}

function completeHandler(event){
  
  _("button_subir").disabled = false;

  var response =event.target.responseText;
  if (response == "success"){
    $('#' + progressbar_table_id + ' tr td').last().html('<img style="height:30px"src="'+base_url+'/vendors/images/check.png">');
    $('#' + progressbar_table_id + ' tr:last td:last').prev().html('<strong>'+"Hecho"+'</strong>'); 
//     location.assign(progressbar_nextURL);
    var b = document.createElement("button");
    b.setAttribute("onclick","nextButtonAction()");
    b.setAttribute("class", "btn btn-default");
    
    var t = document.createTextNode("Siguiente");
    b.appendChild(t);
    if ( _("next") != null   ){
      _("next").appendChild(b);
    }
  }else{
    $('#' + progressbar_table_id + ' tr td').last().html('<img style="height:30px"src="'+base_url+'/vendors/images/cross_red.png">');
    $('#' + progressbar_table_id + ' tr:last td:last').prev().html('<strong>'+response+'</strong>');  
  }
  
}

function errorHandler(event){
  $('#' + progressbar_table_id + ' tr td').last().html('<img style="height:30px"src="'+base_url+'/vendors/images/cross_red.png">');
  $('#' + progressbar_table_id + ' tr:last td:last').prev().html('<strong>'+"Error"+'</strong>');  
}

function addUploadProgress(table_id, message){
  $('#'+table_id).append('<tr><td>'+message+'</td> <td></td><td  width="50%">  <div class="progress">  <div id="upload_progress" class="progress-bar progress-bar-striped active" style="width: 0%;" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar">  </div>  </div>  </td> <td><img src="'+base_url+'/vendors/images/loading.gif"></td></tr>');
}

function addSpinner(table_id, message){
  $('#'+table_id).append('<tr><td>'+message+'</td><td></td><td  width="50%">  <td><img src="'+base_url+'/vendors/images/loading.gif"></td></tr>');
}

function nextButtonAction(){
  location.assign(progressbar_nextURL);
}