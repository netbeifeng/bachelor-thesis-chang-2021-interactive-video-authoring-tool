start = Block

Block = _ BLOCKSTART _ BLOCKEND _ { return {}; } 
      / _ BLOCKSTART head:(_ Property _ )* BLOCKEND _ { return head.map((element) => element[1]); }

Property = prop:InlineProperty _ SEMICOLON? _ { return prop; } 
		 / prop:BlockProperty _ SEMICOLON? _ { return prop; }
         / com:COMMENT {return {key: 'comment' , value: com.join('').split(',').join('')}; }

InlineProperty = INLINEPREFIX _ key:Key _ EqualSign _ value:Value _  {  return { key: key, value: value}; } 

BlockProperty =  BLOCKPREFIX _ key:Key _ EqualSign _ block:Block _ { return { key: key, aug: block};}

Key = ( BlockKey / InlineKey ) {return text();}


BlockKey =  "custom" / "quiz" / "text" / "animation" / "image" / "video" / "transformation" / "cursor" / "graphics" { return text(); }
InlineKey = QuestionKey / TextKey / AnimationKey / GraphicsKey / RootKey / "path" / "type" / "position" / "height" / "width" / "duration" / "startTime" / "name" / "id" / "last" / "inPage" { return text(); }
RootKey = "title" / "course" / "audio" / "font" / "author" / "slide" / "subtitle" / "semester" / "chapter" { return text(); }
GraphicsKey = "strokeColor" / "strokeWidth" { return text(); }
TextKey = "page" / "content" / "fontSize" / "fontColor" / "fontFamily" { return text(); }
QuestionKey = "questionContent" / "correctAnswer" / "wrongAnswers" / "tip" { return text(); }
AnimationKey = "elementType" / "elementId" / "toScale" / "toPosition" / "emphasisTime" / "moveTo" { return text(); }

Value = value:(BasicDataType / Coordinate / Interval / Array) { return value;}

_ "whitespace" = [ \t\r\n]*	

Coordinate = "(" _ x:Number _ "," _ y:Number _ ")" { return {x: x, y: y};}
Interval = "(" _ s:Number _ "-" _ e:Number _ ")" { return {startTime:s, endTime:e} }

Array = "[" _ "]" { return []; } / "[" head:(_ BasicDataType _ ",")* tail:(_ BasicDataType _) "]" { return head.concat([tail]) .map((element) => element[1]); }

BasicDataType = data:(String / Number) { return data; }

String = "\"" string:([^"\\] / Escape)* "\""  { return string.join('');  } 

Number = "-"?("0"/([1-9][0-9]*))("."[0-9]+)?(("e"/"E")("+"/"-")?[0-9]+)? { return parseFloat(text()); }

EqualSign = "="

Escape = "\\" character:["\\/bfnrt] {
	switch (character) { 
    	case '"': 
        case '\\': 
        case '/': 
        	return character; 
        case 'b': return '\b'; 
        case 'f': return '\f'; 
        case 'n': return '\n'; 
        case 'r': return '\r'; 
        case 't': return '\t'; 
    } 
} / "\\u" codePoint:([0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]) { 
	return String.fromCodePoint(parseInt(codePoint.join(''), 16)); 
}

COMMENT = COMSTART (NOT_COM/COMMENT)* COMSTOP

NOT_COM = (!COMSTOP !COMSTART.)

BLOCKPREFIX = "^"
INLINEPREFIX = "$"

COMSTART = '/*'
COMSTOP = '*/'

BLOCKSTART = "{"
BLOCKEND = "}"

LT = "<"
GT = ">"

SEMICOLON = ";"