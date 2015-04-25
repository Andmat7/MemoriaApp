<h2>Lista de eBooks</h2>
<table class="table table-bordered">
  <tr>
  <?php
  $query = $this->db->query('SELECT id,title FROM books ORDER BY id');
  
  foreach ($query->result() as $row){
		$id = $row->id;
		echo '<tr>';
		echo '<td style="vertical-align: middle"><a href="' . site_url('epubs/view/'. $id ) . '">' . $row->title .'</a></td>';
		echo '<td width="50px"><a class="btn btn-primary" href="' . site_url('epubs/editar/'. $id ) . '">Editar</a></td>';
		echo '<td width="50px"><a class="btn btn-danger" href="' . site_url('epubs/borrar/'. $id ) . '">Borrar</a></td>';
		echo '</tr>';
	}
	
  ?>
  </tr>
</table>

<a href="<?php echo site_url('home'); ?>" class="btn btn-default" role="button">Volver</a>