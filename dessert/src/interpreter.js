import * as lexer from "./lexer.js"

export const env = {
	store : [0,0,0,0,0,0,0,0],
	ptr : 0,
	opr:null,
	oprL:null,
	oprR:null,
	isInVisualBlock : false,
	visualBlockStart:0,
	visualBlock:0,
	atVisualEnd:false,
	outlet :{
		print(s){
			console.log(s);
		},
		error(s){
			console.error(s);
		},
		debugInfo(){
			console.log(
				` ptr : ${env.ptr}  value ${env.store[env.ptr]}\n`+
				` opr: ${env.opr} oprL : ${env.oprL} oprR: ${env.oprR} \n`+
				` IsVB : ${env.isInVisualBlock} VB : ${env.visualBlock} \n`+
				` VBstart : ${env.visualBlockStart} atVBend : ${env.atVisualEnd}\n`
			);
		}
	},
	inlet:{
		input(input,debugMode){
			const elexer = new lexer.Lexer();
			const interpreter = new Interpreter(elexer.tokenize(input),debugMode)
			interpreter.run();
		}
	}
}
export class Interpreter {
	constructor(tokenList,deubgMode){
		this.tokenList = tokenList;
		this.currIdx = 0;
		this.deubgMode = deubgMode;
	}
	run(){
		this.executeNext()
	}
	getNextToken(){
		if(this.tokenList.length<=this.currIdx)
			return null;
		else return this.tokenList[this.currIdx++];
	}
	executeNext(){
		let token = this.getNextToken();
		if(token == null) return;
		if(this.deubgMode){
			env.outlet.print(`Got token ${token.tokenStr} at ${this.currIdx}`)
			env.outlet.debugInfo();
		}
		switch(token.tokenType){
			case lexer.tokenType["h"]:
				this.moveLeft();
				break;
			case lexer.tokenType["j"]:
				this.flipDown();
				break;
			case lexer.tokenType["k"]:
				this.flipUp();
				break;
			case lexer.tokenType["l"]:
				this.moveRight();
				break;
			case lexer.tokenType["."]:
				this.print();
				break;
			case lexer.tokenType["o"]:
				this.operatorPush(token);
				break;
			case lexer.tokenType["v"]:
				this.visualBlock();
				break;
			case lexer.tokenType["i"]:
				this.error(`Error Illegal token ${token.tokenStr} at position ${token.pos}`);
				break;
		}
		this.executeNext();
	}
	moveLeft(){
		if(env.ptr>0)
			env.ptr--;
		if(env.opr && !env.isInVisualBlock)
		{
			this.operate();
		}
	}
	moveRight(){
		if(env.ptr<env.store.length-1)
			env.ptr++;
		if(env.opr && !env.isInVisualBlock)
		{
			this.operate();
		}
	}
	flipUp(){
		if(env.opr!=null && !env.isInVisualBlock) this.error(`Cannot flipUp, operator ${env.opr} in play`);
		if(env.store[env.ptr]==0)
			env.store[env.ptr]=1;
	}
	flipDown(){
		if(env.opr!=null && !env.isInVisualBlock) this.error(`Cannot flipDown, operator ${env.opr} in play`);
		if(env.store[env.ptr]==1)
			env.store[env.ptr]=0;
	}
	print(){
		if(env.opr!=null) this.error(`Error : printing while operator in play`);
		console.log(env.atVisualEnd);
		if(env.atVisualEnd){
			env.outlet.print(env.visualBlock);
		}
		else{
			env.outlet.print(env.store[env.ptr]);
		}
	}
	operatorPush(token){
		if(env.opr!=null) this.error(`Error : an operator is already in play`);
		env.opr = token.tokenStr;
		if(env.atVisualEnd){
			env.oprL = env.visualBlock;
			env.visualBlock = 0;
			env.atVisualEnd = false;
		}else{
			env.oprL = env.store[env.ptr];
		}

	}
	operate(){
		if(env.opr==null) this.error(`Error : no operator found`);
		if(env.isInVisualBlock) this.error(`Error : In visual block cannot operate`);
		if(env.atVisualEnd){
			env.oprR = env.visualBlock;
			env.visualBlock = 0;
			env.atVisualEnd = false;
		}
		else{
			env.oprR = env.store[env.ptr];
		}
		switch(env.opr){
			case "+":
				this.add();
				break;
			case "-":
				this.sub();
				break;
			case "*":
				this.mul();
				break;
			case "/":
				this.div();
				break;
			case "=":
				this.equal();
				break;
			case "&":
				this.and();
				break;
			case "|":
				this.or();
				break;
		}
	}
	visualBlock(){
		if(!env.isInVisualBlock){
			env.visualBlock = 0;
			env.visualBlockStart = env.ptr;
			env.isInVisualBlock = true;
		}else{
			let start = env.visualBlockStart;
			let end = env.ptr;
			if(env.ptr < env.visualBlockStart){
				start = env.ptr;
				end = env.visualBlockStart;
			}
			while(start <= end){
				env.visualBlock = env.visualBlock*2+env.store[start++];
			}
			env.isInVisualBlock = false;
			env.visualBlockStart = 0;
			env.atVisualEnd = true;
			if(env.opr){
				this.operate();
			}
		}

	}
	add(){
		env.outlet.print(env.oprL+env.oprR);
		this.resetop();
	}
	sub(){
		env.outlet.print(env.oprL-env.oprR);
		this.resetop();
	}
	mul(){
		env.outlet.print(env.oprL*env.oprR);
		this.resetop();
	}
	div(){
		if(env.oprR ==0) {
			env.outlet.error("Cannot divide by 0");
			return;
		}
		env.outlet.print(env.oprL/env.oprR);
		this.resetop();
	}
	equal(){
		env.outlet.print(env.oprL==env.oprR);
		this.resetop();
	}
	and(){
		env.outlet.print(env.oprL&env.oprR);
		this.resetop();
	}
	or(){
		env.outlet.print(env.oprL|env.oprR);
		this.resetop();
	}
	resetop(){
		env.oprL = null;
		env.oprR = null;
		env.opr = null;
	}
	error(msg){
		env.outlet.error(msg);
	}
}
