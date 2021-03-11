chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // 注册规则，当且仅当列出的所有条件都满足时，PageStateMatcher 才会匹配网页,即当url为https://www.zybang.com ，即触发执行某个操作（目前只有 ShowPageAction）。
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: '.baidu.com' },
            // pageUrl: {hostEquals: 'www.baidu.com'},
          })
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });


  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log('The color is green.');
  });

});
