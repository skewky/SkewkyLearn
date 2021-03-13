// binder envent  "run_at": "document_start" in manifest
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);

var prodInfos = []
function fireContentLoadedEvent() {

	injectCustomJs("/js/BentleyWebsiteCommon.js")
    injectCustomJs("/js/buildSchedule.js")
	injectCustomCSS("/css/BentleyWebsiteCommon.css")

	console.log("buildSchedule");
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
	keyword = keyword.replaceAll(",", "|");
	keyword = keyword.replaceAll(";", "|");
	var keyarr = keyword.split("|");
	for (var i = 0; i < keyarr.length; i++) {
		var reg = new RegExp(keyarr[i], 'i');
		var regRest = str.match(reg);
		var index = -1; //str.indexOf(keyarr[i]);
		//console.log(str+"====isAnyKeyWordsInStr=----length=="+keyarr.length+"   keyarr[i]="+keyarr[i]+" regRes="+regRest+" index="+index);
		if (regRest || index > -1) {
			return true;
		}
	}
	//console.log(str + "==isAnyKeyWordsInStr-------Not=====" + keyword);
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
	//console.log(document.body.childElementCount+"first"+document.body.childNodes.length+"Child=="+document.body.firstChild.innerHTML)
	if (currentDiv)
		currentDiv.parentNode.insertBefore(myDiv, currentDiv);
	else
		document.body.appendChild(myDiv, document.body.firstChild)
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

function getFilterValue(filterNameId) {
	var myInput = document.getElementById(filterNameId);
	if (myInput) return myInput.value
	else return ""
}
//#endregion


function initBuildSchedule() {
	createHeaderTopDiv()
	redrawListTable();

}

function createHeaderTopDiv() {
	var FilterDiv = getOrCreateMyDiv("cimfilterDiv","ddlProductList");
	var divInerString = "<table class='PRGFormText BwcBgColor'>"	//main table start
	divInerString += "<tr><td>"		//blank space TR start
	divInerString += "<div><p /> </div>  "
	divInerString += "</td></tr>"	//blank space TR end

	divInerString += "<tr><td>Search: "     //filter TR start
	divInerString += "<input type='text' name='prodProduct' id='prodProduct' value='' placeholder='Product' onkeyup='redrawListTable()'>"
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
	console.log("Call redrawTable=");
	var listDiv = getOrCreateMyDiv("cimListDiv");
    prodInfos = getAllProducts()
	searchProdInfos = getFilterProdinfos()
	var divInerString = "<table class='BwcListtable PRGFormText'>"
    if (searchProdInfos.length == 0) {
        divInerString += "<tr><td><font color='red'>No Products were found! Please change your search keyword.</font></td></tr>"       
    }
	for (var i = 0; i < searchProdInfos.length; i++) {
		var bgcolor = "DBE5F1"
		var index = "(" + searchProdInfos.length + ")"
		if (i > -1) {
			bgcolor = i % 2 == 0 ? "DBE6E1" : "F3F3F3"
			prodInfo = searchProdInfos[i];
			index = i + 1
		}
		divInerString += getProdInforStr(prodInfo, index, bgcolor);
	}

	divInerString += "</table>"
	listDiv.innerHTML = divInerString;
}

function getProdInforStr(prodInfo, index) {
	var str = "<tr>"
	str += "<Td >" + index + "</td>";
	str += "<Td class='BlackControlLabelZeroPad BlueText PRGFormText'>" + prodInfo.name + "</td>";
	str += "<Td>" + prodInfo.id + "</td>";
	str += "</tr>";
	return str
}

//<select name="ddlProductList" onclick="javascript:WebForm_DoAsyncCallback('frmMain',document.getElementById('ddlProductList').value,ShowReqParamsDetailHandler,document.getElementById('prgParameter_requiredParametersList'),ShowReqParamsErrorHandler); if(PreviousBuildRequestDialog(document.getElementById('ddlProductList').value))__doPostBack('ddlProductList','')" language="javascript" id="ddlProductList" class="PRGDropDownList">


//</select>
function getAllProducts() {
	var prodList = []
    var selectObj = document.getElementById('ddlProductList');
	var allOptions = selectObj.childNodes;
	for (var i = 0; i < allOptions.length; i++) {
		if (!allOptions[i].value) continue;

        var prodInfo = {id:'1012',name:'bentley'}
        prodInfo.id = allOptions[i].value
        prodInfo.name = allOptions[i].innerHTML
		var msg = "productName=" + prodInfo.name +
			"\t buildid=" + prodInfo.id
		//" Action="+prodInfo.action
		//console.log(msg);
		prodList.push(prodInfo);
	}
    console.log("src-length：" + prodList.length);
	return prodList;
}

function getFilterProdinfos() {
	var searchProdinfos = []
	console.log("AllProducts-length=" + prodInfos.length);
	var nameFilter = getFilterValue("prodProduct")
	for (var i = 0; i < prodInfos.length; i++) {
		var prodInfo = prodInfos[i]
		//console.log("prodInfo=" + prodInfo);
		//console.log(" nameFilter="+nameFilter+" versionFilter="+versionFilter+" stampFilter="+stampFilter+" timeFilter="+timeFilter+" StatsFilter="+StatsFilter);
		if (isStrMatchSearchKeyWords(prodInfo.name, nameFilter)) {
			searchProdinfos.push(prodInfo);
			var msg = i + " name=" + prodInfo.name +
				"\t id=" + prodInfo.id
			//" Action="+prodInfo.action
			//console.log(msg);
		}
	}
    var selectObj = document.getElementById('ddlProductList');
	var allOptions = selectObj.childNodes;
    for (var i = 0; i < allOptions.length; i++) {
		if (!allOptions[i].value) continue;
        if (isStrMatchSearchKeyWords(allOptions[i].innerHTML, nameFilter)) {
            allOptions[i].removeAttribute("hidden");
        }
        else{
            allOptions[i].setAttribute("hidden",true)
        }
    }
	//console.log("searchProdinfos-length：" + searchProdinfos.length);
	return searchProdinfos;
}
/* //在点击网页中确定按钮调用SetReturnValue
function SetReturnValue(id)
{
    var rlt = "我想返回的数值";
    window.returnValue = rlt;//ie之类浏览器
    if(opener != null && opener != 'undefined')
    {
        window.opener.returnValue = rlt; //chrome有些版本有问题, 所以在子窗口同时修改了父窗口的ReturnValue(能执行showModalDialog的chrome)
        if(window.opener.showModalDialogCallback)
            window.opener.showModalDialogCallback(rlt);
    }
    window.close();
}

myShowModalDialog("http://test.com/test.html", 500, 4000, function(resv){
    alert(resv);//原窗口关闭处理流程
});
function myShowModalDialog(url, width, height, callback)
{
    if(window.showModalDialog)
    {
        if(callback)
        {
            var rlt = showModalDialog(url, '', 'resizable:no;scroll:no;status:no;center:yes;help:no;dialogWidth:' + width + ' px;dialogHeight:' + height + ' px');
            if(rlt)
                return callback(rlt);
            else
            {
                callback(window.returnValue);
            }
        }
        else
            showModalDialog(url, '', 'resizable:no;scroll:no;status:no;center:yes;help:no;dialogWidth:' + width + ' px;dialogHeight:' + height + ' px');
    }
    else
    {
        if(callback)
            window.showModalDialogCallback = callback;
        var top = (window.screen.availHeight-30-height)/2; //获得窗口的垂直位置;
        var left = (window.screen.availWidth-10-width)/2; //获得窗口的水平位置;
        var winOption = "top="+top+",left="+left+",height="+height+",width="+width+",resizable=no,scrollbars=no,status=no,toolbar=no,location=no,directories=no,menubar=no,help=no";
        window.open(url,window, winOption);
    }
}
function MyPreviousBuildRequestDialog(oValue)
{
	var retval="false";
	retval = window.showModalDialog('http://prgsrv.bentley.com/dialogHost.asp?LoadPage=/WebDialogs/PreviousBuildRequest.aspx?ProductID=' + oValue + '',window,"dialogHeight:411px; dialogWidth:687px; edge:Sunken; center:Yes; scroll:Yes; help:No; resizable:Yes; status:No;");
	if (retval != 'true')
	{
		return false;
	}
	 else 
	{
		return true;
	}
}
function PreviousBuildRequestDialog(oValue)
{
	var retval="false";
	retval = window.showModalDialog('http://prgsrv.bentley.com/dialogHost.asp?LoadPage=/WebDialogs/PreviousBuildRequest.aspx?ProductID=' + oValue + '',window,"dialogHeight:411px; dialogWidth:687px; edge:Sunken; center:Yes; scroll:Yes; help:No; resizable:Yes; status:No;");
	if (retval != 'true')
	{
		return false;
	}
	 else 
	{
		return true;
	}
} */