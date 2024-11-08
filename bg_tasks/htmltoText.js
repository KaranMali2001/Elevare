const { convert } = require("html-to-text");

function textFromHtml(htmlString) {
  const textContent = convert(htmlString, {
    wordwrap: 130,
  });
  // console.log("Html converted to text", textContent);
  return textContent;
}
module.exports = {
  textFromHtml,
};
