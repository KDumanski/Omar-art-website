// Runs BEFORE first paint to set [data-theme] — prevents the flash of wrong theme.
// Honors saved choice, else system preference. Inlined in <head> via dangerouslySetInnerHTML.
export default function ThemeScript() {
  const code = `(function(){try{
    var s=localStorage.getItem('ft-theme');
    var sys=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
    var t=(s==='light'||s==='dark')?s:sys;
    document.documentElement.setAttribute('data-theme',t);
  }catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
