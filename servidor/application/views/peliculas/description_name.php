<div class="">
    <form role="form" method="post" action ="<?php echo site_url('peliculas/new_entry_DB'); ?>">
      <div class="form-group" >
        <label for="name">Nombre</label>
        <input type="text" class="form-control" id="name" name="name">
      </div>
      <div class="form-group">
        <label for="desc">Descripción</label>
        
        <textarea rows="3" class="form-control" id="desc" name="desc"></textarea>
      </div>
      <div class="form-group">
        <label>
        
          <input type="checkbox" name="EnCartelera">
          En cartelera
        </label>

        
      </div>
      <button type="submit" class="btn btn-default">Siguiente</button>
    </form>
</div>