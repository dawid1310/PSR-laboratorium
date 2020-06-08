var storageAccount = 'kosmaladawid'
var accessKey= 'ZS3DGSXE3b5mocyLKn3oc1eIZjtO3VLX3krt3uIl59FYZJYCBD8YJ5br2ZnaMCdeN05wfXyUKmG3pVP9S9H+lg=='
var azure = require('azure-storage');
var biblioteka = azure.createTableService(storageAccount,accessKey);
const prompt = require('prompt-sync')();

async function addSomeBooks() {
var task1 = {
    PartitionKey: {'_':'Fantasy'},
    RowKey: {'_': '1'},
    autor: {'_': 'Tolkien'},
    tytul: {'_':'Silmatillion'},
    oprawa: {'_':'twarda'},
    liczbaStron: {'_':'481'},
    wydawnictwo: {'_':'Media Rodzina'},
    miasto: {'_':'Kielce'},
    rok: {'_':'2016'}
  };

var task2 = {
    PartitionKey: {'_':'Horror'},
    RowKey: {'_': '2'},
    autor: {'_':'Lovecraft'},
    tytul: {'_':'Zgroza w Dunwich'},
    oprawa: {'_':'twarda'},
    liczbaStron: {'_':'792'},
    wydawnictwo: {'_':'Vesper'},
    miasto: {'_':'Poznań'},
    rok: {'_':'2013'}
  };

var task3 = {
    PartitionKey: {'_':'Horror'},
    RowKey: {'_': '3'},
    autor: {'_':'Lovecraft'},
    tytul: {'_':'Przyszła na Sarnath zagłada'},
    oprawa: {'_':'twarda'},
    liczbaStron: {'_':'632'},
    wydawnictwo: {'_':'Vesper'},
    miasto: {'_':'Poznań'},
    rok: {'_':'2016'}
  };

  biblioteka.insertEntity('ksiazki', task1, {echoContent: true}, function (error, result, response) {
    if(!error){ console.log("Insert wykonany poprawnie");}});
    biblioteka.insertEntity('ksiazki', task2, {echoContent: true}, function (error, result, response) {
    if(!error){ console.log("Insert wykonany poprawnie");}});
    biblioteka.insertEntity('ksiazki', task3, {echoContent: true}, function (error, result, response) {
    if(!error){ console.log("Insert wykonany poprawnie");}});
}


async function selectAll() {
    var query = new azure.TableQuery();
    try {
        biblioteka.queryEntities('ksiazki',query, null, function(error, result, response) {
            if(!error) {
                console.log('Ksiazki  ', result.entries)
            }
          });
    } catch (error) {
      console.error('Query Error: ', error)
    }
}

const addBook = () => {
    console.log('Dodaj nowa ksiazke')
    const PartitionKey = prompt('Podaj kategorie: ')
    const RowKey = prompt('Podaj id: ')
    const autor = prompt('Podaj autora: ')
    const tytul = prompt('Podaj tytul: ')
    const oprawa = prompt('Podaj rodzaj oprawy: ')
    const liczbaStron = prompt('Podaj liczbe stron: ')
    const wydawnictwo = prompt('Podaj wydawnictwo: ')
    const miasto = prompt('Podaj miasto: ')
    const rok = prompt('Podaj rok: ')
    var task = {
        PartitionKey: {'_':PartitionKey},
        RowKey: {'_': RowKey},
        autor: {'_':autor},
        tytul: {'_':tytul},
        oprawa: {'_':oprawa},
        liczbaStron: {'_':liczbaStron},
        wydawnictwo: {'_':wydawnictwo},
        miasto: {'_':miasto},
        rok: {'_':rok}
      };


    try {
        biblioteka.insertEntity('ksiazki', task, {echoContent: true}, function (error, result, response) {
            if(!error){ 
                console.log("Dodano nowa ksiazke");
            }});
    } catch (error) {
    console.error(error)
    }
}

const deleteBook = async() => {
    const PartitionKey = prompt('Podaj kategorie ksiazki do usuniecia: ');
    const RowKey = prompt('Podaj id ksiazki do usuniecia: ');
    var task = {
        PartitionKey: {'_': PartitionKey},
        RowKey: {'_': RowKey}
      };
    try {
          biblioteka.deleteEntity('ksiazki', task, function(error, response){
            if(!error) {
                console.log("Usunieto wybrana ksiazke");
            }
          });
    } catch (error) {
        console.error(error)
    }
}

async function updateBook() {
    const PartitionKey = prompt('Podaj kategorie ksiazki do aktualizacji: ');
    const RowKey = prompt('Podaj id ksiazki do aktualizacji: ')
    const autor = prompt('Podaj autora: ')
    const tytul = prompt('Podaj tytul: ')
    const oprawa = prompt('Podaj rodzaj oprawy: ')
    const liczbaStron = prompt('Podaj liczbe stron: ')
    const wydawnictwo = prompt('Podaj wydawnictwo: ')
    const miasto = prompt('Podaj miasto: ')
    const rok = prompt('Podaj rok: ')

    var updatedTask = {
        PartitionKey: {'_':PartitionKey},
        RowKey: {'_': RowKey},
        autor: {'_':autor},
        tytul: {'_':tytul},
        oprawa: {'_':oprawa},
        liczbaStron: {'_':liczbaStron},
        wydawnictwo: {'_':wydawnictwo},
        miasto: {'_':miasto},
        rok: {'_':rok}
      };
    try {
        biblioteka.replaceEntity('ksiazki', updatedTask, function(error, result, response){
            if(!error) {
                console.log("Dane ksiazki zostaly zaktualizowane");
            }
          });
    } catch (error) {
      console.error('Query Error', error)
    }
}

const selectId = async() => {
    const RowKey = prompt('Podaj ID ksiazki: ');
    var query = new azure.TableQuery()
    .where('RowKey eq ?', RowKey);
    try {
        biblioteka.queryEntities('ksiazki',query, null, function(error, result, response) {
            if(!error) {
                console.log("Ksiazka o wybranym ID", result.entries);
            }
          });
    } catch (error) {
    console.error(error)
    }
}

async function selectAuthor() {
    const autor = prompt('Podaj autora: ');
    var query = new azure.TableQuery()
    .where('autor eq ?', autor);
    try {
        biblioteka.queryEntities('ksiazki',query, null, function(error, result, response) {
            if(!error) {
                console.log("Ksiazki wybranego autora", result.entries);
            }
          });
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
        setTimeout(Menu, 1000);
        setTimeout(action, 1000);
        break;
      case 2:
        addBook();
        setTimeout(Menu, 1000);
        setTimeout(action, 1000);
        break;
      case 3:
        deleteBook();
        setTimeout(Menu, 1000);
        setTimeout(action, 1000);
        break;
      case 4:
        updateBook();
        setTimeout(Menu, 1000);
        setTimeout(action, 1000);
        break;
      case 5:
        selectId();
        setTimeout(Menu, 1000);
        setTimeout(action, 1000);
        break;
      case 6:
        selectAuthor();        
        setTimeout(Menu, 1000);
        setTimeout(action, 1000);
        break; 
      case 7:
        break;
        default:
            break;
    }
  }
  addSomeBooks();
  Menu();
  action();
  