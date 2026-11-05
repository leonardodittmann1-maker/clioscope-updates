import unittest, subprocess, time, urllib.request
from playwright.sync_api import sync_playwright

BASE='http://127.0.0.1:4173'
class AppSmoke(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server=subprocess.Popen(['python3','-m','http.server','4173','--bind','127.0.0.1','-d','dist'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        for _ in range(40):
            try:
                if urllib.request.urlopen(BASE,timeout=0.5).status==200: break
            except Exception: time.sleep(.15)
        cls.play=sync_playwright().start()
        cls.browser=cls.play.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    @classmethod
    def tearDownClass(cls):
        cls.browser.close();cls.play.stop();cls.server.terminate();cls.server.wait(timeout=5)
    def setUp(self):
        self.context=self.browser.new_context(accept_downloads=True)
        self.page=self.context.new_page()
        self.page.goto(BASE,wait_until='domcontentloaded')
        self.page.get_by_role('heading',name='Um passo por dia até o ENADE.').wait_for(timeout=8000)
    def tearDown(self): self.context.close()
    def test_aula_questao_e_recarregamento(self):
        p=self.page;p.get_by_role('button',name='Biblioteca de conteúdos').click()
        p.get_by_role('button',name='EE06 Circuitos elétricos e eletrônicos',exact=False).click()
        p.get_by_role('button',name='Estudar').first.click()
        p.get_by_text('1. Entenda o conceito').wait_for()
        p.get_by_role('button',name='Marcar aula como concluída').click()
        p.get_by_role('button',name='Praticar 4 questão(ões)').click()
        p.locator('input[name=learn-choice][value="1"]').check()
        p.get_by_role('button',name='Responder',exact=True).click()
        p.get_by_text('Resposta correta!',exact=False).wait_for()
        p.reload();p.get_by_role('button',name='Meu desempenho').click()
        self.assertIn('Respostas',p.locator('.cards').inner_text())
    def test_simulado_retomada_e_historico(self):
        p=self.page;p.get_by_role('button',name='Simulados').click()
        p.get_by_role('button',name='5 questões').click()
        p.locator('input[name="attempt-choice"]').first.check()
        p.get_by_role('button',name='← Sair e salvar').click()
        p.reload();p.get_by_role('button',name='Simulados').click()
        p.get_by_role('button',name='Retomar').click()
        self.assertEqual(p.locator('input[name=attempt-choice]:checked').count(),1)
        p.once('dialog',lambda dialog:dialog.accept())
        p.get_by_role('button',name='Finalizar simulado').click()
        p.get_by_role('heading',name='Resultado do simulado').wait_for()
    def test_discursiva_e_backup(self):
        p=self.page;p.get_by_role('button',name='Discursivas').click()
        p.locator('#discText').fill('Potência ativa e reativa e perdas I2R.')
        p.reload();p.get_by_role('button',name='Discursivas').click()
        self.assertIn('perdas',p.locator('#discText').input_value())
        p.get_by_role('button',name='Configurações e backup').click()
        with p.expect_download() as info:p.get_by_role('button',name='Exportar JSON').click()
        self.assertTrue(info.value.suggested_filename.startswith('enade-backup'))
    def test_mobile_sem_scroll_horizontal(self):
        self.context.close();self.context=self.browser.new_context(viewport={'width':390,'height':844},is_mobile=True,device_scale_factor=2,has_touch=True)
        p=self.context.new_page();p.goto(BASE)
        p.get_by_role('button',name='Abrir menu').click();p.get_by_role('button',name='Simulados').click()
        p.get_by_role('heading',name='Simulados').wait_for()
        self.assertTrue(p.evaluate('document.body.scrollWidth <= window.innerWidth+2'))
    def test_dez_secoes_navegaveis(self):
        p=self.page
        for text in ['Plano de estudos','Biblioteca de conteúdos','Banco de questões','Simulados','Discursivas','Tutor de estudos','Meu desempenho','Revisão de erros','Configurações e backup','Início']:
            p.get_by_role('button',name=text,exact=True).click()
            self.assertTrue(p.locator('.content').inner_text().strip())

if __name__=='__main__':unittest.main()
