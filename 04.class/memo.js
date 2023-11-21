export class Memo {
  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  full() {
    return this.title + "\n" + this.content;
  }
}
