import {
  ChevronDownIcon,
  ChevronUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { LuFlag } from "react-icons/lu";
import {
  Dialog,
  Flex,
  Table,
  Text,
  TextField,
  Button,
} from "@radix-ui/themes";
import { Defect } from "./dataStructure";
import { useState, memo, useCallback } from "react";

interface sortingConf {
  key: string;
  direction: "asc" | "desc" | "";
}

const RowWithDialog = memo(({
  row,
  headers,
  toggleFlag,
  flaggedDefects,
}: {
  row: Defect;
  headers: string[];
  toggleFlag: (id: number, note: string) => void;
  flaggedDefects: Record<number, string>;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  // State to manage whether the dialog for adding a note is open.

  const [note, setNote] = useState("");
  // State to manage the note input value.

  const isFlagged = flaggedDefects.hasOwnProperty(row.id);
  // Check if the current row is flagged.

  const existingNote = flaggedDefects[row.id] || "";
  // Retrieve the existing note for the flagged row, if any.

  const handleFlagClick = useCallback(() => {
    if (isFlagged) {
      toggleFlag(row.id, "");
      // Unflag the row if it is already flagged.
    } else {
      setDialogOpen(true);
      setNote("");
      // Open the dialog to add a note if the row is not flagged.
    }
  }, [isFlagged, row.id, toggleFlag]);

  return (
    <>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Content maxWidth="35%">
          <Dialog.Title>Add Note</Dialog.Title>
          <TextField.Root
            maxLength={25}
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            // Update the note value as the user types.
          />
          <Flex justify="end" mt="4">
            <Dialog.Close>
              <Button
                onClick={() => {
                  toggleFlag(row.id, note);
                  setNote("");
                  // Save the note and flag the row.
                }}
              >
                Save
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Table.Row>
        <Table.Cell
          align="center"
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: isFlagged
              ? "#3b82f680"
              : row.outlier
              ? row.outlierName.split(",").length === 1
                ? "#939570a8"
                : "#ff3333c7"
              : "inherit",
            // Apply different background colors based on the row's state.
          }}
        >
          <Flex align="center" justify="center" minHeight="3rem">
            <LuFlag
              style={{
                flexShrink: 0,
                cursor: "pointer",
              }}
              onClick={handleFlagClick}
              size={"1rem"}
              color={isFlagged ? "#3b82f6" : undefined}
              // Change the flag icon color if the row is flagged.
            />
            {isFlagged && existingNote && (
              <Text
                size="1"
                color="gray"
                ml="2"
                style={{ maxWidth: "10rem" }}
                title={existingNote}
                wrap={"wrap"}
              >
                {existingNote}
{                // Display the existing note if the row is flagged.
}              </Text>
            )}
          </Flex>
        </Table.Cell>

        {headers.map((key) => (
          <Table.Cell
            align="center"
            key={`${row.id}-${key}`}
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: isFlagged
                ? "#3b82f640"
                : row.outlier
                ? row.outlierName.split(",").length === 1
                  ? "#93957060"
                  : "#ff333360"
                : "inherit",
              // Apply background colors for each cell based on the row's state.
            }}
          >
            <Flex align="center" justify="center" minHeight="3rem">
              <Text size="2" color={isFlagged ? "blue" : "gray"} trim="start">
                {String(row[key as keyof Defect])}
{                // Display the cell value with appropriate styling.
}              </Text>
            </Flex>
          </Table.Cell>
        ))}
      </Table.Row>
    </>
  );
});

interface DefectTableProps {
  data: Defect[];
  setNameOfColumn: React.Dispatch<React.SetStateAction<sortingConf>>;
  sortingConf: sortingConf;
  headers: string[];
  toggleFlag: (id: number, note: string) => void;
  flaggedDefects: Record<number, string>;
  labelMap: Record<string, string>;
}

const DefectTable = memo(({
  data,
  setNameOfColumn,
  sortingConf,
  headers,
  toggleFlag,
  flaggedDefects,
  labelMap,
}: DefectTableProps) => {
  const handleColumnClick = useCallback(
    (name: string) => {
      setNameOfColumn((prev) => ({
        key: name,
        direction:
          prev.key === name
            ? prev.direction === "asc"
              ? "desc"
              : "asc"
            : "asc",
      }));
    },
    [setNameOfColumn]
  );

  if (data.length === 0) return <Text size="3">No data available</Text>;

  return (
    <Table.Root size="3" variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell align="center" style={{ padding: "0.75rem 1rem" }} />
          {headers.map((name) => (
            <Table.ColumnHeaderCell
              onClick={() => handleColumnClick(name)}
              align="center"
              key={name}
              style={{
                cursor: "pointer",
                userSelect: "none",
                padding: "0.75rem 1rem",
              }}
            >
              <Flex gap="2" justify="center" align="center">
                <Text weight="medium">{labelMap[name] ?? name}</Text>
                {sortingConf.key === name ? (
                  sortingConf.direction === "asc" ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronUpIcon />
                  )
                ) : (
                  <CaretSortIcon />
                )}
              </Flex>
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((row) => (
          <RowWithDialog
            key={row.id}
            row={row}
            headers={headers}
            toggleFlag={toggleFlag}
            flaggedDefects={flaggedDefects}
          />
        ))}
      </Table.Body>
    </Table.Root>
  );
});

export default DefectTable;
