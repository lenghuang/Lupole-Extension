// Content script is “a JavaScript file that runs
// in the context of web pages.”

console.log("Working content scripts");

let para = document.getElementById("priceblock_ourprice");
para.style.cssText = "white: black; background-color: #A1ED8A";
console.log(para.innerHTML)

/*
for (elt of para) {
  //elt.innerHTML = "Pizza";
  elt.style["background-color"] = "#A1ED8A";
  myfunction(elt.innerHTML, "(\$d+.\d{2})");
}
*/
/*
function myfunction(htmlText, re) {
  const regex = RegExp(re, 'g');
  while ((match = regex.exec(htmlText)) != null) {
    console.log("match found at " + match.index);
  }
}
*/
