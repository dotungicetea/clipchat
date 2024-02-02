"use client";

const ListLoadingMore = ({ show = true }: { show?: boolean }) => {
  if (!show) return <></>;
  return (
    <div className="my-5 flex w-full items-center justify-center">
      <div className="dot-loading"></div>
    </div>
  );
};

export default ListLoadingMore;
