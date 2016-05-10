export default (tableModule) => {

    tableModule.config(($httpProvider, $logProvider) => {
        $httpProvider.defaults.useXDomain = true;
        $logProvider.debugEnabled(true);
    });
}
