/**
 * EIA1-cards.js
 * =============
 * Script da tela de cards do EIA1.
 *
 * Responsabilidades:
 * - Registrar a navegação dos botões dos cards via `window.open`.
 * - Inicializar o carrossel (setas, dots, cálculo de deslocamento e resize).
 * - Executar transição de saída (A1Pro) e transição de entrada da página.
 */

/**
 * Vincula um botão a uma navegação na mesma aba, basicamente essa função serve para você generalizar
 * o window.open e poder ultilizado só mudando as variáveis de controle do mesmo.
 *
 * @param {string} buttonId - ID do botão no DOM.
 * @param {string} UrldeDestino - URL de destino.
 * @param {boolean} overlayDeUso - Se deve aplicar overlay de saída antes de navegar.
 * @returns {void}
 */
function abreJanelas(buttonId, UrldeDestino, overlayDeUso) {
	const button = document.getElementById(buttonId);
	if (!button) {
		return;
	}

	button.addEventListener('click', function (event) {
		event.preventDefault();

		if (overlayDeUso) {
			const exitOverlay = document.getElementById('page-exit-overlay');
			if (exitOverlay) {
				exitOverlay.classList.add('active');
				setTimeout(function () {
					window.open(UrldeDestino, '_self');
				}, 430);
				return;
			}
		}

		window.open(UrldeDestino, '_self');
	});
}

/**
 * Registra os handlers de navegação dos cards.
 *
 * @returns {void}
 */
function initCardActions() {
	abreJanelas('openTabelaBtn', '/app/tabela/tabelaco/', false);
	abreJanelas('openA1ProBtn', '/app/eletrica/a1pro/', true);
	abreJanelas('openA1ProConfigBtn', '/app/eletrica/a1pro/configDevs/', false);
	abreJanelas('openCalcCabosConfigBtn', '/app/eletrica/a1pro/configDevs/', false);
	abreJanelas('openCalcCabosBtn', '/app/calc_cabos/IntermediaCalcCabos/', false);
	abreJanelas('openListaMateriaisBtn', '/app/eletrica/a1pro/ListaMateriasDiv.html/', false);
	abreJanelas('openA1ControlBtn', '/app/automation/a1control/', false);
	abreJanelas('openInstrumentationBtn', '/app/instrumentation/', false);
	abreJanelas('openEngenhariaBtn', '/app/engenharia/', false);
	abreJanelas('openSgqBtn', '/app/sgq/', false);
	abreJanelas('openPmoBtn', '/app/pmo/', false);
}

/**
 * Inicializa o carrossel de cards com paginação e navegação.
 *
 * @returns {void}
 */
function initCardsCarousel() {
	const container = document.querySelector('.brand-block > div');
	const prevBtn = document.getElementById('prevPage');
	const nextBtn = document.getElementById('nextPage');
	const dotsWrap = document.getElementById('pagerDots');
	if (!container || !prevBtn || !nextBtn || !dotsWrap) {
		return;
	}

	const cards = Array.from(container.children);
	if (!cards.length) {
		return;
	}

	const track = document.createElement('div');
	track.className = 'carousel-track';
	const computedGap = getComputedStyle(container).gap || container.style.gap || '24px';
	track.style.gap = computedGap;

	cards.forEach(card => {
		card.classList.add('carousel-card');
		track.appendChild(card);
	});

	container.innerHTML = '';
	container.classList.add('carousel-root');
	container.appendChild(track);

	const pageSize = 3;
	const totalPages = Math.max(1, Math.ceil(cards.length / pageSize));
	let page = 0;

	/**
	 * Constrói os dots da paginação.
	 *
	 * @returns {void}
	 */
	function buildDots() {
		dotsWrap.innerHTML = '';
		for (let i = 0; i < totalPages; i++) {
			const dot = document.createElement('button');
			dot.type = 'button';
			dot.className = 'dot';
			dot.setAttribute('role', 'tab');
			dot.setAttribute('aria-label', `Página ${i + 1}`);
			dot.addEventListener('click', () => goTo(i));
			dotsWrap.appendChild(dot);
		}
	}

	/**
	 * Calcula deslocamento horizontal da trilha para a página informada.
	 *
	 * @param {number} targetPage - Índice da página alvo.
	 * @returns {number} Distância em pixels para aplicar no translateX.
	 */
	function calcOffset(targetPage) {
		const first = track.querySelector('.carousel-card');
		if (!first) {
			return 0;
		}

		const width = first.offsetWidth;
		const gap = parseFloat(getComputedStyle(track).gap) || 0;
		return targetPage * pageSize * (width + gap);
	}

	/**
	 * Atualiza UI do carrossel (posição e estado de paginação).
	 *
	 * @returns {void}
	 */
	function render() {
		track.style.transform = `translateX(-${calcOffset(page)}px)`;
		prevBtn.disabled = page === 0;
		nextBtn.disabled = page >= totalPages - 1;

		dotsWrap.querySelectorAll('.dot').forEach((dot, index) => {
			if (index === page) {
				dot.setAttribute('aria-current', 'true');
			} else {
				dot.removeAttribute('aria-current');
			}
		});
	}

	/**
	 * Navega para a página indicada.
	 *
	 * @param {number} index - Índice da página desejada.
	 * @returns {void}
	 */
	function goTo(index) {
		page = ((index % totalPages) + totalPages) % totalPages;
		render();
	}

	prevBtn.addEventListener('click', event => {
		event.preventDefault();
		goTo(page - 1);
	});

	nextBtn.addEventListener('click', event => {
		event.preventDefault();
		goTo(page + 1);
	});

	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(render, 120);
	});

	buildDots();
	render();
}

/**
 * Executa a animação de entrada da página.
 *
 * @returns {void}
 */
function initPageEnterTransition() {
	const overlay = document.getElementById('page-enter-overlay');
	const layout = document.querySelector('.login-layout');
	if (!overlay || !layout) {
		return;
	}

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			overlay.classList.add('done');
			layout.classList.add('visible');
			overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
		});
	});
}

initCardActions();
initCardsCarousel();
initPageEnterTransition();
