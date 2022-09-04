import { MathUtils } from "three";
import { screens } from "../constants";

export const genKey = (
  screensStateOn:boolean[],
  isOpen: boolean,
  key?: string,
  id?: number
): { key: string; id: number } => {
  if (isOpen && key) return { key, id: id! }

  const available = screensStateOn.reduce((acc, isOn, idx) => {
    if (!isOn) {
      acc.push(idx)
    }
    return acc
  }, [] as number[])
  const keys = Object.keys(screens)
  // // let newNum = id && id >= 11 ? 0 : id
  const num = available[MathUtils.randInt(0, available.length - 1)]
  const keyNew = keys[num]
  const isOpenNew = !screensStateOn[num]

  return genKey(  screensStateOn,isOpenNew, keyNew, num)
}