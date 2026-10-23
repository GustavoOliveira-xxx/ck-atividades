import json
import re
import sys
import threading
import functools
import http.server
from pathlib import Path
from urllib.parse import quote

from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

PASTA = Path(__file__).resolve().parent
SAIDA = PASTA / "relatorio-revisao-interfaces-web-ii.pdf"
PORTA = 8799

def servidor():
    manipulador = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(PASTA))
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORTA), manipulador)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

def imprimir(pagina, url, destino):
    pagina.goto(url, wait_until="load")
    pagina.wait_for_selector("body[data-pronto='1']")
    pagina.pdf(path=str(destino), prefer_css_page_size=True, print_background=True)

def normalizar(texto):
    return re.sub(r"\s+", " ", texto).strip().upper()

def main():
    srv = servidor()
    base = f"http://127.0.0.1:{PORTA}/relatorio.html"
    capa = PASTA / "_capa.pdf"
    corpo = PASTA / "_corpo.pdf"

    with sync_playwright() as p:
        navegador = p.chromium.launch()
        pagina = navegador.new_page()
        imprimir(pagina, base + "?modo=capa", capa)
        imprimir(pagina, base + "?modo=corpo", corpo)
        itens = pagina.evaluate("window.ITENS_SUMARIO")

        textos = [normalizar(pg.extract_text() or "") for pg in PdfReader(str(corpo)).pages]
        paginas = {}
        for item in itens:
            chave = normalizar(item)[:40]
            for indice, texto in enumerate(textos):
                if indice < 2:
                    continue
                if chave in texto:
                    paginas[item] = indice + 1
                    break
        faltando = [i for i in itens if i not in paginas]
        if faltando:
            print("Títulos não encontrados:", faltando, file=sys.stderr)

        imprimir(pagina, base + "?modo=corpo&paginas=" + quote(json.dumps(paginas)), corpo)
        navegador.close()

    escritor = PdfWriter()
    for arquivo in (capa, corpo):
        for pg in PdfReader(str(arquivo)).pages:
            escritor.add_page(pg)
    escritor.add_metadata({
        "/Title": "Atividade de Revisão de Interfaces Web II",
        "/Author": "Gustavo Oliveira dos Santos",
        "/Subject": "JavaScript, jQuery e DOM; IA e Segurança Digital",
    })
    with open(SAIDA, "wb") as saida:
        escritor.write(saida)

    capa.unlink()
    corpo.unlink()
    srv.shutdown()
    print(f"PDF gerado: {SAIDA.name} ({len(PdfReader(str(SAIDA)).pages)} páginas)")
    print(json.dumps(paginas, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
