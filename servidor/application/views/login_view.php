


   <div class="container" style="width: 28%;">

      <?php echo form_open('verifylogin'); ?>
      <?php echo validation_errors(); ?>
        <h2 class="form-signin-heading">Por favor ingrese</h2>
        <input type="text" class="form-control" placeholder="Username"  name="username" required autofocus>
        <input type="password" class="form-control" placeholder="Password" id="passowrd" name="password" required>
        
        <button class="btn btn-lg btn-primary btn-block" type="submit">ingresar</button>
      </form>

    </div> <!-- /container -->

 