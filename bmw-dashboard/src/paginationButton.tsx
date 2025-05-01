import { Button, Flex, Text, TextField } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationButtons = ({ currentPage, totalPages, onPageChange }: Props) => {
  const [inputValue, setInputValue] = useState(currentPage.toString());
  // State to manage the current input value for the page number.

  const isEditing = useRef(false);
  // Ref to track whether the user is editing the input field.

  useEffect(() => {
    if (!isEditing.current) {
      setInputValue(currentPage.toString());
      // Sync input value with the current page when not editing.
    }
  }, [currentPage]);

  const handleCommit = () => {
    const newPage = parseInt(inputValue);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
      // Update the page if the input is valid.
    } else {
      setInputValue(currentPage.toString());
      // Reset input value if the input is invalid.
    }
    isEditing.current = false;
  };

  return (
    <Flex justify="center" align="center" gap="1rem">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        // Go to the previous page if not on the first page.
      >
        Previous
      </Button>

      <Flex align="center" gap="2">
        <Text>Page</Text>
        <TextField.Root
          readOnly
          variant="surface"
          style={{ width:  "5rem", textAlign: "center" }}
          onClick={() => (isEditing.current = true)}
          // Enable editing mode when the input is clicked.
        >
          <input
            maxLength={totalPages.toString().length}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // Update input value as the user types.

            onBlur={handleCommit}
            // Commit changes when the input loses focus.

            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur(); // Trigger onBlur on Enter key press.
              }
            }}
            style={{
              all: "unset",
              width: "5rem",
              textAlign: "center",
              fontSize: "inherit",
            }}
          />
        </TextField.Root>
        <Text>of {totalPages}</Text>
{        // Display the total number of pages.
}      </Flex>

      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        // Go to the next page if not on the last page.
      >
        Next
      </Button>
    </Flex>
  );
};

export default PaginationButtons;
