export function getAllBuslines(): BusLine[] {
  return [
    new BusLine("恵32", "http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=116&SCT=1")
  ]
}

export class BusLine {
  name: string
  uri: string
  constructor(name: string, uri: string) {
        this.name = name
        this.uri = uri
    }
}
