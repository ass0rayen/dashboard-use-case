// StyledTable.tsx
import { useMemo, useCallback, useState } from "react";
import { Defect } from "./dataStructure";
import DefectTable from "./DataTable";
import PaginationButtons from "./paginationButton";
import SearchBar from "./SearchBar";
import Visualizer from "./visualizer";
import { Box, Button, DropdownMenu, Flex } from "@radix-ui/themes";

interface Props {
  data: Defect[];
}

interface sortingConf {
  key: string;
  direction: "asc" | "desc" | "";
}

const StyledTable = ({ data }: Props) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<sortingConf>({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("date");
  const [flaggedDefects, setFlaggedDefects] = useState<Record<number, string>>({});
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);
  const [flaggedData, setFlaggedData] = useState<Defect[]>();

  const excludedKeys = useMemo(() => ["id", "note", "flagged"], []);
  const headers = useMemo(
    () => Object.keys(data[0]).filter((key) => !excludedKeys.includes(key)),
    [data, excludedKeys]
  );

  const labelMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    headers.forEach((key) => {
      map[key] = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, (c) => c.toUpperCase());
    });
    return map;
  }, [headers]);

  const fullData = showOnlyFlagged ? flaggedData || [] : data;
  // If "showOnlyFlagged" is true, use flaggedData; otherwise, use the full dataset.

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return [...fullData];
    // If no sorting configuration is set, return the data as is.

    return [...fullData].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof Defect];
      const bVal = b[sortConfig.key as keyof Defect];
      // Compare values of the specified key for sorting.

      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      return 0;
      // Sort in ascending or descending order based on the direction.
    });
  }, [fullData, sortConfig]);
  // Recompute sorted data whenever "fullData" or "sortConfig" changes.

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    // If no search term is provided, return the sorted data.

    const term = searchTerm.toLowerCase();
    return sortedData.filter((item) => {
      const value = item[searchCategory as keyof Defect];
      // Get the value of the current search category.

      if (value === undefined || value === null) return false;
      // Skip items with undefined or null values.

      return String(value).toLowerCase().includes(term);
      // Check if the value contains the search term (case-insensitive).
    });
  }, [sortedData, searchTerm, searchCategory]);
  // Recompute filtered data whenever "sortedData", "searchTerm", or "searchCategory" changes.

  const { slicedData, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    // Calculate the total number of pages based on the filtered data and items per page.

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Determine the range of items to display for the current page.

    const slicedData = filteredData.slice(startIndex, endIndex);
    // Extract the subset of data for the current page.

    return { slicedData, totalPages };
  }, [filteredData, currentPage, itemsPerPage]);
  // Recompute sliced data and total pages whenever "filteredData", "currentPage", or "itemsPerPage" changes.

  const toggleFlag = useCallback(
    (id: number, note: string) => {
      const isAlreadyFlagged = flaggedDefects.hasOwnProperty(id);

      setFlaggedDefects((prev) => {
        if (isAlreadyFlagged) {
          const { [id]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [id]: note };
      });

      setFlaggedData((prev = []) => {
        if (isAlreadyFlagged) {
          return prev.filter((item) => item.id !== id);
        } else {
          const found = data.find((d) => d.id === id);
          return found ? [...prev, found] : prev;
        }
      });
    },
    [data, flaggedDefects]
  );

  return (
    <Flex justify="center" width="100%">
      <Box width="99%">
        <Flex justify="between" align="center" width="100%" mt="1rem" mb="1rem">
          <Flex gap="2" width="50%">
            <SearchBar
              searchCategoryName={labelMap[searchCategory] || searchCategory}
              searchCategory={setSearchCategory}
              setSearchTerm={setSearchTerm}
              headers={headers}
              labelMap={labelMap}
            />
            <Visualizer data={fullData} />
          </Flex>
          <Flex gap="1rem" align="center">
            <Button
              variant={!showOnlyFlagged ? "outline" : "classic"}
              onClick={() => {
                setShowOnlyFlagged((prev) => !prev);
                setCurrentPage(1);
              }}
            >
              Display Flagged
            </Button>
            <PaginationButtons
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="surface">
                  {itemsPerPage} <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {[10, 15, 25].map((num) => (
                  <DropdownMenu.Item
                    key={num}
                    onSelect={() => {
                      setCurrentPage(
                        num > itemsPerPage
                          ? Math.floor((itemsPerPage * currentPage) / num)
                          : Math.ceil((itemsPerPage * currentPage) / num)
                      );
                      setItemsPerPage(num);
                    }}
                  >
                    {num}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>
        <DefectTable
          headers={headers}
          setNameOfColumn={setSortConfig}
          data={slicedData}
          sortingConf={sortConfig}
          toggleFlag={toggleFlag}
          flaggedDefects={flaggedDefects}
          labelMap={labelMap}
        />
      </Box>
    </Flex>
  );
};

export default StyledTable;