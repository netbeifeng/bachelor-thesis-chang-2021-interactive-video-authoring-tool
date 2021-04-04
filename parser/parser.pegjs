start = Augumentation

Augumentation = _ "{" _ "}" _ { return {}; } / _ "{" head:(_ Property _ )* "}" _ { 
	let augArray = head.map((element) => element[1]);
    return augArray;
}

Property = 
"$" _ key:(SubKey/QuestionKey) _ "=" _ value:Value _ End { return { key: key, value: value}; }
/  "^" _ key:Key _ "<"_ path:String _">" _ "=" _ subAug:Augumentation _ End { return { key: key, path: path, aug: subAug};}
/ "^" _ key:Key _ "=" _ subAug:Augumentation _ End { return { key: key, aug: subAug};}
/ "^" _ key:Key _ "<"_ path:String _">" _ End { return { key: key, path: path}; } 
/ "^" _ key:Key _ "=" _ value:Value _ End {  return { key: key, value: value}; } 
/ c:COMMENT {return {key: 'comment' , value: c.join('').split(',').join('')}; }

Key = (QuestionKey / SubKey / MainKey) {return text();}
NormakKey = "title" / "course" / "date" / "audio" / "author" / "slide" / "subtitle" / "semester" / "chapter" { return text(); }
MainKey = NormakKey / "custom" / "quiz" / "text" / "animation" / "image" / "video" / "animation" { return text(); }
SubKey = "position" / "height" / "width" / "duration" / "startTime" / "page" / "name" / "id" / "content" / "fontSize" / "fontColor" / "last" { return text(); }
TextKey = "page" { return text(); }
QuestionKey = "questionContent" / "correctAnswer" / "wrongAnswers" / "tip" { return text(); }

Value = value:(BasicDataType / Coordinate / Interval / Array) { return value;}

_ "whitespace" = [ \t\r\n]*	

Coordinate = "(" x:Number "," y:Number ")" { return {x: x, y: y};}
Interval = "(" s:Number "-" e:Number ")" { return {startTime:s, endTime:e} }

Array = "[" _ "]" { return []; } / "[" head:(_ BasicDataType _ ",")* tail:(_ BasicDataType _) "]" { return head.concat([tail]) .map((element) => element[1]); }

BasicDataType = data:(String / Number) { return data; }

String = "\"" string:([^"\\] / Escape)* "\""  { return string.join('');  } 

Number = "-"?("0"/([1-9][0-9]*))("."[0-9]+)?(("e"/"E")("+"/"-")?[0-9]+)? { return parseFloat(text()); }

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

COMSTART = '/*'

COMSTOP = '*/'

End = ";"* _
