// --------------------
// ------- PUERTO -----
// --------------------

process.env.PORT = process.env.PORT || 3000;

// --------------------
// ------- ENTORNO-----
// --------------------

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ------------------------
// ------- BASE DATOS -----
// ------------------------

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://scann258:Scann@258@cursonodejs-0i51y.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;