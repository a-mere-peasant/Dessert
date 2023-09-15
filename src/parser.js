
const tokenType = Object.freeze({
	"h":1,
	"j":2,
	"k":3,
	"l":4,
	".":5,
	"o":6
});

const opertatorType = Object.freeze({
	"+":0,
	"&":1,
	"|":2,
	"=":3,
	"-":4
})
class Token{
	constructor(tokenStr){
		this.tokenStr = tokenStr;
		this.tokenType = Token.getTokenType(tokenStr);
		this.pos = lexer.currPos;
		if(this.tokenType == null){
			console.error(`Invalid token ${tokenStr} received`);
		}
	}
	static getTokenType(tokenStr){
		if(tokenType[tokenStr]!=null)
			return tokenType[tokenStr];
		switch(tokenStr){
			case "+":
			case "-":
			case "&":
			case "|":
			case "*":
			case "=":
				return tokenType['o'];
			default:
				return null;
		}
	}
}

class Lexer{
	constructor(){
		this.currPos = 0;
	}
	tokenize(program){
		this.tokenList = [];
		let i=0;
		while(i<program.length){
			let c = program[i];
			if(!(c==" " || c==" " ||c=="\t" ||c=="\r" ||c=="\n"))
				this.tokenList.push(new Token(c));
			i++;
		}
		return this.tokenList;
	}
}
let lexer = new Lexer()
let tokenList = lexer.tokenize("hjlkjlkjhljljklj.=.=.=.");
console.log([...tokenList])
