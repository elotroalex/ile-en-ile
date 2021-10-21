const search = document.getElementById("search");
const form = document.getElementById("search-form");
const matchList = document.getElementById("match-list");
const target = document.getElementById("spin-box");

// Capture value of input box


function handleForm(event) {
  event.preventDefault();
  matchList.innerHTML = "";
  searchList(search.value);
}

form.addEventListener("submit", handleForm);

// Empty search box on unload

window.addEventListener("beforeunload", beforeUnloadListener, {
  capture: true,
});

async function beforeUnloadListener(event) {
  search.value = "";
}

// Spinner

var opts = {
  lines: 13, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 35, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: "spinner-line-fade-quick", // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: "#7ab1d2", // CSS color or array of colors
  fadeColor: "transparent", // CSS color or array of colors
  top: "80%", // Top position relative to parent
  left: "80%", // Left position relative to parent
  shadow: "0 0 1px transparent", // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: "spinner", // The CSS class to assign to the spinner
  position: "absolute", // Element positioning
};

// Search the list

async function searchList(searchText) {
  var spinner = new Spin.Spinner(opts).spin(target);
  let index = await fetch('data/lunr-index.json');
	let indexData = await index.json();
	let idx = lunr.Index.load(indexData);

	let docs = await fetch('data/mini-index.json');
	docs = await docs.json();

  let results = idx.search(searchText).slice(0, 49);

  // Show results in HTML

  if (results.length > 0) {
    var posts = results.map((item) => {
      return docs.find((document) => item.ref === document.ID);
    });
    var html = posts
      .map(
        (item) => `
    <div class="search-result card card-body mb-1">
      <h4><a href="${item.Permalink}">${item.Title}</a></h4>
      <small>${item.Content}...</small>
    </div>
    `
      )
      .join("");

    matchList.innerHTML = html;
  }
  spinner.stop();
};


