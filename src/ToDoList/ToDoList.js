import React, { Component } from 'react';
import { createStore} from 'redux';
import './ToDoList.css';
import ToDoListFooter from './ToDoListFooter.js';
import ToDoListTaskCreator from './ToDoListTaskCreator.js';
import TasksList from './TasksList.js';
import { getTasks } from './Services.js';
import { removeTask } from './Services.js';
import { toDoListReducer } from './redux/toDoList-reducers.js';
import { putTasksAction } from './redux/toDolist-actions';
import { clearCompleted } from './redux/toDolist-actions';
import { showLoadingGif } from './redux/toDolist-actions';
import { changeFilter } from './redux/toDolist-actions';
import { createNewTask } from './redux/toDolist-actions';
import { deleteTask } from './redux/toDolist-actions';
import { updateTask } from './redux/toDolist-actions';


class ToDoList extends Component {
  constructor() {
    super();
    // immutable.js
    this.store = createStore(toDoListReducer);

    var state = this.store.getState();

    this.state = {
      ...state,
      classLoading: 'img-creat'
    };

    this.store.subscribe(() => {
      var state = this.store.getState();
      this.setState(state);
    })
    getTasks(123)
      .then(tasksFromServer => {

        var tasks = tasksFromServer.map(itemFromServer => {
          return {
            id: itemFromServer.id,
            title: itemFromServer.title,
            isDone: itemFromServer.done,
            isInProgress: false
          };
        });

        var action = putTasksAction(tasks);

        this.store.dispatch(action);
      })
  }



  clearCompleted() {
    const ArrayTasks = [...this.state.tasks];
    ArrayTasks.forEach(
      (t) => {
        if (t.isDone) {
          t.isInProgress = !t.isInProgress;

          removeTask(t.id, 123).then(() => {

            var action = clearCompleted();
            this.store.dispatch(action);
            t.isInProgress = !t.isInProgress;
          });
        };

      });

    this.store.dispatch(showLoadingGif(ArrayTasks));

  }

  changeFilter(filterValue) {

    this.store.dispatch(changeFilter(filterValue));
  }

  createNewTask(task) {
    this.store.dispatch(createNewTask(task));
  }

  deleteTask(taskId) {
    this.store.dispatch(deleteTask(taskId));

    this.setState({
      tasks: this.state.tasks.filter((t) => { return t.id !== taskId })

    });
  }
  updateTask(task) {
    this.store.dispatch(updateTask(task));
    const newTaskList = [...this.state.tasks]

    newTaskList.forEach((t) => {
      if (t.id === task.id) {
        t.isDone = task.isDone;
        return
      }
    });
    this.setState({
      tasks: newTaskList
    })
  }

  loadingGif() {
    var classLoading = this.state.classLoading;

    if (classLoading === 'img-creat') { classLoading = 'img-creat-blok' } else { classLoading = 'img-creat' }
    this.setState({
      classLoading: classLoading
    })
  }
  loadingPage(task) {


    this.setState({
      tasks: this.state.tasks.map(t => {
        if (t.id === task.id) {
          return {
            ...t
          }
        }
        else {
          return {
            ...t,
          }
        }
      })
    });
  }


  render() {
    var { tasks, filter, classLoading } = this.state
    var filteredTasks = [];
    if (filter === 'all') filteredTasks = tasks;
    if (filter === 'active') filteredTasks = tasks.filter(t => !t.isDone);
    if (filter === 'completed') filteredTasks = tasks.filter(t => t.isDone);
    return (
      <div className='toDoList'>
        < ToDoListTaskCreator classLoading={classLoading} loading={this.loadingGif.bind(this)} onCreat={this.createNewTask.bind(this)} />
        <TasksList tasks={filteredTasks} onDelete={this.deleteTask.bind(this)} onloading={this.loadingGif.bind(this)} onUpdate={this.updateTask.bind(this)} />
        <ToDoListFooter tasks={tasks} filter={filter} onChangeFilter={this.changeFilter.bind(this)}
          onClearCompleted={this.clearCompleted.bind(this)} />
      </div>
    );
  }
}

export default ToDoList;

