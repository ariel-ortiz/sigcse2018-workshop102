/*
 * Solution to exercise D.
 *
 * Copyright © 2016-2018 by Ariel Ortiz.
 *
 * Free use of this source code is granted under the terms of the
 * GPL version 3 License.
 */

package sigcse2018.workshop;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

class QuoationsClient {

    public static final String URL_STRING = "http://localhost:8080/quotations";

    public static void main(String[] args) throws Exception {
        URL url = new URL(URL_STRING);
        try {
            HttpURLConnection conn =
                (HttpURLConnection) url.openConnection();
            conn.connect();
            try (BufferedReader br =
                    new BufferedReader(
                        new InputStreamReader(conn.getInputStream()))) {
                StringBuilder body = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    body.append(line);
                }
                JSONParser parser = new JSONParser();
                JSONArray list = (JSONArray) parser.parse(body.toString());
                for (Object obj : list) {
                    JSONObject q = (JSONObject) obj;
                    System.out.printf("%d - %s: %s%n",
                        q.get("id"), q.get("author"), q.get("prelude"));
                }
            }
        } catch (Exception e) {
            System.err.println("ERROR: " + e);
        }
    }
}
