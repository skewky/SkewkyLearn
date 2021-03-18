// binder envent  "run_at": "document_start" in manifest
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);

var prodInfos = []
function fireContentLoadedEvent() {

	//injectCustomJs("/js/BentleyWebsiteCommon.js")
    injectCustomJs("/js/Productname.js")
	injectCustomCSS("/css/BentleyWebsiteCommon.css")

	console.log("Productname");
    prodInfos = getAllProducts();
	
    initBuildSchedule()
}
function injectCustomCSS(cssPath)
{
	cssPath = cssPath || '/css/BentleyWebsiteCommon.css';
	var temp = document.createElement('link');
	temp.setAttribute('type', 'text/css');
	temp.setAttribute('rel', 'stylesheet');
	temp.setAttribute('rev', 'stylesheet');
	// get url like：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/cs/inject.css
	temp.href = chrome.extension.getURL(cssPath);
	document.head.appendChild(temp);
}
//#region Base functions
function injectCustomJs(jsPath) {
	jsPath = jsPath || '/js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// get url like：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function () {
		// remove after load.
		//temp.parentNode.removeChild(temp);
	};
	document.head.appendChild(temp);
}
function isUseRegex()
{
	var myInput = document.getElementById("prodUseRegex");
	if (myInput) return myInput.Checked
	else return false
}
function isStrMatchSearchKeyWords(str, keyword) {
	if (keyword == "")
		return true;
	if (isUseRegex())
		return str.match(new RegExp(keyword));

	var keyarr = keyword.split("*");
	for (var i = 0; i < keyarr.length; i++) {
		var keywordInStr = isAnyKeyWordsInStr(str, keyarr[i]);
		if (keywordInStr == false) {
			return false;
		}
	}
	return true;
}
function isAnyKeyWordsInStr(str, keyword) {
	if (keyword == "") {
		return true;
	}
	keyword = keyword.replaceAll(",", "|");
	keyword = keyword.replaceAll(";", "|");
	var keyarr = keyword.split("|");
	for (var i = 0; i < keyarr.length; i++) {
		var index = str.toLowerCase().indexOf(keyarr[i].toLowerCase());
		if (index > -1) {
			return true;
		}
	}
	return false;
}
function getOrCreateMyDiv(id, beforeID) {
	beforeID = beforeID || "frmMain"
	var myDiv = document.getElementById(id);
	if (myDiv) { return myDiv; }

	//create if not exist
	myDiv = document.createElement("Div");
	myDiv.id = id

	var newContent = document.createTextNode("Hi there and greetings!");
	myDiv.appendChild(newContent);

	var currentDiv = document.getElementById(beforeID);
	if (currentDiv)
		currentDiv.parentNode.insertBefore(myDiv, currentDiv);
	else
		document.body.appendChild(myDiv, document.body.firstChild)
	return myDiv;
}

function getClassObj(className, tag) {
	tag = tag || document;
	className = className || '*';
	var findarr = [];
	if (tag.getElementsByClassName) {
		return tag.getElementsByClassName(className);
	}
	el = tag.getElementsByTagName(className);
	var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
	for (var i = 0; i < el.length; i++) {
		if (pattern.test(el[i].className)) {
			findarr.push(el[i]);
		}
	}
	return findarr;
}

function getFilterValue(filterNameId) {
	var myInput = document.getElementById(filterNameId);
	if (myInput) return myInput.value
	else return ""
}
//#endregion


function initBuildSchedule() {
	console.log("InitBuildSchedule")
	createHeaderTopDiv()
	redrawListTable();

}

