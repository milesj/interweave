
function parseHtmlWithFragment(string) {
  const doc = document.createDocumentFragment();
  const div = document.createElement('div');

  div.innerHTML = string;
  doc.appendChild(div);

  console.log('createDocumentFragment', doc);
}

function parseHtmlWithDomParser(string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(string, 'text/html');

  console.log('DOMParser', doc);
}

function parseHtmlWithXmlDomParser(string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString('<root>' + string + '</root>', 'application/xml');

  console.log('DOMParser:XML', doc);
}

function parseHtmlWithDocImpl(string) {
  const doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
  const body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');

  doc.documentElement.appendChild(body);
  body.innerHTML = string;

  console.log('createDocument', doc);
}

function parseHtmlWithHtmlImpl(string) {
  const doc = document.implementation.createHTMLDocument('Foo');

  doc.body.innerHTML = string;

  console.log('createHTMLDocument', doc);
}