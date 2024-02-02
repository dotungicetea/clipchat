import { capitalizeFirstLetter } from ".";

const DEFAULT_ERROR_MESSAGE = "Something went wrong";

export const getContractErrorMsg = (err: any, defaultMessage = DEFAULT_ERROR_MESSAGE) => {
  // Init regex inside a function to reset regex (reset lastIndex)
  const REGEX_EXECUTION_REVERT = /execution reverted:([^"]*)/gm;
  if (err.message?.includes("execution reverted:")) {
    const match = REGEX_EXECUTION_REVERT.exec(err.message);
    return match ? match[1] : defaultMessage;
  }

  const REGEX_GET_MESSAGE = /Details:(.+)/gm;
  if (err?.message?.includes("Details:")) {
    const match = REGEX_GET_MESSAGE.exec(err);
    return match ? capitalizeFirstLetter(match[1].trim()) : defaultMessage;
  }

  return defaultMessage;
};
