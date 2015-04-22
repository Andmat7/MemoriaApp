<h2>Listado de películas</h2>

<table class="table table-striped" id="tabla_ejemplo">
  
</table>
<table class="table table-bordered">
  <tr>
  <?php
      $query = $this->db->get('salas');

      foreach ($query->result() as $row){


        
	       $id = $row->id;
	       echo '<tr>';
	       echo '<td>' . $row->NombreEstablecimiento .'</td>';
	       echo '<td><a href="' . site_url('salas/editar/'. $id ) . '">Editar</a></td>';
	       echo '<td><a href="' . site_url('salas/borrar/'. $id ) . '">Borrar</a></td>';

	       echo '</tr>';
      }
  
  ?>
  
  </tr>
</table>

<a href="<?php echo site_url('home'); ?>" class="btn btn-default" role="button">Volver</a>