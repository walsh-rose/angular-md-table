export default (ngModule) => {
    require('./pagination.scss');
    require('./mobile').default(ngModule);
    require('./desktop').default(ngModule);
    require('./pagination').default(ngModule);
    require('./pagination.model').default(ngModule);

    /*if(MODE.ON_TTPC_TEST){
        require('./pagination.test')(ngModule);
    }*/

}
