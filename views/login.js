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
            console.log(!name.match(lowerCaseLetters));
            
            if(pass.match(upperCaseLetters) && pass.match(lowerCaseLetters) && pass.match(numbers) && pass.length>=8 && name.match(lowerCaseLetters)) {
                $.post('/api/register', user, function(result) {
                    //allow access to game using dollar get index html 
                    console.log(result);

                    $("#wrongpass").html("Username already Exists");
                    if(result == null) {
                        document.getElementById("myModal").style.display = "block";
                        // document.getElementById("wrongpass").style.display = "block";
                        // document.getElementById("guidelines").style.display = "block";
                    }
                    if(result != null) {
                        document.getElementById("myModal").style.display = "none";
                        document.getElementById("wrongpass").style.display = "none";
                        sessionStorage.setItem("Player", name);
                        location.replace("play.html");
                    }
                    //request.session.username = username;
                    // location.replace("play.html");
                })
                .fail(function() {
                    console.log("error with registration");
                 // location.replace("index.html");
                });
            } else if(!name.match(lowerCaseLetters)){
                $("#wrongpass").html("Username field is empty");
                document.getElementById("myModal").style.display = "block";
                document.getElementById("guidelines").style.display = "none";
            } else {
                console.log("guide");
                $("#wrongpass").html("Password doesn't follow the Guidelines");
                document.getElementById("guidelines").style.display = "block";
                //wrongpass also?
                document.getElementById("myModal").style.display = "block";
                var modal = document.getElementById("myModal");
                // When the user clicks anywhere outside of the modal, close it
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
                    //wrong password
                    $("#wrongpass").html("Incorrect Password");
                    document.getElementById("myModal").style.display = "block";
                    document.getElementById("guidelines").style.display = "block";
                } else if(result == 0) {
                    $("#wrongpass").html("Username doesn't Exist");
                    document.getElementById("myModal").style.display = "block";
                    document.getElementById("guidelines").style.display = "none";
                } else {
                    document.getElementById("myModal").style.display = "none";
                    sessionStorage.setItem("Player", name);
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