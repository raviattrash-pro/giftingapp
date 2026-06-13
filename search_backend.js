const fs = require('fs');
const path = require('path');
function search(dir, queries) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      search(p, queries);
    } else if (p.endsWith('.java') || p.endsWith('.xml') || p.endsWith('.properties') || p.endsWith('.js')) {
      const content = fs.readFileSync(p, 'utf-8');
      queries.forEach(q => {
        if (content.toLowerCase().includes(q.toLowerCase())) {
          console.log(p + ': ' + q);
        }
      });
    }
  });
}
search('d:/corporategifting/backend/src', ['delivery', 'rapido', 'porter', 'coupon', 'category', 'flower', 'admin']);
