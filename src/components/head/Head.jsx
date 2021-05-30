import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import highlightCSS from '../../../node_modules/highlight.js/scss/default.scss';
import markdownCSS from '../../../node_modules/github-markdown-css/github-markdown.css';
import katexCSS from '../../../node_modules/katex/dist/katex.min.css';

class Head extends Component {
  constructor(props) {
    super(props);
    this.fonts = this.props.ILVObject.getFonts().map((font) => {
      if (font.isOnline) {
        return <style key={font.fid}>{`@import url('${font.path}');`}</style>
      } else { 
        return <style key={font.fid}>
                  {`@font-face{
                    font-family: '${font.path.replace('.','')}'; 
                    src: url('./assets/fonts/${font.path}');
                  }`}
               </style>; 
      }
    });
  }

  render() {
    return (
      <Helmet>
        <title>Interactive Learning Video Demo</title>
        {this.fonts}
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous" />
        <meta charSet="utf-8" />
      </Helmet>
    );
  }
}

export default Head;
