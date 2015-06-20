package DAO;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

/**
 * Created by Christoph on 20.06.2015.
 */
public class CategoryDAO {
    private SessionFactory sessionFactory;

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public void insert(CategoryEntity categoryEntity){
        Session session = getSessionFactory().getCurrentSession();
        session.beginTransaction();
        session.save(categoryEntity);
        session.getTransaction().commit();
    }

    public List<CategoryEntity> selectAll(){
        Session session = getSessionFactory().getCurrentSession();
        session.beginTransaction();
        Criteria criteria = session.createCriteria(CategoryEntity.class);
        List<CategoryEntity> categories = (List<CategoryEntity>)criteria.list();
        session.getTransaction().commit();
        return categories;
    }
}
