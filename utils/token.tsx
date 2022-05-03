import { v4 as uuid } from "uuid";
import Hashids from "hashids";

export function token(): string {
  const hashId = new Hashids(uuid(), 8);
  return hashId.encode(1);
}
