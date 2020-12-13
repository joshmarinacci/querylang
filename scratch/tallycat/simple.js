import {Parser} from "tallycat-parser";

let result = Parser.parseString('4ft * 6');
console.log(result.toString())


try {
    let bad_result = Parser.parseString(('4ft * '))
} catch (e) {
    console.error(e)
}
