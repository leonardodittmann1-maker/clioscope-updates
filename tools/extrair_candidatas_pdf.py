#!/usr/bin/env python3
"""Extrai candidatos à revisão; NUNCA publica questões automaticamente.

Uso: python tools/extrair_candidatas_pdf.py prova.pdf --saida candidatas.json
Requer PyMuPDF (fitz); essa dependência é apenas para o importador, não para o app.
"""
import argparse
import json
import re
import hashlib
from pathlib import Path

try:
    import fitz
except ImportError as exc:
    raise SystemExit('Instale PyMuPDF apenas se for importar um PDF: pip install pymupdf') from exc


def extract(pdf: Path):
    if not pdf.is_file() or pdf.suffix.lower() != '.pdf':
        raise ValueError('O arquivo deve ser um PDF existente')
    doc = fitz.open(pdf)
    output = []
    fingerprint = hashlib.sha256(pdf.read_bytes()).hexdigest()
    # Provas do Inep podem ter colunas, gráficos, símbolos e alternativas misturados.
    # A extração é aproximada e todos os itens exigem conferência visual por pessoa.
    for page_index, page in enumerate(doc):
        txt = page.get_text('text', sort=True)
        blocks = list(re.finditer(r'(?im)^\s*QUEST[ÃA]O\s+(\d{1,3})\s*$', txt))
        for i, match in enumerate(blocks):
            next_start = blocks[i + 1].start() if i + 1 < len(blocks) else len(txt)
            snippet = txt[match.end():next_start].strip()
            if len(snippet) > 10000:
                snippet = snippet[:10000]
            qid = f'PEND-{fingerprint[:10]}-P{page_index+1}-Q{int(match.group(1)):03d}'
            output.append({
                'id': qid,
                'question_number_reported': int(match.group(1)),
                'pdf_page': page_index + 1,
                'origin_pdf': str(pdf.name),
                'pdf_sha256': fingerprint,
                'raw_text_unverified': snippet,
                'graphics_or_images_on_page': len(page.get_images(full=True)),
                'flags': ['verificar enunciado, alternativas e gabarito em PDF oficial',
                          'conferir colunas, diagramas, símbolos e referências de imagem',
                          'respeitar direitos de reprodução'],
                'status': 'aguardando-revisao',
                'publishable': False,
                'verified_answer': None,
            })
    return {'source_file': pdf.name, 'sha256': fingerprint,
            'pdf_pages': len(doc), 'candidates_count': len(output),
            'notice': 'Não há gabaritos importados: todos os itens são candidatos à revisão visual antes da publicação.',
            'items': output}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('pdf', type=Path)
    ap.add_argument('--saida', type=Path, default=Path('candidatas.json'))
    args = ap.parse_args()
    result = extract(args.pdf)
    args.saida.parent.mkdir(parents=True,exist_ok=True)
    args.saida.write_text(json.dumps(result, ensure_ascii=False, indent=2),encoding='utf-8')
    print(f"Extração conservadora: {result['candidates_count']} candidatos em {result['pdf_pages']} páginas, todos pendentes. Arquivo: {args.saida}")

if __name__ == '__main__':
    main()
