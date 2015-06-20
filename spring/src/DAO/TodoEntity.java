package DAO;

import javax.persistence.*;
import java.sql.Date;

/**
 * Created by Christoph on 19.06.2015.
 */
@Entity
@Table(name = "todo", schema = "", catalog = "DAO")
public class TodoEntity {
    private int id;
    private String description;
    private String title;
    private Date created;
    private byte done;
    private CategoryEntity categoryByGroupId;

    @Id
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Basic
    @Column(name = "created")
    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    @Basic
    @Column(name = "done")
    public byte getDone() {
        return done;
    }

    public void setDone(byte done) {
        this.done = done;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TodoEntity that = (TodoEntity) o;

        if (id != that.id) return false;
        if (done != that.done) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (title != null ? !title.equals(that.title) : that.title != null) return false;
        if (created != null ? !created.equals(that.created) : that.created != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (created != null ? created.hashCode() : 0);
        result = 31 * result + (int) done;
        return result;
    }

    @ManyToOne
    @JoinColumn(name = "group_id", referencedColumnName = "id", nullable = false)
    public CategoryEntity getCategoryByGroupId() {
        return categoryByGroupId;
    }

    public void setCategoryByGroupId(CategoryEntity categoryByGroupId) {
        this.categoryByGroupId = categoryByGroupId;
    }
}
