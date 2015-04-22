<h2>Listado de películas</h2>

<table class="table table-striped" id="tabla_ejemplo">
  
</table>
<table class="table table-bordered">
  <tr>
  <?php
      $query = $this->db->get('peliculas');

      foreach ($query->result() as $row){

        if ($row->original==0) {
          $estado='<div style="color:red">Falta el audio original</div>';
          
        }else{
          if ($row->subtitulo==0&&$row->audiodescripcion==0) {
            $estado='<div style="color:red">Falta la  audiodescripcion o los subtitulos</div>';
          }
          else{
            if ($row->subtitulo==0&&$row->audiodescripcion==0) {
              $estado='<div style="color:red">Falta la  audiodescripcion o los subtitulos</div>';
            }else{
              if ($row->subtitulo==0) {
                $estado='<div style="color:green">Faltan subtitulos</div>';
              }else{
                if ($row->audiodescripcion==0) {
                  $estado='<div style="color:green">Falta audiodescripcion</div>';
                }else{
                  $estado='<div style="color:green">Listo</div>';
                }
              }

              }
              
            }

          }

        
	       $id = $row->id;
	       echo '<tr>';
	       echo '<td>' . $row->Nombre .'</td>';
	       echo '<td><a href="' . site_url('peliculas/editar/'. $id ) . '">Editar</a></td>';
	       echo '<td><a href="' . site_url('peliculas/borrar/'. $id ) . '">Borrar</a></td>';
         echo '<td>'.$estado.'</td>';
	       echo '</tr>';
      }
  
  ?>
  
  </tr>
</table>

<a href="<?php echo site_url('home'); ?>" class="btn btn-default" role="button">Volver</a>
