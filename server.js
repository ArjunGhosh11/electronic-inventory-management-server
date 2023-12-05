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

app.get('/users/:email', (req, res) => {
    const email = req.params.email;
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(result);
        }
    })
});
app.get('/admin/:email', (req, res) => {
    const email = req.params.email;
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json({ "type": result[0].role });
        }
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
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(result);
        }
    })
})
app.put('/idProducer/product', (req, res) => {
    const sql = "UPDATE `id_producer` SET `no_of_items`=? WHERE name='product'";
    const values = [req.body.id_no];
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

app.post('/products', (req, res) => {
    const sql = "INSERT INTO `product` (`product_id`, `brand`, `model`, `type`, `quantity`, `unit_price`) VALUES (?)";
    const values = [
        req.body.id,
        req.body.brand,
        req.body.model,
        req.body.type,
        req.body.quantity,
        req.body.unit_price
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.json({ success: false, err });
        }
        else {
            return res.json({ success: true, result });
        }
    })
})

app.put('/products/inventory/:id', (req, res) => {
    const sql = "UPDATE `product` SET `quantity` = ? WHERE `product`.`product_id` = ?";
    const values = [req.body.quantity, req.params.id];
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json({ success: false, err });
        }
        else {
            return res.json({ success: true, result });
        }
    })
})

app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM product WHERE product_id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(result);
        }
    })
});
app.get('/product/specs/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM product_specs WHERE product_id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(result);
        }
    })
});
app.post('/product/specs', (req, res) => {
    const sql = "INSERT INTO `product_specs` (`product_id`,`specifications`) VALUES (?)";
    const values = [
        req.body.product_id,
        req.body.specifications
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.json({ success: false, err });
        }
        else {
            return res.json({ success: true, result });
        }
    })
});

app.put('/products/cart/:id', (req, res) => {
    const sql = "UPDATE `product` SET `quantity` = `quantity` + ? WHERE `product`.`product_id` = ?";
    const values = [req.body.quantity, req.params.id];
    db.query(sql, values, (err, result) => {
        if (err) {
            return res.json({ success: false, err });
        }
        else {
            return res.json({ success: true, result });
        }
    })
})


//REVIEW
app.get('/reviews/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM review WHERE product_id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(result);
        }
    })
});

app.post('/reviews', (req, res) => {
    const sql = "INSERT INTO `review` (`date`, `comment`, `product_id`, `name`) VALUES (?)";
    const values = [

        req.body.date,
        req.body.comment,
        req.body.product_id,
        req.body.name
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.json({ success: false, err });
        }
        else {
            return res.json({ success: true, result });
        }
    })
})

//ORDERS
app.get('/orderID/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT COUNT(*) AS orderCount FROM `orders` WHERE `user_id`=?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(result);
        }
    })
});

app.post('/productSelected', (req, res) => {
    const sql = "INSERT INTO `prod_selected` (`cart_id`, `quantity`, `product_id`, `unit_price`) VALUES (?)";
    const values = [

        req.body.cart_id,
        req.body.quantity,
        req.body.product_id,
        req.body.unit_price
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.json({ success: false, err });
        }
        else {
            return res.json({ success: true, result });
        }
    })
})

app.get('/productSelected/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM `prod_selected` WHERE `cart_id` = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(result);
        }
    })
});

app.delete('/productSelected/', (req, res) => {
    const sql = 'DELETE FROM `prod_selected` WHERE `cart_id` = ? AND `product_id` = ?';
    console.log(req.body);
    db.query(sql, [req.body.cart_id, req.body.product_id], (err, result) => {
        if (err) {
            return res.json(err);
        } else {
            return res.json(result);
        }
    });
});

app.post('/orders', (req, res) => {
    const sql = "INSERT INTO `orders` (`cart_id`, `distributer_name`, `user_id`, `date`,`total_amount`,`payment_status`,`payment_method`) VALUES (?)";
    const values = [

        req.body.cart_id,
        req.body.distributerName,
        req.body.user_id,
        req.body.dateTime,
        req.body.amount,
        req.body.payment_status,
        req.body.paymentMethod
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            return res.json({ success: false, err });
        }
        else {
            return res.json({ success: true, result });
        }
    })
})

app.listen(8081, () => {
    console.log("listening...");
});

//ADMIN CHECK
