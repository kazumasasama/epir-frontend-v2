# biznesu-frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 顧客管理
#### 新規顧客
  - お客様自身が登録する
    - ホーム画面から登録ボタンを押して登録画面へ

  - 管理人が登録する
    - 管理メニュー/顧客へ
    - 画面上部の新規顧客ボタンをクリックするとお客様の登録画面と共用の登録ページへリダイレクトされます。
    - この画面を使って一般ユーザーを登録できます。

  - 店舗で登録する(**非推奨**)
    - お店のデバイスで登録してもらう場合、登録後に自動で登録したユーザーのアカウントでログインされます。そのため予約完了後には手動でロウアウトが必要になります。
    お客様のアカウントでの不意の操作や情報漏洩を防ぐためなるべくこの方法は実施しないでください。
    
    - 新規登録画面で登録後リダイレクトされる客様用の予約作成画面のステップに沿って予約作成してください。
    予約が完了したら**必ずログアウトしてください**。
    
    -  ログイン画面から管理人アカウントにログインします。