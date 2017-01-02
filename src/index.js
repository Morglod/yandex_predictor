import './react_magic.js';
import YandexPredictor from './yandex_predictor'

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(<YandexPredictor />, document.getElementById('content'));