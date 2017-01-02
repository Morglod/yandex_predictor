export default class FA extends React.Component {
	render() {
		const {
			name,
			scale,
			fixedWidth,
			listItem,
			border,
			spin,
			pulse,
			rotate,
			flip,
			stack,
			inverse,
			className,
			...props
		} = this.props;
		
		return 	<i className={[
					'fa',
					name && `fa-${name}`,
					!!scale && `fa-${scale}`,
					fixedWidth && 'fa-fw',
					listItem && 'fa-li',
					border && 'fa-border',
					spin && 'fa-spin',
					pulse && 'fa-pulse',
					rotate && `fa-rotate-${rotate}`,
					flip && `fa-flip-${flip}`,
					stack && (typeof stack === 'string' ? `fa-stack-${stack}x` : 'fa-stack'),
					inverse && 'fa-inverse',
					className
				]}
					{...props}
				/>
	}
}