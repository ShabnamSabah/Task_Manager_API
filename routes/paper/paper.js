const express = require("express");
const router = express.Router();
const PaperTopic = require("../../model/PaperTopic");
const Paper = require("../../model/Paper");
const Category = require("../../model/Category");
const Title = require("../../model/Title");
const NavItems = require("../../model/NavItems");
const NavItem2 = require("../../model/NavItem2");
const NavItem3 = require("../../model/NavItem3");
const NavItem4 = require("../../model/NavItem4");
const NavItem5 = require("../../model/NavItem5");
const Review = require("../../model/Review");
const User = require("../../model/User");
const checklogin = require("../../middleware/checklogin");
const Sequilize = require('sequelize');
const Op = Sequilize.Op;



Paper.hasMany(Review, {
  foreignKey: "paperId",
});

Review.belongsTo(Paper, {
  foreignKey: "paperId",
});

User.hasMany(Review, {
  foreignKey: "userId",
});

Review.belongsTo(User, {
  foreignKey: "userId",
});


router.get("/:title", checklogin, (req, res) => {
  if (req.role === "admin" || req.role === "user") {
    User.findOne({
      where: {email: req.email}
    })
    .then(user=>{
    Title.findAll().then(title => {
      NavItems.findAll().then(nitem => {
        Paper.findOne({
          where: { title: req.params.title },
          include: [
            {
              model: PaperTopic,
              //required: true
            },
            {
              model: Category,
            },
          ],
        }).then(paper=> {
          Category.findAll().then(category => {
            //console.log(paper);

           
              Review.findAll({
                where:{paperId: paper.id},
                order: [
                  ['commentDate', 'DESC'],
                  ['commentTime', 'DESC']

               ],
              })
              .then(review=>{
                let sum =0;
                for (let i = 0; i < review.length; i++)  {
                  sum += review[i].dataValues.user_rating
                }
                let avg = Math.ceil(sum/review.length);
                let five_star_review = 0;
                let four_star_review = 0;
                let three_star_review = 0;
                let two_star_review= 0;
                let one_star_review = 0;
                for (let i = 0; i < review.length; i++)  {
                   if(review[i].dataValues.user_rating === 5){
                     five_star_review++
                   }
                  
                   if(review[i].dataValues.user_rating === 4){
                    four_star_review++
                  }
                  if(review[i].dataValues.user_rating === 3){
                    three_star_review++
                  }
                  if(review[i].dataValues.user_rating == 2){
                    two_star_review++
                  }
                  if(review[i].dataValues.user_rating == 1){
                    one_star_review++
                  }
                }
                let five_star_review_progres = (five_star_review/review.length)*100
                let four_star_review_progres = (four_star_review/review.length)*100
                let three_star_review_progres = (three_star_review/review.length)*100
                let two_star_review_progres = (two_star_review/review.length)*100
                let one_star_review_progres = (one_star_review/review.length)*100
                //console.log(five_star_review_progres)
                res.render("papers/single_paper", {
                  layout: "index-layout",
                  //name: req.username,
                  user,
                  email: req.email,
                  role: req.role,
                  nitem,
                  paper,
                  category,
                  title,
                  review, 
                  total: review.length,
                  avg,
                  five_star_review,
                  four_star_review,
                  three_star_review,
                  two_star_review,
                  one_star_review,
                  five_star_review_progres,
                  four_star_review_progres,
                  three_star_review_progres,
                  two_star_review_progres,
                  one_star_review_progres
                });
              
             
              })

            })
           
          });
        });
      });
    });
  } else {
    Title.findAll().then(title => {
      NavItems.findAll().then(nitem => {
        Paper.findOne({
          where: { title: req.params.title },
          include: [
            {
              model: PaperTopic,
              //required: true
            },
            {
              model: Category,
            },
          ],
        }).then(paper=> {
          Category.findAll()
          .then(category => {
         
                Review.findAll({
                where:{ paperId: paper.id},
                order: [
                  ['commentDate', 'DESC'],
                  ['commentTime', 'DESC']

               ],
              })
              .then(review=>{ 
                console.log(review)
                
                let sum =0;
                for (let i = 0; i < review.length; i++)  {
                  sum += review[i].dataValues.user_rating
                }
                let avg = Math.ceil(sum/review.length);
                let five_star_review = 0;
                let four_star_review = 0;
                let three_star_review = 0;
                let two_star_review= 0;
                let one_star_review = 0;
                for (let i = 0; i < review.length; i++)  {
                   if(review[i].dataValues.user_rating === 5){
                     five_star_review++
                   }
                  
                   if(review[i].dataValues.user_rating === 4){
                    four_star_review++
                  }
                  if(review[i].dataValues.user_rating === 3){
                    three_star_review++
                  }
                  if(review[i].dataValues.user_rating == 2){
                    two_star_review++
                  }
                  if(review[i].dataValues.user_rating == 1){
                    one_star_review++
                  }
                }
                let five_star_review_progres = (five_star_review/review.length)*100
                let four_star_review_progres = (four_star_review/review.length)*100
                let three_star_review_progres = (three_star_review/review.length)*100
                let two_star_review_progres = (two_star_review/review.length)*100
                let one_star_review_progres = (one_star_review/review.length)*100
                //console.log(five_star_review_progres)
                res.render("papers/single_paper", {
                  layout: "index-layout",
                  //name: req.username,
                  email: req.email,
                  role: req.role,
                  nitem,
                  paper,
                  category,
                  title,
                  review, 
                  total: review.length,
                  avg,
                  five_star_review,
                  four_star_review,
                  three_star_review,
                  two_star_review,
                  one_star_review,
                  five_star_review_progres,
                  four_star_review_progres,
                  three_star_review_progres,
                  two_star_review_progres,
                  one_star_review_progres
                });
              })
          });
        });
      });
    });
  }
  //console.log(title);

  // console.log(JSON.stringify(paper2, null, 2))
});

