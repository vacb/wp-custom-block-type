import React from "react";
import ReactDOM from "react-dom";
import "./frontend.scss";

const divsToUpdate = document.querySelectorAll(".custom-block-update-me");

divsToUpdate.forEach(function (div) {
  // Component to render, into which div
  ReactDOM.render(<Quiz />, div);
  div.classList.remove("custom-block-frontend");
});

function Quiz() {
  return <div className="custom-block-frontend">Hello from React</div>;
}
