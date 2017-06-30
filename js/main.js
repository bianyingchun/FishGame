window.onload=function(){
	var can1,can2,ctx1,ctx2,delTime,lastTime,cWidth,cHeight;
	var ane,fruit,mon,baby;
	var mx,my;
	var babyTail=[];
	var bacPic=new Image();
	var data;
	var wave;
	var halo;
	var dust;
	function init(){
		can1=document.getElementById('canvas1');
		can2=document.getElementById('canvas2');
		ctx1=can1.getContext('2d');
		ctx2=can2.getContext('2d');
		ctx1.font='20px Verdana';
		ctx1.textAlign='center';
		bacPic.src='img/background.jpg';		
		cWidth=can1.width;
		cHeight=can1.height;
		mx=cWidth*0.5;
		my=cHeight*0.5;
		can1.onmousemove=Mousemove;
		ane=new aneObj();
		ane.init();
		fruit=new fruitObj();
		fruit.init();
		mon=new monObj();
		mon.init();
		baby=new babyObj();
		baby.init();
		data=new dataObj();
		wave=new waveObj('255,255,255',50,2);
		wave.init();
		halo=new haloObj('203,91,0',100,5);
		dust=new dustObj();
		dust.init();
		lastTime=Date.now();
		gameloop();
	}	
	function gameloop(){	
		requestAnimationFrame(gameloop);	
		var now=Date.now();
		delTime=now-lastTime;
		if(delTime>40)delTime=40;
		lastTime=now;
		drawBackground();
		ane.draw();
		fruit.draw();
		fruitMonitor();
		ctx1.clearRect(0,0,cWidth,cHeight);
		mon.draw();
		MonFruitpz();
		baby.draw();
		MonBabypz();
		data.draw();
		wave.draw();
		halo.draw();
		dust.draw();	
	}
	function Mousemove(e){
		if(!data.gameOver){
			if(e.offsetX||e.layerX){
			mx=e.offsetX==undefined?e.layerX:e.offsetX;
			my=e.offsetY==undefined?e.layerY:e.offsetY;
			}	
		}
			
	}
	//背景
	function drawBackground(){
		ctx2.drawImage(bacPic,0,0,cWidth,cHeight)
	}

	// 海葵
	function aneObj(){
		this.rootx=[];
		this.headx=[];
		this.heady=[];
		this.amp=[];
		this.alpha=0;
	};

	aneObj.prototype.num=50;

	aneObj.prototype.init=function(){
		for(var i=0;i<this.num;i++){
			this.rootx[i]=i*16+Math.random()*20;
			this.headx[i]=this.rootx[i];
			this.heady[i]=cHeight-250+Math.random()*50;
			this.amp[i]=Math.random()*50+50;
		}
	}

	aneObj.prototype.draw=function(){
		this.alpha+=delTime*0.0008;
		var l=Math.sin(this.alpha);
		ctx2.save();
		ctx2.lineWidth=20;
		ctx2.lineCap='round';
		ctx2.strokeStyle='#B95A9F';
		ctx2.globalAlpha=0.6;
		for(var i=0;i<this.num;i++){
			ctx2.beginPath();
			ctx2.moveTo(this.rootx[i],cHeight);
			this.headx[i]=this.rootx[i]+l*this.amp[i];
			ctx2.quadraticCurveTo(this.rootx[i],cHeight-100,this.headx[i],this.heady[i]);
			ctx2.stroke();
		};
		ctx2.restore();
	}

	//果实
	function fruitObj(){
		this.alive=[];
		this.x=[];
		this.y=[];
		this.aneNum=[];
		this.l=[];
		this.spd=[];
		this.fruitType=[];
		this.orange=new Image();
		this.blue=new Image();
	}

	fruitObj.prototype.num=30;

	fruitObj.prototype.init=function(){
		for(var i=0;i<this.num;i++){
			this.alive[i]=false;
			this.x[i]=0;
			this.y[i]=0;
			this.l[i]=0;
			this.fruitType[i]="";
			this.spd[i]=Math.random()*0.01+0.005;
			this.born(i);
		}
		this.orange.src="img/fruit.png";
		this.blue.src='img/blue.png';
	}

	fruitObj.prototype.draw=function(){
		var pic;
		for(var i=0;i<this.num;i++){
			if(this.alive[i]){
			if(this.l[i]<=30){
				this.x[i]=ane.headx[this.aneNum[i]];
				this.y[i]=ane.heady[this.aneNum[i]];
				this.l[i]+=this.spd[i]*delTime;
			}else{
				this.y[i]-=this.spd[i]*7*delTime;
			}
			if(this.fruitType[i]=='blue'){
				pic=this.blue;
			}else{
				pic=this.orange;
			}
			ctx2.drawImage(pic,this.x[i]-this.l[i]*0.5,this.y[i]-this.l[i]*0.5,this.l[i]*0.5,this.l[i]*0.5);
			if(this.y[i]<10){
				this.alive[i]=false;
			}
			}
		}
	}

	fruitObj.prototype.born=function(i){
		this.aneNum[i]=Math.floor(Math.random()*ane.num);
		this.l[i]=0;
		this.alive[i]=true;
		if(Math.random()<0.2){
			this.fruitType[i]='blue';
		}else{
			this.fruitType[i]='orange';
		}
	}
	fruitObj.prototype.dead=function(i){
		this.alive[i]=false;
	}
	//果实生命检测
	function fruitMonitor(){
		var num=0;
		for(var i=0;i<fruit.num;i++){
			if(fruit.alive[i])num++;
		}
		if(num<15){
			sendFruit();
			return;
		}
	}

	function sendFruit(){
		for(var i=0;i<fruit.num;i++){
			if(!fruit.alive[i]){
				fruit.born(i);
			}
		}
	}
	//大鱼
	function monObj(){
		this.x;
		this.y;
		this.angle;
		this.bigEye=[];
		this.bigEyeTimer=0;
		this.bigEyeCount=0;
		this.bigEyeInterval=1000;
		this.bigBodyOrg=[];
		this.bigBodyBlue=[];
		this.bigBodyCount=0;
		this.bigTail=[];
		this.bigTailTimer=0;
		this.bigTailCount=0;
	}
	monObj.prototype.init=function(){
		this.x=cWidth*0.5;
		this.y=cHeight*0.5;
		this.angle=0;
		for(var i=0;i<8;i++){
			this.bigTail[i]=new Image();
			this.bigTail[i].src='img/bigTail'+i+'.png';
		}
		for(var i=0;i<2;i++){
			this.bigEye[i]=new Image();
			this.bigEye[i].src='img/bigEye'+i+'.png';
		}
		for(var i=0;i<8;i++){
			this.bigBodyOrg[i]=new Image();
			this.bigBodyOrg[i].src='img/bigSwim'+i+'.png';
			this.bigBodyBlue[i]=new Image();
			this.bigBodyBlue[i].src='img/bigSWimBlue'+i+'.png';
		}
		
	}
	monObj.prototype.draw=function(){
		
		this.x=lerpDistance(mx,this.x,0.9);
		this.y=lerpDistance(my,this.y,0.99);
		var delX=mx-this.x;
		var delY=my-this.y;
		var beta=Math.atan2(delY,delX)+Math.PI;
		this.angle=lerpAngle(beta,this.angle,0.9);

		this.bigTailTimer+=delTime;
		if(this.bigTailTimer>50){
			this.bigTailCount=(this.bigTailCount+1)%8;
			this.bigTailTimer%=50
		}
		this.bigEyeTimer+=delTime;
		if(this.bigEyeTimer>this.bigEyeInterval){
			this.bigEyeCount=(this.bigEyeCount+1)%2;
			this.bigEyeTimer%=this.bigEyeInterval;
			if(this.bigEyeCount==0){
				this.bigEyeInterval=Math.random()*1500+2000;
			}else{
				this.bigEyeInterval=200;
			}
		}

		ctx1.save();
		ctx1.translate(this.x,this.y);
		ctx1.rotate(this.angle);

		ctx1.drawImage(this.bigTail[this.bigTailCount],-this.bigTail[this.bigTailCount].width*0.5+30,-this.bigTail[this.bigTailCount].height*0.5);
		if(data.double==1){
			ctx1.drawImage(this.bigBodyOrg[this.bigBodyCount],-this.bigBodyOrg[this.bigBodyCount].width*0.5,-this.bigBodyOrg[this.bigBodyCount].height*0.5);
		}else{
			ctx1.drawImage(this.bigBodyBlue[this.bigBodyCount],-this.bigBodyBlue[this.bigBodyCount].width*0.5,-this.bigBodyBlue[this.bigBodyCount].height*0.5);
		}
		
		ctx1.drawImage(this.bigEye[this.bigEyeCount],-this.bigEye[this.bigEyeCount].width*0.5,-this.bigEye[this.bigEyeCount].height*0.5);
		ctx1.restore();
	}
	
	//碰撞检测
	function MonFruitpz(){
		if(!data.gameOver){
		for(var i=0;i<fruit.num;i++){
				if(fruit.alive[i]){
					var d=calLength2(fruit.x[i],fruit.y[i],mon.x,mon.y);
					if(d<900){
						fruit.dead(i);
						data.fruitNum++;
						mon.bigBodyCount++;
						if(mon.bigBodyCount>7)mon.bigBodyCount=7;

						if(fruit.fruitType[i]=='blue'){
							data.double=2;
						}
						wave.born(fruit.x[i],fruit.y[i]);
					}
				}
			}
		}
	}

	//小鱼
	function babyObj(){
		this.x;
		this.y;
		this.angle;
		this.babyTailTimer=0;
		this.babyTailCount=0;
		this.babyEyeTimer=0;
		this.babyEyeCount=0;
		this.babyEyeInterval=1000;
		this.babyBodyTimer=0;
		this.babyBodyCount=0;
		this.babyTail=[];
		this.babyEye=[];
		this.babyBody=[];
	}
	babyObj.prototype.init=function(){
		this.x=cWidth*0.5-50;
		this.y=cHeight*0.5+50;
		this.angle=0;
		for(var i=0;i<8;i++){
			this.babyTail[i]=new Image();
			this.babyTail[i].src='img/bigTail'+i+'.png';
		}
		for(var i=0;i<2;i++){
			this.babyEye[i]=new Image();
			this.babyEye[i].src='img/babyEye'+i+'.png';
		}
		for(var i=0;i<20;i++){
			this.babyBody[i]=new Image();
			this.babyBody[i].src='img/babyFade'+i+'.png';
		}
	}
	babyObj.prototype.draw=function(){
		this.x=lerpDistance(mon.x,this.x,0.98);
		this.y=lerpDistance(mon.y,this.y,0.98);
		var delX=mon.x-this.x;
		var delY=mon.y-this.y;
		var beta=Math.atan2(delY,delX)+Math.PI;
		this.angle=lerpAngle(beta,this.angle,0.6);

		this.babyTailTimer+=delTime;
		if(this.babyTailTimer>50){
			this.babyTailCount=(this.babyTailCount+1)%8;
			this.babyTailTimer%=50
		}
		this.babyEyeTimer+=delTime;
		if(this.babyEyeTimer>this.babyEyeInterval){
			this.babyEyeCount=(this.babyEyeCount+1)%2;
			this.babyEyeTimer%=this.babyEyeInterval;
			if(this.babyEyeCount==0){
				this.babyEyeInterval=Math.random()*1500+2000;
			}else{
				this.babyEyeInterval=200;
			}
		}
		this.babyBodyTimer+=delTime;
		if(this.babyBodyTimer>300){
			this.babyBodyCount=this.babyBodyCount+1;
			this.babyBodyTimer%=50
			if(this.babyBodyCount>19){
				this.babyBodyCount=19;
				//game over
				data.gameOver=true;
			}

		}
		ctx1.save();
		ctx1.translate(this.x,this.y);
		ctx1.rotate(this.angle)
		ctx1.drawImage(this.babyTail[this.babyTailCount],-this.babyTail[this.babyTailCount].width*0.5+20,-this.babyTail[this.babyTailCount].height*0.5);
		ctx1.drawImage(this.babyBody[this.babyBodyCount],-this.babyBody[this.babyBodyCount].width*0.5,-this.babyBody[this.babyBodyCount].height*0.5);
		ctx1.drawImage(this.babyEye[this.babyEyeCount],-this.babyEye[this.babyEyeCount].width*0.5+5,-this.babyEye[this.babyEyeCount].height*0.5);
		ctx1.restore();
	}
	//碰撞检测
	function MonBabypz(){
		if(data.fruitNum>0&&!data.gameOver){
			var d=calLength2(mon.x,mon.y,baby.x,baby.y);
		if(d<900){
			baby.babyBodyCount=0;
			mon.bigBodyCount=0;
			data.updateScore();
			halo.born(baby.x,baby.y)
			}
		}
	}
	//分值
	function dataObj(){
		this.fruitNum=0;
		this.double=1;
		this.score=0;
		this.gameOver=false;
		this.alpha=0;
	}
	dataObj.prototype.draw=function(){
		var w=can1.width;
		var h=can1.height;
		ctx1.save();
		ctx1.shadowBlur=10;
		ctx1.shadowColor='#fff';
		ctx1.fillStyle='#fff';
		ctx1.fillText('SCORE '+this.score,w*0.5,h-50);
		if(this.gameOver){
			this.alpha+=delTime*0.0005;
			if(this.alpha>1)this.alpha=1;
			ctx1.fillStyle='rgba(255,255,255,'+this.alpha+')';
			ctx1.fillText('GAME OVER',w*0.5,h*0.5);
		}
		ctx1.restore();
	}
	dataObj.prototype.updateScore=function(){
		this.score+=(this.fruitNum+this.double)*100;
		this.fruitNum=0;
		this.double=1;
	}
//大鱼吃果实特效
	function waveObj(color,maxr,linew){
		this.x=[];
		this.y=[];
		this.alive=[];
		this.r=[];
		this.color=color;
		this.maxr=maxr;
		this.linew=linew;
	}
	waveObj.prototype.num=10;
	waveObj.prototype.init=function(){
		for(var i=0;i<this.num;i++){
			this.alive[i]=false;
			this.r[i]=0;
		}
	}
	waveObj.prototype.draw=function(){
		ctx1.save();
		ctx1.lineWidth=this.linew;
		ctx1.shadowBlur=10
		ctx1.shadowColor='rgba('+this.color+',1)';
		for(var i=0;i<this.num;i++){
			if(this.alive[i]){
				this.r[i]+=delTime*0.04;
				if(this.r[i]>this.maxr){
					this.alive[i]=false;
					break;
				}
				var alpha=1-this.r[i]/this.maxr;
				ctx1.beginPath();				
				ctx1.arc(this.x[i],this.y[i],this.r[i],0,Math.PI*2,true);
				ctx1.closePath();
				ctx1.strokeStyle='rgba('+this.color+','+alpha+')';
				ctx1.stroke();
			}
		}
		ctx1.restore();
	}
	waveObj.prototype.born=function(x,y){
		for(var i=0;i<this.num;i++){
			if(!this.alive[i]){
				this.alive[i]=true;
				this.r[i]=10;
				this.x[i]=x;
				this.y[i]=y;
				return;
			}
		}
	}
//大鱼喂小鱼特效
	function haloObj(color,maxr,linew){
		waveObj.call(this,color,maxr,linew);
	}
	haloObj.prototype=new waveObj();;
//漂浮物
	function dustObj(){
		this.dustPic=[];
		this.x=[];
		this.y=[];
		this.amp=[];
		this.alpha=0;
		this.no=[];
	}
	dustObj.prototype.num=30;
	dustObj.prototype.init=function(){
		for(var i=0;i<7;i++){
			this.dustPic[i]=new Image();
			this.dustPic[i].src='img/dust'+i+'.png';
		}
		for(var i=0;i<this.num;i++){
			this.x[i]=Math.random()*cWidth;
			this.y[i]=Math.random()*cHeight;
			this.amp[i]=20+Math.random()*15;
			this.no[i]=Math.floor(Math.random()*7)
		}
	}
	dustObj.prototype.draw=function(){
		this.alpha+=delTime*0.0008;
		var l=Math.sin(this.alpha);
		for(var i=0;i<this.num;i++){
			ctx1.drawImage(this.dustPic[this.no[i]],this.x[i]+this.amp[i]*l,this.y[i]);
		}
	}
	init();	
}