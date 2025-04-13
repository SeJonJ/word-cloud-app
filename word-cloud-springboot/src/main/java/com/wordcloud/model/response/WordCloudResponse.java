package com.wordcloud.model.response;

import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Builder
public class WordCloudResponse {
    private String word;
    private Integer score;

    public static List<WordCloudResponse> from(Map<String, Integer> searchResult) {
        List<WordCloudResponse> wordCloudResponseList = new ArrayList<>();
        for(String word : searchResult.keySet()) {
            WordCloudResponse response = WordCloudResponse
                    .builder()
                    .word(word)
                    .score(searchResult.get(word))
                    .build();
            wordCloudResponseList.add(response);
        }

        return wordCloudResponseList;
    }
} 