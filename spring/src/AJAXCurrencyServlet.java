import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by woelfl on 5/11/15.
 * Modified by niko.
 */
public class AJAXCurrencyServlet extends HttpServlet {
    /**
     * Handles all get requests. In our example, the servlet has just one task, which is
     * currency conversion.
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/javascript");
        PrintWriter out = response.getWriter();

        try {
            /*
            first verify if the user input is correct
             */
            verifyCurrencyRequest(request);

            /*
            transform the user input in a proper format
             */
            String to = request.getParameter("to");
            Double value = Double.parseDouble(request.getParameter("value"));

            /*
            calculate and print the results
             */
            if (to.equalsIgnoreCase("usd")) {
                //originally returned value in EUR when "to=USD" was requested o.O
                out.println("{\"USD\": "+toUSD(value)+"}");
            } else {
                out.println("{\"EUR\": "+toEUR(value)+"}");
            }

        } catch (IllegalArgumentException e) {
            /*
            print an error message if the user input is invalid
             */
            out.println("{\"error\" : true, " +
                    "\"message\" : "+e.getMessage()+"}");
        }
    }

    /**
     * validates the two parameters of a currency conversion
     * @param request
     * @throws IllegalArgumentException
     */
    private void verifyCurrencyRequest(HttpServletRequest request) throws IllegalArgumentException {
        /*
        validate the parameter 'to'
         */
        if (request.getParameterMap().containsKey("to")) {
            if(!request.getParameter("to").equalsIgnoreCase("usd")
                    && !request.getParameter("to").equalsIgnoreCase("eur")) {
                throw new IllegalArgumentException("parameter 'to' must be either usd or eur");
            }
        } else {
            throw new IllegalArgumentException("parameter 'to' is missing");
        }

        /*
        validate the parameter 'value'
         */
        if (request.getParameterMap().containsKey("value")) {
            if (!request.getParameter("value").matches("^-?\\d+$")) {
                throw new IllegalArgumentException("parameter 'value' is not numeric");
            }
        } else {
            throw new IllegalArgumentException("parameter 'value' is missing");
        }
    }

    private double toUSD(double eur) {
        return eur*1.139;
    }

    private double toEUR(double usd) {
        return usd*0.878;
    }
}