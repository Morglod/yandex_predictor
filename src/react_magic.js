import React from 'react';

/*
	Вызывает коллбэк события из props компонента, если он существует.

	Например:
		_onOpen() {
			this.event('onOpen', 'ABC', 123);
		}

	То же самое что и:
		_onOpen() {
			const onOpen = this.props.onOpen;
			if(typeof onOpen === 'function') onOpen('ABC', 123);
		}
*/
React.Component.prototype.event = function(eventName, ...args) {
	const callback = this.props[eventName];
	if(typeof(callback) === 'function') callback(...args);
};

//-----------------

/*
    Code from MoUIBuilder

    morglod@gmail.com
*/

/*
	Переопределение функции рендера.
	Так мы можем изменять параметры любого элемента перед рендером.
*/
const ReactCreateElement = React.createElement;
React.createElement = function(type, props, children) {
	/*
		При указании имени класса, теперь можно передать массив из названий классов
		который будет автоматически за-join-ен.

		Пример:

		<div className={[
				baseClass, props.className,
				props.smth ? smthClass : notSmthClass,
				props.className || ''
			]}
		/>

		Позволяет гибко и при этом наглядно применять классы из родительского элемента
		или при определенных условиях.

		Если класс undefined или null, он пропускается.
	*/
	if(props && Array.isArray(props.className)) {
		arguments[1] = Object.assign({}, props, {
			className: props.className
								// Фильтруем от undefined, null итд
								.filter(Boolean) //  x => !!x
								.join(' ')}
		);
	}

	return ReactCreateElement.apply(this, arguments);
};

/*
    Биндит все функции компонентов по их именам, к этому компоненту.

    Пример:

    class Modal {
        constructor() {
            this.bindMethods(`open, close`);

             то же самое, что и

            this.open = this.open.bind(this);
            this.close = this.close.bind(this);
        }

        open() {}
        close() {}
    }
*/
React.Component.prototype.bindMethods = function (methodNames) {
    methodNames
        .replace(/\n|\s/g, '') // trim
        .replace(/,+/g, ',') // delete multi comma
        .replace(/,$/, '') // delete last comma if exist
        .split(',') // convert to array
        .forEach(name => {
            const error = 'React.Component.bindMethods for this method is failed';
            if (!(name in this)) console.warn(`Method ${name} is not in `, this, error);
            else if (typeof this[name] !== 'function') console.warn(`${name} is not a function in `, this, error);
            else this[name] = this[name].bind(this);
	});
};


//-----------------
