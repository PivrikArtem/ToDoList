import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import ToDoList from './ToDoList/ToDoList';

ReactDOM.render(
    <div>
        <ToDoList/>
    </div>, document.getElementById('root'));

registerServiceWorker();




