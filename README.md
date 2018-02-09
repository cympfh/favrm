# favrm

ファボられたらリムる

Remove your tweets which was favorited.

## config.yml [yaml]

```yaml
twitter:
  username: ampeloss
  consumer_key: xxxxxxxxxxxxxxxxxxxxxx
  consumer_secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  access_token_key: 000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  access_token_secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

protect:
  has_media: true
  keywords:
    - 世界が平和でありますように
```

## dependencies

```bash
npm install
```

## run

```bash
make favrm
```