router.get("/recent/all-papers", checklogin, (req, res) => {
  if (req.role === "admin" || req.role === "user") {
    const perPage = 2;
    const page = req.query.page || 1;

    User.findOne({
      where: {email: req.email}
    })
    .then(user=>{
    Title.findAll().then((title) => {
      NavItems.findAll().then((nitem) => {
        Category.findAll().then((category) => {
          Paper.findAndCountAll({
            limit: perPage,
            offset: perPage * page - perPage,
            order: [
              ["postingDate", "DESC"],
              ["postingTime", "DESC"],
            ],
            include: [
              {
                model: PaperTopic,
                //required: true
              },
              {
                model: Category,
              },
            ],
          }).then((paper) => {
            //console.log(paper.rows)

            res.render("papers/all-recent-papers", {
              layout: "index-layout",
              //name: req.username,
              user,
              email: req.email,
              role: req.role,
              title,
              nitem,
              paper: paper.rows,
              total: paper.count,
              category,
              current: parseInt(page),
              pages: Math.ceil(paper.count / perPage),
              perpage_result: (perPage * parseInt(page))< paper.count ? (perPage * parseInt(page)) : paper.count
            });
          })
          });
        });
      });
    });
  } else {
    const perPage = 2;
    const page = req.query.page || 1;

    Title.findAll().then((title) => {
      NavItems.findAll().then((nitem) => {
        Category.findAll().then((category) => {
          Paper.findAndCountAll({
            limit: perPage,
            offset: perPage * page - perPage,
            order: [
              ["postingDate", "DESC"],
              ["postingTime", "DESC"],
            ],
            include: [
              {
                model: PaperTopic,
                //required: true
              },
              {
                model: Category,
              },
            ],
          }).then((paper) => {
            console.log(JSON.stringify(paper.rows, null, 2));
            console.log(paper.rows);
            res.render("papers/all-recent-papers", {
              layout: "index-layout",
              name: req.username,
              email: req.email,
              role: req.role,
              title,
              nitem,
              paper: paper.rows,
              total: paper.count,
              category,
              current: parseInt(page),
              pages: Math.ceil(paper.count / perPage),
              perpage_result: (perPage * parseInt(page))< paper.count ? (perPage * parseInt(page)) : paper.count
            });
          });
        });
      });
    });
  }
});

