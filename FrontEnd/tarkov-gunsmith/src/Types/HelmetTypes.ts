import { ArmorCollider, MaterialType } from "../Components/ADC/ArmorData";
import { ArmorModule, RicochetParams } from "./ArmorTypes";

export interface NewArmorTableRow {
  id: string;
  type: "Heavy" | "Light" | "None";
  name: string;
  imageLink: string;

  weight: number;
  ergonomics: number;
  speedPenalty: number;
  turnSpeed: number;

  isDefault: boolean;

  armorClass: number;
  bluntThroughput: number;
  durability: number;
  effectiveDurability: number;
  armorMaterial: MaterialType;
  ricochetParams: RicochetParams;
  armorColliders: ArmorCollider[];

  subRows: NewArmorTableRow[];
}

export interface PrimaryArmor {
  type: "Heavy" | "Light";
  armorClass: number;
  bluntThroughput: number;
  totalMaxDurability: number;
  totalMaxEffectiveDurability: number;
  armorMaterial: MaterialType;
  ricochetParams: RicochetParams;
  armorColliders: ArmorCollider[];
}

export interface Helmet {
  id: string;
  name: string;
  imageLink: string;

  weight: number;
  ergonomics: number;
  turnSpeed: number;

  primaryArmor: PrimaryArmor;
  secondaryArmor: ArmorModule[];
}

export interface PrimaryArmorTableRow {
  type: "Heavy" | "Light";
  armorClass: number;
  bluntThroughput: number;
  totalMaxDurability: number;
  totalMaxEffectiveDurability: number;
  armorMaterial: string;
  ricochetParams: RicochetParams;
  armorColliders: string[];
}

export interface SecondaryArmorTableRow {
  armorColliders: string[];
  armorModules: ArmorModule[];
}

export interface HelmetTableRow {
  id: string;
  name: string;
  imageLink: string;

  weight: number;
  ergonomics: number;
  turnSpeed: number;

  primaryArmor: PrimaryArmorTableRow;
  subRows: HelmetTableRow[];
}
