// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};



let data;


d3.csv("./data/football.csv").then(function(d) {
    data = d;
    setBar();
    setScatter();
    setlollipop('both');

});

function sortData(data, comparator, examples) {
    return data.sort(comparator).slice(0, examples);
}
