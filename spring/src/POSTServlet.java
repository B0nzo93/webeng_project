import DAO.CategoryEntity;
import DAO.TodoEntity;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.AnnotationConfiguration;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Date;

public class POSTServlet extends HttpServlet {
    private static SessionFactory factory;

    private void render(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        RequestDispatcher rd = request.getRequestDispatcher("/view.jsp");
        rd.forward(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        render(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/javascript");
        try {
            // get note text and create a new Note POJO
            String note_text = request.getParameter("note");
            createSessionFactory();
            createCategory("dfafdafdafdaf");
            //addTodoNote("test", note_text, new Date(new java.util.Date().getTime()), false, category);
            //request.setAttribute("note_object", new TodoEntity());

        } catch (IllegalArgumentException e) {
            request.setAttribute("error", e.getMessage());
        }
        render(request, response);
    }

   private Integer addTodoNote(String title, String description, Date created, boolean done, CategoryEntity categoryEntity) {
       Session session = factory.openSession();
       Transaction tx = null;
       Integer noteId = null;
       try {
           tx = session.beginTransaction();
           TodoEntity newNote = new TodoEntity();
           newNote.setTitle(title);
           newNote.setDescription(description);
           newNote.setCreated(created);
           newNote.setDone((byte) (done ? 1 : 0 ));
           newNote.setCategoryByGroupId(categoryEntity);
           noteId = (Integer) session.save(newNote);
           tx.commit();
       } catch (HibernateException e) {
           if (tx != null) tx.rollback();
           e.printStackTrace();
       } finally {
           session.close();
       }
       return noteId;
   }

    private Integer createCategory(String name) {
        Session session = factory.openSession();
        Transaction tx = null;
        Integer categoryId = null;
        try {
            tx = session.beginTransaction();
            CategoryEntity newCategory = new CategoryEntity();
            newCategory.setName(name);
            categoryId = (Integer) session.save(newCategory);
            tx.commit();
        } catch (HibernateException e) {
            if (tx != null) tx.rollback();
            e.printStackTrace();
        } finally {
            session.close();
        }
        return categoryId;
    }

    private void createSessionFactory() {
        factory = new AnnotationConfiguration().configure().addAnnotatedClass(CategoryEntity.class).buildSessionFactory();
    }

}