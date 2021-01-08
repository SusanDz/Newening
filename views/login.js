function init() {
    $(document).ready(function() {
        $("#register").click(function(e) {
            var name =$("#username").val();
            var pass =$("#password").val();
            var user = {username:name, password:pass };//username is attribute
            console.log(name + "'" + pass);
            console.log("meow");
            $.post('/api/register', user, function(result) {
              //allow access to game using dollar get index html 
                console.log(result);
              //request.session.username = username;
                // location.replace("index.html");
            })
            .fail(function() {
                console.log("error with registration");
                // location.replace("index.html");
            });

        }),
        $("#login").click(function(e) {
            var name =$("#username").val();
            var pass =$("#password").val();
            var user = {username:name, password:pass };//username is attribute
            console.log(name + "'" + pass);
            $.post('/api/login', user, function(result) { 
                console.log(result);
                console.log('Welcome back', name);
              //login correct show the game page here using $.get
              //request.session.username = name;
            //   console.log("value from regis:", sessionName);
             // if(request.session.username){
            //   if(sessionName){
                //   response.redirect("index.html");
                //   location.replace("register.html");
            //   }
  
            })
            .fail(function() {
                console.log("error with login");
                //location.replace("play.html");
            });

        })
        //   Cancel: function() {
        //       //cancel closes the dialog  
        //       $(this).dialog("close");
        //   }
    });
}