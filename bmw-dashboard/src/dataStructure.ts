  // types.ts
  export interface Defect {
      id:number,
      date: string;
      time: string;
      defectName: string;
      stationLocation: string;
      partOfCar: string;
      reporterName: string;
      partNumber: string;
      severityRating: number;
      carModel: "Base" | "IX0M" | "Long" | "Alpina" | "Pick-Up";
      motorType: "Long Range" | "High Performance";
      designPackage: "Offroad" | "Race" | "Luxury";
      productionShift: "Morning" | "Afternoon" | "Night";
      resolutionTime: number;
      rootCauseIdentified: boolean;
      defectCategory: "Cosmetic" | "Functional" | "Critical";
      outlier:boolean,
      outlierName:string,
    }