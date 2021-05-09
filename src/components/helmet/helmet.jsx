import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ILVObject from '../../utilities/ILVObject';

import highlightCSS from '../../../node_modules/highlight.js/scss/default.scss';
import markdownCSS from '../../../node_modules/github-markdown-css/github-markdown.css';
import katexCSS from '../../../node_modules/katex/dist/katex.min.css';

class HelmetHead extends Component {
  constructor(props) {
    super(props);
    this.ILVObject = ILVObject;
  }

  render() {
    return (
      <Helmet>
        <title>Interactive Learning Video Demo</title>
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossOrigin="anonymous" />
        <meta charSet="utf-8" />
      </Helmet>
    );
  }

  componentDidMount() {
    document.querySelector('head').prepend(this.ILVObject.getFontsHTML());
  }
}

export default HelmetHead;
