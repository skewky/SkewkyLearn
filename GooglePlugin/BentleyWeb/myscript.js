// 绑定这个事件需要在 manifest 中设定 "run_at": "document_start"
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);

function fireContentLoadedEvent () {
    //console.log ("DOMContentLoaded");

    // PUT YOUR CODE HERE.
    //document.body.textContent = "Changed this!
	 var baidu=document.getElementById('su');
	 baidu.value = "Baidu";
	
	// Checking page title
	
	// 通过追加script脚本修改变量
	var script = document.createElement("script"); 
	script.textContent ="dnshn_maxnum='99999'";
	
	// 追加到head的结尾，复写这个变量的值
	if(document.head){
		document.head.appendChild(script); 
	}

}
