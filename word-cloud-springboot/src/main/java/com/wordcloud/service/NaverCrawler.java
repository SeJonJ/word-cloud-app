package com.wordcloud.service;

import com.wordcloud.config.NaverApiConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RequiredArgsConstructor
@Service
@Slf4j
public class NaverCrawler { // 베이스 URL
    private final NaverApiConfig apiConfig;

    public String crawler(String word){
        String crawlerString = null;
        try {
            // 매개변수 : 검색단어, 인코딩
            String searchKeyword = URLEncoder.encode(word, StandardCharsets.UTF_8);
            // crawler 의 search 메소드 사용
            // 이때 naverID 와 naverSecret 은 APIdata 안에 있는 내용 사용
            String response = search(apiConfig.getClientId(), apiConfig.getClientSecret(), searchKeyword);

            // 필드값은 title 가 desc 2개!
            // 크롤링을 하게되면 field 가 여러개가 나오는데 이 중에서 title 와 desc 만 가져온다는 의미
            String[] fields = {"title","description"};

            // 결과를 Map 형태로 저장장
           Map<String, Object> result = getResult(response, fields);
           log.info("total result: {}", result.get("total"));

            // 검색 결과를 다시 List 형태로 저장
            List<Map<String, Object>> items = (List<Map<String, Object>>) result.get("result");

            //
            for (Map<String, Object> item : items) {
                crawlerString += item.get("title");
                crawlerString += item.get("description");
            }

            return crawlerString;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    // 여기는 네이버 검색 API
    public String search(String clientId, String secret, String searchKeyword) {
        HttpURLConnection con = null;
        String result = "";
        try {
            URL url = new URL(apiConfig.getSearchUrl() + searchKeyword +"&display=50");
            con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("X-Naver-Client-Id", clientId);
            con.setRequestProperty("X-Naver-Client-Secret", secret);
            int responseCode = con.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) result = readBody(con.getInputStream());
            else result = readBody(con.getErrorStream());
        } catch (Exception e) {
            System.out.println("연결 오류 : " + e);
        } finally {
            con.disconnect();
        }
        return result;
    }


    public String readBody(InputStream body) {
        InputStreamReader streamReader = new InputStreamReader(body);
        try (BufferedReader lineReader = new BufferedReader(streamReader)) {
            StringBuilder responseBody = new StringBuilder();
            String line;
            while ((line = lineReader.readLine()) != null) {
                responseBody.append(line);
            }
            return responseBody.toString();
        } catch (IOException e) {
            throw new RuntimeException("API 응답을 읽는데 실패했습니다.", e);
        }
    }


    public Map<String, Object> getResult(String response, String[] fields) {
        Map<String, Object> rtnObj = new HashMap<>();
        try {
            JSONParser parser = new JSONParser();
            JSONObject result = (JSONObject) parser.parse(response);
            rtnObj.put("total", (long) result.get("total"));
            JSONArray items = (JSONArray) result.get("items");
            List<Map<String, Object>> itemList = new ArrayList<>();
            for (int i = 0; i < items.size(); i++) {
                JSONObject item = (JSONObject) items.get(i);
                Map<String, Object> itemMap = new HashMap<>();
                for (String field : fields) {
                    itemMap.put(field, item.get(field));
                }
                itemList.add(itemMap);
            }
            rtnObj.put("result", itemList);
        } catch (Exception e) {
            System.out.println("getResult error -> " + "파싱 실패, " + e.getMessage());
        }
        return rtnObj;
    }

}
