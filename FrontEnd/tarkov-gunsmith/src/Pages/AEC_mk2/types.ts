export interface SimpleHitSummary {
  hitNum: number;
  specificChanceOfKill: number;
  cumulativeChanceOfKill: number;
}

export interface CalculateRowAECOutput {
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

export interface DisplayRowAEC {
  ammoId: string;
  ammoName: string;

  avgHtkAc3: number;
  avgHtkAc4: number;
  avgHtkAc5: number;
  avgHtkAc6: number;
}

function sumWithReduce(arr: number[]): number {
  return arr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

export function ConvertAecRawToDisplay(rawData: CalculateRowAECOutput[]): DisplayRowAEC[] {
  // Many ammos, to a few Armor Classes (plate)
  //* Find all entries of a given ammo.
  //* search row outputs by plateArmorClass between 3 and 6
  //* with  objects that match, find the hit for a given HTK confidence
  //* add that hitNum to a result array
  //* average out that array to find avgHTK for confidence value
  //* present that number for the class's AC score
  // that array could also provide the min and max for that AC too.

  //! to start with, just do MVP of the average HTK with >75% confidence
  const averageConfidenceLevel = 0.75;

  const uniqueAmmoIds = [...new Set(rawData.map((item) => item.ammoId))];

  const mappedDisplayRows = uniqueAmmoIds.map((ammoId) => {
    const ammoName =
      rawData.find((entry) => entry.ammoId === ammoId)?.ammoName ?? "NOT FOUND";

    //* Find all entries of a given ammo.
    const entriesThisAmmo = rawData.filter((entry) => entry.ammoId === ammoId);

    const averageHTKsByAcIndex: number[] = [0, 0, 0]; // For the moment we're just doing plates

    //* search row outputs by plateArmorClass between 3 and 6
    for (let index = 3; index < 7; index++) {
      const entriesThisACandAmmo = entriesThisAmmo.filter(
        (entry) => entry.plateArmorClass === index
      );

      if (entriesThisACandAmmo.length === 0) {
        console.warn(
          `No entriesThisACandAmmo found, this really shouldn't happen!`
        );
        continue;
      }

      const HtkArray: number[] = [];

      //* with  objects that match, find the hit for a given HTK confidence
      //? Maybe I want to make it a map??
      entriesThisACandAmmo.forEach((entry) => {
        const firstConfidentHit = entry.hitSummaries.find(
          (hit) => hit.cumulativeChanceOfKill > averageConfidenceLevel
        );

        if (firstConfidentHit) {
          //* add that hitNum to a result array
          HtkArray.push(firstConfidentHit.hitNum);
        } else {
          console.warn(
            `No hit found with required confidence of kill (${averageConfidenceLevel}), this really shouldn't happen!`
          );
        }

        //* average out that array to find avgHTK for confidence value
        const averageHtkForConfidence = sumWithReduce(HtkArray)/HtkArray.length;

        //* present that number for the class's AC score
        averageHTKsByAcIndex.push(averageHtkForConfidence);
      });
    }

    const result: DisplayRowAEC = {
      ammoId,
      ammoName,

      avgHtkAc3: averageHTKsByAcIndex[3],
      avgHtkAc4: averageHTKsByAcIndex[4],
      avgHtkAc5: averageHTKsByAcIndex[5],
      avgHtkAc6: averageHTKsByAcIndex[6],
    };

    return result;
  });

  return mappedDisplayRows;
}
