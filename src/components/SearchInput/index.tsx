"use client";

import iconSearch from "@images/icon-search.svg";
import clsx from "clsx";
import Image from "next/image";
import { ChangeEvent } from "react";

type TSearchInput = {
  inputSearch: string;
  placeholder?: string;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCancel: () => void;
};

const SearchInput = (props: TSearchInput) => {
  const {
    handleCancel,
    handleSearch,
    inputSearch,
    placeholder = "Search for X Display Name or Handle",
  } = props;

  return (
    <div className="flex w-full items-center">
      <div className="flex h-[38px] w-full items-center bg-[#FFFFFF26] px-2.5 py-2">
        <Image alt="" src={iconSearch} width={12} className="h-auto opacity-50" />

        <input
          type="text"
          className={clsx("inputText small normalText ml-2.5 w-full bg-transparent text-left")}
          value={inputSearch}
          placeholder={placeholder}
          onChange={handleSearch}
        />
      </div>
      {!!inputSearch ? (
        <button className="ml-[15px]" onClick={handleCancel}>
          Cancel
        </button>
      ) : null}
    </div>
  );
};

export default SearchInput;
