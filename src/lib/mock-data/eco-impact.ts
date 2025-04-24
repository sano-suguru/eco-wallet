export interface EcoImpactData {
  forestArea: number;
  waterSaved: number;
  co2Reduction: number;
  progressPercent: number;
  targetForestArea: number;
  targetWaterSaved: number;
  targetCo2Reduction: number;
  totalDonation: number;
  monthlyDonation: number;
}

export const ecoImpactData: EcoImpactData = {
  forestArea: 5.2,
  waterSaved: 450,
  co2Reduction: 25,
  progressPercent: 42,
  targetForestArea: 10,
  targetWaterSaved: 1500,
  targetCo2Reduction: 100,
  totalDonation: 12450,
  monthlyDonation: 850,
};
