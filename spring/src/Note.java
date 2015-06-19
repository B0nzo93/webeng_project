import java.io.Serializable;

/**
 * Created by Christoph on 19.06.2015.
 */
public class Note implements Serializable {

    private String text;

    public Note(String text) {
        this.text = text;
    }

    public Note() {

    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
