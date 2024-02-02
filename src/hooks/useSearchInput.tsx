"use client";

import { ChangeEvent, useEffect, useState } from "react";

const useSearchInput = () => {
  const [inputSearch, setInputSearch] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(inputSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);
  };

  const handleCancel = () => {
    setInputSearch("");
    setSearchValue("");
  };

  return { inputSearch, handleSearch, searchValue, handleCancel };
};

export default useSearchInput;
