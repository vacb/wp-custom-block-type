import "./index.scss";
// Import WP components
import {
  TextControl,
  Flex,
  FlexBlock,
  FlexItem,
  Button,
  Icon,
  PanelBody,
  PanelRow,
  ColorPicker,
} from "@wordpress/components";
// For right-hand options area, plus PanelBody, PanelRow and ColorPicker above
import {
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
} from "@wordpress/block-editor";
import { ChromePicker } from "react-color";

(function () {
  let locked = false;
  // Calls function any time the data on the block editor as a whole changes
  wp.data.subscribe(function () {
    const results = wp.data
      .select("core/block-editor")
      .getBlocks()
      .filter((block) => {
        return (
          block.name == "vbplugin/custom-block-type" &&
          block.attributes.correctAnswer == undefined
          // Returned array will be empty unless there is a block that hasn't marked a correct answer yet
        );
      });

    if (results.length && locked == false) {
      locked = true;
      wp.data.dispatch("core/editor").lockPostSaving("noanswer");
    }

    if (!results.length && locked == true) {
      locked = false;
      wp.data.dispatch("core/editor").unlockPostSaving("noanswer");
    }
  });
})();
// Syntax () after the anon function definition wrapped in parens is an immediately invoked function expression IIFE - scoped variables - don't accidentally mess up globally scoped WP variables

wp.blocks.registerBlockType("vbplugin/custom-block-type", {
  title: "Are You Paying Attention?",
  icon: "smiley",
  category: "common",
  attributes: {
    question: { type: "string" },
    answers: {
      type: "array",
      default: [""],
    },
    // Use undefined as default because working with an array can mean correct answer index is 0, makes boolean checks more difficult.
    correctAnswer: { type: "number", default: undefined },
    // Attribute to store block background colour chosen by admin
    bgColor: { type: "string", default: "#EBEBEB" },
    theAlignment: { type: "string", default: "left" },
  },
  example: {
    attributes: {
      question: "What is the meaning of life?",
      correctAnswer: 3,
      answers: ["Who knows?", "Not really sure", "Doplphins", 42],
      theAlignment: "center",
      bgColor: "#CFE8F1",
    },
  },
  description: "Quiz custom block type.",
  // Code in post body
  edit: EditComponent,
  // Code generated by save
  save: function (props) {
    // Move responsibility from JS to PHP by returning null here instead of static text
    // Register a block type in our PHP code with the exact same name with a PHP render function responsible for output
    return null;
  },
});

// EDIT BLOCK
function EditComponent(props) {
  // TextControl component passes value directly, no need for event
  function updateQuestion(value) {
    props.setAttributes({ question: value });
  }
  // DELETE ANSWER
  function deleteAnswer(indexToDelete) {
    const newAnswers = props.attributes.answers.filter((x, index) => {
      return index != indexToDelete;
    });
    props.setAttributes({ answers: newAnswers });

    if (indexToDelete == props.attributes.correctAnswer) {
      props.setAttributes({ correctAnswer: undefined });
    }
  }

  // MARK CORRECT ITEM
  function markAsCorrect(index) {
    props.setAttributes({ correctAnswer: index });
  }

  return (
    // Use background colour from attributes
    <div
      className="custom-edit-block"
      style={{ backgroundColor: props.attributes.bgColor }}
    >
      {/* TOOLBAR OPTIONS FOR TEXT ALIGNMENT - USED ON FRONT END ONLY */}
      <BlockControls>
        <AlignmentToolbar
          value={props.attributes.theAlignment}
          onChange={(x) => props.setAttributes({ theAlignment: x })}
        />
      </BlockControls>
      {/* RIGHT-HAND OPTIONS PANEL */}
      <InspectorControls>
        <PanelBody title="Background Colour" initialOpen={true}>
          <PanelRow>
            {/* hex offered by WP ColorPicker component */}
            {/* disableAlpha stops admin changing transparency */}
            <ChromePicker
              color={props.attributes.bgColor}
              onChangeComplete={(x) => {
                props.setAttributes({ bgColor: x.hex });
              }}
              disableAlpha={true}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      {/* QUESTION TEXT BOX */}
      <TextControl
        label="Question:"
        style={{ fontSize: "20px" }}
        value={props.attributes.question}
        onChange={updateQuestion}
      />
      <p style={{ fontSize: "13px", margin: "20px 0 8px 0" }}>Answers:</p>
      {props.attributes.answers.map((answer, index) => {
        return (
          <Flex>
            {/* ANSWER TEXT BOX */}
            <FlexBlock>
              {/* Make text box editable by adding onChange function */}
              <TextControl
                // Autofocus the only answer set to undefined i.e. one just created
                autoFocus={answer == undefined}
                value={answer}
                onChange={(newValue) => {
                  // Make a copy of the array - don't mutate state
                  const newAnswers = props.attributes.answers.concat([]);
                  // Map can pass index as second param
                  newAnswers[index] = newValue;
                  // Set state to new array
                  props.setAttributes({ answers: newAnswers });
                }}
              />
            </FlexBlock>
            {/* STAR ICON */}
            <FlexItem>
              <Button
                onClick={() => {
                  markAsCorrect(index);
                }}
              >
                <Icon
                  icon={
                    index == props.attributes.correctAnswer
                      ? "star-filled"
                      : "star-empty"
                  }
                  className="mark-as-correct"
                />
              </Button>
            </FlexItem>
            {/* DELETE BUTTON */}
            <FlexItem>
              <Button
                isLink
                className="attention-delete"
                onClick={() => deleteAnswer(index)}
              >
                Delete
              </Button>
            </FlexItem>
          </Flex>
        );
      })}
      {/* ADD ANOTHER ANSWER BUTTON */}
      <Button
        isPrimary
        onClick={() => {
          props.setAttributes({
            // Set default value to undefined to allow autofocus above
            answers: props.attributes.answers.concat([undefined]),
          });
        }}
      >
        Add another answer
      </Button>
    </div>
  );
}
