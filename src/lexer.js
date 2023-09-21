
export const tokenType = Object.freeze({
	"h":1,
	"j":2,
	"k":3,
	"l":4,
	".":5,
	"o":6,
	"v":7,
	"i":8,
});

export const opertatorType = Object.freeze({
	"+":0,
	"&":1,
	"|":2,
	"=":3,
	"-":4
})
export class Token{
	constructor(tokenStr,lexer){
		this.tokenStr = tokenStr;
		this.tokenType = Token.getTokenType(tokenStr);
		this.pos = lexer.currPos;
	}
	static getTokenType(tokenStr){
		if(tokenType[tokenStr]!=null && tokenStr!="o")
			return tokenType[tokenStr];
		if(opertatorType[tokenStr]!=null)
			return tokenType["o"];
		return tokenType["i"];
	}
}

export class Lexer{
	constructor(){
		this.currPos = 0;
	}
	tokenize(program){
		this.tokenList = [];
		while(this.currPos<program.length){
			const c = program[this.currPos];
			if(!(c==" " || c==" " ||c=="\t" ||c=="\r" ||c=="\n"))
				this.tokenList.push(new Token(c,this));
			this.currPos++;
		}
		return this.tokenList;
	}
}
