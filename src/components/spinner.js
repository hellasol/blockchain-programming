import React from "react";
import { Spinner } from "reactstrap";

//Spinner to show while transaction is loading
export function SpinnerAnimation() {
  return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
}
