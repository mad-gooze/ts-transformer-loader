import { Bla } from "./src/foobar";

console.log('hello!');

const test = require('./src/test');
console.log(test);

const two = 2;
const four = 4;

class Foobar {
  private someVeryLongPropertyName: string;

  constructor(b: string, private someVeryLongPropertyNameFromConstructor: string) {
    this.someVeryLongPropertyName = b;
  }

  test(f: Foobar) {
    return f.someVeryLongPropertyName + f.someVeryLongPropertyNameFromConstructor;
  }
}

const ab = new Foobar('a', 'b');
const cd = new Foobar('c', 'd');

console.log(ab.test(cd));


const bla = new Bla();
console.log(bla.getKek());
