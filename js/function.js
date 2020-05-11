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
var length=20;
var ruler=[];
var la=0;
var countdowner;
var auto;
var firstTime=true;
var started=false;
var movePass=false;
var prevS=window.scrollY;
var checkCont;
var doneFreeze=0;
var collectGo=false;
var increment=80;
var freezerec=0;
var fadePassed=false;
var timeout=false;
var timeCount=0;
var yourName=''
var adjustH=false;
var formerPos=[{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];
var theatre=[{name:'THE TEMPEST',color:'#26408d',key:'tempest',date:'april 2021',director:'STEVE SPIEL'},{name:"MIDSUMMER NIGHT'S DREAM",color:'#2d5530',key:'midsummer',date:'may 2021',director:'SAM BECK'},{name:'KING LEAR',color:'#D31F39',key:'lear',date:'march 2021',director:'WILL SHAKE'}];
function startUp(){
  window.scroll(0, 0);
  buildText();
  fadeAssign();
  freezeAssign();
  collectAssign();
  imgAssign();
  merchItem();
  started=true;
  timedStart(3000);
  autoScroll();
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
      .append('div')
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
  var vpHeight=window.innerHeight;
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
      length=length+increment;
      d3.select('#ruler').append('div').classed('type0',true);
    }else{
      // console.log(d3.select(c).text(),distance,vpHeight);
    }
  }//end of i loop
  length+=400;
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
            if(r.cnt*fraction<r.node.getBoundingClientRect().y||fadePassed==false){return true}else{return false};
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
        if(collectGo==true){return true}else{return 'derp'};
      }else{
        return true;
      };
    },
    type:3,
    dist:length,
    f:false,
  })
  length+=100;
  d3.select('#ruler').append('div').classed('type1',true);
}
function imgAssign(){
  ruler.push({
    cond:function(r,dir){
      if(dir==true){
        if(ruler[ruler.indexOf(r)-1].f==true){return true}else{return 'derp'};
      }else{
        return true;
      };
    },
    type:4,
    dist:length,
    f:false,
  })
}

function autoScroll(){
    auto=setInterval(function(){
      if(started==true&&timeout==false){
        window.scrollTo({
          top: window.scrollY+8,
          left: 0,
        });
      }
    },10)
}



