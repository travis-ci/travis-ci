var Handlebars = {};
// lib/handlebars/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(params, unescaped) {
    this.type = "mustache";
    this.id = params[0];
    this.params = params.slice(1);
    this.escaped = !unescaped;
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";
    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + "doesn't match" + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.InverseNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "inverse";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join("/");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { continue; }
      else { dig.push(part); }
    }

    this.parts = dig;
    this.depth = depth;
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/jison_ext.js
Handlebars.Lexer = function() {};

Handlebars.Lexer.prototype = {
  setInput: function(input) {
    this.input = input;
    this.matched = this.match = '';
    this.yylineno = 0;
  },

  setupLex: function() {
    this.yyleng = 0;
    this.yytext = '';
    this.match = '';
    this.readchars = 0;
  },

  getchar: function(n) {
    n = n || 1;
    var chars = "", chr = "";

    for(var i=0; i<n; i++) {
      chr = this.input[0];
      chars += chr;
      this.yytext += chr;
      this.yyleng++;

      this.matched += chr;
      this.match += chr;

      if(chr === "\n") { this.yylineno++; }

      this.input = this.input.slice(1);
    }
    return chr;
  },

  readchar: function(n, ignore) {
    n = n || 1;
    var chr;

    for(var i=0; i<n; i++) {
      chr = this.input[i];
      if(chr === "\n") { this.yylineno++; }

      this.matched += chr;
      this.match += chr;
      if(ignore) { this.readchars++; }
    }

    this.input = this.input.slice(n);
  },

  ignorechar: function(n) {
    this.readchar(n, true);
  },

  peek: function(n) {
    return this.input.slice(0, n || 1);
  },

  pastInput:function () {
    var past = this.matched.substr(0, this.matched.length - this.match.length);
    return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
  },

  upcomingInput:function () {
    var next = this.match;
    if (next.length < 20) {
      next += this.input.substr(0, 20-next.length);
    }
    return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
  },

  showPosition:function () {
    var pre = this.pastInput();
    var c = new Array(pre.length + 1 + this.readchars).join("-");
    return pre + this.upcomingInput() + "\n" + c+"^";
  }
};

Handlebars.Visitor = function() {};

Handlebars.Visitor.prototype = {
  accept: function(object) {
    return this[object.type](object);
  }
};;
// lib/handlebars/handlebars_lexer.js
Handlebars.HandlebarsLexer = function() {
  this.state = "CONTENT";
};
Handlebars.HandlebarsLexer.prototype = new Handlebars.Lexer();

