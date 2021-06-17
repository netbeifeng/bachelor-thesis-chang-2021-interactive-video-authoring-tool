start = Block

Block = _ BLOCKSTART _ BLOCKEND _ { return {}; } 
      / _ BLOCKSTART prop:(_ Property _ )* BLOCKEND _ { return prop.map((element) => element[1]); }

Property = prop:InlineProperty _ SEMICOLON? _ { return prop; } 
		 / prop:BlockProperty _ SEMICOLON? _ { return prop; }
         / com:COMMENT { return {key: 'comment' , value: com.join('').split(',').join('')}; }

InlineProperty = INLINEPREFIX _ key:InlineKey _ EqualSign _ value:Value _  {  return { key: key, value: value}; } 

BlockProperty =  BLOCKPREFIX _ key:BlockKey _ EqualSign _ block:Block _ { return { key: key, aug: block};}

// Key = ( BlockKey / InlineKey ) { return text(); }

BlockKey = "slide" / "custom" / "quiz" / "text" / "animation" / "image" / "video" / "transformation" / "cursor" / "graphics" { return text(); }
InlineKey = QuizKey / TextKey / AnimationKey / GraphicsKey / RootKey / CustomKey / "path" / "type" / "position" / "height" / "width" / "duration" / "startTime" / "name" / "id" / "last" / "inPage" / "zIndex" { return text(); }
RootKey = "title" / "course" / "audio" / "font" / "author" / "subtitle" / "semester" / "chapter" { return text(); }
GraphicsKey = "strokeColor" / "strokeWidth" { return text(); }
TextKey = "page" / "content" / "fontSize" / "fontColor" / "fontFamily" { return text(); }
QuizKey = "questionContent" / "correctAnswer" / "wrongAnswers" / "tip" { return text(); }
AnimationKey = "elementType" / "elementId" / "toScale" / "toPosition" / "emphasisTime" / "moveTo" { return text(); }
CustomKey = "script" / "style" { return text(); }

Value = value:(BasicDataType / Coordinate / Interval / Array) { return value; }

_ "whitespace" = [ \t\r\n]*	

Coordinate = "(" _ x:Number _ "," _ y:Number _ ")" { return {x: x, y: y};}
Interval = "(" _ s:Number _ "-" _ e:Number _ ")" { return {startTime:s, endTime:e} }

Array = "[" _ "]" { return []; } / "[" head:(_ BasicDataType _ "," _ (COMMENT)* _ )*  tail:(_ BasicDataType _ (COMMENT)* _ ) "]" { return head.concat([tail]) .map((element) => element[1]); }

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

COMMENT = COMSTART (NOT_COM / COMMENT)* COMSTOP

NOT_COM = (!COMSTOP !COMSTART.)

BLOCKPREFIX = "^"
INLINEPREFIX = "$"

COMSTART = '/*'
COMSTOP = '*/'

BLOCKSTART = "{"
BLOCKEND = "}"

SEMICOLON = ";"