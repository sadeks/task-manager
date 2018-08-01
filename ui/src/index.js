import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import TasksMain from './components/TasksMain';
import TasksDetails  from './components/TaskDetails';


ReactDOM.render(
  <Router>
      <div>
        <Route exact path="/" component={TasksMain} />
        <Route path="/task/:id" component={TasksDetails} />
      </div>
  </Router>,

  document.getElementById('root')
)

registerServiceWorker();
