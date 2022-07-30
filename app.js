const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

/*const expressHandlebars = require('express-handlebars');
  app.engine('handlebars', expressHandlebars({layoutsDir: 'views/layouts', defaultLayout: 'main-layout'}));   // Đăng ký template trong trường hợp k được tích hợp.
  app.set('view engine', 'handlebars');
  app.set('views', 'views');*/

/*app.set('view engine', 'pug');   // Đăng ký template trong trường hợp được tích hợp.
  app.set('views', './views')     // Đăng ký template trong trường hợp được tích hợp.*/

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' })
});

app.listen(3000);