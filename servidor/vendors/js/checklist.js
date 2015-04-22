function add_tr (message,url,table_id,timeout) {
    $('#'+table_id).append('<tr><td>'+message+'</td><td></td><td></td><td><img src="'+base_url+'/vendors/images/loading.gif"></td></tr>')
    var data_to_send={
        dataType: "json",
        url: url,
        success: function(data){
            if (data.success===1) {
                $('#tabla_ejemplo tr td').last().html('<img style="height:30px"src="'+base_url+'/vendors/images/check.png">');
                if (typeof data.message_success !== 'undefined') {
                    $('#tabla_ejemplo tr:last td:last').prev().html('<strong>'+data.message_success+'</strong>');    
                };
                
            }else{
                $('#tabla_ejemplo tr td').last().html('<img style="height:30px"src="'+base_url+'/vendors/images/cross_red.png">');
                if (typeof data.message_error !== 'undefined') {
                    $('#tabla_ejemplo tr:last td:last').prev().html('<strong>'+data.message_error+'</strong>');    
                };
                
            }
            if (typeof data.time !== 'undefined') {
                var tiempo=secondsToTime(data.time);
                $('#tabla_ejemplo tr:last td:last').prev().prev().html(tiempo.h+':'+tiempo.m+':'+tiempo.s);       
            };
          
          
          
        },
        error:function (){
            $('#tabla_ejemplo tr td').last().html('<img style="height:30px"src="'+base_url+'/vendors/images/cross_red.png">');
            $('#tabla_ejemplo tr:last td:last').prev().html('<strong>tiempo de espera agotado por favor intente de nuevo</strong>')
        }
    };
    if (typeof timeout !== 'undefined') {
        data_to_send.timeout=timeout;
    }
    $.ajax(
        data_to_send
        );
}

// add_tr('unmensaje',site_url+'/peliculas/example_url','tabla_ejemplo',6000);

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));
    
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    
    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };  
    return obj;
}