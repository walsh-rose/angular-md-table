
export default (ngModule) => {

    require('./action').default(ngModule);
    require('./actions').default(ngModule);
}
