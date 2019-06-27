## web安全攻防
https://zoumiaojiang.com/article/common-web-security/

### XSS 
cross site script, 简写css 与 样式css重名，故改为XSS。  
*原理：*往web页面里面恶意插入可执行的网页脚本代码。当用户浏览该页面时，嵌入web里面的脚本代码就会被执行，从而达到获取用户信息或者侵犯其他用户隐私信息的目的。    
*分类：* 持久性、非持久性
*持久性：* 持久性xss漏洞，又叫存储式xss漏洞。恶意代码主要被存储到数据库中，当页面渲染到该数据库字段时被攻击。
*如何达到攻击：* 
- 前端字段提交到数据时候，相关代码没有做转义；
- 数据入库的时候，数据存储时候，没有做转义
- 前端页面渲染相关字段时候，没有做相关转义
*如何防护：*
- 提交数据到数据库前，做相关转义处理
- 后端数据入库前，做相关转义处理
- 前端渲染页面时，做相关转义处理后在渲染数据到页面

*非持久性：* 非持久性XSS漏洞，又叫反射性XSS漏洞，通过 URL，refferer，forms的恶意脚本代码攻击。
比如 用户访问一个带有恶意脚本代码的url，该恶意代码参数会被html解析，执行，如下面：
https://edu.aliyun.com/?default=<script>alert(document.cookie)</script>  访问该页面时候，会将用户的cookie弹出，这里阿里云做了拦截，不允许带有这样脚本命令的url，访问时候 会返回405。
*特点：*
- 即时性，不经过服务器，直接通过http 的get 和 post 请求就可以完成一次攻击，拿到用户隐私数据
- 攻击者需要诱骗点击
- 反馈率低，所以较难发现和响应修复
- 盗取用户敏感保密信息
*防护：*
- web页面渲染的所有内容或者渲染的数据都必须来自服务器
- 尽量不要从URL，document.referrer, document.forms 等这种DOM API 中获取数据直接渲染
- 尽量不要使用 eval, new Function()，document.write()，document.writeln()，window.setInterval()，window.setTimeout()，innerHTML，document.creteElement() 等可执行字符串的方法。
- 如果做不到以上几点，也必须对涉及 DOM 渲染的方法传入的字符串参数做 escape 转义。前端渲染的时候对任何的字段都需要做 escape 转义编码。

### csrf
Cross site request forgery , 跨站点请求伪造 攻击者可以盗用你的登陆信息，以你的身份模拟发送各种请求。
*如何被攻击*：
1.你已经登录站点A，并且已经记录相关cookie，登录有效；
2.站点A没有退出，此时你访问了问题站点B，站点B要求访问站点A，并发出一个request，并且这个request 携带了A站点的cookie相关信息
3.站点A没有做相关的防御，
*如何防护*：
1.正确使用get和post方式
2.post 请求时候 都带有随机数
- 为每个用户生成一个唯一的 cookie token，所有表单都包含同一个伪随机值，这种方案最简单，因为攻击者不能获得第三方的 cookie(理论上)，所以表单中的数据也就构造失败，但是由于用户的 cookie 很容易由于网站的 XSS 漏洞而被盗取，所以这个方案必须要在没有 XSS 的情况下才安全。
- 每个 POST 请求使用验证码，这个方案算是比较完美的，但是需要用户多次输入验证码，用户体验比较差，所以不适合在业务中大量运用。
- 渲染表单的时候，为每一个表单包含一个 csrfToken，提交表单的时候，带上 csrfToken，然后在后端做 csrfToken 验证。


### SQL 注入
SQL injection， sql 语句注入
*如何被攻击*： 前端数据在传入相关数据内容到数据库时，该数据携带相关 sql 的一些可执行命令，这样有可能会绕开sql 数据库相关查询，比如登录时候，可能就不要密码了
比如：
```
let querySQL = `
    SELECT *
    FROM user
    WHERE username='${username}'
    AND psw='${password}'
`;
// 接下来就是执行 sql 语句...
```

上面的语句 目的就是来验证用户名和密码是不是正确，按理说乍一看上面的 SQL 语句也没什么毛病，确实是能够达到我们的目的，可是你只是站在用户会老老实实按照你的设计来输入的角度来看问题，如果有一个恶意攻击者输入的用户名是 *zoumiaojiang' OR 1 = 1 --*，密码随意输入，就可以直接登入系统了。

SELECT * FROM user WHERE username='zoumiaojiang' OR 1 = 1 --' AND psw='xxxx'  
上面的查询就会变成：  
SELECT * FROM user WHERE username='zoumiaojiang' OR 1 = 1
这条 SQL 语句的查询条件永远为真，所以意思就是恶意攻击者不用登录密码，就可以登录进我的账号，细思极恐哇！

*如何防护*：
1.前端表单提交需要验证，对数据库敏感的相关字符要过滤，严格正则验证
2.数据库录入数据时，要对前端传入的数据进行转义，（'，"，\，<，>，&，*，; 等）

### 命令行注入

### DDos 攻击
一直访问服务器，占用了访问资源，导致其他正常用户的访问资源被占，表现在无法访问卡顿，相关操作访问迟缓等
