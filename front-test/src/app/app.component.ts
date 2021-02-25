import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core'
import { Apollo, gql } from 'apollo-angular'
import { title } from 'process';

import { Todo } from './types/todos.type'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('taskInput') taskInput: ElementRef<HTMLInputElement>;

  currentDate: Date | undefined;
  todos: Todo[] | undefined = [];

  constructor(private apollo: Apollo) {  }

  ngOnInit() {
    this.currentDate = new Date();

    this.apollo
      .watchQuery({
        query: gql`
          {
            getTodos {
              id title done createdAt updatedAt
            }
          }
        `,
      })
      .valueChanges.subscribe((result:any) => {
        const todoFromServer = result.data.getTodos
        console.log(todoFromServer);
        todoFromServer.forEach((item) => {
          this.todos.push({
            id: item.id,
            title: item.title,
            done: item.done,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          })
        })
      });
  }

  addTask(title: string): void {
    if (!title) {
      this.taskInput.nativeElement.style.border = '2px solid red';
      return;
    } else {
      this.taskInput.nativeElement.style.border = 'none';
    }
    const query = gql`
      mutation {
        createTodo(todo: {title: "${this.capitalize(title)}"}) {
          id title done createdAt updatedAt
        }
      }
    `;

    this.apollo.mutate({
      mutation: query
    }).subscribe((result: {
      data: {
        createTodo: Todo
      }
    }) => {
      const task = result.data.createTodo;
      this.todos.push({
        id: task.id,
        title: task.title,
        done: task.done,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      })
    })
    this.taskInput.nativeElement.value = '';
  }

  completeTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    console.log(todo);
    todo.done = true;
    const query = gql`
      mutation {
        completeTodo(id: "${id}") {
          updatedAt
        }
      }
    `;

    this.apollo.mutate({
      mutation: query
    })
    .subscribe((res: any) => {
      const idx = this.todos.findIndex(t => t.id === id);
      this.todos[idx].updatedAt = res.data.completeTodo.updatedAt
    })
  }

  removeTask(id: number): void {
    const query = gql`
    mutation {
      deleteTodo(id: "${id}")
    }
  `;

    this.apollo.mutate({
      mutation: query
    }).subscribe();
    const taskIndex = this.todos.findIndex(task => task.id === id);
    this.todos.splice(taskIndex, 1);
  }

  capitalize(value: string) {
    return value.toString().charAt(0).toUpperCase() + value.slice(1);
  }
}
