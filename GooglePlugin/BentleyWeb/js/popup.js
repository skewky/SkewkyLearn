let changeColor = document.getElementById('changeColor');
let baidu = document.getElementById('su');
chrome.storage.sync.get('color', function (data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
  var baidu = document.getElementById('su');
  console.log("baidu="+baidu)
  if(baidu) 
    baidu.value = "Baidu";

});
chrome.notifications.create(null, {
	type: 'basic',
	iconUrl: '/images/SkewkyBentleyWeb.png',
	title: '这是标题',
	message: '您刚才点击了自定义右键菜单！'
});