import { ArmorCollider, ArmorPlateCollider, MaterialType } from "../Components/ADC/ArmorData";
import { RicochetParams } from "./ArmorTypes";

export interface NewArmorTableRow {
  id: string;
  type: "Heavy" | "Light" | "None";
  name: string;
  imageLink: string;

  weight: number;
  ergonomics: number;
  speedPenalty: number;
  turnSpeed: number;

  isLocked: boolean;
  isDefault: boolean;
  // isIncluded: boolean; // To flag if a non-isLocked item is included in the main row summary stats.

  armorClass: number;
  bluntThroughput: number;
  durability: number;
  effectiveDurability: number;
  armorMaterial: MaterialType;
  ricochetParams: RicochetParams;
  armorColliders: ArmorCollider[];
  armorPlateColliders: ArmorPlateCollider[];

  compatibleInSlotIds: string[];

  subRows: NewArmorTableRow[];
}