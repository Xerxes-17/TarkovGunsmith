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

export function filterAmmoOptions(minDam: number, minPen: number, minADP: number, maxTrader: number, calibers: string[]): AmmoOption[] {
  const result = ammoOptions.filter(item =>
    item.damage >= minDam &&
    item.penetrationPower >= minPen &&
    item.armorDamagePerc >= minADP &&
    item.traderLevel <= maxTrader &&
    calibers.includes(item.caliber)
  )
  return result;
}

export function sortAmmoOptions() {
  ammoOptions.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    else if (a.label > b.label) {
      return 1
    }
    else {
      return 0;
    }
  })
}

export const ammoOptions: AmmoOption[] = [
  {
    caliber: "Caliber1143x23ACP",
    damage: 72,
    penetrationPower: 25,
    armorDamagePerc: 36,
    baseArmorDamage: 0.0,
    traderLevel: 1,
    value: "5e81f423763d9f754677bf2e",
    label: ".45 ACP Match FMJ",
    imageLink: "https://assets.tarkov.dev/5e81f423763d9f754677bf2e-icon.jpg"
  },
  {
    caliber: "Caliber1143x23ACP",
    damage: 66,
    penetrationPower: 38,
    armorDamagePerc: 48,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "5efb0cabfb3e451d70735af5",
    label: ".45 ACP AP",
    imageLink: "https://assets.tarkov.dev/5efb0cabfb3e451d70735af5-icon.jpg"
  },
  {
    caliber: "Caliber127x55",
    damage: 115,
    penetrationPower: 28,
    armorDamagePerc: 60,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5cadf6ddae9215051e1c23b2",
    label: "12.7x55mm PS12",
    imageLink: "https://assets.tarkov.dev/5cadf6ddae9215051e1c23b2-icon.jpg"
  },
  {
    caliber: "Caliber127x55",
    damage: 102,
    penetrationPower: 46,
    armorDamagePerc: 57,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5cadf6eeae921500134b2799",
    label: "12.7x55mm PS12B",
    imageLink: "https://assets.tarkov.dev/5cadf6eeae921500134b2799-icon.jpg"
  },
  {
    caliber: "Caliber12g",
    damage: 25,
    penetrationPower: 31,
    armorDamagePerc: 26,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "5d6e6911a4b9361bd5780d52",
    label: "12/70 flechette",
    imageLink: "https://assets.tarkov.dev/5d6e6911a4b9361bd5780d52-icon.jpg"
  },
  {
    caliber: "Caliber12g",
    damage: 197,
    penetrationPower: 26,
    armorDamagePerc: 57,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "5d6e68c4a4b9361b93413f79",
    label: "12/70 makeshift .50 BMG slug",
    imageLink: "https://assets.tarkov.dev/5d6e68c4a4b9361b93413f79-icon.jpg"
  },
  {
    caliber: "Caliber12g",
    damage: 164,
    penetrationPower: 37,
    armorDamagePerc: 65,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5d6e68a8a4b9360b6c0d54e2",
    label: "12/70 AP-20 armor-piercing slug",
    imageLink: "https://assets.tarkov.dev/5d6e68a8a4b9360b6c0d54e2-icon.jpg"
  },
  {
    caliber: "Caliber23x75",
    damage: 192,
    penetrationPower: 39,
    armorDamagePerc: 75,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5e85aa1a988a8701445df1f5",
    label: "23x75mm \"Barrikada\" slug",
    imageLink: "https://assets.tarkov.dev/5e85aa1a988a8701445df1f5-icon.jpg"
  },
  {
    caliber: "Caliber366TKM",
    damage: 73,
    penetrationPower: 30,
    armorDamagePerc: 40,
    baseArmorDamage: 0.0,
    traderLevel: 1,
    value: "59e655cb86f77411dc52a77b",
    label: ".366 TKM EKO",
    imageLink: "https://assets.tarkov.dev/59e655cb86f77411dc52a77b-icon.jpg"
  },
  {
    caliber: "Caliber366TKM",
    damage: 98,
    penetrationPower: 23,
    armorDamagePerc: 48,
    baseArmorDamage: 0.0,
    traderLevel: 1,
    value: "59e6542b86f77411dc52a77a",
    label: ".366 TKM FMJ",
    imageLink: "https://assets.tarkov.dev/59e6542b86f77411dc52a77a-icon.jpg"
  },
  {
    caliber: "Caliber366TKM",
    damage: 90,
    penetrationPower: 42,
    armorDamagePerc: 60,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "5f0596629e22f464da6bbdd9",
    label: ".366 TKM AP-M",
    imageLink: "https://assets.tarkov.dev/5f0596629e22f464da6bbdd9-icon.jpg"
  },
  {
    caliber: "Caliber46x30",
    damage: 35,
    penetrationPower: 53,
    armorDamagePerc: 46,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5ba26835d4351e0035628ff5",
    label: "4.6x30mm AP SX",
    imageLink: "https://assets.tarkov.dev/5ba26835d4351e0035628ff5-icon.jpg"
  },
  {
    caliber: "Caliber46x30",
    damage: 43,
    penetrationPower: 40,
    armorDamagePerc: 41,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "5ba2678ad4351e44f824b344",
    label: "4.6x30mm FMJ SX",
    imageLink: "https://assets.tarkov.dev/5ba2678ad4351e44f824b344-icon.jpg"
  },
  {
    caliber: "Caliber46x30",
    damage: 45,
    penetrationPower: 36,
    armorDamagePerc: 46,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "5ba26844d4351e00334c9475",
    label: "4.6x30mm Subsonic SX",
    imageLink: "https://assets.tarkov.dev/5ba26844d4351e00334c9475-icon.jpg"
  },
  {
    caliber: "Caliber545x39",
    damage: 37,
    penetrationPower: 62,
    armorDamagePerc: 55,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5c0d5e4486f77478390952fe",
    label: "5.45x39mm PPBS gs \"Igolnik\"",
    imageLink: "https://assets.tarkov.dev/5c0d5e4486f77478390952fe-icon.jpg"
  },
  {
    caliber: "Caliber545x39",
    damage: 52,
    penetrationPower: 44,
    armorDamagePerc: 50,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "61962b617c6c7b169525f168",
    label: "5.45x39mm 7N40",
    imageLink: "https://assets.tarkov.dev/61962b617c6c7b169525f168-icon.jpg"
  },
  {
    caliber: "Caliber545x39",
    damage: 45,
    penetrationPower: 37,
    armorDamagePerc: 41,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "56dfef82d2720bbd668b4567",
    label: "5.45x39mm BP gs",
    imageLink: "https://assets.tarkov.dev/56dfef82d2720bbd668b4567-icon.jpg"
  },
  {
    caliber: "Caliber545x39",
    damage: 40,
    penetrationPower: 51,
    armorDamagePerc: 57,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "56dff026d2720bb8668b4567",
    label: "5.45x39mm BS gs",
    imageLink: "https://assets.tarkov.dev/56dff026d2720bb8668b4567-icon.jpg"
  },
  {
    caliber: "Caliber545x39",
    damage: 42,
    penetrationPower: 40,
    armorDamagePerc: 35,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "56dff061d2720bb5668b4567",
    label: "5.45x39mm BT gs",
    imageLink: "https://assets.tarkov.dev/56dff061d2720bb5668b4567-icon.jpg"
  },
  {
    caliber: "Caliber545x39",
    damage: 56,
    penetrationPower: 21,
    armorDamagePerc: 30,
    baseArmorDamage: 0.0,
    traderLevel: 1,
    value: "56dff0bed2720bb0668b4567",
    label: "5.45x39mm FMJ",
    imageLink: "https://assets.tarkov.dev/56dff0bed2720bb0668b4567-icon.jpg"
  },
  {
    caliber: "Caliber545x39",
    damage: 44,
    penetrationPower: 36,
    armorDamagePerc: 38,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "56dff2ced2720bb4668b4567",
    label: "5.45x39mm PP gs",
    imageLink: "https://assets.tarkov.dev/56dff2ced2720bb4668b4567-icon.jpg"
  },
  {
    caliber: "Caliber545x39",
    damage: 48,
    penetrationPower: 31,
    armorDamagePerc: 35,
    baseArmorDamage: 0.0,
    traderLevel: 1,
    value: "56dff3afd2720bba668b4567",
    label: "5.45x39mm PS gs",
    imageLink: "https://assets.tarkov.dev/56dff3afd2720bba668b4567-icon.jpg"
  },
  {
    caliber: "Caliber556x45NATO",
    damage: 54,
    penetrationPower: 23,
    armorDamagePerc: 33,
    baseArmorDamage: 0.0,
    traderLevel: 1,
    value: "59e6920f86f77411d82aa167",
    label: "5.56x45mm FMJ",
    imageLink: "https://assets.tarkov.dev/59e6920f86f77411d82aa167-icon.jpg"
  },
  {
    caliber: "Caliber556x45NATO",
    damage: 53,
    penetrationPower: 30,
    armorDamagePerc: 37,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "54527a984bdc2d4e668b4567",
    label: "5.56x45mm M855",
    imageLink: "https://assets.tarkov.dev/54527a984bdc2d4e668b4567-icon.jpg"
  },
  {
    caliber: "Caliber556x45NATO",
    damage: 49,
    penetrationPower: 44,
    armorDamagePerc: 52,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "54527ac44bdc2d36668b4567",
    label: "5.56x45mm M855A1",
    imageLink: "https://assets.tarkov.dev/54527ac44bdc2d36668b4567-icon.jpg"
  },
  {
    caliber: "Caliber556x45NATO",
    damage: 59,
    penetrationPower: 23,
    armorDamagePerc: 34,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "59e68f6f86f7746c9f75e846",
    label: "5.56x45mm M856",
    imageLink: "https://assets.tarkov.dev/59e68f6f86f7746c9f75e846-icon.jpg"
  },
  {
    caliber: "Caliber556x45NATO",
    damage: 54,
    penetrationPower: 37,
    armorDamagePerc: 52,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "59e6906286f7746c9f75e847",
    label: "5.56x45mm M856A1",
    imageLink: "https://assets.tarkov.dev/59e6906286f7746c9f75e847-icon.jpg"
  },
  {
    caliber: "Caliber556x45NATO",
    damage: 42,
    penetrationPower: 53,
    armorDamagePerc: 58,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "59e690b686f7746c9f75e848",
    label: "5.56x45mm M995",
    imageLink: "https://assets.tarkov.dev/59e690b686f7746c9f75e848-icon.jpg"
  },
  {
    caliber: "Caliber556x45NATO",
    damage: 38,
    penetrationPower: 57,
    armorDamagePerc: 64,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "601949593ae8f707c4608daa",
    label: "5.56x45mm SSA AP",
    imageLink: "https://assets.tarkov.dev/601949593ae8f707c4608daa-icon.jpg"
  },
  {
    caliber: "Caliber57x28",
    damage: 58,
    penetrationPower: 33,
    armorDamagePerc: 41,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "5cc80f53e4a949000e1ea4f8",
    label: "5.7x28mm L191",
    imageLink: "https://assets.tarkov.dev/5cc80f53e4a949000e1ea4f8-icon.jpg"
  },
  {
    caliber: "Caliber57x28",
    damage: 54,
    penetrationPower: 35,
    armorDamagePerc: 37,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5cc80f67e4a949035e43bbba",
    label: "5.7x28mm SB193",
    imageLink: "https://assets.tarkov.dev/5cc80f67e4a949035e43bbba-icon.jpg"
  },
  {
    caliber: "Caliber57x28",
    damage: 49,
    penetrationPower: 37,
    armorDamagePerc: 43,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5cc80f38e4a949001152b560",
    label: "5.7x28mm SS190",
    imageLink: "https://assets.tarkov.dev/5cc80f38e4a949001152b560-icon.jpg"
  },
  {
    caliber: "Caliber762x25TT",
    damage: 50,
    penetrationPower: 25,
    armorDamagePerc: 36,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "573603562459776430731618",
    label: "7.62x25mm TT Pst gzh",
    imageLink: "https://assets.tarkov.dev/573603562459776430731618-icon.jpg"
  },
  {
    caliber: "Caliber762x35",
    damage: 60,
    penetrationPower: 30,
    armorDamagePerc: 36,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "5fbe3ffdf8b6a877a729ea82",
    label: ".300 Blackout BCP FMJ",
    imageLink: "https://assets.tarkov.dev/5fbe3ffdf8b6a877a729ea82-icon.jpg"
  },
  {
    caliber: "Caliber762x35",
    damage: 51,
    penetrationPower: 48,
    armorDamagePerc: 65,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5fd20ff893a8961fc660a954",
    label: ".300 Blackout AP",
    imageLink: "https://assets.tarkov.dev/5fd20ff893a8961fc660a954-icon.jpg"
  },
  {
    caliber: "Caliber762x35",
    damage: 54,
    penetrationPower: 36,
    armorDamagePerc: 40,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "619636be6db0f2477964e710",
    label: ".300 Blackout M62 Tracer",
    imageLink: "https://assets.tarkov.dev/619636be6db0f2477964e710-icon.jpg"
  },
  {
    caliber: "Caliber762x39",
    damage: 58,
    penetrationPower: 47,
    armorDamagePerc: 63,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "59e0d99486f7744a32234762",
    label: "7.62x39mm BP gzh",
    imageLink: "https://assets.tarkov.dev/59e0d99486f7744a32234762-icon.jpg"
  },
  {
    caliber: "Caliber762x39",
    damage: 57,
    penetrationPower: 35,
    armorDamagePerc: 52,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "5656d7c34bdc2d9d198b4587",
    label: "7.62x39mm PS gzh",
    imageLink: "https://assets.tarkov.dev/5656d7c34bdc2d9d198b4587-icon.jpg"
  },
  {
    caliber: "Caliber762x39",
    damage: 64,
    penetrationPower: 30,
    armorDamagePerc: 46,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "59e4cf5286f7741778269d8a",
    label: "7.62x39mm T-45M1 gzh",
    imageLink: "https://assets.tarkov.dev/59e4cf5286f7741778269d8a-icon.jpg"
  },
  {
    caliber: "Caliber762x39",
    damage: 56,
    penetrationPower: 29,
    armorDamagePerc: 42,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "59e4d24686f7741776641ac7",
    label: "7.62x39mm US gzh",
    imageLink: "https://assets.tarkov.dev/59e4d24686f7741776641ac7-icon.jpg"
  },
  {
    caliber: "Caliber762x39",
    damage: 47,
    penetrationPower: 58,
    armorDamagePerc: 76,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "601aa3d2b2bcb34913271e6d",
    label: "7.62x39mm MAI AP",
    imageLink: "https://assets.tarkov.dev/601aa3d2b2bcb34913271e6d-icon.jpg"
  },
  {
    caliber: "Caliber762x51",
    damage: 70,
    penetrationPower: 64,
    armorDamagePerc: 83,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5a6086ea4f39f99cd479502f",
    label: "7.62x51mm M61",
    imageLink: "https://assets.tarkov.dev/5a6086ea4f39f99cd479502f-icon.jpg"
  },
  {
    caliber: "Caliber762x51",
    damage: 79,
    penetrationPower: 44,
    armorDamagePerc: 75,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5a608bf24f39f98ffc77720e",
    label: "7.62x51mm M62 Tracer",
    imageLink: "https://assets.tarkov.dev/5a608bf24f39f98ffc77720e-icon.jpg"
  },
  {
    caliber: "Caliber762x51",
    damage: 80,
    penetrationPower: 41,
    armorDamagePerc: 66,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "58dd3ad986f77403051cba8f",
    label: "7.62x51mm M80",
    imageLink: "https://assets.tarkov.dev/58dd3ad986f77403051cba8f-icon.jpg"
  },
  {
    caliber: "Caliber762x51",
    damage: 88,
    penetrationPower: 31,
    armorDamagePerc: 33,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "5e023e53d4353e3302577c4c",
    label: "7.62x51mm BCP FMJ",
    imageLink: "https://assets.tarkov.dev/5e023e53d4353e3302577c4c-icon.jpg"
  },
  {
    caliber: "Caliber762x51",
    damage: 67,
    penetrationPower: 70,
    armorDamagePerc: 85,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5efb0c1bd79ff02a1f5e68d9",
    label: "7.62x51mm M993",
    imageLink: "https://assets.tarkov.dev/5efb0c1bd79ff02a1f5e68d9-icon.jpg"
  },
  {
    caliber: "Caliber762x51",
    damage: 67,
    penetrationPower: 34,
    armorDamagePerc: 40,
    baseArmorDamage: 0.0,
    traderLevel: 1,
    value: "5e023e6e34d52a55c3304f71",
    label: "7.62x51mm TCW SP",
    imageLink: "https://assets.tarkov.dev/5e023e6e34d52a55c3304f71-icon.jpg"
  },
  {
    caliber: "Caliber762x54R",
    damage: 78,
    penetrationPower: 55,
    armorDamagePerc: 87,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5e023d34e8a400319a28ed44",
    label: "7.62x54mm R BT gzh",
    imageLink: "https://assets.tarkov.dev/5e023d34e8a400319a28ed44-icon.jpg"
  },
  {
    caliber: "Caliber762x54R",
    damage: 72,
    penetrationPower: 70,
    armorDamagePerc: 88,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5e023d48186a883be655e551",
    label: "7.62x54mm R BS gs",
    imageLink: "https://assets.tarkov.dev/5e023d48186a883be655e551-icon.jpg"
  },
  {
    caliber: "Caliber762x54R",
    damage: 82,
    penetrationPower: 41,
    armorDamagePerc: 83,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "5e023cf8186a883be655e54f",
    label: "7.62x54mm R T-46M gzh",
    imageLink: "https://assets.tarkov.dev/5e023cf8186a883be655e54f-icon.jpg"
  },
  {
    caliber: "Caliber762x54R",
    damage: 84,
    penetrationPower: 45,
    armorDamagePerc: 84,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "59e77a2386f7742ee578960a",
    label: "7.62x54mm R PS gzh",
    imageLink: "https://assets.tarkov.dev/59e77a2386f7742ee578960a-icon.jpg"
  },
  {
    caliber: "Caliber762x54R",
    damage: 81,
    penetrationPower: 42,
    armorDamagePerc: 78,
    baseArmorDamage: 0.0,
    traderLevel: 1,
    value: "5887431f2459777e1612938f",
    label: "7.62x54mm R LPS gzh",
    imageLink: "https://assets.tarkov.dev/5887431f2459777e1612938f-icon.jpg"
  },
  {
    caliber: "Caliber762x54R",
    damage: 75,
    penetrationPower: 62,
    armorDamagePerc: 87,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "560d61e84bdc2da74d8b4571",
    label: "7.62x54mm R SNB gzh",
    imageLink: "https://assets.tarkov.dev/560d61e84bdc2da74d8b4571-icon.jpg"
  },
  {
    caliber: "Caliber86x70",
    damage: 115,
    penetrationPower: 79,
    armorDamagePerc: 89,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5fc382a9d724d907e2077dab",
    label: ".338 Lapua Magnum AP",
    imageLink: "https://assets.tarkov.dev/5fc382a9d724d907e2077dab-icon.jpg"
  },
  {
    caliber: "Caliber86x70",
    damage: 122,
    penetrationPower: 47,
    armorDamagePerc: 83,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5fc275cf85fd526b824a571a",
    label: ".338 Lapua Magnum FMJ",
    imageLink: "https://assets.tarkov.dev/5fc275cf85fd526b824a571a-icon.jpg"
  },
  {
    caliber: "Caliber86x70",
    damage: 142,
    penetrationPower: 32,
    armorDamagePerc: 70,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5fc382c1016cce60e8341b20",
    label: ".338 Lapua Magnum UCW",
    imageLink: "https://assets.tarkov.dev/5fc382c1016cce60e8341b20-icon.jpg"
  },
  {
    caliber: "Caliber9x18PM",
    damage: 40,
    penetrationPower: 28,
    armorDamagePerc: 30,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "573719df2459775a626ccbc2",
    label: "9x18mm PM PBM gzh",
    imageLink: "https://assets.tarkov.dev/573719df2459775a626ccbc2-icon.jpg"
  },
  {
    caliber: "Caliber9x18PM",
    damage: 58,
    penetrationPower: 24,
    armorDamagePerc: 33,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "57371aab2459775a77142f22",
    label: "9x18mm PMM PstM gzh",
    imageLink: "https://assets.tarkov.dev/57371aab2459775a77142f22-icon.jpg"
  },
  {
    caliber: "Caliber9x19PARA",
    damage: 52,
    penetrationPower: 39,
    armorDamagePerc: 55,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5efb0da7a29a85116f6ea05f",
    label: "9x19mm PBP gzh",
    imageLink: "https://assets.tarkov.dev/5efb0da7a29a85116f6ea05f-icon.jpg"
  },
  {
    caliber: "Caliber9x19PARA",
    damage: 52,
    penetrationPower: 30,
    armorDamagePerc: 48,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "5c925fa22e221601da359b7b",
    label: "9x19mm AP 6.3",
    imageLink: "https://assets.tarkov.dev/5c925fa22e221601da359b7b-icon.jpg"
  },
  {
    caliber: "Caliber9x21",
    damage: 49,
    penetrationPower: 35,
    armorDamagePerc: 46,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5a269f97c4a282000b151807",
    label: "9x21mm PS gzh",
    imageLink: "https://assets.tarkov.dev/5a269f97c4a282000b151807-icon.jpg"
  },
  {
    caliber: "Caliber9x21",
    damage: 63,
    penetrationPower: 39,
    armorDamagePerc: 47,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5a26ac0ec4a28200741e1e18",
    label: "9x21mm BT gzh",
    imageLink: "https://assets.tarkov.dev/5a26ac0ec4a28200741e1e18-icon.jpg"
  },
  {
    caliber: "Caliber9x33R",
    damage: 70,
    penetrationPower: 35,
    armorDamagePerc: 43,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "62330b3ed4dc74626d570b95",
    label: ".357 Magnum FMJ",
    imageLink: "https://assets.tarkov.dev/62330b3ed4dc74626d570b95-icon.jpg"
  },
  {
    caliber: "Caliber9x33R",
    damage: 88,
    penetrationPower: 24,
    armorDamagePerc: 28,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "62330c18744e5e31df12f516",
    label: ".357 Magnum JHP",
    imageLink: "https://assets.tarkov.dev/62330c18744e5e31df12f516-icon.jpg"
  },
  {
    caliber: "Caliber9x39",
    damage: 60,
    penetrationPower: 55,
    armorDamagePerc: 68,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "5c0d688c86f77413ae3407b2",
    label: "9x39mm BP gs",
    imageLink: "https://assets.tarkov.dev/5c0d688c86f77413ae3407b2-icon.jpg"
  },
  {
    caliber: "Caliber9x39",
    damage: 62,
    penetrationPower: 48,
    armorDamagePerc: 72,
    baseArmorDamage: 0.0,
    traderLevel: 5,
    value: "61962d879bb3d20b0946d385",
    label: "9x39mm PAB-9 gs",
    imageLink: "https://assets.tarkov.dev/61962d879bb3d20b0946d385-icon.jpg"
  },
  {
    caliber: "Caliber9x39",
    damage: 71,
    penetrationPower: 28,
    armorDamagePerc: 60,
    baseArmorDamage: 0.0,
    traderLevel: 2,
    value: "57a0dfb82459774d3078b56c",
    label: "9x39mm SP-5 gs",
    imageLink: "https://assets.tarkov.dev/57a0dfb82459774d3078b56c-icon.jpg"
  },
  {
    caliber: "Caliber9x39",
    damage: 58,
    penetrationPower: 46,
    armorDamagePerc: 60,
    baseArmorDamage: 0.0,
    traderLevel: 3,
    value: "57a0e5022459774d1673f889",
    label: "9x39mm SP-6 gs",
    imageLink: "https://assets.tarkov.dev/57a0e5022459774d1673f889-icon.jpg"
  },
  {
    caliber: "Caliber9x39",
    damage: 68,
    penetrationPower: 40,
    armorDamagePerc: 55,
    baseArmorDamage: 0.0,
    traderLevel: 4,
    value: "5c0d668f86f7747ccb7f13b2",
    label: "9x39mm SPP gs",
    imageLink: "https://assets.tarkov.dev/5c0d668f86f7747ccb7f13b2-icon.jpg"
  }
]

sortAmmoOptions();