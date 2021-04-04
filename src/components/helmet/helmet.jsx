import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Converter from '../../utilities/converter/Converter';
class HelmetHead extends Component {
  constructor(props) {
    super(props);
    this.converter = new Converter(true);
    // this.Helmet = React.createRef("Helmet");
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
    // console.log(this.Helmet)
    document.querySelector('head').prepend(this.converter.getFontsHTML());
    // (this.converter.getFontsHTML());

  }
}

export default HelmetHead;
