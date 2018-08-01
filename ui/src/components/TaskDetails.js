import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';

import request from 'superagent';

import Moment from 'react-moment';

class TaskDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      task: null
    }

    // console.log('inside TaskDetails. props are ', props);
  }

  componentWillMount() {
    request.get(`http://localhost:3001/tasks/${this.props.match.params.id}`)
    .end((err, res) => {
        console.log(res);
        this.setState({
            isLoaded: true,
            task: res.body
        });
    });
  }


  render() {
    let { task } = this.state;

    if (!task) {
      return null;
    }

    return (
      <div>
        <Jumbotron className="text-center">
          <h1>Task {task.title} details</h1>
        </Jumbotron>
        TODOS: add filters
          <div className="task container">
            <h3>{task.title}</h3>
            <div className="task-status pull-right">{task.done? "Complete" : "Not Complete"}</div>
            <br />
            <hr />
            Due <Moment format="YYYY/MM/DD" due={task.due}></Moment>
            <br />
            <hr />
            <span className="task-description">
              {task.description}
            </span>

            <Button className="pull-right" onClick={ ()=> {this.props.history.push(`/`); }}>Go back</Button>

        </div>
      </div>
    );
  }
}

export default TaskDetails;