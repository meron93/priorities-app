$(document).ready(function() {
  let currentId;
  let currentGoal;

  $(".navbar-nav li a").click(function(event) {
    $(".navbar-collapse").collapse('hide');
  });
  
  $("#signup, #homepage, #progresspage").hide();

  $(document).on("click", "#sign-up-button", function() {
    $("#login").hide();
    $("#signup").show();
  });

  // $(document).on("click", "#homepage-button", function() {
  //   $("#login").hide();
  //   $("#homepage").show();
  // });

  $("#login-form").submit(function(e) {
    console.log("logig-form working")
    e.preventDefault();
    let data = {};
    data.username = $("#username").val();
    data.password = $("#password").val();
    $.ajax({
      url: "/users/login",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json"
    }).done(function(data, status) {
        console.log("login http req working")
       $("#login").hide();
       $.ajax({
        url: "priorities/today",
        type: "GET",
        dataType: "json"
       }).done(function(data, status) {
        if (status === "success") {
          currentGoal = data.goal;
          if (data.completed) {
            var completedGoalHtml = `<h1 class='text-center'><del>${currentGoal}</del><h1>`;
            $("#homepage-goal-display").html(completedGoalHtml);
            $("#homepage").show();
            $("#set-goal").hide();
            $("#homepage-goal-display").show();
          } else {
          currentId = data._id;
          var goalHtml = "<h2 class='text-center'>Today's priority: " + currentGoal + "</h2>";
          goalHtml += "<h1 class='text-center'>" //+ $("#goal-text").val();
          goalHtml += "&nbsp;&nbsp;<span id='delete-goal-glyphicon' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
          goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
          goalHtml += "&nbsp;&nbsp;<span id='edit-goal-glyphicon' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
          goalHtml += "</h1>";
          $("#goal-text").val("");
          $("#set-goal").html(" ");
          $("#homepage-goal-display").show();
          console.log("home showing")
          $("#homepage-goal-display").html(goalHtml);
          } 
        } else {
          console.log("hp should be dis")
        $("#homepage").show();
        }
       }).fail(function(err) {
        console.log(err);
       })
    }).fail(function(err) {
      console.log(err);
    }) 
  });

  $("#signup-form").submit(function(e) {
    e.preventDefault();
    let data = {};
    data.username = $("#new-username").val();
    data.password = $("#new-password").val();
    data.firstName = $("#firstName").val();
    data.lastName = $("#lastName").val();
    $.ajax({
      url: "/users",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json"
    }).done(function(data, status) {
      $("#signup").hide();
      $("#homepage").show();   
    }).fail(function(err) {
      console.log(err.responseText);
    })   
  });

  $(document).on("click", "#login-button", function() {
    $("#signup").hide();
    $("#login").show();
  });

  $(document).on("click", ".progress-button", function() {
    $("#homepage").hide();
    $.ajax({
      url: "/priorities/all",
      type: "GET"
    }).done(function(data, status) {
      if (data.length > 0 ) {
        console.log("data: " + data.length)
        var completed = 0;
        for (goal=0; goal<data.length; goal++) {
          if (data[goal].completed === "true") {
          completed++
          };
        };

        console.log("completed: " + completed)
        var percentage = completed/data.length * 100;
        var html = "<h2 class='text-center'> You've succeeded in completing " + Math.round(percentage) + "% of your most important goals.</h2>";
        $("#progressStats").html(html);
        $(document).ready(function() {
        var ctx = document.getElementById('myChart').getContext('2d');
        //ctx.width = 30;
        //ctx.height = 30;
        Chart.defaults.global.defaultFontSize = 20;
        var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
          labels: ["Completed Priorities", "Incompleted Priorities"],
          datasets: [{
            label: "Priority Performance",
            backgroundColor: [
            'rgba(76, 174, 86, 1)',
            'rgba(196, 69, 75, 1)'
            ],
            borderColor: [
            'rgba(76, 174, 86, 1)',
            'rgba(196, 69, 75, 1)'
            ],
            data: [percentage, 100-percentage],
          }]
        },

        // Configuration options go here
        options: {
          responsive: false,
          maintainAspectRatio: true
        }
        });
        });
      } else {
        $("#progressStats").html("<h2 class='text-center'>No goals to report.</h2>");
      }
      $("#progresspage").show();
    }).fail(function(err) {
      console.log(err);
    })
  });

  $(document).on("click", "#homenav-button", function() {
    $("#progresspage").hide();
    $("#homepage").show();
  });

  $(document).on("click", ".logout-button", function(e) {
    e.preventDefault();
    $.ajax({
      url: "/users/logout",
      type: "GET"
    }).done(function(data, status) {
      $("#progresspage").hide();
      $("#homepage").hide();
      $("#password").val("");
      $("#login").show();
    }).fail(function(err) {
      console.log(err.responseText);
    })
  });

  $(document).on("submit", "#set-goal", function(e) {
    e.preventDefault();
    var goal = $("#goal-text").val();
    let data = {};
    data.goal = goal;
    data.completed = false;
    $.ajax({
      url: "/priorities/create",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json"
    }).done(function(data, status) {
      console.log(data);
      currentId = data._id;
      currentGoal = data.goal;
      var goalHtml = "<h2 class='text-center'>Today's priority: " + currentGoal + "</h2>";
      goalHtml += "<h1 class='text-center'>" //+ $("#goal-text").val();
      goalHtml += "&nbsp;&nbsp;<span id='delete-goal-glyphicon' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
      goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
      goalHtml += "&nbsp;&nbsp;<span id='edit-goal-glyphicon' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
      goalHtml += "</h1>";
      $("#goal-text").val("");
      $("#set-goal").html(" ");
      $("#homepage-goal-display").html(goalHtml);
    }).fail(function(err) {
      console.log(err);
    })
  });

  $(document).on("click", "#edit-goal-glyphicon", function() {
    var goalToEdit = currentGoal;
    var editHtml = "<h2 class='text-center'>Today's priority: </h2>"; 
    editHtml += "<div class='row'>";
    editHtml += "<div class='col-sm-6 col-sm-offset-3'>";
    editHtml += "<form id='edited-goal'>";
    editHtml += "<input type='text' class='form-control input-lg' id='edited-goal-text' value=" + "'" + goalToEdit + "'" + " required>";
    editHtml += "</form>";
    editHtml += "</div>";
    editHtml += "</div>";   
    $("#homepage-goal-display").html(editHtml);
  });

  $(document).on("submit", "#edited-goal", function(e) {
    e.preventDefault();
    var goal = $("#edited-goal-text").val();
    currentGoal = goal;
    data = {};
    data.goal = goal;
    data._id = currentId;
    $.ajax({
      url:"priorities/" + currentId,
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json"
    }).done(function(data, status) {
      var goalHtml = "<h2 class='text-center'>Today's priority: " + currentGoal + "</h2>";
      goalHtml += "<h1 class='text-center'>" //+ $("#goal-text").val();
      goalHtml += "&nbsp;&nbsp;<span id='delete-goal-glyphicon' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
      goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
      goalHtml += "&nbsp;&nbsp;<span id='edit-goal-glyphicon' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
      goalHtml += "</h1>";
      $("#homepage-goal-display").html(goalHtml);
    }).fail(function(err) {
      console.log(err);
    });
  });

  $(document).on("click", "#goal-completion-glyphicon", function() {
    $.ajax({
      url: "priorities/completed/" + currentId,
      type: "PUT"
    }).done(function(data, status) {
      var completedGoalHtml = `<h1 class='text-center'><del>${currentGoal}</del><h1>`;
      $("#homepage-goal-display").html(completedGoalHtml);
    }).fail(function(err) {
      console.log(err);
    });
  });


  $(document).on("click", "#delete-goal-glyphicon", function(){
    $.ajax({
      url: "priorities/" + currentId,
      type: "DELETE",
    }).done(function(data, status) {
      var setGoal = "<form id='set-goal' role='form'>";
      setGoal += "<div class='row'>";
      setGoal += "<div class='col-sm-8 col-sm-offset-2'>"
      setGoal += "<div class='input-group input-group-lg'>";
      setGoal += "<input type='text' class='form-control' id='goal-text' placeholder='Enter your most important goal for the day.' required>";
      setGoal += "<div class='input-group-btn'>"; 
      setGoal += "<button class='btn btn-primary' type='submit'>Submit</button>";
      setGoal += "</div>";
      setGoal += "</div>";
      setGoal += "</div>";
      setGoal += "</div>";
      setGoal += "</form>";
      $("#goal-submission-form").html(setGoal);
      $("#homepage-goal-display").html("<p></p>");
    }).fail(function(err) {
      console.log(err);
    });
  });

});



