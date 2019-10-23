function FindProxyForURL(url, host) {
  let domains = {
    "google.com": 1,
    "google.hk": 1,
    "google.co.kr": 1,
    "google.jp": 1,
    "google.com.hk": 1,
    "google.com.sg": 1,
    "google.co.jp": 1,
    "gmail.com": 1,
    "gstatic.com": 1,
    "googleusercontent.com": 1,
    "youtu.be": 1,
    "youtube.com": 1,
    "ytimg.com": 1,
    "googlevideo.com": 1,
    "ggpht.com": 1,
    "youtube-nocookie.com": 1,
    "googleadservices.com": 1,
    "googleapis.com": 1,
    "googleartproject.com": 1,
    "googleblog.com": 1,
    "googlebot.com": 1,
    "googlechinawebmaster.com": 1,
    "googlecode.com": 1,
    "googlecommerce.com": 1,
    "googledomains.com": 1,
    "googlearth.com": 1,
    "googleearth.com": 1,
    "googledrive.com": 1,
    "googlegroups.com": 1,
    "googlehosted.com": 1,
    "googleideas.com": 1,
    "googleinsidesearch.com": 1,
    "googlelabs.com": 1,
    "googlemail.com": 1,
    "googlemashups.com": 1,
    "googlepagecreator.com": 1,
    "googlescholar.com": 1,
    "googlesource.com": 1,
    "googlesyndication.com": 1,
    "googleweblight.com": 1,
    "googlezip.net": 1,
    "gvt0.com": 1,
    "gvt1.com": 1,
    "gvt2.com": 1,
    "gvt3.com": 1,
    "youtubeeducation.com": 1,
    "youtubegaming.com": 1,
    "yt.be": 1,
    "zynamics.com": 1,
    "android.com": 1,
    "twimg.com": 1,
    "twitter.com": 1,
    "fbcdn.net": 1,
    "facebook.com": 1,
    "facebook.net": 1,
    "wikimedia.org": 1,
    "pinterest.com": 1,
    "accountkit.com": 1,
    "pinimg.com": 1,
    "wikipedia.org": 1,
    "ipip.net": 1,
    "golang.org": 1,
    "freenet.pro": 1,
    "appspot.com": 1,
    "chromium.org": 1,
    "google-analytics.com": 1,
    "doubleclick.net": 1,
    "googletagmanager.com": 1,
    "t.co": 1,
    "goo.gl": 1,
    "you.tb": 1,
    "telegram.me": 1,
    "t.me": 1,
    "telegram.org": 1,
    "blogspot.com": 1,
    "blogger.com": 1,
    "chrome.com": 1
  };
  let p = {
    y: "SOCKS5 y.kuomu.xyz:1443;SOCKS5 123.125.115.110:1443;",
    b: "SOCKS5 b.kuomu.xyz:1443;SOCKS5 144.202.99.26:1443;",
    g: "SOCKS5 g.kuomu.xyz:1443;SOCKS5 144.202.99.26:1443;",
    ini: "SOCKS5 ini.kuomu.xyz:1443;SOCKS5 123.125.115.110:1443;",
  }
  let direct = "DIRECT;";
  let hasOwnProperty = Object.hasOwnProperty;
  let suffix;
  let pos = host.lastIndexOf(".");
  if (url.substring(0, 6) !== "https:") {
    return direct
  }
  while (1) {
    suffix = host.substring(pos + 1);
    if (suffix === "youtube.com") {
      return p.y
    }
    if (suffix === "blogspot.com" || suffix === "blogger.com") {
      return p.b
    }
    if (suffix === "google.com" || suffix === "chrome.com") {
      return p.g
    }
    if (hasOwnProperty.call(domains, suffix)) {
      return p.ini
    }
    if (pos <= 0) {
      break;
    }
    pos = host.lastIndexOf(".", pos - 1);
  }
  return direct;
}