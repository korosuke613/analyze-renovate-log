import { JSON5 } from "../deps.ts";

export const convertJson5ToJson = (json5: string) =>{
  const obj = JSON5.parse(json5)
  return JSON.stringify(obj)
}

