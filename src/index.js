const express = require('express'); //se indica que se requiere express
const path = require('path');
const app = express(); // se inicia express y se instancia en una constante de nombre app.
const morgan = require('morgan'); //se indica que se requiere morgan
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost')
const db = require('./db.js');
const { json } = require('express');

// settings
app.set('port', 3000); //se define el puerto en el cual va a funcionar el servidro
// Utilities
app.use(morgan('dev')); //se indica que se va a usar morgan en modo dev
app.use(express.json()); //se indica que se va a usar la funcionalidad para manejo de json de
app.use(express.urlencoded({extended:true}));
//Routes
app.use(require('./rutas/index.js'));
//Start server
app.listen(app.get('port'), ()=> {
console.log("Servidor funcionando");
}); //se inicia el servidor en el puerto definido y se pone un mensaje en la consola.


client.on('connect', function () {
    client.subscribe('enviar_data', function (err) {
        if (err) {
            console.log("error en la subscripcion")
        }
    })
});

client.on('message', function (topic, message) {
    // message is Buffer
    myjson = JSON.parse(message.toString()); //de esta manera se convierte el mensaje recibido en un json
    var sql = "INSERT INTO datosev VALUES ?";
    var values = [
      [0, myjson.nodo, myjson.nivel, myjson.estado, myjson.hora, myjson.fecha]
    ];

    db.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });

    sql = "SELECT * FROM nodosev WHERE nodo = ?";
    db.query(sql,[myjson.nodo], function (err, result) {
        if (err) throw err;
        datos = result[0];

        let estado = "No disponible";
        let nivel = "No disponible";
        let act = "No disponible"; 

        if(datos){
            console.log("El registro del nodo ya existe");
        }else{
            sql = "INSERT INTO nodosev VALUES ?";

            values = [
                [0, myjson.nodo, estado, nivel, act]
            ];
  
            db.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });
        }

        

        switch(myjson.estado){
            case 0:
                estado = "No hay más espacios en el contenedor";
                break;
            case 1:
                estado = "Queda 1 espacio en el contenedor";
                break;
            case 2:
                estado = "Quedan 2 espacios en el contenedor";
                break;
            case 3:
                estado = "Quedan 3 espacios en el contenedor";
                break;

        }

        console.log(estado);

        let porcentaje = 0;
        if(myjson.nivel >= 146){
            porcentaje = 100;
        }else{
            porcentaje = (myjson.nivel/146)*100;
        }
        
        porcentaje = Math.round(100 - porcentaje);

        nivel = "Hay un espacio disponible de: " + porcentaje + "%";

        act = "Ultima actualización en " + myjson.fecha + " a las " + myjson.hora;

        values = [estado, nivel, act, myjson.nodo]

        console.log(values);

        sql = "UPDATE nodosev SET estado = ?, espacio = ?,lastact = ?  WHERE nodo = ?";

        db.query(sql, values, function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });

    });
    
    //client.end() //si se habilita esta opción el servicio termina
});