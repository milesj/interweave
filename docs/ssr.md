# Server-side Rendering

Interweave utilizes the DOM to parse and validate HTML, and as such, is not server-side renderable
out of the box. However, this is easily mitigated with [JSDOM](https://github.com/tmpvar/jsdom). To
begin, install JSDOM.

```
yarn add jsdom --dev
// Or
npm install jsdom --save-dev
```

Add instantiate an instance, configured to your liking. Once this instance is configured, you can
then render your React components without much issue (hopefully).

```javascript
import JSDOM from 'jsdom';

global.window = new JSDOM('', { url: 'http://localhost' });
global.document = global.window.document;
```
