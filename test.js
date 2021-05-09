const md = require('markdown-it')()
               .use(require('markdown-it-highlightjs'), { inline: true })
               .use(require('@iktakahiro/markdown-it-katex'));
    let text = md.render('Hello **bold** _italic_ [link](https://google.com) Markdown!');
    let code = md.render("`console.log('Hello')`{.js}");
    let math1 = md.render("$f(t)=\\int_{-\\infty}^\\infty f(t) e^{-iwt}dt$");
    let math2 = md.render("$X_n=\\frac{1}{N} \\sum_{n=0}^{N-1}X[k]e^{i2Πkn/N}$");

console.log(text);
console.log(code);
console.log(math1);
console.log(math2);