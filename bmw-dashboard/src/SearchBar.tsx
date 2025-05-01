import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  DropdownMenu,
  Flex,
  TextField,
} from "@radix-ui/themes";

interface Props {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  // Function to update the search term state.

  headers: string[];
  // List of column headers available for search.

  searchCategory: React.Dispatch<React.SetStateAction<string>>;
  // Function to update the selected search category.

  searchCategoryName: string;
  // Name of the currently selected search category.

  labelMap: Record<string, string>;
  // Mapping of column keys to user-friendly labels.
}

const SearchBar = ({
  setSearchTerm,
  headers,
  searchCategory,
  searchCategoryName,
  labelMap,
}: Props) => {
  return (
    <Box width="45%">
      <Flex gap="3" align="center">
        <TextField.Root
          onChange={(e) => setSearchTerm(e.target.value)}
          // Update the search term whenever the input value changes.

          size="2"
          placeholder="Search the table"
          // Placeholder text for the search input.

          style={{ flex: 1 }}
          // Make the search input take up available space.
        >
          <TextField.Slot>
            <MagnifyingGlassIcon />
{            // Display a magnifying glass icon inside the search input.
}          </TextField.Slot>
        </TextField.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="surface">
              {labelMap[searchCategoryName] ?? searchCategoryName} <DropdownMenu.TriggerIcon />
{              // Display the current search category with a dropdown icon.
}            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {headers.map((name, id) => (
              <DropdownMenu.Item
                key={id}
                onSelect={() => searchCategory(name)}
                // Update the search category when a dropdown item is selected.
              >
                {labelMap[name] ?? name}
{                // Display the user-friendly label or fallback to the raw name.
}              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Box>
  );
};

export default SearchBar;
