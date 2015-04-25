<nav class="navbar navbar-inverse" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand active" href="<?php echo site_url('home'); ?>">MEMORIAPP</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <!-- <li class="active"><a href="home/upload_audiodescription"></a></li> -->
        <li <?=echoActiveClassIfRequestMatches("home")?>>
          <a href="<?php echo site_url('home'); ?>">Inicio</a>
        </li>
        <li <?=echoActiveClassIfRequestMatches("lista")?>>
          <a href="<?php echo site_url('epubs/lista'); ?>">Listado de eBooks</a>
        </li>
        <li <?=echoActiveClassIfRequestMatches("agregar")?>>
            <a href="<?php echo site_url('epubs/agregar'); ?>">Agregar eBook</a>
        </li>
      </ul>
   
      <ul class="nav navbar-nav navbar-right">
        <li><a href="<?php echo site_url('home/logout'); ?>">Salir</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
<div class="container">

<?php 

function echoActiveClassIfRequestMatches($requestUri)
{
    $current_file_name = basename($_SERVER['REQUEST_URI'], ".php");

    if ($current_file_name == $requestUri)
        echo 'class="active"';
}

?>