import { browser } from 'k6/experimental/browser';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

/*
MÉTRICAS IMPORTANTES:
https://dev.to/marlo2222/entendendo-as-metricas-do-k6-parte-3-m1g
    browser_web_vital_cls: medida do maior burst de pontuações de troca de layout para cada mudança inesperada que ocorre durante toda a vida útil de uma página.
    browser_web_vital_lcp: informa o tempo de renderização da maior imagem ou bloco de texto visível na janela de visualização em relação ao momento em que a página começou a ser carregada.
    browser_web_vital_fid: mede o tempo entre a primeira interação do usuário com uma página, até o momento em que o navegador consegue começar a processar manipuladores de eventos em resposta a essa interação.
*/



export const options = {
    scenarios: {
        ui: {
            executor: 'constant-vus',
            vus: 3,
            duration: '10s',
            options: {
                browser: {
                    type: 'chromium',
                },
            },
        },
    },
    thresholds: {
        checks: ['rate == 1.0'],
        browser_web_vital_fid: ["p(75) <= 100"],
        browser_web_vital_lcp: ["p(75) <= 2500"]
    },
    summaryTrendStats: ["min", "med", "avg", "max", "p(75)", "p(95)", "p(99)"]
};

export default async function () {
    const page = browser.newPage();

    try {
        await page.goto('https://test.k6.io/my_messages.php');

        page.locator('input[name="login"]').type('admin');
        page.locator('input[name="password"]').type('123');

        const submitButton = page.locator('input[type="submit"]');

        check(page, {
            LoginPage: (p) => p.locator('h2').textContent() == 'Unauthorized'
        });

        await Promise.all([submitButton.click(), page.waitForNavigation()]);

        check(page, {
            header: (p) => p.locator('h2').textContent() == 'Welcome, admin!',
        });

    } finally {
        page.close();
    }
}


export function handleSummary(data) {
    return {
        "index.html": htmlReport(data),
    };
}