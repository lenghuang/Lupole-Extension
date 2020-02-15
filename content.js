// Content script is “a JavaScript file that runs
// in the context of web pages.”

// Dictionary of Comparisons
var dict = {
  "cups of coffee": 2.7,
  "chipotle chicken bowls": 6.5,
  "years of tuition at CMU": 76543,
  "pairs of Lulu Lemon leggings": 120,
  "blocks for Schatz": 11.05
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
  var x = parseFloat(pc.slice(1, pc.length));
  var y = dict[ri];
  var m = Math.floor(x / y);
  var r = Math.floor(m / 2);
  //return "rgba(" + m.toString() + ", " + r.toString() + ", 0, 20)";
  return "#ffcf40";
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
    console.log(avg);
    return "$" + avg.toFixed(2).toString();
  } else {
    return htmlobj;
  }
}

// Retrive price
let price = document.getElementById("priceblock_ourprice");
if (price == null) {
  price = document.getElementById("priceblock_dealprice");
}

if (price != null) {
  //Get price information
  var priceString = price.innerHTML;
  var pc = safeText(price.innerHTML);
  var ri = randKey(dict);
  var color = setColor(pc, ri);
  price.style.cssText = "color: black; background-color: " + color;

  // Init popup window
  var popup = document.createElement("div");
  var productInfo = document.createTextNode(compare(pc, ri));
  popup.id = "popup";
  popup.style.display = "none"; // start as unseen
  popup.appendChild(productInfo);

  // Append back onto price
  price.appendChild(popup);

  // When hovering over, show popup
  price.onmouseover = function() {
    document.getElementById("popup").style.cssText =
      "color: black; padding: 5px; background-color: " +
      color +
      "; display: block;";
  };
  // Otherwise don't show popup
  price.onmouseout = function() {
    document.getElementById("popup").style.cssText =
      "color: black; padding: 5px; background-color: " +
      color +
      "; display: none;";
  };
}
