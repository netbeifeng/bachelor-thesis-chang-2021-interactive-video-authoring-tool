import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
class HelmetHead extends Component {
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
}

export default HelmetHead;
