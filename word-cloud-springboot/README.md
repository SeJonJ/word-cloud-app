# 워드 클라우드 Spring Boot 백엔드

워드 클라우드 애플리케이션의 백엔드 API를 제공하는 Spring Boot 프로젝트입니다.

## 기술 스택

- **Java 17**
- **Spring Boot 3.x**
- **Komoran**: 한국어 형태소 분석기
- **Naver API**: 외부 데이터 수집 및 분석

## 주요 기능

- 텍스트 데이터 분석 및 워드 클라우드 데이터 생성
- 한국어 형태소 분석을 통한 단어 빈도 계산
- 웹 크롤링을 통한 텍스트 데이터 수집
- REST API 제공

## 시작하기

### 요구사항

- JDK 17 이상
- Gradle 7.x 이상

### 실행 방법

```bash
# 프로젝트 디렉토리로 이동
cd word-cloud-springboot

# 그래들 빌드
./gradlew build

# 애플리케이션 실행
./gradlew bootRun
```

서버는 기본적으로 `http://localhost:8080`에서 실행됩니다.

## API 엔드포인트

### 워드 클라우드 데이터 생성

- **URL**: `/api/wordcloud`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "text": "분석할 텍스트 내용",
    "minCount": 2,
    "maxWords": 100
  }
  ```
- **Response**:
  ```json
  {
    "words": [
      { "text": "단어1", "value": 10 },
      { "text": "단어2", "value": 8 },
      ...
    ]
  }
  ```

### 검색어 기반 워드 클라우드

- **URL**: `/api/search`
- **Method**: GET
- **Parameters**: `keyword=[검색어]`
- **Response**: 검색어 관련 워드 클라우드 데이터

## 프로젝트 구조

```
src/main/java/com/wordcloud/
├── Controller/       # API 컨트롤러
├── Service/          # 비즈니스 로직
├── Config/           # 설정 클래스
└── WordCloudApplication.java  # 메인 애플리케이션
```

## application.properties
```application.properties
# Server Configuration
server.port=8080

# Application Configuration
spring.application.name=word-cloud

# Naver API Configuration
naver.api.search-url=https://openapi.naver.com/v1/search/blog.json?query=
naver.api.client-id={api 클라이언트 id}
naver.api.client-secret={api 시크릿 아이디}

# Logging Configuration
logging.level.com.wordcloud=DEBUG
```