function scrolling(event){
  if (started==true){
    eventControl(event);
  }
  if(firstTime==true){
    d3.select('#progbar')
    .classed('starting',false)
    .classed('gobar',true)
    .html('').append('span').classed('countdown',true)
    timedStart(3000)
    firstTime=false;
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
        case 4:
        imgUp(r,dir);
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
    fadePassed=true;
    movePass=true;
    including=(x)=>{return !x.contains('show')};
    d3.selectAll('.word').filter(function(d, i, nodes){return including(nodes[i].classList)}).classed('fshow',true);
    d3.select('#contain')
    adjustH=true;
  }else{
    fadePassed=false;
    d3.select('#contain')
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
  var firstCnt=ruler.filter(el=>el.type==2)[0]
  if (d==true &&firstCnt.f==false&&r.cnt==2){
    freeze(firstCnt,true,ruler[ruler.indexOf(firstCnt)-1].dist);
    firstCnt.f=true;
  }else{
  }
  if(doneFreeze>4){
    window.setTimeout(function(){collectGo=true},800);
  }else{
    collectGo=false;
  }
}//end of freeze
function collect(r,dir){
  if(la==0){
    r.dist=window.scrollY-100;
    ruler[ruler.indexOf(r)+1].dist=window.scrollY+200;
    d3.select('#ruler').style('height',window.scrollY+1200+'px')
    la++;
  }
  var goto='.static';
  var scale=window.getComputedStyle(document.querySelector('#head')).fontSize;
  var wordO=1;
  var letO=0;
  document.querySelectorAll('.special').forEach((item, i) => {
    if(dir==true){
      var tops=document.querySelector(goto+i).getBoundingClientRect().y;
      var lefts=document.querySelector(goto+i).getBoundingClientRect().x;
    }else{
      var tops=formerPos[i].y;
      var lefts=formerPos[i].x;
      wordO=0;
      letO=1;
      scale=window.getComputedStyle(document.querySelector('.secret')).fontSize;

    }
    formerPos[i].x=document.querySelector('.secr'+i).getBoundingClientRect().x;
    formerPos[i].y=document.querySelector('.secr'+i).getBoundingClientRect().y;
    d3.select('.secr'+i)
    .style('top',tops+'px')
    .style('left',lefts+'px')
    .style('font-size',scale);
  });
  if(dir==true){
    setTimeout(function(){
      var collecter=ruler.filter(el=>el.type==3)[0]
      if(collecter.f==true){
        d3.selectAll('.special')
        .style('opacity',letO)
        d3.select('#head')
        .style('color','rgba(255,255,255,'+wordO+')')
      }
    },700);
  }else{
    d3.selectAll('.special')
    .style('opacity',letO)
    d3.select('#head')
    .style('color','rgba(255,255,255,'+wordO+')')
  }

}//end of collect
function imgUp(r,dir){
  if(dir==true){
    var val='translateY(0vh)';
    var dock=true;
    var timer=900;
  }else{
    disperse(false);
    var val='translateY(100vh)';
    var dock=false;
    var timer=0;
  }
  d3.select('#frags').style('transform',val);
  setTimeout(function(){
    dockLoad(ruler[ruler.length-1].f)
  },timer);
}
function dockLoad(dock){
  // started=false;
  if(dock==true){
    var show='none';
    var color=1;
    clearInterval(auto);
  }else{
    var show='block';
    started=true;
    var color=0;
    autoScroll();
  }
  d3.selectAll('.cap').style('color','rgba(255,255,255,'+color+')')
  d3.selectAll('.menu-item').style('opacity',color)
  d3.selectAll('.gobar').style('opacity',inv(color))
  // d3.select('#ruler').style('display',show);
  // d3.select('#contain').style('display',show);
}
function disperse(val){
  if(val==true){
    document.querySelectorAll('.frag').forEach((item, i) => {
      var quadrant=0;
      if(window.innerWidth>window.innerHeight){
        var distance=window.innerHeight;
        var offset=0;
      }else{
        var distance=window.innerWidth;
        var offset=15;
      }
      switch(i){
        case 0:
        quadrant+=15;
        distance=distance/1.2;
        break;
        case 1:
        quadrant+=115-offset;
        distance=distance/4;
        break;
        case 2:
        quadrant+=0;
        break;
        case 3:
        quadrant+=315;
        distance=distance/2;
        break;
        case 4:
        quadrant+=180+offset;
        distance=distance/1.3;
        break;
      }
      var randA=Math.random()*45+quadrant;
      randA=randA*Math.PI/180;
      var x=Math.cos(randA)*distance;
      var y=Math.sin(randA)*distance;
      d3.select(item).style('transform',`translate(${x+'px,'+y+'px'})`)
    });
    document.querySelectorAll('#head span').forEach((item, i) => {
      if(window.innerWidth>window.innerHeight){
        var distance=window.innerHeight;
      }else{
        var distance=window.innerWidth;
      }
      var randA=Math.random()*360;
      randA=randA*Math.PI/180;
      var x=Math.cos(randA)*distance;
      var y=Math.sin(randA)*distance;
      d3.select(item).style('transform',`translate(${x+'px,'+y+'px'})`)
    });
  }else{

    document.querySelectorAll('.frag').forEach((item, i) => {
      d3.select(item).style('transform','translate(0,0)')
    });
    document.querySelectorAll('#head span').forEach((item, i) => {
      d3.select(item).style('transform','translate(0,0)')
    });
    d3.selectAll('.selected').classed('selected',false);
    d3.selectAll('.box').style('opacity',0);
  }
  changePlay(2);
}
function menuItem(cNode){
  if(cNode.classed('selected')){
    var newVal=false;
    var see=0;
    var pEvents='inherit';
  }else{
    var newVal=true;
    var see=1;
    var pEvents='none';
  }
  d3.selectAll('.frag').style('pointer-events',pEvents);
  d3.selectAll('.selected').classed('selected',false);
  d3.selectAll('.box').style('opacity',0).style('pointer-events','none');
  cNode.classed('selected',newVal);
  d3.select('#'+cNode.html()+'box').style('opacity',see).style('pointer-events','all');
  disperse(newVal);
}
function merchItem(){
  theatre.forEach((item, x) => {
    for(var i=4; i>0;i--){
      var check=true;
      if(x==2){
        check=false;
      }
      d3.select('#merchbox')
      .append('div')
      .classed('merch'+x,true)
      .classed('merchslide',true)
      .classed('disappear',check)
      .datum([x,i])
      .append('img')
      .style('transform',`rotate(${-30+Math.random()*60}deg)`)
      .attr('src','assets/web'+item.key+i+'.jpg')
      .on('click',function(event){
        var slide=d3.select(d3.event.currentTarget.parentNode);
        var stor=slide.datum()
        slide.classed('disappear',true);
        if(stor[1]==4){
          var num=stor[0]+1;
          if(num>2){
            num=0;
          }
          changePlay(num);
        }
      })
    }
  });
}
function changePlay(index){
  relPlay=theatre[index];
  d3.selectAll('.merchslide').classed('disappear',true);
  d3.selectAll('.merch'+index).classed('disappear',false);
  d3.select('#lefcap').html(`${relPlay.date}:<br>${relPlay.name}`)
  d3.select('#rigcap').html(`director:<br>${relPlay.director}`)
  d3.select('body').style('background-color',relPlay.color);
  if(index!==2){
    d3.selectAll('.frag').style('opacity',0);
  }else{
    d3.selectAll('.frag').style('opacity',1);
  }
}
function inv(val){
  if(val==0){
    return 1;
  }else{
    return 0;
  }
}
function timedStart(mil){
  timeout=true;
  timeCount=mil
  clearInterval(countdowner)

  d3.select('.countdown').html(' '+timeCount/1000);

  timeCount=timeCount-1000;
  countdowner=window.setInterval(function(){
      d3.select('.countdown').html(' '+timeCount/1000)
      timeCount=timeCount-1000;
    if(timeCount<0){
      clearInterval(countdowner)
      if(firstTime==true){
        firstTime=false;
      }
      d3.select('#progbar')
      .classed('starting',false)
      .classed('gobar',true)
      .html('').append('span').classed('countdown',true)
      d3.select('.countdown').html(' >');
      // .style('opacity',0);
      timeout=false;
    };
  },1000);
  // setTimeout(function(){
  //   timeout=false;
  // },mil);
}
//∧∨

d3.selectAll('.menu-item').on('click',function(event){
  menuItem(d3.select(d3.event.currentTarget));
});

d3.selectAll('.tickdate').on('click',function(event){
  d3.selectAll('.tickdate').classed('pickdate',false)
  var item=d3.event.currentTarget
  d3.select(item).classed('pickdate',true)
})


document.querySelector('#ticketsbox input').addEventListener('input',function(event){
  yourName=event.currentTarget.value;
})

d3.select('.confirm').on('click',function(event){
  if(yourName!==''&&document.querySelectorAll('.pickdate').length>0){
    d3.select('.confirm').style('opacity',0)
    updateTicket();
  }
})

function updateTicket(){
    var impick=Math.round(1+Math.random()*4)
    var participant=Math.round(1+Math.random()*29)
    d3.select('#tixnum').html(participant)
    d3.select('.tiximage').selectAll('img').attr('src','assets/frag'+impick+'.png').attr('class','im'+impick)
    d3.select('#tixdate').html(d3.select('.pickdate').html());
    d3.select('#tixname').html(yourName);
    d3.select('#ticketsbox').select('a').style('opacity',1)
    downloadTicket();
}

var mobmatch=window.matchMedia('(hover:none)').matches;
if(mobmatch){
  theatre[1].name='MIDSUMMER';
}

function downloadTicket(){
  document.querySelectorAll('canvas').forEach((item, i) => {
    item.parentNode.removeChild(item);
  });
  // d3.select('#offscreen').selectAll('canvas').remove();
  var canv;
  html2canvas(document.querySelector('#print'),{scrollX: 0,scrollY:-window.scrollY}).then(function(canvas){
      // document.querySelector('#offscreen').appendChild(canvas);
      // canv=document.querySelector('canvas')
      var imdata= canvas.toDataURL("image/png");
      var newData = imdata.replace(/^data:image\/png/, "data:application/octet-stream");
      d3.select('#download').attr("download", "testimg.png").attr("href",newData);
  });

}
// window.addEventListener('load',downloadTicket)

startUp();
window.addEventListener("scroll",function(event){scrolling(event)});
window.addEventListener("wheel",function(event){
  timedStart(3000);
});
window.addEventListener("touchstart",function(event){
  timedStart(3000);
});
window.addEventListener("touchmove",function(event){
  timedStart(3000);
});
window.addEventListener("resize",function(event){disperse(false); scrolling(event);});