// The HandlebarsLexer uses a Lexer interface that is compatible
// with Jison.
//
// setupLex      reset internal state for a new token
// peek(n)       lookahead n characters and return (default 1)
// getchar(n)    remove n characters from the input and add
//               them to the matched text (default 1)
// readchar(n)   remove n characters from the input, but do not
//               add them to the matched text (default 1)
// ignorechar(n) remove n characters from the input, and act
//               as though they were already matched in a
//               previous lex. this will ensure that the
//               pointer in the case of parse errors is in
//               the right place.
Handlebars.HandlebarsLexer.prototype.lex = function() {
  if(this.input === "") { return; }

  this.setupLex();

  var lookahead = this.peek(2);
  var result = '';
  var peek;

  if(lookahead === "") { return; }

  if(this.state == "MUSTACHE") {
    if(this.peek() === "/") {
      this.getchar();
      return "SEP";
    }

    // chomp optional whitespace
    while(this.peek() === " ") { this.ignorechar(); }

    lookahead = this.peek(2);

    // in a mustache, but less than 2 characters left => error
    if(lookahead.length != 2) { return; }

    // if the next characters are '}}', the mustache is done
    if(lookahead === "}}") {
      this.state = "CONTENT";
      this.getchar(2);

      // handle the case of {{{ foo }}} by always chomping
      // a final }. TODO: Track escape state and handle the
      // error condition here
      if(this.peek() == "}") { this.getchar(); }
      return "CLOSE";

    // if the next character is a quote => enter a String
    } else if(this.peek() === '"') {
      this.readchar();

      // scan the String until another quote is reached, skipping over escaped quotes
      while(this.peek() !== '"') { if(this.peek(2) === '\\"') { this.readchar(); } this.getchar(); }
      this.readchar();
      return "STRING";

    // All other cases are IDs or errors
    } else {
      // grab alphanumeric characters
      while(this.peek().match(/[_0-9A-Za-z\.]/)) { this.getchar(); }

      peek = this.peek();
      if(peek !== "}" && peek !== " " && peek !== "/") {
        return;
      }

      // if any characters were grabbed => ID
      if(this.yytext.length) { return "ID"; }

      // Otherwise => Error
      else { return; }
    }

  // Next chars are {{ => Open mustache
  } else if(lookahead == "{{") {
    this.state = "MUSTACHE";
    this.getchar(2);

    peek = this.peek();

    if(peek === ">") {
      this.getchar();
      return "OPEN_PARTIAL";
    } else if(peek === "#") {
      this.getchar();
      return "OPEN_BLOCK";
    } else if(peek === "/") {
      this.getchar();
      return "OPEN_ENDBLOCK";
    } else if(peek === "^") {
      this.getchar();
      return "OPEN_INVERSE";
    } else if(peek === "{" || peek === "&") {
      this.getchar();
      return "OPEN_UNESCAPED";
    } else if(peek === "!") {
      this.readchar();
      this.setupLex(); // reset the lexer state so the yytext is the comment only
      while(this.peek(2) !== "}}") { this.getchar(); }
      this.readchar(2);
      this.state = "CONTENT";
      return "COMMENT";
    } else {
      return "OPEN";
    }

  // Otherwise => content section
  } else {
    while(this.peek(2) !== "{{" && this.peek(2) !== "") { result = result + this.getchar(); }
    return "CONTENT";
  }
};;
// lib/handlebars/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"statements":5,"simpleInverse":6,"statement":7,"openInverse":8,"closeBlock":9,"openBlock":10,"mustache":11,"partial":12,"CONTENT":13,"COMMENT":14,"OPEN_BLOCK":15,"inMustache":16,"CLOSE":17,"OPEN_INVERSE":18,"OPEN_ENDBLOCK":19,"path":20,"OPEN":21,"OPEN_UNESCAPED":22,"OPEN_PARTIAL":23,"params":24,"param":25,"STRING":26,"pathSegments":27,"SEP":28,"ID":29,"$accept":0,"$end":1},
terminals_: {"2":"error","13":"CONTENT","14":"COMMENT","15":"OPEN_BLOCK","17":"CLOSE","18":"OPEN_INVERSE","19":"OPEN_ENDBLOCK","21":"OPEN","22":"OPEN_UNESCAPED","23":"OPEN_PARTIAL","26":"STRING","28":"SEP","29":"ID"},
productions_: [0,[3,1],[4,3],[4,1],[4,0],[5,1],[5,2],[7,3],[7,3],[7,1],[7,1],[7,1],[7,1],[10,3],[8,3],[9,3],[11,3],[11,3],[12,3],[12,4],[6,2],[16,2],[16,1],[24,2],[24,1],[25,1],[25,1],[20,1],[27,3],[27,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy) {

var $$ = arguments[5],$0=arguments[5].length;
switch(arguments[4]) {
case 1: return $$[$0-1+1-1]
break;
case 2: this.$ = new yy.ProgramNode($$[$0-3+1-1], $$[$0-3+3-1])
break;
case 3: this.$ = new yy.ProgramNode($$[$0-1+1-1])
break;
case 4: this.$ = new yy.ProgramNode([])
break;
case 5: this.$ = [$$[$0-1+1-1]]
break;
case 6: $$[$0-2+1-1].push($$[$0-2+2-1]); this.$ = $$[$0-2+1-1]
break;
case 7: this.$ = new yy.InverseNode($$[$0-3+1-1], $$[$0-3+2-1], $$[$0-3+3-1])
break;
case 8: this.$ = new yy.BlockNode($$[$0-3+1-1], $$[$0-3+2-1], $$[$0-3+3-1])
break;
case 9: this.$ = $$[$0-1+1-1]
break;
case 10: this.$ = $$[$0-1+1-1]
break;
case 11: this.$ = new yy.ContentNode($$[$0-1+1-1])
break;
case 12: this.$ = new yy.CommentNode($$[$0-1+1-1])
break;
case 13: this.$ = new yy.MustacheNode($$[$0-3+2-1])
break;
case 14: this.$ = new yy.MustacheNode($$[$0-3+2-1])
break;
case 15: this.$ = $$[$0-3+2-1]
break;
case 16: this.$ = new yy.MustacheNode($$[$0-3+2-1])
break;
case 17: this.$ = new yy.MustacheNode($$[$0-3+2-1], true)
break;
case 18: this.$ = new yy.PartialNode($$[$0-3+2-1])
break;
case 19: this.$ = new yy.PartialNode($$[$0-4+2-1], $$[$0-4+3-1])
break;
case 20:
break;
case 21: this.$ = [$$[$0-2+1-1]].concat($$[$0-2+2-1])
break;
case 22: this.$ = [$$[$0-1+1-1]]
break;
case 23: $$[$0-2+1-1].push($$[$0-2+2-1]); this.$ = $$[$0-2+1-1];
break;
case 24: this.$ = [$$[$0-1+1-1]]
break;
case 25: this.$ = $$[$0-1+1-1]
break;
case 26: this.$ = new yy.StringNode($$[$0-1+1-1])
break;
case 27: this.$ = new yy.IdNode($$[$0-1+1-1])
break;
case 28: $$[$0-3+1-1].push($$[$0-3+3-1]); this.$ = $$[$0-3+1-1];
break;
case 29: this.$ = [$$[$0-1+1-1]]
break;
}
},
table: [{"1":[2,4],"3":1,"4":2,"5":3,"7":4,"8":5,"10":6,"11":7,"12":8,"13":[1,9],"14":[1,10],"15":[1,12],"18":[1,11],"21":[1,13],"22":[1,14],"23":[1,15]},{"1":[3]},{"1":[2,1]},{"1":[2,3],"6":16,"7":17,"8":5,"10":6,"11":7,"12":8,"13":[1,9],"14":[1,10],"15":[1,12],"18":[1,18],"19":[2,3],"21":[1,13],"22":[1,14],"23":[1,15]},{"1":[2,5],"13":[2,5],"14":[2,5],"15":[2,5],"18":[2,5],"19":[2,5],"21":[2,5],"22":[2,5],"23":[2,5]},{"4":19,"5":3,"7":4,"8":5,"10":6,"11":7,"12":8,"13":[1,9],"14":[1,10],"15":[1,12],"18":[1,11],"19":[2,4],"21":[1,13],"22":[1,14],"23":[1,15]},{"4":20,"5":3,"7":4,"8":5,"10":6,"11":7,"12":8,"13":[1,9],"14":[1,10],"15":[1,12],"18":[1,11],"19":[2,4],"21":[1,13],"22":[1,14],"23":[1,15]},{"1":[2,9],"13":[2,9],"14":[2,9],"15":[2,9],"18":[2,9],"19":[2,9],"21":[2,9],"22":[2,9],"23":[2,9]},{"1":[2,10],"13":[2,10],"14":[2,10],"15":[2,10],"18":[2,10],"19":[2,10],"21":[2,10],"22":[2,10],"23":[2,10]},{"1":[2,11],"13":[2,11],"14":[2,11],"15":[2,11],"18":[2,11],"19":[2,11],"21":[2,11],"22":[2,11],"23":[2,11]},{"1":[2,12],"13":[2,12],"14":[2,12],"15":[2,12],"18":[2,12],"19":[2,12],"21":[2,12],"22":[2,12],"23":[2,12]},{"16":21,"20":22,"27":23,"29":[1,24]},{"16":25,"20":22,"27":23,"29":[1,24]},{"16":26,"20":22,"27":23,"29":[1,24]},{"16":27,"20":22,"27":23,"29":[1,24]},{"20":28,"27":23,"29":[1,24]},{"5":29,"7":4,"8":5,"10":6,"11":7,"12":8,"13":[1,9],"14":[1,10],"15":[1,12],"18":[1,11],"21":[1,13],"22":[1,14],"23":[1,15]},{"1":[2,6],"13":[2,6],"14":[2,6],"15":[2,6],"18":[2,6],"19":[2,6],"21":[2,6],"22":[2,6],"23":[2,6]},{"16":21,"17":[1,30],"20":22,"27":23,"29":[1,24]},{"9":31,"19":[1,32]},{"9":33,"19":[1,32]},{"17":[1,34]},{"17":[2,22],"20":37,"24":35,"25":36,"26":[1,38],"27":23,"29":[1,24]},{"17":[2,27],"26":[2,27],"28":[1,39],"29":[2,27]},{"17":[2,29],"26":[2,29],"28":[2,29],"29":[2,29]},{"17":[1,40]},{"17":[1,41]},{"17":[1,42]},{"17":[1,43],"20":44,"27":23,"29":[1,24]},{"1":[2,2],"7":17,"8":5,"10":6,"11":7,"12":8,"13":[1,9],"14":[1,10],"15":[1,12],"18":[1,11],"19":[2,2],"21":[1,13],"22":[1,14],"23":[1,15]},{"13":[2,20],"14":[2,20],"15":[2,20],"18":[2,20],"21":[2,20],"22":[2,20],"23":[2,20]},{"1":[2,7],"13":[2,7],"14":[2,7],"15":[2,7],"18":[2,7],"19":[2,7],"21":[2,7],"22":[2,7],"23":[2,7]},{"20":45,"27":23,"29":[1,24]},{"1":[2,8],"13":[2,8],"14":[2,8],"15":[2,8],"18":[2,8],"19":[2,8],"21":[2,8],"22":[2,8],"23":[2,8]},{"13":[2,14],"14":[2,14],"15":[2,14],"18":[2,14],"19":[2,14],"21":[2,14],"22":[2,14],"23":[2,14]},{"17":[2,21],"20":37,"25":46,"26":[1,38],"27":23,"29":[1,24]},{"17":[2,24],"26":[2,24],"29":[2,24]},{"17":[2,25],"26":[2,25],"29":[2,25]},{"17":[2,26],"26":[2,26],"29":[2,26]},{"29":[1,47]},{"13":[2,13],"14":[2,13],"15":[2,13],"18":[2,13],"19":[2,13],"21":[2,13],"22":[2,13],"23":[2,13]},{"1":[2,16],"13":[2,16],"14":[2,16],"15":[2,16],"18":[2,16],"19":[2,16],"21":[2,16],"22":[2,16],"23":[2,16]},{"1":[2,17],"13":[2,17],"14":[2,17],"15":[2,17],"18":[2,17],"19":[2,17],"21":[2,17],"22":[2,17],"23":[2,17]},{"1":[2,18],"13":[2,18],"14":[2,18],"15":[2,18],"18":[2,18],"19":[2,18],"21":[2,18],"22":[2,18],"23":[2,18]},{"17":[1,48]},{"17":[1,49]},{"17":[2,23],"26":[2,23],"29":[2,23]},{"17":[2,28],"26":[2,28],"28":[2,28],"29":[2,28]},{"1":[2,19],"13":[2,19],"14":[2,19],"15":[2,19],"18":[2,19],"19":[2,19],"21":[2,19],"22":[2,19],"23":[2,19]},{"1":[2,15],"13":[2,15],"14":[2,15],"15":[2,15],"18":[2,15],"19":[2,15],"21":[2,15],"22":[2,15],"23":[2,15]}],
defaultActions: {"2":[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        shifts = 0,
        reductions = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;

    var parseError = this.yy.parseError = typeof this.yy.parseError == 'function' ? this.yy.parseError : this.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected, recovered = false;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                    parseError.call(this, errStr,
                        {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        a = action;

        switch (a[0]) {

            case 1: // shift
                shifts++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext); // semantic values or junk only, no terminals
                stack.push(a[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                reductions++;

                len = this.productions_[a[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, a[1], vstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                }

                stack.push(this.productions_[a[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept

                this.reductionCount = reductions;
                this.shiftCount = shifts;
                return true;
        }

    }

    return true;
}};
return parser;
})();
if (typeof require !== 'undefined') {
exports.parser = handlebars;
exports.parse = function () { return handlebars.parse.apply(handlebars, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
};
// lib/handlebars/runtime.js
// A Context wraps data, and makes it possible to extract a
// new Context given a path. For instance, if the data
// is { person: { name: "Alan" } }, a Context wrapping
// "Alan" can be extracted by searching for "person/name"
Handlebars.Context = function(data, helpers, partials) {
  this.data     = data;
  this.helpers  = helpers || {};
  this.partials = partials || {};
};

Handlebars.Context.prototype = {
  isContext: true,

  // Make a shallow copy of the Context
  clone: function() {
    return new Handlebars.Context(this.data, this.helpers, this.partials);
  },

  // Search for an object inside the Context's data. The
  // path parameter is an object with parts
  // ("person/name" represented as ["person", "name"]),
  // and depth (the amount of levels to go up the stack,
  // originally represented as ..). The stack parameter
  // is the objects already searched from the root of
  // the original Context in order to get to this point.
  //
  // Return a new Context wrapping the data found in
  // the search.
  evaluate: function(path, stack) {
    var context = this.clone();
    var depth = path.depth, parts = path.parts;

    if(depth > stack.length) { context.data = null; }
    else if(depth > 0) { context = stack[stack.length - depth].clone(); }

    for(var i=0,l=parts.length; i<l && context.data != null; i++) {
      context.data = context.data[parts[i]];
    }

    if(parts.length === 1 && context.data === undefined) {
      context.data = context.helpers[parts[0]];
    }

    return context;
  }
};

Handlebars.K = function() { return this; };

Handlebars.proxy = function(obj) {
  var Proxy = this.K;
  Proxy.prototype = obj;
  return new Proxy();
};

Handlebars.Runtime = function(context, helpers, partials, stack) {
  this.stack = stack || [];
  this.buffer = "";

  if(context && context.isContext) {
    this.context = context.clone();
  } else {
    this.context = new Handlebars.Context(context, helpers, partials)
  }
};

Handlebars.Runtime.prototype = {
  accept: Handlebars.Visitor.prototype.accept,

  ID: function(path) {
    return this.context.evaluate(path, this.stack);
  },

  STRING: function(string) {
    return { data: string.string };
  },

  program: function(program) {
    var statements = program.statements;

    for(var i=0, l=statements.length; i<l; i++) {
      var statement = statements[i];
      this[statement.type](statement);
    }

    return this.buffer;
  },

  mustache: function(mustache) {
    var idObj  = this.ID(mustache.id);
    var params = mustache.params;
    var buf;

    for(var i=0, l=params.length; i<l; i++) {
      var param = params[i];
      params[i] = this[param.type](param).data;
    }

    var data = idObj.data;
    var type = toString.call(data);
    var functionType = (type === "[object Function]");

    if(!functionType && params.length) {
      params = params.slice(0);
      params.unshift(data || mustache.id.original);
      data = this.context.helpers.helperMissing;
      functionType = true;
    }

    if(functionType) {
      buf = data.apply(this.wrapContext(), params);
    } else {
      buf = data;
    }

    if(buf && mustache.escaped) { buf = Handlebars.Utils.escapeExpression(buf); }

    this.buffer = this.buffer + ((!buf && buf !== 0) ? '' : buf);
  },

  block: function(block) {
    var mustache = block.mustache,
        id       = mustache.id;

    var idObj    = this.ID(mustache.id),
        data     = idObj.data;

    var result;

    if(toString.call(data) !== "[object Function]") {
      params = [data];
      data   = this.context.helpers.blockHelperMissing;
    } else {
      params = this.evaluateParams(mustache.params);
    }

    params.push(this.wrapProgram(block.program));
    result = data.apply(this.wrapContext(), params);
    this.buffer = this.buffer + result;

    if(block.program.inverse) {
      params.pop();
      params.push(this.wrapProgram(block.program.inverse));
      result = data.not.apply(this.wrapContext(), params);
      this.buffer = this.buffer + result;
    }
  },

  partial: function(partial) {
    var partials = this.context.partials || {};
    var id = partial.id.original;

    var partialBody = partials[partial.id.original];
    var program, context;

    if(!partialBody) {
      throw new Handlebars.Exception("The partial " + partial.id.original + " does not exist");
    }

    if(typeof partialBody === "string") {
      program = Handlebars.parse(partialBody);
      partials[id] = program;
    } else {
      program = partialBody;
    }

    if(partial.context) {
      context = this.ID(partial.context);
    } else {
      context = this.context;
    }
    var runtime = new Handlebars.Runtime(context, null, null, this.stack.slice(0));
    this.buffer = this.buffer + runtime.program(program);
  },

  not: function(context, fn) {
    return fn(context);
  },

  // TODO: Write down the actual spec for inverse sections...
  inverse: function(block) {
    var mustache  = block.mustache,
        id        = mustache.id,
        not;

    var idObj     = this.ID(id),
        data      = idObj.data,
        isInverse = Handlebars.Utils.isEmpty(data);


    var context = this.wrapContext();

    if(toString.call(data) === "[object Function]") {
      params  = this.evaluateParams(mustache.params);
      id      = id.parts.join("/");

      data = data.apply(context, params);
      if(Handlebars.Utils.isEmpty(data)) { isInverse = true; }
      if(data.not) { not = data.not; } else { not = this.not; }
    } else {
      not = this.not;
    }

    var result = not(context, this.wrapProgram(block.program));
    if(result != null) { this.buffer = this.buffer + result; }
    return;
  },

  content: function(content) {
    this.buffer += content.string;
  },

  comment: function() {},

  evaluateParams: function(params) {
    var ret = [];

    for(var i=0, l=params.length; i<l; i++) {
      var param = params[i];
      ret[i] = this[param.type](param).data;
    }

    if(ret.length === 0) { ret = [this.wrapContext()]; }
    return ret;
  },

  wrapContext: function() {
    var data      = this.context.data;
    var proxy     = Handlebars.proxy(data);
    var context   = proxy.__context__ = this.context;
    var stack     = proxy.__stack__   = this.stack.slice(0);

    proxy.__get__ = function(path) {
      path = new Handlebars.AST.IdNode(path.split("/"));
      return context.evaluate(path, stack).data;
    };

    proxy.isWrappedContext = true;
    proxy.__data__         = data;

    return proxy;
  },

  wrapProgram: function(program) {
    var runtime  = this,
        stack    = this.stack.slice(0),
        helpers  = this.context.helpers,
        partials = this.context.partials;

    stack.push(this.context);

    return function(context) {
      if(context && context.isWrappedContext) { context = context.__data__; }
      var runtime = new Handlebars.Runtime(context, helpers, partials, stack);
      runtime.program(program);
      return runtime.buffer;
    };
  }

};;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  this.message = message;
};

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

Handlebars.Utils = {
  escapeExpression: function(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof Handlebars.SafeString) {
      return string.toString();
    }
    else if (string === null) {
      string = "";
    }

    return string.toString().replace(/&(?!\w+;)|["\\<>]/g, function(str) {
      switch(str) {
        case "&":
          return "&amp;";
        case '"':
          return "\"";
        case "\\":
          return "\\\\";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        default:
          return str;
      }
    });
  },
  isEmpty: function(value) {
    if (typeof value === "undefined") {
      return true;
    } else if (value === null) {
      return true;
		} else if (value === false) {
			return true;
    } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};;
// lib/handlebars.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  Handlebars.Parser.lexer = new Handlebars.HandlebarsLexer();
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.compile = function(string) {
  var ast = Handlebars.parse(string);

  return function(context, helpers, partials) {
    var helpers, partials;

    if(!helpers) {
      helpers  = Handlebars.helpers;
    }

    if(!partials) {
      partials = Handlebars.partials;
    }

    var runtime = new Handlebars.Runtime(context, helpers, partials);
    runtime.accept(ast);
    return runtime.buffer;
  };
};

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('blockHelperMissing', function(context, fn) {
  var ret = "";

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null || context === undefined) {
    return "";
  } else if(Object.prototype.toString.call(context) === "[object Array]") {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
    return ret;
  } else {
		return fn(context);
	}
}, function(context, fn) {
  return fn(context)
});
;

