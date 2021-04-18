

const mk = require('markdown-it')().use(require('markdown-it-highlightjs'), { inline: true }).use(require('markdown-it-katex'));

let compoundString = '**ddd** asfsaf*sda* \n```js\nconsole.log("Hello World");\n```\n $\\displaystyle= \\frac{k(k+1)+2(k+1)}{2}$ \n `x=4`{.js} \n::: warning\n*here be dragons*\n:::';


// let res = marked(compoundString, {
//     highlight: function (code, lang) {
//         return hljs.highlightAuto(code).value;
//     }
// });
// md.use(mk);


let endProduct = mk.render(compoundString);

// let endProduct = mk.render(compoundString);

// Marked('**Test**: What? Is; this font ```java console.log("Hello World"); ```');
console.log(endProduct);