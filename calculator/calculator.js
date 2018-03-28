/*
User Story: I can add, subtract, multiply and divide two numbers.

User Story: I can clear the input field with a clear button.

User Story: I cannot provide number greater than 99,999,999

User Story: I can keep chaining mathematical operations together until I hit the equal button, and the calculator will tell me the correct output.
*/

function btnClicked(event){
  var obj = event.target;
  console.log(obj.getAtribute("value"));
} 



$(document).ready(function() {
  var chain = [];
  // new input when operator buttons are pressed
  var isNewInput = true;
  var fomulaStr = "";
  var parameter = $("#parameter");
  var fomula =  $("#fomula");
  var started = false; // first input must be a number
  var floating = false;

  // convert string to operator
  var operatorsStr = ["+", "-", "x", "?"];
  var operatorsFunc = [
    function(a,b){return a+b;},
    function(a,b){return a-b;},
    function(a,b){return a*b;},
    function(a,b){return a/b;}
  ];

  function convertFomulaToChain(){
    var text = fomula.html();
    var re = /(\d+\.*)+|([\+\-x\?])+/g;
    var matches = text.match(re);
    console.log("SHOW ME MATCHES: " + matches);
    if (matches != null)
      chain = matches;
  }

  function convertChainToFomula(){
    var str = "";
    chain.forEach(function(item){
      str+= item;
    });
    if (str == ""){
      str = "0";
      started = false;
    }

    fomula.html(str);
  }

  function reset(){
    // reset flags
    isNewInput = true;
    chain = [];
    fomulaStr = "";
    started = false;
    console.log("Cleared all information on display section.");
  }

  // AC button onclicked event
  $("#acBtn").on("click", function(){
    console.log(this.value + " button is pressed.");
    // clear the parameter and fomula
    parameter.html("0");
    fomula.html("0");
    reset();
  });

  // Clear button onclicked event
  $("#ceBtn").on("click", function() {
    console.log(this.value + " button is pressed.");
    if(!started)
    {
      reset();
      fomula.html("0");
    } else {
      convertFomulaToChain();
      //isNewInput = true;
      isNewInput = !isNewInput;
      // remove last input
      chain.pop();
      // rebuild fomula
      convertChainToFomula();
    }
    parameter.html("0");

  });

  // number buttons onclicked event
  $(".numBtn").on("click", function(){
    console.log(this.value + " button is pressed.");
    if (started === false){
      parameter.html("");
      fomula.html("");
      started = true;
      //return;
    } 
    // update parameter
    if (isNewInput){
      if (this.value == "0"){
        var lastChar = fomula.html().length; // tmp stores fomula length
        lastChar = fomula.html()[lastChar-1]; // get last digit
        console.log(lastChar);
        //console.log("Number cant start with 0");
        if (lastChar != "0"){
          parameter.html("0");
          fomula.html(fomula.html() + "0");
        } 
        //return;
      } else {
        console.log("Started a new input")
        // user inserts new input
        parameter.html(this.value);
        // update fomula
        if (fomula.html() == "0")
          fomula.html(this.value)
          else
            fomula.html(fomula.html() + this.value);
        isNewInput = false;
      }

    } else {
      // user is inserting more digits to current input
      console.log("keep updating input")
      parameter.html(parameter.html() + this.value);
      // update fomula
      fomula.html(fomula.html() + this.value);
    }
    // check if the parameter/fomula is out of length
    if (parameter.html().length>15 || fomula.html().length > 30){
      reset();
      fomula.html("Digit Limit Met");
      parameter.html("0");
    }
  });

  // Operator buttons onclicked event
  $(".oprBtn").on("click", function() {
    console.log(this.value + " button is pressed.");
    if (started === false){
      console.log("First input must be a number.");
      return ;
    }
    if (isNewInput){
      console.log("Waiting for new input (number). Can't add more operators");
      return;
    }

    parameter.html(this.value);
    isNewInput = true;
    fomula.html(fomula.html() + this.value);
    // convert fomula into chain
    convertFomulaToChain();
  });

  // FLOATING NUMBER
  $("#floatBtn").on("click", function(){
    console.log(this.value + " button is pressed.");
    console.log("Is inputing new value? " + isNewInput);
    // if parameter already contained floating point, 
    // do not add more
    var contain = (parameter.html().indexOf('.') >= 0);
    console.log("Does parameter contain .?" + contain);

    // the floating is based on current/last input
    // case 1: inputing new value - true
    // means start with 0.xxx
    // insert 0. to parameter and fomula
    if (isNewInput && !contain){
      parameter.html("0.");
      var lastChar = fomula.html().length; // tmp stores fomula length
      lastChar = fomula.html()[lastChar-1]; // get last digit
      console.log(lastChar);
      //console.log("Number cant start with 0");
      if (lastChar != "0")        
          fomula.html(fomula.html() + "0.");
        else 
          fomula.html(fomula.html() + ".");
      // set flags
      isNewInput = false;
      started = true;
      return;
    }

    // case 2: inputing new value - false
    // means the input is xxx.
    // insert '.' to parameter and fomula
    if (!isNewInput && !contain){
      parameter.html(parameter.html() + ".");
      fomula.html(fomula.html() + ".");
      // set flags
      isNewInput = false;
      started = true;
      return;
    }
  });

  // CALCULATING
  $("#calBtn").on("click", function(){
    if (started === false){
      return;
    }
    // convert fomula into chain
    convertFomulaToChain();
    console.log(chain);
    if (chain.length < 3){
      return;
    }
    var num1 = NaN;
    var opr = "";
    
    /* THIS METHOD IS NOT WORKING FOR THE ORDER 
	OF OPERATORS --> Alternative solution: eval()
    // calculating from chain
    chain.forEach(function(i){
      console.log(i);
      var item = Number(i);
      if (isNaN(Number(item))){
        // item is an operator
        opr = i;
      } else {
        // item is a number
        if (isNaN(num1))
          num1 = item;
        else if (opr != ""){

          var index = operatorsStr.indexOf(opr);
          console.log("Operator: " + opr + " index: " + index);
          if (index != -1){
            num1 = operatorsFunc[index](num1, item);
            console.log(num1);
          } else {
            console.log ("ERROR - num1: " + num1 + " operator: " + opr);
          }

        } else {
          console.log ("ERROR - num1: " + num1 + " operator: " + opr);
        }
      }
    });

    // calculate multiply and divide first
    for (var i = 0; i < chain.length; i++){
      var item = chain[i];
      //opr = operatorsStr.indexOf(item) > -1 ? item: null;
      if (isNaN(Number(item))){
        // item is an operator
        
        
      } else {
        
      }
    }
    */
    var fn = chain.join(" ");
    fn = fn.replace("x", "*");
    fn =  fn.replace("?", "/");
    console.log(fn);
    num1 = eval(fn);
    // display result
    num1 = Math.round(num1 * 100)/100;
    parameter.html(num1);
    fomula.html(fomula.html() + "="+num1);
    //reset();
    started = false;
    isNewInput = true;
    if (parameter.html().length>15 || fomula.html().length > 30){
      reset();
      fomula.html("Digit Limit Met");
      parameter.html("0");
    }
  });
});