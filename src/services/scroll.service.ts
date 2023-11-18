import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollSubject = new Subject<number>();
  div!:HTMLElement

  sendScrollEvent(scrollTop: number): void {
    this.scrollSubject.next(scrollTop);
  }

  getScrollEvent(): Subject<number> {
    return this.scrollSubject;
  }
}
