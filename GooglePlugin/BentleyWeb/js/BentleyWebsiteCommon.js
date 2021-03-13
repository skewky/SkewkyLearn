
// #region Base Common Functions
function injectCustomCSS(cssPath)
{
	cssPath = cssPath || 'css/BentleyWebsiteCommon.css';
	var temp = document.createElement('link');
	temp.setAttribute('type', 'text/css');
	temp.setAttribute('rel', 'stylesheet');
	temp.setAttribute('rev', 'stylesheet');
	// get url like：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/cs/inject.css
	temp.href = chrome.extension.getURL(cssPath);
	document.head.appendChild(temp);
}

function createHeadTablesDiv() {
	var FilterDiv = getOrCreateMyDiv("cimHeadTableDiv");
	var divInerString = "<table class='PRGFormText'>"	//main table start
	divInerString += "<tr><td>"		//blank space TR start
    divInerString += "<div><p /> </div>  "
    divInerString += "</td></tr>"	//blank space TR end

    divInerString += "<tr><td>"
    divInerString += "<div id='cimFilterDiv'>Search</div>"    
	divInerString += "</td></tr>"	//filter TR end

	divInerString += "<tr><td>"		//list TR start
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


function getOrCreateMyDiv(id,beforeID) {
    beforeID = beforeID||"frmMain"
	var myDiv = document.getElementById(id);
	if (myDiv) {
		console.log("==FoundMyDiv=====" + myDiv.innerHTML);
		return myDiv;
	}
	var myDiv = document.createElement("Div");
	myDiv.id = id
	var newContent = document.createTextNode("Hi there and greetings!");
	myDiv.appendChild(newContent);

	var currentDiv = document.getElementById(beforeID);
	console.log("==CreateMyDiv=====" + myDiv.innerHTML);
	document.body.insertBefore(myDiv, currentDiv);

	return myDiv;

}

function getClassObj(className, tag) {
	tag = tag || document;
	className = className || '*';
	//console.log ("ClassName="+className);
	//console.log ("Tag="+tag);
	var findarr = [];
	if (tag.getElementsByClassName) {
		return tag.getElementsByClassName(className);
	}
	//console.log ("getElementsByClassName faild");
	el = tag.getElementsByTagName(className);
	var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
	for (var i = 0; i < el.length; i++) {
		if (pattern.test(el[i].className)) {
			findarr.push(el[i]);
		}
	}
	return findarr;
}

function isStrMatchSearchKeyWords(str, keyword) {
	if (keyword == "")
		return true;
	var keyarr = keyword.split(" ");
	//console.log(str+" --isStrMatchSearchKeyWords--------------"+ keyword+"------------keyarr.length----  "+ keyarr.length);
	for (var i = 0; i < keyarr.length; i++) {
		var keywordInStr = isAnyKeyWordsInStr(str, keyarr[i]);
		//console.log(str+" --isStrMatchSearchKeyWords---------keyarr.lenght-----"+ keyarr.length+"--"+ keyarr[i]+"--result-"+ keywordInStr);
		if (keywordInStr == false) {
			return false;
		}
	}
	//console.log(str+" --isStrMatchSearchKeyWords----Match----------"+ keyword);	
	return true;
}
function isAnyKeyWordsInStr(str, keyword) {
	if (keyword == "") {
		//console.log(str+"==isAnyKeyWordsInStr-------nullkeyworkd=="+keyword);			
		return true;
	}
	keyword = keyword.replaceAll(",","|");
	keyword = keyword.replaceAll(";","|");
	var keyarr = keyword.split("|");
	for (var i = 0; i < keyarr.length; i++) {
		var reg = new RegExp(keyarr[i], 'i');
		var regRest = str.match(reg);
		var index = str.indexOf(keyarr[i]);
		//console.log(str+"====isAnyKeyWordsInStr=----length=="+keyarr.length+"   keyarr[i]="+keyarr[i]+" regRes="+regRest+" index="+index);
		if (regRest || index > -1) {
			return true;
		}
	}
	//console.log(str + "==isAnyKeyWordsInStr-------Not=====" + keyword);
	return false;
}
// #endregion

// #region Monitor Functions
function initMonitor()
{
    createHeadTablesDiv()
    createFilterTable()
    reDrawList() 
}
function createFilterTable()
{
    var myDiv = getOrCreateMyDiv("cimFilterDiv");
    var divInerString = "Search: "     //filter TR start
    divInerString += "<input type='text' name='prodProduct' id='prodProduct' value='' placeholder='Product' onkeyup='redrawTable()'>"
	divInerString += "<input type='text' name='prodVersion' id='prodVersion' value='' placeholder='Version' onkeyup='redrawTable()'>"
	divInerString += "<input type='text' name='prodStamp' id='prodStamp' value='cim,orlcn,odcnl' placeholder='Stamp' onkeyup='redrawTable()'>"
	divInerString += "<input type='text' name='prodStats' id='prodStats' value='' placeholder='Stats' onkeyup='redrawTable()'>"
	divInerString += "<input type='text' name='prodStartTime' id='prodStartTime' value='' placeholder='StartTime' onkeyup='redrawTable()'>"
	myDiv.innerHTML = divInerString;
}
function reDrawList() {
	console.log("Call redrawTable=");
	var listDiv = getOrCreateMyDiv("cimListDiv");
	var prodInfos = getAllProductStats();
	searchProdInfos = getFilterProdinfos()
	var divInerString = "<table style='border:0px solid #ccc' bgcolor='DBE5F1'>"
	for (var i = -1; i < searchProdInfos.length; i++) {
		var prodInfo = {
			name: "Bentley Product Name "+ "("+searchProdInfos.length+"/"+prodInfos.length+")",
			version: "Build Version",
			stamp: "Checkout Stamp",
			time: "LocalTime",
			stat: "Status",
			log: "LogFiles",
			action: "Actions",
		};
		if( searchProdInfos.length ==0)
		{
			prodInfo.version=""
			prodInfo.stamp=""
			prodInfo.time="<font color='red' size=+1>No items were found! Please change your search keyword.</font>"
			prodInfo.stat=""
			prodInfo.log=""
			prodInfo.action=""
		}
		var bgcolor = "DBE5F1"
		var index = "("+searchProdInfos.length+")"
		if(i>-1)
		{
			bgcolor = i % 2 == 0 ? "DBE6E1" : "F3F3F3"
			prodInfo = searchProdInfos[i];
			index = i+1
		}
		divInerString += getProdInforStr(prodInfo,index, bgcolor);
	}
	
	divInerString += "</table>"

	listDiv.innerHTML = divInerString;
}

function getProdInforStr(prodInfo, index, bgcolor) {
	var str = "<tr class='PRGFormText' bgcolor='" + bgcolor + "'>"
	str += "<Td class='PRGFormText' >" + index + "</td>";
	str += "<Td class='BlackControlLabelZeroPad BlueText PRGFormText'>" + prodInfo.name + "</td>";
	str += "<Td class='PRGFormText' >" + prodInfo.version + "</td>";
	str += "<Td class='PRGFormText'>" + prodInfo.stamp + "</td>";
	str += "<Td>" + prodInfo.stat + "</td>";
	str += "<Td>" + prodInfo.time + "</td>";
	str += "<Td>" + prodInfo.log + "</td>";
	str += "<Td>" + prodInfo.action + "</td>";
	str += "</tr>";
	return str
}

function getFilterValue(filterNameID) {
	var myInput = document.getElementById(filterNameID);
	if (myInput) 
		return myInput.value
	else
		return ""
}
function getFilterProdinfos() {
	var searchProdinfos = []
	console.log("AllProducts-length=" + prodInfos.length);
	for (var i = 0; i < prodInfos.length; i++) {
		var prodInfo = prodInfos[i]
		//console.log("prodInfo=" + prodInfo);
		var nameFilter = getFilterValue("prodProduct")
		var versionFilter = getFilterValue("prodVersion")
		var stampFilter = getFilterValue("prodStamp")
		var timeFilter = getFilterValue("prodStartTime")
		var StatsFilter = getFilterValue("prodStats")
		//console.log(" nameFilter="+nameFilter+" versionFilter="+versionFilter+" stampFilter="+stampFilter+" timeFilter="+timeFilter+" StatsFilter="+StatsFilter);
		if (isStrMatchSearchKeyWords(prodInfo.name, nameFilter) &&
			isStrMatchSearchKeyWords(prodInfo.version,  versionFilter) &&
			isStrMatchSearchKeyWords(prodInfo.stamp,  stampFilter) &&
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
	//console.log("searchProdinfos-length：" + searchProdinfos.length);
	return searchProdinfos;
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
	console.log("src-length：" + prodList.length);

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
	if (prodInfo.log.length>6)
		logText = prodInfo.log.substr(prodInfo.log.length-6)
	prodInfo.log = "<a href='\\\\builds.bentley.com\\prgbuilds\\" + prodInfo.log + "'>"+logText+"</a>";

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

//#region Build Schedule

function initBuildSchedule()
{
    createHeadTablesDiv()
}
//#endregion