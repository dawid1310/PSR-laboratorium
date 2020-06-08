var cassandraDriver = require('cassandra-driver');
var client = new cassandraDriver.Client({
  contactPoints: ['localhost:9042'],
  localDataCenter: 'datacenter1'
});
const prompt = require('prompt-sync')();

/*client.connect(function(e) {
  var query;
  query = "CREATE KEYSPACE IF NOT EXISTS Policja WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3' }";
   client.execute(query, function(e, res) {

  });
});*/

async function selectAll() {
var query;
  query = "SELECT * FROM Biblioteka.Ksiazki";
   client.execute(query, function(e, res) {
    console.log("Wszystkie ksiazki:", res );
  });
}

async function addBook () {
  console.log('Dodaj nowa ksiazke')
  const id = prompt('Podaj id: ')
  const autor = prompt('Podaj autora: ')
  const tytul = prompt('Podaj tytul: ')
  const gatunek = prompt('Podaj gatunek: ')
  const oprawa = prompt('Podaj rodzaj oprawy: ')
  const liczbaStron = prompt('Podaj liczbe stron: ')
  const wydawnictwo = prompt('Podaj wydawnictwo: ')
  const miasto = prompt('Podaj miasto: ')
  const rok = prompt('Podaj rok: ')
  
    const query = [
      {
        query: 'INSERT INTO Biblioteka.Ksiazki(id, tytul, autor, gatunek, oprawa, liczbaStron, wydawnictwo, miasto, rok)  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        params: [ id, tytul, autor, gatunek, oprawa, liczbaStron, wydawnictwo, miasto, rok ]
      }
    ];
  try {
    await client.batch(query, { prepare: true });
    console.log('Dodano nowa ksiazke');
  } catch (error) {
  console.error(error)
  }
}

async function deleteBook () {
  console.log('Podaj id ksiazki do usuniecia: ')
  const id = prompt('ID: ')
    const query = [
      {
        query: 'DELETE FROM Biblioteka.Ksiazki WHERE ID = ?',
        params: [ id]
      }
    ];
  try {
    await client.batch(query, { prepare: true });
    console.log('Usunieto wybrana ksiazke');
  } catch (error) {
  console.error(error)
  }
}

async function updateBook () {
  console.log('Aktualizuj dane zatrzymanego')
  const id = prompt('Podaj id ksiazki do aktualizacji: ')
  const oprawa = prompt('Podaj rodzaj oprawy: ')
  const liczbaStron = prompt('Podaj liczbe stron: ')
  const wydawnictwo = prompt('Podaj wydawnictwo: ')
  const miasto = prompt('Podaj miasto: ')
  const rok = prompt('Podaj rok: ')

    const query = [
      {
        query: 'UPDATE Biblioteka.Ksiazki SET oprawa = ?, liczbaStron =?, wydawnictwo =?, miasto =?, rok=? WHERE ID = ?',
        params: [  oprawa, liczbaStron, wydawnictwo, miasto, rok, id ]
      }
    ];
  try {
    await client.batch(query, { prepare: true });
    console.log('Dane ksiazki zostaly zaktualizowane');
  } catch (error) {
  console.error(error)
  }
}

const selectId = async() => {
  const id = prompt('Podaj ID ksiazki: ')
  const query = 'SELECT * FROM Biblioteka.Ksiazki WHERE ID = ?';
  try {
    const result = await client.execute(query, [ id ], { prepare: true });
    const row = result.first();
    console.log('Ksiazka o wybranym ID:', row);
  } catch (error) {
  console.error(error)
  }
}

const selectAuthor = async() => {
  const autor = prompt('Podaj autora: ');
    const query = 'SELECT * FROM Biblioteka.Ksiazki WHERE autor = ? ALLOW FILTERING';   
    try {
      const result = await client.execute(query, [ autor ], { prepare: true });
      console.log('Ksiazki wybranego autora ', result);
    } catch (error) {
    console.error(error)
    }
}


Menu = () => {
  console.log('Biblioteka');
  console.log('1. Wyswietl wszystkie książki');
  console.log('2. Dodaj nową książkę');
  console.log('3. Usuń książkę');
  console.log('4. Aktualizuj dane książki');
  console.log('5. Wyszukaj po ID');
  console.log('6. Wyszukaj po Autorze');
  console.log('7. Wyjscie');
}

action = () => {
  const number = prompt('Wybrano: ');
  switch (parseInt(number)) {
    case 1:
      selectAll();
      break;
    case 2:
      addBook();
      break;
    case 3:
      deleteBook();
      break;
    case 4:
      updateBook();
      break;
    case 5:
      selectId();
      break;
    case 6:
      selectAuthor();        
      break; 
    case 7:
      break;
      default:
          break;
  }
}
Menu();
action();
  