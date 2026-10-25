---
Title: UEFIマザーボードのデスクトップ機にDebianをインストールしようとしたらBIOS時代と勝手が違った話
Tags:
    - Debian
    - UEFI
Slug: debian-install-uefi-desktop
Posted_at: 2026-10-25
---
# UEFIマザーボードのデスクトップ機にDebianをインストールしようとしたらBIOS時代と勝手が違った話

20年ぶりくらいにプライベート用途のデスクトップパソコンを新調してDebianデスクトップを構築しようとしてMacでISOをダウンロードしてきてddでUSBメモリーに書き込んだら認識されなかった。

結論からいうと新しいマザーボードがUEFIでBIOS時代とは手順が違うとのことだったのでこれは残しておこうと思いブログにしたためておくことにした。


## 以下、MacのTerminalでの作業
```bash
# 1. USBメモリーのディスク番号を確認
diskutil list

# 2. USBを GPT + FAT32 で初期化（今回は /dev/disk4 / ボリューム名: DEBIAN）
diskutil eraseDisk FAT32 DEBIAN GPT /dev/disk4

# 3. 7z コマンドで ISO の中身を FAT32 ボリュームへ直接展開
7z x ~/Desktop/debian-13.7.0-amd64-netinst.iso -o /Volumes/DEBIAN/

# 4. キャッシュの書き込みと安全な取り外し
sync
diskutil eject /dev/disk4
```

diskutil listはUSBメモリーがどこにマウントされているかの確認、これはいつも通り。今回は/dev/disk4だった。DEBIANというのはこちらで指定したボリューム名。デスクトップにダウンロードしてきたDebian（今回はTrixieを使用）のISOを置いている。

/dev/disk4をFAT32でフォーマット、DEBIANというボリューム名を付けておく。

そして7zを使って直接/Volumes/DEBIAN/に展開、syncして全部書き込んでからマウントを解除している。

あとはUSBメモリーをMacから取り外してデスクトップに差し込んで起動。機種にもよりけりだろうけどDEL+F11を押下してセットアップモードに入れる。ここでブートデバイスとしてUEFIうんたらが選択できるようになっていたらあとはこれまで通りの手順。

ddでISOを書き込んでもUEFI側としては起動デバイスとして認識できないらしい。

いままで使ってきた自作マシンは全部BIOSだったからだいぶ手こずったけど、これで無事にLinuxデスクトップ機を構築できた。ずっとIntel機だったのに今回はRyzenを導入したのでCPUの違いによるものかと思ったりもしたけどCPUに届く前のところでコケてたので気付けてよかった。

Happy Linuxデスクトップライフ!