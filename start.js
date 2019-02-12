require('dotenv').config({ path: 'variables.env' });

const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

setInterval(
  function() {console.log("Staying Alive")},
  1800000
)