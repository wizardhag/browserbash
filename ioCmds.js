var lineNum=-1;
var line;
var prevIn="";
var inHistory=[];
var thisHistory=[];
var thisHistInd=0;
var filePath="~";


function addLine(){
  if(lineNum!=-1)
    document.getElementById(lineNum).setAttribute("onclick","");
  
  lineNum++;
  
  var newtr=document.createElement("tr");
  
  var numtd=document.createElement("td");
  numtd.setAttribute("class", "lineNumber");
  numtd.appendChild(document.createTextNode(""+lineNum));
  
  var linetd=document.createElement("td");
  linetd.id=lineNum;
  linetd.setAttribute("class", "line");
  linetd.setAttribute("onclick","giveFocus()");

  newtr.appendChild(numtd);
  newtr.appendChild(linetd);
  document.getElementById("table").appendChild(newtr);
  
  line=linetd;
  return line;
}


function print(s){
  if(typeof s !== 'undefined')
    line.innerHTML+=s;
}
function printFilt(s){
  if(typeof s !== 'undefined')
    print(s.split(" ").join("&nbsp;"));
}
function println(s){
  print(s);
  addLine();
}


function openInput(){
  print("<span class='input' contenteditable></span>");
  document.getElementsByClassName("input")[0].onkeydown=KeyPress;
  giveFocus();
}
function giveFocus(){
  if(document.getElementsByClassName("input").length>0)
    document.getElementsByClassName("input")[0].focus();
}

function cmdPrompt(){
  print("<b><span style='color:#8ae234'>anon@"
        +"browser</span>"+":<span style='color:#729fcf'>"
        +filePath+"</span></b>$&nbsp;");
  openInput();
}

function doInput(){
  var input=$(".input")[0];
  var inp=input.innerHTML;
  
  input.contentEditable=false;
  $(".input").removeClass("input");
  println();

  if(inp.charAt(inp.length-1)=='\\'){
    prevIn+=inp.substr(0,inp.length-1);
    printFilt("  --");
    openInput();
  }
  else{
    inHistory.unshift(prevIn+inp);
    thisHistory=inHistory.slice();
    thisHistory.unshift("");
    thisHistInd=0;
    process(prevIn+inp);
    cmdPrompt();
  }
}


/*
 * Credit to stackoverflow user Nico Burns for the original
 * version of this function: (I've edited it)
 */
function cursorToEndOfInput(){
  var input=$(".input")[0];
  var range,selection;
  if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
  {
    //Create a range (a range is a like the selection but invisible)
    range = document.createRange();
    //Select the entire contents of the element with the range
    range.selectNodeContents(input);
    //collapse the range to the end point. false means collapse to end rather than the start
    range.collapse(false);
    //get the selection object (allows you to change selection)
    selection = window.getSelection();
    //remove any selections already made
    selection.removeAllRanges();
    //make the range you have just created the visible selection
    selection.addRange(range);
  }
  else if(document.selection)//IE 8 and lower
  {
    //Create a range (a range is a like the selection but invisible)
    range = document.body.createTextRange();
    //Select the entire contents of the element with the range
    range.moveToElementText(input);
    //collapse the range to the end point. false means collapse to end rather than the start
    range.collapse(false);
    //Select the range (make it the visible selection)
    range.select();
  }
}


function KeyPress(e){
  var evtobj=window.event?event:e;
  var noDefault=true;
  
  if(evtobj.ctrlKey){
    switch(evtobj.keyCode){
      case 67://C
        if(evtobj.shiftKey){
          //Ends current process
          alert("Ctrl+Shift+C");
        }
        else{
          noDefault=false;
        }
        break;
      case 90://Z
        if(evtobj.shiftKey){
          //Puts whatever you're running into a background process. fg restores it.
          alert("Ctrl+Shift+Z");
        }
        break;
      default://nada
    }
  }
  else{
    if(event.key=='Enter'){
      doInput();
    }
    else{
      switch(event.key){
        case 'ArrowUp':
          if(thisHistory.length-1>thisHistInd){
            var input=$(".input")[0];
            thisHistory[thisHistInd]=input.innerHTML;
            input.innerHTML=thisHistory[++thisHistInd];
            cursorToEndOfInput();//This could use some work
          }
          break;
        case 'ArrowDown':
          if(thisHistInd>0){
            var input=$(".input")[0];
            thisHistory[thisHistInd]=input.innerHTML;
            input.innerHTML=thisHistory[--thisHistInd];
            cursorToEndOfInput();//This could use some work
          }
          break;
        default://any other key pressed
          noDefault=false;
      }
    }
  }
  if(noDefault)
    evtobj.preventDefault();
}






