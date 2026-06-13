const fs = require('fs');
const path = require('path');
function search(dir, queries) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      search(p, queries);
    } else if (p.endsWith('.js') || p.endsWith('.jsx')) {
      const content = fs.readFileSync(p, 'utf-8');
      queries.forEach(q => {
        if (content.toLowerCase().includes(q.toLowerCase())) {
          console.log(p + ': ' + q);
        }
      });
    }
  });
}
search('d:/corporategifting/frontend/src', ['Shop By Categories', 'Tailored For Your Occasions', 'Pick Their Fav Flowers', 'CUSTOMER SERVICE', 'futurelocker', '₹']);
search('d:/corporategifting/backend/src', ['Shop By Categories', 'Tailored For Your Occasions', 'Pick Their Fav Flowers', 'CUSTOMER SERVICE', 'futurelocker', '₹', 'coupon']);
