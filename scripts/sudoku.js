var boardData = [
   -1,  1, -1, -1, -1, -1, -1,  9, -1,
   -1, -1,  4, -1, -1, -1,  2, -1, -1,
   -1, -1,  8, -1, -1,  5, -1, -1, -1,
   -1, -1, -1, -1, -1, -1, -1,  3, -1,
    2, -1, -1, -1,  4, -1,  1, -1, -1,
   -1, -1, -1, -1, -1, -1, -1, -1, -1,
   -1, -1,  1,  8, -1, -1,  6, -1, -1,
   -1,  3, -1, -1, -1, -1, -1,  8, -1,
   -1, -1,  6, -1, -1, -1, -1, -1, -1
];

function boardPosition(x, y) {
   return y * 9 + x;
}

function sameBlock(x1, y1, x2, y2) {
   let firstRow = Math.floor(y1 / 3) * 3;
   let firstCol = Math.floor(x1 / 3) * 3;
   return (y2 >= firstRow && y2 <= (firstRow + 2) && x2 >= firstCol && x2 <= (firstCol + 2));
}

function sameRow(x1, y1, x2, y2) {
   return y1 == y2;
}

function sameColumn(x1, y1, x2, y2) {
   return x1 == x2;
}

function overlaps(x1, y1, x2, y2) {
   return sameBlock(x1, y1, x2, y2) || sameRow(x1, y1, x2, y2) || sameColumn(x1, y1, x2, y2);
}
window.onload=function running() {
  var table = document.getElementById("board");
  var palette=document.getElementById("palette");

  populateTable(table);
  populatePalette(palette);

  //selection and placing values onto board
  var values=table.getElementsByTagName('td');
  var selectedValue;
  var prevx=-1;//for undo
  var prevy=-1;
  var cell=document.getElementsByTagName('li');
  for(var j=0;j<cell.length-1;j++){//without undo
    var cells=cell[j];
    cells.onclick=function(){//if palette is clicked
      for(var x=0;x<cell.length;x++){
        cell[x].classList.remove("selected");//remove old selection
      }
      selectedValue=this.innerText;//the value from the palette
      this.className="selected";
      for(var k=0;k<values.length;k++){
        values[k].onclick=function(){//if a cell clicked on the table
          var selectedx=this.cellIndex; //x1
          var selectedy=this.parentNode.rowIndex; //y1
          for(var q=0;q<values.length;q++){
              var allx=values[q].cellIndex;//x2
              var ally=values[q].parentNode.rowIndex;//y2
              if(values[q].innerText==selectedValue){
               if(sameRow(selectedx, selectedy, allx, ally) || sameColumn(selectedx, selectedy, allx, ally) || sameBlock(selectedx, selectedy, allx, ally) || overlaps(selectedx, selectedy, allx, ally)){
                  this.innerText=selectedValue;
                  values[q].className="error";
                  this.className="error";
              }
            }
          }
          prevx=selectedx;//for undo
          prevy=selectedy;
          this.innerText=selectedValue;//if no error
        }
      }
    }
  }
  cell[9].onclick=function(){//undo button
    for(var x=0;x<cell.length;x++){
      cell[x].classList.remove("selected");//remove old selection
    }
    if(prevx!=-1 && prevy!=-1){
      selectedValue=table.rows[prevy].cells[prevx].innerText;//only undo last move
      for(var q=0;q<values.length;q++){
      var allx=values[q].cellIndex;//x2
      var ally=values[q].parentNode.rowIndex;//y2
      if(values[q].innerText==selectedValue){
        if(sameRow(prevx, prevy, allx, ally) || sameColumn(prevx, prevy, allx, ally) || sameBlock(prevx, prevy, allx, ally) || overlaps(prevx, prevy, allx, ally) ){
            values[q].classList.remove("error");
            table.rows[prevy].cells[prevx].classList.remove("error")
            table.rows[prevy].cells[prevx].innerText="";
        }
      }
    }
   }
   else{
     console.log("no value was previously selected");
   }
    selectedValue=null;//returns selected value to nothing
  }
}

function populateTable(t){
  var table=t;
  var rows=0;//rows start at 0
  for(var y=0;y<9;y++){
    var newRow = table.insertRow(rows);// add row every 9 elements
    for(var x=0;x<9;x++){
      var cell = newRow.insertCell(x);
      if(boardData[boardPosition(x,y)]==-1){
        cell.innerText="";// place empty cell when value is -1
      }
      else{
      cell.innerText=boardData[boardPosition(x,y)];//loop through and call function boardPosition
     }
    }
    rows+=1;// adds a row
  }
}
function populatePalette(p){
  var palette=p;
  for(var x=1;x<10;x++){
    var text=document.createElement("li");
    var node=document.createTextNode(x);
    text.appendChild(node);
    p.appendChild(text);
  }
  var text=document.createElement("li");
  var img=document.createElement('img');//for the image undo
  img.src="images/undo.png";
  text.appendChild(img);
  p.appendChild(text);
}
