// Content script is "a JavaScript file that runs
// in the context of web pages."

// Dictionary of Comparisons
var dict = {
  "Starbucks Venti Caramel Macchiatos": 4.75,
  "bottles of refreshing and hydrating water": 1.45,
  "Chipotle chicken bowls": 6.5,
  "years of tuition at CMU": 76543,
  "pairs of Lulu Lemon leggings": 120,
  "months of Spotify Premium": 9.99,
  "acres of land in Texas": 2735,
  "sheets of Five Star reinforced leaf paper": 0.02,
  "tons of frozen spinach": 144,
  "lunchable extra cheesy pizza packages": 1.98,
  "dinner blocks at CMU": 11.08,
  "bags of Shin Raymun": 3.76
};

// Return random key from comparisons
function randKey(dictionary) {
  var keys = Object.keys(dictionary);
  return keys[Math.floor(keys.length * Math.random())];
}

// Return a string given a string and item
// "For this cost you hsould get this many relative items"
function compare(productCost, relativeItem) {
  var a = parseFloat(productCost.slice(1, productCost.length));
  var b = dict[relativeItem];
  return (
    "For " +
    productCost +
    ", you could get " +
    (a / b).toFixed(3).toString() +
    " " +
    relativeItem
  );
}

// Function to scale color with magnitude
function setColor(pc, ri) {
  var x = parseFloat(pc.slice(1, pc.length)); // TODO: strip whitespace first
  var y = dict[ri];
  var m = Math.floor(x / y);
  if (m > 200) {
    return "hsl(0, 80%, 50%)";
  } else {
    var r = Math.floor(((200 - m) / 200) * 120);
    console.log("hsl( " + r.toString() + ", 80%, 50%)");
    return "hsl( " + r.toString() + ", 80%, 50%)";
  }
}

// Function to get text in case of ranges
function safeText(htmlobj) {
  if (htmlobj.includes("-")) {
    var a = parseFloat(htmlobj.slice(1, htmlobj.lastIndexOf("$") - 3));
    console.log(htmlobj.length);
    var b = parseFloat(
      htmlobj.slice(htmlobj.lastIndexOf("$") + 1, htmlobj.length)
    );
    var avg = (a + b) / 2;
    // console.log(avg);
    return "$" + avg.toFixed(2).toString();
  } else {
    return htmlobj;
  }
}

function make_popup(price) {
  //Get price information
  var priceString = price.innerHTML;
  var pc = safeText(price.innerHTML);
  var ri = randKey(dict);
  var color = setColor(pc, ri);

  // Init popup window
  var popup = document.createElement("div");
  var productInfo = document.createTextNode(compare(pc, ri));
  popup.style.display = "block";
  popup.style.color = "black";
  popup.style.padding = "5px";
  popup.style.zIndex = "100";
  popup.style.backgroundColor = color;
  // console.log(color);  // TODO: fix colors somehow?
  popup.style.position = "absolute";
  popup.appendChild(productInfo);

  // When hovering over, show popup
  price.addEventListener("mouseover", event => {
    popup.style.left = event.pageX + 2 + "px";
    popup.style.top = event.pageY + 2 + "px";
    document.body.appendChild(popup);
  });
  // Otherwise don't show popup
  price.addEventListener("mouseout", _ => {
    document.body.removeChild(popup);
  });
}

const TEXT_NODE = 3; // just the DOM nodeType property for text nodes

// cute little helper function for pairing up items in a list
function pair(acc, _, i, arr) {
  if (i % 2 === 0) acc.push(arr.slice(i, i + 2));
  return acc;
}

// parse text for a price
// INPUT  text : string
// OUTPUT [(s,i,j)], where
//           s : string is the price
//           i : int is the start index
//           j : int is the end index
// EXAMPLE parse_text("that'll be $6.43, please") ==> [["$6.43", 11, 16]]
function parse_text(text) {
  // I love writing regexps, don't you?
  var regexp = /\$\s*\d+(?:\.\d\d)?/g;
  var result = [];
  while ((price = regexp.exec(text)) != null) {
    result.push([price[0], price.index, price.index + price[0].length]);
  }
  return result;
}

// make a price tag <span> from one of the outputs of parse_text
// e.g. parse_text.map(make_tag)
function make_tag(price) {
  var span = document.createElement("span");
  span.textContent = price[0].replace(/\s/g, "");

  // TODO: scale color based on price?
  span.style.backgroundColor = "#ffcf40";
  span.style.borderRadius = "5px";
  span.style.padding = "1px";
  span.style.display = "inline-block"; // somewhat questionable...
  return span;
}

// go through a function and mark all the prices in the text by replacing
// them with highlighted span's
// e.g. mark_prices(document.body)
function mark_prices(node) {
  return Array.from(node.childNodes)
    .map(child => {
      if (child.nodeType === TEXT_NODE) {
        // extract the price list and split the text segments accordingly
        let text = child.textContent;
        let prices = parse_text(text);
        let indices = prices
          .map(x => x.slice(1))
          .reduce((x, y) => x.concat(y), []);
        let tags = prices.map(make_tag);
        let segments = [0]
          .concat(indices)
          .concat([text.length])
          .reduce(pair, [])
          .map(i => text.slice(i[0], i[1]));

        // create the new pretty node and replace the old text node with it
        let fancy = document.createElement("span");
        fancy.appendChild(document.createTextNode(segments[0]));
        tags.forEach((tag, i) => {
          fancy.appendChild(tag);
          fancy.appendChild(document.createTextNode(segments[i + 1]));
        });
        node.insertBefore(fancy, child);
        node.removeChild(child);
        return tags;
      } else {
        return mark_prices(child);
      }
    })
    .reduce((x, y) => x.concat(y), []);
}

mark_prices(document.body).forEach(make_popup);
