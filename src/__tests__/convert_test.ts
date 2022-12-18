import { assertEquals } from "../../dev_deps.ts";
import {
  convertJson5ToJson,
} from "../convert.ts";



Deno.test("convertJson5ToJson()", () => {
  const actual = convertJson5ToJson(`
  {
    hoge: "fuga",  // hogehoge
    foo: "bar",
  }
  `)

  assertEquals(actual, '{"hoge":"fuga","foo":"bar"}');
});
