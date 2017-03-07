'use strict';

module.exports = {
		plugins: [
		// require('precss')({}),
		require('autoprefixer')({
				browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
				//browsers (array): list of browsers query (like last 2 version), which are supported in 
				//your project. We recommend to use browserslist config or browserslist key in package.json, 
				//rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
				cascade: true,
				//then beatified as follows with right indent
				//-webkit-transform: rotate(45deg);
				//        transform: rotate(45deg); 
				add: false,
				//Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
				remove: false,
				//By default, Autoprefixer also removes outdated prefixes.
				//You can disable this behavior with the remove: false option. 
				//If you have no legacy code, this option will make Autoprefixer about 10% faster.  
				support: true,
				//should Autoprefixer add prefixes for @supports parameters.  
				flexbox: true,
				//should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
				//value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
				grid: true
		})]
};