"use client";

import { useState } from "react";

const useDialog = () => {
  const [show, setShow] = useState<boolean>(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return { show, handleClose, handleShow };
};

export default useDialog;
