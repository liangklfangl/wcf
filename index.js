import * as dom from './test/dom';
import * as time from './test/time';
import pulse from './test/pulse';

require('./test/styles.scss');

const UPDATE_INTERVAL = 1000; // milliseconds
const intervalId = window.setInterval(() => {
    dom.writeTextToElement('upTime', time.getElapsedSeconds() + ' seconds');
    dom.writeTextToElement('lastPulse', pulse());
}, UPDATE_INTERVAL);

// Activate Webpack HMR
if (module.hot) {
    module.hot.accept();
    // dispose handler
    module.hot.dispose(() => {
        window.clearInterval(intervalId);
    });
}
