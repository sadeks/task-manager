import React, { Component } from 'react';
import { Jumbotron, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import request from 'superagent';

import moment from 'moment';
import Moment from 'react-moment';
import { constants } from 'zlib';

import TaskCreateForm from './TaskCreateForm';

// import './App.css';
const dFormat = 'YYYY-MM-DD';

class TasksMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            showCreateModal: false
        }

        this.handleComplete = this.handleComplete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.loadTasks = this.loadTasks.bind(this);
    }

    handleComplete(e, task) {
        e.preventDefault();
        console.log(`updating task ${task.id}`);
        request
            .put(`http://localhost:3001/tasks/${task.id}`)
            .send({ done: !task.done })
            .end((err, res) => {
                if (err) {
                    //display error message using state
                }
                console.log(err);
                console.log(res);

                //refresh tasks on success
                this.loadTasks();
            });
    }

    handleDelete(e) {
        e.preventDefault();
    }

    loadTasks() {
        console.log('loadTasks fired.');
        request.get("http://localhost:3001/tasks")
            .end((err, res) => {
                console.log(res);
                let tasks = res.body;
                this.setState({
                    isLoaded: true,
                    tasks: tasks
                });
            });
    }

    componentDidMount() {
        this.loadTasks();
    }

    isPastDue(dueDate) {

        let taskDueDate = moment(dueDate).format(dFormat);
        let today = moment().format(dFormat);

        if (moment(today).isAfter(taskDueDate, 'day')) {
            return true;
        }
        return false;
    }

    isDueTodayOrTomorrow(dueDate) {
        // console.log(dueDate);

        const today = moment().format(dFormat);
        const tomorrow = moment().add(1, 'days').format(dFormat);
        const taskDueDate = moment(dueDate).format(dFormat);

        if (taskDueDate == tomorrow || taskDueDate == today) {
            return true;
        }

        return false;
    }

    toggleModal() {
        this.setState({ showCreateModal: !this.state.showCreateModal });
    }


    render() {

        const { tasks, showCreateModal } = this.state;

        return (
            <div>
                <Jumbotron className="text-center">
                    <h1>Task Managr</h1>
                    <p>This is a simple task manager. Create and update tasks below.</p>
                </Jumbotron>
                TODOS: add filters
                <div className="container">
                    <Button className="pull-right" bsStyle="success" bsSize="large" onClick={this.toggleModal}>Create Task</Button>
                </div>
                <ListGroup className="container">
                {tasks.length==0? "So empty here. Create a task to start.": ""}
                    {tasks.map( task => {
                        return (
                            <NavLink key={task.id} to={`/task/${task.id}`}>
                                <ListGroupItem header={task.title} className={this.isPastDue(task.due) ? "late-task" : this.isDueTodayOrTomorrow(task.due) ? 'warning-task' : ''}>
                                    {this.isDueTodayOrTomorrow(task.due)}
                                    Due <Moment format="YYYY/MM/DD" date={task.due}></Moment>
                                    <span className="pull-right">
                                        <Button className="actions" bsStyle="primary" bsSize="large" onClick={(e) => this.handleComplete(e, task)}>
                                            {task.done ? "Undo Complete" : "Mark as Completed"}</Button>
                                        <Button className="actions" bsStyle="danger" bsSize="large" onClick={this.handleDelete}>Remove</Button>
                                        {task.done ? <i className="glyphicon glyphicon-ok" style={{ color: 'green' }}></i> : ""}
                                    </span>
                                </ListGroupItem>
                            </NavLink>)
                    })
                    }
                </ListGroup>

                {/* create task component */}
                <TaskCreateForm show={this.state.showCreateModal} onHide={this.toggleModal} toggleModal={this.toggleModal} loadTasks={this.loadTasks} />
            </div>
        );
    }
}

export default TasksMain;
