import minimist from "minimist";
import { memosController } from "./memosController.js";

async function main() {
  const option = minimist(process.argv.slice(2));
  const memosFactory = new memosController();
  await memosFactory.build();
  if (option.l) {
    memosFactory.index();
  } else if (option.r) {
    memosFactory.show();
  } else if (option.d) {
    memosFactory.destroy();
  } else {
    memosFactory.create();
  }
}

main();
