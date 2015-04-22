<?php print_r($bano); ?>
       
<script type="text/javascript">
        
        
            $(document).ready(function() { 

                
                $("#countriesDrp").change(function(){
                   
                     /*dropdown post */
                    $.ajax({
                    url:"<?php echo base_url(); ?>index.php/cascadeDrop/buildDropCities",    
                    data: {id: $(this).val()},
                    type: "POST",
                    success: function(data){
                        console.log(data);
                        $("#cityDrp").html(data);
                    }
                    
                    });
               
                });

            });
            
</script>


<div class="">
    <form role="form" method="post" action ="<?php echo site_url('salas/editarSave'); ?>">
      <div class="form-group" >
        <label for="name">Nombre Establecimiento</label>
        <input type="text" class="form-control" id="name" name="name" placeholder="Ejemplo: Centro comercial Gran estación" value="<?php echo $NombreEstablecimiento; ?>" >
      </div>
      <div class="form-group">
        <label for="desc">Dirección</label>
        <input type="text" class="form-control" id="direccion" name="direccion" value="<?php echo $direccion; ?>">
        
      </div>
      <div class="form-group">
        <label for="desc">Departamento</label>
        <?php echo form_dropdown('departamento', $countryDrop,$Departamento,'class="required" id="countriesDrp"');  ?>       
        
      </div> 
      <div class="form-group">
        <label for="desc">Ciudad o municipio</label>
        
        
        <?php echo form_dropdown('municipio',  $MunicipioDrop ,$Ciudad,'class="required" id="cityDrp"');  ?>       
        
        
      </div> 

      
      <div class="form-group">
        <label for="desc">Cine y Sala</label>
        
        <input type="text" class="form-control" id="name" name="sala" placeholder='Ejemplo: CINECO, sala  12—tercer piso' value="<?php echo $Sala; ?>">
      </div>
      <div class="form-group">
        <label for="desc">Medios de transporte para llegar a la sala</label>
        
        <textarea rows="3" class="form-control" id="desc" name="transporte" placeholder="Ejemplos:Estación de Transmilenio más cercana—Salitre greco, Estación de metroplus más cercana—Los Alpes "><?php echo $Transporte; ?></textarea>
      </div>
      <div class="form-group">
        <label for="desc">Rampas</label>
        
        <textarea rows="3" class="form-control" id="desc" name="rampas" placeholder="Ejemplo: Rampas en todas las entradas y desde los sótanos y/o  parqueaderos hasta el primer piso"><?php echo $Rampas; ?></textarea>
      </div>
      <div class="form-group">
        <label for="desc">Estado de escaleras y ascensores </label>
        
        <textarea rows="3" class="form-control" id="desc" name="escaleras" placeholder="Ejemplo: Escaleras eléctricas, ascensores y escalones"><?php echo $Escaleras; ?></textarea>
      </div> 

      <div class="form-group">
        <label for="desc">Otras opciones de accesibilidad</label>
        
        <textarea rows="3" class="form-control" id="desc" name="otros" placeholder="Ejemplo:Alquiler de sillas de ruedas"><?php echo $otrasopciones; ?></textarea>
      </div>      
      <div class="form-group">
        <label>
          <?php 
          
          if ($bano==0) {
            $bano=FALSE;
          
          }
          echo form_checkbox('bano', 'accept', $bano); ?>
          
          Hay baños cerca 
        </label>

        
      </div>

      <button type="submit" class="btn btn-default">Actualizar</button>
    </form>
</div>