// 绑定这个事件需要在 manifest 中设定 "run_at": "document_start"
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);

function fireContentLoadedEvent () {
    //console.log ("DOMContentLoaded");

    // PUT YOUR CODE HERE.
    //document.body.textContent = "Changed this!
	var baidu=document.getElementById('su');
	if (baidu)
		baidu.value = "Baidu";
	
	prodInfo = getAllProductStats();

	//console.log(forShow);
	//alert(forShow);
	// Checking page title
	
	// 通过追加script脚本修改变量
	var script = document.createElement("script"); 
	script.textContent ="dnshn_maxnum='99999'";
	
	// 追加到head的结尾，复写这个变量的值
	if(document.head){
		document.head.appendChild(script); 
	}

}
function getAllProductStats()
{
	var prodList = []
	var alldivs = getClassObj('ZeroPadding ClearBoth FullWidth')
	var forShow = ""
	for( var i=0;i< alldivs.length;i++ ){
		var prodInfo = {
			    		name:"BentleyProduct",
						version : "10.03.00.003",
						stamp : "pp-vancouver",
						time : "2021.12.23 12:24:35",
						stat : "setup",
						log : "d:/sfsf/sfsdf/sdf/sdf/sdf/sdf",
						action: "rebuild",
					};
		//if(i==0)
		{
			//get action
			var actionDiv = getClassObj('RightFloat FormContent RightAlignText',alldivs[i]);
			if( actionDiv[0]) prodInfo.action = actionDiv[0].innerHTML
			
			//get name
			var prodNameDiv = getClassObj('PRGFormText FormContent LeftFloat TextIndent',alldivs[i]);
			if( prodNameDiv[0]) prodInfo.name = prodNameDiv[0].innerHTML

            //get info
			var prodInfoDiv = getClassObj('PRGFormText ClearBoth LeftFloat FullWidth',alldivs[i]);
			if( prodInfoDiv[0]) prodInfo.version = prodInfoDiv[0].textContent;
			if( prodInfoDiv[1]) prodInfo.stamp = prodInfoDiv[1].textContent;
			if( prodInfoDiv[2]) prodInfo.time =  prodInfoDiv[2].textContent;
			if( prodInfoDiv[3]) prodInfo.stat = prodInfoDiv[3].textContent;
			if( prodInfoDiv[4]) prodInfo.log =  prodInfoDiv[4].textContent;

			prodInfo.version = prodInfo.version.replace("Version: ","");
			prodInfo.stamp = prodInfo.stamp.replace("Stamp: ","");
			prodInfo.time =  prodInfo.time.replace("Start Time: ","");
			prodInfo.stat = prodInfo.stat.replace("Current Status: ","");
			prodInfo.log = prodInfo.log.replace("LogFile: .","");
			prodInfo.log = prodInfo.log.replace(" (FTP)","");
			
			var msg = i+" name="+prodInfo.name+ 
					    "\t version="+prodInfo.version+
						"\t stamp="+prodInfo.stamp+
						"\t time="+prodInfo.time+
						"\t stat="+prodInfo.stat+
						"\t log="+prodInfo.log//+
						//" Action="+prodInfo.action
			console.log (msg);

			var myDiv = document.createElement("myDiv"); 

			var newContent = document.createTextNode("Hi there and greetings!"); 

			myDiv.appendChild(newContent); 

			var currentDiv = document.getElementById("frmMain"); 

			document.body.insertBefore(myDiv, currentDiv); 

			//console.log (i+" name="+prodInfo.name+"\t version="+prodInfo.version+"\t stamp="+prodInfo.stamp+"\t time="+prodInfo.time+"\t stat="+prodInfo.stat+"\t log="+prodInfo.log+" Action="+prodInfo.action);
			
			prodList.push(prodInfo);
		}
		forShow = forShow + alldivs[i].innerHTML;
	}
	return prodList;
}

function getClassObj(className, tag){
    tag = tag||document;
    className = className||'*';
    //console.log ("ClassName="+className);
    //console.log ("Tag="+tag);
    var findarr = [];
    if(tag.getElementsByClassName){
        return tag.getElementsByClassName(className);
    }
	//console.log ("getElementsByClassName faild");
    el = tag.getElementsByTagName(className);
    var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
    for(var i=0; i<el.length; i++){
        if(pattern.test(el[i].className)){
            findarr.push(el[i]);
        }
    }
	return findarr;
}
   
