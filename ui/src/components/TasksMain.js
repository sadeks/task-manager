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
            showCreateModal: false,
            showPastDueOnly:false,
            showDueTodayOrTomOnly:false,
            showCompletedOnly: false
        }

        this.handleComplete = this.handleComplete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.toggleModal = this.toggleModal.bind(this);

        this.filterPastDue = this.filterPastDue.bind(this);
        this.filterDueTodayOrTomorrow = this.filterDueTodayOrTomorrow.bind(this);
        this.filterCompleted = this.filterCompleted.bind(this);
        this.showAllTasks = this.showAllTasks.bind(this);

        this.loadTasks = this.loadTasks.bind(this);

    }

    handleComplete(e, taskId, taskDone) {
        e.preventDefault();
        console.log(`updating task ${taskId}`);
        request
            .put(`http://localhost:3001/tasks/${taskId}`)
            .send({ done: !taskDone })
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

    handleDelete(e, taskId) {
        e.preventDefault();

        request
        .delete(`http://localhost:3001/tasks/${taskId}`)
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

    loadTasks() {
        console.log('loadTasks fired.');
        request.get("http://localhost:3001/tasks")
            .end((err, res) => {
                // console.log(res);

                this.setState({
                    isLoaded: true,
                    tasks: res.body
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

    filterDueTodayOrTomorrow(){
        //set filter
        this.setState({ showDueTodayOrTomOnly: true, showPastDueOnly: false , filterCompleted:false});
    };

    filterPastDue() {
        //reload tasks to ensure clean slate
        this.setState({ showDueTodayOrTomOnly: false, showPastDueOnly: true, showCompletedOnly:false });
    };

    filterCompleted(){
        //set filter
        this.setState({ showDueTodayOrTomOnly: false, showPastDueOnly: false, showCompletedOnly:true});
    }

    showAllTasks(){
        //set filter
        this.setState({ showDueTodayOrTomOnly: false, showPastDueOnly: false, showCompletedOnly:false});
    }

    toggleModal() {
        this.setState({ showCreateModal: !this.state.showCreateModal });
    }


    render() {

        let { tasks, showCreateModal, showDueTodayOrTomOnly, showPastDueOnly, showCompletedOnly } = this.state;

        tasks = showPastDueOnly ? tasks.filter(t=> this.isPastDue(t.due)) :
                showDueTodayOrTomOnly ? tasks.filter(t=> this.isDueTodayOrTomorrow(t.due)) :
                showCompletedOnly ? tasks.filter(t=>t.done == true) : 
                tasks;


        return (
            <div>
                <Jumbotron className="text-center">
                    <h1>Task Managr</h1>
                    <p>This is a simple task manager. Create and manage tasks below.</p>
                </Jumbotron>

                <div className="container">
                    <Button style={{marginRight: '.5em', marginLeft: '-1em'}} bsStyle="default" bsSize="large" onClick={this.showAllTasks}>All</Button>
                    <Button style={{marginRight: '.5em'}} bsStyle="info" bsSize="large" onClick={this.filterCompleted}>Completed</Button>
                    <Button style={{marginRight: '.5em'}} bsStyle="danger" bsSize="large" onClick={this.filterPastDue}>Past Due</Button>
                    <Button bsStyle="warning" bsSize="large" onClick={this.filterDueTodayOrTomorrow}>Due today or tomorrow</Button>

                    <Button className="pull-right" bsStyle="success" bsSize="large" onClick={this.toggleModal}>Create Task</Button>
                </div>
                <ListGroup className="container">
                {tasks.length==0? "Nothing to show here..": ""}

                    {tasks.map( task => {
                        return (
                            <NavLink key={task._id} to={`/task/${task._id}`}>
                                <ListGroupItem header={task.title} className={this.isPastDue(task.due) ? "late-task" : this.isDueTodayOrTomorrow(task.due) ? 'warning-task' : ''}>
                                    {this.isDueTodayOrTomorrow(task.due)}
                                    Due <Moment format="YYYY/MM/DD" date={task.due}></Moment>
                                    <span className="pull-right">
                                        <Button className="actions" bsStyle="primary" bsSize="large" onClick={(e) => this.handleComplete(e, task._id, task.done)}>
                                            {task.done ? "Undo Complete" : "Mark as Completed"}</Button>
                                        <Button className="actions" bsStyle="danger" bsSize="large" onClick={ (e) => this.handleDelete(e,task._id)}>Remove</Button>
                                        {task.done ? <i className="glyphicon glyphicon-ok" style={{ color: 'green' }}></i> : ""}
                                    </span>
                                </ListGroupItem>
                            </NavLink>)
                    })
                    }
                </ListGroup>

                {/* create task component */}
                <TaskCreateForm show={showCreateModal} onHide={this.toggleModal} toggleModal={this.toggleModal} loadTasks={this.loadTasks} />
            </div>
        );
    }
}

export default TasksMain;
