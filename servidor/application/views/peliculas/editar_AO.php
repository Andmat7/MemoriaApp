<label>Película: <?php echo $title; ?> </label>

<div class="panel panel-default">
<div class="panel-heading" >
<h3 class="panel-title">Audio Original</h3>
</div>
<div class="panel-body">
<form id="upload_form" enctype="multipart/form-data" method="post">

<div class="form-group">
<input type="file" id="audioOriginal" name="audioOriginal">
</div>
<table class="table table-striped" id="tabla_AO">
</table>
<input id="button_subir" class="btn btn-default" type="button" value="Subir" onclick="uploadFile('<?php echo site_url('peliculas/subir_AO'); ?>', '<?php echo site_url('peliculas/audio_descripcion'); ?>', 'tabla_AO')">

</form>
</div>
</div>
<button class="btn btn-default" onClick="location.assign('<?php echo site_url('peliculas/editar_AD'); ?>');">Siguiente </button>