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

// const memo1 = new Memo(1, "meme", "メモだよ")
// console.log(memo1.title)
