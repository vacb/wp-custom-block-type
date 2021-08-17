import React from "react";
import ReactDOM from "react-dom";
import "./frontend.scss";

const divsToUpdate = document.querySelectorAll(".custom-block-update-me");

divsToUpdate.forEach(function (div) {
  // Find JSON-encoded attributes in the 'pre' div created by index.php and parse to use as props
  const data = JSON.parse(div.querySelector("pre").innerHTML);
  // Component to render, into which div
  ReactDOM.render(<Quiz {...data} />, div);
  div.classList.remove("custom-block-frontend");
});

function Quiz(props) {
  return (
    <div className="custom-block-frontend">
      <p>{props.question}</p>
      <ul>
        {props.answers.map((answer) => {
          return <li>{answer}</li>;
        })}
      </ul>
    </div>
  );
}
