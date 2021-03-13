let changeColor = document.getElementById('changeColor');
let baidu = document.getElementById('su');
chrome.storage.sync.get('color', function (data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
  baidu.value = "Baidu";

});