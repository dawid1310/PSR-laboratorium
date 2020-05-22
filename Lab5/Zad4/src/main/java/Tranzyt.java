import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Tranzyt {


    @JsonProperty("_id") private String id;
    @JsonProperty("_rev") private String revision;
    private String kierowca;
    private String samochod;
    private String cel;
    private String towar;
    private String zysk;


    public String getRevision() {
        return revision;
    }
    public void setRevision(String revision) {
        this.revision = revision;
    }


    public String getId() {
        return id;
    }
    public void setId(String s) {
        id = s;
    }


    public String getKierowca() {
        return kierowca;
    }
    public void setKierowca(String s) {
        kierowca = s;
    }


    public void setSamochod(String s) {
        samochod = s;
    }
    public String getSamochod() {
        return samochod;
    }


    public void setCel(String s) {
        cel = s;
    }
    public String getCel() {
        return cel;
    }


    public void setTowar(String s) {
        towar = s;
    }
    public String getTowar() {
        return towar;
    }


    public void setZysk(String  s) {
        zysk = s;
    }
    public String getZysk() {
        return zysk;
    }

    public void displayAll(){
        System.out.println("Id transportu : "+this.getId());
        System.out.println("Kierowca: "+this.getKierowca());
        System.out.println("Samochod: "+this.getSamochod());
        System.out.println("Cel: "+this.getCel());
        System.out.println("Towar: "+this.getTowar());
        System.out.println("Zysk: "+this.getZysk()+"\n");

    }
}