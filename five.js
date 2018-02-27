;(function(undefined){
    "use strict";
    
    var canvas = document.getElementById('chess');
    var ctx = canvas.getContext('2d');
    var role = 1;//黑1白2
    var chessboard = [];
    var gameover = false;

    //记录落子情况
    function initArray(){
        for(var i=0;i<15;i++){
            chessboard[i] = [];
            for(var j=0;j<15;j++){
                chessboard[i][j] = 0;
            }
        }
    }
    initArray();

    //画棋盘
    function drawLine(){
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        for(var i=0;i<15;i++){
            ctx.moveTo(26,26+i*32);
            ctx.lineTo(474,26+i*32);
            ctx.stroke();
            ctx.moveTo(26+i*32,26);
            ctx.lineTo(26+i*32,474);
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();
    }



    //初始化棋盘
    function Chess(){};
    Chess.prototype.init = function(){
        var self = this;

        drawLine();

        //下棋判断逻辑
        canvas.onclick = function(e){
            var i = Math.floor(e.offsetX/32);
            var j = Math.floor(e.offsetY/32);

            //画棋子，占位置
            if(gameover===false){
                self.play(i,j);
            }
        }
    };


    //下子
    Chess.prototype.play = function(i,j){
        //棋格为空才能下棋
        if(chessboard[i][j]===0){
            var chesspiece = new Chesspiece(i,j,role);
            chesspiece.draw();

            if(role===1){
                chessboard[i][j]=1;//黑棋占领
            }else{
                chessboard[i][j]=2;//白棋占领
            }

            //判断胜负
            this.judgeWin(i,j,role);

            //换人
            role = role===1?2:1;
        }
    }

    //判断胜负
    Chess.prototype.judgeWin = function(x,y,role){
        var row=0,
            column=0,
            diagonal1=0,
            diagonal2=0;
        
        //横向判断
        for(var i=x;i<15;i++){
            if(chessboard[i][y]===role){
                row++;
            }else{
                break;
            }
        }
        for(var i=x-1;i>=0;i--){
            if(chessboard[i][y]===role){
                row++;
            }else{
                break;
            }
        }

        //纵向判断
        for(var i=y;i<15;i++){
            if(chessboard[x][i]===role){
                column++;
            }else{
                break;
            }
        }
        for(var i=y-1;i>=0;i--){
            if(chessboard[x][i]===role){
                column++;
            }else{
                break;
            }
        }

        //左上右下判断
        for(var i=x,j=y; i>=0&&j>=0; i--,j--){
            if(chessboard[i][j]===role){
                diagonal1++;
            }else{
                break;
            }
        }
        for(var i=x+1,j=y+1; i<15&&j<15; i++,j++){
            if(chessboard[i][j]===role){
                diagonal1++;
            }else{
                break;
            }
        }

        //左下右上判断
        for(var i=x,j=y; i>=0&&j<15; i--,j++){
            if(chessboard[i][j]===role){
                diagonal2++;
            }else{
                break;
            }
        }
        for(var i=x+1,j=y-1; i<15&&j>=0; i++,j--){
            if(chessboard[i][j]===role){
                diagonal2++;
            }else{
                break;
            }
        }


        var player = role===1?'执黑者':'执白者';

        if(row>=5 || column>=5 || diagonal1>=5 || diagonal2>=5){
            gameover = true;
            setTimeout(function(){
                alert(player+'赢了！');
            },200);
        }

    };



    //棋子相关
    function Chesspiece(i,j,role){
        this.i = i;
        this.j = j;
        this.role = role;
    }
    //画棋子
    Chesspiece.prototype.draw = function(){
        ctx.beginPath();
        ctx.arc(26+this.i*32,26+this.j*32,15,0,2*Math.PI);
        ctx.closePath();
        var gradient = ctx.createRadialGradient(26+this.i*32+2,
                                                26+this.j*32-2,
                                                15,
                                                26+this.i*32+2,
                                                26+this.j*32-2,
                                                0);
        if(this.role===1){
            gradient.addColorStop(0,"#0a0a0a");
            gradient.addColorStop(1,"#636766");
        }else{
            gradient.addColorStop(0,"#d1d1d1");
            gradient.addColorStop(1,"#f9f9f9");
        }
        ctx.fillStyle = gradient;
        ctx.fill();
    }


    //重新开始
    var restart = document.getElementById('restart');
    restart.onclick = function(){
        gameover = false;
        initArray();

        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawLine();
    }

    //暴露给全局对象
    var _global;
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Chess;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return Chess;});
    } else {
        !('Chess' in _global) && (_global.Chess = Chess);
    }
}());