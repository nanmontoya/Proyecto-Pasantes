const express = require ('express');
const sess = require("express-session");
const cp = require("cookie-parser");
const bodyParser = require('body-parser');
const mysql = require('mysql');




class Server {
    constructor() { 
        this.app = express();
        this.port = process.env.PORT;
        this.session = sess;
        this.cookieParser = cp;

        this.middlewares();
        this.routes();
    }
 
    middlewares() {

        this.app.use(express.static('public'));
        this.app.set("view engine","ejs");

        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.app.use(this.cookieParser());

        this.app.use(this.session({
            secret: "amar",
            saveUninitialized: true,
            resave:true
        }));

    

    
    }

    routes() {


        this.app.post('/guardar-jornada', (req, res) => {
            let usuario = req.body.usuario;
            let nombre = req.body.nombre;
            let turno = req.body.turno;
            let horario = req.body.horario;
        
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
            });
        
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
        
                let sql = "INSERT INTO pasantes.jornada VALUES ('"+ usuario +"', '" + nombre + "','" + turno + "','" + horario + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render("exito13", { usuario: usuario});
    
                
                });
            });
        });

        this.app.get('/jornada', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let turno = req.query.turno;
            let horario = req.query.horario;
            
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");


              
                let sql = "SELECT * FROM pasantes.jornada WHERE usuario = '" + usuario + "' ";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;

                    if (result.length === 0) {
                        console.log("El usuario no existe");
                        res.send("No hay jornada registrada para este usuario");
                    } else {
                        console.log(result);
                        let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, turno: result[i].turno, horario: result[i].horario})
                        res.render("jornadapasantes", { resultados: resultados, usuario: usuario});

                }
    
                }); 
    
            });
            
        }
        );
        
        this.app.post('/guardar-evento', (req, res) => {
            let fecha = req.body.fecha;
            let evento = req.body.evento;
            let descripcion = req.body.descripcion;
        
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
            });
        
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
        
                let sql = "INSERT INTO pasantes.calendario VALUES ('"+ fecha +"', '" + evento + "','" + descripcion + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render("exito12", { evento: evento});
    
                
                });
            });
        });

       
        this.app.get('/ver-evento', (req, res) => {
            let mysql = require('mysql');
            let fecha = req.query.fecha;
            let evento = req.query.evento;
            let descripcion = req.query.descripcion;
          
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");


               
                let sql = "SELECT * FROM pasantes.calendario";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;

                    if (result.length === 0) {
                        console.log("No hay eventos registrados");
                        res.send("No hay eventos registrados");
                    } else {
                        console.log(result);
                        let resultados = [
                        {fecha: result[0].fecha, evento: result[0].evento, descripcion: result[0].descripcion}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({fecha: result[i].fecha, evento: result[i].evento, descripcion: result[i].descripcion})
                    res.render("calendario", { resultados: resultados});

                }
    
                }); 
    
            });
            
        }
        );
        
        

        this.app.get('/login2', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let password = req.query.password;
            let unidad = req.query.unidad;
        
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
            });
        
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");

                
                let sql = "SELECT * FROM pasantes.director WHERE usuario = ?";
                con.query(sql, [usuario], function(err, result) {
                    if (err) throw err;
        
                    if (result.length > 0) {
                        if (result[0].password == password && result[0].unidad == unidad) {
                            console.log("Welcome " + usuario);
                            let usersession = {
                                nam: usuario,
                                unidad: result[0].unidad,
                            };
                            req.session.usersession = usersession;
                            req.session.save();
        
                            switch (unidad) {
                                case 'CAAPS ÁGUILAS ZARAGOZA':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CESSA SENDEROS DEL SOL':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CENTRO DE SALUD FIDEL AVILA':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CCS GUADALUPE':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CENTRO DE SALUD SAN ISIDRO':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CS PORVENIR':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CS PRAXEDIS G. GUERRERO':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'UNIDAD MÉDICA MÓVIL FEDERAL 2 EL MILLÓN':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CESSA COLINAS DE JUÁREZ':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                     break;
                                case 'CENTRO DE SALUD DIVISIÓN DEL NORTE':
                                     res.render("inicioSesionDirector", { unidad: unidad });
                                     break;
                                case 'CENTRO DE SALUD REVOLUCIÓN MEXICANA':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CS SAMALAYUCA':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CS AHUMADA':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'UNIDAD MÉDICA MÓVIL FEDERAL SAN LORENCITO':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CENTRO DE SALUD GALEANA':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CS #6 INDEPENDENCIA II':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CS #7 INDEPENDENCIA I':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CENTRO DE SALUD AZTECA I':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CENTRO DE SALUD AZTECA II':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CS COMUNITARIO #10 MORELOS':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CENTRO DE SALUD TODOS SOMOS MEXICANOS':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CENTRO DE SALUD DR. LUIS ESTAVILLO MUÑOZ':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CAAPS RANCHO ANAPRA':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CENTRO DE SALUD PLUTARCO ELÍAS CALLES':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CS COMUNITARIO #12 SAN FELIPE':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'UNIDAD DE INVESTIGACION ENTOMOLÓGICA Y BIOENSAYOS':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CENTRO REGULADOR DE URGENCIAS MEDICAS (CRUM)':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'LABORATORIO JURISDICCIONAL':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'BANCO DE SANGRE':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'BANCO DE LECHE':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'CREDI':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'DEDICAM':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'FUNDACION INTEGRA':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                case 'ALBERGUE: LEONA VICARIO':
                                    res.render("inicioSesionDirector", { unidad: unidad });
                                    break;
                                default:
                                    res.render("error", { error: "Unidad no reconocida" });
                                    break;
                            }
                        } else {
                            console.log("Password incorrecto");
                            res.render("error", { error: "Contraseña o rol incorrecto" });
                        }
                    } else {
                        console.log("El Usuario no existe");
                        res.render("error", { error: "El Usuario no existe" });
                    }
                });
            });
        });
        

        this.app.get('/eliminarregistro', (req, res) => {
            let mysql = require('mysql');
            const usuario = req.query.usuario;
        
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
            });
        
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
        
                // Consulta para verificar si el usuario existe
                let sqlSelect = "SELECT * FROM pasantes.users WHERE usuario = ?";
                con.query(sqlSelect, [usuario], function (err, result) {
                    if (err) {
                        console.error("Error al consultar la base de datos:", err);
                        res.status(500).send("Error interno del servidor");
                        return;
                    }
        
                    // Si no se encontraron registros, el usuario no existe
                    if (result.length === 0) {
                        console.log("El usuario no existe");
                        res.status(404).send("El usuario que intentas eliminar no existe");
                        return;
                    }
        
                    // Si el usuario existe, procede con la eliminación
                    let sqlDelete = "DELETE FROM pasantes.users WHERE usuario = ?";
                    con.query(sqlDelete, [usuario], function (err, result) {
                        if (err) {
                            console.error("Error al eliminar el registro:", err);
                            res.status(500).send("Error interno del servidor");
                            return;
                        }
                        
                        console.log("Registro eliminado exitosamente");
                        res.render("exito10", { usuario: usuario });
                    });
                });
            });
        });
        

        this.app.get('/eliminarevento', (req, res) => {
            let mysql = require('mysql');
            const evento = req.query.evento;
        
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
            });
        
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
        
                // Consulta para verificar si el usuario existe
                let sqlSelect = "SELECT * FROM pasantes.calendario WHERE evento = ?";
                con.query(sqlSelect, [evento], function (err, result) {
                    if (err) {
                        console.error("Error al consultar la base de datos:", err);
                        res.status(500).send("Error interno del servidor");
                        return;
                    }
        
                    // Si no se encontraron registros, el usuario no existe
                    if (result.length === 0) {
                        console.log("El usuario no existe");
                        res.status(404).send("El usuario que intentas eliminar no existe");
                        return;
                    }
        
                    // Si el usuario existe, procede con la eliminación
                    let sqlDelete = "DELETE FROM pasantes.calendario WHERE evento = ?";
                    con.query(sqlDelete, [evento], function (err, result) {
                        if (err) {
                            console.error("Error al eliminar el registro:", err);
                            res.status(500).send("Error interno del servidor");
                            return;
                        }
                        
                        console.log("Registro eliminado exitosamente");
                        res.render("exito16", { evento: evento });
                    });
                });
            });
        });
        
       
        


        this.app.get('/lista', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");


                let unidad = req.session.usersession.unidad; 
                let sql = "SELECT * FROM pasantes.datos_pasantes WHERE unidad = '" + unidad + "' AND promocion = 'Promocion Agosto 2024'";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;

                    if (result.length === 0) {
                        console.log("El usuario no existe");
                        res.send("No hay pasantes registrados en esta Unidad");
                    } else {
                        console.log(result);
                        let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues})
                    res.render("listapasantes", { resultados: resultados, unidad: unidad });

                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/lista-users', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let password = req.query.password;
            let rol = req.query.rol;
          
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");


               
                let sql = "SELECT * FROM pasantes.users";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;

                    if (result.length === 0) {
                        console.log("No hay Usuarios registrados");
                        res.send("No hay usuarios registrados");
                    } else {
                        console.log(result);
                        let resultados = [
                        {usuario: result[0].usuario, password: result[0].password, rol: result[0].rol}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, password: result[i].password, rol: result[i].rol})
                    res.render("listausers", { resultados: resultados});

                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/lista-directores', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let password = req.query.password;
            let unidad = req.query.unidad;
            
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");


               
                let sql = "SELECT * FROM pasantes.director";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;

                    if (result.length === 0) {
                        console.log("El usuario no existe");
                        res.send("No hay usuarios registrados");
                    } else {
                        console.log(result);
                        let resultados = [
                        {usuario: result[0].usuario, password: result[0].password, unidad: result[0].unidad}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, password: result[i].password, unidad: result[i].unidad})
                    res.render("listadirectores", { resultados: resultados});

                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/lista-users', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let password = req.query.password;
            let rol = req.query.rol;
          
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");


               
                let sql = "SELECT * FROM pasantes.users";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;

                    if (result.length === 0) {
                        console.log("No hay Usuarios registrados");
                        res.send("No hay usuarios registrados");
                    } else {
                        console.log(result);
                        let resultados = [
                        {usuario: result[0].usuario, password: result[0].password, rol: result[0].rol}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, password: result[i].password, rol: result[i].rol})
                    res.render("listausers", { resultados: resultados});

                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/ver-jornadas', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let turno = req.query.turno;
            let horario = req.query.horario;
            
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");


               
                let sql = "SELECT * FROM pasantes.jornada";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;

                    if (result.length === 0) {
                        console.log("El usuario no existe");
                        res.send("No hay usuarios registrados");
                    } else {
                        console.log(result);
                        let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, turno: result[i].turno, horario: result[i].horario})
                    res.render("listajornadas", { resultados: resultados});

                }
    
                }); 
    
            });
            
        }
        );


        this.app.get('/consulta-incidencias2', (req, res) => {
            let mysql = require('mysql');
            let nombre = req.query.nombre;
            let departamento = req.query.departamento;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let mes = req.query.mes;
            let incidencia = req.query.incidencia;
            let motivo = req.query.motivo;
          
            
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let unidad = req.session.usersession.unidad; 
                let sql = "SELECT * FROM pasantes.incidencias WHERE unidad = '" + unidad + "' AND promocion = 'Promocion Agosto 2024'";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                 
                    if (result.length === 0) {
                        console.log("No hay datos que mostrar");
                        res.send("No hay datos que mostrar");
                    } else {
                        console.log(result);
                        let resultados = [
                            {nombre: result[0].nombre, departamento: result[0].departamento, promocion: result[0].promocion, unidad: result[0].unidad, mes: result[0].mes, incidencia: result[0].incidencia, motivo: result[0].motivo}
                        ];
    
                        for (let i=1 ; i < result.length; i ++)
                            resultados.push({nombre: result[i].nombre, departamento: result[i].departamento, promocion: result[i].promocion, unidad: result[i].unidad, mes: result[i].mes, incidencia: result[i].incidencia, motivo: result[i].motivo})
                        res.render("consultaincidencias2", { resultados: resultados, unidad: unidad });
                    }
    
                }); 
    
            });
            
        }
        );  

       


        this.app.get('/consulta-incidencias', (req, res) => {
            let mysql = require('mysql');
            let nombre = req.query.nombre;
            let departamento = req.query.departamento;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let mes = req.query.mes;
            let inicidencia = req.query.incidencia;
            let motivo = req.query.motivo;
          
            
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT * FROM pasantes.incidencias WHERE unidad = '" + unidad + "' AND promocion = 'Promocion Agosto 2024'";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay datos que mostrar");
                        res.send("No hay datos que mostrar");
                    } else {
                    let resultados = [
                        {nombre: result[0].nombre, departamento: result[0].departamento, promocion: result[0].promocion, unidad: result[0].unidad, mes: result[0].mes, inicidencia: result[0].incidencia, motivo: result[0].motivo}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({nombre: result[i].nombre, departamento: result[i].departamento, promocion: result[i].promocion, unidad: result[i].unidad, mes: result[i].mes, incidencia: result[i].incidencia, motivo: result[i].motivo})
                    res.render("consultaincidencias", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );  


        this.app.get('/guardarincidencias1', (req, res) => {
            let mysql = require('mysql');
            let nombre = req.query.nombre;
            let departamento = req.query.departamento;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let mes = req.query.mes;
            let incidencia = req.query.incidencia;
            let motivo = req.query.motivo;
         
        
            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "nancy1234",
              database: "pasantes"
            });
            
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
              
                let sql = "INSERT INTO pasantes.incidencias VALUES ('"+ nombre +"', '" + departamento + "','" + promocion + "', '" + unidad + "', '" + mes + "', '" + incidencia + "', '" + motivo + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render("exito9", { nombre: nombre});
    
                
                });
            });
    
        });


        this.app.get('/guardarincidencias', (req, res) => {
            let mysql = require('mysql');
            let nombre = req.query.nombre;
            let departamento = req.query.departamento;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let mes = req.query.mes;
            let incidencia = req.query.incidencia;
            let motivo = req.query.motivo;
         
        
            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "nancy1234",
              database: "pasantes"
            });
            
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
              
                let sql = "INSERT INTO pasantes.incidencias VALUES ('"+ nombre +"', '" + departamento + "','" + promocion + "', '" + unidad + "', '" + mes + "', '" + incidencia + "', '" + motivo + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render("exito8", { nombre: nombre});
    
                
                });
            });
    
        }); 

        this.app.get('/medicina', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Febrero 2025' AND datos.departamento = 'Medicina' ";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    console.log(result);
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                        let resultados = [
                            {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                        ];
    
                        for (let i=1 ; i < result.length; i ++)
                            resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues,  turno: result[i].turno, horario: result[i].horario})
                        res.render("tablamedicina", { resultados: resultados });
    
                    }
                }); 
    
            });
            
        }
        );

        this.app.get('/psicologia', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Agosto 2024' AND datos.departamento = 'Psicología' ";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablapsicologia", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );


        this.app.get('/psicologia1', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Febrero 2025' AND datos.departamento = 'Psicología' ";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablapsicologia1", { resultados: resultados });
                    }
    
                }); 
    
            });
            
        }
        );


        this.app.get('/enfermeria1', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Febrero 2025' AND datos.departamento = 'Enfermeria'";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablaenfermeria1", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/odontologia1', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Febrero 2025' AND datos.departamento = 'Odontología'";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablaodontologia1", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/radiologia1', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Febrero 2025' AND datos.departamento = 'Radiología'";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablaradiologia1", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/nutricion1', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Febrero 2025' AND datos.departamento = 'Nutrición'";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablanutricion1", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/terapia1', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Febrero 2025' AND datos.departamento = 'Terapia Física'";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablaterapia1", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/general1', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Febrero 2025' ORDER BY datos.departamento";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablageneral1", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

       
        this.app.get('/datos', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT * FROM pasantes.datos_pasantes WHERE usuario = '" + usuario + "'";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay datos de pasante");
                        res.send("Aun no has ingresado tus datos");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion:[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                        resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues})
                        res.render("verdatos", { resultados: resultados });
                    }
    
                }); 
    
            });
            
        }
        ); 
        
        this.app.get('/consulta-asistencia', (req, res) => {
            let mysql = require('mysql');
            let nombre = req.query.nombre;
            let departamento = req.query.departamento;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let mes = req.query.mes;
            let faltas = req.query.faltas;
            let retardos = req.query.retardos;
            let incidencias = req.query.incidencias; // Corregido
            let notas_malas = req.query.notas_malas;
            let periodo = req.query.periodo;
        
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
            });
        
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
        
                
                let sql = "SELECT * FROM pasantes.asistencia WHERE unidad = '" + unidad + "' AND promocion = 'Promocion Agosto 2024'"; // Corregido
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                 
                        console.log(result);
                        let resultados = [];
        
                        for (let i = 0; i < result.length; i++) // Corregido
                            resultados.push({
                                nombre: result[i].nombre,
                                departamento: result[i].departamento,
                                promocion: result[i].promocion,
                                unidad: result[i].unidad,
                                mes: result[i].mes,
                                faltas: result[i].faltas,
                                retardos: result[i].retardos,
                                incidencias: result[i].incidencias, // Corregido
                                notas_malas: result[i].notas_malas,
                                periodo: result[i].periodo
                            });
                        res.render("consultaasistencia", { resultados: resultados, unidad: unidad });
                    
        
                }); 
        
            });
        
        });
        

        
        this.app.get('/consulta-asistencia2', (req, res) => {
            let mysql = require('mysql');
            let nombre = req.query.nombre;
            let departamento = req.query.departamento;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let mes = req.query.mes;
            let faltas = req.query.faltas;
            let retardos = req.query.retardos;
            let incidencias = req.query.incidencias; // Corregido
            let notas_malas = req.query.notas_malas;
            let periodo = req.query.periodo;
        
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
            });
        
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
        
                let unidad = req.session.usersession.unidad; 
                let sql = "SELECT * FROM pasantes.asistencia WHERE unidad = '" + unidad + "' AND promocion = 'Promocion Agosto 2024'"; // Corregido
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay registros de Asistencia");
                        res.send("No hay registros de Asistencia");
                    } else {
                        console.log(result);
                        let resultados = [];
        
                        for (let i = 0; i < result.length; i++) // Corregido
                            resultados.push({
                                nombre: result[i].nombre,
                                departamento: result[i].departamento,
                                promocion: result[i].promocion,
                                unidad: result[i].unidad,
                                mes: result[i].mes,
                                faltas: result[i].faltas,
                                retardos: result[i].retardos,
                                incidencias: result[i].incidencias, // Corregido
                                notas_malas: result[i].notas_malas,
                                periodo: result[i].periodo
                            });
                        res.render("consultaasistencia2", { resultados: resultados, unidad: unidad });
                    }
        
                }); 
        
            });
        
        });
        

        this.app.get('/general', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Agosto 2024' ORDER BY datos.departamento";


                
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablageneral", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/odontologia', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Agosto 2024' AND datos.departamento = 'Odontología' ";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablaodontologia", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/radiologia', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Agosto 2024' AND datos.departamento = 'Radiología' ";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablaradiologia", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/nutricion', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Agosto 2024' AND datos.departamento = 'Nutrición' ";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablanutricion", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/terapia', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Agosto 2024' AND datos.departamento = 'Terapia Física' ";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablaterapia", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/actualizar-contrasena', (req, res) => {
            const newData = req.query.newValue;
            const mysql = require('mysql');
            const usuario = req.query.usuario;
            const password = req.query.password;
             
            const con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
              });

            con.connect(function(err) {
                if (err) {
                console.log("Error de conexion a la base de datos: ", err);
                res.status(500).send('Error de conexión a la base de datos');
                return;
            }

            console.log("¡Conectado!");
          
            const sql = `UPDATE users SET
                usuario = '${usuario}',
                password = '${password}'
                WHERE usuario = '${usuario}'`;

            con.query(sql, (error, results) => {
                if (error) {
                  console.log('Error al actualizar el registro:', error);
                  res.status(500).send('Error al actualizar el registro');
                } else {
                  console.log('Registro actualizado correctamente');
                  res.render("exito6", { usuario: usuario});
                }
              });
            });  
        });

        this.app.get('/actualizar-jornada', (req, res) => {
            const newData = req.query.newValue;
            const mysql = require('mysql');
            const usuario = req.query.usuario;
            const turno = req.query.turno;
            const horario = req.query.horario;
        
             
            const con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
              });

            con.connect(function(err) {
                if (err) {
                console.log("Error de conexion a la base de datos: ", err);
                res.status(500).send('Error de conexión a la base de datos');
                return;
            }

            console.log("¡Conectado!");
          
            const sql = `UPDATE jornada SET
                usuario = '${usuario}',
                turno = '${turno}',
                horario = '${horario}'
                WHERE usuario = '${usuario}'`;

            con.query(sql, (error, results) => {
                if (error) {
                  console.log('Error al actualizar el registro:', error);
                  res.status(500).send('Error al actualizar el registro');
                } else {
                  console.log('Registro actualizado correctamente');
                  res.render("exito14", { usuario: usuario});
                }
              });
            });  
        });

        this.app.get('/actualizar-jornada2', (req, res) => {
            const newData = req.query.newValue;
            const mysql = require('mysql');
            const usuario = req.query.usuario;
            const turno = req.query.turno;
            const horario = req.query.horario;
        
             
            const con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
              });

            con.connect(function(err) {
                if (err) {
                console.log("Error de conexion a la base de datos: ", err);
                res.status(500).send('Error de conexión a la base de datos');
                return;
            }

            console.log("¡Conectado!");
          
            const sql = `UPDATE jornada SET
                usuario = '${usuario}',
                turno = '${turno}',
                horario = '${horario}'
                WHERE usuario = '${usuario}'`;

            con.query(sql, (error, results) => {
                if (error) {
                  console.log('Error al actualizar el registro:', error);
                  res.status(500).send('Error al actualizar el registro');
                } else {
                  console.log('Registro actualizado correctamente');
                  res.render("exito15", { usuario: usuario});
                }
              });
            });  
        });

        this.app.get('/actualizar-contrasena2', (req, res) => {
            const newData = req.query.newValue;
            const mysql = require('mysql');
            const usuario = req.query.usuario;
            const password = req.query.password;
             
            const con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
              });

            con.connect(function(err) {
                if (err) {
                console.log("Error de conexion a la base de datos: ", err);
                res.status(500).send('Error de conexión a la base de datos');
                return;
            }

            console.log("¡Conectado!");
          
            const sql = `UPDATE director SET
                usuario = '${usuario}',
                password = '${password}'
                WHERE usuario = '${usuario}'`;

            con.query(sql, (error, results) => {
                if (error) {
                  console.log('Error al actualizar el registro:', error);
                  res.status(500).send('Error al actualizar el registro');
                } else {
                  console.log('Registro actualizado correctamente');
                  res.render("exito7", { usuario: usuario});
                }
              });
            });  
        });

        this.app.get('/asistencia_pasantes', (req, res) => {
            let mysql = require('mysql');
            let nombre = req.query.nombre;
            let departamento = req.query.departamento;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let mes = req.query.mes;
            let faltas = req.query.faltas;
            let retardos = req.query.retardos;
            let inicidencias = req.query.incidencias;
            let notas_malas = req.query.notas_malas;
            let periodo = req.query.periodo;
            
        
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
            });
        
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
        
                let sql = "SELECT * FROM pasantes.asistencia WHERE nombre = '" + nombre + "'";
                con.query(sql, function(err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("El usuario no existe");
                        res.send("El nombre no esta en la base de datos");
                    } else {
                        console.log(result);
                        let resultados = [];
        
                        for (let i = 0; i < result.length; i++)
                            resultados.push({
                                nombre: result[i].nombre,
                                departamento: result[i].departamento,
                                promocion: result[i].promocion,
                                unidad: result[i].unidad,
                                mes: result[i].mes,
                                faltas: result[i].faltas,
                                retardos: result[i].retardos,
                                inicidencias: result[i].inicidencias,
                                notas_malas: result[i].notas_malas,
                                periodo: result[i].periodo
                               
                            });
                        res.render("vistaasistencia", {
                            resultados: resultados
                        });
                    }
                });
        
            });
        
        });
        
        

        this.app.get('/guardarasistencia2', (req, res) => {
            let mysql = require('mysql');
            let nombre = req.query.nombre;
            let departamento = req.query.departamento;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let mes = req.query.mes;
            let faltas = req.query.faltas;
            let retardos = req.query.retardos;
            let inicidencias = req.query.incidencias;
            let notas_malas = req.query.notas_malas;
            let periodo = req.query.periodo;
            
           
            
            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "nancy1234",
              database: "pasantes"
            });
            
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
              
                let sql = "INSERT INTO pasantes.asistencia VALUES ('"+ nombre +"', '" + departamento + "','" + promocion + "', '" + unidad + "', '" + mes + "', '" + faltas + "', '" + retardos + "', '" + inicidencias + "', '" + notas_malas + "', '" + periodo + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render("exito5", { nombre: nombre});
    
                
                });
            });
    
        }); 

        this.app.get('/guardarasistencia', (req, res) => {
            let mysql = require('mysql');
            let nombre = req.query.nombre;
            let departamento = req.query.departamento;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let mes = req.query.mes;
            let faltas = req.query.faltas;
            let retardos = req.query.retardos;
            let inicidencias = req.query.incidencias;
            let notas_malas = req.query.notas_malas;
            let periodo = req.query.periodo;
           
           
            
            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "nancy1234",
              database: "pasantes"
            });
            
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
              
                let sql = "INSERT INTO pasantes.asistencia VALUES ('"+ nombre +"', '" + departamento + "','" + promocion + "', '" + unidad + "', '" + mes + "',  '" + faltas + "', '" + retardos + "', '" + inicidencias + "', '" + notas_malas + "', '" + periodo + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render("exito4", { nombre: nombre});
    
                
                });
            });
    
        }); 

        this.app.get('/enfermeria', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Agosto 2024' AND datos.departamento = 'Enfermeria' ";
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                    console.log(result);
                    let resultados = [
                        {usuario: result[0].usuario, nombre: result[0].nombre, rfc: result[0].rfc, curp: result[0].curp, sexo: result[0].sexo, estadocivil: result[0].estadocivil, calle_numero: result[0].calle_numero, colonia: result[0].colonia, codigopostal: result[0].codigopostal, delegacion: result[0].delegacion, clabeban: result[0].clabeban, banco: result[0].banco, promocion: result[0].promocion, unidad: result[0].unidad, departamento: result[0].departamento, plaza: result[0].plaza, clues: result[0].clues, turno: result[0].turno, horario: result[0].horario}
                    ];
    
                    for (let i=1 ; i < result.length; i ++)
                         resultados.push({usuario: result[i].usuario, nombre: result[i].nombre, rfc: result[i].rfc, curp: result[i].curp, sexo: result[i].sexo, estadocivil: result[i].estadocivil, calle_numero: result[i].calle_numero, colonia: result[i].colonia, codigopostal: result[i].codigopostal, delegacion: result[i].delegacion, clabeban: result[i].clabeban, banco: result[i].banco, promocion: result[i].promocion, unidad: result[i].unidad, departamento: result[i].departamento, plaza: result[i].plaza, clues: result[i].clues, turno: result[i].turno, horario: result[i].horario})
                    res.render("tablaenfermeria", { resultados: resultados });
                }
    
                }); 
    
            });
            
        }
        );

        this.app.get('/actualizar-dato', (req, res) => {
            const newData = req.query.newValue;
            const mysql = require('mysql');
            const usuario = req.query.usuario;
            const nombre = req.query.nombre;
            const rfc = req.query.rfc;
            const curp = req.query.curp;
            const sexo = req.query.sexo;
            const estadocivil = req.query.estadocivil;
            const calle_numero = req.query.calle_numero;
            const colonia = req.query.colonia;
            const codigopostal = req.query.codigopostal;
            const delegacion = req.query.delegacion;
            const clabeban = req.query.clabeban;
            const banco = req.query.banco;
            const unidad = req.query.unidad;
            const departamento = req.query.departamento;
            const plaza = req.query.plaza;
            const clues = req.query.clues;
       

               
            const con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
              });

            con.connect(function(err) {
                if (err) {
                console.log("Error de conexion a la base de datos: ", err);
                res.status(500).send('Error de conexión a la base de datos');
                return;
            }

            console.log("¡Conectado!");
          
            const sql = `UPDATE datos_pasantes SET
                usuario = '${usuario}',
                nombre = '${nombre}',
                rfc = '${rfc}',
                curp = '${curp}',
                sexo = '${sexo}',
                estadocivil = '${estadocivil}',
                calle_numero = '${calle_numero}',
                colonia = '${colonia}', 
                codigopostal = '${codigopostal}',
                delegacion = '${delegacion}',
                clabeban = '${clabeban}',
                banco = '${banco}',
                unidad = '${unidad}',
                departamento = '${departamento}',
                plaza = '${plaza}',
                clues = '${clues}'
                WHERE usuario = '${usuario}'`;

            con.query(sql, (error, results) => {
                if (error) {
                  console.log('Error al actualizar el registro:', error);
                  res.status(500).send('Error al actualizar el registro');
                } else {
                  console.log('Registro actualizado correctamente');
                  res.render("exito3", { usuario: usuario});
                }
              });
            });  
        });


       
        this.app.get('/registro', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let password = req.query.password;
            let rol = req.query.rol;
            
            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "nancy1234",
              database: "pasantes"
            });
            
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");

                let checkSql = "SELECT * FROM users WHERE usuario = '"+ usuario +"'";
                con.query(checkSql, [usuario], function (err, result) {
                    if (err) throw err;

                    if (result.length > 0) {
                    // El usuario ya existe, mostrar mensaje de error
                    console.log("El usuario ya está registrado");
                    res.render("error1", { error: "El usuario ya está registrado" });

                } else {
              
                let sql = "INSERT INTO pasantes.users VALUES ('"+ usuario +"', '" + password + "','" + rol + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render("exito", { usuario: usuario});
    
                
                });
            }
            
            
            });
            
        });
    
        }); 



        this.app.get('/guardardatos', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "nancy1234",
              database: "pasantes"
            });
            
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
              
                let sql = "INSERT INTO pasantes.datos_pasantes VALUES ('"+ usuario +"', '" + nombre + "','" + rfc + "', '" + curp + "', '" + sexo + "', '" + estadocivil + "', '" + calle_numero + "', '" + colonia + "', '" + codigopostal + "', '" + delegacion + "', '" + clabeban + "', '" + banco + "', '" + promocion + "','" + unidad + "', '" + departamento + "', '" + plaza + "', '" + clues + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render("exito2", { usuario: usuario});
    
                
                });
            });
    
        }); 

        this.app.get('/guardardatos2', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "nancy1234",
              database: "pasantes"
            });
            
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
              
                let sql = "INSERT INTO pasantes.datos_pasantes VALUES ('"+ usuario +"', '" + nombre + "','" + rfc + "', '" + curp + "', '" + sexo + "', '" + estadocivil + "', '" + calle_numero + "', '" + colonia + "', '" + codigopostal + "', '" + delegacion + "', '" + clabeban + "', '" + banco + "', '" + promocion + "','" + unidad + "', '" + departamento + "', '" + plaza + "', '" + clues + "')";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render("exito11", { usuario: usuario});
    
                
                });
            });
    
        }); 

        this.app.get('/consulta', (req, res) => {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let nombre = req.query.nombre;
            let rfc = req.query.rfc;
            let curp = req.query.curp;
            let sexo = req.query.sexo;
            let estadocivil = req.query.estadocivil;
            let calle_numero = req.query.calle_numero;
            let colonia = req.query.colonia;
            let codigopostal = req.query.codigopostal;
            let delegacion = req.query.delegacion;
            let clabeban = req.query.clabeban;
            let banco = req.query.banco;
            let promocion = req.query.promocion;
            let unidad = req.query.unidad;
            let departamento = req.query.departamento;
            let plaza = req.query.plaza;
            let clues = req.query.clues;
            
    
    
            let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "nancy1234",
                database: "pasantes"
                
            });
    
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
    
                let sql = "SELECT datos.*, jornada.turno, jornada.horario FROM pasantes.datos_pasantes AS datos JOIN pasantes.jornada AS jornada ON datos.usuario = jornada.usuario WHERE datos.promocion = 'Promocion Agosto 2024' AND datos.departamento = 'Medicina' ";
                
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    if (err) throw err;
                    if (result.length === 0) {
                        console.log("No hay pasantes en este departamento");
                        res.send("No hay pasantes en este departamento");
                    } else {
                        console.log(result);
                        let resultados = [
                            {usuario: result[0].usuario,
                                nombre: result[0].nombre,
                                rfc: result[0].rfc,
                                curp: result[0].curp,
                                sexo: result[0].sexo,
                                estadocivil: result[0].estadocivil,
                                calle_numero: result[0].calle_numero,
                                colonia: result[0].colonia,
                                codigopostal: result[0].codigopostal,
                                delegacion: result[0].delegacion,
                                clabeban: result[0].clabeban,
                                banco: result[0].banco,
                                promocion:[0].promocion,
                                unidad: result[0].unidad,
                                departamento: result[0].departamento,
                                plaza: result[0].plaza,
                                clues: result[0].clues,
                                turno: result[0].turno,
                                horario: result[0].horario}
                            ];
    
                            for (let i=1 ; i < result.length; i ++)
                                resultados.push({usuario: result[i].usuario,
                                        nombre: result[i].nombre,
                                        rfc: result[i].rfc,
                                        curp: result[i].curp,
                                        sexo: result[i].sexo,
                                        estadocivil: result[i].estadocivil,
                                        calle_numero: result[i].calle_numero,
                                        colonia: result[i].colonia,
                                        codigopostal: result[i].codigopostal,
                                        delegacion: result[i].delegacion,
                                        clabeban: result[i].clabeban,
                                        banco: result[i].banco,
                                        promocion: result[i].promocion,
                                        unidad: result[i].unidad,
                                        departamento: result[i].departamento,
                                        plaza: result[i].plaza,
                                        clues: result[i].clues,
                                        turno: result[i].turno,
                                        horario: result[i].horario})
                            res.render("tabladatos", { resultados: resultados });
                        }

                    }); 
            
    
            });
            
        }
        );    
   
        this.app.get('/login', (req, res)=> {
            let mysql = require('mysql');
            let usuario = req.query.usuario;
            let password = req.query.password;
            let rol = req.query.rol;
         
           

            let con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "nancy1234",
            database: "pasantes"
        });
        
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            console.log(usuario);

            let sql = "select * FROM users WHERE usuario ='"+ usuario +"'";
             con.query(sql, function (err, result) {
                if (err) throw err;
                 if(result.length>0){
                    if(result[0].password==password && result[0].rol==rol)
                        {
                            console.log("Welcome" + usuario);
                            let usersession = {
                                nam: usuario,
                                rol: result[0].rol,

                            };
                            req.session.usersession = usersession;
                            req.session.save();

                            let userDataSql = "SELECT * FROM pasantes.datos_pasantes WHERE usuario = '"+ usuario +"'";
                            con.query(userDataSql, function (err, userDataResult) {
                                if (err) throw err;

                           
                                if (result[0].rol === 'pasante') {
                                    console.log(result);
                                    res.render("inicioSesionPasante", { usuario: usuario });
                            
                            }else if (result[0].rol === 'coordinador') {
                                        res.render("inicioSesionCoordinar",  { usuario: usuario });

                           
                            }

                        });
                    
                }
                else
                {
                console.log("Password incorrecto");
                res.render("error", {error: "Contraseña o rol incorrecto"});
                }
        }
        else 
        {
        console.log("El Usuario no existe");
        res.render("error", {error: "El Usuario no existe"});
        } 

    });


    


    

});

});
  

}


    listen (){
        this.app.listen( this.port, () => {
            console.log('Escuchando en: http://127.0.0.1:' + this.port);
        
        })};


}

module.exports = Server;