function createHeaderTopDiv() {
	var FilterDiv = getOrCreateMyDiv("cimfilterDiv","dgrProducts");
	var divInerString = "<table class='PRGFormText BwcBgColor'>"	//main table start
	divInerString += "<tr><td>"		//blank space TR start
	divInerString += "<div><p /> </div>  "
	divInerString += "</td></tr>"	//blank space TR end

	divInerString += "<tr><td>Search: "     //filter TR start
	divInerString += "<input type='text' style='width:60%'  name='prodProduct' id='prodProduct' value='openr*for china' placeholder='Product' onkeyup='redrawListTable()'>"
	divInerString += "<input type='number' style='width:50px' id='prodListRows' value='15' oninput='if(value.length>3)value=value.slice(0,3)' onkeyup='redrawListTable()'>"
	divInerString += "<input type='checkbox' id='prodUseRegex' onclick='redrawListTable()'>Regex"
	divInerString += "</td></tr>"	//filter TR end

	divInerString += "<tr><td class='CenteredBlock'>"		//list TR start
	divInerString += "<div id='cimListDiv'>list</div>"
	divInerString += "</td></tr>"	//list TR end

	divInerString += "<tr><td class='CenteredBlock'>"		//Contact TR start
	divInerString += "Any questions please contact <a href='mailto:bin.zhou@bentley.com?subject=BentleyWebsiteOptimize&body=Hello'>Bin.Zhou</a>"
	divInerString += "</td></tr>"	//Contact TR end

	divInerString += "<tr><td>"		//blank space TR start
	divInerString += "<div><p /> </div>  "
	divInerString += "</td></tr>"	//blank space TR end

	divInerString += "</table>"		//main table end

	FilterDiv.innerHTML = divInerString;
}
function redrawListTable() {
	var listDiv = getOrCreateMyDiv("cimListDiv");
    var res = getAllProducts()
    prodInfos =res.allRes
	searchProdInfos = res.filterRes
	var curTime = new Date()
	console.log(curTime.toLocaleTimeString() + "  RedrawTable Products="+ searchProdInfos.length+"/"+prodInfos.length)
	var divInerString = "<table class='BwcListtable PRGFormText'>"
    if (searchProdInfos.length == 0) {
        divInerString += "<tr><td><font color='red'>No Products were found! Please change your search keyword.</font></td></tr>"       
    }
	var maxShowCount = getFilterValue("prodListRows")
	var count =  searchProdInfos.length>=maxShowCount?maxShowCount:searchProdInfos.length
	for (var i = 0; i < count; i++) {
		var index = "(" + searchProdInfos.length + ")"
		if (i > -1) {
			prodInfo = searchProdInfos[i];
			index = i + 1
		}
		divInerString += getProdInforStr(prodInfo, index);
	}
	if (searchProdInfos.length>maxShowCount)
		divInerString += getProdInforStr({id:"",name:"-------There are [ "+searchProdInfos.length+" ] results, only listed first "+maxShowCount,abbr:"",dirName:""}, "");
	divInerString += "</table>"
	listDiv.innerHTML = divInerString;
}

function getProdInforStr(prodInfo, index) {
	var str = "<tr>"
	str += "<Td >" + index + "</td>";
	str += "<Td class='BlackControlLabelZeroPad BlueText PRGFormText'>" + prodInfo.name + "</td>";
	str += "<Td>" + prodInfo.abbr + "</td>";
	str += "<Td>" + prodInfo.dirName + "</td>";
	str += "</tr>";
	return str
}

function getAllProducts() {
	var prodList = []
    var searchProdinfos = []
    var allTrs = document.getElementById("dgrProducts").getElementsByTagName("tr");
    var nameFilter = getFilterValue("prodProduct")
	var maxShowCount = getFilterValue("prodListRows")
	for (var i = 1; i < allTrs.length; i++) {
        var prodInfo = {id:'1012',
                        name:'bentley',
                        abbr:'mstn',
                        dirName:'Mstnplatform'};

        prodInfo.id = allTrs[i].childNodes[1].innerHTML
        prodInfo.name = allTrs[i].childNodes[2].innerHTML
        prodInfo.abbr = allTrs[i].childNodes[4].innerHTML
        prodInfo.dirName = allTrs[i].childNodes[5].innerHTML
                                
        allTrs[i].setAttribute("hidden",true)        
        if (isStrMatchSearchKeyWords(prodInfo.name, nameFilter)) {
            searchProdinfos.push(prodInfo);
            if (searchProdinfos.length<maxShowCount)
                allTrs[i].removeAttribute("hidden");
        }

		var msg = "productName=" + prodInfo.name +
			"\t buildid=" + prodInfo.id
		//" Action="+prodInfo.action
		//console.log(msg);
		prodList.push(prodInfo);
	}
    return {allRes:prodList, filterRes:searchProdinfos};
}
