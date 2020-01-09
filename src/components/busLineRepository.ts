function getAllBuslines(): BusLine[] {
  return [
    new BusLine("恵32", "http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=116&SCT=1"),
    new BusLine("玉11", "http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=55&SCT=1")
  ]
}

export function getBusline(lineName: string): BusLine {
  let availableLines = getAllBuslines()

  let selectedLineIndex = availableLines.findIndex((line: BusLine, index: number, obj: BusLine[]): boolean => {
    if (lineName == line.name) {
      return true
    } else {
      return false
    }
  })

  return availableLines[selectedLineIndex]
}

export class BusLine {
  name: string
  uri: string
  constructor(name: string, uri: string) {
        this.name = name
        this.uri = uri
    }
}
