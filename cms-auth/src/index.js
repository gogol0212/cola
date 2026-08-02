const AUTHORIZE='https://github.com/login/oauth/authorize',TOKEN='https://github.com/login/oauth/access_token';
const respond=(message,status=200)=>new Response(message,{status,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}});
const b64=bytes=>btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
const encode=value=>b64(new TextEncoder().encode(value));
const decode=value=>new TextDecoder().decode(Uint8Array.from(atob(value.replaceAll('-','+').replaceAll('_','/')+'='.repeat((4-value.length%4)%4)),c=>c.charCodeAt(0)));
const sign=async(value,secret)=>{const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value))))};
const equal=(a,b)=>a.length===b.length&&a.split('').reduce((ok,char,index)=>ok&(char.charCodeAt(0)===b.charCodeAt(index)),1)===1;
export default{async fetch(request,env){
  const url=new URL(request.url),origins=env.ALLOWED_ORIGINS.split(',').map(x=>x.trim());
  if(!env.GITHUB_CLIENT_ID||!env.GITHUB_CLIENT_SECRET||!env.OAUTH_STATE_SECRET)return respond('OAuth secrets are not configured.',503);
  if(url.pathname==='/auth'){
    const requestedOrigin=url.searchParams.get('site_id')||url.searchParams.get('origin')||origins[0];
    const origin=requestedOrigin.startsWith('http://')||requestedOrigin.startsWith('https://')?requestedOrigin:`https://${requestedOrigin}`;
    if(!origins.includes(origin))return respond('Origin not allowed.',403);
    const payload=encode(JSON.stringify({origin,expires:Date.now()+600000,nonce:crypto.randomUUID()})),state=`${payload}.${await sign(payload,env.OAUTH_STATE_SECRET)}`,redirect=new URL(AUTHORIZE);
    redirect.searchParams.set('client_id',env.GITHUB_CLIENT_ID);redirect.searchParams.set('redirect_uri',`${url.origin}/callback`);redirect.searchParams.set('scope','repo,user');redirect.searchParams.set('state',state);return Response.redirect(redirect,302);
  }
  if(url.pathname==='/callback'){
    const code=url.searchParams.get('code'),state=url.searchParams.get('state');if(!code||!state||!state.includes('.'))return respond('Missing OAuth response.',400);
    const [payload,signature]=state.split('.');if(!equal(signature,await sign(payload,env.OAUTH_STATE_SECRET)))return respond('Invalid OAuth state.',403);
    const parsed=JSON.parse(decode(payload));if(!origins.includes(parsed.origin)||parsed.expires<Date.now())return respond('OAuth state expired or origin not allowed.',403);
    const exchange=await fetch(TOKEN,{method:'POST',headers:{accept:'application/json','content-type':'application/json','user-agent':'fangzhongda-decap-auth'},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code,redirect_uri:`${url.origin}/callback`})}),token=await exchange.json();
    if(!exchange.ok||!token.access_token)return respond('GitHub token exchange failed.',502);
    const message=`authorization:github:success:${JSON.stringify({token:token.access_token,provider:'github'})}`;
    const adminUrl=`${parsed.origin}/admin/#/`;
    const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>登录成功</title><style>body{display:grid;min-height:100vh;margin:0;place-items:center;background:#f6f4f3;color:#333d47;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif}.card{max-width:420px;margin:24px;padding:32px;border:1px solid #e5dfda;border-radius:22px;background:#fff;text-align:center}.mark{color:#d31145;font-size:2rem}a{display:inline-flex;min-height:44px;align-items:center;margin-top:16px;padding:0 18px;border-radius:999px;background:#d31145;color:#fff;font-weight:700;text-decoration:none}</style><div class="card"><div class="mark">✓</div><h1>GitHub 授权成功</h1><p id="status">正在与可乐团队内容后台建立连接…</p><a href=${JSON.stringify(adminUrl)}>返回内容后台</a></div><script>(()=>{const success=${JSON.stringify(message)},origin=${JSON.stringify(parsed.origin)},status=document.getElementById('status');let completed=false;const sendSuccess=()=>{if(completed||!window.opener||window.opener.closed)return;completed=true;window.opener.postMessage(success,origin);try{window.opener.focus()}catch{}status.textContent='登录信息已发送，正在关闭此窗口…';setTimeout(()=>window.close(),800)};window.addEventListener('message',event=>{if(event.origin===origin)sendSuccess()},false);if(window.opener&&!window.opener.closed){window.opener.postMessage('authorizing:github',origin);setTimeout(sendSuccess,1200)}else{status.textContent='授权已完成。请点击下方按钮返回内容后台。'}})()<\/script></html>`;
    return new Response(html,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"}});
  }
  return respond('Fangzhongda Decap CMS OAuth service');
}};
