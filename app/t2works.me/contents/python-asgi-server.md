---
Title: ASGIをサポートするPython用HTTPサーバーの性能評価をした
Tags:
    - Python
Slug: python-asgi-server
Posted_at: 2025-03-20
---
# ASGIをサポートするPython用HTTPサーバーの性能評価をした

## 評価対象は以下
- [gunicorn](https://github.com/benoitc/gunicorn)
  - 定番のgunicorn + uvicorn
  - gunicorn main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker
- [Granian](https://github.com/emmett-framework/granian)
  - Rustで実装されてる、このソフトウェアの存在を知ってベンチする気になった
  - granian --interface asgi --workers 1 --threads 1 main:app
- [daphne](https://github.com/django/daphne)
  - Django専用か？と思ったけどちゃんと他のフレームワークでも動く
  - daphne main:app
- [Hypercorn](https://github.com/pgjones/hypercorn)
  - WSGIの頃から存在は知ってたけど使ったことないHypercorn、失礼ながら強みは把握してない
  - hypercorn --worker-class uvloop main:app

## 評価方法は

floatの値をふたつ受け取ってそのふたつの合計値を返すというHello Worldを返すだけのと大差ないアプリケーションを用意して、そのアプリケーションの前に置くHTTPサーバーを入れ替えつつ性能を評価していきます。

アプリケーションのフレームワークはFastAPIを利用。

負荷をかけるツールは[siege](https://github.com/JoeDog/siege)を利用、パラメーターは

siege -c 30 -t 10S -T "application/json" -i -f parameters.txt

parameters.txtにはランダム生成した値がずらっと並んでいます。30並列で負荷をかけたあとに50並列も試しました。10秒で短そうだったら伸ばしていこうかと思ってたけど十分だったかなと。

## まずは結論から

siegeは計測結果にいろいろな値を出力しますが今回はtransactionsという値だけを並べて評価としました。処理したリクエスト数ですね。なお全てのパターンでavailabilityは100%で全リクエストを正常に処理してくれました。

### -c 30（並列数30）
- gunicorn (+uvicorn)
  - 62,072
- Granian
  - 146,330
- daphne
  - 34,052
- Hypercorn
  - 41,795

### -c 50（並列数50）
- gunicorn (+uvicorn)
  - 57,246
- Granian
  - 149,107
- daphne
  - 35,515
- Hypercorn
  - 41,084

## 感想

3回同じパラメーターでテストして、どれも似たような数字を出したのでたまたま出たスコアっていうことはなさそうです。

Granianはgunicornの倍以上のリクエストを捌いてくれました。圧倒的でした。速いけど処理に失敗したりすることもあるかなと思っていましたがそんなこともなくすべてのリクエストを捌いてくれました。

daphneとHypercornはこのテストの結果だけだと積極的に選択することはない気がしてしまう。daphneがDjangoで使うとなにか親和性が高いとかあるのかもしれないけど、今回はそこまで調べてません。gunicornかGranianのどちらかでいいんじゃないかな。

50並列にしてもスコアが伸びてないのはこのあたりが頭打ちなのかなと思っております。これ以上並列数増やすならワーカー数増やさないとねってことかと。Granianで微増、他は微減。

ちなみにdaphneにはワーカー数という起動オプションは見当たらず、ワーカー増やしたいならsupervisor使って複数立ち上げてねって[stackoverflow](https://stackoverflow.com/questions/70622235/how-to-increase-number-of-workers-in-daphne-with-django)で言及されてた。正直いってこれみてdaphneはねえなって思った。

まあ、現時点では歴史もあって安心のgunicorn(+uvicorn)か速いGranianのどちらかかな。まあHTTPサーバーの性能云々よりRDBとかのチューニングしたほうが効果は高いでしょうね。

## おまけ

ASGIが出てくる前はずっと[uWSGI](https://github.com/unbit/uwsgi)を使っていたのですが、名前の通りWSGIしかサポートしてないしメンテナンスモードに入っちゃったし、uASGIに相当するソフトウェアはないもんかとあれこれ見て性能評価をすることにしました。

10秒だけじゃなくて12時間くらい負荷かけ続けてメモリ消費量含め性能劣化とかも調べておいたほうがいいんだろうなとは思ったけど、まあ業務外で試す程度ならこんなもんよ。導入前評価でやるならもっとちっとちゃんとやるよ。