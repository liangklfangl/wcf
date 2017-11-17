let moduleStartTime = getCurrentSeconds();
//(1)得到当前模块加载的时间，是该模块的一个全局变量，首次加载模块的时候获取到,热加载
//   时候会重新赋值
function getCurrentSeconds() {
    return Math.round(new Date().getTime() / 1000);
}
export function getElapsedSeconds() {
    return getCurrentSeconds() - moduleStartTime;
}
//(2)开启HMR，如果添加HotModuleReplacement插件，webpack-dev-server添加--hot
if (module.hot) {
    const data = module.hot.data || {};
    //(3)如果module.hot.dispose将当前的数据放到了data中可以通过module.hot.data获取
    if (data.moduleStartTime)
        moduleStartTime = data.moduleStartTime;
    //(4)我们首次会将当前模块加载的时间传递到热加载后的模块中，从而热加载后的moduleStartTime
    //   会一直是首次加载模块的时间
    module.hot.dispose((data) => {
        data.moduleStartTime = moduleStartTime;
    });
}
