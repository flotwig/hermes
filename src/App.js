import React, { Component } from 'react';
import './App.css';
import NewAccount from './view/NewAccount';
import BrowsingPane from './view/BrowsingPane';
import ReadingPane from './view/ReadingPane';
import { Container, Row, Col } from 'reactstrap'
import Api from './Api'

class App extends Component {
  render() {
    return (
      <Api>
        <Container fluid={true}>
          <NewAccount/>
          <Row noGutters={true}>
            <Col md="3" className="border-right">
              <BrowsingPane/>
            </Col>
            <Col md="9">
              <ReadingPane/>
            </Col>
          </Row>
        </Container>
      </Api>
    );
  }
}

export default App;
