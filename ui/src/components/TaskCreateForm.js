import React, { Component } from 'react';
import { Button , Modal, ControlLabel, FormControl} from 'react-bootstrap';
import uuidv1 from 'uuid/v1';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import request from 'superagent';

class TaskCreateForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      dueDate: moment()
    }

    console.log(props);

    this.toggleModal = props.toggleModal;
    this.loadTasks = props.loadTasks;
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleDueDateChange = this.handleDueDateChange.bind(this);

    this.handleCreateTaskClick = this.handleCreateTaskClick.bind(this);
  }

  componentWillMount() {

  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleDescriptionChange(e) {
    this.setState({ description: e.target.value });
  }
  handleDueDateChange(date){
    this.setState({ dueDate: date });
  }
  handleCreateTaskClick() {
    //   console.log('hii');
      let task = {
          id: uuidv1(),
          title: this.state.title,
          description:this.state.description,
          due: this.state.dueDate
      }

      request
      .post('http://localhost:3001/tasks')
      .send(task)
      .end((err, res) => {
          if (err) {
              //display error message using state
          }
          console.log(err);
          console.log(res);

          //refresh tasks on success
          this.loadTasks();
      });

      //close modal
      this.toggleModal();
  }


  render() {
    let { title, description, dueDate } = this.state;

    return (
        <Modal
          show={this.props.show}
          hide={this.props.hide}
          bsSize="large"
          aria-labelledby="contained-modal-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Create New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" value={title} placeholder="Enter text" onChange={this.handleTitleChange} />

          <ControlLabel>Description</ControlLabel>
          <FormControl type="textarea" value={description} placeholder="Enter text" onChange={this.handleDescriptionChange} />

          <ControlLabel>Due Date</ControlLabel>
          <DatePicker dateFormat="YYYY/MM/DD" selected={dueDate} onChange={this.handleDueDateChange} />

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
            <Button bsStyle="primary" onClick={this.handleCreateTaskClick}>Create</Button>
          </Modal.Footer>
        </Modal>
      );
    }
}
    

export default TaskCreateForm;
