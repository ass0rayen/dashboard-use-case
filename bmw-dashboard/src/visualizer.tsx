import {
  Box,
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GoGraph } from "react-icons/go";
import { Defect } from "./dataStructure";
import { useMemo, useState, useCallback } from "react";

interface VisualizerProps {
  data: Defect[];
}

interface GraphConfig {
  label: string;
  key: keyof Defect;
  key2?: keyof Defect;
}

const graphs: GraphConfig[] = [
  { label: "resolution time per reporter", key: "reporterName", key2: "resolutionTime" },
  // Graph configuration for resolution time grouped by reporter.

  { label: "defects per day", key: "date" },
  // Graph configuration for defects grouped by date.

  { label: "defects per model", key: "carModel" },
  // Graph configuration for defects grouped by car model.

  { label: "defects per car part", key: "partOfCar" },
  // Graph configuration for defects grouped by car part.

  { label: "defects per defect name", key: "defectName" },
  // Graph configuration for defects grouped by defect name.

  { label: "defects per station", key: "stationLocation" },
  // Graph configuration for defects grouped by station location.

  { label: "root cause identified per resolution time", key: "rootCauseIdentified", key2: "resolutionTime" },
  // Graph configuration for resolution time grouped by root cause identification.

  { label: "resolution time per model", key: "carModel", key2: "resolutionTime" },
  // Graph configuration for resolution time grouped by car model.
];

const Visualizer = ({ data }: VisualizerProps) => {
  const [selectedGraph, setSelectedGraph] = useState<GraphConfig | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const calculateChartData = useCallback((config: GraphConfig) => {
    if (config.key2) {
      const groupSums: Record<string, number> = {};
      const groupCounts: Record<string, number> = {};

      data.forEach((element) => {
        const groupKey = String(element[config.key] ?? "Unknown").toUpperCase();
        const valueRaw = element[config.key2 as keyof Defect];
        const value = typeof valueRaw === "number" ? valueRaw : parseFloat(String(valueRaw));
        // Parse and validate the secondary key value.

        if (!isNaN(value)) {
          groupSums[groupKey] = (groupSums[groupKey] || 0) + value;
          groupCounts[groupKey] = (groupCounts[groupKey] || 0) + 1;
          // Accumulate sums and counts for each group.
        }
      });

      return Object.entries(groupSums)
        .map(([name, total]) => {
          const count = groupCounts[name];
          return {
            name,
            count: Math.round((total / count) * 100) / 100,
            // Calculate the average value for each group.
          };
        })
        .filter((entry) => groupCounts[entry.name] >= 10);
        // Filter out groups with fewer than 10 entries.
    } else {
      const counts: Record<string, number> = {};

      data.forEach((element) => {
        const key = String(element[config.key] ?? "Unknown").toUpperCase();
        counts[key] = (counts[key] || 0) + 1;
        // Count occurrences for each group.
      });

      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .filter((entry) => entry.count >= 10);
        // Filter out groups with fewer than 10 entries.
    }
  }, [data]);

  const handleGraphSelection = useCallback((config: GraphConfig) => {
    const calculatedData = calculateChartData(config);
    setChartData(calculatedData);
    setSelectedGraph(config);
    setOpen(true);
    // Update state and open the dialog when a graph is selected.
  }, [calculateChartData]);

  return (
    <>
      <Box ml="5">
        <Flex gap="3" justify="center" align="center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="surface">
                <GoGraph size={24} />
                {// Button to trigger the graph selection dropdown.
}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {graphs.map((graph) => (
                <DropdownMenu.Item
                  key={graph.label}
                  onSelect={() => handleGraphSelection(graph)}
                  // Handle graph selection when an item is clicked.
                >
                  {graph.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Box>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <Dialog.Title>{selectedGraph?.label}</Dialog.Title>
          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  wrapperStyle={{ color: "black" }}
                  itemStyle={{ color: "black" }}
                  // Tooltip to display data details on hover.
                />
                <Bar dataKey="count">
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#4F46E5" />
                    // Render bars with a consistent color.
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default Visualizer;