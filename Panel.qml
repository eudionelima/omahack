import QtQuick
import QtQuick.Controls
import Quickshell
import Quickshell.Io
import qs.Commons
import qs.Ui
import "Payloads.js" as P

// OmaHack - CTF & Pentest Toolkit for Omarchy Linux
Panel {
  id: root
  moduleName: "dione.omahack"
  ipcTarget: "dione.omahack"

  Scope {
    IpcHandler {
      target: "dione.omahack.control"
      function togglePalette(): void {
        root.showPalette = !root.showPalette
        root.paletteQuery = ""
        root.paletteIndex = 0
      }
      function setCategory(cat: string): void {
        root.navigateTo(cat, "all")
      }
      function setSubcategory(cat: string, sub: string): void {
        root.navigateTo(cat, sub)
      }
      function setSearch(q: string): void {
        root.searchText = q
      }
      function setLanguage(lang: string): void {
        root.language = lang
      }
      function goBack(): void {
        root.goBack()
      }
      function goForward(): void {
        root.goForward()
      }
    }
  }

  // Alt+K global: funciona com foco em qualquer campo (o Keys.onPressed do
  // PanelKeyCatcher nao recebe teclas de irmaos com foco, por isso o Shortcut)
  Shortcut {
    sequence: "Alt+K"
    onActivated: {
      root.showPalette = !root.showPalette
      root.paletteQuery = ""
      root.paletteIndex = 0
      if (root.showPalette) Qt.callLater(function() { paletteField.forceActiveFocus() })
    }
  }

  readonly property string home: Quickshell.env("HOME")

  property string attackerIp: "10.10.10.10"
  property string attackerPort: "1337"
  property string fileName: "id_rsa"
  property string adDomain: "LAB.local"
  property string adUser: "Administrator"
  property string adDc: ""
  property string pivotNet: "10.10.20.0/24"
  property string pivotHost: "10.10.20.10"

  // Active navigation state
  property string category: "web"
  property string linuxSubcat: "all"
  property string sqliSubcat: "all"
  property string webSubcat: "all"
  property string cheatSubcat: "all"

  property string copiedMsg: ""
  property string encodeInput: ""
  property string encodeOutput: ""
  property string hashInput: ""
  property string hashAlgo: "md5"
  property string hashOutput: ""

  // English is default; language button switches to Portuguese
  property string language: "en"
  property string searchText: ""
  property int selectedIndex: 0
  property bool keyboardNav: false
  property var favorites: []
  property var clipHistory: []

  // Command palette state
  property bool showPalette: false
  property string paletteQuery: ""
  property int paletteIndex: 0

  // History tracking for back / forward navigation
  property var navHistory: [{ category: "web", subcat: "all" }]
  property int navIndex: 0

  PersistentProperties {
    id: savedState
    reloadableId: "omahack-state"
    property string favoritesJson: "[]"
  }

  Component.onCompleted: {
    try { root.favorites = JSON.parse(savedState.favoritesJson || "[]") } catch (e) { root.favorites = [] }
  }

  function isFavorite(code) { return root.favorites.indexOf(String(code || "")) >= 0 }
  function toggleFavorite(code) {
    var value = String(code || "")
    if (!value) return
    var next = root.favorites.slice(0)
    var pos = next.indexOf(value)
    if (pos >= 0) next.splice(pos, 1)
    else next.push(value)
    root.favorites = next
    savedState.favoritesJson = JSON.stringify(next)
  }

  readonly property string dcEffective: root.adDc !== "" ? root.adDc : root.attackerIp
  readonly property var searchResults: P.searchPayloads(root.searchText, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)



  function tr(en, pt) {
    return root.language === "pt-BR" ? pt : en
  }

  implicitWidth: Style.bar.iconSlot
  implicitHeight: Style.bar.sizeHorizontal

  function copyText(t) {
    var s = String(t || "")
    if (!s) return
    Quickshell.execDetached(["/usr/bin/wl-copy", s])
    root.copiedMsg = root.tr("Copied!", "Copiado!")
    copyTimer.restart()
  }

  function navigateTo(cat, subcat) {
    var targetSub = subcat || "all"
    var nextHist = root.navHistory.slice(0, root.navIndex + 1)
    nextHist.push({ category: cat, subcat: targetSub })
    root.navHistory = nextHist
    root.navIndex = nextHist.length - 1
    applyCategory(cat, targetSub)
  }

  function applyCategory(cat, subcat) {
    root.category = cat
    root.searchText = ""
    root.selectedIndex = 0
    root.keyboardNav = false
    if (cat === "linux") root.linuxSubcat = subcat || "all"
    else if (cat === "sqli") root.sqliSubcat = subcat || "all"
    else if (cat === "web") root.webSubcat = subcat || "all"
    else if (cat === "cheats") root.cheatSubcat = subcat || "all"
  }

  function goBack() {
    if (root.navIndex > 0) {
      root.navIndex--
      var prev = root.navHistory[root.navIndex]
      applyCategory(prev.category, prev.subcat)
    }
  }

  function goForward() {
    if (root.navIndex < root.navHistory.length - 1) {
      root.navIndex++
      var next = root.navHistory[root.navIndex]
      applyCategory(next.category, next.subcat)
    }
  }

  // Active payloads list for keyboard navigation & Enter execution
  readonly property var currentPayloadsList: {
    if (root.searchText.trim() !== "") return root.searchResults
    if (root.category === "web") return P.getWebPayloads(root.webSubcat, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
    if (root.category === "linux") return P.getLinuxPayloads(root.linuxSubcat, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
    if (root.category === "sqli") return P.getSqliPayloads(root.sqliSubcat, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
    if (root.category === "cheats") return P.getCheatsheets(root.cheatSubcat, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
    if (root.category === "favs") return P.getFavorites(root.favorites, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
    return []
  }

  readonly property var filteredClipboard: {
    var list = root.clipHistory || []
    var q = root.searchText.trim().toLowerCase()
    if (!q) return list
    return list.filter(function(item) {
      var txt = String(item.text || "").toLowerCase()
      return txt.indexOf(q) >= 0
    })
  }

  // Command palette entries
  readonly property var paletteCommands: [
    { id: "mod-web", title: root.tr("Web Security", "Segurança Web"), icon: "󰖟", badge: "Module", desc: root.tr("Headers, SSTI, RFI, Path Traversal, CMD Injection", "Headers, SSTI, RFI, Path Traversal, Injeção de Comando"), action: function() { root.navigateTo("web", "all") } },
    { id: "mod-rev", title: root.tr("Reverse Shells", "Reverse Shells"), icon: "󰯄", badge: "Module", desc: root.tr("Bash, Python, PHP, Netcat, PowerShell, socat, MSFVenom", "Bash, Python, PHP, Netcat, PowerShell, socat, MSFVenom"), action: function() { root.navigateTo("rev") } },
    { id: "mod-linux", title: root.tr("Linux Privilege Escalation", "Escalação de Privilégios Linux"), icon: "󰌧", badge: "Module", desc: root.tr("SUID, SGID, Capabilities, Cron, PATH, Writable, SSH, SCP, Proxy", "SUID, SGID, Capabilities, Cron, PATH, Graváveis, SSH, SCP, Proxy"), action: function() { root.navigateTo("linux", "all") } },
    { id: "mod-sqli", title: root.tr("SQL Injection & DBMS", "Injeção SQL & DBMS"), icon: "󰆼", badge: "Module", desc: root.tr("Auth, Boolean, UNION, Error, Time, MySQL, Postgres, MSSQL, sqlmap", "Auth, Boolean, UNION, Erro, Tempo, MySQL, Postgres, MSSQL, sqlmap"), action: function() { root.navigateTo("sqli", "all") } },
    { id: "mod-win", title: root.tr("Windows Exploitation", "Exploração Windows"), icon: "󰍲", badge: "Module", desc: root.tr("Whoami, Unquoted Paths, AlwaysInstallElevated, Token Privs", "Whoami, Unquoted Paths, AlwaysInstallElevated, Privilégios de Token"), action: function() { root.navigateTo("win") } },
    { id: "mod-ad", title: root.tr("Active Directory", "Active Directory"), icon: "󰀂", badge: "Module", desc: root.tr("Kerberoasting, BloodHound, DCSync, Secretsdump, NetExec", "Kerberoasting, BloodHound, DCSync, Secretsdump, NetExec"), action: function() { root.navigateTo("ad") } },
    { id: "mod-cheats", title: root.tr("Cheatsheets & Cloud", "Guias & Nuvem"), icon: "󰚩", badge: "Module", desc: root.tr("Docker, Kubernetes, AWS, Azure, Windows, Web, Linux", "Docker, Kubernetes, AWS, Azure, Windows, Web, Linux"), action: function() { root.navigateTo("cheats", "all") } },
    { id: "mod-clip", title: root.tr("Clipboard History", "Histórico do Clipboard"), icon: "󰅍", badge: "Tool", desc: root.tr("View and copy recent clipboard entries", "Visualizar e copiar entradas recentes do clipboard"), action: function() { root.navigateTo("clipboard") } },
    { id: "mod-favs", title: root.tr("Favorites (★)", "Favoritos (★)"), icon: "★", badge: "Saved", desc: root.tr("List all saved star payloads", "Listar todos os payloads favoritos"), action: function() { root.navigateTo("favs") } },
    { id: "mod-pivot", title: root.tr("Network Pivoting", "Pivoting de Rede"), icon: "󰑩", badge: "Module", desc: root.tr("SSH tunnels, Chisel, Ligolo-ng, SOCKS, Proxychains", "Túneis SSH, Chisel, Ligolo-ng, SOCKS, Proxychains"), action: function() { root.navigateTo("pivot") } },
    { id: "mod-transf", title: root.tr("File Transfer", "Transferência de Arquivos"), icon: "󰇚", badge: "Module", desc: root.tr("HTTP server, wget, curl, bash upload, netcat", "Servidor HTTP, wget, curl, upload bash, netcat"), action: function() { root.navigateTo("transf") } },
    { id: "mod-exfil", title: root.tr("Data Exfiltration", "Exfiltração de Dados"), icon: "󰈎", badge: "Module", desc: root.tr("curl, wget, DNS dig, ICMP, PowerShell, base64", "curl, wget, DNS dig, ICMP, PowerShell, base64"), action: function() { root.navigateTo("exfil") } },
    { id: "mod-rce", title: root.tr("Remote Code Execution", "Execução Remota de Código"), icon: "󰯂", badge: "Module", desc: root.tr("Command separators, IFS, SSTI, Log4Shell, uploads", "Separadores de comando, IFS, SSTI, Log4Shell, uploads"), action: function() { root.navigateTo("rce") } },
    { id: "mod-encode", title: root.tr("Encoders & Decoders", "Codificadores / Decodificadores"), icon: "󰉢", badge: "Tool", desc: root.tr("Base64, URL, Hex, HTML, Unicode, Binary", "Base64, URL, Hex, HTML, Unicode, Binário"), action: function() { root.navigateTo("cod") } },
    { id: "mod-hash", title: root.tr("Hash Generators", "Geradores de Hash"), icon: "󰛲", badge: "Tool", desc: root.tr("MD5, SHA1, SHA256, SHA512, SM3", "MD5, SHA1, SHA256, SHA512, SM3"), action: function() { root.navigateTo("hash") } },

    // Subcategories Linux
    { id: "sub-linux-suid", title: "Linux: SUID", icon: "󰌧", badge: "Subcat", desc: root.tr("Binaries with SUID bit set (/4000)", "Binários com bit SUID configurado (/4000)"), action: function() { root.navigateTo("linux", "suid") } },
    { id: "sub-linux-sgid", title: "Linux: SGID", icon: "󰌧", badge: "Subcat", desc: root.tr("Binaries with SGID bit set (/2000)", "Binários com bit SGID configurado (/2000)"), action: function() { root.navigateTo("linux", "sgid") } },
    { id: "sub-linux-caps", title: "Linux: Capabilities", icon: "󰌧", badge: "Subcat", desc: root.tr("POSIX capabilities (getcap)", "Capacidades POSIX (getcap)"), action: function() { root.navigateTo("linux", "capabilities") } },
    { id: "sub-linux-cron", title: "Linux: Cron & Timers", icon: "󰌧", badge: "Subcat", desc: root.tr("Crontabs, systemd timers", "Crontabs, timers do systemd"), action: function() { root.navigateTo("linux", "cron") } },
    { id: "sub-linux-path", title: "Linux: PATH Hijacking", icon: "󰌧", badge: "Subcat", desc: root.tr("Writable directories in $PATH", "Diretórios com permissão de escrita no $PATH"), action: function() { root.navigateTo("linux", "path") } },
    { id: "sub-linux-write", title: "Linux: Writable Files", icon: "󰌧", badge: "Subcat", desc: root.tr("World-writable files and dirs", "Arquivos e diretórios graváveis globais"), action: function() { root.navigateTo("linux", "writable") } },
    { id: "sub-linux-tty", title: "Linux: TTY Stabilization", icon: "󰆍", badge: "Subcat", desc: root.tr("Python pty, script, stty raw", "Python pty, script, stty raw"), action: function() { root.navigateTo("linux", "tty") } },
    { id: "sub-linux-ssh", title: "Linux: SSH", icon: "󰌧", badge: "Subcat", desc: root.tr("SSH keys, authorized_keys, keygen", "Chaves SSH, authorized_keys, keygen"), action: function() { root.navigateTo("linux", "ssh") } },
    { id: "sub-linux-scp", title: "Linux: SCP", icon: "󰌧", badge: "Subcat", desc: root.tr("Secure file copy, upload, download", "Cópia segura de arquivos, upload, download"), action: function() { root.navigateTo("linux", "scp") } },
    { id: "sub-linux-proxy", title: "Linux: Proxy & Tun", icon: "󰌧", badge: "Subcat", desc: root.tr("SSH -D SOCKS, sshuttle, proxychains", "SSH -D SOCKS, sshuttle, proxychains"), action: function() { root.navigateTo("linux", "proxy") } },

    // Subcategories SQLi
    { id: "sub-sqli-auth", title: "SQLi: Authentication", icon: "󰆼", badge: "Subcat", desc: root.tr("Login bypass payloads (' OR 1=1)", "Bypass de login (' OR 1=1)"), action: function() { root.navigateTo("sqli", "auth") } },
    { id: "sub-sqli-union", title: "SQLi: UNION Based", icon: "󰆼", badge: "Subcat", desc: root.tr("Order by, UNION SELECT, schema extraction", "Order by, UNION SELECT, extração de esquema"), action: function() { root.navigateTo("sqli", "union") } },
    { id: "sub-sqli-bool", title: "SQLi: Boolean Blind", icon: "󰆼", badge: "Subcat", desc: root.tr("True/False conditions, substring extraction", "Condições Verdadeiro/Falso, extração substring"), action: function() { root.navigateTo("sqli", "boolean") } },
    { id: "sub-sqli-time", title: "SQLi: Time Based", icon: "󰆼", badge: "Subcat", desc: root.tr("SLEEP, WAITFOR DELAY, pg_sleep", "SLEEP, WAITFOR DELAY, pg_sleep"), action: function() { root.navigateTo("sqli", "time") } },
    { id: "sub-sqli-sqlmap", title: "SQLi: sqlmap", icon: "󰆼", badge: "Subcat", desc: root.tr("Automated SQLi commands and dumps", "Comandos automatizados de sqlmap e dumps"), action: function() { root.navigateTo("sqli", "sqlmap") } },

    // Subcategories Cheatsheets
    { id: "sub-cheat-k8s", title: "Cheatsheet: Kubernetes", icon: "󰚩", badge: "Cheats", desc: root.tr("Secrets, RBAC, service accounts, token", "Secrets, RBAC, service accounts, tokens"), action: function() { root.navigateTo("cheats", "kubernetes") } },
    { id: "sub-cheat-docker", title: "Cheatsheet: Docker", icon: "󰚩", badge: "Cheats", desc: root.tr("Container breakout, docker.sock, cgroup", "Escape de container, docker.sock, cgroup"), action: function() { root.navigateTo("cheats", "docker") } },
    { id: "sub-cheat-aws", title: "Cheatsheet: AWS", icon: "󰚩", badge: "Cheats", desc: root.tr("STS caller identity, S3 sync, IMDSv1", "STS caller identity, S3 sync, IMDSv1"), action: function() { root.navigateTo("cheats", "aws") } },
    { id: "sub-cheat-azure", title: "Cheatsheet: Azure", icon: "󰚩", badge: "Cheats", desc: root.tr("az account, Managed Identity token, groups", "az account, token Managed Identity, groups"), action: function() { root.navigateTo("cheats", "azure") } },

    // Quick Actions
    { id: "act-copy-ip", title: root.tr("Copy Attacker IP", "Copiar IP Atacante"), icon: "📋", badge: "Action", desc: root.attackerIp, action: function() { root.copyText(root.attackerIp) } },
    { id: "act-lang-en", title: "Language: English", icon: "🌐", badge: "Lang", desc: root.tr("Switch interface to English", "Mudar interface para inglês"), action: function() { root.language = "en" } },
    { id: "act-lang-pt", title: "Idioma: Português (Brasil)", icon: "🇧🇷", badge: "Lang", desc: root.tr("Switch interface to Brazilian Portuguese", "Mudar interface para Português do Brasil"), action: function() { root.language = "pt-BR" } }
  ]

  readonly property var filteredPaletteItems: {
    var q = root.paletteQuery.trim().toLowerCase()
    if (!q) return root.paletteCommands.slice(0, 12)
    var results = []
    for (var i = 0; i < root.paletteCommands.length; i++) {
      var item = root.paletteCommands[i]
      var hay = (item.title + " " + item.badge + " " + item.desc).toLowerCase()
      if (hay.indexOf(q) >= 0) results.push(item)
    }
    var pResults = P.searchPayloads(q, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
    for (var j = 0; j < Math.min(pResults.length, 10); j++) {
      var p = pResults[j]
      results.push({
        id: "payload-" + p.id,
        title: p.title,
        icon: p.icon || "󰯄",
        badge: p.categoryLabel,
        desc: p.purpose || p.description,
        code: p.code,
        action: (function(codeToCopy) {
          return function() { root.copyText(codeToCopy) }
        })(p.code)
      })
    }
    return results
  }

  function executePaletteItem(item) {
    if (!item) return
    if (item.action) item.action()
    else if (item.code) root.copyText(item.code)
    root.showPalette = false
  }

  // Hardening (marketplace security review): fixed absolute tool paths (no PATH
  // lookup), per-algorithm allowlist (no executable indirection), bounded input,
  // supervised timeout with kill fallback, capped output, cleanup on close.
  readonly property int hashTimeoutSec: 5
  readonly property int hashInputMax: 4096
  readonly property int hashOutputMax: 512

  function hashToolFor(algo) {
    if (algo === "sha1") return "/usr/bin/sha1sum"
    if (algo === "sha256") return "/usr/bin/sha256sum"
    if (algo === "sha512") return "/usr/bin/sha512sum"
    return "/usr/bin/md5sum"
  }

  function runHash() {
    var input = String(root.hashInput || "").slice(0, root.hashInputMax)
    if (!input) { root.hashOutput = ""; return }
    if (root.hashAlgo === "all") {
      hashProc.command = ["/usr/bin/timeout", "-k", "2", String(root.hashTimeoutSec),
        "/usr/bin/bash", "-c",
        'v="$1"; printf "MD5    "; printf %s "$v" | /usr/bin/md5sum | /usr/bin/cut -d" " -f1; printf "SHA1   "; printf %s "$v" | /usr/bin/sha1sum | /usr/bin/cut -d" " -f1; printf "SHA256 "; printf %s "$v" | /usr/bin/sha256sum | /usr/bin/cut -d" " -f1; printf "SHA512 "; printf %s "$v" | /usr/bin/sha512sum | /usr/bin/cut -d" " -f1; if [ -x /usr/bin/openssl ]; then printf "SM3    "; printf %s "$v" | /usr/bin/openssl dgst -sm3 | /usr/bin/awk "{print \\$NF}"; fi',
        "omahack-hash", input]
      hashTimer.restart()
      hashProc.running = true
      return
    }
    if (root.hashAlgo === "sm3") {
      hashProc.command = ["/usr/bin/timeout", "-k", "2", String(root.hashTimeoutSec),
        "/usr/bin/bash", "-c",
        'printf %s "$1" | /usr/bin/openssl dgst -sm3 | /usr/bin/awk "{print \\$NF}"',
        "omahack-hash", input]
      hashTimer.restart()
      hashProc.running = true
      return
    }
    var tool = hashToolFor(root.hashAlgo)
    hashProc.command = ["/usr/bin/timeout", "-k", "2", String(root.hashTimeoutSec),
      "/usr/bin/bash", "-c",
      'printf %s "$1" | ' + tool + ' | /usr/bin/cut -d" " -f1',
      "omahack-hash", input]
    hashTimer.restart()
    hashProc.running = true
  }

  Timer {
    id: copyTimer
    interval: 1600
    onTriggered: root.copiedMsg = ""
  }

  Process {
    id: hashProc
    running: false
    stdout: StdioCollector {
      waitForEnd: true
      onStreamFinished: {
        hashTimer.stop()
        root.hashOutput = String(text || "").trim().slice(0, root.hashOutputMax)
      }
    }
  }

  // Supervised timeout: kills a hung hash pipeline (timeout -k is the first
  // layer, this is the second).
  Timer {
    id: hashTimer
    interval: 6000
    repeat: false
    onTriggered: hashProc.running = false
  }

  // Preenche o IP com o target atual (~/.config/bin/target).
  // Hardening: caminho fixo (sem entrada do usuario), primeira linha ate 1 KiB,
  // conteudo validado por regex IPv4 antes de qualquer uso.
  FileView {
    path: root.home + "/.config/bin/target"
    watchChanges: false
    printErrors: false
    onLoaded: {
      var line = String(text || "").slice(0, 1024).split("\n")[0].trim().split(/\s+/)[0] || ""
      if (/^\d+\.\d+\.\d+\.\d+$/.test(line)) root.attackerIp = line
    }
  }

  // Monitora historico do clipboard do Omarchy.
  // Hardening: caminho fixo (sem entrada do usuario), leitura limitada a 256 KiB,
  // maximo 300 itens de ate 4 KiB cada como strings (limita render e copia).
  FileView {
    id: clipHistoryView
    path: root.home + "/.local/state/omarchy/clipboard-history.json"
    watchChanges: true
    printErrors: false
    onLoaded: {
      try {
        var raw = String(typeof text === "function" ? text() : text || "").slice(0, 262144)
        var parsed = JSON.parse(raw || "[]")
        if (!Array.isArray(parsed)) { root.clipHistory = []; return }
        root.clipHistory = parsed.slice(0, 300).map(function(e) { return String(e).slice(0, 4096) })
      } catch (e) {
        root.clipHistory = []
      }
    }
    onLoadFailed: root.clipHistory = []
    onFileChanged: reload()
  }

  BarIconButton {
    id: button
    anchors.fill: parent
    bar: root.bar
    text: "󰭼"
    tooltipText: "OmaHack"
    onPressed: root.toggle()
  }

  KeyboardPanel {
    id: panel
    anchorItem: button
    owner: root
    bar: root.bar
    open: root.opened
    contentWidth: panel.fittedContentWidth(Style.space(660))
    contentHeight: panel.fittedContentHeight(mainColumn.implicitHeight + Style.space(12), Style.space(720))

    onOpenChanged: {
      if (open) {
        root.showPalette = false
        root.keyboardNav = false
        root.selectedIndex = 0
      } else {
        hashTimer.stop()
        hashProc.running = false
      }
    }

    PanelKeyCatcher {
      id: keyCatcher
      anchors.fill: parent
      onCloseRequested: root.close()
      Keys.onPressed: function(event) {
        // Alt+K: Command palette (atalho global acima; este ramo e reserva)
        if (event.modifiers & Qt.AltModifier && event.key === Qt.Key_K) {
          root.showPalette = !root.showPalette
          root.paletteQuery = ""
          root.paletteIndex = 0
          if (root.showPalette) {
            Qt.callLater(function() { paletteField.forceActiveFocus() })
          }
          event.accepted = true
          return
        }

        // Palette keyboard navigation
        if (root.showPalette) {
          if (event.key === Qt.Key_Escape) {
            root.showPalette = false
            event.accepted = true
            return
          }
          if (event.key === Qt.Key_Down && root.filteredPaletteItems.length > 0) {
            root.paletteIndex = Math.min(root.paletteIndex + 1, root.filteredPaletteItems.length - 1)
            event.accepted = true
            return
          }
          if (event.key === Qt.Key_Up && root.filteredPaletteItems.length > 0) {
            root.paletteIndex = Math.max(root.paletteIndex - 1, 0)
            event.accepted = true
            return
          }
          if ((event.key === Qt.Key_Return || event.key === Qt.Key_Enter) && root.filteredPaletteItems.length > 0) {
            root.executePaletteItem(root.filteredPaletteItems[root.paletteIndex])
            event.accepted = true
            return
          }
        }

        // Back / Forward: Alt+Left or Ctrl+Left / Alt+Right or Ctrl+Right
        if ((event.modifiers & Qt.AltModifier || event.modifiers & Qt.ControlModifier) && event.key === Qt.Key_Left) {
          root.goBack()
          event.accepted = true
          return
        }
        if ((event.modifiers & Qt.AltModifier || event.modifiers & Qt.ControlModifier) && event.key === Qt.Key_Right) {
          root.goForward()
          event.accepted = true
          return
        }

        // Ctrl+D: Toggle Favorite
        if (event.modifiers & Qt.ControlModifier && event.key === Qt.Key_D) {
          var list = root.currentPayloadsList
          if (list && list.length > 0 && root.selectedIndex < list.length) {
            root.toggleFavorite(list[root.selectedIndex].code)
            event.accepted = true
            return
          }
        }

        // Main items arrow navigation
        if (event.key === Qt.Key_Down) {
          var count = root.currentPayloadsList.length
          if (count > 0) {
            root.keyboardNav = true
            root.selectedIndex = Math.min(root.selectedIndex + 1, count - 1)
            event.accepted = true
            return
          }
        }
        if (event.key === Qt.Key_Up) {
          var count = root.currentPayloadsList.length
          if (count > 0) {
            root.keyboardNav = true
            root.selectedIndex = Math.max(root.selectedIndex - 1, 0)
            event.accepted = true
            return
          }
        }

        // Return / Enter copies active payload
        if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
          var list = root.currentPayloadsList
          if (list && list.length > 0 && root.selectedIndex < list.length) {
            root.copyText(list[root.selectedIndex].code)
            event.accepted = true
            return
          }
        }

        // Escape closes search or panel
        if (event.key === Qt.Key_Escape) {
          if (root.searchText !== "") {
            root.searchText = ""
          } else {
            root.close()
          }
          event.accepted = true
          return
        }
      }
    }

    Item {
      id: contentContainer
      anchors.fill: parent

      Column {
        id: mainColumn
        width: parent.width
        spacing: Style.space(8)

        // ==========================================
        // CABECALHO FIXO (Fixed Header)
        // ==========================================
        Row {
          width: parent.width
          spacing: Style.space(8)

          // Back / Forward Buttons
          Row {
            spacing: Style.space(2)
            anchors.verticalCenter: parent.verticalCenter

            Rectangle {
              width: Style.space(24)
              height: Style.space(22)
              radius: Style.space(3)
              color: root.navIndex > 0 ? Style.selectionFillFor(root.bar.foreground, Color.accent) : "transparent"
              border.width: 1
              border.color: root.navIndex > 0 ? Color.accent : Color.popups.border
              opacity: root.navIndex > 0 ? 1.0 : 0.35
              Text {
                anchors.centerIn: parent
                text: "󰁍"
                color: root.navIndex > 0 ? Color.accent : root.bar.foreground
                font.family: root.bar.fontFamily
                font.pixelSize: Style.font.bodySmall
              }
              MouseArea {
                anchors.fill: parent
                enabled: root.navIndex > 0
                cursorShape: Qt.PointingHandCursor
                onClicked: root.goBack()
              }
            }

            Rectangle {
              width: Style.space(24)
              height: Style.space(22)
              radius: Style.space(3)
              color: root.navIndex < root.navHistory.length - 1 ? Style.selectionFillFor(root.bar.foreground, Color.accent) : "transparent"
              border.width: 1
              border.color: root.navIndex < root.navHistory.length - 1 ? Color.accent : Color.popups.border
              opacity: root.navIndex < root.navHistory.length - 1 ? 1.0 : 0.35
              Text {
                anchors.centerIn: parent
                text: "󰁔"
                color: root.navIndex < root.navHistory.length - 1 ? Color.accent : root.bar.foreground
                font.family: root.bar.fontFamily
                font.pixelSize: Style.font.bodySmall
              }
              MouseArea {
                anchors.fill: parent
                enabled: root.navIndex < root.navHistory.length - 1
                cursorShape: Qt.PointingHandCursor
                onClicked: root.goForward()
              }
            }
          }

          // Titulo e Status
          Row {
            spacing: Style.space(6)
            anchors.verticalCenter: parent.verticalCenter

            Text {
              text: "OmaHack"
              color: root.bar.foreground
              font.family: root.bar.fontFamily
              font.pixelSize: Style.font.title
              font.bold: true
            }

            Text {
              anchors.baseline: parent.children[0].baseline
              text: root.copiedMsg !== "" ? root.copiedMsg : ""
              color: Color.accent
              font.family: root.bar.fontFamily
              font.pixelSize: Style.font.caption
            }
          }
// Command palette trigger button (Alt+K)
          Rectangle {
            height: Style.space(22)
            width: paletteBtnText.implicitWidth + Style.space(12)
            radius: Style.space(3)
            color: root.showPalette ? Color.accent : Style.normalFillFor(root.bar.foreground, Color.accent)
            border.width: 1
            border.color: root.showPalette ? Color.accent : Color.popups.border
            anchors.verticalCenter: parent.verticalCenter
            Text {
              id: paletteBtnText
              anchors.centerIn: parent
              text: "󰘳 Alt+K"
              color: root.showPalette ? Color.background : root.bar.foreground
              font.family: root.bar.fontFamily
              font.pixelSize: Style.font.caption
              font.bold: true
            }
            MouseArea {
              anchors.fill: parent
              cursorShape: Qt.PointingHandCursor
              onClicked: {
                root.showPalette = !root.showPalette
                root.paletteQuery = ""
                root.paletteIndex = 0
                if (root.showPalette) paletteField.forceActiveFocus()
              }
            }
          }

          // Language toggle button (same size pattern as Alt+K)
          Rectangle {
            height: Style.space(22)
            width: langBtnText.implicitWidth + Style.space(12)
            radius: Style.space(3)
            color: langMouse.containsMouse ? Color.accent : Style.normalFillFor(root.bar.foreground, Color.accent)
            border.width: 1
            border.color: langMouse.containsMouse ? Color.accent : Color.popups.border
            anchors.verticalCenter: parent.verticalCenter
            Text {
              id: langBtnText
              anchors.centerIn: parent
              text: " " + (root.language === "en" ? "EN" : "PT")
              color: langMouse.containsMouse ? Color.background : root.bar.foreground
              font.family: root.bar.fontFamily
              font.pixelSize: Style.font.caption
              font.bold: true
            }
            MouseArea {
              id: langMouse
              anchors.fill: parent
              cursorShape: Qt.PointingHandCursor
              hoverEnabled: true
              onClicked: root.language = root.language === "en" ? "pt-BR" : "en"
            }
          }
        }

        // Search Input removido: pesquisa agora e so via paleta Alt+K
        // Parameters Bar (IP / Port / File / AD / Pivot)
        Row {
          width: parent.width
          spacing: Style.space(6)

          TextField {
            width: Style.space(180)
            placeholderText: "LHOST 10.10.10.10"
            text: root.attackerIp
            font.family: Style.font.family
            foreground: root.bar.foreground
            verticalPadding: Style.spacing.controlPaddingY
            onTextChanged: if (text !== root.attackerIp) root.attackerIp = text
          }
          TextField {
            width: Style.space(100)
            placeholderText: "LPORT 1337"
            text: root.attackerPort
            font.family: Style.font.family
            foreground: root.bar.foreground
            verticalPadding: Style.spacing.controlPaddingY
            onTextChanged: if (text !== root.attackerPort) root.attackerPort = text
          }
          TextField {
            width: parent.width - Style.space(180) - Style.space(100) - Style.space(12)
            placeholderText: root.tr("File (e.g. id_rsa)", "Arquivo (ex.: id_rsa)")
            text: root.fileName
            font.family: Style.font.family
            foreground: root.bar.foreground
            verticalPadding: Style.spacing.controlPaddingY
            onTextChanged: if (text !== root.fileName) root.fileName = text
          }
        }

        // Dominio / DC (so quando em AD ou busca)
        Row {
          visible: root.category === "ad" || (root.searchText !== "" && (root.searchText.indexOf("domain") >= 0 || root.searchText.indexOf("ad") >= 0))
          width: parent.width
          spacing: Style.space(6)
          TextField {
            width: Style.space(180)
            placeholderText: "Domain LAB.local"
            text: root.adDomain
            font.family: Style.font.family
            foreground: root.bar.foreground
            verticalPadding: Style.spacing.controlPaddingY
            onTextChanged: if (text !== root.adDomain) root.adDomain = text
          }
          TextField {
            width: Style.space(140)
            placeholderText: "User Administrator"
            text: root.adUser
            font.family: Style.font.family
            foreground: root.bar.foreground
            verticalPadding: Style.spacing.controlPaddingY
            onTextChanged: if (text !== root.adUser) root.adUser = text
          }
          TextField {
            width: parent.width - Style.space(180) - Style.space(140) - Style.space(12)
            placeholderText: "DC IP (empty = LHOST)"
            text: root.adDc
            font.family: Style.font.family
            foreground: root.bar.foreground
            verticalPadding: Style.spacing.controlPaddingY
            onTextChanged: if (text !== root.adDc) root.adDc = text
          }
        }

        // Pivot Subnet / Target (so quando em Pivot)
        Row {
          visible: root.category === "pivot"
          width: parent.width
          spacing: Style.space(6)
          TextField {
            width: (parent.width - Style.space(6)) / 2
            placeholderText: "Subnet 10.10.20.0/24"
            text: root.pivotNet
            font.family: Style.font.family
            foreground: root.bar.foreground
            verticalPadding: Style.spacing.controlPaddingY
            onTextChanged: if (text !== root.pivotNet) root.pivotNet = text
          }
          TextField {
            width: (parent.width - Style.space(6)) / 2
            placeholderText: "Target 10.10.20.10"
            text: root.pivotHost
            font.family: Style.font.family
            foreground: root.bar.foreground
            verticalPadding: Style.spacing.controlPaddingY
            onTextChanged: if (text !== root.pivotHost) root.pivotHost = text
          }
        }

        // ==========================================
        // BARRA DE MODULOS PRINCIPAIS
        // ==========================================
        Flow {
          width: parent.width
          spacing: Style.space(6)

          Button { text: root.tr("Web", "Web"); iconText: "󰖟"; selected: root.category === "web" && root.searchText === ""; bordered: root.category !== "web" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("web", "all") }
          Button { text: root.tr("Reverse", "Reverse"); iconText: "󰯄"; selected: root.category === "rev" && root.searchText === ""; bordered: root.category !== "rev" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("rev") }
          Button { text: root.tr("Linux", "Linux"); iconText: "󰌧"; selected: root.category === "linux" && root.searchText === ""; bordered: root.category !== "linux" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("linux", "all") }
          Button { text: root.tr("SQLi", "SQLi"); iconText: "󰆼"; selected: root.category === "sqli" && root.searchText === ""; bordered: root.category !== "sqli" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("sqli", "all") }
          Button { text: root.tr("Windows", "Windows"); iconText: "󰍲"; selected: root.category === "win" && root.searchText === ""; bordered: root.category !== "win" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("win") }
          Button { text: root.tr("AD", "AD"); iconText: "󰀂"; selected: root.category === "ad" && root.searchText === ""; bordered: root.category !== "ad" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("ad") }
          Button { text: root.tr("Pivot", "Pivot"); iconText: "󰑩"; selected: root.category === "pivot" && root.searchText === ""; bordered: root.category !== "pivot" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("pivot") }
          Button { text: root.tr("Transfer", "Transferência"); iconText: "󰇚"; selected: root.category === "transf" && root.searchText === ""; bordered: root.category !== "transf" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("transf") }
          Button { text: root.tr("Exfil", "Exfiltração"); iconText: "󰈎"; selected: root.category === "exfil" && root.searchText === ""; bordered: root.category !== "exfil" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("exfil") }
          Button { text: root.tr("RCE", "RCE"); iconText: "󰯂"; selected: root.category === "rce" && root.searchText === ""; bordered: root.category !== "rce" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("rce") }
          Button { text: root.tr("Cheatsheets", "Guias"); iconText: "󰚩"; selected: root.category === "cheats" && root.searchText === ""; bordered: root.category !== "cheats" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("cheats", "all") }
          Button { text: root.tr("Clipboard", "Clipboard") + (root.clipHistory.length > 0 ? (" (" + root.clipHistory.length + ")") : ""); iconText: "󰅍"; selected: root.category === "clipboard" && root.searchText === ""; bordered: root.category !== "clipboard" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("clipboard") }
          Button { text: root.tr("Favorites", "Favoritos") + (root.favorites.length > 0 ? (" (" + root.favorites.length + ")") : ""); iconText: "★"; selected: root.category === "favs" && root.searchText === ""; bordered: root.category !== "favs" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("favs") }
          Button { text: root.tr("Encode", "Codificar"); iconText: "󰉢"; selected: root.category === "cod" && root.searchText === ""; bordered: root.category !== "cod" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("cod") }
          Button { text: root.tr("Hash", "Hash"); iconText: "󰛲"; selected: root.category === "hash" && root.searchText === ""; bordered: root.category !== "hash" || root.searchText !== ""; fontSize: Style.font.bodySmall; onClicked: root.navigateTo("hash") }
        }

        // ==========================================
        // SUBCATEGORIAS DINAMICAS
        // ==========================================

        // Linux Subcategories
        Flow {
          visible: root.searchText === "" && root.category === "linux"
          width: parent.width
          spacing: Style.space(4)
          Button { text: root.tr("All", "Todos"); selected: root.linuxSubcat === "all"; bordered: root.linuxSubcat !== "all"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "all"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "SUID"; selected: root.linuxSubcat === "suid"; bordered: root.linuxSubcat !== "suid"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "suid"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "SGID"; selected: root.linuxSubcat === "sgid"; bordered: root.linuxSubcat !== "sgid"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "sgid"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: root.tr("Capabilities", "Capacidades"); selected: root.linuxSubcat === "capabilities"; bordered: root.linuxSubcat !== "capabilities"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "capabilities"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Cron"; selected: root.linuxSubcat === "cron"; bordered: root.linuxSubcat !== "cron"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "cron"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "PATH"; selected: root.linuxSubcat === "path"; bordered: root.linuxSubcat !== "path"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "path"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: root.tr("Writable", "Graváveis"); selected: root.linuxSubcat === "writable"; bordered: root.linuxSubcat !== "writable"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "writable"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "TTY"; selected: root.linuxSubcat === "tty"; bordered: root.linuxSubcat !== "tty"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "tty"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "SSH"; selected: root.linuxSubcat === "ssh"; bordered: root.linuxSubcat !== "ssh"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "ssh"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "SCP"; selected: root.linuxSubcat === "scp"; bordered: root.linuxSubcat !== "scp"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "scp"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Proxy"; selected: root.linuxSubcat === "proxy"; bordered: root.linuxSubcat !== "proxy"; fontSize: Style.font.caption; onClicked: { root.linuxSubcat = "proxy"; root.selectedIndex = 0; root.keyboardNav = false } }
        }

        // SQLi Subcategories & DBMS
        Flow {
          visible: root.searchText === "" && root.category === "sqli"
          width: parent.width
          spacing: Style.space(4)
          Button { text: root.tr("All", "Todos"); selected: root.sqliSubcat === "all"; bordered: root.sqliSubcat !== "all"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "all"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: root.tr("Auth", "Autenticação"); selected: root.sqliSubcat === "auth"; bordered: root.sqliSubcat !== "auth"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "auth"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: root.tr("Boolean", "Booleano"); selected: root.sqliSubcat === "boolean"; bordered: root.sqliSubcat !== "boolean"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "boolean"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "UNION"; selected: root.sqliSubcat === "union"; bordered: root.sqliSubcat !== "union"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "union"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: root.tr("Error", "Erro"); selected: root.sqliSubcat === "error"; bordered: root.sqliSubcat !== "error"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "error"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: root.tr("Time", "Tempo"); selected: root.sqliSubcat === "time"; bordered: root.sqliSubcat !== "time"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "time"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: root.tr("Comments", "Comentários"); selected: root.sqliSubcat === "comments"; bordered: root.sqliSubcat !== "comments"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "comments"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "MySQL"; selected: root.sqliSubcat === "mysql"; bordered: root.sqliSubcat !== "mysql"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "mysql"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "PostgreSQL"; selected: root.sqliSubcat === "postgres"; bordered: root.sqliSubcat !== "postgres"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "postgres"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "MSSQL"; selected: root.sqliSubcat === "mssql"; bordered: root.sqliSubcat !== "mssql"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "mssql"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "SQLite"; selected: root.sqliSubcat === "sqlite"; bordered: root.sqliSubcat !== "sqlite"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "sqlite"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "sqlmap"; selected: root.sqliSubcat === "sqlmap"; bordered: root.sqliSubcat !== "sqlmap"; fontSize: Style.font.caption; onClicked: { root.sqliSubcat = "sqlmap"; root.selectedIndex = 0; root.keyboardNav = false } }
        }

        // Web Subcategories
        Flow {
          visible: root.searchText === "" && root.category === "web"
          width: parent.width
          spacing: Style.space(4)
          Button { text: root.tr("All Web", "Toda Web"); selected: root.webSubcat === "all"; bordered: root.webSubcat !== "all"; fontSize: Style.font.caption; onClicked: { root.webSubcat = "all"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: root.tr("HTTP Headers", "Headers HTTP"); selected: root.webSubcat === "headers"; bordered: root.webSubcat !== "headers"; fontSize: Style.font.caption; onClicked: { root.webSubcat = "headers"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "SSTI"; selected: root.webSubcat === "ssti"; bordered: root.webSubcat !== "ssti"; fontSize: Style.font.caption; onClicked: { root.webSubcat = "ssti"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "RFI"; selected: root.webSubcat === "rfi"; bordered: root.webSubcat !== "rfi"; fontSize: Style.font.caption; onClicked: { root.webSubcat = "rfi"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Path Traversal"; selected: root.webSubcat === "traversal"; bordered: root.webSubcat !== "traversal"; fontSize: Style.font.caption; onClicked: { root.webSubcat = "traversal"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "CMD Injection"; selected: root.webSubcat === "cmdi"; bordered: root.webSubcat !== "cmdi"; fontSize: Style.font.caption; onClicked: { root.webSubcat = "cmdi"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "XSS"; selected: root.webSubcat === "xss"; bordered: root.webSubcat !== "xss"; fontSize: Style.font.caption; onClicked: { root.webSubcat = "xss"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "LFI"; selected: root.webSubcat === "lfi"; bordered: root.webSubcat !== "lfi"; fontSize: Style.font.caption; onClicked: { root.webSubcat = "lfi"; root.selectedIndex = 0; root.keyboardNav = false } }
        }

        // Cheatsheets Subcategories
        Flow {
          visible: root.searchText === "" && root.category === "cheats"
          width: parent.width
          spacing: Style.space(4)
          Button { text: root.tr("All", "Todos"); selected: root.cheatSubcat === "all"; bordered: root.cheatSubcat !== "all"; fontSize: Style.font.caption; onClicked: { root.cheatSubcat = "all"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Windows"; selected: root.cheatSubcat === "windows"; bordered: root.cheatSubcat !== "windows"; fontSize: Style.font.caption; onClicked: { root.cheatSubcat = "windows"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Active Directory"; selected: root.cheatSubcat === "ad"; bordered: root.cheatSubcat !== "ad"; fontSize: Style.font.caption; onClicked: { root.cheatSubcat = "ad"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Web"; selected: root.cheatSubcat === "web"; bordered: root.cheatSubcat !== "web"; fontSize: Style.font.caption; onClicked: { root.cheatSubcat = "web"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Docker"; selected: root.cheatSubcat === "docker"; bordered: root.cheatSubcat !== "docker"; fontSize: Style.font.caption; onClicked: { root.cheatSubcat = "docker"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Kubernetes"; selected: root.cheatSubcat === "kubernetes"; bordered: root.cheatSubcat !== "kubernetes"; fontSize: Style.font.caption; onClicked: { root.cheatSubcat = "kubernetes"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "AWS"; selected: root.cheatSubcat === "aws"; bordered: root.cheatSubcat !== "aws"; fontSize: Style.font.caption; onClicked: { root.cheatSubcat = "aws"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Azure"; selected: root.cheatSubcat === "azure"; bordered: root.cheatSubcat !== "azure"; fontSize: Style.font.caption; onClicked: { root.cheatSubcat = "azure"; root.selectedIndex = 0; root.keyboardNav = false } }
          Button { text: "Linux"; selected: root.cheatSubcat === "linux"; bordered: root.cheatSubcat !== "linux"; fontSize: Style.font.caption; onClicked: { root.cheatSubcat = "linux"; root.selectedIndex = 0; root.keyboardNav = false } }
        }

        // ==========================================
        // CONTEUDO ROLAVEL (Scrollable Payloads List)
        // ==========================================
        ScrollView {
          width: parent.width
          height: Style.space(420)
          clip: true
          ScrollBar.vertical.policy: ScrollBar.AsNeeded
          ScrollBar.horizontal.policy: ScrollBar.AlwaysOff

          Column {
            width: parent.width
            spacing: Style.space(8)

            // 1. RESULTADOS DA PESQUISA
            Column {
              visible: root.searchText.trim() !== ""
              width: parent.width
              spacing: Style.space(8)

              Row {
                width: parent.width
                spacing: Style.space(8)
                Text {
                  text: root.searchResults.length > 0
                        ? (root.searchResults.length + " " + root.tr("results for", "resultados para") + " \"" + root.searchText + "\"")
                        : root.tr("No results for", "Nenhum resultado para") + " \"" + root.searchText + "\""
                  color: root.searchResults.length > 0 ? Color.accent : Qt.darker(root.bar.foreground, 1.4)
                  font.family: root.bar.fontFamily
                  font.pixelSize: Style.font.caption
                  font.bold: true
                }
              }

              Repeater {
                model: root.searchResults
                PayloadCard {
                  title: modelData.title
                  code: modelData.code
                  iconText: modelData.icon || "󰯄"
                  badge: modelData.categoryLabel
                  context: modelData.context || ""
                  purpose: modelData.purpose || ""
                  description: modelData.description || ""
                  showUrl: modelData.showUrl
                  isSelected: root.keyboardNav && root.selectedIndex === index
                }
              }
            }

            // 2. WEB SECURITY
            Column {
              visible: root.searchText.trim() === "" && root.category === "web"
              width: parent.width
              spacing: Style.space(8)
              Repeater {
                model: P.getWebPayloads(root.webSubcat, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
                PayloadCard {
                  title: modelData.title
                  code: modelData.code
                  iconText: modelData.icon || "󰖟"
                  badge: modelData.categoryLabel
                  context: modelData.context || ""
                  purpose: modelData.purpose || ""
                  description: modelData.description || ""
                  showUrl: modelData.showUrl
                  isSelected: root.keyboardNav && root.selectedIndex === index
                }
              }
            }

            // 3. LINUX PRIVILEGE ESCALATION
            Column {
              visible: root.searchText.trim() === "" && root.category === "linux"
              width: parent.width
              spacing: Style.space(8)
              Repeater {
                model: P.getLinuxPayloads(root.linuxSubcat, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
                PayloadCard {
                  title: modelData.title
                  code: modelData.code
                  iconText: modelData.icon || "󰌧"
                  badge: modelData.categoryLabel
                  context: modelData.context || ""
                  purpose: modelData.purpose || ""
                  description: modelData.description || ""
                  showUrl: modelData.showUrl
                  isSelected: root.keyboardNav && root.selectedIndex === index
                }
              }
            }

            // 4. SQL INJECTION
            Column {
              visible: root.searchText.trim() === "" && root.category === "sqli"
              width: parent.width
              spacing: Style.space(8)
              Repeater {
                model: P.getSqliPayloads(root.sqliSubcat, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
                PayloadCard {
                  title: modelData.title
                  code: modelData.code
                  iconText: modelData.icon || "󰆼"
                  badge: modelData.categoryLabel
                  context: modelData.context || ""
                  purpose: modelData.purpose || ""
                  description: modelData.description || ""
                  showUrl: modelData.showUrl
                  isSelected: root.keyboardNav && root.selectedIndex === index
                }
              }
            }

            // 5. CHEATSHEETS
            Column {
              visible: root.searchText.trim() === "" && root.category === "cheats"
              width: parent.width
              spacing: Style.space(8)
              Repeater {
                model: P.getCheatsheets(root.cheatSubcat, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
                PayloadCard {
                  title: modelData.title
                  code: modelData.code
                  iconText: modelData.icon || "󰚩"
                  badge: modelData.categoryLabel
                  context: modelData.context || ""
                  purpose: modelData.purpose || ""
                  description: modelData.description || ""
                  showUrl: modelData.showUrl
                  isSelected: root.keyboardNav && root.selectedIndex === index
                }
              }
            }

            // 6. FAVORITOS (★)
            Column {
              visible: root.searchText.trim() === "" && root.category === "favs"
              width: parent.width
              spacing: Style.space(8)

              Rectangle {
                visible: root.favorites.length === 0
                width: parent.width
                height: Style.space(70)
                radius: Math.max(3, Style.cornerRadius)
                color: Style.normalFillFor(root.bar.foreground, Color.accent)
                border.width: 1
                border.color: Color.popups.border
                Column {
                  anchors.centerIn: parent
                  spacing: Style.space(4)
                  Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.tr("No favorites saved yet.", "Nenhum favorito salvo ainda.")
                    color: root.bar.foreground
                    font.family: root.bar.fontFamily
                    font.pixelSize: Style.font.bodySmall
                    font.bold: true
                  }
                  Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.tr("Click ★ or press Ctrl+D on any payload card to save it here.", "Clique em ★ ou pressione Ctrl+D em qualquer payload para salvá-lo aqui.")
                    color: Qt.darker(root.bar.foreground, 1.4)
                    font.family: root.bar.fontFamily
                    font.pixelSize: Style.font.caption
                  }
                }
              }

              Repeater {
                model: P.getFavorites(root.favorites, root.attackerIp, root.attackerPort, root.fileName, root.adDomain, root.adUser, root.dcEffective, root.pivotNet, root.pivotHost, root.language)
                PayloadCard {
                  title: modelData.title
                  code: modelData.code
                  iconText: modelData.icon || "★"
                  badge: modelData.categoryLabel
                  context: modelData.context || ""
                  purpose: modelData.purpose || ""
                  description: modelData.description || ""
                  showUrl: modelData.showUrl
                  isSelected: root.keyboardNav && root.selectedIndex === index
                }
              }
            }

            // 7. HISTORICO DO CLIPBOARD
            Column {
              visible: root.searchText.trim() === "" && root.category === "clipboard"
              width: parent.width
              spacing: Style.space(8)

              Row {
                width: parent.width
                spacing: Style.space(8)
                Text {
                  text: root.tr("Clipboard History", "Histórico do Clipboard") + " • " + root.filteredClipboard.length + " " + root.tr("items", "itens")
                  color: Color.accent
                  font.family: root.bar.fontFamily
                  font.pixelSize: Style.font.caption
                  font.bold: true
                }
              }

              Rectangle {
                visible: root.filteredClipboard.length === 0
                width: parent.width
                height: Style.space(64)
                radius: Math.max(3, Style.cornerRadius)
                color: Style.normalFillFor(root.bar.foreground, Color.accent)
                border.width: 1
                border.color: Color.popups.border
                Text {
                  anchors.centerIn: parent
                  text: root.tr("Clipboard history is empty.", "Histórico do clipboard está vazio.")
                  color: Qt.darker(root.bar.foreground, 1.4)
                  font.family: root.bar.fontFamily
                  font.pixelSize: Style.font.bodySmall
                }
              }

              Repeater {
                model: root.filteredClipboard
                Rectangle {
                  width: parent.width
                  height: Math.max(Style.space(54), clipCol.implicitHeight + Style.space(12))
                  radius: Math.max(2, Style.cornerRadius)
                  color: Style.normalFillFor(root.bar.foreground, Color.accent)
                  border.width: 1
                  border.color: Color.popups.border

                  Column {
                    id: clipCol
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: Style.space(6)
                    spacing: Style.space(4)

                    Row {
                      width: parent.width
                      spacing: Style.space(6)
                      Text {
                        text: "#" + (index + 1)
                        color: Color.accent
                        font.family: root.bar.fontFamily
                        font.pixelSize: Style.font.caption
                        font.bold: true
                      }
                      Text {
                        text: (String(modelData.text || "").length) + " " + root.tr("chars", "caracteres")
                        color: Qt.darker(root.bar.foreground, 1.5)
                        font.family: root.bar.fontFamily
                        font.pixelSize: Style.font.caption
                      }
Button {
                        text: root.tr("Copy", "Copiar")
                        iconText: ""
                        fontSize: Style.font.caption
                        onClicked: root.copyText(modelData.text)
                      }
                    }

                    Text {
                      textFormat: Text.PlainText
                      text: String(modelData.text || "").trim()
                      color: root.bar.foreground
                      font.family: Style.font.family
                      font.pixelSize: Style.font.bodySmall
                      wrapMode: Text.WrapAnywhere
                      maximumLineCount: 4
                      elide: Text.ElideRight
                      width: parent.width
                    }
                  }
                }
              }
            }

            // 8. REVERSE SHELLS
            Column {
              visible: root.searchText.trim() === "" && root.category === "rev"
              width: parent.width
              spacing: Style.space(8)
              PayloadCard { title: "Reverse Shell"; code: P.revSh(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 0 }
              PayloadCard { title: "Reverse Shell - Bash"; code: P.revBash(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 1 }
              PayloadCard { title: "Reverse Shell - Python"; code: P.revPython(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 2 }
              PayloadCard { title: "Reverse Shell - PHP"; code: P.revPhp(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 3 }
              PayloadCard { title: "Reverse Shell - Netcat"; code: P.revNcMkfifo(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 4 }
              PayloadCard { title: "Reverse Shell - Netcat -e"; code: P.revNcE(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 5 }
              PayloadCard { title: "Reverse Shell - PowerShell"; code: P.revPowershell(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 6 }
              PayloadCard { title: "Reverse Shell - Ruby"; code: P.revRuby(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 7 }
              PayloadCard { title: "Reverse Shell - Socat"; code: P.revSocat(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 8 }
              PayloadCard { title: "Reverse Shell - OpenSSL"; code: P.revOpenssl(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "Reverse"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 9 }
              PayloadCard { title: "Listener - nc"; code: P.listenerNc(root.attackerPort); iconText: "󰯄"; badge: "Listener"; isSelected: root.keyboardNav && root.selectedIndex === 10 }
              PayloadCard { title: "Listener - ncat SSL"; code: P.listenerNcatSSL(root.attackerPort); iconText: "󰯄"; badge: "Listener"; isSelected: root.keyboardNav && root.selectedIndex === 11 }
              PayloadCard { title: "Listener - socat TTY"; code: P.listenerSocatTTY(root.attackerPort); iconText: "󰯄"; badge: "Listener"; isSelected: root.keyboardNav && root.selectedIndex === 12 }
              PayloadCard { title: "MSFVenom - ELF"; code: P.msfvenomElf(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "MSF"; isSelected: root.keyboardNav && root.selectedIndex === 13 }
              PayloadCard { title: "MSFVenom - PHP"; code: P.msfvenomPhp(root.attackerIp, root.attackerPort); iconText: "󰯄"; badge: "MSF"; isSelected: root.keyboardNav && root.selectedIndex === 14 }
              PayloadCard { title: root.tr("Webshell - PHP minimal", "Webshell - PHP mínimo"); code: P.webshellPhpMin(); iconText: "󰯄"; badge: "Webshell"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 15 }
            }

            // 9. WINDOWS
            Column {
              visible: root.searchText.trim() === "" && root.category === "win"
              width: parent.width
              spacing: Style.space(8)
              Repeater {
                model: P.winEnum()
                PayloadCard { title: "Windows " + (index + 1); code: modelData; iconText: "󰍲"; badge: "Windows"; isSelected: root.keyboardNav && root.selectedIndex === index }
              }
            }

            // 10. ACTIVE DIRECTORY
            Column {
              visible: root.searchText.trim() === "" && root.category === "ad"
              width: parent.width
              spacing: Style.space(8)
              PayloadCard { title: root.tr("Discover DC via DNS SRV", "Descobrir DC via DNS SRV"); code: P.adNslookupSrv(root.adDomain); iconText: "󰀂"; badge: "AD"; isSelected: root.keyboardNav && root.selectedIndex === 0 }
              PayloadCard { title: root.tr("enum4linux-ng full", "enum4linux-ng tudo"); code: P.adEnum4linux(root.dcEffective); iconText: "󰀂"; badge: "AD"; isSelected: root.keyboardNav && root.selectedIndex === 1 }
              PayloadCard { title: root.tr("NetExec SMB null session", "NetExec SMB sessão nula"); code: P.adNxcSmbNull(root.dcEffective, root.adDomain); iconText: "󰀂"; badge: "AD"; isSelected: root.keyboardNav && root.selectedIndex === 2 }
              PayloadCard { title: "BloodHound (Linux)"; code: P.adBloodhoundPy(root.adDomain, root.adUser, root.dcEffective); iconText: "󰀂"; badge: "AD"; isSelected: root.keyboardNav && root.selectedIndex === 3 }
              PayloadCard { title: "kerbrute userenum"; code: P.adKerbruteUsers(root.adDomain, root.dcEffective); iconText: "󰀂"; badge: "AD"; isSelected: root.keyboardNav && root.selectedIndex === 4 }
              PayloadCard { title: "AS-REP roast GetNPUsers"; code: P.adGetNPUsers(root.adDomain, root.dcEffective); iconText: "󰀂"; badge: "AD"; isSelected: root.keyboardNav && root.selectedIndex === 5 }
              PayloadCard { title: "Kerberoast GetUserSPNs"; code: P.adGetUserSPNs(root.adDomain, root.adUser, root.dcEffective); iconText: "󰀂"; badge: "AD"; isSelected: root.keyboardNav && root.selectedIndex === 6 }
              PayloadCard { title: "evil-winrm PtH"; code: P.adEvilWinrmHash(root.dcEffective, root.adUser); iconText: "󰀂"; badge: "AD"; isSelected: root.keyboardNav && root.selectedIndex === 7 }
              PayloadCard { title: root.tr("remote secretsdump", "secretsdump remoto"); code: P.adSecretsdump(root.adDomain, root.adUser, root.dcEffective); iconText: "󰀂"; badge: "AD"; isSelected: root.keyboardNav && root.selectedIndex === 8 }
            }

            // 11. PIVOT
            Column {
              visible: root.searchText.trim() === "" && root.category === "pivot"
              width: parent.width
              spacing: Style.space(8)
              PayloadCard { title: "SSH -L local forward"; code: P.pivSshL(root.attackerIp, root.pivotHost); iconText: "󰑩"; badge: "Pivot"; isSelected: root.keyboardNav && root.selectedIndex === 0 }
              PayloadCard { title: "SSH -R remote forward"; code: P.pivSshR(root.attackerIp); iconText: "󰑩"; badge: "Pivot"; isSelected: root.keyboardNav && root.selectedIndex === 1 }
              PayloadCard { title: "SSH -D SOCKS"; code: P.pivSshD(root.attackerIp); iconText: "󰑩"; badge: "Pivot"; isSelected: root.keyboardNav && root.selectedIndex === 2 }
              PayloadCard { title: "Chisel server"; code: P.pivChiselServer(root.attackerPort); iconText: "󰑩"; badge: "Pivot"; isSelected: root.keyboardNav && root.selectedIndex === 3 }
              PayloadCard { title: "Chisel R:socks"; code: P.pivChiselSocks(root.attackerIp, root.attackerPort); iconText: "󰑩"; badge: "Pivot"; isSelected: root.keyboardNav && root.selectedIndex === 4 }
              PayloadCard { title: "Ligolo proxy"; code: P.pivLigoloProxy(); iconText: "󰑩"; badge: "Pivot"; isSelected: root.keyboardNav && root.selectedIndex === 5 }
              PayloadCard { title: "Ligolo agent"; code: P.pivLigoloAgent(root.attackerIp, root.attackerPort); iconText: "󰑩"; badge: "Pivot"; isSelected: root.keyboardNav && root.selectedIndex === 6 }
            }

            // 12. TRANSFER
            Column {
              visible: root.searchText.trim() === "" && root.category === "transf"
              width: parent.width
              spacing: Style.space(8)
              PayloadCard { title: root.tr("HTTP server (attacker)", "Servidor HTTP (atacante)"); code: P.transferServer(root.attackerPort); iconText: "󰇚"; badge: "Transfer"; isSelected: root.keyboardNav && root.selectedIndex === 0 }
              PayloadCard { title: root.tr("wget (victim)", "wget (vítima)"); code: P.transferWget(root.attackerIp, root.attackerPort, root.fileName); iconText: "󰇚"; badge: "Transfer"; isSelected: root.keyboardNav && root.selectedIndex === 1 }
              PayloadCard { title: root.tr("curl (victim)", "curl (vítima)"); code: P.transferCurl(root.attackerIp, root.attackerPort, root.fileName); iconText: "󰇚"; badge: "Transfer"; isSelected: root.keyboardNav && root.selectedIndex === 2 }
              PayloadCard { title: "Upload bash /dev/tcp"; code: P.transferBashUpload(root.attackerIp, root.attackerPort, root.fileName); iconText: "󰇚"; badge: "Transfer"; isSelected: root.keyboardNav && root.selectedIndex === 3 }
            }

            // 13. EXFIL
            Column {
              visible: root.searchText.trim() === "" && root.category === "exfil"
              width: parent.width
              spacing: Style.space(8)
              PayloadCard { title: "Exfil - curl POST"; code: P.exfilCurlFile(root.attackerIp, root.attackerPort, root.fileName); iconText: "󰈎"; badge: "Exfil"; isSelected: root.keyboardNav && root.selectedIndex === 0 }
              PayloadCard { title: root.tr("Exfil - nc < file", "Exfil - nc < arquivo"); code: P.exfilNcFile(root.attackerIp, root.attackerPort, root.fileName); iconText: "󰈎"; badge: "Exfil"; isSelected: root.keyboardNav && root.selectedIndex === 1 }
              PayloadCard { title: "Exfil - tar + nc"; code: P.exfilTarNc(root.attackerIp, root.attackerPort); iconText: "󰈎"; badge: "Exfil"; isSelected: root.keyboardNav && root.selectedIndex === 2 }
              PayloadCard { title: "Exfil - DNS dig"; code: P.exfilDns(root.fileName); iconText: "󰈎"; badge: "Exfil"; isSelected: root.keyboardNav && root.selectedIndex === 3 }
              PayloadCard { title: "Exfil - ICMP ping"; code: P.exfilPing(root.fileName); iconText: "󰈎"; badge: "Exfil"; isSelected: root.keyboardNav && root.selectedIndex === 4 }
            }

            // 14. RCE
            Column {
              visible: root.searchText.trim() === "" && root.category === "rce"
              width: parent.width
              spacing: Style.space(8)
              PayloadCard { title: root.tr("Separator ;", "Separador ;"); code: P.rceSemicolon("id"); iconText: "󰯂"; badge: "RCE"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 0 }
              PayloadCard { title: "Pipe |"; code: P.rcePipe("id"); iconText: "󰯂"; badge: "RCE"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 1 }
              PayloadCard { title: "Subshell $()"; code: P.rceSubshell("id"); iconText: "󰯂"; badge: "RCE"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 2 }
              PayloadCard { title: root.tr("Space bypass ${IFS}", "Bypass espaço ${IFS}"); code: "cat${IFS}/etc/passwd"; iconText: "󰯂"; badge: "RCE"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 3 }
              PayloadCard { title: "SSTI {{7*7}}"; code: P.rceSstiDetect(); iconText: "󰯂"; badge: "RCE"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 4 }
              PayloadCard { title: "SSTI Jinja2 popen"; code: P.rceSstiJinja(); iconText: "󰯂"; badge: "RCE"; showUrl: true; isSelected: root.keyboardNav && root.selectedIndex === 5 }
            }

            // 15. ENCODE / DECODE TOOL
            Column {
              visible: root.searchText.trim() === "" && root.category === "cod"
              width: parent.width
              spacing: Style.space(8)
              TextField {
                width: parent.width
                placeholderText: root.tr("Text to encode / decode...", "Texto para codificar / decodificar...")
                font.family: Style.font.family
                foreground: root.bar.foreground
                text: root.encodeInput
                onTextChanged: if (text !== root.encodeInput) root.encodeInput = text
              }
              Flow {
                width: parent.width
                spacing: Style.space(6)
                Button { text: "b64 Enc"; fontSize: Style.font.bodySmall; bordered: true; onClicked: root.encodeOutput = P.b64encode(root.encodeInput) }
                Button { text: "b64 Dec"; fontSize: Style.font.bodySmall; bordered: true; onClicked: root.encodeOutput = P.b64decode(root.encodeInput) }
                Button { text: "URL Enc"; fontSize: Style.font.bodySmall; bordered: true; onClicked: root.encodeOutput = P.urlEncode(root.encodeInput) }
                Button { text: "URL Dec"; fontSize: Style.font.bodySmall; bordered: true; onClicked: root.encodeOutput = P.urlDecode(root.encodeInput) }
                Button { text: "Hex Enc"; fontSize: Style.font.bodySmall; bordered: true; onClicked: root.encodeOutput = P.hexEncode(root.encodeInput) }
                Button { text: "Hex Dec"; fontSize: Style.font.bodySmall; bordered: true; onClicked: root.encodeOutput = P.hexDecode(root.encodeInput) }
                Button { text: "HTML"; fontSize: Style.font.bodySmall; bordered: true; onClicked: root.encodeOutput = P.htmlEncode(root.encodeInput) }
                Button { text: "Unicode"; fontSize: Style.font.bodySmall; bordered: true; onClicked: root.encodeOutput = P.unicodeEncode(root.encodeInput) }
                Button { text: root.tr("Clear", "Limpar"); fontSize: Style.font.bodySmall; onClicked: { root.encodeInput = ""; root.encodeOutput = "" } }
              }
              Rectangle {
                width: parent.width
                height: Math.max(Style.space(70), outText.implicitHeight + Style.space(16))
                radius: Math.max(2, Style.cornerRadius)
                color: Style.normalFillFor(root.bar.foreground, Color.accent)
                border.width: 1
                border.color: Color.popups.border
                Text {
                  id: outText
                  anchors.fill: parent
                  anchors.margins: Style.space(8)
                  textFormat: Text.PlainText
                  text: root.encodeOutput !== "" ? root.encodeOutput : root.tr("Result appears here", "O resultado aparece aqui")
                  color: root.encodeOutput !== "" ? root.bar.foreground : Qt.darker(root.bar.foreground, 1.6)
                  font.family: root.bar.fontFamily
                  font.pixelSize: Style.font.bodySmall
                  wrapMode: Text.WrapAnywhere
                }
              }
              Button { text: root.tr("Copy result", "Copiar resultado"); iconText: ""; fontSize: Style.font.bodySmall; onClicked: root.copyText(root.encodeOutput) }
            }

            // 16. HASH GENERATOR TOOL
            Column {
              visible: root.searchText.trim() === "" && root.category === "hash"
              width: parent.width
              spacing: Style.space(8)
              TextField {
                width: parent.width
                placeholderText: root.tr("Text to hash (e.g. secretpassword)", "Texto para hash (ex.: secretpassword)")
                font.family: Style.font.family
                foreground: root.bar.foreground
                text: root.hashInput
                onTextChanged: if (text !== root.hashInput) root.hashInput = text
              }
              Flow {
                width: parent.width
                spacing: Style.space(6)
                Button { text: "MD5"; selected: root.hashAlgo === "md5"; bordered: root.hashAlgo !== "md5"; fontSize: Style.font.bodySmall; onClicked: root.hashAlgo = "md5" }
                Button { text: "SHA1"; selected: root.hashAlgo === "sha1"; bordered: root.hashAlgo !== "sha1"; fontSize: Style.font.bodySmall; onClicked: root.hashAlgo = "sha1" }
                Button { text: "SHA256"; selected: root.hashAlgo === "sha256"; bordered: root.hashAlgo !== "sha256"; fontSize: Style.font.bodySmall; onClicked: root.hashAlgo = "sha256" }
                Button { text: "SHA512"; selected: root.hashAlgo === "sha512"; bordered: root.hashAlgo !== "sha512"; fontSize: Style.font.bodySmall; onClicked: root.hashAlgo = "sha512" }
                Button { text: "SM3"; selected: root.hashAlgo === "sm3"; bordered: root.hashAlgo !== "sm3"; fontSize: Style.font.bodySmall; onClicked: root.hashAlgo = "sm3" }
                Button { text: root.tr("All", "Todos"); selected: root.hashAlgo === "all"; bordered: root.hashAlgo !== "all"; fontSize: Style.font.bodySmall; onClicked: root.hashAlgo = "all" }
                Button { text: root.tr("# Get Hash", "# Gerar hash"); fontSize: Style.font.bodySmall; onClicked: root.runHash() }
              }
              Rectangle {
                width: parent.width
                height: Math.max(Style.space(50), hashText.implicitHeight + Style.space(16))
                radius: Math.max(2, Style.cornerRadius)
                color: Style.normalFillFor(root.bar.foreground, Color.accent)
                border.width: 1
                border.color: Color.popups.border
                Text {
                  id: hashText
                  anchors.fill: parent
                  anchors.margins: Style.space(8)
                  textFormat: Text.PlainText
                  text: root.hashOutput !== "" ? root.hashOutput : root.tr("Result appears here", "O resultado aparece aqui")
                  color: root.hashOutput !== "" ? root.bar.foreground : Qt.darker(root.bar.foreground, 1.6)
                  font.family: root.bar.fontFamily
                  font.pixelSize: Style.font.bodySmall
                  wrapMode: Text.WrapAnywhere
                }
              }
              Button { text: root.tr("Copy", "Copiar"); iconText: ""; fontSize: Style.font.bodySmall; onClicked: root.copyText(root.hashOutput) }
            }
          }
        }

        // ==========================================
        // FOOTER FIXO COM ATALHOS
        // ==========================================
        Row {
          width: parent.width
          spacing: Style.space(12)
          Text {
            textFormat: Text.PlainText
            text: root.tr("Alt+K Palette • ↑↓ Navigate • Enter Copy • Ctrl+D Fav • Esc Close", "Alt+K Paleta • ↑↓ Navegar • Enter Copiar • Ctrl+D Fav • Esc Fechar")
            color: Qt.darker(root.bar.foreground, 1.5)
            font.family: root.bar.fontFamily
            font.pixelSize: Style.font.caption
          }
        }
      }

      // ==========================================
      // COMMAND PALETTE OVERLAY (Alt+K)
      // ==========================================
      Rectangle {
        id: paletteOverlay
        visible: root.showPalette
        anchors.fill: parent
        color: Qt.rgba(0, 0, 0, 0.72)
        z: 100

        MouseArea {
          anchors.fill: parent
          onClicked: root.showPalette = false
        }

        Rectangle {
          width: parent.width - Style.space(40)
          height: Math.min(Style.space(480), parent.height - Style.space(30))
          anchors.centerIn: parent
          radius: Math.max(4, Style.cornerRadius)
          color: Color.background
          border.width: 2
          border.color: Color.accent

          MouseArea { anchors.fill: parent }

          Column {
            anchors.fill: parent
            anchors.margins: Style.space(10)
            spacing: Style.space(8)

            // Palette Header
            Row {
              width: parent.width
              spacing: Style.space(8)
              Text {
                text: "󰘳 " + root.tr("Command Palette", "Paleta de Comandos")
                color: Color.accent
                font.family: root.bar.fontFamily
                font.pixelSize: Style.font.body
                font.bold: true
              }
Text {
                text: "Esc " + root.tr("to close", "para fechar")
                color: Qt.darker(root.bar.foreground, 1.5)
                font.family: root.bar.fontFamily
                font.pixelSize: Style.font.caption
              }
            }

            // Palette Search Input
            TextField {
              id: paletteField
              width: parent.width
              placeholderText: root.tr("Type a module, technique or payload...", "Digite um módulo, técnica ou payload...")
              text: root.paletteQuery
              font.family: Style.font.family
              foreground: root.bar.foreground
              verticalPadding: Style.spacing.controlPaddingY
              onTextChanged: if (text !== root.paletteQuery) { root.paletteQuery = text; root.paletteIndex = 0 }
              Keys.onUpPressed: { root.paletteIndex = Math.max(root.paletteIndex - 1, 0) }
              Keys.onDownPressed: { root.paletteIndex = Math.min(root.paletteIndex + 1, root.filteredPaletteItems.length - 1) }
              Keys.onReturnPressed: { if (root.filteredPaletteItems.length > 0) root.executePaletteItem(root.filteredPaletteItems[root.paletteIndex]) }
              Keys.onEnterPressed: { if (root.filteredPaletteItems.length > 0) root.executePaletteItem(root.filteredPaletteItems[root.paletteIndex]) }
              Keys.onEscapePressed: { root.showPalette = false }
            }

            // Palette Results List
            ScrollView {
              width: parent.width
              height: parent.height - Style.space(80)
              clip: true
              ScrollBar.vertical.policy: ScrollBar.AsNeeded

              Column {
                width: parent.width
                spacing: Style.space(4)

                Repeater {
                  model: root.filteredPaletteItems
                  Rectangle {
                    width: parent.width
                    height: Style.space(42)
                    radius: Style.space(3)
                    color: root.paletteIndex === index ? Style.selectionFillFor(root.bar.foreground, Color.accent) : Style.normalFillFor(root.bar.foreground, Color.accent)
                    border.width: root.paletteIndex === index ? 1 : 0
                    border.color: Color.accent

                    Row {
                      anchors.fill: parent
                      anchors.margins: Style.space(6)
                      spacing: Style.space(8)

                      Text {
                        text: modelData.icon || "󰘳"
                        color: Color.accent
                        font.family: root.bar.fontFamily
                        font.pixelSize: Style.font.body
                        anchors.verticalCenter: parent.verticalCenter
                      }

                      Column {
                        width: parent.width - Style.space(90)
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: Style.space(1)
                        Text {
                          text: modelData.title
                          color: root.bar.foreground
                          font.family: root.bar.fontFamily
                          font.pixelSize: Style.font.bodySmall
                          font.bold: true
                          elide: Text.ElideRight
                          width: parent.width
                        }
                        Text {
                          text: modelData.desc || ""
                          color: Qt.darker(root.bar.foreground, 1.4)
                          font.family: root.bar.fontFamily
                          font.pixelSize: Style.font.caption
                          elide: Text.ElideRight
                          width: parent.width
                        }
                      }

                      Rectangle {
                        visible: modelData.badge !== ""
                        height: Style.space(16)
                        width: palBadge.implicitWidth + Style.space(8)
                        radius: Style.space(3)
                        color: Style.selectionFillFor(root.bar.foreground, Color.accent)
                        border.width: 1
                        border.color: Color.accent
                        anchors.verticalCenter: parent.verticalCenter
                        Text {
                          id: palBadge
                          anchors.centerIn: parent
                          text: modelData.badge
                          color: Color.accent
                          font.family: root.bar.fontFamily
                          font.pixelSize: Style.font.caption
                          font.bold: true
                        }
                      }
                    }

                    MouseArea {
                      anchors.fill: parent
                      hoverEnabled: true
                      cursorShape: Qt.PointingHandCursor
                      onEntered: root.paletteIndex = index
                      onClicked: root.executePaletteItem(modelData)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // ==========================================
  // COMPONENTE: PayloadCard
  // ==========================================
  component PayloadCard: Rectangle {
    id: card
    property string title: ""
    property string code: ""
    property bool showUrl: false
    property string iconText: ""
    property string badge: ""
    property string context: ""
    property string purpose: ""
    property string description: ""
    property bool isSelected: false

    width: parent.width
    implicitHeight: cardCol.implicitHeight + Style.space(14)
    radius: Math.max(3, Style.cornerRadius)
    color: Style.normalFillFor(root.bar.foreground, Color.accent)
    border.width: 0

    Column {
      id: cardCol
      anchors.left: parent.left
      anchors.right: parent.right
      anchors.top: parent.top
      anchors.margins: Style.space(8)
      spacing: Style.space(5)

      // Top Header: Icon + Title + Badge
      Row {
        width: parent.width
        spacing: Style.space(8)

        Text {
          visible: card.iconText !== ""
          text: card.iconText
          color: Color.accent
          font.family: root.bar.fontFamily
          font.pixelSize: Style.font.body
          anchors.verticalCenter: parent.verticalCenter
        }

        Text {
          textFormat: Text.PlainText
          text: card.title
          color: root.bar.foreground
          font.family: root.bar.fontFamily
          font.pixelSize: Style.font.body
          font.bold: true
          elide: Text.ElideRight
          width: Math.min(implicitWidth, parent.width - Style.space(140))
        }
Rectangle {
          visible: card.badge !== ""
          height: Style.space(18)
          width: badgeLabel.implicitWidth + Style.space(10)
          radius: Style.space(3)
          color: Style.selectionFillFor(root.bar.foreground, Color.accent)
          border.width: 1
          border.color: Color.accent
          anchors.verticalCenter: parent.verticalCenter
          Text {
            id: badgeLabel
            anchors.centerIn: parent
            text: card.badge
            color: Color.accent
            font.family: root.bar.fontFamily
            font.pixelSize: Style.font.caption
            font.bold: true
          }
        }
      }

      // Context & Purpose Fields
      Column {
        visible: card.context !== "" || card.purpose !== ""
        width: parent.width
        spacing: Style.space(2)

        Row {
          visible: card.context !== ""
          spacing: Style.space(6)
          Text {
            text: root.tr("Context:", "Contexto:")
            color: Color.accent
            font.family: root.bar.fontFamily
            font.pixelSize: Style.font.caption
            font.bold: true
          }
          Text {
            textFormat: Text.PlainText
            text: card.context
            color: root.bar.foreground
            font.family: root.bar.fontFamily
            font.pixelSize: Style.font.caption
            elide: Text.ElideRight
            width: cardCol.width - Style.space(90)
          }
        }

        Row {
          visible: card.purpose !== ""
          spacing: Style.space(6)
          Text {
            text: root.tr("Purpose:", "Finalidade:")
            color: Qt.lighter(Color.accent, 1.2)
            font.family: root.bar.fontFamily
            font.pixelSize: Style.font.caption
            font.bold: true
          }
          Text {
            textFormat: Text.PlainText
            text: card.purpose
            color: Qt.darker(root.bar.foreground, 1.25)
            font.family: root.bar.fontFamily
            font.pixelSize: Style.font.caption
            elide: Text.ElideRight
            width: cardCol.width - Style.space(90)
          }
        }
      }

      // Description Field
      Text {
        visible: card.description !== ""
        textFormat: Text.PlainText
        text: card.description
        color: Qt.darker(root.bar.foreground, 1.4)
        font.family: root.bar.fontFamily
        font.pixelSize: Style.font.caption
        wrapMode: Text.Wrap
        width: parent.width
      }

      // Code Box
      Rectangle {
        width: parent.width
        height: Math.max(Style.space(36), codeText.implicitHeight + Style.space(12))
        radius: Math.max(2, Style.cornerRadius)
        color: Qt.darker(Style.normalFillFor(root.bar.foreground, Color.accent), 1.2)
        border.width: 0
        Text {
          id: codeText
          anchors.fill: parent
          anchors.margins: Style.space(6)
          textFormat: Text.PlainText
          text: card.code
          color: root.bar.foreground
          font.family: Style.font.family
          font.pixelSize: Style.font.bodySmall
          wrapMode: Text.WrapAnywhere
        }
      }

      // Actions: Copy, Favorite, URL Encoded
      Row {
        spacing: Style.space(6)
        Button {
          text: root.tr("Copy", "Copiar")
          iconText: ""
          fontSize: Style.font.bodySmall
          onClicked: root.copyText(card.code)
        }
        Button {
          text: root.isFavorite(card.code) ? "★" : "☆"
          iconText: "󰓎"
          selected: root.isFavorite(card.code)
          fontSize: Style.font.bodySmall
          bordered: true
          onClicked: root.toggleFavorite(card.code)
        }
        Button {
          visible: card.showUrl
          text: root.tr("URL Encoded", "Codificado para URL")
          fontSize: Style.font.bodySmall
          bordered: true
          onClicked: root.copyText(P.urlEncode(card.code))
        }
      }
    }
  }
}
