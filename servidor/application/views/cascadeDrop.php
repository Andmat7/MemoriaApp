<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>cascade drops example</title>
        
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>

        
        <script type="text/javascript">
        
        
            $(document).ready(function() { 

                
                $("#countriesDrp").change(function(){
                   
                     /*dropdown post */
                    $.ajax({
                    url:"<?php echo base_url(); ?>index.php/cascadeDrop/buildDropCities",    
                    data: {id: $(this).val()},
                    type: "POST",
                    success: function(data){
                        
                        $("#cityDrp").html(data);
                    }
                    
                    });
               
                });

            });
            
        </script>
        
      
    </head>
    <body>
     
        <!--country dropdown-->
        <?php echo form_dropdown('countriesDrp', $countryDrop,'','class="required" id="countriesDrp"');  ?>

        <br />
        <br />
        
        <!--city dropdown-->
        <select name="cityDrp" id="cityDrp">
        <option value="">Select</option>
        </select>
        <br />
        
    </body>
    
    
    
    
</html>