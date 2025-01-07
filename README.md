# 2025-01-07 Binace-Demo Task 14:40 start

# 필수 구현 요소 별 Binance APi check

(1) 코인 목록 및 검색 기능
Binance API 또는 Mock 데이터를 사용하여 코인 목록을 표시.
검색창에서 코인 심볼이나 이름으로 필터링 가능.

API : https://api.binance.com/api/v3/exchangeInfo

(2) Orderbook 기능
호가창에서 매수/매도 가격 데이터를 표시.
호가창의 특정 가격을 클릭하면 입력 필드에 선택된 가격이 적용.

API : https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=10

(3) 차트 시각화
코인 가격 데이터를 시각적으로 보여주는 차트.
React Native에서 사용할 수 있는 차트 라이브러리 사용.

사용 라이브러리 :  
https://github.com/coinjar/react-native-wagmi-charts

시간 간격 (1분, 15분, 1시간 등)을 기준으로 데이터를 표시.
