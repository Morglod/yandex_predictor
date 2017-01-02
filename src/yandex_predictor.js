import styles from './yandex_predictor.m.css';
import { FA } from 'blocks';

// Yandex API
// Ключ можно получить на https://tech.yandex.ru/predictor/
window.API_KEY = 'pdct.1.1.20170102T055849Z.165adc5fea946b68.46ae1dc381d9a6efbf7e5fd958d4f50d6e93185b';
const API_URL = (words, lang, limit) => `https://predictor.yandex.net/api/v1/predict.json/complete?key=${window.API_KEY}&q=${encodeURIComponent(words)}&lang=${lang}&limit=${limit}`

const KEY_UP = 38,
	  KEY_DOWN = 40,
	  KEY_ENTER = 13;

// Простая утилита для обращения к api
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText || '{text: [], endOfWord: false, pos: 0}'));
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

const Btn = ({fa, children}) => <div className={styles.btn}><FA name={fa} /> {children}</div>

export default class YandexPredictor extends React.Component {
	constructor() {
		super();
		
		this.state = {
			// Варианты продолжения текста
			prediction: [],
			// Отступ от конца текста. Предположения начинаются с этого отступа
			predictionPos: 0,
			// Выбранное пользователем предположение
			selectedPrediction: 0,
			// Таймаут перед обращением к API
			timer: null,
			// Флаг, пустое ли поле ввода
			isInputBlank: true
		};
		
		this.bindMethods(`
			getPrediction,
			selectPrediction,
			focusInput,
			handleInput,
			handleKeyPress
		`);
	}
	
	render() {
		const { isInputBlank, timer, selectedPrediction, prediction } = this.state;
		
		return 	<div className={styles.page}>
					<div className={styles.advert}>Реализовано с помощью сервиса «Яндекс.Предиктор» <a href="https://tech.yandex.ru/predictor/">https://tech.yandex.ru/predictor/</a></div>
					<div className={styles.yandex_predictor}>
						<div
							onClick={() => this.focusInput()}
							className={[styles.inputBox, !isInputBlank && styles.hasInput]}
						>
							<div
								ref="input"
								className={[styles.input, isInputBlank && styles.placeholder]}
								onInput={evt => this.handleInput(evt.target.innerText)}
								onKeyDown={this.handleKeyPress}
								contentEditable
							/>
							<FA
								name="spinner"
								spin
								className={[styles.spinner, !isInputBlank && timer && styles.visible]}
							/>
						</div>
						<div className={styles.prediction_list}>{
							prediction.map((x,i) =>
								<div className={[styles.prediction, (selectedPrediction === i) && styles.selected]} key={i}>{x}</div>
							)
						}</div>
						<div className={[styles.help, prediction.length !== 0 && styles.visible]}>
							Используйте стрелки <Btn fa="arrow-circle-up">Вверх</Btn> и <Btn fa="arrow-circle-down">Вниз</Btn>, а затем <Btn fa="sign-in">Enter</Btn> для использования подсказки.
						</div>
					</div>
				</div>
	}
	
	handleKeyPress(evt) {
		const { keyCode } = evt;
		let { selectedPrediction } = this.state;
		
		if(keyCode === KEY_UP) selectedPrediction--;
		else if(keyCode === KEY_DOWN) selectedPrediction++;
		else if(keyCode === KEY_ENTER && this.state.prediction.length !== 0) this.selectPrediction();
		else return;
		evt.preventDefault();
		
		// Нормализовать значение в промежутке [0, кол-во предположений]
		selectedPrediction = Math.max(0, Math.min(selectedPrediction, this.state.prediction.length-1));
		
		this.setState({
			selectedPrediction
		})
	}
	
	selectPrediction() {
		const text = this.state.prediction[this.state.selectedPrediction];
		const input = ReactDOM.findDOMNode(this.refs.input);
		const { predictionPos } = this.state;
		
		// Дополнить текст выбранным предположением
		if(predictionPos === 0)
			input.innerText += text;
		else if(predictionPos > 0)
			input.innerText += ' ' + text;
		else {
			const words = input.innerText.split(' ');
			const last_word = words[words.length-1];
			delete words[words.length-1];
			input.innerText = [...words, last_word.substr(0, last_word.length + predictionPos) + text].join(' ');
		}
		
		this.focusInput(true);
		this.setState({prediction: []})
	}
	
	handleInput(input) {
		this.setState({isInputBlank: (input.length === 0 || input === '\n')})
		
		if(this.state.timer) clearTimeout(this.state.timer);
		this.setState({
			timer: setTimeout(() => {
				this.getPrediction(input)
				this.setState({timer: null})
			}, 200)
		});
	}
	
	getPrediction(words, lang='ru', limit=10) {
		httpGetAsync(API_URL(words, lang, limit), data => {
			const { text, endOfWord, pos } = data;
			this.setState({
				prediction: text,
				predictionPos: pos,
				selectedPrediction: 0
			});
		});
	}
	
	focusInput(toEnd = false) {
		const input = ReactDOM.findDOMNode(this.refs.input);
		if(document.activeElement === input && !toEnd) return;
		
		const selection = window.getSelection();
		selection.removeAllRanges();
		var range = document.createRange();
		range.selectNodeContents(input);
		selection.addRange(range);
		selection.collapseToEnd();
		input.focus();
	}
}