import java.io.Serializable;
import java.sql.Date;

/**
 * Created by Christoph on 19.06.2015.
 */
public class Note implements Serializable {
    private int id;
    private String title;
    private String description;
    private java.sql.Date created;
    private boolean done;
    private int groupId;


    public Note(int id, String title, String description, Date created, boolean done, int groupId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.created = created;
        this.done = done;
        this.groupId = groupId;
    }

    public Note() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Date getCreated() {
        return created;
    }

    public boolean isDone() {
        return done;
    }

    public int getGroupId() {
        return groupId;
    }
}
