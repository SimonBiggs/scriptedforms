import { Injectable } from '@angular/core';

@Injectable()
export class TitleService {
  title: string;

  constructor() { }

  get(): string {
    return this.title;
  }

  set(title: string) {
    this.title = title;
  }
}
