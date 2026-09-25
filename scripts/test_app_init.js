// Test NigerianDraughtsApp instantiation and interactions
global.window = {
  location: { search: '', href: '' },
  localStorage: { getItem: () => null, setItem: () => {} },
  addEventListener: () => {},
  switchRuleset: () => {}
};
global.localStorage = global.window.localStorage;

const elements = {};
function getOrCreate(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      dataset: {},
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      appendChild: function(c) {
        this.children = this.children || [];
        this.children.push(c);
      },
      addEventListener: () => {},
      querySelectorAll: () => [],
      querySelector: () => null,
      innerHTML: '',
      value: ''
    };
  }
  return elements[id];
}

global.document = {
  readyState: 'complete',
  getElementById: (id) => getOrCreate(id),
  querySelectorAll: () => [],
  querySelector: (sel) => getOrCreate(sel),
  createElement: (tag) => ({
    tagName: tag,
    dataset: {},
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    appendChild: () => {},
    addEventListener: () => {}
  }),
  createElementNS: (ns, tag) => ({
    tagName: tag,
    setAttribute: () => {},
    appendChild: () => {}
  }),
  addEventListener: () => {}
};
global.fetch = () => Promise.resolve({ json: () => Promise.resolve({ success: false }) });

try {
  console.log('Importing js/app.js...');
  import('../js/app.js').then(() => {
    console.log('App loaded successfully!');
    if (global.window.app) {
      console.log('window.app instance created!');
      console.log('Board rendered, engine turn:', global.window.app.engine.currentTurn);
      console.log('All legal moves count:', global.window.app.engine.getAllLegalMoves(1).length);
    } else {
      console.log('window.app not created');
    }
  }).catch(err => {
    console.error('CATCH IN IMPORT:', err);
  });
} catch (err) {
  console.error('SYNC CATCH:', err);
}
