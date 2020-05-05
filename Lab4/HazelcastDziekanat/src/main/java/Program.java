import com.hazelcast.client.HazelcastClient;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.hibernate.instance.IHazelcastInstanceFactory;

import java.net.UnknownHostException;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;

public class Program {
    static  HazelcastInstance hazelcastInstance;
    static Scanner scanner;
    static Integer r;
    static boolean exit = true;

    static void fillData(){
        Map<Integer,Dziekanat> dziekanatMap = hazelcastInstance.getMap("Dziekanat");
        dziekanatMap.put(1,new Dziekanat("Jan Kowalski", "Informatyka", "1ID21A", 85001));
        dziekanatMap.put(2,new Dziekanat("Janek Dzbanek", "Informatyka", "1ID21B", 85003));
        dziekanatMap.put(3,new Dziekanat("Jozef Bryla", "Automatyka", "1ID21A", 85011));
        dziekanatMap.put(4,new Dziekanat("Stanislaw Nazwiskowy", "Matematyka", "1ID21B", 85000));

    }
    static void getGrupa(){
        System.out.println("Podaj grupe:");
        Map<Long,Dziekanat> dziekanatMap = hazelcastInstance.getMap("Dziekanat");
        String choose = scanner.nextLine();
        for (Map.Entry<Long,Dziekanat> e: dziekanatMap.entrySet()) {
            if((e.getValue().getGrupa()).contains(choose))
            {
                System.out.println(e.getKey() + " => " + e.getValue().toString());
            }

        }
    }
    static void getKierunek(){
        System.out.println("Podaj kierunek:");
        Map<Long,Dziekanat> dziekanatMap = hazelcastInstance.getMap("Dziekanat");
        String choose = scanner.nextLine();
        for (Map.Entry<Long,Dziekanat> e: dziekanatMap.entrySet()) {
            if((e.getValue().getKierunek()).contains(choose))
            {
                System.out.println(e.getKey() + " => " + e.getValue().toString());
            }

        }
    }
    static void add(){
        Map<Integer,Dziekanat> dziekanatMap = hazelcastInstance.getMap("Dziekanat");
        Dziekanat Dziekanat = new Dziekanat();
        System.out.println("Student: ");
        Dziekanat.setStudent(scanner.nextLine());

        System.out.println("Kierunek: ");
        Dziekanat.setKierunek(scanner.nextLine());

        System.out.println("Grupa:");
        Dziekanat.setGrupa(scanner.nextLine());

        System.out.println("Numer indexu:");
        Dziekanat.setIndex(scanner.nextInt());


        Integer key = r++;
        dziekanatMap.put(Math.toIntExact(key),Dziekanat);
    }
    static void all(){
        Map<Integer,Dziekanat> dziekanatMap = hazelcastInstance.getMap("Dziekanat");
        System.out.println("Wszyscy studenci ");
        for(Map.Entry<Integer,Dziekanat> e: dziekanatMap.entrySet()){
            System.out.println(e.getKey() + " - " + e.getValue().toString());
        }
    }
    static void getStudent(){
        Map<Integer,Dziekanat> dziekanatMap = hazelcastInstance.getMap("Dziekanat");
        System.out.println("Podaj imie i nazwisko studenta: ");
        String nazwa = scanner.nextLine();

        for (Map.Entry<Integer,Dziekanat> e: dziekanatMap.entrySet()){
            if (e.getValue().getStudent().equals(nazwa)==true){
                System.out.println(e.getKey() + " => " + e.getValue().toString());
            }
        }
    }
    /*static void update(){ //to mi nie działa
        Map<Integer,Dziekanat> dziekanatMap = hazelcastInstance.getMap("Dziekanat");
        System.out.println("Podaj klucz: ");
        Integer key = scanner.nextInt();
        for (Map.Entry<Integer,Dziekanat> e: dziekanatMap.entrySet()){
            if (key == e.getKey().intValue()){
                System.out.println("Wpisz Q aby pominąć!!!");
                System.out.println(e.getKey() + " => " + e.getValue().toString());


                System.out.println("Zmień czas naprawy: ");
                Integer timeRepair = scanner.nextInt();
                if(timeRepair.equals("Q")==false){
                    e.getValue().setTimeRepair(timeRepair);
                    System.out.println("Zmieniono czas naprawy");
                }

                System.out.println("Zmień koszt: ");
                Integer price = scanner.nextInt();
                if(price.equals("Q")==false){
                    e.getValue().setPrice(price);
                }
                System.out.println("Zmien mechanika: ");

                String nameManager = scanner.nextLine();
                if(nameManager.equals("Q")==false){
                    e.getValue().setRepairManager(nameManager);
                }



                System.out.println("Zmień usluge: ");
                String describe = scanner.nextLine();
                if(describe.equals("Q")==false){
                    e.getValue().setDescribe(describe);
                }
            }
        }
    }*/
    static void remove(){
        Map<Integer,Dziekanat> dziekanatMap = hazelcastInstance.getMap("Dziekanat");
        System.out.println("Podaj klucz: ");
        Integer key = scanner.nextInt();
        dziekanatMap.remove(key);
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
            /*if (choice < 1 || choice > 5) {
                System.out.println("Wybor nie istnieje");
            }*/

        } while (choice < 1 || choice > 6);

        return choice;
    }
    static private void printMenu() {
        System.out.println("\nDZIEKANAT");
        System.out.println(" 1 - Wyswietlanie wszystkich studentow");
        System.out.println(" 2 - Dodaj nowego studenta");
        System.out.println(" 3 - Usun studenta");
        System.out.println(" 4 - Wyswietl studenta po nazwisku");
        System.out.println(" 5 - Wyswietl studentow po grupie");
        System.out.println(" 6 - Wyswietl studentow po kierunku");
        System.out.println("\n\n\n");
    }
    static private void performAction(int choice) {
        switch (choice) {
            case 1:
                all();
                break;
            case 2:
                add();
                break;
            case 3:
                remove();
                break;
            case 4:
                getStudent();
                break;
            case 5:
                getGrupa();
                break;
            case 6:
                getKierunek();
                break;
            default:
                System.out.println("Bledne dane");
        }
    }
    static public void runMenu() {
        while (exit) {
            printMenu();
            int choice = getMenuChoice();
            performAction(choice);
        }
    }

    public static void main(String[] args) throws UnknownHostException{
        hazelcastInstance = Hazelcast.newHazelcastInstance(HConfig.getConfig());
        scanner = new Scanner(System.in);
        r = 5;
        fillData();
        runMenu();
        scanner.nextInt();

    }
}
