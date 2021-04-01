// binder envent  "run_at": "document_start" in manifest
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
var pGuid
var pPath
var prodInfos=[]
function fireContentLoadedEvent() {

	//injectCustomJs("/js/BentleyWebsiteCommon.js")
    injectCustomJs("/js/ppjenkinmstr.js")
	injectCustomCSS("/css/BentleyWebsiteCommon.css")

	console.log("ppjenkinmstr");
    initPPjenkinmstr();

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
function initPPjenkinmstr()
{
    var mainDiv =  document.getElementById("main-panel")
    var pramTable = getClassObj("parameters", mainDiv)
    pGuid = pramTable[0]
    var allPs = document.getElementsByTagName("p")
    console.log(allPs.length)       
    for(var i = 0; i < allPs.length; i++)
    {
        console.log(allPs[i])
        console.log(allPs[i].innerHTML)
        if (allPs[i].innerHTML == "This build requires parameters:")
            allPs[i].innerHTML = "This build requires parameters: <div id=cimfilterDiv width=100%/>"
    }
    var inputs = document.getElementsByClassName("setting-input")
    inputs[0].setAttribute("id", "CIMPid")        
    inputs[1].setAttribute("id", "CIMPname")        

    prodInfos.push({id:"3136",name:"OpenRailChina",fullname:"OpenRailDesignerForChina"})
    prodInfos.push({id:"3211",name:"OpenRailUltimateChina",fullname:"OpenRailDesignerUltimateForChina"})
    prodInfos.push({id:"3216",name:"OpenRoadsChina",fullname:"OpenRoadsDesignerForChina"})
    prodInfos.push({id:"3210",name:"OpenRoadsUltimateChina",fullname:"OpenRoadsDesignerUltimateForChina"})

    createHeaderTopDiv()
}

//#endregion
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
function createHeaderTopDiv() {
	var FilterDiv = getOrCreateMyDiv("cimfilterDiv");
	var divInerString = "<table class='PRGFormText BwcBgColor' width=100% >"	//main table start
	divInerString += "<tr><td>"		//blank space TR start
	divInerString += "<div><p /> </div>  "
	divInerString += "</td></tr>"	//blank space TR end

	divInerString += "<tr><td> Product:   "     //filter TR start
	divInerString += getSelectStr()
	divInerString += "Version: <input type='text' name='prodVersion' id='prodVersion' value='10.09.00.09' placeholder='10.09.00.01' onkeyup='reFillTable()'>"
	divInerString += "</td></tr>"	//filter TR end

	divInerString += "<tr><td class='CenteredBlock'>"		//Contact TR start
	divInerString += "Any questions please contact <a href='mailto:bin.zhou@bentley.com?subject=BentleyWebsiteOptimize&body=Hello'>Bin.Zhou</a>"
	divInerString += "</td></tr>"	//Contact TR end

	divInerString += "<tr><td>"		//blank space TR start
	divInerString += "<div><p /> </div>  "
	divInerString += "</td></tr>"	//blank space TR end

	divInerString += "</table>"		//main table end

	FilterDiv.innerHTML = divInerString;
}
function getSelectStr()
{
    var divInerString = "<Select id=SelectProduct onchange='reFillTable()'>"
    for(var i=0;i<prodInfos.length;i++)
	    divInerString += "<Option value="+prodInfos[i].id+" fullname="+prodInfos[i].fullname+">"+prodInfos[i].name+"</Option>"
	divInerString += "</Select>"
	return divInerString
}
function reFillTable() {
    var myselect =  document.getElementById("SelectProduct")
    var iVersion =  document.getElementById("prodVersion")
    var pVersion = iVersion.value
    var index = myselect.selectedIndex
    pid = myselect.options[index].value;
    pName = myselect.options[index].text;
    pFullName = myselect.options[index].getAttribute("fullname");
    
    console.log("pid= "+pid+"pName="+pName)
    console.log(prodInfos[index])
    pGuid =   document.getElementById("CIMPid")
    pPath = document.getElementById("CIMPname")

    var verArr = getFormattedVerions(pVersion)
    var majVersion = "v"+verArr[0]+verArr[1]
    var shortVersion = verArr[0]+verArr[1]+verArr[2]+verArr[3]
    var lastVnum = verArr[3]
    if(parseInt(lastVnum)<100)
        lastVnum ="0"+ lastVnum
    var dotVersion = verArr[0]+"."+verArr[1]+"."+verArr[2]+"."+lastVnum
    var FullPath = "\\\\builds.bentley.com\\prgbuilds-readonly\\intel\\"+ majVersion + "\\"+ pFullName + "\\" +shortVersion + "en1\\product\\Setup_" + pName +"x64_"+ dotVersion +".exe"
                     //builds.bentley.com\\prgbuilds-readonly\\intel\v1009\openroadsdesignerforchina\10090007en1\product\Setup_OpenRoadsChinax64_10.09.00.007.exe
    pGuid.value = pid
    pPath.value = FullPath
}
function getFormattedVerions(sVersion)
{
    sVersion = sVersion.replaceAll("-",".")
    var verArr = sVersion.split(".");
    while (verArr.length<4)
        verArr.push("0")
    verArr.splice(5)
    for(var i=0;i<verArr.length;i++)
        if(parseInt(verArr[i])<10)
            verArr[i]="0"+parseInt(verArr[i])
    return verArr
}

