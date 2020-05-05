import java.io.Serializable;

public class Dziekanat implements Serializable {
    private String student;
    private String kierunek;
    private String grupa;
    private int index;

    public Dziekanat(){}

    public Dziekanat(String student, String kierunek, String grupa, int index){
        this.student = student;
        this.kierunek = kierunek;
        this.grupa = grupa;
        this.index = index;
    }

    public void setStudent(String student){this.student = student;}
    public void setKierunek(String  kierunek){this.kierunek = kierunek;}
    public void setGrupa(String grupa){this.grupa = grupa;}
    public void setIndex(int index){this.index = index;}

    public String getStudent() {
        return student;
    }
    public String getGrupa() {
        return grupa;
    }
    public String getKierunek() {
        return kierunek;
    }






    @Override
    public String toString() {
        return "|" +
                "student='" + student + '\'' +
                "| kierunek='" + kierunek + '\'' +
                "| grupa=" + grupa + '\'' +
                "| index=" + index +
                '|';
    }

}
