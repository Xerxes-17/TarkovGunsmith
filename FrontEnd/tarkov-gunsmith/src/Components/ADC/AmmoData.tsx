export enum AmmoType {
  "Caliber86x70",
  "Caliber127x55",
  "Caliber762x54R",
  "Caliber762x51",

  "Caliber762x39",
  "Caliber545x39",
  "Caliber556x45NATO",
  "Caliber762x35",
  "Caliber366TKM",
  "Caliber9x39",

  "Caliber46x30",
  "Caliber9x21",
  "Caliber57x28",
  "Caliber1143x23ACP",

  "Caliber9x19PARA",
  "Caliber9x18PM",
  "Caliber762x25TT",
  "Caliber9x33R",

  "Caliber12g",
  "Caliber23x75"
}

export interface AmmoOption {
  caliber: string;
  damage: number;
  penetrationPower: number;
  armorDamagePerc: number;
  baseArmorDamage: number;
  traderLevel: number;
  value: string;
  readonly label: string;
  readonly imageLink: string;

}

export function filterAmmoOptions(ammoOptions: AmmoOption[], minDam: number, minPen: number, minADP: number, maxTrader: number, calibers: string[]): AmmoOption[] {
  console.log(ammoOptions)
  console.log(maxTrader)
  const result = ammoOptions.filter(item =>
    item.damage >= minDam &&
    item.penetrationPower >= minPen &&
    item.armorDamagePerc >= minADP &&
    item.traderLevel <= maxTrader &&
    calibers.includes(item.caliber)
  )
  console.log(result)
  return result;
}

// export function sortAmmoOptions() {
//   ammoOptions.sort((a, b) => {
//     if (a.label < b.label) {
//       return -1;
//     }
//     else if (a.label > b.label) {
//       return 1
//     }
//     else {
//       return 0;
//     }
//   })
// }


// sortAmmoOptions();