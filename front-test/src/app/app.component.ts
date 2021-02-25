import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Apollo, gql } from 'apollo-angular'
import { Todo } from './types/todos.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('taskInput') taskInput: ElementRef<HTMLInputElement>;
  rates: any[];
  loading = true;
  error: any;
  currentDate: Date | undefined;
  todos: Todo[] | undefined = [];

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.currentDate = new Date();
    // console.log(this.todos.length);
    // this.apollo
    //   .watchQuery({
    //     query: gql`
    //       {
    //         rates(currency: "USD") {
    //           currency
    //           rate
    //         }
    //       }
    //     `,
    //   })
    //   .valueChanges.subscribe((result: any) => {
    //     console.log(result);
    //     this.rates = result.data.rates;
    //     this.loading = result.loading;
    //     this.error = result.error;
    //   });
  }

  addTask(value: string):void {
    this.todos.push({
      id: Math.random(),
      title: value,
      done: false,
      date: new Date()
    })
    this.taskInput.nativeElement.value = '';
  }

  removeTask(id: number):void {
    const task = this.todos.find(task=>task.id === id);
    const taskIndex = this.todos.indexOf(task);
    this.todos.splice(taskIndex, 1);
  }
}
