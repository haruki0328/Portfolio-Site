# Portfolio Site

自身のスキルや制作物を紹介するためのポートフォリオサイトです。

## 技術構成

- HTML5 / CSS3 / JavaScript
- GSAP・ScrollTrigger（スクロール連動アニメーション）
- Vanta.js + Three.js（背景の動的演出）
- Typed.js（タイピングアニメーション）

## 構成

- `index.html` : トップページ（About / Works / Contact）
- `style.css` : 全体のスタイル
- `script.js` : スクロールアニメーション・モーダル表示・お問い合わせフォームの制御
- `works/` : 各制作物の詳細ページ
- `img/` : サイト内で使用する画像

## 使い方

`index.html` をブラウザで開くだけで動作します。ローカルサーバーを立てる場合は、`frontend` 側の開発と同様に任意の静的サーバー（VS CodeのLive Server拡張など）で配信してください。

## 掲載している制作物

- PC Parts EC Site（Spring Boot + React + MySQL + Stripe）
- Guitar Tab AI（Demucs / Omnizart による自動TAB譜生成）
- Book Review App（Streamlit + Open Library API）
