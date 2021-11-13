const {Router} = require('express');
const { ReadPreferenceMode } = require('mongodb');
const router = Router();
const db = require('../db.js');
const mdb = require('../mongodb.js');

router.get('/prueba', (req,res) =>{

    res.send("Sirve");
    
});


router.get('/datos', async (req,res) =>{


    var datos;
    var sql = "SELECT * FROM datosev";

    db.query(sql , function (err, result) {
        if (err) throw err;

        datos = result;
        console.log(datos);
        res.send(datos);
    });


});

router.get('/datos_nodo/:id', async (req,res)=>{

    const id = req.params.id;

    sql = "SELECT * FROM datosev WHERE nodo IN (SELECT nodo FROM nodosev WHERE id = ?)";

    db.query(sql, [id], function (err, result) {

        if (err) throw err;

        let datos;
        datos = result;

        res.send(datos);
    
    });


})

router.get('/last/nodo/:id', async(req,res) =>{

    const id = req.params.id;

    sql = "SELECT * FROM datosev WHERE nodo IN (SELECT nodo FROM nodosev WHERE id = ?) ORDER BY id DESC LIMIT 1";

    db.query(sql, [id], function (err, result) {

        if (err) throw err;

        let datos;
        datos = result;

        res.send(datos);
    
    });

})

router.get('/nodo/:id', async (req,res)=>{

    const id = req.params.id;

    sql = "SELECT * FROM nodosev WHERE id = ?";

    db.query(sql, [id], function (err, result) {

        if (err) throw err;

        let datos;
        datos = result;

        res.send(datos);
    
    });

})

router.get('/nodosS', async(req,res) =>{
    sql = "SELECT id, nodo FROM nodosev";

    db.query(sql, function (err, result) {

        if (err) throw err;

        let datos;
        datos = result;

        res.send(datos);
    
    });
})

router.get('/nodos', async(req,res) =>{

    sql = "SELECT * FROM nodosev";

    db.query(sql, function (err, result) {

        if (err) throw err;

        let datos;
        datos = result;

        res.send(datos);
    
    });
})

router.get('/nodoAll/:id', async (req,res) =>{

    id = req.params.id;

    sql = "SELECT * FROM nodosev WHERE id = ?";

    db.query(sql, [id], function (err, result) {

        if (err) throw err;

        let datos = [];
        datos = result;

        sql = "SELECT * FROM datosev WHERE nodo IN (SELECT nodo FROM nodosev WHERE id = ?)";

        db.query(sql, [id], function (err, result) {

            if (err) throw err;

            datos.push(result);
    
            res.send(datos);
        
        });
    
    });
});

router.post('/login/mov', async(req,res) =>{

    try{

        var datos = req.body;

        var errores = 0;
    
        if(datos.correo == ""){
            errores = errores + 1;
        }
        if(datos.password == ""){
            errores = errores + 1;
        }
        if(errores == 0){
    
            let sql = "SELECT * FROM usuarios WHERE correo = ?";

            db.query(sql, [datos.correo], function (err, result) {

                if (err) throw err;
                
                let usuario = result[0];

                if(usuario.password == datos.password){
                    res.send("OK");
                }else{
                    res.send("NOK");
                }
            
            });
    
        }

    }catch(e){
        console.log(error)
    }

})
/*
router.post('/login/mov', async(req,res) =>{
    try{
        var datos = req.body;

        var errores = 0;
    
        if(datos.correo == ""){
            errores = errores + 1;
        }
        if(datos.password == ""){
            errores = errores + 1;
        }
        if(errores == 0){
    
            try{
                
                var usuario = await mdb.getOne(datos.correo);
                usuario = usuario[0]; 
                if(usuario.password == datos.password){
                    res.send("OK")
                }else{
                    res.send("NOK")
                }
    
            }catch{
                res.send("NOK")
            }  
    
        }
    }catch(error){
        console.log(error)
    }

})
*/

router.post('/registro/mov', async(req,res) =>{

    var datos = req.body;

    var errores = 0;

    if(datos.correo == ""){
        errores = errores + 1;
    }
    if(datos.password == ""){
        errores = errores + 1;
    }
    if(errores == 0){
        datos.tipo = 1;
        
        sql = "INSERT INTO usuarios VALUES ?";

        values = [
            [0, datos.nombre, datos.correo, datos.password, datos.tipo]
        ];

        db.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });

        res.send("OK");
    }else{
        res.send("NOK");
    }

})
/*
router.post('/registro/mov', async(req,res) =>{

    var datos = req.body;

    var errores = 0;

    if(datos.correo == ""){
        errores = errores + 1;
    }
    if(datos.password == ""){
        errores = errores + 1;
    }
    if(errores == 0){
        datos.tipo = 1;
        await mdb.insertOne(datos);
        res.send("OK");
    }else{
        res.send("NOK");
    }

});
*/
module.exports = router