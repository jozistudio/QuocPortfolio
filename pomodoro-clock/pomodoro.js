/*
User Story: I can start a 25 minute pomodoro, and the timer will go off once 25 minutes has elapsed.

User Story: I can reset the clock for my next pomodoro.

User Story: I can customize the length of each pomodoro.
*/



$(document).ready(function() {
  var timer; // timer's value will be set as interval when clock is clicked
  
  var counting = false;
  var isSession = true;
  var breakLength = 5;
  var sessionLength = 25;
var remain = sessionLength * 60;


  // control buttons clicked
  $(".btn-control").on("click", function(){
    console.log(this.value);
    var adding = this.value.includes("Inc") ? +1 : -1;


    var type = this.value.includes("session")? "#session" : "#break";
    var updateValue = Number($(type).html()) + adding < 1 ? 1 : Number($(type).html()) + adding;
    $(type).html(updateValue); 
    console.log(this.value);
    // update lengths
    breakLength = Number($("#break").html());
    if (sessionLength != Number($("#session").html())){
      // session length changed
      // reset the clock and remain
      sessionLength = Number($("#session").html());
      $("#clock").html(sessionLength + ":00");
      // update background counter
      percent = 0;
      $(".timerBg").css('height', percent + "%");
      // update flag
      isSession = true;
      $("#type").html(isSession? "SESSION":"BREAK");
      // update remain
      remain = sessionLength * 60;
    }

  });

  // timer is clicked
  $(".timer").on("click", function(){
    if (counting === false) {
      console.log("START COUNTING DOWN");
      // calculate the remaing time in second
      $("#clock").html(remain);
      console.log(remain);
      timer = setInterval(countDown, 1000);  
      counting = true;

      // disable buttons
      $(".btn-control").prop("disabled", true); 
    } else {
      console.log("STOP COUNTING");
      clearInterval(timer);
      counting = false;
      // enable buttons
      $(".btn-control").prop("disabled", false);
    }

  });

  var percent = 0;

  function countDown(){
    console.log(remain);
    // convert length to second
    remain--;

    if (remain > 0){
      // display the clock
      // update text
      var second = remain % 60;
      var secondText = second < 10 ? "0" +second : second;  $("#clock").html(Math.floor(remain/60) + ":" + secondText);

      // animate clock 
      percent += 100/60;
      percent %= 100;
      console.log(percent);  console.log($(".timerBg").css('height'));  $(".timerBg").css('height', percent + "%");
    } else {
      // stop the current clock and change to another clock
      console.log(breakLength + " - " + sessionLength);
      remain = isSession ? breakLength : sessionLength; // in minute
      // convert to second
      remain *= 60;
      isSession = !isSession;
      // change text
      $("#type").html(isSession? "SESSION":"BREAK");
      $("#clock").html(remain);
      // update percent
      percent = 0;
    }

  }
});

/*
  $("#breakDec").on("click", function(){
    breakLength--;  $("#breakLength").html(breakLength);
  });

  $("#breakInc").on("click", function(){
    breakLength++;  $("#breakLength").html(breakLength);
  });

  $("#sessionDec").on("click", function(){
    sessionLength--;  $("#sessionLength").html(sessionLength);
  });
   $("#sessionInc").on("click", function(){
    sessionLength++;  $("#sessionLength").html(sessionLength);
  });
  */