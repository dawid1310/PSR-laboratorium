import java.net.MalformedURLException;
import java.util.List;
import java.util.Scanner;


import org.ektorp.CouchDbConnector;
import org.ektorp.CouchDbInstance;
import org.ektorp.ViewQuery;
import org.ektorp.http.HttpClient;
import org.ektorp.http.StdHttpClient;
import org.ektorp.impl.StdCouchDbConnector;
import org.ektorp.impl.StdCouchDbInstance;


public class JavaCouchDB {
    static Scanner scanner = new Scanner(System.in);
    static Integer counter=2;
    static boolean exit = true;

    static void fillData(CouchDbConnector db){


        Tranzyt tranzyt = new Tranzyt();
        tranzyt.setKierowca("Nowak");
        tranzyt.setSamochod("Volvo");
        tranzyt.setCel("Dortmund");
        tranzyt.setTowar("Stal");
        tranzyt.setZysk("10000");
        db.create("1", tranzyt);

        tranzyt.setKierowca("Kowalski");
        tranzyt.setSamochod("Mercedes");
        tranzyt.setCel("Barcelona");
        tranzyt.setTowar("Elektronika");
        tranzyt.setZysk("15000");
        db.create("2", tranzyt);

    }

    static void add(CouchDbConnector db){
        Tranzyt tranzyt = new Tranzyt();
        System.out.println("Kierowca: ");
        tranzyt.setKierowca(scanner.nextLine());
        System.out.println("Samochod: ");
        tranzyt.setSamochod(scanner.nextLine());
        System.out.println("Cel: ");
        tranzyt.setCel(scanner.nextLine());
        System.out.println("Towar: ");
        tranzyt.setTowar(scanner.nextLine());
        System.out.println("Zysk: ");
        tranzyt.setZysk(scanner.nextLine());
        counter++;
        String c = counter.toString();
        db.create(c, tranzyt);
    }

    static void all(CouchDbConnector db){

        ViewQuery q = new ViewQuery().allDocs().includeDocs(true);

        List<Tranzyt> tranzyt = db.queryView(q, Tranzyt.class);
        for(int i=0;i<tranzyt.size();i++) {
            tranzyt.get(i).displayAll();
        }

    }

    static void remove(CouchDbConnector db){
        all(db);
        System.out.println("Podaj który transport chcesz usunac(ID): ");
        String id = scanner.nextLine();
        Tranzyt usun = db.get(Tranzyt.class, id);
        db.delete(usun);

    }

    static void getId(CouchDbConnector db){
        System.out.println("Podaj id transportu: \n");
        String s = scanner.nextLine();

        Tranzyt odczyt = db.get(Tranzyt.class, s);
        odczyt.displayAll();

    }

    static void modify(CouchDbConnector db){
        all(db);
        System.out.println("Podaj który transport ma zmienic samochod(ID): ");
        String id = scanner.nextLine();
        Tranzyt modyfikuj = db.get(Tranzyt.class, id);
        System.out.println("Podaj nowy samochod: ");
        modyfikuj.setSamochod(scanner.nextLine());
        db.update(modyfikuj);
    }



    static private int getMenuChoice() {
        int choice = -1;
        do {
            System.out.print("Podaj wybor: ");
            try {
                choice = Integer.parseInt(scanner.nextLine());
            }
            catch (NumberFormatException e) {
                System.out.println("Podawaj tylko liczby!");
            }
            if (choice < 1 || choice > 6) {
                System.out.println("Wybor nie istnieje");
            }

        } while (choice < 1 || choice > 6);

        return choice;
    }

    static private void printMenu() {
        System.out.println("\nTranzyt");
        System.out.println(" 1 - Dodaj nowy transport");
        System.out.println(" 2 - Wyswietl wszystkie transporty");
        System.out.println(" 3 - Usun transport");
        System.out.println(" 4 - Wyswietl transport po ID");
        System.out.println(" 5 - Zmien samochod w danym transporcie");
        System.out.println(" 6 - Wyjscie");
        System.out.println("\n\n");
    }

    static private void performAction(int choice, CouchDbConnector db) {
        if(choice>0&&choice<6) {
            switch (choice) {
                case 1:
                    add(db);
                    break;
                case 2:
                    all(db);
                    break;

                case 3:
                    remove(db);
                    break;

                case 4:
                    getId(db);
                    break;

                case 5:
                    modify(db);
                    break;

                case 6:
                    exit=false;
            }
        }
    }
    
    static public void runMenu(CouchDbConnector db) {
        while (exit) {
            printMenu();
            int choice = getMenuChoice();
            if(choice>0&&choice<7)
                performAction(choice, db);
            else
                exit = false;
        }
    }

    public static void main(String[] args) throws MalformedURLException {
        HttpClient httpClient = new StdHttpClient.Builder()
                .url("http://localhost:5984")
                .username("admin")
                .password("admin")
                .build();
        CouchDbInstance dbInstance = new StdCouchDbInstance(httpClient);
        CouchDbConnector db = new StdCouchDbConnector("tranzyt", dbInstance);

        db.createDatabaseIfNotExists();
        //fillData(db);
        runMenu(db);

    }
}

