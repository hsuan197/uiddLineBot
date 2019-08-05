# Linebot
## 說明
- https://hackmd.io/qYylEc61TyeHS3kT_0Zv4A
- https://drive.google.com/drive/u/0/folders/1BUcM5sA9otfnD7BjvRn3YjLFdozT1iiu

## install & run
  * install
    * `yarn` or `npm install`
  * make your config.json
    * `cp config.json.sample config.json`
  * edit your config.json
  * run 
    * `node lineser.js`
  * sign in https://developers.line.biz/en/
  * change Webhook URL
  * change Liff URL

## change RichMenu
  * see https://developers.line.biz/en/docs/messaging-api/using-rich-menus/
  * necessary button
    * people:
      * uri,"uri":"line://nv/location"
      * postback,"data":"btn_2"
      * postback,"data":"btn_3"
      * postback,"data":"btn_4"
    * volunteer
      * postback,"data":"btn_11"
      * postback,"data":"btn_12"
      * postback,"data":"btn_13"  
      * postback,"data":"btn_14"
      
## demo影片
  * 民眾版
    * https://drive.google.com/file/d/1NKd8wnxtAaVzSXVk5_aHM10epHDfE_ma/view?usp=sharing
  * 志工版
    * 填寫 https://drive.google.com/file/d/1252R9_7vcs2i0JlHVgxD8MNYlGbWIC10/view?usp=sharing
    * 查看 https://drive.google.com/file/d/1Qg0hlwerjObaRCx-1qq9xJDn9n0UIiCU/view?usp=sharing
    
