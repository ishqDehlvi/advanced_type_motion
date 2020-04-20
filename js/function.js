$(window).on('beforeunload', function() {
    $(window).scrollTop(0);
});

var excerpt=[
  ['Rumble',' @thy',' bellyful!',' Spit,',' fire!',' spout,',' rain!'],
  ['Nor ','rain, ','wind, ','t@hunder, ','fire, ','ar@e ','my ','daughters:'],
  ['I ','tax ','not ','you, ','you ','element@s, ','with ','unkindness;'],
  ['I ','nev@er ','gave ','you ','kingdom, ','@call’d ','you ','child@ren,'],
  ['You ','owe ','m@e ','no ','subscription: ','then ','le@t ','fall'],
]
var secret=false;
var contain=d3.select('#contain');
var length=window.innerHeight;
var ruler=[];
var started=false;
var prevS=window.scrollY;
var checkCont;

function startUp(){
  window.scroll(0, 0);
  buildText();
  fadeAssign();
  started=true;
}
function buildText(){
  for(var x=0;x<excerpt.length;x++){
    //for every line
    contain
    .append('span')
    .classed('segment',true)
    .classed('seg'+x,true);

    var line=excerpt[x];
    for(var y=0; y<line.length; y++){
      //for every word
      contain.select('.seg'+x)
      .append('span')
      .classed('wor'+y,true)
      .classed('word',true);
      word=line[y];
      for(var z=0; z<word.length; z++){
        //for every letter
        var letter=word[z];
        if(letter=='@'){
          letter='';
          secret=true;
        }else{
          contain
          .select('.seg'+x+' .wor'+y)
          .append('span')
          .text(letter)
          .classed('let'+z,true);
          if(secret==true){
            d3.select('.seg'+x+' .wor'+y+' .let'+z)
            .classed('secret',true);
            secret=false;
          }
        }//end of else
      }//end of z for
    }//end of y for
  }//end of x for

}
function fadeAssign(){
  var vpHeight=window.innerWidth;
  var words=document.querySelectorAll('.word');
  var wordsA=[]
  for(var y=0; y<words.length;y++){
    wordsA.push(words[y]);
  }
  wordsA.sort(function(a, b){return 0.5 - Math.random()});
  console.log(wordsA);
  for(var i=0; i<wordsA.length;i++){
    //gets the words that are in the viewport
    var c=wordsA[i]
    var distance=c.getBoundingClientRect().y;
    if(distance<vpHeight){
      c.classList.add("iv");
      ruler.push({type:0,node:c,dist:length,cond:true,f:false});
      d3.select('#ruler').append('div').classed('type0',true);
      length=length+200;
    }
  }//end of i loop
  checkCont=(x)=>{var check=(document.querySelector('#contain').getBoundingClientRect().y<51); return check;}
  ruler.push({type:1,node:0,dist:length,cond:checkCont(),f:false});
  d3.select('#ruler').append('div').classed('type0',true);
}


function scrolling(event){
  if (started==true){
    eventControl(event);
  }
}

function eventControl(event){
  var scroll=window.scrollY;
  var dir;
  var completed;
  var passed;
  if(scroll>prevS){
    dir=true;
    completed=(f)=>{if(f==true){return true}else{return false}};
    passed=(v)=>{if(r.dist>scroll){return true}else{return false}};
  }else{
    dir=false;
    completed=(f)=>{if(f==true){return false}else{return true}};
    passed=(v)=>{if(r.dist>scroll){return false}else{return true}};
  }
  prevS=scroll;
  for(var i=0;i<ruler.length;i++){
    var r=ruler[i];
    //loops through each event listed
    if(completed(r.f)){
      //if it's done, ignore it
    }else if(passed()){
      //if it's not time to do it yet, ignore it
    }else if(r.cond!==true){
      console.log(r.cond);
    }else{
      switch(r.type){
        case 0:
        fadeIn(r,dir);
        break;
        case 1:
        fadeFinal(r,dir);
        break;
      }//end of switch
      if(r.f==true){
        r.f=false;
      }else{
        r.f=true;
      }

    }//end of else
  }
}


function fadeIn(r,d){
  if(d==true){
    r.node.classList.add('show');
  }else{
    r.node.classList.remove('show');
  }
}

function fadeFinal(r,d){
  if(d==true){
    including=(x)=>{return !x.contains('show')};
    d3.selectAll('.word').filter(function(d, i, nodes){return including(nodes[i].classList)}).classed('fshow',true);
    d3.select('#contain')
    .style('position','absolute')
    .style('top',window.scrollY+50+'px')
  }else{
    d3.select('#contain')
    .style('position','fixed')
    .style('top','50px')
    d3.selectAll('.fshow').classed('fshow',false)
  }
}


startUp();
window.addEventListener("scroll",function(event){scrolling(event)});
window.addEventListener("resize",function(event){scrolling(event)});
