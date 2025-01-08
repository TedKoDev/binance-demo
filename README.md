# 2025-01-07 Binace-Demo Task 14:40 start

# 필수 구현 요소 별 Binance APi check

(1) 코인 목록 및 검색 기능
Binance API 또는 Mock 데이터를 사용하여 코인 목록을 표시.
검색창에서 코인 심볼이나 이름으로 필터링 가능.

API : https://api.binance.com/api/v3/exchangeInfo

(1-1) 24시간 기준 가격변동

API : https://api.binance.com/api/v3/ticker/24hr

(2) Orderbook 기능
호가창에서 매수/매도 가격 데이터를 표시.
호가창의 특정 가격을 클릭하면 입력 필드에 선택된 가격이 적용.

API : https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=10

(3) 그래프용
Kline/Candlestick Data API
Endpoint: https://api.binance.com/api/v3/klines
이 API를 사용하면 특정 심볼의 캔들스틱 데이터를 원하는 기간 단위(예: 1분, 1시간, 1일 등)로 가져올 수 있습니다.

요청 형식
http
코드 복사
GET /api/v3/klines?symbol=BTCUSDT&interval=1d&limit=3
주요 파라미터:
symbol: 조회할 심볼 (예: BTCUSDT, ETHUSDT 등)
interval: 조회 주기 (캔들스틱 데이터의 기간)
예시 값:
1m (1분), 5m (5분), 1h (1시간), 1d (1일), 1w (1주)
limit: 가져올 데이터 수 (예: 3이면 가장 최근 3개의 데이터)
startTime, endTime (선택): 특정 시간 범위를 지정해 데이터를 가져올 수도 있음.

예시
1일기준 3일 데이터 요청
API : https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=3

(4) 차트 시각화
코인 가격 데이터를 시각적으로 보여주는 차트.
React Native에서 사용할 수 있는 차트 라이브러리 사용.

사용 라이브러리 :  
https://github.com/coinjar/react-native-wagmi-charts
npm install react-native-wagmi-charts

##필요 라이브러리 설치
npx expo install @tanstack/react-query recoil axios @tanstack/react-query-devtools

## NativeWind for CSS

npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context

## bottom-sheet으로 바텀 슬라이드 모달

expo install @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler

#lodash의 debounce를 설치
npm install lodash
npm install --save-dev @types/lodash

## 특이사항

1. zones에 따른 코인정보는 API가 없음
