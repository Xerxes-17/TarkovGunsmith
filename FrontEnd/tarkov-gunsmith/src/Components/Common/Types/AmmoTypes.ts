// export const ammoCaliberMap: Record<string, string> = {
//     "Caliber86x70": "8.6x70mm",
//     "Caliber127x55": "12.7x55mm",
//     "Caliber762x54R": "7.62x54R",
//     "Caliber762x51": "7.62x51mm",
//     "Caliber762x39": "7.62x39mm",
//     "Caliber545x39": "5.45x39mm",
//     "Caliber556x45NATO": "5.56x45mm NATO",
//     "Caliber762x35": "7.62x35mm",
//     "Caliber366TKM": "9x39mm",
//     "Caliber9x39": "9x39mm",
//     "Caliber46x30": "4.6x30mm",
//     "Caliber9x21": "9x21mm",
//     "Caliber57x28": "5.7x28mm",
//     "Caliber1143x23ACP": "11.43x23ACP",
//     "Caliber9x19PARA": "9x19mm PARA",
//     "Caliber9x18PM": "9x18mm PM",
//     "Caliber762x25TT": "7.62x25mm TT",
//     "Caliber9x33R": "9x33mm R",
//     "Caliber12g": "12 gauge",
//     "Caliber23x75": "23x75mm",
//   };


export const ammoCaliberMap: Record<string, string> = {
    "545x39": "5.45x39mm",
    "556x45NATO": "5.56x45mm",
    "762x39": "7.62x39mm",
    "9x39": "9x39mm",
    "762x35": ".300 Blackout",
    "127x55": "12.7x55mm",
    "762x51": "7.62x51mm",
    "762x54R": "7.62x54mmR",
    "366TKM": ".366TKM",
    "86x70": ".338 Lapua",
    "1143x23ACP": ".45 ACP",
    "46x30": "4.6x30mm",
    "57x28": "5.7x28mm",
    "9x21": "9x21mm",
    "9x19PARA": "9x19mm",
    "9x18PM": "9x18mm",
    "762x25TT": "7.62x25mm TT",
    "9x33R": ".357",
    "20g": "20/70",
    "12g": "12/70",
    "23x75": "23x75mm",
  };

export const ammoCaliberArray = Object.entries(ammoCaliberMap).map(([value, label]) => ({ value:value, label:label }));

export function mapAmmoCaliberToLabel(caliberKey: string): string {
    const result = ammoCaliberMap[caliberKey]
    if (result !== undefined)
        return result
    else
        return "Caliber-Label missing"
  }

  export type AmmoTableRow = {
    id: string
    name: string
    shortName: string,
    caliber: string
    damage: number
    penetrationPower: number
    armorDamagePerc: number
    baseArmorDamage: number
    lightBleedDelta: number
    heavyBleedDelta: number
    fragChance: number
    initialSpeed: number
    ammoRec: number
    tracer: boolean
    price: number
    traderLevel: number
}