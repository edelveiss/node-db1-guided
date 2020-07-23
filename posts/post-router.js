const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

//1 these two ways are identical
// router.get("/", (req, res) => {
//   //   const sql = db("posts").toString();
//   //   console.log(sql); //select * from `posts`
//   db("posts")
//     .then((posts) => {
//       res.json(posts);
//     })
//     .catch((err) => {
// console.log(err)
//       res.status(500).json({ message: "problem with db", error: err });
//     });
// });

router.get("/", async (req, res) => {
  // The syntax for knex is similar to a SQL statement:
  //  * specify the action (select, delete, update, etc.)
  //  * specify the location (i.e. table name)
  //  * implement filters and other clauses (like where and order by)
  //
  // The knex API is a promise-based API. So the methods return a promise.
  // This means that we can use .then().catch() syntax, or async/await syntax.
  //
  // In addition, knex provides different syntaxes for using its api.
  //
  // - First syntax: You can call the knex object (named "knex" here), and
  //   specify as a parameter the "location" (table name) that you want to
  //   perform an action.
  //
  // - Second syntax: You can call the action method on the knex object, and
  //   specify the location (table name) using methods that are similar to SQL
  //   statements.
  //
  // For example:
  //
  //    knex('table1').select('column1', 'column2').where({conditions})
  //
  //      or
  //
  //    knex.select('column1', 'column2').from('table1').where({conditions})
  //
  // These are the same. The second one reads more like a SQL statement.
  //
  // In this example, we are using the first syntax, with .then().catch()
  // handling of the returned promise.
  db("posts")
    .then((posts) => {
      res.json({ data: posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "problem with db", error: err });
    });

  // try {
  //   const posts = await db("posts");
  //   res.json(posts);
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: "problem with db", error: err });
  // }
});
//2
// router.get("/", async (req, res) => {
//   try {
//     const posts = await db("posts");
//     res.json(posts);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "problem with db", error: err });
//   }
// });
//----------------------------------------------------------------------------//
//  GET /api/posts/:id
//----------------------------------------------------------------------------//
//  This middleware returns a single post, if the ID in the URL is valid.
//
//  This example uses the second syntax, with async/await promise handling.
//----------------------------------------------------------------------------//
// router.get('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const post = await db.select('*').from('posts').where({ id }).first();
//         if (post) {
//             res.status(200).json(post);
//         } else {
//             res.status(400).json({ message: "Post not found" });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "sorry, ran into an error" });
//     }
// });
router.get("/:id", async (req, res) => {
  // const { id } = req.params;
  // db("posts").where("id", id)
  // .then(post=>{
  //     res.json(post[0]);
  // })
  // .catch((err) => {
  //     console.log(err)
  //           res.status(500).json({ message: "problem with db", error: err });
  //         });

  try {
    const { id } = req.params;
    const post = await db("posts").where("id", id); //.first()
    res.json(post[0]); //{data:post}
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "problem with db", error: err });
  }
});
//----------------------------------------------------------------------------//
//  POST /api/posts
//----------------------------------------------------------------------------//
//  This middleware allows the creation of a new post.
//
//  This example uses the second syntax, with async/await promise handling.
//----------------------------------------------------------------------------//
// router.post('/', async (req, res) => {
//     const postData = req.body;

//     try {
//         const post = await db.insert(postData).into('posts');
//         res.status(201).json(post);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'db problem', error: err });
//     }

// });

// //----------------------------------------------------------------------------//
// //  PUT /api/posts/:id
// //----------------------------------------------------------------------------//
// //  This middleware allows the modification of an existing post ("update")
// //
// //  This example uses the first syntax, with .then().catch() promise handling.
// //----------------------------------------------------------------------------//
// router.put('/:id', (req, res) => {
//     const { id } = req.params;
//     const changes = req.body;

//     db('posts').where({ id }).update(changes)
//         .then(count => {
//             if (count) {
//                 res.status(200).json({ updated: count });
//             } else {
//                 res.status(404).json({ message: 'invalid id' });
//             }
//         })
//         .catch(err => {
//             res.status(500).json({ message: 'db problem' });
//         });

// });

// //----------------------------------------------------------------------------//
// //  DELETE /api/posts/:id
// //----------------------------------------------------------------------------//
// //  This middleware allows the deletion of an existing post.
// //
// //  This example uses the second syntax with async/await promise handling.
// //
// //  Note that it also uses the "ternary" operator to handle the result of the
// //  delete, rather than an if()..else() statement.
// //----------------------------------------------------------------------------//
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const count = await db.del().from('posts').where({ id });
//         count ? res.status(200).json({ deleted: count })
//             : res.status(404).json({ message: 'invalid id' });
//     } catch (err) {
//         res.status(500).json({ message: 'database error', error: err });
//     }

// });

router.post("/", async (req, res) => {
  const postData = req.body;
  try {
    const numPosts = await db("posts").insert(postData);
    res.status(201).json(numPosts[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "problem with db", error: err });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newPost = req.body;
  try {
    const count = await db("posts").where("id", id).update(newPost);
    if (count) {
      res.status(201).json({ updated: count });
    } else {
      res.status(404).json({ message: "invalid id", error: err });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "problem with db", error: err });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const count = await db("posts").where("id", id).del();
    if (count) {
      res.status(201).json({ deleted: count });
    } else {
      res.status(404).json({ message: "invalid id", error: err });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "problem with db", error: err });
  }
});

module.exports = router;
