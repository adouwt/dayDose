## web安全攻防
https://zoumiaojiang.com/article/common-web-security/

### XSS 
cross site script, 简写css 与 样式css重名，故改为XSS。  
原理：往web页面里面恶意插入可执行的网页脚本代码。当用户浏览该页面时，嵌入web里面的脚本代码就会被执行，从而达到获取用户信息或者侵犯其他用户隐私信息的目的。    
分类： 持久性、非持久性
持久性：
非持久性：非持久性XSS漏洞，又叫反射性XSS漏洞，用户访问一个带有恶意脚本代码的url，该恶意代码参数会被html解析，执行，如下面：
https://edu.aliyun.com/?default=<script>alert(document.cookie)</script>  访问该页面时候，会将用户的cookie弹出，这里阿里云做了拦截，不允许带有这样脚本命令的url，访问时候 会返回405。
特点：
- 即时性，不经过服务器，直接通过http 的get 和 post 请求就可以完成一次攻击，拿到用户隐私数据
- 攻击者需要诱骗点击
- 反馈率低，所以较难发现和响应修复
- 盗取用户敏感保密信息
防护：
- web页面渲染的所有内容或者渲染的数据都必须来自服务器
- 尽量不要从URL，document.referrer, document.forms 等这种DOM API 中获取数据直接渲染