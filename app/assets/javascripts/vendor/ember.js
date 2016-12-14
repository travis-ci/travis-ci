
(function(exports) {
// lib/handlebars/base.js
var Handlebars = {};

window.Handlebars = Handlebars;

Handlebars.VERSION = "1.0.beta.2";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = Object.prototype.toString.call(context);

  if(type === "[object Function]") {
    context = context();
  }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
});

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"param":27,"STRING":28,"INTEGER":29,"BOOLEAN":30,"hashSegments":31,"hashSegment":32,"ID":33,"EQUALS":34,"pathSegments":35,"SEP":36,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1] 
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]) 
break;
case 3: this.$ = new yy.ProgramNode($$[$0]) 
break;
case 4: this.$ = new yy.ProgramNode([]) 
break;
case 5: this.$ = [$$[$0]] 
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 7: this.$ = new yy.InverseNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 9: this.$ = $$[$0] 
break;
case 10: this.$ = $$[$0] 
break;
case 11: this.$ = new yy.ContentNode($$[$0]) 
break;
case 12: this.$ = new yy.CommentNode($$[$0]) 
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 15: this.$ = $$[$0-1] 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true) 
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]) 
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]) 
break;
case 20: 
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]] 
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null] 
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]] 
break;
case 24: this.$ = [[$$[$0]], null] 
break;
case 25: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 26: this.$ = [$$[$0]] 
break;
case 27: this.$ = $$[$0] 
break;
case 28: this.$ = new yy.StringNode($$[$0]) 
break;
case 29: this.$ = new yy.IntegerNode($$[$0]) 
break;
case 30: this.$ = new yy.BooleanNode($$[$0]) 
break;
case 31: this.$ = new yy.HashNode($$[$0]) 
break;
case 32: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 33: this.$ = [$$[$0]] 
break;
case 34: this.$ = [$$[$0-2], $$[$0]] 
break;
case 35: this.$ = [$$[$0-2], new yy.StringNode($$[$0])] 
break;
case 36: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])] 
break;
case 37: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])] 
break;
case 38: this.$ = new yy.IdNode($$[$0]) 
break;
case 39: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 40: this.$ = [$$[$0]] 
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],
defaultActions: {16:[2,1],37:[2,23],53:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
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

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
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
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
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
                yyloc = this.lexer.yylloc;
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

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: this.begin("mu"); if (yy_.yytext) return 14; 
break;
case 1: return 14; 
break;
case 2: return 24; 
break;
case 3: return 16; 
break;
case 4: return 20; 
break;
case 5: return 19; 
break;
case 6: return 19; 
break;
case 7: return 23; 
break;
case 8: return 23; 
break;
case 9: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.begin("INITIAL"); return 15; 
break;
case 10: return 22; 
break;
case 11: return 34; 
break;
case 12: return 33; 
break;
case 13: return 33; 
break;
case 14: return 36; 
break;
case 15: /*ignore whitespace*/ 
break;
case 16: this.begin("INITIAL"); return 18; 
break;
case 17: this.begin("INITIAL"); return 18; 
break;
case 18: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 28; 
break;
case 19: return 30; 
break;
case 20: return 30; 
break;
case 21: return 29; 
break;
case 22: return 33; 
break;
case 23: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 33; 
break;
case 24: return 'INVALID'; 
break;
case 25: return 5; 
break;
}
};
lexer.rules = [/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s/.])/,/^\[.*\]/,/^./,/^$/];
lexer.conditions = {"mu":{"rules":[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"inclusive":false},"INITIAL":{"rules":[0,1,25],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
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
;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(params, hash, unescaped) {
    this.type = "mustache";
    this.id = params[0];
    this.params = params.slice(1);
    this.hash = hash;
    this.escaped = !unescaped;
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
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

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { this.isScoped = true; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;
    this.isSimple = (dig.length === 1) && (depth === 0);
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }
};
Handlebars.Exception.prototype = new Error;

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /&(?!\w+;)|[<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
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
  };
})();;
// lib/handlebars/compiler/compiler.js
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  Compiler.OPCODE_MAP = {
    appendContent: 1,
    getContext: 2,
    lookupWithHelpers: 3,
    lookup: 4,
    append: 5,
    invokeMustache: 6,
    appendEscaped: 7,
    pushString: 8,
    truthyOrFallback: 9,
    functionOrFallback: 10,
    invokeProgram: 11,
    invokePartial: 12,
    push: 13,
    assignToHash: 15,
    pushStringParam: 16
  };

  Compiler.MULTI_PARAM_OPCODES = {
    appendContent: 1,
    getContext: 1,
    lookupWithHelpers: 2,
    lookup: 1,
    invokeMustache: 3,
    pushString: 1,
    truthyOrFallback: 1,
    functionOrFallback: 1,
    invokeProgram: 3,
    invokePartial: 1,
    push: 1,
    assignToHash: 1,
    pushStringParam: 1
  };

  Compiler.DISASSEMBLE_MAP = {};

  for(var prop in Compiler.OPCODE_MAP) {
    var value = Compiler.OPCODE_MAP[prop];
    Compiler.DISASSEMBLE_MAP[value] = prop;
  }

  Compiler.multiParamSize = function(code) {
    return Compiler.MULTI_PARAM_OPCODES[Compiler.DISASSEMBLE_MAP[code]];
  };

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, nextCode;
      var out = [], str, name, value;

      for(var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if(opcode === 'DECLARE') {
          name = opcodes[++i];
          value = opcodes[++i];
          out.push("DECLARE " + name + " = " + value);
        } else {
          str = Compiler.DISASSEMBLE_MAP[opcode];

          var extraParams = Compiler.multiParamSize(opcode);
          var codes = [];

          for(var j=0; j<extraParams; j++) {
            nextCode = opcodes[++i];

            if(typeof nextCode === "string") {
              nextCode = "\"" + nextCode.replace("\n", "\\n") + "\"";
            }

            codes.push(nextCode);
          }

          str = str + " " + codes.join(" ");

          out.push(str);
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache;
      var depth, child, inverse, inverseGuid;

      var params = this.setupStackForMustache(mustache);

      var programGuid = this.compileProgram(block.program);

      if(block.program.inverse) {
        inverseGuid = this.compileProgram(block.program.inverse);
        this.declare('inverse', inverseGuid);
      }

      this.opcode('invokeProgram', programGuid, params.length, !!mustache.hash);
      this.declare('inverse', null);
      this.opcode('append');
    },

    inverse: function(block) {
      var params = this.setupStackForMustache(block.mustache);

      var programGuid = this.compileProgram(block.program);

      this.declare('inverse', programGuid);

      this.opcode('invokeProgram', null, params.length, !!block.mustache.hash);
      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var params = this.setupStackForMustache(mustache);

      this.opcode('invokeMustache', params.length, mustache.id.original, !!mustache.hash);

      if(mustache.escaped) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);

      this.opcode('getContext', id.depth);

      this.opcode('lookupWithHelpers', id.parts[0] || null, id.isScoped || false);

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('push', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('push', bool.bool);
    },

    comment: function() {},

    // HELPERS
    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    opcode: function(name, val1, val2, val3) {
      this.opcodes.push(Compiler.OPCODE_MAP[name]);
      if(val1 !== undefined) { this.opcodes.push(val1); }
      if(val2 !== undefined) { this.opcodes.push(val2); }
      if(val3 !== undefined) { this.opcodes.push(val3); }
    },

    declare: function(name, value) {
      this.opcodes.push('DECLARE');
      this.opcodes.push(name);
      this.opcodes.push(value);
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    setupStackForMustache: function(mustache) {
      var params = mustache.params;

      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      }

      this.ID(mustache.id);

      return params;
    }
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
			if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
	    	return parent + "." + name;
			}
			else {
				return parent + "['" + name + "']";
      }
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return "buffer += " + string + ";";
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        aliases: { self: 'this' },
        registers: {list: []}
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = this.nextOpcode(0);

        if(opcode[0] === 'DECLARE') {
          this.i = this.i + 2;
          this[opcode[1]] = opcode[2];
        } else {
          this.i = this.i + opcode[1].length;
          this[opcode[0]].apply(this, opcode[1]);
        }
      }

      return this.createFunctionContext(asObject);
    },

    nextOpcode: function(n) {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + n], name, val;
      var extraParams, codes;

      if(opcode === 'DECLARE') {
        name = opcodes[this.i + 1];
        val  = opcodes[this.i + 2];
        return ['DECLARE', name, val];
      } else {
        name = Compiler.DISASSEMBLE_MAP[opcode];

        extraParams = Compiler.multiParamSize(opcode);
        codes = [];

        for(var j=0; j<extraParams; j++) {
          codes.push(opcodes[this.i + j + 1 + n]);
        }

        return [name, codes];
      }
    },

    eat: function(opcode) {
      this.i = this.i + opcode.length;
    },

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if(this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars;
      if (!this.isChild) {
        locals = locals.concat(this.context.registers.list);
      }

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        var aliases = []
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if (asObject) {
        params.push(this.source.join("\n  "));

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '}';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
      }
    },

    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " }");
      }
    },

    appendEscaped: function() {
      var opcode = this.nextOpcode(1), extra = "";
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      if(opcode[0] === 'appendContent') {
        extra = " + " + this.quotedString(opcode[1][0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
    },

    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    lookupWithHelpers: function(name, isScoped) {
      if(name) {
        var topStack = this.nextStack();

        this.usingKnownHelper = false;

        var toPush;
        if (!isScoped && this.options.knownHelpers[name]) {
          toPush = topStack + " = " + this.nameLookup('helpers', name, 'helper');
          this.usingKnownHelper = true;
        } else if (isScoped || this.options.knownHelpersOnly) {
          toPush = topStack + " = " + this.nameLookup('depth' + this.lastContext, name, 'context');
        } else {
          toPush =  topStack + " = "
              + this.nameLookup('helpers', name, 'helper')
              + " || "
              + this.nameLookup('depth' + this.lastContext, name, 'context');
        }

        toPush += ';';
        this.source.push(toPush);
      } else {
        this.pushStack('depth' + this.lastContext);
      }
    },

    lookup: function(name) {
      var topStack = this.topStack();
      this.source.push(topStack + " = (" + topStack + " === null || " + topStack + " === undefined || " + topStack + " === false ? " +
 				topStack + " : " + this.nameLookup(topStack, name, 'context') + ");");
    },

    pushStringParam: function(string) {
      this.pushStack('depth' + this.lastContext);
      this.pushString(string);
    },

    pushString: function(string) {
      this.pushStack(this.quotedString(string));
    },

    push: function(name) {
      this.pushStack(name);
    },

    invokeMustache: function(paramSize, original, hasHash) {
      this.populateParams(paramSize, this.quotedString(original), "{}", null, hasHash, function(nextStack, helperMissingString, id) {
        if (!this.usingKnownHelper) {
          this.context.aliases.helperMissing = 'helpers.helperMissing';
          this.context.aliases.undef = 'void 0';
          this.source.push("else if(" + id + "=== undef) { " + nextStack + " = helperMissing.call(" + helperMissingString + "); }");
          if (nextStack !== id) {
            this.source.push("else { " + nextStack + " = " + id + "; }");
          }
        }
      });
    },

    invokeProgram: function(guid, paramSize, hasHash) {
      var inverse = this.programExpression(this.inverse);
      var mainProgram = this.programExpression(guid);

      this.populateParams(paramSize, null, mainProgram, inverse, hasHash, function(nextStack, helperMissingString, id) {
        if (!this.usingKnownHelper) {
          this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';
          this.source.push("else { " + nextStack + " = blockHelperMissing.call(" + helperMissingString + "); }");
        }
      });
    },

    populateParams: function(paramSize, helperId, program, inverse, hasHash, fn) {
      var needsRegister = hasHash || this.options.stringParams || inverse || this.options.data;
      var id = this.popStack(), nextStack;
      var params = [], param, stringParam, stringOptions;

      if (needsRegister) {
        this.register('tmp1', program);
        stringOptions = 'tmp1';
      } else {
        stringOptions = '{ hash: {} }';
      }

      if (needsRegister) {
        var hash = (hasHash ? this.popStack() : '{}');
        this.source.push('tmp1.hash = ' + hash + ';');
      }

      if(this.options.stringParams) {
        this.source.push('tmp1.contexts = [];');
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          this.source.push('tmp1.contexts.push(' + this.popStack() + ');');
        }
      }

      if(inverse) {
        this.source.push('tmp1.fn = tmp1;');
        this.source.push('tmp1.inverse = ' + inverse + ';');
      }

      if(this.options.data) {
        this.source.push('tmp1.data = data;');
      }

      params.push(stringOptions);

      this.populateCall(params, id, helperId || id, fn);
    },

    populateCall: function(params, id, helperId, fn) {
      var paramString = ["depth0"].concat(params).join(", ");
      var helperMissingString = ["depth0"].concat(helperId).concat(params).join(", ");

      var nextStack = this.nextStack();

      if (this.usingKnownHelper) {
        this.source.push(nextStack + " = " + id + ".call(" + paramString + ");");
      } else {
        this.context.aliases.functionType = '"function"';
        this.source.push("if(typeof " + id + " === functionType) { " + nextStack + " = " + id + ".call(" + paramString + "); }");
      }
      fn.call(this, nextStack, helperMissingString, id);
      this.usingKnownHelper = false;
    },

    invokePartial: function(context) {
      this.pushStack("self.invokePartial(" + this.nameLookup('partials', context, 'partial') + ", '" + context + "', " + this.popStack() + ", helpers, partials);");
    },

    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
      }
    },

    programExpression: function(guid) {
      if(guid == null) { return "self.noop"; }

      var child = this.environment.children[guid],
          depths = child.depths.list;
      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
      } else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.context.registers[name]) {
        this.context.registers[name] = true;
        this.context.registers.list.push(name);
      }
    },

    pushStack: function(item) {
      this.source.push(this.nextStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      return "stack" + this.stackSlot--;
    },

    topStack: function() {
      return "stack" + this.stackSlot;
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    }
  };

  var reservedWords = ("break case catch continue default delete do else finally " +
                       "for function if in instanceof new return switch this throw " +
                       "try typeof var void while with null true false").split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

	JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
		if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
			return true;
		}
		return false;
	}

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(string, options) {
  options = options || {};

  var ast = Handlebars.parse(string);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(string, options) {
  options = options || {};

  var compiled;
  function compile() {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};
;
// lib/handlebars/vm.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials) {
    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, {helpers: helpers, partials: partials});
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in vm mode");
    } else {
      partials[name] = Handlebars.compile(partial);
      return partials[name](context, {helpers: helpers, partials: partials});
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;


})({});

(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ENV ember_assert */

if ('undefined' === typeof Ember) {
/**
  @namespace
  @name Ember
  @version 0.9.3

  All Ember methods and functions are defined inside of this namespace.
  You generally should not add new properties to this namespace as it may be
  overwritten by future versions of Ember.

  You can also use the shorthand "Em" instead of "Ember".

  Ember-Runtime is a framework that provides core functions for 
  Ember including cross-platform functions, support for property 
  observing and objects. Its focus is on small size and performance. You can 
  use this in place of or along-side other cross-platform libraries such as 
  jQuery.

  The core Runtime framework is based on the jQuery API with a number of
  performance optimizations.
*/

// Create core object. Make it act like an instance of Ember.Namespace so that
// objects assigned to it are given a sane string representation.
Ember = { isNamespace: true, toString: function() { return "Ember"; } };

// aliases needed to keep minifiers from removing the global context
if ('undefined' !== typeof window) {
  window.SC = window.SproutCore = window.Em = window.Ember = SC = SproutCore = Em = Ember;
}

}

/**
  @static
  @type String
  @default '0.9.3'
  @constant
*/
Ember.VERSION = '0.9.3';

/**
  @static
  @type Hash
  @constant
  
  Standard environmental variables.  You can define these in a global `ENV`
  variable before loading Ember to control various configuration 
  settings.
*/
Ember.ENV = 'undefined' === typeof ENV ? {} : ENV;

/**
  Empty function.  Useful for some operations.

  @returns {Object}
  @private
*/
Ember.K = function() { return this; };

/**
  Define an assertion that will throw an exception if the condition is not 
  met.  Ember build tools will remove any calls to ember_assert() when 
  doing a production build.
  
  ## Examples
  
      #js:
      
      // pass a simple Boolean value
      ember_assert('must pass a valid object', !!obj);

      // pass a function.  If the function returns false the assertion fails
      // any other return value (including void) will pass.
      ember_assert('a passed record must have a firstName', function() {
        if (obj instanceof Ember.Record) {
          return !Ember.empty(obj.firstName);
        }
      });
      
  @static
  @function
  @param {String} desc
    A description of the assertion.  This will become the text of the Error
    thrown if the assertion fails.
    
  @param {Boolean} test
    Must return true for the assertion to pass.  If you pass a function it
    will be executed.  If the function returns false an exception will be
    thrown.
*/
window.ember_assert = window.sc_assert = function ember_assert(desc, test) {
  if ('function' === typeof test) test = test()!==false;
  if (!test) throw new Error("assertion failed: "+desc);
};

//if ('undefined' === typeof ember_require) ember_require = Ember.K;
if ('undefined' === typeof require) require = Ember.K;

// ..........................................................
// LOGGER
// 

/**
  @class

  Inside Ember-Metal, simply uses the window.console object.
  Override this to provide more robust logging functionality.
*/
Ember.Logger = window.console || { log: Ember.K, warn: Ember.K, error: Ember.K };

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
/**
  @class

  Platform specific methods and feature detectors needed by the framework.
*/
var platform = Ember.platform = {} ;

/**
  Identical to Object.create().  Implements if not available natively.
*/
platform.create = Object.create;

if (!platform.create) {
  var O_ctor = function() {},
      O_proto = O_ctor.prototype;

  platform.create = function(obj, descs) {
    O_ctor.prototype = obj;
    obj = new O_ctor();
    O_ctor.prototype = O_proto;

    if (descs !== undefined) {
      for(var key in descs) {
        if (!descs.hasOwnProperty(key)) continue;
        platform.defineProperty(obj, key, descs[key]);
      }
    }

    return obj;
  };

  platform.create.isSimulated = true;
}

var defineProperty = Object.defineProperty, canRedefineProperties, canDefinePropertyOnDOM;

// Catch IE8 where Object.defineProperty exists but only works on DOM elements
if (defineProperty) {
  try {
    defineProperty({}, 'a',{get:function(){}});
  } catch (e) {
    defineProperty = null;
  }
}

if (defineProperty) {
  // Detects a bug in Android <3.2 where you cannot redefine a property using
  // Object.defineProperty once accessors have already been set.
  canRedefineProperties = (function() {
    var obj = {};

    defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      get: function() { },
      set: function() { }
    });

    defineProperty(obj, 'a', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: true
    });

    return obj.a === true;
  })();

  // This is for Safari 5.0, which supports Object.defineProperty, but not
  // on DOM nodes.

  canDefinePropertyOnDOM = (function(){
    try {
      defineProperty(document.body, 'definePropertyOnDOM', {});
      return true;
    } catch(e) { }

    return false;
  })();

  if (!canRedefineProperties) {
    defineProperty = null;
  } else if (!canDefinePropertyOnDOM) {
    defineProperty = function(obj, keyName, desc){
      var isNode;

      if (typeof Node === "object") {
        isNode = obj instanceof Node;
      } else {
        isNode = typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string";
      }

      if (isNode) {
        // TODO: Should we have a warning here?
        return (obj[keyName] = desc.value);
      } else {
        return Object.defineProperty(obj, keyName, desc);
      }
    };
  }
}

/**
  Identical to Object.defineProperty().  Implements as much functionality
  as possible if not available natively.

  @param {Object} obj The object to modify
  @param {String} keyName property name to modify
  @param {Object} desc descriptor hash
  @returns {void}
*/
platform.defineProperty = defineProperty;

/**
  Set to true if the platform supports native getters and setters.
*/
platform.hasPropertyAccessors = true;

if (!platform.defineProperty) {
  platform.hasPropertyAccessors = false;

  platform.defineProperty = function(obj, keyName, desc) {
    ember_assert("property descriptor cannot have `get` or `set` on this platform", !desc.get && !desc.set);
    obj[keyName] = desc.value;
  };

  platform.defineProperty.isSimulated = true;
}

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ..........................................................
// GUIDS
// 

// Used for guid generation...
var GUID_KEY = '__ember'+ (+ new Date());
var uuid, numberCache, stringCache;

uuid         = 0;
numberCache  = [];
stringCache  = {};

var GUID_DESC = {
  configurable: true,
  writable: true,
  enumerable: false
};

var o_defineProperty = Ember.platform.defineProperty;
var o_create = Ember.platform.create;

/**
  @private
  @static
  @type String
  @constant

  A unique key used to assign guids and other private metadata to objects.
  If you inspect an object in your browser debugger you will often see these.
  They can be safely ignored.

  On browsers that support it, these properties are added with enumeration 
  disabled so they won't show up when you iterate over your properties.
*/
Ember.GUID_KEY = GUID_KEY;

/**
  @private

  Generates a new guid, optionally saving the guid to the object that you
  pass in.  You will rarely need to use this method.  Instead you should
  call Ember.guidFor(obj), which return an existing guid if available.

  @param {Object} obj
    Optional object the guid will be used for.  If passed in, the guid will
    be saved on the object and reused whenever you pass the same object 
    again.

    If no object is passed, just generate a new guid.

  @param {String} prefix
    Optional prefix to place in front of the guid.  Useful when you want to
    separate the guid into separate namespaces.

  @returns {String} the guid
*/
Ember.generateGuid = function(obj, prefix) {
  if (!prefix) prefix = 'ember';
  var ret = (prefix + (uuid++));
  if (obj) {
    GUID_DESC.value = ret;
    o_defineProperty(obj, GUID_KEY, GUID_DESC);
    GUID_DESC.value = null;
  }

  return ret ;
};

/**
  @private

  Returns a unique id for the object.  If the object does not yet have
  a guid, one will be assigned to it.  You can call this on any object,
  Ember.Object-based or not, but be aware that it will add a _guid property.

  You can also use this method on DOM Element objects.

  @method
  @param obj {Object} any object, string, number, Element, or primitive
  @returns {String} the unique guid for this instance.
*/
Ember.guidFor = function(obj) {

  // special cases where we don't want to add a key to object
  if (obj === undefined) return "(undefined)";
  if (obj === null) return "(null)";

  var cache, ret;
  var type = typeof obj;

  // Don't allow prototype changes to String etc. to change the guidFor
  switch(type) {
    case 'number':
      ret = numberCache[obj];
      if (!ret) ret = numberCache[obj] = 'nu'+obj;
      return ret;

    case 'string':
      ret = stringCache[obj];
      if (!ret) ret = stringCache[obj] = 'st'+(uuid++);
      return ret;

    case 'boolean':
      return obj ? '(true)' : '(false)';

    default:
      if (obj[GUID_KEY]) return obj[GUID_KEY];
      if (obj === Object) return '(Object)';
      if (obj === Array)  return '(Array)';
      return Ember.generateGuid(obj, 'ember');
  }
};


// ..........................................................
// META
// 

var META_DESC = {
  writable:    true,
  configurable: false,
  enumerable:  false,
  value: null
};

var META_KEY = Ember.GUID_KEY+'_meta';

/**
  The key used to store meta information on object for property observing.

  @static
  @property
*/
Ember.META_KEY = META_KEY;

// Placeholder for non-writable metas.
var EMPTY_META = {
  descs: {},
  watching: {}
}; 

if (Object.freeze) Object.freeze(EMPTY_META);

/**
  @private
  @function
  
  Retrieves the meta hash for an object.  If 'writable' is true ensures the
  hash is writable for this object as well.
  
  The meta object contains information about computed property descriptors as
  well as any watched properties and other information.  You generally will
  not access this information directly but instead work with higher level 
  methods that manipulate this has indirectly.

  @param {Object} obj
    The object to retrieve meta for
    
  @param {Boolean} writable
    Pass false if you do not intend to modify the meta hash, allowing the 
    method to avoid making an unnecessary copy.
    
  @returns {Hash}
*/
Ember.meta = function meta(obj, writable) {
  
  ember_assert("You must pass an object to Ember.meta. This was probably called from Ember internals, so you probably called a Ember method with undefined that was expecting an object", obj != undefined);

  var ret = obj[META_KEY];
  if (writable===false) return ret || EMPTY_META;

  if (!ret) {
    o_defineProperty(obj, META_KEY, META_DESC);
    ret = obj[META_KEY] = {
      descs: {},
      watching: {},
      values: {},
      lastSetValues: {},
      cache:  {},
      source: obj
    };
    
    // make sure we don't accidentally try to create constructor like desc
    ret.descs.constructor = null;
    
  } else if (ret.source !== obj) {
    ret = obj[META_KEY] = o_create(ret);
    ret.descs    = o_create(ret.descs);
    ret.values   = o_create(ret.values);
    ret.watching = o_create(ret.watching);
    ret.lastSetValues = {};
    ret.cache    = {};
    ret.source   = obj;
  }
  return ret;
};

Ember.getMeta = function getMeta(obj, property) {
  var meta = Ember.meta(obj, false);
  return meta[property];
};

Ember.setMeta = function setMeta(obj, property, value) {
  var meta = Ember.meta(obj, true);
  meta[property] = value;
  return value;
};

/**
  @private

  In order to store defaults for a class, a prototype may need to create
  a default meta object, which will be inherited by any objects instantiated
  from the class's constructor.

  However, the properties of that meta object are only shallow-cloned,
  so if a property is a hash (like the event system's `listeners` hash),
  it will by default be shared across all instances of that class.

  This method allows extensions to deeply clone a series of nested hashes or
  other complex objects. For instance, the event system might pass
  ['listeners', 'foo:change', 'ember157'] to `prepareMetaPath`, which will
  walk down the keys provided.

  For each key, if the key does not exist, it is created. If it already
  exists and it was inherited from its constructor, the constructor's
  key is cloned.

  You can also pass false for `writable`, which will simply return
  undefined if `prepareMetaPath` discovers any part of the path that
  shared or undefined.

  @param {Object} obj The object whose meta we are examining
  @param {Array} path An array of keys to walk down
  @param {Boolean} writable whether or not to create a new meta
    (or meta property) if one does not already exist or if it's
    shared with its constructor
*/
Ember.metaPath = function(obj, path, writable) {
  var meta = Ember.meta(obj, writable), keyName, value;

  for (var i=0, l=path.length; i<l; i++) {
    keyName = path[i];
    value = meta[keyName];

    if (!value) {
      if (!writable) { return undefined; }
      value = meta[keyName] = { __ember_source__: obj };
    } else if (value.__ember_source__ !== obj) {
      if (!writable) { return undefined; }
      value = meta[keyName] = o_create(value);
      value.__ember_source__ = obj;
    }

    meta = value;
  }

  return value;
};

/**
  @private

  Wraps the passed function so that `this._super` will point to the superFunc
  when the function is invoked.  This is the primitive we use to implement
  calls to super.
  
  @param {Function} func
    The function to call
    
  @param {Function} superFunc
    The super function.
    
  @returns {Function} wrapped function.
*/
Ember.wrap = function(func, superFunc) {
  
  function K() {}
  
  var newFunc = function() {
    var ret, sup = this._super;
    this._super = superFunc || K;
    ret = func.apply(this, arguments);
    this._super = sup;
    return ret;
  };
  
  newFunc.base = func;
  return newFunc;
};

/**
  @function
  
  Returns YES if the passed object is an array or Array-like.

  Ember Array Protocol:

    - the object has an objectAt property
    - the object is a native Array
    - the object is an Object, and has a length property

  Unlike Ember.typeOf this method returns true even if the passed object is
  not formally array but appears to be array-like (i.e. implements Ember.Array)

  @param {Object} obj The object to test
  @returns {Boolean}
*/
Ember.isArray = function(obj) {
  if (!obj || obj.setInterval) { return false; }
  if (Array.isArray && Array.isArray(obj)) { return true; }
  if (Ember.Array && Ember.Array.detect(obj)) { return true; }
  if ((obj.length !== undefined) && 'object'===typeof obj) { return true; }
  return false;
};

/**
  Forces the passed object to be part of an array.  If the object is already
  an array or array-like, returns the object.  Otherwise adds the object to
  an array.  If obj is null or undefined, returns an empty array.
  
  @param {Object} obj the object
  @returns {Array}
*/
Ember.makeArray = function(obj) {
  if (obj==null) return [];
  return Ember.isArray(obj) ? obj : [obj];
};



})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
var USE_ACCESSORS = Ember.platform.hasPropertyAccessors && Ember.ENV.USE_ACCESSORS;
Ember.USE_ACCESSORS = !!USE_ACCESSORS;

var meta = Ember.meta;

// ..........................................................
// GET AND SET
// 
// If we are on a platform that supports accessors we can get use those.
// Otherwise simulate accessors by looking up the property directly on the
// object.

var get, set;

get = function get(obj, keyName) {
  if (keyName === undefined && 'string' === typeof obj) {
    keyName = obj;
    obj = Ember;
  }
  
  if (!obj) return undefined;
  var ret = obj[keyName];
  if (ret===undefined && 'function'===typeof obj.unknownProperty) {
    ret = obj.unknownProperty(keyName);
  }
  return ret;
};

set = function set(obj, keyName, value) {
  if (('object'===typeof obj) && !(keyName in obj)) {
    if ('function' === typeof obj.setUnknownProperty) {
      obj.setUnknownProperty(keyName, value);
    } else if ('function' === typeof obj.unknownProperty) {
      obj.unknownProperty(keyName, value);
    } else obj[keyName] = value;
  } else {
    obj[keyName] = value;
  }
  return value;
};

if (!USE_ACCESSORS) {

  var o_get = get, o_set = set;
  
  get = function(obj, keyName) {
    if (keyName === undefined && 'string' === typeof obj) {
      keyName = obj;
      obj = Ember;
    }

    ember_assert("You need to provide an object and key to `get`.", !!obj && keyName);

    if (!obj) return undefined;
    var desc = meta(obj, false).descs[keyName];
    if (desc) return desc.get(obj, keyName);
    else return o_get(obj, keyName);
  };

  set = function(obj, keyName, value) {
    ember_assert("You need to provide an object and key to `set`.", !!obj && keyName !== undefined);
    var desc = meta(obj, false).descs[keyName];
    if (desc) desc.set(obj, keyName, value);
    else o_set(obj, keyName, value);
    return value;
  };

}

/**
  @function
  
  Gets the value of a property on an object.  If the property is computed,
  the function will be invoked.  If the property is not defined but the 
  object implements the unknownProperty() method then that will be invoked.
  
  If you plan to run on IE8 and older browsers then you should use this 
  method anytime you want to retrieve a property on an object that you don't
  know for sure is private.  (My convention only properties beginning with 
  an underscore '_' are considered private.)
  
  On all newer browsers, you only need to use this method to retrieve 
  properties if the property might not be defined on the object and you want
  to respect the unknownProperty() handler.  Otherwise you can ignore this
  method.
  
  Note that if the obj itself is null, this method will simply return 
  undefined.
  
  @param {Object} obj
    The object to retrieve from.
    
  @param {String} keyName
    The property key to retrieve
    
  @returns {Object} the property value or null.
*/
Ember.get = get;

/**
  @function 
  
  Sets the value of a property on an object, respecting computed properties
  and notifying observers and other listeners of the change.  If the 
  property is not defined but the object implements the unknownProperty()
  method then that will be invoked as well.
  
  If you plan to run on IE8 and older browsers then you should use this 
  method anytime you want to set a property on an object that you don't
  know for sure is private.  (My convention only properties beginning with 
  an underscore '_' are considered private.)
  
  On all newer browsers, you only need to use this method to set 
  properties if the property might not be defined on the object and you want
  to respect the unknownProperty() handler.  Otherwise you can ignore this
  method.
  
  @param {Object} obj
    The object to modify.
    
  @param {String} keyName
    The property key to set
    
  @param {Object} value
    The value to set
    
  @returns {Object} the passed value.
*/
Ember.set = set;

// ..........................................................
// PATHS
// 

function normalizePath(path) {
  ember_assert('must pass non-empty string to normalizePath()', path && path!=='');
    
  if (path==='*') return path; //special case...
  var first = path.charAt(0);
  if(first==='.') return 'this'+path;
  if (first==='*' && path.charAt(1)!=='.') return 'this.'+path.slice(1);
  return path;
}

// assumes normalized input; no *, normalized path, always a target...
function getPath(target, path) {
  var len = path.length, idx, next, key;
  
  idx = path.indexOf('*');
  if (idx>0 && path.charAt(idx-1)!=='.') {
    return getPath(getPath(target, path.slice(0, idx)), path.slice(idx+1));
  }

  idx = 0;
  while(target && idx<len) {
    next = path.indexOf('.', idx);
    if (next<0) next = len;
    key = path.slice(idx, next);
    target = key==='*' ? target : get(target, key);

    if (target && target.isDestroyed) { return undefined; }

    idx = next+1;
  }
  return target ;
}

var TUPLE_RET = [];
var IS_GLOBAL = /^([A-Z$]|([0-9][A-Z$])).*[\.\*]/;
var IS_GLOBAL_SET = /^([A-Z$]|([0-9][A-Z$])).*[\.\*]?/;
var HAS_THIS  = /^this[\.\*]/;
var FIRST_KEY = /^([^\.\*]+)/;

function firstKey(path) {
  return path.match(FIRST_KEY)[0];
}

// assumes path is already normalized
function normalizeTuple(target, path) {
  var hasThis  = HAS_THIS.test(path),
      isGlobal = !hasThis && IS_GLOBAL.test(path),
      key;

  if (!target || isGlobal) target = window;
  if (hasThis) path = path.slice(5);
  
  var idx = path.indexOf('*');
  if (idx>0 && path.charAt(idx-1)!=='.') {
    
    // should not do lookup on a prototype object because the object isn't
    // really live yet.
    if (target && meta(target,false).proto!==target) {
      target = getPath(target, path.slice(0, idx));
    } else {
      target = null;
    }
    path   = path.slice(idx+1);

  } else if (target === window) {
    key = firstKey(path);
    target = get(target, key);
    path   = path.slice(key.length+1);
  }

  // must return some kind of path to be valid else other things will break.
  if (!path || path.length===0) throw new Error('Invalid Path');
  
  TUPLE_RET[0] = target;
  TUPLE_RET[1] = path;
  return TUPLE_RET;
}

/**
  @private

  Normalizes a path to support older-style property paths beginning with . or

  @function
  @param {String} path path to normalize
  @returns {String} normalized path  
*/
Ember.normalizePath = normalizePath;

/**
  @private

  Normalizes a target/path pair to reflect that actual target/path that should
  be observed, etc.  This takes into account passing in global property 
  paths (i.e. a path beginning with a captial letter not defined on the 
  target) and * separators.
  
  @param {Object} target
    The current target.  May be null.
    
  @param {String} path
    A path on the target or a global property path.
    
  @returns {Array} a temporary array with the normalized target/path pair.
*/
Ember.normalizeTuple = function(target, path) {
  return normalizeTuple(target, normalizePath(path));
};

Ember.normalizeTuple.primitive = normalizeTuple;

Ember.getPath = function(root, path) {
  var hasThis, hasStar, isGlobal;
  
  if (!path && 'string'===typeof root) {
    path = root;
    root = null;
  }

  hasStar = path.indexOf('*') > -1;

  // If there is no root and path is a key name, return that
  // property from the global object.
  // E.g. getPath('Ember') -> Ember
  if (root === null && !hasStar && path.indexOf('.') < 0) { return get(window, path); }

  // detect complicated paths and normalize them
  path = normalizePath(path);
  hasThis  = HAS_THIS.test(path);
  isGlobal = !hasThis && IS_GLOBAL.test(path);
  if (!root || hasThis || isGlobal || hasStar) {
    var tuple = normalizeTuple(root, path);
    root = tuple[0];
    path = tuple[1];
  } 
  
  return getPath(root, path);
};

Ember.setPath = function(root, path, value, tolerant) {
  var keyName;
  
  if (arguments.length===2 && 'string' === typeof root) {
    value = path;
    path = root;
    root = null;
  }
  
  path = normalizePath(path);
  if (path.indexOf('*')>0) {
    var tuple = normalizeTuple(root, path);
    root = tuple[0];
    path = tuple[1];
  }

  if (path.indexOf('.') > 0) {
    keyName = path.slice(path.lastIndexOf('.')+1);
    path    = path.slice(0, path.length-(keyName.length+1));
    if (!HAS_THIS.test(path) && IS_GLOBAL_SET.test(path) && path.indexOf('.')<0) {
      root = window[path]; // special case only works during set...
    } else if (path !== 'this') {
      root = Ember.getPath(root, path);
    }

  } else {
    if (IS_GLOBAL_SET.test(path)) throw new Error('Invalid Path');
    keyName = path;
  }
  
  if (!keyName || keyName.length===0 || keyName==='*') {
    throw new Error('Invalid Path');
  }

  if (!root) {
    if (tolerant) { return; }
    else { throw new Error('Object in path '+path+' could not be found or was destroyed.'); }
  }

  return Ember.set(root, keyName, value);
};

/**
  Error-tolerant form of Ember.setPath. Will not blow up if any part of the
  chain is undefined, null, or destroyed.

  This is primarily used when syncing bindings, which may try to update after
  an object has been destroyed.
*/
Ember.trySetPath = function(root, path, value) {
  if (arguments.length===2 && 'string' === typeof root) {
    value = path;
    path = root;
    root = null;
  }

  return Ember.setPath(root, path, value, true);
};

/**
  Returns true if the provided path is global (e.g., "MyApp.fooController.bar")
  instead of local ("foo.bar.baz").

  @param {String} path
  @returns Boolean
*/
Ember.isGlobalPath = function(path) {
  return !HAS_THIS.test(path) && IS_GLOBAL.test(path);
};

})({});


(function(exports) {
// From: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/map
if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        res[i] = fun.call(thisp, t[i], i, t);
    }

    return res;
  };
}

// From: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp */)
  {
    "use strict";
 
    if (this === void 0 || this === null)
      throw new TypeError();
 
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisp, t[i], i, t);
    }
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (obj, fromIndex) {
    if (fromIndex == null) { fromIndex = 0; }
    else if (fromIndex < 0) { fromIndex = Math.max(0, this.length + fromIndex); }
    for (var i = fromIndex, j = this.length; i < j; i++) {
      if (this[i] === obj) { return i; }
    }
    return -1;
  };
}

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
var AFTER_OBSERVERS = ':change';
var BEFORE_OBSERVERS = ':before';
var guidFor = Ember.guidFor;
var normalizePath = Ember.normalizePath;

var suspended = 0;
var array_Slice = Array.prototype.slice;

var ObserverSet = function(iterateable) {
  this.set = {};
  if (iterateable) { this.array = []; }
};

ObserverSet.prototype.add = function(target, name) {
  var set = this.set, guid = Ember.guidFor(target), array;

  if (!set[guid]) { set[guid] = {}; }
  set[guid][name] = true;
  if (array = this.array) {
    array.push([target, name]);
  }
};

ObserverSet.prototype.contains = function(target, name) {
  var set = this.set, guid = Ember.guidFor(target), nameSet = set[guid];
  return nameSet && nameSet[name];
};

ObserverSet.prototype.empty = function() {
  this.set = {};
  this.array = [];
};

ObserverSet.prototype.forEach = function(fn) {
  var q = this.array;
  this.empty();
  q.forEach(function(item) {
    fn(item[0], item[1]);
  });
};

var queue = new ObserverSet(true), beforeObserverSet = new ObserverSet();

function notifyObservers(obj, eventName, forceNotification) {
  if (suspended && !forceNotification) {

    // if suspended add to the queue to send event later - but only send 
    // event once.
    if (!queue.contains(obj, eventName)) {
      queue.add(obj, eventName);
    }

  } else {
    Ember.sendEvent(obj, eventName);
  }
}

function flushObserverQueue() {
  beforeObserverSet.empty();

  if (!queue || queue.array.length===0) return ;
  queue.forEach(function(target, event){ Ember.sendEvent(target, event); });
}

Ember.beginPropertyChanges = function() {
  suspended++;
  return this;
};

Ember.endPropertyChanges = function() {
  suspended--;
  if (suspended<=0) flushObserverQueue();
};

/**
  Make a series of property changes together in an
  exception-safe way.

      Ember.changeProperties(function() {
        obj1.set('foo', mayBlowUpWhenSet);
        obj2.set('bar', baz);
      });
*/
Ember.changeProperties = function(cb){
  Ember.beginPropertyChanges();
  try {
    cb();
  } finally {
    Ember.endPropertyChanges();
  }
};

function changeEvent(keyName) {
  return keyName+AFTER_OBSERVERS;
}

function beforeEvent(keyName) {
  return keyName+BEFORE_OBSERVERS;
}

function changeKey(eventName) {
  return eventName.slice(0, -7);
}

function beforeKey(eventName) {
  return eventName.slice(0, -7);
}

function xformForArgs(args) {
  return function (target, method, params) {
    var obj = params[0], keyName = changeKey(params[1]), val;
    var copy_args = args.slice();
    if (method.length>2) val = Ember.getPath(obj, keyName);
    copy_args.unshift(obj, keyName, val);
    method.apply(target, copy_args);
  };
}

var xformChange = xformForArgs([]);

function xformBefore(target, method, params) {
  var obj = params[0], keyName = beforeKey(params[1]), val;
  if (method.length>2) val = Ember.getPath(obj, keyName);
  method.call(target, obj, keyName, val);
}

Ember.addObserver = function(obj, path, target, method) {
  path = normalizePath(path);

  var xform;
  if (arguments.length > 4) {
    var args = array_Slice.call(arguments, 4);
    xform = xformForArgs(args);
  } else {
    xform = xformChange;
  }
  Ember.addListener(obj, changeEvent(path), target, method, xform);
  Ember.watch(obj, path);
  return this;
};

/** @private */
Ember.observersFor = function(obj, path) {
  return Ember.listenersFor(obj, changeEvent(path));
};

Ember.removeObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  Ember.unwatch(obj, path);
  Ember.removeListener(obj, changeEvent(path), target, method);
  return this;
};

Ember.addBeforeObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  Ember.addListener(obj, beforeEvent(path), target, method, xformBefore);
  Ember.watch(obj, path);
  return this;
};

/** @private */
Ember.beforeObserversFor = function(obj, path) {
  return Ember.listenersFor(obj, beforeEvent(path));
};

Ember.removeBeforeObserver = function(obj, path, target, method) {
  path = normalizePath(path);
  Ember.unwatch(obj, path);
  Ember.removeListener(obj, beforeEvent(path), target, method);
  return this;
};

/** @private */
Ember.notifyObservers = function(obj, keyName) {
  notifyObservers(obj, changeEvent(keyName));
};

/** @private */
Ember.notifyBeforeObservers = function(obj, keyName) {
  var guid, set, forceNotification = false;

  if (suspended) {
    if (!beforeObserverSet.contains(obj, keyName)) {
      beforeObserverSet.add(obj, keyName);
      forceNotification = true;
    } else {
      return;
    }
  }

  notifyObservers(obj, beforeEvent(keyName), forceNotification);
};


})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
var USE_ACCESSORS = Ember.USE_ACCESSORS;
var GUID_KEY = Ember.GUID_KEY;
var META_KEY = Ember.META_KEY;
var meta = Ember.meta;
var o_create = Ember.platform.create;
var o_defineProperty = Ember.platform.defineProperty;
var SIMPLE_PROPERTY, WATCHED_PROPERTY;

// ..........................................................
// DESCRIPTOR
// 

var SIMPLE_DESC = {
  writable: true,
  configurable: true,
  enumerable: true,
  value: null
};

/**
  @private
  @constructor
  
  Objects of this type can implement an interface to responds requests to
  get and set.  The default implementation handles simple properties.
  
  You generally won't need to create or subclass this directly.
*/
var Dc = Ember.Descriptor = function() {};

var setup = Dc.setup = function(obj, keyName, value) {
  SIMPLE_DESC.value = value;
  o_defineProperty(obj, keyName, SIMPLE_DESC);
  SIMPLE_DESC.value = null;
};

var Dp = Ember.Descriptor.prototype;

/**
  Called whenever we want to set the property value.  Should set the value 
  and return the actual set value (which is usually the same but may be 
  different in the case of computed properties.)
  
  @param {Object} obj
    The object to set the value on.
    
  @param {String} keyName
    The key to set.
    
  @param {Object} value
    The new value
    
  @returns {Object} value actual set value
*/
Dp.set = function(obj, keyName, value) {
  obj[keyName] = value;
  return value;
};

/**
  Called whenever we want to get the property value.  Should retrieve the 
  current value.
  
  @param {Object} obj
    The object to get the value on.
    
  @param {String} keyName
    The key to retrieve
    
  @returns {Object} the current value
*/
Dp.get = function(obj, keyName) {
  return w_get(obj, keyName, obj);
};

/**
  This is called on the descriptor to set it up on the object.  The 
  descriptor is responsible for actually defining the property on the object
  here.
  
  The passed `value` is the transferValue returned from any previous 
  descriptor.
  
  @param {Object} obj
    The object to set the value on.
    
  @param {String} keyName
    The key to set.
    
  @param {Object} value
    The transfer value from any previous descriptor.
  
  @returns {void}
*/
Dp.setup = setup;

/**
  This is called on the descriptor just before another descriptor takes its
  place.  This method should at least return the 'transfer value' of the 
  property - which is the value you want to passed as the input to the new
  descriptor's setup() method.  
  
  It is not generally necessary to actually 'undefine' the property as a new
  property descriptor will redefine it immediately after this method returns.
  
  @param {Object} obj
    The object to set the value on.
    
  @param {String} keyName
    The key to set.
    
  @returns {Object} transfer value
*/
Dp.teardown = function(obj, keyName) {
  return obj[keyName];
};

Dp.val = function(obj, keyName) {
  return obj[keyName];
};

// ..........................................................
// SIMPLE AND WATCHED PROPERTIES
// 

// if accessors are disabled for the app then this will act as a guard when
// testing on browsers that do support accessors.  It will throw an exception
// if you do foo.bar instead of Ember.get(foo, 'bar')

// The exception to this is that any objects managed by Ember but not a descendant
// of Ember.Object will not throw an exception, instead failing silently. This
// prevent errors with other libraries that may attempt to access special
// properties on standard objects like Array. Usually this happens when copying
// an object by looping over all properties.

if (!USE_ACCESSORS) {
  Ember.Descriptor.MUST_USE_GETTER = function() {
    if (this instanceof Ember.Object) {
      ember_assert('Must use Ember.get() to access this property', false);
    }
  };

  Ember.Descriptor.MUST_USE_SETTER = function() {
    if (this instanceof Ember.Object) {
      if (this.isDestroyed) {
        ember_assert('You cannot set observed properties on destroyed objects', false);
      } else {
        ember_assert('Must use Ember.set() to access this property', false);
      }
    }
  };
}

var WATCHED_DESC = {
  configurable: true,
  enumerable:   true,
  set: Ember.Descriptor.MUST_USE_SETTER
};

function w_get(obj, keyName, values) {
  values = values || meta(obj, false).values;

  if (values) {
    var ret = values[keyName];
    if (ret !== undefined) { return ret; }
    if (obj.unknownProperty) { return obj.unknownProperty(keyName); }
  }

}

function w_set(obj, keyName, value) {
  var m = meta(obj), watching;
  
  watching = m.watching[keyName]>0 && value!==m.values[keyName];  
  if (watching) Ember.propertyWillChange(obj, keyName);
  m.values[keyName] = value;
  if (watching) Ember.propertyDidChange(obj, keyName);
  return value;
}

var WATCHED_GETTERS = {};
function mkWatchedGetter(keyName) {
  var ret = WATCHED_GETTERS[keyName];
  if (!ret) {
    ret = WATCHED_GETTERS[keyName] = function() { 
      return w_get(this, keyName); 
    };
  }
  return ret;
}

var WATCHED_SETTERS = {};
function mkWatchedSetter(keyName) {
  var ret = WATCHED_SETTERS[keyName];
  if (!ret) {
    ret = WATCHED_SETTERS[keyName] = function(value) {
      return w_set(this, keyName, value);
    };
  }
  return ret;
}

/**
  @private 
  
  Private version of simple property that invokes property change callbacks.
*/
WATCHED_PROPERTY = new Ember.Descriptor();

if (Ember.platform.hasPropertyAccessors) {
  WATCHED_PROPERTY.get = w_get ;
  WATCHED_PROPERTY.set = w_set ;

  if (USE_ACCESSORS) {
    WATCHED_PROPERTY.setup = function(obj, keyName, value) {
      WATCHED_DESC.get = mkWatchedGetter(keyName);
      WATCHED_DESC.set = mkWatchedSetter(keyName);
      o_defineProperty(obj, keyName, WATCHED_DESC);
      WATCHED_DESC.get = WATCHED_DESC.set = null;
      if (value !== undefined) meta(obj).values[keyName] = value;
    };

  } else {
    WATCHED_PROPERTY.setup = function(obj, keyName, value) {
      WATCHED_DESC.get = mkWatchedGetter(keyName);
      o_defineProperty(obj, keyName, WATCHED_DESC);
      WATCHED_DESC.get = null;
      if (value !== undefined) meta(obj).values[keyName] = value;
    };
  }

  WATCHED_PROPERTY.teardown = function(obj, keyName) {
    var ret = meta(obj).values[keyName];
    delete meta(obj).values[keyName];
    return ret;
  };

// NOTE: if platform does not have property accessors then we just have to 
// set values and hope for the best.  You just won't get any warnings...
} else {
  
  WATCHED_PROPERTY.set = function(obj, keyName, value) {
    var m = meta(obj), watching;

    watching = m.watching[keyName]>0 && value!==obj[keyName];  
    if (watching) Ember.propertyWillChange(obj, keyName);
    obj[keyName] = value;
    if (watching) Ember.propertyDidChange(obj, keyName);
    return value;
  };
  
}

/**
  The default descriptor for simple properties.  Pass as the third argument
  to Ember.defineProperty() along with a value to set a simple value.
  
  @static
  @default Ember.Descriptor
*/
Ember.SIMPLE_PROPERTY = new Ember.Descriptor();
SIMPLE_PROPERTY = Ember.SIMPLE_PROPERTY;

SIMPLE_PROPERTY.unwatched = WATCHED_PROPERTY.unwatched = SIMPLE_PROPERTY;
SIMPLE_PROPERTY.watched   = WATCHED_PROPERTY.watched   = WATCHED_PROPERTY;


// ..........................................................
// DEFINING PROPERTIES API
// 

function hasDesc(descs, keyName) {
  if (keyName === 'toString') return 'function' !== typeof descs.toString;
  else return !!descs[keyName];
}

/**
  @private

  NOTE: This is a low-level method used by other parts of the API.  You almost
  never want to call this method directly.  Instead you should use Ember.mixin()
  to define new properties.
  
  Defines a property on an object.  This method works much like the ES5 
  Object.defineProperty() method except that it can also accept computed 
  properties and other special descriptors. 

  Normally this method takes only three parameters.  However if you pass an
  instance of Ember.Descriptor as the third param then you can pass an optional
  value as the fourth parameter.  This is often more efficient than creating
  new descriptor hashes for each property.
  
  ## Examples

      // ES5 compatible mode
      Ember.defineProperty(contact, 'firstName', {
        writable: true,
        configurable: false,
        enumerable: true,
        value: 'Charles'
      });
      
      // define a simple property
      Ember.defineProperty(contact, 'lastName', Ember.SIMPLE_PROPERTY, 'Jolley');
      
      // define a computed property
      Ember.defineProperty(contact, 'fullName', Ember.computed(function() {
        return this.firstName+' '+this.lastName;
      }).property('firstName', 'lastName').cacheable());
*/
Ember.defineProperty = function(obj, keyName, desc, val) {
  var m = meta(obj, false), descs = m.descs, watching = m.watching[keyName]>0;

  if (val === undefined) {
    val = hasDesc(descs, keyName) ? descs[keyName].teardown(obj, keyName) : obj[keyName];
  } else if (hasDesc(descs, keyName)) {
    descs[keyName].teardown(obj, keyName);
  }

  if (!desc) desc = SIMPLE_PROPERTY;
  
  if (desc instanceof Ember.Descriptor) {
    m = meta(obj, true);
    descs = m.descs;
    
    desc = (watching ? desc.watched : desc.unwatched) || desc; 
    descs[keyName] = desc;
    desc.setup(obj, keyName, val, watching);

  // compatibility with ES5
  } else {
    if (descs[keyName]) meta(obj).descs[keyName] = null;
    o_defineProperty(obj, keyName, desc);
  }
  
  return this;
};

/**
  Creates a new object using the passed object as its prototype.  On browsers
  that support it, this uses the built in Object.create method.  Else one is
  simulated for you.
  
  This method is a better choice thant Object.create() because it will make 
  sure that any observers, event listeners, and computed properties are 
  inherited from the parent as well.
  
  @param {Object} obj
    The object you want to have as the prototype.
    
  @returns {Object} the newly created object
*/
Ember.create = function(obj, props) {
  var ret = o_create(obj, props);
  if (GUID_KEY in ret) Ember.generateGuid(ret, 'ember');
  if (META_KEY in ret) Ember.rewatch(ret); // setup watch chains if needed.
  return ret;
};

/**
  @private

  Creates a new object using the passed object as its prototype.  This method
  acts like `Ember.create()` in every way except that bindings, observers, and
  computed properties will be activated on the object.  
  
  The purpose of this method is to build an object for use in a prototype
  chain. (i.e. to be set as the `prototype` property on a constructor 
  function).  Prototype objects need to inherit bindings, observers and
  other configuration so they pass it on to their children.  However since
  they are never 'live' objects themselves, they should not fire or make
  other changes when various properties around them change.
  
  You should use this method anytime you want to create a new object for use
  in a prototype chain.

  @param {Object} obj
    The base object.

  @param {Object} hash
    Optional hash of properties to define on the object.

  @returns {Object} new object
*/
Ember.createPrototype = function(obj, props) {
  var ret = o_create(obj, props);
  meta(ret, true).proto = ret;
  if (GUID_KEY in ret) Ember.generateGuid(ret, 'ember');
  if (META_KEY in ret) Ember.rewatch(ret); // setup watch chains if needed.
  return ret;
};
  

/**
  Tears down the meta on an object so that it can be garbage collected.
  Multiple calls will have no effect.
  
  @param {Object} obj  the object to destroy
  @returns {void}
*/
Ember.destroy = function(obj) {
  if (obj[META_KEY]) obj[META_KEY] = null; 
};


})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
var guidFor = Ember.guidFor;
var meta    = Ember.meta;
var get = Ember.get, set = Ember.set;
var normalizeTuple = Ember.normalizeTuple.primitive;
var normalizePath  = Ember.normalizePath;
var SIMPLE_PROPERTY = Ember.SIMPLE_PROPERTY;
var GUID_KEY = Ember.GUID_KEY;
var notifyObservers = Ember.notifyObservers;

var FIRST_KEY = /^([^\.\*]+)/;
var IS_PATH = /[\.\*]/;

function firstKey(path) {
  return path.match(FIRST_KEY)[0];
}

// returns true if the passed path is just a keyName
function isKeyName(path) {
  return path==='*' || !IS_PATH.test(path);
}

// ..........................................................
// DEPENDENT KEYS
// 

var DEP_SKIP = { __emberproto__: true }; // skip some keys and toString
function iterDeps(methodName, obj, depKey, seen) {
  
  var guid = guidFor(obj);
  if (!seen[guid]) seen[guid] = {};
  if (seen[guid][depKey]) return ;
  seen[guid][depKey] = true;
  
  var deps = meta(obj, false).deps, method = Ember[methodName];
  deps = deps && deps[depKey];
  if (deps) {
    for(var key in deps) {
      if (DEP_SKIP[key]) continue;
      method(obj, key);
    }
  }
}


var WILL_SEEN, DID_SEEN;

// called whenever a property is about to change to clear the cache of any dependent keys (and notify those properties of changes, etc...)
function dependentKeysWillChange(obj, depKey) {
  var seen = WILL_SEEN, top = !seen;
  if (top) seen = WILL_SEEN = {};
  iterDeps('propertyWillChange', obj, depKey, seen);
  if (top) WILL_SEEN = null;
}

// called whenever a property has just changed to update dependent keys
function dependentKeysDidChange(obj, depKey) {
  var seen = DID_SEEN, top = !seen;
  if (top) seen = DID_SEEN = {};
  iterDeps('propertyDidChange', obj, depKey, seen);
  if (top) DID_SEEN = null;
}

// ..........................................................
// CHAIN
// 

function addChainWatcher(obj, keyName, node) {
  if (!obj || ('object' !== typeof obj)) return; // nothing to do
  var m = meta(obj);
  var nodes = m.chainWatchers;
  if (!nodes || nodes.__emberproto__ !== obj) {
    nodes = m.chainWatchers = { __emberproto__: obj };
  }

  if (!nodes[keyName]) nodes[keyName] = {};
  nodes[keyName][guidFor(node)] = node;
  Ember.watch(obj, keyName);
}

function removeChainWatcher(obj, keyName, node) {
  if (!obj || ('object' !== typeof obj)) return; // nothing to do
  var m = meta(obj, false);
  var nodes = m.chainWatchers;
  if (!nodes || nodes.__emberproto__ !== obj) return; //nothing to do
  if (nodes[keyName]) delete nodes[keyName][guidFor(node)];
  Ember.unwatch(obj, keyName);
}

var pendingQueue = [];

// attempts to add the pendingQueue chains again.  If some of them end up
// back in the queue and reschedule is true, schedules a timeout to try 
// again.
function flushPendingChains(reschedule) {
  if (pendingQueue.length===0) return ; // nothing to do
  
  var queue = pendingQueue;
  pendingQueue = [];
  
  queue.forEach(function(q) { q[0].add(q[1]); });
  if (reschedule!==false && pendingQueue.length>0) {
    setTimeout(flushPendingChains, 1);
  }
}

function isProto(pvalue) {
  return meta(pvalue, false).proto === pvalue;
}

// A ChainNode watches a single key on an object.  If you provide a starting
// value for the key then the node won't actually watch it.  For a root node 
// pass null for parent and key and object for value.
var ChainNode = function(parent, key, value, separator) {
  var obj;
  this._parent = parent;
  this._key    = key;

  // _watching is true when calling get(this._parent, this._key) will
  // return the value of this node.
  //
  // It is false for the root of a chain (because we have no parent)
  // and for global paths (because the parent node is the object with
  // the observer on it)
  this._watching = value===undefined;

  this._value  = value;
  this._separator = separator || '.';
  this._paths = {};
  if (this._watching) {
    this._object = parent.value();
    if (this._object) addChainWatcher(this._object, this._key, this);
  }

  // Special-case: the EachProxy relies on immediate evaluation to
  // establish its observers.
  //
  // TODO: Replace this with an efficient callback that the EachProxy
  // can implement.
  if (this._parent && this._parent._key === '@each') {
    this.value();
  }
};


var Wp = ChainNode.prototype;

Wp.value = function() {
  if (this._value === undefined && this._watching){
    var obj = this._parent.value();
    this._value = (obj && !isProto(obj)) ? get(obj, this._key) : undefined;
  }
  return this._value;
};

Wp.destroy = function() {
  if (this._watching) {
    var obj = this._object;
    if (obj) removeChainWatcher(obj, this._key, this);
    this._watching = false; // so future calls do nothing
  }
};

// copies a top level object only
Wp.copy = function(obj) {
  var ret = new ChainNode(null, null, obj, this._separator);
  var paths = this._paths, path;
  for(path in paths) {
    if (!(paths[path] > 0)) continue; // this check will also catch non-number vals.
    ret.add(path);
  }
  return ret;
};

// called on the root node of a chain to setup watchers on the specified 
// path.
Wp.add = function(path) {
  var obj, tuple, key, src, separator, paths;

  paths = this._paths;
  paths[path] = (paths[path] || 0) + 1 ;

  obj = this.value();
  tuple = normalizeTuple(obj, path);

  // the path was a local path
  if (tuple[0] && (tuple[0] === obj)) {
    path = tuple[1];
    key  = firstKey(path);
    path = path.slice(key.length+1);

  // global path, but object does not exist yet.
  // put into a queue and try to connect later.
  } else if (!tuple[0]) {
    pendingQueue.push([this, path]);
    return;

  // global path, and object already exists
  } else {
    src  = tuple[0];
    key  = path.slice(0, 0-(tuple[1].length+1));
    separator = path.slice(key.length, key.length+1);
    path = tuple[1];
  }

  this.chain(key, path, src, separator);
};

// called on the root node of a chain to teardown watcher on the specified
// path
Wp.remove = function(path) {
  var obj, tuple, key, src, paths;

  paths = this._paths;
  if (paths[path] > 0) paths[path]--;

  obj = this.value();
  tuple = normalizeTuple(obj, path);
  if (tuple[0] === obj) {
    path = tuple[1];
    key  = firstKey(path);
    path = path.slice(key.length+1);

  } else {
    src  = tuple[0];
    key  = path.slice(0, 0-(tuple[1].length+1));
    path = tuple[1];
  }

  this.unchain(key, path);
};

Wp.count = 0;

Wp.chain = function(key, path, src, separator) {
  var chains = this._chains, node;
  if (!chains) chains = this._chains = {};

  node = chains[key];
  if (!node) node = chains[key] = new ChainNode(this, key, src, separator);
  node.count++; // count chains...

  // chain rest of path if there is one
  if (path && path.length>0) {
    key = firstKey(path);
    path = path.slice(key.length+1);
    node.chain(key, path); // NOTE: no src means it will observe changes...
  }
};

Wp.unchain = function(key, path) {
  var chains = this._chains, node = chains[key];

  // unchain rest of path first...
  if (path && path.length>1) {
    key  = firstKey(path);
    path = path.slice(key.length+1);
    node.unchain(key, path);
  }

  // delete node if needed.
  node.count--;
  if (node.count<=0) {
    delete chains[node._key];
    node.destroy();
  }
  
};

Wp.willChange = function() {
  var chains = this._chains;
  if (chains) {
    for(var key in chains) {
      if (!chains.hasOwnProperty(key)) continue;
      chains[key].willChange();
    }
  }
  
  if (this._parent) this._parent.chainWillChange(this, this._key, 1);
};

Wp.chainWillChange = function(chain, path, depth) {
  if (this._key) path = this._key+this._separator+path;

  if (this._parent) {
    this._parent.chainWillChange(this, path, depth+1);
  } else {
    if (depth>1) Ember.propertyWillChange(this.value(), path);
    path = 'this.'+path;
    if (this._paths[path]>0) Ember.propertyWillChange(this.value(), path);
  }
};

Wp.chainDidChange = function(chain, path, depth) {
  if (this._key) path = this._key+this._separator+path;
  if (this._parent) {
    this._parent.chainDidChange(this, path, depth+1);
  } else {
    if (depth>1) Ember.propertyDidChange(this.value(), path);
    path = 'this.'+path;
    if (this._paths[path]>0) Ember.propertyDidChange(this.value(), path);
  }
};

Wp.didChange = function() {
  // invalidate my own value first.
  if (this._watching) {
    var obj = this._parent.value();
    if (obj !== this._object) {
      removeChainWatcher(this._object, this._key, this);
      this._object = obj;
      addChainWatcher(obj, this._key, this);
    }
    this._value  = undefined;

    // Special-case: the EachProxy relies on immediate evaluation to
    // establish its observers.
    if (this._parent && this._parent._key === '@each')
      this.value();
  }
  
  // then notify chains...
  var chains = this._chains;
  if (chains) {
    for(var key in chains) {
      if (!chains.hasOwnProperty(key)) continue;
      chains[key].didChange();
    }
  }

  // and finally tell parent about my path changing...
  if (this._parent) this._parent.chainDidChange(this, this._key, 1);
};

// get the chains for the current object.  If the current object has 
// chains inherited from the proto they will be cloned and reconfigured for
// the current object.
function chainsFor(obj) {
  var m   = meta(obj), ret = m.chains;
  if (!ret) {
    ret = m.chains = new ChainNode(null, null, obj);
  } else if (ret.value() !== obj) {
    ret = m.chains = ret.copy(obj);
  }
  return ret ;
}



function notifyChains(obj, keyName, methodName) {
  var m = meta(obj, false);
  var nodes = m.chainWatchers;
  if (!nodes || nodes.__emberproto__ !== obj) return; // nothing to do

  nodes = nodes[keyName];
  if (!nodes) return;
  
  for(var key in nodes) {
    if (!nodes.hasOwnProperty(key)) continue;
    nodes[key][methodName](obj, keyName);
  }
}

function chainsWillChange(obj, keyName) {
  notifyChains(obj, keyName, 'willChange');
}

function chainsDidChange(obj, keyName) {
  notifyChains(obj, keyName, 'didChange');
}

// ..........................................................
// WATCH
// 

var WATCHED_PROPERTY = Ember.SIMPLE_PROPERTY.watched;

/**
  @private

  Starts watching a property on an object.  Whenever the property changes,
  invokes Ember.propertyWillChange and Ember.propertyDidChange.  This is the 
  primitive used by observers and dependent keys; usually you will never call
  this method directly but instead use higher level methods like
  Ember.addObserver().
*/
Ember.watch = function(obj, keyName) {

  // can't watch length on Array - it is special...
  if (keyName === 'length' && Ember.typeOf(obj)==='array') return this;
  
  var m = meta(obj), watching = m.watching, desc;
  keyName = normalizePath(keyName);

  // activate watching first time
  if (!watching[keyName]) {
    watching[keyName] = 1;
    if (isKeyName(keyName)) {
      desc = m.descs[keyName];
      desc = desc ? desc.watched : WATCHED_PROPERTY;
      if (desc) Ember.defineProperty(obj, keyName, desc);
    } else {
      chainsFor(obj).add(keyName);
    }

  }  else {
    watching[keyName] = (watching[keyName]||0)+1;
  }
  return this;
};

Ember.isWatching = function(obj, keyName) {
  return !!meta(obj).watching[keyName];
};

Ember.watch.flushPending = flushPendingChains;

/** @private */
Ember.unwatch = function(obj, keyName) {
  // can't watch length on Array - it is special...
  if (keyName === 'length' && Ember.typeOf(obj)==='array') return this;

  var watching = meta(obj).watching, desc, descs;
  keyName = normalizePath(keyName);
  if (watching[keyName] === 1) {
    watching[keyName] = 0;
    if (isKeyName(keyName)) {
      desc = meta(obj).descs[keyName];
      desc = desc ? desc.unwatched : SIMPLE_PROPERTY;
      if (desc) Ember.defineProperty(obj, keyName, desc);
    } else {
      chainsFor(obj).remove(keyName);
    }

  } else if (watching[keyName]>1) {
    watching[keyName]--;
  }
  
  return this;
};

/**
  @private

  Call on an object when you first beget it from another object.  This will
  setup any chained watchers on the object instance as needed.  This method is
  safe to call multiple times.
*/
Ember.rewatch = function(obj) {
  var m = meta(obj, false), chains = m.chains, bindings = m.bindings, key, b;

  // make sure the object has its own guid.
  if (GUID_KEY in obj && !obj.hasOwnProperty(GUID_KEY)) {
    Ember.generateGuid(obj, 'ember');
  }  

  // make sure any chained watchers update.
  if (chains && chains.value() !== obj) chainsFor(obj);

  // if the object has bindings then sync them..
  if (bindings && m.proto!==obj) {
    for (key in bindings) {
      b = !DEP_SKIP[key] && obj[key];
      if (b && b instanceof Ember.Binding) b.fromDidChange(obj);
    }
  }

  return this;
};

// ..........................................................
// PROPERTY CHANGES
// 

/**
  This function is called just before an object property is about to change.
  It will notify any before observers and prepare caches among other things.
  
  Normally you will not need to call this method directly but if for some
  reason you can't directly watch a property you can invoke this method 
  manually along with `Ember.propertyDidChange()` which you should call just 
  after the property value changes.
  
  @param {Object} obj
    The object with the property that will change
    
  @param {String} keyName
    The property key (or path) that will change.
    
  @returns {void}
*/
Ember.propertyWillChange = function(obj, keyName) {
  var m = meta(obj, false), proto = m.proto, desc = m.descs[keyName];
  if (proto === obj) return ;
  if (desc && desc.willChange) desc.willChange(obj, keyName);
  dependentKeysWillChange(obj, keyName);
  chainsWillChange(obj, keyName);
  Ember.notifyBeforeObservers(obj, keyName);
};

/**
  This function is called just after an object property has changed.
  It will notify any observers and clear caches among other things.
  
  Normally you will not need to call this method directly but if for some
  reason you can't directly watch a property you can invoke this method 
  manually along with `Ember.propertyWilLChange()` which you should call just 
  before the property value changes.
  
  @param {Object} obj
    The object with the property that will change
    
  @param {String} keyName
    The property key (or path) that will change.
    
  @returns {void}
*/
Ember.propertyDidChange = function(obj, keyName) {
  var m = meta(obj, false), proto = m.proto, desc = m.descs[keyName];
  if (proto === obj) return ;
  if (desc && desc.didChange) desc.didChange(obj, keyName);
  dependentKeysDidChange(obj, keyName);
  chainsDidChange(obj, keyName);
  Ember.notifyObservers(obj, keyName);
};

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
// Ember.Logger
// Ember.watch.flushPending
// Ember.beginPropertyChanges, Ember.endPropertyChanges
// Ember.guidFor

// ..........................................................
// HELPERS
//

var slice = Array.prototype.slice;

// invokes passed params - normalizing so you can pass target/func,
// target/string or just func
function invoke(target, method, args, ignore) {

  if (method===undefined) {
    method = target;
    target = undefined;
  }

  if ('string'===typeof method) method = target[method];
  if (args && ignore>0) {
    args = args.length>ignore ? slice.call(args, ignore) : null;
  }
  // IE8's Function.prototype.apply doesn't accept undefined/null arguments.
  return method.apply(target || this, args || []);
}


// ..........................................................
// RUNLOOP
//

var timerMark; // used by timers...

var K = function() {};
var RunLoop = function(prev) {
  var self;

  if (this instanceof RunLoop) {
    self = this;
  } else {
    self = new K();
  }

  self._prev = prev || null;
  self.onceTimers = {};

  return self;
};

K.prototype = RunLoop.prototype;

RunLoop.prototype = {
  end: function() {
    this.flush();
  },

  prev: function() {
    return this._prev;
  },

  // ..........................................................
  // Delayed Actions
  //

  schedule: function(queueName, target, method) {
    var queues = this._queues, queue;
    if (!queues) queues = this._queues = {};
    queue = queues[queueName];
    if (!queue) queue = queues[queueName] = [];

    var args = arguments.length>3 ? slice.call(arguments, 3) : null;
    queue.push({ target: target, method: method, args: args });
    return this;
  },

  flush: function(queueName) {
    var queues = this._queues, queueNames, idx, len, queue, log;

    if (!queues) return this; // nothing to do

    function iter(item) {
      invoke(item.target, item.method, item.args);
    }

    Ember.watch.flushPending(); // make sure all chained watchers are setup

    if (queueName) {
      while (this._queues && (queue = this._queues[queueName])) {
        this._queues[queueName] = null;

        log = Ember.LOG_BINDINGS && queueName==='sync';
        if (log) Ember.Logger.log('Begin: Flush Sync Queue');

        // the sync phase is to allow property changes to propogate.  don't
        // invoke observers until that is finished.
        if (queueName === 'sync') Ember.beginPropertyChanges();
        queue.forEach(iter);
        if (queueName === 'sync') Ember.endPropertyChanges();

        if (log) Ember.Logger.log('End: Flush Sync Queue');

      }

    } else {
      queueNames = Ember.run.queues;
      len = queueNames.length;
      do {
        this._queues = null;
        for(idx=0;idx<len;idx++) {
          queueName = queueNames[idx];
          queue = queues[queueName];

          log = Ember.LOG_BINDINGS && queueName==='sync';
          if (log) Ember.Logger.log('Begin: Flush Sync Queue');

          if (queueName === 'sync') Ember.beginPropertyChanges();
          if (queue) queue.forEach(iter);
          if (queueName === 'sync') Ember.endPropertyChanges();

          if (log) Ember.Logger.log('End: Flush Sync Queue');

        }

      } while (queues = this._queues); // go until queues stay clean
    }

    timerMark = null;

    return this;
  }

};

Ember.RunLoop = RunLoop;

// ..........................................................
// Ember.run - this is ideally the only public API the dev sees
//

var run;

/**
  Runs the passed target and method inside of a runloop, ensuring any
  deferred actions including bindings and views updates are flushed at the
  end.

  Normally you should not need to invoke this method yourself.  However if
  you are implementing raw event handlers when interfacing with other
  libraries or plugins, you should probably wrap all of your code inside this
  call.

  @function
  @param {Object} target
    (Optional) target of method to call

  @param {Function|String} method
    Method to invoke.  May be a function or a string.  If you pass a string
    then it will be looked up on the passed target.

  @param {Object...} args
    Any additional arguments you wish to pass to the method.

  @returns {Object} return value from invoking the passed function.
*/
Ember.run = run = function(target, method) {

  var ret, loop;
  run.begin();
  if (target || method) ret = invoke(target, method, arguments, 2);
  run.end();
  return ret;
};

/**
  Begins a new RunLoop.  Any deferred actions invoked after the begin will
  be buffered until you invoke a matching call to Ember.run.end().  This is
  an lower-level way to use a RunLoop instead of using Ember.run().

  @returns {void}
*/
Ember.run.begin = function() {
  run.currentRunLoop = new RunLoop(run.currentRunLoop);
};

/**
  Ends a RunLoop.  This must be called sometime after you call Ember.run.begin()
  to flush any deferred actions.  This is a lower-level way to use a RunLoop
  instead of using Ember.run().

  @returns {void}
*/
Ember.run.end = function() {
  ember_assert('must have a current run loop', run.currentRunLoop);
  try {
    run.currentRunLoop.end();
  }
  finally {
    run.currentRunLoop = run.currentRunLoop.prev();
  }
};

/**
  Array of named queues.  This array determines the order in which queues
  are flushed at the end of the RunLoop.  You can define your own queues by
  simply adding the queue name to this array.  Normally you should not need
  to inspect or modify this property.

  @property {String}
*/
Ember.run.queues = ['sync', 'actions', 'destroy', 'timers'];

/**
  Adds the passed target/method and any optional arguments to the named
  queue to be executed at the end of the RunLoop.  If you have not already
  started a RunLoop when calling this method one will be started for you
  automatically.

  At the end of a RunLoop, any methods scheduled in this way will be invoked.
  Methods will be invoked in an order matching the named queues defined in
  the run.queues property.

  @param {String} queue
    The name of the queue to schedule against.  Default queues are 'sync' and
    'actions'

  @param {Object} target
    (Optional) target object to use as the context when invoking a method.

  @param {String|Function} method
    The method to invoke.  If you pass a string it will be resolved on the
    target object at the time the scheduled item is invoked allowing you to
    change the target function.

  @param {Object} arguments...
    Optional arguments to be passed to the queued method.

  @returns {void}
*/
Ember.run.schedule = function(queue, target, method) {
  var loop = run.autorun();
  loop.schedule.apply(loop, arguments);
};

var autorunTimer;

function autorun() {
  autorunTimer = null;
  if (run.currentRunLoop) run.end();
}

/**
  Begins a new RunLoop if necessary and schedules a timer to flush the
  RunLoop at a later time.  This method is used by parts of Ember to
  ensure the RunLoop always finishes.  You normally do not need to call this
  method directly.  Instead use Ember.run().

  @returns {Ember.RunLoop} the new current RunLoop
*/
Ember.run.autorun = function() {

  if (!run.currentRunLoop) {
    run.begin();

    // TODO: throw during tests
    if (Ember.testing) {
      run.end();
    } else if (!autorunTimer) {
      autorunTimer = setTimeout(autorun, 1);
    }
  }

  return run.currentRunLoop;
};

/**
  Immediately flushes any events scheduled in the 'sync' queue.  Bindings
  use this queue so this method is a useful way to immediately force all
  bindings in the application to sync.

  You should call this method anytime you need any changed state to propogate
  throughout the app immediately without repainting the UI.

  @returns {void}
*/
Ember.run.sync = function() {
  run.autorun();
  run.currentRunLoop.flush('sync');
};

// ..........................................................
// TIMERS
//

var timers = {}; // active timers...

var laterScheduled = false;
function invokeLaterTimers() {
  var now = (+ new Date()), earliest = -1;
  for(var key in timers) {
    if (!timers.hasOwnProperty(key)) continue;
    var timer = timers[key];
    if (timer && timer.expires) {
      if (now >= timer.expires) {
        delete timers[key];
        invoke(timer.target, timer.method, timer.args, 2);
      } else {
        if (earliest<0 || (timer.expires < earliest)) earliest=timer.expires;
      }
    }
  }

  // schedule next timeout to fire...
  if (earliest>0) setTimeout(invokeLaterTimers, earliest-(+ new Date()));
}

/**
  Invokes the passed target/method and optional arguments after a specified
  period if time.  The last parameter of this method must always be a number
  of milliseconds.

  You should use this method whenever you need to run some action after a
  period of time inside of using setTimeout().  This method will ensure that
  items that expire during the same script execution cycle all execute
  together, which is often more efficient than using a real setTimeout.

  @param {Object} target
    (optional) target of method to invoke

  @param {Function|String} method
    The method to invoke.  If you pass a string it will be resolved on the
    target at the time the method is invoked.

  @param {Object...} args
    Optional arguments to pass to the timeout.

  @param {Number} wait
    Number of milliseconds to wait.

  @returns {Timer} an object you can use to cancel a timer at a later time.
*/
Ember.run.later = function(target, method) {
  var args, expires, timer, guid, wait;

  // setTimeout compatibility...
  if (arguments.length===2 && 'function' === typeof target) {
    wait   = method;
    method = target;
    target = undefined;
    args   = [target, method];

  } else {
    args = slice.call(arguments);
    wait = args.pop();
  }

  expires = (+ new Date())+wait;
  timer   = { target: target, method: method, expires: expires, args: args };
  guid    = Ember.guidFor(timer);
  timers[guid] = timer;
  run.once(timers, invokeLaterTimers);
  return guid;
};

function invokeOnceTimer(guid, onceTimers) {
  if (onceTimers[this.tguid]) delete onceTimers[this.tguid][this.mguid];
  if (timers[guid]) invoke(this.target, this.method, this.args, 2);
  delete timers[guid];
}

/**
  Schedules an item to run one time during the current RunLoop.  Calling
  this method with the same target/method combination will have no effect.

  Note that although you can pass optional arguments these will not be
  considered when looking for duplicates.  New arguments will replace previous
  calls.

  @param {Object} target
    (optional) target of method to invoke

  @param {Function|String} method
    The method to invoke.  If you pass a string it will be resolved on the
    target at the time the method is invoked.

  @param {Object...} args
    Optional arguments to pass to the timeout.


  @returns {Object} timer
*/
Ember.run.once = function(target, method) {
  var tguid = Ember.guidFor(target), mguid = Ember.guidFor(method), guid, timer;

  var onceTimers = run.autorun().onceTimers;
  guid = onceTimers[tguid] && onceTimers[tguid][mguid];
  if (guid && timers[guid]) {
    timers[guid].args = slice.call(arguments); // replace args

  } else {
    timer = {
      target: target,
      method: method,
      args:   slice.call(arguments),
      tguid:  tguid,
      mguid:  mguid
    };

    guid  = Ember.guidFor(timer);
    timers[guid] = timer;
    if (!onceTimers[tguid]) onceTimers[tguid] = {};
    onceTimers[tguid][mguid] = guid; // so it isn't scheduled more than once

    run.schedule('actions', timer, invokeOnceTimer, guid, onceTimers);
  }

  return guid;
};

var scheduledNext = false;
function invokeNextTimers() {
  scheduledNext = null;
  for(var key in timers) {
    if (!timers.hasOwnProperty(key)) continue;
    var timer = timers[key];
    if (timer.next) {
      delete timers[key];
      invoke(timer.target, timer.method, timer.args, 2);
    }
  }
}

/**
  Schedules an item to run after control has been returned to the system.
  This is often equivalent to calling setTimeout(function...,1).

  @param {Object} target
    (optional) target of method to invoke

  @param {Function|String} method
    The method to invoke.  If you pass a string it will be resolved on the
    target at the time the method is invoked.

  @param {Object...} args
    Optional arguments to pass to the timeout.

  @returns {Object} timer
*/
Ember.run.next = function(target, method) {
  var timer, guid;

  timer = {
    target: target,
    method: method,
    args: slice.call(arguments),
    next: true
  };

  guid = Ember.guidFor(timer);
  timers[guid] = timer;

  if (!scheduledNext) scheduledNext = setTimeout(invokeNextTimers, 1);
  return guid;
};

/**
  Cancels a scheduled item.  Must be a value returned by `Ember.run.later()`,
  `Ember.run.once()`, or `Ember.run.next()`.

  @param {Object} timer
    Timer object to cancel

  @returns {void}
*/
Ember.run.cancel = function(timer) {
  delete timers[timer];
};


// ..........................................................
// DEPRECATED API
//

/**
  @deprecated
  @method

  Use `#js:Ember.run.begin()` instead
*/
Ember.RunLoop.begin = Ember.run.begin;

/**
  @deprecated
  @method

  Use `#js:Ember.run.end()` instead
*/
Ember.RunLoop.end = Ember.run.end;



})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
// Ember.Logger
// get, getPath, setPath, trySetPath
// guidFor, isArray, meta
// addObserver, removeObserver
// Ember.run.schedule

// ..........................................................
// CONSTANTS
//


/**
  @static

  Debug parameter you can turn on. This will log all bindings that fire to
  the console. This should be disabled in production code. Note that you
  can also enable this from the console or temporarily.

  @type Boolean
  @default NO
*/
Ember.LOG_BINDINGS = false || !!Ember.ENV.LOG_BINDINGS;

/**
  @static

  Performance paramter. This will benchmark the time spent firing each
  binding.

  @type Boolean
*/
Ember.BENCHMARK_BINDING_NOTIFICATIONS = !!Ember.ENV.BENCHMARK_BINDING_NOTIFICATIONS;

/**
  @static

  Performance parameter. This will benchmark the time spend configuring each
  binding.

  @type Boolean
*/
Ember.BENCHMARK_BINDING_SETUP = !!Ember.ENV.BENCHMARK_BINDING_SETUP;


/**
  @static

  Default placeholder for multiple values in bindings.

  @type String
  @default '@@MULT@@'
*/
Ember.MULTIPLE_PLACEHOLDER = '@@MULT@@';

/**
  @static

  Default placeholder for empty values in bindings.  Used by notEmpty()
  helper unless you specify an alternative.

  @type String
  @default '@@EMPTY@@'
*/
Ember.EMPTY_PLACEHOLDER = '@@EMPTY@@';

// ..........................................................
// TYPE COERCION HELPERS
//

// Coerces a non-array value into an array.
function MULTIPLE(val) {
  if (val instanceof Array) return val;
  if (val === undefined || val === null) return [];
  return [val];
}

// Treats a single-element array as the element. Otherwise
// returns a placeholder.
function SINGLE(val, placeholder) {
  if (val instanceof Array) {
    if (val.length>1) return placeholder;
    else return val[0];
  }
  return val;
}

// Coerces the binding value into a Boolean.

var BOOL = {
  to: function (val) {
    return !!val;
  }
};

// Returns the Boolean inverse of the value.
var NOT = {
  to: function NOT(val) {
    return !val;
  }
};

var get     = Ember.get,
    getPath = Ember.getPath,
    setPath = Ember.setPath,
    guidFor = Ember.guidFor;

// Applies a binding's transformations against a value.
function getTransformedValue(binding, val, obj, dir) {

  // First run a type transform, if it exists, that changes the fundamental
  // type of the value. For example, some transforms convert an array to a
  // single object.

  var typeTransform = binding._typeTransform;
  if (typeTransform) { val = typeTransform(val, binding._placeholder); }

  // handle transforms
  var transforms = binding._transforms,
      len        = transforms ? transforms.length : 0,
      idx;

  for(idx=0;idx<len;idx++) {
    var transform = transforms[idx][dir];
    if (transform) { val = transform.call(this, val, obj); }
  }
  return val;
}

function empty(val) {
  return val===undefined || val===null || val==='' || (Ember.isArray(val) && get(val, 'length')===0) ;
}

function getTransformedFromValue(obj, binding) {
  var operation = binding._operation;
  var fromValue = operation ? operation(obj, binding._from, binding._operand) : getPath(obj, binding._from);
  return getTransformedValue(binding, fromValue, obj, 'to');
}

function getTransformedToValue(obj, binding) {
  var toValue = getPath(obj, binding._to);
  return getTransformedValue(binding, toValue, obj, 'from');
}

var AND_OPERATION = function(obj, left, right) {
  return getPath(obj, left) && getPath(obj, right);
};

var OR_OPERATION = function(obj, left, right) {
  return getPath(obj, left) || getPath(obj, right);
};

// ..........................................................
// BINDING
//

/**
  @class

  A binding simply connects the properties of two objects so that whenever the
  value of one property changes, the other property will be changed also. You
  do not usually work with Binding objects directly but instead describe
  bindings in your class definition using something like:

        valueBinding: "MyApp.someController.title"

  This will create a binding from `MyApp.someController.title` to the `value`
  property of your object instance automatically. Now the two values will be
  kept in sync.

  ## Customizing Your Bindings

  In addition to synchronizing values, bindings can also perform some basic
  transforms on values. These transforms can help to make sure the data fed
  into one object always meets the expectations of that object regardless of
  what the other object outputs.

  To customize a binding, you can use one of the many helper methods defined
  on Ember.Binding like so:

        valueBinding: Ember.Binding.single("MyApp.someController.title")

  This will create a binding just like the example above, except that now the
  binding will convert the value of `MyApp.someController.title` to a single
  object (removing any arrays) before applying it to the `value` property of
  your object.

  You can also chain helper methods to build custom bindings like so:

        valueBinding: Ember.Binding.single("MyApp.someController.title").notEmpty("(EMPTY)")

  This will force the value of MyApp.someController.title to be a single value
  and then check to see if the value is "empty" (null, undefined, empty array,
  or an empty string). If it is empty, the value will be set to the string
  "(EMPTY)".

  ## One Way Bindings

  One especially useful binding customization you can use is the `oneWay()`
  helper. This helper tells Ember that you are only interested in
  receiving changes on the object you are binding from. For example, if you
  are binding to a preference and you want to be notified if the preference
  has changed, but your object will not be changing the preference itself, you
  could do:

        bigTitlesBinding: Ember.Binding.oneWay("MyApp.preferencesController.bigTitles")

  This way if the value of MyApp.preferencesController.bigTitles changes the
  "bigTitles" property of your object will change also. However, if you
  change the value of your "bigTitles" property, it will not update the
  preferencesController.

  One way bindings are almost twice as fast to setup and twice as fast to
  execute because the binding only has to worry about changes to one side.

  You should consider using one way bindings anytime you have an object that
  may be created frequently and you do not intend to change a property; only
  to monitor it for changes. (such as in the example above).

  ## Adding Custom Transforms

  In addition to using the standard helpers provided by Ember, you can
  also defined your own custom transform functions which will be used to
  convert the value. To do this, just define your transform function and add
  it to the binding with the transform() helper. The following example will
  not allow Integers less than ten. Note that it checks the value of the
  bindings and allows all other values to pass:

        valueBinding: Ember.Binding.transform(function(value, binding) {
          return ((Ember.typeOf(value) === 'number') && (value < 10)) ? 10 : value;
        }).from("MyApp.someController.value")

  If you would like to instead use this transform on a number of bindings,
  you can also optionally add your own helper method to Ember.Binding. This
  method should simply return the value of `this.transform()`. The example
  below adds a new helper called `notLessThan()` which will limit the value to
  be not less than the passed minimum:

      Ember.Binding.reopen({
        notLessThan: function(minValue) {
          return this.transform(function(value, binding) {
            return ((Ember.typeOf(value) === 'number') && (value < minValue)) ? minValue : value;
          });
        }
      });

  You could specify this in your core.js file, for example. Then anywhere in
  your application you can use it to define bindings like so:

        valueBinding: Ember.Binding.from("MyApp.someController.value").notLessThan(10)

  Also, remember that helpers are chained so you can use your helper along
  with any other helpers. The example below will create a one way binding that
  does not allow empty values or values less than 10:

        valueBinding: Ember.Binding.oneWay("MyApp.someController.value").notEmpty().notLessThan(10)

  ## How to Manually Adding Binding

  All of the examples above show you how to configure a custom binding, but
  the result of these customizations will be a binding template, not a fully
  active binding. The binding will actually become active only when you
  instantiate the object the binding belongs to. It is useful however, to
  understand what actually happens when the binding is activated.

  For a binding to function it must have at least a "from" property and a "to"
  property. The from property path points to the object/key that you want to
  bind from while the to path points to the object/key you want to bind to.

  When you define a custom binding, you are usually describing the property
  you want to bind from (such as "MyApp.someController.value" in the examples
  above). When your object is created, it will automatically assign the value
  you want to bind "to" based on the name of your binding key. In the
  examples above, during init, Ember objects will effectively call
  something like this on your binding:

        binding = Ember.Binding.from(this.valueBinding).to("value");

  This creates a new binding instance based on the template you provide, and
  sets the to path to the "value" property of the new object. Now that the
  binding is fully configured with a "from" and a "to", it simply needs to be
  connected to become active. This is done through the connect() method:

        binding.connect(this);

  Note that when you connect a binding you pass the object you want it to be
  connected to.  This object will be used as the root for both the from and
  to side of the binding when inspecting relative paths.  This allows the
  binding to be automatically inherited by subclassed objects as well.

  Now that the binding is connected, it will observe both the from and to side
  and relay changes.

  If you ever needed to do so (you almost never will, but it is useful to
  understand this anyway), you could manually create an active binding by
  using the Ember.bind() helper method. (This is the same method used by
  to setup your bindings on objects):

        Ember.bind(MyApp.anotherObject, "value", "MyApp.someController.value");

  Both of these code fragments have the same effect as doing the most friendly
  form of binding creation like so:

        MyApp.anotherObject = Ember.Object.create({
          valueBinding: "MyApp.someController.value",

          // OTHER CODE FOR THIS OBJECT...

        });

  Ember's built in binding creation method makes it easy to automatically
  create bindings for you. You should always use the highest-level APIs
  available, even if you understand how to it works underneath.

  @since Ember 0.9
*/
var K = function() {};
var Binding = function(toPath, fromPath) {
  var self;
  
  if (this instanceof Binding) {
    self = this;
  } else {
    self = new K();
  }
  
  /** @private */
  self._direction = 'fwd';

  /** @private */
  self._from = fromPath;
  self._to   = toPath;
  
  return self;
};

K.prototype = Binding.prototype;

Binding.prototype = {
  // ..........................................................
  // CONFIG
  //

  /**
    This will set "from" property path to the specified value. It will not
    attempt to resolve this property path to an actual object until you
    connect the binding.

    The binding will search for the property path starting at the root object
    you pass when you connect() the binding.  It follows the same rules as
    `getPath()` - see that method for more information.

    @param {String} propertyPath the property path to connect to
    @returns {Ember.Binding} receiver
  */
  from: function(path) {
    this._from = path;
    return this;
  },

  /**
    This will set the "to" property path to the specified value. It will not
    attempt to reoslve this property path to an actual object until you
    connect the binding.

    The binding will search for the property path starting at the root object
    you pass when you connect() the binding.  It follows the same rules as
    `getPath()` - see that method for more information.

    @param {String|Tuple} propertyPath A property path or tuple
    @param {Object} [root] Root object to use when resolving the path.
    @returns {Ember.Binding} this
  */
  to: function(path) {
    this._to = path;
    return this;
  },

  /**
    Configures the binding as one way. A one-way binding will relay changes
    on the "from" side to the "to" side, but not the other way around. This
    means that if you change the "to" side directly, the "from" side may have
    a different value.

    @param {Boolean} flag
      (Optional) passing nothing here will make the binding oneWay.  You can
      instead pass NO to disable oneWay, making the binding two way again.

    @returns {Ember.Binding} receiver
  */
  oneWay: function(flag) {
    this._oneWay = flag===undefined ? true : !!flag;
    return this;
  },

  /**
    Adds the specified transform to the array of transform functions.

    A transform is a hash with `to` and `from` properties. Each property
    should be a function that performs a transformation in either the
    forward or back direction.

    The functions you pass must have the following signature:

          function(value) {};

    They must also return the transformed value.

    Transforms are invoked in the order they were added. If you are
    extending a binding and want to reset the transforms, you can call
    `resetTransform()` first.

    @param {Function} transformFunc the transform function.
    @returns {Ember.Binding} this
  */
  transform: function(transform) {
    if ('function' === typeof transform) {
      transform = { to: transform };
    }

    if (!this._transforms) this._transforms = [];
    this._transforms.push(transform);
    return this;
  },

  /**
    Resets the transforms for the binding. After calling this method the
    binding will no longer transform values. You can then add new transforms
    as needed.

    @returns {Ember.Binding} this
  */
  resetTransforms: function() {
    this._transforms = null;
    return this;
  },

  /**
    Adds a transform to the chain that will allow only single values to pass.
    This will allow single values and nulls to pass through. If you pass an
    array, it will be mapped as so:

      - [] => null
      - [a] => a
      - [a,b,c] => Multiple Placeholder

    You can pass in an optional multiple placeholder or it will use the
    default.

    Note that this transform will only happen on forwarded valued. Reverse
    values are send unchanged.

    @param {String} fromPath from path or null
    @param {Object} [placeholder] Placeholder value.
    @returns {Ember.Binding} this
  */
  single: function(placeholder) {
    if (placeholder===undefined) placeholder = Ember.MULTIPLE_PLACEHOLDER;
    this._typeTransform = SINGLE;
    this._placeholder = placeholder;
    return this;
  },

  /**
    Adds a transform that will convert the passed value to an array. If
    the value is null or undefined, it will be converted to an empty array.

    @param {String} [fromPath]
    @returns {Ember.Binding} this
  */
  multiple: function() {
    this._typeTransform = MULTIPLE;
    this._placeholder = null;
    return this;
  },

  /**
    Adds a transform to convert the value to a bool value. If the value is
    an array it will return YES if array is not empty. If the value is a
    string it will return YES if the string is not empty.

    @returns {Ember.Binding} this
  */
  bool: function() {
    this.transform(BOOL);
    return this;
  },

  /**
    Adds a transform that will return the placeholder value if the value is
    null, undefined, an empty array or an empty string. See also notNull().

    @param {Object} [placeholder] Placeholder value.
    @returns {Ember.Binding} this
  */
  notEmpty: function(placeholder) {
    // Display warning for users using the SproutCore 1.x-style API.
    ember_assert("notEmpty should only take a placeholder as a parameter. You no longer need to pass null as the first parameter.", arguments.length < 2);

    if (placeholder == undefined) { placeholder = Ember.EMPTY_PLACEHOLDER; }

    this.transform({
      to: function(val) { return empty(val) ? placeholder : val; }
    });

    return this;
  },

  /**
    Adds a transform that will return the placeholder value if the value is
    null or undefined. Otherwise it will passthrough untouched. See also notEmpty().

    @param {String} fromPath from path or null
    @param {Object} [placeholder] Placeholder value.
    @returns {Ember.Binding} this
  */
  notNull: function(placeholder) {
    if (placeholder == undefined) { placeholder = Ember.EMPTY_PLACEHOLDER; }

    this.transform({
      to: function(val) { return val == null ? placeholder : val; }
    });

    return this;
  },

  /**
    Adds a transform to convert the value to the inverse of a bool value. This
    uses the same transform as bool() but inverts it.

    @returns {Ember.Binding} this
  */
  not: function() {
    this.transform(NOT);
    return this;
  },

  /**
    Adds a transform that will return YES if the value is null or undefined, NO otherwise.

    @returns {Ember.Binding} this
  */
  isNull: function() {
    this.transform(function(val) { return val == null; });
    return this;
  },

  /** @private */
  toString: function() {
    var oneWay = this._oneWay ? '[oneWay]' : '';
    return "Ember.Binding<" + guidFor(this) + ">(" + this._from + " -> " + this._to + ")" + oneWay;
  },

  // ..........................................................
  // CONNECT AND SYNC
  //

  /**
    Attempts to connect this binding instance so that it can receive and relay
    changes. This method will raise an exception if you have not set the
    from/to properties yet.

    @param {Object} obj
      The root object for this binding.

    @param {Boolean} preferFromParam
      private: Normally, `connect` cannot take an object if `from` already set
      an object. Internally, we would like to be able to provide a default object
      to be used if no object was provided via `from`, so this parameter turns
      off the assertion.

    @returns {Ember.Binding} this
  */
  connect: function(obj) {
    ember_assert('Must pass a valid object to Ember.Binding.connect()', !!obj);

    var oneWay = this._oneWay, operand = this._operand;

    // add an observer on the object to be notified when the binding should be updated
    Ember.addObserver(obj, this._from, this, this.fromDidChange);

    // if there is an operand, add an observer onto it as well
    if (operand) { Ember.addObserver(obj, operand, this, this.fromDidChange); }

    // if the binding is a two-way binding, also set up an observer on the target
    // object.
    if (!oneWay) { Ember.addObserver(obj, this._to, this, this.toDidChange); }

    if (Ember.meta(obj,false).proto !== obj) { this._scheduleSync(obj, 'fwd'); }

    this._readyToSync = true;
    return this;
  },

  /**
    Disconnects the binding instance. Changes will no longer be relayed. You
    will not usually need to call this method.

    @param {Object} obj
      The root object you passed when connecting the binding.

    @returns {Ember.Binding} this
  */
  disconnect: function(obj) {
    ember_assert('Must pass a valid object to Ember.Binding.disconnect()', !!obj);

    var oneWay = this._oneWay, operand = this._operand;

    // remove an observer on the object so we're no longer notified of
    // changes that should update bindings.
    Ember.removeObserver(obj, this._from, this, this.fromDidChange);

    // if there is an operand, remove the observer from it as well
    if (operand) Ember.removeObserver(obj, operand, this, this.fromDidChange);

    // if the binding is two-way, remove the observer from the target as well
    if (!oneWay) Ember.removeObserver(obj, this._to, this, this.toDidChange);

    this._readyToSync = false; // disable scheduled syncs...
    return this;
  },

  // ..........................................................
  // PRIVATE
  //

  /** @private - called when the from side changes */
  fromDidChange: function(target) {
    this._scheduleSync(target, 'fwd');
  },

  /** @private - called when the to side changes */
  toDidChange: function(target) {
    this._scheduleSync(target, 'back');
  },

  /** @private */
  _scheduleSync: function(obj, dir) {
    var guid = guidFor(obj), existingDir = this[guid];

    // if we haven't scheduled the binding yet, schedule it
    if (!existingDir) {
      Ember.run.schedule('sync', this, this._sync, obj);
      this[guid] = dir;
    }

    // If both a 'back' and 'fwd' sync have been scheduled on the same object,
    // default to a 'fwd' sync so that it remains deterministic.
    if (existingDir === 'back' && dir === 'fwd') {
      this[guid] = 'fwd';
    }
  },

  /** @private */
  _sync: function(obj) {
    var log = Ember.LOG_BINDINGS;

    // don't synchronize destroyed objects or disconnected bindings
    if (obj.isDestroyed || !this._readyToSync) { return; }

    // get the direction of the binding for the object we are
    // synchronizing from
    var guid = guidFor(obj), direction = this[guid], val, transformedValue;

    var fromPath = this._from, toPath = this._to;

    delete this[guid];

    // apply any operations to the object, then apply transforms
    var fromValue = getTransformedFromValue(obj, this);
    var toValue   = getTransformedToValue(obj, this);

    if (toValue === fromValue) { return; }

    // if we're synchronizing from the remote object...
    if (direction === 'fwd') {
      if (log) { Ember.Logger.log(' ', this.toString(), val, '->', fromValue, obj); }
      Ember.trySetPath(obj, toPath, fromValue);

    // if we're synchronizing *to* the remote object
    } else if (direction === 'back') {// && !this._oneWay) {
      if (log) { Ember.Logger.log(' ', this.toString(), val, '<-', fromValue, obj); }
      Ember.trySetPath(obj, fromPath, toValue);
    }
  }

};

function mixinProperties(to, from) {
  for (var key in from) {
    if (from.hasOwnProperty(key)) {
      to[key] = from[key];
    }
  }
}

mixinProperties(Binding, {

  /**
    @see Ember.Binding.prototype.from
  */
  from: function() {
    var C = this, binding = new C();
    return binding.from.apply(binding, arguments);
  },

  /**
    @see Ember.Binding.prototype.to
  */
  to: function() {
    var C = this, binding = new C();
    return binding.to.apply(binding, arguments);
  },

  /**
    @see Ember.Binding.prototype.oneWay
  */
  oneWay: function(from, flag) {
    var C = this, binding = new C(null, from);
    return binding.oneWay(flag);
  },

  /**
    @see Ember.Binding.prototype.single
  */
  single: function(from) {
    var C = this, binding = new C(null, from);
    return binding.single();
  },

  /**
    @see Ember.Binding.prototype.multiple
  */
  multiple: function(from) {
    var C = this, binding = new C(null, from);
    return binding.multiple();
  },

  /**
    @see Ember.Binding.prototype.transform
  */
  transform: function(func) {
    var C = this, binding = new C();
    return binding.transform(func);
  },

  /**
    @see Ember.Binding.prototype.notEmpty
  */
  notEmpty: function(from, placeholder) {
    var C = this, binding = new C(null, from);
    return binding.notEmpty(placeholder);
  },

  /**
    @see Ember.Binding.prototype.bool
  */
  bool: function(from) {
    var C = this, binding = new C(null, from);
    return binding.bool();
  },

  /**
    @see Ember.Binding.prototype.not
  */
  not: function(from) {
    var C = this, binding = new C(null, from);
    return binding.not();
  },

  /**
    Adds a transform that forwards the logical 'AND' of values at 'pathA' and
    'pathB' whenever either source changes. Note that the transform acts
    strictly as a one-way binding, working only in the direction

        'pathA' AND 'pathB' --> value  (value returned is the result of ('pathA' && 'pathB'))

    Usage example where a delete button's `isEnabled` value is determined by
    whether something is selected in a list and whether the current user is
    allowed to delete:

        deleteButton: Ember.ButtonView.design({
          isEnabledBinding: Ember.Binding.and('MyApp.itemsController.hasSelection', 'MyApp.userController.canDelete')
        })

    @param {String} pathA The first part of the conditional
    @param {String} pathB The second part of the conditional
  */
  and: function(pathA, pathB) {
    var C = this, binding = new C(null, pathA).oneWay();
    binding._operand = pathB;
    binding._operation = AND_OPERATION;
    return binding;
  },

  /**
    Adds a transform that forwards the 'OR' of values at 'pathA' and
    'pathB' whenever either source changes. Note that the transform acts
    strictly as a one-way binding, working only in the direction

        'pathA' AND 'pathB' --> value  (value returned is the result of ('pathA' || 'pathB'))

    @param {String} pathA The first part of the conditional
    @param {String} pathB The second part of the conditional
  */
  or: function(pathA, pathB) {
    var C = this, binding = new C(null, pathA).oneWay();
    binding._operand = pathB;
    binding._operation = OR_OPERATION;
    return binding;
  }

});

Ember.Binding = Binding;

/**
  Global helper method to create a new binding.  Just pass the root object
  along with a to and from path to create and connect the binding.  The new
  binding object will be returned which you can further configure with
  transforms and other conditions.

  @param {Object} obj
    The root object of the transform.

  @param {String} to
    The path to the 'to' side of the binding.  Must be relative to obj.

  @param {String} from
    The path to the 'from' side of the binding.  Must be relative to obj or
    a global path.

  @returns {Ember.Binding} binding instance
*/
Ember.bind = function(obj, to, from) {
  return new Ember.Binding(to, from).connect(obj);
};

Ember.oneWay = function(obj, to, from) {
  return new Ember.Binding(to, from).oneWay().connect(obj);
};

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
var meta = Ember.meta;
var guidFor = Ember.guidFor;
var USE_ACCESSORS = Ember.USE_ACCESSORS;
var a_slice = Array.prototype.slice;
var o_create = Ember.platform.create;
var o_defineProperty = Ember.platform.defineProperty;

// ..........................................................
// DEPENDENT KEYS
// 

// data structure:
//  meta.deps = { 
//   'depKey': { 
//     'keyName': count,
//     __emberproto__: SRC_OBJ [to detect clones]
//     },
//   __emberproto__: SRC_OBJ
//  }

function uniqDeps(obj, depKey) {
  var m = meta(obj), deps, ret;
  deps = m.deps;
  if (!deps) {
    deps = m.deps = { __emberproto__: obj };
  } else if (deps.__emberproto__ !== obj) {
    deps = m.deps = o_create(deps);
    deps.__emberproto__ = obj;
  }
  
  ret = deps[depKey];
  if (!ret) {
    ret = deps[depKey] = { __emberproto__: obj };
  } else if (ret.__emberproto__ !== obj) {
    ret = deps[depKey] = o_create(ret);
    ret.__emberproto__ = obj;
  }
  
  return ret;
}

function addDependentKey(obj, keyName, depKey) {
  var deps = uniqDeps(obj, depKey);
  deps[keyName] = (deps[keyName] || 0) + 1;
  Ember.watch(obj, depKey);
}

function removeDependentKey(obj, keyName, depKey) {
  var deps = uniqDeps(obj, depKey);
  deps[keyName] = (deps[keyName] || 0) - 1;
  Ember.unwatch(obj, depKey);
}

function addDependentKeys(desc, obj, keyName) {
  var keys = desc._dependentKeys, 
      len  = keys ? keys.length : 0;
  for(var idx=0;idx<len;idx++) addDependentKey(obj, keyName, keys[idx]);
}

// ..........................................................
// COMPUTED PROPERTY
//

function ComputedProperty(func, opts) {
  this.func = func;
  this._cacheable = opts && opts.cacheable;
  this._dependentKeys = opts && opts.dependentKeys;
}

Ember.ComputedProperty = ComputedProperty;
ComputedProperty.prototype = new Ember.Descriptor();

var CP_DESC = {
  configurable: true,
  enumerable:   true,
  get: function() { return undefined; }, // for when use_accessors is false.
  set: Ember.Descriptor.MUST_USE_SETTER  // for when use_accessors is false
};

function mkCpGetter(keyName, desc) {
  var cacheable = desc._cacheable, 
      func     = desc.func;
      
  if (cacheable) {
    return function() {
      var ret, cache = meta(this).cache;
      if (keyName in cache) return cache[keyName];
      ret = cache[keyName] = func.call(this, keyName);
      return ret ;
    };
  } else {
    return function() {
      return func.call(this, keyName);
    };
  }
}

function mkCpSetter(keyName, desc) {
  var cacheable = desc._cacheable,
      func      = desc.func;
      
  return function(value) {
    var m = meta(this, cacheable),
        watched = (m.source===this) && m.watching[keyName]>0,
        ret, oldSuspended, lastSetValues;

    oldSuspended = desc._suspended;
    desc._suspended = this;

    watched = watched && m.lastSetValues[keyName]!==guidFor(value);
    if (watched) {
      m.lastSetValues[keyName] = guidFor(value);
      Ember.propertyWillChange(this, keyName);
    }
    
    if (cacheable) delete m.cache[keyName];
    ret = func.call(this, keyName, value);
    if (cacheable) m.cache[keyName] = ret;
    if (watched) Ember.propertyDidChange(this, keyName);
    desc._suspended = oldSuspended;
    return ret;
  };
}

var Cp = ComputedProperty.prototype;

/**
  Call on a computed property to set it into cacheable mode.  When in this
  mode the computed property will automatically cache the return value of 
  your function until one of the dependent keys changes.

  @param {Boolean} aFlag optional set to false to disable cacheing
  @returns {Ember.ComputedProperty} receiver
*/
Cp.cacheable = function(aFlag) {
  this._cacheable = aFlag!==false;
  return this;
};

/**
  Sets the dependent keys on this computed property.  Pass any number of 
  arguments containing key paths that this computed property depends on.
  
  @param {String} path... zero or more property paths
  @returns {Ember.ComputedProperty} receiver
*/
Cp.property = function() {
  this._dependentKeys = a_slice.call(arguments);
  return this;
};

/** @private - impl descriptor API */
Cp.setup = function(obj, keyName, value) {
  CP_DESC.get = mkCpGetter(keyName, this);
  CP_DESC.set = mkCpSetter(keyName, this);
  o_defineProperty(obj, keyName, CP_DESC);
  CP_DESC.get = CP_DESC.set = null;
  addDependentKeys(this, obj, keyName);
};

/** @private - impl descriptor API */
Cp.teardown = function(obj, keyName) {
  var keys = this._dependentKeys, 
      len  = keys ? keys.length : 0;
  for(var idx=0;idx<len;idx++) removeDependentKey(obj, keyName, keys[idx]);

  if (this._cacheable) delete meta(obj).cache[keyName];
  
  return null; // no value to restore
};

/** @private - impl descriptor API */
Cp.didChange = function(obj, keyName) {
  if (this._cacheable && (this._suspended !== obj)) {
    delete meta(obj).cache[keyName];
  }
};

/** @private - impl descriptor API */
Cp.get = function(obj, keyName) {
  var ret, cache;
  
  if (this._cacheable) {
    cache = meta(obj).cache;
    if (keyName in cache) return cache[keyName];
    ret = cache[keyName] = this.func.call(obj, keyName);
  } else {
    ret = this.func.call(obj, keyName);
  }
  return ret ;
};

/** @private - impl descriptor API */
Cp.set = function(obj, keyName, value) {
  var cacheable = this._cacheable;
  
  var m = meta(obj, cacheable),
      watched = (m.source===obj) && m.watching[keyName]>0,
      ret, oldSuspended, lastSetValues;

  oldSuspended = this._suspended;
  this._suspended = obj;

  watched = watched && m.lastSetValues[keyName]!==guidFor(value);
  if (watched) {
    m.lastSetValues[keyName] = guidFor(value);
    Ember.propertyWillChange(obj, keyName);
  }
  
  if (cacheable) delete m.cache[keyName];
  ret = this.func.call(obj, keyName, value);
  if (cacheable) m.cache[keyName] = ret;
  if (watched) Ember.propertyDidChange(obj, keyName);
  this._suspended = oldSuspended;
  return ret;
};

Cp.val = function(obj, keyName) {
  return meta(obj, false).values[keyName];
};

if (!Ember.platform.hasPropertyAccessors) {
  Cp.setup = function(obj, keyName, value) {
    obj[keyName] = undefined; // so it shows up in key iteration
    addDependentKeys(this, obj, keyName);
  };
  
} else if (!USE_ACCESSORS) {
  Cp.setup = function(obj, keyName) {
    // throw exception if not using Ember.get() and Ember.set() when supported
    o_defineProperty(obj, keyName, CP_DESC);
    addDependentKeys(this, obj, keyName);
  };
} 

/**
  This helper returns a new property descriptor that wraps the passed 
  computed property function.  You can use this helper to define properties
  with mixins or via Ember.defineProperty().
  
  The function you pass will be used to both get and set property values.
  The function should accept two parameters, key and value.  If value is not
  undefined you should set the value first.  In either case return the 
  current value of the property.
  
  @param {Function} func
    The computed property function.
    
  @returns {Ember.ComputedProperty} property descriptor instance
*/
Ember.computed = function(func) {
  return new ComputedProperty(func);
};

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
var o_create = Ember.platform.create;
var meta = Ember.meta;
var guidFor = Ember.guidFor;
var array_Slice = Array.prototype.slice;

/**
  The event system uses a series of nested hashes to store listeners on an
  object. When a listener is registered, or when an event arrives, these
  hashes are consulted to determine which target and action pair to invoke.

  The hashes are stored in the object's meta hash, and look like this:

      // Object's meta hash
      {
        listeners: {               // variable name: `listenerSet`
          "foo:changed": {         // variable name: `targetSet`
            [targetGuid]: {        // variable name: `actionSet`
              [methodGuid]: {      // variable name: `action`
                target: [Object object],
                method: [Function function],
                xform: [Function function]
              }
            }
          }
        }
      }

*/

var metaPath = Ember.metaPath;

// Gets the set of all actions, keyed on the guid of each action's
// method property.
function actionSetFor(obj, eventName, target, writable) {
  var targetGuid = guidFor(target);
  return metaPath(obj, ['listeners', eventName, targetGuid], writable);
}

// Gets the set of all targets, keyed on the guid of each action's
// target property.
function targetSetFor(obj, eventName) {
  var listenerSet = meta(obj, false).listeners;
  if (!listenerSet) { return false; }

  return listenerSet[eventName] || false;
}

// TODO: This knowledge should really be a part of the
// meta system.
var SKIP_PROPERTIES = { __ember_source__: true };

// For a given target, invokes all of the methods that have
// been registered as a listener.
function invokeEvents(targetSet, params) {
  // Iterate through all elements of the target set
  for(var targetGuid in targetSet) {
    if (SKIP_PROPERTIES[targetGuid]) { continue; }

    var actionSet = targetSet[targetGuid];

    // Iterate through the elements of the action set
    for(var methodGuid in actionSet) {
      if (SKIP_PROPERTIES[methodGuid]) { continue; }

      var action = actionSet[methodGuid];
      if (!action) { continue; }

      // Extract target and method for each action
      var method = action.method;
      var target = action.target;

      // If there is no target, the target is the object
      // on which the event was fired.
      if (!target) { target = params[0]; }
      if ('string' === typeof method) { method = target[method]; }

      // Listeners can provide an `xform` function, which can perform
      // arbitrary transformations, such as changing the order of
      // parameters.
      //
      // This is primarily used by ember-runtime's observer system, which
      // provides a higher level abstraction on top of events, including
      // dynamically looking up current values and passing them into the
      // registered listener.
      var xform = action.xform;

      if (xform) {
        xform(target, method, params);
      } else {
        method.apply(target, params);
      }
    }
  }
}

/**
  The parameters passed to an event listener are not exactly the
  parameters passed to an observer. if you pass an xform function, it will
  be invoked and is able to translate event listener parameters into the form
  that observers are expecting.
*/
function addListener(obj, eventName, target, method, xform) {
  ember_assert("You must pass at least an object and event name to Ember.addListener", !!obj && !!eventName);

  if (!method && 'function' === typeof target) {
    method = target;
    target = null;
  }

  var actionSet = actionSetFor(obj, eventName, target, true),
      methodGuid = guidFor(method), ret;

  if (!actionSet[methodGuid]) {
    actionSet[methodGuid] = { target: target, method: method, xform: xform };
  } else {
    actionSet[methodGuid].xform = xform; // used by observers etc to map params
  }

  if ('function' === typeof obj.didAddListener) {
    obj.didAddListener(eventName, target, method);
  }

  return ret; // return true if this is the first listener.
}

function removeListener(obj, eventName, target, method) {
  if (!method && 'function'===typeof target) {
    method = target;
    target = null;
  }

  var actionSet = actionSetFor(obj, eventName, target, true),
      methodGuid = guidFor(method);

  // we can't simply delete this parameter, because if we do, we might
  // re-expose the property from the prototype chain.
  if (actionSet && actionSet[methodGuid]) { actionSet[methodGuid] = null; }

  if (obj && 'function'===typeof obj.didRemoveListener) {
    obj.didRemoveListener(eventName, target, method);
  }
}

// returns a list of currently watched events
function watchedEvents(obj) {
  var listeners = meta(obj, false).listeners, ret = [];

  if (listeners) {
    for(var eventName in listeners) {
      if (!SKIP_PROPERTIES[eventName] && listeners[eventName]) {
        ret.push(eventName);
      }
    }
  }
  return ret;
}

function sendEvent(obj, eventName) {
  ember_assert("You must pass an object and event name to Ember.sendEvent", !!obj && !!eventName);

  // first give object a chance to handle it
  if (obj !== Ember && 'function' === typeof obj.sendEvent) {
    obj.sendEvent.apply(obj, array_Slice.call(arguments, 1));
  }

  var targetSet = targetSetFor(obj, eventName);
  if (!targetSet) { return false; }

  invokeEvents(targetSet, arguments);
  return true;
}

function hasListeners(obj, eventName) {
  var targetSet = targetSetFor(obj, eventName);
  if (!targetSet) { return false; }

  for(var targetGuid in targetSet) {
    if (SKIP_PROPERTIES[targetGuid] || !targetSet[targetGuid]) { continue; }

    var actionSet = targetSet[targetGuid];

    for(var methodGuid in actionSet) {
      if (SKIP_PROPERTIES[methodGuid] || !actionSet[methodGuid]) { continue; }
      return true; // stop as soon as we find a valid listener
    }
  }

  // no listeners!  might as well clean this up so it is faster later.
  var set = metaPath(obj, ['listeners'], true);
  set[eventName] = null;

  return false;
}

function listenersFor(obj, eventName) {
  var targetSet = targetSetFor(obj, eventName), ret = [];
  if (!targetSet) { return ret; }

  var info;
  for(var targetGuid in targetSet) {
    if (SKIP_PROPERTIES[targetGuid] || !targetSet[targetGuid]) { continue; }

    var actionSet = targetSet[targetGuid];

    for(var methodGuid in actionSet) {
      if (SKIP_PROPERTIES[methodGuid] || !actionSet[methodGuid]) { continue; }
      info = actionSet[methodGuid];
      ret.push([info.target, info.method]);
    }
  }

  return ret;
}

Ember.addListener = addListener;
Ember.removeListener = removeListener;
Ember.sendEvent = sendEvent;
Ember.hasListeners = hasListeners;
Ember.watchedEvents = watchedEvents;
Ember.listenersFor = listenersFor;

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var Mixin, MixinDelegate, REQUIRED, Alias;
var classToString, superClassString;

var a_map = Array.prototype.map;
var EMPTY_META = {}; // dummy for non-writable meta
var META_SKIP = { __emberproto__: true, __ember_count__: true };

var o_create = Ember.platform.create;

function meta(obj, writable) {
  var m = Ember.meta(obj, writable!==false), ret = m.mixins;
  if (writable===false) return ret || EMPTY_META;

  if (!ret) {
    ret = m.mixins = { __emberproto__: obj };
  } else if (ret.__emberproto__ !== obj) {
    ret = m.mixins = o_create(ret);
    ret.__emberproto__ = obj;
  }
  return ret;
}

function initMixin(mixin, args) {
  if (args && args.length > 0) {
    mixin.mixins = a_map.call(args, function(x) {
      if (x instanceof Mixin) return x;

      // Note: Manually setup a primitive mixin here.  This is the only
      // way to actually get a primitive mixin.  This way normal creation
      // of mixins will give you combined mixins...
      var mixin = new Mixin();
      mixin.properties = x;
      return mixin;
    });
  }
  return mixin;
}

var NATIVES = [Boolean, Object, Number, Array, Date, String];
function isMethod(obj) {
  if ('function' !== typeof obj || obj.isMethod===false) return false;
  return NATIVES.indexOf(obj)<0;
}

function mergeMixins(mixins, m, descs, values, base) {
  var len = mixins.length, idx, mixin, guid, props, value, key, ovalue, concats;

  function removeKeys(keyName) {
    delete descs[keyName];
    delete values[keyName];
  }

  for(idx=0;idx<len;idx++) {

    mixin = mixins[idx];
    if (!mixin) throw new Error('Null value found in Ember.mixin()');

    if (mixin instanceof Mixin) {
      guid = Ember.guidFor(mixin);
      if (m[guid]) continue;
      m[guid] = mixin;
      props = mixin.properties;
    } else {
      props = mixin; // apply anonymous mixin properties
    }

    if (props) {

      // reset before adding each new mixin to pickup concats from previous
      concats = values.concatenatedProperties || base.concatenatedProperties;
      if (props.concatenatedProperties) {
        concats = concats ? concats.concat(props.concatenatedProperties) : props.concatenatedProperties;
      }

      for (key in props) {
        if (!props.hasOwnProperty(key)) continue;
        value = props[key];
        if (value instanceof Ember.Descriptor) {
          if (value === REQUIRED && descs[key]) { continue; }

          descs[key]  = value;
          values[key] = undefined;
        } else {

          // impl super if needed...
          if (isMethod(value)) {
            ovalue = (descs[key] === Ember.SIMPLE_PROPERTY) && values[key];
            if (!ovalue) ovalue = base[key];
            if ('function' !== typeof ovalue) ovalue = null;
            if (ovalue) {
              var o = value.__ember_observes__, ob = value.__ember_observesBefore__;
              value = Ember.wrap(value, ovalue);
              value.__ember_observes__ = o;
              value.__ember_observesBefore__ = ob;
            }
          } else if ((concats && concats.indexOf(key)>=0) || key === 'concatenatedProperties') {
            var baseValue = values[key] || base[key];
            value = baseValue ? baseValue.concat(value) : Ember.makeArray(value);
          }

          descs[key]  = Ember.SIMPLE_PROPERTY;
          values[key] = value;
        }
      }

      // manually copy toString() because some JS engines do not enumerate it
      if (props.hasOwnProperty('toString')) {
        base.toString = props.toString;
      }

    } else if (mixin.mixins) {
      mergeMixins(mixin.mixins, m, descs, values, base);
      if (mixin._without) mixin._without.forEach(removeKeys);
    }
  }
}

var defineProperty = Ember.defineProperty;

function writableReq(obj) {
  var m = Ember.meta(obj), req = m.required;
  if (!req || (req.__emberproto__ !== obj)) {
    req = m.required = req ? o_create(req) : { __ember_count__: 0 };
    req.__emberproto__ = obj;
  }
  return req;
}

function getObserverPaths(value) {
  return ('function' === typeof value) && value.__ember_observes__;
}

function getBeforeObserverPaths(value) {
  return ('function' === typeof value) && value.__ember_observesBefore__;
}

Ember._mixinBindings = function(obj, key, value, m) {
  return value;
};

function applyMixin(obj, mixins, partial) {
  var descs = {}, values = {}, m = Ember.meta(obj), req = m.required;
  var key, willApply, didApply, value, desc;

  var mixinBindings = Ember._mixinBindings;

  mergeMixins(mixins, meta(obj), descs, values, obj);

  if (MixinDelegate.detect(obj)) {
    willApply = values.willApplyProperty || obj.willApplyProperty;
    didApply  = values.didApplyProperty || obj.didApplyProperty;
  }

  for(key in descs) {
    if (!descs.hasOwnProperty(key)) continue;

    desc = descs[key];
    value = values[key];

    if (desc === REQUIRED) {
      if (!(key in obj)) {
        if (!partial) throw new Error('Required property not defined: '+key);

        // for partial applies add to hash of required keys
        req = writableReq(obj);
        req.__ember_count__++;
        req[key] = true;
      }

    } else {

      while (desc instanceof Alias) {

        var altKey = desc.methodName;
        if (descs[altKey]) {
          value = values[altKey];
          desc  = descs[altKey];
        } else if (m.descs[altKey]) {
          desc  = m.descs[altKey];
          value = desc.val(obj, altKey);
        } else {
          value = obj[altKey];
          desc  = Ember.SIMPLE_PROPERTY;
        }
      }

      if (willApply) willApply.call(obj, key);

      var observerPaths = getObserverPaths(value),
          curObserverPaths = observerPaths && getObserverPaths(obj[key]),
          beforeObserverPaths = getBeforeObserverPaths(value),
          curBeforeObserverPaths = beforeObserverPaths && getBeforeObserverPaths(obj[key]),
          len, idx;

      if (curObserverPaths) {
        len = curObserverPaths.length;
        for(idx=0;idx<len;idx++) {
          Ember.removeObserver(obj, curObserverPaths[idx], null, key);
        }
      }

      if (curBeforeObserverPaths) {
        len = curBeforeObserverPaths.length;
        for(idx=0;idx<len;idx++) {
          Ember.removeBeforeObserver(obj, curBeforeObserverPaths[idx], null,key);
        }
      }

      // TODO: less hacky way for ember-runtime to add bindings.
      value = mixinBindings(obj, key, value, m);

      defineProperty(obj, key, desc, value);

      if (observerPaths) {
        len = observerPaths.length;
        for(idx=0;idx<len;idx++) {
          Ember.addObserver(obj, observerPaths[idx], null, key);
        }
      }

      if (beforeObserverPaths) {
        len = beforeObserverPaths.length;
        for(idx=0;idx<len;idx++) {
          Ember.addBeforeObserver(obj, beforeObserverPaths[idx], null, key);
        }
      }

      if (req && req[key]) {
        req = writableReq(obj);
        req.__ember_count__--;
        req[key] = false;
      }

      if (didApply) didApply.call(obj, key);

    }
  }

  // Make sure no required attrs remain
  if (!partial && req && req.__ember_count__>0) {
    var keys = [];
    for(key in req) {
      if (META_SKIP[key]) continue;
      keys.push(key);
    }
    throw new Error('Required properties not defined: '+keys.join(','));
  }
  return obj;
}

Ember.mixin = function(obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  return applyMixin(obj, args, false);
};


Mixin = function() { return initMixin(this, arguments); };

Mixin._apply = applyMixin;

Mixin.applyPartial = function(obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  return applyMixin(obj, args, true);
};

Mixin.create = function() {
  classToString.processed = false;
  var M = this;
  return initMixin(new M(), arguments);
};

Mixin.prototype.reopen = function() {

  var mixin, tmp;

  if (this.properties) {
    mixin = Mixin.create();
    mixin.properties = this.properties;
    delete this.properties;
    this.mixins = [mixin];
  }

  var len = arguments.length, mixins = this.mixins, idx;

  for(idx=0;idx<len;idx++) {
    mixin = arguments[idx];
    if (mixin instanceof Mixin) {
      mixins.push(mixin);
    } else {
      tmp = Mixin.create();
      tmp.properties = mixin;
      mixins.push(tmp);
    }
  }

  return this;
};

var TMP_ARRAY = [];
Mixin.prototype.apply = function(obj) {
  TMP_ARRAY.length=0;
  TMP_ARRAY[0] = this;
  return applyMixin(obj, TMP_ARRAY, false);
};

Mixin.prototype.applyPartial = function(obj) {
  TMP_ARRAY.length=0;
  TMP_ARRAY[0] = this;
  return applyMixin(obj, TMP_ARRAY, true);
};

function _detect(curMixin, targetMixin, seen) {
  var guid = Ember.guidFor(curMixin);

  if (seen[guid]) return false;
  seen[guid] = true;

  if (curMixin === targetMixin) return true;
  var mixins = curMixin.mixins, loc = mixins ? mixins.length : 0;
  while(--loc >= 0) {
    if (_detect(mixins[loc], targetMixin, seen)) return true;
  }
  return false;
}

Mixin.prototype.detect = function(obj) {
  if (!obj) return false;
  if (obj instanceof Mixin) return _detect(obj, this, {});
  return !!meta(obj, false)[Ember.guidFor(this)];
};

Mixin.prototype.without = function() {
  var ret = new Mixin(this);
  ret._without = Array.prototype.slice.call(arguments);
  return ret;
};

function _keys(ret, mixin, seen) {
  if (seen[Ember.guidFor(mixin)]) return;
  seen[Ember.guidFor(mixin)] = true;

  if (mixin.properties) {
    var props = mixin.properties;
    for(var key in props) {
      if (props.hasOwnProperty(key)) ret[key] = true;
    }
  } else if (mixin.mixins) {
    mixin.mixins.forEach(function(x) { _keys(ret, x, seen); });
  }
}

Mixin.prototype.keys = function() {
  var keys = {}, seen = {}, ret = [];
  _keys(keys, this, seen);
  for(var key in keys) {
    if (keys.hasOwnProperty(key)) ret.push(key);
  }
  return ret;
};

/** @private - make Mixin's have nice displayNames */

var NAME_KEY = Ember.GUID_KEY+'_name';
var get = Ember.get;

function processNames(paths, root, seen) {
  var idx = paths.length;
  for(var key in root) {
    if (!root.hasOwnProperty || !root.hasOwnProperty(key)) continue;
    var obj = root[key];
    paths[idx] = key;

    if (obj && obj.toString === classToString) {
      obj[NAME_KEY] = paths.join('.');
    } else if (obj && get(obj, 'isNamespace')) {
      if (seen[Ember.guidFor(obj)]) continue;
      seen[Ember.guidFor(obj)] = true;
      processNames(paths, obj, seen);
    }

  }
  paths.length = idx; // cut out last item
}

function findNamespaces() {
  var Namespace = Ember.Namespace, obj;

  if (Namespace.PROCESSED) { return; }

  for (var prop in window) {
    // Unfortunately, some versions of IE don't support window.hasOwnProperty
    if (window.hasOwnProperty && !window.hasOwnProperty(prop)) { continue; }

    obj = window[prop];

    if (obj && get(obj, 'isNamespace')) {
      obj[NAME_KEY] = prop;
    }
  }
}

Ember.identifyNamespaces = findNamespaces;

superClassString = function(mixin) {
  var superclass = mixin.superclass;
  if (superclass) {
    if (superclass[NAME_KEY]) { return superclass[NAME_KEY]; }
    else { return superClassString(superclass); }
  } else {
    return;
  }
};

classToString = function() {
  var Namespace = Ember.Namespace, namespace;

  // TODO: Namespace should really be in Metal
  if (Namespace) {
    if (!this[NAME_KEY] && !classToString.processed) {
      if (!Namespace.PROCESSED) {
        findNamespaces();
        Namespace.PROCESSED = true;
      }

      classToString.processed = true;

      var namespaces = Namespace.NAMESPACES;
      for (var i=0, l=namespaces.length; i<l; i++) {
        namespace = namespaces[i];
        processNames([namespace.toString()], namespace, {});
      }
    }
  }

  if (this[NAME_KEY]) {
    return this[NAME_KEY];
  } else {
    var str = superClassString(this);
    if (str) {
      return "(subclass of " + str + ")";
    } else {
      return "(unknown mixin)";
    }
  }
};

Mixin.prototype.toString = classToString;

// returns the mixins currently applied to the specified object
// TODO: Make Ember.mixin
Mixin.mixins = function(obj) {
  var ret = [], mixins = meta(obj, false), key, mixin;
  for(key in mixins) {
    if (META_SKIP[key]) continue;
    mixin = mixins[key];

    // skip primitive mixins since these are always anonymous
    if (!mixin.properties) ret.push(mixins[key]);
  }
  return ret;
};

REQUIRED = new Ember.Descriptor();
REQUIRED.toString = function() { return '(Required Property)'; };

Ember.required = function() {
  return REQUIRED;
};

Alias = function(methodName) {
  this.methodName = methodName;
};
Alias.prototype = new Ember.Descriptor();

Ember.alias = function(methodName) {
  return new Alias(methodName);
};

Ember.Mixin = Mixin;

MixinDelegate = Mixin.create({

  willApplyProperty: Ember.required(),
  didApplyProperty:  Ember.required()

});

Ember.MixinDelegate = MixinDelegate;


// ..........................................................
// OBSERVER HELPER
//

Ember.observer = function(func) {
  var paths = Array.prototype.slice.call(arguments, 1);
  func.__ember_observes__ = paths;
  return func;
};

Ember.beforeObserver = function(func) {
  var paths = Array.prototype.slice.call(arguments, 1);
  func.__ember_observesBefore__ = paths;
  return func;
};







})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});

(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================





// ..........................................................
// HELPERS
// 

var get = Ember.get, set = Ember.set;

var contexts = [];
function popCtx() {
  return contexts.length===0 ? {} : contexts.pop();
}

function pushCtx(ctx) {
  contexts.push(ctx);
  return null;
}

function iter(key, value) {
  function i(item) {
    var cur = get(item, key);
    return value===undefined ? !!cur : value===cur;
  } 
  return i ;
}

function xform(target, method, params) {
  method.call(target, params[0], params[2], params[3]);
}

/**
  @class

  This mixin defines the common interface implemented by enumerable objects
  in Ember.  Most of these methods follow the standard Array iteration
  API defined up to JavaScript 1.8 (excluding language-specific features that
  cannot be emulated in older versions of JavaScript).

  This mixin is applied automatically to the Array class on page load, so you
  can use any of these methods on simple arrays.  If Array already implements
  one of these methods, the mixin will not override them.

  h3. Writing Your Own Enumerable

  To make your own custom class enumerable, you need two items:

  1. You must have a length property.  This property should change whenever
     the number of items in your enumerable object changes.  If you using this
     with an Ember.Object subclass, you should be sure to change the length
     property using set().

  2. If you must implement nextObject().  See documentation.

  Once you have these two methods implement, apply the Ember.Enumerable mixin
  to your class and you will be able to enumerate the contents of your object
  like any other collection.

  h3. Using Ember Enumeration with Other Libraries

  Many other libraries provide some kind of iterator or enumeration like
  facility.  This is often where the most common API conflicts occur.
  Ember's API is designed to be as friendly as possible with other
  libraries by implementing only methods that mostly correspond to the
  JavaScript 1.8 API.

  @since Ember 0.9
*/
Ember.Enumerable = Ember.Mixin.create( /** @lends Ember.Enumerable */ {
  
  /** @private - compatibility */
  isEnumerable: true,
  
  /**
    Implement this method to make your class enumerable.

    This method will be call repeatedly during enumeration.  The index value
    will always begin with 0 and increment monotonically.  You don't have to
    rely on the index value to determine what object to return, but you should
    always check the value and start from the beginning when you see the
    requested index is 0.

    The previousObject is the object that was returned from the last call
    to nextObject for the current iteration.  This is a useful way to
    manage iteration if you are tracing a linked list, for example.

    Finally the context parameter will always contain a hash you can use as
    a "scratchpad" to maintain any other state you need in order to iterate
    properly.  The context object is reused and is not reset between
    iterations so make sure you setup the context with a fresh state whenever
    the index parameter is 0.

    Generally iterators will continue to call nextObject until the index
    reaches the your current length-1.  If you run out of data before this
    time for some reason, you should simply return undefined.

    The default impementation of this method simply looks up the index.
    This works great on any Array-like objects.

    @param index {Number} the current index of the iteration
    @param previousObject {Object} the value returned by the last call to nextObject.
    @param context {Object} a context object you can use to maintain state.
    @returns {Object} the next object in the iteration or undefined
  */
  nextObject: Ember.required(Function),

  /**
    Helper method returns the first object from a collection.  This is usually
    used by bindings and other parts of the framework to extract a single
    object if the enumerable contains only one item.

    If you override this method, you should implement it so that it will
    always return the same value each time it is called.  If your enumerable
    contains only one object, this method should always return that object.
    If your enumerable is empty, this method should return undefined.

    @returns {Object} the object or undefined
  */
  firstObject: Ember.computed(function() {
    if (get(this, 'length')===0) return undefined ;
    if (Ember.Array && Ember.Array.detect(this)) return this.objectAt(0); 

    // handle generic enumerables
    var context = popCtx(), ret;
    ret = this.nextObject(0, null, context);
    pushCtx(context);
    return ret ;
  }).property('[]').cacheable(),

  /**
    Helper method returns the last object from a collection.

    @returns {Object} the object or undefined
  */
  lastObject: Ember.computed(function() {
    var len = get(this, 'length');
    if (len===0) return undefined ;
    if (Ember.Array && Ember.Array.detect(this)) {
      return this.objectAt(len-1);
    } else {
      var context = popCtx(), idx=0, cur, last = null;
      do {
        last = cur;
        cur = this.nextObject(idx++, last, context);
      } while (cur !== undefined);
      pushCtx(context);
      return last;
    }
    
  }).property('[]').cacheable(),

  /**
    Returns true if the passed object can be found in the receiver.  The
    default version will iterate through the enumerable until the object 
    is found.  You may want to override this with a more efficient version.
    
    @param {Object} obj
      The object to search for.
      
    @returns {Boolean} true if object is found in enumerable.
  */
  contains: function(obj) {
    return this.find(function(item) { return item===obj; }) !== undefined; 
  },
  
  /**
    Iterates through the enumerable, calling the passed function on each
    item. This method corresponds to the forEach() method defined in
    JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Object} receiver
  */
  forEach: function(callback, target) {
    if (typeof callback !== "function") throw new TypeError() ;
    var len = get(this, 'length'), last = null, context = popCtx();

    if (target === undefined) target = null;

    for(var idx=0;idx<len;idx++) {
      var next = this.nextObject(idx, last, context) ;
      callback.call(target, next, idx, this);
      last = next ;
    }
    last = null ;
    context = pushCtx(context);
    return this ;
  },

  /**
    Retrieves the named value on each member object. This is more efficient
    than using one of the wrapper methods defined here. Objects that
    implement Ember.Observable will use the get() method, otherwise the property
    will be accessed directly.

    @param {String} key The key to retrieve
    @returns {Array} Extracted values
  */
  getEach: function(key) {
    return this.map(function(item) {
      return get(item, key);
    });
  },

  /**
    Sets the value on the named property for each member. This is more
    efficient than using other methods defined on this helper. If the object
    implements Ember.Observable, the value will be changed to set(), otherwise
    it will be set directly. null objects are skipped.

    @param {String} key The key to set
    @param {Object} value The object to set
    @returns {Object} receiver
  */
  setEach: function(key, value) {
    return this.forEach(function(item) {
      set(item, key, value);
    });
  },

  /**
    Maps all of the items in the enumeration to another value, returning
    a new array. This method corresponds to map() defined in JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

        function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the mapped value.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Array} The mapped array.
  */
  map: function(callback, target) {
    var ret = [];
    this.forEach(function(x, idx, i) { 
      ret[idx] = callback.call(target, x, idx,i); 
    });
    return ret ;
  },

  /**
    Similar to map, this specialized function returns the value of the named
    property on all items in the enumeration.

    @params key {String} name of the property
    @returns {Array} The mapped array.
  */
  mapProperty: function(key) {
    return this.map(function(next) {
      return get(next, key);
    });
  },

  /**
    Returns an array with all of the items in the enumeration that the passed
    function returns YES for. This method corresponds to filter() defined in
    JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the YES to include the item in the results, NO otherwise.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Array} A filtered array.
  */
  filter: function(callback, target) {
    var ret = [];
    this.forEach(function(x, idx, i) {
      if (callback.call(target, x, idx, i)) ret.push(x);
    });
    return ret ;
  },

  /**
    Returns an array with just the items with the matched property.  You
    can pass an optional second argument with the target value.  Otherwise
    this will match any property that evaluates to true.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Array} filtered array
  */
  filterProperty: function(key, value) {
    return this.filter(iter(key, value));
  },

  /**
    Returns the first item in the array for which the callback returns YES.
    This method works similar to the filter() method defined in JavaScript 1.6
    except that it will stop working on the array once a match is found.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the YES to include the item in the results, NO otherwise.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Object} Found item or null.
  */
  find: function(callback, target) {
    var len = get(this, 'length') ;
    if (target === undefined) target = null;

    var last = null, next, found = false, ret ;
    var context = popCtx();
    for(var idx=0;idx<len && !found;idx++) {
      next = this.nextObject(idx, last, context) ;
      if (found = callback.call(target, next, idx, this)) ret = next ;
      last = next ;
    }
    next = last = null ;
    context = pushCtx(context);
    return ret ;
  },

  /**
    Returns an the first item with a property matching the passed value.  You
    can pass an optional second argument with the target value.  Otherwise
    this will match any property that evaluates to true.

    This method works much like the more generic find() method.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Object} found item or null
  */
  findProperty: function(key, value) {
    return this.find(iter(key, value));
  },

  /**
    Returns YES if the passed function returns YES for every item in the
    enumeration. This corresponds with the every() method in JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the YES or NO.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    Example Usage:

          if (people.every(isEngineer)) { Paychecks.addBigBonus(); }

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Boolean}
  */
  every: function(callback, target) {
    return !this.find(function(x, idx, i) {
      return !callback.call(target, x, idx, i);
    });
  },

  /**
    Returns true if the passed property resolves to true for all items in the
    enumerable.  This method is often simpler/faster than using a callback.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Array} filtered array
  */
  everyProperty: function(key, value) {
    return this.every(iter(key, value));
  },


  /**
    Returns YES if the passed function returns true for any item in the
    enumeration. This corresponds with the every() method in JavaScript 1.6.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(item, index, enumerable);

    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    It should return the YES to include the item in the results, NO otherwise.

    Note that in addition to a callback, you can also pass an optional target
    object that will be set as "this" on the context. This is a good way
    to give your iterator function access to the current object.

    Usage Example:

          if (people.some(isManager)) { Paychecks.addBiggerBonus(); }

    @param {Function} callback The callback to execute
    @param {Object} target The target object to use
    @returns {Array} A filtered array.
  */
  some: function(callback, target) {
    return !!this.find(function(x, idx, i) {
      return !!callback.call(target, x, idx, i);
    });
  },

  /**
    Returns true if the passed property resolves to true for any item in the
    enumerable.  This method is often simpler/faster than using a callback.

    @params key {String} the property to test
    @param value {String} optional value to test against.
    @returns {Boolean} true
  */
  someProperty: function(key, value) {
    return this.some(iter(key, value));
  },

  /**
    This will combine the values of the enumerator into a single value. It
    is a useful way to collect a summary value from an enumeration. This
    corresponds to the reduce() method defined in JavaScript 1.8.

    The callback method you provide should have the following signature (all
    parameters are optional):

          function(previousValue, item, index, enumerable);

    - *previousValue* is the value returned by the last call to the iterator.
    - *item* is the current item in the iteration.
    - *index* is the current index in the iteration
    - *enumerable* is the enumerable object itself.

    Return the new cumulative value.

    In addition to the callback you can also pass an initialValue. An error
    will be raised if you do not pass an initial value and the enumerator is
    empty.

    Note that unlike the other methods, this method does not allow you to
    pass a target object to set as this for the callback. It's part of the
    spec. Sorry.

    @param {Function} callback The callback to execute
    @param {Object} initialValue Initial value for the reduce
    @param {String} reducerProperty internal use only.
    @returns {Object} The reduced value.
  */
  reduce: function(callback, initialValue, reducerProperty) {
    if (typeof callback !== "function") { throw new TypeError(); }

    var ret = initialValue;

    this.forEach(function(item, i) {
      ret = callback.call(null, ret, item, i, this, reducerProperty);
    }, this);

    return ret;
  },

  /**
    Invokes the named method on every object in the receiver that
    implements it.  This method corresponds to the implementation in
    Prototype 1.6.

    @param methodName {String} the name of the method
    @param args {Object...} optional arguments to pass as well.
    @returns {Array} return values from calling invoke.
  */
  invoke: function(methodName) {
    var args, ret = [];
    if (arguments.length>1) args = Array.prototype.slice.call(arguments, 1);
    
    this.forEach(function(x, idx) { 
      var method = x && x[methodName];
      if ('function' === typeof method) {
        ret[idx] = args ? method.apply(x, args) : method.call(x);
      }
    }, this);
    
    return ret;
  },

  /**
    Simply converts the enumerable into a genuine array.  The order is not 
    gauranteed.  Corresponds to the method implemented by Prototype.

    @returns {Array} the enumerable as an array.
  */
  toArray: function() {
    var ret = [];
    this.forEach(function(o, idx) { ret[idx] = o; });
    return ret ;
  },

  /**
    Generates a new array with the contents of the old array, sans any null
    values.

    @returns {Array}
  */
  compact: function() { return this.without(null); },

  /**
    Returns a new enumerable that excludes the passed value.  The default
    implementation returns an array regardless of the receiver type unless
    the receiver does not contain the value.

    @param {Object} value
    @returns {Ember.Enumerable}
  */
  without: function(value) {
    if (!this.contains(value)) return this; // nothing to do
    var ret = [] ;
    this.forEach(function(k) { 
      if (k !== value) ret[ret.length] = k;
    }) ;
    return ret ;
  },

  /**
    Returns a new enumerable that contains only unique values.  The default
    implementation returns an array regardless of the receiver type.
    
    @returns {Ember.Enumerable}
  */
  uniq: function() {
    var ret = [];
    this.forEach(function(k){
      if (ret.indexOf(k)<0) ret.push(k);
    });
    return ret;
  },

  /**
    This property will trigger anytime the enumerable's content changes.
    You can observe this property to be notified of changes to the enumerables
    content.

    For plain enumerables, this property is read only.  Ember.Array overrides
    this method.

    @property {Ember.Array}
  */
  '[]': Ember.computed(function(key, value) { 
    return this; 
  }).property().cacheable(),

  // ..........................................................
  // ENUMERABLE OBSERVERS
  // 
  
  /**
    Registers an enumerable observer.   Must implement Ember.EnumerableObserver
    mixin.
  */
  addEnumerableObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'enumerableWillChange',
        didChange  = (opts && opts.didChange) || 'enumerableDidChange';

    var hasObservers = get(this, 'hasEnumerableObservers');
    if (!hasObservers) Ember.propertyWillChange(this, 'hasEnumerableObservers');
    Ember.addListener(this, '@enumerable:before', target, willChange, xform);
    Ember.addListener(this, '@enumerable:change', target, didChange, xform);
    if (!hasObservers) Ember.propertyDidChange(this, 'hasEnumerableObservers');
    return this;
  },

  /**
    Removes a registered enumerable observer. 
  */
  removeEnumerableObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'enumerableWillChange',
        didChange  = (opts && opts.didChange) || 'enumerableDidChange';

    var hasObservers = get(this, 'hasEnumerableObservers');
    if (hasObservers) Ember.propertyWillChange(this, 'hasEnumerableObservers');
    Ember.removeListener(this, '@enumerable:before', target, willChange);
    Ember.removeListener(this, '@enumerable:change', target, didChange);
    if (hasObservers) Ember.propertyDidChange(this, 'hasEnumerableObservers');
    return this;
  },
  
  /**
    Becomes true whenever the array currently has observers watching changes
    on the array.
    
    @property {Boolean}
  */
  hasEnumerableObservers: Ember.computed(function() {
    return Ember.hasListeners(this, '@enumerable:change') || Ember.hasListeners(this, '@enumerable:before');
  }).property().cacheable(),
  
  
  /**
    Invoke this method just before the contents of your enumerable will 
    change.  You can either omit the parameters completely or pass the objects
    to be removed or added if available or just a count.
    
    @param {Ember.Enumerable|Number} removing
      An enumerable of the objects to be removed or the number of items to
      be removed.
      
    @param {Ember.Enumerable|Number} adding
      An enumerable of the objects to be added or the number of items to be
      added.
    
    @returns {Ember.Enumerable} receiver
  */
  enumerableContentWillChange: function(removing, adding) {
    
    var removeCnt, addCnt, hasDelta;

    if ('number' === typeof removing) removeCnt = removing;
    else if (removing) removeCnt = get(removing, 'length');
    else removeCnt = removing = -1;

    if ('number' === typeof adding) addCnt = adding;
    else if (adding) addCnt = get(adding,'length');
    else addCnt = adding = -1;
    
    hasDelta = addCnt<0 || removeCnt<0 || addCnt-removeCnt!==0;

    if (removing === -1) removing = null;
    if (adding   === -1) adding   = null;
    
    Ember.propertyWillChange(this, '[]');
    if (hasDelta) Ember.propertyWillChange(this, 'length');
    Ember.sendEvent(this, '@enumerable:before', removing, adding);

    return this;
  },
  
  /**
    Invoke this method when the contents of your enumerable has changed.
    This will notify any observers watching for content changes.  If your are
    implementing an ordered enumerable (such as an array), also pass the
    start and end values where the content changed so that it can be used to
    notify range observers.

    @param {Number} start 
      optional start offset for the content change.  For unordered 
      enumerables, you should always pass -1.
      
    @param {Enumerable} added
      optional enumerable containing items that were added to the set.  For
      ordered enumerables, this should be an ordered array of items.  If no
      items were added you can pass null.
    
    @param {Enumerable} removes
      optional enumerable containing items that were removed from the set. 
      For ordered enumerables, this hsould be an ordered array of items. If 
      no items were removed you can pass null.
      
    @returns {Object} receiver
  */
  enumerableContentDidChange: function(removing, adding) {
    var notify = this.propertyDidChange, removeCnt, addCnt, hasDelta;

    if ('number' === typeof removing) removeCnt = removing;
    else if (removing) removeCnt = get(removing, 'length');
    else removeCnt = removing = -1;

    if ('number' === typeof adding) addCnt = adding;
    else if (adding) addCnt = get(adding, 'length');
    else addCnt = adding = -1;
    
    hasDelta = addCnt<0 || removeCnt<0 || addCnt-removeCnt!==0;

    if (removing === -1) removing = null;
    if (adding   === -1) adding   = null;
    
    Ember.sendEvent(this, '@enumerable:change', removing, adding);
    if (hasDelta) Ember.propertyDidChange(this, 'length');
    Ember.propertyDidChange(this, '[]');

    return this ;
  }

}) ;




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ..........................................................
// HELPERS
// 

var get = Ember.get, set = Ember.set, meta = Ember.meta;

function none(obj) { return obj===null || obj===undefined; }

function xform(target, method, params) {
  method.call(target, params[0], params[2], params[3], params[4]);
}

// ..........................................................
// ARRAY
// 
/**
  @namespace

  This module implements Observer-friendly Array-like behavior.  This mixin is
  picked up by the Array class as well as other controllers, etc. that want to
  appear to be arrays.

  Unlike Ember.Enumerable, this mixin defines methods specifically for
  collections that provide index-ordered access to their contents.  When you
  are designing code that needs to accept any kind of Array-like object, you
  should use these methods instead of Array primitives because these will
  properly notify observers of changes to the array.

  Although these methods are efficient, they do add a layer of indirection to
  your application so it is a good idea to use them only when you need the
  flexibility of using both true JavaScript arrays and "virtual" arrays such
  as controllers and collections.

  You can use the methods defined in this module to access and modify array
  contents in a KVO-friendly way.  You can also be notified whenever the
  membership if an array changes by changing the syntax of the property to
  .observes('*myProperty.[]') .

  To support Ember.Array in your own class, you must override two
  primitives to use it: replace() and objectAt().

  Note that the Ember.Array mixin also incorporates the Ember.Enumerable mixin.  All
  Ember.Array-like objects are also enumerable.

  @extends Ember.Enumerable
  @since Ember 0.9.0
*/
Ember.Array = Ember.Mixin.create(Ember.Enumerable, /** @scope Ember.Array.prototype */ {

  /** @private - compatibility */
  isSCArray: true,
  
  /**
    @field {Number} length

    Your array must support the length property.  Your replace methods should
    set this property whenever it changes.
  */
  length: Ember.required(),

  /**
    This is one of the primitives you must implement to support Ember.Array.
    Returns the object at the named index.  If your object supports retrieving
    the value of an array item using get() (i.e. myArray.get(0)), then you do
    not need to implement this method yourself.

    @param {Number} idx
      The index of the item to return.  If idx exceeds the current length,
      return null.
  */
  objectAt: function(idx) {
    if ((idx < 0) || (idx>=get(this, 'length'))) return undefined ;
    return get(this, idx);
  },

  /** @private (nodoc) - overrides Ember.Enumerable version */
  nextObject: function(idx) {
    return this.objectAt(idx);
  },
  
  /**
    @field []

    This is the handler for the special array content property.  If you get
    this property, it will return this.  If you set this property it a new
    array, it will replace the current content.

    This property overrides the default property defined in Ember.Enumerable.
  */
  '[]': Ember.computed(function(key, value) {
    if (value !== undefined) this.replace(0, get(this, 'length'), value) ;
    return this ;
  }).property().cacheable(),

  /** @private (nodoc) - optimized version from Enumerable */
  contains: function(obj){
    return this.indexOf(obj) >= 0;
  },

  // Add any extra methods to Ember.Array that are native to the built-in Array.
  /**
    Returns a new array that is a slice of the receiver.  This implementation
    uses the observable array methods to retrieve the objects for the new
    slice.

    @param beginIndex {Integer} (Optional) index to begin slicing from.
    @param endIndex {Integer} (Optional) index to end the slice at.
    @returns {Array} New array with specified slice
  */
  slice: function(beginIndex, endIndex) {
    var ret = [];
    var length = get(this, 'length') ;
    if (none(beginIndex)) beginIndex = 0 ;
    if (none(endIndex) || (endIndex > length)) endIndex = length ;
    while(beginIndex < endIndex) {
      ret[ret.length] = this.objectAt(beginIndex++) ;
    }
    return ret ;
  },

  /**
    Returns the index for a particular object in the index.

    @param {Object} object the item to search for
    @param {NUmber} startAt optional starting location to search, default 0
    @returns {Number} index of -1 if not found
  */
  indexOf: function(object, startAt) {
    var idx, len = get(this, 'length');

    if (startAt === undefined) startAt = 0;
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx<len;idx++) {
      if (this.objectAt(idx, true) === object) return idx ;
    }
    return -1;
  },

  /**
    Returns the last index for a particular object in the index.

    @param {Object} object the item to search for
    @param {NUmber} startAt optional starting location to search, default 0
    @returns {Number} index of -1 if not found
  */
  lastIndexOf: function(object, startAt) {
    var idx, len = get(this, 'length');

    if (startAt === undefined) startAt = len-1;
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx>=0;idx--) {
      if (this.objectAt(idx) === object) return idx ;
    }
    return -1;
  },
  
  // ..........................................................
  // ARRAY OBSERVERS
  // 
  
  /**
    Adds an array observer to the receiving array.  The array observer object
    normally must implement two methods:
    
    * `arrayWillChange(start, removeCount, addCount)` - This method will be
      called just before the array is modified.
    * `arrayDidChange(start, removeCount, addCount)` - This method will be
      called just after the array is modified.
      
    Both callbacks will be passed the starting index of the change as well a 
    a count of the items to be removed and added.  You can use these callbacks
    to optionally inspect the array during the change, clear caches, or do 
    any other bookkeeping necessary.
    
    In addition to passing a target, you can also include an options hash 
    which you can use to override the method names that will be invoked on the
    target.
    
    @param {Object} target
      The observer object.
      
    @param {Hash} opts
      Optional hash of configuration options including willChange, didChange,
      and a context option.
      
    @returns {Ember.Array} receiver
  */
  addArrayObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'arrayWillChange',
        didChange  = (opts && opts.didChange) || 'arrayDidChange';

    var hasObservers = get(this, 'hasArrayObservers');
    if (!hasObservers) Ember.propertyWillChange(this, 'hasArrayObservers');
    Ember.addListener(this, '@array:before', target, willChange, xform);
    Ember.addListener(this, '@array:change', target, didChange, xform);
    if (!hasObservers) Ember.propertyDidChange(this, 'hasArrayObservers');
    return this;
  },
  
  /**
    Removes an array observer from the object if the observer is current 
    registered.  Calling this method multiple times with the same object will
    have no effect.
    
    @param {Object} target
      The object observing the array.
    
    @returns {Ember.Array} receiver
  */
  removeArrayObserver: function(target, opts) {
    var willChange = (opts && opts.willChange) || 'arrayWillChange',
        didChange  = (opts && opts.didChange) || 'arrayDidChange';

    var hasObservers = get(this, 'hasArrayObservers');
    if (hasObservers) Ember.propertyWillChange(this, 'hasArrayObservers');
    Ember.removeListener(this, '@array:before', target, willChange, xform);
    Ember.removeListener(this, '@array:change', target, didChange, xform);
    if (hasObservers) Ember.propertyDidChange(this, 'hasArrayObservers');
    return this;
  },
  
  /**
    Becomes true whenever the array currently has observers watching changes
    on the array.
    
    @property {Boolean}
  */
  hasArrayObservers: Ember.computed(function() {
    return Ember.hasListeners(this, '@array:change') || Ember.hasListeners(this, '@array:before');
  }).property().cacheable(),
  
  /**
    If you are implementing an object that supports Ember.Array, call this 
    method just before the array content changes to notify any observers and
    invalidate any related properties.  Pass the starting index of the change
    as well as a delta of the amounts to change.
    
    @param {Number} startIdx
      The starting index in the array that will change.
      
    @param {Number} removeAmt
      The number of items that will be removed.  If you pass null assumes 0
    
    @param {Number} addAmt
      The number of items that will be added.  If you pass null assumes 0.
      
    @returns {Ember.Array} receiver
  */
  arrayContentWillChange: function(startIdx, removeAmt, addAmt) {

    // if no args are passed assume everything changes
    if (startIdx===undefined) {
      startIdx = 0;
      removeAmt = addAmt = -1;
    } else {
      if (!removeAmt) removeAmt=0;
      if (!addAmt) addAmt=0;
    }

    Ember.sendEvent(this, '@array:before', startIdx, removeAmt, addAmt);

    var removing, lim;
    if (startIdx>=0 && removeAmt>=0 && get(this, 'hasEnumerableObservers')) {
      removing = [];
      lim = startIdx+removeAmt;
      for(var idx=startIdx;idx<lim;idx++) removing.push(this.objectAt(idx));
    } else {
      removing = removeAmt;
    }
    
    this.enumerableContentWillChange(removing, addAmt);

    // Make sure the @each proxy is set up if anyone is observing @each
    if (Ember.isWatching(this, '@each')) { get(this, '@each'); }
    return this;
  },
  
  arrayContentDidChange: function(startIdx, removeAmt, addAmt) {

    // if no args are passed assume everything changes
    if (startIdx===undefined) {
      startIdx = 0;
      removeAmt = addAmt = -1;
    } else {
      if (!removeAmt) removeAmt=0;
      if (!addAmt) addAmt=0;
    }
    
    var adding, lim;
    if (startIdx>=0 && addAmt>=0 && get(this, 'hasEnumerableObservers')) {
      adding = [];
      lim = startIdx+addAmt;
      for(var idx=startIdx;idx<lim;idx++) adding.push(this.objectAt(idx));
    } else {
      adding = addAmt;
    }

    this.enumerableContentDidChange(removeAmt, adding);
    Ember.sendEvent(this, '@array:change', startIdx, removeAmt, addAmt);
    return this;
  },
  
  // ..........................................................
  // ENUMERATED PROPERTIES
  // 
  
  /**
    Returns a special object that can be used to observe individual properties
    on the array.  Just get an equivalent property on this object and it will
    return an enumerable that maps automatically to the named key on the 
    member objects.
  */
  '@each': Ember.computed(function() {
    if (!this.__each) this.__each = new Ember.EachProxy(this);
    return this.__each;
  }).property().cacheable()
  
  
  
}) ;




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @class

  This mixin defines the API for modifying generic enumerables.  These methods
  can be applied to an object regardless of whether it is ordered or 
  unordered.
  
  Note that an Enumerable can change even if it does not implement this mixin.
  For example, a MappedEnumerable cannot be directly modified but if its 
  underlying enumerable changes, it will change also.

  ## Adding Objects
  
  To add an object to an enumerable, use the addObject() method.  This 
  method will only add the object to the enumerable if the object is not 
  already present and the object if of a type supported by the enumerable.
  
      javascript:
      set.addObject(contact);
      
  ## Removing Objects
  
  To remove an object form an enumerable, use the removeObject() method.  This
  will only remove the object if it is already in the enumerable, otherwise
  this method has no effect.
  
      javascript:
      set.removeObject(contact);
      
  ## Implementing In Your Own Code
  
  If you are implementing an object and want to support this API, just include
  this mixin in your class and implement the required methods.  In your unit
  tests, be sure to apply the Ember.MutableEnumerableTests to your object.
  
  @extends Ember.Mixin
  @extends Ember.Enumerable
*/
Ember.MutableEnumerable = Ember.Mixin.create(Ember.Enumerable, 
  /** @scope Ember.MutableEnumerable.prototype */ {
  
  /**
    __Required.__ You must implement this method to apply this mixin.
    
    Attempts to add the passed object to the receiver if the object is not 
    already present in the collection. If the object is present, this method
    has no effect. 
    
    If the passed object is of a type not supported by the receiver (for 
    example if you pass an object to an IndexSet) then this method should 
    raise an exception.
    
    @param {Object} object
      The object to add to the enumerable.
      
    @returns {Object} the passed object
  */
  addObject: Ember.required(Function),

  /**
    Adds each object in the passed enumerable to the receiver.

    @param {Ember.Enumerable} objects the objects to remove
    @returns {Object} receiver
  */
  addObjects: function(objects) {
    Ember.beginPropertyChanges(this);
    objects.forEach(function(obj) { this.addObject(obj); }, this);
    Ember.endPropertyChanges(this);
    return this;
  },

  /**
    __Required.__ You must implement this method to apply this mixin.
    
    Attempts to remove the passed object from the receiver collection if the
    object is in present in the collection.  If the object is not present,
    this method has no effect.
    
    If the passed object is of a type not supported by the receiver (for 
    example if you pass an object to an IndexSet) then this method should 
    raise an exception.
    
    @param {Object} object
      The object to remove from the enumerable.
      
    @returns {Object} the passed object
  */
  removeObject: Ember.required(Function),
  
  
  /**
    Removes each objects in the passed enumerable from the receiver.

    @param {Ember.Enumerable} objects the objects to remove
    @returns {Object} receiver
  */
  removeObjects: function(objects) {
    Ember.beginPropertyChanges(this);
    objects.forEach(function(obj) { this.removeObject(obj); }, this);
    Ember.endPropertyChanges(this);
    return this;
  }
    
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ..........................................................
// CONSTANTS
// 

var OUT_OF_RANGE_EXCEPTION = "Index out of range" ;
var EMPTY = [];

// ..........................................................
// HELPERS
// 

var get = Ember.get, set = Ember.set;

/**
  @class

  This mixin defines the API for modifying array-like objects.  These methods
  can be applied only to a collection that keeps its items in an ordered set.
  
  Note that an Array can change even if it does not implement this mixin.
  For example, a SparyArray may not be directly modified but if its 
  underlying enumerable changes, it will change also.

  @extends Ember.Mixin
  @extends Ember.Array
  @extends Ember.MutableEnumerable
*/
Ember.MutableArray = Ember.Mixin.create(Ember.Array, Ember.MutableEnumerable,
  /** @scope Ember.MutableArray.prototype */ {

  /**
    __Required.__ You must implement this method to apply this mixin.

    This is one of the primitves you must implement to support Ember.Array.  You
    should replace amt objects started at idx with the objects in the passed
    array.  You should also call this.enumerableContentDidChange() ;

    @param {Number} idx
      Starting index in the array to replace.  If idx >= length, then append 
      to the end of the array.

    @param {Number} amt
      Number of elements that should be removed from the array, starting at
      *idx*.

    @param {Array} objects
      An array of zero or more objects that should be inserted into the array 
      at *idx*
  */
  replace: Ember.required(),

  /**
    This will use the primitive replace() method to insert an object at the
    specified index.

    @param {Number} idx index of insert the object at.
    @param {Object} object object to insert
  */
  insertAt: function(idx, object) {
    if (idx > get(this, 'length')) throw new Error(OUT_OF_RANGE_EXCEPTION) ;
    this.replace(idx, 0, [object]) ;
    return this ;
  },

  /**
    Remove an object at the specified index using the replace() primitive
    method.  You can pass either a single index, a start and a length or an
    index set.

    If you pass a single index or a start and length that is beyond the
    length this method will throw an Ember.OUT_OF_RANGE_EXCEPTION

    @param {Number|Ember.IndexSet} start index, start of range, or index set
    @param {Number} len length of passing range
    @returns {Object} receiver
  */
  removeAt: function(start, len) {

    var delta = 0;

    if ('number' === typeof start) {

      if ((start < 0) || (start >= get(this, 'length'))) {
        throw new Error(OUT_OF_RANGE_EXCEPTION);
      }

      // fast case
      if (len === undefined) len = 1;
      this.replace(start, len, EMPTY);
    }

    // TODO: Reintroduce Ember.IndexSet support
    // this.beginPropertyChanges();
    // start.forEachRange(function(start, length) {
    //   start -= delta ;
    //   delta += length ;
    //   this.replace(start, length, empty); // remove!
    // }, this);
    // this.endPropertyChanges();

    return this ;
  },

  /**
    Push the object onto the end of the array.  Works just like push() but it
    is KVO-compliant.
  */
  pushObject: function(obj) {
    this.insertAt(get(this, 'length'), obj) ;
    return obj ;
  },


  /**
    Add the objects in the passed numerable to the end of the array.  Defers
    notifying observers of the change until all objects are added.

    @param {Ember.Enumerable} objects the objects to add
    @returns {Ember.Array} receiver
  */
  pushObjects: function(objects) {
    this.replace(get(this, 'length'), 0, objects);
    return this;
  },

  /**
    Pop object from array or nil if none are left.  Works just like pop() but
    it is KVO-compliant.
  */
  popObject: function() {
    var len = get(this, 'length') ;
    if (len === 0) return null ;

    var ret = this.objectAt(len-1) ;
    this.removeAt(len-1, 1) ;
    return ret ;
  },

  /**
    Shift an object from start of array or nil if none are left.  Works just
    like shift() but it is KVO-compliant.
  */
  shiftObject: function() {
    if (get(this, 'length') === 0) return null ;
    var ret = this.objectAt(0) ;
    this.removeAt(0) ;
    return ret ;
  },

  /**
    Unshift an object to start of array.  Works just like unshift() but it is
    KVO-compliant.
  */
  unshiftObject: function(obj) {
    this.insertAt(0, obj) ;
    return obj ;
  },


  /**
    Adds the named objects to the beginning of the array.  Defers notifying
    observers until all objects have been added.

    @param {Ember.Enumerable} objects the objects to add
    @returns {Ember.Array} receiver
  */
  unshiftObjects: function(objects) {
    this.beginPropertyChanges();
    objects.forEach(function(obj) { this.unshiftObject(obj); }, this);
    this.endPropertyChanges();
    return this;
  },
  
  // ..........................................................
  // IMPLEMENT Ember.MutableEnumerable
  // 

  /** @private (nodoc) */
  removeObject: function(obj) {
    var loc = get(this, 'length') || 0;
    while(--loc >= 0) {
      var curObject = this.objectAt(loc) ;
      if (curObject === obj) this.removeAt(loc) ;
    }
    return this ;
  },
  
  /** @private (nodoc) */
  addObject: function(obj) {
    if (!this.contains(obj)) this.pushObject(obj);
    return this ;
  }
    
});


})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get, set = Ember.set;
  
/**
  @class

  Restores some of the Ember 1.x Ember.Observable mixin API.  The new property 
  observing system does not require Ember.Observable to be applied anymore.
  Instead, on most browsers you can just access properties directly.  For
  code that needs to run on IE7 or IE8 you should use Ember.get() and Ember.set()
  instead.
  
  If you have older code and you want to bring back the older Ember 1.x observable
  API, you can do so by readding Ember.Observable to Ember.Object like so:
  
      Ember.Object.reopen(Ember.Observable);
    
  You will then be able to use the traditional get(), set() and other 
  observable methods on your objects.

  @extends Ember.Mixin
*/
Ember.Observable = Ember.Mixin.create(/** @scope Ember.Observable.prototype */ {

  /** @private - compatibility */
  isObserverable: true,
  
  /**
    Retrieves the value of key from the object.

    This method is generally very similar to using object[key] or object.key,
    however it supports both computed properties and the unknownProperty
    handler.

    ## Computed Properties

    Computed properties are methods defined with the property() modifier
    declared at the end, such as:

          fullName: function() {
            return this.getEach('firstName', 'lastName').compact().join(' ');
          }.property('firstName', 'lastName')

    When you call get() on a computed property, the property function will be
    called and the return value will be returned instead of the function
    itself.

    ## Unknown Properties

    Likewise, if you try to call get() on a property whose values is
    undefined, the unknownProperty() method will be called on the object.
    If this method reutrns any value other than undefined, it will be returned
    instead. This allows you to implement "virtual" properties that are
    not defined upfront.

    @param {String} key The property to retrieve
    @returns {Object} The property value or undefined.
  */
  get: function(keyName) {
    return get(this, keyName);
  },

  /**
    To get multiple properties at once, call getProperties
    with a list of strings:

          record.getProperties('firstName', 'lastName', 'zipCode');

    @param {String...} list of keys to get
    @returns {Hash}
  */
  getProperties: function() {
    var ret = {};
    for(var i = 0; i < arguments.length; i++) {
      ret[arguments[i]] = get(this, arguments[i]);
    }
    return ret;
  },
  
  /**
    Sets the key equal to value.

    This method is generally very similar to calling object[key] = value or
    object.key = value, except that it provides support for computed
    properties, the unknownProperty() method and property observers.

    ## Computed Properties

    If you try to set a value on a key that has a computed property handler
    defined (see the get() method for an example), then set() will call
    that method, passing both the value and key instead of simply changing
    the value itself. This is useful for those times when you need to
    implement a property that is composed of one or more member
    properties.

    ## Unknown Properties

    If you try to set a value on a key that is undefined in the target
    object, then the unknownProperty() handler will be called instead. This
    gives you an opportunity to implement complex "virtual" properties that
    are not predefined on the obejct. If unknownProperty() returns
    undefined, then set() will simply set the value on the object.

    ## Property Observers

    In addition to changing the property, set() will also register a
    property change with the object. Unless you have placed this call
    inside of a beginPropertyChanges() and endPropertyChanges(), any "local"
    observers (i.e. observer methods declared on the same object), will be
    called immediately. Any "remote" observers (i.e. observer methods
    declared on another object) will be placed in a queue and called at a
    later time in a coelesced manner.

    ## Chaining

    In addition to property changes, set() returns the value of the object
    itself so you can do chaining like this:

          record.set('firstName', 'Charles').set('lastName', 'Jolley');

    @param {String} key The property to set
    @param {Object} value The value to set or null.
    @returns {Ember.Observable}
  */
  set: function(keyName, value) {
    set(this, keyName, value);
    return this;
  },
  
  /**
    To set multiple properties at once, call setProperties
    with a Hash:

          record.setProperties({ firstName: 'Charles', lastName: 'Jolley' });

    @param {Hash} hash the hash of keys and values to set
    @returns {Ember.Observable}
  */
  setProperties: function(hash) {
    Ember.beginPropertyChanges(this);
    for(var prop in hash) {
      if (hash.hasOwnProperty(prop)) set(this, prop, hash[prop]);
    }
    Ember.endPropertyChanges(this);
    return this;
  },

  /**
    Begins a grouping of property changes.

    You can use this method to group property changes so that notifications
    will not be sent until the changes are finished. If you plan to make a
    large number of changes to an object at one time, you should call this
    method at the beginning of the changes to suspend change notifications.
    When you are done making changes, call endPropertyChanges() to allow
    notification to resume.

    @returns {Ember.Observable}
  */
  beginPropertyChanges: function() {
    Ember.beginPropertyChanges();
    return this;
  },
  
  /**
    Ends a grouping of property changes.

    You can use this method to group property changes so that notifications
    will not be sent until the changes are finished. If you plan to make a
    large number of changes to an object at one time, you should call
    beginPropertyChanges() at the beginning of the changes to suspend change
    notifications. When you are done making changes, call this method to allow
    notification to resume.

    @returns {Ember.Observable}
  */
  endPropertyChanges: function() {
    Ember.endPropertyChanges();
    return this;
  },
  
  /**
    Notify the observer system that a property is about to change.

    Sometimes you need to change a value directly or indirectly without
    actually calling get() or set() on it. In this case, you can use this
    method and propertyDidChange() instead. Calling these two methods
    together will notify all observers that the property has potentially
    changed value.

    Note that you must always call propertyWillChange and propertyDidChange as
    a pair. If you do not, it may get the property change groups out of order
    and cause notifications to be delivered more often than you would like.

    @param {String} key The property key that is about to change.
    @returns {Ember.Observable}
  */
  propertyWillChange: function(keyName){
    Ember.propertyWillChange(this, keyName);
    return this;
  },
  
  /**
    Notify the observer system that a property has just changed.

    Sometimes you need to change a value directly or indirectly without
    actually calling get() or set() on it. In this case, you can use this
    method and propertyWillChange() instead. Calling these two methods
    together will notify all observers that the property has potentially
    changed value.

    Note that you must always call propertyWillChange and propertyDidChange as
    a pair. If you do not, it may get the property change groups out of order
    and cause notifications to be delivered more often than you would like.

    @param {String} key The property key that has just changed.
    @param {Object} value The new value of the key. May be null.
    @param {Boolean} _keepCache Private property
    @returns {Ember.Observable}
  */
  propertyDidChange: function(keyName) {
    Ember.propertyDidChange(this, keyName);
    return this;
  },
  
  notifyPropertyChange: function(keyName) {
    this.propertyWillChange(keyName);
    this.propertyDidChange(keyName);
    return this;
  }, 

  /**
    Adds an observer on a property.

    This is the core method used to register an observer for a property.

    Once you call this method, anytime the key's value is set, your observer
    will be notified. Note that the observers are triggered anytime the
    value is set, regardless of whether it has actually changed. Your
    observer should be prepared to handle that.

    You can also pass an optional context parameter to this method. The
    context will be passed to your observer method whenever it is triggered.
    Note that if you add the same target/method pair on a key multiple times
    with different context parameters, your observer will only be called once
    with the last context you passed.

    ## Observer Methods

    Observer methods you pass should generally have the following signature if
    you do not pass a "context" parameter:

          fooDidChange: function(sender, key, value, rev);

    The sender is the object that changed. The key is the property that
    changes. The value property is currently reserved and unused. The rev
    is the last property revision of the object when it changed, which you can
    use to detect if the key value has really changed or not.

    If you pass a "context" parameter, the context will be passed before the
    revision like so:

          fooDidChange: function(sender, key, value, context, rev);

    Usually you will not need the value, context or revision parameters at
    the end. In this case, it is common to write observer methods that take
    only a sender and key value as parameters or, if you aren't interested in
    any of these values, to write an observer that has no parameters at all.

    @param {String} key The key to observer
    @param {Object} target The target object to invoke
    @param {String|Function} method The method to invoke.
    @returns {Ember.Object} self
  */
  addObserver: function(key, target, method) {
    Ember.addObserver(this, key, target, method);
  },
  
  /**
    Remove an observer you have previously registered on this object. Pass
    the same key, target, and method you passed to addObserver() and your
    target will no longer receive notifications.

    @param {String} key The key to observer
    @param {Object} target The target object to invoke
    @param {String|Function} method The method to invoke.
    @returns {Ember.Observable} reciever
  */
  removeObserver: function(key, target, method) {
    Ember.removeObserver(this, key, target, method);
  },
  
  /**
    Returns YES if the object currently has observers registered for a
    particular key. You can use this method to potentially defer performing
    an expensive action until someone begins observing a particular property
    on the object.

    @param {String} key Key to check
    @returns {Boolean}
  */
  hasObserverFor: function(key) {
    return Ember.hasListeners(this, key+':change');
  },

  unknownProperty: function(key) {
    return undefined;
  },
  
  setUnknownProperty: function(key, value) {
    this[key] = value;
  },
  
  getPath: function(path) {
    return Ember.getPath(this, path);
  },
  
  setPath: function(path, value) {
    Ember.setPath(this, path, value);
    return this;
  },
  
  incrementProperty: function(keyName, increment) {
    if (!increment) { increment = 1; }
    set(this, keyName, (get(this, keyName) || 0)+increment);
    return get(this, keyName);
  },
  
  decrementProperty: function(keyName, increment) {
    if (!increment) { increment = 1; }
    set(this, keyName, (get(this, keyName) || 0)-increment);
    return get(this, keyName);
  },
  
  toggleProperty: function(keyName) {
    set(this, keyName, !get(this, keyName));
    return get(this, keyName);
  },
  
  observersForKey: function(keyName) {
    return Ember.observersFor(this, keyName);
  }
    
});




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



// NOTE: this object should never be included directly.  Instead use Ember.
// Ember.Object.  We only define this separately so that Ember.Set can depend on it



var rewatch = Ember.rewatch;
var classToString = Ember.Mixin.prototype.toString;
var set = Ember.set, get = Ember.get;
var o_create = Ember.platform.create,
    meta = Ember.meta;

function makeCtor() {

  // Note: avoid accessing any properties on the object since it makes the
  // method a lot faster.  This is glue code so we want it to be as fast as
  // possible.

  var isPrepared = false, initMixins, init = false, hasChains = false;

  var Class = function() {
    if (!isPrepared) { get(Class, 'proto'); } // prepare prototype...
    if (initMixins) {
      this.reopen.apply(this, initMixins);
      initMixins = null;
      rewatch(this); // Ã¥lways rewatch just in case
      this.init.apply(this, arguments);
    } else {
      if (hasChains) {
        rewatch(this);
      } else {
        this[Ember.GUID_KEY] = undefined;
      }
      if (init===false) { init = this.init; } // cache for later instantiations
      init.apply(this, arguments);
    }
  };

  Class.toString = classToString;
  Class._prototypeMixinDidChange = function() { isPrepared = false; };
  Class._initMixins = function(args) { initMixins = args; };

  Ember.defineProperty(Class, 'proto', Ember.computed(function() {
    if (!isPrepared) {
      isPrepared = true;
      Class.PrototypeMixin.applyPartial(Class.prototype);
      hasChains = !!meta(Class.prototype, false).chains; // avoid rewatch
    }
    return this.prototype;
  }));

  return Class;

}

var CoreObject = makeCtor();

CoreObject.PrototypeMixin = Ember.Mixin.create({

  reopen: function() {
    Ember.Mixin._apply(this, arguments, true);
    return this;
  },

  isInstance: true,

  init: function() {},

  isDestroyed: false,

  /**
    Destroys an object by setting the isDestroyed flag and removing its
    metadata, which effectively destroys observers and bindings.

    If you try to set a property on a destroyed object, an exception will be
    raised.

    Note that destruction is scheduled for the end of the run loop and does not
    happen immediately.

    @returns {Ember.Object} receiver
  */
  destroy: function() {
    set(this, 'isDestroyed', true);
    Ember.run.schedule('destroy', this, this._scheduledDestroy);
    return this;
  },

  /**
    Invoked by the run loop to actually destroy the object. This is
    scheduled for execution by the `destroy` method.

    @private
  */
  _scheduledDestroy: function() {
    this[Ember.META_KEY] = null;
  },

  bind: function(to, from) {
    if (!(from instanceof Ember.Binding)) { from = Ember.Binding.from(from); }
    from.to(to).connect(this);
    return from;
  },

  toString: function() {
    return '<'+this.constructor.toString()+':'+Ember.guidFor(this)+'>';
  }
});

CoreObject.__super__ = null;

var ClassMixin = Ember.Mixin.create({

  ClassMixin: Ember.required(),

  PrototypeMixin: Ember.required(),

  isClass: true,

  isMethod: false,

  extend: function() {
    var Class = makeCtor(), proto;
    Class.ClassMixin = Ember.Mixin.create(this.ClassMixin);
    Class.PrototypeMixin = Ember.Mixin.create(this.PrototypeMixin);

    Class.ClassMixin.ownerConstructor = Class;
    Class.PrototypeMixin.ownerConstructor = Class;

    var PrototypeMixin = Class.PrototypeMixin;
    PrototypeMixin.reopen.apply(PrototypeMixin, arguments);

    Class.superclass = this;
    Class.__super__  = this.prototype;

    proto = Class.prototype = o_create(this.prototype);
    proto.constructor = Class;
    Ember.generateGuid(proto, 'ember');
    meta(proto).proto = proto; // this will disable observers on prototype
    Ember.rewatch(proto); // setup watch chains if needed.


    Class.subclasses = Ember.Set ? new Ember.Set() : null;
    if (this.subclasses) { this.subclasses.add(Class); }

    Class.ClassMixin.apply(Class);
    return Class;
  },

  create: function() {
    var C = this;
    if (arguments.length>0) { this._initMixins(arguments); }
    return new C();
  },

  reopen: function() {
    var PrototypeMixin = this.PrototypeMixin;
    PrototypeMixin.reopen.apply(PrototypeMixin, arguments);
    this._prototypeMixinDidChange();
    return this;
  },

  reopenClass: function() {
    var ClassMixin = this.ClassMixin;
    ClassMixin.reopen.apply(ClassMixin, arguments);
    Ember.Mixin._apply(this, arguments, false);
    return this;
  },

  detect: function(obj) {
    if ('function' !== typeof obj) { return false; }
    while(obj) {
      if (obj===this) { return true; }
      obj = obj.superclass;
    }
    return false;
  },

  detectInstance: function(obj) {
    return this.PrototypeMixin.detect(obj);
  }

});

CoreObject.ClassMixin = ClassMixin;
ClassMixin.apply(CoreObject);

Ember.CoreObject = CoreObject;




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ENV ember_assert */
// ........................................
// GLOBAL CONSTANTS
//

/**
  @name YES
  @static
  @type Boolean
  @default true
  @constant
*/
YES = true;

/**
  @name NO
  @static
  @type Boolean
  @default NO
  @constant
*/
NO = false;

// ensure no undefined errors in browsers where console doesn't exist
if (typeof console === 'undefined') {
  window.console = {};
  console.log = console.info = console.warn = console.error = function() {};
}

// ..........................................................
// BOOTSTRAP
// 

/**
  @static
  @type Boolean
  @default YES
  @constant
  
  Determines whether Ember should enhances some built-in object 
  prototypes to provide a more friendly API.  If enabled, a few methods 
  will be added to Function, String, and Array.  Object.prototype will not be
  enhanced, which is the one that causes most troubles for people.
  
  In general we recommend leaving this option set to true since it rarely
  conflicts with other code.  If you need to turn it off however, you can
  define an ENV.EXTEND_PROTOTYPES config to disable it.
*/  
Ember.EXTEND_PROTOTYPES = (Ember.ENV.EXTEND_PROTOTYPES !== false);

// ........................................
// TYPING & ARRAY MESSAGING
//

var TYPE_MAP = {};
var t ="Boolean Number String Function Array Date RegExp Object".split(" ");
t.forEach(function(name) {
	TYPE_MAP[ "[object " + name + "]" ] = name.toLowerCase();
});

var toString = Object.prototype.toString;

/**
  Returns a consistent type for the passed item.

  Use this instead of the built-in Ember.typeOf() to get the type of an item.
  It will return the same result across all browsers and includes a bit
  more detail.  Here is what will be returned:

  | Return Value Constant | Meaning |
  | 'string' | String primitive |
  | 'number' | Number primitive |
  | 'boolean' | Boolean primitive |
  | 'null' | Null value |
  | 'undefined' | Undefined value |
  | 'function' | A function |
  | 'array' | An instance of Array |
  | 'class' | A Ember class (created using Ember.Object.extend()) |
  | 'instance' | A Ember object instance |
  | 'error' | An instance of the Error object |
  | 'object' | A JavaScript object not inheriting from Ember.Object |

  @param item {Object} the item to check
  @returns {String} the type
*/
Ember.typeOf = function(item) {
  var ret;
  
  ret = item==null ? String(item) : TYPE_MAP[toString.call(item)]||'object';

  if (ret === 'function') {
    if (Ember.Object && Ember.Object.detect(item)) ret = 'class';
  } else if (ret === 'object') {
    if (item instanceof Error) ret = 'error';
    else if (Ember.Object && item instanceof Ember.Object) ret = 'instance';
    else ret = 'object';
  }
  
  return ret;
};

/**
  Returns YES if the passed value is null or undefined.  This avoids errors
  from JSLint complaining about use of ==, which can be technically
  confusing.

  @param {Object} obj Value to test
  @returns {Boolean}
*/
Ember.none = function(obj) {
  return obj === null || obj === undefined;
};

/**
  Verifies that a value is either null or an empty string. Return false if
  the object is not a string.

  @param {Object} obj Value to test
  @returns {Boolean}
*/
Ember.empty = function(obj) {
  return obj === null || obj === undefined || obj === '';
};

/**
  Ember.isArray defined in ember-metal/lib/utils
**/

/**
 This will compare two javascript values of possibly different types.
 It will tell you which one is greater than the other by returning:

  - -1 if the first is smaller than the second,
  - 0 if both are equal,
  - 1 if the first is greater than the second.

 The order is calculated based on Ember.ORDER_DEFINITION, if types are different.
 In case they have the same type an appropriate comparison for this type is made.

 @param {Object} v First value to compare
 @param {Object} w Second value to compare
 @returns {Number} -1 if v < w, 0 if v = w and 1 if v > w.
*/
Ember.compare = function (v, w) {
  if (v === w) { return 0; }

  var type1 = Ember.typeOf(v);
  var type2 = Ember.typeOf(w);

  var Comparable = Ember.Comparable;
  if (Comparable) {
    if (type1==='instance' && Comparable.detect(v.constructor)) {
      return v.constructor.compare(v, w);
    }
    
    if (type2 === 'instance' && Comparable.detect(w.constructor)) {
      return 1-w.constructor.compare(w, v);
    }
  }

  // If we haven't yet generated a reverse-mapping of Ember.ORDER_DEFINITION,
  // do so now.
  var mapping = Ember.ORDER_DEFINITION_MAPPING;
  if (!mapping) {
    var order = Ember.ORDER_DEFINITION;
    mapping = Ember.ORDER_DEFINITION_MAPPING = {};
    var idx, len;
    for (idx = 0, len = order.length; idx < len;  ++idx) {
      mapping[order[idx]] = idx;
    }

    // We no longer need Ember.ORDER_DEFINITION.
    delete Ember.ORDER_DEFINITION;
  }

  var type1Index = mapping[type1];
  var type2Index = mapping[type2];

  if (type1Index < type2Index) { return -1; }
  if (type1Index > type2Index) { return 1; }

  // types are equal - so we have to check values now
  switch (type1) {
    case 'boolean':
    case 'number':
      if (v < w) { return -1; }
      if (v > w) { return 1; }
      return 0;

    case 'string':
      var comp = v.localeCompare(w);
      if (comp < 0) { return -1; }
      if (comp > 0) { return 1; }
      return 0;

    case 'array':
      var vLen = v.length;
      var wLen = w.length;
      var l = Math.min(vLen, wLen);
      var r = 0;
      var i = 0;
      var thisFunc = arguments.callee;
      while (r === 0 && i < l) {
        r = thisFunc(v[i],w[i]);
        i++;
      }
      if (r !== 0) { return r; }

      // all elements are equal now
      // shorter array should be ordered first
      if (vLen < wLen) { return -1; }
      if (vLen > wLen) { return 1; }
      // arrays are equal now
      return 0;

    case 'instance':
      if (Ember.Comparable && Ember.Comparable.detect(v)) { 
        return v.compare(v, w); 
      }
      return 0;

    default:
      return 0;
  }
};

function _copy(obj, deep, seen, copies) {
  var ret, loc, key;

  // primitive data types are immutable, just return them.
  if ('object' !== typeof obj || obj===null) return obj;

  // avoid cyclical loops
  if (deep && (loc=seen.indexOf(obj))>=0) return copies[loc];
  
  ember_assert('Cannot clone an Ember.Object that does not implement Ember.Copyable', !(obj instanceof Ember.Object) || (Ember.Copyable && Ember.Copyable.detect(obj)));

  // IMPORTANT: this specific test will detect a native array only.  Any other
  // object will need to implement Copyable.
  if (Ember.typeOf(obj) === 'array') {
    ret = obj.slice();
    if (deep) {
      loc = ret.length;
      while(--loc>=0) ret[loc] = _copy(ret[loc], deep, seen, copies);
    }
  } else if (Ember.Copyable && Ember.Copyable.detect(obj)) {
    ret = obj.copy(deep, seen, copies);
  } else {
    ret = {};
    for(key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      ret[key] = deep ? _copy(obj[key], deep, seen, copies) : obj[key];
    }
  }
  
  if (deep) {
    seen.push(obj);
    copies.push(ret);
  }

  return ret;
}

/**
  Creates a clone of the passed object. This function can take just about
  any type of object and create a clone of it, including primitive values
  (which are not actually cloned because they are immutable).

  If the passed object implements the clone() method, then this function
  will simply call that method and return the result.

  @param {Object} object The object to clone
  @param {Boolean} deep If true, a deep copy of the object is made
  @returns {Object} The cloned object
*/
Ember.copy = function(obj, deep) {
  // fast paths
  if ('object' !== typeof obj || obj===null) return obj; // can't copy primitives
  if (Ember.Copyable && Ember.Copyable.detect(obj)) return obj.copy(deep);
  return _copy(obj, deep, deep ? [] : null, deep ? [] : null);
};

/**
  Convenience method to inspect an object. This method will attempt to
  convert the object into a useful string description.

  @param {Object} obj The object you want to inspect.
  @returns {String} A description of the object
*/
Ember.inspect = function(obj) {
  var v, ret = [];
  for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      v = obj[key];
      if (v === 'toString') { continue; } // ignore useless items
      if (Ember.typeOf(v) === 'function') { v = "function() { ... }"; }
      ret.push(key + ": " + v);
    }
  }
  return "{" + ret.join(" , ") + "}";
};

/**
  Compares two objects, returning true if they are logically equal.  This is 
  a deeper comparison than a simple triple equal.  For arrays and enumerables
  it will compare the internal objects.  For any other object that implements
  `isEqual()` it will respect that method.
  
  @param {Object} a first object to compare
  @param {Object} b second object to compare
  @returns {Boolean}
*/
Ember.isEqual = function(a, b) {
  if (a && 'function'===typeof a.isEqual) return a.isEqual(b);
  return a === b;
};

/**
  @private
  Used by Ember.compare
*/
Ember.ORDER_DEFINITION = Ember.ENV.ORDER_DEFINITION || [
  'undefined',
  'null',
  'boolean',
  'number',
  'string',
  'array',
  'object',
  'instance',
  'function',
  'class'
];

/**
  Returns all of the keys defined on an object or hash. This is useful
  when inspecting objects for debugging.  On browsers that support it, this
  uses the native Object.keys implementation.

  @function
  @param {Object} obj
  @returns {Array} Array containing keys of obj
*/
Ember.keys = Object.keys;

if (!Ember.keys) {
  Ember.keys = function(obj) {
    var ret = [];
    for(var key in obj) {
      if (obj.hasOwnProperty(key)) { ret.push(key); }
    }
    return ret;
  };
}

// ..........................................................
// ERROR
// 

/**
  @class

  A subclass of the JavaScript Error object for use in Ember.
*/
Ember.Error = function() {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }
  this.message = tmp.message;
};

Ember.Error.prototype = Ember.create(Error.prototype);

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================





/** @private **/
var STRING_DASHERIZE_REGEXP = (/[ _]/g);
var STRING_DASHERIZE_CACHE = {};
var STRING_DECAMELIZE_REGEXP = (/([a-z])([A-Z])/g);
  
/**
  Defines the hash of localized strings for the current language.  Used by 
  the `Ember.String.loc()` helper.  To localize, add string values to this
  hash.
  
  @property {String}
*/
Ember.STRINGS = {};

/**
  Defines string helper methods including string formatting and localization.
  Unless Ember.EXTEND_PROTOTYPES = false these methods will also be added to the
  String.prototype as well.
  
  @namespace
*/
Ember.String = {

  /**
    Apply formatting options to the string.  This will look for occurrences
    of %@ in your string and substitute them with the arguments you pass into
    this method.  If you want to control the specific order of replacement,
    you can add a number after the key as well to indicate which argument
    you want to insert.

    Ordered insertions are most useful when building loc strings where values
    you need to insert may appear in different orders.

    ## Examples

        "Hello %@ %@".fmt('John', 'Doe') => "Hello John Doe"
        "Hello %@2, %@1".fmt('John', 'Doe') => "Hello Doe, John"

    @param {Object...} [args]
    @returns {String} formatted string
  */
  fmt: function(str, formats) {
    // first, replace any ORDERED replacements.
    var idx  = 0; // the current index for non-numerical replacements
    return str.replace(/%@([0-9]+)?/g, function(s, argIndex) {
      argIndex = (argIndex) ? parseInt(argIndex,0) - 1 : idx++ ;
      s = formats[argIndex];
      return ((s === null) ? '(null)' : (s === undefined) ? '' : s).toString();
    }) ;
  },

  /**
    Formats the passed string, but first looks up the string in the localized
    strings hash.  This is a convenient way to localize text.  See 
    `Ember.String.fmt()` for more information on formatting.
    
    Note that it is traditional but not required to prefix localized string
    keys with an underscore or other character so you can easily identify
    localized strings.
    
    # Example Usage
    
        @javascript@
        Ember.STRINGS = {
          '_Hello World': 'Bonjour le monde',
          '_Hello %@ %@': 'Bonjour %@ %@'
        };
        
        Ember.String.loc("_Hello World");
        => 'Bonjour le monde';
        
        Ember.String.loc("_Hello %@ %@", ["John", "Smith"]);
        => "Bonjour John Smith";
        
        
        
    @param {String} str
      The string to format
    
    @param {Array} formats
      Optional array of parameters to interpolate into string.
      
    @returns {String} formatted string
  */
  loc: function(str, formats) {
    str = Ember.STRINGS[str] || str;
    return Ember.String.fmt(str, formats) ;
  },

  /**
    Splits a string into separate units separated by spaces, eliminating any
    empty strings in the process.  This is a convenience method for split that
    is mostly useful when applied to the String.prototype.
    
    # Example Usage
    
        @javascript@
        Ember.String.w("alpha beta gamma").forEach(function(key) { 
          console.log(key); 
        });
        > alpha
        > beta
        > gamma

    @param {String} str
      The string to split
      
    @returns {String} split string
  */
  w: function(str) { return str.split(/\s+/); },
  
  /**
    Converts a camelized string into all lower case separated by underscores.

    h2. Examples

    | *Input String* | *Output String* |
    | my favorite items | my favorite items |
    | css-class-name | css-class-name |
    | action_name | action_name |
    | innerHTML | inner_html |

    @returns {String} the decamelized string.
  */
  decamelize: function(str) {
    return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
  },

  /**
    Converts a camelized string or a string with spaces or underscores into
    a string with components separated by dashes.

    h2. Examples

    | *Input String* | *Output String* |
    | my favorite items | my-favorite-items |
    | css-class-name | css-class-name |
    | action_name | action-name |
    | innerHTML | inner-html |

    @returns {String} the dasherized string.
  */
  dasherize: function(str) {
    var cache = STRING_DASHERIZE_CACHE,
        ret   = cache[str];

    if (ret) {
      return ret;
    } else {
      ret = Ember.String.decamelize(str).replace(STRING_DASHERIZE_REGEXP,'-');
      cache[str] = ret;
    }

    return ret;
  }
};




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @namespace

  Implements some standard methods for copying an object.  Add this mixin to
  any object you create that can create a copy of itself.  This mixin is
  added automatically to the built-in array.

  You should generally implement the copy() method to return a copy of the
  receiver.

  Note that frozenCopy() will only work if you also implement Ember.Freezable.

  @since Ember 0.9
*/
Ember.Copyable = Ember.Mixin.create({

  /**
    Override to return a copy of the receiver.  Default implementation raises
    an exception.

    @param deep {Boolean} if true, a deep copy of the object should be made
    @returns {Object} copy of receiver
  */
  copy: Ember.required(Function),

  /**
    If the object implements Ember.Freezable, then this will return a new copy
    if the object is not frozen and the receiver if the object is frozen.

    Raises an exception if you try to call this method on a object that does
    not support freezing.

    You should use this method whenever you want a copy of a freezable object
    since a freezable object can simply return itself without actually
    consuming more memory.

    @returns {Object} copy of receiver or receiver
  */
  frozenCopy: function() {
    if (Ember.Freezable && Ember.Freezable.detect(this)) {
      return get(this, 'isFrozen') ? this : this.copy().freeze();
    } else {
      throw new Error(Ember.String.fmt("%@ does not support freezing", [this]));
    }
  }
});




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================




  
var get = Ember.get, set = Ember.set;

/**
  @namespace

  The Ember.Freezable mixin implements some basic methods for marking an object
  as frozen. Once an object is frozen it should be read only. No changes
  may be made the internal state of the object.

  ## Enforcement

  To fully support freezing in your subclass, you must include this mixin and
  override any method that might alter any property on the object to instead
  raise an exception. You can check the state of an object by checking the
  isFrozen property.

  Although future versions of JavaScript may support language-level freezing
  object objects, that is not the case today. Even if an object is freezable,
  it is still technically possible to modify the object, even though it could
  break other parts of your application that do not expect a frozen object to
  change. It is, therefore, very important that you always respect the
  isFrozen property on all freezable objects.

  ## Example Usage

  The example below shows a simple object that implement the Ember.Freezable
  protocol.

        Contact = Ember.Object.extend(Ember.Freezable, {

          firstName: null,

          lastName: null,

          // swaps the names
          swapNames: function() {
            if (this.get('isFrozen')) throw Ember.FROZEN_ERROR;
            var tmp = this.get('firstName');
            this.set('firstName', this.get('lastName'));
            this.set('lastName', tmp);
            return this;
          }

        });

        c = Context.create({ firstName: "John", lastName: "Doe" });
        c.swapNames();  => returns c
        c.freeze();
        c.swapNames();  => EXCEPTION

  ## Copying

  Usually the Ember.Freezable protocol is implemented in cooperation with the
  Ember.Copyable protocol, which defines a frozenCopy() method that will return
  a frozen object, if the object implements this method as well.

  @since Ember 0.9
*/
Ember.Freezable = Ember.Mixin.create({

  /**
    Set to YES when the object is frozen.  Use this property to detect whether
    your object is frozen or not.

    @property {Boolean}
  */
  isFrozen: false,

  /**
    Freezes the object.  Once this method has been called the object should
    no longer allow any properties to be edited.

    @returns {Object} reciever
  */
  freeze: function() {
    if (get(this, 'isFrozen')) return this;
    set(this, 'isFrozen', true);
    return this;
  }

});

Ember.FROZEN_ERROR = "Frozen object cannot be modified.";




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, guidFor = Ember.guidFor, none = Ember.none;

/**
  @class

  An unordered collection of objects.

  A Set works a bit like an array except that its items are not ordered.
  You can create a set to efficiently test for membership for an object. You
  can also iterate through a set just like an array, even accessing objects
  by index, however there is no gaurantee as to their order.

  Starting with Ember 2.0 all Sets are now observable since there is no
  added cost to providing this support.  Sets also do away with the more
  specialized Set Observer API in favor of the more generic Enumerable 
  Observer API - which works on any enumerable object including both Sets and
  Arrays.

  ## Creating a Set

  You can create a set like you would most objects using 
  `new Ember.Set()`.  Most new sets you create will be empty, but you can 
  also initialize the set with some content by passing an array or other 
  enumerable of objects to the constructor.

  Finally, you can pass in an existing set and the set will be copied. You
  can also create a copy of a set by calling `Ember.Set#copy()`.

      #js
      // creates a new empty set
      var foundNames = new Ember.Set();

      // creates a set with four names in it.
      var names = new Ember.Set(["Charles", "Tom", "Juan", "Alex"]); // :P

      // creates a copy of the names set.
      var namesCopy = new Ember.Set(names);

      // same as above.
      var anotherNamesCopy = names.copy();

  ## Adding/Removing Objects

  You generally add or remove objects from a set using `add()` or 
  `remove()`. You can add any type of object including primitives such as 
  numbers, strings, and booleans.

  Unlike arrays, objects can only exist one time in a set. If you call `add()` 
  on a set with the same object multiple times, the object will only be added
  once. Likewise, calling `remove()` with the same object multiple times will
  remove the object the first time and have no effect on future calls until
  you add the object to the set again.

  NOTE: You cannot add/remove null or undefined to a set. Any attempt to do so 
  will be ignored.

  In addition to add/remove you can also call `push()`/`pop()`. Push behaves 
  just like `add()` but `pop()`, unlike `remove()` will pick an arbitrary 
  object, remove it and return it. This is a good way to use a set as a job 
  queue when you don't care which order the jobs are executed in.

  ## Testing for an Object

  To test for an object's presence in a set you simply call 
  `Ember.Set#contains()`.

  ## Observing changes

  When using `Ember.Set`, you can observe the `"[]"` property to be 
  alerted whenever the content changes.  You can also add an enumerable 
  observer to the set to be notified of specific objects that are added and
  removed from the set.  See `Ember.Enumerable` for more information on 
  enumerables.

  This is often unhelpful. If you are filtering sets of objects, for instance,
  it is very inefficient to re-filter all of the items each time the set 
  changes. It would be better if you could just adjust the filtered set based 
  on what was changed on the original set. The same issue applies to merging 
  sets, as well.

  ## Other Methods

  `Ember.Set` primary implements other mixin APIs.  For a complete reference
  on the methods you will use with `Ember.Set`, please consult these mixins.
  The most useful ones will be `Ember.Enumerable` and 
  `Ember.MutableEnumerable` which implement most of the common iterator 
  methods you are used to on Array.

  Note that you can also use the `Ember.Copyable` and `Ember.Freezable`
  APIs on `Ember.Set` as well.  Once a set is frozen it can no longer be 
  modified.  The benefit of this is that when you call frozenCopy() on it,
  Ember will avoid making copies of the set.  This allows you to write
  code that can know with certainty when the underlying set data will or 
  will not be modified.

  @extends Ember.Enumerable
  @extends Ember.MutableEnumerable
  @extends Ember.Copyable
  @extends Ember.Freezable

  @since Ember 0.9
*/
Ember.Set = Ember.CoreObject.extend(Ember.MutableEnumerable, Ember.Copyable, Ember.Freezable,
  /** @scope Ember.Set.prototype */ {

  // ..........................................................
  // IMPLEMENT ENUMERABLE APIS
  //

  /**
    This property will change as the number of objects in the set changes.

    @property Number
    @default 0
  */
  length: 0,

  /**
    Clears the set.  This is useful if you want to reuse an existing set
    without having to recreate it.

    @returns {Ember.Set}
  */
  clear: function() {
    if (this.isFrozen) { throw new Error(Ember.FROZEN_ERROR); }
    var len = get(this, 'length');
    this.enumerableContentWillChange(len, 0);
    set(this, 'length', 0);
    this.enumerableContentDidChange(len, 0);
    return this;
  },

  /**
    Returns true if the passed object is also an enumerable that contains the 
    same objects as the receiver.

    @param {Ember.Set} obj the other object
    @returns {Boolean}
  */
  isEqual: function(obj) {
    // fail fast
    if (!Ember.Enumerable.detect(obj)) return false;
    
    var loc = get(this, 'length');
    if (get(obj, 'length') !== loc) return false;

    while(--loc >= 0) {
      if (!obj.contains(this[loc])) return false;
    }

    return true;
  },
  
  /**
    Adds an object to the set.  Only non-null objects can be added to a set 
    and those can only be added once. If the object is already in the set or
    the passed value is null this method will have no effect.

    This is an alias for `Ember.MutableEnumerable.addObject()`.

    @function
    @param {Object} obj The object to add
    @returns {Ember.Set} receiver
  */
  add: Ember.alias('addObject'),

  /**
    Removes the object from the set if it is found.  If you pass a null value
    or an object that is already not in the set, this method will have no
    effect. This is an alias for `Ember.MutableEnumerable.removeObject()`.

    @function
    @param {Object} obj The object to remove
    @returns {Ember.Set} receiver
  */
  remove: Ember.alias('removeObject'),
  
  /**
    Removes an arbitrary object from the set and returns it.

    @returns {Object} An object from the set or null
  */
  pop: function() {
    if (get(this, 'isFrozen')) throw new Error(Ember.FROZEN_ERROR);
    var obj = this.length > 0 ? this[this.length-1] : null;
    this.remove(obj);
    return obj;
  },

  /**
    This is an alias for `Ember.MutableEnumerable.addObject()`.

    @function
  */
  push: Ember.alias('addObject'),
  
  /**
    This is an alias for `Ember.Set.pop()`.
    @function
  */
  shift: Ember.alias('pop'),

  /**
    This is an alias of `Ember.Set.push()`
    @function
  */
  unshift: Ember.alias('push'),

  /**
    This is an alias of `Ember.MutableEnumerable.addObjects()`
    @function
  */
  addEach: Ember.alias('addObjects'),

  /**
    This is an alias of `Ember.MutableEnumerable.removeObjects()`
    @function
  */
  removeEach: Ember.alias('removeObjects'),

  // ..........................................................
  // PRIVATE ENUMERABLE SUPPORT
  //

  /** @private */
  init: function(items) {
    this._super();
    if (items) this.addObjects(items);
  },

  /** @private (nodoc) - implement Ember.Enumerable */
  nextObject: function(idx) {
    return this[idx];
  },

  /** @private - more optimized version */
  firstObject: Ember.computed(function() {
    return this.length > 0 ? this[0] : undefined;  
  }).property('[]').cacheable(),

  /** @private - more optimized version */
  lastObject: Ember.computed(function() {
    return this.length > 0 ? this[this.length-1] : undefined;
  }).property('[]').cacheable(),

  /** @private (nodoc) - implements Ember.MutableEnumerable */
  addObject: function(obj) {
    if (get(this, 'isFrozen')) throw new Error(Ember.FROZEN_ERROR);
    if (none(obj)) return this; // nothing to do
    
    var guid = guidFor(obj),
        idx  = this[guid],
        len  = get(this, 'length'),
        added ;
        
    if (idx>=0 && idx<len && (this[idx] === obj)) return this; // added
    
    added = [obj];
    this.enumerableContentWillChange(null, added);
    len = get(this, 'length');
    this[guid] = len;
    this[len] = obj;
    set(this, 'length', len+1);
    this.enumerableContentDidChange(null, added);

    return this;
  },
  
  /** @private (nodoc) - implements Ember.MutableEnumerable */
  removeObject: function(obj) {
    if (get(this, 'isFrozen')) throw new Error(Ember.FROZEN_ERROR);
    if (none(obj)) return this; // nothing to do
    
    var guid = guidFor(obj),
        idx  = this[guid],
        len = get(this, 'length'),
        last, removed;
        
    
    if (idx>=0 && idx<len && (this[idx] === obj)) {
      removed = [obj];

      this.enumerableContentWillChange(removed, null);
      
      // swap items - basically move the item to the end so it can be removed
      if (idx < len-1) {
        last = this[len-1];
        this[idx] = last;
        this[guidFor(last)] = idx;
      }

      delete this[guid];
      delete this[len-1];
      set(this, 'length', len-1);

      this.enumerableContentDidChange(removed, null);
    }
    
    return this;
  },

  /** @private (nodoc) - optimized version */
  contains: function(obj) {
    return this[guidFor(obj)]>=0;
  },
  
  /** @private (nodoc) */
  copy: function() {
    var C = this.constructor, ret = new C(), loc = get(this, 'length');
    set(ret, 'length', loc);
    while(--loc>=0) {
      ret[loc] = this[loc];
      ret[guidFor(this[loc])] = loc;
    }
    return ret;
  },
  
  /** @private */
  toString: function() {
    var len = this.length, idx, array = [];
    for(idx = 0; idx < len; idx++) {
      array[idx] = this[idx];
    }
    return "Ember.Set<%@>".fmt(array.join(','));
  },
  
  // ..........................................................
  // DEPRECATED
  // 

  /** @deprecated

    This property is often used to determine that a given object is a set.
    Instead you should use instanceof:

        #js:
        // SproutCore 1.x:
        isSet = myobject && myobject.isSet;

        // Ember:
        isSet = myobject instanceof Ember.Set

    @type Boolean
    @default true
  */
  isSet: true
    
});

// Support the older API 
var o_create = Ember.Set.create;
Ember.Set.create = function(items) {
  if (items && Ember.Enumerable.detect(items)) {
    Ember.Logger.warn('Passing an enumerable to Ember.Set.create() is deprecated and will be removed in a future version of Ember.  Use new Ember.Set(items) instead');
    return new Ember.Set(items);
  } else {
    return o_create.apply(this, arguments);
  }
};



})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
Ember.CoreObject.subclasses = new Ember.Set();
Ember.Object = Ember.CoreObject.extend(Ember.Observable);




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @class

  An ArrayProxy wraps any other object that implements Ember.Array and/or 
  Ember.MutableArray, forwarding all requests.  ArrayProxy isn't useful by itself
  but you can extend it to do specialized things like transforming values,
  etc.

  @extends Ember.Object
  @extends Ember.Array
  @extends Ember.MutableArray
*/
Ember.ArrayProxy = Ember.Object.extend(Ember.MutableArray, {
  
  /**
    The content array.  Must be an object that implements Ember.Array and or
    Ember.MutableArray.
    
    @property {Ember.Array}
  */
  content: null,

  /**
    Should actually retrieve the object at the specified index from the 
    content.  You can override this method in subclasses to transform the 
    content item to something new.
    
    This method will only be called if content is non-null.
    
    @param {Number} idx
      The index to retreive.
      
    @returns {Object} the value or undefined if none found
  */
  objectAtContent: function(idx) {
    return get(this, 'content').objectAt(idx);
  },
  
  /**
    Should actually replace the specified objects on the content array.  
    You can override this method in subclasses to transform the content item
    into something new.
    
    This method will only be called if content is non-null.
    
    @param {Number} idx
      The starting index
    
    @param {Number} amt
      The number of items to remove from the content.
      
    @param {Array} objects
      Optional array of objects to insert or null if no objects.
      
    @returns {void}
  */
  replaceContent: function(idx, amt, objects) {
    get(this, 'content').replace(idx, amt, objects);
  },
  
  contentWillChange: Ember.beforeObserver(function() {
    var content = get(this, 'content'),
        len     = content ? get(content, 'length') : 0;
    this.arrayWillChange(content, 0, len, undefined);
    if (content) content.removeArrayObserver(this);
  }, 'content'),
  
  /**
    Invoked when the content property changes.  Notifies observers that the
    entire array content has changed.
  */
  contentDidChange: Ember.observer(function() {
    var content = get(this, 'content'),
        len     = content ? get(content, 'length') : 0;
    if (content) content.addArrayObserver(this);
    this.arrayDidChange(content, 0, undefined, len);
  }, 'content'),
  
  /** @private (nodoc) */
  objectAt: function(idx) {
    return get(this, 'content') && this.objectAtContent(idx);
  },
  
  /** @private (nodoc) */
  length: Ember.computed(function() {
    var content = get(this, 'content');
    return content ? get(content, 'length') : 0;
  }).property('content.length').cacheable(),
  
  /** @private (nodoc) */
  replace: function(idx, amt, objects) {
    if (get(this, 'content')) this.replaceContent(idx, amt, objects);
    return this;
  },
  
  /** @private (nodoc) */
  arrayWillChange: function(item, idx, removedCnt, addedCnt) {
    this.arrayContentWillChange(idx, removedCnt, addedCnt);
  },
  
  /** @private (nodoc) */
  arrayDidChange: function(item, idx, removedCnt, addedCnt) {
    this.arrayContentDidChange(idx, removedCnt, addedCnt);
  },
  
  init: function() {
    this._super();
    this.contentDidChange();
  }
  
});




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Metal
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @class

  Ember.ArrayController provides a way for you to publish an array of objects for
  Ember.CollectionView or other controllers to work with.  To work with an
  ArrayController, set the content property to the array you want the controller
  to manage.  Then work directly with the controller object as if it were the
  array itself.

  For example, imagine you wanted to display a list of items fetched via an XHR
  request. Create an Ember.ArrayController and set its `content` property:

      MyApp.listController = Ember.ArrayController.create();

      $.get('people.json', function(data) {
        MyApp.listController.set('content', data);
      });

  Then, create a view that binds to your new controller:

    {{collection contentBinding="MyApp.listController"}}
      {{content.firstName}} {{content.lastName}}
    {{/collection}}

  The advantage of using an array controller is that you only have to set up
  your view bindings once; to change what's displayed, simply swap out the
  `content` property on the controller.

  @extends Ember.ArrayProxy
*/

Ember.ArrayController = Ember.ArrayProxy.extend();

})({});


(function(exports) {
})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var fmt = Ember.String.fmt,
    w   = Ember.String.w,
    loc = Ember.String.loc,
    decamelize = Ember.String.decamelize,
    dasherize = Ember.String.dasherize;
  
if (Ember.EXTEND_PROTOTYPES) {

  /**
    @see Ember.String.fmt
  */
  String.prototype.fmt = function() {
    return fmt(this, arguments);
  };
  
  /**
    @see Ember.String.w
  */
  String.prototype.w = function() {
    return w(this);
  };
  
  /**
    @see Ember.String.loc
  */
  String.prototype.loc = function() {
    return loc(this, arguments);
  };
  
  /**
    @see Ember.String.decamelize
  */
  String.prototype.decamelize = function() {
    return decamelize(this);
  };
  
  /**
    @see Ember.String.dasherize
  */
  String.prototype.dasherize = function() {
    return dasherize(this);
  };
}




})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
if (Ember.EXTEND_PROTOTYPES) {

  Function.prototype.property = function() {
    var ret = Ember.computed(this);
    return ret.property.apply(ret, arguments);
  };

  Function.prototype.observes = function() {
    this.__ember_observes__ = Array.prototype.slice.call(arguments);
    return this;
  };

  Function.prototype.observesBefore = function() {
    this.__ember_observesBefore__ = Array.prototype.slice.call(arguments);
    return this;
  };

}


})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var IS_BINDING = Ember.IS_BINDING = /^.+Binding$/;

Ember._mixinBindings = function(obj, key, value, m) {
  if (IS_BINDING.test(key)) {
    if (!(value instanceof Ember.Binding)) {
      value = new Ember.Binding(key.slice(0,-7), value); // make binding
    } else {
      value.to(key.slice(0, -7));
    }
    value.connect(obj);

    // keep a set of bindings in the meta so that when we rewatch we can
    // resync them...
    var bindings = m.bindings;
    if (!bindings) {
      bindings = m.bindings = { __emberproto__: obj };
    } else if (bindings.__emberproto__ !== obj) {
      bindings = m.bindings = Ember.create(m.bindings);
      bindings.__emberproto__ = obj;
    }

    bindings[key] = true;
  }
  
  return value;
};

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});


(function(exports) {
/**
 * @license
 * ==========================================================================
 * Ember
 * Copyright Â©2006-2011, Strobe Inc. and contributors.
 * Portions copyright Â©2008-2011 Apple Inc. All rights reserved.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 * For more information about Ember, visit http://www.emberjs.com
 * 
 * ==========================================================================
 */

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @namespace

  Implements some standard methods for comparing objects. Add this mixin to
  any class you create that can compare its instances.

  You should implement the compare() method.

  @since Ember 0.9
*/
Ember.Comparable = Ember.Mixin.create( /** @scope Ember.Comparable.prototype */{

  /**
    walk like a duck. Indicates that the object can be compared.

    @type Boolean
    @default YES
    @constant
  */
  isComparable: true,

  /**
    Override to return the result of the comparison of the two parameters. The
    compare method should return:

      - -1 if a < b
      - 0 if a == b
      - 1 if a > b

    Default implementation raises an exception.

    @param a {Object} the first object to compare
    @param b {Object} the second object to compare
    @returns {Integer} the result of the comparison
  */
  compare: Ember.required(Function)

});


})({});


(function(exports) {
var get = Ember.get, set = Ember.set;

Ember.TargetActionSupport = Ember.Mixin.create({
  target: null,
  action: null,

  targetObject: Ember.computed(function() {
    var target = get(this, 'target');

    if (Ember.typeOf(target) === "string") {
      return Ember.getPath(this, target);
    } else {
      return target;
    }
  }).property('target').cacheable(),

  triggerAction: function() {
    var action = get(this, 'action'),
        target = get(this, 'targetObject');

    if (target && action) {
      if (typeof target.send === 'function') {
        target.send(action, this);
      } else {
        if (typeof action === 'string') {
          action = target[action];
        }
        action.call(target, this);
      }
    }
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @private
  A Namespace is an object usually used to contain other objects or methods
  such as an application or framework.  Create a namespace anytime you want
  to define one of these new containers.

  # Example Usage

      MyFramework = Ember.Namespace.create({
        VERSION: '1.0.0'
      });

*/
Ember.Namespace = Ember.Object.extend({
  isNamespace: true,

  init: function() {
    Ember.Namespace.NAMESPACES.push(this);
    Ember.Namespace.PROCESSED = false;
  },

  toString: function() {
    Ember.identifyNamespaces();
    return this[Ember.GUID_KEY+'_name'];
  },

  destroy: function() {
    var namespaces = Ember.Namespace.NAMESPACES;
    window[this.toString()] = undefined;
    namespaces.splice(namespaces.indexOf(this), 1);
    this._super();
  }
});

Ember.Namespace.NAMESPACES = [Ember];
Ember.Namespace.PROCESSED = false;

})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @private

  Defines a namespace that will contain an executable application.  This is
  very similar to a normal namespace except that it is expected to include at
  least a 'ready' function which can be run to initialize the application.
  
  Currently Ember.Application is very similar to Ember.Namespace.  However, this
  class may be augmented by additional frameworks so it is important to use
  this instance when building new applications.
  
  # Example Usage
  
      MyApp = Ember.Application.create({
        VERSION: '1.0.0',
        store: Ember.Store.create().from(Ember.fixtures)
      });
      
      MyApp.ready = function() { 
        //..init code goes here...
      }
      
*/
Ember.Application = Ember.Namespace.extend();


})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var set = Ember.set, get = Ember.get, guidFor = Ember.guidFor;

var EachArray = Ember.Object.extend(Ember.Array, {

  init: function(content, keyName, owner) {
    this._super();
    this._keyName = keyName;
    this._owner   = owner;
    this._content = content;
  },

  objectAt: function(idx) {
    var item = this._content.objectAt(idx);
    return item && get(item, this._keyName);
  },

  length: Ember.computed(function() {
    var content = this._content;
    return content ? get(content, 'length') : 0;
  }).property('[]').cacheable()

});

var IS_OBSERVER = /^.+:(before|change)$/;

function addObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects, guid;
  if (!objects) objects = proxy._objects = {};

  while(--loc>=idx) {
    var item = content.objectAt(loc);
    if (item) {
      Ember.addBeforeObserver(item, keyName, proxy, 'contentKeyWillChange');
      Ember.addObserver(item, keyName, proxy, 'contentKeyDidChange');

      // keep track of the indicies each item was found at so we can map
      // it back when the obj changes.
      guid = guidFor(item);
      if (!objects[guid]) objects[guid] = [];
      objects[guid].push(loc);
    }
  }
}

function removeObserverForContentKey(content, keyName, proxy, idx, loc) {
  var objects = proxy._objects;
  if (!objects) objects = proxy._objects = {};
  var indicies, guid;

  while(--loc>=idx) {
    var item = content.objectAt(loc);
    if (item) {
      Ember.removeBeforeObserver(item, keyName, proxy, 'contentKeyWillChange');
      Ember.removeObserver(item, keyName, proxy, 'contentKeyDidChange');

      guid = guidFor(item);
      indicies = objects[guid];
      indicies[indicies.indexOf(loc)] = null;
    }
  }
}

/**
  @private
  @class

  This is the object instance returned when you get the @each property on an
  array.  It uses the unknownProperty handler to automatically create
  EachArray instances for property names.

  @extends Ember.Object
*/
Ember.EachProxy = Ember.Object.extend({

  init: function(content) {
    this._super();
    this._content = content;
    content.addArrayObserver(this);

    // in case someone is already observing some keys make sure they are
    // added
    Ember.watchedEvents(this).forEach(function(eventName) {
      this.didAddListener(eventName);
    }, this);
  },

  /**
    You can directly access mapped properties by simply requesting them.
    The unknownProperty handler will generate an EachArray of each item.
  */
  unknownProperty: function(keyName, value) {
    var ret;
    ret = new EachArray(this._content, keyName, this);
    new Ember.Descriptor().setup(this, keyName, ret);
    this.beginObservingContentKey(keyName);
    return ret;
  },

  // ..........................................................
  // ARRAY CHANGES
  // Invokes whenever the content array itself changes.

  arrayWillChange: function(content, idx, removedCnt, addedCnt) {
    var keys = this._keys, key, array, lim;

    lim = removedCnt>0 ? idx+removedCnt : -1;
    Ember.beginPropertyChanges(this);

    for(key in keys) {
      if (!keys.hasOwnProperty(key)) { continue; }

      if (lim>0) removeObserverForContentKey(content, key, this, idx, lim);

      Ember.propertyWillChange(this, key);
    }

    Ember.propertyWillChange(this._content, '@each');
    Ember.endPropertyChanges(this);
  },

  arrayDidChange: function(content, idx, removedCnt, addedCnt) {
    var keys = this._keys, key, array, lim;

    lim = addedCnt>0 ? idx+addedCnt : -1;
    Ember.beginPropertyChanges(this);

    for(key in keys) {
      if (!keys.hasOwnProperty(key)) { continue; }

      if (lim>0) addObserverForContentKey(content, key, this, idx, lim);

      Ember.propertyDidChange(this, key);
    }

    Ember.propertyDidChange(this._content, '@each');
    Ember.endPropertyChanges(this);
  },

  // ..........................................................
  // LISTEN FOR NEW OBSERVERS AND OTHER EVENT LISTENERS
  // Start monitoring keys based on who is listening...

  didAddListener: function(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.beginObservingContentKey(eventName.slice(0, -7));
    }
  },

  didRemoveListener: function(eventName) {
    if (IS_OBSERVER.test(eventName)) {
      this.stopObservingContentKey(eventName.slice(0, -7));
    }
  },

  // ..........................................................
  // CONTENT KEY OBSERVING
  // Actual watch keys on the source content.

  beginObservingContentKey: function(keyName) {
    var keys = this._keys;
    if (!keys) keys = this._keys = {};
    if (!keys[keyName]) {
      keys[keyName] = 1;
      var content = this._content,
          len = get(content, 'length');
      addObserverForContentKey(content, keyName, this, 0, len);
    } else {
      keys[keyName]++;
    }
  },

  stopObservingContentKey: function(keyName) {
    var keys = this._keys;
    if (keys && (keys[keyName]>0) && (--keys[keyName]<=0)) {
      var content = this._content,
          len     = get(content, 'length');
      removeObserverForContentKey(content, keyName, this, 0, len);
    }
  },

  contentKeyWillChange: function(obj, keyName) {
    Ember.propertyWillChange(this, keyName);
  },

  contentKeyDidChange: function(obj, keyName) {
    Ember.propertyDidChange(this, keyName);
  }

});



})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;
  
// Add Ember.Array to Array.prototype.  Remove methods with native 
// implementations and supply some more optimized versions of generic methods
// because they are so common.
var NativeArray = Ember.Mixin.create(Ember.MutableArray, Ember.Observable, Ember.Copyable, {

  // because length is a built-in property we need to know to just get the 
  // original property.
  get: function(key) {
    if (key==='length') return this.length;
    else if ('number' === typeof key) return this[key];
    else return this._super(key);  
  },
  
  objectAt: function(idx) {
    return this[idx];
  },
    
  // primitive for array support.
  replace: function(idx, amt, objects) {

    if (this.isFrozen) throw Ember.FROZEN_ERROR ;

    // if we replaced exactly the same number of items, then pass only the
    // replaced range.  Otherwise, pass the full remaining array length
    // since everything has shifted
    var len = objects ? get(objects, 'length') : 0;
    this.arrayContentWillChange(idx, amt, len);
    
    if (!objects || objects.length === 0) {
      this.splice(idx, amt) ;
    } else {
      var args = [idx, amt].concat(objects) ;
      this.splice.apply(this,args) ;
    }

    this.arrayContentDidChange(idx, amt, len);
    return this ;
  },

  // If you ask for an unknown property, then try to collect the value
  // from member items.
  unknownProperty: function(key, value) {
    var ret;// = this.reducedProperty(key, value) ;
    if ((value !== undefined) && ret === undefined) {
      ret = this[key] = value;
    }
    return ret ;
  },

  // If browser did not implement indexOf natively, then override with
  // specialized version
  indexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = 0;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx<len;idx++) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  },

  lastIndexOf: function(object, startAt) {
    var idx, len = this.length;

    if (startAt === undefined) startAt = len-1;
    else startAt = (startAt < 0) ? Math.ceil(startAt) : Math.floor(startAt);
    if (startAt < 0) startAt += len;

    for(idx=startAt;idx>=0;idx--) {
      if (this[idx] === object) return idx ;
    }
    return -1;
  },
  
  copy: function() {
    return this.slice();
  }
});

// Remove any methods implemented natively so we don't override them
var ignore = ['length'];
NativeArray.keys().forEach(function(methodName) {
  if (Array.prototype[methodName]) ignore.push(methodName);
});

if (ignore.length>0) {
  NativeArray = NativeArray.without.apply(NativeArray, ignore);
}

/**
  The NativeArray mixin contains the properties needed to to make the native
  Array support Ember.MutableArray and all of its dependent APIs.  Unless you 
  have Ember.EXTEND_PROTOTYPES set to false, this will be applied automatically.
  Otherwise you can apply the mixin at anytime by calling 
  `Ember.NativeArray.activate`.
  
  @namespace
  @extends Ember.MutableArray
  @extends Ember.Array
  @extends Ember.Enumerable
  @extends Ember.MutableEnumerable
  @extends Ember.Copyable
  @extends Ember.Freezable
*/
Ember.NativeArray = NativeArray;

/**
  Creates an Ember.NativeArray from an Array like object.
  Does not modify the original object.

  @returns {Ember.NativeArray}
*/
Ember.A = function(arr){
  if (arr === undefined) { arr = []; }
  return Ember.NativeArray.apply(Array.prototype.slice.apply(arr));
};

/**
  Activates the mixin on the Array.prototype if not already applied.  Calling
  this method more than once is safe.
  
  @returns {void}
*/
Ember.NativeArray.activate = function() {
  NativeArray.apply(Array.prototype);
};

if (Ember.EXTEND_PROTOTYPES) Ember.NativeArray.activate();



})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Runtime
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});

(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get, set = Ember.set;

/**
  @class

  Ember.RenderBuffer gathers information regarding the a view and generates the
  final representation. Ember.RenderBuffer will generate HTML which can be pushed
  to the DOM.

  @extends Ember.Object
*/
Ember.RenderBuffer = function(tagName) {
  return Ember._RenderBuffer.create({ elementTag: tagName });
};

Ember._RenderBuffer = Ember.Object.extend(
/** @scope Ember.RenderBuffer.prototype */ {

  /**
    Array of class-names which will be applied in the class="" attribute

    You should not maintain this array yourself, rather, you should use
    the addClass() method of Ember.RenderBuffer.

    @type Array
    @default []
  */
  elementClasses: null,

  /**
    The id in of the element, to be applied in the id="" attribute

    You should not set this property yourself, rather, you should use
    the id() method of Ember.RenderBuffer.

    @type String
    @default null
  */
  elementId: null,

  /**
    A hash keyed on the name of the attribute and whose value will be
    applied to that attribute. For example, if you wanted to apply a
    data-view="Foo.bar" property to an element, you would set the
    elementAttributes hash to {'data-view':'Foo.bar'}

    You should not maintain this hash yourself, rather, you should use
    the attr() method of Ember.RenderBuffer.

    @type Hash
    @default {}
  */
  elementAttributes: null,

  /**
    The tagname of the element an instance of Ember.RenderBuffer represents.

    Usually, this gets set as the first parameter to Ember.RenderBuffer. For
    example, if you wanted to create a `p` tag, then you would call

      Ember.RenderBuffer('p')

    @type String
    @default null
  */
  elementTag: null,

  /**
    A hash keyed on the name of the style attribute and whose value will
    be applied to that attribute. For example, if you wanted to apply a
    background-color:black;" style to an element, you would set the
    elementStyle hash to {'background-color':'black'}

    You should not maintain this hash yourself, rather, you should use
    the style() method of Ember.RenderBuffer.

    @type Hash
    @default {}
  */
  elementStyle: null,

  /**
    Nested RenderBuffers will set this to their parent RenderBuffer
    instance.

    @type Ember._RenderBuffer
  */
  parentBuffer: null,

  /** @private */
  init: function() {
    this._super();

    set(this ,'elementClasses', Ember.A());
    set(this, 'elementAttributes', {});
    set(this, 'elementStyle', {});
    set(this, 'childBuffers', Ember.A());
    set(this, 'elements', {});
  },

  /**
    Adds a string of HTML to the RenderBuffer.

    @param {String} string HTML to push into the buffer
    @returns {Ember.RenderBuffer} this
  */
  push: function(string) {
    get(this, 'childBuffers').pushObject(String(string));
    return this;
  },

  /**
    Adds a class to the buffer, which will be rendered to the class attribute.

    @param {String} className Class name to add to the buffer
    @returns {Ember.RenderBuffer} this
  */
  addClass: function(className) {
    get(this, 'elementClasses').addObject(className);
    return this;
  },

  /**
    Sets the elementID to be used for the element.

    @param {String} id
    @returns {Ember.RenderBuffer} this
  */
  id: function(id) {
    set(this, 'elementId', id);
    return this;
  },

  /**
    Adds an attribute which will be rendered to the element.

    @param {String} name The name of the attribute
    @param {String} value The value to add to the attribute
    @returns {Ember.RenderBuffer} this
  */
  attr: function(name, value) {
    get(this, 'elementAttributes')[name] = value;
    return this;
  },

  /**
    Adds a style to the style attribute which will be rendered to the element.

    @param {String} name Name of the style
    @param {String} value
    @returns {Ember.RenderBuffer} this
  */
  style: function(name, value) {
    get(this, 'elementStyle')[name] = value;
    return this;
  },

  /**
    Create a new child render buffer from a parent buffer. Optionally set
    additional properties on the buffer. Optionally invoke a callback
    with the newly created buffer.

    This is a primitive method used by other public methods: `begin`,
    `prepend`, `replaceWith`, `insertAfter`.

    @private
    @param {String} tagName Tag name to use for the child buffer's element
    @param {Ember._RenderBuffer} parent The parent render buffer that this
      buffer should be appended to.
    @param {Function} fn A callback to invoke with the newly created buffer.
    @param {Object} other Additional properties to add to the newly created
      buffer.
  */
  newBuffer: function(tagName, parent, fn, other) {
    var buffer = Ember._RenderBuffer.create({
      parentBuffer: parent,
      elementTag: tagName
    });

    if (other) { buffer.setProperties(other); }
    if (fn) { fn.call(this, buffer); }

    return buffer;
  },

  /**
    Replace the current buffer with a new buffer. This is a primitive
    used by `remove`, which passes `null` for `newBuffer`, and `replaceWith`,
    which passes the new buffer it created.

    @private
    @param {Ember._RenderBuffer} buffer The buffer to insert in place of
      the existing buffer.
  */
  replaceWithBuffer: function(newBuffer) {
    var parent = get(this, 'parentBuffer');
    if (!parent) { return; }

    var childBuffers = get(parent, 'childBuffers');

    var index = childBuffers.indexOf(this);

    if (newBuffer) {
      childBuffers.splice(index, 1, newBuffer);
    } else {
      childBuffers.splice(index, 1);
    }
  },

  /**
    Creates a new Ember.RenderBuffer object with the provided tagName as
    the element tag and with its parentBuffer property set to the current
    Ember.RenderBuffer.

    @param {String} tagName Tag name to use for the child buffer's element
    @returns {Ember.RenderBuffer} A new RenderBuffer object
  */
  begin: function(tagName) {
    return this.newBuffer(tagName, this, function(buffer) {
      get(this, 'childBuffers').pushObject(buffer);
    });
  },

  /**
    Prepend a new child buffer to the current render buffer.

    @param {String} tagName Tag name to use for the child buffer's element
  */
  prepend: function(tagName) {
    return this.newBuffer(tagName, this, function(buffer) {
      get(this, 'childBuffers').insertAt(0, buffer);
    });
  },

  /**
    Replace the current buffer with a new render buffer.

    @param {String} tagName Tag name to use for the new buffer's element
  */
  replaceWith: function(tagName) {
    var parentBuffer = get(this, 'parentBuffer');

    return this.newBuffer(tagName, parentBuffer, function(buffer) {
      this.replaceWithBuffer(buffer);
    });
  },

  /**
    Insert a new render buffer after the current render buffer.

    @param {String} tagName Tag name to use for the new buffer's element
  */
  insertAfter: function(tagName) {
    var parentBuffer = get(this, 'parentBuffer');

    return this.newBuffer(tagName, parentBuffer, function(buffer) {
      var siblings = get(parentBuffer, 'childBuffers');
      var index = siblings.indexOf(this);
      siblings.insertAt(index + 1, buffer);
    });
  },

  /**
    Closes the current buffer and adds its content to the parentBuffer.

    @returns {Ember.RenderBuffer} The parentBuffer, if one exists. Otherwise, this
  */
  end: function() {
    var parent = get(this, 'parentBuffer');
    return parent || this;
  },

  remove: function() {
    this.replaceWithBuffer(null);
  },

  /**
    @returns {DOMElement} The element corresponding to the generated HTML
      of this buffer
  */
  element: function() {
    return Ember.$(this.string())[0];
  },

  /**
    Generates the HTML content for this buffer.

    @returns {String} The generated HTMl
  */
  string: function() {
    var id = get(this, 'elementId'),
        classes = get(this, 'elementClasses'),
        attrs = get(this, 'elementAttributes'),
        style = get(this, 'elementStyle'),
        tag = get(this, 'elementTag'),
        content = '',
        styleBuffer = [], prop;

    if (tag) {
      var openTag = ["<" + tag];

      if (id) { openTag.push('id="' + id + '"'); }
      if (classes.length) { openTag.push('class="' + classes.join(" ") + '"'); }

      if (!jQuery.isEmptyObject(style)) {
        for (prop in style) {
          if (style.hasOwnProperty(prop)) {
            styleBuffer.push(prop + ':' + style[prop] + ';');
          }
        }

        openTag.push('style="' + styleBuffer.join("") + '"');
      }

      for (prop in attrs) {
        if (attrs.hasOwnProperty(prop)) {
          openTag.push(prop + '="' + attrs[prop] + '"');
        }
      }

      openTag = openTag.join(" ") + '>';
    }

    var childBuffers = get(this, 'childBuffers');

    childBuffers.forEach(function(buffer) {
      var stringy = typeof buffer === 'string';
      content += (stringy ? buffer : buffer.string());
    });

    if (tag) {
      return openTag + content + "</" + tag + ">";
    } else {
      return content;
    }
  }

});

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;

/**
  @ignore

  Ember.EventDispatcher handles delegating browser events to their corresponding
  Ember.Views. For example, when you click on a view, Ember.EventDispatcher ensures
  that that view's `mouseDown` method gets called.
*/
Ember.EventDispatcher = Ember.Object.extend(
/** @scope Ember.EventDispatcher.prototype */{

  /**
    @private

    The root DOM element to which event listeners should be attached. Event
    listeners will be attached to the document unless this is overridden.

    @type DOMElement
    @default document
  */
  rootElement: document,

  /**
    @private

    Sets up event listeners for standard browser events.

    This will be called after the browser sends a DOMContentReady event. By
    default, it will set up all of the listeners on the document body. If you
    would like to register the listeners on different element, set the event
    dispatcher's `root` property.
  */
  setup: function(addedEvents) {
    var event, events = {
      touchstart  : 'touchStart',
      touchmove   : 'touchMove',
      touchend    : 'touchEnd',
      touchcancel : 'touchCancel',
      keydown     : 'keyDown',
      keyup       : 'keyUp',
      keypress    : 'keyPress',
      mousedown   : 'mouseDown',
      mouseup     : 'mouseUp',
      click       : 'click',
      dblclick    : 'doubleClick',
      mousemove   : 'mouseMove',
      focusin     : 'focusIn',
      focusout    : 'focusOut',
      mouseenter  : 'mouseEnter',
      mouseleave  : 'mouseLeave',
      submit      : 'submit',
      change      : 'change',
      dragstart   : 'dragStart',
      drag        : 'drag',
      dragenter   : 'dragEnter',
      dragleave   : 'dragLeave',
      dragover    : 'dragOver',
      drop        : 'drop',
      dragend     : 'dragEnd'
    };

    jQuery.extend(events, addedEvents || {});

    var rootElement = Ember.$(get(this, 'rootElement'));

    ember_assert(fmt('You cannot use the same root element (%@) multiple times in an Ember.Application', [rootElement.selector || rootElement[0].tagName]), !rootElement.is('.ember-application'));
    ember_assert('You cannot make a new Ember.Application using a root element that is a descendent of an existing Ember.Application', !rootElement.closest('.ember-application').length);
    ember_assert('You cannot make a new Ember.Application using a root element that is an ancestor of an existing Ember.Application', !rootElement.find('.ember-application').length);

    rootElement.addClass('ember-application');

    for (event in events) {
      if (events.hasOwnProperty(event)) {
        this.setupHandler(rootElement, event, events[event]);
      }
    }
  },

  /**
    @private

    Registers an event listener on the document. If the given event is
    triggered, the provided event handler will be triggered on the target
    view.

    If the target view does not implement the event handler, or if the handler
    returns false, the parent view will be called. The event will continue to
    bubble to each successive parent view until it reaches the top.

    For example, to have the `mouseDown` method called on the target view when
    a `mousedown` event is received from the browser, do the following:

        setupHandler('mousedown', 'mouseDown');

    @param {String} event the browser-originated event to listen to
    @param {String} eventName the name of the method to call on the view
  */
  setupHandler: function(rootElement, event, eventName) {
    var self = this;

    rootElement.delegate('.ember-view', event + '.ember', function(evt, triggeringManager) {

      var view = Ember.View.views[this.id],
          result = true, manager = null;

      manager = self._findNearestEventManager(view,eventName);

      if (manager && manager !== triggeringManager) {
        result = self._dispatchEvent(manager, evt, eventName, view);
      } else if (view) {
        result = self._bubbleEvent(view,evt,eventName);
      } else {
        evt.stopPropagation();
      }

      return result;
    });
  },

  /** @private */
  _findNearestEventManager: function(view, eventName) {
    var manager = null;

    while (view) {
      manager = get(view, 'eventManager');
      if (manager && manager[eventName]) { break; }

      view = get(view, 'parentView');
    }

    return manager;
  },

  /** @private */
  _dispatchEvent: function(object, evt, eventName, view) {
    var result = true;

    handler = object[eventName];
    if (Ember.typeOf(handler) === 'function') {
      result = handler.call(object, evt, view);
      evt.stopPropagation();
    }
    else {
      result = this._bubbleEvent(view, evt, eventName);
    }

    return result;
  },

  /** @private */
  _bubbleEvent: function(view, evt, eventName) {
    var result = true, handler,
        self = this;

      Ember.run(function() {
        handler = view[eventName];
        if (Ember.typeOf(handler) === 'function') {
          result = handler.call(view, evt);
        }
      });

    return result;
  },

  /** @private */
  destroy: function() {
    var rootElement = get(this, 'rootElement');
    Ember.$(rootElement).undelegate('.ember').removeClass('ember-application');
    return this._super();
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

/**
  @class

  An Ember.Application instance serves as the namespace in which you define your
  application's classes. You can also override the configuration of your
  application.

  By default, Ember.Application will begin listening for events on the document.
  If your application is embedded inside a page, instead of controlling the
  entire document, you can specify which DOM element to attach to by setting
  the `rootElement` property:

      MyApp = Ember.Application.create({
        rootElement: $('#my-app')
      });

  The root of an Ember.Application must not be removed during the course of the
  page's lifetime. If you have only a single conceptual application for the
  entire page, and are not embedding any third-party Ember applications
  in your page, use the default document root for your application.

  You only need to specify the root if your page contains multiple instances 
  of Ember.Application.

  @since Ember 2.0
  @extends Ember.Object
*/
Ember.Application = Ember.Namespace.extend(
/** @scope Ember.Application.prototype */{

  /**
    @type DOMElement
    @default document
  */
  rootElement: document,

  /**
    @type Ember.EventDispatcher
    @default null
  */
  eventDispatcher: null,

  /**
    @type Object
    @default null
  */
  customEvents: null,

  /** @private */
  init: function() {
    var eventDispatcher,
        rootElement = get(this, 'rootElement');
    this._super();

    eventDispatcher = Ember.EventDispatcher.create({
      rootElement: rootElement
    });

    set(this, 'eventDispatcher', eventDispatcher);

    var self = this;
    Ember.$(document).ready(function() {
      self.ready();
    });

    this._super();
  },

  ready: function() {
    var eventDispatcher = get(this, 'eventDispatcher'),
        customEvents    = get(this, 'customEvents');

    eventDispatcher.setup(customEvents);
  },

  /** @private */
  destroy: function() {
    get(this, 'eventDispatcher').destroy();
    return this._super();
  }
});



})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// Add a new named queue for rendering views that happens
// after bindings have synced.
var queues = Ember.run.queues;
queues.splice(jQuery.inArray('actions', queues)+1, 0, 'render');

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals ember_assert */
var get = Ember.get, set = Ember.set, addObserver = Ember.addObserver;
var getPath = Ember.getPath, meta = Ember.meta, fmt = Ember.String.fmt;

var childViewsProperty = Ember.computed(function() {
  var childViews = get(this, '_childViews');

  var ret = Ember.A();

  childViews.forEach(function(view) {
    if (view.isVirtual) {
      ret.pushObjects(get(view, 'childViews'));
    } else {
      ret.push(view);
    }
  });

  return ret;
}).property('_childViews.@each').cacheable();

/**
  @static

  Global hash of shared templates. This will automatically be populated
  by the build tools so that you can store your Handlebars templates in
  separate files that get loaded into JavaScript at buildtime.

  @type Hash
*/
Ember.TEMPLATES = {};

/**
  @class
  @since Ember 0.9
  @extends Ember.Object
*/
Ember.View = Ember.Object.extend(
/** @scope Ember.View.prototype */ {

  /** @private */
  concatenatedProperties: ['classNames', 'classNameBindings', 'attributeBindings'],

  /**
    @type Boolean
    @default YES
    @constant
  */
  isView: YES,

  // ..........................................................
  // TEMPLATE SUPPORT
  //

  /**
    The name of the template to lookup if no template is provided.

    Ember.View will look for a template with this name in this view's
    `templates` object. By default, this will be a global object
    shared in `Ember.TEMPLATES`.

    @type String
    @default null
  */
  templateName: null,

  /**
    The hash in which to look for `templateName`.

    @type Ember.Object
    @default Ember.TEMPLATES
  */
  templates: Ember.TEMPLATES,

  /**
    The template used to render the view. This should be a function that
    accepts an optional context parameter and returns a string of HTML that
    will be inserted into the DOM relative to its parent view.

    In general, you should set the `templateName` property instead of setting
    the template yourself.

    @field
    @type Function
  */
  template: Ember.computed(function(key, value) {
    if (value !== undefined) { return value; }

    var templateName = get(this, 'templateName'), template;

    if (templateName) { template = get(get(this, 'templates'), templateName); }

    // If there is no template but a templateName has been specified,
    // try to lookup as a spade module
    if (!template && templateName) {
      if ('undefined' !== require && require.exists) {
        if (require.exists(templateName)) { template = require(templateName); }
      }

      if (!template) {
        throw new Ember.Error(fmt('%@ - Unable to find template "%@".', [this, templateName]));
      }
    }

    // return the template, or undefined if no template was found
    return template || get(this, 'defaultTemplate');
  }).property('templateName').cacheable(),

  /**
    The object from which templates should access properties.

    This object will be passed to the template function each time the render
    method is called, but it is up to the individual function to decide what
    to do with it.

    By default, this will be the view itself.

    @type Object
  */
  templateContext: Ember.computed(function(key, value) {
    return value !== undefined ? value : this;
  }).cacheable(),

  /**
    If the view is currently inserted into the DOM of a parent view, this
    property will point to the parent of the view.

    @type Ember.View
    @default null
  */
  _parentView: null,

  parentView: Ember.computed(function() {
    var parent = get(this, '_parentView');

    if (parent && parent.isVirtual) {
      return get(parent, 'parentView');
    } else {
      return parent;
    }
  }).property('_parentView'),

  /**
    If false, the view will appear hidden in DOM.

    @type Boolean
    @default true
  */
  isVisible: true,

  /**
    Array of child views. You should never edit this array directly.
    Instead, use appendChild and removeFromParent.

    @private
    @type Array
    @default []
  */
  childViews: childViewsProperty,

  _childViews: Ember.A(),

  /**
    Return the nearest ancestor that is an instance of the provided
    class.

    @param {Class} klass Subclass of Ember.View (or Ember.View itself)
    @returns Ember.View
  */
  nearestInstanceOf: function(klass) {
    var view = get(this, 'parentView');

    while (view) {
      if(view instanceof klass) { return view; }
      view = get(view, 'parentView');
    }
  },

  /**
    Return the nearest ancestor that has a given property.

    @param {String} property A property name
    @returns Ember.View
  */
  nearestWithProperty: function(property) {
    var view = get(this, 'parentView');

    while (view) {
      if (property in view) { return view; }
      view = get(view, 'parentView');
    }
  },

  /**
    Return the nearest ancestor that is a direct child of a
    view of.

    @param {Class} klass Subclass of Ember.View (or Ember.View itself)
    @returns Ember.View
  */
  nearestChildOf: function(klass) {
    var view = get(this, 'parentView');

    while (view) {
      if(get(view, 'parentView') instanceof klass) { return view; }
      view = get(view, 'parentView');
    }
  },

  /**
    Return the nearest ancestor that is an Ember.CollectionView

    @returns Ember.CollectionView
  */
  collectionView: Ember.computed(function() {
    return this.nearestInstanceOf(Ember.CollectionView);
  }).cacheable(),

  /**
    Return the nearest ancestor that is a direct child of
    an Ember.CollectionView

    @returns Ember.View
  */
  itemView: Ember.computed(function() {
    return this.nearestChildOf(Ember.CollectionView);
  }).cacheable(),

  /**
    Return the nearest ancestor that has the property
    `content`.

    @returns Ember.View
  */
  contentView: Ember.computed(function() {
    return this.nearestWithProperty('content');
  }).cacheable(),

  /**
    @private

    When the parent view changes, recursively invalidate
    collectionView, itemView, and contentView
  */
  _parentViewDidChange: Ember.observer(function() {
    this.invokeRecursively(function(view) {
      view.propertyDidChange('collectionView');
      view.propertyDidChange('itemView');
      view.propertyDidChange('contentView');
    });
  }, '_parentView'),

  /**
    Called on your view when it should push strings of HTML into a
    Ember.RenderBuffer. Most users will want to override the `template`
    or `templateName` properties instead of this method.

    By default, Ember.View will look for a function in the `template`
    property and invoke it with the value of `templateContext`. The value of
    `templateContext` will be the view itself unless you override it.

    @param {Ember.RenderBuffer} buffer The render buffer
  */
  render: function(buffer) {
    var template = get(this, 'template');

    if (template) {
      var context = get(this, 'templateContext'),
          data = { view: this, buffer: buffer, isRenderData: true };

      // Invoke the template with the provided template context, which
      // is the view by default. A hash of data is also passed that provides
      // the template with access to the view and render buffer.

      // The template should write directly to the render buffer instead
      // of returning a string.
      var output = template(context, { data: data });

      // If the template returned a string instead of writing to the buffer,
      // push the string onto the buffer.
      if (output !== undefined) { buffer.push(output); }
    }
  },

  invokeForState: function(name) {
    var parent = this, states = parent.states;
    var stateName = get(this, 'state'), state;

    while (states) {
      state = states[stateName];

      while (state) {
        var fn = state[name];

        if (fn) {
          var args = Array.prototype.slice.call(arguments, 1);
          args.unshift(this);

          return fn.apply(this, args);
        }

        state = state.parentState;
      }

      states = states.parent;
    }
  },

  /**
    Renders the view again. This will work regardless of whether the
    view is already in the DOM or not. If the view is in the DOM, the
    rendering process will be deferred to give bindings a chance
    to synchronize.

    If children were added during the rendering process using `appendChild`,
    `rerender` will remove them, because they will be added again
    if needed by the next `render`.

    In general, if the display of your view changes, you should modify
    the DOM element directly instead of manually calling `rerender`, which can
    be slow.
  */
  rerender: function() {
    return this.invokeForState('rerender');
  },

  clearRenderedChildren: function() {
    var viewMeta = meta(this)['Ember.View'],
        lengthBefore = viewMeta.lengthBeforeRender,
        lengthAfter  = viewMeta.lengthAfterRender;

    // If there were child views created during the last call to render(),
    // remove them under the assumption that they will be re-created when
    // we re-render.

    // VIEW-TODO: Unit test this path.
    var childViews = get(this, '_childViews');
    for (var i=lengthAfter-1; i>=lengthBefore; i--) {
      if (childViews[i]) { childViews[i].destroy(); }
    }
  },

  /**
    @private

    Iterates over the view's `classNameBindings` array, inserts the value
    of the specified property into the `classNames` array, then creates an
    observer to update the view's element if the bound property ever changes
    in the future.
  */
  _applyClassNameBindings: function() {
    var classBindings = get(this, 'classNameBindings'),
        classNames = get(this, 'classNames'),
        elem, newClass, dasherizedClass;

    if (!classBindings) { return; }

    // Loop through all of the configured bindings. These will be either
    // property names ('isUrgent') or property paths relative to the view
    // ('content.isUrgent')
    classBindings.forEach(function(binding) {

      // Variable in which the old class value is saved. The observer function
      // closes over this variable, so it knows which string to remove when
      // the property changes.
      var oldClass, property;

      // Set up an observer on the context. If the property changes, toggle the
      // class name.
      var observer = function() {
        // Get the current value of the property
        newClass = this._classStringForProperty(binding);
        elem = this.$();

        // If we had previously added a class to the element, remove it.
        if (oldClass) {
          elem.removeClass(oldClass);
          // Also remove from classNames so that if the view gets rerendered,
          // the class doesn't get added back to the DOM.
          classNames.removeObject(oldClass);
        }

        // If necessary, add a new class. Make sure we keep track of it so
        // it can be removed in the future.
        if (newClass) {
          elem.addClass(newClass);
          oldClass = newClass;
        } else {
          oldClass = null;
        }
      };

      // Get the class name for the property at its current value
      dasherizedClass = this._classStringForProperty(binding);

      if (dasherizedClass) {
        // Ensure that it gets into the classNames array
        // so it is displayed when we render.
        classNames.push(dasherizedClass);

        // Save a reference to the class name so we can remove it
        // if the observer fires. Remember that this variable has
        // been closed over by the observer.
        oldClass = dasherizedClass;
      }

      // Extract just the property name from bindings like 'foo:bar'
      property = binding.split(':')[0];
      addObserver(this, property, observer);
    }, this);
  },

  /**
    Iterates through the view's attribute bindings, sets up observers for each,
    then applies the current value of the attributes to the passed render buffer.

    @param {Ember.RenderBuffer} buffer
  */
  _applyAttributeBindings: function(buffer) {
    var attributeBindings = get(this, 'attributeBindings'),
        attributeValue, elem, type;

    if (!attributeBindings) { return; }

    attributeBindings.forEach(function(attribute) {
      // Create an observer to add/remove/change the attribute if the
      // JavaScript property changes.
      var observer = function() {
        elem = this.$();
        var currentValue = elem.attr(attribute);
        attributeValue = get(this, attribute);

        type = typeof attributeValue;

        if ((type === 'string' || (type === 'number' && !isNaN(attributeValue))) && attributeValue !== currentValue) {
          elem.attr(attribute, attributeValue);
        } else if (attributeValue && type === 'boolean') {
          elem.attr(attribute, attribute);
        } else if (!attributeValue) {
          elem.removeAttr(attribute);
        }
      };

      addObserver(this, attribute, observer);

      // Determine the current value and add it to the render buffer
      // if necessary.
      attributeValue = get(this, attribute);
      type = typeof attributeValue;

      if (type === 'string' || type === 'number') {
        buffer.attr(attribute, attributeValue);
      } else if (attributeValue && type === 'boolean') {
        // Apply boolean attributes in the form attribute="attribute"
        buffer.attr(attribute, attribute);
      }
    }, this);
  },

  /**
    @private

    Given a property name, returns a dasherized version of that
    property name if the property evaluates to a non-falsy value.

    For example, if the view has property `isUrgent` that evaluates to true,
    passing `isUrgent` to this method will return `"is-urgent"`.
  */
  _classStringForProperty: function(property) {
    var split = property.split(':'),
        property = split[0],
        className = split[1];

    var val = Ember.getPath(this, property);

    // If value is a Boolean and true, return the dasherized property
    // name.
    if (val === YES) {
      if (className) { return className; }

      // Normalize property path to be suitable for use
      // as a class name. For exaple, content.foo.barBaz
      // becomes bar-baz.
      var parts = property.split('.');
      return Ember.String.dasherize(parts[parts.length-1]);

    // If the value is not NO, undefined, or null, return the current
    // value of the property.
    } else if (val !== NO && val !== undefined && val !== null) {
      return val;

    // Nothing to display. Return null so that the old class is removed
    // but no new class is added.
    } else {
      return null;
    }
  },

  // ..........................................................
  // ELEMENT SUPPORT
  //

  /**
    Returns the current DOM element for the view.

    @field
    @type DOMElement
  */
  element: Ember.computed(function(key, value) {
    if (value !== undefined) {
      return this.invokeForState('setElement', value);
    } else {
      return this.invokeForState('getElement');
    }
  }).property('_parentView').cacheable(),

  /**
    Returns a jQuery object for this view's element. If you pass in a selector
    string, this method will return a jQuery object, using the current element
    as its buffer.

    For example, calling `view.$('li')` will return a jQuery object containing
    all of the `li` elements inside the DOM element of this view.

    @param {String} [selector] a jQuery-compatible selector string
    @returns {Ember.CoreQuery} the CoreQuery object for the DOM node
  */
  $: function(sel) {
    return this.invokeForState('$', sel);
  },

  /** @private */
  mutateChildViews: function(callback) {
    var childViews = get(this, '_childViews'),
        idx = get(childViews, 'length'),
        view;

    while(--idx >= 0) {
      view = childViews[idx];
      callback.call(this, view, idx);
    }

    return this;
  },

  /** @private */
  forEachChildView: function(callback) {
    var childViews = get(this, '_childViews');

    if (!childViews) { return this; }

    var len = get(childViews, 'length'),
        view, idx;

    for(idx = 0; idx < len; idx++) {
      view = childViews[idx];
      callback.call(this, view);
    }

    return this;
  },

  /**
    Appends the view's element to the specified parent element.

    If the view does not have an HTML representation yet, `createElement()`
    will be called automatically.

    Note that this method just schedules the view to be appended; the DOM
    element will not be appended to the given element until all bindings have
    finished synchronizing.

    @param {String|DOMElement|jQuery} A selector, element, HTML string, or jQuery object
    @returns {Ember.View} receiver
  */
  appendTo: function(target) {
    // Schedule the DOM element to be created and appended to the given
    // element after bindings have synchronized.
    this._insertElementLater(function() {
      this.$().appendTo(target);
    });

    return this;
  },

  /**
    Replaces the view's element to the specified parent element.
    If the view does not have an HTML representation yet, `createElement()`
    will be called automatically.
    If the parent element already has some content, it will be removed.

    Note that this method just schedules the view to be appended; the DOM
    element will not be appended to the given element until all bindings have
    finished synchronizing

    @param {String|DOMElement|jQuery} A selector, element, HTML string, or jQuery object
    @returns {Ember.View} received
  */
  replaceIn: function(target) {
    this._insertElementLater(function() {
      Ember.$(target).empty();
      this.$().appendTo(target);
    });

    return this;
  },

  /**
    @private

    Schedules a DOM operation to occur during the next render phase. This
    ensures that all bindings have finished synchronizing before the view is
    rendered.

    To use, pass a function that performs a DOM operation..

    Before your function is called, this view and all child views will receive
    the `willInsertElement` event. After your function is invoked, this view
    and all of its child views will receive the `didInsertElement` event.

        view._insertElementLater(function() {
          this.createElement();
          this.$().appendTo('body');
        });

    @param {Function} fn the function that inserts the element into the DOM
  */
  _insertElementLater: function(fn) {
    Ember.run.schedule('render', this, 'invokeForState', 'insertElement', fn);
  },

  /**
    Appends the view's element to the document body. If the view does
    not have an HTML representation yet, `createElement()` will be called
    automatically.

    Note that this method just schedules the view to be appended; the DOM
    element will not be appended to the document body until all bindings have
    finished synchronizing.

    @returns {Ember.View} receiver
  */
  append: function() {
    return this.appendTo(document.body);
  },

  /**
    Removes the view's element from the element to which it is attached.

    @returns {Ember.View} receiver
  */
  remove: function() {
    // What we should really do here is wait until the end of the run loop
    // to determine if the element has been re-appended to a different
    // element.
    // In the interim, we will just re-render if that happens. It is more
    // important than elements get garbage collected.
    this.destroyElement();
    this.invokeRecursively(function(view) {
      view.clearRenderedChildren();
    });
  },

  /**
    The ID to use when trying to locate the element in the DOM. If you do not
    set the elementId explicitly, then the view's GUID will be used instead.
    This ID must be set at the time the view is created.

    @type String
    @readOnly
  */
  elementId: Ember.computed(function(key, value) {
    return value !== undefined ? value : Ember.guidFor(this);
  }).cacheable(),

  /**
    Attempts to discover the element in the parent element. The default
    implementation looks for an element with an ID of elementId (or the view's
    guid if elementId is null). You can override this method to provide your
    own form of lookup. For example, if you want to discover your element
    using a CSS class name instead of an ID.

    @param {DOMElement} parentElement The parent's DOM element
    @returns {DOMElement} The discovered element
  */
  findElementInParentElement: function(parentElem) {
    var id = "#" + get(this, 'elementId');
    return jQuery(id)[0] || jQuery(id, parentElem)[0];
  },

  /**
    Creates a new renderBuffer with the passed tagName. You can override this
    method to provide further customization to the buffer if needed. Normally
    you will not need to call or override this method.

    @returns {Ember.RenderBuffer}
  */
  renderBuffer: function(tagName) {
    tagName = tagName || get(this, 'tagName');
    if (tagName == null) { tagName = tagName || 'div'; }

    return Ember.RenderBuffer(tagName);
  },

  /**
    Creates a DOM representation of the view and all of its
    child views by recursively calling the `render()` method.

    After the element has been created, `didInsertElement` will
    be called on this view and all of its child views.

    @returns {Ember.View} receiver
  */
  createElement: function() {
    if (get(this, 'element')) { return this; }

    var buffer = this.renderToBuffer();
    set(this, 'element', buffer.element());

    return this;
  },

  /**
    Called when a view is going to insert an element into the DOM.
  */
  willInsertElement: Ember.K,

  /**
    Called when the element of the view has been inserted into the DOM.
    Override this function to do any set up that requires an element in the
    document body.
  */
  didInsertElement: Ember.K,

  /**
    Run this callback on the current view and recursively on child views.

    @private
  */
  invokeRecursively: function(fn) {
    fn.call(this, this);

    this.forEachChildView(function(view) {
      view.invokeRecursively(fn);
    });
  },

  /**
    Invalidates the cache for a property on all child views.
  */
  invalidateRecursively: function(key) {
    this.forEachChildView(function(view) {
      view.propertyDidChange(key);
    });
  },

  /**
    @private

    Invokes the receiver's willInsertElement() method if it exists and then
    invokes the same on all child views.

    NOTE: In some cases this was called when the element existed. This no longer
    works so we let people know. We can remove this warning code later.
  */
  _notifyWillInsertElement: function(fromPreRender) {
    this.invokeRecursively(function(view) {
      if (fromPreRender) { view._willInsertElementAccessUnsupported = true; }
      view.willInsertElement();
      view._willInsertElementAccessUnsupported = false;
    });
  },

  /**
    @private

    Invokes the receiver's didInsertElement() method if it exists and then
    invokes the same on all child views.
  */
  _notifyDidInsertElement: function() {
    this.invokeRecursively(function(view) {
      view.didInsertElement();
    });
  },

  /**
    Destroys any existing element along with the element for any child views
    as well. If the view does not currently have a element, then this method
    will do nothing.

    If you implement willDestroyElement() on your view, then this method will
    be invoked on your view before your element is destroyed to give you a
    chance to clean up any event handlers, etc.

    If you write a willDestroyElement() handler, you can assume that your
    didInsertElement() handler was called earlier for the same element.

    Normally you will not call or override this method yourself, but you may
    want to implement the above callbacks when it is run.

    @returns {Ember.View} receiver
  */
  destroyElement: function() {
    return this.invokeForState('destroyElement');
  },

  /**
    Called when the element of the view is going to be destroyed. Override
    this function to do any teardown that requires an element, like removing
    event listeners.
  */
  willDestroyElement: function() {},

  /**
    @private

    Invokes the `willDestroyElement` callback on the view and child views.
  */
  _notifyWillDestroyElement: function() {
    this.invokeRecursively(function(view) {
      view.willDestroyElement();
    });
  },

  /** @private (nodoc) */
  _elementWillChange: Ember.beforeObserver(function() {
    this.forEachChildView(function(view) {
      Ember.propertyWillChange(view, 'element');
    });
  }, 'element'),

  /**
    @private

    If this view's element changes, we need to invalidate the caches of our
    child views so that we do not retain references to DOM elements that are
    no longer needed.

    @observes element
  */
  _elementDidChange: Ember.observer(function() {
    this.forEachChildView(function(view) {
      Ember.propertyDidChange(view, 'element');
    });
  }, 'element'),

  /**
    Called when the parentView property has changed.

    @function
  */
  parentViewDidChange: Ember.K,

  /**
    @private

    Invoked by the view system when this view needs to produce an HTML
    representation. This method will create a new render buffer, if needed,
    then apply any default attributes, such as class names and visibility.
    Finally, the `render()` method is invoked, which is responsible for
    doing the bulk of the rendering.

    You should not need to override this method; instead, implement the
    `template` property, or if you need more control, override the `render`
    method.

    @param {Ember.RenderBuffer} buffer the render buffer. If no buffer is
      passed, a default buffer, using the current view's `tagName`, will
      be used.
  */
  renderToBuffer: function(parentBuffer, bufferOperation) {
    var viewMeta = meta(this)['Ember.View'];
    var buffer;

    Ember.run.sync();

    // Determine where in the parent buffer to start the new buffer.
    // By default, a new buffer will be appended to the parent buffer.
    // The buffer operation may be changed if the child views array is
    // mutated by Ember.ContainerView.
    bufferOperation = bufferOperation || 'begin';

    // If this is the top-most view, start a new buffer. Otherwise,
    // create a new buffer relative to the original using the
    // provided buffer operation (for example, `insertAfter` will
    // insert a new buffer after the "parent buffer").
    if (parentBuffer) {
      var tagName = get(this, 'tagName');
      tagName = tagName == null ? 'div' : tagName;

      buffer = parentBuffer[bufferOperation](tagName);
    } else {
      buffer = this.renderBuffer();
    }

    viewMeta.buffer = buffer;
    this.transitionTo('inBuffer');

    viewMeta.lengthBeforeRender = getPath(this, '_childViews.length');

    this.beforeRender(buffer);
    this.render(buffer);
    this.afterRender(buffer);

    viewMeta.lengthAfterRender = getPath(this, '_childViews.length');

    return buffer;
  },

  beforeRender: function(buffer) {
    this.applyAttributesToBuffer(buffer);
  },

  afterRender: Ember.K,

  /**
    @private
  */
  applyAttributesToBuffer: function(buffer) {
    // Creates observers for all registered class name and attribute bindings,
    // then adds them to the element.
    this._applyClassNameBindings();

    // Pass the render buffer so the method can apply attributes directly.
    // This isn't needed for class name bindings because they use the
    // existing classNames infrastructure.
    this._applyAttributeBindings(buffer);


    get(this, 'classNames').forEach(function(name){ buffer.addClass(name); });
    buffer.id(get(this, 'elementId'));

    var role = get(this, 'ariaRole');
    if (role) {
      buffer.attr('role', role);
    }

    if (!get(this, 'isVisible')) {
      buffer.style('display', 'none');
    }
  },

  // ..........................................................
  // STANDARD RENDER PROPERTIES
  //

  /**
    Tag name for the view's outer element. The tag name is only used when
    an element is first created. If you change the tagName for an element, you
    must destroy and recreate the view element.

    By default, the render buffer will use a `<div>` tag for views.

    @type String
    @default null
  */

  // We leave this null by default so we can tell the difference between
  // the default case and a user-specified tag.
  tagName: null,

  /**
    The WAI-ARIA role of the control represented by this view. For example, a
    button may have a role of type 'button', or a pane may have a role of
    type 'alertdialog'. This property is used by assistive software to help
    visually challenged users navigate rich web applications.

    The full list of valid WAI-ARIA roles is available at:
    http://www.w3.org/TR/wai-aria/roles#roles_categorization

    @type String
    @default null
  */
  ariaRole: null,

  /**
    Standard CSS class names to apply to the view's outer element. This
    property automatically inherits any class names defined by the view's
    superclasses as well.

    @type Array
    @default ['ember-view']
  */
  classNames: ['ember-view'],

  /**
    A list of properties of the view to apply as class names. If the property
    is a string value, the value of that string will be applied as a class
    name.

        // Applies the 'high' class to the view element
        Ember.View.create({
          classNameBindings: ['priority']
          priority: 'high'
        });

    If the value of the property is a Boolean, the name of that property is
    added as a dasherized class name.

        // Applies the 'is-urgent' class to the view element
        Ember.View.create({
          classNameBindings: ['isUrgent']
          isUrgent: true
        });

    If you would prefer to use a custom value instead of the dasherized
    property name, you can pass a binding like this:

        // Applies the 'urgent' class to the view element
        Ember.View.create({
          classNameBindings: ['isUrgent:urgent']
          isUrgent: true
        });

    This list of properties is inherited from the view's superclasses as well.

    @type Array
    @default []
  */
  classNameBindings: [],

  /**
    A list of properties of the view to apply as attributes. If the property is
    a string value, the value of that string will be applied as the attribute.

        // Applies the type attribute to the element
        // with the value "button", like <div type="button">
        Ember.View.create({
          attributeBindings: ['type'],
          type: 'button'
        });

    If the value of the property is a Boolean, the name of that property is
    added as an attribute.

        // Renders something like <div enabled="enabled">
        Ember.View.create({
          attributeBindings: ['enabled'],
          enabled: true
        });
  */
  attributeBindings: [],

  // .......................................................
  // CORE DISPLAY METHODS
  //

  /**
    @private

    Setup a view, but do not finish waking it up.
    - configure childViews
    - register the view with the global views hash, which is used for event
      dispatch
  */
  init: function() {
    set(this, 'state', 'preRender');

    var parentView = get(this, '_parentView');

    this._super();

    // Register the view for event handling. This hash is used by
    // Ember.RootResponder to dispatch incoming events.
    Ember.View.views[get(this, 'elementId')] = this;

    var childViews = Ember.A(get(this, '_childViews').slice());
    // setup child views. be sure to clone the child views array first
    set(this, '_childViews', childViews);


    this.classNameBindings = Ember.A(get(this, 'classNameBindings').slice());
    this.classNames = Ember.A(get(this, 'classNames').slice());

    set(this, 'domManager', this.domManagerClass.create({ view: this }));

    meta(this)["Ember.View"] = {};
  },

  appendChild: function(view, options) {
    return this.invokeForState('appendChild', view, options);
  },

  /**
    Removes the child view from the parent view.

    @param {Ember.View} view
    @returns {Ember.View} receiver
  */
  removeChild: function(view) {
    // update parent node
    set(view, '_parentView', null);

    // remove view from childViews array.
    var childViews = get(this, '_childViews');
    childViews.removeObject(view);

    return this;
  },

  /**
    Removes all children from the parentView.

    @returns {Ember.View} receiver
  */
  removeAllChildren: function() {
    return this.mutateChildViews(function(view) {
      this.removeChild(view);
    });
  },

  destroyAllChildren: function() {
    return this.mutateChildViews(function(view) {
      view.destroy();
    });
  },

  /**
    Removes the view from its parentView, if one is found. Otherwise
    does nothing.

    @returns {Ember.View} receiver
  */
  removeFromParent: function() {
    var parent = get(this, '_parentView');

    // Remove DOM element from parent
    this.remove();

    if (parent) { parent.removeChild(this); }
    return this;
  },

  /**
    You must call this method on a view to destroy the view (and all of its
    child views). This will remove the view from any parent node, then make
    sure that the DOM element managed by the view can be released by the
    memory manager.
  */
  destroy: function() {
    if (get(this, 'isDestroyed')) { return; }

    // calling this._super() will nuke computed properties and observers,
    // so collect any information we need before calling super.
    var viewMeta   = meta(this)['Ember.View'],
        childViews = get(this, '_childViews'),
        parent     = get(this, '_parentView'),
        elementId  = get(this, 'elementId'),
        childLen   = childViews.length;

    // destroy the element -- this will avoid each child view destroying
    // the element over and over again...
    if (!this.removedFromDOM) { this.destroyElement(); }

    // remove from parent if found. Don't call removeFromParent,
    // as removeFromParent will try to remove the element from
    // the DOM again.
    if (parent) { parent.removeChild(this); }

    Ember.Descriptor.setup(this, 'state', 'destroyed');

    this._super();

    for (var i=childLen-1; i>=0; i--) {
      childViews[i].removedFromDOM = true;
      childViews[i].destroy();
    }

    // next remove view from global hash
    delete Ember.View.views[get(this, 'elementId')];

    return this; // done with cleanup
  },

  /**
    Instantiates a view to be added to the childViews array during view
    initialization. You generally will not call this method directly unless
    you are overriding createChildViews(). Note that this method will
    automatically configure the correct settings on the new view instance to
    act as a child of the parent.

    @param {Class} viewClass
    @param {Hash} [attrs] Attributes to add
    @returns {Ember.View} new instance
    @test in createChildViews
  */
  createChildView: function(view, attrs) {
    if (Ember.View.detect(view)) {
      view = view.create(attrs || {}, { _parentView: this });

      var viewName = attrs && attrs.viewName || view.viewName;
      if (viewName) { set(this, viewName, view); }
    } else {
      ember_assert('must pass instance of View', view instanceof Ember.View);
      set(view, '_parentView', this);
    }
    return view;
  },

  /**
    @private

    When the view's `isVisible` property changes, toggle the visibility
    element of the actual DOM element.
  */
  _isVisibleDidChange: Ember.observer(function() {
    this.$().toggle(get(this, 'isVisible'));
  }, 'isVisible'),

  clearBuffer: function() {
    this.invokeRecursively(function(view) {
      meta(view)['Ember.View'].buffer = null;
    });
  },

  transitionTo: function(state, children) {
    set(this, 'state', state);

    if (children !== false) {
      this.forEachChildView(function(view) {
        view.transitionTo(state);
      });
    }
  }

});

/**
  Describe how the specified actions should behave in the various
  states that a view can exist in. Possible states:

  * preRender: when a view is first instantiated, and after its
    element was destroyed, it is in the preRender state
  * inBuffer: once a view has been rendered, but before it has
    been inserted into the DOM, it is in the inBuffer state
  * inDOM: once a view has been inserted into the DOM it is in
    the inDOM state. A view spends the vast majority of its
    existence in this state.
  * destroyed: once a view has been destroyed (using the destroy
    method), it is in this state. No further actions can be invoked
    on a destroyed view.
*/

  // in the destroyed state, everything is illegal

  // before rendering has begun, all legal manipulations are noops.

  // inside the buffer, legal manipulations are done on the buffer

  // once the view has been inserted into the DOM, legal manipulations
  // are done on the DOM element.

Ember.View.reopen({
  states: Ember.View.states,
  domManagerClass: Ember.Object.extend({
    view: this,

    prepend: function(childView) {
      var view = get(this, 'view');

      childView._insertElementLater(function() {
        var element = view.$();
        element.prepend(childView.$());
      });
    },

    after: function(nextView) {
      var view = get(this, 'view');

      nextView._insertElementLater(function() {
        var element = view.$();
        element.after(nextView.$());
      });
    },

    replace: function() {
      var view = get(this, 'view');
      var element = get(view, 'element');

      set(view, 'element', null);

      view._insertElementLater(function() {
        Ember.$(element).replaceWith(get(view, 'element'));
      });
    },

    remove: function() {
      var view = get(this, 'view');
      var elem = get(view, 'element');

      set(view, 'element', null);

      Ember.$(elem).remove();
    }
  })
});

// Create a global view hash.
Ember.View.views = {};

// If someone overrides the child views computed property when
// defining their class, we want to be able to process the user's
// supplied childViews and then restore the original computed property
// at view initialization time. This happens in Ember.ContainerView's init
// method.
Ember.View.childViewsProperty = childViewsProperty;

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

Ember.View.states = {
  _default: {
    // appendChild is only legal while rendering the buffer.
    appendChild: function() {
      throw "You can't use appendChild outside of the rendering process";
    },

    $: function() {
      return Ember.$();
    },

    getElement: function() {
      return null;
    }
  }
};

Ember.View.reopen({
  states: Ember.View.states
});

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
Ember.View.states.preRender = {
  parentState: Ember.View.states._default,

  // a view leaves the preRender state once its element has been
  // created (createElement).
  insertElement: function(view, fn) {
    view.createElement();
    view._notifyWillInsertElement(true);
    // after createElement, the view will be in the hasElement state.
    fn.call(view);
    view.transitionTo('inDOM');
    view._notifyDidInsertElement();
  },

  // This exists for the removal warning, remove later
  $: function(view){
    if (view._willInsertElementAccessUnsupported) {
      console.error("Getting element from willInsertElement is unreliable and no longer supported.");
    }
    return Ember.$();
  },

  // This exists for the removal warning, remove later
  getElement: function(view){
    if (view._willInsertElementAccessUnsupported) {
      console.error("Getting element from willInsertElement is unreliable and no longer supported.");
    }
    return null;
  },

  setElement: function(view, value) {
    view.beginPropertyChanges();
    view.invalidateRecursively('element');

    if (value !== null) {
      view.transitionTo('hasElement');
    }

    view.endPropertyChanges();

    return value;
  }
};

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, meta = Ember.meta;

Ember.View.states.inBuffer = {
  parentState: Ember.View.states._default,

  $: function(view, sel) {
    // if we don't have an element yet, someone calling this.$() is
    // trying to update an element that isn't in the DOM. Instead,
    // rerender the view to allow the render method to reflect the
    // changes.
    view.rerender();
    return Ember.$();
  },

  // when a view is rendered in a buffer, rerendering it simply
  // replaces the existing buffer with a new one
  rerender: function(view) {
    var buffer = meta(view)['Ember.View'].buffer;

    view.clearRenderedChildren();
    view.renderToBuffer(buffer, 'replaceWith');
  },

  // when a view is rendered in a buffer, appending a child
  // view will render that view and append the resulting
  // buffer into its buffer.
  appendChild: function(view, childView, options) {
    var buffer = meta(view)['Ember.View'].buffer;

    childView = this.createChildView(childView, options);
    get(view, '_childViews').pushObject(childView);
    childView.renderToBuffer(buffer);
    return childView;
  },

  // when a view is rendered in a buffer, destroying the
  // element will simply destroy the buffer and put the
  // state back into the preRender state.
  destroyElement: function(view) {
    view.clearBuffer();
    view._notifyWillDestroyElement();
    view.transitionTo('preRender');

    return view;
  },

  // It should be impossible for a rendered view to be scheduled for
  // insertion.
  insertElement: function() {
    throw "You can't insert an element that has already been rendered";
  },

  setElement: function(view, value) {
    view.invalidateRecursively('element');

    if (value === null) {
      view.transitionTo('preRender');
    } else {
      view.clearBuffer();
      view.transitionTo('hasElement');
    }

    return value;
  }
};


})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, meta = Ember.meta;

Ember.View.states.hasElement = {
  parentState: Ember.View.states._default,

  $: function(view, sel) {
    var elem = get(view, 'element');
    return sel ? Ember.$(sel, elem) : Ember.$(elem);
  },

  getElement: function(view) {
    var parent = get(view, 'parentView');
    if (parent) { parent = get(parent, 'element'); }
    if (parent) { return view.findElementInParentElement(parent); }
    return Ember.$("#" + get(view, 'elementId'))[0];
  },

  setElement: function(view, value) {
    if (value === null) {
      view.invalidateRecursively('element');
      view.transitionTo('preRender');
    } else {
      throw "You cannot set an element to a non-null value when the element is already in the DOM.";
    }

    return value;
  },

  // once the view has been inserted into the DOM, rerendering is
  // deferred to allow bindings to synchronize.
  rerender: function(view) {
    view.clearRenderedChildren();

    get(view, 'domManager').replace();
    return view;
  },

  // once the view is already in the DOM, destroying it removes it
  // from the DOM, nukes its element, and puts it back into the
  // preRender state.
  destroyElement: function(view) {
    view.invokeRecursively(function(view) {
      this.willDestroyElement();
    });

    get(view, 'domManager').remove();
    return view;
  }
};

Ember.View.states.inDOM = {
  parentState: Ember.View.states.hasElement,

  insertElement: function() {
    throw "You can't insert an element into the DOM that has already been inserted";
  }
};

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var destroyedError = "You can't call %@ on a destroyed view", fmt = Ember.String.fmt;

Ember.View.states.destroyed = {
  parentState: Ember.View.states._default,

  appendChild: function() {
    throw fmt(destroyedError, ['appendChild']);
  },
  rerender: function() {
    throw fmt(destroyedError, ['rerender']);
  },
  destroyElement: function() {
    throw fmt(destroyedError, ['destroyElement']);
  },

  setElement: function() {
    throw fmt(destroyedError, ["set('element', ...)"]);
  },

  // Since element insertion is scheduled, don't do anything if
  // the view has been destroyed between scheduling and execution
  insertElement: Ember.K
};


})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, meta = Ember.meta;

var childViewsProperty = Ember.computed(function() {
  return get(this, '_childViews');
}).property('_childViews').cacheable();

Ember.ContainerView = Ember.View.extend({

  init: function() {
    var childViews = get(this, 'childViews');
    Ember.defineProperty(this, 'childViews', childViewsProperty);

    this._super();

    var _childViews = get(this, '_childViews');

    childViews.forEach(function(viewName, idx) {
      var view;

      if ('string' === typeof viewName) {
        view = get(this, viewName);
        view = this.createChildView(view);
        set(this, viewName, view);
      } else {
        view = this.createChildView(viewName);
      }

      _childViews[idx] = view;
    }, this);
  },

  /**
    Extends Ember.View's implementation of renderToBuffer to
    set up an array observer on the child views array. This
    observer will detect when child views are added or removed
    and update the DOM to reflect the mutation.

    Note that we set up this array observer in the `renderToBuffer`
    method because any views set up previously will be rendered the first
    time the container is rendered.

    @private
  */
  renderToBuffer: function() {
    var ret = this._super.apply(this, arguments);

    get(this, 'childViews').addArrayObserver(this, {
      willChange: 'childViewsWillChange',
      didChange: 'childViewsDidChange'
    });

    return ret;
  },

  /**
    Instructs each child view to render to the passed render buffer.

    @param {Ember.RenderBuffer} buffer the buffer to render to
    @private
  */
  render: function(buffer) {
    this.forEachChildView(function(view) {
      view.renderToBuffer(buffer);
    });
  },

  /**
    When the container view is destroyer, tear down the child views
    array observer.

    @private
  */
  destroy: function() {
    get(this, 'childViews').removeArrayObserver(this, {
      willChange: 'childViewsWillChange',
      didChange: 'childViewsDidChange'
    });

    this._super();
  },

  /**
    When a child view is removed, destroy its element so that
    it is removed from the DOM.

    The array observer that triggers this action is set up in the
    `renderToBuffer` method.

    @private
    @param {Ember.Array} views the child views array before mutation
    @param {Number} start the start position of the mutation
    @param {Number} removed the number of child views removed
  **/
  childViewsWillChange: function(views, start, removed) {
    this.invokeForState('childViewsWillChange', views, start, removed);
  },

  /**
    When a child view is added, make sure the DOM gets updated appropriately.

    If the view has already rendered an element, we tell the child view to
    create an element and insert it into the DOM. If the enclosing container view
    has already written to a buffer, but not yet converted that buffer into an
    element, we insert the string representation of the child into the appropriate
    place in the buffer.

    @private
    @param {Ember.Array} views the array of child views afte the mutation has occurred
    @param {Number} start the start position of the mutation
    @param {Number} removed the number of child views removed
    @param {Number} the number of child views added
  */
  childViewsDidChange: function(views, start, removed, added) {
    var len = get(views, 'length');

    // No new child views were added; bail out.
    if (added === 0) return;

    // Let the current state handle the changes
    this.invokeForState('childViewsDidChange', views, start, added);
  },

  /**
    Schedules a child view to be inserted into the DOM after bindings have
    finished syncing for this run loop.

    @param {Ember.View} view the child view to insert
    @param {Ember.View} prev the child view after which the specified view should
                     be inserted
    @private
  */
  _scheduleInsertion: function(view, prev) {
    if (prev) {
      prev.get('domManager').after(view);
    } else {
      this.get('domManager').prepend(view);
    }
  }
});

// Ember.ContainerView extends the default view states to provide different
// behavior for childViewsWillChange and childViewsDidChange.
Ember.ContainerView.states = {
  parent: Ember.View.states,

  inBuffer: {
    childViewsDidChange: function(parentView, views, start, added) {
      var buffer = meta(parentView)['Ember.View'].buffer,
          startWith, prev, prevBuffer, view;

      // Determine where to begin inserting the child view(s) in the
      // render buffer.
      if (start === 0) {
        // If views were inserted at the beginning, prepend the first
        // view to the render buffer, then begin inserting any
        // additional views at the beginning.
        view = views[start];
        startWith = start + 1;
        view.renderToBuffer(buffer, 'prepend');
      } else {
        // Otherwise, just insert them at the same place as the child
        // views mutation.
        view = views[start - 1];
        startWith = start;
      }

      for (var i=startWith; i<start+added; i++) {
        prev = view;
        view = views[i];
        prevBuffer = meta(prev)['Ember.View'].buffer;
        view.renderToBuffer(prevBuffer, 'insertAfter');
      }
    }
  },

  hasElement: {
    childViewsWillChange: function(view, views, start, removed) {
      for (var i=start; i<start+removed; i++) {
        views[i].destroyElement();
      }
    },

    childViewsDidChange: function(view, views, start, added) {
      // If the DOM element for this container view already exists,
      // schedule each child view to insert its DOM representation after
      // bindings have finished syncing.
      var prev = start === 0 ? null : views[start-1];

      for (var i=start; i<start+added; i++) {
        view = views[i];
        this._scheduleInsertion(view, prev);
        prev = view;
      }
    }
  }
};

Ember.ContainerView.states.inDOM = {
  parentState: Ember.ContainerView.states.hasElement
};

Ember.ContainerView.reopen({
  states: Ember.ContainerView.states
});

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;

/**
  @class
  @since Ember 0.9
  @extends Ember.View
*/
Ember.CollectionView = Ember.ContainerView.extend(
/** @scope Ember.CollectionView.prototype */ {

  /**
    A list of items to be displayed by the Ember.CollectionView.

    @type Ember.Array
    @default null
  */
  content: null,

  /**
    An optional view to display if content is set to an empty array.

    @type Ember.View
    @default null
  */
  emptyView: null,

  /**
    @type Ember.View
    @default Ember.View
  */
  itemViewClass: Ember.View,

  init: function() {
    var ret = this._super();
    this._contentDidChange();
    return ret;
  },

  _contentWillChange: Ember.beforeObserver(function() {
    var content = this.get('content');

    if (content) { content.removeArrayObserver(this); }
    var len = content ? get(content, 'length') : 0;
    this.arrayWillChange(content, 0, len);
  }, 'content'),

  /**
    @private

    Check to make sure that the content has changed, and if so,
    update the children directly. This is always scheduled
    asynchronously, to allow the element to be created before
    bindings have synchronized and vice versa.
  */
  _contentDidChange: Ember.observer(function() {
    var content = get(this, 'content');

    if (content) {
      ember_assert(fmt("an Ember.CollectionView's content must implement Ember.Array. You passed %@", [content]), content.addArrayObserver != null);
      content.addArrayObserver(this);
    }

    var len = content ? get(content, 'length') : 0;
    this.arrayDidChange(content, 0, null, len);
  }, 'content'),

  destroy: function() {
    var content = get(this, 'content');
    if (content) { content.removeArrayObserver(this); }

    this._super();

    return this;
  },

  arrayWillChange: function(content, start, removedCount) {
    // If the contents were empty before and this template collection has an
    // empty view remove it now.
    var emptyView = get(this, 'emptyView');
    if (emptyView && emptyView instanceof Ember.View) {
      emptyView.removeFromParent();
    }

    // Loop through child views that correspond with the removed items.
    // Note that we loop from the end of the array to the beginning because
    // we are mutating it as we go.
    var childViews = get(this, 'childViews'), childView, idx, len;

    len = get(childViews, 'length');
    for (idx = start + removedCount - 1; idx >= start; idx--) {
      childViews[idx].destroy();
    }
  },

  /**
    Called when a mutation to the underlying content array occurs.

    This method will replay that mutation against the views that compose the
    Ember.CollectionView, ensuring that the view reflects the model.

    This array observer is added in contentDidChange.

    @param {Array} addedObjects
      the objects that were added to the content

    @param {Array} removedObjects
      the objects that were removed from the content

    @param {Number} changeIndex
      the index at which the changes occurred
  */
  arrayDidChange: function(content, start, removed, added) {
    var itemViewClass = get(this, 'itemViewClass'),
        childViews = get(this, 'childViews'),
        addedViews = [], view, item, idx, len, itemTagName;

    ember_assert(fmt("itemViewClass must be a subclass of Ember.View, not %@", [itemViewClass]), Ember.View.detect(itemViewClass));

    len = content ? get(content, 'length') : 0;
    if (len) {
      for (idx = start; idx < start+added; idx++) {
        item = content.objectAt(idx);

        view = this.createChildView(itemViewClass, {
          content: item,
          contentIndex: idx
        });

        addedViews.push(view);
      }
    } else {
      var emptyView = get(this, 'emptyView');
      if (!emptyView) { return; }

      emptyView = this.createChildView(emptyView);
      addedViews.push(emptyView);
      set(this, 'emptyView', emptyView);
    }

    childViews.replace(start, 0, addedViews);
  },

  createChildView: function(view, attrs) {
    var view = this._super(view, attrs);

    var itemTagName = get(view, 'tagName');
    var tagName = itemTagName == null ? Ember.CollectionView.CONTAINER_MAP[get(this, 'tagName')] : itemTagName;

    set(view, 'tagName', tagName);

    return view;
  }
});

/**
  @static

  A map of parent tags to their default child tags. You can add
  additional parent tags if you want collection views that use
  a particular parent tag to default to a child tag.

  @type Hash
  @constant
*/
Ember.CollectionView.CONTAINER_MAP = {
  ul: 'li',
  ol: 'li',
  table: 'tr',
  thead: 'tr',
  tbody: 'tr',
  tfoot: 'tr',
  tr: 'td',
  select: 'option'
};

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});


(function(exports) {
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2006-2011 Strobe Inc. and contributors.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
Ember.$ = jQuery;
})({});

(function(exports) {
var get = Ember.get, set = Ember.set;

Ember.State = Ember.Object.extend({
  isState: true,
  parentState: null,
  start: null,

  init: function() {
    Ember.keys(this).forEach(function(name) {
      var value = this[name];

      if (value && value.isState) {
        set(value, 'parentState', this);
        set(value, 'name', (get(this, 'name') || '') + '.' + name);
      }
    }, this);
  },

  enter: Ember.K,
  exit: Ember.K
});

})({});


(function(exports) {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath, fmt = Ember.String.fmt;
Ember.LOG_STATE_TRANSITIONS = false;

Ember.StateManager = Ember.State.extend({
  /**
    When creating a new storyboard, look for a default state to transition
    into. This state can either be named `start`, or can be specified using the
    `initialState` property.
  */
  init: function() {
    this._super();

    var states = get(this, 'states');
    if (!states) {
      states = {};
      Ember.keys(this).forEach(function(name) {
        var value = get(this, name);

        if (value && value.isState) {
          states[name] = value;
        }
      }, this);

      set(this, 'states', states);
    }

    var initialState = get(this, 'initialState');

    if (!initialState && get(this, 'start')) {
      initialState = 'start';
    }

    if (initialState) {
      this.goToState(initialState);
    }
  },

  currentState: null,

  /**
    If the current state is a view state or the descendent of a view state,
    this property will be the view associated with it. If there is no
    view state active in this state manager, this value will be null.
  */
  currentView: SC.computed(function() {
    var currentState = get(this, 'currentState'),
        view;

    while (currentState) {
      if (get(currentState, 'isViewState')) {
        view = get(currentState, 'view');
        if (view) { return view; }
      }

      currentState = get(currentState, 'parentState');
    }

    return null;
  }).property('currentState').cacheable(),

  send: function(event, context) {
    this.sendRecursively(event, get(this, 'currentState'), context);
  },

  sendRecursively: function(event, currentState, context) {
    var log = Ember.LOG_STATE_TRANSITIONS;

    var action = currentState[event];

    if (action) {
      if (log) { console.log(fmt("STORYBOARDS: Sending event '%@' to state %@.", [event, currentState.name])); }
      action.call(currentState, this, context);
    } else {
      var parentState = get(currentState, 'parentState');
      if (parentState) { this.sendRecursively(event, parentState, context); }
    }
  },

  goToState: function(name) {
    var currentState = get(this, 'currentState') || this, state, newState;

    var exitStates = Ember.A();

    newState = getPath(currentState, name);
    state = currentState;

    if (!newState) {
      while (state && !newState) {
        exitStates[Ember.guidFor(state)] = state;
        exitStates.push(state);

        state = get(state, 'parentState');
        if (!state) {
          state = get(this, 'states');
        }
        newState = getPath(state, name);
      }
    }

    this.enterState(state, name, exitStates);
  },

  getState: function(name) {
    var state = get(this, name),
        parentState = get(this, 'parentState');

    if (state) {
      return state;
    } else if (parentState) {
      return parentState.getState(name);
    }
  },

  asyncEach: function(list, callback, doneCallback) {
    var async = false, self = this;

    if (!list.length) {
      if (doneCallback) { doneCallback.call(this); }
      return;
    }

    var head = list[0];
    var tail = list.slice(1);

    var transition = {
      async: function() { async = true; },
      resume: function() {
        self.asyncEach(tail, callback, doneCallback);
      }
    };

    callback.call(this, head, transition);

    if (!async) { transition.resume(); }
  },

  enterState: function(parent, name, exitStates) {
    var log = Ember.LOG_STATE_TRANSITIONS;

    var parts = name.split("."), state = parent, enterStates = Ember.A();

    parts.forEach(function(name) {
      state = state[name];

      var guid = Ember.guidFor(state);

      if (guid in exitStates) {
        exitStates.removeObject(state);
        delete exitStates[guid];
      } else {
        enterStates.push(state);
      }
    });

    var stateManager = this;

    this.asyncEach(exitStates, function(state, transition) {
      state.exit(stateManager, transition);
    }, function() {
      this.asyncEach(enterStates, function(state, transition) {
        if (log) { console.log("STORYBOARDS: Entering " + state.name); }
        state.enter(stateManager, transition);
      }, function() {
        var startState = state, enteredState;

        // right now, start states cannot be entered asynchronously
        while (startState = get(startState, 'start')) {
          enteredState = startState;
          startState.enter(stateManager);
        }

        set(this, 'currentState', enteredState || state);
      });
    });
  }
});

})({});


(function(exports) {
var get = Ember.get, set = Ember.set;

Ember.ViewState = Ember.State.extend({
  isViewState: true,

  enter: function(stateManager) {
    var view = get(this, 'view');

    if (view) {
      view.appendTo(stateManager.get('rootElement') || 'body');
    }
  },

  exit: function(stateManager) {
    var view = get(this, 'view');

    if (view) {
      view.remove();
    }
  }
});


})({});


(function(exports) {
// ==========================================================================
// Project:  Ember Storyboards
// Copyright: Â©2011 Living Social Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});

(function(exports) {
// ==========================================================================
// Project:   metamorph
// Copyright: Â©2011 My Company Inc. All rights reserved.
// ==========================================================================

(function(window) {

  var K = function(){},
      guid = 0,
      document = window.document,

      // Feature-detect the W3C range API, the extended check is for IE9 which only partially supports ranges
      supportsRange = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment,

      // Internet Explorer prior to 9 does not allow setting innerHTML if the first element
      // is a "zero-scope" element. This problem can be worked around by making
      // the first node an invisible text node. We, like Modernizr, use &shy;
      needsShy = (function(){
        var testEl = document.createElement('div');
        testEl.innerHTML = "<div></div>";
        testEl.firstChild.innerHTML = "<script></script>";
        return testEl.firstChild.innerHTML === '';
      })();

  // Constructor that supports either Metamorph('foo') or new
  // Metamorph('foo');
  // 
  // Takes a string of HTML as the argument.

  var Metamorph = function(html) {
    var self;

    if (this instanceof Metamorph) {
      self = this;
    } else {
      self = new K();
    }

    self.innerHTML = html;
    var myGuid = 'metamorph-'+(guid++);
    self.start = myGuid + '-start';
    self.end = myGuid + '-end';

    return self;
  };

  K.prototype = Metamorph.prototype;

  var rangeFor, htmlFunc, removeFunc, outerHTMLFunc, appendToFunc, afterFunc, prependFunc, startTagFunc, endTagFunc;

  outerHTMLFunc = function() {
    return this.startTag() + this.innerHTML + this.endTag();
  };

  startTagFunc = function() {
    return "<script id='" + this.start + "' type='text/x-placeholder'></script>";
  };

  endTagFunc = function() {
    return "<script id='" + this.end + "' type='text/x-placeholder'></script>";
  };

  // If we have the W3C range API, this process is relatively straight forward.
  if (supportsRange) {

    // IE 9 supports ranges but doesn't define createContextualFragment
    if (!Range.prototype.createContextualFragment) {
      Range.prototype.createContextualFragment = function(html) {
        var frag = document.createDocumentFragment(),
             div = document.createElement("div");
        frag.appendChild(div);
        div.outerHTML = html;
        return frag;
      };
    }

    // Get a range for the current morph. Optionally include the starting and
    // ending placeholders.
    rangeFor = function(morph, outerToo) {
      var range = document.createRange();
      var before = document.getElementById(morph.start);
      var after = document.getElementById(morph.end);

      if (outerToo) {
        range.setStartBefore(before);
        range.setEndAfter(after);
      } else {
        range.setStartAfter(before);
        range.setEndBefore(after);
      }

      return range;
    };

    htmlFunc = function(html, outerToo) {
      // get a range for the current metamorph object
      var range = rangeFor(this, outerToo);

      // delete the contents of the range, which will be the
      // nodes between the starting and ending placeholder.
      range.deleteContents();

      // create a new document fragment for the HTML
      var fragment = range.createContextualFragment(html);

      // insert the fragment into the range
      range.insertNode(fragment);
    };

    removeFunc = function() {
      // get a range for the current metamorph object including
      // the starting and ending placeholders.
      var range = rangeFor(this, true);

      // delete the entire range.
      range.deleteContents();
    };

    appendToFunc = function(node) {
      var range = document.createRange();
      range.setStart(node);
      range.collapse(false);
      var frag = range.createContextualFragment(this.outerHTML());
      node.appendChild(frag);
    };

    afterFunc = function(html) {
      var range = document.createRange();
      var after = document.getElementById(this.end);

      range.setStartAfter(after);
      range.setEndAfter(after);

      var fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
    };

    prependFunc = function(html) {
      var range = document.createRange();
      var start = document.getElementById(this.start);

      range.setStartAfter(start);
      range.setEndAfter(start);

      var fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
    };

  } else {
    /**
     * This code is mostly taken from jQuery, with one exception. In jQuery's case, we
     * have some HTML and we need to figure out how to convert it into some nodes.
     *
     * In this case, jQuery needs to scan the HTML looking for an opening tag and use
     * that as the key for the wrap map. In our case, we know the parent node, and
     * can use its type as the key for the wrap map.
     **/
    var wrapMap = {
      select: [ 1, "<select multiple='multiple'>", "</select>" ],
      fieldset: [ 1, "<fieldset>", "</fieldset>" ],
      table: [ 1, "<table>", "</table>" ],
      tbody: [ 2, "<table><tbody>", "</tbody></table>" ],
      tr: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
      colgroup: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
      map: [ 1, "<map>", "</map>" ],
      _default: [ 0, "", "" ]
    };

    /**
     * Given a parent node and some HTML, generate a set of nodes. Return the first
     * node, which will allow us to traverse the rest using nextSibling.
     *
     * We need to do this because innerHTML in IE does not really parse the nodes.
     **/
    var firstNodeFor = function(parentNode, html) {
      var arr = wrapMap[parentNode.tagName.toLowerCase()] || wrapMap._default;
      var depth = arr[0], start = arr[1], end = arr[2];

      if (needsShy) { html = '&shy;'+html; }

      var element = document.createElement('div');
      element.innerHTML = start + html + end;

      for (var i=0; i<=depth; i++) {
        element = element.firstChild;
      }

      // Look for &shy; to remove it.
      if (needsShy) {
        var shyElement = element;

        // Sometimes we get nameless elements with the shy inside
        while (shyElement.nodeType === 1 && !shyElement.nodeName && shyElement.childNodes.length === 1) {
          shyElement = shyElement.firstChild;
        }

        // At this point it's the actual unicode character.
        if (shyElement.nodeType === 3 && shyElement.nodeValue.charAt(0) === "\u00AD") {
          shyElement.nodeValue = shyElement.nodeValue.slice(1);
        }
      }

      return element;
    };

    /**
     * In some cases, Internet Explorer can create an anonymous node in
     * the hierarchy with no tagName. You can create this scenario via:
     *
     *     div = document.createElement("div");
     *     div.innerHTML = "<table>&shy<script></script><tr><td>hi</td></tr></table>";
     *     div.firstChild.firstChild.tagName //=> ""
     *
     * If our script markers are inside such a node, we need to find that
     * node and use *it* as the marker.
     **/
    var realNode = function(start) {
      while (start.parentNode.tagName === "") {
        start = start.parentNode;
      }

      return start;
    };

    /**
     * When automatically adding a tbody, Internet Explorer inserts the
     * tbody immediately before the first <tr>. Other browsers create it
     * before the first node, no matter what.
     *
     * This means the the following code:
     *
     *     div = document.createElement("div");
     *     div.innerHTML = "<table><script id='first'></script><tr><td>hi</td></tr><script id='last'></script></table>
     *
     * Generates the following DOM in IE:
     *
     *     + div
     *       + table
     *         - script id='first'
     *         + tbody
     *           + tr
     *             + td
     *               - "hi"
     *           - script id='last'
     *
     * Which means that the two script tags, even though they were
     * inserted at the same point in the hierarchy in the original
     * HTML, now have different parents.
     *
     * This code reparents the first script tag by making it the tbody's
     * first child.
     **/
    var fixParentage = function(start, end) {
      if (start.parentNode !== end.parentNode) {
        end.parentNode.insertBefore(start, end.parentNode.firstChild);
      }
    };

    htmlFunc = function(html, outerToo) {
      // get the real starting node. see realNode for details.
      var start = realNode(document.getElementById(this.start));
      var end = document.getElementById(this.end);
      var parentNode = end.parentNode;
      var node, nextSibling, last;

      // make sure that the start and end nodes share the same
      // parent. If not, fix it.
      fixParentage(start, end);

      // remove all of the nodes after the starting placeholder and
      // before the ending placeholder.
      node = start.nextSibling;
      while (node) {
        nextSibling = node.nextSibling;
        last = node === end;

        // if this is the last node, and we want to remove it as well,
        // set the `end` node to the next sibling. This is because
        // for the rest of the function, we insert the new nodes
        // before the end (note that insertBefore(node, null) is
        // the same as appendChild(node)).
        //
        // if we do not want to remove it, just break.
        if (last) {
          if (outerToo) { end = node.nextSibling; } else { break; }
        }

        node.parentNode.removeChild(node);

        // if this is the last node and we didn't break before
        // (because we wanted to remove the outer nodes), break
        // now.
        if (last) { break; }

        node = nextSibling;
      }

      // get the first node for the HTML string, even in cases like
      // tables and lists where a simple innerHTML on a div would
      // swallow some of the content.
      node = firstNodeFor(start.parentNode, html);

      // copy the nodes for the HTML between the starting and ending
      // placeholder.
      while (node) {
        nextSibling = node.nextSibling;
        parentNode.insertBefore(node, end);
        node = nextSibling;
      }
    };

    // remove the nodes in the DOM representing this metamorph.
    //
    // this includes the starting and ending placeholders.
    removeFunc = function() {
      var start = realNode(document.getElementById(this.start));
      var end = document.getElementById(this.end);

      this.html('');
      start.parentNode.removeChild(start);
      end.parentNode.removeChild(end);
    };

    appendToFunc = function(parentNode) {
      var node = firstNodeFor(parentNode, this.outerHTML());

      while (node) {
        nextSibling = node.nextSibling;
        parentNode.appendChild(node);
        node = nextSibling;
      }
    };

    afterFunc = function(html) {
      // get the real starting node. see realNode for details.
      var end = document.getElementById(this.end);
      var parentNode = end.parentNode;
      var nextSibling;
      var node;

      // get the first node for the HTML string, even in cases like
      // tables and lists where a simple innerHTML on a div would
      // swallow some of the content.
      node = firstNodeFor(parentNode, html);

      // copy the nodes for the HTML between the starting and ending
      // placeholder.
      while (node) {
        nextSibling = node.nextSibling;
        parentNode.insertBefore(node, end.nextSibling);
        node = nextSibling;
      }
    };

    prependFunc = function(html) {
      var start = document.getElementById(this.start);
      var parentNode = start.parentNode;
      var nextSibling;
      var node;

      node = firstNodeFor(parentNode, html);
      var insertBefore = start.nextSibling;

      while (node) {
        nextSibling = node.nextSibling;
        parentNode.insertBefore(node, insertBefore);
        node = nextSibling;
      }
    }
  }

  Metamorph.prototype.html = function(html) {
    this.checkRemoved();
    if (html === undefined) { return this.innerHTML; }

    htmlFunc.call(this, html);

    this.innerHTML = html;
  };

  Metamorph.prototype.replaceWith = function(html) {
    this.checkRemoved();
    htmlFunc.call(this, html, true);
  };

  Metamorph.prototype.remove = removeFunc;
  Metamorph.prototype.outerHTML = outerHTMLFunc;
  Metamorph.prototype.appendTo = appendToFunc;
  Metamorph.prototype.after = afterFunc;
  Metamorph.prototype.prepend = prependFunc;
  Metamorph.prototype.startTag = startTagFunc;
  Metamorph.prototype.endTag = endTagFunc;

  Metamorph.prototype.isRemoved = function() {
    var before = document.getElementById(this.start);
    var after = document.getElementById(this.end);

    return !before || !after;
  };

  Metamorph.prototype.checkRemoved = function() {
    if (this.isRemoved()) {
      throw new Error("Cannot perform operations on a Metamorph that is not in the DOM.");
    }
  };

  window.Metamorph = Metamorph;
})(this);


})({});

(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */

/**
  @class

  Prepares the Handlebars templating library for use inside Ember's view
  system.

  The Ember.Handlebars object is the standard Handlebars library, extended to use
  Ember's get() method instead of direct property access, which allows
  computed properties to be used inside templates.

  To use Ember.Handlebars, call Ember.Handlebars.compile().  This will return a
  function that you can call multiple times, with a context object as the first
  parameter:

      var template = Ember.Handlebars.compile("my {{cool}} template");
      var result = template({
        cool: "awesome"
      });

      console.log(result); // prints "my awesome template"

  Note that you won't usually need to use Ember.Handlebars yourself. Instead, use
  Ember.View, which takes care of integration into the view layer for you.
*/
/**
  @namespace

  Ember Handlebars is an extension to Handlebars that makes the built-in
  Handlebars helpers and {{mustaches}} binding-aware.
*/
Ember.Handlebars = Ember.create(Handlebars);

Ember.Handlebars.helpers = Ember.create(Handlebars.helpers);

/**
  Override the the opcode compiler and JavaScript compiler for Handlebars.
*/
Ember.Handlebars.Compiler = function() {};
Ember.Handlebars.Compiler.prototype = Ember.create(Handlebars.Compiler.prototype);
Ember.Handlebars.Compiler.prototype.compiler = Ember.Handlebars.Compiler;

Ember.Handlebars.JavaScriptCompiler = function() {};
Ember.Handlebars.JavaScriptCompiler.prototype = Ember.create(Handlebars.JavaScriptCompiler.prototype);
Ember.Handlebars.JavaScriptCompiler.prototype.compiler = Ember.Handlebars.JavaScriptCompiler;
Ember.Handlebars.JavaScriptCompiler.prototype.namespace = "Ember.Handlebars";


Ember.Handlebars.JavaScriptCompiler.prototype.initializeBuffer = function() {
  return "''";
};

/**
  Override the default buffer for Ember Handlebars. By default, Handlebars creates
  an empty String at the beginning of each invocation and appends to it. Ember's
  Handlebars overrides this to append to a single shared buffer.

  @private
*/
Ember.Handlebars.JavaScriptCompiler.prototype.appendToBuffer = function(string) {
  return "data.buffer.push("+string+");";
};

/**
  Rewrite simple mustaches from {{foo}} to {{bind "foo"}}. This means that all simple
  mustaches in Ember's Handlebars will also set up an observer to keep the DOM
  up to date when the underlying property changes.

  @private
*/
Ember.Handlebars.Compiler.prototype.mustache = function(mustache) {
  if (mustache.params.length || mustache.hash) {
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  } else {
    var id = new Handlebars.AST.IdNode(['bind']);

    // Update the mustache node to include a hash value indicating whether the original node
    // was escaped. This will allow us to properly escape values when the underlying value
    // changes and we need to re-render the value.
    if(mustache.escaped) {
      mustache.hash = mustache.hash || new Handlebars.AST.HashNode([]);
      mustache.hash.pairs.push(["escaped", new Handlebars.AST.StringNode("true")]);
    }
    mustache = new Handlebars.AST.MustacheNode([id].concat([mustache.id]), mustache.hash, !mustache.escaped);
    return Handlebars.Compiler.prototype.mustache.call(this, mustache);
  }
};

/**
  The entry point for Ember Handlebars. This replaces the default Handlebars.compile and turns on
  template-local data and String parameters.

  @param {String} string The template to compile
*/
Ember.Handlebars.compile = function(string) {
  var ast = Handlebars.parse(string);
  var options = { data: true, stringParams: true };
  var environment = new Ember.Handlebars.Compiler().compile(ast, options);
  var templateSpec = new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);

  return Handlebars.template(templateSpec);
};

/**
  Registers a helper in Handlebars that will be called if no property with the
  given name can be found on the current context object, and no helper with
  that name is registered.

  This throws an exception with a more helpful error message so the user can
  track down where the problem is happening.

  @name Handlebars.helpers.helperMissing
  @param {String} path
  @param {Hash} options
*/
Ember.Handlebars.registerHelper('helperMissing', function(path, options) {
  var error, view = "";

  error = "%@ Handlebars error: Could not find property '%@' on object %@.";
  if (options.data){
    view = options.data.view;
  }
  throw new Ember.Error(Ember.String.fmt(error, [view, path, this]));
});


})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var set = Ember.set, get = Ember.get;

// TODO: Be explicit in the class documentation that you
// *MUST* set the value of a checkbox through Ember.
// Updating the value of a checkbox directly via jQuery objects
// will not work.

Ember.Checkbox = Ember.View.extend({
  title: null,
  value: false,
  disabled: false,

  classNames: ['ember-checkbox'],

  defaultTemplate: Ember.Handlebars.compile('<label><input type="checkbox" {{bindAttr checked="value" disabled="disabled"}}>{{title}}</label>'),

  change: function() {
    Ember.run.once(this, this._updateElementValue);
    // returning false will cause IE to not change checkbox state
  },

  _updateElementValue: function() {
    var input = this.$('input:checkbox');
    set(this, 'value', input.prop('checked'));
  }
});


})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/** @class */

var get = Ember.get, set = Ember.set;

Ember.TextSupport = Ember.Mixin.create({

  value: "",

  attributeBindings: ['placeholder', 'disabled'],
  placeholder: null,
  disabled: false,

  insertNewline: Ember.K,
  cancel: Ember.K,

  focusOut: function(event) {
    this._elementValueDidChange();
    return false;
  },

  change: function(event) {
    this._elementValueDidChange();
    return false;
  },

  keyUp: function(event) {
    this.interpretKeyEvents(event);
    return false;
  },

  /**
    @private
  */
  interpretKeyEvents: function(event) {
    var map = Ember.TextSupport.KEY_EVENTS;
    var method = map[event.keyCode];

    this._elementValueDidChange();
    if (method) { return this[method](event); }
  },

  _elementValueDidChange: function() {
    set(this, 'value', this.$().val() || '');
  }

});

Ember.TextSupport.KEY_EVENTS = {
  13: 'insertNewline',
  27: 'cancel'
};

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/** @class */

var get = Ember.get, set = Ember.set;

Ember.TextField = Ember.View.extend(Ember.TextSupport,
  /** @scope Ember.TextField.prototype */ {

  classNames: ['ember-text-field'],

  tagName: "input",
  attributeBindings: ['type', 'value'],
  type: "text",

  /**
    @private
  */
  _updateElementValue: function() {
    this.$().val(get(this, 'value'));
  }

});

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
var get = Ember.get, set = Ember.set;

Ember.Button = Ember.View.extend(Ember.TargetActionSupport, {
  classNames: ['ember-button'],
  classNameBindings: ['isActive'],

  tagName: 'button',
  attributeBindings: ['type', 'disabled'],
  type: 'button',
  disabled: false,
  propagateEvents: false,

  mouseDown: function() {
    if (!get(this, 'disabled')) {
      set(this, 'isActive', true);
      this._mouseDown = true;
      this._mouseEntered = true;
    }
    return get(this, 'propagateEvents');
  },

  mouseLeave: function() {
    if (this._mouseDown) {
      set(this, 'isActive', false);
      this._mouseEntered = false;
    }
  },

  mouseEnter: function() {
    if (this._mouseDown) {
      set(this, 'isActive', true);
      this._mouseEntered = true;
    }
  },

  mouseUp: function(event) {
    if (get(this, 'isActive')) {

      // Actually invoke the button's target and action.
      // This method comes from the Ember.TargetActionSupport mixin.
      this.triggerAction();
      set(this, 'isActive', false);
    }

    this._mouseDown = false;
    this._mouseEntered = false;
    return get(this, 'propagateEvents');
  },

  // TODO: Handle proper touch behavior.  Including should make inactive when
  // finger moves more than 20x outside of the edge of the button (vs mouse
  // which goes inactive as soon as mouse goes out of edges.)

  touchStart: function(touch) {
    this.mouseDown(touch);
  },

  touchEnd: function(touch) {
    this.mouseUp(touch);
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/** @class */

var get = Ember.get, set = Ember.set;

Ember.TextArea = Ember.View.extend(Ember.TextSupport, {

  classNames: ['ember-text-area'],

  tagName: "textarea",

  /**
    @private
  */
  didInsertElement: function() {
    this._updateElementValue();
  },

  _updateElementValue: Ember.observer(function() {
    this.$().val(get(this, 'value'));
  }, 'value')

});

})({});


(function(exports) {
Ember.TabContainerView = Ember.View.extend();

})({});


(function(exports) {
var get = Ember.get, getPath = Ember.getPath;

Ember.TabPaneView = Ember.View.extend({
  tabsContainer: SC.computed(function() {
    return this.nearestInstanceOf(Ember.TabContainerView);
  }).property(),

  isVisible: SC.computed(function() {
    return get(this, 'viewName') === getPath(this, 'tabsContainer.currentView');
  }).property('tabsContainer.currentView')
});

})({});


(function(exports) {
var get = Ember.get, setPath = Ember.setPath;

Ember.TabView = Ember.View.extend({
  tabsContainer: SC.computed(function() {
    return this.nearestInstanceOf(Ember.TabContainerView);
  }).property(),

  mouseUp: function() {
    setPath(this, 'tabsContainer.currentView', get(this, 'value'));
  }
});

})({});


(function(exports) {
})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});


(function(exports) {
var set = Ember.set, get = Ember.get, getPath = Ember.getPath;

Ember.Metamorph = Ember.Mixin.create({
  isVirtual: true,
  tagName: '',

  init: function() {
    this._super();
    set(this, 'morph', Metamorph());
  },

  beforeRender: function(buffer) {
    var morph = get(this, 'morph');
    buffer.push(morph.startTag());
  },

  afterRender: function(buffer) {
    var morph = get(this, 'morph');
    buffer.push(morph.endTag());
  },

  createElement: function() {
    var buffer = this.renderToBuffer();
    set(this, 'outerHTML', buffer.string());
    this.clearBuffer();
  },

  domManagerClass: Ember.Object.extend({
    remove: function(view) {
      var morph = getPath(this, 'view.morph');
      if (morph.isRemoved()) { return; }
      getPath(this, 'view.morph').remove();
    },

    prepend: function(childView) {
      var view = get(this, 'view');

      childView._insertElementLater(function() {
        var morph = get(view, 'morph');
        morph.prepend(get(childView, 'outerHTML'));
        childView.set('outerHTML', null);
      });
    },

    after: function(nextView) {
      var view = get(this, 'view');

      nextView._insertElementLater(function() {
        var morph = get(view, 'morph');
        morph.after(get(nextView, 'outerHTML'));
        nextView.set('outerHTML', null);
      });
    },

    replace: function() {
      var view = get(this, 'view');
      var morph = getPath(this, 'view.morph');

      view.transitionTo('preRender');
      view.clearRenderedChildren();
      var buffer = view.renderToBuffer();

      Ember.run.schedule('render', this, function() {
        if (get(view, 'isDestroyed')) { return; }
        view._notifyWillInsertElement();
        morph.replaceWith(buffer.string());
        view.transitionTo('inDOM');
        view._notifyDidInsertElement();
      });
    }
  })
});


})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */

var get = Ember.get, set = Ember.set, getPath = Ember.getPath;
/**
  @ignore
  @private
  @class

  Ember._BindableSpanView is a private view created by the Handlebars `{{bind}}` 
  helpers that is used to keep track of bound properties.

  Every time a property is bound using a `{{mustache}}`, an anonymous subclass 
  of Ember._BindableSpanView is created with the appropriate sub-template and 
  context set up. When the associated property changes, just the template for 
  this view will re-render.
*/
Ember._BindableSpanView = Ember.View.extend(Ember.Metamorph,
/** @scope Ember._BindableSpanView.prototype */{

  /**
    The function used to determine if the `displayTemplate` or
    `inverseTemplate` should be rendered. This should be a function that takes
    a value and returns a Boolean.

    @type Function
    @default null
  */
  shouldDisplayFunc: null,

  /**
    Whether the template rendered by this view gets passed the context object
    of its parent template, or gets passed the value of retrieving `property`
    from the previous context.

    For example, this is true when using the `{{#if}}` helper, because the 
    template inside the helper should look up properties relative to the same 
    object as outside the block. This would be NO when used with `{{#with 
    foo}}` because the template should receive the object found by evaluating 
    `foo`.

    @type Boolean
    @default false
  */
  preserveContext: false,

  /**
    The template to render when `shouldDisplayFunc` evaluates to true.

    @type Function
    @default null
  */
  displayTemplate: null,

  /**
    The template to render when `shouldDisplayFunc` evaluates to false.

    @type Function
    @default null
  */
  inverseTemplate: null,

  /**
    The key to look up on `previousContext` that is passed to
    `shouldDisplayFunc` to determine which template to render.

    In addition, if `preserveContext` is false, this object will be passed to 
    the template when rendering.

    @type String
    @default null
  */
  property: null,

  /**
    Determines which template to invoke, sets up the correct state based on
    that logic, then invokes the default Ember.View `render` implementation.

    This method will first look up the `property` key on `previousContext`,
    then pass that value to the `shouldDisplayFunc` function. If that returns
    true, the `displayTemplate` function will be rendered to DOM. Otherwise,
    `inverseTemplate`, if specified, will be rendered.

    For example, if this Ember._BindableSpan represented the {{#with foo}} 
    helper, it would look up the `foo` property of its context, and 
    `shouldDisplayFunc` would always return true. The object found by looking 
    up `foo` would be passed to `displayTemplate`.

    @param {Ember.RenderBuffer} buffer
  */
  render: function(buffer) {
    // If not invoked via a triple-mustache ({{{foo}}}), escape
    // the content of the template.
    var escape = get(this, 'isEscaped');

    var shouldDisplay = get(this, 'shouldDisplayFunc'),
        property = get(this, 'property'),
        preserveContext = get(this, 'preserveContext'),
        context = get(this, 'previousContext');

    var inverseTemplate = get(this, 'inverseTemplate'),
        displayTemplate = get(this, 'displayTemplate');

    var result;


    // Use the current context as the result if no
    // property is provided.
    if (property === '') {
      result = context;
    } else {
      result = getPath(context, property);
    }

    // First, test the conditional to see if we should
    // render the template or not.
    if (shouldDisplay(result)) {
      set(this, 'template', displayTemplate);

      // If we are preserving the context (for example, if this
      // is an #if block, call the template with the same object.
      if (preserveContext) {
        set(this, 'templateContext', context);
      } else {
      // Otherwise, determine if this is a block bind or not.
      // If so, pass the specified object to the template
        if (displayTemplate) {
          set(this, 'templateContext', result);
        } else {
        // This is not a bind block, just push the result of the
        // expression to the render context and return.
          if (result == null) { result = ""; } else { result = String(result); }
          if (escape) { result = Handlebars.Utils.escapeExpression(result); }
          buffer.push(result);
          return;
        }
      }
    } else if (inverseTemplate) {
      set(this, 'template', inverseTemplate);

      if (preserveContext) {
        set(this, 'templateContext', context);
      } else {
        set(this, 'templateContext', result);
      }
    } else {
      set(this, 'template', function() { return ''; });
    }

    return this._super(buffer);
  }
});

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */
var get = Ember.get, getPath = Ember.getPath, set = Ember.set, fmt = Ember.String.fmt;

(function() {
  // Binds a property into the DOM. This will create a hook in DOM that the
  // KVO system will look for and upate if the property changes.
  var bind = function(property, options, preserveContext, shouldDisplay) {
    var data = options.data,
        fn = options.fn,
        inverse = options.inverse,
        view = data.view,
        ctx  = this;

    // Set up observers for observable objects
    if ('object' === typeof this) {
      // Create the view that will wrap the output of this template/property 
      // and add it to the nearest view's childViews array.
      // See the documentation of Ember._BindableSpanView for more.
      var bindView = view.createChildView(Ember._BindableSpanView, {
        preserveContext: preserveContext,
        shouldDisplayFunc: shouldDisplay,
        displayTemplate: fn,
        inverseTemplate: inverse,
        property: property,
        previousContext: ctx,
        isEscaped: options.hash.escaped
      });

      view.appendChild(bindView);

      var observer, invoker;

      observer = function(){
        // Double check since sometimes the view gets destroyed after this observer is already queued
        if (!get(bindView, 'isDestroyed')) { bindView.rerender(); }
      };

      invoker = function() {
        Ember.run.once(observer);
      };

      // Observes the given property on the context and
      // tells the Ember._BindableSpan to re-render. If property
      // is an empty string, we are printing the current context
      // object ({{this}}) so updating it is not our responsibility.
      if (property !== '') {
        Ember.addObserver(ctx, property, invoker);
      }
    } else {
      // The object is not observable, so just render it out and
      // be done with it.
      data.buffer.push(getPath(this, property));
    }
  };

  /**
    `bind` can be used to display a value, then update that value if it 
    changes. For example, if you wanted to print the `title` property of 
    `content`:

        {{bind "content.title"}}

    This will return the `title` property as a string, then create a new 
    observer at the specified path. If it changes, it will update the value in 
    DOM. Note that if you need to support IE7 and IE8 you must modify the 
    model objects properties using Ember.get() and Ember.set() for this to work as 
    it relies on Ember's KVO system.  For all other browsers this will be handled
    for you automatically.

    @private
    @name Handlebars.helpers.bind
    @param {String} property Property to bind
    @param {Function} fn Context to provide for rendering
    @returns {String} HTML string
  */
  Ember.Handlebars.registerHelper('bind', function(property, fn) {
    ember_assert("You cannot pass more than one argument to the bind helper", arguments.length <= 2);

    var context = (fn.contexts && fn.contexts[0]) || this;

    return bind.call(context, property, fn, false, function(result) {
      return !Ember.none(result);
    });
  });

  /**
    Use the `boundIf` helper to create a conditional that re-evaluates 
    whenever the bound value changes.

        {{#boundIf "content.shouldDisplayTitle"}}
          {{content.title}}
        {{/boundIf}}

    @private
    @name Handlebars.helpers.boundIf
    @param {String} property Property to bind
    @param {Function} fn Context to provide for rendering
    @returns {String} HTML string
  */
  Ember.Handlebars.registerHelper('boundIf', function(property, fn) {
    var context = (fn.contexts && fn.contexts[0]) || this;

    return bind.call(context, property, fn, true, function(result) {
      if (Ember.typeOf(result) === 'array') {
        return get(result, 'length') !== 0;
      } else {
        return !!result;
      }
    } );
  });
})();

/**
  @name Handlebars.helpers.with
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('with', function(context, options) {
  ember_assert("You must pass exactly one argument to the with helper", arguments.length == 2);
  ember_assert("You must pass a block to the with helper", options.fn && options.fn !== Handlebars.VM.noop);

  return Ember.Handlebars.helpers.bind.call(options.contexts[0], context, options);
});


/**
  @name Handlebars.helpers.if
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('if', function(context, options) {
  ember_assert("You must pass exactly one argument to the if helper", arguments.length == 2);
  ember_assert("You must pass a block to the if helper", options.fn && options.fn !== Handlebars.VM.noop);

  return Ember.Handlebars.helpers.boundIf.call(options.contexts[0], context, options);
});

/**
  @name Handlebars.helpers.unless
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('unless', function(context, options) {
  ember_assert("You must pass exactly one argument to the unless helper", arguments.length == 2);
  ember_assert("You must pass a block to the unless helper", options.fn && options.fn !== Handlebars.VM.noop);

  var fn = options.fn, inverse = options.inverse;

  options.fn = inverse;
  options.inverse = fn;

  return Ember.Handlebars.helpers.boundIf.call(options.contexts[0], context, options);
});

/**
  `bindAttr` allows you to create a binding between DOM element attributes and
  Ember objects. For example:

      <img {{bindAttr src="imageUrl" alt="imageTitle"}}>

  @name Handlebars.helpers.bindAttr
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('bindAttr', function(options) {

  var attrs = options.hash;

  ember_assert("You must specify at least one hash argument to bindAttr", !!Ember.keys(attrs).length);

  var view = options.data.view;
  var ret = [];
  var ctx = this;

  // Generate a unique id for this element. This will be added as a
  // data attribute to the element so it can be looked up when
  // the bound property changes.
  var dataId = ++jQuery.uuid;

  // Handle classes differently, as we can bind multiple classes
  var classBindings = attrs['class'];
  if (classBindings !== null && classBindings !== undefined) {
    var classResults = Ember.Handlebars.bindClasses(this, classBindings, view, dataId);
    ret.push('class="' + classResults.join(' ') + '"');
    delete attrs['class'];
  }

  var attrKeys = Ember.keys(attrs);

  // For each attribute passed, create an observer and emit the
  // current value of the property as an attribute.
  attrKeys.forEach(function(attr) {
    var property = attrs[attr];

    ember_assert(fmt("You must provide a String for a bound attribute, not %@", [property]), typeof property === 'string');

    var value = getPath(ctx, property);

    ember_assert(fmt("Attributes must be numbers, strings or booleans, not %@", [value]), value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');

    var observer, invoker;

    observer = function observer() {
      var result = getPath(ctx, property);

      ember_assert(fmt("Attributes must be numbers, strings or booleans, not %@", [result]), result == null || typeof result === 'number' || typeof result === 'string' || typeof result === 'boolean');

      var elem = view.$("[data-bindAttr-" + dataId + "='" + dataId + "']");

      // If we aren't able to find the element, it means the element
      // to which we were bound has been removed from the view.
      // In that case, we can assume the template has been re-rendered
      // and we need to clean up the observer.
      if (elem.length === 0) {
        Ember.removeObserver(ctx, property, invoker);
        return;
      }

      var currentValue = elem.attr(attr);

      // A false result will remove the attribute from the element. This is
      // to support attributes such as disabled, whose presence is meaningful.
      if (result === false && currentValue) {
        elem.removeAttr(attr);

      // Likewise, a true result will set the attribute's name as the value.
      } else if (result === true && currentValue !== attr) {
        elem.attr(attr, attr);

      } else if (currentValue !== result) {
        elem.attr(attr, result);
      }
    };

    invoker = function() {
      Ember.run.once(observer);
    };

    // Add an observer to the view for when the property changes.
    // When the observer fires, find the element using the
    // unique data id and update the attribute to the new value.
    Ember.addObserver(ctx, property, invoker);

    // Use the attribute's name as the value when it is YES
    if (value === true) {
      value = attr;
    }

    // Do not add the attribute when the value is false
    if (value !== false) {
      // Return the current value, in the form src="foo.jpg"
      ret.push(attr + '="' + value + '"');
    }
  }, this);

  // Add the unique identifier
  ret.push('data-bindAttr-' + dataId + '="' + dataId + '"');
  return new Ember.Handlebars.SafeString(ret.join(' '));
});

/**
  Helper that, given a space-separated string of property paths and a context,
  returns an array of class names. Calling this method also has the side 
  effect of setting up observers at those property paths, such that if they 
  change, the correct class name will be reapplied to the DOM element.

  For example, if you pass the string "fooBar", it will first look up the 
  "fooBar" value of the context. If that value is YES, it will add the 
  "foo-bar" class to the current element (i.e., the dasherized form of 
  "fooBar"). If the value is a string, it will add that string as the class. 
  Otherwise, it will not add any new class name.

  @param {Ember.Object} context 
    The context from which to lookup properties

  @param {String} classBindings 
    A string, space-separated, of class bindings to use

  @param {Ember.View} view
    The view in which observers should look for the element to update

  @param {Srting} bindAttrId
    Optional bindAttr id used to lookup elements

  @returns {Array} An array of class names to add
*/
Ember.Handlebars.bindClasses = function(context, classBindings, view, bindAttrId) {
  var ret = [], newClass, value, elem;

  // Helper method to retrieve the property from the context and
  // determine which class string to return, based on whether it is
  // a Boolean or not.
  var classStringForProperty = function(property) {
    var split = property.split(':'),
        property = split[0],
        className = split[1];

    var val = getPath(context, property);

    // If value is a Boolean and true, return the dasherized property
    // name.
    if (val === YES) {
      if (className) { return className; }

      // Normalize property path to be suitable for use
      // as a class name. For exaple, content.foo.barBaz
      // becomes bar-baz.
      var parts = property.split('.');
      return Ember.String.dasherize(parts[parts.length-1]);

    // If the value is not NO, undefined, or null, return the current
    // value of the property.
    } else if (val !== NO && val !== undefined && val !== null) {
      return val;

    // Nothing to display. Return null so that the old class is removed
    // but no new class is added.
    } else {
      return null;
    }
  };

  // For each property passed, loop through and setup
  // an observer.
  classBindings.split(' ').forEach(function(binding) {

    // Variable in which the old class value is saved. The observer function
    // closes over this variable, so it knows which string to remove when
    // the property changes.
    var oldClass;

    var observer, invoker;

    // Set up an observer on the context. If the property changes, toggle the
    // class name.
    observer = function() {
      // Get the current value of the property
      newClass = classStringForProperty(binding);
      elem = bindAttrId ? view.$("[data-bindAttr-" + bindAttrId + "='" + bindAttrId + "']") : view.$();

      // If we can't find the element anymore, a parent template has been
      // re-rendered and we've been nuked. Remove the observer.
      if (elem.length === 0) {
        Ember.removeObserver(context, binding, invoker);
      } else {
        // If we had previously added a class to the element, remove it.
        if (oldClass) {
          elem.removeClass(oldClass);
        }

        // If necessary, add a new class. Make sure we keep track of it so
        // it can be removed in the future.
        if (newClass) {
          elem.addClass(newClass);
          oldClass = newClass;
        } else {
          oldClass = null;
        }
      }
    };

    invoker = function() {
      Ember.run.once(observer);
    };

    property = binding.split(':')[0];
    Ember.addObserver(context, property, invoker);

    // We've already setup the observer; now we just need to figure out the 
    // correct behavior right now on the first pass through.
    value = classStringForProperty(binding);

    if (value) {
      ret.push(value);

      // Make sure we save the current value so that it can be removed if the 
      // observer fires.
      oldClass = value;
    }
  });

  return ret;
};


})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars ember_assert */

// TODO: Don't require the entire module
var get = Ember.get, set = Ember.set;
var PARENT_VIEW_PATH = /^parentView\./;

/** @private */
Ember.Handlebars.ViewHelper = Ember.Object.create({

  viewClassFromHTMLOptions: function(viewClass, options, thisContext) {
    var extensions = {},
        classes = options['class'],
        dup = false;

    if (options.id) {
      extensions.elementId = options.id;
      dup = true;
    }

    if (classes) {
      classes = classes.split(' ');
      extensions.classNames = classes;
      dup = true;
    }

    if (options.classBinding) {
      extensions.classNameBindings = options.classBinding.split(' ');
      dup = true;
    }

    if (dup) {
      options = jQuery.extend({}, options);
      delete options.id;
      delete options['class'];
      delete options.classBinding;
    }

    // Look for bindings passed to the helper and, if they are
    // local, make them relative to the current context instead of the
    // view.
    var path;

    for (var prop in options) {
      if (!options.hasOwnProperty(prop)) { continue; }

      // Test if the property ends in "Binding"
      if (Ember.IS_BINDING.test(prop)) {
        path = options[prop];
        if (!Ember.isGlobalPath(path)) {
          // Binding to parentViews was previously deprecated. In most cases it shouldn't be necessary, but since
          // there are a few valid use cases and most people have broken the parentView habit, we're no longer
          // providing a warning about it.
          if (!PARENT_VIEW_PATH.test(path)) {
            if (path === 'this') {
              options[prop] = 'bindingContext';
            } else {
              options[prop] = 'bindingContext.'+path;
            }
          }
        }
      }
    }

    // Make the current template context available to the view
    // for the bindings set up above.
    extensions.bindingContext = thisContext;

    return viewClass.extend(options, extensions);
  },

  helper: function(thisContext, path, options) {
    var inverse = options.inverse,
        data = options.data,
        view = data.view,
        fn = options.fn,
        hash = options.hash,
        newView;

    if ('string' === typeof path) {
      newView = Ember.getPath(thisContext, path);
      ember_assert("Unable to find view at path '" + path + "'", !!newView);
    } else {
      newView = path;
    }

    ember_assert(Ember.String.fmt('You must pass a view class to the #view helper, not %@ (%@)', [path, newView]), Ember.View.detect(newView));

    newView = this.viewClassFromHTMLOptions(newView, hash, thisContext);
    var currentView = data.view;
    var viewOptions = {};

    if (fn) {
      ember_assert("You cannot provide a template block if you also specified a templateName", !get(viewOptions, 'templateName') && !newView.PrototypeMixin.keys().indexOf('templateName') >= 0);
      viewOptions.template = fn;
    }

    currentView.appendChild(newView, viewOptions);
  }
});

/**
  @name Handlebars.helpers.view
  @param {String} path
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('view', function(path, options) {
  ember_assert("The view helper only takes a single argument", arguments.length <= 2);

  // If no path is provided, treat path param as options.
  if (path && path.data && path.data.isRenderData) {
    options = path;
    path = "Ember.View";
  }

  return Ember.Handlebars.ViewHelper.helper(this, path, options);
});


})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars ember_assert */

// TODO: Don't require all of this module
var get = Ember.get, fmt = Ember.String.fmt;

/**
  @name Handlebars.helpers.collection
  @param {String} path
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('collection', function(path, options) {
  // If no path is provided, treat path param as options.
  if (path && path.data && path.data.isRenderData) {
    options = path;
    path = undefined;
    ember_assert("You cannot pass more than one argument to the collection helper", arguments.length === 1);
  } else {
    ember_assert("You cannot pass more than one argument to the collection helper", arguments.length === 2);
  }

  var fn = options.fn;
  var data = options.data;
  var inverse = options.inverse;

  // If passed a path string, convert that into an object.
  // Otherwise, just default to the standard class.
  var collectionClass;
  collectionClass = path ? Ember.getPath(this, path) : Ember.CollectionView;
  ember_assert(fmt("%@ #collection: Could not find %@", data.view, path), !!collectionClass);

  var hash = options.hash, itemHash = {}, match;

  // Extract item view class if provided else default to the standard class
  var itemViewClass, itemViewPath = hash.itemViewClass;
  var collectionPrototype = get(collectionClass, 'proto');
  delete hash.itemViewClass;
  itemViewClass = itemViewPath ? Ember.getPath(collectionPrototype, itemViewPath) : collectionPrototype.itemViewClass;
  ember_assert(fmt("%@ #collection: Could not find %@", data.view, itemViewPath), !!itemViewClass);

  // Go through options passed to the {{collection}} helper and extract options
  // that configure item views instead of the collection itself.
  for (var prop in hash) {
    if (hash.hasOwnProperty(prop)) {
      match = prop.match(/^item(.)(.*)$/);

      if(match) {
        // Convert itemShouldFoo -> shouldFoo
        itemHash[match[1].toLowerCase() + match[2]] = hash[prop];
        // Delete from hash as this will end up getting passed to the
        // {{view}} helper method.
        delete hash[prop];
      }
    }
  }

  var tagName = hash.tagName || get(collectionClass, 'proto').tagName;

  if (fn) {
    itemHash.template = fn;
    delete options.fn;
  }

  if (inverse && inverse !== Handlebars.VM.noop) {
    hash.emptyView = Ember.View.extend({
      template: inverse,
      tagName: itemHash.tagName
    });
  }

  if (hash.preserveContext) {
    itemHash.templateContext = Ember.computed(function() {
      return get(this, 'content');
    }).property('content');
    delete hash.preserveContext;
  }

  hash.itemViewClass = Ember.Handlebars.ViewHelper.viewClassFromHTMLOptions(itemViewClass, itemHash);

  return Ember.Handlebars.helpers.view.call(this, collectionClass, options);
});




})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */
var getPath = Ember.getPath;

/**
  `unbound` allows you to output a property without binding. *Important:* The 
  output will not be updated if the property changes. Use with caution.

      <div>{{unbound somePropertyThatDoesntChange}}</div>

  @name Handlebars.helpers.unbound
  @param {String} property
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('unbound', function(property, fn) {
  var context = (fn.contexts && fn.contexts[0]) || this;
  return getPath(context, property);
});

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */
var getPath = Ember.getPath;

/**
  `log` allows you to output the value of a value in the current rendering
  context.

    {{log myVariable}}

  @name Handlebars.helpers.log
  @param {String} property
*/
Ember.Handlebars.registerHelper('log', function(property, fn) {
  var context = (fn.contexts && fn.contexts[0]) || this;
  Ember.Logger.log(getPath(context, property));
});

/**
  The `debugger` helper executes the `debugger` statement in the current
  context.

    {{debugger}}

  @name Handlebars.helpers.debugger
  @param {String} property
*/
Ember.Handlebars.registerHelper('debugger', function() {
  debugger;
});

})({});


(function(exports) {
Ember.Handlebars.EachView = Ember.CollectionView.extend(Ember.Metamorph, {
  itemViewClass: Ember.View.extend(Ember.Metamorph)
});

Ember.Handlebars.registerHelper('each', function(path, options) {
  options.hash.contentBinding = path;
  options.hash.preserveContext = true;
  return Ember.Handlebars.helpers.collection.call(this, 'Ember.Handlebars.EachView', options);
});

})({});


(function(exports) {
/**
  `template` allows you to render a template from inside another template.
  This allows you to re-use the same template in multiple places. For example:

      <script type="text/x-handlebars">
        {{#with loggedInUser}}
          Last Login: {{lastLogin}}
          User Info: {{template "user_info"}}
        {{/with}}
      </script>

      <script type="text/x-handlebars" data-template-name="user_info">
        Name: <em>{{name}}</em>
        Karma: <em>{{karma}}</em>
      </script>

  This helper looks for templates in the global Ember.TEMPLATES hash. If you
  add <script> tags to your page with the `data-template-name` attribute set,
  they will be compiled and placed in this hash automatically.

  You can also manually register templates by adding them to the hash:

      Ember.TEMPLATES["my_cool_template"] = Ember.Handlebars.compile('<b>{{user}}</b>');

  @name Handlebars.helpers.template
  @param {String} templateName the template to render
*/

Ember.Handlebars.registerHelper('template', function(name, options) {
  var template = Ember.TEMPLATES[name];

  ember_assert("Unable to find template with name '"+name+"'.", !!template);

  Ember.TEMPLATES[name](this, { data: options.data });
});

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals Handlebars */
// Find templates stored in the head tag as script tags and make them available
// to Ember.CoreView in the global Ember.TEMPLATES object. This will be run as as
// jQuery DOM-ready callback.
//
// Script tags with type="text/html" or "text/x-handlebars" will be compiled
// with Ember's Handlebars and are suitable for use as a view's template.
// Those with type="text/x-raw-handlebars" will be compiled with regular
// Handlebars and are suitable for use in views' computed properties.
Ember.Handlebars.bootstrap = function() {
  Ember.$('script[type="text/html"], script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]')
    .each(function() {
    // Get a reference to the script tag
    var script = Ember.$(this),
      compile = (script.attr('type') === 'text/x-raw-handlebars') ?
                  Ember.$.proxy(Handlebars.compile, Handlebars) :
                  Ember.$.proxy(Ember.Handlebars.compile, Ember.Handlebars),
      // Get the name of the script, used by Ember.View's templateName property.
      // First look for data-template-name attribute, then fall back to its
      // id if no name is found.
      templateName = script.attr('data-template-name') || script.attr('id'),
      template = compile(script.html()),
      view, viewPath;

    if (templateName) {
      // For templates which have a name, we save them and then remove them from the DOM
      Ember.TEMPLATES[templateName] = template;

      // Remove script tag from DOM
      script.remove();
    } else {
      if (script.parents('head').length !== 0) {
        // don't allow inline templates in the head
        throw new Ember.Error("Template found in \<head\> without a name specified. " +
                         "Please provide a data-template-name attribute.\n" +
                         script.html());
      }

      // For templates which will be evaluated inline in the HTML document, instantiates a new
      // view, and replaces the script tag holding the template with the new
      // view's DOM representation.
      //
      // Users can optionally specify a custom view subclass to use by setting the
      // data-view attribute of the script tag.
      viewPath = script.attr('data-view');
      view = viewPath ? Ember.getPath(viewPath) : Ember.View;

      view = view.create({
        template: template
      });

      view._insertElementLater(function() {
        script.replaceWith(this.$());

        // Avoid memory leak in IE
        script = null;
      });
    }
  });
};

Ember.$(document).ready(Ember.Handlebars.bootstrap);

})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});


(function(exports) {
// ==========================================================================
// Project:   Ember Handlebar Views
// Copyright: Â©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
})({});