router.post("/add_review/:id", checklogin, (req, res) => {
  if (req.role === "admin" || req.role === "user") {
    console.log(req.email);
    let { user_review, rating } = req.body;
    let commentDate = new Date().toLocaleDateString();
    let commentTime = new Date().toLocaleTimeString();

    User.findOne({ where: { email: req.email } }).then((user) => {
      Paper.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: PaperTopic,
            //required: true
          },
          {
            model: Category,
          },
        ],
      }).then((p1) => {
        const newReview = new Review({
          user_name: user.name,
          user_email: user.email,
          user_rating: rating,
          user_review,
          commentDate,
          commentTime,
          paperId: p1.id,
          userId: user.id,
        });
        newReview.save().then((new_review) => {
          res.redirect('/papers/' +p1.title )
          
        });
      });
    });
  } else {
    let { user_name, user_email, user_review, rating } = req.body;
    let commentDate = new Date().toLocaleDateString();
    let commentTime = new Date().toLocaleTimeString();
    
      User.findOne({ where: { email: req.email } }).then((user) => {
        Paper.findOne({
          where: { id: req.params.id },
          include: [
            {
              model: PaperTopic,
              //required: true
            },
            {
              model: Category,
            },
          ],
        }).then((p1) => {
          const newReview = new Review({
            user_name,
            user_email,
            user_rating: rating,
            user_review,
            commentDate,
            commentTime,
            paperId: p1.id,
            userId: "NULL",
          });
          newReview.save().then((new_review) => {

            res.redirect('/papers/'+p1.title )
           
          });
        });
      });
    
  }
});

router.get("/category/:name", checklogin, (req, res) => {
  if (req.role === "admin" || req.role === "user") {
    const perPage = 2;
    const page = req.query.page || 1;
    Paper.findAndCountAll({
      limit: perPage,
      offset: perPage * page - perPage,
      order: [
        ["postingDate", "DESC"],
        ["postingTime", "DESC"],
      ],
      include: [
        {
          model: PaperTopic,
          //required: true
        },
        {
          model: Category,
          where:{
            category: req.params.name
          }
        },
      ],
    }).then(paper=>{
      User.findOne({
        where: {email: req.email}
      })
      .then(user=>{
        Title.findAll()
        .then(title=>{
          NavItems.findAll()
          .then(nitem=>{
            Category.findAll().then(category => {
             res.render('papers/paper_byCategory',{
              layout: 'index-layout',
               //name: req.username,
               user,
               email: req.email,
               role: req.role,
               title,
               nitem,
               paper: paper.rows,
               total: paper.count,
               category,
               current: parseInt(page),
               pages: Math.ceil(paper.count / perPage),
               perpage_result: (perPage * parseInt(page))< paper.count ? (perPage * parseInt(page)) : paper.count,
               heading: req.params.name
             })
            })
          })
        })
      })
    })
  }else{
    const perPage = 2;
    const page = req.query.page || 1;
    Paper.findAndCountAll({
      limit: perPage,
      offset: perPage * page - perPage,
      order: [
        ["postingDate", "DESC"],
        ["postingTime", "DESC"],
      ],
      include: [
        {
          model: PaperTopic,
          //required: true
        },
        {
          model: Category,
          where:{
            category: req.params.name
          }
        },
      ],
    
 }).then(paper=>{
     Title.findAll()
     .then(title=>{
       NavItems.findAll()
       .then(nitem=>{
        Category.findAll().then(category => {
          res.render('papers/paper_byCategory',{
            layout: 'index-layout',
            name: req.username,
            email: req.email,
            role: req.role,
            title,
            nitem,
            paper: paper.rows,
            total: paper.count,
            category,
            current: parseInt(page),
            pages: Math.ceil(paper.count / perPage),
            perpage_result: (perPage * parseInt(page))< paper.count ? (perPage * parseInt(page)) : paper.count,
            heading: req.params.name
          })
       })
      })
     })
 })
  }

})
router.get("/topic/:name", checklogin, (req, res) => {
  if (req.role === "admin" || req.role === "user") {
    const perPage = 2;
    const page = req.query.page || 1;
    Paper.findAndCountAll({
      limit: perPage,
      offset: perPage * page - perPage,
      order: [
        ["postingDate", "DESC"],
        ["postingTime", "DESC"],
      ],
      include: [
        {
          model: PaperTopic,
          where:{
            paper_topic: req.params.name
          }
        },
        {
          model: Category
          
        },
      ],
    }).then(paper=>{
      User.findOne({
        where: {email: req.email}
      })
      .then(user=>{
        Title.findAll()
        .then(title=>{
          NavItems.findAll()
          .then(nitem=>{
            Category.findAll().then(category => {
             res.render('papers/paper_byTopic',{
              layout: 'index-layout',
               //name: req.username,
               user,
               email: req.email,
               role: req.role,
               title,
               nitem,
               paper: paper.rows,
               total: paper.count,
               category,
               current: parseInt(page),
               pages: Math.ceil(paper.count / perPage),
               perpage_result: (perPage * parseInt(page))< paper.count ? (perPage * parseInt(page)) : paper.count,
               heading: req.params.name
             })
            })
          })
        })
      })
    })
  }else{
    const perPage = 2;
    const page = req.query.page || 1;
    Paper.findAndCountAll({
      limit: perPage,
      offset: perPage * page - perPage,
      order: [
        ["postingDate", "DESC"],
        ["postingTime", "DESC"],
      ],
      include: [
        {
          model: PaperTopic,
          where:{
            paper_topic: req.params.name
          }
        },
        {
          model: Category,
        },
      ],
    
 }).then(paper=>{
     Title.findAll()
     .then(title=>{
       NavItems.findAll()
       .then(nitem=>{
        Category.findAll().then(category => {
          res.render('papers/paper_byTopic',{
            layout: 'index-layout',
            name: req.username,
            email: req.email,
            role: req.role,
            title,
            nitem,
            paper: paper.rows,
            total: paper.count,
            category,
            current: parseInt(page),
            pages: Math.ceil(paper.count / perPage),
            perpage_result: (perPage * parseInt(page))< paper.count ? (perPage * parseInt(page)) : paper.count,
            heading: req.params.name
          })
       })
      })
     })
 })
  }

})

