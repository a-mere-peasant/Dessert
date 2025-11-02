import * as interpreter from "./src/interpreter.js"
const env_store = document.getElementById("env-store");
const env_isVB = document.getElementById("env-isVB");
const env_VB = document.getElementById("env-VB");
const env_opr = document.getElementById("env-opr");
const env_oprR = document.getElementById("env-oprR");
const env_oprL = document.getElementById("env-oprL");
const console = document.getElementById("console");
const prg_input = document.getElementById("program-input");
interpreter.env.outlet.print = function(s){
	insert_into_console(s,{is_error:false,isInput:false});
}

interpreter.env.outlet.error = function(s){
	insert_into_console(s,{is_error:true,isInput:false});
}

prg_input.addEventListener("keydown",function(e){
	if(e.code == "Enter"){
		input_prg(prg_input.value);
	}
}
);

function input_prg(val){
	insert_into_console(val,{is_error:false,isInput:true});
	var isDebugMode = document.getElementById("debug-mode").checked;
	interpreter.env.inlet.input(val,isDebugMode);
	update_env();
	prg_input.value="";
	console.scrollTop = console.scrollHeight;

}

function insert_into_console(s,{is_error=false,isInput=false}){
	if(is_error){
	console.innerHTML+= `\n<p class="error">${s}</p>`;
	}else if(isInput){
	console.innerHTML+= `\n<p>\$ ${s}</p>`;
	}else{
	console.innerHTML+= `\n<p>${s}</p>`;
	}
}

function update_env(){
	env_store.innerHTML = "";
	env_store.innerText = make_env_store();
	env_isVB.innerText = `inVB \n ${interpreter.env.isInVisualBlock}`;		
	env_VB.innerText = `VB \n ${interpreter.env.visualBlock}`;		
	env_opr.innerText = `inVB \n ${interpreter.env.opr}`;		
	env_oprL.innerText = `oprL \n ${interpreter.env.oprL}`;		
	env_oprR.innerText = `oprR \n ${interpreter.env.oprR}`;		
}

function make_env_store(){
	let store_str = "[ ";
	interpreter.env.store.forEach((b)=>store_str += b+" ");
	store_str+="]\n";
	const ptrpos = 2+2*interpreter.env.ptr;
	let start,end =0;
	if(interpreter.env.isInVisualBlock){
		end = 2+2*interpreter.env.visualBlockStart;
		start = 2+2*interpreter.env.ptr;
		if(interpreter.env.ptr>interpreter.env.visualBlockStart){
			start = 2+interpreter.env.visualBlockStart;
			end = 2+2*interpreter.env.ptr;
		}
	}
	for(let i=0;i<19;i++){
		if(i==ptrpos){
			store_str+="^ ";
		}else if(interpreter.env.isInVisualBlock && i>=start && i<=end){
			store_str+="_ ";
			i++;
		}else{
			store_str+=" ";
		}
	}
	return store_str;
}

