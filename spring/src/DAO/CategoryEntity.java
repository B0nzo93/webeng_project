package DAO;

import javax.persistence.*;
import java.util.Collection;

/**
 * Created by Christoph on 19.06.2015.
 */
@Entity
@Table(name = "category") //, schema = "", catalog = "DAO")
public class CategoryEntity {
    private int id;
    private String name;
    private Collection<TodoEntity> todosById;

    @Id
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CategoryEntity that = (CategoryEntity) o;

        if (id != that.id) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }

    @OneToMany(mappedBy = "categoryByGroupId")
    public Collection<TodoEntity> getTodosById() {
        return todosById;
    }

    public void setTodosById(Collection<TodoEntity> todosById) {
        this.todosById = todosById;
    }
}