router.get('/search/searchresult', checklogin, (req, res)=>{
 if(req.role === "admin" || req.role === "user"){
  let { term } = req.query;
  const perPage = 2;
  const page = req.query.page || 1;
  term = term.toLowerCase();
  Paper.findAndCountAll({
    limit: perPage,
    offset: perPage * page - perPage,
    order: [
      ["postingDate", "DESC"],
      ["postingTime", "DESC"],
    ],
    where : {
      //technologies: { [Op.like]:'%' + term + '%'}

      [Op.or] : [
         { title: { [Op.like]:'%' + term + '%'}},
         { abstract: { [Op.like]:'%' + term + '%'}},
        //  { paper_topic: { [Op.like]:'%' + term + '%'}},
        //  { category: { [Op.like]:'%' + term + '%'}}
      ]
    
    },
    include:[{
      model: PaperTopic,
    },{
      model: Category
    }]
  })
   .then(paper =>{
    User.findOne({
      where: {email: req.email}
    })
    .then(user=>{
    Title.findAll()
    .then(title=>{
      NavItems.findAll()
      .then(nitem=>{
          Category.findAll()
          .then(category=>{
            res.render('papers/searched_paper', {
              layout: 'index-layout',
             // name: req.username,
             user,
            email: req.email,
            role: req.role,
             title,
             nitem,
             paper: paper.rows,
             total: paper.count,
             category,
             current: parseInt(page),
             pages: Math.ceil(paper.count / perPage),
             perpage_result: (perPage * parseInt(page))< paper.count ? (perPage * parseInt(page)) : paper.count,
             heading: term,
             term: term
            
            
            });
          })
            
          })

      })
    })
  
})

 }else 
 {
  let { term } = req.query;
  const perPage = 2;
  const page = req.query.page || 1;
  term = term.toLowerCase();
  Paper.findAndCountAll({
    limit: perPage,
    offset: perPage * page - perPage,
    order: [
      ["postingDate", "DESC"],
      ["postingTime", "DESC"],
    ],
    where : {
      //technologies: { [Op.like]:'%' + term + '%'}

      [Op.or] : [
         { title: { [Op.like]:'%' + term + '%'}},
         { abstract: { [Op.like]:'%' + term + '%'}},
        //  { paper_topic: { [Op.like]:'%' + term + '%'}},
        //  { category: { [Op.like]:'%' + term + '%'}}
         
      ]
    
    },
    include:[{
      model: PaperTopic,
    
    },{
      model: Category,
     
    }]
  })
   .then(paper =>{
    Title.findAll()
    .then(title=>{
      NavItems.findAll()
      .then(nitem=>{
          Category.findAll()
          .then(category=>{
            res.render('papers/searched_paper', {
              layout: 'index-layout',
             // name: req.username,
              email: req.email,
              role: req.role,
              title,
              nitem,
              paper: paper.rows,
              total: paper.count,
              category,
              current: parseInt(page),
              pages: Math.ceil(paper.count / perPage),
              perpage_result: (perPage * parseInt(page))< paper.count ? (perPage * parseInt(page)) : paper.count,
              heading: term,
              term: term
            });
            
          })

      })
    })
  
})
}

})


module.exports = router;
