wp.blocks.registerBlockType("vbplugin/custom-block-type", {
  title: "Are You Paying Attention?",
  icon: "smiley",
  category: "common",
  edit: function () {
    return (
      <div>
        <p>Paragraph from the edit section</p>
        <h4>Heading!</h4>
      </div>
    );
  },
  save: function () {
    return (
      <div>
        <h3>Heading on the front end</h3>
      </div>
    );
  },
});
