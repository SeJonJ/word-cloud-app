package com.wordcloud.service;

import kr.co.shineware.nlp.komoran.core.Komoran;
import kr.co.shineware.nlp.komoran.model.KomoranResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Service
public class NaverParsing {
    private final Komoran komoran;
    private final NaverCrawler naverCrawler;

    public Map<String, Integer> parsingData(String word) {

        // NaverCrawler 클래스의 crawlerData 메소드를 사용해서 크롤링한 STring 을 얻어오기
        String dataString = naverCrawler.crawler(word);

        // 가져온 String을 komoran analyze 메소드에 넣기
        KomoranResult komoranResult = komoran.analyze(dataString);

        // 여기서 getMorphesByTags 사용하면 내가원하는 형태소만 뽑아낼 수 있음
        List<String> analyzeList = komoranResult.getMorphesByTags("NNP","NNG","NNB","NP");

        return analyzeCrawlingData(analyzeList);

    }

    private Map<String, Integer> analyzeCrawlingData(List<String> analyzeList){
        // list 파일로 떨어진 analyzeList 를 HashMap 에 넣어서 중복된 데이터를 삭제하고
        // Conllections.frequency 를 사용해서 몇 번이나 중복되었는지 분석하여 저장한다.
        // 최종적으로 listHash 에는 단어=중복횟수 로 저장된다.
        // Collections.frequency(Collections객체, 값)
        Map<String, Integer> listHash = new ConcurrentHashMap<>();
        for (String l : analyzeList) {
            int num = Collections.frequency(analyzeList, l);
            listHash.put(l, num);
        }

        return listHash;
    }

}
