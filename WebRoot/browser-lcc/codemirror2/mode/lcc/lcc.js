CodeMirror.defineMode("lcc", function() {
	return {
		token : function(stream, state) {
			var ch = stream.next();
			if ( ch == "a") {
				if(stream.peek() == "("){
					return "lcc-keyword";
				}
				else{
					return "lcc-constant";
				}
			}
			else if(ch == "=" && stream.eat(">") || ch == "<" && stream.eat("=")){
				return "lcc-keyword";
			}
			else if(ch == "-" && stream.eat(">") || ch == "<" && stream.eat("-")){
				return "lcc-keyword";
			}
			else if(ch == "\&" && stream.eat("\&")){
				return "lcc-keyword";
			}
			else if(ch == "\|" && stream.eat("\|")){
				return "lcc-keyword";
			}
			else if(/[a-z0-9]/.test(ch)){
				if(ch == "t" && stream.match("hen") && stream.eol()){
					return "lcc-keyword";
				}
				else if(ch == "o" && stream.eat("r") && stream.eol()){
					return "lcc-keyword";
				}
				else{
					stream.eatWhile(/[a-zA-Z0-9_]/);
					return "lcc-constant";
				}
			}
			else if(/[A-Z_]/.test(ch)){
				stream.eatWhile(/[a-zA-Z0-9_]/);
				return "lcc-variable";
			}
			else{
				return null;
			}
		}
	}
});

CodeMirror.defineMIME("text/lcc", "lcc");
