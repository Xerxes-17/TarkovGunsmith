export interface SimpleHitSummary {
  hitNum: number;
  specificChanceOfKill: number;
  cumulativeChanceOfKill: number;
}

export interface AecAmmoAndPlate {
  ammoId: string;
  ammoName: string;
  distance: number;
  plateId: string;
  plateName: string;
  plateArmorClass: number;
  insertId: string;
  insertName: string;
  insertArmorClass: number;
  hitSummaries: SimpleHitSummary[];
}

export interface SimulatedAmmoStats {
  ammoId: string;
  ammoName: string;
  caliber: string;
  distance: number;
  armorDamagePerc: number;
  penetrationPower: number;
  damage: number;
}

export interface ArmorClassData{
  minHTK: number,
  avgHTK: number,
  maxHTK: number
}

export interface DisplayRowAEC {
  ammoId: string;
  ammoName: string;
  caliber: string;
  armorDamagePerc: number;
  penetrationPower: number;
  damage: number;

  htkAc3: ArmorClassData;
  htkAc4: ArmorClassData;
  htkAc5: ArmorClassData;
  htkAc6: ArmorClassData;
}

export interface AecData {
  simulatedAmmoStats: SimulatedAmmoStats[];
  aecAmmoAndPlateList: AecAmmoAndPlate[];
}

function sumWithReduce(arr: number[]): number {
  return arr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

// Yeah this has bugs
// todo: fix the bugs here, use the browser dev mode 
export function ConvertAecRawToDisplay(rawData: AecData, confidence: number): DisplayRowAEC[] {
  // Many ammos, to a few Armor Classes (plate)
  //* Find all entries of a given ammo.
  //* search row outputs by plateArmorClass between 3 and 6
  //* with  objects that match, find the hit for a given HTK confidence
  //* add that hitNum to a result array
  //* average out that array to find avgHTK for confidence value
  //* present that number for the class's AC score
  // that array could also provide the min and max for that AC too.

  const platesAndAmmos = rawData.aecAmmoAndPlateList;
  const ammoStats = rawData.simulatedAmmoStats;

  //! to start with, just do MVP of the average HTK with >75% confidence
  const minConfidenceLevel = 10;
  const averageConfidenceLevel = confidence;
  const maxConfidenceLevel = 95;

  const uniqueAmmoIds = [...new Set(platesAndAmmos.map((item) => item.ammoId))];

  const mappedDisplayRows = uniqueAmmoIds.map((ammoId) => {

    const ammoInfo = ammoStats.find(entry => entry.ammoId === ammoId)

    const ammoName = ammoInfo?.ammoName ?? "NOT FOUND";
    const caliber = ammoInfo?.caliber ?? "NOT FOUND";
    const armorDamagePerc = ammoInfo?.armorDamagePerc ?? -1;
    const penetrationPower = ammoInfo?.penetrationPower ?? -1;
    const damage = ammoInfo?.damage ?? -1;
    

    //* Find all entries of a given ammo.
    const entriesThisAmmo = platesAndAmmos.filter((entry) => entry.ammoId === ammoId);

    const averageHTKsByAcIndex: number[] = [0, 0, 0]; // For the moment we're just doing plates
    const minHTKsByAcIndex: number[] = [0, 0, 0];
    const maxHTKsByAcIndex: number[] = [0, 0, 0];

    //* search row outputs by plateArmorClass between 3 and 6
    for (let index = 3; index < 7; index++) {

      
      const minHtkThisAc: number [] = []
      const midHtkThisAc: number [] = []
      const maxHtkThisAc: number [] = []

      const entriesThisACandAmmo = entriesThisAmmo.filter(
        (entry) => entry.plateArmorClass === index
      );

      if (entriesThisACandAmmo.length === 0) {
        console.warn(
          `No entriesThisACandAmmo found, this really shouldn't happen!`
        );
        continue;
      }

      //* with  objects that match, find the hit for a given HTK confidence
      //? Maybe I want to make it a map??
      entriesThisACandAmmo.forEach((entry) => {
        const firstConfidentHit = entry.hitSummaries.find(
          (hit) => hit.cumulativeChanceOfKill > averageConfidenceLevel
        );

        const firstMinConfidentHit = entry.hitSummaries.find(
          (hit) => hit.cumulativeChanceOfKill > minConfidenceLevel
        );

        const firstMaxConfidentHit = entry.hitSummaries.find(
          (hit) => hit.cumulativeChanceOfKill > maxConfidenceLevel
        );

        if (firstConfidentHit) {
          //* add that hitNum to a result array
          midHtkThisAc.push(firstConfidentHit.hitNum);
        } else {
          console.warn(
            `No hit found with required confidence of kill (${averageConfidenceLevel}), this really shouldn't happen!`
          );
        }

        if (firstMinConfidentHit) {
          minHtkThisAc.push(firstMinConfidentHit.hitNum);
        } else {
          console.warn(
            `No hit found with required confidence of kill (${averageConfidenceLevel}), this really shouldn't happen!`
          );
        }

        if (firstMaxConfidentHit) {
            maxHtkThisAc.push(firstMaxConfidentHit.hitNum);
        } else {
          console.warn(
            `No hit found with required confidence of kill (${averageConfidenceLevel}), this really shouldn't happen!`
          );
        }
      });
        //* average out that array to find avgHTK for confidence value
        const averageHtkForConfidence = sumWithReduce(midHtkThisAc)/midHtkThisAc.length;
        const minAvgHtkForConfidence = sumWithReduce(minHtkThisAc)/minHtkThisAc.length;
        const maxAvgHtkForConfidence = sumWithReduce(maxHtkThisAc)/maxHtkThisAc.length;

        //* present that number for the class's AC score
        averageHTKsByAcIndex.push(averageHtkForConfidence);
        minHTKsByAcIndex.push(minAvgHtkForConfidence);
        maxHTKsByAcIndex.push(maxAvgHtkForConfidence);
    }

    const result: DisplayRowAEC = {
      ammoId,
      ammoName,
      caliber,
      armorDamagePerc,
      penetrationPower,
      damage,

      htkAc3: {
        avgHTK: averageHTKsByAcIndex[3],
        minHTK: minHTKsByAcIndex[3],
        maxHTK: maxHTKsByAcIndex[3]
      },
      htkAc4: {
        avgHTK: averageHTKsByAcIndex[4],
        minHTK: minHTKsByAcIndex[4],
        maxHTK: maxHTKsByAcIndex[4]
      },
      htkAc5: {
        avgHTK: averageHTKsByAcIndex[5],
        minHTK: minHTKsByAcIndex[5],
        maxHTK: maxHTKsByAcIndex[5]
      },
      htkAc6: {
        avgHTK: averageHTKsByAcIndex[6],
        minHTK: minHTKsByAcIndex[6],
        maxHTK: maxHTKsByAcIndex[6]
      },
    };

    return result;
  });

  return mappedDisplayRows;
}
