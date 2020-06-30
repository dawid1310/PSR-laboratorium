var dbConfig = {}
dbConfig.endpoint = "wss://7d3cf767-0ee0-4-231-b9ee.gremlin.cosmos.azure.com:443/";
dbConfig.primaryKey = "67RYYp4anUAqTWQVuvAS2HkGYRF1SzTqIcWapF0ar0PsQcC1ffZpCS7RiVwAIvCIsSCgqWsiZ5N7QjPQG4Xntw==";
dbConfig.database = "ZOO"
dbConfig.collection = "zad4"
module.exports = dbConfig;


"use strict";

const Gremlin = require('gremlin');
const prompt = require('prompt-sync')();
const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${dbConfig.database}/colls/${dbConfig.collection}`, dbConfig.primaryKey)

const client = new Gremlin.driver.Client(
    
    dbConfig.endpoint, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }

);

function addAnimal()
{
    const identyfikator = prompt('Podaj id zwierzaczka: ');
    const imie = prompt('Podaj imie zwierzaczka: ');
    const wiek = prompt('Podaj wiek zwierzaczka: ');
    const gatunek = prompt('Podaj gatunek zwierzaczka: ');
    const rodzina = prompt('Podaj rodzine do ktorej nalezy zwierzaczek: ');
    const rzad = prompt('Podaj rzad do ktorego nalezy zwierzaczek: ');
    const gromada = prompt('Podaj gromade do ktorej nalezy zwierzaczek: ');
    const opiekunImie = prompt('Podaj imie opiekuna, ktory zajmuje sie zwierzaczkiem: ');
    const opiekunNazwisko = prompt('Podaj nazwisko opiekuna, ktory zajmuje sie zwierzaczkiem: ');
    const sektor = prompt('Podaj nazwe sektora w ktorym mieszka zwierzaczek: ');
    const id = gatunek+imie;
    opiekun=opiekunImie+opiekunNazwisko;
    return client.submit("g.addV('Zw').property('id', id).property('identyfikator', identyfikator).property('imie', imie).property('wiek', wiek).property('gatunek', gatunek).property('rodzina', rodzina).property('rzad', rzad).property('gromada', gromada)", {
        id: id,
        identyfikator: identyfikator,
        imie: imie,
        wiek: wiek,
        gatunek: gatunek,
        rodzina: rodzina,
        rzad: rzad,
        gromada: gromada
        })
        .then(createRelationship(opiekun, id, 'ZAJMUJE_SIE'))
        .then(createRelationship(id, sektor, 'MIESZKA_W'))
        .then(function (result) {
            console.log("\nDodano nowego zwierzaczka");
            dm();
        });
}


function addKeeper()
{
    const identyfikator = prompt('Podaj id opiekuna: ');
    const imie = prompt('Podaj imie opiekuna: ');
    const nazwisko = prompt('Podaj nazwisko opiekuna: ');
    const specjalizacja = prompt('Podaj gatunek specjalizacja: ');
    const id = imie+nazwisko;
    return client.submit("g.addV('Opiekun').property('id', id).property('identyfikator', identyfikator).property('imie', imie).property('nazwisko', nazwisko).property('specjalizacja', specjalizacja)", {
        id: id,
        identyfikator: identyfikator,
        imie: imie,
        nazwisko: nazwisko,
        specjalizacja: specjalizacja
        })
        .then(function (result) {
            console.log("\nDodano nowego opiekuna");
            dm();
        });
}


function addSector()
{
    const identyfikator = prompt('Podaj id sektora: ');
    const nazwa = prompt('Podaj nazwe sektora: ');
    const wielkosc = prompt('Podaj wielkosc sektora: ');
    const id = nazwa;
    return client.submit("g.addV('Sektor').property('id', id).property('identyfikator', identyfikator).property('nazwa', nazwa).property('wielkosc', wielkosc)", {
        id: id,
        identyfikator: identyfikator,
        nazwa: nazwa,
        wielkosc: wielkosc
        })
        .then(function (result) {
            console.log("\nDodano nowy sektor");
            dm();
        });
}


function createRelationship(from, to, relationship)
{
   return client.submit("g.V(from).addE(relationship).to(g.V(to))", {
            from:from, 
            relationship:relationship, 
            to: to
        }).then(function (result) {
            console.log("Dodano relacje");
    });
}

function selectAll(){

    return client.submit("g.V().hasLabel('Zw').values('identyfikator','id','imie','wiek','gatunek', 'rodzina', 'rzad', 'gromada')", { 
    }).then(function (result) {
        console.log("Result: ", result );
        dm();
    });
}

function deleteAnimal(){
    const id = prompt('Podaj id zwierzaczka do usunięcia: ');
    return client.submit("g.V().hasLabel('Zw').has('identyfikator', id).drop()", {
        id: id
        })
        .then(function (result) {
            console.log("Usunieto zwierzaczka");
            dm();
        });
}

function updateAnimal()
{
    const id = prompt('Podaj id zwierzaczka: ');
    const wiek = prompt('Podaj wiek zwierzaczka: ');
    return client.submit("g.V().hasLabel('Zw').has('identyfikator', id).property('wiek', wiek)", {
        id: id,
        wiek: wiek
        }).then(function (result) {
            console.log("\nZaktualizowane dane o zwierzaczku");
            dm();
        });
}

function selectId(){
    const id = prompt('Podaj id zwierzaczka: ');
    return client.submit("g.V().hasLabel('Zw').has('identyfikator',id).values('identyfikator','id','imie','wiek','gatunek', 'rodzina', 'rzad', 'gromada')", {
        id: id
    }).then(function (result) {
        console.log("Result: \n", result);
        dm();
    });
}

function selectKeeper(){
    const opiekunImie = prompt('Podaj imie opiekuna, ktory zajmuje sie zwierzaczkiem: ');
    const opiekunNazwisko = prompt('Podaj nazwisko opiekuna, ktory zajmuje sie zwierzaczkiem: ');
    opiekun=opiekunImie+opiekunNazwisko;
    return client.submit("g.V(opiekun).outE('ZAJMUJE_SIE').inV().hasLabel('Zw').values('identyfikator','id','imie','wiek','gatunek', 'rodzina', 'rzad', 'gromada')", {
        opiekun: opiekun
    }).then(function (result) {
        console.log("Result: \n", result);
        dm();
    });
}



Menu = () => {
    console.log('\nZOO');
    console.log('0. Dodaj sektor');
    console.log('1. Dodaj zwierzaczka');
    console.log('2. Dodaj opiekuna');
    console.log('3. Usuń zwierzaczka');
    console.log('4. Aktualizuj dane zwierzaczka');
    console.log('5. Wyswietl wszystkie zwierzaczki');
    console.log('6. Wyszukaj zwierzaczka po ID');
    console.log('7. Wyszukaj zwierzaczka po opiekunie');
    console.log('8. Wyjscie');
  }
  
  action = () => {
    const number = prompt('Wybrano: ');
    console.log('\n');
    switch (parseInt(number)) {
        case 0:
            addSector();
            break;
      case 1:
        addAnimal();
        break;
      case 2:
        addKeeper();
        break;
      case 3:
        deleteAnimal();
        break;
      case 4:
        updateAnimal();
        break;
      case 5:
        selectAll();

        break;
      case 6: 
        selectId();      
        break; 
      case 7:
        selectKeeper();
        break;
    case 8:
        stopProgram();
        break;
    default:
        stopProgram();
        break;
    }
  }

  async function dm(){
    
    Menu();
    action();
  }

  async function stopProgram(){
    console.log("Zakończono");
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
    process.exit();
  }

  dm();