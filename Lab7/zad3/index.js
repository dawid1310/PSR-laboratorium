const neo4j = require('neo4j-driver')
const { UnsubscriptionError } = require('rxjs')
const { async } = require('rxjs/internal/scheduler/async')
const uri = 'neo4j://localhost:7687'
const user = 'neo4j'
const password = 'root'
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const session = driver.session()
const prompt = require('prompt-sync')();

async function addAnimal(){
  const id = prompt('Podaj id zwierzaczka: ');
  const imie = prompt('Podaj imie zwierzaczka: ');
  const wiek = prompt('Podaj wiek zwierzaczka: ');
  const gatunek = prompt('Podaj gatunek zwierzaczka: ');
  const rodzina = prompt('Podaj rodzine do ktorej nalezy zwierzaczek: ');
  const rzad = prompt('Podaj rzad do ktorego nalezy zwierzaczek: ');
  const gromada = prompt('Podaj gromade do ktorej nalezy zwierzaczek: ');
  const opiekun = prompt('Podaj opiekuna, ktory zajmuje sie zwierzaczkiem: ');
  const sektor = prompt('Podaj sektor w ktorym mieszka zwierzaczek: ');
  
  try {
    const result = await session.run(
    'CREATE (a:Zw {id: $id, imie: $imie, wiek: $wiek, gatunek: $gatunek, rodzina: $rodzina, rzad: $rzad, gromada: $gromada}) RETURN a',
      { 
        id: id,
        imie: imie,
        wiek: wiek,
        gatunek: gatunek,
        rodzina: rodzina,
        rzad: rzad,
        gromada: gromada
      }
    )
    const singleRecord = result.records[0]
    const node = singleRecord.get(0)
    console.log("Dodano: id:", node.properties.id,', imie:', node.properties.imie,', gatunek:', node.properties.gatunek) //można node.properties.nazwa_pola
    const result1 = await session.run(
      'MATCH (a:Opiekun),(b:Zw) WHERE a.id = $opiekun AND b.id = $zw CREATE (a)-[r:OPIEKUJE_SIE]->(b) RETURN type(r)',{
          opiekun: opiekun,
          zw: id
       }
      )
      const result2 = await session.run(
        'MATCH (a:Zw),(b:Sektor) WHERE a.id = $zw AND b.id = $sektor CREATE (a)-[r:MIESZKA_W]->(b) RETURN type(r)',{
          zw: id,
          sektor: sektor
         }
        )
        dm(); 
    } finally {

    }

}

async function addKeeper(){
    const id = prompt('Podaj id opiekuna: ');
    const imie = prompt('Podaj imię opiekuna: ');
    const nazwisko = prompt('Podaj nazwisko opiekuna: ');
    const specjalizacja = prompt('Podaj specjalizacje opiekuna: ');
  try {
  const result = await session.run(
  'CREATE (x:Opiekun {id: $id, imie: $imie, nazwisko: $nazwisko, specjalizacja: $specjalizacja}) RETURN x',
    { 
        id: id,
        imie: imie,
        nazwisko: nazwisko,
        specjalizacja: specjalizacja
    }
  )
  
  console.log("Dodano nowego opiekuna")
  dm(); 
} finally {

}

  }

async function addSector(){
    const id = prompt('Podaj id sektora: ');
    const nazwa = prompt('Podaj nazwe sektora: ');
    const typ = prompt('Podaj typ sektora: ');
  try {
  const result = await session.run(
  'CREATE (x:Sektor {id: $id, nazwa: $nazwa, typ: $typ}) RETURN x',
    { 
        id: id,
        nazwa: nazwa,
        typ: typ
    }
  )
  
  console.log("Dodano nowy sektor");
  dm(); 
} finally {

}


}


async function deleteAnimal(){
    const id = prompt('Podaj id zwierzaczka do usuniecia: ');
    const result = await session.run(

        'MATCH (n:Zw { id: $id }) DETACH DELETE n',
        { 
            id: id
        }
      )
    console.log("Usunieto zwierzaczka")
    dm(); 
}

