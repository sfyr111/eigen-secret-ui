// import LocalMessageDuplexStream from 'post-message-stream'
import ConfluxPortalInpageProvider from '@yqrashawn/conflux-portal-inpage-provider'
console.log('public insert2')
console.log(ConfluxPortalInpageProvider)
// // function injectScript(content) {
// //   try {
// //     const container = document.head || document.documentElement;
// //     const scriptTag = document.createElement('script');
// //     scriptTag.setAttribute('async', 'false');
// //     scriptTag.setAttribute('type', 'text/javascript')
// //     console.log(chrome)
// //     scriptTag.setAttribute('src', chrome.runtime.getURL('inpage.js'));
// //     container.insertBefore(scriptTag, container.children[0]);
// //     container.removeChild(scriptTag);
// //   } catch (error) {
// //     console.error('Provider injection failed.', error);
// //   }
// // }
// // injectScript()

// // function parseEssentialDetails() {
// //   let main = {}
// //   main.performance = JSON.parse(JSON.stringify(window.performance)) || null
// //   return main
// // }
// // let essential = parseEssentialDetails()
// //   console.log("insert:", essential)
// //   window.postMessage({
// //     type: 'FROM_PAGE',
// //     essential
// //   })


// const metamaskStream = new LocalMessageDuplexStream({
//   name: 'eigen-insert',
//   target: 'eigen-contentscript',
// })

// // compose the inpage provider
// const inpageProvider = new ConfluxPortalInpageProvider(metamaskStream)

// // set a high max listener count to avoid unnecesary warnings
// inpageProvider.setMaxListeners(100)

// const proxiedInpageProvider = new Proxy(inpageProvider, {
//   // straight up lie that we deleted the property so that it doesnt
//   // throw an error in strict mode
//   deleteProperty: () => true,
// })

// window.eigenWallet = proxiedInpageProvider
// // setInterval(() => {
// //   let essential = parseEssentialDetails()
// //   console.log(essential)
// //   window.postMessage({
// //     type: 'FROM_PAGE',
// //     essential
// //   })
// // }, 500)