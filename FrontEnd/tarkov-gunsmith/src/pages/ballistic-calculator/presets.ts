export interface BallisticFormState {
  dopeTableSelections: {
    caliberName: string;
    weaponId: string;
    barrelId: string;
    calculationAmmoId: string;
    calibration: string;
    defaultAmmo?: any;
    calculationAmmoObj?: any;
  };
  maxDistance: number;
  additionalVelocityModifier: number;
  finalVelocityModifier: number;
  lineOfSightOverBore: number;
}

export interface BallisticPreset {
  id: string;
  name: string;
  data: BallisticFormState;
  createdAt: string;
}

const STORAGE_KEY = "ballistic-presets";

export function getPresets(): BallisticPreset[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function savePreset(preset: BallisticPreset) {
  const presets = getPresets();
  if (presets.some(p => p.name === preset.name && p.id !== preset.id)) {
    throw new Error("Preset name already exists");
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...presets, preset]));
}

export function deletePreset(id: string) {
  const presets = getPresets();
  const filtered = presets.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function overwritePreset(updated: BallisticPreset) {
  const presets = getPresets().map(p => p.id === updated.id ? updated : p);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}