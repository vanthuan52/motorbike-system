import React, { useMemo, useState } from "react";

import { useTiptapContext } from "../../Provider";
import { CODE_BLOCK_LANGUAGUES } from "@/features/TiptapEditor/constants/code-languages";
import MenuButton from "../../MenuButton";

interface CodeDropdownProps {
  value: string;
  onSelect: (value: string) => void;
}

const CodeDropdown = ({ value, onSelect }: CodeDropdownProps) => {
  const { contentElement } = useTiptapContext();
  const [search, setSearch] = useState("");

  const options = CODE_BLOCK_LANGUAGUES.map((item) => ({
    label: item.label,
    value: item.syntax,
  }));
  const filterOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((item) => item.label.includes(search));
  }, [options, search]);

  return (
    <MenuButton
      type="popover"
      text={options.find((item) => item.value === value)?.label}
      hideText={false}
      tooltip={false}
      buttonStyle={{ minWidth: "6rem" }}
      dropdownClass="rte-code-dropdown"
      dropdownStyle={{
        minWidth: "10rem",
      }}
    ></MenuButton>
  );
};

export default CodeDropdown;
