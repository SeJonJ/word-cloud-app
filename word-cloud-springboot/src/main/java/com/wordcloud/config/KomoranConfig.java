package com.wordcloud.config;

import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.IOException;

@Getter
@Configuration
public class KomoranConfig {

    @Value("classpath:dictionary/koreanDic.user")
    private Resource userDicResource;

    @Bean
    Komoran komoran() throws IOException {
        Komoran komoran = new Komoran(DEFAULT_MODEL.FULL);

        // Resource를 파일로 변환하여 경로 설정
        File userDicFile = userDicResource.getFile();
        komoran.setUserDic(userDicFile.getAbsolutePath());

        return komoran;
    }
}
