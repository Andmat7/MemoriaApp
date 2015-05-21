<h2>Diccionario</h2>
<p>Para modificar agregar o eliminar nuevas palabras primero descargue el diccionario en el formato excel que se muestra a continuación</p>
<a class="btn btn-primary" href="<?php echo site_url('dictionary/download'); ?>">Descargar excel </a>
<p>
	tenga en cuenta las siguientes recomendaciones
</p>

<ul>
	<li>El formato es: primera columna una sola palabra(la palabra a definir) y la segunda columna: definicion</li>
	
	<li class="bg-danger"><strong> Recuerde que esta es una operacion destructiva por lo que debe guardar una copia local del archivo excel descargado anteriormente antes de subir</strong></li>

</ul>


<p>Cuando ya tenga el excel listo con las adiciones, correcciones, y borrado de columnas, procesa a subirlo, El sistema borrara toda la base de datos de diccionario y procederá a crear de nuevo la base de datos según el nuevo excel.</p>



<form role="form" method="post" enctype="multipart/form-data" action ="<?php echo site_url('dictionary/read'); ?>" >

	<div class="form-group">
					<label for="epub">Nuevo archivo excel</label>
					<input id="excel" name="excel" type="file" accept=".xls"/>
	</div>
	<button type="submit" class="btn btn-default">Subir excel</button>
</form>
