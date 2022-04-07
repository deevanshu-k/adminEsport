require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
const ejs = require("ejs");
var JSON = require('JSON');
// var mysql = require('mysql');
const { execSync } = require('child_process');
const { stringify } = require('querystring');
const { checkUser } = require('./middleware/authmiddleware');
var cookies = require("cookie-parser");
const authRoutes = require('./routes/authRoutes');
// const errorHandler = require('./middleware/error_handleing');
// const { con, con1 } = require('./config/databaseConfig.js');
const bodyparser = require('body-parser');
const { exit } = require('process');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

var port = process.env.PORT;
var host = process.env.HOST;

const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const { tour_bgmi, tour_players } = require('./config/sequelize');
const { tour_details, tour_users } = require('./models/tourDetails');
const { createptable, top_players } = require('./models/tourPlayers');
const req = require('express/lib/request');




app.use('/static', express.static('static'));
app.use(express.urlencoded());
app.use(cookies());

// Set the template engine as pug
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));



// network
app.get('*', checkUser);

// app.post('*', checkUser);

app.get('/', (req, res) => {

   tour_details.findAll({
      where: {
         [Op.or]: [{ status: 1 }, { rstatus: 1 }]
      }
   })
      .then((data) => {
         res.status(200).render('dashboard', { heading: 'Dashboard', data, host, port, user: req.user });
      })
      .catch((error) => {
         console.log(error);
         res.status(505).redirect('/tournament');
      })

});



app.get('/tournament', (req, res) => {

   tour_details.findAll({ where: { status: 1 } })
      .then((data) => {
         res.status(200).render('tournament', { heading: 'Tournament', data, host, port, user: req.user });
      });

});
app.post('/tournament/addtour', checkUser, (req, res) => {

   tour_details.create({
      indexs: req.body.index,
      win_prize: req.body.win_prize,
      per_kill: req.body.per_kill,
      entry_fees: req.body.entry_fees,
      type: req.body.type,
      version: req.body.version,
      map: req.body.map,
      sheduled_on: req.body.sheduled_on,
      // player_joined: '0', 
      status: req.body.status,
      total_player: req.body.total_player,
      // rstatus: req.body.rstatus, 
      rpay_link: req.body.rpay_link,
      // createdAt: '2022-03-25',
      // updatedAt: '2022-03-25',
   })
      .then(() => {
         createptable(`player_${req.body.index}`);
      })
      .then(() => {
         console.log('Data inserted!');
         res.status(200).redirect('/tournament');

      })
      .catch((error) => {
         console.log(error);
         res.status(505).redirect('/tournament');

      })

});
app.post('/tournament/update', checkUser, (req, res) => {

   console.log(req.body);

   try {
      if (req.body.updatetext != '') {

         tour_bgmi.query(`update tour_details set ${req.body.updatetext} = '${req.body.textvalue}' where indexs = ${req.body.index}`);
      }
      if (req.body.updateint != '') {

         tour_bgmi.query(`update tour_details set ${req.body.updateint} = ${req.body.intvalue} where indexs = ${req.body.index}`);
      }
      if (req.body.date != '') {

         tour_bgmi.query(`update tour_details set sheduled_on = '${req.body.date}' where indexs = ${req.body.index}`);
      }

   } catch (error) {
      console.log(error);
      // res.status(505).redirect('/tournament');
   }
   finally {

      res.status(200).redirect('/tournament');
   }

});
app.post('/tournament/removetour', checkUser, (req, res) => {

   if (req.body.index != '') {

      tour_players.query(`drop table player_${req.body.index}s`)
         .then(() => {
            tour_details.destroy({
               where: { indexs: req.body.index },
            })
            res.status(200).json({ error: 'Done!' });

         })
         .catch((error) => {
            console.error(error);
            res.status(505).json({ error: 'Tournament not exist' });

         })

   };

});




