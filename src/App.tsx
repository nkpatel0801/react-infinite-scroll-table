import React, { Component } from 'react';
import { Spinner, Table, Modal, Button } from 'react-bootstrap';
import InfiniteScroll from "react-infinite-scroll-component";
import moment from 'moment';
import './App.css';

interface Props { }

interface State {
  error: any,
  isLoaded: boolean,
  questions: any,
  question: Question,
  show: boolean,
  hasMore: boolean
};

interface Question {
  title: string,
  link: string
}

class App extends Component<Props, State>  {

  state: State = {
    error: null,
    isLoaded: false,
    questions: [],
    question: {
      title: '',
      link: ''
    },
    show: false,
    hasMore: true,
  };

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = () => {
    fetch(`https://api.stackexchange.com/2.2/questions?pagesize=20&order=desc&sort=activity&site=stackoverflow&key=U4DMV*8nvpm3EOpvf69Rxw((`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            hasMore: result.has_more,
            questions: [...this.state.questions, ...result.items]
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleClose = () => {
    this.setState({
      show: false
    })
  }

  handleShow = (question: Question) => {
    this.setState({
      show: true,
      question
    })
  }

  render() {
    const { isLoaded, questions, hasMore, show, question: { title, link } } = this.state;
    return (
      <div className="App">
        {!isLoaded ?
          <div className="spinner-loader">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
          :
          <React.Fragment>
            <InfiniteScroll
              dataLength={questions.length}
              next={this.getQuestions}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Title</th>
                    <th>Creation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    questions.map((item: any, i: number) => (<tr className="cp" key={i} onClick={() => this.handleShow(item)}>
                      <td>{item.owner.display_name}</td>
                      <td>{item.title}</td>
                      <td>{moment.unix(item.creation_date).utc().format('DD/MM/YYYY HH:mm')}</td>
                    </tr>))
                  }
                </tbody>
              </Table>
            </InfiniteScroll>
          </React.Fragment>
        }
        <Modal
          centered
          show={show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {title}
            <p className="mt-2"><a href={link} rel="noopener noreferrer" target="_blank">Go to Question Page</a></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
          </Button>
          </Modal.Footer>
        </Modal>
      </div>);
  }
}

export default App;