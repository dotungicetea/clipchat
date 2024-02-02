"use client";

const ListEmpty = ({ show = true, text = "Empty" }: { show?: boolean; text?: string }) => {
  if (!show) return <></>;
  return <div className="flex h-40 w-full flex-col items-center justify-center">{text}</div>;
};

export default ListEmpty;
