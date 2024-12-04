var express = require("express");
var router = express.Router();
const {createDog, getLostDogs } = require("../db/tables/dogs");

// Middleware para verificar si el usuario ha iniciado sesión
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
      return next();
  } else {
      res.redirect('/login'); // Redirige al usuario a la página de inicio de sesión si no ha iniciado sesión
  }
}

router.get("/", async function (req, res, next) {
  try {
    const lostDogs = await getLostDogs(); // Obtener los perros perdidos
    const renderData = {
      title: "Perros perdidos",
      user: req.session.user,
      lost_dogs: lostDogs, // Pasar la lista de perros perdidos al template
      script: ""
    };

    if (req.session.user) {
      Object.assign(renderData, {
        navbar_addr1: "/profile",
        navbar_addr2: "/profile",
        navbar_addr3: "/profile",
        navbar_addr4: "/logout",

        navbar_item1: "Profile",
        navbar_item2: "Pets",
        navbar_item3: "Settings",
        navbar_item4: "Logout",

        sub_navbar_add1: "/dog",
        sub_navbar_add2: "/edit_dog_profile",
        sub_navbar_add3: "/feed_lostdog",
        sub_navbar_add4: "/edit_user_profile",
        sub_navbar_add5: "/edit_user_photo",

        sub_navbar_item1: "My Pet",
        sub_navbar_item2: "Add Pet",
        sub_navbar_item3: "Lost Dogs",
        sub_navbar_item4: "Edit Profile",
        sub_navbar_item5: "Edit Photo"
      });
    } else {
      Object.assign(renderData, {
        navbar_addr1: "/",
        navbar_addr2: "/",
        navbar_addr3: "/login",
        navbar_addr4: "/register",
        navbar_addr5: "/about_us",
        navbar_addr6: "/contact_us",
          
        navbar_item1: "Home",
        navbar_item2: "Blog",
        navbar_item3: "Login",
        navbar_item4: "Register",
        navbar_item5: "About Us",
        navbar_item6: "Contact",
          
        sub_navbar_add1: "/feed_lostdog",
        sub_navbar_add2: "/dog_food_advice",
        sub_navbar_add3: "/dog_vision",
        sub_navbar_add4: "/ranking",
        sub_navbar_add5: "/test_duenno",
        sub_navbar_item1: "Perros perdidos",
        sub_navbar_item2: "Alimentación y Nutrición",
        sub_navbar_item3: "Simulador de visión perruna",
        sub_navbar_item4: "Rankings",
        sub_navbar_item5: "Test de dueño",

      });
    }

    res.render("feed_lostdog", renderData);
  } catch (error) {
    console.error("Error al obtener los perros perdidos", error);
    res.status(500).send("Error al cargar la página de perros perdidos");
  }
});

/* POST edit_dog_profile page. */
router.post('/', isAuthenticated, async function(req, res, next) {
  const { nombrePerro, edadPerro, pesoPerro, sexo, raza } = req.body;
  const dog = {
      name: nombrePerro,
      breed: raza,
      age: new Date().getFullYear() - new Date(edadPerro).getFullYear(), // Calculate age from birth date
      weight: pesoPerro,
      colour: "",
      sex: sexo,
      owner_id: req.session.user.id, // Assuming user ID is stored in session
      photo_dog_perdido: "", // Assuming photo is not provided in the form
  };

  try {
      await createDog(dog);
      res.redirect('/profile'); // Redirect to home or any other page after successful creation
  } catch (error) {
      console.error('Error al crear el perro', error);
      res.status(500).send('Error al crear el perro');
  }
});

module.exports = router;
