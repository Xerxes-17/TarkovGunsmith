export const ammoCaliberFullNameMap: Record<string, string> = {
  "Caliber86x70": "8.6x70mm",
  "Caliber127x55": "12.7x55mm",
  "Caliber762x54R": "7.62x54R",
  "Caliber762x51": "7.62x51mm",
  "Caliber762x39": "7.62x39mm",
  "Caliber545x39": "5.45x39mm",
  "Caliber556x45NATO": "5.56x45mm NATO",
  "Caliber762x35": "7.62x35mm",
  "Caliber366TKM": ".366 TKM",
  "Caliber9x39": "9x39mm",
  "Caliber46x30": "4.6x30mm",
  "Caliber9x21": "9x21mm",
  "Caliber57x28": "5.7x28mm",
  "Caliber1143x23ACP": ".45 ACP",
  "Caliber9x19PARA": "9x19mm",
  "Caliber9x18PM": "9x18mm PM",
  "Caliber9x18PMM": "9x18mm PM",
  "Caliber762x25TT": "7.62x25mm TT",
  "Caliber9x33R": "9x33mm R",
  "Caliber20g": "20 gauge",
  "Caliber12g": "12 gauge",
  "Caliber23x75": "23x75mm",
  "Caliber68x51": "6.8x51mm",
  "Caliber40x46": "40x46mm Grenade",
  "Caliber40mmRU": "40mm RU Grenade",
  "Caliber26x75": "Flare"
};

export const unwantedAmmos: string[] = [
  "Caliber40mmRU",
  "Caliber26x75",
  "Caliber40x46"
]

export function mapAmmoCaliberFullNameToLabel(caliberKey: string): string {
  const result = ammoCaliberFullNameMap[caliberKey];
  if (result !== undefined) return result;
  else return "Caliber-Label missing";
}

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

export function mapAmmoCaliberToLabel(caliberKey: string): string {
  const result = ammoCaliberMap[caliberKey];
  if (result !== undefined) return result;
  else return "Caliber-Label missing";
}

export const ammoCaliberArray = Object.entries(ammoCaliberMap).map(
  ([value, label]) => ({ value: value, label: label })
);

export interface AmmoTableRow {
  id: string;
  name: string;
  shortName: string;
  caliber: string;
  projectileCount: number;
  damage: number;
  penetrationPower: number;
  penetrationPowerDeviation: number;
  armorDamagePerc: number;
  baseArmorDamage: number;
  lightBleedDelta: number;
  heavyBleedDelta: number;
  fragChance: number;
  initialSpeed: number;
  AmmoRec: number;
  tracer: boolean;
  price: number;
  traderLevel: number;
}

export interface DevTarkovAmmoItem {
  id: string;
  name: string;
  shortName: string;
  properties: {
    penetrationPower: number;
    penetrationPowerDeviation: number;
    damage: number;
    caliber: string;
    armorDamage: number;
    projectileCount: number;
    recoilModifier: number;
    heavyBleedModifier: number;
    lightBleedModifier: number;
    accuracyModifier: number;
    initialSpeed: number;
    fragmentationChance: number;
    tracer: boolean;
  } | null;
}

export interface ApiResponse {
  data: {
    items: DevTarkovAmmoItem[];
  };
}

export function filterNonBulletsOut(input: AmmoTableRow[]){
  const result = input.filter(x=>!unwantedAmmos.includes(x.caliber))
  return result
}