app.get('/result', (req, res) => {
   let data = {
      length: 0
   };

   try {
      top_players.findAll({ raw: true, })
         .then((tpData) => {
            // console.log(tpData);
            res.status(200).render('result', { heading: 'Results', host, port, data, user: req.user, tpData });
         })
   } catch (error) {
      tpData = {
         length: 0
      };
      // console.log("catch blog!");
      res.status(200).render('result', { heading: 'Results', host, port, data, user: req.user, tpData });
   }


   // .catch ((error) => {
   //    tpData = {
   //       length: 0
   //    };
   //    res.status(200).render('result', { heading: 'Results', host, port, data, user: req.user, tpData });
   // })
   // console.log(tpData.length);
   // console.log(tpData);
   // tpData = {
   //    length: 0
   // };
   // res.status(200).render('result', { heading: 'Results', host, port, data, user:req.user,tpData: tpData });
});
app.post('/result/editresult', checkUser, (req, res) => {

   tour_players.query(`SELECT * FROM player_${req.body.index}s`)
      .then((result) => {
         console.log(result[0]);
         var tpData = {
            length: 0
         };
         res.status(200).render('result', { heading: 'Results', index: req.body.index, host, port, data: result[0], user: req.user, tpData });
      })
      .catch((error) => {
         console.log("error occured: /result/editresult");
         res.status(200).redirect('/');
      })

});
app.post('/result/editresult/editkill', checkUser, (req, res) => {

   tour_players.query(`update player_${req.body.index}s set kills = '${req.body.kills}' where name = '${req.body.name}'`)
      .then((result) => {
         console.log(result);
         res.status(200).json({ hello: 'done!' });
      })
      .catch((error) => {
         console.log("error occured: /result/editresult/editkill");
         res.status(200).redirect('/result');
      })

});
app.post('/result/addtopplayer', checkUser, (req, res) => {

   // let ts = Date.now();

   // let date_time = new Date(ts);
   // let date = date_time.getDate();
   // let month = date_time.getMonth() + 1;
   // let year = date_time.getFullYear();

   top_players.create({
      name: req.body.name,
      kills: req.body.kills,
      speciality: req.body.speciality,
      index: req.body.index,
      // createdAt: `${year}-${month}-${date}`,
   })
      .then(() => {
         console.log("done");
         res.status(200).json({ Status: 'Player data inserted!' })
      })
      .catch((error) => {
         res.status(505).json({ Status: 'Error - Player data not inserted!' })
         console.log("addtopplayer error!\n" + error);
      })


});
app.post('/result/removetopplayer', checkUser, (req, res) => {

   console.log("Remove top player called!");
   try {
      top_players.destroy({
         where: { name: req.body.name },
      }).then((data) => {
         res.status(200).redirect('/result');
         console.log(data);
      })
   } catch (error) {
      console.log("error occured!");
      res.status(200).redirect('/result');
   }

});


app.get('/player', (req, res) => {

   res.status(200).render('player', { heading: 'Player', host, port, user: req.user });
});
app.post('/player/updateap', checkUser, (req, res) => {


   tour_players.query(`insert into player_${req.body.index}s (name,speciality,dateofenroll,createdAt,updatedAt) values ('${req.body.username}','${req.body.speciality}','${req.body.date}','${req.body.date}','${req.body.date}')`)
      .then(() => {
         tour_bgmi.query(`update tour_details set player_joined = player_joined + 1 where indexs = ${req.body.index}`)
      }).catch((error) => {
         console.log(error);
         console.log('Error occured!');
      })

   res.status(200).redirect('/player');

});
app.post('/player/updaterp', checkUser, (req, res) => {
   if (req.body.index != '') {
      tour_players.query(`delete from player_${req.body.index}s where name = '${req.body.username}'`)
         .then(() => {
            tour_bgmi.query(`update tour_details set player_joined = player_joined - 1, updatedAt = NOW() where indexs = ${req.body.index}`)
         })
         .catch((error) => {
            console.error("Error Occured!");
         })

   };

   res.status(200).redirect('/player');

});




app.get('/setting', (req, res) => {
   res.status(200).render('setting', { heading: 'Setting', host, port, user: req.user });
});





// login
app.use(authRoutes);
app.use((req, res, next) => {
   const error = new Error('Not Found');
   error.status = 404;
   next(error);
})

app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
      error: {
         message: error.message
      }
   });
})


var server = app.listen(port, function () {
   // var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})