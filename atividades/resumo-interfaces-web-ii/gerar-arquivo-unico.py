import base64
import re
from pathlib import Path

PASTA = Path(__file__).resolve().parent
SAIDA = PASTA / "revisao-interfaces-web-ii.html"

def ler(caminho):
    return (PASTA / caminho).read_text(encoding="utf-8")

def script(conteudo):
    return "<script>\n" + conteudo.replace("</script", "<\\/script") + "\n</script>"

html = ler("index.html")
logo = "data:image/webp;base64," + base64.b64encode((PASTA / "assets/logo-ck.webp").read_bytes()).decode()

html = html.replace('<link rel="stylesheet" href="css/estilo.css">', "<style>\n" + ler("css/estilo.css") + "\n</style>")
html = html.replace('src="assets/logo-ck.webp"', f'src="{logo}"').replace('href="assets/logo-ck.webp"', f'href="{logo}"')

inicio = html.index('  <script src="js/dados.js"></script>')
fim = html.index('  <script src="js/cena.js"></script>') + len('  <script src="js/cena.js"></script>')
blocos = [
    script(ler("js/dados.js")),
    script(ler("js/vendor/jquery-3.7.1.min.js")),
    script(ler("js/laboratorio.js")),
    script(ler("js/app.js")),
    script(ler("js/cena.js")),
]
html = html[:inicio] + "\n".join(blocos) + html[fim:]

ACERVO = "https://gustavooliveira-xxx.github.io/ck-atividades/"
html = html.replace('href="../../index.html"', f'href="{ACERVO}"')
html = html.replace('href="relatorio-revisao-interfaces-web-ii.pdf"',
                    f'href="{ACERVO}atividades/resumo-interfaces-web-ii/relatorio-revisao-interfaces-web-ii.pdf"')

assert not re.search(r'src="(css|js|assets)/', html), "ficou algum arquivo externo"
SAIDA.write_text(html, encoding="utf-8")
print(f"Gerado: {SAIDA.name} ({SAIDA.stat().st_size // 1024} KB)")
