package DAO;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

/**
 * Created by Christoph on 20.06.2015.
 */
public class TodoDAO {
    private SessionFactory sessionFactory;

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public void insert(TodoEntity todoEntity){
        Session session = getSessionFactory().getCurrentSession();
        session.beginTransaction();
        session.save(todoEntity);
        session.getTransaction().commit();
    }

    public List<TodoEntity> selectAll(){
        Session session = getSessionFactory().getCurrentSession();
        session.beginTransaction();
        Criteria criteria = session.createCriteria(CategoryEntity.class);
        List<TodoEntity> todos = (List<TodoEntity>)criteria.list();
        session.getTransaction().commit();
        return todos;
    }
}
