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
var secstring=['t','h','e','s','e','c','r','e','t'];
var secret=false;
var secCount=0;
var contain=d3.select('#contain');
var length=window.innerHeight;
var ruler=[];
var started=false;
var movePass=false;
var prevS=window.scrollY;
var checkCont;
var doneFreeze=0;
var increment=200;
var freezerec=0;
var adjustH=false;
function startUp(){
  window.scroll(0, 0);
  buildText();
  fadeAssign();
  freezeAssign();
  collectAssign();
  started=true;
  console.log(ruler);
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
          .classed('let'+z,true)
          .classed('let',true);
          if(secret==true){
            d3.select('.seg'+x+' .wor'+y+' .let'+z)
            .classed('secret',true)
            .classed('sec'+secCount,true);
            secret=false;
            secCount++;
          }
        }//end of else
      }//end of z for
    }//end of y for
  }//end of x for
  secstring.forEach((item, i) => {
    d3.select('body')
      .append('span')
      .attr('class','special secr'+i)
      .html(item);
    d3.select('#head')
    .append('span')
    .html(item)
    .classed('static'+i,true);
  });
  d3.select('.static2').append('text').html(' ');
}
function fadeAssign(){
  var vpHeight=window.innerWidth;
  var words=document.querySelectorAll('.word');
  var wordsA=[]
  for(var y=0; y<words.length;y++){
    wordsA.push(words[y]);
  }
  wordsA.sort(function(a, b){return 0.5 - Math.random()});
  for(var i=0; i<wordsA.length;i++){
    //gets the words that are in the viewport
    var c=wordsA[i]
    var distance=c.getBoundingClientRect().y;
    if(distance<vpHeight){
      c.classList.add("iv");
      ruler.push({type:0,node:c,dist:length,cond:function(){return true},f:false});
      d3.select('#ruler').append('div').classed('type0',true);
      length=length+increment;
    }
  }//end of i loop
  checkCont=(x)=>{var check=(document.querySelector('#contain').getBoundingClientRect().y<51); return check;}
  ruler.push({type:1,node:0,dist:length,cond:function(){return true},f:false});
  d3.select('#ruler').append('div').classed('type0',true);
}
function freezeAssign(){
  var lines=document.querySelectorAll('.segment')
  var fraction=0.13*window.innerHeight;
  for(var y=0; y<lines.length;y++){
    ruler.push({
      cnt:y+1,
      cond:function(r,dir){
        if(dir==true){
          if(r.cnt*fraction>r.node.getBoundingClientRect().y){return true}else{return false};
        }else{
            if(r.cnt*fraction<r.node.getBoundingClientRect().y){return true}else{return false};
        };
      },
      type:2,
      dist:length,
      f:false,
      node:lines[y]
    })
  }
  freezerec=length;
  length+=document.querySelector('#contain').getBoundingClientRect.height;
  d3.select('#ruler').append('div').classed('type1',true);
}
function collectAssign(){
  ruler.push({
    cond:function(r,dir){
      if(dir==true){
        if(doneFreeze>4){return true}else{return 'derp'};
      }else{
        console.log('whyyyyyyy');
        return true;
      };
    },
    type:3,
    dist:length,
    f:false,
  })
}

function scrolling(event){
  if (started==true){
    eventControl(event);
  }
}

function eventControl(event){
  var scrollV=window.scrollY;
  var dir;
  var completed;
  var passed;
  var container=d3.select('#contain');

  if(adjustH==true){
    var prevH=container.node().getBoundingClientRect().y;
    var adjustment=prevH+(prevS-scrollV)*0.3;
    container.style('top',adjustment+'px');
  }
  if(scrollV>prevS){
    dir=true;
    completed=(f)=>{if(f==true){return true}else{return false}};
    passed=(v)=>{if(v>scrollV){return true}else{return false}};
  }else{
    dir=false;
    completed=(f)=>{if(f==true){return false}else{return true}};
    passed=(v)=>{if(v>scrollV){return false}else{return true}};
  }
  prevS=scrollV;
  for(var i=0;i<ruler.length;i++){
    var r=ruler[i];
    //loops through each event listed
    if(completed(r.f)){
      //if it's done, ignore it
    }else if(passed(r.dist)){
      //if it's not time to do it yet, ignore it
    }else if(r.cond(r,dir)!==true){
      //additional condition relating to elements on the page
    }else{
      switch(r.type){
        case 0:
        fadeIn(r,dir);
        break;
        case 1:
        fadeFinal(r,dir);
        break;
        case 2:
        freeze(r,dir,scrollV);
        break;
        case 3:
        collect(r,dir);
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
  freezerec=window.scrollY-500;
  var type2=ruler.filter(el=>el.type==2)
  if(d==true){
    movePass=true;
    including=(x)=>{return !x.contains('show')};
    d3.selectAll('.word').filter(function(d, i, nodes){return including(nodes[i].classList)}).classed('fshow',true);
    d3.select('#contain')
    adjustH=true;
        // .style('top',50+'px');
        // .style('position','absolute')
  }else{
    d3.select('#contain')
    .style('position','fixed')
    .style('top','50px')
    adjustH=false;
    d3.selectAll('.fshow').classed('fshow',false)
  }

  type2[0].cond=function(r,dir){
    if(dir==true){
      if(movePass==true){
        movePass=false;
        return true;
      }else{
        return false;
      }
    }else{
      return true;
    }
  };

}
function freeze(r,d,s){
  var cseg=document.querySelectorAll('.seg'+(r.cnt-1)+' .let');
  var col='rgba(255,255,255,0)';
  var see='rgba(255,255,255,1)';
  if(d==true){
    r.dist=s+50;
    doneFreeze++;
  }else{
    r.dist=freezerec;
    col='inherit';
    see='rgba(255,255,255,0)';
    var x='0';
    var y='0';
    doneFreeze--;
  }
  for(var f=0;f<cseg.length;f++){
    var letter=d3.select(cseg[f]);
    var bound=cseg[f].getBoundingClientRect();
    if(d==true){
      x=bound.x-window.innerWidth/2;
      y=bound.y-window.innerHeight/2;
      var ang=y/x*90;
      x=Math.cos(ang)*100;
      y=Math.sin(ang)*100;
    }
    if(letter.classed('secret')==true){
      var currentSec=letter.attr('class');
      currentSec=currentSec[currentSec.length-1];
      d3.select('.secr'+currentSec)
        .style('top',bound.y+'px')
        .style('left',bound.x+'px')
        .style('color',see)
      letter
        .style('color',col);
    }else{
      letter
      .style('color',col)
      .style('left',x+'px')
      .style('bottom',y+'px')
    }
  }//end of for loop
  // if(doneFreeze)-note for fixing this, make it so this checks the counter and does a true-false
}//end of freeze
function collect(r,dir){
  r.dist=window.scrollY;
  var goto='.static';
  var scale=window.getComputedStyle(document.querySelector('#head')).fontSize;
  if(dir==true){
  }else{
    console.log('fired');
    goto='.sec';
    scale=window.getComputedStyle(document.querySelector('.secret')).fontSize;
  }
  document.querySelectorAll('.special').forEach((item, i) => {
    var tops=document.querySelector(goto+i).getBoundingClientRect().y;
    var lefts=document.querySelector(goto+i).getBoundingClientRect().x;
    d3.select('.secr'+i)
    .style('top',tops+'px')
    .style('left',lefts+'px')
    .style('font-size',scale);
  });
}//end of collect
//test commit



startUp();
window.addEventListener("scroll",function(event){scrolling(event)});
window.addEventListener("resize",function(event){scrolling(event)});
