const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//Creating Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'electronic_inventory_management'
});

//
app.get("/", (req, res) => {
    return res.json("Inventory Management SERVER");
});


app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
});
app.get('/idProducer', (req, res) => {
    const sql = "SELECT * FROM id_producer";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
});
app.put('/idProducer/user', (req, res) => {
    const sql = "UPDATE `id_producer` SET `no_of_items`=? WHERE name='user'";
    const values = [req.body.id_no];
    // console.log(req.body)
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(result);
        }
    })
})

app.post('/users', (req, res) => {
    const sql = "INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `address`, `phone`, `role`) VALUES (?)";
    const values = [

        req.body.id,
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.address,
        req.body.phone,
        req.body.role
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(result);
        }
    })
})

//FOR PRODUCTS

app.get('/products', (req, res) => {
    const sql = "SELECT * FROM product";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
});

app.listen(8081, () => {
    console.log("listening...");
});
