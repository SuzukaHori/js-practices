export class Memo {
  constructor(id, title, content) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  fullText() {
    return this.title + "\n" + this.content;
  }
}
