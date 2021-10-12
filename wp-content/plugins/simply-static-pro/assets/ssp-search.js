const searchResults = [];

// Get index from JSON file.
var baseurl   = window.location.origin;
var host_name = window.location.hostname;
let index_url = baseurl + '/wp-content/plugins/simply-static-pro/configs/' + host_name.split('.').join('-') +'-index.json';
let index;

function loadIndex(callback) {   
  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', index_url, false); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}

loadIndex(function(response) {
    var json    = JSON.parse(response);
    const index = Object.values(json);

    // Build search index for Fuse.
    for ( const value of index ) {
      var result = {
          url     : value.fullUrl,
          title   : value.metaInfo.title,
          excerpt : value.metaInfo.metaDescription,
          content : value.metaInfo.metaDescription,
      };
      searchResults.push(result);
    }
 });


// Build search form.
const searchFormNode = document.querySelector('.search-form');
const searchInputNode = document.querySelector('.search-input');
const autoCompleteNode = document.querySelector('.search-auto-complete');
const resultNode = document.querySelector('.result');

let input = '';
let results = [];
let selected = -1;
let showAutoComplete = false;

const fuse = new Fuse(
searchResults,
{
  keys: ['title', 'content'],
  shouldSort: true,
  threshold: 0.5,
  maxPatternLength: 50 });

function renderAutoComplete() {
  if (!showAutoComplete || input.length < 3 || results.length === 0) {
    autoCompleteNode.classList.remove('show');
    return '';
  } else {
    autoCompleteNode.classList.add('show');
  }

  return `
    <ul>
      ${results.map((result, index) => `
        <a href="${result.url}" style="text-decoration:none;color:#000000">
          <li class='auto-complete-item${index === selected ? ' selected' : ''}'>
            <p><b>${result.title}</b></br>
              <small>${result.excerpt}</small>
            </p>
          </li>
        </a>
      `).join('')}
    </ul>
  `;
}

function handleSearchInput(event) {
  input = event.target.value;
  results = [];
  if (input.length >= 3) {
    results = fuse.search(input).slice(0, 7);
  }
  showAutoComplete = true;
  autoCompleteNode.innerHTML = renderAutoComplete();
}

function updateSearchInput() {
  if (selected === -1) {
    searchInputNode.value = input;
  } else {
    searchInputNode.value = results[selected].title;
  }
  autoCompleteNode.innerHTML = renderAutoComplete();
}

function handleSearchKeyDown(event) {
  switch (event.which) {
    case 38: // Arrow up
      selected = Math.max(--selected, -1);
      updateSearchInput();
      break;
    case 40: // Arrow down
      selected = Math.min(++selected, results.length - 1);
      showAutoComplete = true;
      updateSearchInput();
      break;
    case 9: // Tab
      showAutoComplete = false;
      updateSearchInput();
      break;
    case 27: // Escape
      selected = -1;
      showAutoComplete = false;
      updateSearchInput();
      break;}
}


function handleWindowClick(event) {
  showAutoComplete = false;
  autoCompleteNode.innerHTML = renderAutoComplete();
}

document.querySelector('.search-input-container').addEventListener('keydown', handleSearchKeyDown);
searchInputNode.addEventListener('input', handleSearchInput);
window.addEventListener('click', handleWindowClick);