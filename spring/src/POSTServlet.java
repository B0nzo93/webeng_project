import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class POSTServlet extends HttpServlet {
    private void render(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        RequestDispatcher rd = request.getRequestDispatcher("/post.jsp");
        rd.forward(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        render(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/javascript");
        try {
            //first verify if the user input is correct
            verifyCurrencyRequest(request);

            //transform the user input in a proper format
            String currency = request.getParameter("currency");
            Double value = Double.parseDouble(request.getParameter("value"));

            //calculate and print the results
            if (currency.equalsIgnoreCase("1")) {
                request.setAttribute("from", new Money(value, "EUR"));
                request.setAttribute("to", new Money(toUSD(value), "USD"));
                request.setAttribute("dir", "1");
            } else {
                request.setAttribute("from", new Money(value, "USD"));
                request.setAttribute("to", new Money(toEUR(value), "EUR"));
                request.setAttribute("dir", "2");
            }
        } catch (IllegalArgumentException e) {
            request.setAttribute("error", e.getMessage());
        }
        render(request, response);
    }

    /**
     * validates the two parameters of a currency conversion
     *
     * @param request
     * @throws IllegalArgumentException
     */
    private void verifyCurrencyRequest(HttpServletRequest request) throws IllegalArgumentException {
        //validate the parameter 'to'
        if (request.getParameter("currency") != null) {
            if (!request.getParameter("currency").equalsIgnoreCase("1")
                    && !request.getParameter("currency").equalsIgnoreCase("2")) {
                throw new IllegalArgumentException("parameter 'currency' must be either 1 or 2");
            }
        } else {
            throw new IllegalArgumentException("parameter 'currency' is missing");
        }

        //validate the parameter 'value'
        if (request.getParameter("value") != null) {
            if (!request.getParameter("value").matches("^-?\\d+(.\\d+)?$")) {
                throw new IllegalArgumentException("parameter 'value' is not numeric");
            }
        } else {
            throw new IllegalArgumentException("parameter 'value' is missing");
        }
    }

    private double toUSD(double eur) {
        return eur * 1.139;
    }

    private double toEUR(double usd) {
        return usd * 0.878;
    }
}