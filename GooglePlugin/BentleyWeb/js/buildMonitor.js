// binder "run_at": "document_start" in manifest
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);

function fireContentLoadedEvent() {

	injectCustomJs("/js/buildMonitor.js")
	injectCustomCSS("/css/BentleyWebsiteCommon.css")

	initBuildMonitor()
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

	var currentDiv = document.getElementById("frmMain");
	if (currentDiv)
		document.body.insertBefore(myDiv, currentDiv);
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
function setFilterValue(filterNameId,newValue) {
	var myInput = document.getElementById(filterNameId);
	if (myInput) myInput.value = newValue
}
function resetFliter()
{
	//it should be read from option settions, on developing....
	setFilterValue('prodProduct','')
	setFilterValue('prodVersion','')
	setFilterValue('prodStamp','cim,orlcn,odcnl')
	setFilterValue('prodStats','')
	setFilterValue('prodStartTime','')
	setFilterValue('prodListRows','15')
	setFilterValue('prodUseRegex',true)
	redrawListTable()
}
//#endregion

//#region BuildMonitor

function initBuildMonitor() {
	createHeaderTopDiv()
	redrawListTable();
}

function createHeaderTopDiv() {
	var FilterDiv = getOrCreateMyDiv("cimfilterDiv");
	var divInerString = "<table class='PRGFormText BwcBgColor'>"	//main table start
	divInerString += "<tr><td>"		//blank space TR start
	divInerString += "<div><p />&nbsp</div>  "
	divInerString += "</td></tr>"	//blank space TR end

	divInerString += "<tr class='BwcBgColor'><td>Search: "     //filter TR start
	divInerString += "<input type='text' style='width:35%' name='prodProduct' id='prodProduct' value='' placeholder='Product' onkeyup='redrawListTable()'>"
	divInerString += "<input type='text' style='width:10%'  name='prodVersion' id='prodVersion' value='' placeholder='Version' onkeyup='redrawListTable()'>"
	divInerString += "<input type='text' style='width:15%'  name='prodStamp' id='prodStamp' value='cim,orlcn,odcnl' placeholder='Stamp' onkeyup='redrawListTable()'>"
	divInerString += "<input type='text' style='width:10%'  name='prodStats' id='prodStats' value='' placeholder='Stats' onkeyup='redrawListTable()'>"
	divInerString += "<input type='text' style='width:10%'  name='prodStartTime' id='prodStartTime' value='' placeholder='StartTime' onkeyup='redrawListTable()'>"
	divInerString += "<input type='number' style='width:50px' id='prodListRows' value='15' oninput='if(value.length>3)value=value.slice(0,3)' onkeyup='redrawListTable()'>"
	divInerString += "<input type='checkbox' id='prodUseRegex' onclick='redrawListTable()'>Regex"
	divInerString += "<button type='button' onclick='resetFliter()'>Reset</button>"
	divInerString += "</td></tr>"	//filter TR end

	divInerString += "<tr><td class='CenteredBlock'>"		//list TR start
	divInerString += "<div id='cimListDiv'>list</div>"
	divInerString += "</td></tr>"	//list TR end

	divInerString += "<tr><td class='CenteredBlock'>"		//Contact TR start
	divInerString += "Any questions please contact <a href='mailto:bin.zhou@bentley.com?subject=BentleyWebsiteOptimize&body=Hello'>Bin.Zhou</a>"
	divInerString += "</td></tr>"	//Contact TR end

	divInerString += "<tr><td>"		//blank space TR start
	divInerString += "<div><p />&nbsp</div>  "
	divInerString += "</td></tr>"	//blank space TR end

	divInerString += "</table>"		//main table end


	FilterDiv.innerHTML = divInerString;
}

function redrawListTable() {
	var listDiv = getOrCreateMyDiv("cimListDiv");
	var prodInfos = getAllProductStats();
	searchProdInfos = getFilterProdinfos(prodInfos)
	var curTime = new Date()
	console.log(curTime.toLocaleTimeString() + "  RedrawTable Products="+ searchProdInfos.length+"/"+prodInfos.length)
	var divInerString = "<table name=cimlistTable class='BwcListtable PRGFormText'>"
	var maxShowCount = getFilterValue("prodListRows")
	var count =  searchProdInfos.length>=maxShowCount?maxShowCount:searchProdInfos.length
	for (var i = -1; i < count; i++) {
		var prodInfo = {
			name: "Bentley Product Name " + "(" + searchProdInfos.length + "/" + prodInfos.length + ")",
			version: "Build Version",
			stamp: "Checkout Stamp",
			time: "LocalTime",
			stat: "Status",
			log: "LogFiles",
			action: "Actions",
		};
		var isTh = true;
		if (searchProdInfos.length == 0) {
			prodInfo.version = ""
			prodInfo.stamp = ""
			prodInfo.time = "<font color='red' size=+1>No items were found! Please change your search keyword.</font>"
			prodInfo.stat = ""
			prodInfo.log = ""
			prodInfo.action = ""
		}
		var index = "(" + searchProdInfos.length + ")"
		if (i > -1) {
			prodInfo = searchProdInfos[i];
			index = i + 1
			isTh = false
		}
		divInerString += getProdInforStr(prodInfo, index, isTh);
	}
	if (searchProdInfos.length>maxShowCount)
	{
		var sumProd = {
			name: "",
			version: "",
			stamp: "",
			time: "",
			stat: "",
			log: "",
			action: "",
		};
		sumProd.name = "-------There are [ "+searchProdInfos.length+" ] results, only listed first "+maxShowCount
		console.log(sumProd.name)
		divInerString += getProdInforStr(sumProd,"",true);
	}

	divInerString += "</table>"

	listDiv.innerHTML = divInerString;
}


function getProdInforStr(prodInfo, index, isTh) {
	isTh = isTh||false
	var sTag = isTh?"<th class='BlackControlLabelZeroPad BlueText PRGFormText'>":"<td>";
	var namesTag = isTh?sTag:"<td class='BlackControlLabelZeroPad BlueText PRGFormText'>" 
	var eTag = isTh?"</th>":"</td>";
	var str = "<tr>";
	str += sTag + index + eTag;
	str += namesTag + prodInfo.name + eTag;
	str += sTag + prodInfo.version + eTag;
	str += sTag + prodInfo.stamp + eTag;
	str += sTag + prodInfo.stat + eTag;
	str += sTag + prodInfo.time + eTag;
	str += sTag + prodInfo.log + eTag;
	str += sTag+ prodInfo.action + eTag;
	str += "</th>";
	return str
}


function getFilterProdinfos(prodInfos) {
	var searchProdinfos = []
	for (var i = 0; i < prodInfos.length; i++) {
		var prodInfo = prodInfos[i]
		var nameFilter = getFilterValue("prodProduct")
		var versionFilter = getFilterValue("prodVersion")
		var stampFilter = getFilterValue("prodStamp")
		var timeFilter = getFilterValue("prodStartTime")
		var StatsFilter = getFilterValue("prodStats")
		if (isStrMatchSearchKeyWords(prodInfo.name, nameFilter) &&
			isStrMatchSearchKeyWords(prodInfo.version, versionFilter) &&
			isStrMatchSearchKeyWords(prodInfo.stamp, stampFilter) &&
			isStrMatchSearchKeyWords(prodInfo.time, timeFilter) &&
			isStrMatchSearchKeyWords(prodInfo.stat, StatsFilter)) {
			searchProdinfos.push(prodInfo);
			var msg = i + " name=" + prodInfo.name +
				"\t version=" + prodInfo.version +
				"\t stamp=" + prodInfo.stamp +
				"\t time=" + prodInfo.time +
				"\t stat=" + prodInfo.stat +
				"\t log=" + prodInfo.log//+
			//" Action="+prodInfo.action
			//console.log(msg);
		}
	}

	hiddenDivsBySearchedProdList(searchProdinfos)
	return searchProdinfos;
}
function hiddenDivsBySearchedProdList(searchProdinfos) {
	var alldivs = getClassObj('ZeroPadding ClearBoth FullWidth')
	console.log("alldivs.lenght = "+ alldivs.length);
	for (var i = 0; i < alldivs.length; i++) {
		var prodInfo = getProductStats(alldivs[i])
		if(prodNameInsearchProdInfos(prodInfo.name,searchProdinfos))
		{
			//console.log("visible = "+ prodInfo.name);
			alldivs[i].parentNode.parentNode.style.display="";//显示
		}	
		else
		{
			//console.log("hidden = "+prodInfo.name);
			alldivs[i].parentNode.parentNode.style.display="none";//隐藏
		}	
	}
}
function prodNameInsearchProdInfos(prodName,searchProdInfos)
{
	for (var i = 0; i < searchProdInfos.length; i++) {
		if(prodName == searchProdInfos[i].name)
		{
			//console.log(prodName)
			return true;
		}	
	}
	return false;
}
function getAllProductStats() {
	var prodList = []
	var alldivs = getClassObj('ZeroPadding ClearBoth FullWidth')
	var forShow = ""
	for (var i = 0; i < alldivs.length; i++) {
		var prodInfo = getProductStats(alldivs[i])

		var msg = "OutName name=" + prodInfo.name +
			"\t version=" + prodInfo.version +
			"\t stamp=" + prodInfo.stamp +
			"\t time=" + prodInfo.time +
			"\t stat=" + prodInfo.stat +
			"\t log=" + prodInfo.log//+
		//" Action="+prodInfo.action
		//console.log(msg);
		forShow = forShow + alldivs[i].innerHTML;
		prodList.push(prodInfo);
	}
	//console.log("src-length：" + prodList.length);

	return prodList;
}
function getProductStats(prodDiv) {
	var prodInfo = {
		name: "BentleyProduct",
		version: "10.01.01.001",
		stamp: "pp-vancouver",
		time: "202.12.23 12:24:35",
		stat: "setup",
		log: "",
		action: "rebuild",
	};

	//get action
	var actionDiv = getClassObj('RightFloat FormContent RightAlignText', prodDiv);
	if (actionDiv[0]) prodInfo.action = actionDiv[0].innerHTML

	//get name
	var prodNameDiv = getClassObj('PRGFormText FormContent LeftFloat TextIndent', prodDiv);
	if (prodNameDiv[0]) prodInfo.name = prodNameDiv[0].innerHTML

	//get info
	var prodInfoDiv = getClassObj('PRGFormText ClearBoth LeftFloat FullWidth', prodDiv);
	if (prodInfoDiv[0]) prodInfo.version = prodInfoDiv[0].textContent;
	if (prodInfoDiv[1]) prodInfo.stamp = prodInfoDiv[1].textContent;
	if (prodInfoDiv[2]) prodInfo.time = prodInfoDiv[2].textContent;
	if (prodInfoDiv[3]) prodInfo.stat = prodInfoDiv[3].textContent;
	if (prodInfoDiv[4]) prodInfo.log = prodInfoDiv[4].textContent;

	prodInfo.version = prodInfo.version.replace("Version: ", "");
	prodInfo.stamp = prodInfo.stamp.replace("Stamp: ", "");
	prodInfo.time = prodInfo.time.replace("Start Time: ", "");
	prodInfo.stat = prodInfo.stat.replace("Current Status: ", "");
	prodInfo.log = prodInfo.log.replace("LogFile: .\\", "");
	prodInfo.log = prodInfo.log.replace(" (FTP)", "");
	prodInfo.action = prodInfo.action.replaceAll("class=\"EditBuildLink\"", "");
	prodInfo.action = prodInfo.action.replace("<br>", " ");
	prodInfo.action = prodInfo.action.replace("Edit Request", "Edit");
	prodInfo.action = prodInfo.action.replace("Restart Build", "Restart");

	var logText = "  "
	if (prodInfo.log.length > 6)
		logText = prodInfo.log.substr(prodInfo.log.length - 6)
	prodInfo.log = "<a href='\\\\builds.bentley.com\\prgbuilds\\" + prodInfo.log + "'>" + logText + "</a>";

	var msg = " name=" + prodInfo.name +
		"\t version=" + prodInfo.version +
		"\t stamp=" + prodInfo.stamp +
		"\t time=" + prodInfo.time +
		"\t stat=" + prodInfo.stat +
		"\t log=" + prodInfo.log//+
	//" Action="+prodInfo.action
	//console.log (msg);
	return prodInfo;
}

//#endregion