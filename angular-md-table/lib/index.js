 export default (tableModule) => {
     require('./submodules.js').default(tableModule);
     require('./config').default(tableModule);
 }