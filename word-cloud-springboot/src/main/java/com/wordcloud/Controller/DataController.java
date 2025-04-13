package com.wordcloud.Controller;

import com.wordcloud.dto.response.WordCloudResponse;
import com.wordcloud.service.NaverParsing;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class DataController {
    private final NaverParsing naverParsing;

    @RequestMapping(value = "/wordCloud", method = RequestMethod.GET)
    public ResponseEntity<List<WordCloudResponse>> wordCloud(
            @RequestParam("word")String word) throws IOException {

        // NaverParsing 클래스의 parsingData 를 실행하고 겨과를 HashMap 로 저장함
        // 이때 파라미터로 웽에서 가져온 word 를 사용
        Map<String, Integer> searchResult = naverParsing.parsingData(word);

        return new ResponseEntity<>(WordCloudResponse.from(searchResult), HttpStatus.OK);
    }
}
