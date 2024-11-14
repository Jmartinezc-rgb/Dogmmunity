// Librerías requeridas
const path = require("path");
const logger = require("morgan");
const bcrypt = require("bcryptjs");
const express = require('express');
const session = require("express-session");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

// Módulos propios de la aplicación
const dbConnect = require("./db/connect.js");

// Esto habrá que cargarselo
const userController = require('./controllers/authentication.js'); 
const User = require('./models/user.js');
const dogController = require('./controllers/dog_data.js');
const Perro = require('./models/dog'); 


let indexRouter = require("./routes/index");
let loginRouter = require("./routes/login");
let registerRouter = require("./routes/register");
let restrictedRouter = require("./routes/restricted");
let profileRouter = require("./routes/profile");
let dogRouter = require("./routes/dog");

// Conexión a MongoDB
dbConnect();

// Server Settings
let app = express();
//app.set("port", 3000); 
// app.listen(app.get("port"));
//console.log("Servidor corriendo en el puerto", app.get("port"));

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(
  session({
    secret: "dogmmunity-session",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Indica si la cookie debe ser enviada solo a través de conexiones HTTPS.
  })
);


app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/profile", profileRouter);
app.use("/dog", dogRouter);
app.use("/restricted", restrictedRouter);
app.use("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


//Comprobar si el usuario ha iniciado sesión
function checkLogin(req, res, next){
  if(req.session.user){
    next();
  } else {
    res.redirect('login');
  }
}

// 404 error
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//////////////////////////////////////////////////////////////////////////////////////////////////

// Rutas con EJS

/*
app.get("/", (req, res) => res.render('index'));
app.get("/login", (req, res) => res.render('inicio_sesion'));
app.get("/register", (req, res) => res.render('registro'));

app.get("/perfil_perro", async (req, res) => {
    if (req.session.user) {
        try {
            const perro = await Perro.findOne({ dueno: req.session.user.user });
            if (!perro) {
                return res.status(404).send("No se encontró el perro");
            }
            res.render('perfil_perro', { perro });
        } catch (error) {
            console.error("Error al cargar datos del perro:", error);
            res.status(500).send("Error al cargar datos del perro");
        }
    } else {
        res.redirect('/login');
    }
});

// Ruta del perfil con EJS
app.get("/perfil", (req, res) => {
    if (req.session.user) {
        res.render('perfil', { 
            username: req.session.user.user,
            email: req.session.user.email,
            photo: req.session.user.photo
        }); // Pasamos el nombre de usuario al EJS
    } else {
        res.redirect('/login');
    }
});

app.get("/edit", (req, res) => res.render('editar_perfil'));
app.get("/perro", (req, res) => res.render('form_perro'));
app.get("/sesion_cerrada", (req, res) => res.render('sesion_cerrada'));

// Nuevas rutas POST para manejo de formularios
app.post('/edit', userController.updateUserPassword);
app.post('/register', userController.registerUser);
app.post('/login', userController.loginUser);
app.post('/perro', dogController.registerDog);

// Ruta para modificar la foto de perfil
app.get("/modificarFoto", (req, res) => {
    if (req.session.user) {
        res.render('modificar_foto'); // Renderiza el archivo modificar_foto.ejs
    } else {
        res.redirect('/login'); // Redirige a login si no hay sesión
    }
});

// Ruta para guardar la foto de perfil
app.post('/guardarFotoPerfil', (req, res) => {
    const { fotoPerfil } = req.body; // Extrae la foto seleccionada del cuerpo de la solicitud

    // Verifica que el usuario esté autenticado
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).send('Usuario no autenticado');
    }

    // Actualiza el campo photo del usuario autenticado
    User.findByIdAndUpdate(req.session.user.id, { photo: fotoPerfil }, { new: true }) // Usa new: true para devolver el documento actualizado
        .then(updatedUser => {
            if (updatedUser) {
                console.log('Usuario actualizado:', updatedUser); // Imprime el usuario actualizado
                // res.status(200).send('Foto de perfil actualizada con éxito');
                req.session.user.photo = updatedUser.photo;
                res.redirect('/perfil');
            } else {
                res.status(404).send('Usuario no actualizado');
            }
        })
        .catch(err => {
            console.error('Error al actualizar la foto de perfil:', err);
            res.status(500).send('Error al actualizar la foto de perfil. Por favor, intenta nuevamente más tarde.');
        });
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error al destruir la sesión: ", err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.clearCookie('connect.sid', { path: '/' }); // Limpia la cookie de la sesión
        res.status(200).send('Sesión cerrada correctamente');
    });
});

*/