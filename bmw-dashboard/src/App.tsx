import { Theme } from "@radix-ui/themes";
import defectRawData from "./assets/Quality_Notional_Data_v2.json";
import { Defect } from "./dataStructure";
import StyledTable from "./StyledTable";

// Mapping between human-readable headers and Defect keys
const keyMapping: Record<string, keyof Defect> = {
  "id":"id",
  "Date": "date",
  "Time": "time",
  "Defect Name": "defectName",
  "Station": "stationLocation",
  "Part of the Car": "partOfCar",
  "Reporter Name": "reporterName",
  "Part Number": "partNumber",
  "Severity Rating": "severityRating",
  "Car Model": "carModel",
  "Motor Type": "motorType",
  "Design Package": "designPackage",
  "Production Shift": "productionShift",
  "Resolution Time (in hours)": "resolutionTime",
  "Root Cause Identified": "rootCauseIdentified",
  "Defect Category": "defectCategory",
  "Outlier": "outlier",
  "Outlier Name": "outlierName",
};

// Normalize raw JSON data into typed Defect[]
function normalizeData(raw: any[]): Defect[] {
  return raw.map((row,index) => {
    const normalized: Partial<Defect> = {};

    for (const [rawKey, defectKey] of Object.entries(keyMapping)) {
      let value = row[rawKey];

      if (defectKey === "rootCauseIdentified") {
        value = String(value).toLowerCase() === "yes";
      } else if (
        defectKey === "resolutionTime" ||
        defectKey === "severityRating"
      ) {
        value = Number(value);
      } else if (defectKey === "outlier") {
        value = false;
      } else if (defectKey === "outlierName") {
        value = "";
      }
      else if (defectKey ==="id"){
        value = index
      }

      normalized[defectKey] = value;
    }

    return normalized as Defect;
  });
}

// Outlier detection using mean and standard deviation on resolutionTime
function markNumericOutliers(defects: Defect[]): Defect[] {
  const key = "resolutionTime";

  const numericValues = defects
    .map(d => d[key])
    .filter((v): v is number => typeof v === "number");

  const mean =
    numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;

  const stdDev = Math.sqrt(
    numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      numericValues.length
  );

  const upperBound = mean + 1.4 * stdDev;
  const lowerBound = mean - 1.4 * stdDev;

  console.log(`Resolution Time → mean: ${mean.toFixed(2)}, std: ${stdDev.toFixed(2)}`);
  console.log(`Outlier bounds: [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]`);

  return defects.map((defect) => {
    const val = defect[key];
    const isOutlier =
      typeof val === "number" && (val < lowerBound || val > upperBound);

    return {
      ...defect,
      outlier: isOutlier,
      outlierName: isOutlier ? key : ""
    };
  });
}

function App() {
  const rawData = normalizeData(defectRawData as any[]);
  // Normalize the raw defect data into a structured format.

  const defectsData = markNumericOutliers(rawData);
  // Detect and mark numeric outliers in the normalized data.

  return (
    <Theme
      appearance="dark"
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      scaling="100%"
      panelBackground="solid"
      // Apply theme settings for the application.
    >
      <StyledTable data={defectsData} />
      {// Render the StyledTable component with the processed defects data.
 }   </Theme>
  );
}

export default App;

