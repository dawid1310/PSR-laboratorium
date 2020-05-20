import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.elemMatch;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.exists;
import static com.mongodb.client.model.Filters.gt;
import static com.mongodb.client.model.Filters.lt;
import static com.mongodb.client.model.Filters.or;
import static com.mongodb.client.model.Projections.include;
import static com.mongodb.client.model.Updates.inc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import java.net.UnknownHostException;
import java.util.Random;
import java.util.Scanner;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;

public class Program {

    static Scanner scanner;
    static Integer counter;
    static boolean exit = true;

    static void fillData(MongoCollection<Document> collection){

        Document transport = new Document("_id", 1)
                .append("Kierowca", "Nowak")
                .append("Samochod", "Renault")
                .append("Cel", "Berlin")
                .append("Detale", Arrays.asList(new Document("Towar", "Elektronika"), new Document("Zysk", 15000)));
        collection.insertOne(transport);

        transport = new Document("_id", 2)
                .append("Kierowca", "Kowalski")
                .append("Samochod", "Mercedes")
                .append("Cel", "Moskwa")
                .append("Detale", Arrays.asList(new Document("Towar", "Alkohol"), new Document("Zysk", 8000)));
        collection.insertOne(transport);

    }
    static void getId(MongoDatabase db){
        System.out.println("Podaj ID: ");
        int id = Integer.parseInt(scanner.nextLine());
        FindIterable<Document> findIt = db.getCollection("tranzyt").find((eq("_id",id)));

        MongoCursor<Document> cursor = findIt.iterator();
        try {
            while(cursor.hasNext()) {
                System.out.println(cursor.next());
            }
        } finally {
            cursor.close();
        };

    }
    static void getCel(MongoDatabase db){
        System.out.println("Podaj cel: ");
        String cel = scanner.nextLine();
        FindIterable<Document> findIt = db.getCollection("tranzyt").find((eq("Cel",cel)));

        MongoCursor<Document> cursor = findIt.iterator();
        try {
            while(cursor.hasNext()) {
                System.out.println(cursor.next());
            }
        } finally {
            cursor.close();
        }
    }
    static void add(MongoCollection<Document> collection){
        System.out.println("Kierowca: ");
        String kierowaca = scanner.nextLine();
        System.out.println("Samochod: ");
        String samochod = scanner.nextLine();
        System.out.println("Cel: ");
        String cel = scanner.nextLine();
        System.out.println("Towar: ");
        String towar = scanner.nextLine();
        System.out.println("Zysk: ");
        String zysk = scanner.nextLine();
        counter++;
        Document transport = new Document("_id", counter)
                .append("Kierowca", kierowaca)
                .append("Samochod", samochod)
                .append("Cel", cel)
                .append("Detale", Arrays.asList(new Document("Towar", towar), new Document("Zysk", zysk)));
        collection.insertOne(transport);
    }
    static void all(MongoCollection<Document> collection){

        try (MongoCursor<Document> cur = collection.find().iterator()) {

            while (cur.hasNext()) {
                Document doc = cur.next();
                System.out.printf(doc.toJson()+"\n");

            }
        }

    }
    static void modify(MongoCollection<Document> collection){
        all(collection);
        System.out.println("Podaj który transport chcesz zmodyfikowac(ID): ");
        int id = Integer.parseInt(scanner.nextLine());
        System.out.println("Podaj nowy samochod: ");
        String samochod = scanner.nextLine();
        Document query = new Document();
        query.append("_id",id);
        Document setData = new Document();
        setData.append("Samochod", samochod);
        Document update = new Document();
        update.append("$set", setData);
        collection.updateOne(query, update);
    }

    static void remove(MongoCollection<Document> collection){
        System.out.println("Podaj który transport chcesz usunac(ID): ");
        int id = Integer.parseInt(scanner.nextLine());
        collection.deleteOne(new BasicDBObject("_id", id));

    }

    static private int getMenuChoice() {
        int choice = -1;
        do {
            System.out.print("Podaj wybor: ");
            try {
                choice = Integer.parseInt(scanner   .nextLine());
            }
            catch (NumberFormatException e) {
                System.out.println("Podawaj tylko liczby!");
            }
            if (choice < 1 || choice > 7) {
                System.out.println("Wybor nie istnieje");
            }

        } while (choice < 1 || choice > 7);

        return choice;
    }
    static private void printMenu() {
        System.out.println("\nTranzyt");
        System.out.println(" 1 - Dodaj nowy transport");
        System.out.println(" 2 - Wyswietl wszystkie transporty");
        System.out.println(" 3 - Usun transport");
        System.out.println(" 4 - Wyswietl transport po ID");
        System.out.println(" 5 - Wyswietl transport po celu");
        System.out.println(" 6 - Zmien samochod w danym transporcie");
        System.out.println(" 7 - Wyjscie");
        System.out.println("\n\n");
    }
    static private void performAction(int choice, MongoCollection<Document> collection, MongoDatabase db) {
            if(choice>0&&choice<7) {
                switch (choice) {
                    case 1:
                        add(collection);
                        break;
                    case 2:
                        all(collection);
                        break;

                    case 3:
                        remove(collection);
                        break;

                    case 4:
                        getId(db);
                        break;

                    case 5:
                        getCel(db);
                        break;

                    case 6:
                        modify(collection);
                        break;

                    case 7:
                       exit=false;
                }
            }
    }
    static public void runMenu(MongoCollection<Document> collection, MongoDatabase db) {
        while (exit) {
            printMenu();
            int choice = getMenuChoice();
            if(choice>0&&choice<7)
                performAction(choice, collection, db);
            else
                exit = false;
        }
    }
    public static void main(String[] args) {
        String user = "student01";
        String password = "student01";
        String host = "localhost";
        int port = 27017;
        String database = "database01";
        counter=2;
        scanner = new Scanner(System.in);

        String clientURI = "mongodb://" + user + ":" + password + "@" + host + ":" + port + "/" + database;
        MongoClientURI uri = new MongoClientURI(clientURI);

        MongoClient mongoClient = new MongoClient(uri);

        MongoDatabase db = mongoClient.getDatabase(database);
		db.getCollection("tranzyt").drop();
        MongoCollection<Document> collection = db.getCollection("tranzyt");
        fillData(collection);
        runMenu(collection, db);


    }
}
