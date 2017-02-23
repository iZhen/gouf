
const _ = require('lodash');
const Gouf = require('../lib/gouf');

const app = new Gouf(__dirname);

app.router
  .set('/', 'index')
  .set('/post/:year/:month/:day/:slug', 'post', [
    { year: '2016', month: '12', day: '01', slug: 'post-01' },
    { year: '2016', month: '12', day: '31', slug: 'post-02' },
    { year: '2017', month: '01', day: '01', slug: 'post-03' },
    { year: '2017', month: '01', day: '01', slug: 'post-04' },
  ])
  .set('/page/:index', 'page', ({ index }) => ({ index }), _.map([1, 2, 3, 4, 5], index => ({ index })));

app.generate();
