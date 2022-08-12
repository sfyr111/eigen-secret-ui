// var installNode = document.creatElement('div');
// installNode.id = 'my-chrome-extension-installed';
// installNode.style.display = 'none';
// installNode.innerText=JSON.stringify({key: 'value'}); // 把通信的data放到标签的html text里面
// document.body.appendChild(installNode);
import ReactDOM from 'react-dom'
// import ConfluxPortalInpageProvider from '@yqrashawn/conflux-portal-inpage-provider'
// console.log('localmessage')
// console.log(ConfluxPortalInpageProvider)

function Content() {
  return (
    <div>test</div>
  )
}
const app = document.createElement('div')
app.id = 'crx-container'
document.body.appendChild(app)
ReactDOM.render(<Content />,app)
console.log('content-script')

window.addEventListener("message", function(event) {
  if (event.source != window) {
    return;
  }
  console.log('event:', event)
  console.log('chrome:',chrome)
  if (event.data.type 
    && (event.data.type == "FROM_PAGE")) {
    chrome.runtime.sendMessage({
      essential: event.data.essential
    })
  }
  
}, false);
console.log('injectbefore')
injectCustomJs('insert.js', 'body')
console.log('sd')
/*chrome*/
function injectCustomJs(jsPath, tag)
{
    jsPath = jsPath || 'insert.js';
    var node = document.getElementsByTagName(tag)[0];
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.runtime.getURL(jsPath);
    // temp.onload = function()
    // {
    //     this.parentNode.removeChild(this);
    // };
    node.appendChild(temp);//document.head.appendChild
}