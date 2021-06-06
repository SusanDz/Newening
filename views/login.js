function init() {
    $(document).ready(function() {
        $("#register").click(function(e) {
            var name =$("#username").val();
            var pass =$("#password").val();
            var upperCaseLetters = /[A-Z]/g;
            var lowerCaseLetters = /[a-z]/g;
            var numbers = /[0-9]/g;

            var user = {username:name, password:pass };//username is attribute
            console.log(name + "'" + pass);
            console.log("meow");
            
            if(pass.match(upperCaseLetters) && pass.match(lowerCaseLetters) && pass.match(numbers) && pass.length>=8) {
                $.post('/api/register', user, function(result) {
                    //allow access to game using dollar get index html 
                    console.log(result);
                    $("#wrongpass h2").html("Username already Exists");
                    if(result == null) {
                        document.getElementById("wrongpass").style.display = "block";
                    }
                    if(result != null) {
                        document.getElementById("wrongpass").style.display = "none";
                        localStorage.setItem("Player", name);
                        location.replace("play.html");
                    }
                    //request.session.username = username;
                    // location.replace("play.html");
                })
                .fail(function() {
                    console.log("error with registration");
                 // location.replace("index.html");
                });
            } else {
                $("#wrongpass h2").html("Password doesn't follow the Guidelines");
                document.getElementById("wrongpass").style.display = "block";
            }

        }),
        $("#login").click(function(e) {
            var name =$("#username").val();
            var pass =$("#password").val();
            var user = {username:name, password:pass };//username is attribute
            console.log(name + "'" + pass);
            $.post('/api/login', user, function(result) { 
                console.log(result);
                console.log('Welcome back', name);
                if(result == null) {
                    document.getElementById("wrongpass").style.display = "block";
                } else if(result == 0) {
                    $("#wrongpass h2").html("Username doesn't Exist");
                    document.getElementById("wrongpass").style.display = "block";
                } else {
                    document.getElementById("wrongpass").style.display = "none";
                    localStorage.setItem("Player", name);
                    location.replace("play.html");
                }
              //login correct show the game page here using $.get
              //request.session.username = name;
            //   console.log("value from regis:", sessionName);
             // if(request.session.username){
            //   if(sessionName){
                //   response.redirect("index.html");
                //   location.replace("play.html");
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