async function selectAll(){
  try{
    const count = await session.run('MATCH (zw:Zw) RETURN count(zw) as count',{ })
    const counted = count.records[0]
    const liczba = counted.get('count')
    const result = await session.run('MATCH (zw:Zw) RETURN zw.id, zw.imie, zw.gatunek, zw.rodzina, zw.rzad, zw.gromada',{ })
    for(i = 0; i<liczba; i++){
      const singleRecord = result.records[i]
      console.log(singleRecord.get('zw.id'), singleRecord.get('zw.imie'), singleRecord.get('zw.gatunek'), singleRecord.get('zw.rodzina'), singleRecord.get('zw.rzad'), singleRecord.get('zw.gromada'))
    }
    dm(); 
} finally {
    //await session.close()
}
//await driver.close()
}

async function updateAnimal(){
  const id = prompt('Podaj id zwierzaczka do aktualizacji: ');
  const imie = prompt('Podaj imie zwierzaczka: ');
  const wiek = prompt('Podaj wiek zwierzaczka: ');
  try {
    const result = await session.run(
    'MATCH (n:Zw { id: $id }) SET n.imie = $imie, n.wiek = $wiek RETURN n.id',
      { 
        id: id,
        imie: imie,
        wiek: wiek

      }
    )
        dm(); 
    } finally {
    }

}

async function selectId(){
  const id = prompt('Podaj id zwierzaczka: ');
  try{

    //('MATCH (zw:Zw) RETURN zw.id, zw.imie, zw.gatunek, zw.rodzina, zw.rzad, zw.gromada',{ })

    const result = await session.run('MATCH (zw:Zw) WHERE zw.id = $zw RETURN zw.id, zw.imie, zw.wiek, zw.gatunek, zw.rodzina, zw.rzad, zw.gromada',{ zw: id});

      const singleRecord = result.records[0]
      console.log(singleRecord.get(0), singleRecord.get('zw.imie'), singleRecord.get('zw.wiek'), singleRecord.get('zw.gatunek'), singleRecord.get('zw.rodzina'), singleRecord.get('zw.rzad'), singleRecord.get('zw.gromada'));

    
      dm(); 
  } finally {
  }

}

async function selectKeeper(){
    const id = prompt('Podaj id opiekuna zwierzaczka: ');
    try{
  
      const result = await session.run('MATCH (opiekun:Opiekun) WHERE opiekun.id = $opiekun RETURN opiekun.id, opiekun.imie, opiekun.nazwisko',{ opiekun: id})
  
  
        
      
        const singleRecord = result.records[0]
        console.log(singleRecord.get(0), singleRecord.get('opiekun.imie'), singleRecord.get('opiekun.nazwisko'));
        const result1 = await session.run('MATCH (:Opiekun { id: $id })-->(zw:Zw) RETURN zw.id',{ id: id });
        const count = await session.run('MATCH (:Opiekun { id: $id })-->(zw:Zw) RETURN count(zw) as count',{ id: id })
        const counted = count.records[0]
        const number = counted.get('count')
        for(i=0; i<number; i++){
            const singleRecord2=result1.records[i];
            zwId=singleRecord2.get(0);
            const result2 = await session.run('MATCH (zw:Zw) WHERE zw.id = $id RETURN zw.id, zw.imie, zw.wiek, zw.gatunek, zw.rodzina, zw.rzad, zw.gromada',{ id: zwId });
            const singleRecord3=result2.records[0];
            console.log(singleRecord3.get(0), singleRecord3.get('zw.imie'), singleRecord3.get('zw.wiek'), singleRecord3.get('zw.gatunek'), singleRecord3.get('zw.rodzina'), singleRecord3.get('zw.rzad'), singleRecord3.get('zw.gromada'));
        }
        dm(); 
    } finally {
    }
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
    await session.close();
    await driver.close();
  }

  dm();
