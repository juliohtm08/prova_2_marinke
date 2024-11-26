const express = require("express");
const routes = require("./routes/routes");
//ADD SOME DUMMY TO THE DB TO TEST THE CONNECTION

/* profileModel.create({
    firstName: "TEST_FIRSTNAME",
    lastname: "TEST_LASTNAME2",
    profession: "TEST_PROFESSION",
    balance: 10,
    type: "TEST_TYPE",
}); */

//inicializar express
const app = express();

app.use(express.json());

//Route Section

app.use(routes);

//configurar porta

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("**********************************");
    console.log(`SERVER RUNNING ON PORT ${port}`);
    console.log("**********************************");
});
