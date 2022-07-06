require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
const ejs = require("ejs");
var JSON = require('JSON');
const bcrypt = require('bcrypt');
const Razorpay = require('razorpay');
// var mysql = require('mysql');
const { execSync } = require('child_process');
const { stringify } = require('querystring');
const { checkUser } = require('./middleware/authmiddleware');
var cookies = require("cookie-parser");
const authRoutes = require('./routes/authRoutes');
// const errorHandler = require('./middleware/error_handleing');
const bodyparser = require('body-parser');
const { exit } = require('process');
const cors = require("cors");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

var port = process.env.PORT;
var host = process.env.HOST;

const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const { tour_bgmi } = require('./config/sequelize');
// const { tour_users } = require('../models/tourDetails');
const { tour_details, tour_users } = require('./models/tourDetails');
const { createptable, top_players } = require('./models/tourPlayers');
const req = require('express/lib/request');

const corsOptions = {
   origin: `${process.env.ClientServer}`
};

const razorpayInstance = new Razorpay({

   // Replace with your key_id
   key_id: 'rzp_test_vGLIw0CCxPM8kB',

   // Replace with your key_secret
   key_secret: '35uN022q4mg8AZSLmdL0uKAn'
});



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

   try {
      tour_bgmi.query(`SELECT COUNT(*) AS 'num' FROM tour_details;`).then((data) => {
         req.body.num = data[0][0].num;
      })

      tour_details.findAll({
         where: {
            [Op.or]: [{ status: 1 }, { rstatus: 1 }]
         }
      })
         .then((data) => {
            // console.log(req.body.num);
            res.status(200).render('dashboard', { heading: 'Dashboard', data, host, port, user: req.user, num: req.body.num, sh: req.body.sheduled_on });
         })
   } catch (error) {
      console.log(error);
      res.status(505).redirect('/tournament');
   }


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
      try {
         tour_bgmi.query(`drop table player_${req.body.index}s`)
            .then(() => {
               tour_details.destroy({
                  where: { indexs: req.body.index },
               });
               res.status(200).json({ error: 'Done!' });
            })
      } catch (error) {
         console.error(error);
         res.status(505).json({ error: 'Tournament not exist' });
      }

   };

});
app.get('/tournament/tourdetails', checkUser, (req, res) => {
   tour_details.findAll({ where: { status: 1 } })
      .then((data) => {
         res.status(200).json(data);
      });
});
// app.post('/tournament/CreateOrder',(req,res) => {
//    console.log("hi");
//    res.json("hi");
// });




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

   tour_bgmi.query(`SELECT * FROM player_${req.body.index}s`)
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

   tour_bgmi.query(`update player_${req.body.index}s set kills = '${req.body.kills}' where name = '${req.body.name}'`)
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

   console.log(req.body);

   tour_bgmi.query(`insert into player_${req.body.index}s (name,email,phone,pubg_userid,pubg_username,speciality,dateofenroll,paymentstatus,createdAt,updatedAt) values ('${req.body.name}','${req.body.email}','${req.body.phone}','${req.body.pubguserid}','${req.body.pubgusername}','${req.body.speciality}','${req.body.date}','0','${req.body.date}','${req.body.date}')`)
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
      tour_bgmi.query(`delete from player_${req.body.index}s where name = '${req.body.username}'`)
         .then(() => {
            tour_bgmi.query(`update tour_details set player_joined = player_joined - 1, updatedAt = NOW() where indexs = ${req.body.index}`)
         })
         .catch((error) => {
            console.error("Error Occured!");
         })

   };

   res.status(200).redirect('/player');

});


app.get('/payments', (req, res) => {
   razorpayInstance.payments.all().then((data) => {
      console.log(data);
   });
   res.status(200).render('payment', { heading: 'Payment', host, port, user: req.user });

});
// app.post('/payment/createorder', cors(corsOptions), (req, res)=>{ 
//   console.log(req.query.index);
//    // STEP 1:
//    // const {amount,currency,receipt, notes}  = req.body;      

//    // STEP 2:    
//    // razorpayInstance.orders.create({amount, currency, receipt, notes}, 
//    //     (err, order)=>{

//    //       //STEP 3 & 4: 
//    //       if(!err)
//            res.json('hi from server');
//    //       else
//    //         res.send(err);
//    //     }
//    // )
// });
app.post('/paymentcompcall', (req, res) => {
   console.log(req.body);
   var paymentId = req.body.payload.payment.entity.id;
   console.log(req.body.payload.payment.entity);
   razorpayInstance.accounts.fetch({ paymentId }, (err, details) => {
      if (err) {
         console.log(err)
      }
      else {
         var notes = details.notes;
         var paymentstatus = details.status;
         var paymentid = details.id;
         // tour_bgmi.query(`insert into player_${req.body.index}s`)
         console.log(details);
      }
   });
   // razorpayInstance.orders.create({ paymentId },
   //    (err, order) => {

   //       //STEP 3 & 4: 
   //       if (!err)
   //          res.json('hi from server');
   //       else
   //          res.send(err);
   //    }
   // )
   // console.log(a);
   res.status(200).send();
})


app.get('/setting', (req, res) => {
   res.status(200).render('setting', { heading: 'Setting', host, port, user: req.user });
});

app.post('/setting/adduser', async (req, res) => {

   console.log(req.body);
   try {
      function between(min, max) {
         return Math.floor(
            Math.random() * (max - min) + min
         )
      }

      salt = await bcrypt.genSalt(10);
      a = await bcrypt.hash(req.body.pwd, salt);
      console.log(salt);
      console.log('   ');
      console.log(a);

      tour_users.create({
         user: req.body.username,
         hash: a,
         userid: between(125500, 200000),
      })
   } catch (err) {
      res.status(204).redirect('/setting');
      console.log(err);
   }

   res.status(200).redirect('/setting');
})
app.post('/setting/upusername', (req, res) => {
   console.log(req.body);
   const objectToUpdate = {
      user: 'Hello World',
      description: 'Hello World'
   }

   tour_users.update({ user: `${req.body.updatedusername}` }, { where: { user: `${req.body.username}` } })

      .then((status) => {
         // console.log("done");
         console.log(status[0]);
         if (status[0] == 0) {
            res.status(505).json({ Status: 'Enter correct username!' })
         }
         else {
            res.status(200).json({ Status: 'Username updated sucessfully!' })
         }
      })
      .catch((error) => {
         // console.log(error);
         // console.log("hi");
         console.log("update user name error!\n" + error);
         res.status(505).json({ Status: 'Server error occured!' })
      })
   // res.status(200).json({ Status: 'Player data inserted!' })

})
app.post('/setting/upusername', (req, res) => {

})




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
   console.log("app listening at http://%s:%s", host, port)
})

// const ngrok = require('ngrok');
// (async function() {
//   const url = await ngrok.connect(85);
//   console.log(url);
// })().catch((error) => {
//    console.log(error);
// });
